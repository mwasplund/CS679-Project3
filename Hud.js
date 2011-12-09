function drawAttacks(ctx) {
    var left = 0.02;
    var right = 0.32;

    var sc = [500, 150];
    var w = hud.width() * (right - left);
    var h = w * sc[1] / sc[0];
    var x = hud.width() * left;
    var y = hud.height() - h - 10;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(w / sc[0], h / sc[1]);

    ctx.strokeRect(0, 0, sc[0], sc[1]);
    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#0000DD";
    ctx.fillText("Melee Attack", 10, 24);

    ctx.translate(25, 30);
    drawAttacksVec(player.meleeAttacks);

    ctx.restore();
    

    left = 0.68;
    right = 0.98
    sc = [500, 150];
    w = hud.width() * (right - left);
    h = w * sc[1] / sc[0];
    x = hud.width() * left;
    y = hud.height() - h - 10;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(w / sc[0], h / sc[1]);
    ctx.strokeRect(0, 0, sc[0], sc[1]);
    ctx.font = "24px sans-serif";
    ctx.fillStyle = "#00DD00";
    ctx.fillText("Ranged Attack", 10, 24);

    ctx.translate(25, 30);
    drawAttacksVec(player.specialAttacks);

    ctx.restore();
}

function drawAttacksVec(atks) {
    // working in [450, 100]

    var sqW = 450 / atks.length;
    var innerW = sqW * 0.9;

    for (var i = 0; i < atks.length; i++) {
        //atks[i].drawHud();
    }
}
function drawHealth(ctx) {
    var hpWidth = 0.3;
    var hp = getLocalPlayer().getHealth();

	var w = hud.width() * hpWidth;
	var h = w / 15;

	var x = (hud.width() - w) / 2;
	var y = hud.height() - h - 20;

	var sc = [200, 10];

	ctx.save();

	ctx.translate(x, y);
	ctx.scale(w / sc[0], h / sc[1]);

	ctx.fillStyle = "#FF0000";
	ctx.strokeStyle = "#000000";

	var offx = [10, 2.5, 10, 7.5, 0];
	var offy = [0, 5, 5/3, 5];

	var strokeShape = function(pts) {
		ctx.beginPath();
		if (pts.length < 1) return;
		ctx.moveTo(pts[0][0], pts[0][1]);
		for (var i = 1; i < pts.length; i++)
			ctx.lineTo(pts[i][0], pts[i][1]);
		ctx.lineTo(pts[0][0], pts[0][1]);
		ctx.closePath();
		ctx.stroke();
	};

	var border = [];
	border.push([10, 0]);
	border.push([2.5, 5]);
	border.push([border[0][0], sc[1] - border[0][1]]);
	for (var i = 2; i >= 0; i--)
		border.push([sc[0] - border[i][0], border[i][1]]);

	strokeShape(border);

	var chrome = [];
	chrome.push([border[0][0], 5/3]);
	chrome.push([7.5, 0]);
	chrome.push([0, 5]);
	chrome.push([chrome[1][0], sc[1] - chrome[1][1]]);
	chrome.push([chrome[0][0], sc[1] - chrome[0][1]]);

	strokeShape(chrome);

	ctx.save();
	ctx.translate(sc[0], sc[1]);
	ctx.rotate(Math.PI);
	strokeShape(chrome);
	ctx.restore();

	var barWidth = (sc[0] - 20) * hp;
	var gradient = ctx.createLinearGradient(0, 0, 0, sc[1]);
	gradient.addColorStop(0, "#000000");
	gradient.addColorStop(0.45, "#FF0000");
	gradient.addColorStop(0.55, "#FF0000");
	gradient.addColorStop(1.0, "#000000");
	ctx.fillStyle = gradient;
    ctx.fillRect((sc[0] - barWidth) / 2, 0, barWidth, sc[1]);
	
	ctx.restore();
}

function drawHud() {
	var ctx = hud.context;
// health, powerup stuff, minimap?
  drawHealth(ctx);
  drawDebugData(ctx);
  drawAttacks(ctx);
}

var debugDataOn = false;
function shouldDrawDebug() {
	return debugDataOn;
}
function toggleDebugData() {
    debugDataOn = !debugDataOn;
}

var debugData = {};
function drawDebugData(ctx) {
	if (!shouldDrawDebug()) return;
	var x = 20;
	var y = 20;
	for (v in debugData) {
		ctx.fillStyle = "#FF0000";
		ctx.fillText(v + ": " + debugData[v], x, y);
		y += 14;
	}
	//debugData = {};
}

function addDebugString(str) {
	debugData[str] = "";
}
function addDebugValue(v, val) {
	debugData[v] = "" + val;
}



function HudObject() {}
HudObject.prototype.update = function() { }
HudObject.prototype.draw = function() { this.drawTo(hud); }
HudObject.prototype.drawGl = function() { this.draw(); }

