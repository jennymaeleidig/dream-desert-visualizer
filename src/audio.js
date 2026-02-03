// Audio manager using p5 and p5.sound

export default function createAudioManager(p) {
  //OG Kanji Converted to half width kana so it works with the Japanese font
  //https://nihongodera.com/tools/convert
  //https://dencode.com/en/string/character-width
  // const trackMetadata = [
  //   {
  //     url: "https://audio.jukehost.co.uk/vBwMG7PshIUrGKB6icEyhzjmvFU4moRC",
  //     title: "ﾕﾋﾞ ｦ ﾅｶﾞﾚﾙ ｽﾅ",
  //   },
  //   {
  //     url: "https://audio.jukehost.co.uk/xOhDG2N6LS3lv9DidOOTNe5QvwN1R6FI",
  //     title: "ｻｷｭｳ",
  //   },
  //   {
  //     url: "https://audio.jukehost.co.uk/ZKFjJ9jgIDMpYkwZv0RmOFUikTuvD0Nm",
  //     title: "ｼﾞﾒﾝ ﾊ ｱﾂｲ",
  //   },
  //   {
  //     url: "https://audio.jukehost.co.uk/ibyIu1IvFXu97DldyliZHEVbwUy0dDHy",
  //     title: "ｽﾅ ﾉ ｸｯｼｮﾝ",
  //   },
  //   {
  //     url: "https://audio.jukehost.co.uk/qbgwtJbo6tq2WKcpM1gKq1gBl181SqO8",
  //     title: "ｲｷ",
  //   },
  //   {
  //     url: "https://audio.jukehost.co.uk/iX2OshHcOd38hRMwAyPXeO66AM47Mp3o",
  //     title: "ｻﾘｭｳ",
  //   },
  //   {
  //     url: "https://audio.jukehost.co.uk/8gSqciA2zNTBwmL9kWKLDOsZyufoHuig",
  //     title: "ｲｯｼｮｳ",
  //   },
  //   {
  //     url: "https://audio.jukehost.co.uk/G1FotNyAPJyHooVr6x4IQyfjz2ZX7VjZ",
  //     title: "ﾃﾝｺﾞｸ ﾉ ﾖｳﾅ ｶﾝｼﾞ",
  //   },
  // ];

  const trackMetadata = [
    {
      url: "/assets/tracks/01.mp3",
      title: "ﾕﾋﾞ ｦ ﾅｶﾞﾚﾙ ｽﾅ",
    },
    {
      url: "/assets/tracks/02.mp3",
      title: "ｻｷｭｳ",
    },
    {
      url: "/assets/tracks/03.mp3",
      title: "ｼﾞﾒﾝ ﾊ ｱﾂｲ",
    },
    {
      url: "/assets/tracks/04.mp3",
      title: "ｽﾅ ﾉ ｸｯｼｮﾝ",
    },
    {
      url: "/assets/tracks/05.mp3",
      title: "ｲｷ",
    },
    {
      url: "/assets/tracks/06.mp3",
      title: "ｻﾘｭｳ",
    },
    {
      url: "/assets/tracks/07.mp3",
      title: "ｲｯｼｮｳ",
    },
    {
      url: "/assets/tracks/08.mp3",
      title: "ﾃﾝｺﾞｸ ﾉ ﾖｳﾅ ｶﾝｼﾞ",
    },
  ];

  const tracks = []; // will hold { title, number, length, globalStartPos, globalEndPos, sound }

  let minTrackPos = 0;
  let maxTrackPos = 0;
  let globalVolume = 0.7;
  let currentTrackIndex = 0;

  function preload() {
    p.soundFormats("mp3");
    // Create audio elements and load metadata; durations will be set when metadata loads
    for (let i = 0; i < trackMetadata.length; i++) {
      const soundObj = p.loadSound(trackMetadata[i].url);
      tracks.push({
        title: trackMetadata[i].title,
        number: i + 1,
        length: 0, // to be set on load
        globalStartPos: 0, // to be calculated on load
        globalEndPos: 0, // to be calculated on load
        sound: soundObj,
      });
    }
  }

  function setup() {
    for (const track of tracks) {
      track.sound.setVolume(globalVolume);
      track.length = track.sound.duration();
      track.globalStartPos = maxTrackPos;
      track.globalEndPos = maxTrackPos + track.length;
      maxTrackPos += track.length;
    }
  }

  function getCurrentGlobalPosition() {
    return (
      tracks[currentTrackIndex].globalStartPos +
      tracks[currentTrackIndex].sound.currentTime()
    );
  }

  function getCurrentTrack() {
    return tracks[currentTrackIndex];
  }

  function getMinTrackPosValue() {
    return minTrackPos;
  }

  function getMaxTrackPosValue() {
    return maxTrackPos;
  }

  function previousTrack() {
    // jump to beginning of previous track
    let wasPlaying = getCurrentTrack().sound.isPlaying();
    if (currentTrackIndex > 0) {
      let prevIndex = currentTrackIndex - 1;
      getCurrentTrack().sound.stop();
      currentTrackIndex = prevIndex;
      if (wasPlaying) {
        getCurrentTrack().sound.play(0, 1, globalVolume);
      } else {
        // Paused: play at volume 0, then pause to cue position
        getCurrentTrack().sound.play(0, 1, 0);
        getCurrentTrack().sound.stop();
        getCurrentTrack().sound.setVolume(globalVolume);
      }
    }
  }

  function nextTrack() {
    // jump to beginning of next track
    let wasPlaying = getCurrentTrack().sound.isPlaying();
    if (currentTrackIndex < tracks.length - 1) {
      getCurrentTrack().sound.stop();
      currentTrackIndex = currentTrackIndex + 1;
      if (wasPlaying) {
        getCurrentTrack().sound.play(0, 1, globalVolume);
      } else {
        // Paused: play at volume 0, then pause to cue position
        getCurrentTrack().sound.play(0, 1, 0);
        getCurrentTrack().sound.stop();
        getCurrentTrack().sound.setVolume(globalVolume);
      }
    }
  }

  function keyPressed(evt) {
    // spacebar to play/pause
    if (p.key === " ") {
      if (getCurrentTrack().sound.isPlaying()) {
        getCurrentTrack().sound.pause();
      }
      // if the player is at the end of the file, do nothing
      else if (
        getCurrentTrack().sound.currentTime() >= getCurrentTrack().length
      ) {
        return;
      } else {
        getCurrentTrack().sound.play();
      }
    }

    if (p.keyCode === p.RIGHT_ARROW) {
      nextTrack();
    }

    if (p.keyCode === p.LEFT_ARROW) {
      previousTrack();
    }

    if (p.keyCode === p.UP_ARROW) {
      // increase volume
      globalVolume = Math.min(1.0, globalVolume + 0.1);
      getCurrentTrack().sound.setVolume(globalVolume);
    }

    if (p.keyCode === p.DOWN_ARROW) {
      // decrease volume
      globalVolume = Math.max(0.0, globalVolume - 0.1);
      getCurrentTrack().sound.setVolume(globalVolume);
    }
  }

  return {
    preload,
    setup,
    getCurrentGlobalPosition,
    getCurrentTrack,
    getMinTrackPosValue,
    getMaxTrackPosValue,
    keyPressed,
  };
}
