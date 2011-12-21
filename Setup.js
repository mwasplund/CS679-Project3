var shouldReset;
var currentLevel;
function setup() {
	currentLevel = currentLevel || 0;
	loadLevel(getLevels()[currentLevel]);
	// Add 3d Models to sceen
	SceneModels.push(Loader.GetModel("Ground"));
}

function normalizeCoord(c) {
	return Math.round(c / 4) * 6;
}

function normalizeCoords(objs) {
	var mem = ["xStart", "yStart", "xFinish", "yFinish", "xLoc", "yLoc"];
	for (var i = 0; i < objs.length; i++) {
		var o = objs[i];
		for (var j = 0; j < mem.length; j++) {
			var m = mem[j];
			if (o[m]) {
				o[m] = normalizeCoord(o[m]);
			}
		}
	}
}

function calcBounds(objs) {
	var xvals = ["xStart", "xFinish", "xLoc"];
	var yvals = ["yStart", "yFinish", "yLoc"];
	var bounds = [[300, 300], [300, 300]];
	for (var i = 0; i < objs.length; i++) {
		var o = objs[i];
		for (var j = 0; j < xvals.length; j++) {
			var x = xvals[j];
			var y = yvals[j];
			if (o[x]) {
				bounds[0][0] = Math.min(bounds[0][0], o[x]);
				bounds[1][0] = Math.max(bounds[1][0], o[x]);
			}
			if (o[y]) {
				bounds[0][1] = Math.min(bounds[0][1], o[y]);
				bounds[1][1] = Math.max(bounds[1][1], o[y]);
			}
		}
	}
	bounds[0][0] -= 100;
	bounds[0][1] -= 100;
	bounds[1][0] += 100;
	bounds[1][1] += 100;
	return bounds;
}


var levelBounds;
function loadLevel(levelFunc) {
	clear();
	var objs = levelFunc();
	normalizeCoords(objs);
	var bounds = calcBounds(objs);
	levelBounds = bounds;
	initializeEntityBuckets(bounds, 40, 40);
	initializeWallBuckets(bounds, 100, 100);
	pushWall(makeWall([bounds[0][0] + 100, bounds[0][1] + 100], [bounds[1][0] - 100, bounds[0][1] + 100]));
	pushWall(makeWall([bounds[1][0] - 100, bounds[0][1] + 100], [bounds[1][0] - 100, bounds[1][1] - 100]));
	pushWall(makeWall([bounds[1][0] - 100, bounds[1][1] - 100], [bounds[0][0] + 100, bounds[1][1] - 100]));
	pushWall(makeWall([bounds[0][0] + 100, bounds[1][1] - 100], [bounds[0][0] + 100, bounds[0][1] + 100]));

	for (var i = 0; i < objs.length; i++) {
		var o = objs[i];
		if (o.id == "player") {
			initializePlayer(Loader.GetModel("goodGuyWalkTextured"), [2, 2, 2], 0, [0,20,0], [o.xLoc, o.yLoc]);
			Debug.info("Player: " + o.xLoc + "," + o.yLoc);
		}
	}

	for (var i = 0; i < objs.length; i++) {
		var o = objs[i];
		switch(o.id) {
			case "wall":
				pushWall(makeWall([o.xStart, o.yStart], [o.xFinish, o.yFinish]));
				Debug.info("Wall: " + o.xStart + "," + o.yStart + " " + o.xFinish + " " + o.yFinish);
				break;
			case "enemy":
				makeEnemiesFromProto(o);
				Debug.info("Enemy: " + o.xLoc + "," + o.yLoc);
				break;
			case "player":
				break;
			case "end":
				makeLevelEnd(o.xLoc, o.yLoc);
				break;
			default:
				Debug.error("Unrecognized object id: " + o.id);
				break;
		}
	}
}

var endEmitterParams = {
	numParticles: 2000,
	lifeTime: 6,
	timeRange: 6,
	startSize: 6,
	endSize: 12,
	velocity:[0, 0, 0],
	velocityRange: [20, 1, 20],
	position: [0, 50, 0],
	positionRange: [20, 0, 20],
	worldAcceleration: [0, -6, 0],
	spinSpeedRange: 4
};
function getEndEmitter() {
	var emitter = particleSystem.createParticleEmitter();
	emitter.setState(tdl.particles.ParticleStateIds.ADD);
	emitter.setColorRamp(
			[1, 0, 0, 1,
			0, 1, 0, 1,
			0, 0, 1, 1,
			0, 1, 0, 1,
			1, 0, 0, 1,
			0, 0, 0, 0.25,
			0, 0, 0, 0]);
	emitter.setParameters(endEmitterParams);
	return emitter;
}
var levelEnd;
function makeLevelEnd(x, y) {
	levelEnd = {};
	levelEnd.position = [x, y];
	endEmitterParams.position[0] = x;
	endEmitterParams.position[2] = y;
	levelEnd.emitter = getEndEmitter();
	levelEnd.check = function() {
		this.message = null;
		var players = getPlayers();
		var plInEnd = 0;
		for (var i = 0; i < players.length; i++) {
			if (dist2(player.position, levelEnd.position) < 60) plInEnd++;
		}
		var enemies = getEnemiesInCircle(this.position, 300);
		var pos = this.position;
		enemies = enemies.filter(function(e) {
				return !intersectPathWalls(e.position, pos, 0);
				});
		var enNearEnd = enemies.length;

		if (plInEnd == 0) return false;
		if (enNearEnd > 0) {
			this.message = "You must kill all nearby enemies before ending the level";
			return false;
		}
		if (plInEnd < players.length) {
			this.message = "Some players are missing..."
			return false;
		}
		return true;
	}
	levelEnd.message = null;
	levelEnd.lastBreath = function() {
		particleSystem.removeEmitter(this.emitter);
	}
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
    shouldReset = false;
	if (levelEnd && levelEnd.lastBreath) {
		levelEnd.lastBreath();
	}
	levelEnd = null;
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
    var Height = 40;
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
		var drawDist = 300;
		var p = getLocalPlayer();
		if (dist2(this.pts[0], p.position) > drawDist &&
				!intersectLineCircle([this.pts[0], this.pts[1]], [p.position, 300])) {
			return;
		}

		gl.enableVertexAttribArray(CurrentShader.Program.vertexPositionAttribute);
		gl.enableVertexAttribArray(CurrentShader.Program.vertexNormalAttribute);
		gl.enableVertexAttribArray(CurrentShader.Program.textureCoordAttribute);
		this.mesh.Draw();
		gl.disableVertexAttribArray(CurrentShader.Program.vertexPositionAttribute);
		gl.disableVertexAttribArray(CurrentShader.Program.vertexNormalAttribute);
		gl.disableVertexAttribArray(CurrentShader.Program.textureCoordAttribute);
    };
    
    ret.pts = [pt0.slice(0), pt1.slice(0)];
    ret.draw = function(ctx) {
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

var options;
function getOptions() {
	if (!options) {
		initializeOptions();
	}
	return options;
}
function initializeOptions(force) {
	if (options && !force) return;
    options =  {
        playerVelocity: 3.3,
        keyUpWaitMax: 30,

		hudHeight: 0.13,
		hudHeightBounds: [0, 0.4],
		hudHeightStep: 0.01,
    };
	options.enforceBounds = function(str, report) {
		var bds = this[str + "Bounds"];
		if (this[str] == undefined || bds == undefined) {
			if (report) {
				Debug.error("value or valueBounds does not exist");
			}
			return;
		}
		this[str] = Math.min(bds[1], Math.max(bds[0], this[str]));
	}
	options.increment = function(str) {
		var step = this[str + "Step"];
		if (this[str] == undefined || step == undefined) {
			Debug.error("value or valueStep does not exist");
			return;
		}
		this.setValue(str, this[str] + step, true);
	}
	options.decrement = function(str) {
		var step = this[str + "Step"];
		if (this[str] == undefined || step == undefined) {
			Debug.error("value or valueStep does not exist");
			return;
		}
		this.setValue(str, this[str] - step, true);
	}
	options.setValue = function(str, val, report) {
		if (this[str] == undefined) {
			if (report) {
				Debug.error("(" + str + ") does not exist.");
			}
			return;
		}
		this[str] = val;
		this.enforceBounds(str, false);
		if (this[str + "Listener"]) this[str + "Listener"]();
	}
}

function getBucketsFromRectOff(p0, p1) {
    var lo = [Math.min(p0[0], p1[0]) - 1, Math.min(p0[1], p1[1]) - 1];
    var hi = [Math.max(p0[0], p1[0]) + 1, Math.max(p0[1], p1[1]) + 1];

    var ret = [];
    for (var x = lo[0]; x <= hi[0]; x++) {
        for (var y = lo[1]; y <= hi[1]; y++) {
            ret.push([x, y]);
        }
    }
    return ret;
}

function getBucketsFromPoint(pt) {
	return getBucketsFromRectOff(this.bucketIdx(pt), this.bucketIdx(pt));
}
function getBucketsFromRect(p0, p1) {
    return getBucketsFromRectOff(this.bucketIdx(p0), this.bucketIdx(p1));
}

function getBucketsFromLine(begin, end) {
    var ret = [];
    var lIdx = this.bucketIdx(begin);
    var hIdx = this.bucketIdx(end);
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

