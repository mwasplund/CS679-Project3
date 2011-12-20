attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
attribute vec2 aTextureCoord;
attribute float aVertexValue;
attribute float aVertexTime;
attribute float aVertexIndex;

uniform mat4 uVMatrix;
uniform mat4 uPMatrix;

varying vec4 vColor;
varying vec2 vTextureCoord;

void main(void) 
{
	vec3 position = aVertexPosition + vec3(aTextureCoord.x * 2.1, 30.0 + 20.0 * aVertexTime + aTextureCoord.y * 3.5, 0.0) + vec3(aVertexIndex * 2.1, 0.0, 0.0);
	vec4 vPosition = uVMatrix * vec4(position, 1.0);

	gl_Position = uPMatrix * vPosition;
	vTextureCoord = vec2((aTextureCoord.x + aVertexValue) / 11.0, aTextureCoord.y);
	vColor = vec4(aVertexColor * (1.0 - aVertexTime) * 2.0, 1.0);
}
