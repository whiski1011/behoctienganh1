/* Tranh vẽ riêng (SVG vector, rất nhẹ): linh vật gấu trúc "Bon", cảnh nền 3 thế giới, đồ trang trí bản đồ */
(function () {
  const A = {};
  const K = "#2b2d42";        // màu đen mềm cho nét và mảng đen của gấu trúc

  // ---------- Linh vật gấu trúc Bon ----------
  // mood: happy | cheer | think | wow | wave
  A.panda = function (mood = "happy") {
    const eyes = {
      happy: `<ellipse cx="45" cy="60" rx="5.5" ry="6.5" fill="#fff"/><circle cx="46" cy="61" r="3.6" fill="${K}"/><circle cx="47.3" cy="59.4" r="1.3" fill="#fff"/>
              <ellipse cx="75" cy="60" rx="5.5" ry="6.5" fill="#fff"/><circle cx="74" cy="61" r="3.6" fill="${K}"/><circle cx="75.3" cy="59.4" r="1.3" fill="#fff"/>`,
      cheer: `<path d="M39 62 Q45 54 51 62" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round"/>
              <path d="M69 62 Q75 54 81 62" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round"/>`,
      think: `<ellipse cx="45" cy="60" rx="5.5" ry="6.5" fill="#fff"/><circle cx="47" cy="57.5" r="3.4" fill="${K}"/>
              <ellipse cx="75" cy="60" rx="5.5" ry="6.5" fill="#fff"/><circle cx="77" cy="57.5" r="3.4" fill="${K}"/>`,
      wow: `<circle cx="45" cy="60" r="7.5" fill="#fff"/><circle cx="45" cy="61" r="4.6" fill="${K}"/><circle cx="46.8" cy="58.8" r="1.8" fill="#fff"/>
            <circle cx="75" cy="60" r="7.5" fill="#fff"/><circle cx="75" cy="61" r="4.6" fill="${K}"/><circle cx="76.8" cy="58.8" r="1.8" fill="#fff"/>`
    };
    eyes.wave = eyes.happy;
    const mouth = {
      happy: `<path d="M53 80 Q60 87 67 80" stroke="${K}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
      wave: `<path d="M53 80 Q60 87 67 80" stroke="${K}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
      cheer: `<path d="M50 79 Q60 95 70 79 Z" fill="#c62828" stroke="${K}" stroke-width="2.4" stroke-linejoin="round"/><path d="M54 86 Q60 92 66 86 Q60 89 54 86Z" fill="#ff8a80"/>`,
      think: `<path d="M55 83 Q61 80 66 83" stroke="${K}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`,
      wow: `<ellipse cx="60" cy="84" rx="5" ry="6" fill="#c62828" stroke="${K}" stroke-width="2.2"/>`
    };
    const arms = mood === "cheer"
      ? `<ellipse cx="14" cy="70" rx="9" ry="14" fill="${K}" transform="rotate(-35 14 70)"/><ellipse cx="106" cy="70" rx="9" ry="14" fill="${K}" transform="rotate(35 106 70)"/>
         <text x="4" y="40" font-size="14">✦</text><text x="104" y="38" font-size="12" fill="#ffca28">✦</text>`
      : mood === "wave"
      ? `<ellipse cx="104" cy="66" rx="9" ry="14" fill="${K}" transform="rotate(30 104 66)"><animateTransform attributeName="transform" type="rotate" values="20 100 80;45 100 80;20 100 80" dur="0.9s" repeatCount="indefinite"/></ellipse>`
      : mood === "think"
      ? `<ellipse cx="92" cy="98" rx="8" ry="10" fill="${K}" transform="rotate(-20 92 98)"/><circle cx="101" cy="30" r="3" fill="#90caf9"/><circle cx="108" cy="22" r="4.5" fill="#90caf9"/>`
      : "";
    return `<svg class="panda" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="60" cy="112" rx="34" ry="5" fill="rgba(0,0,0,.12)"/>
      ${arms}
      <circle cx="28" cy="30" r="15" fill="${K}"/><circle cx="92" cy="30" r="15" fill="${K}"/>
      <circle cx="28" cy="31" r="7" fill="#5c5f7a"/><circle cx="92" cy="31" r="7" fill="#5c5f7a"/>
      <ellipse cx="60" cy="64" rx="45" ry="41" fill="#fff" stroke="${K}" stroke-width="3"/>
      <path d="M22 50 Q60 20 98 50" stroke="#e9edf3" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/>
      <ellipse cx="44" cy="61" rx="12.5" ry="15.5" fill="${K}" transform="rotate(-22 44 61)"/>
      <ellipse cx="76" cy="61" rx="12.5" ry="15.5" fill="${K}" transform="rotate(22 76 61)"/>
      ${eyes[mood] || eyes.happy}
      <ellipse cx="30" cy="80" rx="7" ry="4.5" fill="#ff8fab" opacity=".7"/><ellipse cx="90" cy="80" rx="7" ry="4.5" fill="#ff8fab" opacity=".7"/>
      <ellipse cx="60" cy="73" rx="6.5" ry="4.5" fill="${K}"/><ellipse cx="58.5" cy="71.6" rx="2" ry="1.2" fill="#fff" opacity=".7"/>
      ${mouth[mood] || mouth.happy}
    </svg>`;
  };

  // ---------- Đám mây, cây, hoa ----------
  const cloud = (x, y, s = 1, o = 1) => `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}"><ellipse cx="0" cy="8" rx="22" ry="9" fill="#fff"/><circle cx="-8" cy="3" r="9" fill="#fff"/><circle cx="6" cy="0" r="12" fill="#fff"/></g>`;
  const tree = (x, y, s = 1, c1 = "#43a047", c2 = "#66bb6a") => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-3" y="0" width="6" height="16" rx="2" fill="#8d6e63"/><circle cx="0" cy="-6" r="13" fill="${c1}"/><circle cx="-7" cy="-2" r="8" fill="${c2}"/><circle cx="5" cy="-12" r="6" fill="${c2}" opacity=".8"/></g>`;
  const flower = (x, y, c) => `<g transform="translate(${x} ${y})"><rect x="-.8" y="0" width="1.6" height="7" fill="#558b2f"/><circle cx="0" cy="0" r="3.2" fill="${c}"/><circle cx="0" cy="0" r="1.3" fill="#fff59d"/></g>`;
  const star = (x, y, r, c = "#fff") => `<path transform="translate(${x} ${y}) scale(${r})" d="M0,-1 L.29,-.4 .95,-.31 .48,.15 .59,.81 0,.5 -.59,.81 -.48,.15 -.95,-.31 -.29,-.4Z" fill="${c}"/>`;

  // ---------- Cảnh nền 3 thế giới ----------
  A.scene = function (n) {
    const id = "g" + n + Math.random().toString(36).slice(2, 6);
    if (n === 1) return `<svg class="scene" viewBox="0 0 240 160" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd8ff"/><stop offset="1" stop-color="#e8f8ff"/></linearGradient></defs>
      <rect width="240" height="160" fill="url(#${id})"/>
      <g class="sun"><circle cx="200" cy="34" r="17" fill="#ffd54f"/><circle cx="200" cy="34" r="25" fill="#ffd54f" opacity=".25"/></g>
      <g class="drift">${cloud(50, 28, 1.1)}${cloud(140, 18, .8, .9)}</g>
      <ellipse cx="60" cy="150" rx="140" ry="50" fill="#a5d66f"/><ellipse cx="200" cy="160" rx="120" ry="48" fill="#7cc248"/>
      <g transform="translate(150 92)"><rect x="0" y="12" width="40" height="30" rx="3" fill="#fff3e0" stroke="#d7ccc8" stroke-width="1.5"/><path d="M-5 14 L20 -6 L45 14Z" fill="#ef5350"/><rect x="15" y="24" width="10" height="18" rx="2" fill="#a1887f"/><rect x="4" y="19" width="8" height="8" rx="1.5" fill="#81d4fa"/><rect x="28" y="19" width="8" height="8" rx="1.5" fill="#81d4fa"/></g>
      ${tree(40, 108, 1.2)}${tree(210, 118, .9, "#2e7d32", "#43a047")}${tree(18, 122, .8, "#2e7d32", "#4caf50")}
      ${flower(80, 128, "#ff80ab")}${flower(95, 136, "#ffd54f")}${flower(110, 130, "#b388ff")}${flower(128, 140, "#ff8a65")}
    </svg>`;
    if (n === 2) return `<svg class="scene" viewBox="0 0 240 160" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe3a3"/><stop offset="1" stop-color="#fff8e1"/></linearGradient></defs>
      <rect width="240" height="160" fill="url(#${id})"/>
      <g fill="none" stroke-width="9" opacity=".9">
        <circle cx="120" cy="165" r="104" stroke="#ef5350"/><circle cx="120" cy="165" r="95" stroke="#ffa726"/><circle cx="120" cy="165" r="86" stroke="#ffee58"/>
        <circle cx="120" cy="165" r="77" stroke="#66bb6a"/><circle cx="120" cy="165" r="68" stroke="#42a5f5"/><circle cx="120" cy="165" r="59" stroke="#ab47bc"/></g>
      <g class="drift">${cloud(30, 70, 1.1)}${cloud(212, 64, 1)}</g>
      <ellipse cx="40" cy="160" rx="110" ry="36" fill="#9ccc65"/><ellipse cx="210" cy="165" rx="110" ry="40" fill="#7cb342"/>
      <g class="bob"><path d="M185 40 q-12 -2 -12 -14 q0 -12 12 -12 q12 0 12 12 q0 12 -12 14z" fill="#ec407a"/><path d="M185 40 q-3 20 4 40" stroke="#888" stroke-width="1" fill="none"/>
      <path d="M205 52 q-10 -2 -10 -12 q0 -10 10 -10 q10 0 10 10 q0 10 -10 12z" fill="#29b6f6"/><path d="M205 52 q3 16 -2 32" stroke="#888" stroke-width="1" fill="none"/></g>
      ${tree(22, 132, 1, "#558b2f", "#7cb342")}${flower(70, 140, "#ff80ab")}${flower(150, 146, "#fff")}${flower(170, 140, "#ffd54f")}
    </svg>`;
    return `<svg class="scene" viewBox="0 0 240 160" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1f71"/><stop offset="1" stop-color="#4a148c"/></linearGradient></defs>
      <rect width="240" height="160" fill="url(#${id})"/>
      <g class="twinkle">${star(20, 20, 3)}${star(70, 40, 2)}${star(110, 15, 2.5)}${star(160, 50, 2)}${star(225, 25, 3)}${star(40, 90, 2)}${star(200, 100, 2.4)}${star(140, 120, 1.8)}</g>
      <g transform="translate(180 60)"><circle r="24" fill="#ffb74d"/><circle cx="-8" cy="-6" r="5" fill="#ffa726"/><circle cx="7" cy="8" r="3.5" fill="#ffa726"/>
        <ellipse rx="40" ry="9" fill="none" stroke="#ffe082" stroke-width="4" transform="rotate(-18)"/></g>
      <circle cx="50" cy="128" r="40" fill="#b39ddb"/><circle cx="36" cy="116" r="7" fill="#9575cd"/><circle cx="64" cy="136" r="5" fill="#9575cd"/>
      <g class="bob" transform="translate(110 70) rotate(35)"><path d="M0 -26 C10 -16 10 8 6 16 H-6 C-10 8 -10 -16 0 -26Z" fill="#eceff1"/><circle cy="-6" r="5" fill="#4fc3f7" stroke="#90a4ae" stroke-width="1.5"/>
        <path d="M-6 8 L-14 18 L-6 16Z M6 8 L14 18 L6 16Z" fill="#ef5350"/><path d="M-4 16 Q0 30 4 16Z" fill="#ffca28"/></g>
    </svg>`;
  };

  // ---------- Trang trí dọc bản đồ ----------
  const DECO = {
    1: [s => tree(0, 0, s), s => `<g transform="scale(${s})">${flower(-6, 0, "#ff80ab")}${flower(4, 4, "#ffd54f")}${flower(12, -2, "#b388ff")}</g>`, s => `<g transform="scale(${s})"><ellipse cx="0" cy="6" rx="16" ry="10" fill="#66bb6a"/><circle cx="-6" cy="2" r="8" fill="#81c784"/><circle cx="7" cy="1" r="7" fill="#81c784"/></g>`],
    2: [s => tree(0, 0, s, "#558b2f", "#9ccc65"), s => `<g transform="scale(${s})"><path d="M0 10 q-10 -2 -10 -13 q0 -11 10 -11 q10 0 10 11 q0 11 -10 13z" fill="#ffca28"/><path d="M0 10 q-2 10 3 18" stroke="#888" fill="none"/></g>`, s => `<g transform="scale(${s})"><rect x="-2" y="-4" width="4" height="16" fill="#8d6e63"/><path d="M-14 -2 Q0 -22 14 -2Z" fill="#ef5350"/><circle cx="0" cy="-6" r="2.5" fill="#fff"/><circle cx="-7" cy="-4" r="2" fill="#fff"/><circle cx="7" cy="-4" r="2" fill="#fff"/></g>`],
    3: [s => `<g transform="scale(${s})"><circle r="12" fill="#ffb74d"/><ellipse rx="20" ry="5" fill="none" stroke="#ffe082" stroke-width="3" transform="rotate(-18)"/></g>`, s => `<g transform="scale(${s})">${star(0, 0, 9, "#ffd740")}${star(16, -10, 4, "#fff")}</g>`, s => `<g transform="scale(${s})"><circle r="11" fill="#b39ddb"/><circle cx="-4" cy="-3" r="3" fill="#9575cd"/><circle cx="4" cy="4" r="2" fill="#9575cd"/></g>`]
  };
  A.deco = function (level, i) {
    const set = DECO[level] || DECO[1];
    const f = set[i % set.length];
    return `<svg class="deco" viewBox="-30 -30 60 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${f(1.3)}</svg>`;
  };

  window.Art = A;
})();
