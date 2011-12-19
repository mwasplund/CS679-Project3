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

	var aboveHeight = (hud.height() - hudHeight);
	var expandWidth = Math.min(hud.width(), aboveHeight) * 0.92;
	hudRects.expandedMinimap = [[(hud.width() - expandWidth) / 2, (aboveHeight - expandWidth) / 2], [expandWidth, expandWidth]];
		

	var attackRect = [add2(specialAttackRect[0], [spacer, spacer + vertAttackSpacer]), [widthPerAttack, widthPerAttack]];
	for (var i = 0; i < numAttacks - 2; i++) {
		hudRects.specialAttacks.push([attackRect[0].slice(0), attackRect[1].slice(0)]);
		attackRect[0][0] += spacer + widthPerAttack;
	}
}

function prepareRect(ctx, expected, actual, shouldClip) {
	if (shouldClip) {
		clipRect(ctx, [sub2(actual[0], [1, 1]), add2(actual[1], [2, 2])]);
	}
	ctx.translate(actual[0][0] - expected[0][0], actual[0][1] - expected[0][1]);
	ctx.scale(actual[1][0] / expected[1][0], actual[1][1] / expected[1][1]);
}

var healthExpected = [200, 10];
function drawHealth(ctx) {
	ctx.save();
	ctx.lineWidth = 1;
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

	var barWidth = (sc[0] - 20) * hp;
	var gradient = ctx.createLinearGradient(0, 0, 0, sc[1]);
	gradient.addColorStop(0, "#000000");
	gradient.addColorStop(0.45, "#FF0000");
	gradient.addColorStop(0.55, "#FF0000");
	gradient.addColorStop(1.0, "#000000");
	ctx.fillStyle = gradient;
    ctx.fillRect((sc[0] - barWidth) / 2, 0, barWidth, sc[1]);

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

	ctx.restore();
}


function drawAttack(ctx, attack, rect) {
	if (attack.isSelected) {
		ctx.save();
		var tm = new Date().getTime();
		var a = tm / 2000 * Math.PI * 2;
		var off = hudRects.spacer / 2;
		var center = add2(rect[0], scale2(0.5, rect[1]));
		var d = [Math.cos(a), Math.sin(a)];
		//d = scale2(1 / (d[0] + d[1]), d);

		var grad = ctx.createLinearGradient(
				center[0] + d[0] * rect[1][0], center[1] + d[1] * rect[1][1],
				center[0] - d[0] * rect[1][0], center[1] - d[1] * rect[1][1]
				)
		grad.addColorStop(0.0, "#000000");
		grad.addColorStop(0.25, "#000000");
		grad.addColorStop(0.45, "#00BFFF");
		grad.addColorStop(0.55, "#00BFFF");
		grad.addColorStop(0.75, "#000000");
		grad.addColorStop(1.0, "#000000");

		ctx.fillStyle = grad;
		ctx.strokeStyle = grad;
		ctx.lineWidth = 3;
		ctx.strokeRect(rect[0][0] - off, rect[0][1] - off, rect[1][0] + 2 * off, rect[1][1] + 2 * off);
		ctx.restore();
	}
	ctx.save();
	prepareRect(ctx, [[0, 0], [100, 100]], rect, true);
	attack.drawHud(ctx);
	ctx.restore();
}

var hoverStart = 1e100;
var tooltipDelay = 1000;
function drawTooltip(ctx) {
	if (new Date().getTime() - hoverStart < tooltipDelay) return;
	var ctxWidth = hudRects.hud[1][0];
	var spacer = hudRects.spacer;
	var tooltipWidth = Math.min(250, ctxWidth - 2 * spacer);
	var tooltipHeight = tooltipWidth;

	var tooltip = getTooltip();
	if (!tooltip) return;

	var minX = spacer;
	var maxX = ctxWidth - spacer;
	var x = Math.min(maxX - tooltipWidth, Math.max(minX, tooltip.x - tooltipWidth / 2));
	var tx = tooltipWidth * 0.1;
	var ty = tx / 2;
	var y = hudRects.hud[0][1] - spacer - ty;

	var tc = Math.min(maxX - spacer - tx, Math.max(minX + spacer + tx, tooltip.x));

	ctx.save();
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(tc - tx, y);
	ctx.lineTo(tc, y + ty);
	ctx.lineTo(tc + tx, y);
	ctx.lineTo(x + tooltipWidth, y);
	ctx.lineTo(x + tooltipWidth, y - tooltipHeight);
	ctx.lineTo(x, y - tooltipHeight);
	ctx.closePath();
	ctx.clip();
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 3;
	if (hudBackground) {
		ctx.drawImage(hudBackground, 0, 0);
	}
	ctx.stroke();

	prepareRect(ctx,
			[[0, 0], [200, 200]],
			[[x + spacer, y - tooltipHeight + spacer], [tooltipWidth - 2 * spacer, tooltipHeight - 2 * spacer]],
			true);

	tooltip.draw(ctx);

	ctx.restore();
}
function textDraw(txt, w, sz, color) {
	return {
		text: txt,
		maxW: w,
		fontSize: sz,
		fontColor: color,
		draw: function(ctx, x, y) {
			ctx.font = sz + "px sans-serif";
			ctx.fillStyle = color;
			var str = txt;
			var h = 0;
			var lineHeight = this.fontSize + 2;
			while (str != "") {
				var i = str.length;
				var maxW = this.maxW;
				var i = str.length;
				if (ctx.measureText(str).width >= maxW) {
					i = binarySearch(0, str.length, function(v) { return ctx.measureText(str.substr(0, v)).width < maxW; });
					while (i > 0 && str.charAt(i) != " ") i--;
				}
				if (i == 0) break;
				ctx.fillText(str.substr(0, i), x, y + this.fontSize, this.maxW);
				str = str.substr(i + 1);

				y += lineHeight;
				h += lineHeight;
			}
			return h;
		}
	}
}
var hmx = 100;
function makeTooltip(title, description, hint) {
	var ret = {};
	ret.title = textDraw(title, 200, 18, "#000000"),
	ret.description = textDraw(description, 200, 12, "#000000"),
	ret.hint = textDraw(hint, 200, 12, "#999999"),
	ret.draw = function(ctx) {
		if (!this.canvasReady) {
			this.canvas = document.createElement("canvas");
			this.context = this.canvas.getContext("2d");
			this.canvas.width = 200;
			this.canvas.height = 200;
			var dy = 0;
			var spacer = hudRects.spacer;
			dy += this.title.draw(this.context, 0, dy);
			this.context.strokeRect(0, dy, 200, 0);
			dy += spacer;
			dy += this.description.draw(this.context, 0, dy);
			dy += spacer;
			this.hint.draw(this.context, 0, dy) + spacer;
			this.canvasReady = true;
		}
		ctx.drawImage(this.canvas, 0, 0);
	}
	return ret;
}
var dummyTitle = "Title";
var dummyDesc = "This is the tooltip description, it can be fairly long... I wonder if it will work. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
var dummyHint = "This is the hint... might be useful";
		
function getAttackTooltip(atk) {
	var attack = atk[0] == 1 ? getLocalPlayer().getSpecialAttacks()[atk[1]] :
		atk[1] == 0 ? getLocalPlayer().getMeleeAttack() :
		getLocalPlayer().getRangedAttack();
	var title = attack.name || dummyTitle;
	var desc = attack.description || dummyDesc;
	var hint = (atk[0] == 0 ? getLocalPlayer().getBasicAttackHint() : getLocalPlayer().getSpecialAttackHint()) || dummyHint;
	var tt = makeTooltip(title, desc, hint);
	var attackRect = atk[0] == 1 ? hudRects.specialAttacks[atk[1]] :
		atk[1] == 0 ? hudRects.melee :
		hudRects.ranged;
	tt.x = attackRect[0][0] + attackRect[1][0] / 2;
	return tt;
}
function getHealthTooltip() {
	var tt = makeTooltip("Health Bar", "This is your current health. When this bar empties, you will die... :(. You can regain health by using the Heal spell on yourself.", "There may be other ways to regain health... just experiment.");
	tt.x = hudRects.health[0][0] + hudRects.health[1][0] / 2;
	return tt;
}
function getMinimapTooltip() {
	var title = "Minimap";
	var desc = "This is the minimap. Enemies appear in red, while you and your friends appear green.";
	var hint = "You can toggle the minimap overlay by pressing the 'TAB' key";
	var tt = makeTooltip(title, desc, hint);
	tt.x = hudRects.minimap[0][0] + hudRects.minimap[1][0] / 2;
	return tt;
}
function getTooltip() {
	return tooltip;
}

function eventInRect(ev, rect) {
	return (ev.clientX - rect[0][0] < rect[1][0]) && (ev.clientX > rect[0][0]) &&
		(ev.clientY - rect[0][1] < rect[1][1]) && (ev.clientY > rect[0][1]);
}

function attackAtEvent(ev) {
	if (eventInRect(ev, hudRects.melee)) return [0, 0];
	if (eventInRect(ev, hudRects.ranged)) return [0, 1];
	if (eventInRect(ev, hudRects.specialGroup)) {
		for (var i = 0; i < hudRects.specialAttacks.length; i++) {
			if (eventInRect(ev, hudRects.specialAttacks[i])) return [1, i];
		}
	}
	return false;
}

var TOOLTIP = {
	NONE: 0,
	MINIMAP: 1,
	HEALTH: 2,
	ATTACK: 3,
}
var tooltipAttack = [0, 0];
var tooltipType = TOOLTIP.NONE;
function hudMouseMove(ev) {
	if (!eventInRect(ev, hudRects.hud)) {
		tooltip = null;
		return false;
	}
	if (eventInRect(ev, hudRects.minimap)) {
		if (tooltipType != TOOLTIP.MINIMAP) {
			hoverStart = new Date().getTime();
			tooltip = getMinimapTooltip();
			tooltipType = TOOLTIP.MINIMAP;
		}
	} else if (eventInRect(ev, hudRects.health)) {
		if (tooltipType != TOOLTIP.HEALTH) {
			hoverStart = new Date().getTime();
			tooltip = getHealthTooltip();
			tooltipType = TOOLTIP.HEALTH;
		}
	} else {
		var atk = attackAtEvent(ev);
		if (atk) {
			if (tooltipType != TOOLTIP.ATTACK || !tooltipAttack.equals(atk)) {
				tooltipType = TOOLTIP.ATTACK;
				hoverStart = new Date().getTime();
				tooltip = getAttackTooltip(atk);
				tooltipAttack = atk;
			}
		} else {
			tooltipType = TOOLTIP.NONE;
			tooltip = null;
		}
	}

	hmx = event.clientX;
	return true;
}
function hudMouseDown(ev) {
	if (!eventInRect(ev, hudRects.hud)) return false;

	var atk = attackAtEvent(ev);
	if (atk) {
		if (atk[0] == 1) {
			getLocalPlayer().setSpecialAttack(atk[1]);

		}
	}

	return true;
}

function prepareHudForMinimap() {
	var ctx = hud.context;
	var rect = hudRects.minimap;
	ctx.fillStyle = "#BBAA88";
	ctx.fillRect(rect[0][0], rect[0][1], rect[1][0], rect[1][1]);

	if (shouldExpandMinimap()) {
		rect = hudRects.expandedMinimap;
		ctx.globalAlpha = 0.7;
	}
	prepareRect(ctx, [[0, 0], [1000, 1000]], rect, true);
	ctx.strokeStyle = "#000000";
	ctx.strokeRect(0, 0, 1000, 1000);
	ctx.translate(500, 500);
	getCamera().preDraw(ctx);
}
function clipRect(ctx, rect) {
	ctx.beginPath();
	ctx.rect(rect[0][0], rect[0][1], rect[1][0], rect[1][1]);
	ctx.closePath();
	ctx.clip();
}

var hudBackground;
var backgroundLoading;
function drawHudBackground(ctx) {
	if (!hudBackground) {
		if (!backgroundLoading) {
			backgroundLoading = true;
			getImage("icons/parchment.png", function(img) { hudBackground = img; });
		}
		return;
	}
	ctx.save();
	clipRect(ctx, hudRects.hud);
	ctx.drawImage(hudBackground, 0, 0);
	ctx.restore();
}

function drawHud() {
	calculateHudRects();
	var ctx = hud.context;
	drawDebugData(ctx);

	drawScaledRect(hud, hudRects.hud, "#000000");
	drawHudBackground(ctx);
	drawScaledRect(hud, hudRects.minimap, "#AAAAAA");
	drawScaledRect(hud, hudRects.stats, "#666666");
	drawScaledRect(hud, hudRects.basicGroup, "#000000");
	drawScaledRect(hud, hudRects.specialGroup, "#000000");

	drawHealth(ctx);
	
	var attacks = getLocalPlayer().getSpecialAttacks();
	for (var i = 0; i < attacks.length; i++) {
		drawAttack(ctx, attacks[i], hudRects.specialAttacks[i]);
	}
	drawAttack(ctx, getLocalPlayer().getMeleeAttack(), hudRects.melee);
	drawAttack(ctx, getLocalPlayer().getRangedAttack(), hudRects.ranged);

	drawTooltip(ctx);
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

