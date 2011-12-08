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


function enemyThink() {
	if (!this.goal || dist2(this.goal, this.position) < 5) {
		this.goal = [(Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000];
	}
	this.velocity = this.stats.speed;
	this.direction = normalize2(sub2(this.goal, this.position));
}


function makeSimpleEnemy(pos) {
	while (!pos) {
		pos = [(Math.random() - 0.5) * 750, (Math.random() - 0.5) * 2000];
        if (Math.abs(pos[0]) < 50 && Math.abs(pos[1]) < 50) pos = null;
	}
	return makeEnemy({
			radius: 16,
			speed: 2.5,
		}, pos, Loader.GetModel("TestCube"));
}

function entityMove(func) {
    return function() {
        entityBuckets.remove(this);
        func.apply(this);
        entityBuckets.add(this);
    }
}

function makeEnemy(stats, position, i_Model) {
	var ret = {};

	ret.stats = stats;
	ret.think = enemyThink;
	ret.move = entityMove(slidingMove);
	ret.draw = drawCircle;
	ret.drawSelected = drawCircleSelected;
	ret.radius = stats.radius;
	ret.fillStyle = "#111166";
	ret.model = i_Model;
	ret.rotation = 0;
	ret.position = position.slice(0);
	ret.direction = [0, 1];
	ret.drawGL = drawModel;
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

