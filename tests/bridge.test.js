// Kiểm thử đường đi qua cầu nối Android (giả lập window.Native giống MainActivity.java)
const path = require("path");
const { chromium } = require("/opt/node22/lib/node_modules/playwright");
const www = path.join(__dirname, "..", "app", "www");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  await page.addInitScript(() => {
    window.__log = [];
    window.Native = {
      ttsReady: () => "1",
      langStatus: l => 1,
      voices: l => JSON.stringify(l === "en"
        ? [{ name: "en-us-x-iol-local", local: true }, { name: "en-us-x-tpf-local", local: true }, { name: "en-us-x-tpd-network", local: false }]
        : [{ name: "vi-vn-x-vif-local", local: true }, { name: "vi-vn-x-gft-local", local: true }, { name: "vi-vn-x-vie-network", local: false }]),
      setVoice: (l, n) => __log.push(["setVoice", l, n]),
      speak: (t, l, id, r, p) => { __log.push(["speak", t, l, r, p]); setTimeout(() => window.__ttsDone(String(id)), 30); },
      stop: () => __log.push(["stop"]),
      sttAvailable: () => true,
      listen: lang => { setTimeout(() => window.__stt(JSON.stringify({ type: "ready" })), 10); setTimeout(() => window.__stt(JSON.stringify({ type: "result", list: ["a cat", "cat"], conf: [0.91, 0.4] })), 40); },
      stopListen: () => {},
      openTtsSettings: () => {},
      backup: json => { window.__bk = json; return "Download/BeHocTiengAnh/BeHocTiengAnh_saoluu.json"; },
      pickRestore: () => setTimeout(() => window.__restoreData(window.__bk), 20)
    };
  });
  await page.goto("file://" + path.join(www, "index.html"));
  await page.waitForFunction(() => window.App && window.GAMES);
  const r = await page.evaluate(async () => {
    Speech.setUseClips(false);
    window.onVoicesReady(); Speech.setUseClips(false);
    const t0 = Date.now();
    await Speech.en("cat"); await Speech.vi("con mèo", { flush: false });
    const dt = Date.now() - t0;
    const alts = await Speech.listen("en");
    const ps = Speech.pronScore("cat", alts);
    return {
      ps: ps.score, conf: alts.conf, dt, alts, bestEn: Speech.bestVoice("en"), bestVi: Speech.bestVoice("vi"),
      log: __log, match: Speech.isMatch("cat", alts), noMatch: Speech.isMatch("dog", ["dark"]),
      m2: Speech.isMatch("I am a boy.", ["i am a boy"]), m3: Speech.isMatch("six", ["6"]), m4: Speech.isMatch("T-shirt", ["t-shirt"])
    };
  });
  // sao lưu & khôi phục
  const bk = await page.evaluate(async () => {
    App.state().voiceMode = "device"; window.onVoicesReady();
    App.state().stars["pets|listen"] = 3;
    document.querySelector("#btnSettings").click();
    document.querySelector("#btnBackupNow").click();
    const saved = JSON.parse(window.__bk || "{}");
    App.state().stars = {};
    document.querySelector("#btnRestore").click();
    await new Promise(r => setTimeout(r, 200));
    return { savedStars: saved.state && saved.state.stars, after: App.state().stars, info: document.querySelector("#backupInfo").textContent, last: App.state().lastBackup };
  });
  console.log("Sao lưu:", JSON.stringify(bk));
  const fails = [];
  if (!bk.savedStars || bk.savedStars["pets|listen"] !== 3 || bk.after["pets|listen"] !== 3 || !bk.last) fails.push("Sao lưu/khôi phục sai");
  if (r.bestEn !== "en-us-x-tpf-local") fails.push("Giọng nữ EN mặc định sai: " + r.bestEn);
  if (r.bestVi !== "vi-vn-x-gft-local") fails.push("Giọng nữ VI mặc định sai: " + r.bestVi);
  if (!(r.ps >= 80 && r.conf && r.conf[0] === 0.91)) fails.push("Chấm điểm phát âm qua cầu nối sai: " + r.ps + " " + JSON.stringify(r.conf));
  console.log("Điểm phát âm 'cat' (máy nghe 'a cat', tin cậy 0.91):", r.ps);
  if (r.dt > 1500) fails.push("Chờ đọc xong quá lâu (callback __ttsDone không hoạt động): " + r.dt);
  if (!r.log.some(x => x[0] === "speak" && x[2] === "vi")) fails.push("Không gọi đọc tiếng Việt");
  if (!r.match || r.noMatch || !r.m2 || !r.m3 || !r.m4) fails.push("So khớp giọng nói sai " + JSON.stringify(r));
  if (errors.length) fails.push(...errors);
  console.log(JSON.stringify({ bestEn: r.bestEn, bestVi: r.bestVi, dt: r.dt, alts: r.alts, speakCalls: r.log.filter(x => x[0] === "speak") }));
  console.log(fails.length ? "❌ " + fails.join("\n") : "✅ Cầu nối Android (TTS/STT) hoạt động đúng, chọn giọng nữ mặc định đúng");
  await browser.close(); process.exit(fails.length ? 1 : 0);
})();
