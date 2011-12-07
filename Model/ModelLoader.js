//importScripts('FBX/FBX_Parser.js', '../Libs/gserializer.js', '../glMatrix.js');
LoadjsFile('Model/FBX/FBX_Parser.js');
LoadjsFile('Model/Model.js');
LoadjsFile('glMatrix.js');

function ModelLoader_File(i_Text, i_Model)
{
  this.Text = i_Text;
  this.Model = i_Model;
}

function ModelLoader()
{
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
  
  this.getPercentLoaded = function()
  {
    var Total = this.Models.length;
    if(Total == 0)
      return 0;
    return 50 * (this.FilesLoaded / Total)  + 50 * ((this.Files.length + this.FilesLoaded) / Total);
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
			return this.Models[i];
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