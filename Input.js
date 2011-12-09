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
    Debug.debug("keydown: " + event.keyCode + " " + tick);
    switch(event.keyCode) {
		default:
			// If the keyCode doesn't explicitly appear here, we ignore it
			return true;
        case KEY_1 :
          break;   
        case 220: // \
              SetDebugState(!DEBUG);             
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
	switch (event.button) {
		case 0: // left

			break;
		case 1: // middle

			break;
		case 2: // right
			getLocalPlayer().setTarget(getTargetFromMouse());

			break;
		default:
	}
	return false;
}
function mouseup(event) {
    return false;
}

function getTargetFromMouse() {
	if (in2dWorld) {
		var pos = getMouse().getWorldPosition();
		var ent = getEntityAtPoint(pos);
		if (!ent) ent = pos;
		return ent;
	} else {
		// TODO(cjhopman) get this working
		var pos = getMouse().getWorldPosition();
		//var ent = getEntityAtLine3d([getCamera().position3d(), pos]);
		var ent = getEntityAtPoint(pos);
		if (!ent) ent = pos;
		return ent;
	}
}

function getEntityAtLine3d() { 
	return null;
}

var mouse = {
	position: [0, 0],
    getWorldPosition: function() {
		if (in2dWorld) {
			var cameraPos = getCamera().getPosition();

			var ret = [this.position[0] - target.width() / 2, this.position[1] - target.height() / 2];
			ret = [ret[0] + cameraPos[0], ret[1] + cameraPos[1]];

			return ret;
		} else {
			var p0 = CameraPos; // <-- note this is glCameraPos
			var p1 = unProject(this.position[0], this.position[1], 0.9);
			var t = p1[1] / (p0[1] - p1[1]);
			var p2 = [
				p1[0] - t * (p0[0] - p1[0]), 
				p1[2] - t * (p0[2] - p1[2])
					];
			return p2;
		}
    },
};

function getViewport() {
 return [0, 0, gl.viewportWidth, gl.viewportHeight];
}

function unProject(wx, wy, wz, viewport) {
	// MWA - what is the point of this?
	//mvMatrix = mvMatrix || getMvMatrix();
	//pMatrix = pMatrix || getProjMatrix();
	viewport = viewport || getViewport();
	var inp = [
		(wx - viewport[0]) * 2 / viewport[2] - 1,
		1 - (wy - viewport[1]) * 2 / viewport[3],
		wz * 2 - 1,
		1.0
			];
	var EditMatrix = mat4.create();
	mat4.multiply(pMatrix, vMatrix, EditMatrix);
	mat4.inverse(EditMatrix);

	mat4.multiplyVec4(EditMatrix, inp);
	if (inp[3] === 0.0) return null;

	return [inp[0] / inp[3], inp[1] / inp[3], inp[2] / inp[3]];
}

function getMouse() {
	return mouse;
}
function mousemove(event) {
	getMouse().position = [event.clientX, event.clientY];
	return false;
}

