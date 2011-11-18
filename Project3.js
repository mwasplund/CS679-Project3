/******************************************************/
/* Attach load event and load the needed Javascript 
/* files.
/******************************************************/
window.addEventListener("load", WindowLoaded, false);
LoadjsFile("Model/Model.js");
LoadjsFile("Events.js");
LoadjsFile("Shader/GLSL_Shader.js");
LoadjsFile("glMatrix.js");
LoadjsFile("Debug.js");
LoadjsFile("GameState.js");

/******************************************************/
/* Global Variables
/******************************************************/
var gl;
var Height
var Width;
var Canvas;
var Timer;
var PrevTime;
var DEBUG = false;
var ClearColor = [0.0, 0.0, 0.0];
var Models = new Array();
var Shaders = new Array();
var mvMatrix;
var pMatrix;
var mvMatrixStack = [];1
var lastTime = 0;
var Time = 0;
var Light0_Enabled = true;
var Up = [0,1,0];
var CurrentShader;
var GameState;
var CameraPos = [-33,16,-36];

var TestModel;

/******************************************************/
/* InitializeWebGL
/*
/* Initialize Web GL
/******************************************************/
function InitializeWebGL()
{
  // Initialize
  Debug.Trace("Initializing WebGL...");
  
  try { gl = Canvas.getContext("webgl"); }             // Completed Webgl
  catch(e){ gl = null; }
  
  if(!gl)
  {
    try { gl = Canvas.getContext("experimental-webg"); }// Development Webgl
    catch(e){ gl = null; }
  }
  
  if(!gl)
  {
    try { gl = Canvas.getContext("moz-webgl"); }// Firefox
    catch(e){ gl = null; }
  }
  if(!gl)
  {
    try { gl = Canvas.getContext("webkit-3d"); }// Safari or Chrome
    catch(e){ gl = null; }
  }
  if(!gl)
  {
    alert("ERROR: Could Not Initialize WebGL!");
    return;
  }
  
  // Set the viewport to the same size as the Canvas
  gl.viewportWidth  = Canvas.width;
  gl.viewportHeight = Canvas.height;
  
  gl.clearColor(ClearColor[0], ClearColor[1], ClearColor[2] , 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE); 

  mvMatrix = mat4.create();
  pMatrix = mat4.create();
  
  InitializeShaders();
}

/******************************************************/
/* WindowLoaded
/*
/* This function is attached to the Window Loaded event
/* and is where we initialize our variables and then 
/* start the game loop
/******************************************************/
function WindowLoaded()
{
  // Check if the Canvas is supported
  GameState = GAME_STATE.LOADING;
  if(!CanvasSupported())
  {
    Debug.Trace("ERROR: Html5 Canvas is not supported.");
    return;
  } 
  
  InitializeCanvas();
  InitializeWebGL();  
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
  
  Canvas = document.getElementById("CanvasOne");
  Canvas.addEventListener('mousedown', MouseDown, false);
  Canvas.addEventListener('mouseup', MouseUp, false);
  Canvas.addEventListener('mousemove', MouseMove, false);
  Canvas.addEventListener('mouseout', MouseOut, false);
  Canvas.addEventListener('click', MouseClick, false);
  Canvas.addEventListener('DOMMouseScroll', MouseWheel, false);
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
  Draw();
  
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
  Models.push(new Model("Bounce_Ball"));
  Models.push(new Model("Fancy_Bounce_Ball"));
  //Models.push(new Model("Brick_Block"));

	TestModel = GetModel("Fancy_Bounce_Ball");
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
			return;
			Debug.Trace("CurrentLevel: "+ CurrentLevel);
		}
	}
}

/******************************************************/
/* InitializeShaders
/*
/* This function Loads all the shaders that will be used 
/* during the time of the game.
/******************************************************/
function InitializeShaders() 
{
  Shaders.push(LoadShader("PerFragmentLighting"));
  Shaders.push(LoadShader("PerVertexLighting"));
  Shaders.push(LoadShader("TimeTest"));
  CurrentShader = Shaders[0];
}

/******************************************************/
/* GetShader
/*
/* This function finds one of the preloaded shaders.
/******************************************************/
function GetShader(i_ShaderName)
{
	for(var i = 0; i < Shaders.length; i++)
	{
		if(Shaders[i].Name == i_ShaderName)
			return Shaders[i];
	}
	
	// Could not find the shader
	return null;
}

/******************************************************/
/* setMatrixUniforms
/*
/* This function binds the Matrixs used by the shader 
/* programs.
/******************************************************/
function setMatrixUniforms() 
{
  gl.uniformMatrix4fv(CurrentShader.Program.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(CurrentShader.Program.mvMatrixUniform, false, mvMatrix);
    
  var normalMatrix = mat3.create();
  mat4.toInverseMat3(mvMatrix, normalMatrix);
  mat3.transpose(normalMatrix);
  gl.uniformMatrix3fv(CurrentShader.Program.nMatrixUniform, false, normalMatrix);
}

/******************************************************/
/* mvPushMatrix
/*
/* Save the current model view matrix.
/******************************************************/
function mvPushMatrix() 
{
  var copy = mat4.create();
  mat4.set(mvMatrix, copy);
  mvMatrixStack.push(copy);
}

/******************************************************/
/* mvPopMatrix
/*
/* load the previously saved model view matrix.
/******************************************************/
function mvPopMatrix() 
{
  if (mvMatrixStack.length == 0) 
    throw "Invalid popMatrix!";
    
  mvMatrix = mvMatrixStack.pop();
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

/******************************************************/
/* Draw
/*
/* Draw the world.
/******************************************************/
function Draw() 
{
	gl.useProgram(CurrentShader.Program);

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.uniform1f(CurrentShader.Program.Time_Uniform, Time);

	gl.uniform1i(CurrentShader.Program.Light0_Enabled_Uniform, Light0_Enabled);
  if (Light0_Enabled) 
  {
    gl.uniform3fv(CurrentShader.Program.Light0_Position_Uniform, [5, 50, -5]);
    gl.uniform3fv(CurrentShader.Program.Light0_Color_Uniform, [1.0, 1.0, 1.0]);
  }
		
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 2.0, 2000.0, pMatrix);
	
	// Setup the camera
	$("#CameraPos_X").val(CameraPos[0]);
	$("#CameraPos_Y").val(CameraPos[1]);
	$("#CameraPos_Z").val(CameraPos[2]);
	
	gl.uniform3fv(CurrentShader.Program.Camera_Position_Uniform, CameraPos);
	mat4.lookAt(CameraPos, [0,0,0], Up, mvMatrix);	

  /*gl.sampleCoverage(10, false);
  if($("#EnableAntialiasing").val() == "Checked")
    gl.enable(gl.SAMPLE_COVERAGE);
  else
    gl.disable(gl. SAMPLE_COVERAGE);*/
    

	if(GameState == GAME_STATE.START)
	{
    
	}
	else if(GameState == GAME_STATE.PLAYING || GameState == GAME_STATE.PAUSED || GameState == GAME_STATE.BEAT_LEVEL)
	{
    TestModel.Draw();
	}
}
