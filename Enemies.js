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
	if (!pos) {
		pos = [(Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300];
	}
	return makeEnemy({
			radius: 4,
			speed: 0.6,
		}, pos, Loader.GetModel("TestCube"));
}

function makeEnemy(stats, position, i_Model) {
	var ret = {};

	ret.stats = stats;
	ret.think = enemyThink;
	ret.move = basicMove;
	ret.draw = drawCircle;
	ret.drawSelected = drawCircleSelected;
	ret.radius = stats.radius;
	ret.fillStyle = "#111166";
	ret.model = i_Model;
	ret.position = position.slice(0);
	ret.drawGL = drawModel;

	return ret;
}
