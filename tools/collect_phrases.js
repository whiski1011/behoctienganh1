// Gom toàn bộ câu chữ app sẽ đọc → phrases.json  (node tools/collect_phrases.js app/www out.json)
const fs = require("fs"), path = require("path"), vm = require("vm");
const www = process.argv[2], out = process.argv[3];
const sb = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(www, "js/content.js"), "utf8"), sb);
const C = sb.window.CONTENT;
vm.runInNewContext(fs.readFileSync(path.join(www, "js/content_gs.js"), "utf8"), sb);
const GS = sb.window.GS;
const set = new Map();
const add = (lang, t) => { t = String(t).trim(); if (t) set.set(lang + "|" + t, { lang, text: t }); };
const LN = { A: "ay", B: "bee", C: "see", D: "dee", E: "ee", F: "ef", G: "jee", H: "aitch", I: "eye", J: "jay", K: "kay", L: "el", M: "em", N: "en", O: "oh", P: "pee", Q: "cue", R: "are", S: "ess", T: "tee", U: "you", V: "vee", W: "double you", X: "ex", Y: "why", Z: "zed" };

for (const u of C.units) {
  (u.words || []).forEach(w => { add("en", w[0]); add("vi", w[1]); });
  (u.sentences || []).forEach(s => {
    add("en", s[0]); add("vi", s[1]);
    s[0].split(/(?<=[.?!])\s+/).forEach(seg => add("en", seg));
  });
}
Object.values(GS).forEach(g => {
  (g.chant || []).forEach(l => { add("en", l[0]); });
  (g.talk || []).forEach(p => { add("en", p[0]); add("en", p[2]); });
  (g.tale || []).forEach(l => { add("en", l[0]); });
});
C.stories.forEach(s => {
  s.lines.forEach(l => { add("en", l[0]); add("vi", l[1]); });
  s.questions.forEach(q => { add("en", q[0]); add("vi", q[1]); q[2].forEach(a => add("en", a)); });
});
C.alphabet.forEach(([L, word]) => {
  add("en", LN[L]); add("en", word);
  add("en", `${LN[L]} is for ${word}.`); add("en", `${LN[L]}. ${word}`);
});

// câu ghép động (thời lượng nghe mỗi ngày)
["năm", "mười", "mười lăm"].forEach(w => { add("vi", `Mình cùng nghe tiếng Anh ${w} phút nhé!`); add("vi", `Con đã nghe đủ ${w} phút hôm nay!`); });
const isVi = t => /[^\x00-\x7F]/.test(t);
for (const f of ["app.js", "games.js"]) {
  const src = fs.readFileSync(path.join(www, "js", f), "utf8");
  const lits = [];
  // đối số trực tiếp của Speech.en/vi
  for (const m of src.matchAll(/Speech\.(en|vi)\(\s*"((?:[^"\\]|\\.)+)"/g)) add(m[1], JSON.parse('"' + m[2] + '"'));
  // mảng chuỗi (lời khen, tiêu đề...), toán tử ? : trong Speech.vi, lời dẫn cuối lệnh gọi trò chơi
  for (const m of src.matchAll(/\[((?:\s*"(?:[^"\\]|\\.)*"\s*,?)+)\]/g)) for (const x of m[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)) lits.push(x[1]);
  for (const m of src.matchAll(/Speech\.vi\([^;]*?\?\s*"([^"]+)"\s*:\s*"([^"]+)"/g)) { lits.push(m[1]); lits.push(m[2]); }
  for (const m of src.matchAll(/,\s*"([^"]+)"\s*\)\s*;/g)) lits.push(m[1]);
  for (const m of src.matchAll(/\["((?:[^"\\]|\\.)+)",\s*"(en|vi)"\]/g)) add(m[2], m[1]);
  // mọi chuỗi kết thúc bằng dấu câu (lời dẫn, lời nhắc)
  for (const m of src.matchAll(/"((?:[^"\\]|\\.)*[.!?])"/g)) lits.push(m[1]);
  lits.forEach(t => {
    if (!/[A-Za-zÀ-ỹ]/.test(t)) return;
    if (!/[\s.!?]/.test(t)) return;          // bỏ định danh / nhãn một từ
    if (/[<>{}$=·]/.test(t) || /[\u{1F000}-\u{1FFFF}\u2190-\u2BFF\u2600-\u27BF]/u.test(t)) return;
    add(isVi(t) ? "vi" : "en", t);
  });
}
const arr = [...set.values()].filter(x => !/node-hit/.test(x.text) && !(x.lang === "vi" && (x.text === "en" || /Google|^Hello! Chào|thu sẵn|^Cô chưa nghe rõ, thử lại|node-hit|–/.test(x.text))));
fs.writeFileSync(out, JSON.stringify(arr, null, 0));
console.log(`phrases: ${arr.length} (en ${arr.filter(x => x.lang === "en").length}, vi ${arr.filter(x => x.lang === "vi").length})`);
