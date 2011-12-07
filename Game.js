/******************************************************/
/* Attach load event and load the needed Javascript 
/* files.
/******************************************************/
LoadjsFile("Model/Model.js", "graphics3d");
LoadjsFile("Shader/GLSL_Shader.js", "graphics3d");

LoadjsFile("Util.js");
LoadjsFile("Graphics.js", "graphics2d");
LoadjsFile("Gl.js", "graphics3d");
LoadjsFile("Physics.js", "engine");
LoadjsFile("Enemies.js", "engine");
LoadjsFile("Setup.js", "engine");
LoadjsFile("Input.js", "interface");
LoadjsFile("Passwords.js", "interface");
LoadjsFile("Attacks.js");
LoadjsFile("Hud.js", "hud");
LoadjsFile("Player.js", "engine");
LoadjsFile("Camera.js", "graphics2d");
LoadjsFile("GameState.js");
LoadjsFile("Model/ModelLoader.js", "graphics3d");

var canvases = [];
var target;
var hud;
var glCanvas;
var GameState;

var keydownhandler = function(ev) { return true; }
var keyuphandler = function(ev) { return true; }

$(window).load(function() {
    $(document).bind("contextmenu", function(e) { return false; });

	GameState = GAME_STATE.LOADING;
	if(!CanvasSupported())
	{
		Debug.Trace("ERROR: Html5 Canvas is not supported.");
		return;
	} 

	InitializeCanvas();
	InitializeWebGL(glCanvas.canvas);  
	if(!gl)
		return;

	// Check window size initially to make sure it fills the desired size
	UpdateWindowSize();

	// Load the models
	InitializeModels();

	//Load levels
	InitializeLevels();

	initializeListeners();

    initializePlayer(Loader.GetModel("goodGuyWalk"), [2,2,2]);

	displayTitle();

	checkGLError();
});

function displayTitle() {
    var imageObj = new Image();
    imageObj.src = "titlescreen.jpg";
    imageObj.onload = function(){
        hud.context.drawImage(imageObj, 0, 0);
		keyupHandler = function(ev) { setTimeout(startGame, 5); }
    };

	startGame(); // remove to enable titlescreen
}

function startGame() {
	keydownhandler = keydown;
    keyuphandler = keyup;

    setup();

	prepareGame();
    gameLoop();
}

function preupdate() {
    if (getKeyState(keyId.nextAttack) == 1) {
        currentAttack = (currentAttack + 1) % attacks.length;
        keyState[keyId.nextAttack] = 2;
        console.log(currentAttack);
    }
}

/******************************************************/
/* Global Variables
/******************************************************/
var Canvas;
var Timer;
var PrevTime;
var DEBUG = false;
var Models = new Array();
var lastTime = 0;
var Time = 0;
var Light0_Enabled = true;
var Up = [0,1,0];
var GameState;
var PercentLoaded = 0;
var TestModel;
var Loader;

/******************************************************/
/* UpdateWindowSize
/*
/* This function checks the windows current size and
/* makes sure that the Canvas fills the entire window, 
/* it then makes sure that the Viewport size is the same 
/* as the Canvas.
/******************************************************/
function UpdateWindowSize()
{
  var WindowSize = GetWindowSize();
  // Only update the sizes if they are larget than zero
  if(WindowSize.X == 0 && WindowSize.Y == 0)
	  return;

  for (var i = 0; i < canvases.length; i++) {
	  var canvas = canvases[i];
	  // Update the canvas size
	  canvas.width = WindowSize.X;
	  canvas.height = WindowSize.Y;

	  // Update the Vieport to match the size of the canvas
	  gl.viewportWidth  = canvas.width;
	  gl.viewportHeight = canvas.height;
  }
}

function initializeListeners() {
	// Attach event listeners
	window.addEventListener('resize', UpdateWindowSize, false);

    document.onkeydown = function(ev) { return keydownhandler(ev); };
    document.onkeyup = function(ev) { return keyuphandler(ev); };
    document.onkeypress = function () { };
	$(document).mousemove(mousemove);
	$(document).mousedown(mousedown);
	$(document).mouseup(mouseup);
	
	/*
	document.addEventListener('keydown', KeyDown, false);
	document.addEventListener('keyup', KeyUp, false);
	document.addEventListener('keypress', KeyPress, false);
	document.addEventListener('mousedown', MouseDown, false);
	document.addEventListener('mouseup', MouseUp, false);
	document.addEventListener('mousemove', MouseMove, false);
	document.addEventListener('mouseout', MouseOut, false);
	document.addEventListener('click', MouseClick, false);
	document.addEventListener('DOMMouseScroll', MouseWheel, false);
	*/
}

/******************************************************/
/* InitializeCanvas
/*
/* This function initializes the canvas by attaching all
/* the event listeners
/******************************************************/
function InitializeCanvas()
{
	target = {};
	target.canvas = document.getElementById("2dCanvas"),
	target.context = target.canvas.getContext("2d"),
	target.width = function() { return this.canvas.width; };
	target.height = function() { return this.canvas.height; };
	canvases.push(target.canvas);

	hud = {};
	hud.canvas = document.getElementById("hudCanvas");
	hud.context = hud.canvas.getContext("2d");
	hud.width = function() { return this.canvas.width; };
	hud.height = function() { return this.canvas.height; };
	canvases.push(hud.canvas);

	glCanvas = {};
	glCanvas.canvas = document.getElementById("3dCanvas");
	glCanvas.width = function() { return this.canvas.width; };
	glCanvas.height = function() { return this.canvas.height; };
	canvases.push(glCanvas.canvas);
}


var timeStep = 30;
var lastUpdateTime = 0;
var lastDrawTime = 0;
var maxFps = 60;
var tick = 0;
var drawTick = 0;
function prepareGame() {
	lastUpdateTime = new Date().getTime();
	lastDrawTime = lastUpdateTime;
}
/******************************************************/
/* GameLoop
/*
/* This function is called every Frame and then updates
/* all the game objects and then draws them. It then
/* sets a timer so the function will call itself in 
/* another 60th of a second
/******************************************************/
function gameLoop()
{
    var maxSteps = 8; // 1000 / timeStep / maxSteps ~= min framerate
	var beginTime = new Date().getTime();
	var lastTime = beginTime;
	var dt = 0;
    for (var steps = 0;
			(lastTime - lastUpdateTime > timeStep) && steps < maxSteps;
			steps++) {
        preupdate();
        update();
        lastUpdateTime += timeStep;
        tick++;
		dt = new Date().getTime() - lastTime;
		lastTime += dt;
    }

	addDebugValue("update dt", dt);
	addDebugValue("update/frame", steps);


    addDebugValue("playerPosition", getLocalPlayer().getPosition().toString());
    addDebugValue("playerDirection", getLocalPlayer().direction.toString());
	addDebugValue("RotateDiff", getLocalPlayer().rotateDiff);
    addDebugValue("numEnemies", getEnemies().length);
    draw();
    drawTick++;

	var currTime = new Date().getTime();
	addDebugValue("draw dt", currTime - lastTime);
	Update(currTime - lastDrawTime);
	lastDrawTime = currTime;

	currTime = new Date().getTime();
	addDebugValue("anim update dt", currTime - lastDrawTime);

	addDebugValue("loop dt", currTime - beginTime);

    setTimeout(gameLoop, Math.max(5, 1000 / maxFps - dt));
}
 
/******************************************************/
/* InitializeModels
/*
/* This function Loads all the models that will be used 
/* during the time of the game. We cache all our models
/* in an array and reuse then throughout the game!
/******************************************************/
function InitializeModels() 
{
  Loader = new ModelLoader();
  
  Loader.load("skeleton");
  Loader.load("Fancy_Bounce_Ball");
  Loader.load("BoneArm");
  Loader.load("Link");
  Loader.load("TestCube");
  Loader.load("fbxTest");
  Loader.load("handFbx");
  Loader.load("WolfSpider_Linked");
  Loader.load("Sphere");
  Loader.load("goodGuyWalk");
  
  Loader.StartLoading();
}


/******************************************************/
/* AreModelsLoaded
/*
/* This function checks if all the models are loaded
/******************************************************/
function AreModelsLoaded() 
{
	PercentLoaded = Loader.getPercentLoaded();
	$("#PercentLoaded").val("Loaded: " + PercentLoaded + "%");
//	Debug.log(PercentLoaded);
	
	if(PercentLoaded == 100)
	{
    $("#Collision").val("Done Loading");
    Loader.StopLoading();
	  return true;
	}
	return false;
}

/******************************************************/
/* InitializeLevels
/*
/* Load and store the levels, or just the first level.
/******************************************************/
function InitializeLevels() 
{
	//CurrentLevel = new Level(1);
}

/******************************************************/
/* SelectLevel
/*
/* Select a level to play.
/******************************************************/
function SelectLevel(i_LevelName)
{
	for(var k = 0; k < 2; k++)
	{
		if(Levels[k].Name == i_LevelName)
		{
			CurrentLevel = Levels[k];
			Debug.Trace("CurrentLevel: "+ CurrentLevel);
			return;
		}
	}
}
    
/******************************************************/
/* Update
/*
/* Update movement of Player/Clones
/******************************************************/
function Update(i_DeltaMiliSec) 
{
  if(GameState == GAME_STATE.PLAYING)
  {		    
    player.model.Update(i_DeltaMiliSec);
    
    //for(var i = 0; i < enemies.length; i ++)
      enemies[0].model.Update(i_DeltaMiliSec);
  }
  else if(GameState == GAME_STATE.LOADING && AreModelsLoaded())
  {
  	// Stay in loading stat until all the models are loaded
    SetGameState_Playing();
    //SetGameState_Start();
  }
}
