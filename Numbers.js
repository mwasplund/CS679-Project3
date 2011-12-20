var glNumbers = {
	count: 0,
	shader: null,
};
var maxNumbers = 100;
function initializeGlNumbers() {
	Shaders.push(LoadShader("Numbers"));
	glNumbers.shader = GetShader("Numbers");

	glNumbers.vertexPositionBuffer = gl.createBuffer();
	glNumbers.positionArray = new Float32Array(4 * 6 * 3 * maxNumbers);
    gl.bindBuffer(gl.ARRAY_BUFFER, glNumbers.vertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, glNumbers.positionArray, gl.DYNAMIC_DRAW);
	glNumbers.posIdx = 0;

	glNumbers.vertexCoordBuffer = gl.createBuffer();
	glNumbers.coordArray = new Float32Array(4 * 6 * 2 * maxNumbers);
    gl.bindBuffer(gl.ARRAY_BUFFER, glNumbers.vertexCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, glNumbers.coordArray, gl.DYNAMIC_DRAW);
	glNumbers.coordIdx = 0;

	glNumbers.vertexValueBuffer = gl.createBuffer();
	glNumbers.valueArray = new Float32Array(4 * 6 * maxNumbers);
    gl.bindBuffer(gl.ARRAY_BUFFER, glNumbers.vertexValueBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, glNumbers.valueArray, gl.DYNAMIC_DRAW);
	glNumbers.valIdx = 0;

	glNumbers.vertexPlayerBuffer = gl.createBuffer();
	glNumbers.playerArray = new Float32Array(4 * 6 * maxNumbers);
    gl.bindBuffer(gl.ARRAY_BUFFER, glNumbers.vertexPlayerBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, glNumbers.playerArray, gl.DYNAMIC_DRAW);
	glNumbers.playerIdx = 0;

	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	canvas.width = 154;
	canvas.height = 32;

	for (var i = 0; i < 10; i++) {
		context.font = "20pt sans-serif";
		context.fillStyle = "#FFFFFF";
		context.fillText(i + "", i * canvas.width / 11, 26);
	}
	glNumbers.numCanvas = canvas;
	glNumbers.numTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, glNumbers.numTexture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
	gl.bindTexture(gl.TEXTURE_2D, null);

	glNumbers.addNumber = function(val, position, y, isPlayer) {
		if (this.count == maxNumbers) return;
		var h = 3.5;
		var w = 2.1;
		var pos = [position[0] - 2 * w, y, position[1]];
		var offsetPos = [[0, 0, 0], [w, 0, 0], [2 * w, 0, 0], [3 * w, 0, 0]];
		var offsetVertex = [[0, 0, 0], [0, h, 0], [w, 0, 0], [w, 0, 0], [0, h, 0], [w, h, 0]];
		var vertCoord = [[0, 0], [0, 1], [1, 0], [1, 0], [0, 1], [1, 1]];
		for (var i = 0; i < 4; i++) {
			for (var v = 0; v < 6; v++) {
				for (var t = 0; t < 3; t++) {
					this.positionArray[this.posIdx++] = pos[t] + offsetPos[i][t] + offsetVertex[v][t];
				}
				this.coordArray[this.coordIdx++] = vertCoord[v][0];
				this.coordArray[this.coordIdx++] = vertCoord[v][1];
				this.valueArray[this.valIdx++] = val[i];
				this.playerArray[this.playerIdx++] = isPlayer ? 1.0 : 0.0;
			}
		}
		this.count++;
	}

	glNumbers.draw = function() {
		gl.disable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);

		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.useProgram(this.shader.Program);
		setMatrixUniforms(this.shader.Program);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, glNumbers.numTexture);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.positionArray.subarray(0, this.posIdx));
		gl.vertexAttribPointer(this.shader.Program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
		this.posIdx = 0;

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexCoordBuffer);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.coordArray.subarray(0, this.coordIdx));
		gl.vertexAttribPointer(this.shader.Program.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
		this.coordIdx = 0;

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexValueBuffer);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.valueArray.subarray(0, this.valIdx));
		gl.vertexAttribPointer(this.shader.Program.vertexValueAttribute, 1, gl.FLOAT, false, 0, 0);
		this.valIdx = 0;

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPlayerBuffer);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.playerArray.subarray(0, this.playerIdx));
		gl.vertexAttribPointer(this.shader.Program.vertexPlayerAttribute, 1, gl.FLOAT, false, 0, 0);
		this.playerIdx = 0;

		gl.drawArrays(gl.TRIANGLES, 0, this.count * 4 * 2 * 3);
		gl.disable(gl.BLEND);
		gl.enable(gl.DEPTH_TEST);
		this.count = 0;
	}
}
