function update() {
    entIntersectCount = 0;
    entIntersectEntities = 0;

	movePhase();
	attackPhase();
    effectPhase();

	cleanupPhase();

    addDebugValue("intersectE/C", entIntersectEntities / entIntersectCount);
}

function processEffects() {

}

function movePhase() {
    var entities = getEntities();
    for (var i = 0; i < entities.length; i++) {
        var ent = entities[i];
        ent.thinkMove();
        ent.move();
    }

	getCamera().move();
}

var effects = [];
function addEffect(e) {
	effects.push(e);
}

function effectPhase() {
	var j = 0;
	for (var i = 0; i < effects.length; i++) {
		effects[i].act();
		if (!effects[i].dead) effects[j++] = effects[i];
	}
	effects.length = j;
}

function modelDrawer(modelName) {
	return {
		model: Loader.GetModel(modelName),
		set: function(obj) {
			obj.model = this.model;
			var scale = vec3.create([obj.radius, obj.radius, 3 * obj.radius]);
			vec3.scale(scale, 0.01);
			obj.scale = scale;
			obj.rotation = 0;
			obj.preRotate = 0;
			obj.drawGL = drawModel;
			obj.draw = drawCircle;
			obj.offset = [0, 10, 0];
			obj.updateModel = updateModel;
			obj.updateModel();
		}
	};
}

function createProjectile(drawSetter, position, target, spd, radius, range, accept, apply, continues) {
	var proj = {};
	proj.position = position.slice(0);
	proj.direction = normalize2(sub2(target, position));
	proj.velocity = spd;
	proj.accept = accept;
	proj.apply = apply;
	proj.act = projectileMove;
	proj.dead = false;
	proj.radius = radius;
	proj.range = range;
	proj.home = position.slice(0);
	proj.fillStyle = "#000000";
	proj.continues = continues || false;

	drawSetter.set(proj);

	addEffect(proj);
	return proj;
}

function splitToFour(val) {
	var v = Math.floor(val);
	var ret = [];
	for (var i = 0; i < 4; i++) {
		ret[3 - i] = v % 10;
		v = Math.floor(v / 10);
	}
	return ret;
}

function createNumberEffect(val, position, start, end, isPlayer) {
	var effect = {};
	effect.position = position;
	effect.y = 30;
	effect.dy = 0.6;
	effect.start = start;
	effect.end = end;
	effect.isPlayer = isPlayer;
	effect.val = splitToFour(val);
	effect.act = function() {
		if (tick > this.end) this.dead = true;
		this.y += this.dy;
	}
	effect.draw = function(ctx) {
	}
	effect.drawGL = function() {
		glNumbers.addNumber(this.val, this.position, this.y, this.isPlayer);
	}
	addEffect(effect);
	return effect;
}

function stationaryAct() {
	if (--this.ready < 1) {
		var ents = getEntitiesInArc(this.arc);
		for (var i = 0; i < ents.length; i++) {
			var e = ents[i];
			if (this.accept(e)) {
				this.apply(e);
				if (--this.hits < 1) {
					this.dead = true;
					break;
				}
			}
		}
		this.ready = this.delay;
	}
	if (--this.lifetime < 1) {
		this.dead = true;
	}
}

function createStationaryEffect(drawSetter, arc, lifetime, delay, accept, apply, hits) {
	var effect = {};
	effect.position = arc.position;
	effect.direction = arc.direction;
	effect.hits = hits || 1e10;
	effect.arc = arc;
	effect.lifetime = lifetime;
	effect.delay = delay;
	effect.ready = 0;
	effect.accept = accept;
	effect.apply = apply;
	effect.act = stationaryAct;
	effect.radius = arc.outerRadius;
	effect.dead = false;
	effect.home = arc.position;
	effect.fillStyle = "#000000";
	drawSetter.set(effect);
	addEffect(effect);
	return effect;
}

function tryMove(ent, begin, end, accept) {
    if (dist2(begin, end) < 0.0001) return [begin, null, null];
	var wall = intersectPathWalls(begin, end, ent.radius, accept) || [end, 1e20, null];
	var ent = intersectPathEntities(begin, wall[0], ent.radius, ent, accept) || [end, 1e20, null];
    var stop = wall[1] < ent[1] ? wall : ent;
	return stop;
}

function createArc(position, outer, inner, direction, angle) {
	return {
		position: position || [0, 0],
		direction: direction || [1, 0],
		outerRadius: outer || 1,
		innerRadius: inner || 0,
		arcAngle: angle || Math.PI,
		getCenter: function() { return this.position; },
		getOrientation: function() { return this.direction; },
	};
}


function projectileMove() {
	var stop = tryMove(this, this.position, add2(this.position, scale2(this.velocity, this.direction)), this.accept);
	if (stop[2]) {
		if (stop[2].isWall) {
			this.dead = true;
		} else if (stop[2] != this.last) {
			//this.last = stop[2];
			this.apply(stop[2]);
			this.dead = !this.continues;
		}
	} 
	clipMove.apply(this);
	if (dist2(this.position, this.home) > this.range) this.dead = true;
    this.updateModel();
}

function getEntityAtPoint(pt) {
	var idx = entityBuckets.getBucketsFromPoint(pt);
	for (var i = 0; i < idx.length; i++) {
		var bucket = entityBuckets.getBucket(idx[i]);
		for (var j = 0; j < bucket.length; j++) {
			var ent = bucket[j];
			if (dist2(ent.position, pt) < ent.radius) return ent;
		}
	}
	return null;
}

function getEntities() {
    return getEnemies().concat(getPlayers());
}

function attackPhase() {
    var entities = getEntities();
    for (var i = 0; i < entities.length; i++) {
        var ent = entities[i];
		ent.cooldown();
        var atk = ent.thinkAttack();
        if (atk && atk[2]) {
			var tgts = atk[2].length ? atk[2] : [atk[2]];
			for (var i = 0; i < tgts.length; i++) {
				atk[0].apply(atk[1], tgts[i]);
			}
        }
    }
}

function cleanupPhase() {
    cleanupDeadEnemies();
}

// If an object on the path will intersect the line
// then return [intersection point, intersection point's distance along the path]
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
	var left = path[0][1] < line[0][1];
	var offy = left ? -path[2] : path[2];
    var offx = line[0][0] < line[1][0] ? -path[2] : path[2];
    var offLine = [add2(line[0], [offx, offy]), add2(line[1], [-offx, offy])];

	var ret = intersectLineLine([path[0], path[1]], offLine);
	if (ret) {
		ret = [ret, dist2(ret, path[0])];
	}
	return ret;
}
function intersectPathVertLine(path, line) {
	var left = path[0][0] < line[0][0];
	var offx = left ? -path[2] : path[2];
    var offy = line[0][1] < line[1][1] ? -path[2] : path[2];
    var offLine = [add2(line[0], [offx, offy]), add2(line[1], [offx, -offy])];

	var ret = intersectLineLine([path[0], path[1]], offLine);
	if (ret) {
		ret = [ret, dist2(ret, path[0])];
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


function intersectPathWalls(begin, end, radius, accept) {
	var hit;

	var buckets = wallBuckets.getBucketsFromLine(begin, end);
	for (var i = 0; i < buckets.length; i++) {
		var walls = wallBuckets.getBucket(buckets[i]);
		for (var j = 0; j < walls.length; j++) {
			if (accept && !accept(walls[j])) continue;
			var x = intersectPathLine([begin, end, radius], walls[j].pts);
			if (x && (!hit || hit[1] > x[1])) {
				hit = x.concat(walls[j]);
			}
		}
	}
	return hit;
}

function getWallsInRect(pt0, pt1) {
	// TODO(cjhopman): used for fog
    return [];
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

    // a = ud
    // b = -2 * un

    var c = x[2] * x[2] + y[2] * y[2] + x[0] * x[0] + y[0] * y[0] +
        -2 * (x[2] * x[0] + y[2] * y[0]) - circle[1] * circle[1];

    var d = 4 * un * un - 4 * c * ud;

    if (d < 0) return null;

    // u = (-b - sqrt(d) ) / 2a
    var u = (2 * un - Math.sqrt(d)) / (2 * ud);
    if (u < 0 || u > 1) return null;

    return add2(line[0], scale2(u, sub2(line[1], line[0])));
}

function intersectPathEntity(path, entity) {
    var hit = intersectLineCircle([path[0], path[1]], [entity.position, entity.radius + path[2]]);
    if (hit) {
        return [hit, dist2(hit, path[0]), entity];
    } else return null;
}

var entIntersectCount = 0;
var entIntersectEntities = 0;
function intersectPathEntities(begin, end, radius, self, accept) {
	var hit;

    var buckets = entityBuckets.getBucketsFromLine(begin, end);
    var c = 0;
    for (var i = 0; i < buckets.length; i++) {
        var entities = entityBuckets.getBucket(buckets[i]);
        for (var j = 0; j < entities.length; j++) {
            ++c;
			if (entities[j] == self) continue;
			if (accept && !accept(entities[j])) continue;
            var  x = intersectPathEntity([begin, end, radius], entities[j]);
            if (x && (!hit || hit[1] > x[1])) {
                hit = x;
            }
        }
    }
    entIntersectCount++;
    entIntersectEntities += c;
    return hit;
}

function tryMove(ent, begin, end, accept) {
    if (dist2(begin, end) < 0.0001) return [begin, null, null];
	var wall = intersectPathWalls(begin, end, ent.radius, accept) || [end, 1e20, null];
	var ent = intersectPathEntities(begin, wall[0], ent.radius, ent, accept) || [end, 1e20, null];
    var stop = wall[1] < ent[1] ? wall : ent;
	return stop;
}

function slideMove(ent, begin, end) {
	var mv = tryMove(ent, begin, end);
	var hit = mv[2];
	if (!hit) return mv;
	var norm = hit.isWall ? hit.normal : normalize2(sub2(mv[0], hit.position));
	var decomp = normalDecompose(sub2(end, mv[0]), norm);
	return tryMove(ent, begin, add2(mv[0], decomp[2]));
}

function clipMove() {
	this.position = add2(this.position, scale2(this.velocity, this.direction));
}

function collideMove(ent, begin, end, stop) {
	if (stop[1] < 1) return begin;
	var target = add2(stop[0], scale2(0.1, normalize2(sub2(begin, end))));
	var stop = tryMove(ent, begin, target);
	if (stop[2]) {
		return begin;
	} else {
		return stop[0];
	}
}

function basicMove() {
	var target = add2(this.position, scale2(this.velocity, this.direction));

	var stop = tryMove(this, this.position, target);
	target = stop[2] ? collideMove(this, this.position, target, stop) : stop[0];
	
	this.position = target;
}

function slidingMove() {
    if (this.velocity < 0.001) return;
	var target = add2(this.position, scale2(this.velocity, this.direction));

	var stop = slideMove(this, this.position, target);
	target = stop[2] ? collideMove(this, this.position, target, stop) : stop[0];
	
	this.position = target;
}
	

