IMPORTANT NOTICE!

Web browsers do not like it when files try to open other files on your computer that are not in the same directory as the file doing the opening. Because we would like to use heirarchy to store our scene assets we must turn off this saftey percaution on whichever browser you are going to be doing local testing. Once the files are on the server the requests will be work since it isn't trying to open a local file.

Chrome:
1) Close all instances of chrome running on your machine.
2) Locate your chrome.exe (windows usually located at C:\Users\USER_NAME\AppData\Local\Google\Chrome\Applicaltion\chrome.exe)
3) Now run command "chrome.exe --allow-file-access-from-files". This instance of chrome now will allow jquery to open local files in folders!!!

Firefox:
1) Open Firefox.
2) Go to "about:Config" in the address bar.
3) Click "I'll be careful, I promise!"
4) Change "security.fileuri.strict_origin_policy" to "false".
Firefox now will allow jquery to open local files in folders!!!


Code Structure:

The Model Loader and most of the model drawing code is in Model/... Some of
this work (specifically the non-model-specific stuff) is in Gl.js.

Shaders are in Shader/... Bars is used for health bars, numbers is for damage
numbers, and PerFragmentLighting is used for all the models.

The level editor is contained in level/... It is essentially a standalone
paint program where you can paint in walls, enemies, players, etc.

Some other easy points to note are that various utilities (including
additions/decorations to built-in types' prototypes) are in Util.js. The
logging system is in Log.js and is the only code with any documentation in the
core engine.

There are two things that appear in many places in the code. First is
cooldowns. All attacks have a cooldown in # of ticks. Second is effects. These
are things that have their `act` function called every tick until they die.
When they die, they will have their `lastBreath`. Effects can be attached to
entities and will then have that entity passed into `act`. (Their are special
attachment points that can be used to somewhat control when in the updateloop
`act` is called. Entities are essentially effects that have multiple `act`s
that are called in a certain order (thinkMove, move, thinkAttack, attack).

If one wanted to start looking at the code, I have no clue where I would
start. Maybe start at the gameloop in Game.js:gameLoop(), then trace that to
Physics.js:update(), Player.js:thinkxxx/move/attack, ...

Files (well, many of them):

Attacks.js -- 
Sets up player attacks. Depends on a lot of stuff in Physics.js (for the
effects framework), some graphics stuff in Graphics.js, and some particle
stuff.

Camera.js --
Mostly a relic of our 2d beginnings. (Note though that the 2d beginnings are
now drawn to the minimap)

Demo.js --
Our model demo. Used extensively for model/loader testing.

Enemies.js --
This builds the enemies. Not too much interesting here. The different enemy
types are all made in MakeEnemyType here. Enemy AI is really simple, if they
see an enemy or are damaged by one, they will target that enemy and move
towards it until in range to use their attack. If an enemy loses sight of
their target, they will go to its last known position, look around a bit, and
then go home. This targeting is done mostly in enemyUpdateTarget().

Events.js --
Not used.

Game.js --
The main entry point is here at $(window).load(...). This also includes the
gameloop, but not too much else.

GameState.js --

GlBars.js --
This is the health bar system. Most of the work is done here in the setup and
them later in the shader.

Gl.js --
WebGL initialization and some other such.

Graphics.js --
2D graphics and some of the 2d engine stuff (specifically selecting entities
within a circle/rect/...).

Hud.js --
This is where all of the hud drawing is done. This also has the hud mouse
handlers for tooltips and selecting special attacks.

Input.js --
Main key and mouse handlers.

levels.js --
Level data imported from the level editor.

Log.js --
The logging system.

Numbers.js --
This is the damage numbers system. Works very similar to the health bar
system.

Physics.js --
Contains a lot of the core code. Specifically contains a lot of the effects
and particle framework and helper functions. The 2d intersection code is all
here, as are the move functions. This also has the main(non-graphics) gameloop code
(update()).

Player.js --
The player.

Setup.js --
This is where a level is actually setup after being read from levels.js. Also
includes the bucketing system for fast selection of entities/walls.









