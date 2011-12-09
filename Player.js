var player;
function initializePlayer(i_Model, i_Scale) {
	var stats = {
		speed: getOptions().playerVelocity,
        sight: 300,
		health: 1000,
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
        move: entityMove(slidingMove),
        getHealth: function() { return Math.min(1, Math.max(0, this.health / this.stats.health)); },
        draw: drawCircle,
		drawGL: drawModel,
		updateModel: updateModel,
		isPlayer: true,
		health: stats.health,
		damage: entityDamage,
		cooldown: function() { },
    }

	player.setTarget = function(tgt) {
		this.target = tgt;
	}
    initializeAttacks();

    player.getPosition = function() {
        return this.position;
    }

    player.getMousePosition = function() {
        return getMouse().getWorldPosition();
    };

	player.thinkAttack = function() {
	}
    player.thinkMove = function() {
		var d;

		var tgt = this.target;
		if (tgt) {
			if (tgt.isPoint) {
				if (dist2(tgt.position, this.position) < this.radius) {
					this.setTarget(null);
				}
			} else if (tgt.isEnemy) {
				if (tgt.isDead) {
					this.setTarget(null);
				}
			}
		}
		if (this.target) { 
			d = sub2(this.target.position, this.position);
		} else {
        	d = [shouldMoveX(), shouldMoveY()];
		}
        if (d[0] != 0 || d[1] != 0) {
            this.direction = normalize2(d);
            this.velocity = this.stats.speed;
        } else {
            this.direction = this.direction;
            this.velocity = 0; 
        }
		
		this.updateModel()
    }
    entityBuckets.add(player);
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

