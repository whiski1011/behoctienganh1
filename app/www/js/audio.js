/* Âm thanh: nhạc nền tự tổng hợp (WebAudio, không cần file nhạc) + hiệu ứng âm thanh */
(function () {
  const A = {};
  let ctx = null, master, musicGain, sfxGain, noiseBuf;
  let musicVol = 0.35, sfxVol = 0.8, musicOn = true, duck = 1;
  let playing = false, timer = null, nextTime = 0, step = 0, songIdx = 0;

  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  // Ký hiệu: [nốt MIDI hoặc 0 = nghỉ, số phách]
  const N = { C4: 60, D4: 62, E4: 64, F4: 65, G4: 67, A4: 69, B4: 71, C5: 72, D5: 74, E5: 76, F5: 77, G5: 79, A5: 81, B5: 83, C6: 84, D6: 86, E6: 88, Fs5: 78, Fs4: 66 };
  const SONGS = [
    {
      name: "Nắng vui", bpm: 116,
      mel: [[N.C5,1],[N.E5,1],[N.G5,1],[N.E5,1],[N.F5,1],[N.A5,1],[N.G5,2],[N.E5,1],[N.G5,1],[N.C6,1],[N.G5,1],[N.A5,1],[N.G5,1],[N.E5,2],
            [N.D5,1],[N.F5,1],[N.A5,1],[N.F5,1],[N.G5,1],[N.E5,1],[N.C5,2],[N.D5,1],[N.E5,1],[N.F5,1],[N.D5,1],[N.C5,3],[0,1]],
      bass: [48, 53, 48, 53, 50, 48, 43, 48]
    },
    {
      name: "Nhảy nhót", bpm: 128,
      mel: [[N.G4,.5],[N.B4,.5],[N.D5,.5],[N.G5,.5],[N.E5,1],[N.D5,1],[N.C5,.5],[N.E5,.5],[N.G5,1],[N.E5,1],[0,1],
            [N.A4,.5],[N.C5,.5],[N.E5,.5],[N.A5,.5],[N.G5,1],[N.E5,1],[N.D5,.5],[N.E5,.5],[N.D5,.5],[N.B4,.5],[N.G4,2],
            [N.G4,.5],[N.B4,.5],[N.D5,.5],[N.G5,.5],[N.A5,1],[N.G5,1],[N.E5,.5],[N.G5,.5],[N.E5,1],[N.C5,1],[0,1],
            [N.D5,1],[N.E5,.5],[N.D5,.5],[N.B4,1],[N.A4,1],[N.G4,3],[0,1]],
      bass: [43, 43, 45, 43, 43, 48, 50, 43]
    },
    {
      name: "Bong bóng", bpm: 100,
      mel: [[N.F5,1],[N.A5,.5],[N.G5,.5],[N.F5,1],[N.C5,1],[N.D5,1],[N.F5,1],[N.C5,2],
            [N.A4,1],[N.C5,1],[N.F5,1],[N.E5,1],[N.D5,1],[N.E5,.5],[N.F5,.5],[N.G5,2],
            [N.A5,1],[N.G5,.5],[N.F5,.5],[N.G5,1],[N.D5,1],[N.F5,1],[N.E5,.5],[N.D5,.5],[N.C5,2],
            [N.D5,1],[N.E5,1],[N.G5,1],[N.E5,1],[N.F5,3],[0,1]],
      bass: [41, 46, 41, 48, 41, 46, 48, 41]
    }
  ];
  // Hai bài phong cách 8-bit (máy chơi game cổ điển)
  SONGS.push({
    name: "Phiêu lưu 8-bit", bpm: 140, chip: true,
    mel: [[N.E5,.5],[N.G5,.5],[N.C6,.5],[N.G5,.5],[N.E5,.5],[N.G5,.5],[N.C6,1],
          [N.D5,.5],[N.F5,.5],[N.A5,.5],[N.F5,.5],[N.B4,.5],[N.D5,.5],[N.G5,1],
          [N.E5,.5],[N.G5,.5],[N.C6,.5],[N.E6,.5],[N.D6,.5],[N.C6,.5],[N.A5,1],
          [N.G5,.5],[N.F5,.5],[N.E5,.5],[N.D5,.5],[N.C5,1.5],[0,.5],
          [N.A5,.5],[N.A5,.5],[N.G5,.5],[N.A5,.5],[N.C6,1],[N.A5,1],
          [N.G5,.5],[N.G5,.5],[N.E5,.5],[N.G5,.5],[N.D6,1],[N.B5,1],
          [N.C6,.5],[N.B5,.5],[N.A5,.5],[N.G5,.5],[N.F5,.5],[N.E5,.5],[N.D5,1],
          [N.E5,.5],[N.D5,.5],[N.B4,.5],[N.D5,.5],[N.C5,2]],
    bass: [48, 43, 45, 48, 41, 43, 45, 48]
  });
  SONGS.push({
    name: "Kẹo dẻo 8-bit", bpm: 152, chip: true,
    mel: [[N.G5,.5],[N.G5,.5],[0,.5],[N.G5,.5],[0,.5],[N.E5,.5],[N.G5,1],
          [N.A5,.5],[N.G5,.5],[N.E5,.5],[N.D5,.5],[N.E5,1],[0,1],
          [N.C5,.5],[N.E5,.5],[N.G5,.5],[N.C6,.5],[N.B5,.5],[N.A5,.5],[N.G5,1],
          [N.A5,.5],[N.B5,.5],[N.A5,.5],[N.Fs5,.5],[N.D5,2],
          [N.G4,.5],[N.B4,.5],[N.D5,.5],[N.G5,.5],[N.Fs5,.5],[N.G5,.5],[N.A5,1],
          [N.B5,.5],[N.A5,.5],[N.G5,.5],[N.E5,.5],[N.C5,1],[N.E5,1],
          [N.D5,.5],[N.D5,.5],[N.E5,.5],[N.Fs5,.5],[N.G5,.5],[N.A5,.5],[N.B5,1],
          [N.A5,.5],[N.Fs5,.5],[N.D5,.5],[N.Fs5,.5],[N.G5,2]],
    bass: [43, 48, 48, 50, 43, 48, 50, 43]
  });
  SONGS.forEach(s => { if (!s.ev) compile(s); });
  A.songs = SONGS.map(s => s.name);

  function init() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 1; master.connect(ctx.destination);
    musicGain = ctx.createGain(); musicGain.gain.value = 0; musicGain.connect(master);
    sfxGain = ctx.createGain(); sfxGain.gain.value = sfxVol; sfxGain.connect(master);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 1, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return ctx;
  }
  A.unlock = function () {
    init();
    if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
    if (musicOn && !playing) startMusic();
  };

  function tone(dest, freq, t, dur, type, vol, attack = 0.01, release = 0.12) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.setValueAtTime(vol, t + Math.max(attack, dur - release));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.02);
    return o;
  }
  function noise(dest, t, dur, vol, freq = 6000, q = 1, type = "highpass") {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(dest); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
  }

  let pulseWave = null;
  function pulse(dest, freq, t, dur, vol) {
    if (!pulseWave) { // sóng vuông độ rộng 25% như máy NES
      const n = 32, re = new Float32Array(n), im = new Float32Array(n);
      for (let k = 1; k < n; k++) im[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * 0.25);
      pulseWave = ctx.createPeriodicWave(re, im);
    }
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.setPeriodicWave(pulseWave); o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(vol, t); g.gain.setValueAtTime(vol, t + dur * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.02);
  }

  // ---------- Nhạc nền ----------
  // Chuyển giai điệu thành danh sách sự kiện theo phách
  function compile(song) {
    const ev = []; let beat = 0;
    for (const [n, len] of song.mel) { if (n) ev.push({ beat, n, len }); beat += len; }
    song.total = Math.ceil(beat / 4) * 4; song.ev = ev; return song;
  }
  SONGS.forEach(compile);
  let songStartTime = 0, loopCount = 0, evIdx = 0, beatGrid = 0;

  function schedule() {
    if (!ctx || !playing) return;
    const song = SONGS[songIdx];
    const spb = 60 / song.bpm;
    const ahead = ctx.currentTime + 0.35;
    while (true) {
      const loopStart = songStartTime + loopCount * song.total * spb;
      // giai điệu
      let scheduled = false;
      if (evIdx < song.ev.length) {
        const e = song.ev[evIdx];
        const t = loopStart + e.beat * spb;
        if (t < ahead) {
          const f = mtof(e.n), d = e.len * spb * 0.92;
          if (song.chip) {
            pulse(musicGain, f, t, Math.min(d, e.len * spb * 0.8), 0.07);
            pulse(musicGain, f * 1.004, t + 0.012, Math.min(d, e.len * spb * 0.8), 0.025); // độ dày kiểu 8-bit
          } else {
            tone(musicGain, f, t, d, "triangle", 0.22, 0.015, 0.1);
            tone(musicGain, f * 2, t, Math.min(d, 0.25), "sine", 0.04, 0.005, 0.08);
          }
          evIdx++; scheduled = true;
        }
      }
      // nhịp (bass + trống nhẹ) theo từng phách
      if (beatGrid < song.total) {
        const t = loopStart + beatGrid * spb;
        if (t < ahead) {
          const bar = Math.floor(beatGrid / 4) % song.bass.length;
          const root = song.bass[bar];
          const b = beatGrid % 4;
          if (song.chip) {
            const h = spb / 2;
            tone(musicGain, mtof(root), t, h * 0.9, "triangle", 0.3, 0.003, 0.03);
            tone(musicGain, mtof(root + 12), t + h, h * 0.9, "triangle", 0.3, 0.003, 0.03);
            if (b === 0 || b === 2) noise(musicGain, t, 0.07, 0.35, 180, 0.8, "lowpass");
            if (b === 1 || b === 3) noise(musicGain, t, 0.08, 0.16, 1800, 0.6, "bandpass");
            noise(musicGain, t + h, 0.025, 0.05, 8000);
            beatGrid++; scheduled = true;
            continue;
          }
          tone(musicGain, mtof(b % 2 ? root + 7 : root), t, spb * 0.8, "sine", 0.2, 0.01, 0.1);
          if (b === 0 || b === 2) { // kick nhẹ
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
            g.gain.setValueAtTime(0.35, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
            o.connect(g); g.connect(musicGain); o.start(t); o.stop(t + 0.16);
          }
          noise(musicGain, t + spb / 2, 0.04, 0.05, 7000);
          if (b === 1 || b === 3) noise(musicGain, t, 0.09, 0.06, 2500, 0.8, "bandpass");
          beatGrid++; scheduled = true;
        }
      }
      if (evIdx >= song.ev.length && beatGrid >= song.total) { loopCount++; evIdx = 0; beatGrid = 0; continue; }
      if (!scheduled) break;
    }
  }
  function applyMusicGain(ramp = 0.3) {
    if (!ctx) return;
    const v = musicOn && playing && !hold ? musicVol * 0.55 * duck : 0;
    musicGain.gain.cancelScheduledValues(ctx.currentTime);
    musicGain.gain.setTargetAtTime(v, ctx.currentTime, ramp / 3);
  }
  function startMusic() {
    if (!init() || playing) return;
    playing = true; loopCount = 0; evIdx = 0; beatGrid = 0;
    songStartTime = ctx.currentTime + 0.1;
    timer = setInterval(schedule, 60); schedule(); applyMusicGain(1);
  }
  function stopMusic() {
    playing = false; clearInterval(timer); timer = null; applyMusicGain(0.2);
  }
  A.setMusicOn = function (on) { musicOn = on; if (on) { if (ctx) startMusic(); } else stopMusic(); applyMusicGain(); };
  A.isMusicOn = () => musicOn;
  A.setMusicVol = v => { musicVol = v; applyMusicGain(); };
  A.setSfxVol = v => { sfxVol = v; if (sfxGain) sfxGain.gain.value = v; };
  A.setSong = i => { songIdx = ((i % SONGS.length) + SONGS.length) % SONGS.length; if (playing) { stopMusic(); setTimeout(startMusic, 250); } };
  A.duck = on => { duck = on ? 0.25 : 1; applyMusicGain(0.25); };
  A.pauseAll = () => { if (ctx && ctx.state === "running") ctx.suspend().catch(() => {}); };
  A.resumeAll = () => { if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {}); };
  // nhịp trống cho vè (chant)
  let beatTimer = null, beatNext = 0, beatN = 0, hold = false;
  A.hold = on => { hold = on; if (musicGain && ctx) { musicGain.gain.cancelScheduledValues(ctx.currentTime); musicGain.gain.setTargetAtTime(on ? 0 : (musicOn && playing ? musicVol * 0.55 * duck : 0), ctx.currentTime, 0.1); } };
  A.beatStart = function (bpm = 92) {
    if (!ready()) return; A.beatStop();
    const spb = 60 / bpm; beatNext = ctx.currentTime + 0.1; beatN = 0;
    beatTimer = setInterval(() => {
      while (beatNext < ctx.currentTime + 0.3) {
        const t = beatNext, b = beatN % 4;
        if (b === 0 || b === 2) { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(50, t + 0.12); g.gain.setValueAtTime(0.32, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16); o.connect(g); g.connect(sfxGain); o.start(t); o.stop(t + 0.18); }
        if (b === 1 || b === 3) { noise(sfxGain, t, 0.07, 0.16, 1500, 0.7, "bandpass"); noise(sfxGain, t + 0.012, 0.05, 0.1, 2500, 0.8, "bandpass"); }
        noise(sfxGain, t + spb / 2, 0.025, 0.035, 8000);
        beatNext += spb; beatN++;
      }
    }, 50);
  };
  A.beatStop = () => { clearInterval(beatTimer); beatTimer = null; };
  A.state = () => ({ ctx: ctx ? ctx.state : "none", playing, musicOn, songIdx });

  // ---------- Hiệu ứng ----------
  function ready() { init(); if (!ctx) return false; if (ctx.state === "suspended") ctx.resume().catch(() => {}); return true; }
  A.click = () => { if (!ready()) return; const t = ctx.currentTime; tone(sfxGain, 900, t, 0.06, "sine", 0.25, 0.003, 0.04); };
  A.correct = () => {
    if (!ready()) return; const t = ctx.currentTime;
    tone(sfxGain, mtof(N.E5 + 12), t, 0.14, "sine", 0.35, 0.005, 0.08);
    tone(sfxGain, mtof(N.A5 + 12), t + 0.1, 0.32, "sine", 0.35, 0.005, 0.2);
    tone(sfxGain, mtof(N.A5 + 24), t + 0.1, 0.25, "triangle", 0.08, 0.005, 0.2);
  };
  A.wrong = () => {
    if (!ready()) return; const t = ctx.currentTime;
    const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = "square"; o.frequency.setValueAtTime(260, t); o.frequency.exponentialRampToValueAtTime(140, t + 0.35);
    f.type = "lowpass"; f.frequency.value = 900;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
    o.connect(f); f.connect(g); g.connect(sfxGain); o.start(t); o.stop(t + 0.4);
  };
  A.pop = () => {
    if (!ready()) return; const t = ctx.currentTime;
    noise(sfxGain, t, 0.12, 0.6, 1200, 0.7, "bandpass");
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(600, t); o.frequency.exponentialRampToValueAtTime(1600, t + 0.06);
    g.gain.setValueAtTime(0.25, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    o.connect(g); g.connect(sfxGain); o.start(t); o.stop(t + 0.12);
  };
  A.flip = () => { if (!ready()) return; noise(sfxGain, ctx.currentTime, 0.08, 0.25, 3000, 1, "bandpass"); };
  A.star = (i = 0) => {
    if (!ready()) return; const t = ctx.currentTime;
    const base = [N.C6, N.E5 + 12, N.G5 + 12][i % 3];
    tone(sfxGain, mtof(base), t, 0.5, "sine", 0.3, 0.005, 0.4);
    tone(sfxGain, mtof(base + 12), t, 0.35, "triangle", 0.08, 0.005, 0.3);
  };
  A.fanfare = () => {
    if (!ready()) return; const t = ctx.currentTime;
    [N.C5, N.E5, N.G5, N.C6].forEach((n, i) => tone(sfxGain, mtof(n), t + i * 0.12, 0.2, "square", 0.08, 0.01, 0.1));
    [N.C5, N.E5, N.G5, N.C6].forEach(n => tone(sfxGain, mtof(n), t + 0.5, 0.9, "triangle", 0.12, 0.02, 0.6));
  };
  A.applause = (dur = 2.6) => {
    if (!ready()) return; const t0 = ctx.currentTime + 0.3;
    for (let i = 0; i < dur * 55; i++) {
      const t = t0 + Math.random() * dur;
      const fade = 1 - Math.max(0, (t - t0) / dur - 0.6) * 2.2;
      noise(sfxGain, t, 0.03 + Math.random() * 0.03, (0.12 + Math.random() * 0.18) * Math.max(0.05, fade), 1200 + Math.random() * 2500, 1.2, "bandpass");
    }
  };
  A.whoosh = () => { if (!ready()) return; noise(sfxGain, ctx.currentTime, 0.3, 0.2, 800, 0.5, "bandpass"); };

  window.SFX = A;
})();
