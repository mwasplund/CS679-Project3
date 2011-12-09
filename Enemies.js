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
		pos = [(Math.random() - 0.5) * 750, (Math.random() - 0.5) * 2000];
        if (Math.abs(pos[0]) < 50 || Math.abs(pos[1]) < 50) { pos = null; continue; }
		if (getEnemiesInRect(sub2(pos, [32, 32]), add2(pos, [32, 32])).length > 0) pos = null;
	}
	return makeEnemy({
			radius: 16,
			speed: 2.2,
            sight: 200,
            memory: Math.ceil(5000 / timeStep),
			health: 14,
			regen: 0.01
		}, pos, Loader.GetModel("WolfSpider_Linked"), [0.1,0.1,0.1]);
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
		tgt.damage(this.damage, "direct");
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
		createProjectile(src.position, tgt.position, spd, 4, 10000, function(e) { return !e.isEnemy; }, function(e) { e.damage(dmg); });
		this.ready = this.cooldown;
	};
	return ret;
}

function entityDamage(dmg) {
	this.health -= dmg;
	this.isDead = this.health <= 0;
}

function makeEnemy(stats, position, i_Model, i_Scale) {
	var ret = {};

	ret.inAttackRange = inAttackRange;
	ret.damage = entityDamage;
	ret.cooldown = function() { this.attack.ready--; };
	ret.stats = stats;
	ret.health = ret.stats.health;
	ret.thinkMove = enemyThinkMove;
	ret.updateModel = updateModel;
	ret.look = enemyLook;
	ret.move = entityMove(slidingMove);
	ret.draw = drawCircle;
	ret.drawSelected = drawCircleSelected;
	ret.radius = stats.radius;
	ret.fillStyle = "#111166";
	ret.model = i_Model;
	ret.rotation = 0;
	ret.position = position.slice(0);
    ret.home = position.slice(0);
	ret.direction = [0, 1];
	ret.scale = i_Scale;
	ret.rotation = 0;
	ret.drawGL = drawModel;
    ret.lastEvent = -1e12;
	ret.updateTarget = enemyUpdateTarget;
	ret.isEnemy = true;

	//ret.attack = simpleDirectAttack();
	ret.attack = simpleProjectileAttack();

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

