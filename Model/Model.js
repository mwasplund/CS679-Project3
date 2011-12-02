<<<<<<< HEAD
﻿LoadjsFile("Model/FBX/FBX_Parser.js");
LoadjsFile("Model/Mesh.js");

function Model(i_FileName)
{
  // Functions
  this.ParseFile = Model_ParseFile;
  this.Draw = Model_Draw;
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
  var NewModel      = this;
  NewModel.Ready    = false;
  
  var loadSuccess = function(returned_data) {
      Debug.Trace("Model ("+ NewModel.Name +") Loaded: " + NewModel.FilePath);
      NewModel.ParseFile(returned_data);
  };
  // Load the file
  NewModel.FilePath = "sceneassets/models/" + i_FileName + ".FBX";
  $.get(NewModel.FilePath)
    .success(loadSuccess)
    .error(function() {
        NewModel.FilePath = "sceneassets/models/" + i_FileName + ".fbx";
        $.get(NewModel.FilePath).success(loadSuccess);
    });

  Debug.Trace("Loading Model: " + this.FilePath);
}

function Model_ParseFile(i_File)
{
  Debug.Trace("Parsing Model ("+ this.Name +"): " + this.FilePath);

  var Parser = new FBX_Parser(i_File);
  if(Parser == null)
  {
    Debug.Trace("There was an error loading the File");
    return null;
  }
  
  if(Parser.Objects == null)
  {
    Debug.Trace("There were no objects found in the FBX file");
    return null;
  }
    
  if(Parser.Objects.GeometryList == null)
  {
    Debug.Trace("There were no Geometries in the FBX Objects");
    return null;
  }
  
  this.Meshes = new Array();
  for(var i = 0; i < Parser.Models.length; i++)
  {
    var CurrentModel = Parser.Models[i];

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
    for(var i = 0; i < this.Meshes.length; i++)
    {
      this.Meshes[i].Draw();
    }
  }
}
=======
﻿LoadjsFile("Model/Mesh.js");
LoadjsFile("glMatrix.js");

function Model(i_FileName)
{
  // Functions
  this.ParseFile = Model_ParseFile;
  this.Draw = Model_Draw;
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
    for(var i = 0; i < this.Meshes.length; i++)
    {
      this.Meshes[i].Draw();
    }
  }
}
>>>>>>> 26c48ecddf664051298530a771984e5367c5af72
