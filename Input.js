function resetKeyState() {
    keyState = [];
    for (var i = 0; i < 200; i++) {
        keyState[i] = false;
    }
}


var keyId = {
    left: 65,
    up: 87,
    jump: 87,
    right: 68,
    down: 83,
    nextAttack: 82,
};
  var KEY_1 = 49;

var keyState = [];
var lastKeyDownTick = 0;

// TODO(cjhopman): convert to use js-hotkeys
function keyup(event){
    //console.log("keyup: " + event.keyCode + " " + tick);
    keyState[event.keyCode] = 0;
    return false;
}

function getKeyState(id) {
    return keyState[id] ? keyState[id] : 0;
}

function keydown(event){
    Debug.info("keydown: " + event.keyCode + " " + tick);
    switch(event.keyCode) {
		default:
			// If the keyCode doesn't explicitly appear here, we ignore it
			return true;
        case KEY_1 :
          SetDebugState(!DEBUG);             
          break;   
        case 220: // \
            toggleDebugData();
            break;

        case 82: // r
            break;

		case 192: // ~
            swapWorld();
			break;

            //left
        case 37:
        case 65:
            break;

            //up
        case 38:
        case 87:
            break;
            //right
			
        case 39:
        case 68:
            break;

            //down
        case 40:
        case 83:
            break;
        case 81: // q
            break;
		
        case 71: // g
            break;

        case 66: // b
            break;
    }
    //checkPasswords(event.keyCode);
    keyState[event.keyCode] = keyState[event.keyCode] > 0 ? keyState[event.keyCode] : 1;
    lastKeyDownTick = tick;

    return false;
}

function mousedown(event) {
    return false;
}
function mouseup(event) {
    return false;
}

var mouse = {
	position: [0, 0],
    getWorldPosition: function() {
        var cameraPos = getCamera().getPosition();

        var ret = [this.position[0] - target.width() / 2, this.position[1] - target.height() / 2];
        ret = [ret[0] + cameraPos[0], ret[1] + cameraPos[1]];

        return ret;
    },
};

function getMouse() {
	return mouse;
}
function mousemove(event) {
	getMouse().position = [event.clientX, event.clientY];
	return false;
}

