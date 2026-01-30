// Audio manager using p5 and p5.sound

export default function createAudioManager(p) {
  //OG Kanji Converted to half width kana so it works with the Japanese font
  //https://nihongodera.com/tools/convert
  //https://dencode.com/en/string/character-width
  const defaultTracks = [
    {
      url: "https://res.cloudinary.com/dqcr2lwws/video/upload/v1769706116/01_mb7n4b.mp3",
      title: "ﾕﾋﾞ ｦ ﾅｶﾞﾚﾙ ｽﾅ",
    },
    {
      url: "https://res.cloudinary.com/dqcr2lwws/video/upload/v1769706116/02_avmojr.mp3",
      title: "ｻｷｭｳ",
    },
    {
      url: "https://res.cloudinary.com/dqcr2lwws/video/upload/v1769706101/03_miwqae.mp3",
      title: "ｼﾞﾒﾝ ﾊ ｱﾂｲ",
    },
    {
      url: "https://res.cloudinary.com/dqcr2lwws/video/upload/v1769706098/04_dt25fv.mp3",
      title: "ｽﾅ ﾉ ｸｯｼｮﾝ",
    },
    {
      url: "https://res.cloudinary.com/dqcr2lwws/video/upload/v1769706097/05_qq3b33.mp3",
      title: "ｲｷ",
    },
    {
      url: "https://res.cloudinary.com/dqcr2lwws/video/upload/v1769706094/06_bmm39n.mp3",
      title: "ｻﾘｭｳ",
    },
    {
      url: "https://res.cloudinary.com/dqcr2lwws/video/upload/v1769706108/07_f5bsc1.mp3",
      title: "ｲｯｼｮｳ",
    },
    {
      url: "https://res.cloudinary.com/dqcr2lwws/video/upload/v1769706110/08_lahejv.mp3",
      title: "ﾃﾝｺﾞｸ ﾉ ﾖｳﾅ ｶﾝｼﾞ",
    },
  ];

  const trackMetadata = defaultTracks;
  const tracks = []; // will hold { title, number, length, globalStartPos, globalEndPos, sound }

  let maxTrackPos = 0;
  let currentIndex = 0; // index into tracks

  function preload() {
    p.soundFormats("mp3");
    // Create audio elements and load metadata; durations will be set when metadata loads
    for (let i = 0; i < trackMetadata.length; i++) {
      const soundObj = p.loadSound(trackMetadata[i].url);
      tracks.push(soundObj);
    }
  }

  function setup() {
    for (let i = 0; i < tracks.length; i++) {
      const t = tracks[i];
      if (t && t.isLoaded()) {
        console.log(
          `AudioManager: track ${i} is loaded, duration: ${t.duration()} seconds`,
        );
      } else {
        console.warn(`AudioManager: track ${i} is not loaded yet`);
      }
    }
  }

  return {
    preload,
    setup,
  };
}
