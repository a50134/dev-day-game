// 講義：從 tw-episodes.js（影片的資料）自動帶出每部的指令與「完整程式碼」，
// 再搭配 tw-handout-notes.js 的重點整理、速查表、設計稿對照表。
import { EPISODES } from './tw-episodes.js';
import { NOTES, CHEAT, DESIGN } from './tw-handout-notes.js';
import { FILE_WHY, LINE_NOTES, STEP_WHY } from './tw-handout-annot.js';
import { importsOf, exportsOf, resolveSpec, describeImport, describeExport, buildGraph } from './tw-handout-imports.js';

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
const ALL = {};
for (const ep of EPISODES) for (const st of ep.steps) if (st.file) ALL[st.file] = st.code;
const GRAPH = buildGraph(ALL);
const base = (f) => f.split('/').pop();

// 逐行註解：自動的（import／export）＋手寫的（tw-handout-annot.js，依出現順序比對）
function annotate(file, code) {
  const lines = code.replace(/\n+$/, '').split('\n'), notes = {};
  const add = (i, t) => { notes[i] = notes[i] ? notes[i] + '<br>' + t : t; };
  for (const imp of importsOf(code)) add(imp.line - 1, '📥 ' + describeImport(imp, file, ALL));
  lines.forEach((l, i) => { const d = describeExport(l); if (d) add(i, '📤 ' + d); });
  let p = 0;
  for (const [needle, text] of LINE_NOTES[file] || []) {
    for (let i = p; i < lines.length; i++) if (lines[i].includes(needle)) { add(i, text); p = i; break; }
  }
  return lines.map((l, i) => ({ l, n: notes[i] || '' }));
}
const relOf = (file) => {
  if (!GRAPH.uses[file] || !/\.(tsx?|mjs)$/.test(file)) return '';
  const u = [...new Set(GRAPH.uses[file])].map(base), b = [...new Set(GRAPH.usedBy[file] || [])].map(base);
  const parts = [];
  if (u.length) parts.push(`➡️ <b>它拿了</b>（import）：${u.map((x) => `<code>${x}</code>`).join('、')}`);
  if (b.length) parts.push(`⬅️ <b>被誰拿走用</b>：${b.map((x) => `<code>${x}</code>`).join('、')}`);
  return parts.length ? `<p class="rel">${parts.join('　　')}</p>` : '';
};

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
      <li>搭配動畫版：<a href="tw-story.html">tw-story.html</a>（13 部，講義的章節與動畫一一對應）</li>
      <li>需要：Node.js 20.19 以上（或 22.12 以上）、VS Code、一個六角 API 路徑</li>
      <li>範圍：只做<b>首頁</b>；產品列表、品牌介紹、商品細節、結帳是第二階段</li>
      <li>每個檔案的程式碼旁邊有<b>逐行說明</b>（為什麼這樣寫），每一部有「<b>每一步為什麼要這樣做</b>」；import／export 與路徑看<a href="#guide">最前面的說明</a></li><li>程式碼是驗證過的版本，和動畫版<b>完全一致</b></li>
    </ul>
  </header>`;
}

function toc() {
  const eps = EPISODES.map((e, i) => `<li><a href="#ep${i + 1}"><span class="no">${pad(i + 1)}</span>${esc(e.title)}</a></li>`).join('');
  return `<nav class="toc"><h2>目錄</h2><ol class="tlist">${eps}</ol>
    <ol class="tlist extra"><li><a href="#guide"><span class="no">先讀</span>import／export 與路徑怎麼看</a></li><li><a href="#cheat"><span class="no">附</span>速查表</a></li><li><a href="#design"><span class="no">附</span>設計稿對照表</a></li></ol></nav>`;
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
    const rows = annotate(name, code).map((r) => `<div class="r${r.n ? ' has' : ''}"><code class="c">${esc(r.l) || ' '}</code>${r.n ? `<div class="n">${r.n}</div>` : ''}</div>`).join('');
    return `<figure class="file ${lines <= 28 ? 'small' : ''}" data-i="${i}" data-k="${k}"><figcaption><b>${esc(name)}</b><span>${lines} 行</span><button class="copy" type="button">複製</button></figcaption>
      ${FILE_WHY[name] ? `<p class="why">📌 <b>為什麼要有這個檔案：</b>${FILE_WHY[name]}</p>` : ''}<div class="ann">${rows}</div>${relOf(name)}</figure>`;
  }).join('');
  const why = (STEP_WHY[i] || []).map(([a, b]) => `<li><b>${a}</b><span class="because">為什麼：${b}</span></li>`).join('');
  const whyBlock = why ? `<h3>一步一步做（每一步為什麼要這樣做）</h3><ol class="steps">${why}</ol>` : '';
  const codeBlock = files.length ? `<div class="codes"><h3>完整程式碼（這一部完成後）<small>右邊的說明是講義加的，複製下來的程式碼是乾淨的</small></h3>${fileBlocks}</div>` : '';
  return `<section class="ep" id="ep${i + 1}"><h2><span class="no">第 ${i + 1} 部</span>${esc(ep.title)}</h2>
    <p class="goal">🎯 ${n.goal}</p><h3>重點整理</h3><ul class="points">${points}</ul>${tips}${whyBlock}${cmdBlock}${codeBlock}</section>`;
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


// 「從哪裡拿、拿什麼」：import／export 與路徑，全部用本專案真的檔案當例子（路徑與寫法是程式算的，不會錯）
function pathSteps(from, to) {
  const f = from.split('/').slice(0, -1), t = to.split('/');
  let c = 0; while (c < f.length && c < t.length - 1 && f[c] === t[c]) c++;
  const ups = f.length - c, downs = t.slice(c);
  const spec = (ups === 0 ? './' : '../'.repeat(ups)) + downs.join('/').replace(/\.(tsx?|css)$/, '');
  const dirName = (parts) => (parts.length ? parts.join('/') + '/' : '專案最外層');
  const steps = [`你在 <b>${dirName(f)}</b>`];
  if (ups) steps.push(`<code>${'../'.repeat(ups)}</code> 往上 ${ups} 層，回到 <b>${dirName(f.slice(0, f.length - ups))}</b>`);
  else steps.push('<code>./</code> ＝ 就在<b>同一個資料夾</b>');
  if (downs.length > 1) steps.push(`往下進 <b>${downs.slice(0, -1).join('/')}/</b>`);
  steps.push(`找到 <b>${downs.at(-1)}</b>`);
  return { spec, text: steps.join(' → ') };
}

function guide() {
  const EX = [
    ['src/App.tsx', 'src/components/Navbar.tsx', 'Navbar', 'default'],
    ['src/components/Navbar.tsx', 'src/components/Button.tsx', 'Button', 'default'],
    ['src/components/Navbar.tsx', 'src/hooks/useCart.ts', 'useCart', 'named'],
    ['src/components/HotProducts.tsx', 'src/hooks/useProducts.ts', 'useProducts', 'default'],
    ['src/hooks/useProducts.ts', 'src/api.ts', 'getProducts', 'named'],
    ['src/components/ProductCard.tsx', 'src/types.ts', 'Product', 'type'],
    ['src/context/CartProvider.tsx', 'src/context/CartContext.ts', 'CartContext', 'named'],
  ];
  const kind = { default: '預設匯出（沒有大括號）', named: '具名匯出（有大括號）', type: '型別（import type ＋ 大括號）' };
  const writing = (name, k, spec) => k === 'default' ? `import ${name} from '${spec}'` : k === 'type' ? `import type { ${name} } from '${spec}'` : `import { ${name} } from '${spec}'`;
  const exampleRows = EX.map(([from, to, name, k]) => {
    const { spec, text } = pathSteps(from, to);
    return `<tr><td><code>${from.replace('src/', '')}</code></td><td><code>${to.replace('src/', '')}</code></td><td><code>${esc(writing(name, k, spec))}</code></td><td>${text}<br><span class="dim">${kind[k]}</span></td></tr>`;
  }).join('');
  const graphRows = Object.keys(ALL).filter((f) => /\.(tsx?)$/.test(f) && !f.endsWith('.d.ts') && (GRAPH.uses[f].length || (GRAPH.usedBy[f] || []).length)).map((f) => {
    const u = [...new Set(GRAPH.uses[f])].map(base), b = [...new Set(GRAPH.usedBy[f] || [])].map(base);
    const cell = (a) => (a.length ? a.map((x) => `<code>${x}</code>`).join('、') : '<span class="dim">—</span>');
    return `<tr><td><code>${f.replace('src/', '')}</code></td><td>${cell(u)}</td><td>${cell(b)}</td></tr>`;
  }).join('');
  return `<section class="ep guide" id="guide"><h2><span class="no">先讀</span>import／export 與路徑怎麼看</h2>
    <p class="lead">只要搞懂「<b>誰開放、誰來拿</b>」。每個檔案像一個小房間：房間裡的東西，別人預設拿不到；要讓別人用，就要在<b>門口擺出來（export）</b>；要用別人的，就要<b>走過去拿（import）</b>。</p>
    <h3>① 一組一組看：出口 ↔ 入口</h3>
    <div class="pair"><div class="side out"><div class="lbl">📤 出口：被拿的檔案　<code>components/Button.tsx</code></div><pre>function Button() { … }

<mark>export default Button</mark></pre></div>
      <div class="arrow">⬇ 對應 ⬇</div>
      <div class="side in"><div class="lbl">📥 入口：要用的檔案　<code>components/Navbar.tsx</code></div><pre><mark>import Button from './Button'</mark>

&lt;Button&gt;註冊 / 登入&lt;/Button&gt;</pre></div></div>
    <div class="pair"><div class="side out"><div class="lbl">📤 出口　<code>hooks/useCart.ts</code></div><pre><mark>export function useCart</mark>() { … }</pre></div>
      <div class="arrow">⬇ 對應 ⬇</div>
      <div class="side in"><div class="lbl">📥 入口　<code>components/Navbar.tsx</code></div><pre><mark>import { useCart } from '../hooks/useCart'</mark></pre></div></div>
    <h3>② 兩種 export：差在「有沒有大括號」</h3>
    ${table(['', '預設匯出 export default', '具名匯出 export function／const／type'], [
      ['出口寫法', '<code>export default Button</code>', '<code>export function useCart() {…}</code>'],
      ['入口寫法', '<code>import Button from \'./Button\'</code>', '<code>import { useCart } from \'../hooks/useCart\'</code>'],
      ['大括號', '<b>不要</b>', '<b>要</b>'],
      ['名字', '拿的人可以<b>自己取</b>（但習慣用同一個）', '一定要和出口<b>一模一樣</b>'],
      ['數量', '一個檔案<b>只能有一個</b>', '一個檔案可以有<b>很多個</b>（import { a, b } 一次拿）'],
      ['本專案', '元件（Button、Navbar…）、<code>useProducts</code>、<code>App</code>', '<code>useCart</code>、<code>CartProvider</code>、<code>getProducts</code>、型別（<code>Product</code>…）'],
    ])}
    <h3>③ 路徑口訣：from 後面那串字，是「從我這個檔案走到對方」的路</h3>
    ${table(['路徑開頭', '意思', '例子'], [
      ['<code>./</code>', '就在<b>同一個資料夾</b>', '<code>\'./Button\'</code>（Navbar 和 Button 都在 components/）'],
      ['<code>../</code>', '往上走<b>一層</b>資料夾，再往下找', '<code>\'../hooks/useCart\'</code>（從 components/ 出來，再進 hooks/）'],
      ['<code>../../</code>', '往上走<b>兩層</b>', '（本專案沒用到）'],
      ['<b>沒有點</b>，例如 <code>\'react\'</code>', '不是我們的檔案，是<b>安裝的套件</b>（去 <code>node_modules</code> 找）', '<code>\'react\'</code>、<code>\'axios\'</code>'],
      ['開頭是 <code>/</code>，例如 <code>"/images/…"</code>', '<b>不是 import</b>：這是圖片的網址，從網站根目錄算（檔案放在 <code>public/</code> 裡）', '<code>src="/images/svg/Cart.svg"</code>'],
    ])}
    <p class="hint">不用寫副檔名（<code>.tsx</code>、<code>.ts</code>）。只有 CSS 這類不是程式的檔案才要寫完整，例如 <code>import './index.css'</code>。</p>
    <h3>④ 用本專案的真實例子練習</h3>
    <table><thead><tr><th>你站在這個檔案</th><th>要拿這個檔案</th><th>寫法</th><th>怎麼走過去</th></tr></thead><tbody>${exampleRows}</tbody></table>
    <p class="note">（表格由程式從真的路徑算出來，不會寫錯）</p>
    <h3>⑤ 誰拿了誰（整個專案的引用關係）</h3>
    <p>看這張表就知道「改了某個檔案，會影響哪些地方」。越多人用的檔案（例如 Button、types）越要小心改。</p>
    <table><thead><tr><th>檔案</th><th>它拿了（import）</th><th>被誰拿走用</th></tr></thead><tbody>${graphRows}</tbody></table>
    <h3>⑥ 最常見的錯，怎麼看訊息</h3>
    ${table(['現象', '原因', '怎麼辦'], [
      ['<code>Module \'…\' has no default export</code>', '對方是「具名匯出」，你卻用沒大括號的寫法拿', '加上大括號：<code>import { useCart } from …</code>'],
      ['<code>has no exported member \'X\'</code>', '加了大括號，但對方是「預設匯出」，或名字拼錯／大小寫不同', '去掉大括號，或檢查出口的名字'],
      ['<code>Cannot find module \'./Buton\'</code>', '路徑或檔名打錯（少 t、大小寫不同、少了 <code>../</code>）', '照「路徑口訣」從你的檔案一步步走一次'],
      ['<code>is a type and must be imported using a type-only import</code>', '只當型別用的東西，要用 <code>import type</code>（新版範本規定）', '改成 <code>import type { Product } from …</code>'],
      ['忘了在出口 <code>export</code>', '對方檔案沒有把東西開放出來', '回到對方檔案，在前面加 <code>export</code>'],
    ])}
    <h3>⑦ 資料夾為什麼這樣分</h3>
    ${table(['資料夾／檔案', '放什麼', '為什麼'], [
      ['<code>src/components/</code>', '畫面的積木（Button、Navbar、Hero…）', '一個積木一個檔案，要改哪一塊一眼就找到；可以重複使用'],
      ['<code>src/hooks/</code>', '自訂 Hook（<code>useProducts</code>、<code>useCart</code>）', '把「讀資料、處理狀態」的邏輯抽出來，元件只管畫面'],
      ['<code>src/context/</code>', '共享資料（<code>CartContext</code>、<code>CartProvider</code>）', '離很遠的元件要共用同一份資料（購物車數量）'],
      ['<code>src/api.ts</code>', '所有跟 API 講話的函式', '網址或規則變了，只改這一個檔案'],
      ['<code>src/types.ts</code>', '資料的型別', '資料長什麼樣子只定義一次，大家都來這裡拿'],
      ['<code>public/images/</code>', '圖片', '放這裡的檔案網址從根目錄開始（<code>/images/…</code>），不用 import'],
    ])}
  </section>`;
}

const doc = document.getElementById('doc');
doc.innerHTML = cover() + toc() + overview() + guide() + EPISODES.map(episode).join('') + cheat() + design()
  + '<footer class="end"><p>講義的程式碼來自驗證過的教學資料，和動畫版一致。</p></footer>';

// 程式碼用 textContent 放進去（不會被當成 HTML），並接上複製按鈕
doc.querySelectorAll('figure.file').forEach((fig) => {
  const code = filesOf(EPISODES[+fig.dataset.i])[+fig.dataset.k][1].replace(/\n+$/, '');
  fig.querySelector('.copy').onclick = async (e) => {
    try { await navigator.clipboard.writeText(code + '\n'); e.target.textContent = '已複製 ✓'; }
    catch { e.target.textContent = '請手動複製'; }
    setTimeout(() => (e.target.textContent = '複製'), 1600);
  };
});

document.getElementById('print').onclick = () => window.print();
document.getElementById('shownotes').onchange = (e) => document.body.classList.toggle('no-notes', !e.target.checked);
document.getElementById('showcode').onchange = (e) => document.body.classList.toggle('no-code', !e.target.checked);
