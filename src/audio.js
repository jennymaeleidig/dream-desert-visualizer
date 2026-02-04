// Audio manager using Howler.js - Better mobile browser support
import { Howl } from "howler";

export default function createAudioManager(p) {
  //OG Kanji Converted to half width kana so it works with the Japanese font
  //https://nihongodera.com/tools/convert
  //https://dencode.com/en/string/character-width

  const trackMetadata = [
    {
      url: import.meta.env.VITE_TRACK_01,
      title: "ﾕﾋﾞ ｦ ﾅｶﾞﾚﾙ ｽﾅ",
    },
    {
      url: import.meta.env.VITE_TRACK_02,
      title: "ｻｷｭｳ",
    },
    {
      url: import.meta.env.VITE_TRACK_03,
      title: "ｼﾞﾒﾝ ﾊ ｱﾂｲ",
    },
    {
      url: import.meta.env.VITE_TRACK_04,
      title: "ｽﾅ ﾉ ｸｯｼｮﾝ",
    },
    {
      url: import.meta.env.VITE_TRACK_05,
      title: "ｲｷ",
    },
    {
      url: import.meta.env.VITE_TRACK_06,
      title: "ｻﾘｭｳ",
    },
    {
      url: import.meta.env.VITE_TRACK_07,
      title: "ｲｯｼｮｳ",
    },
    {
      url: import.meta.env.VITE_TRACK_08,
      title: "ﾃﾝｺﾞｸ ﾉ ﾖｳﾅ ｶﾝｼﾞ",
    },
  ];

  const tracks = []; // will hold { title, number, length, globalStartPos, globalEndPos, howl }

  let minTrackPos = 0;
  let maxTrackPos = 0;
  let globalVolume = 0.7;
  let currentTrackIndex = 0;
  let isLoaded = false;

  function preload() {
    // This function is intentionally left empty
    // Audio loading happens asynchronously via loadAsync()
  }

  function loadAsync() {
    // Create Howl instances for each track
    // Howler.js handles mobile browsers better with:
    // - HTML5 Audio fallback
    // - Better buffering and streaming
    // - Automatic iOS/Android audio unlock
    for (let i = 0; i < trackMetadata.length; i++) {
      const howl = new Howl({
        src: [trackMetadata[i].url],
        html5: true, // Enable streaming for better mobile performance
        preload: true, // Load metadata
        volume: globalVolume,
        onload: function () {
          // Update track metadata when loaded
          const track = tracks[i];
          track.length = howl.duration();
          checkAllTracksLoaded();
        },
        onloaderror: function (id, error) {
          console.error(`Failed to load track ${i + 1}:`, error);
        },
        onend: function () {
          // Auto-advance to next track when current track ends
          if (currentTrackIndex < tracks.length - 1) {
            nextTrack();
          }
        },
      });

      tracks.push({
        title: trackMetadata[i].title,
        number: i + 1,
        length: 0, // to be set on load
        globalStartPos: 0, // to be calculated on load
        globalEndPos: 0, // to be calculated on load
        howl: howl,
      });
    }
  }

  function checkAllTracksLoaded() {
    // Check if all tracks have loaded their durations
    const allLoaded = tracks.every((track) => track.length > 0);
    if (allLoaded && !isLoaded) {
      isLoaded = true;
      calculateGlobalPositions();
    }
  }

  function calculateGlobalPositions() {
    // Calculate global positions once all tracks are loaded
    maxTrackPos = 0;
    for (const track of tracks) {
      track.globalStartPos = maxTrackPos;
      track.globalEndPos = maxTrackPos + track.length;
      maxTrackPos += track.length;
    }
  }

  function setup() {
    // Setup is handled asynchronously via loadAsync() and checkAllTracksLoaded()
    // This function remains for compatibility with the existing API
    loadAsync();
  }

  function getCurrentGlobalPosition() {
    if (tracks.length === 0 || !tracks[currentTrackIndex]) return 0;
    const currentTrack = tracks[currentTrackIndex];
    const currentTime = currentTrack.howl.seek() || 0;
    return currentTrack.globalStartPos + currentTime;
  }

  function getCurrentTrack() {
    if (tracks.length === 0 || !tracks[currentTrackIndex]) return null;
    return tracks[currentTrackIndex];
  }

  function getMinTrackPosValue() {
    return minTrackPos;
  }

  function getMaxTrackPosValue() {
    return maxTrackPos;
  }

  function isPlaying() {
    const current = getCurrentTrack();
    if (!current) return false;
    return current.howl.playing();
  }

  function previousTrack() {
    const wasPlaying = isPlaying();

    const current = getCurrentTrack();

    if (current && currentTrackIndex > 0) {
      current.howl.stop();
      currentTrackIndex = currentTrackIndex - 1;

      const newTrack = getCurrentTrack();
      newTrack.howl.seek(0);

      if (wasPlaying) {
        newTrack.howl.play();
      }
    } else {
      // Already at first track, restart current track
      current.howl.seek(0);
    }
  }

  function nextTrack() {
    const wasPlaying = isPlaying();
    const current = getCurrentTrack();
    if (current && currentTrackIndex < tracks.length - 1) {
      current.howl.stop();
      currentTrackIndex = currentTrackIndex + 1;

      const newTrack = getCurrentTrack();
      newTrack.howl.seek(0);

      if (wasPlaying) {
        newTrack.howl.play();
      }
    }
  }

  function keyPressed(evt) {
    // spacebar to play/pause
    const current = getCurrentTrack();

    if (!current) return;

    if (p.key === " ") {
      if (isPlaying()) {
        current.howl.pause();
      } else {
        // Check if at the end of the track
        const currentTime = current.howl.seek() || 0;
        if (currentTime >= current.length - 0.1) {
          // Restart from beginning if at the end
          current.howl.seek(0);
        }
        current.howl.play();
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
      current.howl.volume(globalVolume);
    }

    if (p.keyCode === p.DOWN_ARROW) {
      // decrease volume
      globalVolume = Math.max(0.0, globalVolume - 0.1);
      current.howl.volume(globalVolume);
    }
  }

  return {
    preload,
    loadAsync,
    setup,
    getCurrentGlobalPosition,
    getCurrentTrack,
    getMinTrackPosValue,
    getMaxTrackPosValue,
    keyPressed,
    isPlaying,
    previousTrack,
    nextTrack,
  };
}
