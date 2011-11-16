function FBX_AnimationCurve()
{
	this.Number = -1;
	this.Type = null;
	this.Version = null;
	this.Default = -1;
	this.KeyVer = -1;
	this.KeyTime = null;
	this.KeyValueFloat = null;
	this.KeyAttrDataFloat = null;
	this.KeyAttrRefCount = null;
	this.Post_Extrapolation = null;
}

function FBX_Parser_ParseAnimationCurve(i_FileContainer)
{
	var NewAnimationCurve = new FBX_AnimationCurve();
 	if(i_FileContainer.HasNext)
  {
    var FirstLine = i_FileContainer.GetNextLine();
    if(FirstLine.length != 5 || FirstLine[0] != "AnimationCurve:" || FirstLine[4] != "{")
    {
      Debug.Trace("FBX ERROR: AnimationCurve not formatted correctly");
      return null;
    }
    
    NewAnimationCurve.Number = parseInt(FirstLine[1], 10);
    if(isNaN(NewAnimationCurve.Number))
    {
    	Debug.Trace("FBX ERROR: The AnimationCurve's number was NaN");
    	return null;
    }
    
    // Parse the AnimationCurve Name
    if(FirstLine[2][0] == "\"" && FirstLine[2][FirstLine[2].length -1] == "\"")
    {
      NewAnimationCurve.Name = FirstLine[2].substring(1, FirstLine[2].length - 1);
    }
    else
    {
      Debug.Trace("FBX ERROR: AnimationCurve Name was formatted incorrectly");
      return null;
    }
    
    // Parse the Texture Type
    if(FirstLine[3][0] == "\"" && FirstLine[3][FirstLine[3].length - 1] == "\"")
    {
      NewAnimationCurve.Type = FirstLine[3].substring(1, FirstLine[3].length - 1);
    }
    else
    {
    	Debug.Trace("FBX ERROR: AnimationCurve Type was formatted incorrectly");
      return null;
    }
  }

  while(i_FileContainer.HasNext)
  {
    var CurrentLine = i_FileContainer.GetNextLine();
    if(CurrentLine[0] == "}")
    {
      // We found the end of the Animation Curve
      return NewAnimationCurve;
    }
    else if(CurrentLine[0] == "Default:")
    {
    	NewAnimationCurve.Default = parseInt(FirstLine[1], 10);
      if(isNaN(NewAnimationCurve.Default))
      {
      	Debug.Trace("FBX ERROR: The AnimationCurve's Default was NaN");
      	return null;
      }
    }
		else if(CurrentLine[0] == "KeyVer:")
    {
    	NewAnimationCurve.KeyVer = parseInt(CurrentLine[1], 10);
      if(isNaN(NewAnimationCurve.KeyVer))
      {
      	Debug.Trace("FBX ERROR: The AnimationCurve's KeyVer was NaN");
      	return null;
      }
    }
    else if(CurrentLine[0] == "KeyTime:")
    {
    	NewAnimationCurve.KeyTime = FBX_Parser_ParseArrayInts(i_FileContainer);
      if(isNaN(NewAnimationCurve.KeyVer))
      {
      	Debug.Trace("FBX ERROR: The AnimationCurve's KeyVer was NaN");
      	return null;
      }
    }
    else if(CurrentLine[0] == "KeyValueFloat:")
    {
    	NewAnimationCurve.KeyValueFloat = FBX_Parser_ParseArrayFloats(i_FileContainer);
      if(isNaN(NewAnimationCurve.KeyVer))
      {
      	Debug.Trace("FBX ERROR: The AnimationCurve's KeyValueFloat was NaN");
      	return null;
      }
    }
    else if(CurrentLine[0] == "KeyAttrFlags:")
    {
    	NewAnimationCurve.KeyAttrFlags = FBX_Parser_ParseArrayInts(i_FileContainer);
      if(isNaN(NewAnimationCurve.KeyAttrFlags))
      {
      	Debug.Trace("FBX ERROR: The AnimationCurve's KeyValueFloat was NaN");
      	return null;
      }
    }
    else if(CurrentLine[0] == "KeyAttrDataFloat:")
    {
    	NewAnimationCurve.KeyAttrDataFloat = FBX_Parser_ParseArrayFloats(i_FileContainer);
      if(isNaN(NewAnimationCurve.KeyAttrDataFloat))
      {
      	Debug.Trace("FBX ERROR: The AnimationCurve's KeyValueFloat was NaN");
      	return null;
      }
    }
    else if(CurrentLine[0] == "KeyAttrRefCount:")
    {
    	NewAnimationCurve.KeyAttrRefCount = FBX_Parser_ParseArrayInts(i_FileContainer);
      if(isNaN(NewAnimationCurve.KeyAttrRefCount))
      {
      	Debug.Trace("FBX ERROR: The AnimationCurve's KeyValueFloat was NaN");
      	return null;
      }
    }
    else if(CurrentLine[0] == "Post-Extrapolation:")
    {
    	NewAnimationCurve.PostExtrapolation = FBX_Parser_ParsePostExtrapolation(i_FileContainer);
      if(isNaN(NewAnimationCurve.PostExtrapolation))
      {
      	Debug.Trace("FBX ERROR: The AnimationCurve's KeyValueFloat was NaN");
      	return null;
      }
    }
    else
    {
      Debug.Trace("Found Unknown Token in AnimationCurve: " + CurrentLine[0]);
      return null;
    }
  }
  
  Debug.Trace("Never saw the end bracket for AnimationCurve:");
  return null;
}


function FBX_Parser_ParseArrayInts(i_FileContainer)
{
  while(i_FileContainer.HasNext)
  {
    var CurrentLine = i_FileContainer.GetNextLine();
    if(CurrentLine[0] == "}")
    {
      // We found the end of the Animation Curve
      return null;
    }
  }
}

function FBX_Parser_ParsePostExtrapolation(i_FileContainer)
{
  while(i_FileContainer.HasNext)
  {
    var CurrentLine = i_FileContainer.GetNextLine();
    if(CurrentLine[0] == "}")
    {
      // We found the end of the Animation Curve
      return null;
    }
  }
}


function FBX_Parser_ParseArrayFloats(i_FileContainer)
{
  while(i_FileContainer.HasNext)
  {
    var CurrentLine = i_FileContainer.GetNextLine();
    if(CurrentLine[0] == "}")
    {
      // We found the end of the Animation Curve
      return null;
    }
  }
}
