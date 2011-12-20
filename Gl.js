LoadjsFile("Numbers.js");
var gl;
var mMatrix;
var pMatrix;
var vMatrix;
var mvMatrixStack = [];
var ClearColor = [0.0, 0.0, 0.0];
var Shaders = new Array();
var CurrentShader;
var CameraPos = [0,0,0];
var CameraOffset = [0, 200, 120];
var SceneModels = new Array();

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

function updateModel()
{
	// Move Toward the desired rotations
	var DesiredRotation = Math.atan2(this.direction[0], this.direction[1]);
	var Difference = this.rotation - DesiredRotation;
	this.rotateDiff = Difference;
	if(Difference > 2*Math.PI)
		Difference -= 2*Math.PI;
	else if(Difference < -2*Math.PI)
		Difference += 2*Math.PI;

	if(Difference >  0.1)
	{
		if((Difference - Math.PI) > 0.1)
			this.rotation += 0.1;
		else
			this.rotation -= 0.1;
	}
	else if(Difference <  -0.1)
	{
		if((Difference + Math.PI) < -0.1)
			this.rotation -= 0.1;
		else
			this.rotation += 0.1;
	}
	else
		this.rotation = DesiredRotation;

	vec3.add([this.position[0], 0, this.position[1]], this.offset, this.model.Position);
	this.model.Scale = this.scale;
	this.model.Rotate = [0, this.rotation + this.preRotate, 0];
}

function drawModel()
{
	this.model.Draw();	
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
  //gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE); 

  mvMatrix = mat4.create();
  pMatrix = mat4.create();
  vMatrix = mat4.create();
  
  InitializeShaders();
  initializeGlNumbers();
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
  Shaders.push(LoadShader("Numbers"));
  CurrentShader = GetShader("PerFragmentLighting");
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
function setMatrixUniforms(program) 
{
	var program = program || CurrentShader.Program;
  gl.uniformMatrix4fv(program.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(program.vMatrixUniform, false, vMatrix);

}

function setmvMatrixUniform(i_mvMatrix)
{
	gl.uniformMatrix4fv(CurrentShader.Program.mvMatrixUniform, false, i_mvMatrix);

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
function PreDrawGL(currentTime) 
{
	gl.useProgram(CurrentShader.Program);

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.uniform1f(CurrentShader.Program.Time_Uniform, currentTime);

	gl.uniform1i(CurrentShader.Program.Light0_Enabled_Uniform, Light0_Enabled);

    var playerPos = getLocalPlayer().getPosition();
    playerPos = [playerPos[0], 0, playerPos[1]];
    vec3.set(playerPos, CameraPos);
    vec3.add(CameraPos, CameraOffset);

  if (Light0_Enabled) 
  {
    gl.uniform3fv(CurrentShader.Program.Light0_Position_Uniform, [CameraPos[0], CameraPos[1] + 100, CameraPos[2]]);
    gl.uniform3fv(CurrentShader.Program.Light0_Color_Uniform, [1.0, 1.0, 1.0]);
  }

	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 2.0, 2000.0, pMatrix);


	gl.uniform3fv(CurrentShader.Program.Camera_Position_Uniform, CameraPos);
	mat4.lookAt(CameraPos, playerPos, Up, vMatrix);	
	mat4.identity(mvMatrix);
	setMatrixUniforms();
}
