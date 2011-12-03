function FBX_Objects()
{
  this.GeometryList = new Array();
  this.ModelList = new Array();
  this.TextureList = new Array();
  this.MaterialList = new Array();
  this.AnimationCurveList = new Array();
  this.AnimationCurveNodeList = new Array();
}

function FBX_Parser_ParseObjects(i_FileContainer)
{
  // The next token should be a Right Bracket
  if(i_FileContainer.HasNext)
  {
    var FirstLine = i_FileContainer.GetNextLine();
    if(FirstLine.length != 2 || FirstLine[0] != "Objects:" || FirstLine[1] != "{")
    {
      Debug.Trace("FBX ERROR: Objects not formatted correctly. Objects: {");
      return null;
    }
  }
  
  var Objects = new FBX_Objects();
  while(i_FileContainer.HasNext)
  {
    var CurrentLine = i_FileContainer.GetNextLine();
    if(CurrentLine[0] == "}")
    {
      // We found the end of the objects class
      return Objects;
    }
    else if(CurrentLine[0] == "Geometry:")
    {
      i_FileContainer.StepBack();
      var Geometry = FBX_Parser_ParseGeometry(i_FileContainer);
      if(Geometry != null)
      {
        Objects.GeometryList.push(Geometry);
      }
      else
      {
        Debug.Trace("FBX ERROR: There was an error parsing a Geometry in the Objects:");
        return null;
      }
    }
    else if(CurrentLine[0] == "Model:")
    {
      i_FileContainer.StepBack();
      var Model = FBX_Parser_ParseModel(i_FileContainer);
      if(Model != null)
      {
        Objects.ModelList.push(Model);
      }
      else
      {
        Debug.Trace("FBX ERROR: There was an error parsing a Model in the Objects:");
        return null;
      }
    }
    else if(CurrentLine[0] == "Texture:")
    {
      i_FileContainer.StepBack();
      var Texture = FBX_Parser_ParseTexture(i_FileContainer);
      if(Texture != null)
      {
        Objects.TextureList.push(Texture);
      }
      else
      {
        Debug.Trace("FBX ERROR: There was an error parsing a Texture in the Objects:");
        return null;
      }
    }
    else if(CurrentLine[0] == "Material:")
    {
      i_FileContainer.StepBack();
      var Material = FBX_Parser_ParseMaterial(i_FileContainer);
      if(Material != null)
      {
        Objects.MaterialList.push(Material);
      }
      else
      {
        Debug.Trace("FBX ERROR: There was an error parsing a Material in the Objects:");
        return null;
      }
    }
    else if(CurrentLine[0] == "AnimationCurve:")
    {
      i_FileContainer.StepBack();
      var AnimationCurve = FBX_Parser_ParseAnimationCurve(i_FileContainer);
      if(AnimationCurve != null)
      {
        Objects.AnimationCurveList.push(AnimationCurve);
      }
      else
      {
        Debug.Trace("FBX ERROR: There was an error parsing an AnimationCurve in the Objects:");
        return null;
      }
    }
    else if(CurrentLine[0] == "AnimationCurveNode:")
    {
      i_FileContainer.StepBack();
      var AnimationCurveNode = FBX_Parser_ParseAnimationCurveNode(i_FileContainer);
      if(AnimationCurveNode != null)
      {
        Objects.AnimationCurveNodeList.push(AnimationCurveNode);
      }
      else
      {
        Debug.Trace("FBX ERROR: There was an error parsing an AnimationCurveNode in the Objects:");
        return null;
      }
    }
    else
    {
      //Debug.Trace("FBX ERROR: Found Unknown Token in Objects: " + CurrentLine[0]);
      FBX_Parser_HandleUnknownToken(i_FileContainer);
    }
  }
  
  Debug.Trace("FBX ERROR: Never saw the end bracket for Objects:");
  return null;
}
