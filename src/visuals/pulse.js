export default function createPulseModule(p) {
  let pulseTexture;
  let pulsePaletteTexture;
  let cycleShader;
  let pulseTextureConfigured = false;
  let audio = p.audio; // get reference to audio manager

  const minMoonAngle = p.minMoonAngle !== undefined ? p.minMoonAngle : 0;
  const maxMoonAngle = p.maxMoonAngle !== undefined ? p.maxMoonAngle : p.TWO_PI;

  function preload() {
    pulseTexture = p.loadImage("/assets/images/pulse.png");
    pulsePaletteTexture = p.loadImage("/assets/images/pulse_palette.png");
    cycleShader = p.loadShader(
      "/assets/shaders/pass.vert",
      "/assets/shaders/palette_cycle.frag",
    );
  }

  function draw() {
    // Get moon angle from p5 global state (set by moon module)
    const moonAngle = p.moonAngle || minMoonAngle;

    // Get track position values from audio manager
    const minTrackPos = audio ? audio.getMinTrackPosValue() : 0;
    const maxTrackPos = audio ? audio.getMaxTrackPosValue() : 1;

    // Create a continuously advancing time that's synced with particles but offset
    // Control the animation speed with a multiplier
    const speedMultiplier = Math.PI / 3; // 1.0 is default, >1 is faster, <1 is slower
    const phaseOffset = Math.PI / 3; // 30 degrees ahead of particles animation
    // Note: track position is in seconds (p5.js) but Processing used milliseconds
    // So we multiply by 1000 to convert seconds to milliseconds for the same scale
    const basePhase =
      p.map(moonAngle, minMoonAngle, maxMoonAngle, minTrackPos, maxTrackPos) *
      1000.0 * // Convert seconds to milliseconds
      0.002 *
      speedMultiplier;

    // Convert the phase to a continuously increasing sawtooth wave (0 to 10)
    // This ensures the animation always moves forward and cycles properly
    const continuousPhase = (basePhase + phaseOffset) / p.TWO_PI; // normalize to cycles
    const shaderTime = (continuousPhase * 10.0) % 10.0; // scale to palette width and wrap

    if (cycleShader && pulseTexture && pulseTexture.width > 1) {
      p.push();
      p.shader(cycleShader);

      // Handle Point Sampling (Replaces Processing's textureSampling(1) == SHARP)
      if (!pulseTextureConfigured) {
        // Access texture via the internal renderer to avoid 'canvas undefined' errors
        let tex = p._renderer.getTexture(pulseTexture);
        if (tex) {
          tex.setInterpolation(p.NEAREST, p.NEAREST);
          pulseTextureConfigured = true;
        }
      }

      cycleShader.setUniform("u_base", pulseTexture);
      cycleShader.setUniform("u_palette", pulsePaletteTexture);
      cycleShader.setUniform("u_time", shaderTime); // Simple linear time
      // u_cycle_speed is no longer used to control speed, as it's handled by speedMultiplier
      cycleShader.setUniform("u_palette_width", 10.0);
      cycleShader.setUniform("u_opacity", 0.35); // 35% opacity for darker/more subtle overlay

      p.noStroke();
      p.fill(255); // Shader controls opacity, so fill is just white
      p.rectMode(p.CENTER);
      // Draw the rect that the shader will fill with the pulse texture
      // p5.js requires drawing a shape to apply the shader since images use their own shaders internally
      // Position: 4.5, -79.5 (from original code)
      p.rect(4, -79.5, pulseTexture.width, pulseTexture.height);

      p.resetShader();
      p.pop();
    }
  }

  return { preload, draw };
}
