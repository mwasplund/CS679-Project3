attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

uniform float uTime;
uniform bool uTexture0_Enabled;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec4 vPosition;

void main(void) 
{
  vPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
  gl_Position = uPMatrix * uVMatrix * vPosition;
  vNormal = uNMatrix * aVertexNormal;

  if(uTexture0_Enabled)
  	vTextureCoord = aTextureCoord;
  
}