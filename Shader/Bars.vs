attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
attribute vec2 aTextureCoord;
attribute float aVertexValue;

uniform mat4 uVMatrix;
uniform mat4 uPMatrix;

varying vec4 vColor;
varying vec2 vTextureCoord;

void main(void) 
{
    float h = 2.5;
	float w = 20.0;
	float baseHeight = 5.0;
	vec3 offset = aTextureCoord.t > 0.5 ?
		vec3(aTextureCoord.s * w * aVertexValue - w / 2.0, 4.0 * (aTextureCoord.t - 0.75) * h + baseHeight, 0.0) :
		vec3(aTextureCoord.s * w * aVertexValue - w / 2.0, 4.0 * aTextureCoord.t * h + baseHeight, 0.0);
	vec3 position = aVertexPosition + offset;
	vec4 vPosition = uVMatrix * vec4(position, 1.0);
	gl_Position = uPMatrix * vPosition;

	vColor = vec4(aVertexColor, 1.0);
	vTextureCoord = aTextureCoord;
}
