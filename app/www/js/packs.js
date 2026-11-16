/* Bản web (GitHub Pages): nếu thư mục audio/ và img/ chưa được giải nén, app tự đọc thẳng từ
 * packs/audio.zip và packs/img.zip. Trên APK (có window.Native) không dùng tới file này. */
(function () {
  const P = { map: null, ready: Promise.resolve(), active: false };
  window.PACK = P;
  P.url = path => (P.map && P.map[path]) || path;

  // Đọc file zip (hỗ trợ kiểu lưu thẳng và kiểu nén deflate)
  async function unzip(buf, onEntry) {
    const dv = new DataView(buf), u8 = new Uint8Array(buf);
    let eocd = -1;
    for (let i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 70000); i--) if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    if (eocd < 0) throw new Error("zip hỏng");
    const n = dv.getUint16(eocd + 10, true); let p = dv.getUint32(eocd + 16, true);
    const dec = new TextDecoder();
    for (let k = 0; k < n; k++) {
      const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true);
      const nl = dv.getUint16(p + 28, true), xl = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true);
      const off = dv.getUint32(p + 42, true), name = dec.decode(u8.subarray(p + 46, p + 46 + nl));
      p += 46 + nl + xl + cl;
      if (name.endsWith("/")) continue;
      const ds = off + 30 + dv.getUint16(off + 26, true) + dv.getUint16(off + 28, true);
      let data = u8.subarray(ds, ds + csize);
      if (method === 8) data = new Uint8Array(await new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).arrayBuffer());
      onEntry(name, data);
    }
  }
  const TYPES = { ogg: "audio/ogg", mp3: "audio/mpeg", webp: "image/webp", png: "image/png" };

  async function load() {
    if (typeof window.Native !== "undefined" || !/^https?:$/.test(location.protocol)) return;
    // thử 1 file âm thanh: nếu có sẵn thì không cần gói
    const first = window.CLIPS && Object.values(window.CLIPS)[0];
    if (first) {
      try { const r = await fetch("audio/" + first + ".ogg", { method: "HEAD" }); if (r.ok) return; } catch (e) {}
    }
    P.active = true; P.map = {};
    const ov = document.createElement("div");
    ov.id = "packLoading";
    ov.innerHTML = `<div class="pl-card"><div class="pl-ic">🎧</div><b>Đang tải giọng đọc và hình ảnh…</b><div class="progress"><div id="plBar"></div></div><small id="plTxt">0%</small></div>`;
    document.body.appendChild(ov);
    const files = ["../../packs/img.zip", "../../packs/audio.zip"];
    let done = 0, total = 0, got = 0;
    const bufs = await Promise.all(files.map(async f => {
      const r = await fetch(f); if (!r.ok) throw new Error(f + " " + r.status);
      const len = +r.headers.get("content-length") || 0; total += len;
      const reader = r.body.getReader(), parts = [];
      for (;;) {
        const { done: d, value } = await reader.read(); if (d) break;
        parts.push(value); got += value.length;
        if (total) { const pc = Math.min(99, Math.round(got / total * 100)); document.getElementById("plBar").style.width = pc + "%"; document.getElementById("plTxt").textContent = pc + "%"; }
      }
      return await new Blob(parts).arrayBuffer();
    }));
    for (const b of bufs) await unzip(b, (name, data) => {
      const ext = name.split(".").pop();
      P.map[name] = URL.createObjectURL(new Blob([data], { type: TYPES[ext] || "application/octet-stream" }));
      done++;
    });
    // cập nhật các hình đã hiện trước khi gói tải xong
    document.querySelectorAll("img.e3d").forEach(im => { const s = im.getAttribute("src"); if (P.map[s]) im.src = P.map[s]; });
    ov.remove();
  }
  P.ready = new Promise(res => {
    document.addEventListener("DOMContentLoaded", () => load().catch(e => {
      console.warn("pack", e);
      const ov = document.getElementById("packLoading");
      if (ov) ov.innerHTML = `<div class="pl-card"><div class="pl-ic">⚠️</div><b>Không tải được gói âm thanh/hình</b><small>App vẫn chạy bằng giọng đọc của máy.</small><button class="big-btn" onclick="this.closest('#packLoading').remove()">OK</button></div>`;
    }).finally(res));
  });
})();
