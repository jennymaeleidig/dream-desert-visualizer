export default function createPyramidModule(p, colors) {
  let patternGraphics;
  let pyramidTexture;
  let innerPyramidScale = 0.65;
  let innerPyramidAlpha = 150;
  //points found by measuring original image and scaling down to 512x512

  // front wall points
  //starting at bottom right then clockwise
  let frontCoords = [
    [335, 400],
    [55, 319],
    [245, 155],
    [263, 160],
  ];

  // right wall points
  // starting at top right, clockwise
  let rightCoords = [
    [272, 156],
    [452, 312],
    [335, 400],
    [263, 160.5],
  ];
  // tip highlight points
  // starting at bottom, clockwise
  let tipCoords = [
    [262.5, 156.5],
    [250, 153],
    [260.5, 143],
    [270.5, 152.5],
  ];

  function generatePattern() {
    // Create a graphics buffer sized to the canvas (fallback to 512)
    const w = p.width || 512;
    const h = p.height || 512;
    const pg = p.createGraphics(w, h);

    // Clear and set up drawing styles
    pg.clear();
    pg.fill(0);
    pg.stroke(colors.lightOrange);
    pg.strokeWeight(1);

    // Define cell dimensions
    const oddRow = { width: 15, height: 17, offsetX: -2 };
    const evenRow = { width: 15, height: 24, offsetX: 14 };

    let currentRow = oddRow;
    let evenRowNum = 0;
    let oddRowNum = 1;

    for (
      let y = 0;
      y < h;
      y += currentRow === oddRow ? evenRow.height : oddRow.height
    ) {
      const evenRowOffsetX = evenRowNum * evenRow.offsetX;
      const oddRowOffsetX = oddRowNum * oddRow.offsetX;
      const rowOffsetX = evenRowOffsetX + oddRowOffsetX;

      for (
        let x = currentRow.width * 10;
        x < w + rowOffsetX;
        x += currentRow.width
      ) {
        const TLx = x - rowOffsetX;
        const TLy = y;
        const TRx = x + currentRow.width - rowOffsetX;
        const TRy = y;
        const BLx = x - currentRow.offsetX - rowOffsetX;
        const BLy = y + currentRow.height;
        const BRx = x + currentRow.width - currentRow.offsetX - rowOffsetX;
        const BRy = y + currentRow.height;

        // Draw the tile quad
        pg.quad(TLx, TLy, TRx, TRy, BRx, BRy, BLx, BLy);
      }

      // alternate rows
      if (currentRow === oddRow) {
        currentRow = evenRow;
        oddRowNum++;
      } else {
        currentRow = oddRow;
        evenRowNum++;
      }
    }

    // return the graphics buffer; p5 accepts p5.Graphics as a texture
    return pg;
  }

  function preload() {
    // none
  }

  function setup() {
    // generate and keep graphics buffer so we can reuse/update it if needed
    patternGraphics = generatePattern();
    pyramidTexture = patternGraphics;
  }

  function draw() {
    // Processing coordinates are top-left; in WEBGL p5 origin is center.
    // Translate so we can use the same vertex coordinates as Processing.
    p.push();
    p.translate(-p.width / 2, -p.height / 2);

    // Right wall (semi-transparent overlay)
    p.stroke(colors.lightOrange);
    p.strokeWeight(0.5);
    p.fill(0, 150);
    p.beginShape();
    // draw right wall
    for (let i = 0; i < 4; i++) {
      let x = rightCoords[i][0];
      let y = rightCoords[i][1];
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);

    // Apply texture to front facing wall
    p.noStroke();
    p.noFill();
    p.beginShape();
    p.textureMode(p.NORMAL);
    p.texture(pyramidTexture);
    //values found by trial and error to ensure proper texture mapping
    p.vertex(frontCoords[0][0], frontCoords[0][1], 1, 0.995);
    p.vertex(frontCoords[1][0], frontCoords[1][1], 0, 0.995);
    p.vertex(frontCoords[2][0], frontCoords[2][1], 0.29, -0.0025);
    p.vertex(frontCoords[3][0], frontCoords[3][1], 0.365, -0.0025);
    p.endShape(p.CLOSE);

    // Tip highlight
    p.fill(colors.lightestOrange);
    p.noStroke();
    p.beginShape();
    for (let i = 0; i < 4; i++) {
      let x = tipCoords[i][0];
      let y = tipCoords[i][1];
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);

    // Inner smaller pyramid w/ alpha to create depth
    p.fill(0, innerPyramidAlpha);
    p.push();
    const s = innerPyramidScale;
    const cx = 276;
    const cy = 280;
    p.translate(cx, cy);
    p.scale(s);
    p.translate(-cx, -cy);

    p.beginShape();
    // draw inner front wall
    for (let i = 0; i < 4; i++) {
      let x = frontCoords[i][0];
      let y = frontCoords[i][1];
      p.vertex(x, y);
    }

    // draw inner right wall
    for (let i = 0; i < 2; i++) {
      let x = rightCoords[i][0];
      let y = rightCoords[i][1];
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);

    // Inner tip highlight
    p.fill(
      p.red(colors.lightestOrange),
      p.green(colors.lightestOrange),
      p.blue(colors.lightestOrange),
      innerPyramidAlpha,
    );
    p.noStroke();
    p.beginShape();
    for (let i = 0; i < 4; i++) {
      let x = tipCoords[i][0];
      let y = tipCoords[i][1];
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);

    p.pop();

    //want to place a solid black shape over the inner pyramid right wall to create the illusion of depth
    p.fill(0, innerPyramidAlpha);
    p.stroke(colors.lightOrange);
    p.strokeWeight(0.25);
    //measurements derived from the scaled inner pyramid
    let innerPyramidRightBorder = [
      [321, 353], //bottom left
      [390, 301], //bottom right
      [275.5, 201], //top
    ];
    p.beginShape();
    for (let i = 0; i < innerPyramidRightBorder.length; i++) {
      p.vertex(innerPyramidRightBorder[i][0], innerPyramidRightBorder[i][1]);
    }
    p.endShape(p.CLOSE);
    p.pop();
  }

  return { preload, setup, draw };
}
