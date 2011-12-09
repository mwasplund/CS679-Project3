function setup() {
	clear();
    initializeEntityBuckets([[-1200, -1200], [1200, 1200]], 40, 40);
    initializeWallBuckets([[-1200, -1200], [1200, 1200]], 100, 100);
    for (var i = 0; i < 50; i++) {
        addEnemy(makeSpiderEnemy());
    }

    setupWalls();

    initializePlayer(Loader.GetModel("goodGuyWalk"), [2, 2, 2]);
}

var walls;
function getWalls() {
    return walls;
}
function clearWalls() {
	wallBuckets = null;
    walls = [];
}


function clearEntities() {
	enemies = [];
	player = null;
	entityBuckets = null;
}
	
function clear() {
	clearWalls();
	clearEntities();
}
function setupWalls() {

    var poly = [];
    poly.push([-1000, -1000]);
    poly.push([-1000, 1000]);
    poly.push([1000, 1000]);
    poly.push([1000, -1000]);
    poly.push([-1000, -1000]);

    pushWalls(makePolyWall(poly));

    for (var x = -1; x <= 1; x += 2) {
        for (var y = -1; y <= 1; y += 2) {
            poly = [];
            poly.push([x * 500 - 100, y * 500 - 100]);
            poly.push([x * 500 + 100, y * 500 - 100]);
            poly.push([x * 500 + 100, y * 500 + 100]);
            poly.push([x * 500 - 100, y * 500 + 100]);
            poly.push([x * 500 - 100, y * 500 - 100]);
            pushWalls(makePolyWall(poly));
        }
    }
}

function pushWall(w) {
    walls.push(w);
    wallBuckets.add(w);
}

function pushWalls(w) {
    for (var i = 0; i < w.length; i++) {
        pushWall(w[i]);
    }
}

function makePolyWall(poly) {
    var ret = [];
    for (var i = 1; i < poly.length; i++) {
        ret.push(makeWall(poly[i - 1], poly[i]));
    }
    return ret;
}

function makeWall(pt0, pt1) {
    var ret = {};
    
    // Make a 3d version of this wall
    var Dir = vec3.normalize([pt0[0] - pt1[0], 0, pt0[1] - pt1[1]]);
    var Right = vec3.normalize(vec3.cross(Dir, [0,1,0]));
    var Height = 10;
    var Indices = [1,0,4,1,5,4,
                   1,0,2,1,2,3,
                   3,2,6,3,6,7,
                   7,6,4,7,4,5,
                   1,5,7,1,7,3];
    
    var Vertices = [pt0[0]+Right[0], 0,      pt0[1]+Right[2],
                    pt0[0]+Right[0], Height, pt0[1]+Right[2],
                    pt0[0]-Right[0], 0,      pt0[1]-Right[2],
                    pt0[0]-Right[0], Height, pt0[1]-Right[2],
 
                    pt1[0]+Right[0], 0,      pt1[1]+Right[2],
                    pt1[0]+Right[0], Height, pt1[1]+Right[2],
                    pt1[0]-Right[0], 0,      pt1[1]-Right[2],
                    pt1[0]-Right[0], Height, pt1[1]-Right[2]
                   ];
                   
   var Normals   = [Right[0],0,Right[2],
                    Right[0],0,Right[2],
                    Right[0],0,Right[2],
                    Right[0],0,Right[2],
                    Right[0],0,Right[2],
                    Right[0],0,Right[2],

                    -Dir[0],0,-Dir[2],
                    -Dir[0],0,-Dir[2],
                    -Dir[0],0,-Dir[2],
                    -Dir[0],0,-Dir[2],
                    -Dir[0],0,-Dir[2],
                    -Dir[0],0,-Dir[2],

                    -Right[0],0,-Right[2],
                    -Right[0],0,-Right[2],
                    -Right[0],0,-Right[2],
                    -Right[0],0,-Right[2],
                    -Right[0],0,-Right[2],
                    -Right[0],0,-Right[2],

                     Dir[0],0,Dir[2],
                     Dir[0],0,Dir[2],
                     Dir[0],0,Dir[2],
                     Dir[0],0,Dir[2],
                     Dir[0],0,Dir[2],
                     Dir[0],0,Dir[2],

                     0,1,0,
                     0,1,0,
                     0,1,0,
                     0,1,0,
                     0,1,0,
                     0,1,0
                   ];
                   
    var Geometry = {TriangleIndices: Indices,
                    Vertices: Vertices,
                    TriangleNormals: Normals
                    };
                    
    var FakeModel = {Geometry: Geometry,
                    Properties: new Array(),
                    Children: new Array()};
                    
    ret.mesh = new Mesh(FakeModel ,null);
    ret.drawGL = function()
    {
      this.mesh.Draw();
    };
    
    ret.pts = [pt0.slice(0), pt1.slice(0)];
    ret.draw = function() {
        var ctx = target.context;
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(this.pts[0][0], this.pts[0][1]);
        ctx.lineTo(this.pts[1][0], this.pts[1][1]);
        ctx.closePath();
        ctx.stroke();
    };
	ret.normal = pt0[0] == pt1[0] ? [1, 0] : [0, 1];
	ret.isWall = true;
    return ret;
}

function getOptions() {
    return {
        playerVelocity: 3.3,
        keyUpWaitMax: 30,
    };
}

function getBucketsFromRectOff(p0, p1) {
    var lo = [Math.min(p0[0], p1[0]), Math.min(p0[1], p1[1])];
    var hi = [Math.max(p0[0], p1[0]), Math.max(p0[1], p1[1])];

    var ret = [];
    for (var x = lo[0]; x <= hi[0]; x++) {
        for (var y = lo[1]; y <= hi[1]; y++) {
            ret.push([x, y]);
        }
    }
    return ret;
}

function getBucketsFromPoint(pt) {
	var off = [1, 1];
	return getBucketsFromRectOff(sub2(this.bucketIdx(pt), off), add2(this.bucketIdx(pt), off));
}
function getBucketsFromRect(p0, p1) {
    return getBucketsFromRectOff(this.bucketIdx(p0), this.bucketIdx(p1));
}

function getBucketsFromLine(begin, end) {
    var ret = [];
    var lIdx = this.bucketIdx(begin);
    var hIdx = this.bucketIdx(end);
    lIdx = add2(lIdx, [-1, -1]);
    hIdx = add2(hIdx, [1, 1]);
    var cIdx = lIdx.slice(0);
    return getBucketsFromRectOff(lIdx, hIdx);
}

var wallBuckets;
function initializeWallBuckets(bounds, width, height) {
    if (!width) width = 100;
    if (!height) height = width;

    wallBuckets = {};
    wallBuckets.bounds = bounds;
    wallBuckets.offset = bounds[0];
    wallBuckets.bucketWidth = width;
    wallBuckets.bucketHeight = height;

    wallBuckets.getBucketsFromLine = getBucketsFromLine;
    wallBuckets.getBucketsFromRect = getBucketsFromRect;
    wallBuckets.getBucketsFromPoint = getBucketsFromPoint;

    wallBuckets.bucketIdxOff = bucketIdxOff;
    wallBuckets.getBucket = getBucket;

    wallBuckets.width = Math.ceil((bounds[1][0] - bounds[0][0] + 1) / width);
    wallBuckets.height = Math.ceil((bounds[1][1] - bounds[0][1] + 1) / height);
    var buckets = [];
    for (var x = 0; x < wallBuckets.width; x++) {
        buckets.push([]);
        for (var y = 0; y < wallBuckets.height; y++) {
            buckets[x].push([]);
        }
    }
    buckets.push([[]]);
    wallBuckets.buckets = buckets;

    wallBuckets.bucketIdx = function(pos) {
        return this.bucketIdxOff(sub2(pos, this.offset));
    }
    wallBuckets.add = function(w) {
        var pts = w.pts;
        var bIdx = this.bucketIdx(pts[0]);
        var eIdx = this.bucketIdx(pts[1]);
        var b = getBucketsFromRectOff(bIdx, eIdx);
        for (var i = 0; i < b.length; i++) {
            var bucket = this.getBucket(b[i]);
            bucket.push(w);
        }
    }
}
function bucketIdxOff(offPos) {
    var idx = [Math.floor(offPos[0] / this.bucketWidth), Math.floor(offPos[1] / this.bucketHeight)];
    idx[0] = Math.min(this.width - 1, Math.max(0, idx[0]));
    idx[1] = Math.min(this.height - 1, Math.max(0, idx[1]));
    return idx;
}
function getBucket(idx) {
    var i = idx.slice(0);
    i[0] = Math.min(this.width - 1, Math.max(0, i[0]));
    i[1] = Math.min(this.height - 1, Math.max(0, i[1]));
    return this.buckets[i[0]][i[1]];
}

var entityBuckets;
function initializeEntityBuckets(bounds, width, height) {
    if (!width) width = 60;
    if (!height) height = width;

    entityBuckets = {};
    entityBuckets.bounds = bounds;
    entityBuckets.offset = bounds[0];
    entityBuckets.bucketWidth = width;
    entityBuckets.bucketHeight = height;

    entityBuckets.getBucketsFromLine = getBucketsFromLine;
    entityBuckets.getBucketsFromRect = getBucketsFromRect;
    entityBuckets.getBucketsFromPoint = getBucketsFromPoint;

    entityBuckets.width = Math.ceil((bounds[1][0] - bounds[0][0]) / width);
    entityBuckets.height = Math.ceil((bounds[1][1] - bounds[0][1]) / height);
    var buckets = [];
    for (var x = 0; x < entityBuckets.width; x++) {
        buckets.push([]);
        for (var y = 0; y < entityBuckets.height; y++) {
            buckets[x].push([]);
        }
    }
    buckets.push([[]]);
    entityBuckets.specialIdx = [entityBuckets.width, 0];
    entityBuckets.buckets = buckets;

    entityBuckets.bucketIdxOff = bucketIdxOff;
    entityBuckets.getBucket = getBucket;

    entityBuckets.bucketIdx = function(pos) {
        return this.bucketIdxOff(sub2(pos, this.offset));
    }
    entityBuckets.add = function(e) {
        var pos = e.position;
        var idx = this.bucketIdx(pos);
        var bucket = this.getBucket(idx);
        bucket.push(e);
        e.entityBucketIdx = idx.concat([bucket.length - 1]);
    }
    entityBuckets.remove = function(e) {
        var idx = e.entityBucketIdx;
        var bucket = this.getBucket(idx);
        var back = bucket[bucket.length - 1];

        bucket[idx[2]] = back;
        back.entityBucketIdx[2] = idx[2];
        bucket.pop();

        e.entityBucketIdx = null;
    }
}

