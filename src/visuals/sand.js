export default function createSandModule(p) {
  let sandTexture;
  let sandBGTexture;
  let gradientShader;
  let sandTextureConfigured = false;
  let audio = p.audio; // get reference to audio manager

  // Precompute normalized color values for shader uniforms
  const LIGHTEST_ORANGE = [
    p.red(p.lightestOrange) / 255.0,
    p.green(p.lightestOrange) / 255.0,
    p.blue(p.lightestOrange) / 255.0,
  ];
  const DARKEST_ORANGE = [
    p.red(p.darkestOrange) / 255.0,
    p.green(p.darkestOrange) / 255.0,
    p.blue(p.darkestOrange) / 255.0,
  ];

  function preload() {
    sandTexture = p.loadImage("/assets/images/sand.png");
    sandBGTexture = p.loadImage("/assets/images/sand_bg.png");
    gradientShader = p.loadShader(
      "/assets/shaders/pass.vert",
      "/assets/shaders/gradient.frag",
    );
  }

  function setup() {}

  function draw() {
    p.push();
    p.translate(-p.width / 2, -p.height / 2);
    p.imageMode(p.CORNER);

    // 1. Draw Background (Linear sampling by default)
    if (sandBGTexture) p.image(sandBGTexture, 0, 0);

    // 2. Apply Shader and Point Sampling (Nearest) to Sand
    if (gradientShader && sandTexture && sandTexture.width > 1) {
      p.shader(gradientShader);

      // Handle Point Sampling (Replaces Processing's textureSampling(1) == SHARP)
      if (!sandTextureConfigured) {
        // Access texture via the internal renderer to avoid 'canvas undefined' errors
        let tex = p._renderer.getTexture(sandTexture);
        if (tex) {
          tex.setInterpolation(p.NEAREST, p.NEAREST);
          sandTextureConfigured = true;
        }
      }

      // Get moon angle from p5 global state (set by moon module)
      const moonAngle = p.moonAngle || -3.0295637;
      const minMoonAngle = p.minMoonAngle !== undefined ? p.minMoonAngle : 0;
      const maxMoonAngle =
        p.maxMoonAngle !== undefined ? p.maxMoonAngle : p.TWO_PI;

      // Get track position values from audio manager (in seconds for p5.js)
      const minTrackPos = audio ? audio.getMinTrackPosValue() : 0;
      const maxTrackPos = audio ? audio.getMaxTrackPosValue() : 1;

      //set shader uniforms
      gradientShader.setUniform("u_base", sandTexture);
      // Use moonAngle mapped to track position, divided by 500
      // Note: track position is in seconds (p5.js) but Processing used milliseconds
      // So we multiply by 1000 to convert seconds to milliseconds for the same scale
      const u_time =
        (p.map(
          moonAngle,
          minMoonAngle,
          maxMoonAngle,
          minTrackPos,
          maxTrackPos,
        ) *
          1000.0) / // Convert seconds to milliseconds
        500.0;
      gradientShader.setUniform("u_time", u_time);
      gradientShader.setUniform("color_1", LIGHTEST_ORANGE);
      gradientShader.setUniform("color_2", DARKEST_ORANGE);

      p.noStroke();
      // Draw the rect that the shader will fill with the sand texture
      //p5.js requires drawing a shape to apply the shader since images use their own shaders internally
      p.rect(3, 203, sandTexture.width, sandTexture.height);

      p.resetShader();
    }
    p.pop();
  }

  return { preload, setup, draw };
}
