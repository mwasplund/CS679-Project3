﻿var debugFlag;
/******************************************************/
/* SelectShader
/*
/* This function allows the program to update the current
/* shader on the fly. Pass in the name of the shader
/* you wish to select and the function will change
/* to that program. If the shader is not found nothing
/* happens
/******************************************************/
function SelectShader(i_ShaderName)
{
	Debug.Trace("Select Shader " + i_ShaderName);
	var Shader = GetShader(i_ShaderName);
	if(Shader != null)
		CurrentShader = Shader;

}

/******************************************************/
/* SelectModel
/*
/* This function allows the program to update the current
/* Model on the fly. Pass in the name of the Model
/* you wish to select and the function will change
/* to that TestModel. If the Model is not found nothing
/* happens
/******************************************************/
function SelectModel(i_ModelName)
{
	Debug.Trace("Select Model " + i_ModelName);
	var Model = GetModel(i_ModelName);
	if(Model != null)
		TestModel = Model;
}



/******************************************************/
/* SetClearColor_Red
/*
/* This function allows the program to update the current
/* Clear color on the fly.
/******************************************************/
function SetClearColor_Red(i_Value)
{
  Debug.Trace("Set Clear Color Red");
  if(!isNaN(i_Value))
  {
    // Limit the value to 0.0 to 1.0
    if(i_Value > 1.0)  
      ClearColor[0] = 1.0;
    else if(i_Value < 0.0)
      ClearColor[0] = 0.0;
    else 
      ClearColor[0] = i_Value;
      
    gl.clearColor(ClearColor[0], ClearColor[1], ClearColor[2], 1.0);
  }
}
 
/******************************************************/
/* SetClearColor_Blue
/*
/* This function allows the program to update the current
/* Clear color on the fly.
/******************************************************/
function SetClearColor_Blue(i_Value)
{
  Debug.Trace("Set Clear Color Blue");
  if(!isNaN(i_Value))
  {
    // Limit the value to 0.0 to 1.0
    if(i_Value > 1.0)  
      ClearColor[1] = 1.0;
    else if(i_Value < 0.0)
      ClearColor[1] = 0.0;
    else 
      ClearColor[1] = i_Value;
      
    gl.clearColor(ClearColor[0], ClearColor[1], ClearColor[2], 1.0);
  }
}

/******************************************************/
/* SetClearColor_Green
/*
/* This function allows the program to update the current
/* Clear color on the fly.
/******************************************************/
function SetClearColor_Green(i_Value)
{
  Debug.Trace("Set Clear Color Green");
  if(!isNaN(i_Value))
  {
    // Limit the value to 0.0 to 1.0
    if(i_Value > 1.0)  
      ClearColor[2] = 1.0;
    else if(i_Value < 0.0)
      ClearColor[2] = 0.0;
    else 
      ClearColor[2] = i_Value;
      
    gl.clearColor(ClearColor[0], ClearColor[1], ClearColor[2], 1.0);
  }
}
