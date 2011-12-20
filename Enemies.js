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
	e.position = [-1e12, -1e12];
	e.updateModel();

    //addEnemy(makeSpiderEnemy());
}

function randomPos() {
	return [(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2];
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
        entityBuckets.remove(this);
        func.apply(this);
        entityBuckets.add(this);
    }
}

function makeSpiderEnemy(pos) {
	while (!pos) {
		pos = [(Math.random() - 0.5) * 750, (Math.random() - 0.5) * 1900];
        if (Math.abs(pos[0]) < 50 || Math.abs(pos[1]) < 50) { pos = null; continue; }
		if (getEnemiesInRect(sub2(pos, [32, 32]), add2(pos, [32, 32])).length > 0) { pos = null; continue; }

        if (dist2(pos, getLocalPlayer().position) < 300) { 
            pos = null; continue;
        }
	}
	return makeEnemy({
			radius: 16,
			speed: 2.2,
            sight: 200,
            memory: Math.ceil(5000 / timeStep),
			health: 14,
			regen: 0.01
		}, pos, Loader.GetModel("WolfSpider_Linked"), [0.1,0.1,0.1], Math.PI, [0,7,0]);
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

function simpleProjectileAttack(dmg, cd, rng, spd) {
	if (!dmg) dmg = 4;
	if (!cd) cd = 3000 / timeStep;
	if (!rng) rng = 150;
	if (!spd) spd = 4.0;
	var ret = {};
	ret.damage = dmg;
	ret.cooldown = cd;
	ret.range = rng;
	ret.ready = 0;

	ret.apply = function(src, tgt) {
		createProjectile(modelDrawer("Sphere"), src.position, tgt.position, spd, 1, 10000, function(e) { return !e.isEnemy; }, function(e) { e.damage(dmg, src); });
		this.ready = this.cooldown;
	};
	return ret;
}

function entityDamage(dmg, src) {
	this.health -= dmg;
	this.isDead = this.health <= 0;
	createNumberEffect(dmg, this.position, tick, tick + msToTicks(1000), this.isPlayer);
}

function makeEnemy(stats, position, i_Model, i_Scale, i_PreRotate, i_Offset) {
    var isRanged = Math.random() < 0.7;
	var ret = {};

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
	ret.thinkMove = enemyThinkMove;
	ret.updateModel = updateModel;
	ret.look = enemyLook;
	ret.move = entityMove(slidingMove);
	ret.draw = drawCircle;
	ret.drawSelected = drawCircleSelected;
	ret.radius = isRanged ? stats.radius : stats.radius * 0.7;
	ret.fillStyle = "#FF2222";
	ret.model = i_Model;
	ret.rotation = 0;
	ret.position = position.slice(0);
    ret.home = position.slice(0);
	ret.direction = [0, 1];
	ret.scale = isRanged ? i_Scale : [i_Scale[0] * 0.5, i_Scale[1] * 0.5, i_Scale[2] * 0.5];
	ret.rotation = 0;
	ret.offset = i_Offset;
	ret.preRotate = i_PreRotate;
	ret.drawGL = drawModel;
	ret.updateTarget = enemyUpdateTarget;
	ret.isEnemy = true;
    if (!isRanged) ret.health *= 0.5;
    if (!isRanged) ret.stats.speed = getLocalPlayer().stats.speed - 0.1;

	if (isRanged) ret.attack = simpleProjectileAttack();
    else ret.attack = simpleDirectAttack();

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

