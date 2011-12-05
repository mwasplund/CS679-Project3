function update() {
	movePhase();
	actionPhase();
	cleanupPhase();
}

function movePhase() {
    var entities = getEntities();
    for (var i = 0; i < entities.length; i++) {
        var ent = entities[i];
        ent.think();
        processEffects(ent);
        ent.move();
    }

	getCamera().move();
}

function getEntities() {
    return getEnemies().concat(getPlayers());
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
	//if (path[0][0] == path[1][0]) return null;
	var left = path[0][1] < line[0][1];
	var offy = left ? -path[2] : path[2];
    var offx = line[0][0] < line[1][0] ? -path[2] : path[2];
    var offLine = [add2(line[0], [offx, offy]), add2(line[1], [-offx, offy])];

	var ret = intersectLineLine([path[0], path[1]], offLine);
	if (ret) {
		ret = [ret, line, dist2(ret, path[0])];
	}
	return ret;
}
function intersectPathVertLine(path, line) {
	//if (path[0][1] == path[1][1]) return null;

	var left = path[0][0] < line[0][0];
	var offx = left ? -path[2] : path[2];
    var offy = line[0][1] < line[1][1] ? -path[2] : path[2];
    var offLine = [add2(line[0], [offx, offy]), add2(line[1], [offx, -offy])];

	var ret = intersectLineLine([path[0], path[1]], offLine);
	if (ret) {
		ret = [ret, line, dist2(ret, path[0])];
	}
	return ret;
}
var EPS = 0.0000001;
function intersectLineLine(left, right) {
	var x = [0, left[0][0], left[1][0], right[0][0], right[1][0]];
	var y = [0, left[0][1], left[1][1], right[0][1], right[1][1]];

    var den = (y[4] - y[3]) * (x[2] - x[1]) - (x[4] - x[3]) * (y[2] - y[1]);
    if (Math.abs(den) < 0.0001) return null;

    var ua = (x[4] - x[3]) * (y[1] - y[3]) - (y[4] - y[3]) * (x[1] - x[3]);
    ua /= den;

    if (ua < 0 - EPS || ua > 1 + EPS) return null;

    var ub = (x[2] - x[1]) * (y[1] - y[3]) - (y[2] - y[1]) * (x[1] - x[3]);
    ub /= den;

    if (ub < 0 - EPS || ub > 1 + EPS) return null;

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
        if (hit) {
            if (dist2(hit, begin) < 0.01) {
                return [begin, null];
            }
            var h = add2(hit[0], scale2(0.01, normalize2(sub2(begin, end))));
            return [h, hit[1]];
        }
	}

    return [end, null];
}

function intersectLineCircle(line, circle) {
    var x = [line[0][0], line[1][0], circle[0][0]];
    var y = [line[0][1], line[1][1], circle[0][1]];

    var un = ((x[2] - x[0]) * (x[1] - x[0]) + (y[2] - y[0]) * (y[1] - y[0]));
    var ud = ((x[1] - x[0]) * (x[1] - x[0]) + (y[1] - y[0]) * (y[1] - y[0]));

    // This assumes that the line doesn't begin inside the circle
    if (un < 0) return null;

    var p = add2(line[0], scale2(un / ud, sub2(line[1], line[0])));

    // If the closest point on the line is outside the circle or too far past the end of the segment
    if (dist2(p, circle[0]) > circle[1] || 
            (un > ud && dist2(p, line[1]) > circle[1])) {
        return null;
    }


    //var u = 



    return null;
}

function intersectPathEntity(path, entity) {
    var hit = intersectLineCircle([path[0], path[1]], [entity.position, entity.radius + path[2]]);
    if (hit) {
        return [hit, entity, dist2(hit, path[0])];
    } else return null;
}

function getEntityBucket(idx) {
    return getEntities();
}

function getEntityBucketsFromLine(begin, end) {
    return [0];
}

function intersectPathEntities(begin, end, radius, self) {
	var hit;

    var buckets = getEntityBucketsFromLine(begin, end);
    for (var i = 0; i < buckets.length; i++) {
        var entities = getEntityBucket(buckets[i]);
        for (var j = 0; j < entities.length; j++) {
            var  x = intersectPathEntity([begin, end, radius], entities[j]);
            if (x && (!hit || hit[2] > x[2])) {
                hit = x;
            }
        }

    }
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

