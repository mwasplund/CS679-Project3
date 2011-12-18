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

var hudRects;
function calculateHudRects() {
	if (!hud || !hud.context) return;
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

	var innerHudRect = [[statsRight, hudRect[0][1] + healthHeight + 1 * spacer],
		[minimapRect[0][0] - statsRight - 0 * spacer, hudRect[1][1] - 1 * spacer - healthHeight]];

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
		
	hudRects = {};
	hudRects.spacer = spacer;
	hudRects.hud = hudRect;
	hudRects.inner = innerHudRect;
	hudRects.minimap = minimapRect;
	hudRects.health = healthRect;
	hudRects.basicGroup = basicAttackRect;
	hudRects.stats = statsRect;
	hudRects.specialGroup = specialAttackRect;
	hudRects.melee = meleeAttackRect;
	hudRects.ranged = rangedAttackRect;
	hudRects.specialAttacks = [];

	var attackRect = [add2(specialAttackRect[0], [spacer, spacer + vertAttackSpacer]), [widthPerAttack, widthPerAttack]];
	for (var i = 0; i < numAttacks - 2; i++) {
		hudRects.specialAttacks.push([attackRect[0].slice(0), attackRect[1].slice(0)]);
		attackRect[0][0] += spacer + widthPerAttack;
	}
}

function prepareRect(ctx, expected, actual, shouldClip) {
	if (shouldClip) {
        ctx.beginPath();
        ctx.rect(actual[0][0] - 1, actual[0][1] - 1, actual[1][0] + 2, actual[1][1] + 2);
        ctx.closePath();
        ctx.clip();
	}
	ctx.translate(actual[0][0] - expected[0][0], actual[0][1] - expected[0][1]);
	ctx.scale(actual[1][0] / expected[1][0], actual[1][1] / expected[1][1]);
}

var healthExpected = [200, 10];
function drawHealth(ctx) {
	ctx.save();
	prepareRect(ctx, [[0, 0], healthExpected], hudRects.health);

    var hp = getLocalPlayer().getHealth();
	var sc = healthExpected;

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


function drawAttack(ctx, attack, rect) {
	ctx.save();
	if (attack.isSelected) {
		ctx.strokeStyle = "#FFFFFF";
		var off = hudRects.spacer / 2;
		ctx.strokeRect(rect[0][0] - off, rect[0][1] - off, rect[1][0] + 2 * off, rect[1][1] + 2 * off);
	}
	prepareRect(ctx, [[0, 0], [100, 100]], rect, true);
	attack.drawHud(ctx);
	ctx.restore();
}


function prepareHudForMinimap() {
	var ctx = hud.context;
	var rect = hudRects.minimap;
	prepareRect(ctx, [[0, 0], [1000, 1000]], hudRects.minimap, true);
	ctx.translate(500, 500);
	getCamera().preDraw(ctx);
}

function drawHud() {
	calculateHudRects();
	var ctx = hud.context;
// health, powerup stuff, minimap?
  drawDebugData(ctx);

	drawScaledRect(hud, hudRects.hud, "#000000");
	drawScaledRect(hud, hudRects.minimap, "#AAAAAA");
	drawScaledRect(hud, hudRects.stats, "#666666");
	//drawScaledRect(hud, hudRects.inner, "#000000");
	drawScaledRect(hud, hudRects.basicGroup, "#000000");
	drawScaledRect(hud, hudRects.specialGroup, "#000000");

	drawHealth(ctx);
	
	var attacks = getLocalPlayer().getSpecialAttacks();
	for (var i = 0; i < attacks.length; i++) {
		drawAttack(ctx, attacks[i], hudRects.specialAttacks[i]);
	}
	drawAttack(ctx, getLocalPlayer().getMeleeAttack(), hudRects.melee);
	drawAttack(ctx, getLocalPlayer().getRangedAttack(), hudRects.ranged);
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

