var player;
function initializePlayer(i_Model, i_Scale, i_PreRotate, i_Offset) {
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
		offset: i_Offset,
		preRotate: i_PreRotate,
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
		cooldown: function() { 
			for (var i = 0; i < this.meleeAttacks.length; i++) {
				this.meleeAttacks[i].ready--;
			}
			for (var i = 0; i < this.specialAttacks.length; i++) {
				this.specialAttacks[i].ready--;
			}
		},
    }

	player.setTarget = function(tgt) {
		if (!tgt) {
			this.target = null;
		} else {
			this.target = {
				position: tgt.position || tgt,
				entity: tgt.position ? tgt : null,
			}
		}
	}

    initializeAttacks();
	getAttacks(player);

	player.currentMeleeAttack = 0;
	player.currentSpecialAttack = 0;

	player.getCurrentMeleeAttack = function() {
		return this.meleeAttacks[this.currentMeleeAttack];
	}

	player.inAttackRange = inAttackRange;
    player.getPosition = function() {
        return this.position;
    }

    player.getMousePosition = function() {
        return getMouse().getWorldPosition();
    };

	player.thinkAttack = function() {
		if (this.target && this.target.entity && this.inAttackRange() && this.getCurrentMeleeAttack().ready <= 0) {
			var atk = this.getCurrentMeleeAttack();
			var hit = getEnemiesInArc(atk);
			if (hit.length <= 0) return null;
			return [atk, this, hit];
		}
	}
    player.thinkMove = function() {
		this.attack = this.getCurrentMeleeAttack();
		var d;

		var tgt = this.target;
		if (tgt) {
			if (tgt.entity) {
				if (tgt.entity.isDead) {
					this.setTarget(null);
				}
			} else {
				if (dist2(tgt.position, this.position) < this.radius) {
					this.setTarget(null);
				}
			}
		}

		var d = [shouldMoveX(), shouldMoveY()];
		this.velocity = this.stats.speed;

		if (d[0] != 0 || d[1] != 0) {
			this.target = null;
		} else if (this.target) {
			if (this.target.entity && this.inAttackRange(4)) {
				this.velocity = 0;
			}
			d = sub2(this.target.position, this.position);
		} else {
			this.velocity = 0;
		}
		if (d[0] != 0 || d[1] != 0) {
			this.direction = normalize2(d);
		}

		addDebugValue("Player targeting Enemy:", this.target && this.target.entity ? "yes" : "no");

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

