import p5 from "p5";
import createStarsModule from "./visuals/stars.js";
import createPyramidModule from "./visuals/pyramid.js";
import createMoonModule from "./visuals/moon.js";
import createSandModule from "./visuals/sand.js";

const sketch = (p) => {
  // visual modules
  let starsModule;
  let pyramidModule;
  let moonModule;
  let sandModule;
  let audio;

  p.preload = () => {
    starsModule = createStarsModule(p);
    if (starsModule.preload) starsModule.preload();

    pyramidModule = createPyramidModule(p);
    if (pyramidModule.preload) pyramidModule.preload();

    moonModule = createMoonModule(p);
    if (moonModule.preload) moonModule.preload();

    sandModule = createSandModule(p);
    if (sandModule.preload) sandModule.preload();
  };

  p.setup = () => {
    p.createCanvas(512, 512, p.WEBGL);
    p.noSmooth();

    // audio = new AudioManager(p, {
    //   tracks: [
    //     "https://res.cloudinary.com/dqcr2lwws/video/upload/v1769706116/01_mb7n4b.mp3",
    //     "https://res.cloudinary.com/dqcr2lwws/video/upload/v1769706116/02_avmojr.mp3",
    //     "https://res.cloudinary.com/dqcr2lwws/video/upload/v1769706101/03_miwqae.mp3",
    //     "https://res.cloudinary.com/dqcr2lwws/video/upload/v1769706098/04_dt25fv.mp3",
    //     "https://res.cloudinary.com/dqcr2lwws/video/upload/v1769706097/05_qq3b33.mp3",
    //     "https://res.cloudinary.com/dqcr2lwws/video/upload/v1769706094/06_bmm39n.mp3",
    //     "https://res.cloudinary.com/dqcr2lwws/video/upload/v1769706108/07_f5bsc1.mp3",
    //     "https://res.cloudinary.com/dqcr2lwws/video/upload/v1769706110/08_lahejv.mp3",
    //   ],
    // });
    audio = null;

    if (starsModule.setup) starsModule.setup();
    if (moonModule.setup) moonModule.setup({ audio });
    if (sandModule.setup) sandModule.setup();
    if (pyramidModule.setup) pyramidModule.setup();

    p.background(1);

    // register mouse handlers to forward to modules
    p.mousePressed = (evt) => {
      if (moonModule.mousePressed) moonModule.mousePressed(evt);
    };
    p.mouseDragged = (evt) => {
      if (moonModule.mouseDragged) moonModule.mouseDragged(evt);
    };
    p.mouseReleased = (evt) => {
      if (moonModule.mouseReleased) moonModule.mouseReleased(evt);
    };
  };

  p.draw = () => {
    p.background(1);

    // draw visuals in the same layering order as the Processing sketch
    if (starsModule.draw) starsModule.draw();
    if (moonModule.draw) moonModule.draw();
    if (sandModule.draw) sandModule.draw();
    if (pyramidModule.draw) pyramidModule.draw();

    // audio-related per-frame work (none yet)
  };
};

// In your Vite main.js
new p5(sketch, document.getElementById("app"));
