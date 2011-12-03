/******************************************************/
/* Attach load event and load the needed Javascript 
/* files.
/******************************************************/
window.addEventListener("load", WindowLoaded, false);
LoadjsFile("Events.js");
LoadjsFile("Shader/GLSL_Shader.js");
LoadjsFile("glMatrix.js");
LoadjsFile("Debug.js");
LoadjsFile("Gl.js");
LoadjsFile("GameState.js");
LoadjsFile("Model/ModelLoader.js");

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
/* WindowLoaded
/*
/* This function is attached to the Window Loaded event
/* and is where we initialize our variables and then 
/* start the game loop
/******************************************************/
function WindowLoaded()
{
  Loader = new ModelLoader();

  // Check if the Canvas is supported
  GameState = GAME_STATE.LOADING;
  if(!CanvasSupported())
  {
    Debug.Trace("ERROR: Html5 Canvas is not supported.");
    return;
  } 
  
  InitializeCanvas();
  InitializeWebGL(Canvas);  
  if(!gl)
    return;
  
  // Check window size initially to make sure it fills the desired size
  UpdateWindowSize();
  
  // Instantiate main player
  //MainPlayer = new Player();
  
  // Load the models
  InitializeModels();
  
  //Load levels
  InitializeLevels();
 
  // Set initial time
  var CurDate = new Date();
  PrevTime = CurDate.getTime();

  // Start the gameloop
  GameLoop();
  checkGLError();
}

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
  if(WindowSize.X != 0 && WindowSize.Y != 0)
  {
    // Update the canvas size
    Canvas.width = WindowSize.X;
    Canvas.height = WindowSize.Y;
    
    // Save the Canvas size
    Width  = Canvas.width;
    Height = Canvas.height;
    
    // Update the Vieport to match the size of the canvas
    gl.viewportWidth  = Canvas.width;
    gl.viewportHeight = Canvas.height;
  }
}

/******************************************************/
/* InitializeCanvas
/*
/* This function initializes the canvas by attaching all
/* the event listeners
/******************************************************/
function InitializeCanvas()
{
  // Attach event listeners
  window.addEventListener('resize', WindowResized, false);

  document.addEventListener('keydown', KeyDown, false);
  document.addEventListener('keyup', KeyUp, false);
  document.addEventListener('keypress', KeyPress, false);
  document.addEventListener('mousedown', MouseDown, false);
  document.addEventListener('mouseup', MouseUp, false);
  document.addEventListener('mousemove', MouseMove, false);
  document.addEventListener('mouseout', MouseOut, false);
  document.addEventListener('click', MouseClick, false);
  document.addEventListener('DOMMouseScroll', MouseWheel, false);
  
  Canvas = document.getElementById("CanvasOne");
}

/******************************************************/
/* GameLoop
/*
/* This function is called every Frame and then updates
/* all the game objects and then draws them. It then
/* sets a timer so the function will call itself in 
/* another 60th of a second
/******************************************************/
function GameLoop()
{
  Timer = setTimeout("GameLoop()", 1/30 * 1000);
  var CurDate = new Date();
  var CurTime = CurDate.getTime();
  var DeltaMiliSec = CurTime - PrevTime;
  PrevTime = CurTime;
  
	Update(DeltaMiliSec);
  DrawGL();
  
  if(DEBUG)
  {

  }
  // Timer = setTimeout("GameLoop()", 1/30 * 1000);
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
  Loader.load("skeleton");
  Loader.load("Fancy_Bounce_Ball");
  Loader.load("BoneArm");
  Loader.load("Link");
  Loader.load("TestCube");
  Loader.load("fbxTest");
  Loader.load("handFbx");
  Loader.load("WolfSpider_Linked");
  Loader.load("Sphere");
  
  Loader.StartLoading();
  
  //Models.push(new Model("Brick_Block"));

  //TestModel = Loader.GetModel("Sphere");
  //CameraPos = [118, 12, 27];

	//TestModel = Loader.GetModel("handFbx");
	//CameraPos = [344, 6, 353];
	
	TestModel = Loader.GetModel("WolfSpider_Linked");
	CameraPos = [285, 240, -701];

	//TestModel = Loader.GetModel("bone_arm");
	//CameraPos = [217, 79, 133];
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
