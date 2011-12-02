<<<<<<< HEAD
﻿#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying vec3 vLightWeighting;

uniform sampler2D uSampler;
uniform bool uTexture0_Enabled;

void main(void) 
{
  vec4 Color;
  if(uTexture0_Enabled)
    Color = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
  else
    Color = vec4(0.8, 0.8, 0.8, 1.0);
    
  gl_FragColor = vec4(Color.rgb * vLightWeighting, Color.a);
=======
﻿#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
varying vec3 vLightWeighting;

uniform sampler2D uDiffuseColorTexture;
uniform bool      uDiffuseColorTexture_Enabled;

uniform sampler2D uTransparentColorTexture;
uniform bool      uTransparentColorTexture_Enabled;


void main(void) 
{
  vec4 Color;
  if(uDiffuseColorTexture_Enabled)
    Color = texture2D(uDiffuseColorTexture, vec2(vTextureCoord.s, vTextureCoord.t));
  else
    Color = vec4(0.8, 0.8, 0.8, 1.0);
    
  if(uTransparentColorTexture_Enabled)
  {
    vec4 TransperentColor = texture2D(uTransparentColorTexture, vec2(vTextureCoord.s, vTextureCoord.t));
    Color.a = TransperentColor.a;
  }

  gl_FragColor = vec4(Color.rgb * vLightWeighting, Color.a);
>>>>>>> 26c48ecddf664051298530a771984e5367c5af72
}