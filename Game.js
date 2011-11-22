/******************************************************/
/* Attach load event and load the needed Javascript 
/* files.
/******************************************************/

LoadjsFile("Model/Model.js");

LoadjsFile("Shader/GLSL_Shader.js");

LoadjsFile("Util.js");
LoadjsFile("Graphics.js");
LoadjsFile("Gl.js");
LoadjsFile("Physics.js");
LoadjsFile("Setup.js");
LoadjsFile("Input.js");
LoadjsFile("Passwords.js");
LoadjsFile("Attacks.js");
LoadjsFile("Hud.js");
LoadjsFile("Player.js");
LoadjsFile("Hud.js");
LoadjsFile("Camera.js");
LoadjsFile("GameState.js");

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
	keydownHandler = keydown;
    keyupHandler = keyup;

    setup();
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

var Models = new Array();

var Light0_Enabled = true;
var Up = [0,1,0];
var DEBUG = false;
var TestModel;

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

    document.onkeydown = function(ev) { return keydownHandler(ev); };
    document.onkeyup = function(ev) { return keyupHandler(ev); };
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

/******************************************************/
/* GameLoop
/*
/* This function is called every Frame and then updates
/* all the game objects and then draws them. It then
/* sets a timer so the function will call itself in 
/* another 60th of a second
/******************************************************/
var timeStep = 30;
var lastUpdateTime = 0;
var lastDrawTime = 0;
var maxFps = 60;
var tick = 0;
function gameLoop()
{
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
  Models.push(new Model("Bounce_Ball"));
  Models.push(new Model("Fancy_Bounce_Ball"));
  Models.push(new Model("bone_arm"));
  Models.push(new Model("Link"));
  Models.push(new Model("TestCube"));
  Models.push(new Model("fbxTest"));
  Models.push(new Model("skeleton"));
  
  //Models.push(new Model("Brick_Block"));

	TestModel = GetModel("skeleton");
	CameraPos = [344, 6, 353];
	
	//TestModel = GetModel("bone_arm");
	//CameraPos = [344, 6, 353];
}

/******************************************************/
/* GetModel
/*
/* This function finds one of the pre-loaded models.
/******************************************************/
function GetModel(i_ModelName)
{
	for(var i = 0; i < Models.length; i++)
	{
		if(Models[i].Name == i_ModelName)
			return Models[i];
	}
	
	// Could not find the Model
	Debug.Trace("ERROR: Could not find Model - " + i_ModelName);
	return null;
}

/******************************************************/
/* AreModelsLoaded
/*
/* This function checks if all the models are loaded
/******************************************************/
function AreModelsLoaded() 
{
	for(var i = 0; i < Models.length; i++)
	{
		// If we find a single model not ready then leave
		if(!Models[i].Ready)
		{
			$("#Collision").val(Models[i].Name);
			return false;
		}
	}
  $("#Collision").val("Done Loading");
	return true;
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
	TestModel.Update(i_DeltaMiliSec);
	
  if(GameState == GAME_STATE.PLAYING)
  {		    
    //MainPlayer.Update();
  }
  else if(GameState == GAME_STATE.LOADING && AreModelsLoaded())
  {
  	// Stay in loading stat until all the models are loaded
    SetGameState_Playing();
    //SetGameState_Start();
  }
}
