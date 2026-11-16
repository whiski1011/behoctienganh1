/* Khung ứng dụng: lưu tiến độ, điều hướng, giao diện, cài đặt, kết quả */
(function () {
  const C = window.CONTENT;
  const $ = s => document.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const sample = (a, n) => shuffle(a).slice(0, n);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const VERSION = "1.5.1";

  // ---------- Dữ liệu lưu trữ ----------
  const KEY = "bhta1_state";
  const DEF = { name: "", avatar: "🐻", theme: "ocean", musicOn: true, musicVol: 35, sfxVol: 80, song: 0, voiceEn: "", voiceVi: "", rate: 90, readVi: true, englishOnly: false, repGoal: 15, rep: {}, repDone: {}, voiceMode: "clip", autoBackup: "daily", lastBackup: 0, lastBackupWhere: "", stars: {}, best: {}, plays: 0 };
  let st = Object.assign({}, DEF);
  try { const raw = localStorage.getItem(KEY); if (raw) st = Object.assign({}, DEF, JSON.parse(raw)); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };

  const THEMES = [
    { id: "ocean", name: "Đại dương", icon: "🐳", deco: ["🐠", "🫧", "🐚", "🐬", "⭐", "🌊"], g: "linear-gradient(135deg,#81d4fa,#0288d1)" },
    { id: "dino", name: "Khủng long", icon: "🦖", deco: ["🦕", "🌴", "🦖", "🥚", "🌿", "🌋"], g: "linear-gradient(135deg,#c5e1a5,#2e7d32)" },
    { id: "princess", name: "Công chúa", icon: "👑", deco: ["👑", "🦄", "🌸", "💖", "✨", "🏰"], g: "linear-gradient(135deg,#f8bbd0,#ab47bc)" },
    { id: "space", name: "Vũ trụ", icon: "🚀", deco: ["🚀", "🪐", "⭐", "🌙", "☄️", "👽"], g: "linear-gradient(135deg,#283593,#0b0f2e)" },
    { id: "candy", name: "Kẹo ngọt", icon: "🍭", deco: ["🍭", "🍬", "🧁", "🍩", "🍓", "🎀"], g: "linear-gradient(135deg,#fff59d,#f48fb1)" },
    { id: "hero", name: "Anh hùng nhí", icon: "🦸", deco: ["⚡", "🦸", "🛡️", "💥", "⭐", "🚓"], g: "linear-gradient(135deg,#ffcc80,#d32f2f)" }
  ];
  const AVATARS = ["🐻", "🐰", "🐱", "🐶", "🦊", "🐼", "🐯", "🦁", "🐸", "🐵", "🦄", "🐧", "🐨", "🐥", "🦖", "🐙"];
  const STICKERS = ["🌟", "🍀", "🦋", "🐞", "🌈", "🍉", "🎈", "🦄", "🐳", "🚀", "🏆", "🎨", "🧸", "🦁", "🐼", "🍩", "🎸", "⚽", "🌻", "🐬", "🦖", "👑", "🍦", "🎁", "🐝", "🌙", "🍓", "🚂", "🐧", "🎠", "🪁", "🦜", "🐢", "🌵", "🍄", "🎡", "🦒", "🐙", "🧁", "💎"];

  const ACTS = {
    learn: { name: "Học từ mới", icon: "📖", sk: ["nghe", "doc"] },
    chant: { name: "Vè có nhịp", icon: "🎵", sk: ["nghe", "noi"] },
    talk: { name: "Hội thoại với Bon", icon: "👫", sk: ["noi", "nghe"] },
    tale: { name: "Truyện ngắn", icon: "📕", sk: ["nghe", "doc"] },
    listen: { name: "Nghe & chọn hình", icon: "👂", sk: ["nghe"] },
    balloon: { name: "Bắn bóng bay", icon: "🎈", sk: ["nghe"] },
    readpic: { name: "Đọc & chọn hình", icon: "👀", sk: ["doc"] },
    memory: { name: "Lật thẻ trí nhớ", icon: "🃏", sk: ["doc"] },
    spell: { name: "Ghép chữ", icon: "🔤", sk: ["viet"] },
    missing: { name: "Điền chữ còn thiếu", icon: "✏️", sk: ["viet"] },
    speak: { name: "Bé tập nói", icon: "🎤", sk: ["noi"] },
    pron: { name: "Kiểm tra phát âm", icon: "🎯", sk: ["noi", "nghe"] },
    sentences: { name: "Học mẫu câu", icon: "💬", sk: ["nghe", "noi"] },
    sentListen: { name: "Nghe câu, chọn hình", icon: "🎧", sk: ["nghe"] },
    builder: { name: "Xếp từ thành câu", icon: "🧩", sk: ["viet", "doc"] },
    abcLearn: { name: "Học chữ cái", icon: "🔤", sk: ["nghe", "doc"] },
    abcListen: { name: "Nghe & chọn chữ", icon: "👂", sk: ["nghe"] },
    abcBalloon: { name: "Bóng bay chữ cái", icon: "🎈", sk: ["nghe", "doc"] },
    abcMatch: { name: "Ghép chữ hoa – thường", icon: "🃏", sk: ["doc"] },
    trace: { name: "Tô chữ cái", icon: "✍️", sk: ["viet"] },
    abcSound: { name: "Chữ cái đầu tiên", icon: "🍎", sk: ["nghe", "doc"] },
    story: { name: "Đọc truyện", icon: "📚", sk: ["doc", "nghe"] }
  };
  const SKN = { nghe: "👂 Nghe", noi: "🗣️ Nói", doc: "👀 Đọc", viet: "✍️ Viết" };
  const SKC = { nghe: "sk-nghe", noi: "sk-noi", doc: "sk-doc", viet: "sk-viet" };

  function unitActs(u) {
    if (u.type === "abc") return ["abcLearn", "chant", "abcListen", "abcSound", "abcBalloon", "abcMatch", "trace"];
    if (u.type === "story") return C.stories.map((_, i) => "story:" + i);
    return ["learn", "chant", "talk", "tale", "listen", "balloon", "readpic", "memory", "spell", "missing", "speak", "pron", "sentences", "sentListen", "builder"];
  }
  const actInfo = a => a.startsWith("story:") ? Object.assign({}, ACTS.story, { name: C.stories[+a.split(":")[1]].title, icon: C.stories[+a.split(":")[1]].icon, vi: C.stories[+a.split(":")[1]].vi }) : ACTS[a];
  const unitById = id => C.units.find(u => u.id === id);
  const starKey = (u, a) => u + "|" + a;
  const totalStars = () => Object.values(st.stars).reduce((a, b) => a + b, 0);
  const unitStars = u => unitActs(u).reduce((s, a) => s + (st.stars[starKey(u.id, a)] || 0), 0);
  const stickersUnlocked = () => Math.min(STICKERS.length, Math.floor(totalStars() / 3));

  // ---------- Hình minh họa ----------
  function pic(code, extra = "") {
    if (!code) return "";
    if (code.startsWith("c:")) return `<div class="pic swatch ${extra}" style="background:${code.slice(2)}"></div>`;
    if (code.startsWith("t:")) return `<div class="pic txt ${extra}">${esc(code.slice(2))}</div>`;
    return `<div class="pic emoji ${extra}">${code}</div>`;
  }

  // ---------- Giao diện chung ----------
  function applyTheme() {
    document.body.dataset.theme = st.theme;
    const th = THEMES.find(t => t.id === st.theme) || THEMES[0];
    const d = $("#decor"); d.innerHTML = "";
    for (let i = 0; i < 14; i++) {
      const s = el("span", null, th.deco[i % th.deco.length]);
      s.style.left = (Math.random() * 92) + "%"; s.style.top = (Math.random() * 92) + "%";
      s.style.animationDelay = (-Math.random() * 9) + "s"; s.style.fontSize = (24 + Math.random() * 26) + "px";
      d.appendChild(s);
    }
  }
  function toast(msg, ms = 2200) {
    const t = $("#toast"); t.textContent = msg; t.classList.remove("hidden");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.add("hidden"), ms);
  }
  function updateStars() { $("#starCount").textContent = totalStars(); }
  function setTitle(t, sub = "") { $("#pageTitle").textContent = t; $("#pageSub").textContent = sub; }
  const kidName = () => (st.name || "").trim();

  // ---------- Điều hướng ----------
  const stack = [];
  let curScreen = "home";
  function show(name, push = true) {
    if (push && curScreen !== name) stack.push(curScreen);
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    $("#scr-" + name).classList.add("active");
    $("#scr-" + name).scrollTop = 0;
    curScreen = name;
    $("#btnBack").classList.toggle("hidden", name === "home");
  }
  function back() {
    if (!$("#settings").classList.contains("hidden")) { closeSettings(); return true; }
    if (!$("#result").classList.contains("hidden")) { $("#result").classList.add("hidden"); leaveToUnit(); return true; }
    if (curScreen === "home") return false;
    if (curScreen === "game") stopGame();
    if (curScreen === "rep") stopRep();
    const prev = stack.pop() || "home";
    if (prev === "home") renderHome();
    if (prev === "units") openLevel(curLevel, false);
    if (prev === "unit") openUnit(curUnit.id, false);
    if (prev === "game") { openUnit(curUnit.id, false); return true; }
    show(prev, false);
    return true;
  }
  window.appBack = () => (back() ? "1" : "0");

  // ---------- Trang chủ ----------
  let curLevel = 1, curUnit = null;
  // ---------- Chuỗi ngày học & mục tiêu hằng ngày ----------
  const DAILY_GOAL = 3;
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const todayCount = () => (st.days || {})[dayKey()] || 0;
  function streak() {
    const days = st.days || {}; let n = 0; const d = new Date();
    if (!days[dayKey(d)]) d.setDate(d.getDate() - 1);
    while (days[dayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function logLesson() {
    st.days = st.days || {}; const k = dayKey(); st.days[k] = (st.days[k] || 0) + 1;
    const keys = Object.keys(st.days); if (keys.length > 60) keys.slice(0, keys.length - 60).forEach(x => delete st.days[x]);
  }
  // bài nên học tiếp: hoạt động chưa có sao đầu tiên của chủ đề vừa học, rồi đến chủ đề kế tiếp
  function nextLesson() {
    const order = C.units;
    let start = st.lastUnit ? order.findIndex(u => u.id === st.lastUnit) : 0; if (start < 0) start = 0;
    for (let k = 0; k < order.length; k++) {
      const u = order[(start + k) % order.length];
      const a = unitActs(u).find(x => !st.stars[starKey(u.id, x)]);
      if (a) return { u, a };
    }
    return { u: order[start], a: unitActs(order[start])[0] };
  }

  // vẽ đường nối các nút trên bản đồ (kiểu đường đi trong game)
  function drawPath(svg, list) {
    const nodes = [...list.querySelectorAll(".node-btn")];
    const box = list.getBoundingClientRect();
    if (!nodes.length || !box.width) { svg.innerHTML = ""; return; }
    const pts = nodes.map(n => { const r = n.getBoundingClientRect(); return [r.left - box.left + r.width / 2, r.top - box.top + r.height / 2]; });
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], my = (y0 + y1) / 2;
      d += ` C${x0},${my} ${x1},${my} ${x1},${y1}`;
    }
    svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
    svg.style.width = box.width + "px"; svg.style.height = box.height + "px";
    svg.innerHTML = `<path d="${d}" class="ml-shadow"/><path d="${d}" class="ml-main"/>`;
  }
  const ZIG = [0, 70, 100, 70, 0, -70, -100, -70];
  function nodeHtml(icon, pct, cls, label, sub, badge) {
    return `<div class="node-btn ${cls}" style="--p:${pct}"><div class="nb-ring"><div class="nb-face">${icon}</div></div>${badge || ""}</div>
      <div class="node-label"><b>${label}</b>${sub ? `<span>${sub}</span>` : ""}</div>`;
  }

  function renderHome() {
    setTitle("Bé Học Tiếng Anh", "Nghe · Nói · Đọc · Viết");
    $("#kidName").value = st.name;
    $("#avatar").textContent = st.avatar;
    const n = kidName();
    const sk = streak(), tc = todayCount();
    $("#mascotSay").textContent = tc >= DAILY_GOAL ? `Giỏi quá${n ? " " + n : ""}! Hôm nay con đã đạt mục tiêu rồi! 🎉`
      : sk >= 2 ? `Hello ${n || "bé"}! Con đã học ${sk} ngày liền rồi đấy, cố lên! 🔥`
      : n ? `Hello ${n}! Hôm nay mình học gì nào?` : "Hello! Chào mừng bé đến với lớp học tiếng Anh!";
    $("#mascot").innerHTML = Art.panda(tc >= DAILY_GOAL ? "cheer" : "wave");
    $("#streakNum").textContent = sk;
    const rm = repToday();
    $("#repRing").style.setProperty("--p", Math.min(1, rm / (repGoalMin() * 60)));
    $("#repSub").textContent = rm >= repGoalMin() * 60 ? `✅ Hôm nay đã nghe đủ ${repGoalMin()} phút!` : `Hôm nay: ${Math.floor(rm / 60)}/${repGoalMin()} phút · vè, truyện, hội thoại`;
    $("#repTitle").textContent = `Tắm tiếng Anh ${repGoalMin()} phút`;
    $("#homeStars").textContent = totalStars();
    $("#goalTxt").textContent = `${Math.min(tc, DAILY_GOAL)}/${DAILY_GOAL}`;
    $("#goalRing").style.setProperty("--p", Math.min(1, tc / DAILY_GOAL));
    $("#goalRing").classList.toggle("done", tc >= DAILY_GOAL);
    const nx = nextLesson(), info = actInfo(nx.a);
    $("#ccIcon").textContent = nx.u.icon;
    $("#ccTitle").textContent = nx.u.title;
    $("#ccSub").textContent = `${info.icon} ${info.name}`;
    const L = $("#levelList"); L.innerHTML = "";
    const WORLD = { 1: ["🌳", "🐰", "🌼"], 2: ["🌈", "🦒", "🎈"], 3: ["🪐", "🚀", "⭐"] };
    C.levels.forEach(lv => {
      const units = C.units.filter(u => u.level === lv.id);
      const max = units.reduce((s, u) => s + unitActs(u).length * 3, 0);
      const got = units.reduce((s, u) => s + unitStars(u), 0);
      const b = el("button", `level-card world w${lv.id}`);
      b.innerHTML = `<div class="w-scene">${Art.scene(lv.id)}<span class="w2">${lv.icon}</span></div>
        <div class="w-info"><span class="lv-badge">${lv.en}</span><h3>${lv.name}</h3><p>${lv.desc}</p>
        <div class="w-meta">${units.length} chủ đề · ⭐ ${got}/${max}</div>
        <div class="lv-prog"><i style="width:${Math.max(3, Math.round(got / max * 100))}%"></i></div></div>
        <div class="w-go">▶</div>`;
      b.onclick = () => { SFX.click(); openLevel(lv.id); };
      L.appendChild(b);
    });
    updateStars();
  }
  function openLevel(id, push = true) {
    curLevel = id;
    const lv = C.levels.find(l => l.id === id);
    setTitle(`${lv.icon} ${lv.name}`, `Cấp độ ${lv.id} · ${lv.en}`);
    const units = C.units.filter(u => u.level === id);
    const got = units.reduce((s, u) => s + unitStars(u), 0), max = units.reduce((s, u) => s + unitActs(u).length * 3, 0);
    $("#worldBanner").className = `world-banner w${id}`;
    $("#worldBanner").innerHTML = `<div class="wb-bg">${Art.scene(id)}</div><div class="wb-icon">${lv.icon}</div><div><h2>${lv.name}</h2><p>${lv.desc}</p><div class="lv-prog"><i style="width:${Math.max(3, Math.round(got / max * 100))}%"></i></div></div>`;
    const g = $("#unitList"); g.innerHTML = "";
    const nx = nextLesson();
    units.forEach((u, i) => {
      const acts = unitActs(u), max = acts.length * 3, got = unitStars(u);
      const done = acts.every(a => st.stars[starKey(u.id, a)]);
      const cur = nx.u.id === u.id;
      const cls = done ? "gold" : cur ? "current" : got ? "started" : "";
      const w = el("div", "map-node");
      w.style.setProperty("--x", ZIG[i % ZIG.length] + "px");
      w.innerHTML = nodeHtml(u.icon, got / max, cls, esc(u.title), `⭐ ${got}/${max}`, done ? `<span class="nb-crown">👑</span>` : cur ? `<span class="nb-tip">HỌC TIẾP</span>` : "");
      w.insertAdjacentHTML("beforeend", `<div class="deco-wrap ${ZIG[i % ZIG.length] >= 0 ? "left" : "right"}">${Art.deco(id, i)}</div>`);
      const btn = el("button", "unit-card node-hit"); btn.setAttribute("aria-label", u.title);
      btn.onclick = () => { SFX.click(); openUnit(u.id); };
      w.appendChild(btn);
      g.appendChild(w);
    });
    show("units", push);
    requestAnimationFrame(() => drawPath($("#unitLine"), g));
  }
  function openUnit(id, push = true) {
    const u = unitById(id); curUnit = u; curLevel = u.level;
    setTitle(`${u.icon} ${u.title}`, u.en);
    const acts = unitActs(u);
    $("#unitHero").innerHTML = `<div class="uh-icon">${u.icon}</div><div style="flex:1"><h2>${esc(u.title)}</h2><p>${esc(u.en)} · ⭐ ${unitStars(u)}/${acts.length * 3}</p>
      <div class="lv-prog"><i style="width:${Math.max(3, Math.round(unitStars(u) / (acts.length * 3) * 100))}%"></i></div></div><div class="uh-panda">${Art.panda(unitStars(u) ? "happy" : "wave")}</div>`;
    const L = $("#actList"); L.innerHTML = "";
    const firstOpen = acts.findIndex(a => !st.stars[starKey(u.id, a)]);
    acts.forEach((a, i) => {
      const info = actInfo(a), s = st.stars[starKey(u.id, a)] || 0;
      const cls = `n-${info.sk[0]}` + (s === 3 ? " gold" : s ? " started" : i === firstOpen ? " current" : "");
      const w = el("div", "map-node");
      w.style.setProperty("--x", ZIG[i % ZIG.length] + "px");
      const starRow = `<span class="nb-stars">${[0, 1, 2].map(k => `<i class="${k < s ? "on" : ""}">★</i>`).join("")}</span>`;
      w.innerHTML = nodeHtml(info.icon, s / 3, cls, `${i + 1}. ${esc(info.name)}`, info.sk.map(k => SKN[k]).join(" · "),
        starRow + (i === firstOpen ? `<span class="nb-tip">BẮT ĐẦU</span>` : ""));
      if (i % 2 === 1) w.insertAdjacentHTML("beforeend", `<div class="deco-wrap ${ZIG[i % ZIG.length] >= 0 ? "left" : "right"}">${Art.deco(u.level, i)}</div>`);
      const btn = el("button", "act-card node-hit"); btn.setAttribute("aria-label", info.name);
      btn.onclick = () => { SFX.click(); startGame(u.id, a); };
      w.appendChild(btn);
      L.appendChild(w);
    });
    show("unit", push);
    requestAnimationFrame(() => drawPath($("#actLine"), L));
  }

  // ---------- Trò chơi ----------
  let game = null;
  function stopGame() {
    if (!game) return;
    game.token.cancelled = true;
    game.timers.forEach(t => { clearTimeout(t); clearInterval(t); });
    try { game.cleanup && game.cleanup(); } catch (e) {}
    Speech.stop(); Speech.stopListen();
    game = null;
  }
  function startGame(unitId, act, opts = {}) {
    stopGame();
    const u = unitById(unitId); curUnit = u;
    const info = actInfo(act);
    const stage = $("#stage"); stage.innerHTML = "";
    $("#progBar").style.width = "0%"; $("#scoreNow").textContent = "0";
    setTitle(`${info.icon} ${info.name}`, `${u.title} · ${u.en}`);
    const token = { cancelled: false };
    const g = game = { unit: u, act, token, timers: [], score: 0, opts };
    combo = 0; $("#gMascot").innerHTML = Art.panda("happy"); $("#fb").classList.add("hidden");
    const ctx = {
      unit: u, level: u.level, stage, token, words: u.words || [], sentences: u.sentences || [],
      shuffle, sample, pick, pic, esc, el,
      alive: () => !token.cancelled,
      timer(fn, ms) { const t = setTimeout(() => { if (!token.cancelled) fn(); }, ms); g.timers.push(t); return t; },
      interval(fn, ms) { const t = setInterval(() => { if (!token.cancelled) fn(); }, ms); g.timers.push(t); return t; },
      wait(ms) { return new Promise(r => ctx.timer(r, ms)); },
      progress(i, n) { $("#progBar").style.width = Math.round(i / n * 100) + "%"; },
      addScore(p, at) {
        g.score += p; $("#scoreNow").textContent = g.score;
        if (at && p > 0) {
          const r = at.getBoundingClientRect(), f = el("div", "floating-plus", "+" + p);
          f.style.left = (r.left + r.width / 2 - 20) + "px"; f.style.top = (r.top + 10) + "px";
          document.body.appendChild(f); setTimeout(() => f.remove(), 1000);
        }
      },
      good(node, p = 10) { react(true); SFX.correct(); if (node) { node.classList.remove("wrong"); node.classList.add("right"); } ctx.addScore(p, node); },
      bad(node) { react(false); SFX.wrong(); if (node) { node.classList.remove("wrong"); void node.offsetWidth; node.classList.add("wrong"); ctx.timer(() => node.classList.remove("wrong"), 450); } },
      praise() { const p = pick(["Great!", "Good job!", "Well done!", "Excellent!", "Super!", "Wonderful!", "Yes!"]); return Speech.en(p); },
      encourage() { return Speech.vi(pick(["Chưa đúng rồi, con thử lại nhé!", "Gần đúng rồi, cố lên nào!", "Thử lại lần nữa nhé!"])); },
      finish(correct, total, extra) { finishGame(correct, total, extra); },
      onCleanup(fn) { g.cleanup = fn; }
    };
    show("game", curScreen !== "game");
    const fn = act.startsWith("story:") ? window.GAMES.story : window.GAMES[act];
    try { fn(ctx, act.startsWith("story:") ? +act.split(":")[1] : undefined); }
    catch (e) { console.error(e); toast("Có lỗi khi mở trò chơi"); }
  }

  // phản hồi tức thì: linh vật đổi nét mặt, dải thông báo, chuỗi trả lời đúng
  let combo = 0;
  function react(ok) {
    const m = $("#gMascot"), fb = $("#fb");
    combo = ok ? combo + 1 : 0;
    m.innerHTML = Art.panda(ok ? (combo >= 3 ? "wow" : "cheer") : "think");
    m.classList.remove("jump", "shake2"); void m.offsetWidth; m.classList.add(ok ? "jump" : "shake2");
    fb.className = "fb " + (ok ? "ok" : "no");
    fb.innerHTML = ok ? (combo >= 3 ? `🔥 ${combo} câu đúng liền! Siêu quá!` : pick(["Đúng rồi! 🎉", "Giỏi lắm! ⭐", "Chính xác! 👏", "Tuyệt vời! 🌟"])) : pick(["Thử lại nhé! 💪", "Gần đúng rồi! 🍀", "Cố lên nào! 🌈"]);
    clearTimeout(react._t); react._t = setTimeout(() => { fb.classList.add("hidden"); m.innerHTML = Art.panda("happy"); }, 1100);
  }

  // ---------- Kết quả ----------
  function finishGame(correct, total, extra = {}) {
    if (!game) return;
    const g = game;
    const ratio = total ? correct / total : 1;
    const stars = extra.stars != null ? extra.stars : ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : 1;
    const key = starKey(g.unit.id, g.act);
    const before = stickersUnlocked();
    const prev = st.stars[key] || 0;
    if (!g.opts.challenge || stars > prev) st.stars[key] = Math.max(prev, stars);
    st.best[key] = Math.max(st.best[key] || 0, g.score);
    st.plays++; st.lastUnit = g.unit.id; logLesson(); if (extra.pron != null) { st.pron = st.pron || {}; st.pron[g.unit.id] = Math.max(st.pron[g.unit.id] || 0, extra.pron); } save(); updateStars();
    setTimeout(() => autoBackup("lesson"), 1500);
    const after = stickersUnlocked();
    $("#progBar").style.width = "100%";

    const n = kidName();
    const titles = stars === 3 ? ["Xuất sắc!", "Tuyệt vời!", "Giỏi quá!"] : stars === 2 ? ["Làm tốt lắm!", "Giỏi lắm!"] : ["Cố gắng lên nhé!", "Hoàn thành rồi!"];
    const title = pick(titles);
    $("#resTitle").textContent = title + (n ? " " + n : "");
    $("#resMascot").innerHTML = Art.panda(stars === 3 ? "cheer" : stars === 2 ? "wow" : "happy") + `<span class="res-badge">${stars === 3 ? "🏆" : stars === 2 ? "🎉" : "💪"}</span>`;
    $("#resStars").innerHTML = [0, 1, 2].map(i => `<span class="${i < stars ? "" : "off"}" style="animation-delay:${0.3 + i * 0.35}s">⭐</span>`).join("");
    $("#resScore").textContent = g.score;
    $("#resDetail").textContent = total ? `Đúng ngay lần đầu: ${correct}/${total} câu` : (extra.detail || "");
    const rs = $("#resSticker");
    if (after > before) { rs.classList.remove("hidden"); rs.innerHTML = `🎁 Nhận sticker mới: <span style="font-size:34px">${STICKERS[after - 1]}</span>`; }
    else rs.classList.add("hidden");
    const tc = todayCount();
    $("#resGoal").innerHTML = tc >= DAILY_GOAL
      ? `🎯 Đã đạt mục tiêu hôm nay! · 🔥 ${streak()} ngày liên tiếp`
      : `🎯 Mục tiêu hôm nay: <b>${tc}/${DAILY_GOAL}</b> bài · 🔥 ${streak()} ngày`;
    $("#result").classList.remove("hidden");
    // âm thanh chúc mừng
    SFX.fanfare();
    [0, 1, 2].forEach(i => { if (i < stars) setTimeout(() => SFX.star(i), 650 + i * 350); });
    if (stars >= 2) SFX.applause(stars === 3 ? 3 : 2);
    confetti(stars === 3 ? 160 : stars === 2 ? 90 : 40);
    const msg = stars === 3 ? "Con được ba sao!" : stars === 2 ? "Con được hai sao!" : "Con đã hoàn thành bài! Mình luyện thêm nhé!";
    setTimeout(() => { if (!$("#result").classList.contains("hidden")) Speech.seq([[title, "vi"], [msg, "vi"]]); }, 900);
  }
  function leaveToUnit() {
    stopGame();
    if (stack[stack.length - 1] === "unit") stack.pop();
    openUnit(curUnit.id, false);
  }
  function nextActivity() {
    $("#result").classList.add("hidden");
    if (!game) return;
    const u = game.unit, acts = unitActs(u), i = acts.indexOf(game.act), challenge = game.opts.challenge;
    if (!challenge && i >= 0 && i < acts.length - 1) startGame(u.id, acts[i + 1]);
    else leaveToUnit();
  }

  // ---------- Pháo giấy ----------
  function confetti(count) {
    const cv = $("#confetti"), c = cv.getContext("2d");
    cv.width = innerWidth; cv.height = innerHeight;
    const colors = ["#ff5252", "#ffd740", "#69f0ae", "#40c4ff", "#e040fb", "#ff6e40"];
    const P = Array.from({ length: count }, () => ({
      x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * 0.5, vx: (Math.random() - 0.5) * 4, vy: 2 + Math.random() * 4,
      s: 6 + Math.random() * 8, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, col: pick(colors)
    }));
    const t0 = performance.now();
    (function frame(t) {
      c.clearRect(0, 0, cv.width, cv.height);
      P.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.r += p.vr; c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.fillStyle = p.col; c.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); c.restore(); });
      if (t - t0 < 3200) requestAnimationFrame(frame); else c.clearRect(0, 0, cv.width, cv.height);
    })(t0);
  }

  // ---------- NGHE MỖI NGÀY (kiểu REP của GrapeSEED) ----------
  const repGoalMin = () => [5, 10, 15].includes(st.repGoal) ? st.repGoal : 15;
  const REP_WORD = { 5: "năm", 10: "mười", 15: "mười lăm" };
  const repToday = () => (st.rep || {})[dayKey()] || 0;
  function buildPlaylist() {
    const GS = window.GS || {};
    let units = C.units.filter(u => !u.type && unitActs(u).some(a => st.stars[starKey(u.id, a)]));
    if (st.lastUnit && !units.find(u => u.id === st.lastUnit) && unitById(st.lastUnit) && !unitById(st.lastUnit).type) units.unshift(unitById(st.lastUnit));
    if (!units.length) units = C.units.filter(u => !u.type && u.level === 1).slice(0, 3);
    units = shuffle(units).slice(0, 8);
    const list = [];
    units.forEach(u => {
      const g = GS[u.id] || {};
      list.push({ kind: "word", u, title: "Từ vựng", items: sample(u.words, Math.min(6, u.words.length)).map(w => ({ en: w[0], vi: w[1], pic: w[2], rep: 2 })) });
      if (g.chant) list.push({ kind: "chant", u, title: "Vè", items: g.chant.map(l => ({ en: l[0], vi: l[1], pic: u.icon })) });
      if (g.tale) list.push({ kind: "tale", u, title: "Truyện", items: g.tale.map(l => ({ en: l[0], vi: l[1], pic: l[2] })) });
      if (g.talk) list.push({ kind: "talk", u, title: "Hội thoại", items: g.talk.flatMap(p => [{ en: p[0], vi: p[1], pic: "🐼" }, { en: p[2], vi: p[3], pic: p[4] }]) });
      if (u.sentences) list.push({ kind: "sent", u, title: "Mẫu câu", items: u.sentences.map(s => ({ en: s[0], vi: s[1], pic: s[2] })) });
    });
    return list;
  }
  let rep = null;
  function repRender() {
    if (!rep) return;
    const blk = rep.list[rep.b], it = blk.items[rep.i];
    $("#repStage").innerHTML = `<div class="rep-tag">${blk.u.icon} ${esc(blk.u.title)} · ${blk.title}</div>
      <div class="rep-pic">${it.pic === "🐼" ? Art.panda("happy") : pic(it.pic)}</div>
      <div class="rep-en">${esc(it.en)}</div><div class="rep-vi p-vi">${esc(it.vi)}</div>
      <div class="rep-dots">${blk.items.map((_, k) => `<i class="${k === rep.i ? "on" : k < rep.i ? "done" : ""}"></i>`).join("")}</div>`;
  }
  function repTick() {
    if (!rep || !rep.playing) return;
    st.rep = st.rep || {}; const k = dayKey(); st.rep[k] = (st.rep[k] || 0) + 1;
    const t = st.rep[k];
    $("#repTime").textContent = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
    $("#repBar").style.width = Math.min(100, t / (repGoalMin() * 60) * 100) + "%";
    if (t % 5 === 0) save();
    st.repDone = st.repDone || {};
    if (t >= repGoalMin() * 60 && !st.repDone[k]) {
      st.repDone[k] = 1; logLesson(); save();
      SFX.fanfare(); SFX.applause(2); confetti(120);
      toast(`🎉 Hoàn thành ${repGoalMin()} phút nghe hôm nay!`, 3500);
      Speech.seq([["Xuất sắc!", "vi"], [`Con đã nghe đủ ${REP_WORD[repGoalMin()]} phút hôm nay!`, "vi"]]).then(() => { if (rep) repLoop(); });
    }
  }
  async function repLoop() {
    if (!rep) return;
    const my = ++rep.run;
    while (rep && rep.playing && my === rep.run) {
      const blk = rep.list[rep.b], it = blk.items[rep.i];
      repRender();
      for (let r = 0; r < (it.rep || 1); r++) {
        await Speech.en(it.en, { flush: false });
        if (!rep || my !== rep.run) return;
        await new Promise(res => setTimeout(res, 500));
      }
      if (!rep || my !== rep.run || !rep.playing) return;
      if (!st.englishOnly && blk.kind === "word") { await Speech.vi(it.vi, { flush: false }); if (!rep || my !== rep.run) return; }
      await new Promise(res => setTimeout(res, 700));
      if (!rep || my !== rep.run) return;
      repStep(1, true);
    }
  }
  function repStep(d, auto) {
    if (!rep) return;
    rep.i += d;
    if (rep.i >= rep.list[rep.b].items.length) { rep.b = (rep.b + 1) % rep.list.length; rep.i = 0; if (rep.b === 0) rep.list = buildPlaylist(); }
    if (rep.i < 0) { rep.b = (rep.b - 1 + rep.list.length) % rep.list.length; rep.i = rep.list[rep.b].items.length - 1; }
    repRender();
    if (!auto && rep.playing) { Speech.stop(); repLoop(); }
  }
  function openRep() {
    stopRep();
    rep = { list: buildPlaylist(), b: 0, i: 0, playing: true, run: 0, timer: null };
    setTitle("🎧 Nghe mỗi ngày", "Tắm tiếng Anh – nghe lại những gì bé đã học");
    $("#repPlay").textContent = "⏸️"; SFX.hold(true);
    const t = repToday();
    $("#repTime").textContent = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
    $("#repBar").style.width = Math.min(100, t / (repGoalMin() * 60) * 100) + "%";
    $("#repInfo").textContent = `${rep.list.length} phần nghe từ ${new Set(rep.list.map(x => x.u.id)).size} chủ đề bé đã học. Mỗi ngày ${repGoalMin()} phút giúp bé quen tai tiếng Anh.`;
    renderRepGoal();
    rep.timer = setInterval(repTick, 1000);
    show("rep"); repRender();
    Speech.vi(`Mình cùng nghe tiếng Anh ${REP_WORD[repGoalMin()]} phút nhé!`).then(() => { if (rep) repLoop(); });
  }
  function renderRepGoal() {
    const g = repGoalMin();
    $("#repGoalTxt").textContent = `${String(g).padStart(2, "0")}:00`;
    document.querySelectorAll(".rg-chip").forEach(b => b.classList.toggle("sel", +b.dataset.m === g));
    const t = repToday(); $("#repBar").style.width = Math.min(100, t / (g * 60) * 100) + "%";
  }
  function setRepGoal(m) {
    st.repGoal = m; save(); renderRepGoal(); SFX.click();
    if (rep) $("#repInfo").textContent = `${rep.list.length} phần nghe từ ${new Set(rep.list.map(x => x.u.id)).size} chủ đề bé đã học. Mỗi ngày ${m} phút giúp bé quen tai tiếng Anh.`;
    toast(`⏱ Mục tiêu nghe mỗi ngày: ${m} phút`, 1500);
  }
  function stopRep() {
    if (!rep) return;
    clearInterval(rep.timer); rep.playing = false; rep.run++; rep = null;
    Speech.stop(); SFX.hold(false); save();
  }

  // ---------- Sao lưu ----------
  const NATIVE = typeof window.Native !== "undefined";
  const today = () => new Date().toDateString();
  function backupPayload() {
    const state = Object.assign({}, st); delete state.lastBackup; delete state.lastBackupWhere;
    return JSON.stringify({ app: "BeHocTiengAnh1", version: VERSION, time: new Date().toISOString(), state }, null, 1);
  }
  function doBackup(manual) {
    const data = backupPayload();
    if (NATIVE && Native.backup) {
      let where = "";
      try { where = Native.backup(data) || ""; } catch (e) { where = ""; }
      if (where && where !== "perm") {
        st.lastBackup = Date.now(); st.lastBackupWhere = where; save();
        if (manual) toast("💾 Đã sao lưu vào " + where, 3000);
      } else if (manual) toast(where === "perm" ? "Hãy cho phép lưu tệp rồi bấm lại nhé" : "Không sao lưu được, thử lại sau nhé", 3000);
    } else if (manual) {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([data], { type: "application/json" }));
      a.download = "BeHocTiengAnh_saoluu.json"; a.click();
      st.lastBackup = Date.now(); st.lastBackupWhere = "Thư mục Tải về"; save();
    }
    updateBackupInfo();
  }
  function autoBackup(trigger) {
    if (st.autoBackup === "off" || !NATIVE) return;
    if (st.autoBackup === "each" && trigger === "lesson") return doBackup(false);
    if (st.autoBackup === "daily" || st.autoBackup === "each") {
      if (!st.lastBackup || new Date(st.lastBackup).toDateString() !== today()) doBackup(false);
    }
  }
  function applyRestore(text) {
    try {
      const d = JSON.parse(text);
      if (!d || d.app !== "BeHocTiengAnh1" || !d.state) throw new Error("bad");
      const keep = { lastBackup: st.lastBackup, lastBackupWhere: st.lastBackupWhere };
      st = Object.assign({}, DEF, d.state, keep); save();
      applyTheme(); applyVoices(); SFX.setSong(st.song); SFX.setMusicOn(st.musicOn);
      $("#btnMusic").classList.toggle("off", !st.musicOn);
      closeSettings(); stack.length = 0; renderHome(); show("home", false);
      toast(`✅ Đã khôi phục: ${totalStars()} ⭐`, 3000);
    } catch (e) { toast("Tệp sao lưu không hợp lệ", 3000); }
  }
  window.__restoreData = applyRestore;
  window.__restoreError = () => toast("Không đọc được tệp sao lưu", 3000);
  function updateBackupInfo() {
    const el2 = $("#backupInfo"); if (!el2) return;
    const last = st.lastBackup ? new Date(st.lastBackup).toLocaleString("vi-VN") : "chưa có";
    el2.textContent = `Lần sao lưu gần nhất: ${last}` + (st.lastBackupWhere ? ` · ${st.lastBackupWhere}` : "") +
      (NATIVE ? "" : " · (Trên trình duyệt chỉ sao lưu thủ công)");
  }

  // ---------- Cài đặt ----------
  function fillVoices() {
    ["en", "vi"].forEach(lang => {
      const sel = $(lang === "en" ? "#voiceEn" : "#voiceVi");
      const list = Speech.listVoices(lang);
      sel.innerHTML = "";
      if (!list.length) { sel.innerHTML = `<option value="">(Mặc định của máy)</option>`; return; }
      list.forEach((v, i) => {
        const o = el("option"); o.value = v.name;
        const female = Speech.scoreVoice(v.name, lang) > 0;
        o.textContent = `${female ? "👩 " : ""}${i === 0 ? "★ " : ""}${v.name}${v.local === false ? " (mạng)" : ""}`;
        sel.appendChild(o);
      });
      const want = (lang === "en" ? st.voiceEn : st.voiceVi) || list[0].name;
      sel.value = list.some(v => v.name === want) ? want : list[0].name;
    });
    const hints = [];
    if (!Speech.ttsReady()) hints.push("Máy chưa sẵn sàng giọng đọc. Hãy cài 'Google Text-to-Speech' (Dịch vụ lời nói của Google).");
    else {
      if (!Speech.langOk("vi")) hints.push("Chưa có giọng Tiếng Việt: vào Cài đặt máy → Chuyển văn bản thành giọng nói → tải gói Tiếng Việt.");
      if (!Speech.langOk("en")) hints.push("Chưa có giọng Tiếng Anh: hãy tải gói English (US) trong Google Text-to-Speech.");
    }
    $("#ttsHint").innerHTML = hints.map(esc).join("<br>") + (Speech.native ? ` <a href="#" id="openTts">Mở cài đặt giọng đọc</a>` : "");
    const ot = $("#openTts"); if (ot) ot.onclick = e => { e.preventDefault(); Speech.openTtsSettings(); };
  }
  function applyVoices() {
    const en = st.voiceEn || Speech.bestVoice("en"), vi = st.voiceVi || Speech.bestVoice("vi");
    if (en) Speech.setVoice("en", en);
    if (vi) Speech.setVoice("vi", vi);
    Speech.setRate(st.rate / 100);
    Speech.setUseClips(st.voiceMode !== "device");
  }
  function openSettings() {
    const tl = $("#themeList"); tl.innerHTML = "";
    THEMES.forEach(t => {
      const b = el("div", "theme-opt" + (st.theme === t.id ? " sel" : ""), `<span class="t-ic">${t.icon}</span>${t.name}`);
      b.style.background = t.g;
      b.onclick = () => { st.theme = t.id; save(); applyTheme(); SFX.click(); openSettings(); };
      tl.appendChild(b);
    });
    const al = $("#avatarList"); al.innerHTML = "";
    AVATARS.forEach(a => {
      const b = el("button", st.avatar === a ? "sel" : "", a);
      b.onclick = () => { st.avatar = a; save(); $("#avatar").textContent = a; SFX.click(); openSettings(); };
      al.appendChild(b);
    });
    $("#volMusic").value = st.musicVol; $("#volSfx").value = st.sfxVol; $("#ttsRate").value = st.rate; $("#readVi").checked = st.readVi; $("#voiceMode").value = st.voiceMode; $("#autoBackup").value = st.autoBackup;
    updateVoiceMode(); updateBackupInfo(); renderParent(); $("#engOnly").checked = !!st.englishOnly;
    const ss = $("#songSel"); ss.innerHTML = SFX.songs.map((s, i) => `<option value="${i}">🎵 ${s}</option>`).join(""); ss.value = st.song;
    fillVoices();
    $("#ver").textContent = VERSION;
    $("#settings").classList.remove("hidden");
  }
  function updateVoiceMode() {
    const clip = st.voiceMode === "clip";
    $("#deviceVoiceBox").classList.toggle("hidden", clip);
    $("#voiceModeInfo").textContent = clip
      ? "Giọng nữ thu sẵn: tiếng Anh chuẩn giọng Mỹ, tiếng Việt chuẩn giọng Bắc. Không cần mạng, không cần cài thêm."
      : "Dùng bộ đọc của điện thoại (Google Text-to-Speech). Tiếng Anh được khóa ở giọng Mỹ (en-US).";
  }
  function applyLang() {
    document.body.classList.toggle("eng-only", !!st.englishOnly);
    Speech.setViMuted(!!st.englishOnly);
  }
  function renderParent() {
    const days = [];
    for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push(d); }
    const mins = days.map(d => Math.round(((st.rep || {})[dayKey(d)] || 0) / 60));
    const les = days.map(d => (st.days || {})[dayKey(d)] || 0);
    const mx = Math.max(15, ...mins);
    const wd = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const pr = st.pron || {}; const pv = Object.values(pr);
    $("#parentStats").innerHTML = `<div class="ps-chart">${days.map((d, i) => `<div class="ps-col"><div class="ps-bar" style="height:${Math.max(4, mins[i] / mx * 90)}px" title="${mins[i]} phút"><span>${mins[i] || ""}</span></div><small>${wd[d.getDay()]}</small><em>${les[i] ? les[i] + " bài" : ""}</em></div>`).join("")}</div>
      <p class="muted small">Cột = số phút "Nghe mỗi ngày" (mục tiêu 15 phút). Dưới cột = số bài học xong trong ngày.<br>
      🔥 ${streak()} ngày học liên tiếp · ⭐ ${totalStars()} sao · 🎯 Điểm phát âm trung bình: ${pv.length ? Math.round(pv.reduce((a, b) => a + b, 0) / pv.length) + "/100" : "chưa có"}</p>`;
  }
  function closeSettings() { $("#settings").classList.add("hidden"); }

  function bindUI() {
    $("#btnBack").onclick = () => { SFX.click(); back(); };
    $("#btnSettings").onclick = () => { SFX.click(); openSettings(); };
    $("#setClose").onclick = closeSettings;
    $("#settings").addEventListener("click", e => { if (e.target.id === "settings") closeSettings(); });
    $("#btnMusic").onclick = () => {
      st.musicOn = !st.musicOn; save(); SFX.setMusicOn(st.musicOn); SFX.unlock();
      $("#btnMusic").classList.toggle("off", !st.musicOn); toast(st.musicOn ? "🎵 Bật nhạc nền" : "🔇 Tắt nhạc nền", 1200);
    };
    $("#kidName").addEventListener("input", e => { st.name = e.target.value.slice(0, 20); save(); });
    $("#kidName").addEventListener("change", () => renderHome());
    $("#mascot").onclick = () => { SFX.unlock(); Speech.seq([["Hello! Let's learn English!", "en"], ["Cùng học tiếng Anh thôi nào!", "vi"]]); };
    $("#btnRep").onclick = () => { SFX.click(); openRep(); };
    $("#repPlay").onclick = () => { if (!rep) return; rep.playing = !rep.playing; $("#repPlay").textContent = rep.playing ? "⏸️" : "▶️"; if (rep.playing) repLoop(); else { rep.run++; Speech.stop(); } };
    $("#repNext").onclick = () => repStep(1);
    document.querySelectorAll(".rg-chip").forEach(b => b.onclick = () => setRepGoal(+b.dataset.m));
    $("#repPrev").onclick = () => repStep(-1);
    $("#engOnly").onchange = e => { st.englishOnly = e.target.checked; save(); applyLang(); toast(st.englishOnly ? "🇬🇧 Chế độ chỉ tiếng Anh: đã bật" : "Đã tắt chế độ chỉ tiếng Anh", 2000); };
    $("#avatar").onclick = () => { SFX.click(); openSettings(); };
    $("#btnContinue").onclick = () => { SFX.click(); const nx = nextLesson(); curUnit = nx.u; curLevel = nx.u.level; stack.push("home"); curScreen = "unit"; startGame(nx.u.id, nx.a); };
    window.addEventListener("resize", () => {
      if (curScreen === "units") drawPath($("#unitLine"), $("#unitList"));
      if (curScreen === "unit") drawPath($("#actLine"), $("#actList"));
    });
    $("#btnChallenge").onclick = () => {
      SFX.click();
      const units = C.units.filter(u => !u.type);
      const u = pick(units), a = pick(["listen", "balloon", "readpic", "memory", "spell", "missing", "sentListen", "builder"]);
      toast(`🎲 ${u.icon} ${u.title} – ${ACTS[a].name}`, 2500);
      curUnit = u; stack.push("home"); curScreen = "unit";
      startGame(u.id, a, { challenge: true });
    };
    $("#btnStickers").onclick = () => {
      SFX.click(); setTitle("🏅 Bộ sưu tập sticker", "Cứ 3 ngôi sao = 1 sticker mới");
      const n = stickersUnlocked();
      $("#stickerInfo").textContent = `Bé đã có ${n}/${STICKERS.length} sticker · ${totalStars()} ⭐`;
      $("#stickerGrid").innerHTML = STICKERS.map((s, i) => `<div class="sticker ${i < n ? "" : "locked"}">${s}</div>`).join("");
      show("stickers");
    };
    $("#resAgain").onclick = () => { $("#result").classList.add("hidden"); if (game) startGame(game.unit.id, game.act, game.opts); };
    $("#resNext").onclick = () => nextActivity();
    $("#volMusic").oninput = e => { st.musicVol = +e.target.value; SFX.setMusicVol(st.musicVol / 100); save(); };
    $("#volSfx").oninput = e => { st.sfxVol = +e.target.value; SFX.setSfxVol(st.sfxVol / 100); save(); };
    $("#volSfx").onchange = () => SFX.correct();
    $("#songSel").onchange = e => { st.song = +e.target.value; SFX.setSong(st.song); save(); };
    $("#ttsRate").onchange = e => { st.rate = +e.target.value; save(); applyVoices(); Speech.en("Hello! How are you?"); };
    $("#voiceMode").onchange = e => { st.voiceMode = e.target.value; save(); applyVoices(); updateVoiceMode(); Speech.seq([["Hello! Let's learn English together!", "en"], ["Xin chào bé yêu! Cùng học tiếng Anh vui vẻ nhé!", "vi"]]); };
    $("#autoBackup").onchange = e => { st.autoBackup = e.target.value; save(); if (st.autoBackup !== "off") autoBackup("change"); toast(st.autoBackup === "off" ? "Đã tắt tự động sao lưu" : "Đã bật tự động sao lưu", 1800); };
    $("#btnBackupNow").onclick = () => { SFX.click(); doBackup(true); };
    $("#btnRestore").onclick = () => {
      SFX.click();
      if (NATIVE && Native.pickRestore) { try { Native.pickRestore(); } catch (e) { toast("Không mở được trình chọn tệp"); } }
      else $("#restoreFile").click();
    };
    $("#restoreFile").onchange = e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => applyRestore(r.result); r.readAsText(f); e.target.value = ""; };
    $("#readVi").onchange = e => { st.readVi = e.target.checked; save(); };
    $("#voiceEn").onchange = e => { st.voiceEn = e.target.value; save(); applyVoices(); Speech.en("Hello! I am your English teacher."); };
    $("#voiceVi").onchange = e => { st.voiceVi = e.target.value; save(); applyVoices(); Speech.vi("Xin chào bé! Cùng học tiếng Anh nhé!"); };
    $("#testEn").onclick = () => Speech.en("Hello! Let's learn English together!");
    $("#testVi").onclick = () => Speech.vi("Xin chào bé yêu! Cùng học tiếng Anh vui vẻ nhé!");
    $("#btnReset").onclick = () => {
      if (!confirmReset()) return;
      st.stars = {}; st.best = {}; st.plays = 0; save(); updateStars(); toast("Đã xóa tiến độ"); closeSettings(); renderHome(); show("home", false); stack.length = 0;
    };
    // Mở khóa âm thanh ở lần chạm đầu tiên (chính sách tự phát của WebView)
    const first = () => { SFX.unlock(); document.removeEventListener("pointerdown", first, true); };
    document.addEventListener("pointerdown", first, true);
    document.addEventListener("visibilitychange", () => { if (document.hidden) { SFX.pauseAll(); Speech.stop(); } else SFX.resumeAll(); });
  }
  let resetArmed = 0;
  function confirmReset() {
    if (Date.now() - resetArmed < 4000) { resetArmed = 0; return true; }
    resetArmed = Date.now(); toast("Bấm lần nữa để xác nhận xóa tiến độ", 3500); return false;
  }

  window.appPause = () => { if (rep && rep.playing) { rep.playing = false; rep.run++; $("#repPlay").textContent = "▶️"; } SFX.pauseAll(); Speech.stop(); Speech.stopListen(); };
  window.appResume = () => { SFX.resumeAll(); };
  window.onVoicesReady = () => { applyVoices(); if (!$("#settings").classList.contains("hidden")) fillVoices(); };

  // ---------- Khởi động ----------
  function boot() {
    applyTheme(); bindUI(); renderHome();
    SFX.setMusicVol(st.musicVol / 100); SFX.setSfxVol(st.sfxVol / 100); SFX.setSong(st.song); SFX.setMusicOn(st.musicOn);
    $("#btnMusic").classList.toggle("off", !st.musicOn);
    applyVoices(); setTimeout(applyVoices, 1500); applyLang();
    setTimeout(() => autoBackup("boot"), 4000);
  }

  window.App = { openRep, stopRep, boot, startGame, openUnit, openLevel, back, state: () => st, unitActs, ACTS, THEMES, STICKERS, pic, shuffle, sample, pick, esc, toast, kidName, VERSION, curGame: () => game };
  document.addEventListener("DOMContentLoaded", boot);
})();
