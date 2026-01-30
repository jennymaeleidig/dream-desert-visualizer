export default function createSandModule(p) {
  let sandTexture;
  let sandBGTexture;
  let gradientShader;
  let sandTextureConfigured = false;

  const LIGHTEST_ORANGE = [207 / 255.0, 134 / 255.0, 22 / 255.0];
  const DARKEST_ORANGE = [205 / 255.0, 79 / 255.0, 12 / 255.0];

  function preload() {
    sandTexture = p.loadImage("/assets/sand.png");
    sandBGTexture = p.loadImage("/assets/sand_bg.png");
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

      // Handle Point Sampling (Replaces Processing's textureSampling(1))
      if (!sandTextureConfigured) {
        // Access texture via the internal renderer to avoid 'canvas undefined' errors
        let tex = p._renderer.getTexture(sandTexture);
        if (tex) {
          tex.setInterpolation(p.NEAREST, p.NEAREST);
          sandTextureConfigured = true;
        }
      }

      gradientShader.setUniform("u_base", sandTexture);
      gradientShader.setUniform("u_time", p.millis() / 1000.0);
      gradientShader.setUniform("color_1", LIGHTEST_ORANGE);
      gradientShader.setUniform("color_2", DARKEST_ORANGE);

      p.noStroke();
      // Draw the rect that the shader will fill with the sand texture
      p.rect(3, 203, sandTexture.width, sandTexture.height);

      p.resetShader();
    }
    p.pop();
  }

  return { preload, setup, draw };
}
