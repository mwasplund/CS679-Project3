var enemies = [];
function getEnemies() {
    return enemies;
}

function pushEnemy(e) {
    enemies.push(e);
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
		pos = [(Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300];
        if (Math.abs(pos[0]) < 50 || Math.abs(pos[1]) < 50) pos = null;
	}
	return makeEnemy({
			radius: 16,
			speed: 2.5,
		}, pos, Loader.GetModel("TestCube"));
}

function makeEnemy(stats, position, i_Model) {
	var ret = {};

	ret.stats = stats;
	ret.think = enemyThink;
	ret.move = slidingMove;
	ret.draw = drawCircle;
	ret.drawSelected = drawCircleSelected;
	ret.radius = stats.radius;
	ret.fillStyle = "#111166";
	ret.model = i_Model;
	ret.rotation = 0;
	ret.position = position.slice(0);
	ret.direction = [0, 1];
	ret.drawGL = drawModel;

	return ret;
}
