/* Giọng đọc (TTS) Việt/Anh + nhận diện giọng nói.
 * Trên Android dùng cầu nối window.Native (TextToSpeech + SpeechRecognizer của máy).
 * Trên trình duyệt dùng Web Speech API làm phương án dự phòng. */
(function () {
  const S = {};
  const NATIVE = typeof window.Native !== "undefined";
  S.native = NATIVE;
  let seq = 0;
  const pending = new Map();
  let rate = 1;            // hệ số tốc độ người dùng chọn (0.6 – 1.2)
  let speakingCount = 0;

  function setDuck() { if (window.SFX) SFX.duck(speakingCount > 0); }
  function finish(id) {
    const p = pending.get(id);
    if (!p) return;
    pending.delete(id); clearTimeout(p.to);
    speakingCount = Math.max(0, speakingCount - 1); setDuck();
    p.resolve();
  }
  window.__ttsDone = id => finish(Number(id));

  // ---------- Chọn giọng nữ ----------
  // Tên giọng nữ phổ biến của Google TTS / Samsung TTS
  const FEMALE_PREF = {
    en: ["en-us-x-tpf", "en-us-x-sfg", "en-us-x-iob", "en-us-x-iog", "en-us-x-tpc", "smtf", "female", "samantha", "zira", "aria", "jenny", "google us english", "karen", "moira", "tessa", "serena"],
    vi: ["vi-vn-x-gft", "vi-vn-x-vic", "vi-vn-x-vid", "vi-vn-language", "smtf", "female", "hoaimy", "hoai my", "linh", "google tiếng việt"]
  };
  const MALE_HINT = ["male", "smtm", "-x-iol", "-x-iom", "-x-tpd", "-x-vie", "-x-vif", "-x-gbd", "-x-gbg", "-x-rjs", "david", "mark", "guy", "namminh", "daniel", "fred"];
  function scoreVoice(name, lang) {
    const n = (name || "").toLowerCase();
    let s = 0;
    if (MALE_HINT.some(h => n.includes(h)) && !n.includes("female")) s -= 50;
    FEMALE_PREF[lang].forEach((h, i) => { if (n.includes(h)) s += 40 - i; });
    if (n.includes("local")) s += 3;      // giọng offline: đọc nhanh, không cần mạng
    if (n.includes("network")) s += 1;
    return s;
  }
  S.scoreVoice = scoreVoice;

  // ---------- Web fallback ----------
  let webVoices = [];
  function loadWebVoices() { if (window.speechSynthesis) webVoices = speechSynthesis.getVoices() || []; }
  if (!NATIVE && window.speechSynthesis) { loadWebVoices(); speechSynthesis.onvoiceschanged = loadWebVoices; }
  const chosen = { en: null, vi: null };

  S.listVoices = function (lang) {
    let arr = [];
    if (NATIVE) {
      try { arr = JSON.parse(Native.voices(lang) || "[]"); } catch (e) { arr = []; }
    } else {
      loadWebVoices();
      arr = webVoices.filter(v => (v.lang || "").toLowerCase().startsWith(lang)).map(v => ({ name: v.name, local: v.localService, lang: v.lang }));
    }
    if (lang === "en") { // chỉ dùng giọng Anh – Mỹ
      const us = arr.filter(v => /en[-_]us/i.test((v.locale || "") + " " + v.name + " " + (v.lang || "")));
      if (us.length) arr = us;
    }
    arr.sort((a, b) => scoreVoice(b.name, lang) - scoreVoice(a.name, lang));
    return arr;
  };
  S.bestVoice = lang => { const l = S.listVoices(lang); return l.length ? l[0].name : ""; };
  S.setVoice = function (lang, name) {
    chosen[lang] = name || null;
    if (NATIVE && name) try { Native.setVoice(lang, name); } catch (e) {}
  };
  S.getVoice = lang => chosen[lang];
  S.setRate = r => { rate = r; };
  S.langOk = function (lang) {
    if (NATIVE) { try { return Native.langStatus(lang) >= 0; } catch (e) { return false; } }
    loadWebVoices(); return webVoices.some(v => (v.lang || "").toLowerCase().startsWith(lang));
  };
  S.ttsReady = function () { if (NATIVE) { try { return Native.ttsReady() === "1"; } catch (e) { return false; } } return !!window.speechSynthesis; };
  S.openTtsSettings = () => { if (NATIVE) try { Native.openTtsSettings(); } catch (e) {} };

  // ---------- Giọng thu sẵn (chuẩn) ----------
  // window.CLIPS: { "en|text": "file" } – tạo bởi tools/gen_audio.py
  let useClips = true;
  let curAudio = null;
  S.missing = new Set();
  S.setUseClips = v => { useClips = !!v; };
  S.usingClips = () => useClips;
  S.hasClip = (text, lang) => !!(window.CLIPS && window.CLIPS[lang + "|" + String(text).trim()]);
  function playClip(file, id, opts) {
    const a = new Audio("audio/" + file + ".ogg");
    a.preservesPitch = true; a.mozPreservesPitch = true; a.webkitPreservesPitch = true;
    a.playbackRate = Math.max(0.5, Math.min(1.3, (opts.slow ? 0.72 : 1) * (0.55 + rate * 0.5)));
    curAudio = a;
    const end = () => { if (curAudio === a) curAudio = null; finish(id); };
    a.onended = end; a.onerror = end;
    const p = a.play(); if (p && p.catch) p.catch(end);
  }

  // ---------- Đọc ----------
  // lang: "en" | "vi"; opts.slow: đọc chậm; opts.flush: dừng câu đang đọc
  let viMuted = false;
  S.setViMuted = v => { viMuted = !!v; };
  S.say = function (text, lang = "en", opts = {}) {
    if (!text) return Promise.resolve();
    if (lang === "vi" && viMuted && !opts.force) return Promise.resolve();
    if (opts.flush !== false) S.stop();
    const id = ++seq;
    const clip = useClips && window.CLIPS ? window.CLIPS[lang + "|" + String(text).trim()] : null;
    if (!clip && window.CLIPS) S.missing.add(lang + "|" + text);
    if (clip) {
      return new Promise(resolve => {
        const to = setTimeout(() => finish(id), 2500 + String(text).length * 200);
        pending.set(id, { resolve, to });
        speakingCount++; setDuck();
        playClip(clip, id, opts);
      });
    }
    const base = lang === "en" ? 0.82 : 0.95;
    const r = Math.max(0.4, base * rate * (opts.slow ? 0.62 : 1));
    const pitch = lang === "en" ? 1.12 : 1.08;      // giọng nữ cao hơn một chút: vui tươi
    return new Promise(resolve => {
      const est = 1200 + text.length * (lang === "en" ? 85 : 75) / r;
      const to = setTimeout(() => finish(id), est + 2500);
      pending.set(id, { resolve, to });
      speakingCount++; setDuck();
      if (NATIVE) {
        try { Native.speak(String(text), lang, id, r, pitch); } catch (e) { finish(id); }
      } else if (window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang === "en" ? "en-US" : "vi-VN";
        u.rate = r; u.pitch = pitch;
        const name = chosen[lang] || S.bestVoice(lang);
        const v = webVoices.find(v => v.name === name);
        if (v) u.voice = v;
        u.onend = u.onerror = () => finish(id);
        try { speechSynthesis.speak(u); } catch (e) { finish(id); }
      } else {
        setTimeout(() => finish(id), 300);
      }
    });
  };
  S.stop = function () {
    if (curAudio) { try { curAudio.pause(); } catch (e) {} curAudio = null; }
    if (NATIVE) { try { Native.stop(); } catch (e) {} }
    else if (window.speechSynthesis) { try { speechSynthesis.cancel(); } catch (e) {} }
    [...pending.keys()].forEach(finish);
  };
  S.en = (t, o) => S.say(t, "en", o);
  S.vi = (t, o) => S.say(t, "vi", o);
  // Đọc nối tiếp nhiều đoạn: [[text, lang], ...]
  S.seq = async function (parts, token) {
    S.stop();
    for (const [t, l, o] of parts) {
      if (token && token.cancelled) return;
      await S.say(t, l, Object.assign({ flush: false }, o || {}));
    }
  };

  // ---------- Nhận diện giọng nói ----------
  let sttHandler = null;
  window.__stt = function (json) {
    let m = json;
    if (typeof json === "string") { try { m = JSON.parse(json); } catch (e) { return; } }
    if (sttHandler) sttHandler(m);
  };
  S.canListen = function () {
    if (NATIVE) { try { return !!Native.sttAvailable(); } catch (e) { return false; } }
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  };
  let webRec = null;
  S.listen = function (lang = "en", onEvent) {
    S.stop();
    return new Promise((resolve, reject) => {
      let done = false;
      const end = (fn, v) => { if (done) return; done = true; sttHandler = null; clearTimeout(guard); fn(v); };
      const guard = setTimeout(() => end(reject, { code: "timeout" }), 12000);
      sttHandler = m => {
        if (onEvent) onEvent(m);
        if (m.type === "result") { const l = m.list || []; l.conf = m.conf || []; end(resolve, l); }
        else if (m.type === "error") end(reject, m);
      };
      if (NATIVE) {
        try { Native.listen(lang === "en" ? "en-US" : "vi-VN"); } catch (e) { end(reject, { code: "bridge" }); }
      } else {
        const R = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!R) return end(reject, { code: "unsupported" });
        webRec = new R(); webRec.lang = lang === "en" ? "en-US" : "vi-VN"; webRec.maxAlternatives = 5; webRec.interimResults = false;
        webRec.onresult = e => { const l = [], c = []; for (const alt of e.results[0]) { l.push(alt.transcript); c.push(alt.confidence || 0); } window.__stt({ type: "result", list: l, conf: c }); };
        webRec.onerror = e => window.__stt({ type: "error", code: e.error });
        webRec.onend = () => setTimeout(() => window.__stt({ type: "error", code: "no-match" }), 300);
        try { webRec.start(); window.__stt({ type: "ready" }); } catch (e) { end(reject, { code: "start" }); }
      }
    });
  };
  S.stopListen = function () {
    if (NATIVE) { try { Native.stopListen(); } catch (e) {} }
    else if (webRec) { try { webRec.abort(); } catch (e) {} }
  };

  // ---------- So khớp câu trả lời ----------
  const NUMW = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
  function norm(s) {
    return String(s).toLowerCase()
      .replace(/\b(\d{1,2})\b/g, (m, d) => (Number(d) <= 20 ? NUMW[Number(d)] : m))
      .replace(/t-shirt/g, "t shirt").replace(/tshirt/g, "t shirt")
      .replace(/[’']/g, "").replace(/[^a-z\s]/g, " ").replace(/\s+/g, " ").trim();
  }
  function lev(a, b) {
    const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  S.norm = norm;
  // Trả về điểm 0..1 (1 = khớp hoàn toàn)
  S.matchScore = function (target, alts) {
    const t = norm(target); if (!t) return 0;
    const tw = t.split(" ");
    let best = 0;
    for (const a0 of alts || []) {
      const a = norm(a0); if (!a) continue;
      if (a === t || (" " + a + " ").includes(" " + t + " ")) return 1;
      const sim = 1 - lev(a, t) / Math.max(a.length, t.length);
      const aw = a.split(" ");
      let hit = 0;
      tw.forEach(w => { if (aw.some(x => x === w || (w.length > 3 && 1 - lev(x, w) / Math.max(x.length, w.length) >= 0.75))) hit++; });
      best = Math.max(best, sim, hit / tw.length);
    }
    return best;
  };
  // ---------- Chấm điểm phát âm (0–100) ----------
  // So từng từ của câu mẫu với các kết quả máy nghe được; kết hợp độ tin cậy của máy.
  S.pronScore = function (target, alts) {
    const shown = String(target).replace(/[.?!,]+$/g, "").split(/\s+/);
    const tw = shown.map(w => norm(w)).map(w => w.replace(/\s+/g, " "));
    alts = alts || []; const conf = alts.conf || [];
    let best = { s: -1, words: tw.map(() => 0), heard: alts[0] || "", idx: 0 };
    alts.forEach((a0, ai) => {
      const aw = norm(a0).split(" ").filter(Boolean);
      const used = new Set();
      const ws = tw.map(w => {
        if (!w) return 1;
        const parts = w.split(" ");          // ví dụ "t shirt"
        let b = 0, bj = -1;
        aw.forEach((x, j) => {
          if (used.has(j)) return;
          const cand = parts.length > 1 ? aw.slice(j, j + parts.length).join(" ") : x;
          const sim = cand === w ? 1 : 1 - lev(cand, w) / Math.max(cand.length, w.length);
          if (sim > b) { b = sim; bj = j; }
        });
        if (bj >= 0 && b >= 0.5) { for (let q = 0; q < parts.length; q++) used.add(bj + q); }
        return b >= 0.999 ? 1 : b >= 0.75 ? 0.8 : b >= 0.5 ? 0.4 : 0;
      });
      const extra = Math.max(0, aw.length - used.size);            // nói thừa từ
      let s = ws.reduce((x, y) => x + y, 0) / ws.length - Math.min(0.15, extra * 0.05);
      if (ai > 0) s -= 0.05;                                         // kết quả phụ: trừ nhẹ
      if (s > best.s) best = { s, words: ws, heard: a0, idx: ai };
    });
    let c = conf[best.idx];
    if (!(c > 0 && c <= 1)) c = best.idx === 0 ? 0.85 : 0.7;         // máy không trả độ tin cậy
    const raw = Math.max(0, best.s) * (0.8 + 0.2 * c);
    const score = Math.max(0, Math.min(100, Math.round(raw * 100)));
    return { score, heard: best.heard, words: shown.map((w, k) => ({ w, ok: best.words[k] >= 0.8, part: best.words[k] > 0 && best.words[k] < 0.8 })) };
  };
  S.isMatch = (target, alts) => S.matchScore(target, alts) >= (norm(target).includes(" ") ? 0.7 : 0.75);

  // Tên chữ cái để TTS đọc đúng
  S.letterName = L => ({ A: "ay", B: "bee", C: "see", D: "dee", E: "ee", F: "ef", G: "jee", H: "aitch", I: "eye", J: "jay", K: "kay", L: "el", M: "em", N: "en", O: "oh", P: "pee", Q: "cue", R: "are", S: "ess", T: "tee", U: "you", V: "vee", W: "double you", X: "ex", Y: "why", Z: "zed" }[L.toUpperCase()] || L);

  window.Speech = S;
})();
