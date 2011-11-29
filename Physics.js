function update() {
	movePhase();
	actionPhase();
	cleanupPhase();
}

function movePhase() {
    var enemies = getEnemies();
    for (var i = 0; i < enemies.length; i++) {
        var e = enemies[i];
        e.think();
        processEffects(e);
        e.move();
    }

    var players = getPlayers();
    for (var i = 0; i < players.length; i++) {
        var pl = players[i];
        pl.think();
        processEffects(pl);
        pl.move();
    }

	getCamera().move();
}

function processEffects(ent) {

}

function actionPhase() {
}

function cleanupPhase() {
}
