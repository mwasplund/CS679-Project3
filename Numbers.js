var glNumbers = {
	count: 0,
	shader: null,
};
var maxNumbers = 100;
function initializeGlNumbers() {
	glNumbers.shader = GetShader("Numbers");

	glNumbers.vertexPositionBuffer = gl.createBuffer();
	glNumbers.positionArray = new Float32Array(4 * 6 * 3 * maxNumbers);
    gl.bindBuffer(gl.ARRAY_BUFFER, glNumbers.vertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, glNumbers.positionArray, gl.DYNAMIC_DRAW);
	glNumbers.positionIdx = 0;

	glNumbers.vertexColorBuffer = gl.createBuffer();
	glNumbers.colorArray = new Float32Array(4 * 6 * 3 * maxNumbers);
    gl.bindBuffer(gl.ARRAY_BUFFER, glNumbers.vertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, glNumbers.colorArray, gl.DYNAMIC_DRAW);
	glNumbers.colorIdx = 0;

	glNumbers.vertexValueBuffer = gl.createBuffer();
	glNumbers.valueArray = new Float32Array(4 * 6 * 1 * maxNumbers);
    gl.bindBuffer(gl.ARRAY_BUFFER, glNumbers.vertexValueBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, glNumbers.valueArray, gl.DYNAMIC_DRAW);
	glNumbers.valueIdx = 0;

	glNumbers.vertexTimeBuffer = gl.createBuffer();
	glNumbers.timeArray = new Float32Array(4 * 6 * 1 * maxNumbers);
    gl.bindBuffer(gl.ARRAY_BUFFER, glNumbers.vertexTimeBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, glNumbers.timeArray, gl.DYNAMIC_DRAW);
	glNumbers.timeIdx = 0;

	glNumbers.vertexIndexBuffer = gl.createBuffer();
	glNumbers.indexArray = new Float32Array(4 * 6 * 1 * maxNumbers);
	glNumbers.indexIdx = 0;

	glNumbers.vertexCoordBuffer = gl.createBuffer();
	glNumbers.coordArray = new Float32Array(4 * 6 * 2 * maxNumbers);
	glNumbers.coordIdx = 0;

	var vertCoord = [[0, 0], [0, 1], [1, 0], [1, 0], [0, 1], [1, 1]];
	for (var s = 0; s < maxNumbers; s++) {
		for (var i = 0; i < 4; i++) {
			for (var v = 0; v < 6; v++) {
				glNumbers.indexArray[glNumbers.indexIdx++] = i;

				glNumbers.coordArray[glNumbers.coordIdx++] = vertCoord[v][0];
				glNumbers.coordArray[glNumbers.coordIdx++] = vertCoord[v][1];
			}
		}
	}
    gl.bindBuffer(gl.ARRAY_BUFFER, glNumbers.vertexIndexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, glNumbers.indexArray, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, glNumbers.vertexCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, glNumbers.coordArray, gl.STATIC_DRAW);

	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	canvas.width = 160;
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
	//gl.bindTexture(gl.TEXTURE_2D, null);

	glNumbers.addNumber = function(val, position, tm, color) {
		if (this.count == maxNumbers) return;
		for (var i = 0; i < 4; i++) {
			for (var v = 0; v < 6; v++) {
				this.timeArray[this.timeIdx++] = tm;
				this.valueArray[this.valueIdx++] = val[i];

				this.colorArray[this.colorIdx++] = color[0];
				this.colorArray[this.colorIdx++] = color[1];
				this.colorArray[this.colorIdx++] = color[2];

				this.positionArray[this.positionIdx++] = position[0];
				this.positionArray[this.positionIdx++] = 0;
				this.positionArray[this.positionIdx++] = position[1];
			}
		}
		this.count++;
	}

	glNumbers.draw = function() {
		gl.useProgram(this.shader.Program);
		setMatrixUniforms(this.shader.Program);

		gl.disable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);

		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, glNumbers.numTexture);

		var vertsPerItem = 4 * 2 * 3;
		var numVertices = vertsPerItem * this.count;

		var bindAttribute = function(buffer, arr, attribute, itemSize, staticData) {
			if (numVertices < 0) return;
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			if (!staticData) gl.bufferSubData(gl.ARRAY_BUFFER, 0, arr.subarray(0, numVertices * itemSize));
			gl.vertexAttribPointer(attribute, itemSize, gl.FLOAT, false, 0, 0);
		}

		var buffer, arr, attribute;

		buffer = this.vertexPositionBuffer;
		arr = this.positionArray;
		attribute = this.shader.Program.vertexPositionAttribute;
		bindAttribute(buffer, arr, attribute, 3);
		this.positionIdx = 0;

		buffer = this.vertexColorBuffer;
		arr = this.colorArray;
		attribute = this.shader.Program.vertexColorAttribute;
		bindAttribute(buffer, arr, attribute, 3);
		this.colorIdx = 0;

		buffer = this.vertexValueBuffer;
		arr = this.valueArray;
		attribute = this.shader.Program.vertexValueAttribute;
		bindAttribute(buffer, arr, attribute, 1);
		this.valueIdx = 0;

		buffer = this.vertexTimeBuffer;
		arr = this.timeArray;
		attribute = this.shader.Program.vertexTimeAttribute;
		bindAttribute(buffer, arr, attribute, 1);
		this.timeIdx = 0;

		buffer = this.vertexCoordBuffer;
		arr = this.coordArray;
		attribute = this.shader.Program.vertexCoordAttribute;
		bindAttribute(buffer, arr, attribute, 2, true);
		this.coordIdx = 0;

		buffer = this.vertexIndexBuffer;
		arr = this.indexArray;
		attribute = this.shader.Program.vertexIndexAttribute;
		bindAttribute(buffer, arr, attribute, 1, true);
		this.indexIdx = 0;

		gl.drawArrays(gl.TRIANGLES, 0, numVertices);
		gl.disable(gl.BLEND);
		gl.enable(gl.DEPTH_TEST);
		this.count = 0;
	}
}
