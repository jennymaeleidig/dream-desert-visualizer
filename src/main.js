import "./p5-setup.js"; // This MUST be the first import
import "p5/lib/addons/p5.sound.js";
import createStarsModule from "./visuals/stars.js";
import createPyramidModule from "./visuals/pyramid.js";
import createMoonModule from "./visuals/moon.js";
import createSandModule from "./visuals/sand.js";
import createAudioManager from "./audio.js";

const sketch = (p) => {
  // visual modules
  let starsModule;
  let pyramidModule;
  let moonModule;
  let sandModule;
  const colors = {
    // define colors to match the Processing sketch
    lightestOrange: p.color(207, 134, 22), // #cf8616
    lightOrange: p.color(214, 127, 29), // #d67f1d
    orange: p.color(212, 106, 39), // #d46a27
    darkestOrange: p.color(205, 79, 12), // #cd4f0c
  };
  // audio manager
  // const audio = createAudioManager(p);
  const audio = null;

  p.preload = () => {
    // audio should preload its sounds via p.loadSound
    if (audio && audio.preload) audio.preload();

    starsModule = createStarsModule(p);
    if (starsModule.preload) starsModule.preload();

    pyramidModule = createPyramidModule(p, colors);
    if (pyramidModule.preload) pyramidModule.preload();

    moonModule = createMoonModule(p);
    if (moonModule.preload) moonModule.preload();

    sandModule = createSandModule(p);
    if (sandModule.preload) sandModule.preload();
  };

  p.setup = () => {
    p.createCanvas(512, 512, p.WEBGL);
    p.noSmooth();

    // audio manager setup
    if (audio && audio.setup) audio.setup();

    if (starsModule.setup) starsModule.setup();
    // pass audio reference to the moon module (for later interaction)
    if (moonModule.setup) moonModule.setup({ audio });
    if (sandModule.setup) sandModule.setup();
    if (pyramidModule.setup) pyramidModule.setup();

    // Helper to map DOM event coords to canvas (internal) coords
    const mapPointerEventToCanvas = (evt) => {
      const canvasEl = p && p.canvas;
      if (!canvasEl || !evt) return evt;
      const rect = canvasEl.getBoundingClientRect();
      const scaleX = canvasEl.width / rect.width; // internal pixels / css pixels
      const scaleY = canvasEl.height / rect.height;
      const x = (evt.clientX - rect.left) * scaleX;
      const y = (evt.clientY - rect.top) * scaleY;
      return Object.assign({}, evt, { scaledX: x, scaledY: y });
    };

    // Forward Mouse Pressed (with scaled coords as scaledX/scaledY)
    p.mousePressed = (evt) => {
      const scaled = mapPointerEventToCanvas(evt);
      if (moonModule.mousePressed) moonModule.mousePressed(scaled);
    };

    // Forward Mouse Dragged
    p.mouseDragged = (evt) => {
      const scaled = mapPointerEventToCanvas(evt);
      if (moonModule.mouseDragged) moonModule.mouseDragged(scaled);
    };

    // Forward Mouse Released
    p.mouseReleased = (evt) => {
      const scaled = mapPointerEventToCanvas(evt);
      if (moonModule.mouseReleased) moonModule.mouseReleased(scaled);
    };

    p.background(0);
  };

  p.draw = () => {
    p.background(1);

    // draw visuals in the same layering order as the Processing sketch
    if (starsModule.draw) starsModule.draw();
    if (moonModule.draw) moonModule.draw();
    if (sandModule.draw) sandModule.draw();
    if (pyramidModule.draw) pyramidModule.draw();
  };
};

// Mount p5 into the square wrapper to allow CSS scaling without cropping.
const mountEl = document.getElementById("canvas-wrap");
new p5(sketch, mountEl);
