<<<<<<< HEAD
function setup() {
    for (var i = 0; i < 1; i += 0.05) {
        pushEnemy(makeEnemy(i));
    }
}

function pushEnemy(e) {
    enemies.push(e);
}

function getOptions() {
    return {
        playerVelocity: 0.8,
        keyUpWaitMax: 30,
    };
}

function makeEnemy(v) {
    return {
        v: v,
        radius: 4,
        position: [0, 0],
        move: function() {
            this.v += 0.00005;
            this.updatePosition();
        },
        updatePosition: function() {
            var d = 250;
            this.position = [
                d * Math.cos(Math.PI * 2 * this.v),
                d * Math.sin(Math.PI * 2 * this.v),
            ];
        },
        draw: drawCircle,
        fillStyle: "#111166",
        drawSelected: function() {
            var ctx = target.context;
            ctx.strokeStyle = "#888888";
            ctx.translate(this.position[0], this.position[1]);
            ctx.beginPath();
            ctx.arc(0, 0, this.radius + 2, 0, Math.PI*2, true); 
            ctx.closePath();
            ctx.stroke();
        },
    };
}
=======
function setup() {
    for (var i = 0; i < 250; i++) {
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

>>>>>>> 26c48ecddf664051298530a771984e5367c5af72
