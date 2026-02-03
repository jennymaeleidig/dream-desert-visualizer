export default function createBeamParticlesModule(p) {
  let bloomTexture;
  let blurredBloom;
  let particleTexture;
  let particleTextureConfigured = false;
  let audio = p.audio; // get reference to audio manager
  const minMoonAngle = p.minMoonAngle !== undefined ? p.minMoonAngle : 0;
  const maxMoonAngle = p.maxMoonAngle !== undefined ? p.maxMoonAngle : p.TWO_PI;

  function preload() {
    bloomTexture = p.loadImage("/assets/images/bloom.png");
    particleTexture = p.loadImage("/assets/images/particles.png");
  }

  function setup() {
    // Pre-blur the bloom texture once for efficiency
    // Create a larger graphics buffer to accommodate blur spread and prevent hard edges
    const blurRadius = 9;
    // Use a percentage of the image size for padding to allow natural blur fade
    const padding = Math.max(bloomTexture.width, bloomTexture.height) * 0.5;
    const tempBuffer = p.createGraphics(
      bloomTexture.width + padding * 2,
      bloomTexture.height + padding * 2,
    );
    // Draw the texture centered in the buffer with padding
    tempBuffer.image(bloomTexture, padding, padding);
    tempBuffer.filter(p.BLUR, blurRadius);
    blurredBloom = tempBuffer.get();
    tempBuffer.remove(); // Clean up the temp buffer
  }

  function draw() {
    // Get moon angle from p5 global state (set by moon module)
    const moonAngle = p.moonAngle || minMoonAngle;

    // Get track position values from audio manager (in seconds for p5.js)
    const minTrackPos = audio ? audio.getMinTrackPosValue() : 0;
    const maxTrackPos = audio ? audio.getMaxTrackPosValue() : 1;

    // Calculate pulse value synced with palette cycle peak
    // Note: track position is in seconds (p5.js) but Processing used milliseconds
    // So we multiply by 1000 to convert seconds to milliseconds for the same scale
    const mappedPos =
      p.map(moonAngle, minMoonAngle, maxMoonAngle, minTrackPos, maxTrackPos) *
      1000.0;
    // Sync with palette cycle: adjust phase to align bloom brightness peak with palette peak
    // Half speed of palette cycle and inverted phase (add PI to shift 180 degrees)
    const speedMultiplier = Math.PI / 3 / 2; // Half the palette cycle speed
    const phaseOffset = Math.PI / 3 + Math.PI; // Inverted phase (shifted 180 degrees)
    const syncedPhase = mappedPos * 0.002 * speedMultiplier + phaseOffset;
    let pulse = (Math.sin(syncedPhase) + 1) * 0.5; // oscillates between 0 and 1
    pulse = p.map(pulse, 0, 1, 0.3, 1.0); // remap to range 0.3 to 1.0 for visibility

    p.push();
    // Translate to top-left corner coordinate system (Processing compatible)
    p.translate(-p.width / 2, -p.height / 2);
    // Now apply Processing coordinates
    p.translate(264, 122);
    p.imageMode(p.CENTER);

    // Note: Not using point sampling for bloom since it's blurred - use smooth interpolation
    // Draw the bloom texture with BLEND mode and opacity pulsing
    p.blendMode(p.BLEND);
    p.tint(255, 255 * pulse);
    p.image(
      blurredBloom,
      -4,
      12,
      blurredBloom.width * 1.75,
      blurredBloom.height * 1.75,
    );

    // Handle Point Sampling for particle texture
    if (!particleTextureConfigured && particleTexture) {
      let tex = p._renderer.getTexture(particleTexture);
      if (tex) {
        tex.setInterpolation(p.NEAREST, p.NEAREST);
        particleTextureConfigured = true;
      }
    }

    // Draw the particle texture with ADD mode for the background glow ring
    p.blendMode(p.ADD);
    p.tint(255, 255 * pulse);
    p.image(particleTexture, 0, 0);

    // Reset blend mode and tint
    p.blendMode(p.BLEND);
    p.noTint();
    p.imageMode(p.CORNER);
    p.pop();
  }

  return { preload, setup, draw };
}
