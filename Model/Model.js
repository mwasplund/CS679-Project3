LoadjsFile("Model/Mesh.js");
LoadjsFile("glMatrix.js");

function Model(i_FileName)
{
  // Functions
  this.ParseFile = Model_ParseFile;
  this.PreDraw = Model_PreDraw;
  this.Draw = Model_Draw;
  this.PostDraw = Model_PostDraw;
  this.Update = function(i_DeltaMilisec)
  {
	  if(this.Ready)
	  {
  		for(var i = 0; i < this.Meshes.length; i++)
  		{
  		  this.Meshes[i].Update(i_DeltaMilisec);
  		}
	  }
  }
  
  // Variables
  this.Name = i_FileName;
  this.Ready    = false;
  //Debug.Trace("Loading Model: " + this.FilePath);
}

function Model_ParseFile(i_Parser)
{
  //Debug.Trace("Parsing Model ("+ this.Name +"): " + this.FilePath);
  if(i_Parser == null)
  {
    Debug.Trace("There was an error loading the File");
    return null;
  }
  
  if(i_Parser.Objects == null)
  {
    Debug.Trace("There were no objects found in the FBX file");
    return null;
  }
    
  if(i_Parser.Objects.GeometryList == null)
  {
    Debug.Trace("There were no Geometries in the FBX Objects");
    return null;
  }
  
  this.Meshes = new Array();
  for(var i = 0; i < i_Parser.Models.length; i++)
  {
    var CurrentModel = i_Parser.Models[i];

  	// Ignore Models that failed to load and models that do not have geometry, i.e. Cameras
  	if(CurrentModel != null)
  	{
      	this.Meshes.push(new Mesh(CurrentModel, null));	  
  	}
  }

  var Vertices = new Array();
  var Normals = new Array();
  var UV = new Array();
  var PreRotations = new Array();
  var Rotations = new Array();
  for(var i = 0; i < this.Meshes.length; i++)
  {
	for(var k = 0; k < this.Meshes[i].Vertices.length; k++)
		Vertices.push(this.Meshes[i].Vertices[k]);
	for(var k = 0; k < this.Meshes[i].Normals.length; k++)
		Normals.push(this.Meshes[i].Normals[k]);
	if(this.Meshes[i].UV != null)
	{
		for(var k = 0; k < this.Meshes[i].UV.length; k++)
			UV.push(this.Meshes[i].UV[k]);
	}
	
	PreRotations.push(this.Meshes[i].PreRotate[0]);
	PreRotations.push(this.Meshes[i].PreRotate[1]);
	PreRotations.push(this.Meshes[i].PreRotate[2]);
	Rotations.push(this.Meshes[i].Rotate[0]);
	Rotations.push(this.Meshes[i].Rotate[1]);
	Rotations.push(this.Meshes[i].Rotate[2]);
  }
  
    this.Texture = null;
  this.AmbientColor = [0.1, 0.1, 0.1];
  this.DiffuseColor = [0.8, 0.8, 0.8];
  this.SpecularColor = [0.8, 0.8, 0.8];
  this.Shininess = 30.0;
  
	// Bind an a array of transformations so the Sub Meshes can move
	this.MeshRotateBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.MeshRotateBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Rotations), gl.STATIC_DRAW);
    this.MeshRotateBuffer.itemSize = 3;
    this.MeshRotateBuffer.numItems = Rotations.length / 3;
  
  	this.MeshPreRotateBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.MeshPreRotateBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(PreRotations), gl.STATIC_DRAW);
    this.MeshPreRotateBuffer.itemSize = 3;
    this.MeshPreRotateBuffer.numItems = PreRotations.length / 3;
  
    this.VertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Vertices), gl.STATIC_DRAW);
    this.VertexPositionBuffer.itemSize = 3;
    this.VertexPositionBuffer.numItems = Vertices.length / 3;
  
	  this.VertexNormalBuffer = gl.createBuffer();
  	  gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexNormalBuffer);
  	  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Normals), gl.STATIC_DRAW);
  	  this.VertexNormalBuffer.itemSize = 3;
  	  this.VertexNormalBuffer.numItems = Normals.length/3;
  	  //Debug.Trace("NumNormals: " + this.VertexNormalBuffer.numItems);
	  
	 this.VertexUVBuffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexUVBuffer);
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(UV), gl.STATIC_DRAW);
     this.VertexUVBuffer.itemSize = 2;
     this.VertexUVBuffer.numItems = UV.length/2;
     //Debug.Trace("NumUV: " + this.VertexUVBuffer.numItems);
  
  
	  checkGLError();
    Debug.info("Model loaded");
  this.Ready = true;
}


function Model_PreDraw()
{
  if(!this.Ready)
	return;
	clearGLError();
  	// Bind the Color
  	gl.uniform3fv(CurrentShader.Program.AmbientColor_Uniform, this.AmbientColor);
  	gl.uniform3fv(CurrentShader.Program.DiffuseColor_Uniform, this.DiffuseColor);
    gl.uniform3fv(CurrentShader.Program.SpecularColor_Uniform,this.SpecularColor);
    gl.uniform1f(CurrentShader.Program.Shininess_Uniform, this.Shininess);
  	
	// Bind the Mesh Translations
	gl.bindBuffer(gl.ARRAY_BUFFER, this.MeshRotateBuffer);
    gl.vertexAttribPointer(CurrentShader.Program.vertexPositionAttribute, this.MeshRotateBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
  	// Bind the texture UV
  	var HasDiffuseColorTexture = this.DiffuseColorTexture != null;
  	gl.uniform1i(CurrentShader.Program.DiffuseColorTexture_Enabled_Uniform, HasDiffuseColorTexture);
  	if(HasDiffuseColorTexture)
  	{
  		gl.activeTexture(gl.TEXTURE0);
  	  gl.bindTexture(gl.TEXTURE_2D, this.DiffuseColorTexture);
  	  gl.uniform1i(CurrentShader.Program.DiffuseColorTexture_Uniform, 0);
  	}
  	
  	var HasTransparentColorTexture = this.TransparentColorTexture != null;
  	gl.uniform1i(CurrentShader.Program.TransparentColorTexture_Enabled_Uniform, HasTransparentColorTexture);
  	if(HasTransparentColorTexture)
  	{
  	  gl.activeTexture(gl.TEXTURE0);
  	  gl.bindTexture(gl.TEXTURE_2D, this.TransparentColorTexture);
  	  gl.uniform1i(CurrentShader.Program.TransparentColorTexture_Uniform, 0);
  	}

  	if(this.VertexTextureCoordBuffer != null)
  	{
      gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexTextureCoordBuffer);
      gl.vertexAttribPointer(CurrentShader.Program.textureCoordAttribute, this.VertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
  	}
   	
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
    gl.vertexAttribPointer(CurrentShader.Program.vertexPositionAttribute, this.VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  
    if(this.VertexNormalBuffer != null)
    {
      // Bind the Normal buffer
   	  gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexNormalBuffer);
      gl.vertexAttribPointer(CurrentShader.Program.vertexNormalAttribute, this.VertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    }
	
}

function Model_Draw()
{
  if(!this.Ready)
	return;
	mvPushMatrix();
	//this.TSR();
    setMatrixUniforms();
		
    gl.drawArrays(gl.TRIANGLES, 0, this.VertexPositionBuffer.numItems);
   checkGLError();
  // Draw the children
 // for(var i = 0; i < this.Children.length; i++)
 // {
  //  this.Children[i].Draw(); 
  //}
  
   mvPopMatrix();

 
}

function Model_PostDraw()
{
  if(!this.Ready)
	return;
}
