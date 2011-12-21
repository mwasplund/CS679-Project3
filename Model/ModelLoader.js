//importScripts('FBX/FBX_Parser.js', '../Libs/gserializer.js', '../glMatrix.js');
LoadjsFile('Model/FBX/FBX_Parser.js');
LoadjsFile('Model/Model.js');
LoadjsFile('glMatrix.js');

function ModelLoader_File(i_Text, i_Model)
{
  this.Text = i_Text;
  this.Model = i_Model;
}

function SetSmartDraw(i_Value)
{
	Debug.error("Optimization_GroupModelRefs = " + i_Value);
	Loader.Optimization_GroupModelRefs = i_Value;
}

function ModelLoader()
{
	this.Optimization_GroupModelRefs = true;

  this.load = ModelLoader_load;
  this.LoadLoop = ModelLoader_LoadLoop;
  this.Models = new Array();
  this.Files = new Array();
  this.FilesLoaded = 0;
  this.TimerFunc = ModelLoader_TimerFunc;
  this.Timer = null;
  this.TimerOn = false;
  this.StartLoading = ModelLoader_StartLoading;
  this.StopLoading = ModelLoader_StopLoading;
  this.GetModel = ModelLoader_GetModel;
  this.DrawModels = function(i_CurTime)
  {
    gl.enableVertexAttribArray(CurrentShader.Program.vertexPositionAttribute);
    gl.enableVertexAttribArray(CurrentShader.Program.vertexNormalAttribute);
    gl.enableVertexAttribArray(CurrentShader.Program.textureCoordAttribute);

	if(this.Optimization_GroupModelRefs)
	{
		for(var i = 0; i < this.Models.length; i++)
		{
			this.Models[i].SmartDraw(i_CurTime);
		}
	}
	else
	{
		for(var i = 0; i < this.Models.length; i++)
		{
			this.Models[i].Draw(i_CurTime);
		}
	}

    gl.disableVertexAttribArray(CurrentShader.Program.vertexPositionAttribute);
    gl.disableVertexAttribArray(CurrentShader.Program.vertexNormalAttribute);
    gl.disableVertexAttribArray(CurrentShader.Program.textureCoordAttribute);
  }
  
  this.getPercentLoaded = function()
  {
    var Total = this.Models.length;
    if(Total == 0)
      return 0;
    return 50 * (this.FilesLoaded / Total)  + 50 * ((this.Files.length + this.FilesLoaded) / Total);
  }
}

function ModelRef(i_Model)
{
	this.Model = i_Model;
	this.DoDraw = false;
	this.Position = [0,0,0];
	this.Rotate = [0,0,0];
	this.Scale = [1.0,1.0,1.0];
	this.Time = 0;
	this.StartTime = Date.now();
	
	this.Draw = function()
	{
		this.DoDraw = true;
	}
	
	this.Update = function(i_DeltaMili)
	{
		this.Time += i_DeltaMili;
	}
}

/******************************************************/
/* GetModel
/*
/* This function finds one of the pre-loaded models.
/******************************************************/
function ModelLoader_GetModel(i_ModelName)
{
	for(var i = 0; i < this.Models.length; i++)
	{
		if(this.Models[i].Name == i_ModelName)
		{
			var Ref = new ModelRef(this.Models[i]);
			this.Models[i].Refs.push(Ref);
			return Ref;
		}
	}
	
	// Could not find the Model
	Debug.error("ERROR: Could not find Model - " + i_ModelName);
	return null;
}


function ModelLoader_load(i_FileName)
{
  // Load the file
  var NewModel = new Model(i_FileName);
  this.Models.push(NewModel);
  
  var Loader = this;
  var FilePath = "sceneassets/models/" + i_FileName + ".FBX";
  var loadSuccess = function(returned_data) 
  {
      Debug.Trace("Model ("+ i_FileName +") Loaded: " + FilePath);
      Loader.Files.push(new ModelLoader_File(returned_data, NewModel));  
        
  };

  $.get(FilePath)
    .success(loadSuccess)
    .error(function() {
        FilePath = "sceneassets/models/" + i_FileName + ".fbx";
        $.get(FilePath).success(loadSuccess);
    });
	
	// Add the model to the list of selections
	  var SelectModel = document.getElementById('SelectModel');
	  if(SelectModel != null)
	  {
		   var NewOption = document.createElement('option');
		   NewOption.text = i_FileName;
		   NewOption.value = i_FileName;
		  
		  try {
			SelectModel.add(NewOption, null); // standards compliant; doesn't work in IE
		  }
		  catch(ex) {
			SelectModel.add(NewOption); // IE only
		  }
	  }
};

function ModelLoader_TimerFunc()
{
 // Debug.out("Timer Loop");
  Loader.LoadLoop();
}

function ModelLoader_StartLoading()
{
  if(!this.TimerOn)
  {
    this.TimerOn = true;
    this.Timer = setTimeout("ModelLoader_TimerFunc()", 100);
  }
}

function ModelLoader_StopLoading()
{
  this.TimerOn = false;
  clearTimeout(this.Timer);
}


function ModelLoader_LoadLoop()
{
  //Debug.out("Load Loop");
  if(this.TimerOn)
  {
    if(this.Files.length > 0)
    {
      var CurrentFile = this.Files.pop();
      Debug.out("Parsing next File: " + CurrentFile.Model.Name);
      this.FilesLoaded ++;
      CurrentFile.Model.ParseFile(new FBX_Parser(CurrentFile.Text));
      Debug.out("File Parsed and loaded = " + CurrentFile.Model.Name);
      
    }
    
    this.Timer = setTimeout("ModelLoader_TimerFunc()", 100);
  }
}
