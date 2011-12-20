/******************************************************/
/* Helper.js
/*
/* Helper Functions that make using javascript easier
/******************************************************/

/******************************************************/
/* CanvasSupported
/*
/* This function checks if the html canvas elent is 
/* supported.
/******************************************************/
function CanvasSupported()
{
  return !document.createElement('TestCanvas').getContext;
}

/******************************************************/
/* getMousePosition
/*
/* Crossbrowser safe function that returns the current
/* location of the mouse. It also converts the mouse's 
/* absolute position in the page to a relative position
/* to the upper left corner of the canvas
/*
/* e - pass in the mouse even to be used to find mouse
/*     position
/******************************************************/
function getMousePosition(e) 
{
  var x;
  var y;
  if (e.pageX != undefined && e.pageY != undefined) 
  {
    x = e.pageX;
    y = e.pageY;
  }
  else 
  {
    x = e.clientX + document.body.scrollLeft +
          document.documentElement.scrollLeft;
    y = e.clientY + document.body.scrollTop +
          document.documentElement.scrollTop;
  }
  
  // Make the position in canvas space
  x -= Canvas.offsetLeft;
  y -= Canvas.offsetTop;
  
  return new Point(x, y);
}
  
/******************************************************/
/* GetWindowSize
/*
/* Crossbrowser safe function that returns the current
/* windows size.
/******************************************************/
function GetWindowSize()
{
  var Size = new Point(0,0);
  if (window.innerWidth && window.innerHeight) 
  {
    Size.X = window.innerWidth;
    Size.Y = window.innerHeight;
  }
  else if (document.body && document.body.offsetWidth) 
  {
    Size.X = document.body.offsetWidth;
    Size.Y = document.body.offsetHeight;
  }
  else if (document.compatMode=='CSS1Compat' &&
      document.documentElement &&
      document.documentElement.offsetWidth ) 
  {
    Size.X = document.documentElement.offsetWidth;
    Size.Y = document.documentElement.offsetHeight;
  }
  
  return Size;
}

/******************************************************/
/* Point
/*
/* A simple class that holds an X,Y Position.
/******************************************************/
function Point(i_X, i_Y) 
{
    this.X = i_X;
    this.Y = i_Y;
}

/******************************************************/
/* degToRad
/*
/* A function that converts an angle from degrees to 
/* radians.
/******************************************************/
function degToRad(degrees) 
{
  return degrees * Math.PI / 180;
}

/******************************************************/
/* checkGLError
/*
/* A function that checks for an error in gl
/******************************************************/
var PrevError = -1;
var ErrorCount = 0;
function checkGLError() 
{
 var error = gl.getError();
 if (error != gl.NO_ERROR && error != gl.CONTEXT_LOST_WEBGL)
 {
	 if(error != PrevError)
	 {
		ErrorCount = 0;
		   var str = "GL Error: " + error;
		   Debug.error(str);
		   PrevError = error;
	 }
	 else
	 {
		ErrorCount++;
		if(ErrorCount < 100)
		{
			var str = "GL Error: " + error;
			Debug.error(str);
		}
	 }
 }
}

function SetDebugState(i_Value)
{
  if(DEBUG != i_Value)
  {
	  DEBUG = i_Value;
	  if(DEBUG)
	  {
		 $("#Menu_Debug").slideDown("slow");
	  }
	  else
	  {
		$("#Menu_Debug").slideUp("slow");
	  }
  }
}
