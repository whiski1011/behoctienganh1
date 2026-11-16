// Kiểm thử E2E: mở app trong Chromium, tự chơi hết mọi bài của mọi chủ đề.
// Chạy: node tests/e2e.test.js [--quick]
const path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const www = path.join(__dirname, "..", "app", "www");
const QUICK = process.argv.includes("--quick");
const SHOTS = path.join(__dirname, "shots");
require("fs").mkdirSync(SHOTS, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 400, height: 820 }, deviceScaleFactor: 2 });
  const errors = [];
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  page.on("console", m => { if (m.type() === "error") errors.push("console: " + m.text()); });
  await page.addInitScript(() => {
    // tăng tốc thời gian chờ trong kiểm thử
    const st = window.setTimeout;
    window.setTimeout = (fn, ms, ...a) => st(fn, Math.min(ms || 0, 1500) / 8, ...a);
  });
  await page.goto("file://" + path.join(www, "index.html"));
  await page.waitForFunction(() => window.App && window.GAMES);
  // phát thật 1 đoạn thu sẵn để chắc file âm thanh dùng được
  const realClip = await page.evaluate(async () => {
    SFX.unlock(); const t0 = performance.now();
    await Speech.en("cat"); await Speech.vi("con mèo", { flush: false });
    return { ms: Math.round(performance.now() - t0), n: Object.keys(window.CLIPS || {}).length };
  });
  if (!realClip.n) errors.push("Không có giọng thu sẵn (clips.js trống)");
  if (realClip.ms > 6000) errors.push("Phát giọng thu sẵn bị treo/chậm: " + realClip.ms + "ms");
  console.log("Giọng thu sẵn:", JSON.stringify(realClip));
  // thử 5 bài nhạc nền
  const songs = await page.evaluate(async () => { const n = SFX.songs.length; for (let i = 0; i < n; i++) { SFX.setSong(i); await new Promise(r => setTimeout(r, 1200 * 8)); } SFX.setSong(0); return SFX.songs; });
  console.log("Nhạc nền:", songs.join(", "));
  if (songs.length !== 5) errors.push("Không đủ 5 bài nhạc nền");
  await page.evaluate(() => {
    window.__miss = new Set();
    Speech.say = (t, l = "en") => { if (!(window.CLIPS || {})[l + "|" + String(t).trim()]) __miss.add(l + "|" + t); return new Promise(r => setTimeout(r, 40)); };
    Speech.canListen = () => true;
    Speech.listen = () => {
      const t = document.querySelector("#stage .kid .tk-en, #stage .f-en, #stage .f-sent");
      const l = [t ? t.textContent : ""]; l.conf = [0.93];
      return Promise.resolve(l);
    };
  });

  // ---- màn hình chính & giao diện ----
  const levels = await page.$$eval(".level-card", n => n.length);
  if (levels !== 3) errors.push("Trang chủ không có đủ 3 cấp độ");
  await page.fill("#kidName", "Bông");
  await page.screenshot({ path: path.join(SHOTS, "home.png") });
  for (const th of ["ocean", "dino", "princess", "space", "candy", "hero"]) {
    await page.evaluate(t => { App.state().theme = t; document.body.dataset.theme = t; }, th);
    if (!QUICK) await page.screenshot({ path: path.join(SHOTS, "theme-" + th + ".png") });
  }
  await page.click("#btnSettings");
  await page.waitForSelector("#settings:not(.hidden)");
  const themeOpts = await page.$$eval(".theme-opt", n => n.length);
  if (themeOpts !== 6) errors.push("Cài đặt không có 6 giao diện: " + themeOpts);
  await page.screenshot({ path: path.join(SHOTS, "settings.png") });
  await page.click("#setClose");
  await page.click(".level-card");
  await page.waitForSelector("#scr-units.active");
  await page.click(".map-node:nth-child(2) .unit-card");
  await page.waitForSelector("#scr-unit.active");
  await page.screenshot({ path: path.join(SHOTS, "unit.png") });

  // ---- tự chơi ----
  const autoplay = async () => page.evaluate(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms * 8));
    const vis = s => document.querySelector(s);
    const t0 = Date.now();
    let n = 0;
    while (Date.now() - t0 < 60000) {
      n++;
      if (!vis("#result").classList.contains("hidden")) return { ok: true, steps: n };
      const st = vis("#stage");
      // thẻ học
      const story = [...st.querySelectorAll(".big-btn")].find(b => /Trả lời câu hỏi|Đố vui/.test(b.textContent));
      if (story) { story.click(); await sleep(60); continue; }
      const choice = [...st.querySelectorAll(".choice:not(.dim)")];
      if (choice.length) { choice[0].click(); await sleep(60); continue; }
      const balloons = [...st.querySelectorAll(".balloon:not(.popped):not(.nope)")];
      if (balloons.length) { balloons[0].dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); await sleep(60); continue; }
      const cards = [...st.querySelectorAll(".mcard:not(.flip)")];
      if (cards.length) {
        const k = cards[0].dataset.key;
        const pair = cards.filter(c => c.dataset.key === k);
        pair[0].click(); await sleep(10); if (pair[1]) pair[1].click(); await sleep(120); continue;
      }
      const tiles = [...st.querySelectorAll(".tiles .tile:not(.used)")];
      if (tiles.length) {
        for (const t of tiles) { t.click(); await sleep(2); if (t.classList.contains("used")) break; }
        await sleep(20); continue;
      }
      const cv = st.querySelector(".trace-wrap canvas");
      if (cv) {
        const done = [...st.querySelectorAll(".big-btn")].find(b => b.textContent.includes("Xong"));
        if (done.disabled) { await sleep(60); continue; }
        // tô theo các điểm ảnh của chữ mẫu
        const g = cv.getContext("2d"), W = cv.width, H = cv.height, d = g.getImageData(0, 0, W, H).data;
        const r = cv.getBoundingClientRect(), sx = r.width / W, sy = r.height / H;
        const isGuide = (x, y) => { const k = (y * W + x) * 4; return Math.abs(d[k] - 236) < 6 && Math.abs(d[k + 1] - 239) < 6 && Math.abs(d[k + 2] - 241) < 6; };
        const fire = (type, x, y) => cv.dispatchEvent(new PointerEvent(type, { bubbles: true, clientX: r.left + x * sx, clientY: r.top + y * sy, pointerId: 1 }));
        for (let y = 0; y < H; y += 12) {
          let x = 0;
          while (x < W) {
            while (x < W && !isGuide(x, y)) x++;
            if (x >= W) break;
            const s = x; while (x < W && isGuide(x, y)) x++;
            fire("pointerdown", s, y); fire("pointermove", (s + x) / 2, y); fire("pointermove", x - 1, y); fire("pointerup", x - 1, y);
          }
        }
        done.click(); await sleep(100); continue;
      }
      const mic = st.querySelector(".mic-btn");
      if (mic && !mic.classList.contains("listening")) { mic.click(); await sleep(80); continue; }
      const nav = [...st.querySelectorAll(".nav-row .big-btn")].filter(b => /Tiếp|Xong/.test(b.textContent) && !b.disabled);
      if (nav.length) { nav[nav.length - 1].click(); await sleep(30); continue; }
      await sleep(50);
    }
    return { ok: false, steps: n, html: document.querySelector("#stage").innerHTML.slice(0, 400) };
  });

  // kiểm tra chế độ rảnh tay: bấm 🎤 đúng 1 lần, bé đọc sai → app tự cho thử lại 3 lần rồi tự sang câu tiếp, câu sau tự nghe
  const pr = await page.evaluate(async () => {
    const orig = Speech.listen, origPS = Speech.pronScore; let calls = 0, firstScore = null; const got = [];
    Speech.pronScore = (t, a) => { const r = origPS(t, a); got.push(r); return r; };
    Speech.listen = () => { calls++; const l = ["banana"]; l.conf = [0.6]; return Promise.resolve(l); };
    App.startGame("pets", "pron");
    const waitReal = ms => new Promise(r => { const t0 = performance.now(); (function f() { performance.now() - t0 > ms ? r() : setTimeout(f, 200); })(); });
    await waitReal(1500);
    const w1 = document.querySelector("#stage .f-en, #stage .f-sent").textContent;
    document.querySelector("#stage .mic-btn").click();
    await waitReal(250);
    firstScore = got[0] && got[0].score;
    const bad = got[0] ? got[0].words.filter(x => !x.ok).length : 0;
    await waitReal(4000);
    const w2 = (document.querySelector("#stage .f-en, #stage .f-sent") || {}).textContent;
    const hands = !!document.querySelector(".pron-box.hands");
    Speech.listen = orig; Speech.pronScore = origPS;
    return { firstScore, bad, calls, moved: w1 !== w2, hands };
  });
  console.log("Rảnh tay (1 lần bấm, đọc sai):", JSON.stringify(pr));
  if (!(pr.firstScore < 60 && pr.bad >= 1 && pr.calls >= 4 && pr.moved && pr.hands)) errors.push("Chế độ rảnh tay chưa đúng: " + JSON.stringify(pr));
  await page.screenshot({ path: path.join(SHOTS, "pron-low.png") });
  // Nghe mỗi ngày + chế độ chỉ tiếng Anh
  const repRes = await page.evaluate(async () => {
    App.openRep();
    await new Promise(r => { const t0 = performance.now(); (function f() { performance.now() - t0 > 3500 ? r() : setTimeout(f, 400); })(); });
    const t = document.querySelector("#repTime").textContent, en = document.querySelector(".rep-en") && document.querySelector(".rep-en").textContent;
    document.querySelector('.rg-chip[data-m="10"]').click();
    const bar = parseFloat(document.querySelector("#repBar").style.width), goal = document.querySelector("#repGoalTxt").textContent;
    document.querySelector("#repNext").click();
    const en2 = document.querySelector(".rep-en").textContent;
    App.stopRep(); App.back();
    App.state().englishOnly = true; document.querySelector("#engOnly").checked = true; document.querySelector("#engOnly").dispatchEvent(new Event("change"));
    App.startGame("pets", "talk");
    await new Promise(r => setTimeout(r, 300 * 8));
    const viHidden = getComputedStyle(document.querySelector(".p-vi")).display === "none";
    document.querySelector("#engOnly").checked = false; document.querySelector("#engOnly").dispatchEvent(new Event("change"));
    return { t, en, en2, viHidden, bar, goal };
  });
  console.log("Nghe mỗi ngày & chỉ tiếng Anh:", JSON.stringify(repRes));
  if (!repRes.en || repRes.t === "00:00" || !repRes.viHidden || !(repRes.bar < 20) || repRes.goal !== "10:00") errors.push("Nghe mỗi ngày / chỉ tiếng Anh lỗi: " + JSON.stringify(repRes));
  const plan = await page.evaluate(() => CONTENT.units.map(u => ({ id: u.id, acts: App.unitActs(u) })));
  let played = 0, failed = 0;
  const shotDone = new Set();
  for (const u of plan) {
    const acts = QUICK ? u.acts.slice(0, 3) : u.acts;
    for (const a of acts) {
      const before = errors.length;
      await page.evaluate(([uid, act]) => { document.querySelector("#result").classList.add("hidden"); App.startGame(uid, act); }, [u.id, a]);
      await page.waitForTimeout(250);
      const base = a.split(":")[0];
      if (!shotDone.has(base)) { shotDone.add(base); await page.screenshot({ path: path.join(SHOTS, `game-${base}.png`) }); }
      const r = await autoplay();
      played++;
      if (!r.ok || errors.length > before) {
        failed++;
        console.log(`  ✗ ${u.id} / ${a}: ${r.ok ? "" : "không hoàn thành"} ${errors.slice(before).join(" | ")} ${r.html || ""}`);
      }
      if (base === "listen" && u.id === "pets") await page.screenshot({ path: path.join(SHOTS, "result.png") });
    }
  }
  const stars = await page.evaluate(() => Object.values(App.state().stars).reduce((a, b) => a + b, 0));
  // quay lại bằng nút back
  await page.evaluate(() => { document.querySelector("#result").classList.add("hidden"); });
  for (let k = 0; k < 6; k++) await page.evaluate(() => window.appBack());
  const onHome = await page.evaluate(() => document.querySelector("#scr-home").classList.contains("active"));
  if (!onHome) errors.push("Nút quay lại không về trang chủ");
  // audio state
  const audio = await page.evaluate(() => { SFX.unlock(); SFX.correct(); SFX.applause(1); return SFX.state(); });

  const miss = await page.evaluate(() => [...__miss]);
  if (miss.length) errors.push("Câu chưa có giọng thu sẵn: " + miss.join(" || "));
  const tb = await page.evaluate(() => document.querySelector("#topbar").getBoundingClientRect().height);
  console.log("Chiều cao thanh trên cùng:", tb, "px");
  console.log(`Đã tự chơi ${played} bài, lỗi ${failed}; tổng sao ${stars}; audio ${JSON.stringify(audio)}`);
  if (errors.length) console.log("Lỗi JS:\n" + [...new Set(errors)].join("\n"));
  await browser.close();
  const bad = failed || errors.length;
  console.log(bad ? "❌ E2E CÓ LỖI" : "✅ E2E đạt: không có lỗi JS, mọi bài đều chơi được tới màn kết quả");
  process.exit(bad ? 1 : 0);
})();
