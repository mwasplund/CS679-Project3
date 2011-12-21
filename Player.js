var player;
function drawEntity() {
	glBars.addBar(this.getHealth(), [this.position[0], this.height, this.position[1]], this.isPlayer ? [0, 1, 0] : [1, 0, 0]);
	if (this.model) {
		drawModel.apply(this);
	}
}
function entityHealth() {
	return Math.min(1, Math.max(0, this.health / this.stats.health));
};
function initializePlayer(i_Model, i_Scale, i_PreRotate, i_Offset) {
	var stats = {
		speed: getOptions().playerVelocity,
        sight: 300,
		health: 200,
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
		height: 40,
        rotation: 0,
        fillStyle: "#00FF44",
		model: i_Model,
        move: entityMove(slidingMove),
		getHealth: entityHealth,
        draw: drawCircle,
		drawGL: drawEntity,
		updateModel: updateModel,
		isPlayer: true,
		health: stats.health,
		damage: entityDamage,
		heal: entityHeal,
		cooldown: function() { 
			for (var i = 0; i < this.basicAttacks.length; i++) {
				this.basicAttacks[i].ready--;
			}
			for (var i = 0; i < this.specialAttacks.length; i++) {
				this.specialAttacks[i].ready--;
			}
		},
    }

    player.setSpecialTarget = function(tgt) {
		if (!tgt) {
			this.specialTarget = null;
		} else {
			this.specialTarget = {
				position: tgt.position || tgt,
				entity: tgt.position ? tgt : null,
			}
		}
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

    player.setMeleeAttack = function(atk) {
        this.meleeAttack = atk;
        this.basicAttacks[0] = atk;
    }
    player.setRangedAttack = function(atk) {
        this.rangedAttack = atk;
        this.basicAttacks[1] = atk;
    }

    player.getMeleeAttack = function() {
        return this.meleeAttack;
    }
    player.getRangedAttack = function() {
        return this.rangedAttack;
    }

	player.getCurrentSpecialAttack = function() {
		return this.specialAttacks[this.currentSpecialAttack];
	}

    initializeAttacks();
	getAttacks(player);


	player.currentSpecialAttack = 0;

    player.cycleSpecialAttack = function(i) {
        var l = this.specialAttacks.length;
        var i = (((this.currentSpecialAttack + i) % l) + l) % l;
        this.setSpecialAttack(i);
    }
    player.setSpecialAttack = function(i) {
        this.getCurrentSpecialAttack().isSelected = false;
        this.currentSpecialAttack = i;
        this.getCurrentSpecialAttack().isSelected = true;
    }
	player.getSpecialAttacks = function() { return this.specialAttacks; }

    player.setSpecialAttack(0);

	player.getSpecialAttackHint = function() {
		return "Right-click to use the selected special ability.";
	}
	player.getBasicAttackHint = function() {
		return "Left-click to use a basic attack. The player will use his melee attack if he's in range, and will use his ranged attack otherwise.";
	}

	player.inAttackRange = inAttackRange;
    player.getPosition = function() {
        return this.position;
    }

    player.getMousePosition = function() {
        return getMouse().getWorldPosition();
    };

	player.thinkAttack = function() {
        var ret;
        if (this.specialTarget) {
            var atk = this.getCurrentSpecialAttack();
            ret = atk.attack(this, this.specialTarget);
        } else if (this.target) {
            if (this.meleeAttack.ready <= 0) {
                var atk = this.getMeleeAttack();
                var hit = getEnemiesInArc(atk);
                if (hit.length <= 0) {
                    ret = this.getRangedAttack().attack(this, this.target);
                } else {
                    ret = [atk, this, hit];
                }
            }
		}
        this.setTarget(null);
        this.setSpecialTarget(null);
        return ret;
	}

    player.thinkMove = function() {
		var d = [shouldMoveX(), shouldMoveY()];
		this.velocity = getEntitySpeed(this);

		if (d[0] != 0 || d[1] != 0) {
			this.direction = normalize2(d);
		} else {
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

