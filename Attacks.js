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
        ctx.strokeRect(0, 0, 100, 100);

		if (this.image) {
			ctx.drawImage(this.image, 0, 0, 100, 100);
		} else {
			ctx.font = "8pt sans-serif";
			ctx.fillText(this.name, 5, 40);
		}

        if (this.ready > 0) {
            ctx.beginPath();
            ctx.moveTo(50, 50);
            ctx.arc(50, 50, 100, -Math.PI / 2, -Math.PI / 2 - 2 * Math.PI * (this.ready / this.wait), true);
            ctx.closePath();
            ctx.fillStyle = "#000000";
            ctx.globalAlpha = 0.7;
            ctx.fill();
        }


        ctx.restore();
    };
    this.apply = function(src, tgt) {
		tgt.damage(this.damage);
	};
}

function setImage(a, fname) {
	getImage(fname, function(img) { a.image = img; });
}

var attacksInitialized;
var meleeAttacks;
var rangedAttacks;
var specialAttacks;

var lightningEmitterParams = {
	numParticles: 50,
	lifeTime: 1,
	startSize: 1,
	endSize: 6,
	position:[0, 10, 0],
	positionRange:[0, 0, 10],
	velocity:[0, 0, 0],
	velocityRange: [8, 4, 8],
	worldAcceleration: [0, -1, 0],
	spinSpeedRange: 4
};
function getLightningEmitter() {
	var emitter = particleSystem.createTrail(3000, lightningEmitterParams);
	emitter.setState(tdl.particles.ParticleStateIds.ADD);
	emitter.setColorRamp(
			[1, 1, 1, 1,
			1, 1, 0, 1,
			1, 1, 0, 0.5,
			0, 0, 0, 0.25,
			0, 0, 0, 0]);
	return emitter;
}

var healEmitterParams = {
	numParticles: 1000,
	lifeTime: 5,
	timeRange: 5,
	startSize: 6,
	endSize: 12,
	velocity:[0, 3, 0],
	velocityRange: [12, 1, 12],
	positionRange: [10, 0, 10],
	worldAcceleration: [0, -1, 0],
	spinSpeedRange: 4
};
function getHealEmitter() {
	var emitter = particleSystem.createParticleEmitter();
	emitter.setState(tdl.particles.ParticleStateIds.ADD);
	emitter.setParameters(healEmitterParams);
	emitter.setColorRamp(
			[0, 0, 1, 1,
			0, 0.7, 0.7, 1,
			0, 0.7, 0.7, 0.5,
			0, 0, 0, 0.25,
			0, 0, 0, 0]);
	return emitter;
}

var iceEmitterParams = {
	numParticles: 1000,
	lifeTime: 5,
	timeRange: 5,
	startSize: 6,
	endSize: 12,
	velocity:[0, 0, 0],
	velocityRange: [12, 1, 12],
	position: [0, 50, 0],
	positionRange: [10, 0, 10],
	worldAcceleration: [0, -8, 0],
	spinSpeedRange: 4
};
function getIceEmitter() {
	var emitter = particleSystem.createParticleEmitter();
	emitter.setState(tdl.particles.ParticleStateIds.ADD);
	emitter.setParameters(iceEmitterParams);
	emitter.setColorRamp(
			[1, 1, 1, 1,
			0, 0.0, 1, 1,
			0, 0.0, 1, 0.5,
			0, 0, 0, 0.25,
			0, 0, 0, 0]);
	return emitter;
}

var fireballEmitterParams = {
		numParticles: 1000,
		lifeTime: 5,
		timeRange: 5,
		startSize: 6,
		endSize: 12,
		velocity:[0, 15, 0],
		velocityRange: [8, 5, 8],
		positionRange: [10, 0, 10],
		worldAcceleration: [0, -4, 0],
		spinSpeedRange: 4
};
function getFireballEmitter() {
	var emitter = particleSystem.createParticleEmitter();
	emitter.setState(tdl.particles.ParticleStateIds.ADD);
	emitter.setColorRamp(
			[1, 1, 0, 1,
			1, 0, 0, 1,
			1, 0, 0, 0.5,
			0, 0, 0, 0.25,
			0, 0, 0, 0]);
	emitter.setParameters(fireballEmitterParams);
	return emitter;
}
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
		ret.description = "Cast out a large slow moving boulder. It will do massive damage to the first enemy that it hits.";
		setImage(ret, "icons/Moon Mod 1.png");
        ret.attack = function(src, tgt) { 
            if (this.ready > 0) return null;
            this.ready = this.cooldown;
            this.wait = this.cooldown;
            tgt = tgt.position || tgt;
            var dmg = this.damage;
            createProjectile(modelDrawer("bolder"), src.position, tgt, 2, 14, 500, function(e) { return !e.isPlayer; }, function(e) { e.damage(dmg, src); }, false);
        }
        return ret;
    };
    var lightningBolt = function (player) {
        var ret = new Attack(player);
        ret.damage = 10;
        ret.cooldown = msToTicks(30000);
        ret.name = "Lightning Bolt";
		ret.description = "Cast out a lightning bolt. It will deal damage to all enemies in a straight line.";
		setImage(ret, "icons/123.png");
        ret.attack = function(src, tgt) { 
            if (this.ready > 0) return null;
            this.ready = this.cooldown;
            this.wait = this.cooldown;
            tgt = tgt.position || tgt;
            var dmg = this.damage;
            var proj = createProjectile(modelDrawer("lightningBolt"), src.position, tgt, 10, 6, 500, function(e) { return !e.isPlayer; }, function(e) { e.damage(dmg, src); }, true);
			proj.scale = vec3.scale(proj.scale, 60);
			//proj.preRotate0 = 0;
			proj.preRotate = -Math.PI / 2;
			//proj.preRotate2 = Math.PI / 2;
			//proj.offset[0] = 50;

			addEmitter(proj, getLightningEmitter());
        }
        return ret;
    };

    var fireball = function (player) {
        var ret = new Attack(player);
		ret.damage = 2;
        ret.name = "Fireball";
		ret.description = null;
		ret.radius = 18;
        ret.cooldown = msToTicks(30000);
		setImage(ret, "icons/Fire Mod 1.png");
        ret.attack = function(src, tgt) { 
            if (this.ready > 0) return null;
            this.ready = this.cooldown;
            this.wait = this.cooldown;
            tgt = tgt.position || tgt;

			effect = createStationaryEffect(nullDrawer(), createArc(tgt, ret.radius),
					msToTicks(5000), msToTicks(500),
					function(e) { return true; },
					function(e) { 
						e.damage(ret.damage, src);
					});
			addEmitter(effect, getFireballEmitter());
        }
        return ret;
    };
    var icestorm = function (player) {
        var ret = new Attack(player);
        ret.name = "Ice Storm";
		ret.description = null;
		ret.radius = 18;
        ret.cooldown = msToTicks(10000);
		setImage(ret, "icons/15.png");
        ret.attack = function(src, tgt) { 
            if (this.ready > 0) return null;
            this.ready = this.cooldown;
            this.wait = this.cooldown;
            tgt = tgt.position || tgt;
			var effect = createStationaryEffect(nullDrawer(), createArc(tgt, ret.radius),
					msToTicks(2500), msToTicks(200),
					function(e) { return true; },
					function(e) { 
						if (hasMoveEffect(e)) return;
						var slow = function(ent) {
							ent.velocity *= 0.3;
						}
						var effect = createEffect(slow);
						effect.lifetime = msToTicks(20000);
						addEmitter(effect, getEntityEmitter([0, 0, 1]));
						addMoveEffect(e, effect);
					});
			addEmitter(effect, getIceEmitter());
        }
        return ret;
    };
    var heal = function (player) {
        var ret = new Attack(player);
		ret.damage = 10;
        ret.name = "Healing Circle";
		ret.description = null;
		ret.radius = 15;
        ret.cooldown = msToTicks(90000);
		setImage(ret, "icons/16.png");
        ret.attack = function(src, tgt) { 
            if (this.ready > 0) return null;
            this.ready = this.cooldown;
            this.wait = this.cooldown;
            tgt = tgt.position || tgt;
			var effect = createStationaryEffect(nullDrawer(), createArc(tgt, ret.radius),
					msToTicks(2500), msToTicks(300),
					function(e) { return true; },
					function(e) { 
						e.heal(ret.damage, src);
					});
			addEmitter(effect, getHealEmitter());
        }
        return ret;
    };
    var dummy = function (player) {
        var ret = new Attack(player);
		ret.damage = 2;
        ret.name = "Unavailable";
		ret.description = null;
		ret.radius = 18;
        ret.cooldown = msToTicks(30000);
		setImage(ret, "icons/17.png");
        ret.attack = function(src, tgt) { 
            if (this.ready > 0) return null;
            this.ready = this.cooldown;
            this.wait = this.cooldown;
            tgt = tgt.position || tgt;
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
		ret.description = "I bet you wish you had something more than this puny thing...";
        ret.getCenter = ret.getPlayerPosition;

        ret.outerRadius = player.radius + rng;
        ret.innerRadius = 0;
		ret.range = rng;
        ret.arcAngle = Math.PI / 4;
		ret.cooldown = msToTicks(500);
		ret.damage = 7;
		ret.ready = 0;
		ret.apply = basicApply(ret.apply);
		setImage(ret, "icons/dagger.png");
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
		setImage(ret, "icons/slingshot.png");
        ret.damage = 4;
        ret.cooldown = msToTicks(1000);
        ret.name = "Slingshot";
		ret.description = "Your trusty slingshot. It will shoot where you point it, but don't expect much damage.";
        ret.attack = function(src, tgt) { 
            basicCooldown.apply(this, [src]);
            tgt = tgt.position || tgt;
            var dmg = this.damage;
            var proj = createProjectile(modelDrawer("bolder"), src.position, tgt, 8, 2, 500, function(e) { return !e.isPlayer; }, function(e) { e.damage(dmg, src); }, false);
			proj.offset[1] = 20;
        }
        return ret;
    };

	meleeAttacks = [daggerAttack, axeAttack, saberAttack];
    rangedAttacks = [bowAttack];
    specialAttacks = [earthAttack, lightningBolt, fireball, icestorm, dummy, dummy, dummy, dummy, dummy, heal];

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

