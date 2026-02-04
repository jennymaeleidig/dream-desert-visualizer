import "./p5-setup.js"; // This MUST be the first import
import createStarsModule from "./visuals/stars.js";
import createPyramidModule from "./visuals/pyramid.js";
import createMoonModule from "./visuals/moon.js";
import createSandModule from "./visuals/sand.js";
import createPulseModule from "./visuals/pulse.js";
import createBeamModule from "./visuals/beam.js";
import createBeamParticlesModule from "./visuals/beamParticles.js";
import createTitleModule from "./visuals/title.js";
import createBorderModule from "./visuals/border.js";
import createMenuModule from "./visuals/menu.js";
import createAudioManager from "./audio.js";

// Function to hide loading overlay (defined before sketch)
const hideLoadingOverlay = () => {
  const loadingOverlay = document.getElementById("loading-overlay");
  if (loadingOverlay && !loadingOverlay.classList.contains("hidden")) {
    loadingOverlay.classList.add("hidden");
    // Remove from DOM after transition completes
    setTimeout(() => {
      if (loadingOverlay.parentNode) {
        loadingOverlay.remove();
      }
    }, 300);
  }
};

const sketch = (p) => {
  // visual modules
  let starsModule;
  let pyramidModule;
  let moonModule;
  let sandModule;
  let pulseModule;
  let beamModule;
  let beamParticlesModule;
  let titleModule;
  let borderModule;
  let menuModule;

  // define colors to match the Processing sketch
  p.lightestOrange = p.color(207, 134, 22); // #cf8616
  p.lightOrange = p.color(214, 127, 29); // #d67f1d
  p.orange = p.color(212, 106, 39); // #d46a27
  p.darkestOrange = p.color(205, 79, 12); // #cd4f0c

  // audio manager
  p.audio = createAudioManager(p);

  p.preload = () => {
    // audio should preload its sounds via p.loadSound
    if (p.audio && p.audio.preload) p.audio.preload();

    starsModule = createStarsModule(p);
    if (starsModule.preload) starsModule.preload();

    moonModule = createMoonModule(p);
    if (moonModule.preload) moonModule.preload();

    sandModule = createSandModule(p);
    if (sandModule.preload) sandModule.preload();

    beamParticlesModule = createBeamParticlesModule(p);
    if (beamParticlesModule.preload) beamParticlesModule.preload();

    pyramidModule = createPyramidModule(p);
    if (pyramidModule.preload) pyramidModule.preload();

    pulseModule = createPulseModule(p);
    if (pulseModule.preload) pulseModule.preload();

    beamModule = createBeamModule(p);
    if (beamModule.preload) beamModule.preload();

    titleModule = createTitleModule(p);
    if (titleModule.preload) titleModule.preload();

    borderModule = createBorderModule(p);
    if (borderModule.preload) borderModule.preload();

    menuModule = createMenuModule(p);
    if (menuModule.preload) menuModule.preload();
  };

  p.setup = () => {
    p.createCanvas(512, 512, p.WEBGL);
    p.noSmooth();

    // Hide the loading overlay once p5.js is ready
    hideLoadingOverlay();

    if (p.audio && p.audio.setup) p.audio.setup();

    if (starsModule.setup) starsModule.setup();
    if (moonModule.setup) moonModule.setup();
    if (sandModule.setup) sandModule.setup();
    if (beamParticlesModule.setup) beamParticlesModule.setup();
    if (pyramidModule.setup) pyramidModule.setup();
    if (pulseModule.setup) pulseModule.setup();
    if (beamModule.setup) beamModule.setup();

    if (titleModule.setup) titleModule.setup();
    if (borderModule.setup) borderModule.setup();
    if (menuModule.setup) menuModule.setup();

    p.keyPressed = (evt) => {
      if (p.audio && p.audio.keyPressed) p.audio.keyPressed(evt);
    };

    p.background(0);
  };

  p.draw = () => {
    p.background(0);

    // draw visuals in the same layering order as the Processing sketch
    if (starsModule.draw) starsModule.draw();
    if (moonModule.draw) moonModule.draw();
    if (sandModule.draw) sandModule.draw();
    if (beamParticlesModule.draw) beamParticlesModule.draw();
    if (beamModule.draw) beamModule.draw();
    if (pyramidModule.draw) pyramidModule.draw();
    if (pulseModule.draw) pulseModule.draw();

    // draw UI overlays on top
    if (titleModule.draw) titleModule.draw();
    if (borderModule.draw) borderModule.draw();
    if (menuModule.draw) menuModule.draw();
  };
};

// Mount p5 into the square wrapper to allow CSS scaling without cropping.
const mountEl = document.getElementById("canvas-wrap");
new p5(sketch, mountEl);
