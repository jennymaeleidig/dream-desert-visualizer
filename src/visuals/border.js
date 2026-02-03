export default function createBorderModule(p) {
  const draw = () => {
    p.push();
    // Translate to top-left coordinate system (Processing compatible)
    p.translate(-p.width / 2, -p.height / 2);

    p.stroke(p.orange);
    p.strokeWeight(4);
    p.line(-1, 1, p.width + 1, 1); // top
    p.line(1, p.height - 1, p.width + 1, p.height - 1); // bottom
    p.line(1, -1, 1, p.height + 1); // left
    p.line(p.width - 1, -1, p.width - 1, p.height + 1); // right
    p.strokeWeight(3);
    p.line(-1, 454, p.width + 1, 454); // top of title bar

    p.pop();
  };

  return {
    draw,
  };
}
