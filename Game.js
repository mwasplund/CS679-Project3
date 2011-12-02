var keydownHandler = function() { };
var keyupHandler = function() { };

function mousemove(ev) {
	getMouse().position = [ev.clientX, ev.clientY];
}

$(document).ready(function() {
    $(document).bind("contextmenu", function(e) { return false; });

	target = {};
	target.canvas = document.getElementById("2dCanvas"),
	target.context = target.canvas.getContext("2d"),
    target.width = function() { return this.canvas.width; };
    target.height = function() { return this.canvas.height; };

	hud = {};
    hud.canvas = document.getElementById("hudCanvas");
    hud.context = hud.canvas.getContext("2d");
    hud.width = function() { return this.canvas.width; };
    hud.height = function() { return this.canvas.height; };

	//$(document).keydown(function(ev) { keydownHandler(ev); });
    //$(document).keyup(function(ev) { keyupHandler(ev); });
    document.onkeydown = keydown;
    document.onkeyup = keyup;
    document.onkeypress = function () { };
	$(document).mousemove(mousemove);
	$(document).mousedown(mousedown);
	$(document).mouseup(mouseup);
	
	displayTitle();
	keyupHandler = function() { startGame(); };

	startGame(); // Remove to enable titlescreen
});

function displayTitle() {
    var imageObj = new Image();
    imageObj.src = "titlescreen.jpg";
    imageObj.onload = function(){
        hud.context.drawImage(imageObj, 0, 0);
    };
}

function startGame() {
	keydownHandler = keydown;
    keyupHandler = keyup;

    setup();
    run();
}

var timeStep = 30;
var lastUpdateTime = 0;
var lastDrawTime = 0;
var maxFps = 60;
var tick = 0;

function preupdate() {
    if (getKeyState(keyId.nextAttack) == 1) {
        currentAttack = (currentAttack + 1) % attacks.length;
        keyState[keyId.nextAttack] = 2;
        console.log(currentAttack);
    }
}

function run() {
    var maxSteps = 4; // 1000 / timeStep / maxSteps ~= min framerate
    for (var steps = 0;
			(new Date().getTime() - lastUpdateTime > timeStep) && steps < maxSteps;
			steps++) {
        preupdate();
        update();
        lastUpdateTime += timeStep;
        steps++;
        tick++;
    }
    draw();

    var dt = new Date().getTime() - lastDrawTime;
    lastDrawTime += dt;
    setTimeout(run, Math.max(5, 1000 / maxFps - dt));
}

function update() {

}
