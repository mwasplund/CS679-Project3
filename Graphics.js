function draw() {
	preDraw();
    drawEnemies();
	drawEnvironment();
    drawSelections();
	drawSpecial();
    drawPlayer();
	drawHud();
    postDraw();
}

function preDraw() {
    clear();

    var ctx = target.context;
    ctx.setTransform(1, 0, 0, -1, 0, 0);
    ctx.translate(target.width() / 2, -target.height() / 2);
	var camera = getCamera();
	ctx.translate(camera.position[0], camera.position[1]);
}

function postDraw() {
}

function drawSelections() {
    var arc = getAttackArc();
	var objs = getEnemiesInArc(arc);

	for (var i = 0; i < objs.length; i++) {
        drawSelected2d(objs[i]);
	}
}

function drawArc() {
	var ctx = target.context;
    var center = this.getCenter();
    var orientation = this.getOrientation();
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
	var ret = getEnemiesInGrid(bounds[0], bounds[1]);
	return filter.filters ? filterObjects(ret, filter.filters) : ret;
}

function drawEnemies() {
    var view = getViewDrawCircle();
	var objs = getEnemiesInCircle(view[0], view[1]);

	for (var i = 0; i < objs.length; i++) {
        drawObject2d(objs[i]);
	}
}

function drawSelected2d(o) {
    target.context.save();
    o.drawSelected();
    target.context.restore();
}

function drawObject2d(o) {
    target.context.save();
    o.draw();
    target.context.restore();
}

function getViewDrawCircle() {
    return [[0, 0], 1000];
}

var enemies = [];
function getEnemies() {
    return enemies;
}

function getEnemiesInGrid(topLeft, bottomRight) {
	return getEnemies();
}

function getEnemiesInCircle(center, radius) {
	var ret = getEnemiesInGrid(sub2(center, radius), add2(center, radius));
    return ret.filter(function(obj) {
        return pointInCircle(obj.position, center, obj.radius + radius);
    });
}

function getEnemiesInArc(arc) {
    var center = arc.getCenter();
    var orientation = arc.getOrientation();
	var ret = getEnemiesInGrid(sub2(center, arc.outerRadius), add2(center, arc.outerRadius));
	ret = ret.filter(function(obj) {
		return pointInCircle(obj.position, center, arc.outerRadius + obj.radius);
	});
	if (arc.innerRadius && arc.innerRadius > 0) {
		ret = ret.filter(function(obj) {
			if (obj.radius > arc.innerRadius) return true;
			return !pointInCircle(obj.position, center, arc.innerRadius - obj.radius);
		});
	}

	return ret;
}

function drawPlayer() {
    drawObject2d(getPlayer());
}

function drawEnvironment() {
}

function drawSpecial() {
	// draw selection indicator? other stuff?
	drawObject2d(getAttackArc());
}

function drawCircle() {
    var ctx = target.context;
    ctx.fillStyle = this.fillStyle;
    ctx.translate(this.position[0], this.position[1]);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
}

function clearCanvas(tgt) {
    tgt.context.setTransform(1, 0, 0, 1, 0, 0);
	tgt.context.clearRect(0, 0, tgt.width(), tgt.height());
}

function clear() {
	clearCanvas(target);
	clearCanvas(hud);
}

var in2dWorld = true;

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

