function Interpolate(i_StartValue, i_EndValue, i_Percent)
{
	if(i_Percent > 1)
		i_Percent = 1;
	else if(i_Percent < 0)
		i_Percent = 0;
		
	return (i_StartValue * (1 - i_Percent) + i_EndValue * i_Percent);	
}


function Mesh_Update(i_DeltaMilisec)
{
	this.DeltaMilisec += i_DeltaMilisec;
	
	  var RDM_NUM = 1539538600;
  var FPS = 24;
  var TimeToFrames = RDM_NUM / ((1/FPS) * 1000);
  var Time = this.DeltaMilisec * TimeToFrames;
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
				this.DeltaMilisec = 0;
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
				this.DeltaMilisec = 0;
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
				this.DeltaMilisec = 0;
		}
	}
  }
  
  // Update the children
  for(var i = 0; i < this.Children.length; i++)
  {
    this.Children[i].Update(i_DeltaMilisec); 
  }
}

function Mesh(i_Model, i_Parent)
{ 
  // Attach Functions
  this.Parent = i_Parent;

  this.TSR = Mesh_TSR;
  this.Update = Mesh_Update;
  Debug.Trace("Initialize Mesh");  
  
  // Copy over the animations
  this.Animations = i_Model.Animations;
  this.DeltaMilisec = 0;
  this.Children = new Array();
  
  if(i_Model.Geometry == null)
  {
    this.HasGeometry = false;
  }
  else
  {
    this.HasGeometry = true;
    
    // Vertices
    // Convert the Indexed Triangles to array of vertices
    this.Vertices = new Array();
    for(var i = 0; i < i_Model.Geometry.TriangleIndices.length; i++)
    {
  	
  	 	this.Vertices.push(i_Model.Geometry.Vertices[i_Model.Geometry.TriangleIndices[i] * 3 + 0] );
      	this.Vertices.push(i_Model.Geometry.Vertices[i_Model.Geometry.TriangleIndices[i] * 3 + 1] );
      	this.Vertices.push(i_Model.Geometry.Vertices[i_Model.Geometry.TriangleIndices[i] * 3 + 2] );
  	  
   }
    
	this.Normals = new Array();
	if(i_Model.Geometry.TriangleNormals.length == i_Model.Geometry.Vertices.length)
	{
		for(var i = 0; i < i_Model.Geometry.TriangleIndices.length; i++)
		{
			this.Normals.push(i_Model.Geometry.TriangleNormals[i_Model.Geometry.TriangleIndices[i] * 3 + 0]);
			this.Normals.push(i_Model.Geometry.TriangleNormals[i_Model.Geometry.TriangleIndices[i] * 3 + 1]);
			this.Normals.push(i_Model.Geometry.TriangleNormals[i_Model.Geometry.TriangleIndices[i] * 3 + 2]);
		  
	   }
	}
	else
	{
		this.Normals = i_Model.Geometry.TriangleNormals;
	}
    
	this.UV = null;
    if(i_Model.Geometry.TriangleUVIndices != null)
    {
		this.UV = new Array();
		var LayerElementUV = i_Model.Geometry.LayerElementUV;
		for(var i = 0; i <  i_Model.Geometry.TriangleUVIndices.length; i++)
		{
		  var Index = i_Model.Geometry.TriangleUVIndices[i];
		  this.UV.push(LayerElementUV.UV[2*Index]);
		  this.UV.push(LayerElementUV.UV[2*Index+1]);
		}	
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
      else if(Property.Name == "Shininess")
 	      this.Shininess = Property.Value;
  	}
  }
  
  // Check for children
  /*for(var i = 0; i < i_Model.Children.length; i++)
  {
    var CurrentModel = i_Model.Children[i];
  	if(CurrentModel != null)
  	{
      	this.Children.push(new Mesh(CurrentModel, this));		  
  	}
  }*/
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

function Mesh_TSR()
{
	mat4.scale(mvMatrix, this.Scale);

	mat4.translate(mvMatrix, this.Translate);

	mat4.rotate(mvMatrix, degToRad(this.PreRotate[2]), [0, 0, 1]);
    mat4.rotate(mvMatrix, degToRad(this.PreRotate[1]), [0, 1, 0]);
	mat4.rotate(mvMatrix, degToRad(this.PreRotate[0]), [1, 0, 0]);
	
	mat4.rotate(mvMatrix, degToRad(this.Rotate[2] ), [0, 0, 1]);
	mat4.rotate(mvMatrix, degToRad(this.Rotate[1] ), [0, 1, 0]);
	mat4.rotate(mvMatrix, degToRad(this.Rotate[0] ), [1, 0, 0]);
}
