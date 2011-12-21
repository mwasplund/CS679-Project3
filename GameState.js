/******************************************************/
/* enum GameState
/*
/* an enumeration of all the game states. When changing
/* from one game state to another please call the 
/* functions below to make sure that the html menus
/* get updated accordingly!
/******************************************************/
var GAME_STATE = 
{
  LOADING : 0,
  START   : 1,
  PLAYING : 2,
  BEAT_LEVEL : 3,
  PAUSED  : 4
}; 

/******************************************************/
/* SetMusicState_On
/*
/* Turn on the music
/******************************************************/
function SetMusicState_On()
{
  $("#VOLUME_ON").css({"display":"inline"});
  $("#VOLUME_OFF").css({"display":"none"});
  document.getElementById('Music').play();
}

/******************************************************/
/* SetMusicState_Off
/*
/* Turn off the music
/******************************************************/
function SetMusicState_Off()
{
  $("#VOLUME_ON").css({"display":"none"});
  $("#VOLUME_OFF").css({"display":"inline"});
  document.getElementById('Music').pause();
}


/******************************************************/
/* SetGameState_Beat_Level
/*
/* Transfer from any state to Beat Level. This should 
/* only be called from state "Playing", but we just make
/* sure all manus are up to date.
/******************************************************/
function SetGameState_Beat_Level()
{
  // Hide any menues that were in use
  Debug.Trace("Beat Level");
  if(GameState == GAME_STATE.START)
  {
	  $("#Menu_Start").hide("slow");
  }
  else if(GameState == GAME_STATE.PAUSED)
  {
	  $("#Menu_Paused").slideUp("slow");
  }
  else if(GameState == GAME_STATE.LOADING)
  {
  	$("#Menu_Loading").hide();
  }

  // Set the current state
  GameState = GAME_STATE.BEAT_LEVEL;
  // Show the Menu
  $("#Menu_Beat_Level").slideDown("slow");
  GoToLevel(CurrentLevel.Number+1);
}

function GoToLevel(i_LevelNumber)
{
	CurrentLevel = new Level(i_LevelNumber);
	$("#SelectLevel").val(i_LevelNumber);
}

function SetGameState_Playing()
{
  // Hide any menues that were in use
  Debug.Trace("Play Game");
  if(GameState == GAME_STATE.START)
  {
	  $("#Menu_Start").hide("slow");
  }
  else if(GameState == GAME_STATE.PAUSED)
  {
	  $("#Menu_Paused").slideUp("slow");
  }
  else if(GameState == GAME_STATE.LOADING)
  {
  	$("#Menu_Loading").hide();
  }
  else if(GameState == GAME_STATE.BEAT_LEVEL)
  {
  	$("#Menu_Beat_Level").slideUp();
  }
  
  // Set the current state
  GameState = GAME_STATE.PLAYING;
}

function SetGameState_Paused()
{
  // Hide any menues that were in use
  Debug.Trace("Pause Game");
  if(GameState == GAME_STATE.START)
  {
	$("#Menu_Start").hide("slow");
  }
  else if(GameState == GAME_STATE.LOADING)
  {
	$("#Menu_Loading").hide();
  }
  
  // Set the current state
  GameState = GAME_STATE.PAUSED;
  // Show the Menu
  $("#Menu_Paused").slideDown("slow");
}

function SetGameState_Start()
{
  // Hide any menues that were in use
  Debug.Trace("Start Game");
  if(GameState == GAME_STATE.PAUSED)
  {
	$("#Menu_Paused").slideUp("slow");
  }
  else if(GameState == GAME_STATE.LOADING)
  {
	$("#Menu_Loading").hide();
  }
  
  // Set the current state
  GameState = GAME_STATE.START;
  // Show the Menu
  $("#Menu_Start").show("slow");
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
