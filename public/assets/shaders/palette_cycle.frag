precision highp float;
precision highp sampler2D;

// adapted from https://scottwestover.gumroad.com/l/xthszh
// needed to adjust versioning and syntax for processing as
// Processing 4's default shader system does not support
// #version 300 es or any #version directive at the top of fragment shaders.
// It expects GLSL 1.20 syntax (OpenGL ES 2.0 style), not GLSL 3.0.

// Add missing varying for Processing compatibility
varying vec2 vertTexCoord;

// this is used to control the speed of the animation
// set externally within the pde / sketch itself with:
// PShader.set("u_time", millis() / 250.0);
uniform float u_time;

//textures
// base is the image to apply the color cycle to
// palette is a 1d texture divided into equal segments that each represent a color in the palette
// set each of these externally by passing in a PImage.
uniform sampler2D u_base;
uniform sampler2D u_palette;

//extract these so that are configurable within the sketch
// uPaletteWidth is the number of colors / segments in the palette
uniform float u_palette_width;
// tune alongside the uTime
uniform float u_opacity;

//this tool is super helpful for generating a proper grayscale index image
// e.g. https://coolors.co/gradient-palette/383838-989898?number=10

void main() {
  // raw texture color
  vec4 texColor = texture2D(u_base, vertTexCoord.xy);

  if (texColor.a > 0.0){
  // render out a color based on the index from a 2nd texture
  // The red channel of our grayscale image holds the index value (from 0.0 to 1.0).
  float index = texColor.r;

  //Scale the index to the full width of the palette (e.g., 0.5 becomes 128 if width is 256).
  float animatedIndex = (-index * u_palette_width) + (u_time);
  float wrappedIndex = mod(animatedIndex, u_palette_width);
  // Normalize the wrapped index back to the 0.0-1.0 range for texture lookup.
  float paletteCoordinate = wrappedIndex / u_palette_width;

  // Sample the color from the palette texture at that coordinate.
  // (The Y coordinate is 0.5 because our palette is a 1D texture in the middle of the image).
  texColor = texture2D(u_palette, vec2(paletteCoordinate, 0.5));
  }
  //resulting color
  //since this is tied to the time that is set externally in the draw loop this will animate
  //i.e. continually cycling the color each frame
  // Set the pixel's color to the one we looked up from the palette, with opacity control.
  // Apply opacity to both RGB (for darkening) and alpha (for transparency)
  gl_FragColor = vec4(texColor.rgb * u_opacity, texColor.a * u_opacity);
}
