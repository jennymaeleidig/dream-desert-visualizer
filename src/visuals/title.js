export default function createTitleModule(p) {
  let titleImage;
  let titleImageConfigured = false;

  const preload = () => {
    titleImage = p.loadImage("assets/images/title.png");
  };

  const draw = () => {
    p.push();
    // Translate to top-left coordinate system (Processing compatible)
    p.translate(-p.width / 2, -p.height / 2);

    p.imageMode(p.CENTER);
    if (!titleImageConfigured) {
      // Access texture via the internal renderer to avoid 'canvas undefined' errors
      let tex = p._renderer.getTexture(titleImage);
      if (tex) {
        tex.setInterpolation(p.NEAREST, p.NEAREST);
        titleImageConfigured = true;
      }
    }
    p.image(titleImage, 256, 482);
    p.imageMode(p.CORNER);

    p.pop();
  };

  return {
    preload,
    draw,
  };
}
