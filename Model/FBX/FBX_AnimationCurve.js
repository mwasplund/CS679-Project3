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
		i_FileContainer.StepBack();
      NewAnimationCurve.KeyTime = FBX_Parser_ParseArrayInts(i_FileContainer);
      if(NewAnimationCurve.KeyTime == null)
      {
      	Debug.Trace("FBX ERROR: The AnimationCurve's KeyTime was null");
      	return null;
      }
    }
    else if(CurrentLine[0] == "KeyValueFloat:")
    {
		i_FileContainer.StepBack();
    	NewAnimationCurve.KeyValueFloat = FBX_Parser_ParseArrayFloats(i_FileContainer);
      if(NewAnimationCurve.KeyValueFloat == null)
      {
      	Debug.Trace("FBX ERROR: The AnimationCurve's KeyValueFloat was null");
      	return null;
      }
    }
    else if(CurrentLine[0] == "KeyAttrFlags:")
    {
		i_FileContainer.StepBack();
    	NewAnimationCurve.KeyAttrFlags = FBX_Parser_ParseArrayInts(i_FileContainer);
      if(NewAnimationCurve.KeyAttrFlags == null)
      {
      	Debug.Trace("FBX ERROR: The AnimationCurve's KeyAttrFlags was null");
      	return null;
      }
    }
    else if(CurrentLine[0] == "KeyAttrDataFloat:")
    {
		i_FileContainer.StepBack();
    	NewAnimationCurve.KeyAttrDataFloat = FBX_Parser_ParseArrayFloats(i_FileContainer);
      if(NewAnimationCurve.KeyAttrDataFloat == null)
      {
      	Debug.Trace("FBX ERROR: The AnimationCurve's KeyAttrDataFloat was null");
      	return null;
      }
    }
    else if(CurrentLine[0] == "KeyAttrRefCount:")
    {
		i_FileContainer.StepBack();
    	NewAnimationCurve.KeyAttrRefCount = FBX_Parser_ParseArrayInts(i_FileContainer);
      if(NewAnimationCurve.KeyAttrRefCount == null)
      {
      	Debug.Trace("FBX ERROR: The AnimationCurve's KeyAttrRefCount was null");
      	return null;
      }
    }
    else if(CurrentLine[0] == "Post-Extrapolation:")
    {
		i_FileContainer.StepBack();
    	NewAnimationCurve.PostExtrapolation = FBX_Parser_ParsePostExtrapolation(i_FileContainer);
      if(NewAnimationCurve.PostExtrapolation == null)
      {
      	Debug.Trace("FBX ERROR: The AnimationCurve's PostExtrapolation was null");
      	// MWA - this isnt working yet return null;
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
  var Count = -1;
  if(i_FileContainer.HasNext)
  {
    var FirstLine = i_FileContainer.GetNextLine();
    if(FirstLine.length != 3 || FirstLine[2] != "{")
    {
      Debug.Trace("FBX ERROR: ArrayInts not formatted correctly");
      return null;
    }
	
	Count = parseInt(FirstLine[1].substring(1));
    if(isNaN(Count))
    {
      Debug.Trace("FBX ERROR: The ArrayInts: count was NaN");
      return null;
    }
  }
  
  var NewArray = new Array(Count);
  var Index = 0;
  if(i_FileContainer.HasNext)
  {
    var SecondLine = i_FileContainer.GetNextLine();
    if(SecondLine[0] != "a:")
    {
      Debug.Trace("FBX ERROR: ArrayInts a: not formatted correctly");
      return null;
    }
    
    for(var i = 1; i < SecondLine.length; i++)
    {
      var Next = parseInt(SecondLine[i],10);
      if(isNaN(Next))
      {
        Debug.Trace("FBX ERROR: A Integer was NaN");
        return null;
      }
	  
	  if(Index < NewArray.length)
	  {
         NewArray[Index++] = Next;
	  }
	  else 
	  {
			Debug.Trace("FBX ERROR: There were more Integres in the array than we expected.");  
			return null;
	  }
    }
  }
  
  // Parse lines until we reach and end bracket
  while(i_FileContainer.HasNext)
  {
  	var CurrentLine = i_FileContainer.GetNextLine();
    if(CurrentLine[0] == "}")
    {
    	if(NewArray.length != Index)
    	{
    		Debug.Trace("FBX ERROR: Expected " + NewArray.length + " Integers but found " + Index);
    		return null;
    	}
    	else
    	{
      	 // The Array was correctly formatted
 				return NewArray;
 		}
    }
  
    for(var i = 0; i < CurrentLine.length; i++)
    {
      var Next = parseInt(CurrentLine[i], 10);
      if(isNaN(Next))
      {
        Debug.Trace("FBX ERROR: A Integer was NaN");
        return null;
      }
	  
	  if(Index < NewArray.length)
	  {
         NewArray[Index++] = Next;
	  }
	  else 
	  {
			Debug.Trace("FBX ERROR: There were more Integres in the array than we expected.");  
			return null;
	  }
    }
  }
  
   Debug.Trace("FBX ERROR: Never saw the end bracket for IntegerArray");
   return null;
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
	
  var Count = -1;
  if(i_FileContainer.HasNext)
  {
    var FirstLine = i_FileContainer.GetNextLine();
    if(FirstLine.length != 3 || FirstLine[2] != "{")
    {
      Debug.Trace("FBX ERROR: ArrayFloats not formatted correctly");
      return null;
    }
	
	Count = parseInt(FirstLine[1].substring(1));
    if(isNaN(Count))
    {
      Debug.Trace("FBX ERROR: The ArrayFloats: count was NaN");
      return null;
    }
  }

  var NewArray = new Array(Count);
  var Index = 0;
  if(i_FileContainer.HasNext)
  {
    var SecondLine = i_FileContainer.GetNextLine();
    if(SecondLine[0] != "a:")
    {
      Debug.Trace("FBX ERROR: ArrayFloats a: not formatted correctly");
      return null;
    }
    
    for(var i = 1; i < SecondLine.length; i++)
    {
      var Next = parseFloat(SecondLine[i]);
      if(isNaN(Next))
      {
        Debug.Trace("FBX ERROR: A Float was NaN");
        return null;
      }
	  
	  if(Index < NewArray.length)
	  {
         NewArray[Index++] = Next;
	  }
	  else 
	  {
			Debug.Trace("FBX ERROR: There were more Floats in the array than we expected.");  
			return null;
	  }
    }
  }
  
  // Parse lines until we reach and end bracket
  while(i_FileContainer.HasNext)
  {
  	var CurrentLine = i_FileContainer.GetNextLine();
    if(CurrentLine[0] == "}")
    {
    	if(NewArray.length != Index)
    	{
    		Debug.Trace("FBX ERROR: Expected " + Count + " Floats but found " + Index);
    		return null;
    	}
    	else
    	{
      	 // The Array was correctly formatted
 				return NewArray;
 		}
    }
  
    for(var i = 0; i < CurrentLine.length; i++)
    {
      var Next = parseFloat(CurrentLine[i]);
      if(isNaN(Next))
      {
        Debug.Trace("FBX ERROR: A Float was NaN");
        return null;
      }
	  
	  if(Index < NewArray.length)
	  {
         NewArray[Index++] = Next;
	  }
	  else 
	  {
			Debug.Trace("FBX ERROR: There were more Floats in the array than we expected.");  
			return null;
	  }
    }
  }
  
   Debug.Trace("FBX ERROR: Never saw the end bracket for ArrayFloats");
   return null;
}
