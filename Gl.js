var gl;
var mvMatrix;
var pMatrix;
var mvMatrixStack = [];1
var ClearColor = [0.0, 0.0, 0.0];
var Shaders = new Array();
var CurrentShader;
var CameraPos = [-5,6,9];

/******************************************************/
/* InitializeWebGL
/*
/* Initialize Web GL
/******************************************************/
function tryGetContext(canvas, str) {
	try { return canvas.getContext(str); }
	catch (e) { 
		console.log(str);
		console.log(e);
		return null;
	}
}

function InitializeWebGL(canvas)
{
  // Initialize
  Debug.Trace("Initializing WebGL...");
  
  gl = tryGetContext(canvas, "webgl");
  if (!gl) gl = tryGetContext(canvas, "experimental-webgl");
  if (!gl) gl = tryGetContext(canvas, "moz-webgl");
  if (!gl) gl = tryGetContext(canvas, "webkit-3d");

  if(!gl)
  {
    alert("ERROR: Could Not Initialize WebGL!");
    return;
  }
  
  // Set the viewport to the same size as the Canvas
  gl.viewportWidth  = canvas.width;
  gl.viewportHeight = canvas.height;
  
  gl.clearColor(ClearColor[0], ClearColor[1], ClearColor[2] , 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE); 

  mvMatrix = mat4.create();
  pMatrix = mat4.create();
  
  InitializeShaders();
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
/* Draw
/*
/* Draw the world.
/******************************************************/
function DrawGL(currentTime) 
{
	gl.useProgram(CurrentShader.Program);

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.uniform1f(CurrentShader.Program.Time_Uniform, currentTime);

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
