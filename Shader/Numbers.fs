#ifdef GL_ES
precision highp float;
#endif

varying vec4 vPosition;
varying float vValue;
varying vec2 vTextureCoord;
varying float vPlayer;

uniform sampler2D uSampler;

void main(void) 
{
	gl_FragColor = texture2D(uSampler, vec2((vTextureCoord.x + vValue) / 11.0, vTextureCoord.y));
	gl_FragColor = vec4(gl_FragColor.r * vPlayer, gl_FragColor.g * (1.0 - vPlayer), 0.0, gl_FragColor.a);
}
