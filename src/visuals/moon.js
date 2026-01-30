export default function createMoonModule(p) {
  let moonTexture;
  let moonPos = { x: -400, y: -45 };
  let moonAngle = 0;
  let moonPathRadius = 0;
  let moonRadius = 0;
  let moonScale = 0.55;
  let isDraggingMoon = false;
  const minMoonAngle = -3.0295637;
  const maxMoonAngle = -0.20374468;
  let audio = null;
  let moonTextureConfigured = false;

  function preload() {
    moonTexture = p.loadImage("/assets/moon.png");
  }

  function setup(opts = {}) {
    if (opts.audio) audio = opts.audio;
    // initial calculations
    moonAngle = Math.atan2(moonPos.y, moonPos.x);
    moonPathRadius = Math.sqrt(moonPos.x * moonPos.x + moonPos.y * moonPos.y);
    moonRadius = moonTexture ? moonTexture.width / 2 : 24;
  }

  function draw() {
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

    // if not dragging, sync moon angle to audio position
    if (!isDraggingMoon && audio && audio.maxTrackPos > 0) {
      const globalPos = audio.getCurrentGlobalPosition();
      moonAngle = p.map(
        globalPos,
        0,
        audio.maxTrackPos,
        minMoonAngle,
        maxMoonAngle,
      );
    }

    // publish moonAngle for other modules (e.g., stars)
    p.moonAngle = moonAngle;
  }

  function mousePressed(evt) {
    // convert mouse to center-relative coordinate system
    const mouseRelX = p.mouseX - p.width / 2;
    const mouseRelY = p.mouseY - p.height / 2;
    // moon's canvas position scaled by moonScale
    const moonCanvasX = moonPos.x * moonScale;
    const moonCanvasY = moonPos.y * moonScale;
    const d = Math.hypot(mouseRelX - moonCanvasX, mouseRelY - moonCanvasY);
    if (d < moonRadius * moonScale) {
      isDraggingMoon = true;
    }
  }

  function mouseDragged(evt) {
    if (!isDraggingMoon) return;
    const mouseRelX = p.mouseX - p.width / 2;
    const mouseRelY = p.mouseY - p.height / 2;
    const scaledX = mouseRelX / moonScale;
    const scaledY = mouseRelY / moonScale;
    const proposedAngle = Math.atan2(scaledY, scaledX);
    if (scaledY < 0) {
      // constrain to allowed segment
      moonAngle = Math.max(Math.min(proposedAngle, maxMoonAngle), minMoonAngle);
    }
  }

  function mouseReleased(evt) {
    if (isDraggingMoon && audio) {
      const seekPosition = Math.floor(
        p.map(moonAngle, minMoonAngle, maxMoonAngle, 0, audio.maxTrackPos),
      );
      audio.seek(seekPosition);
    }
    isDraggingMoon = false;
  }

  return { preload, setup, draw, mousePressed, mouseDragged, mouseReleased };
}
