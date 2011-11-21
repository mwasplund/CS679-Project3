function update() {
	movePhase();
	actionPhase();
	deathPhase();
}

function movePhase() {
    var o = getEnemies();
    for (var i = 0; i < o.length; i++) {
        o[i].move();
    }

    determinePlayerMove();
	getPlayer().move();

	getCamera().move();
}

function shouldMoveX() {
    //console.log(getKeyState(keyId.left));
    return ((getKeyState(keyId.left) != 0) ? -1 : 0) + 
        ((getKeyState(keyId.right) != 0) ? 1 : 0);
}

function shouldMoveY() {
    return ((getKeyState(keyId.down) != 0) ? -1 : 0) + 
        ((getKeyState(keyId.up) != 0) ? 1 : 0);
}

function determinePlayerMove() {
    var sqrt2inv = 0.7071067811865;
    var d = [shouldMoveX(), shouldMoveY()];
    if (d[0] != 0 || d[1] != 0) {
        if (d[0] != 0 && d[1] != 0) {
            d = scale2(sqrt2inv, d);
        }
        getPlayer().direction = d;
        getPlayer().velocity = getOptions().playerVelocity;

    } else {
        getPlayer().direction = [0, 0];
        getPlayer().velocity = 0; 
    }
}

function actionPhase() {
}

function deathPhase() {
}
