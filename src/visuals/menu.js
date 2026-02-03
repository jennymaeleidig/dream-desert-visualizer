export default function createMenuModule(p) {
  let vcrFont;
  let vcrFontJP;
  let audio = p.audio; // get reference to audio manager

  const preload = () => {
    // Load fonts - these will be available globally in p5
    vcrFont = p.loadFont("assets/fonts/vcr.ttf");
    vcrFontJP = p.loadFont("assets/fonts/vcr-jp.ttf");
  };

  const draw = () => {
    // Only draw menu when audio exists and is paused
    if (!audio || !audio.getCurrentTrack) return;

    const currentTrack = audio.getCurrentTrack();
    if (
      !currentTrack ||
      !currentTrack.sound ||
      currentTrack.sound.isPlaying()
    ) {
      return;
    }

    p.push();
    // Translate to top-left coordinate system (Processing compatible)
    p.translate(-p.width / 2, -p.height / 2);
    // Pause indicator
    p.fill(0);
    p.stroke(p.orange);
    p.strokeWeight(2);
    p.rect(25, 25, 75, 25);
    p.fill(p.orange);
    p.noStroke();
    p.textFont(vcrFont);
    p.textSize(15);
    p.textAlign(p.CENTER, p.CENTER);
    p.text("Paused", 62.5, 37.5);

    // Current track
    p.fill(0);
    p.stroke(p.orange);
    p.strokeWeight(2);
    const trackLabel = "Curr Track:";
    const trackTitle = currentTrack.number + ". " + currentTrack.title;
    const trackTitleWidth = Math.floor(trackTitle.length * 10.5); // rough estimate
    const labelWidth = Math.floor(trackLabel.length * 10.5); // rough estimate
    p.rect(25, 75, Math.max(trackTitleWidth, labelWidth), 37.5);
    p.fill(p.orange);
    p.noStroke();
    p.textFont(vcrFontJP);
    p.textSize(12);
    p.textAlign(p.LEFT, p.TOP);
    p.text(trackLabel, 35.5, 80);
    p.text(trackTitle, 35.5, 95);

    // Controls
    p.fill(0);
    p.stroke(p.orange);
    p.strokeWeight(2);
    p.rect(p.width - 200, 25, 175, 79);
    p.fill(p.orange);
    p.noStroke();
    p.textFont(vcrFont);
    p.textSize(15);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Space: Play/Pause", p.width - 190, 35);
    p.text("Up/Dn: Volume", p.width - 190, 56);
    p.text("Lft/Rt: Prev/Next", p.width - 190, 77);

    p.pop();
  };

  return {
    preload,
    draw,
  };
}
