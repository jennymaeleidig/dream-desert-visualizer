precision highp float;
precision highp sampler2D;

varying vec4 vertTexCoord;
uniform float u_time;
uniform float u_width;
uniform float u_height;
uniform float u_pulse;

const float PI = 3.14159265359; // removed "f" suffix for GLSL ES compatibility

void main()
{
  vec2 uv = vertTexCoord.xy;
  uv -= vec2(0.5);
  uv.x *= u_width/u_height;
  const float it = 5.0;
  float c = 0.0;
  for( float i = 0.0 ; i < it ; i += 1.0 )
  {
      float react = .0;
      float c1 = (uv.x + 4.0 + react) * 0.004 * abs( 1.0 / sin( (uv.y * .0) +
        sin(uv.x* 1.4))*(-.3));
      c = clamp(c + c1, 0.0, 1.0);
  }
  vec2 origin = vec2(c);
  float timeValue = u_time ;
  float angleRad = u_pulse;
  float offset = mix(.77, 0.5, angleRad);
  vec2 e = origin;
  vec2 cylinderTexCoords = e;
  cylinderTexCoords.x = (asin(clamp(2.0 * origin.x - 1.0, -1.0, 1.0))) / (PI) + (offset * origin.y) + (0.5 * u_pulse);
  vec2 inverseCylinderTexCoords = origin;
  inverseCylinderTexCoords.x = cylinderTexCoords.x - (2.0 * offset * origin.y);
  float finalIntensity = c + (cylinderTexCoords.x * inverseCylinderTexCoords.x);
  vec3 beamColor = vec3(0.812,0.525,0.086);
  gl_FragColor = vec4(beamColor * finalIntensity, finalIntensity);
}