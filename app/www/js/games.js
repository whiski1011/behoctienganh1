/* Các minigame: Nghe – Nói – Đọc – Viết */
(function () {
  const C = window.CONTENT;
  const G = {};
  const W = w => ({ en: w[0], vi: w[1], pic: w[2] });
  const lettersOf = s => s.replace(/[^A-Za-z]/g, "");
  const readVi = () => App.state().readVi && !App.state().englishOnly;

  // ================== KHUNG DÙNG CHUNG ==================
  /* Trò chơi chọn đáp án.
     rounds: [{ target, options:[item], prompt:(html), say:()=>Promise, after:()=>Promise }]
     item: { key, html, cls } */
  function choiceGame(ctx, rounds, intro) {
    let i = 0, correct = 0;
    const S = ctx.stage;
    const run = async () => {
      if (!ctx.alive()) return;
      if (i >= rounds.length) return ctx.finish(correct, rounds.length);
      ctx.progress(i, rounds.length);
      const r = rounds[i];
      let first = true, locked = false;
      S.innerHTML = "";
      const pr = ctx.el("div", "prompt", r.prompt);
      S.appendChild(pr);
      const sb = pr.querySelector(".speak-btn");
      if (sb) sb.onclick = () => r.say();
      const grid = ctx.el("div", "choices");
      r.options.forEach(o => {
        const b = ctx.el("button", "choice " + (o.cls || ""), o.html);
        b.onclick = async () => {
          if (locked || b.classList.contains("dim")) return;
          if (o.key === r.target.key) {
            locked = true; if (first) correct++;
            ctx.good(b, first ? 10 : 5);
            grid.querySelectorAll(".choice").forEach(x => { if (x !== b) x.classList.add("dim"); });
            await (r.after ? r.after() : ctx.praise());
            await ctx.wait(350); i++; run();
          } else {
            first = false; ctx.bad(b); b.classList.add("dim");
            if (r.onWrong) r.onWrong(); else if (r.say) r.say();
          }
        };
        grid.appendChild(b);
      });
      S.appendChild(grid);
      if (r.say) { await ctx.wait(250); r.say(); }
    };
    (async () => { if (intro) await Speech.vi(intro); run(); })();
  }

  function distractors(pool, target, n, keyFn = x => x.en, picFn = x => x.pic) {
    const others = pool.filter(x => keyFn(x) !== keyFn(target) && picFn(x) !== picFn(target));
    const seen = new Set(); const out = [];
    for (const x of App.shuffle(others)) { if (seen.has(picFn(x))) continue; seen.add(picFn(x)); out.push(x); if (out.length >= n) break; }
    return out;
  }
  const speakBtn = (label = "🔊") => `<button class="speak-btn pulse">${label}</button>`;

  /* Bóng bay: rounds [{ target:{key}, items:[{key, html, color}], say }] */
  const BCOL = ["#ef5350", "#42a5f5", "#66bb6a", "#ffca28", "#ab47bc", "#ff7043", "#26c6da", "#ec407a"];
  function balloonGame(ctx, rounds, intro) {
    let i = 0, correct = 0;
    const S = ctx.stage;
    S.innerHTML = "";
    const pr = ctx.el("div", "prompt", `<div class="p-title">Nghe rồi bắn trúng bóng bay đúng nhé!</div>${speakBtn()}`);
    const sky = ctx.el("div", "sky");
    S.appendChild(pr); S.appendChild(sky);
    pr.querySelector(".speak-btn").onclick = () => rounds[i] && rounds[i].say();
    let first = true, locked = false;
    function spawn() {
      if (!ctx.alive()) return;
      sky.innerHTML = "";
      const r = rounds[i];
      const n = r.items.length;
      const slots = App.shuffle([...Array(n).keys()]);
      r.items.forEach((it, k) => {
        const b = ctx.el("div", "balloon", it.html);
        const col = BCOL[(i * 3 + k) % BCOL.length];
        b.style.background = col; b.style.borderTopColor = col;
        b.style.left = `calc(${(slots[k] + 0.5) * (100 / n)}% - 42px)`;
        const dur = 7.5 + Math.random() * 2.5;
        b.style.animationDuration = dur + "s";
        b.style.animationDelay = (k * 0.35 + Math.random() * 0.4) + "s";
        b.onpointerdown = async e => {
          e.preventDefault();
          if (locked || b.classList.contains("popped") || b.classList.contains("nope")) return;
          if (it.key === r.target.key) {
            locked = true; if (first) correct++;
            SFX.pop(); b.classList.add("popped"); ctx.good(null, first ? 10 : 5); ctx.addScore(0);
            const rect = b.getBoundingClientRect();
            const f = ctx.el("div", "floating-plus", "+" + (first ? 10 : 5)); f.style.left = rect.left + 30 + "px"; f.style.top = rect.top + "px";
            document.body.appendChild(f); setTimeout(() => f.remove(), 1000);
            await ctx.praise(); await ctx.wait(300); i++; next();
          } else {
            first = false; ctx.bad(b); b.classList.add("nope"); r.say();
          }
        };
        if (it.key === r.target.key) b.addEventListener("animationend", ev => {
          if (ev.animationName === "rise" && !locked && ctx.alive()) { ctx.timer(() => { spawn(); r.say(); }, 200); }
        });
        sky.appendChild(b);
      });
    }
    function next() {
      if (!ctx.alive()) return;
      if (i >= rounds.length) return ctx.finish(correct, rounds.length);
      ctx.progress(i, rounds.length);
      first = true; locked = false; spawn(); ctx.timer(() => rounds[i].say(), 400);
    }
    (async () => { if (intro) await Speech.vi(intro); next(); })();
  }

  /* Lật thẻ: pairs [{ key, a:html, b:html, say }] */
  function memoryGame(ctx, pairs, intro) {
    const S = ctx.stage; S.innerHTML = "";
    S.appendChild(ctx.el("div", "prompt", `<div class="p-title">Lật 2 thẻ giống nhau: hình và chữ</div>`));
    const grid = ctx.el("div", "mem-grid"); S.appendChild(grid);
    const cards = App.shuffle(pairs.flatMap(p => [{ p, side: "a" }, { p, side: "b" }]));
    let open = [], matched = 0, misses = 0, busy = false;
    cards.forEach(c => {
      const d = ctx.el("div", "mcard", `<div class="face back">❓</div><div class="face front">${c.side === "a" ? c.p.a : c.p.b}</div>`);
      d.dataset.key = c.p.key;
      d.onclick = async () => {
        if (busy || d.classList.contains("flip")) return;
        SFX.flip(); d.classList.add("flip"); open.push({ c, d });
        if (c.side === "b" || c.p.sayBoth) c.p.say();
        if (open.length === 2) {
          busy = true;
          const [x, y] = open; open = [];
          if (x.c.p.key === y.c.p.key) {
            await ctx.wait(350);
            x.d.classList.add("matched"); y.d.classList.add("matched");
            ctx.good(y.d, 10); matched++; ctx.progress(matched, pairs.length);
            await x.c.p.say();
            busy = false;
            if (matched === pairs.length) {
              await ctx.wait(500);
              const stars = misses <= pairs.length / 2 ? 3 : misses <= pairs.length + 1 ? 2 : 1;
              ctx.finish(0, 0, { stars, detail: `Ghép đúng ${pairs.length} cặp · lật sai ${misses} lần` });
            }
          } else {
            misses++; SFX.wrong();
            await ctx.wait(900);
            x.d.classList.remove("flip"); y.d.classList.remove("flip"); busy = false;
          }
        }
      };
      grid.appendChild(d);
    });
    if (intro) Speech.vi(intro);
  }

  /* Thẻ học: cards [{ html, say:()=>Promise }] */
  function flashGame(ctx, cards, intro, doneText) {
    let i = 0;
    const S = ctx.stage;
    const render = () => {
      if (!ctx.alive()) return;
      ctx.progress(i + 1, cards.length);
      const c = cards[i];
      S.innerHTML = "";
      const f = ctx.el("div", "flash pop-in", c.html);
      const btns = ctx.el("div", "f-btns");
      const b1 = ctx.el("button", "speak-btn", "🔊"); b1.onclick = () => c.say(false);
      const b2 = ctx.el("button", "speak-btn slow", "🐢"); b2.onclick = () => c.say(true);
      btns.append(b1, b2);
      if (c.extraBtn) btns.appendChild(c.extraBtn());
      f.appendChild(btns);
      S.appendChild(f);
      if (c.below) S.appendChild(c.below());
      const nav = ctx.el("div", "nav-row");
      const prev = ctx.el("button", "big-btn alt", "⬅️ Trước"); prev.disabled = i === 0;
      prev.onclick = () => { if (i > 0) { i--; SFX.whoosh(); render(); } };
      const last = i === cards.length - 1;
      const nx = ctx.el("button", "big-btn " + (last ? "ok" : ""), last ? "✅ Xong" : "Tiếp ➡️");
      nx.onclick = () => {
        if (last) { ctx.addScore(5, nx); ctx.finish(0, 0, { stars: 3, detail: doneText }); return; }
        ctx.addScore(5, nx); i++; SFX.whoosh(); render();
      };
      nav.append(prev, nx); S.appendChild(nav);
      c.say(false);
    };
    (async () => { if (intro) await Speech.vi(intro); render(); })();
  }

  // ================== TỪ VỰNG ==================
  G.learn = ctx => {
    const words = ctx.words.map(W);
    flashGame(ctx, words.map(w => ({
      html: `${App.pic(w.pic)}<div class="f-en">${App.esc(w.en)}</div><div class="f-vi">${App.esc(w.vi)}</div>`,
      say: async slow => { await Speech.en(w.en, { slow }); if (!slow && readVi() && ctx.alive()) { await Speech.vi(w.vi, { flush: false }); } }
    })), "Mình cùng học từ mới nhé! Con nghe và đọc theo cô nha.", `Bé đã học ${words.length} từ mới`);
  };

  G.listen = ctx => {
    const words = ctx.words.map(W);
    const targets = App.sample(words, Math.min(8, words.length));
    choiceGame(ctx, targets.map(t => ({
      target: { key: t.en },
      prompt: `<div class="p-title">Nghe và chọn hình đúng</div>${speakBtn()}`,
      say: () => Speech.en(t.en),
      after: async () => { await Speech.en(t.en); if (readVi()) await Speech.vi(t.vi, { flush: false }); },
      options: App.shuffle([t, ...distractors(words, t, 3)]).map(o => ({ key: o.en, html: App.pic(o.pic) }))
    })), "Con hãy nghe và chọn hình đúng nhé!");
  };

  G.balloon = ctx => {
    const words = ctx.words.map(W);
    const targets = App.sample(words, Math.min(8, words.length));
    const showWord = ctx.level >= 3;
    balloonGame(ctx, targets.map(t => ({
      target: { key: t.en },
      say: () => Speech.en(t.en),
      items: [t, ...distractors(words, t, 3)].map(o => ({ key: o.en, html: showWord ? `<div class="b-word">${App.esc(o.en)}</div>` : App.pic(o.pic) }))
    })), "Con nghe từ tiếng Anh, rồi chạm vào quả bóng bay đúng nhé!");
  };

  G.readpic = ctx => {
    const words = ctx.words.map(W);
    const targets = App.sample(words, Math.min(8, words.length));
    choiceGame(ctx, targets.map(t => ({
      target: { key: t.en },
      prompt: `<div class="p-title">Đọc từ rồi chọn hình đúng</div><div class="p-big">${App.esc(t.en)}</div>`,
      after: async () => { await Speech.en(t.en); if (readVi()) await Speech.vi(t.vi, { flush: false }); },
      onWrong: () => {},
      options: App.shuffle([t, ...distractors(words, t, 3)]).map(o => ({ key: o.en, html: App.pic(o.pic) }))
    })), "Con đọc từ tiếng Anh, rồi chọn hình đúng nhé!");
  };

  G.memory = ctx => {
    const words = App.sample(ctx.words.map(W), 6);
    memoryGame(ctx, words.map(w => ({ key: w.en, a: App.pic(w.pic), b: App.esc(w.en), say: () => Speech.en(w.en) })),
      "Con lật hai thẻ: một hình và một chữ giống nhau nhé!");
  };

  G.spell = ctx => {
    const pool = ctx.words.map(W).filter(w => lettersOf(w.en).length <= 10 && lettersOf(w.en).length >= 2);
    const targets = App.sample(pool, Math.min(5, pool.length));
    const extra = ctx.level === 1 ? 0 : ctx.level === 2 ? 1 : 2;
    let i = 0, correct = 0;
    const S = ctx.stage;
    const run = () => {
      if (!ctx.alive()) return;
      if (i >= targets.length) return ctx.finish(correct, targets.length);
      ctx.progress(i, targets.length);
      const t = targets[i];
      let pos = 0, first = true;
      const chars = [...t.en];
      const need = chars.map((ch, k) => (/[A-Za-z]/.test(ch) ? k : -1)).filter(k => k >= 0);
      S.innerHTML = "";
      const pr = ctx.el("div", "prompt", `${App.pic(t.pic)}<div class="p-vi">${App.esc(t.vi)}</div>${speakBtn()}`);
      pr.style.setProperty("--pic-size", "80px"); pr.style.setProperty("--pic-box", "90px");
      pr.querySelector(".speak-btn").onclick = () => Speech.en(t.en);
      const slots = ctx.el("div", "slots");
      const slotEls = chars.map(ch => {
        const s = ctx.el("div", "slot" + (ch === " " ? " space" : /[A-Za-z]/.test(ch) ? "" : " fixed"), /[A-Za-z ]/.test(ch) ? "" : ch);
        slots.appendChild(s); return s;
      });
      const alpha = "abcdefghijklmnopqrstuvwxyz";
      const tileChars = need.map(k => chars[k]);
      for (let e = 0; e < extra; e++) { let c; do { c = alpha[Math.floor(Math.random() * 26)]; } while (tileChars.map(x => x.toLowerCase()).includes(c)); tileChars.push(c); }
      const tiles = ctx.el("div", "tiles");
      App.shuffle(tileChars).forEach(ch => {
        const b = ctx.el("button", "tile", ch);
        b.onclick = async () => {
          if (pos >= need.length || b.classList.contains("used")) return;
          const want = chars[need[pos]];
          if (ch.toLowerCase() === want.toLowerCase()) {
            SFX.click(); b.classList.add("used");
            const s = slotEls[need[pos]]; s.textContent = want; s.classList.add("filled"); pos++;
            if (pos === need.length) {
              if (first) correct++;
              ctx.good(slots, first ? 10 : 5);
              await Speech.en(t.en); await ctx.praise(); await ctx.wait(300); i++; run();
            }
          } else { first = false; ctx.bad(b); }
        };
        tiles.appendChild(b);
      });
      S.append(pr, slots, tiles);
      ctx.timer(() => Speech.en(t.en), 200);
    };
    (async () => { await Speech.vi("Con nghe từ, rồi chọn các chữ cái để ghép thành từ đúng nhé!"); run(); })();
  };

  G.missing = ctx => {
    const pool = ctx.words.map(W).filter(w => lettersOf(w.en).length >= 2);
    const targets = App.sample(pool, Math.min(8, pool.length));
    const nOpt = ctx.level === 3 ? 4 : 3;
    choiceGame(ctx, targets.map(t => {
      const idx = [...t.en].map((c, k) => (/[A-Za-z]/.test(c) ? k : -1)).filter(k => k >= 0);
      const k = App.pick(idx);
      const ans = t.en[k].toLowerCase();
      const shown = App.esc(t.en.slice(0, k)) + `<span style="color:var(--accent2)">_</span>` + App.esc(t.en.slice(k + 1));
      const alpha = "abcdefghijklmnopqrstuvwxyz".split("").filter(c => c !== ans);
      const opts = App.shuffle([ans, ...App.sample(alpha, nOpt - 1)]);
      return {
        target: { key: ans },
        prompt: `${App.pic(t.pic)}<div class="p-big" style="letter-spacing:3px">${shown}</div>${speakBtn()}`,
        say: () => Speech.en(t.en),
        onWrong: () => {},
        after: async () => { await Speech.en(t.en); await ctx.praise(); },
        options: opts.map(c => ({ key: c, html: c, cls: "text" }))
      };
    }), "Con hãy chọn chữ cái còn thiếu để hoàn thành từ nhé!");
  };

  // ================== NÓI – CHẾ ĐỘ RẢNH TAY ==================
  // Bé chỉ cần bấm 🎤 một lần. Từ đó: cô đọc mẫu → máy tự nghe → bé nói xong (ngừng ~1 giây) máy tự chấm,
  // tự khen / tự cho thử lại (tối đa 3 lần) / tự sang câu tiếp. Bấm 🎤 khi đang nghe = tạm dừng rảnh tay.
  function voiceTurn(ctx, o) {
    return new Promise(resolve => {
      let tries = 0, best = 0, active = false, finished = false;
      const done = v => { if (finished) return; finished = true; Speech.stopListen(); resolve(v); };
      const heard = () => o.box.querySelector(".heard") || o.box.appendChild(ctx.el("div", "heard"));
      const setHands = on => { o.hands.on = on; o.box.classList.toggle("hands", on); };
      const fail = (msg) => { heard().textContent = msg; setHands(false); };
      async function listenOnce() {
        if (!ctx.alive() || finished || active) return;
        active = true; o.mic.classList.add("listening"); o.box.classList.add("is-listening");
        heard().textContent = "👂 Cô đang nghe… con nói đi nào!";
        try {
          const alts = await Speech.listen("en", m => {
            if (m.type === "ready") heard().textContent = "🗣️ Con nói đi nào…";
            if (m.type === "partial" && m.text) heard().textContent = "🗣️ " + m.text;
          });
          active = false; o.mic.classList.remove("listening"); o.box.classList.remove("is-listening");
          if (!ctx.alive() || finished) return;
          tries++;
          const r = Speech.pronScore(o.target, alts); best = Math.max(best, r.score);
          o.box.innerHTML = scoreHtml(r); o.box.appendChild(o.mic);
          ctx.addScore(Math.round(r.score / 10), o.box);
          if (o.onScore) o.onScore(r);
          if (r.score >= 85) {
            ctx.good(null, 0); [0, 1, 2].forEach(k => setTimeout(() => SFX.star(k), 200 + k * 180));
            await Speech.vi("Xuất sắc! Con phát âm rất chuẩn!"); await ctx.wait(400); return done(best);
          }
          if (r.score >= (o.pass || 70)) {
            SFX.star(0); await Speech.vi("Tốt lắm! Con đọc gần đúng rồi!"); await ctx.wait(300); return done(best);
          }
          SFX.wrong();
          if (tries >= 3) { await Speech.vi("Mình sang câu tiếp nhé!"); return done(best); }
          await Speech.vi("Con nghe cô đọc lại rồi thử lần nữa nhé!");
          await Speech.en(o.target, { slow: true, flush: false });
          if (!ctx.alive() || finished) return;
          if (o.hands.on) listenOnce(); else heard().textContent = "Bấm 🎤 để thử lại";
        } catch (err) {
          active = false; o.mic.classList.remove("listening"); o.box.classList.remove("is-listening");
          if (!ctx.alive() || finished) return;
          const code = String(err && err.code);
          if (code === "cancel") return;
          if (code === "permission" || code === "9" || code === "not-allowed") return fail("⚠️ Cần cho phép dùng micro trong cài đặt máy");
          if (code === "unavailable" || code === "5" || code === "bridge") return fail("⚠️ Máy chưa có dịch vụ nhận giọng nói (cài ứng dụng Google)");
          tries++;
          if (tries >= 3) { await Speech.vi("Mình sang câu tiếp nhé!"); return done(best); }
          await Speech.vi("Cô chưa nghe rõ, con nói to hơn nhé!");
          if (!ctx.alive() || finished) return;
          if (o.hands.on) listenOnce(); else heard().textContent = "Bấm 🎤 để nói lại";
        }
      }
      o.mic.onclick = () => {
        if (finished) return;
        if (active) {                 // đang nghe mà bấm → tạm dừng rảnh tay
          setHands(false); Speech.stopListen(); window.__stt({ type: "error", code: "cancel" });
          heard().textContent = "⏸️ Đã tạm dừng. Bấm 🎤 để nói tiếp"; return;
        }
        setHands(true); Speech.stop(); listenOnce();
      };
      if (o.skip) o.skip.onclick = () => { if (!finished) done(best); };
      setHands(o.hands.on);
      (async () => {
        await (o.model ? o.model() : Promise.resolve());
        if (ctx.alive() && !finished && !active && o.hands.on) { await ctx.wait(250); listenOnce(); }
      })();
    });
  }
  function voiceBox(ctx, can) {
    const box = ctx.el("div", "pron-box center", can
      ? `<div class="hands-tag">🙌 Rảnh tay: tự nghe – tự chấm</div><div class="heard">Bấm 🎤 một lần rồi đọc theo cô nhé!</div>`
      : `<div class="heard">⚠️ Máy chưa có dịch vụ nhận giọng nói (cần ứng dụng Google), nên chưa chấm điểm được.</div>`);
    const mic = ctx.el("button", "mic-btn", "🎤");
    if (can) box.appendChild(mic);
    return { box, mic };
  }

  function speakGame(ctx, items, intro, opts = {}) {
    let i = 0, correct = 0;
    const S = ctx.stage, can = Speech.canListen(), hands = { on: false };
    const run = async () => {
      if (!ctx.alive()) return;
      if (i >= items.length) return ctx.finish(correct, items.length);
      ctx.progress(i, items.length);
      const t = items[i];
      S.innerHTML = "";
      const f = ctx.el("div", "flash pop-in", `${App.pic(t.pic)}<div class="${opts.sentence ? "f-sent" : "f-en"}">${App.esc(t.en)}</div><div class="f-vi">${App.esc(t.vi)}</div>`);
      const btns = ctx.el("div", "f-btns");
      const b1 = ctx.el("button", "speak-btn", "🔊"); b1.onclick = () => Speech.en(t.en);
      const b2 = ctx.el("button", "speak-btn slow", "🐢"); b2.onclick = () => Speech.en(t.en, { slow: true });
      btns.append(b1, b2); f.appendChild(btns);
      const { box, mic } = voiceBox(ctx, can);
      const row = ctx.el("div", "nav-row"); const skip = ctx.el("button", "big-btn alt", "⏭️ Bỏ qua"); row.append(skip);
      S.append(f, box, row);
      if (!can) {
        const self = ctx.el("button", "big-btn ok", "👍 Con đã đọc xong"); box.appendChild(self);
        await new Promise(res => { self.onclick = res; skip.onclick = res; ctx.timer(() => Speech.en(t.en), 250); });
        correct++; i++; return run();
      }
      const sc = await voiceTurn(ctx, { target: t.en, box, mic, hands, skip, model: () => ctx.wait(250).then(() => Speech.en(t.en)) });
      if (sc >= 70) correct++;
      i++; run();
    };
    (async () => { await Speech.vi(intro); run(); })();
  }

  // ================== KIỂM TRA PHÁT ÂM ==================
  function scoreColor(n) { return n >= 85 ? "#2e7d32" : n >= 60 ? "#ef6c00" : "#c62828"; }
  function scoreHtml(r) {
    return `<div class="pron-score" style="color:${scoreColor(r.score)}">${r.score}<small>/100</small></div>
      <div class="pron-words">${r.words.map(x => `<span class="pw ${x.ok ? "ok" : x.part ? "part" : "bad"}">${App.esc(x.w)}</span>`).join(" ")}</div>
      <div class="muted small">Cô nghe được: “${App.esc(r.heard || "...")}”</div>`;
  }
  G.pron = ctx => {
    const words = App.sample(ctx.words.map(W), Math.min(5, ctx.words.length));
    const sents = App.sample(segments(ctx.sentences.map(W)), 3);
    const items = [...words, ...sents];
    const can = Speech.canListen(), hands = { on: false };
    const S = ctx.stage;
    const results = [];
    let i = 0;
    const run = async () => {
      if (!ctx.alive()) return;
      if (i >= items.length) {
        const avg = Math.round(results.reduce((a, b) => a + b, 0) / Math.max(1, results.length));
        const stars = avg >= 85 ? 3 : avg >= 65 ? 2 : 1;
        return ctx.finish(0, 0, { stars, pron: avg, detail: `Điểm phát âm trung bình: ${avg}/100` });
      }
      ctx.progress(i, items.length);
      const t = items[i];
      S.innerHTML = "";
      const f = ctx.el("div", "flash pop-in", `${App.pic(t.pic)}<div class="${t.en.includes(" ") ? "f-sent" : "f-en"}">${App.esc(t.en)}</div><div class="f-vi">${App.esc(t.vi)}</div>`);
      const btns = ctx.el("div", "f-btns");
      const b1 = ctx.el("button", "speak-btn", "🔊"); b1.onclick = () => Speech.en(t.en);
      const b2 = ctx.el("button", "speak-btn slow", "🐢"); b2.onclick = () => Speech.en(t.en, { slow: true });
      btns.append(b1, b2); f.appendChild(btns);
      const { box, mic } = voiceBox(ctx, can);
      const row = ctx.el("div", "nav-row"); const skip = ctx.el("button", "big-btn alt", "⏭️ Bỏ qua"); row.append(skip);
      S.append(f, box, row);
      if (!can) { await new Promise(res => { skip.onclick = res; }); results.push(0); i++; return run(); }
      const sc = await voiceTurn(ctx, { target: t.en, box, mic, hands, skip, model: () => ctx.wait(250).then(() => Speech.en(t.en)) });
      results.push(sc); i++; run();
    };
    (async () => { await Speech.vi("Mình cùng kiểm tra phát âm nhé! Con nghe cô đọc, rồi bấm micro và đọc theo."); run(); })();
  };

  G.speak = ctx => {
    const words = App.sample(ctx.words.map(W), Math.min(6, ctx.words.length));
    speakGame(ctx, words, "Con nghe cô đọc, rồi bấm micro và nói theo nhé!");
  };

  // ================== MẪU CÂU ==================
  function sentHtml(s) {
    return s.en.split(" ").map((w, k) => `<span class="word-hl" data-k="${k}">${App.esc(w)}</span>`).join(" ");
  }
  function highlightWhile(node, s, slow) {
    const spans = node.querySelectorAll(".word-hl");
    const per = (slow ? 620 : 380);
    let k = 0;
    const tick = () => { spans.forEach(x => x.classList.remove("on")); if (k < spans.length) { spans[k].classList.add("on"); k++; setTimeout(tick, per * Math.max(1, spans[k - 1].textContent.length / 5)); } };
    tick();
  }
  G.sentences = ctx => {
    const sents = ctx.sentences.map(W);
    const can = Speech.canListen();
    flashGame(ctx, sents.map(s => {
      let node;
      const card = {
        html: `${App.pic(s.pic)}<div class="f-sent">${sentHtml(s)}</div><div class="f-vi">${App.esc(s.vi)}</div>`,
        say: async slow => {
          node = ctx.stage.querySelector(".flash");
          if (node) highlightWhile(node, s, slow);
          await Speech.en(s.en, { slow });
          if (!slow && readVi() && ctx.alive()) await Speech.vi(s.vi, { flush: false });
        }
      };
      if (can) card.extraBtn = () => {
        const b = ctx.el("button", "speak-btn", "🎤"); b.style.background = "var(--bad)";
        b.onclick = async () => {
          b.classList.add("pulse");
          try {
            const alts = await Speech.listen("en");
            b.classList.remove("pulse");
            const pr = Speech.pronScore(s.en, alts);
            App.toast(`🎯 ${pr.score}/100 – Cô nghe: "${alts[0] || "..."}"`, 3000);
            if (pr.score >= 70) { ctx.good(b, 10); Speech.en("Excellent!"); }
            else { SFX.wrong(); }
          } catch (e) { b.classList.remove("pulse"); App.toast("Cô chưa nghe rõ, thử lại nhé!"); }
        };
        return b;
      };
      return card;
    }), "Mình cùng học mẫu câu nhé! Con nghe rồi nói theo nha.", `Bé đã học ${sents.length} mẫu câu`);
  };

  G.sentListen = ctx => {
    const sents = ctx.sentences.map(W);
    const targets = App.shuffle(sents);
    choiceGame(ctx, targets.map(t => ({
      target: { key: t.en },
      prompt: `<div class="p-title">Nghe câu và chọn hình đúng</div>${speakBtn()}<button class="speak-btn slow" onclick="Speech.en(${App.esc(JSON.stringify(t.en))},{slow:true})">🐢</button>`,
      say: () => Speech.en(t.en),
      after: async () => { await Speech.en(t.en); if (readVi()) await Speech.vi(t.vi, { flush: false }); },
      options: App.shuffle([t, ...distractors(sents, t, 2)]).map(o => ({ key: o.en, html: App.pic(o.pic) }))
    })), "Con nghe câu tiếng Anh và chọn hình đúng nhé!");
  };

  function segments(sents) {
    const out = [];
    sents.forEach(s => {
      s.en.split(/(?<=[.?!])\s+/).forEach(seg => {
        const n = seg.split(" ").length;
        if (n >= 2 && n <= 7) out.push({ en: seg, vi: s.vi, pic: s.pic });
      });
    });
    return out;
  }
  G.builder = ctx => {
    const segs = App.sample(segments(ctx.sentences.map(W)), 5);
    let i = 0, correct = 0;
    const S = ctx.stage;
    const run = () => {
      if (!ctx.alive()) return;
      if (i >= segs.length) return ctx.finish(correct, segs.length);
      ctx.progress(i, segs.length);
      const t = segs[i];
      const m = t.en.match(/^(.*?)([.?!]*)$/);
      const words = m[1].split(" ");
      const punct = m[2] || "";
      let pos = 0, first = true;
      S.innerHTML = "";
      const pr = ctx.el("div", "prompt", `${App.pic(t.pic)}<div class="p-vi">${App.esc(t.vi)}</div>${speakBtn()}`);
      pr.style.setProperty("--pic-size", "64px");
      pr.querySelector(".speak-btn").onclick = () => Speech.en(t.en);
      const built = ctx.el("div", "built", "");
      const tiles = ctx.el("div", "tiles");
      let order = App.shuffle(words.map((w, k) => ({ w, k })));
      if (order.every((o, k) => o.k === k) && words.length > 1) order = order.reverse();
      order.forEach(o => {
        const b = ctx.el("button", "tile word", App.esc(o.w));
        b.onclick = async () => {
          if (b.classList.contains("used") || pos >= words.length) return;
          if (o.w.toLowerCase() === words[pos].toLowerCase()) {
            SFX.click(); b.classList.add("used");
            built.appendChild(ctx.el("span", "tile word", App.esc(words[pos]) + (pos === words.length - 1 ? punct : "")));
            pos++;
            if (pos === words.length) {
              if (first) correct++;
              ctx.good(built, first ? 10 : 5);
              await Speech.en(t.en); await ctx.praise(); await ctx.wait(300); i++; run();
            }
          } else { first = false; ctx.bad(b); }
        };
        tiles.appendChild(b);
      });
      S.append(pr, built, tiles);
      ctx.timer(() => Speech.en(t.en), 200);
    };
    (async () => { await Speech.vi("Con nghe câu, rồi chạm vào các từ theo đúng thứ tự để xếp thành câu nhé!"); run(); })();
  };

  // ================== BẢNG CHỮ CÁI ==================
  const AB = () => C.alphabet.map(a => ({ L: a[0], word: a[1], pic: a[2] }));
  const sayLetter = L => Speech.en(Speech.letterName(L));
  G.abcLearn = ctx => {
    flashGame(ctx, AB().map(a => ({
      html: `<div class="f-en" style="font-size:90px">${a.L}${a.L.toLowerCase()}</div>${App.pic(a.pic)}<div class="f-sent">${a.L} is for ${App.esc(a.word)}</div>`,
      say: async slow => { await Speech.en(Speech.letterName(a.L), { slow }); await Speech.en(`${Speech.letterName(a.L)} is for ${a.word}.`, { slow, flush: false }); }
    })), "Mình cùng học bảng chữ cái tiếng Anh nhé!", "Bé đã học 26 chữ cái");
  };
  G.abcListen = ctx => {
    const all = AB();
    const targets = App.sample(all, 10);
    choiceGame(ctx, targets.map(t => ({
      target: { key: t.L },
      prompt: `<div class="p-title">Nghe và chọn chữ cái đúng</div>${speakBtn()}`,
      say: () => sayLetter(t.L),
      after: async () => { await Speech.en(`${Speech.letterName(t.L)}. ${t.word}`); },
      options: App.shuffle([t, ...App.sample(all.filter(x => x.L !== t.L), 3)]).map(o => ({ key: o.L, html: `<span style="font-size:48px">${o.L}${o.L.toLowerCase()}</span>` }))
    })), "Con nghe tên chữ cái và chọn chữ đúng nhé!");
  };
  G.abcSound = ctx => {
    const all = AB();
    const targets = App.sample(all, 8);
    choiceGame(ctx, targets.map(t => ({
      target: { key: t.L },
      prompt: `<div class="p-title">Từ này bắt đầu bằng chữ cái nào?</div>${App.pic(t.pic)}<div class="p-big">${App.esc(t.word)}</div>${speakBtn()}`,
      say: () => Speech.en(t.word),
      onWrong: () => {},
      after: async () => { await Speech.en(`${Speech.letterName(t.L)} is for ${t.word}.`); },
      options: App.shuffle([t, ...App.sample(all.filter(x => x.L !== t.L), 2)]).map(o => ({ key: o.L, html: `<span style="font-size:48px">${o.L}</span>`, cls: "text" }))
    })), "Con xem hình, nghe từ, rồi chọn chữ cái đầu tiên của từ nhé!");
  };
  G.abcBalloon = ctx => {
    const all = AB();
    const targets = App.sample(all, 8);
    balloonGame(ctx, targets.map(t => ({
      target: { key: t.L },
      say: () => sayLetter(t.L),
      items: [t, ...App.sample(all.filter(x => x.L !== t.L), 3)].map(o => ({ key: o.L, html: `<div class="b-word" style="font-size:40px">${o.L}${o.L.toLowerCase()}</div>` }))
    })), "Con nghe tên chữ cái, rồi bắn quả bóng có chữ đó nhé!");
  };
  G.abcMatch = ctx => {
    const pairs = App.sample(AB(), 6);
    memoryGame(ctx, pairs.map(a => ({ key: a.L, a: `<span style="font-size:46px">${a.L}</span>`, b: `<span style="font-size:46px">${a.L.toLowerCase()}</span>`, say: () => sayLetter(a.L), sayBoth: true })),
      "Con tìm chữ hoa và chữ thường giống nhau nhé!");
  };

  // ================== TÔ CHỮ (VIẾT) ==================
  G.trace = ctx => {
    const all = AB();
    const list = App.sample(all, 8).map((a, k) => ({ ch: k % 2 ? a.L.toLowerCase() : a.L, a }));
    let i = 0, correct = 0;
    const S = ctx.stage;
    const run = async () => {
      if (!ctx.alive()) return;
      if (i >= list.length) return ctx.finish(correct, list.length);
      ctx.progress(i, list.length);
      const t = list[i]; let first = true;
      S.innerHTML = "";
      const pr = ctx.el("div", "prompt", `<div class="p-title">Dùng ngón tay tô theo chữ <b>${t.ch}</b> (${t.a.L} – ${App.esc(t.a.word)} ${t.a.pic})</div>`);
      const size = Math.min(window.innerWidth - 40, window.innerHeight - 330, 380);
      const wrap = ctx.el("div", "trace-wrap"); wrap.style.width = size + "px"; wrap.style.height = size + "px";
      const cv = document.createElement("canvas"); wrap.appendChild(cv);
      const dpr = window.devicePixelRatio || 1;
      cv.width = size * dpr; cv.height = size * dpr;
      const g = cv.getContext("2d"); g.scale(dpr, dpr);
      const LOW = 100, sc = LOW / size;
      const guide = document.createElement("canvas"); guide.width = guide.height = LOW;
      const user = document.createElement("canvas"); user.width = user.height = LOW;
      const gg = guide.getContext("2d"), ug = user.getContext("2d");
      const font = sz => `800 ${sz}px "Baloo 2", "Arial Rounded MT Bold", sans-serif`;
      try { await document.fonts.load(font(100)); } catch (e) {}
      const drawGuide = () => {
        g.clearRect(0, 0, size, size);
        g.strokeStyle = "#e0e0e0"; g.lineWidth = 2; g.setLineDash([6, 6]);
        [0.22, 0.5, 0.78].forEach(y => { g.beginPath(); g.moveTo(10, size * y); g.lineTo(size - 10, size * y); g.stroke(); });
        g.setLineDash([]);
        g.textAlign = "center"; g.textBaseline = "middle"; g.font = font(size * 0.78);
        g.fillStyle = "#eceff1"; g.fillText(t.ch, size / 2, size * 0.52);
        g.setLineDash([4, 7]); g.lineWidth = 3; g.strokeStyle = "#90a4ae"; g.strokeText(t.ch, size / 2, size * 0.52); g.setLineDash([]);
      };
      drawGuide();
      gg.textAlign = "center"; gg.textBaseline = "middle"; gg.font = font(LOW * 0.78); gg.fillStyle = "#000"; gg.fillText(t.ch, LOW / 2, LOW * 0.52);
      const brush = size * 0.085;
      let drawing = false, last = null, hue = Math.random() * 360, ink = 0;
      const pt = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * size / r.width, y: (e.clientY - r.top) * size / r.height }; };
      const line = (a, b) => {
        hue = (hue + 4) % 360;
        g.strokeStyle = `hsl(${hue},85%,55%)`; g.lineWidth = brush; g.lineCap = g.lineJoin = "round";
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
        ug.strokeStyle = "#000"; ug.lineWidth = brush * sc; ug.lineCap = "round";
        ug.beginPath(); ug.moveTo(a.x * sc, a.y * sc); ug.lineTo(b.x * sc, b.y * sc); ug.stroke();
        ink += Math.hypot(a.x - b.x, a.y - b.y);
      };
      cv.addEventListener("pointerdown", e => { e.preventDefault(); drawing = true; last = pt(e); line(last, { x: last.x + 0.1, y: last.y }); try { cv.setPointerCapture(e.pointerId); } catch (x) {} });
      cv.addEventListener("pointermove", e => { if (!drawing) return; const p = pt(e); line(last, p); last = p; });
      const up = () => { drawing = false; };
      cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
      const clear = () => { drawGuide(); ug.clearRect(0, 0, LOW, LOW); ink = 0; };
      const check = () => {
        const gd = gg.getImageData(0, 0, LOW, LOW).data, ud = ug.getImageData(0, 0, LOW, LOW).data;
        let gN = 0, both = 0, uN = 0, out = 0;
        const near = (x, y) => { for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < LOW && yy < LOW && gd[(yy * LOW + xx) * 4 + 3] > 100) return true; } return false; };
        for (let y = 0; y < LOW; y++) for (let x = 0; x < LOW; x++) {
          const k = (y * LOW + x) * 4, isG = gd[k + 3] > 100, isU = ud[k + 3] > 100;
          if (isG) { gN++; if (isU) both++; }
          if (isU) { uN++; if (!isG && !near(x, y)) out++; }
        }
        return { cover: gN ? both / gN : 0, outside: uN ? out / uN : 1 };
      };
      const row = ctx.el("div", "nav-row");
      const bSay = ctx.el("button", "big-btn alt2", "🔊"); bSay.style.flex = "0 0 70px";
      bSay.onclick = () => Speech.en(`${Speech.letterName(t.a.L)}. ${t.a.word}`);
      const bClr = ctx.el("button", "big-btn alt", "🧽 Xóa"); bClr.onclick = () => { SFX.whoosh(); clear(); };
      const bOk = ctx.el("button", "big-btn ok", "✅ Xong");
      bOk.onclick = async () => {
        if (ink < size * 0.3) { App.toast("Con hãy tô theo chữ trước nhé ✍️"); return; }
        const r = check();
        if (r.cover >= 0.5 && r.outside <= 0.45) {
          if (first) correct++;
          ctx.good(wrap, first ? 10 : 5);
          bOk.disabled = true;
          await Speech.en(App.pick(["Beautiful!", "Great writing!", "Well done!"]));
          await ctx.wait(300); i++; run();
        } else {
          first = false; ctx.bad(wrap);
          Speech.vi(r.cover < 0.5 ? "Con tô kín chữ hơn nữa nhé!" : "Con tô đúng theo nét chữ nhé!");
          ctx.timer(clear, 700);
        }
      };
      row.append(bSay, bClr, bOk);
      S.append(pr, wrap, row);
      ctx.timer(() => Speech.en(`${Speech.letterName(t.a.L)}. ${t.a.word}`), 200);
    };
    (async () => { await Speech.vi("Con dùng ngón tay tô theo chữ cái nhé!"); run(); })();
  };

  // ================== ĐỌC TRUYỆN ==================
  G.story = (ctx, idx) => {
    const st = C.stories[idx];
    const S = ctx.stage;
    let showVi = false;
    const reading = () => {
      S.innerHTML = "";
      ctx.progress(0, 1);
      S.appendChild(ctx.el("div", "prompt", `<div style="font-size:54px">${st.icon}</div><div class="p-big">${App.esc(st.title)}</div><div class="p-vi">${App.esc(st.vi)}</div>`));
      const list = ctx.el("div", "");
      const lines = st.lines.map(l => {
        const d = ctx.el("div", "story-line", `${App.pic(l[2])}<div><div class="s-en">${App.esc(l[0])}</div><div class="s-vi ${showVi ? "" : "hidden"}">${App.esc(l[1])}</div></div>`);
        d.onclick = () => { lines.forEach(x => x.classList.remove("reading")); d.classList.add("reading"); Speech.en(l[0]); };
        list.appendChild(d); return d;
      });
      S.appendChild(list);
      const row = ctx.el("div", "nav-row");
      const bAll = ctx.el("button", "big-btn alt2", "🔊 Nghe cả truyện");
      let tok = null;
      bAll.onclick = async () => {
        if (tok) tok.cancelled = true;
        tok = { cancelled: false }; const my = tok;
        Speech.stop();
        for (let k = 0; k < st.lines.length; k++) {
          if (my.cancelled || !ctx.alive()) return;
          lines.forEach(x => x.classList.remove("reading")); lines[k].classList.add("reading");
          lines[k].scrollIntoView({ behavior: "smooth", block: "center" });
          await Speech.en(st.lines[k][0], { flush: false });
          if (showVi && !my.cancelled) await Speech.vi(st.lines[k][1], { flush: false });
          await ctx.wait(250);
        }
        lines.forEach(x => x.classList.remove("reading"));
      };
      const bVi = ctx.el("button", "big-btn alt", "🇻🇳 Nghĩa");
      bVi.onclick = () => { showVi = !showVi; S.querySelectorAll(".s-vi").forEach(x => x.classList.toggle("hidden", !showVi)); };
      row.append(bAll, bVi);
      const bQ = ctx.el("button", "big-btn ok", "📝 Trả lời câu hỏi");
      bQ.style.width = "100%"; bQ.style.marginTop = "10px";
      bQ.onclick = () => { if (tok) tok.cancelled = true; Speech.stop(); quiz(); };
      S.append(row, bQ);
    };
    const quiz = () => {
      choiceGame(ctx, st.questions.map(q => ({
        target: { key: q[2][0] },
        prompt: `<div class="p-title">${App.esc(st.title)}</div><div class="p-big" style="font-size:28px">${App.esc(q[0])}</div><div class="p-vi">${App.esc(q[1])}</div>${speakBtn()}`,
        say: () => Speech.en(q[0]),
        onWrong: () => {},
        after: async () => { await Speech.en(q[2][0]); await ctx.praise(); },
        options: App.shuffle(q[2]).map(o => ({ key: o, html: App.esc(o), cls: "text" }))
      })), "Con đọc câu hỏi và chọn câu trả lời đúng nhé!");
    };
    Speech.vi("Mình cùng đọc truyện nhé! Con chạm vào từng câu để nghe.");
    reading();
  };

  // ================== PHƯƠNG PHÁP GRAPESEED: VÈ – HỘI THOẠI – TRUYỆN ==================
  const GSU = ctx => (window.GS || {})[ctx.unit.id] || {};
  const engOnly = () => !!App.state().englishOnly;

  // 🎵 Vè có nhịp: vòng 1 nghe cả bài theo nhịp trống, vòng 2 cô đọc – bé đọc theo từng câu
  G.chant = ctx => {
    const lines = (GSU(ctx).chant || []).map(l => ({ en: l[0], vi: l[1] }));
    const S = ctx.stage;
    const picRow = (ctx.words.length ? ctx.words.slice(0, 5).map(w => w[2]) : C.alphabet.slice(0, 5).map(a => a[2]))
      .filter(p => !p.startsWith("c:") && !p.startsWith("t:")).join(" ");
    S.innerHTML = `<div class="prompt chant-card"><div class="chant-pics">${picRow || ctx.unit.icon}</div>
      <div class="p-title" id="chantMode">🎵 Nghe vè</div>
      <div class="chant-lines">${lines.map((l, i) => `<div class="cl" data-i="${i}"><div class="cl-en">${App.esc(l.en)}</div><div class="cl-vi p-vi">${App.esc(l.vi)}</div></div>`).join("")}</div></div>
      <div class="nav-row"><button class="big-btn alt" id="chAgain">🔁 Nghe lại</button><button class="big-btn ok" id="chNext">Tiếp ➡️</button></div>`;
    const els = [...S.querySelectorAll(".cl")];
    const mode = S.querySelector("#chantMode");
    const hi = i => { els.forEach((e, k) => e.classList.toggle("on", k === i)); if (els[i]) els[i].scrollIntoView({ block: "nearest", behavior: "smooth" }); };
    let round = 0, runId = 0;
    ctx.onCleanup(() => { SFX.beatStop(); SFX.hold(false); });
    const play = async () => {
      const my = ++runId;
      SFX.hold(true); SFX.beatStart(92);
      await ctx.wait(700);
      for (let i = 0; i < lines.length; i++) {
        if (!ctx.alive() || my !== runId) return;
        hi(i); ctx.progress(round * lines.length + i, lines.length * 2);
        await Speech.en(lines[i].en, { flush: false });
        if (round === 1) {        // đến lượt bé đọc theo
          els[i].classList.add("you"); mode.innerHTML = "🗣️ Đến lượt con đọc theo!";
          await ctx.wait(Math.max(1600, lines[i].en.length * 85));
          els[i].classList.remove("you"); mode.textContent = "🗣️ Cô đọc – con đọc theo";
        } else await ctx.wait(350);
      }
      if (my !== runId) return;
      hi(-1); SFX.beatStop(); SFX.hold(false);
    };
    S.querySelector("#chAgain").onclick = () => { SFX.click(); Speech.stop(); play(); };
    S.querySelector("#chNext").onclick = async () => {
      SFX.click(); Speech.stop(); runId++;
      if (round === 0) { round = 1; mode.textContent = "🗣️ Cô đọc – con đọc theo"; ctx.addScore(10, mode); await Speech.vi("Bây giờ cô đọc từng câu, con đọc theo nhé!"); play(); }
      else { SFX.beatStop(); SFX.hold(false); ctx.addScore(10, mode); ctx.finish(0, 0, { stars: 3, detail: `Bé đã đọc ${lines.length} câu vè` }); }
    };
    (async () => { await Speech.vi("Mình cùng nghe vè nhé! Con vỗ tay theo nhịp nha."); play(); })();
  };

  // 👫 Hội thoại mẫu: Bon hỏi – nghe câu trả lời mẫu – bé tự trả lời, app chấm phát âm
  G.talk = ctx => {
    const pairs = (GSU(ctx).talk || []).map(p => ({ q: p[0], qv: p[1], a: p[2], av: p[3], pic: p[4] }));
    const S = ctx.stage, can = Speech.canListen(), hands = { on: false };
    const scores = []; let i = 0;
    const run = async () => {
      if (!ctx.alive()) return;
      if (i >= pairs.length) {
        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / Math.max(1, scores.length));
        return ctx.finish(0, 0, { stars: !can ? 3 : avg >= 80 ? 3 : avg >= 60 ? 2 : 1, detail: can ? `Điểm nói trung bình: ${avg}/100` : `Bé đã luyện ${pairs.length} câu hội thoại` });
      }
      ctx.progress(i, pairs.length);
      const p = pairs[i];
      S.innerHTML = `<div class="talk">
        <div class="tk-row bon"><div class="tk-av">${Art.panda("happy")}</div><div class="tk-bub"><div class="tk-en">${App.esc(p.q)}</div><div class="p-vi">${App.esc(p.qv)}</div></div></div>
        <div class="tk-pic">${App.pic(p.pic)}</div>
        <div class="tk-row kid"><div class="tk-bub"><div class="tk-en">${App.esc(p.a)}</div><div class="p-vi">${App.esc(p.av)}</div></div><div class="tk-av kid-av">${App.esc(App.state().avatar)}</div></div>
      </div>`;
      const { box, mic } = voiceBox(ctx, can);
      const row = ctx.el("div", "nav-row");
      const hear = ctx.el("button", "big-btn alt2", "🔊 Nghe lại"), skip = ctx.el("button", "big-btn alt", "⏭️ Bỏ qua");
      row.append(hear, skip); S.append(box, row);
      const model = async () => {
        const bon = S.querySelector(".bon"), kid = S.querySelector(".kid");
        bon.classList.add("speaking"); await Speech.en(p.q); bon.classList.remove("speaking");
        await ctx.wait(250); if (!ctx.alive()) return;
        kid.classList.add("speaking"); await Speech.en(p.a, { flush: false }); kid.classList.remove("speaking");
        if (ctx.alive() && !hands.on && can) Speech.vi("Đến lượt con trả lời nhé!");
      };
      hear.onclick = () => model();
      if (!can) {
        const b = ctx.el("button", "big-btn ok", "👍 Con đã nói"); box.appendChild(b);
        model();
        await new Promise(res => { b.onclick = res; skip.onclick = res; });
        scores.push(100); i++; return run();
      }
      const sc = await voiceTurn(ctx, { target: p.a, box, mic, hands, skip, pass: 70, model });
      scores.push(sc); i++; run();
    };
    (async () => { await Speech.vi("Mình cùng nói chuyện với bạn Bon nhé!"); run(); })();
  };

  // 📕 Truyện ngắn: nghe – nhìn tranh, rồi trả lời câu hỏi nghe hiểu (nghe câu, chọn tranh)
  G.tale = ctx => {
    const lines = (GSU(ctx).tale || []).map(l => ({ en: l[0], vi: l[1], pic: l[2] }));
    const S = ctx.stage;
    const read = () => {
      S.innerHTML = `<div class="prompt"><div style="font-size:46px">${ctx.unit.icon}</div><div class="p-big" style="font-size:26px">${App.esc(ctx.unit.en)}</div><div class="p-vi">${App.esc(ctx.unit.title)}</div></div>
        <div class="tale-list">${lines.map((l, i) => `<div class="story-line" data-i="${i}">${App.pic(l.pic)}<div><div class="s-en">${App.esc(l.en)}</div><div class="s-vi">${App.esc(l.vi)}</div></div></div>`).join("")}</div>
        <div class="nav-row"><button class="big-btn alt2" id="tlAll">🔊 Nghe lại</button><button class="big-btn ok" id="tlQ">📝 Đố vui</button></div>`;
      const els = [...S.querySelectorAll(".story-line")];
      let tok = { c: false };
      const all = async () => {
        tok.c = true; const my = tok = { c: false }; Speech.stop();
        for (let k = 0; k < lines.length; k++) {
          if (my.c || !ctx.alive()) return;
          els.forEach(x => x.classList.remove("reading")); els[k].classList.add("reading"); els[k].scrollIntoView({ block: "center", behavior: "smooth" });
          ctx.progress(k + 1, lines.length * 2);
          await Speech.en(lines[k].en, { flush: false }); await ctx.wait(350);
        }
        els.forEach(x => x.classList.remove("reading"));
      };
      els.forEach((d, k) => d.onclick = () => { tok.c = true; els.forEach(x => x.classList.remove("reading")); d.classList.add("reading"); Speech.en(lines[k].en); });
      S.querySelector("#tlAll").onclick = all;
      S.querySelector("#tlQ").onclick = () => { tok.c = true; Speech.stop(); quiz(); };
      all();
    };
    const quiz = () => {
      const qs = App.sample(lines, 3);
      choiceGame(ctx, qs.map(t => ({
        target: { key: t.en },
        prompt: `<div class="p-title">Nghe câu trong truyện và chọn tranh đúng</div>${speakBtn()}`,
        say: () => Speech.en(t.en),
        options: App.shuffle([t, ...distractors(lines, t, 2)]).map(o => ({ key: o.en, html: App.pic(o.pic) }))
      })), "Con nghe câu trong truyện, rồi chọn tranh đúng nhé!");
    };
    (async () => { await Speech.vi("Mình cùng nghe truyện nhé! Con nhìn tranh và nghe cô kể."); read(); })();
  };

  window.GAMES = G;
})();
