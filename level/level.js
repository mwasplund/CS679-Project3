/* © 2009 ROBO Design
 * http://www.robodesign.ro
 */


// Keep everything in anonymous function, called on window load.
if (window.addEventListener) {
    var lineArray = [];
    var polyArray = [];
    var first = false;
    var player = false;


    function undoPlayer() {
	if(player) player = false;
	var found = false;
	imageView.getContext('2d').clearRect(0, 0, imageView.width, imageView.height);
  
  
	//find last player type and get rid of it
	if(!found){
	    for(var i = polyArray.length -1 ; i >=0 ; i --){
		  
		if(polyArray[i].id.toString()  == "player" && !found)
		    {
			polyArray.splice(i,1);
			found = true;
			
			
		    }
		  
	    } 
  
	} // if found loop
  
	//re- draw loop
	for (var i = 0; i < polyArray.length ; i++) {
	      
	      
	      
	      
	    if(polyArray[i].id.toString() == "wall"){
		imageView.getContext('2d').beginPath();
		imageView.getContext('2d').moveTo(polyArray[i].xStart, polyArray[i].yStart);
		imageView.getContext('2d').lineTo(polyArray[i].xFinish, polyArray[i].yFinish);
		imageView.getContext('2d').stroke();
		imageView.getContext('2d').closePath();
	    }
	      

	    else   if(polyArray[i].id.toString() == "player"){
		
		  
		    
		imageView.getContext('2d').beginPath();
		 
		imageView.getContext('2d').arc(polyArray[i].xLoc, polyArray[i].yLoc, 10, 0, Math.PI*2, true); 
		 
		imageView.getContext('2d').fillStyle = polyArray[i].color.toString();
		imageView.getContext('2d').fill();
		imageView.getContext('2d').closePath();
		//imageView.getContext('2d').closePath();

	    }else if( polyArray[i].id.toString() == "enemy"){
		imageView.getContext('2d').beginPath();
		 
		imageView.getContext('2d').arc(polyArray[i].xLoc, polyArray[i].yLoc, 10, 0, Math.PI*2, true); 
		 
		imageView.getContext('2d').fillStyle = polyArray[i].color.toString();
		imageView.getContext('2d').fill();
		imageView.getContext('2d').closePath();
	    }
	     
	     
	       
	}
    }
  
   
    function undoPoly() {
	var found = false;
	imageView.getContext('2d').clearRect(0, 0, imageView.width, imageView.height);
  
  
	//find last wall type and get rid of it
	if(!found){
	    for(var i = polyArray.length -1 ; i >=0 ; i --){
		  
		if(polyArray[i].id.toString()  == "wall" && !found)
		    {
			polyArray.splice(i,1);
			found = true;
			
			
		    }
		  
	    }
  
	}
  
	//re- draw loop
	for (var i = 0; i < polyArray.length ; i++) {
	      
	      
	      
	      
	    if(polyArray[i].id.toString() == "wall"){
		imageView.getContext('2d').beginPath();
		imageView.getContext('2d').moveTo(polyArray[i].xStart, polyArray[i].yStart);
		imageView.getContext('2d').lineTo(polyArray[i].xFinish, polyArray[i].yFinish);
		imageView.getContext('2d').stroke();
		imageView.getContext('2d').closePath();
	    }
	      

	    else   if(polyArray[i].id.toString() == "player"){
		
		  
		    
		imageView.getContext('2d').beginPath();
		 
		imageView.getContext('2d').arc(polyArray[i].xLoc, polyArray[i].yLoc, 10, 0, Math.PI*2, true); 
		 
		imageView.getContext('2d').fillStyle = polyArray[i].color.toString();
		imageView.getContext('2d').fill();
		imageView.getContext('2d').closePath();
		//imageView.getContext('2d').closePath();

	    }else if( polyArray[i].id.toString() == "enemy"){
		imageView.getContext('2d').beginPath();
		 
		imageView.getContext('2d').arc(polyArray[i].xLoc, polyArray[i].yLoc, 10, 0, Math.PI*2, true); 
		 
		imageView.getContext('2d').fillStyle = polyArray[i].color.toString();
		imageView.getContext('2d').fill();
		imageView.getContext('2d').closePath();
	    }
	     
	     
	     
	       
	}
  
    }
   
   
    function undoEnemy() {
	var found = false;
	imageView.getContext('2d').clearRect(0, 0, imageView.width, imageView.height);
  
  
	//find last wall type and get rid of it
	if(!found){
	    for(var i = polyArray.length -1 ; i >=0 ; i --){
		  
		if(polyArray[i].id.toString()  == "enemy" && !found)
		    {
			polyArray.splice(i,1);
			found = true;
			
			
		    }
		  
	    }
  
	}
  
	//re- draw loop
	for (var i = 0; i < polyArray.length ; i++) {
	      
	      
	      
	      
	    if(polyArray[i].id.toString() == "wall"){
		imageView.getContext('2d').beginPath();
		imageView.getContext('2d').moveTo(polyArray[i].xStart, polyArray[i].yStart);
		imageView.getContext('2d').lineTo(polyArray[i].xFinish, polyArray[i].yFinish);
		imageView.getContext('2d').stroke();
		imageView.getContext('2d').closePath();
	    }
	      

	    else   if(polyArray[i].id.toString() == "player"){
		
		  
		    
		imageView.getContext('2d').beginPath();
		 
		imageView.getContext('2d').arc(polyArray[i].xLoc, polyArray[i].yLoc, 10, 0, Math.PI*2, true); 
		 
		imageView.getContext('2d').fillStyle = polyArray[i].color.toString();
		imageView.getContext('2d').fill();
		imageView.getContext('2d').closePath();
		//imageView.getContext('2d').closePath();

	    }else if( polyArray[i].id.toString() == "enemy"){
		imageView.getContext('2d').beginPath();
		 
		imageView.getContext('2d').arc(polyArray[i].xLoc, polyArray[i].yLoc, 10, 0, Math.PI*2, true); 
		 
		imageView.getContext('2d').fillStyle = polyArray[i].color.toString();
		imageView.getContext('2d').fill();
		imageView.getContext('2d').closePath();
	    }
	     
	     
	     
	       
	}
  
    }
   
    function generateCode() {
   
	var newtext = "<!DOCTYPE html> \n <html lang=\"en\"> \n  <head>\n <meta charset=\"utf-8\"> \n <title>Level</title> \n <style type=\"text\/css\"><!-- #container { position: relative;  #imageView { border: 1px solid #000; } #imageTemp { position: absolute; top: 1px; left: 1px; } --></style> \n ";
	newtext += "<script type=\"text\/javascript\"> \n function load() { \n  var polyArray = []; \n";

	//get all positions of array, player, and enemies
	for (var i = 0; i < polyArray.length; i++) {


	    if(polyArray[i].id == "wall"){
		var tempXstart = polyArray[i].xStart.toString();
		var tempYstart = polyArray[i].yStart.toString();
		var tempXfinish = polyArray[i].xFinish.toString();
		var tempYfinish = polyArray[i].yFinish.toString();
		var id = polyArray[i].id.toString();
		   
		newtext += "polyArray[polyArray.length] = { 'xStart': " + tempXstart + ", 'yStart': " + tempYstart + ", 'xFinish': " + tempXfinish + ", 'yFinish': " + tempYfinish + ", 'id': \"" +id +"\" }; \n";
	    } // end wall
	    else if(polyArray[i].id == "player"){
		var tempXloc = polyArray[i].xLoc.toString();
		var tempYloc = polyArray[i].yLoc.toString();
		var tempColor = polyArray[i].color.toString();
		var id = polyArray[i].id.toString();
		   
		newtext += "polyArray[polyArray.length] = { 'xLoc': " + tempXloc + ", 'yLoc': " + tempYloc + ", 'color': \"" + tempColor + "\" , 'id': \"" + id + "\" }; \n";
		   
		   
	    }//  end player 
	    else if(polyArray[i].id == "enemy"){
		   
		var tempXloc = polyArray[i].xLoc.toString();
		var tempYloc = polyArray[i].yLoc.toString();
		var tempColor = polyArray[i].color.toString();
		var id = polyArray[i].id.toString();
		var enemy = polyArray[i].enemy.toString();
		   
		newtext += "polyArray[polyArray.length] = { 'xLoc': " + tempXloc + ", 'yLoc': " + tempYloc + ", 'color': \"" + tempColor + "\" , 'id': \"" + id + "\", 'enemy': \"" +enemy + "\"}; \n";
		   
		   
		   
		   
	    }// end enemy
	}
	newtext += " imageView.getContext('2d').clearRect(0, 0, imageView.width, imageView.height); \n for (var i = 0; i < polyArray.length ; i++) \n{ \n if(polyArray[i].id.toString() == \"wall\"){ \n  imageView.getContext('2d').beginPath(); \n  imageView.getContext('2d').moveTo(polyArray[i].xStart, polyArray[i].yStart); \n imageView.getContext('2d').lineTo(polyArray[i].xFinish, polyArray[i].yFinish); \n  imageView.getContext('2d').stroke(); \n imageView.getContext('2d').closePath(); \n  } \n else   if(polyArray[i].id.toString() == \"player\"){ \n imageView.getContext('2d').beginPath(); \n imageView.getContext('2d').arc(polyArray[i].xLoc, polyArray[i].yLoc, 15, 0, Math.PI*2, true);  \n imageView.getContext('2d').fillStyle = polyArray[i].color.toString(); \n imageView.getContext('2d').fill(); \n  imageView.getContext('2d').closePath(); \n //imageView.getContext('2d').closePath(); \n }else if( polyArray[i].id.toString() == \"enemy\"){ \n imageView.getContext('2d').beginPath(); \n imageView.getContext('2d').arc(polyArray[i].xLoc, polyArray[i].yLoc, 10, 0, Math.PI*2, true); \n imageView.getContext('2d').fillStyle = polyArray[i].color.toString(); \n imageView.getContext('2d').fill(); \n imageView.getContext('2d').closePath(); \n } \n }\n ";
   
   
	newtext += "\n } \n   </script>  </head> \n ";
	newtext += " \n <body onload = \"load()\"> \n <div id=\"container\"> \n <canvas id=\"imageView\" width=\"1000\" height=\"1000\"> \n </canvas> \n</div> \n </body> \n</html> \n ";
   
   
	document.myform.outputtext.value = newtext;
   

   
   
   
 
    }

    window.addEventListener('load', function () {
	    var canvas, context, canvaso, contexto;
	       
	    // The active tool instance.
	    var tool;
	    var tool_default = 'poly';
	       
	    function init() {
		// Find the canvas element.
		canvaso = document.getElementById('imageView');
		if (!canvaso) {
		    alert('Error: I cannot find the canvas element!');
		    return;
		}
		   
		if (!canvaso.getContext) {
		    alert('Error: no canvas.getContext!');
		    return;
		}
		   
		// Get the 2D canvas context.
		contexto = canvaso.getContext('2d');
		if (!contexto) {
		    alert('Error: failed to getContext!');
		    return;
		}
		   
		// Add the temporary canvas.
		var container = canvaso.parentNode;
		canvas = document.createElement('canvas');
		if (!canvas) {
		    alert('Error: I cannot create a new canvas element!');
		    return;
		}

		canvas.id = 'imageTemp';
		canvas.width = canvaso.width;
		canvas.height = canvaso.height;
		container.appendChild(canvas);
		   
		context = canvas.getContext('2d');
		   
		   
		   
		   
		   




		   
		   
		// Get the tool select input.
		var tool_select = document.getElementById('dtool');
		if (!tool_select) {
		    alert('Error: failed to get the dtool element!');
		    return;
		}
		tool_select.addEventListener('change', ev_tool_change, false);
		   
		// Activate the default tool.
		if (tools[tool_default]) {
		    tool = new tools[tool_default]();
		    tool_select.value = tool_default;
		}
		   
		// Attach the mousedown, mousemove and mouseup event listeners.
		canvas.addEventListener('mousedown', ev_canvas, false);
		canvas.addEventListener('mousemove', ev_canvas, false);
		canvas.addEventListener('mouseup', ev_canvas, false);
	    }
	       
	    // The general-purpose event handler. This function just determines the mouse 
	    // position relative to the canvas element.
	    function ev_canvas(ev) {
		if (ev.layerX || ev.layerX == 0) { // Firefox
		    ev._x = ev.layerX;
		    ev._y = ev.layerY;
		} 

		// Call the event handler of the tool.
		var func = tool[ev.type];
		if (func) {
		    func(ev);
		}
	    }
	       
	    // The event handler for any changes made to the tool selector.
	    function ev_tool_change(ev) {
		if (tools[this.value]) {
		    tool = new tools[this.value]();
		}
	    }
	       
	    // This function draws the #imageTemp canvas on top of #imageView, after which 
	    // #imageTemp is cleared. This function is called each time when the user 
	    // completes a drawing operation.
	    function img_update() {
		contexto.drawImage(canvas, 0, 0);
		context.clearRect(0, 0, canvas.width, canvas.height);
	    }
	       

	    // This object holds the implementation of each drawing tool.
	    var tools = {};
	       
	       
	    // The drawing polygon.
	    tools.poly = function () {
		var tool = this;
		this.started = false;
		   
		   
		  
		   
		   
		   
		// This is called when you start holding down the mouse button.
		// This starts the polygon drawing.
		this.mousedown = function (ev) {
		       
		    if(first){
			  
			  
			return;
		    }
		    tool.started = true;
		    tool.x0 = ev._x;
		    tool.y0 = ev._y;
		      
		};
		   
		   
		this.mousemove = function (ev) {
		    if (!tool.started) {
			return;
		    }
		       
		    context.clearRect(0, 0, canvas.width, canvas.height);
		       
		    context.beginPath();
		    context.moveTo(tool.x0, tool.y0);
		    var diffX = (tool.x0 - ev._x);
		    var diffY = (tool.y0 - ev._y);
		       
		    var absX = Math.abs(diffX);
		    var absY = Math.abs(diffY);
		       
		    if(diffX> 100){ 
			   
			ev._x = tool.x0 -100;
			   
		    }
		       
		       
		       
		    else if(diffX <-100){
			   
			ev._x = tool.x0+ 100;
			   
			   
			   
		    }
		    if(diffY > 100){
			ev._y = tool.y0-100;
			   

		    }else if(diffY <-100){
			ev._y = tool.y0+100;
		    }

		       
		    if(absX<absY){
			context.lineTo(tool.x0, ev._y);
			   
			   
			   
		    }else if(absY<absX)
			context.lineTo(ev._x, tool.y0);
		       
		    context.stroke();
		    context.closePath();
		       
		       
		       
		       
		};
		   
		// This is called when you release the mouse button.
		this.mouseup = function (ev) {
		       

		    if (tool.started) {
			tool.mousemove(ev);
			//tool.started = false;
			var diffX = Math.abs(tool.x0 - ev._x);
			var diffY = Math.abs(tool.y0 - ev._y);
			   
			img_update();
			
			if(diffX < diffY){
			    polyArray[polyArray.length] =  { 'id' : "wall", 'xStart': tool.x0, 'yStart': tool.y0, 'xFinish': tool.x0, 'yFinish': ev._y };
			      
			    tool.y0 = ev._y;
			      
			}else if(diffY <diffX){
			    polyArray[polyArray.length] = { 'id' : "wall",'xStart': tool.x0, 'yStart': tool.y0, 'xFinish': ev._x, 'yFinish': tool.y0 };
			       
			    tool.x0 = ev._x;
			       
			}
			first = true;
		    }else if(!tool.started){
			   
			   
			   
			first = false;
			tool.started =false;
			return;
			   
			   
			   
			   
		    }
		    if(ev.button == 2 ){
			tool.started =false;
			first = false;
   
			   
		    }
		};
		   
		   
		   
	    };
	       
	    // The player tool.
	    tools.player = function () {
		var tool = this;
		this.started = false;
		   
		this.mousedown = function (ev) {
		    
		    
		};
		  
		  
		this.mousemove = function (ev) {
		       
		    if(!player){ 
		    context.clearRect(0, 0, canvas.width, canvas.height);
		    context.fillStyle = "black";
		    context.beginPath();
		     
		    context.arc(ev._x, ev._y, 15, 0, Math.PI*2, true); 
		      
		    context.fill();
		    context.closePath();
		    //context.closePath();
		    }
		      
		      
		      
		};

		this.mouseup = function (ev) {
		    if(!player){
		    player = true;

		    tool.mousemove(ev);
		    tool.started = false;
		       
		    polyArray[polyArray.length] = { 'id': "player", 'xLoc': ev._x, 'yLoc': ev._y, 'color' : "black"};
		      
		    }
		    
		    
		    img_update();
  
		};
	    }
	       
	       
	    //enemy
	    tools.enemy = function () {
		var tool = this;
		this.started = false;
		   
		this.mousedown = function (ev) {
		      
		      
		};
		  
		  
		this.mousemove = function (ev) {
		       
		      
		    context.clearRect(0, 0, canvas.width, canvas.height);
		    context.fillStyle = "red";
		    context.beginPath();
		     
		    context.arc(ev._x, ev._y, 10, 0, Math.PI*2, true); 
		      
		    context.fill();
		    context.closePath();
		    //context.closePath();
		      
		      
		      
		      
		};

		this.mouseup = function (ev) {
		       
		    tool.mousemove(ev);
		    tool.started = false;
		       
		    polyArray[polyArray.length] = { 'id': "enemy", 'xLoc': ev._x, 'yLoc': ev._y, 'color' : "red", 'enemy': 1};
		      
		      
		      

		    img_update();
  
		};
	    }
   
   
   
	    tools.enemy2 = function () {
		var tool = this;
		this.started = false;
		   
		this.mousedown = function (ev) {
		      
		      
		};
		  
		  
		this.mousemove = function (ev) {
		       
		      
		    context.clearRect(0, 0, canvas.width, canvas.height);
		    context.fillStyle = "yellow";
		    context.beginPath();
		     
		    context.arc(ev._x, ev._y, 10, 0, Math.PI*2, true); 
		      
		    context.fill();
		    context.closePath();
		    //context.closePath();
		      
		      
		      
		      
		};

		this.mouseup = function (ev) {
		       
		    tool.mousemove(ev);
		    tool.started = false;
		       
		    polyArray[polyArray.length] = { 'id': "enemy", 'xLoc': ev._x, 'yLoc': ev._y, 'color' : "yellow", 'enemy': 2};
		      
		      
		      

		    img_update();
  
		};
	    }
	       
	       
	    tools.enemy3 = function () {
		var tool = this;
		this.started = false;
		   
		this.mousedown = function (ev) {
		      
		      
		};
		  
		  
		this.mousemove = function (ev) {
		       
		      
		    context.clearRect(0, 0, canvas.width, canvas.height);
		    context.fillStyle = "blue";
		    context.beginPath();
		     
		    context.arc(ev._x, ev._y, 10, 0, Math.PI*2, true); 
		      
		    context.fill();
		    context.closePath();
		    //context.closePath();
		      
		      
		      
		      
		};

		this.mouseup = function (ev) {
		       
		    tool.mousemove(ev);
		    tool.started = false;
		       
		    polyArray[polyArray.length] = { 'id': "enemy", 'xLoc': ev._x, 'yLoc': ev._y, 'color' : "blue", 'enemy': 3};
		      
		      
		      

		    img_update();
  
		};
	    }
	       
	       
	    tools.enemy4 = function () {
		var tool = this;
		this.started = false;
		   
		this.mousedown = function (ev) {
		      
		      
		};
		  
		  
		this.mousemove = function (ev) {
		       
		      
		    context.clearRect(0, 0, canvas.width, canvas.height);
		    context.fillStyle = "green";
		    context.beginPath();
		     
		    context.arc(ev._x, ev._y, 10, 0, Math.PI*2, true); 
		      
		    context.fill();
		    context.closePath();
		    //context.closePath();
		      
		      
		      
		      
		};

		this.mouseup = function (ev) {
		       
		    tool.mousemove(ev);
		    tool.started = false;
		       
		    polyArray[polyArray.length] = { 'id': "enemy", 'xLoc': ev._x, 'yLoc': ev._y, 'color' : "green", 'enemy': 4};
		      
		      
		      

		    img_update();
  
		};
	    }
	       
	       
	    tools.enemy5 = function () {
		var tool = this;
		this.started = false;
		   
		this.mousedown = function (ev) {
		      
		      
		};
		  
		  
		this.mousemove = function (ev) {
		       
		      
		    context.clearRect(0, 0, canvas.width, canvas.height);
		    context.fillStyle = "purple";
		    context.beginPath();
		     
		    context.arc(ev._x, ev._y, 10, 0, Math.PI*2, true); 
		      
		    context.fill();
		    context.closePath();
		    //context.closePath();
		      
		      
		      
		      
		};

		this.mouseup = function (ev) {
		       
		    tool.mousemove(ev);
		    tool.started = false;
		       
		    polyArray[polyArray.length] = { 'id': "enemy", 'xLoc': ev._x, 'yLoc': ev._y, 'color' : "purple", 'enemy': 5};
		      
		      
		      

		    img_update();
  
		};
	    }
   
   
   
	       
	    init();

	}, false);
}








