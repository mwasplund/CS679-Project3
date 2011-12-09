function Attack(player) {
	this.damage = 10;
    this.player = player;
    this.getPlayerPosition = function() {
        return this.player.getPosition();
    };
    this.getMousePosition = function() {
        return this.player.getMousePosition();
    };
    this.getOrientation = function() {
		var target;
		if (this.player.target && this.player.target.entity) {
			target = this.player.target.entity.position;
		} else {
			target = this.getMousePosition();
		}
        return normalize2(sub2(target, this.getPlayerPosition()));
    };
    this.draw = drawArc;
    this.apply = function(src, tgt) {
		tgt.damage(this.damage);
	};
}

var attacksInitialized;
function initializeAttacks() {
	if (attacksInitialized) {
		return;
	}
	var specialApply = function(old) {
		return function(src, tgt) {
			this.ready = this.cooldown;
			this.wait = this.cooldown;
			old.apply(this, [src, tgt]);
		}
	};
    var ringAttack = function (player) {
        var ret = new Attack(player);
        ret.getCenter = ret.getPlayerPosition;
        ret.outerRadius = 300;
        ret.innerRadius = 250;
        ret.arcAngle = Math.PI;
        return ret;
    };

    var circleAttack = function (player) {
        var ret = new Attack(player);
        ret.getCenter = ret.getMousePosition;
        ret.outerRadius = 300;
        ret.innerRadius = 250;
        ret.arcAngle = Math.PI;
        return ret;
    };

    var arcAttack = function (player) {
        var ret = new Attack(player);
        ret.getCenter = ret.getMousePosition;
        ret.outerRadius = 150;
        ret.innerRadius = 80;
        ret.arcAngle = Math.PI / 2;
        return ret;
    };


	var meleeApply = function(old) {
		return function(src, tgt) {
			for (var i = 0; i < src.meleeAttacks.length; i++) {
				src.meleeAttacks[i].ready = this.cooldown;
				src.meleeAttacks[i].wait = this.cooldown;
			}
			old.apply(this, [src, tgt]);
		}
	};
    var daggerAttack = function(player) {
		var rng = 15;
        var ret = new Attack(player);
        ret.getCenter = ret.getPlayerPosition;

        ret.outerRadius = player.radius + rng;
        ret.innerRadius = 0;
		ret.range = rng;
        ret.arcAngle = Math.PI / 4;
		ret.cooldown = msToTicks(500);
		ret.damage = 4;
		ret.ready = 0;
		ret.apply = meleeApply(ret.apply);
        return ret;
    };

    var axeAttack = function(player) {
		var rng = 25;
        var ret = new Attack(player);
        ret.getCenter = ret.getPlayerPosition;

        ret.outerRadius = player.radius + rng;
        ret.innerRadius = 0;
		ret.range = rng;
        ret.arcAngle = Math.PI / 4;
		ret.cooldown = msToTicks(1500);
		ret.damage = 24;
		ret.ready = 0;
		ret.apply = meleeApply(ret.apply);
        return ret;
    };

    var saberAttack = function(player) {
		var rng = 35;
        var ret = new Attack(player);
        ret.getCenter = ret.getPlayerPosition;

        ret.outerRadius = player.radius + rng;
        ret.innerRadius = 0;
		ret.range = rng;
        ret.arcAngle = Math.PI / 4;
		ret.cooldown = msToTicks(1000);
		ret.damage = 12;
		ret.ready = 0;
		ret.apply = meleeApply(ret.apply);
        return ret;
    };

	meleeAttacks = [daggerAttack, axeAttack, saberAttack];
    specialAttacks = [ringAttack, circleAttack, arcAttack];

	attacksInitialized = true;
}

var meleeAttacks = [];
var specialAttacks = [];

function getAttacks(p) {
	p.meleeAttacks = [];
	for (var i = 0; i < meleeAttacks.length; i++) {
		p.meleeAttacks.push(meleeAttacks[i](p));
	}
	p.specialAttacks = [];
	for (var i = 0; i < specialAttacks.length; i++) {
		p.specialAttacks.push(specialAttacks[i](p));
	}
}

