LoadjsFile("Model/Mesh.js");
LoadjsFile("glMatrix.js");

function Model(i_FileName)
{
  // Functions
  this.ParseFile = Model_ParseFile;
  this.Draw = Model_Draw;
  this.SmartDraw = Model_SmartDraw;
  this.Refs = new Array();
  
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

  this.Ready = true;
}


function Model_Draw()
{
  if(this.Ready)
  {
  	for(var k = 0; k < this.Refs.length; k++)
	{
		mvPushMatrix();
		mat4.translate(mvMatrix, this.Refs[k].Position);
		mat4.scale(mvMatrix, this.Refs[k].Scale);
		mat4.rotateZ(mvMatrix, this.Refs[k].Rotate[2]);
		mat4.rotateY(mvMatrix, this.Refs[k].Rotate[1]);
		mat4.rotateX(mvMatrix, this.Refs[k].Rotate[0]);
		
		for(var i = 0; i < this.Meshes.length; i++)
		{
			this.Meshes[i].Draw();
		}
		mvPopMatrix();
	}
  }
}

function Model_SmartDraw()
{
  if(this.Ready)
  {
	var RefMatrix = new Array();
	for(var k = 0; k < this.Refs.length; k ++)
	{
		if(this.Refs[k].DoDraw)
		{
			this.Refs[k].DoDraw = false;
			var Matrix = mat4.create(mvMatrix);
			mat4.translate(Matrix, this.Refs[k].Position);
			mat4.scale(Matrix, this.Refs[k].Scale);
			mat4.rotateZ(Matrix, this.Refs[k].Rotate[2]);
			mat4.rotateY(Matrix, this.Refs[k].Rotate[1]);
			mat4.rotateX(Matrix, this.Refs[k].Rotate[0]);
			RefMatrix.push(Matrix);
		}
	}
	
	for(var i = 0; i < this.Meshes.length; i++)
	{
		this.Meshes[i].SmartDraw(RefMatrix);
	}
  }
}
