var player;
function initializePlayer(i_Model, i_Scale) {
	var stats = {
		speed: getOptions().playerVelocity,
	};
    player = {
		stats: stats,
        position: [0, 0],
        direction: [0, 1],
		scale: i_Scale,
		rotation: 0,
        radius: 20,
        rotation: 0,
        fillStyle: "#00FF44",
		model: i_Model,
        move: slidingMove,
        getHealth: function() { return 0.7; },
        draw: drawCircle,
		drawGL: drawModel,
		isPlayer: true,
    }
    initializeAttacks();

    player.getPosition = function() {
        return this.position;
    }

    player.getMousePosition = function() {
        return getMouse().getWorldPosition();
    };

    player.think = function() {
        var sqrt2inv = 0.7071067811865;
        var d = [shouldMoveX(), shouldMoveY()];
        if (d[0] != 0 || d[1] != 0) {
            if (d[0] != 0 && d[1] != 0) {
                d = scale2(sqrt2inv, d);
            }
            this.direction = d;
            this.velocity = this.stats.speed;
        } else {
            this.direction = this.direction;
            this.velocity = 0; 
        }
    }
};

function getPlayers() {
    return [player];
}

function getLocalPlayer() {
    return player;
}

function shouldMoveX() {
    return ((getKeyState(keyId.left) != 0) ? -1 : 0) + 
        ((getKeyState(keyId.right) != 0) ? 1 : 0);
}

function shouldMoveY() {
    return ((getKeyState(keyId.down) != 0) ? 1 : 0) + 
        ((getKeyState(keyId.up) != 0) ? -1 : 0);
}

