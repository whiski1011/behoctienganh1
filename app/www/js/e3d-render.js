/* Thay emoji dạng chữ bằng hình minh họa 3D (Fluent Emoji 3D – Microsoft, giấy phép MIT) */
(function () {
  const MAP = window.E3D || {};
  const seg = new Intl.Segmenter();
  const RE = /\p{Extended_Pictographic}|\p{Regional_Indicator}|⃣/u;
  const SKIP = { svg: 1, SVG: 1, text: 1, INPUT: 1, TEXTAREA: 1, SELECT: 1, OPTION: 1, SCRIPT: 1, STYLE: 1 };
  function convertText(node) {
    const t = node.nodeValue;
    if (!t || !RE.test(t)) return;
    const p = node.parentNode;
    if (!p || SKIP[p.nodeName] || (p.closest && p.closest("svg"))) return;
    const frag = document.createDocumentFragment();
    let buf = "", changed = false;
    for (const { segment: g } of seg.segment(t)) {
      const f = MAP[g];
      if (f) {
        if (buf) { frag.appendChild(document.createTextNode(buf)); buf = ""; }
        const img = document.createElement("img");
        img.className = "e3d"; img.src = "img/e/" + f + ".webp"; img.alt = g; img.draggable = false;
        frag.appendChild(img); changed = true;
      } else buf += g;
    }
    if (!changed) return;
    if (buf) frag.appendChild(document.createTextNode(buf));
    p.replaceChild(frag, node);
  }
  function walk(root) {
    if (root.nodeType === 3) return convertText(root);
    if (root.nodeType !== 1 || SKIP[root.nodeName]) return;
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const list = []; let n; while ((n = tw.nextNode())) list.push(n);
    list.forEach(convertText);
  }
  let on = true;
  window.E3DR = { walk, setEnabled(v) { on = v; } };
  const mo = new MutationObserver(ms => {
    if (!on) return;
    for (const m of ms) {
      if (m.type === "characterData") convertText(m.target);
      else m.addedNodes.forEach(walk);
    }
  });
  document.addEventListener("DOMContentLoaded", () => {
    walk(document.body);
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  });
})();
