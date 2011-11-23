var passState = 0;

var passwords = [];
function registerPassword(pword, func) {
	passwords.push([pword, 0, func]);
}

registerPassword(
		[72, 72, 72],
		function () {
			nextLevel();
			countDown = 0;
		}
	);

function checkPasswords(keyCode) {
	for (var i = 0; i < passwords.length; i++) {
		var pw = passwords[i];
		if (keyCode == pw[0][pw[1]]) {
			if (pw[1] == pw[0].length - 1) {
				pw[2]();
				pw[1] = 0;
			} else {
				pw[1]++;
			}
		}
		else {
			pw[1] = 0;
		}
	}
}
