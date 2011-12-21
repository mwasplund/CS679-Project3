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

var NUMPAD_0 = 96;
var NUMPAD_1 = 97;
var NUMPAD_2 = 98;
var NUMPAD_3 = 99;
var NUMPAD_4 = 100;
var NUMPAD_5 = 101;
var NUMPAD_6 = 102;
var NUMPAD_7 = 103;
var NUMPAD_8 = 104;
var NUMPAD_9 = 105;
var KEY_0 = 48;
var KEY_1 = 49;
var KEY_2 = 50;
var KEY_3 = 51;
var KEY_4 = 52;
var KEY_5 = 53;
var KEY_6 = 54;
var KEY_7 = 55;
var KEY_8 = 56;
var KEY_9 = 57;

var KEY_TAB = 9;

var keyState = [];
var lastKeyDownTick = 0;

var cheatsEnabled = false;
function keyup(event){
    keyState[event.keyCode] = 0;
    return false;
}

function getKeyState(id) {
    return keyState[id] ? keyState[id] : 0;
}

var swapMouseKeys = false;
function keydown(event){
    Debug.debug("keydown: " + event.keyCode + " " + tick);
    switch(event.keyCode) {
		default:
			// If the keyCode doesn't explicitly appear here, we ignore it
			return true;
        case KEY_1 :
        case KEY_2 :
        case KEY_3 :
        case KEY_4 :
        case KEY_5 :
			if (cheatsEnabled) {
				var e = makeEnemyType(event.keyCode - KEY_0);
				e.position = getMouse().getWorldPosition().slice(0);
				e.home = e.position.slice(0);
				addEnemy(e);
			}
			break;
        case KEY_6 :
        case KEY_7 :
        case KEY_8 :
            break;   

        case NUMPAD_0 :
			if (cheatsEnabled) {
				var atks = getLocalPlayer().getSpecialAttacks();
				for (var i = 0; i < atks.length; i++) {
					atks[i].ready = 0;
				}
			}
            break;
        case NUMPAD_1 :
			if (cheatsEnabled) {
				getLocalPlayer().heal(10);
			}
            break;
        case NUMPAD_2 :
			if (cheatsEnabled) {
				getLocalPlayer().damage(10, getLocalPlayer());
			}
            break;
        case NUMPAD_3 :
			if (cheatsEnabled) {
				for (var i = 0; i < 10; i++) {
					getLocalPlayer().cooldown();
				}
			}
            break;
        case NUMPAD_4 :
			if (cheatsEnabled) {
				getLocalPlayer().stats.speed *= 1.1;
			}
            break;
        case NUMPAD_9 :
			if (cheatsEnabled) {
				shouldReset = true;
			}
            break;
		case 187: // =
			getOptions().increment("hudHeight");
			break;
		case 189: // -
			getOptions().decrement("hudHeight");
			break;
        case 220: // \
              SetDebugState(!DEBUG);             
            toggleDebugData();
            break;

        case 82: // r
            return;
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

		case KEY_TAB:
			shouldExpandMinimapFlag = !shouldExpandMinimapFlag;
			break;
    }
    //checkPasswords(event.keyCode);
    keyState[event.keyCode] = keyState[event.keyCode] > 0 ? keyState[event.keyCode] : 1;
    lastKeyDownTick = tick;

	event.preventDefault();
    return false;
}

var shouldExpandMinimapFlag = false;
function shouldExpandMinimap() {
	return shouldExpandMinimapFlag;
	return keyState[KEY_TAB];
}

function mousewheel(e) {
    e = e || window.event;
    var dw = e.detail || (e.wheelDelta / -120);

    getLocalPlayer().cycleSpecialAttack(dw);
}

function mousedown(event) {
	if (hud && hudMouseDown(event)) return false;
	switch (event.button) {
		case 0: // left
            var pl = getLocalPlayer();
            var tgt = getTargetFromMouse();
            !swapMouseKeys ? pl.setTarget(tgt) : pl.setSpecialTarget(tgt);
			break;
		case 1: // middle

			break;
		case 2: // right
            var pl = getLocalPlayer();
            var tgt = getTargetFromMouse();
            swapMouseKeys ? pl.setTarget(tgt) : pl.setSpecialTarget(tgt);
			break;
		default:
	}
	return false;
}
function mouseup(event) {
	switch (event.button) {
		case 0: // left
            var pl = getLocalPlayer();
            var tgt = null;
            !swapMouseKeys ? pl.setTarget(tgt) : pl.setSpecialTarget(tgt);
			break;
		case 1: // middle

			break;
		case 2: // right
            var pl = getLocalPlayer();
            var tgt = null;
            swapMouseKeys ? pl.setTarget(tgt) : pl.setSpecialTarget(tgt);
			break;
		default:
	}
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
		//var ent = getEntityAtPoint(pos);
		return pos;
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
	if (hud && hudMouseMove(event)) return false;
	getMouse().position = [event.clientX, event.clientY];
	return false;
}

