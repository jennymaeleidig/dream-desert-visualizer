export class AudioManager {
  constructor(p, { tracks = [] } = {}) {
    this.p = p;
    this.tracks = tracks;
    this.soundFiles = new Array(tracks.length).fill(null);
    this.trackMetadata = tracks.map((url, i) => ({
      url,
      number: i + 1,
      length: 0,
      loaded: false,
    }));
    this.currentTrackIndex = 0;
    this.globalStartPositions = new Array(tracks.length).fill(0);
    this.maxTrackPos = 0; // total length in ms (computed after load)
    this.masterVolumeDb = 0; // dB like original; we'll expose a linear converter

    // create a toggle to ensure we unlock audio on user gesture
    this.unlocked = false;

    // bind keys
    p.keyPressed = (evt) => this._handleKey(evt);

    // add play/pause button to unlock audio context and handle first-play lazy load
    this._createPlayButton();
  }

  _createPlayButton() {
    const btn = document.createElement("button");
    btn.textContent = "Play";
    btn.style.position = "fixed";
    btn.style.left = "12px";
    btn.style.top = "12px";
    document.body.appendChild(btn);
    btn.addEventListener("click", async () => {
      if (!this.unlocked) {
        this.p.userStartAudio();
        this.unlocked = true;
      }
      // lazy-load current track if needed
      await this._ensureTrackLoaded(this.currentTrackIndex);
      this.play();
      btn.style.display = "none";
    });
  }

  async _ensureTrackLoaded(index) {
    if (this.soundFiles[index]) return this.soundFiles[index];
    const url = this.trackMetadata[index].url;
    return new Promise((resolve) => {
      const sf = new this.p5SoundFile(this.p, url, () => {
        this.soundFiles[index] = sf;
        this.trackMetadata[index].length = sf.duration() * 1000;
        this._recomputeGlobalPositions();
        resolve(sf);
      });
    });
  }

  // wrapper to use p5.SoundFile in an importable way
  get p5SoundFile() {
    // p5.sound attaches to the p5 instance under 'sound' namespace; but in module builds we can create via window.p5.SoundFile
    if (typeof window !== "undefined" && window.p5 && window.p5.SoundFile) {
      return window.p5.SoundFile;
    }
    throw new Error(
      "p5.SoundFile not available (make sure p5.sound is loaded)",
    );
  }

  async play() {
    const sf = await this._ensureTrackLoaded(this.currentTrackIndex);
    if (!sf.isPlaying()) sf.play();
  }

  pause() {
    const sf = this.soundFiles[this.currentTrackIndex];
    if (sf && sf.isPlaying()) sf.pause();
  }

  _handleKey(evt) {
    if (evt.key === " ") {
      const sf = this.soundFiles[this.currentTrackIndex];
      if (sf && sf.isPlaying()) {
        sf.pause();
      } else {
        this.play();
      }
    }

    if (evt.key === "ArrowUp") {
      this.masterVolumeDb = Math.min(this.masterVolumeDb + 1, 6);
      this._applyMasterVolume();
    }
    if (evt.key === "ArrowDown") {
      this.masterVolumeDb = Math.max(this.masterVolumeDb - 1, -80);
      this._applyMasterVolume();
    }

    if (evt.key === "ArrowRight") {
      // next track
      this._advanceTrack(1);
    }
    if (evt.key === "ArrowLeft") {
      // previous track (if possible)
      this._advanceTrack(-1);
    }
  }

  _applyMasterVolume() {
    const linear = Math.pow(10, this.masterVolumeDb / 20);
    const sf = this.soundFiles[this.currentTrackIndex];
    if (sf) sf.setVolume(linear);
  }

  async _advanceTrack(direction) {
    const wasPlaying =
      this.soundFiles[this.currentTrackIndex] &&
      this.soundFiles[this.currentTrackIndex].isPlaying();
    const next =
      (this.currentTrackIndex + direction + this.tracks.length) %
      this.tracks.length;
    if (this.soundFiles[this.currentTrackIndex])
      this.soundFiles[this.currentTrackIndex].stop();
    this.currentTrackIndex = next;
    await this._ensureTrackLoaded(this.currentTrackIndex);
    this._applyMasterVolume();
    if (wasPlaying) this.play();
  }

  // recompute global start positions after loads
  _recomputeGlobalPositions() {
    let acc = 0;
    for (let i = 0; i < this.trackMetadata.length; i++) {
      this.globalStartPositions[i] = acc;
      acc += this.trackMetadata[i].length;
    }
    this.maxTrackPos = acc;
  }

  // seek to global ms position across tracks
  async seek(positionMs) {
    // find track and local position
    for (let i = 0; i < this.trackMetadata.length; i++) {
      const start = this.globalStartPositions[i];
      const end = start + this.trackMetadata[i].length;
      if (positionMs >= start && positionMs <= end) {
        if (i !== this.currentTrackIndex) {
          if (
            this.soundFiles[this.currentTrackIndex] &&
            this.soundFiles[this.currentTrackIndex].isPlaying()
          )
            this.soundFiles[this.currentTrackIndex].pause();
          this.currentTrackIndex = i;
          await this._ensureTrackLoaded(i);
        } else {
          // if seeking within current track, ensure it is loaded before calling jump
          await this._ensureTrackLoaded(this.currentTrackIndex);
        }
        const sf = this.soundFiles[this.currentTrackIndex];
        if (!sf) {
          if (process.env.NODE_ENV !== "production")
            console.warn(
              "Attempted to seek but sound file is not loaded:",
              this.currentTrackIndex,
            );
          return;
        }
        const local = positionMs - start;
        sf.jump(local / 1000.0);
        this._applyMasterVolume();
        return;
      }
    }
  }

  getCurrentGlobalPosition() {
    const sf = this.soundFiles[this.currentTrackIndex];
    if (!sf) return this.globalStartPositions[this.currentTrackIndex] || 0;
    return (
      (this.globalStartPositions[this.currentTrackIndex] || 0) +
      sf.currentTime() * 1000
    );
  }
}
