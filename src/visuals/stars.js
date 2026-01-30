export default function createStarsModule(p) {
  let starsTexture;
  let startRotation;
  let starsTextureConfigured = false;

  function preload() {
    starsTexture = p.loadImage("/assets/stars.png");
  }

  function setup() {
    startRotation = p.random(0, p.TWO_PI);
  }

  function draw() {
    p.push();
    // In WEBGL mode the origin is at the center already (no translate needed)
    p.scale(0.7);
    p.imageMode(p.CENTER);
    // Match Processing behaviour: original did `rotate(starRotationStart + radians(moonAngle) * 32)`.
    // To mirror that (and avoid double-converting units), convert the factor directly:
    // radians(moonAngle) * 32 == moonAngle * (32 * PI / 180) when moonAngle is in radians.
    const STAR_ANGLE_MULT = (32.0 * Math.PI) / 180.0;
    p.rotate(startRotation + (p.moonAngle || 0) * STAR_ANGLE_MULT);
    if (!starsTextureConfigured) {
      // Access texture via the internal renderer to avoid 'canvas undefined' errors
      let tex = p._renderer.getTexture(starsTexture);
      if (tex) {
        tex.setInterpolation(p.NEAREST, p.NEAREST);
        starsTextureConfigured = true;
      }
    }
    p.image(starsTexture, 0, 0);
    p.imageMode(p.CORNER);
    p.pop();
  }

  return { preload, setup, draw };
}
