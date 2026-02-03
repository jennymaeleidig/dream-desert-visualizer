export default function createBeamModule(p) {
  let beamShader;
  let audio = p.audio; // get reference to audio manager
  const minMoonAngle =
    p.minMoonAngle !== undefined ? p.minMoonAngle : -3.0295637;
  const maxMoonAngle =
    p.maxMoonAngle !== undefined ? p.maxMoonAngle : -0.20374468;

  function preload() {
    beamShader = p.loadShader(
      "/assets/shaders/pass.vert",
      "/assets/shaders/beam.frag",
    );
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
    // Sync with palette cycle: adjust phase to align beam brightness peak with palette peak
    // Half speed of palette cycle and inverted phase (add PI to shift 180 degrees)
    const speedMultiplier = Math.PI / 3 / 2; // Half the palette cycle speed
    const phaseOffset = Math.PI / 3 + Math.PI; // Inverted phase (shifted 180 degrees)
    const syncedPhase = mappedPos * 0.002 * speedMultiplier + phaseOffset;
    let pulse = (Math.sin(syncedPhase) + 1) * 0.5; // oscillates between 0 and 1
    pulse = p.map(pulse, 0, 1, 0.3, 1.0); // remap to range 0.3 to 1.0 for visibility

    if (beamShader) {
      p.push();

      p.shader(beamShader);
      beamShader.setUniform("u_width", p.width / 4);
      beamShader.setUniform("u_height", p.height / 4);
      beamShader.setUniform("u_time", p.millis() * 0.001);
      beamShader.setUniform("u_pulse", pulse); // Pass the pulse value to control brightness

      p.rectMode(p.CENTER);
      p.fill(255); // white with full opacity
      p.noStroke();
      // Use original dimensions - shader will handle fading at edges
      p.rect(4.5, -200, p.width / 4, p.height / 2.75);

      p.resetShader();
      p.rectMode(p.CORNER);
      p.pop();
    }
  }

  return { preload, draw };
}
