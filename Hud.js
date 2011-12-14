var hudBounds = [[0, 80], [100, 100]];
var minimap = [[81, 81], [99, 99]];
var stats = [[1, 81], [19, 99]];
var health = [[30, 81], [70, 84]];
var basic = [[20, 85], [30, 99]];
var melee = [[21, 90], [27, 96]];
var ranged  = [[28, 90], [34, 96]];
var special = [[31, 85], [80, 99]];

function drawScaledRect(tgt, rect, style) {
	var p = [rect[0][0], rect[0][1]];
	var b = [rect[1][0], rect[1][1]];
	if (drawTick == 1) Debug.debug(p.toString() + b.toString());

	tgt.context.strokeStyle = style || "#000000";
	tgt.context.strokeRect(p[0], p[1], b[0], b[1]);
}
function drawHudRects() {
	var hudHeight = hud.height() * getOptions().hudHeight;
	hudHeight = Math.min(hudHeight, 0.25 * hud.width());
	var hudRect = [[0, hud.height() - hudHeight], [hud.width(), hudHeight]];

	var spacer = hudHeight * 0.05;
	var minimapHeight = hudHeight - 2 * spacer;
	var minimapRect = [[hud.width() - spacer - minimapHeight, hud.height() - spacer - minimapHeight], [minimapHeight, minimapHeight]];

	var statsRect = [add2(hudRect[0], [spacer, spacer]), [2 * minimapHeight, minimapHeight]];
	var statsRight = statsRect[0][0] + statsRect[1][0];

	var healthHeight = hudHeight * 0.16;
	var healthWidth = (hud.width() - 4 * spacer - 2 * minimapHeight) * 0.5;
	var healthOff = Math.max((hud.width() - healthWidth) / 2, statsRight + spacer);
	var healthRect = [[healthOff, hudRect[0][1] + spacer], [healthWidth, healthHeight]];

	var innerHudRect = [[statsRight + spacer, hudRect[0][1] + healthHeight + 2 * spacer],
		[minimapRect[0][0] - statsRight - 2 * spacer, hudRect[1][1] - 3 * spacer - healthHeight]];

	var numAttacks = getLocalPlayer().getSpecialAttacks().length + 2;
	var widthPerAttack = Math.min((innerHudRect[1][0] - 5 * spacer) / numAttacks - spacer, innerHudRect[1][1] - 4 * spacer);

	var basicAttackWidth = 2 * (widthPerAttack + spacer) + spacer;
	var specialAttackWidth = (numAttacks - 2) * (widthPerAttack + spacer) + spacer;
	var attackRectHeight = innerHudRect[1][1] - 2 * spacer;

	var innerSpacer = (innerHudRect[1][0] - basicAttackWidth - specialAttackWidth) / 3;
	innerSpacer = spacer;
	var innerBottomRight = add2(innerHudRect[0], innerHudRect[1]);

	var vertAttackSpacer = (innerHudRect[1][1] - widthPerAttack - 4 * spacer) / 2;

	var basicAttackRect = [add2(innerHudRect[0], [innerSpacer, spacer]), [basicAttackWidth, attackRectHeight]];
	var meleeAttackRect = [add2(basicAttackRect[0], [spacer, spacer + vertAttackSpacer]), [widthPerAttack, widthPerAttack]];
	var rangedAttackRect = [add2(meleeAttackRect[0], [spacer + widthPerAttack, 0]), [widthPerAttack, widthPerAttack]];
	var specialAttackRect = [sub2(innerBottomRight, [innerSpacer + specialAttackWidth, spacer + attackRectHeight]), [specialAttackWidth, attackRectHeight]];
		
	drawScaledRect(hud, hudRect, "#000000");
	drawScaledRect(hud, minimapRect, "#AAAAAA");
	drawScaledRect(hud, statsRect, "#666666");
	drawScaledRect(hud, healthRect, "#FF0000");
	drawScaledRect(hud, innerHudRect, "#000000");
	drawScaledRect(hud, basicAttackRect, "#00FF00");
	drawScaledRect(hud, specialAttackRect, "#0000FF");
	drawScaledRect(hud, meleeAttackRect, "#FFFF00");
	drawScaledRect(hud, rangedAttackRect, "#00FFFF");

	var attackRect = [add2(specialAttackRect[0], [spacer, spacer + vertAttackSpacer]), [widthPerAttack, widthPerAttack]];
	for (var i = 0; i < numAttacks - 2; i++) {
		drawScaledRect(hud, attackRect, "#FF00FF");
		attackRect[0][0] += spacer + widthPerAttack;
	}
}

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
    drawAttacksVec(player.basicAttacks, ctx);

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
    drawAttacksVec(player.specialAttacks, ctx);

    ctx.restore();
}

function drawAttacksVec(atks, ctx) {
	ctx.save();
    // working in [450, 100]

    var sqW = 450 / atks.length;
    var outerW = Math.min(sqW, 90);
    var innerW = outerW * 0.9;

    for (var i = 0; i < atks.length; i++) {
        var off0 = (sqW - outerW) / 2;
        ctx.translate(off0, 0);
        if (atks[i].isSelected) {
            ctx.strokeStyle = "#FFFFFF";
            ctx.strokeRect(0, 0, outerW, outerW);
        }
        var off1 = (outerW - innerW) / 2;
        ctx.translate(off1, off1);
        ctx.save();
        ctx.scale(innerW / 100, innerW / 100);
        atks[i].drawHud(ctx);
        ctx.restore();
        ctx.translate(sqW - off0 - off1, 0 - off1);
    }
	ctx.restore();
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

function prepareHudForMinimap() {
	//hud.translate(
}

function drawHud() {
	var ctx = hud.context;
// health, powerup stuff, minimap?
  //drawHealth(ctx);
  drawDebugData(ctx);
  //drawAttacks(ctx);

  drawHudRects();
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

