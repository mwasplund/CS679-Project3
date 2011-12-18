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
    this.ready = 0;
    this.draw = drawArc;
    this.drawHud = function (ctx) {
        ctx.save();

        ctx.strokeStyle = "#000000";
        ctx.font = "8pt sans-serif";
        ctx.strokeRect(0, 0, 100, 100);
        ctx.fillText(this.name, 5, 40);

        if (this.ready > 0) {
            ctx.beginPath();
            ctx.moveTo(50, 50);
            ctx.arc(50, 50, 100, -Math.PI / 2, -Math.PI / 2 - 2 * Math.PI * (this.ready / this.wait), true);
            ctx.closePath();
            ctx.fillStyle = "#000000";
            ctx.globalAlpha = 0.5;
            ctx.fill();
        }

        ctx.restore();
    };
    this.apply = function(src, tgt) {
		tgt.damage(this.damage);
	};
}

var attacksInitialized;
var meleeAttacks;
var rangedAttacks;
var specialAttacks;

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

    var earthAttack = function (player) {
        var ret = new Attack(player);
        ret.damage = 40;
        ret.cooldown = msToTicks(20000);
        ret.name = "Crushing Boulder";
        ret.attack = function(src, tgt) { 
            if (this.ready > 0) return null;
            this.ready = this.cooldown;
            this.wait = this.cooldown;
            tgt = tgt.position || tgt;
            var dmg = this.damage;
            createProjectile(Loader.GetModel("bolder"), src.position, tgt, 2, 14, 500, function(e) { return !e.isPlayer; }, function(e) { e.damage(dmg, src); }, false);
        }
        return ret;
    };
    var lightningAttack = function (player) {
        var ret = new Attack(player);
        ret.damage = 10;
        ret.cooldown = msToTicks(15000);
        ret.name = "Lightning Bolt";
        ret.attack = function(src, tgt) { 
            if (this.ready > 0) return null;
            this.ready = this.cooldown;
            this.wait = this.cooldown;
            tgt = tgt.position || tgt;
            var dmg = this.damage;
            createProjectile(Loader.GetModel("Sphere"), src.position, tgt, 16, 6, 500, function(e) { return !e.isPlayer; }, function(e) { e.damage(dmg, src); }, true);
        }
        return ret;
    };
    var fireAttack = function (player) {
        var ret = new Attack(player);
        ret.name = "Unavailable";
        ret.attack = function(src, tgt) { 
            if (this.ready > 0) return null;
            this.ready = this.cooldown;
            this.wait = this.cooldown;
            tgt = tgt.position || tgt;
            Debug.debug("fire");
        }
        return ret;
    };
    var iceAttack = function (player) {
        var ret = new Attack(player);
        ret.name = "Unavailable";
        ret.attack = function(src, tgt) { 
            if (this.ready > 0) return null;
            this.ready = this.cooldown;
            this.wait = this.cooldown;
            tgt = tgt.position || tgt;
            Debug.debug("ice");
        }
        return ret;
    };


    var basicCooldown = function(src) {
        for (var i = 0; i < src.basicAttacks.length; i++) {
            src.basicAttacks[i].ready = this.cooldown;
            src.basicAttacks[i].wait = this.cooldown;
        }
    }

	var basicApply = function(old) {
		return function(src, tgt) {
            basicCooldown.apply(this, [src]);
			old.apply(this, [src, tgt]);
		}
	};
    var daggerAttack = function(player) {
		var rng = 15;
        var ret = new Attack(player);
        ret.name = "Little Dagger";
        ret.getCenter = ret.getPlayerPosition;

        ret.outerRadius = player.radius + rng;
        ret.innerRadius = 0;
		ret.range = rng;
        ret.arcAngle = Math.PI / 4;
		ret.cooldown = msToTicks(300);
		ret.damage = 4;
		ret.ready = 0;
		ret.apply = basicApply(ret.apply);
        return ret;
    };

    var axeAttack = function(player) {
		var rng = 15;
        var ret = new Attack(player);
        ret.name = "Battle Axe";
        ret.getCenter = ret.getPlayerPosition;

        ret.outerRadius = player.radius + rng;
        ret.innerRadius = 0;
		ret.range = rng;
        ret.arcAngle = Math.PI / 4;
		ret.cooldown = msToTicks(1800);
		ret.damage = 24;
		ret.ready = 0;
		ret.apply = basicApply(ret.apply);
        return ret;
    };

    var saberAttack = function(player) {
		var rng = 30;
        var ret = new Attack(player);
        ret.name = "Light Sword";
        ret.getCenter = ret.getPlayerPosition;

        ret.outerRadius = player.radius + rng;
        ret.innerRadius = 0;
		ret.range = rng;
        ret.arcAngle = Math.PI / 4;
		ret.cooldown = msToTicks(1000);
		ret.damage = 12;
		ret.ready = 0;
		ret.apply = basicApply(ret.apply);
        return ret;
    };

    var bowAttack = function (player) {
        var ret = new Attack(player);
        ret.damage = 4;
        ret.cooldown = msToTicks(1000);
        ret.name = "Ranger's Bow";
        ret.attack = function(src, tgt) { 
            basicCooldown.apply(this, [src]);
            tgt = tgt.position || tgt;
            var dmg = this.damage;
            createProjectile(Loader.GetModel("Sphere"), src.position, tgt, 8, 2, 500, function(e) { return !e.isPlayer; }, function(e) { e.damage(dmg, src); }, false);
        }
        return ret;
    };

	meleeAttacks = [daggerAttack, axeAttack, saberAttack];
    rangedAttacks = [bowAttack];
    specialAttacks = [earthAttack, lightningAttack, fireAttack, iceAttack, iceAttack, iceAttack, iceAttack, iceAttack, iceAttack, iceAttack];

	attacksInitialized = true;
}

function getAttacks(p) {
	p.basicAttacks = [];
    p.setMeleeAttack(meleeAttacks[0](p));
    p.setRangedAttack(rangedAttacks[0](p));

	p.specialAttacks = [];
	for (var i = 0; i < specialAttacks.length; i++) {
		p.specialAttacks.push(specialAttacks[i](p));
	}
}

