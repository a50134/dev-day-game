// 講義：從 tw-episodes.js（影片的資料）自動帶出每部的指令與「完整程式碼」，
// 再搭配 tw-handout-notes.js 的重點整理、速查表、設計稿對照表。
import { EPISODES } from './tw-episodes.js';
import { NOTES, CHEAT, DESIGN } from './tw-handout-notes.js';

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const rows = (list, cell) => list.map((r) => '<tr>' + r.map((c, i) => `<${cell(i)}>${c}</${cell(i)}>`).join('') + '</tr>').join('');
const table = (head, list, cls = '') => `<table class="${cls}"><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows(list, () => 'td')}</tbody></table>`;
const pad = (n) => String(n).padStart(2, '0');

// 這一部裡每個檔案「最後的版本」（依第一次出現的順序）
function filesOf(ep) {
  const map = new Map();
  for (const s of ep.steps) if (s.file) map.set(s.file, s.code);
  return [...map];
}
const commandsOf = (ep) => [...new Set(ep.steps.filter((s) => s.term).flatMap((s) => s.term.filter((l) => l.startsWith('$ ')).map((l) => l.slice(2))))];

const TREE = `i-need-this/
├─ index.html
├─ vite.config.ts
├─ .env                ← VITE_ 開頭的設定（公開）
├─ .env.local          ← 帳號密碼（不打包、不上傳）
├─ public/
│  └─ images/          ← 從舊專案 assets/images 複製過來
├─ scripts/
│  └─ seed.mjs         ← 建立商品資料（在你的電腦上用 Node 執行）
└─ src/
   ├─ main.tsx         ← 範本原本就有
   ├─ index.css        ← Tailwind、顏色、字型、文字樣式
   ├─ App.tsx          ← 把各區塊從上到下排好
   ├─ types.ts         ← Product、Cart 等型別
   ├─ api.ts           ← axios：getProducts、getCart、addToCart
   ├─ vite-env.d.ts    ← 環境變數的型別
   ├─ components/      ← Button、Navbar、Hero、FeatureSection、PromoSections、
   │                     HotProducts、ProductCard、Categories、Responsibility、
   │                     Footer、SocialBar
   ├─ context/         ← CartContext.ts、CartProvider.tsx
   └─ hooks/           ← useProducts.ts、useCart.ts`;

function cover() {
  return `<header class="cover">
    <p class="kicker">Tailwind v4 ＋ React ＋ TypeScript</p>
    <h1>I need this 首頁<br>手把手講義</h1>
    <p class="sub">照 Figma 設計稿，做出共用顏色／字型／按鈕、導覽列、輪播、熱賣商品（串六角 API）、購物車與頁尾。</p>
    <ul class="meta">
      <li>搭配影片：<a href="tailwind-react-video.html">tailwind-react-video.html</a>（13 部，講義的章節與影片一一對應）</li>
      <li>需要：Node.js 20.19 以上（或 22.12 以上）、VS Code、一個六角 API 路徑</li>
      <li>範圍：只做<b>首頁</b>；產品列表、品牌介紹、商品細節、結帳是第二階段</li>
      <li>程式碼與指令是從影片資料自動帶出，和影片<b>完全一致</b></li>
    </ul>
  </header>`;
}

function toc() {
  const eps = EPISODES.map((e, i) => `<li><a href="#ep${i + 1}"><span class="no">${pad(i + 1)}</span>${esc(e.title)}</a></li>`).join('');
  return `<nav class="toc"><h2>目錄</h2><ol class="tlist">${eps}</ol>
    <ol class="tlist extra"><li><a href="#cheat"><span class="no">附</span>速查表</a></li><li><a href="#design"><span class="no">附</span>設計稿對照表</a></li></ol></nav>`;
}

function overview() {
  return `<section class="ov"><h2>專案長什麼樣子</h2><p>跟著 13 部做完，專案會是這個結構：</p><pre class="tree">${esc(TREE)}</pre>
    <p class="hint">資料怎麼流動：<b>畫面（元件）</b> ← <b>useProducts／useCart</b> ← <b>api.ts</b> ← <b>axios</b> ← <b>六角 API</b>。每一層只做一件事。</p></section>`;
}

function episode(ep, i) {
  const n = NOTES[i], files = filesOf(ep), cmds = commandsOf(ep);
  const points = n.points.map((p) => `<li>${p}</li>`).join('');
  const tips = (n.tips || []).map((t) => `<p class="tip">💡 ${t}</p>`).join('');
  const cmdBlock = cmds.length ? `<h3>本部會用到的指令</h3><pre class="cmds">${cmds.map(esc).join('\n')}</pre>` : '';
  const fileBlocks = files.map(([name, code], k) => {
    const lines = code.trim().split('\n').length;
    return `<figure class="file ${lines <= 28 ? 'small' : ''}" data-i="${i}" data-k="${k}"><figcaption><b>${esc(name)}</b><span>${lines} 行</span><button class="copy" type="button">複製</button></figcaption><pre><code></code></pre></figure>`;
  }).join('');
  const codeBlock = files.length ? `<div class="codes"><h3>完整程式碼（這一部完成後）</h3>${fileBlocks}</div>` : '';
  return `<section class="ep" id="ep${i + 1}"><h2><span class="no">第 ${i + 1} 部</span>${esc(ep.title)}</h2>
    <p class="goal">🎯 ${n.goal}</p><h3>重點整理</h3><ul class="points">${points}</ul>${tips}${cmdBlock}${codeBlock}</section>`;
}

function cheat() {
  const cls = CHEAT.classes.map(([t, list]) => `<h4>${t}</h4>${table(['class', '意思'], list.map(([a, b]) => [`<code>${esc(a)}</code>`, b]), 'cls')}`).join('');
  return `<section class="ep cheat" id="cheat"><h2><span class="no">附 1</span>速查表</h2>
    <h3>Tailwind 常用 class（本專案用到的）</h3>${cls}
    <h3>斷點（螢幕寬度）</h3>${table(['前綴', '起算寬度', '說明'], CHEAT.breakpoints)}
    <h3>指令清單</h3>${table(['指令', '用途'], CHEAT.commands.map(([a, b]) => [`<code>${esc(a)}</code>`, b]))}
    <h3>TypeScript 錯誤訊息（本系列實際遇到的）</h3>${table(['編號', '訊息', '怎麼辦'], CHEAT.tsErrors.map(([a, b, c]) => [a, `<code>${esc(b)}</code>`, c]), 'ts')}
    <h3>React 與 TypeScript 觀念速查</h3>${table(['名稱', '寫法', '重點'], CHEAT.hooks)}</section>`;
}

function design() {
  const sw = (hex) => `<i class="sw" style="background:${hex}"></i>`;
  return `<section class="ep design" id="design"><h2><span class="no">附 2</span>設計稿對照表</h2>
    <p>把 Figma 設計稿的名稱，對應到我們程式裡的寫法。顏色、字型、文字樣式讀自 Figma 的 Design System 頁；尺寸欄位標明來源。</p>
    <h3>顏色</h3>${table(['Figma 名稱', '色碼', '@theme 變數', 'class 範例', '分組'], DESIGN.colors.map(([a, hex, c, d, e]) => [a, `${sw(hex)}${hex}`, `<code>${c}</code>`, `<code>${d}</code>`, e]))}
    <h3>字型</h3>${table(['用途', '字型', 'class'], DESIGN.fonts)}
    <h3>文字樣式</h3>${table(['Figma', '桌面', '手機', '我們的 class'], DESIGN.typography.map(([a, b, c, d]) => [a, b, c, `<code>${d}</code>`]))}
    <h3>按鈕</h3>${table(['款式', '狀態', '長相', 'class'], DESIGN.buttons)}
    <h3>導覽列的狀態</h3>${table(['狀態', '設計稿', '程式'], DESIGN.navbar)}
    <h3>尺寸與版面</h3>${table(['項目', '設計稿的值', '我們的寫法', '來源'], DESIGN.layout)}
    <h3>API 對照</h3>${table(['API', '函式', '用在哪'], DESIGN.api)}</section>`;
}

const doc = document.getElementById('doc');
doc.innerHTML = cover() + toc() + overview() + EPISODES.map(episode).join('') + cheat() + design()
  + '<footer class="end"><p>講義與影片同步：影片的程式碼改了，講義會自動跟著更新。</p></footer>';

// 程式碼用 textContent 放進去（不會被當成 HTML），並接上複製按鈕
doc.querySelectorAll('figure.file').forEach((fig) => {
  const code = filesOf(EPISODES[+fig.dataset.i])[+fig.dataset.k][1].replace(/\n+$/, '');
  fig.querySelector('code').textContent = code;
  fig.querySelector('.copy').onclick = async (e) => {
    try { await navigator.clipboard.writeText(code + '\n'); e.target.textContent = '已複製 ✓'; }
    catch { e.target.textContent = '請手動複製'; }
    setTimeout(() => (e.target.textContent = '複製'), 1600);
  };
});

document.getElementById('print').onclick = () => window.print();
document.getElementById('showcode').onchange = (e) => document.body.classList.toggle('no-code', !e.target.checked);
