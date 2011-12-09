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

function enemyThink() {
    this.look();
    if (!this.isActive()) {
        this.velocity = 0;
        return;
    }

	this.velocity = this.stats.speed;


	this.direction = normalize2(sub2(this.target.position, this.position));
	this.updateModel()
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
        if (Math.abs(pos[0]) < 50 || Math.abs(pos[1]) < 50) pos = null;
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

function makeEnemy(stats, position, i_Model, i_Scale) {
	var ret = {};

	ret.stats = stats;
	ret.think = enemyThink;
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

    ret.planAttack = function() {
    }

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

