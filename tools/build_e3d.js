// Gom mọi emoji app dùng → chép ảnh 3D (Fluent Emoji 3D, MIT) vào www/img/e + tạo js/e3d.js
const fs = require("fs"), path = require("path");
const www = process.argv[2], SRC = process.argv[3];
const out = path.join(www, "img/e"); fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
let text = "";
for (const f of ["content.js", "content_gs.js", "app.js", "games.js"]) text += fs.readFileSync(path.join(www, "js", f), "utf8");
text += fs.readFileSync(path.join(www, "index.html"), "utf8");
const seg = new Intl.Segmenter();
const isEmoji = g => /\p{Extended_Pictographic}|\p{Regional_Indicator}|⃣/u.test(g);
const map = {}; let miss = [];
const name = (g, keepFe0f) => [...g].map(c => c.codePointAt(0).toString(16)).filter(x => keepFe0f || x !== "fe0f").join("-");
for (const { segment: g } of seg.segment(text)) {
  if (!isEmoji(g) || map[g] !== undefined) continue;
  const cands = [name(g, false), name(g, true), name(g, false).replace(/-200d.*$/, "")];
  const hit = cands.find(n => fs.existsSync(path.join(SRC, n + ".webp")));
  if (hit) { fs.copyFileSync(path.join(SRC, hit + ".webp"), path.join(out, hit + ".webp")); map[g] = hit; }
  else { map[g] = null; miss.push(g); }
}
for (const k of Object.keys(map)) if (map[k] === null) delete map[k];
fs.writeFileSync(path.join(www, "js/e3d.js"), "window.E3D=" + JSON.stringify(map) + ";\n");
const kb = fs.readdirSync(out).reduce((s, f) => s + fs.statSync(path.join(out, f)).size, 0) / 1024;
console.log(`emoji 3D: ${Object.keys(map).length} ảnh, ${Math.round(kb)} KB; không có ảnh: ${miss.join(" ")}`);
