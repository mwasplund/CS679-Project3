function Interpolate(i_StartValue, i_EndValue, i_Percent)
{
	if(i_Percent > 1)
		i_Percent = 1;
	else if(i_Percent < 0)
		i_Percent = 0;
		
	return (i_StartValue * (1 - i_Percent) + i_EndValue * i_Percent);	
}

function Mesh_Update(i_Ref)
{	
	var DeltaMilisec = i_Ref.Time - i_Ref.StartTime;
	
  var RDM_NUM = 1539538600;
  var FPS = 24;
  var TimeToFrames = RDM_NUM / ((1/FPS) * 1000);
  var Time = DeltaMilisec * TimeToFrames;
  for(var i = 0; i < this.Animations.length; i++)
  {
	var AnimationNode = this.Animations[i];
	if(AnimationNode.Name == "AnimCurveNode::T")
	{
		for(var k = 0; k < AnimationNode.AnimationCurveList.length; k++)
		{
			var AnimCurve = AnimationNode.AnimationCurveList[k];
			// Find where we are in the animation
			
			var TimeFrame = 0;
			while(TimeFrame < AnimCurve.KeyTime.length && AnimCurve.KeyTime[TimeFrame] < Time)
			  TimeFrame++;
			
			if(TimeFrame > 0 && TimeFrame < AnimCurve.KeyTime.length)
			{
				var StartValue = AnimCurve.KeyValueFloat[TimeFrame-1];
				var EndValue   = AnimCurve.KeyValueFloat[TimeFrame];
				
				var StartTime = AnimCurve.KeyTime[TimeFrame-1];
				var EndTime   = AnimCurve.KeyTime[TimeFrame];
				var TimeLength = EndTime - StartTime;
				var Percent =  (Time - StartTime) / TimeLength; 
				var Value = Interpolate(StartValue, EndValue, Percent);
			
				if(AnimCurve.Property == "d|X")
				{
					this.Translate[0] = Value;
				}
				else if(AnimCurve.Property == "d|Y")
				{
					this.Translate[1] = Value;
				}
				else if(AnimCurve.Property == "d|Z")
				{
					this.Translate[2] = Value;
				}
			}
			else if(TimeFrame == AnimCurve.KeyTime.length)
				i_Ref.StartTime = i_Ref.Time;
		}
	}
	else if(AnimationNode.Name == "AnimCurveNode::S")
	{
		for(var k = 0; k < AnimationNode.AnimationCurveList.length; k++)
		{
			var AnimCurve = AnimationNode.AnimationCurveList[k];
			// Find where we are in the animation
			
			var TimeFrame = 0;
			while(TimeFrame < AnimCurve.KeyTime.length && AnimCurve.KeyTime[TimeFrame] < Time)
			  TimeFrame++;
			
			if(TimeFrame > 0 && TimeFrame < AnimCurve.KeyTime.length)
			{
				var StartValue = AnimCurve.KeyValueFloat[TimeFrame-1];
				var EndValue   = AnimCurve.KeyValueFloat[TimeFrame];
				
				var StartTime = AnimCurve.KeyTime[TimeFrame-1];
				var EndTime   = AnimCurve.KeyTime[TimeFrame];
				var TimeLength = EndTime - StartTime;
				var Percent =  (Time - StartTime) / TimeLength; 
				var Value = Interpolate(StartValue, EndValue, Percent);
			
				if(AnimCurve.Property == "d|X")
				{
					this.Scale[0] = Value;
				}
				else if(AnimCurve.Property == "d|Y")
				{
					this.Scale[1] = Value;
				}
				else if(AnimCurve.Property == "d|Z")
				{
					this.Scale[2] = Value;
				}
			}
			else if(TimeFrame == AnimCurve.KeyTime.length)
				i_Ref.StartTime = i_Ref.Time;
		}
	}
	
  else if(AnimationNode.Name == "AnimCurveNode::R")
	{
		for(var k = 0; k < AnimationNode.AnimationCurveList.length; k++)
		{
			var AnimCurve = AnimationNode.AnimationCurveList[k];
			// Find where we are in the animation
			
			var TimeFrame = 0;
			while(TimeFrame < AnimCurve.KeyTime.length && AnimCurve.KeyTime[TimeFrame] < Time)
			  TimeFrame++;
			
			if(TimeFrame > 0 && TimeFrame < AnimCurve.KeyTime.length)
			{
				var StartValue = AnimCurve.KeyValueFloat[TimeFrame-1];
				var EndValue   = AnimCurve.KeyValueFloat[TimeFrame];
				
				var StartTime = AnimCurve.KeyTime[TimeFrame-1];
				var EndTime   = AnimCurve.KeyTime[TimeFrame];
				var TimeLength = EndTime - StartTime;
				var Percent =  (Time - StartTime) / TimeLength; 
				var Value = Interpolate(StartValue, EndValue, Percent);
			
				if(AnimCurve.Property == "d|X")
				{
					this.Rotate[0] = Value ;
				}
				else if(AnimCurve.Property == "d|Y")
				{
					this.Rotate[1] = Value ;
				}
				else if(AnimCurve.Property == "d|Z")
				{
					this.Rotate[2] = Value ;
				}
			}
			else if(TimeFrame == AnimCurve.KeyTime.length)
				i_Ref.StartTime = i_Ref.Time;
		}
	}
  }
  
  // Update the children
  for(var i = 0; i < this.Children.length; i++)
  {
    this.Children[i].Update(i_Ref); 
  }
}

function Mesh(i_Model, i_Parent)
{ 
  // Attach Functions
  this.Parent = i_Parent;
  this.PreDraw = Mesh_PreDraw;
  this.Draw = Mesh_Draw;
  this.SmartDraw = Mesh_SmartDraw;
  this.PostDraw = Mesh_PostDraw;
  this.TSR = Mesh_TSR;
  this.Update = Mesh_Update;
  Debug.Trace("Initialize Mesh");  
  
  // Copy over the animations
  this.Animations = i_Model.Animations;
  this.AnimationStartTime = 0;
  this.Children = new Array();
  
  if(i_Model.Geometry == null)
  {
    this.HasGeometry = false;
  }
  else
  {
    this.HasGeometry = true;
    
    // Bind the GL Arrays
    // Vertices
    // Convert the Indexed Triangles to array of vertices
    var Vertices = new Array();
    
    for(var i = 0; i < i_Model.Geometry.TriangleIndices.length; i++)
    {
  	
  	 	Vertices.push(i_Model.Geometry.Vertices[i_Model.Geometry.TriangleIndices[i] * 3 + 0] );
      	Vertices.push(i_Model.Geometry.Vertices[i_Model.Geometry.TriangleIndices[i] * 3 + 1] );
      	Vertices.push(i_Model.Geometry.Vertices[i_Model.Geometry.TriangleIndices[i] * 3 + 2] );
  	  
   }
    
    this.VertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Vertices), gl.STATIC_DRAW);
    this.VertexPositionBuffer.itemSize = 3;
    this.VertexPositionBuffer.numItems = Vertices.length / 3;
    
    //Debug.Trace("NumVertices: " + this.VertexPositionBuffer.numItems);
    
    if(i_Model.Geometry.TriangleNormals != null)
    {
		var Normals;
		if(i_Model.Geometry.TriangleNormals.length == i_Model.Geometry.Vertices.length)
		{
			Normals = new Array();
		    for(var i = 0; i < i_Model.Geometry.TriangleIndices.length; i++)
			{
				Normals.push(i_Model.Geometry.TriangleNormals[i_Model.Geometry.TriangleIndices[i] * 3 + 0]);
				Normals.push(i_Model.Geometry.TriangleNormals[i_Model.Geometry.TriangleIndices[i] * 3 + 1]);
				Normals.push(i_Model.Geometry.TriangleNormals[i_Model.Geometry.TriangleIndices[i] * 3 + 2]);
			  
		   }
		}
		else
		{
			Normals = i_Model.Geometry.TriangleNormals;
		}		
	
	
  	  this.VertexNormalBuffer = gl.createBuffer();
  	  gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexNormalBuffer);
  	  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(Normals), gl.STATIC_DRAW);
  	  this.VertexNormalBuffer.itemSize = 3;
  	  this.VertexNormalBuffer.numItems = Normals.length/3;
  	  //Debug.Trace("NumNormals: " + this.VertexNormalBuffer.numItems);
    }
    
    if(i_Model.Geometry.TriangleUVIndices != null)
    {
      //bind the UV buffers
  	var TextureCoords = new Array();
  	var LayerElementUV = i_Model.Geometry.LayerElementUV;
  	for(var i = 0; i <  i_Model.Geometry.TriangleUVIndices.length; i++)
  	{
  	  var Index = i_Model.Geometry.TriangleUVIndices[i];
  	  TextureCoords.push(LayerElementUV.UV[2*Index]);
  	  TextureCoords.push(LayerElementUV.UV[2*Index+1]);
  	  
  	  //Debug.Trace("UV: " + i + " Index: " + Index + "( " +  LayerElementUV.UV[2*Index] + ", " + LayerElementUV.UV[2*Index+1] + ")");
  	}
  	
  	this.VertexTextureCoordBuffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexTextureCoordBuffer);
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(TextureCoords), gl.STATIC_DRAW);
     this.VertexTextureCoordBuffer.itemSize = 2;
     this.VertexTextureCoordBuffer.numItems = TextureCoords.length/2;
     //Debug.Trace("NumUV: " + this.VertexTextureCoordBuffer.numItems);
    }
  }
  
  // Check if model has predefined rotaion, translation, scale... etc
  this.Scale     = vec3.create([1, 1, 1]);
  this.Translate = vec3.create([0, 0, 0]);
	this.Rotate    = vec3.create([0, 0, 0]);
  this.PreRotate = vec3.create([0, 0, 0]);
	//Debug.Trace("Properties.length = " + i_Model.Properties.length);
  for(var i = 0; i < i_Model.Properties.length; i++)
  {
  	var Property = i_Model.Properties[i];
  	switch(Property.Name)
  	{
  		case "Lcl Translation":
  		{
  			//Debug.Trace("Translate " + vec3.str(Property.Value));
  			vec3.add(this.Translate, Property.Value);
  			break;
  		}
  		case "PreRotation":
  		{
  		//	Debug.Trace("PreRotate " + vec3.str(Property.Value));
  			vec3.add(this.PreRotate, Property.Value);
  			break;
  		}
  		case "Lcl Rotation":
  		{
  			//Debug.Trace("Rotate " + vec3.str(Property.Value));
	
  			vec3.add(this.Rotate, Property.Value);
  			break;
  		}
      case "Lcl Scaling":
      {
      	//Debug.Trace("Scale " + vec3.str(Property.Value));

      	this.Scale[0] *= Property.Value[0];
      	this.Scale[1] *= Property.Value[1];
      	this.Scale[2] *= Property.Value[2];
      	break;
     	}
  	}
  }
  
  // Check if the image has a texture
  this.Texture = null;
  this.AmbientColor = [0.1, 0.1, 0.1];
  this.DiffuseColor = [0.8, 0.8, 0.8];
  this.SpecularColor = [0.8, 0.8, 0.8];
  this.Shininess = 30.0;

  if(i_Model.Material != null)
  {
  	if(i_Model.Material.DiffuseColorTexture != null)
  	{
  		Debug.Trace("This mesh uses DiffuseColorTexture = " + i_Model.Material.DiffuseColorTexture.RelativeFilename);
  		this.DiffuseColorTexture = gl.createTexture();
  		this.DiffuseColorTexture.image = new Image();
  		var Texture = this.DiffuseColorTexture;
  		this.DiffuseColorTexture.image.onload = function()
  		{
  			Mesh_HandleLoadedTexture(Texture);
  		}
  		var RelativeFilename = i_Model.Material.DiffuseColorTexture.RelativeFilename;
  		this.DiffuseColorTexture.image.src = "sceneassets/images/" + RelativeFilename.substring(RelativeFilename.lastIndexOf('\\') + 1);
  	}
  	else if(i_Model.Material.TransparentColorTexture != null)
  	{
  		Debug.Trace("This mesh uses TransparentColorTexture = " + i_Model.Material.TransparentColorTexture.RelativeFilename);
  		this.TransparentColorTexture = gl.createTexture();
  		this.TransparentColorTexture.image = new Image();
  		var Texture = this.TransparentColorTexture;
  		this.TransparentColorTexture.image.onload = function()
  		{
  			Mesh_HandleLoadedTexture(Texture);
  		}
  		var RelativeFilename = i_Model.Material.TransparentColorTexture.RelativeFilename;
  		this.TransparentColorTexture.image.src = "sceneassets/images/" + RelativeFilename.substring(RelativeFilename.lastIndexOf('\\') + 1);
  	}
  	
  	// Check for colors
  	for(var i = 0; i < i_Model.Material.Properties.length; i++)
  	{
  	  var Property = i_Model.Material.Properties[i];
  	  if(Property.Name == "Ambient")
  	    this.AmbientColor = Property.Value;
 	    else if(Property.Name == "Diffuse")
 	      this.DiffuseColor = Property.Value;
 	    else if(Property.Name == "Specular")
 	      this.SpecularColor = Property.Value;
      //else if(Property.Name == "Shininess")
 	  //    this.Shininess = Property.Value;
  	}
  }
  
  
 
  
  // Check for children
  for(var i = 0; i < i_Model.Children.length; i++)
  {
    var CurrentModel = i_Model.Children[i];
  	if(CurrentModel != null)
  	{
      	this.Children.push(new Mesh(CurrentModel, this));		  
  	}
  }
  
  // MWA - threw this in to make it work,
  // Should actually try to fake threading by allowing the main program to run so 
  // it can check if models are loaded, but this hack works for now
  AreModelsLoaded();
  
  Debug.info("Model loaded");
}

function Mesh_HandleLoadedTexture(i_Texture) 
{
  gl.bindTexture(gl.TEXTURE_2D, i_Texture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, i_Texture.image);
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  checkGLError();
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
	checkGLError();
  gl.bindTexture(gl.TEXTURE_2D, null);
  Debug.Trace("Image Loaded: " + i_Texture.image.src);
  checkGLError();
}

function Mesh_TSR(i_Matrix)
{
	mat4.scale(i_Matrix, this.Scale);

	mat4.translate(i_Matrix, this.Translate);

	mat4.rotate(i_Matrix, degToRad(this.PreRotate[2]), [0, 0, 1]);
  mat4.rotate(i_Matrix, degToRad(this.PreRotate[1]), [0, 1, 0]);
	mat4.rotate(i_Matrix, degToRad(this.PreRotate[0]), [1, 0, 0]);
	
	mat4.rotate(i_Matrix, degToRad(this.Rotate[2] ), [0, 0, 1]);
	mat4.rotate(i_Matrix, degToRad(this.Rotate[1] ), [0, 1, 0]);
	mat4.rotate(i_Matrix, degToRad(this.Rotate[0] ), [1, 0, 0]);
}

function Mesh_PreDraw()
{	
	if(!this.HasGeometry)
		return;

	// Bind the Color
  	gl.uniform3fv(CurrentShader.Program.AmbientColor_Uniform, this.AmbientColor);
  	gl.uniform3fv(CurrentShader.Program.DiffuseColor_Uniform, this.DiffuseColor);
    gl.uniform3fv(CurrentShader.Program.SpecularColor_Uniform,this.SpecularColor);
    gl.uniform1f(CurrentShader.Program.Shininess_Uniform, this.Shininess);
  	 	
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
   	
  		
    //Debug.Trace("Draw Mesh: "+ this.VertexPositionBuffer.numItems + " " +  this.VertexColorBuffer.numItems + " " + this.VertexIndexBuffer.numItems );
    gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer);
    gl.vertexAttribPointer(CurrentShader.Program.vertexPositionAttribute, this.VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
  
    if(this.VertexNormalBuffer != null)
    {
      // Bind the Normal buffer
   	  gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexNormalBuffer);
    	gl.vertexAttribPointer(CurrentShader.Program.vertexNormalAttribute, this.VertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    }

}



function Mesh_SmartDraw(i_MatrixRefs, i_Refs)
{
	this.PreDraw();
	
	var Copy = new Array();
	for(var i = 0; i < i_MatrixRefs.length; i++)
		Copy.push(mat4.create(i_MatrixRefs[i]));
	
	for(var i = 0; i < Copy.length; i++)
	{

			//mat4.multiply(mvMatrix, i_MatrixRefs);
			//this.Update(i_Refs[i]);
			this.TSR(Copy[i]);
			
			if(this.HasGeometry)
			{
				setmvMatrixUniform(Copy[i]);

				gl.drawArrays(gl.TRIANGLES, 0, this.VertexPositionBuffer.numItems);
				
			} 
	}

	  // Draw the children
	  for(var i = 0; i < this.Children.length; i++)
	  {
		this.Children[i].SmartDraw(Copy, i_Refs); 
	  }
}

function Mesh_PostDraw()
{
	
}

function Mesh_Draw()
{
	this.PreDraw();
	
	mvPushMatrix();
	this.TSR(mvMatrix);
	if(this.HasGeometry)
	{
		setmvMatrixUniform(mvMatrix);
		gl.drawArrays(gl.TRIANGLES, 0, this.VertexPositionBuffer.numItems);
	}
   
  // Draw the children
  for(var i = 0; i < this.Children.length; i++)
  {
    this.Children[i].Draw(); 
  }
   mvPopMatrix(); 
}

