	
function FBX_AnimationCurveNode()
{
	this.Number = -1;
	this.Name = null;
	this.Type = null;
	this.Properties = null;
	this.AnimationCurveList = new Array();
}

function FBX_Parser_ParseAnimationCurveNode(i_FileContainer)
{
	var NewAnimationCurveNode = new FBX_AnimationCurveNode();
 	if(i_FileContainer.HasNext)
  {
    var FirstLine = i_FileContainer.GetNextLine();
    if(FirstLine.length != 5 || FirstLine[0] != "AnimationCurveNode:" || FirstLine[4] != "{")
    {
      Debug.Trace("AnimationCurveNode: not formatted correctly");
      return null;
    }
    
    NewAnimationCurveNode.Number = parseInt(FirstLine[1],10);
    if(isNaN(NewAnimationCurveNode.Number))
    {
    	Debug.Trace("The AnimationCurveNode's number was NaN");
    	return null;
    }
    
    // Parse the NewAnimationCurveNode Name
    if(FirstLine[2][0] == "\"" && FirstLine[2][FirstLine[2].length -1] == "\"")
    {
      NewAnimationCurveNode.Name = FirstLine[2].substring(1, FirstLine[2].length - 1);
    }
    else
    {
      Debug.Trace("Material Name was formatted incorrectly");
      return null;
    }
    
    // Parse the NewAnimationCurveNode Type
    if(FirstLine[3][0] == "\"" && FirstLine[3][FirstLine[3].length - 1] == "\"")
    {
      NewAnimationCurveNode.Type = FirstLine[3].substring(1, FirstLine[3].length - 1);
    }
    else
    {
    	Debug.Trace("NewAnimationCurveNode Type was formatted incorrectly");
      return null;
    }
  }

  while(i_FileContainer.HasNext)
  {
    var CurrentLine = i_FileContainer.GetNextLine();
    if(CurrentLine[0] == "}")
    {
      // We found the end of the NewAnimationCurveNode
      return NewAnimationCurveNode;
    }
    else if(CurrentLine[0] == "Properties70:")
    {
    	// Parse the properties
    	i_FileContainer.StepBack();
      NewAnimationCurveNode.Properties = FBX_Parser_ParseProperties70(i_FileContainer);
    }
    else
    {
      Debug.Trace("Found Unknown Token in NewAnimationCurveNode: " + CurrentLine[0]);
      return null;
    }
  }
  
  Debug.Trace("Never saw the end bracket for NewAnimationCurveNode:");
  return null;
}
