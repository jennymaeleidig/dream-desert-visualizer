precision highp float;
precision highp sampler2D;

varying vec4 vertTexCoord;
uniform float u_time;
uniform sampler2D u_base;
uniform sampler2D u_palette;
uniform float u_palette_width;
uniform float u_opacity;

void main() {
  vec4 texColor = texture2D(u_base, vertTexCoord.xy);
  if (texColor.a > 0.0){
    float index = texColor.r;
    float animatedIndex = (-index * u_palette_width) + (u_time);
    float wrappedIndex = mod(animatedIndex, u_palette_width);
    float paletteCoordinate = wrappedIndex / u_palette_width;
    texColor = texture2D(u_palette, vec2(paletteCoordinate, 0.5));
  }
  gl_FragColor = vec4(texColor.rgb, texColor.a * u_opacity);
}