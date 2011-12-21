var enemies = [];
function getEnemies() {
    return enemies;
}

function addEnemy(e) {
    entityBuckets.add(e);
    enemies.push(e);
}

function removeEnemy(i) {
	var e = enemies[i];
    entityBuckets.remove(e);
    enemies[i] = enemies[enemies.length - 1];
    enemies.pop();
	e.removed = true;
	e.updateModel();
}

var eyebeamEmitterParams = {
	numParticles: 50,
	lifeTime: 0.5,
	startSize: 5,
	endSize: 2,
	position:[0, 20, 0],
	positionRange:[0, 0, 0],
	velocity:[0, 0, 0],
	velocityRange: [8, 4, 8],
	worldAcceleration: [0, -1, 0],
	spinSpeedRange: 4
};
function getEyebeamEmitter() {
	var emitter = particleSystem.createTrail(1000, eyebeamEmitterParams);
	emitter.setState(tdl.particles.ParticleStateIds.ADD);
	emitter.setColorRamp(
			[0, 0.2, 1, 1,
			0, 0.2, 0.8, 1,
			0, 0, 0.8, 0.5,
			0, 0, 0, 0]);
	return emitter;
}

function makeEnemyType(type) {

    var isRanged = Math.random() < 0.7;
	var stats = {
		radius: 12,
		speed: 2.2,
		sight: 200,
		memory: Math.ceil(5000 / timeStep),
		health: isRanged ? 14 : 9,
		regen: 0.01,
		isRanged: isRanged,
	}
	switch (type) {
		case 1:
		case "1":
			var offset = [0, 25, 0];
			var scale = [5, 5, 5];
			stats.height = 40;
			stats.speed = 2.5;
			if (!isRanged) {
				stats.radius *= 0.5;
				stats.height *= 0.5;
				scale = vec3.scale(scale, 0.5);
				offset = vec3.scale(offset, 0.5);
				stats.attack = simpleDirectAttack(3);
			} else {
				var eyebeam = function(src, tgt) {
					var proj = createProjectile(nullDrawer(), src.position, tgt.position, 2, 3, 10000, function(e) { return !e.isEnemy; }, function(e) { e.damage(2, src); });
					addEmitter(proj, getEyebeamEmitter());
				}
				stats.attack = simpleProjectileAttack(eyebeam, msToTicks(2000), 100);
			}

			return makeEnemy(stats, null, Loader.GetModel("monsterWeak"), scale, 0, offset);
		case 2:
		case "2":
			var offset = [0, 7, 0];
			var scale = [0.1, 0.1, 0.1];
			stats.speed = 2.0;
			if (!isRanged) {
				stats.radius *= 0.7;
				stats.height *= 0.7;
				scale = vec3.scale(scale, 0.7);
				offset = vec3.scale(offset, 0.7);
				stats.speed *= 1.5;
				stats.attack = simpleDirectAttack();
			} else {
				stats.attack = simpleProjectileAttack();
			}
			stats.height = stats.radius;
			return makeEnemy(stats, null, Loader.GetModel("WolfSpider_Linked"), scale, Math.PI, offset);
		case 3:
		case "3":
			var offset = [0, 25, 0];
			var scale = [1, 1, 1];
			stats.height = 70;
			stats.speed = 2.5;
			if (!isRanged) {
				stats.radius *= 1.2;
				stats.height *= 1.2;
				scale = vec3.scale(scale, 1.2);
				offset = vec3.scale(offset, 1.2);
				stats.attack = simpleDirectAttack();
			} else {
				stats.attack = simpleProjectileAttack();
			}
			return makeEnemy(stats, null, Loader.GetModel("monsterMediumStrength"), scale, 0, offset);
		case 4:
		case "4":
			var offset = [0, 10, 0];
			var scale = [1, 1, 1];
			stats.height = 20;
			stats.speed = 2.5;
			if (!isRanged) {
				stats.radius *= 0.5;
				stats.height *= 0.5;
				scale = vec3.scale(scale, 0.5);
				offset = vec3.scale(offset, 0.5);
				stats.attack = simpleDirectAttack();
			} else {
				stats.attack = simpleProjectileAttack();
			}
			return makeEnemy(stats, null, Loader.GetModel("goodGuyWalkTextured"), scale, 0, offset);
		case 5:
		case "5":
			var offset = [0, 50, 0];
			var scale = [10, 10, 10];
			stats.height = 80;
			stats.speed = 2.5;
			if (!isRanged) {
				stats.radius *= 0.5;
				stats.height *= 0.5;
				scale = vec3.scale(scale, 0.5);
				offset = vec3.scale(offset, 0.5);
			} else {
				stats.attack = simpleProjectileAttack();
			}
			return makeEnemy(stats, null, Loader.GetModel("monsterWeak"), scale, 0, offset);
		default:
			break;
	}
}

function outsideBounds(pos) {
	return pos[0] < levelBounds[0][0] || pos[0] > levelBounds[1][0] ||
		pos[1] < levelBounds[0][1] || pos[1] > levelBounds[1][1];
}

function placeEnemyNear(e, pos) {
	var dist = 10;
	if (!pos) {
		pos = [(levelBounds[0][0] + levelBounds[1][0]) / 2, (levelBounds[0][1] + levelBounds[1][1]) / 2];
		dist = Math.max(pos[0] - levelBounds[0][0], pos[1] - levelBounds[0][1]);
	}
	var home = null;
	var ct = 0;
	while (!home && ct++ < 100) {
		dist = dist < 1000 ? dist * 1.1 : dist;
		home = add2(pos, scale2(dist, randomPos()));
		if (getEnemiesInCircle(home, 32).length > 0) {
			home = null;
			continue;
		}
		if (outsideBounds(home)) {
			home = null;
			continue;
		}
		var players = getPlayers();
		for (var i = 0; home && i < players.length; i++) {
			var p = players[i];
			if (dist2(home, p.position) < 300) {
				home = null;
			}
		}
	}
	Debug.info(home);
	home = home || [1e10, 1e10];
	e.position = home.slice(0);
	e.home = home.slice(0);
}

function randomPos() {
	return [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2];
}


function makeEnemiesFromProto(o) {
	var type = o.enemy;
	var num = o.num;
	var pos = o.xLoc ? [o.xLoc, o.yLoc] : null;

	for (var i = 0; i < num; i++) {
		var e = makeEnemyType(type);
		placeEnemyNear(e, pos);
		addEnemy(e);
	}
}

function enemyUpdateTarget() {
	if (this.isActive()) {
		if (tick - this.target.tick > (this.memory || this.stats.memory)) {
			if (this.target.entity) {
				this.setTarget(this.position);
			} else {
				this.setTarget(this.home);
			}
		} else if (this.target.entity) {
			if (entityCanSee(this, this.target.entity)) {
				this.setTarget(this.target.entity);
			} else {
				this.setTarget(this.target.position);
			}
		} else if (this.target.entity) {
		} else {
			if (dist2(this.position, this.target.position) < 2 * this.stats.speed) {
				this.setTarget(add2(this.target.position, scale2(this.stats.speed * 20, randomPos())), this.target.tick);
			}
		}
	}
}

function enemyLook() {
	this.updateTarget();
	if (this.target && this.target.entity) {
		return;
	}
    var players = getPlayers();
    for (var i = 0; i < players.length; i++) {
        var p = players[i];
        if (entityCanSee(this, p)) {
			this.setTarget(p);
        }
    }
}

function getEntitySpeed(e) {
    return e.speed || e.stats.speed;
}

function enemyThinkMove() {
    this.look();
    if (!this.isActive()) {
        this.velocity = 0;
        return;
    }

	this.velocity = this.stats.speed;
	if (this.inAttackRange()) this.velocity = 0;

	this.direction = normalize2(sub2(this.target.position, this.position));

	this.updateModel();
}

function inAttackRange(off) {
	off = off || 0;
	return this.target.entity && 
		(dist2(this.position, this.target.position) < this.attack.range + this.radius + this.target.entity.radius - off);
}

function enemyThinkAttack() {
    if (!this.isActive()) {
        return false;
    }
	if (!this.target.entity) {
		return false;
	}
    if (this.attack.ready > 0) {
        return false;
    }
	if (!this.inAttackRange()) {
        return false;
    }
    return [this.attack, this, this.target.entity];
}

function entityMove(func) {
    return function() {
		if (this.isDead) return;
        entityBuckets.remove(this);
        func.apply(this);
        entityBuckets.add(this);
    }
}

function entityCanSee(ent, target) {
    if (dist2(ent.position, target.position) > ent.stats.sight + target.radius) return false;
    if (intersectPathWalls(ent.position, target.position, 0)) return false;

    return true;
}

function simpleDirectAttack(dmg, cd, rng) {
	if (!dmg) dmg = 10;
	if (!cd) cd = 1000 / timeStep;
	if (!rng) rng = 8;
	var ret = {};
	ret.damage = dmg;
	ret.cooldown = cd;
	ret.range = rng;
	ret.ready = 0;
	ret.apply = function(src, tgt) {
		tgt.damage(this.damage, src);
		this.ready = this.cooldown;
	};
	return ret;
}

function simpleProjectile(src, tgt, dmg, spd) {
	if (!dmg) dmg = 4;
	if (!spd) spd = 4.0;
	var proj = createProjectile(modelDrawer("bolder"), src.position, tgt.position, spd, 3, 10000, function(e) { return !e.isEnemy; }, function(e) { e.damage(dmg, src); });
	proj.scale = vec3.scale(proj.scale, 4);
	return proj;
}

function simpleProjectileAttack(apply, cd, rng) {
	if (!rng) rng = 150;
	if (!cd) cd = msToTicks(3000);
	apply = apply || function(src, tgt) {
		simpleProjectile(src, tgt);
	}
	var ret = {};
	ret.cooldown = cd;
	ret.range = rng;
	ret.ready = 0;
	ret.baseApply = apply;

	ret.apply = function(src, tgt) {
		this.ready = this.cooldown;
		this.baseApply.apply(this, [src, tgt]);
	};
	return ret;
}

function entityDamage(dmg, src) {
	this.health -= dmg;
	this.isDead = this.health <= 0;
	createNumberEffect(dmg, this, tick, tick + msToTicks(1000), this.isPlayer ? [1, 0, 0] : [0, 1, 0]);
}
function entityHeal(dmg, src) {
	dmg = Math.min(dmg, this.stats.health - this.health);
	this.health += dmg;
	if (dmg > 0) {
		createNumberEffect(dmg, this, tick, tick + msToTicks(1000), [0, 0, 1]);
	}
}

function makeEnemy(stats, position, i_Model, i_Scale, i_PreRotate, i_Offset) {
    var isRanged = stats.isRanged;
	var ret = {};
	position = position || [1e10, 1e10];

	ret.radius = stats.radius;
	ret.height = stats.height;
	ret.scale = i_Scale;
	ret.offset = i_Offset;
	ret.attack = stats.attack;

	ret.inAttackRange = inAttackRange;
	ret.damage = function(dmg, src) {
        if (!this.target || !this.target.entity) {
            this.setTarget(src);
        }
        entityDamage.apply(this, [dmg, src]);
    }
	ret.cooldown = function() { this.attack.ready--; };
	ret.stats = stats;
	ret.health = ret.stats.health;
	ret.getHealth = entityHealth;
	ret.heal = entityHeal;
	ret.thinkMove = enemyThinkMove;
	ret.updateModel = updateModel;
	ret.look = enemyLook;
	ret.move = entityMove(slidingMove);
	ret.draw = drawCircle;
	ret.drawSelected = drawCircleSelected;
	ret.fillStyle = "#FF2222";
	ret.model = i_Model;
	ret.rotation = 0;
	ret.position = position.slice(0);
    ret.home = position.slice(0);
	ret.direction = [0, 1];
	ret.rotation = 0;
	ret.preRotate = i_PreRotate;
	ret.drawGL = drawEntity;
	ret.updateTarget = enemyUpdateTarget;
	ret.isEnemy = true;

    ret.hasTarget = function() {
        return this.target;
    }

    ret.setTarget = function(tgt, tk) {
		this.target = {
			position: tgt.position || tgt,
			tick: tk || tick,
			entity: tgt.position ? tgt : null,
		}
    }

    ret.isActive = function() {
        return !this.removed && (!this.atHome() || this.target);
    }

    ret.atHome = function() {
        return manhattan2(this.position, this.home) < this.stats.speed * 2;
    }

    ret.thinkAttack = enemyThinkAttack;

	ret.updateModel();
	return ret;
}

function shouldCleanup(e) {
    return !e.health || e.health <= 0;
}

function cleanupDeadEnemies() {
    var enemies = getEnemies();
    for (var i = 0; i < enemies.length; ) {
        if (shouldCleanup(enemies[i])) {
            removeEnemy(i);
        } else {
            i++;
        }
    }
}

