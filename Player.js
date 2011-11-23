var player;
function initializePlayer() {
    player = {
        position: [0, 0],
        velocity: 0.1,
        direction: [0, 1],
        radius: 20,
        fillStyle: "#00FF44",
        move: function() { 
            this.position = add2(this.position, scale2(this.velocity, this.direction));
        },
        getHealth: function() { return 0.7; },
        draw: drawCircle,
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
            this.velocity = getOptions().playerVelocity;

        } else {
            this.direction = [0, 0];
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
    return ((getKeyState(keyId.down) != 0) ? -1 : 0) + 
        ((getKeyState(keyId.up) != 0) ? 1 : 0);
}

