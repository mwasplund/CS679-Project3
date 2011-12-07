function setup() {
    for (var i = 0; i < 50; i++) {
        pushEnemy(makeSimpleEnemy());
    }

    setupWalls();
}

var walls;
function getWalls() {
    return walls;
}
function clearWalls() {
    walls = [];
}

function setupWalls() {
    clearWalls();

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
}

function getWallBucketsFromLine(begin, end) {
	return [0];
}

function getWallBucket(idx) {
	return getWalls();
}

function pushWalls(w) {
    walls = walls.concat(w);
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
    return ret;
}

function getOptions() {
    return {
        playerVelocity: 0.8,
        keyUpWaitMax: 30,
    };
}

