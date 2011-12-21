function draw() {
    preDraw();
    drawHud();
	prepareHudForMinimap();

    drawEnemies();
    drawEnvironment();
    drawSelections();
    drawSpecial();
    drawPlayers();
	
	if (!in2dWorld) {
		for(var i = 0; i < SceneModels.length; i++)
			SceneModels[i].Draw();
	}
	
    postDraw();
}

function preDraw() {
    clearDraw();

    var ctx = target.context;

    ctx.translate(target.width() / 2, target.height() / 2);
    getCamera().preDraw(ctx);

	PreDrawGL();
}

var g_eyeSpeed          = 0.1;
var g_eyeHeight         = 2;
var g_eyeRadius         = 3;
  var clock = 0.0;
  var projection = new Float32Array(16);
  var tdlview = new Float32Array(16);
  var world = new Float32Array(16);
  var worldInverse = new Float32Array(16);
  var viewProjection = new Float32Array(16);
  var worldViewProjection = new Float32Array(16);
  var viewInverse = new Float32Array(16);
  var eyePosition = new Float32Array(3);
  var tdltarget = new Float32Array(3);
  var tdlup = new Float32Array([0,1,0]);
function postDraw() {
    var fog = calcFog();
    if (in2dWorld) {
        fog.draw2d();
    } else {
		if(GameState != GAME_STATE.LOADING)
		{
			Loader.DrawModels(new Date().getTime());
			glNumbers.draw();
			glBars.draw();
	
			eyePosition[0] = Math.sin(clock * g_eyeSpeed) * g_eyeRadius;
			eyePosition[1] = g_eyeHeight;
			eyePosition[2] = Math.cos(clock * g_eyeSpeed) * g_eyeRadius;
	
			tdl.fast.matrix4.mul(viewProjection, vMatrix, pMatrix);
			tdl.fast.matrix4.inverse(viewInverse, vMatrix);
	
			tdl.fast.matrix4.translation(world, [0, 0, 0]);
			particleSystem.draw(viewProjection, world, viewInverse);
			//
	
			// Set all alpha to 1...
	
			gl.colorMask(false, false, false, true);
			gl.clearColor(0,0,0,1);
			gl.clear(gl.COLOR_BUFFER_BIT);
		}


    }
}

function calcFog() {
    return calcFogSingle(getLocalPlayer());
}

function initializeFog(ent) {
    return {
        radius: ent.stats.sight,
        position: ent.position,
        intersect: function(line) {
        },
        draw2d: function() {
            var ctx = target.context;
            ctx.save();
            ctx.strokeStyle = "#88888888";
            ctx.translate(this.position[0], this.position[1]);
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI*2, true); 
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        },
    };
}

function calcFogSingle(p) {
    var fog = initializeFog(p);
    var off = [p.stats.sight, p.stats.sight];
    var walls = getWallsInRect(sub2(p.position, off), add2(p.position, off));

    for (var i = 0; i < walls.length; i++) {
        fog.intersect(walls[i].pts);
    }
    return fog;
}


function drawSelections() {
    var arc = getLocalPlayer().getMeleeAttack();
	var objs = getEnemiesInArc(arc);

	for (var i = 0; i < objs.length; i++) {
        drawSelected2d(objs[i]);
	}
}

function drawArc() {
	var ctx = target.context;
    var center = this.getCenter() || this.position;
    var orientation = this.getOrientation() || this.direction;
	ctx.translate(center[0], center[1]);
	ctx.transform(orientation[0], orientation[1], -orientation[1], orientation[0], 0, 0);
	
	var angle = [Math.cos(this.arcAngle), Math.sin(this.arcAngle)];
	ctx.beginPath();
	ctx.moveTo(this.outerRadius * angle[0], this.outerRadius * angle[1]);
	ctx.arc(0, 0, this.outerRadius, this.arcAngle, -this.arcAngle, true);
	ctx.lineTo(this.innerRadius * angle[0], -this.innerRadius * angle[1]);
	ctx.arc(0, 0, this.innerRadius, -this.arcAngle, this.arcAngle, false);
	ctx.lineTo(this.outerRadius * angle[0], this.outerRadius * angle[1]);
	ctx.closePath();

	ctx.globalAlpha = 0.2;
	ctx.fillStyle = "#FF0000";

	ctx.fill();
}

function filterObjects(objs, filters) {
	for (var i = 0; i < filters.length; i++) {
		ret = ret.filter(filters[i]);
	}
	return ret;
}

function getFilteredEnemies(filter) {
	var bounds = filter.getBounds();
	var ret = getEnemiesInRect(bounds[0], bounds[1]);
	return filter.filters ? filterObjects(ret, filter.filters) : ret;
}

function drawEnemies() {
    var view = getViewDrawCircle();
	var objs = getEnemiesInCircle(view[0], view[1]);

	for (var i = 0; i < objs.length; i++) {
        var e = objs[i];
        if (entityCanSee(getLocalPlayer(), e)) {
            drawObject(objs[i]);
        }
	}
}

function drawSelected2d(o) {
    target.context.save();
    o.drawSelected();
    target.context.restore();
}

function drawObject(o) {
    if (in2dWorld) {
        drawObject2d(target.context, o);
    } else {
		drawObject2d(hud.context, o);
		if(o.drawGL)
        	o.drawGL();
    }
}

function drawObject2d(ctx, o) {
	ctx.save();
    o.draw(ctx);
	ctx.restore();
}

function getViewDrawCircle() {
	return [getLocalPlayer().position, 1000]
}

function getEntitiesInRect(topLeft, bottomRight) {
    var idx = entityBuckets.getBucketsFromRect(topLeft, bottomRight);
    var ret = [];
    for (var i = 0; i < idx.length; i++) {
        var bucket = entityBuckets.getBucket(idx[i]);
        ret = ret.concat(bucket);
    }
	return ret;
}

function getEntitiesInCircle(center, radius) {
	var ret = getEntitiesInRect(sub2(center, [radius, radius]), add2(center, [radius, radius]));
    return ret.filter(function(obj) {
        return pointInCircle(obj.position, center, obj.radius + radius);
    });
}

function getEntitiesInArc(arc) {
    var center = arc.getCenter();
    var orientation = arc.getOrientation();
    var off = [arc.outerRadius, arc.outerRadius];
	var ret = getEntitiesInRect(sub2(center, off), add2(center, off));
	ret = ret.filter(function(obj) {
		return pointInCircle(obj.position, center, arc.outerRadius + obj.radius);
	});
	if (arc.innerRadius && arc.innerRadius > 0) {
		ret = ret.filter(function(obj) {
			if (obj.radius > arc.innerRadius) return true;
			return !pointInCircle(obj.position, center, arc.innerRadius - obj.radius);
		});
	}
    if (arc.arcAngle && arc.arcAngle < Math.PI) {
        if (!arc.minDotProduct) {
            arc.minDotProduct = Math.cos(arc.arcAngle);
        }
        ret = ret.filter(function(obj) {
            var off = sub2(obj.position, center);
            var dot = dot2(off, orientation) / length2(off);
            return dot > arc.minDotProduct;
        });
    }

	return ret;
}

function getEnemiesInRect(topLeft, bottomRight) {
	return getEntitiesInRect(topLeft, bottomRight).filter(function(e) { return !e.isPlayer; });
}
function getEnemiesInCircle(topLeft, bottomRight) {
	return getEntitiesInCircle(topLeft, bottomRight).filter(function(e) { return !e.isPlayer; });
}
function getEnemiesInArc(topLeft, bottomRight) {
	return getEntitiesInArc(topLeft, bottomRight).filter(function(e) { return !e.isPlayer; });
}


function drawPlayers() {
    var players = getPlayers();
    for (var i = 0; i < players.length; i++) {
        drawObject(players[i]);
    }
}

function drawEnvironment() {
    var walls = getWalls();
    for (var i = 0; i < walls.length; i++) {
        var w = walls[i];
        drawObject(w);
    }
}

function drawSpecial() {
	drawEffects();
	// draw selection indicator? other stuff?
	drawObject(getLocalPlayer().getMeleeAttack());
}

function drawEffects() {
	var efs = effects;
	for (var i = 0; i < efs.length; i++) {
		drawObject(efs[i]);
	}
}

function drawCircle(ctx) {
    ctx.fillStyle = this.fillStyle || "#FFFFFF";
    ctx.translate(this.position[0], this.position[1]);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
	if (this.direction) {
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(this.direction[0] * this.radius, this.direction[1] * this.radius);
		ctx.closePath();
		ctx.strokeStyle = "#FFFFFF";
		ctx.stroke();
	}
}

function drawCircleSelected() {
	var ctx = target.context;
	ctx.strokeStyle = "#888888";
	ctx.translate(this.position[0], this.position[1]);
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(0, 0, this.radius + 3, 0, Math.PI*2, false); 
	ctx.closePath();
	ctx.stroke();
}

function clearCanvas(tgt) {
	// setting width clears canvas and canvas state correctly... but is slow
	tgt.canvas.width = tgt.canvas.width;
	
	/*
	// This should clear the important stuff... but seems to be screwing up the HUD.
	tgt.context.setTransform(1, 0, 0, 1, 0, 0);
	tgt.context.clearRect(0, 0, tgt.width(), tgt.height());
	tgt.context.globalAlpha = 1;
	*/
}

function clearDraw() {
	clearCanvas(target);
	clearCanvas(hud);
}

var in2dWorld = false;

function swapWorld() {
	var d2 = document.getElementById("2dDiv");
	var d3 = document.getElementById("3dDiv");
	if(d2.style.display === "none"){
		d2.style.display = "inline";
		d3.style.display = "none";
        in2dWorld = true;
	}
	else{
		d2.style.display = "none";
		d3.style.display = "inline";
        in2dWorld = false;
	}
}

function getImage(fname, success) {
	var imageObj = new Image();
	imageObj.src = fname;
	imageObj.onload = function() { success(imageObj); };
}


