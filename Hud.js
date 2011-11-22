function drawHealth() {
    var hpWidth = 0.3;
    var hp = getPlayer().getHealth();

	var w = hud.width() * hpWidth;
	var h = w / 15;

	var x = (hud.width() - w) / 2;
	var y = hud.height() - h - 20;

	var sc = [200, 10];

	var ctx = hud.context;
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
// health, powerup stuff, minimap?
  drawHealth();

  hud.context.strokeStyle = "#000000";
  //hud.context.strokeRect(1, 1, hud.width() - 2, hud.height() - 2);
}

function HudObject() {}
HudObject.prototype.update = function() { }
HudObject.prototype.draw = function() { this.drawTo(hud); }
HudObject.prototype.drawGl = function() { this.draw(); }

