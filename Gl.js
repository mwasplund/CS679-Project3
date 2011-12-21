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
	this.model.Rotate = [this.preRotate0 || 0, this.rotation + this.preRotate, this.preRotate2 || 0];
}

function drawModel()
{
	this.model.Draw();	
}

function setupFlame(particleSystem) {
  var emitter = particleSystem.createParticleEmitter();
  emitter.setTranslation(0, 0, 0);
  emitter.setState(tdl.particles.ParticleStateIds.ADD);
  emitter.setColorRamp(
      [1, 1, 0, 1,
       1, 0, 0, 1,
       0, 0, 0, 1,
       0, 0, 0, 0.5,
       0, 0, 0, 0]);
  emitter.setParameters({
      numParticles: 20,
      lifeTime: 2,
      timeRange: 2,
      startSize: 8,
      endSize: 16,
      velocity:[0, 9, 0],
	  velocityRange: [4.5, 4.5, 4.5],
      worldAcceleration: [0, -2, 0],
      spinSpeedRange: 4});
}

var particleSystem;
function InitializeWebGL(canvas)
{
  // Initialize
  Debug.Trace("Initializing WebGL...");
  
  gl = tdl.webgl.setupWebGL(canvas);

  particleSystem = new tdl.particles.ParticleSystem(
      gl, null, tdl.math.pseudoRandom);
  setupFlame(particleSystem);


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
  
  InitializeShaders("Shader/");
  initializeGlNumbers();
  initializeGlBars();
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
  
  Loader.load("hammer");
  //Loader.load("Fancy_Bounce_Ball");
  Loader.load("bolder");
  Loader.load("lightningBolt");
  Loader.load("monsterWeak");
  Loader.load("monsterMediumStrength");
  //Loader.load("Link");
  //Loader.load("TestCube");
  //Loader.load("fbxTest");
  //Loader.load("handFbx");
  Loader.load("WolfSpider_Linked");
  Loader.load("Sphere");
  Loader.load("goodGuyWalk");
  Loader.load("Ground");
  
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
/* InitializeShaders
/*
/* This function Loads all the shaders that will be used 
/* during the time of the game.
/******************************************************/
function InitializeShaders(i_Path) 
{
  Shaders.push(LoadShader("PerFragmentLighting", i_Path+"PerFragmentLighting.vs", i_Path+"PerFragmentLighting.fs"));
  Shaders.push(LoadShader("PerVertexLighting", i_Path+"PerVertexLighting.vs", i_Path+"PerVertexLighting.fs"));
  Shaders.push(LoadShader("TimeTest", i_Path+"TimeTest.vs", i_Path+"TimeTest.fs"));
  Shaders.push(LoadShader("Numbers", i_Path+"Numbers.vs", i_Path+"Numbers.fs"));
  Shaders.push(LoadShader("Bars", i_Path+"Bars.vs", i_Path+"Bars.fs"));
  CurrentShader = GetShader("PerFragmentLighting");
  
  // Add the shader names to the selector
  var SelectShader = document.getElementById('SelectShader');
  for(var i = 0; i < Shaders.length; i++)
  {
	   var NewOption = document.createElement('option');
	   NewOption.text = Shaders[i].Name;
	   NewOption.value = Shaders[i].Name;
	  
	  try {
		SelectShader.add(NewOption, null); // standards compliant; doesn't work in IE
	  }
	  catch(ex) {
		SelectShader.add(NewOption); // IE only
	  }
  }
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

    gl.clearColor(0, 0, 0, 1.0);
    //gl.clearDepth(1);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, glBars.barTexture);

    gl.disable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.disable(gl.STENCIL_TEST);

    gl.colorMask(true, true, true, true);
    gl.depthMask(true);

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
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
