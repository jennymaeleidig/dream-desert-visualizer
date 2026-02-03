export default function createMoonModule(p) {
  let moonTexture;
  let moonPos = { x: -400, y: -45 };
  let moonAngle = 0;
  let moonPathRadius = 0;
  let moonScale = 0.55;
  p.minMoonAngle = -3.0295637;
  p.maxMoonAngle = -0.20374468;
  let moonTextureConfigured = false;

  let audio = p.audio; // get reference to audio manager

  function preload() {
    moonTexture = p.loadImage("/assets/images/moon.png");
  }

  function setup() {
    // initial calculations
    moonAngle = Math.atan2(moonPos.y, moonPos.x);
    moonPathRadius = Math.sqrt(moonPos.x * moonPos.x + moonPos.y * moonPos.y);
  }

  function draw() {
    // Sync moon angle to audio position BEFORE drawing
    if (audio && audio.getMaxTrackPosValue() > 0) {
      const globalPos = audio.getCurrentGlobalPosition();
      moonAngle = p.map(
        globalPos,
        audio.getMinTrackPosValue(),
        audio.getMaxTrackPosValue(),
        p.minMoonAngle,
        p.maxMoonAngle,
      );
    }

    // Now draw the moon at the updated angle
    p.push();
    // scaled draw; in WEBGL origin is center
    p.scale(moonScale);
    p.imageMode(p.CENTER);
    // update moon position from angle
    moonPos.x = Math.cos(moonAngle) * moonPathRadius;
    moonPos.y = Math.sin(moonAngle) * moonPathRadius;
    // Handle Point Sampling (Replaces Processing's textureSampling(1))
    if (!moonTextureConfigured) {
      // Access texture via the internal renderer to avoid 'canvas undefined' errors
      let tex = p._renderer.getTexture(moonTexture);
      if (tex) {
        tex.setInterpolation(p.NEAREST, p.NEAREST);
        moonTextureConfigured = true;
      }
    }
    p.image(moonTexture, moonPos.x, moonPos.y);
    p.imageMode(p.CORNER);
    p.pop();

    // publish moonAngle for other modules (e.g., stars)
    p.moonAngle = moonAngle;
  }

  return { preload, setup, draw };
}
