﻿/******************************************************/
/* Attach load event and load the needed Javascript 
/* files.
/******************************************************/
window.addEventListener("load", WindowLoaded, false);

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
var Loading;
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
  Loading = true;

  // Check if the Canvas is supported
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
  
  // Load the models
  InitializeModels();
  	TestModel = Loader.GetModel("Ground");
	CameraPos = [0,0, -30];
	
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
  
  Canvas = document.getElementById("3dCanvas");
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
  
	UpdateMINE(0);
  DrawTestModel();
  
  $("#CameraPos_X").val(CameraPos[0]);
  $("#CameraPos_Y").val(CameraPos[1]);
  $("#CameraPos_Z").val(CameraPos[2]);
  
  if(DEBUG)
  {

  }
  // Timer = setTimeout("GameLoop()", 1/30 * 1000);
}
 

    
/******************************************************/
/* Update
/*
/* Update movement of Player/Clones
/******************************************************/
function UpdateMINE(i_DeltaMiliSec) 
{
	TestModel.Update(i_DeltaMiliSec);
	
  if(Loading && AreModelsLoaded())
  {
    Loading = false;
	$("#Menu_Loading").hide();
  }
}

function DrawTestModel() {
	var currentTime = new Date().getTime();
	gl.useProgram(CurrentShader.Program);
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.uniform2fv(CurrentShader.Program.Camera_Position_Uniform, CameraPos);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.uniform1f(CurrentShader.Program.Time_Uniform, currentTime);

	gl.uniform1i(CurrentShader.Program.Light0_Enabled_Uniform, Light0_Enabled);
  if (Light0_Enabled) 
  {
    gl.uniform3fv(CurrentShader.Program.Light0_Position_Uniform, [0, 5, -10]);
    gl.uniform3fv(CurrentShader.Program.Light0_Color_Uniform, [10, 10, 10]);
  } 
	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 2.0, 2000.0, pMatrix);
	mat4.lookAt(CameraPos, [0,0,0], Up, vMatrix);
	mat4.identity(mvMatrix);
	
	setMatrixUniforms();
	
	if (!Loading) {
		TestModel.Draw();
		Loader.DrawModels(currentTime);
	}
}
