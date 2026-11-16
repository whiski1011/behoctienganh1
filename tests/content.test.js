// Kiểm thử dữ liệu bài học: node tests/content.test.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const www = path.join(__dirname, "..", "app", "www");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(www, "js/content.js"), "utf8"), sandbox);
const C = sandbox.window.CONTENT;
vm.runInNewContext(fs.readFileSync(path.join(www, "js/content_gs.js"), "utf8"), sandbox);
const GS = sandbox.window.GS;
let fails = 0, checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) { fails++; console.log("  ✗ " + msg); } };

ok(C.levels.length === 3, "3 cấp độ");
ok(C.alphabet.length === 26, "26 chữ cái");
ok(new Set(C.alphabet.map(a => a[0])).size === 26, "chữ cái không trùng");
C.alphabet.forEach(a => ok(a[1][0].toUpperCase() === a[0] || a[0] === "X", `từ ví dụ ${a[1]} bắt đầu bằng ${a[0]}`));
ok(new Set(C.units.map(u => u.id)).size === C.units.length, "id chủ đề không trùng");

const letters = s => s.replace(/[^A-Za-z]/g, "");
const segs = sents => sents.flatMap(s => s[0].split(/(?<=[.?!])\s+/)).filter(x => { const n = x.split(" ").length; return n >= 2 && n <= 7; });

for (const u of C.units) {
  if (u.type) continue;
  const tag = `[${u.id}]`;
  ok(u.words.length >= 6, `${tag} ít nhất 6 từ (có ${u.words.length})`);
  u.words.forEach(w => ok(w.length === 3 && w.every(x => typeof x === "string" && x.length), `${tag} từ hợp lệ ${JSON.stringify(w)}`));
  ok(new Set(u.words.map(w => w[0].toLowerCase())).size === u.words.length, `${tag} từ không trùng`);
  ok(new Set(u.words.map(w => w[2])).size === u.words.length, `${tag} hình không trùng (cần cho trò chọn hình)`);
  ok(u.sentences.length >= 3, `${tag} ít nhất 3 mẫu câu`);
  ok(new Set(u.sentences.map(s => s[2])).size >= 3, `${tag} mẫu câu có ≥3 hình khác nhau`);
  // mỗi câu phải có đủ 2 câu nhiễu với hình khác
  u.sentences.forEach(s => ok(u.sentences.filter(x => x[2] !== s[2]).length >= 2, `${tag} đủ câu nhiễu cho "${s[0]}"`));
  ok(segs(u.sentences).length >= 3, `${tag} đủ câu để xếp từ (${segs(u.sentences).length})`);
  ok(u.words.filter(w => letters(w[0]).length <= 10 && letters(w[0]).length >= 2).length >= 5, `${tag} đủ từ cho trò ghép chữ`);
  u.sentences.forEach(s => ok(/[.?!]$/.test(s[0]), `${tag} câu có dấu kết thúc: ${s[0]}`));
}
for (const u of C.units) {
  if (u.type === "story") continue;
  const g = GS[u.id]; ok(!!g && g.chant && g.chant.length >= 4, `[${u.id}] có vè (GrapeSEED)`);
  if (u.type) continue;
  ok(g.talk && g.talk.length >= 3 && g.talk.every(p => p.length === 5), `[${u.id}] có ≥3 cặp hội thoại`);
  ok(g.tale && g.tale.length >= 4 && new Set(g.tale.map(l => l[2])).size === g.tale.length, `[${u.id}] truyện có ≥4 câu, tranh không trùng`);
}
C.stories.forEach(s => {
  ok(s.lines.length >= 4, `truyện ${s.title} đủ dòng`);
  s.questions.forEach(q => { ok(q[2].length === 3, `câu hỏi ${q[0]} có 3 đáp án`); ok(new Set(q[2]).size === 3, `đáp án không trùng ${q[0]}`); });
});
const nWords = C.units.filter(u => !u.type).reduce((a, u) => a + u.words.length, 0);
const nSent = C.units.filter(u => !u.type).reduce((a, u) => a + u.sentences.length, 0);
console.log(`Nội dung: ${C.units.length} chủ đề, ${nWords} từ vựng, ${nSent} mẫu câu, ${C.stories.length} truyện, 26 chữ cái`);
console.log(fails ? `❌ ${fails}/${checks} kiểm tra lỗi` : `✅ ${checks} kiểm tra dữ liệu đều đạt`);
process.exit(fails ? 1 : 0);
