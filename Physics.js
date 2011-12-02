function update() {
	movePhase();
	actionPhase();
	cleanupPhase();
}

function movePhase() {
    var enemies = getEnemies();
    for (var i = 0; i < enemies.length; i++) {
        var e = enemies[i];
        e.think();
        processEffects(e);
        e.move();
    }

    var players = getPlayers();
    for (var i = 0; i < players.length; i++) {
        var pl = players[i];
        pl.think();
        processEffects(pl);
        pl.move();
    }

	getCamera().move();
}

function processEffects(ent) {

}

function actionPhase() {
}

function cleanupPhase() {
}

// If an object on the path will intersect the line
// then return [stopping point, line, stopping point's distance along the path]
function intersectPathLine(path, line) {
	if (line[0][0] == line[1][0]) {
		return intersectPathVertLine(path, line);
	} else if (line[0][1] == line[1][1]) {
		return intersectPathHorzLine(path, line);
	} else {
		// TODO(cjhopman): currently we assume all lines that we would intersect with are rectilinear
	}
}

function intersectPathHorzLine(path, line) {
	if (path[0][0] == path[1][0]) return null;
	var left = path[0][1] < line[0][1];
	var off = left ? [0, -path[2]] : [0, path[2]];
	var ret = intersectLineLine([path[0], path[1]], [add2(line[0], off), add2(line[1], off)]);
	if (ret) {
		ret = add2(ret, left ? [0, -0.01] : [0, 0.01]);
		ret = [ret, line, dist2(ret, path[0])];
	}
	return ret;
}
function intersectPathVertLine(path, line) {
    return null;
	if (path[0][1] == path[1][1]) return null;
	var left = path[0][0] < line[0][0];
	var off = left ? -path[2] : path[2];
    var offLine = [[line[0].slice(0)], [line[1].slice(0)]];


    

	var ret = intersectLineLine([path[0], path[1]], [add2(line[0], off), add2(line[1], off)]);
	if (ret) {
		ret = add2(ret, left ? [-0.01, 0] : [0.01, 0]);
		ret = [ret, line, dist2(ret, path[0])];
	}
	return ret;
}
function intersectLineLine(left, right) {
	var x = [0, left[0][0], left[1][0], right[0][0], right[1][0]];
	var y = [0, left[0][1], left[1][1], right[0][1], right[1][1]];

    var den = (y[4] - y[3]) * (x[2] - x[1]) - (x[4] - x[3]) * (y[2] - y[1]);
    if (Math.abs(den) < 0.0001) return null;

    var ua = (x[4] - x[3]) * (y[1] - y[3]) - (y[4] - y[3]) * (x[1] - x[3]);
    ua /= den;

    if (ua < 0 || ua > 1) return null;

    var ub = (x[2] - x[1]) * (y[1] - y[3]) - (y[2] - y[1]) * (x[1] - x[3]);
    ub /= den;

    if (ub < 0 || ub > 1) return null;

    return [x[1] + ua * (x[2] - x[1]), y[1] + ua * (y[2] - y[1])];
}


function intersectPathWalls(begin, end, radius) {
	var hit;

	var buckets = getWallBucketsFromLine(begin, end);
	for (var i = 0; i < buckets.length; i++) {
		var walls = getWallBucket(buckets[i]);
		for (var j = 0; j < walls.length; j++) {
			var x = intersectPathLine([begin, end, radius], walls[j].pts);
			if (x && (!hit || hit[2] > x[2])) {
				hit = x;
			}
		}
	}

	if (hit) {
		return [hit[0], hit[1]];
	} else {
		return [end, null];
	}
}

function intersectPathEntities(begin, end, radius, self) {
	var hit;
	return [end, hit];
}

function closestTo(target, left, right) {
	return left[0] == right[0] || dist2(left[0], target) < dist2(right[0], target) ? left : right;
}

function tryMove(ent, begin, end) {
	var wall = intersectPathWalls(begin, end, ent.radius);
	var ent = intersectPathEntities(begin, end, ent.radius, ent);
	var stop = closestTo(begin, wall, ent);
	return stop;
}

function clipMove() {
	this.position = add2(this.position, scale2(this.velocity, this.direction));
}

function basicMove() {
	var target = add2(this.position, scale2(this.velocity, this.direction));

	// TODO(cjhopman): do collision detection...
	
	target = tryMove(this, this.position, target)[0];
	
	this.position = target;
}

