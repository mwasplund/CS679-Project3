var glBars = {
	count: 0,
	shader: null,
};
var maxBars = 100;
function initializeGlBars() {
	glBars.shader = GetShader("Bars");

	var verticesPerBar = 2 * 6;
	glBars.vertexPositionBuffer = gl.createBuffer();
	glBars.positionArray = new Float32Array(3 * verticesPerBar * maxBars);
    gl.bindBuffer(gl.ARRAY_BUFFER, glBars.vertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, glBars.positionArray, gl.DYNAMIC_DRAW);
	glBars.positionIdx = 0;

	glBars.vertexColorBuffer = gl.createBuffer();
	glBars.colorArray = new Float32Array(3 * verticesPerBar * maxBars);
    gl.bindBuffer(gl.ARRAY_BUFFER, glBars.vertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, glBars.colorArray, gl.DYNAMIC_DRAW);
	glBars.colorIdx = 0;

	glBars.vertexValueBuffer = gl.createBuffer();
	glBars.valueArray = new Float32Array(1 * verticesPerBar * maxBars);
    gl.bindBuffer(gl.ARRAY_BUFFER, glBars.vertexValueBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, glBars.valueArray, gl.DYNAMIC_DRAW);
	glBars.valueIdx = 0;

	glBars.vertexCoordBuffer = gl.createBuffer();
	glBars.coordArray = new Float32Array(2 * verticesPerBar * maxBars);
	glBars.coordIdx = 0;

	var vertCoord = [[0, 0], [0, 1], [1, 0], [1, 0], [0, 1], [1, 1]];
	for (var s = 0; s < maxBars; s++) {
		for (var i = 0; i < 2; i++) {
			for (var v = 0; v < 6; v++) {
				glBars.coordArray[glBars.coordIdx++] = vertCoord[v][0];
				glBars.coordArray[glBars.coordIdx++] = vertCoord[v][1] / 4 + 0.75 * i;
			}
		}
	}
    gl.bindBuffer(gl.ARRAY_BUFFER, glBars.vertexCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, glBars.coordArray, gl.STATIC_DRAW);

	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	canvas.width = 128;
	canvas.height = 128;
	context.strokeStyle = "#000000";
	context.lineWidth = 3;
	context.strokeRect(0 + 1, 96 + 1, 128 - 2, 32 - 2);

	var gradient = context.createLinearGradient(0, 0, 0, 32);
	gradient.addColorStop(0, "#000000");
	gradient.addColorStop(0.45, "#FFFFFF");
	gradient.addColorStop(0.55, "#FFFFFF");
	gradient.addColorStop(1.0, "#000000");
	context.fillStyle = gradient;
	context.fillRect(2, 2, 128 - 4, 32 - 4);

	glBars.barCanvas = canvas;
	glBars.barTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, glBars.barTexture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);

	glBars.addBar = function(val, position, color) {
		if (this.count == maxBars) return;
		for (var i = 0; i < 2; i++) {
			for (var v = 0; v < 6; v++) {
				this.valueArray[this.valueIdx++] = i ? val : 1.0;

				this.colorArray[this.colorIdx++] = color[0];
				this.colorArray[this.colorIdx++] = color[1];
				this.colorArray[this.colorIdx++] = color[2];

				this.positionArray[this.positionIdx++] = position[0];
				this.positionArray[this.positionIdx++] = position[1];
				this.positionArray[this.positionIdx++] = position[2];
			}
		}
		this.count++;
	}

	glBars.draw = function() {
		gl.useProgram(this.shader.Program);
		setMatrixUniforms(this.shader.Program);

		gl.disable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);

		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, glBars.barTexture);

		var vertsPerItem = verticesPerBar;
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

		buffer = this.vertexCoordBuffer;
		arr = this.coordArray;
		attribute = this.shader.Program.vertexCoordAttribute;
		bindAttribute(buffer, arr, attribute, 2, true);
		this.coordIdx = 0;

		gl.drawArrays(gl.TRIANGLES, 0, numVertices);
		gl.disable(gl.BLEND);
		gl.enable(gl.DEPTH_TEST);
		this.count = 0;
	}
}
