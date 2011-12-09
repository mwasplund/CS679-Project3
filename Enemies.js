var enemies = [];
function getEnemies() {
    return enemies;
}

function addEnemy(e) {
    entityBuckets.add(e);

    enemies.push(e);
}

function removeEnemy(e) {
    entityBuckets.remove(e);

    var idx = e.enemyIdx;
    enemies[idx] = enemies[enemies.length - 1];
    enemies.pop();
}

function enemyLook() {
    var players = getPlayers();
    this.canSee = [];
    for (var i = 0; i < players.length; i++) {
        var p = players[i];
        if (entityCanSee(this, p)) {
            this.canSee.push(p);
        }
    }
    if (this.canSee.length > 0 && !this.hasTarget()) {
        this.setTarget(this.canSee[0]);
    }
}

function enemyThinkMove() {
    this.look();
    if (!this.isActive()) {
        this.velocity = 0;
        return;
    }

	this.velocity = this.stats.speed;

	this.direction = normalize2(sub2(this.target.position, this.position));
	this.updateModel();
}

function enemyThinkAttack() {
    if (!this.isActive()) {
        return false;
    }
    if (this.attack.ready > 0) {
        return false;
    }
    if (dist2(this.position, this.target.position) > this.attack.range + this.radius + this.target.radius) {
        return false;
    }
    return [this.attack, this.target];
}


function makeSimpleEnemy(pos) {
	while (!pos) {
		pos = [(Math.random() - 0.5) * 750, (Math.random() - 0.5) * 2000];
        if (Math.abs(pos[0]) < 50 && Math.abs(pos[1]) < 50) pos = null;
	}
	return makeEnemy({
			radius: 16,
			speed: 2.5,
		}, pos, Loader.GetModel("TestCube"), [0.1,0.1,0.1]);
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
			speed: 2.5,
            sight: 200,
            memory: Math.ceil(3000 / timeStep),
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
	ret.apply = function (ent) {
		ent.damage(this.damage, "direct");
		this.ready = this.cooldown;
	};
	return ret;
}

function entityDamage(dmg) {
	this.health -= dmg;
}

function makeEnemy(stats, position, i_Model, i_Scale) {
	var ret = {};

	ret.damage = entityDamage;
	ret.cooldown = function() { this.attack.ready--; };
	ret.stats = stats;
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

	ret.attack = simpleDirectAttack();

    ret.hasTarget = function() {
        return this.target;
    }

    ret.setTarget = function(tgt) {
        this.target = tgt;
    }

    ret.isActive = function() {
        return !this.atHome() || this.target;
    }

    ret.atHome = function() {
        return manhattan2(this.position, this.home) < this.stats.speed;
    }

    ret.thinkAttack = enemyThinkAttack;

	ret.updateModel();
	return ret;
}

function shouldCleanup(e) {
    return false;
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

