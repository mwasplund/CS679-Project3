attribute vec3 aVertexPosition;
attribute float aVertexValue;
attribute vec2 aTextureCoord;
attribute float aPlayer;

uniform mat4 uVMatrix;
uniform mat4 uPMatrix;

varying vec4 vPosition;
varying float vValue;
varying vec2 vTextureCoord;
varying float vPlayer;

void main(void) 
{
  vPosition = uVMatrix * vec4(aVertexPosition, 1.0);
  gl_Position = uPMatrix * vPosition;
  vTextureCoord = aTextureCoord;
  vValue = aVertexValue;
  vPlayer = aPlayer;
}
