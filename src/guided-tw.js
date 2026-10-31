// 手把手專案（Tailwind CSS）：活動卡片，從純 HTML 一步一步做到「手機一欄、電腦三欄」的漂亮卡片。
// 練習 kind 'tw'：編輯器裡就是整段 HTML；引擎用 ex.build({}) 當起始內容、ex.build(ex.solution) 當目標，再比對實際樣式。
// 所以「起始內容 = 上一關解答 + TODO 註解」是由 build({}) 產生的（c.done 為真才是解答）。

const pre = (code) => `<pre>${code.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>`;
const choice = (q, options, answer, why) => ({ type: 'choice', q, options, answer, why });
const tw = (o) => ({ kind: 'tw', ...o });
const gstep = (say, check) => ({ say, check });

const STAGES = ['空白頁面：先把卡片的內容蓋出來', '間距：內距與外距，內容不再擠在一起', '顏色、圓角、陰影：長出卡片的樣子', '文字排版：字級、粗細、文字顏色', '卡片裡的排版：用 flex 讓價格和按鈕同一排', '按鈕的 hover 狀態：滑過去會變色', '三張卡片：用 grid 排成一排', '響應式：手機一欄、電腦三欄'];
const progressMap = (n) => `<p><b>📍 專案進度：活動卡片</b>（我們從一個空白頁面，一步一步做到漂亮又會自動換排的卡片）</p><ol>${STAGES.map((t, i) => `<li>${i + 1 < n ? '✅' : i + 1 === n ? '👉 <b>' : '⬜'} ${t}${i + 1 === n ? '</b>' : ''}</li>`).join('')}</ol>`;

/* ---------- 每一關「做完之後」的 class（一關疊一關） ---------- */
const C = [];
C[1] = {};
C[2] = { card: 'w-72 p-4', date: 'mb-2', title: 'mb-1', info: 'mb-3', price: 'mb-4', btn: 'px-4 py-2' };
C[3] = { ...C[2], card: 'w-72 p-4 bg-white border border-gray-200 rounded-xl shadow-md', date: 'inline-block px-3 py-1 mb-2 bg-pink-100 rounded-full', btn: 'px-4 py-2 bg-pink-500 text-white rounded-lg' };
C[4] = { ...C[3], date: 'inline-block px-3 py-1 mb-2 bg-pink-100 rounded-full text-xs font-bold text-pink-600', title: 'mb-1 text-xl font-bold text-gray-900', info: 'mb-3 text-sm text-gray-500', price: 'mb-4 text-lg font-bold text-pink-600', btn: 'px-4 py-2 bg-pink-500 text-white rounded-lg font-medium' };
C[5] = { ...C[4], price: 'text-lg font-bold text-pink-600', foot: 'flex items-center justify-between mt-4' };
C[6] = { ...C[5], btn: 'px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition' };
C[7] = { ...C[6], card: 'p-4 bg-white border border-gray-200 rounded-xl shadow-md', list: 'grid grid-cols-3 gap-4' };
C[8] = { ...C[7], list: 'grid grid-cols-1 gap-4 md:grid-cols-3' };

const at = (v) => (v ? ` class="${v}"` : '');
// 一張卡片的內容（foot = 價格和按鈕有沒有包進同一個 div）
const inner = (c, foot, pad) => {
  const i = pad + '  ';
  return `${i}<p${at(c.date)}>12 / 20</p>\n${i}<h2${at(c.title)}>星光巡迴演唱會</h2>\n${i}<p${at(c.info)}>2026-12-20 · 台北大巨蛋</p>\n` + (foot
    ? `${i}<div${at(c.foot)}>\n${i}  <p${at(c.price)}>NT$ 3800</p>\n${i}  <button${at(c.btn)}>立即購票</button>\n${i}</div>\n`
    : `${i}<p${at(c.price)}>NT$ 3800</p>\n${i}<button${at(c.btn)}>立即購票</button>\n`);
};
// stage 的畫面：1~4 平的、5~6 有 foot、7~8 三張卡片
const markup = (n, c = C[n]) => n >= 7
  ? `<div id="list"${at(c.list)}>\n${[1, 2, 3].map(() => `  <div${at(c.card)}>\n${inner(c, true, '  ')}  </div>\n`).join('')}</div>`
  : `<div id="card"${at(c.card)}>\n${inner(c, n >= 5)}</div>`;
// 起始內容：上一關的解答 + TODO 註解（第 1 關是幾乎空白）
const starterOf = (n, todo) => (n === 1 ? `<div id="card">\n${todo}\n</div>` : `${todo}\n${markup(n - 1, C[n - 1])}`);
const todoBlock = (lines) => lines.map((l) => `<!-- ${l} -->`).join('\n');

/* ---------- 檢查：用結構位置找元素（不靠 id，複製卡片也不會壞） ---------- */
const SEL = (n, k) => {
  const foot = n >= 5, root = n >= 7 ? '#list > div:nth-child(@)' : '#card';
  const m = { card: root, date: root + ' > p:nth-child(1)', title: root + ' > h2', info: root + ' > p:nth-child(3)', price: root + (foot ? ' > div > p' : ' > p:nth-child(4)'), btn: root + (foot ? ' > div > button' : ' > button'), foot: root + ' > div' };
  return m[k];
};
const PROPS = [ // [從第幾關開始, 元素, 屬性...]
  [1, 'card', 'display'], [1, 'date', 'display'], [1, 'title', 'display'], [1, 'info', 'display'], [1, 'price', 'display'], [1, 'btn', 'display'],
  [2, 'card', 'width', 'padding-top', 'padding-left'], [2, 'date', 'margin-bottom'], [2, 'title', 'margin-bottom'], [2, 'info', 'margin-bottom'], [2, 'price', 'margin-bottom'], [2, 'btn', 'padding-left', 'padding-top'],
  [3, 'card', 'background-color', 'border-top-width', 'border-top-color', 'border-top-left-radius', 'box-shadow'], [3, 'date', 'background-color', 'border-top-left-radius', 'padding-left', 'padding-top'], [3, 'btn', 'background-color', 'color', 'border-top-left-radius'],
  [4, 'date', 'font-size', 'font-weight', 'color'], [4, 'title', 'font-size', 'font-weight', 'color'], [4, 'info', 'font-size', 'color'], [4, 'price', 'font-size', 'font-weight', 'color'], [4, 'btn', 'font-weight'],
  [5, 'foot', 'display', 'align-items', 'justify-content', 'margin-top'],
  [6, 'btn', 'transition-property', 'transition-duration'],
];
const checksOf = (n) => {
  const list = [];
  const roots = n >= 7 ? [1, 2, 3] : [0];
  if (n >= 7) list.push({ sel: '#list', props: ['display', 'grid-template-columns', 'column-gap'] });
  for (const r of roots) {
    const keys = [...new Set(PROPS.filter((p) => p[0] <= n).map((p) => p[1]))].filter((k) => k !== 'foot' || n >= 5);
    for (const k of keys) {
      const props = [...new Set(PROPS.filter((p) => p[0] <= n && p[1] === k).flatMap((p) => p.slice(2)))];
      list.push({ sel: SEL(n, k).replace('@', r), props });
    }
  }
  return list;
};

const unit = (n, title, steps, fin) => ({
  id: 'tg' + n, title: `手把手 ${n}／8　${title}`,
  steps: steps.map((s, i) => (i === 0 ? { ...s, say: progressMap(n) + s.say } : s)),
  final: tw({
    build: (c) => (c.done ? markup(n) : starterOf(n, todoBlock(fin.todo))),
    solution: { done: true },
    checks: checksOf(n),
    ...fin.rest,
  }),
});

/* ============================ 八個單元 ============================ */
export const TG_UNITS = [
  unit(1, '空白頁面：先把卡片的內容蓋出來', [
    gstep(`<p>我們要做一張<b>活動卡片</b>，就是購票網站上常看到的那種：小標籤寫日期、一個大標題、一行說明、價格和一顆購票按鈕。最後它會是<b>圓角、有陰影、滑鼠移上去按鈕會變色</b>，手機一欄、電腦三欄。</p><p>第一步<b>不寫任何 Tailwind</b>，只先把「內容」蓋出來。<b>為什麼？</b>就像蓋房子先砌牆，再油漆。內容沒蓋好，後面的樣式根本不知道要貼在哪裡。</p>`,
      choice('做網頁樣式，比較順的做法是？', ['先把內容蓋出來，再一層一層加樣式', '一開始就把所有 class 都寫上去', '先寫陰影，最後才放文字'], 0, '先有內容，再一次加一種樣式，每次都能看到變化。')),
    gstep(`<p>卡片需要的標籤（都是你看過的 HTML）：</p>${pre('<div id="card">      外層盒子（整張卡片）\n  <p>12 / 20</p>               日期小標籤\n  <h2>星光巡迴演唱會</h2>      標題（h2 = 第二大的標題）\n  <p>2026-12-20 · 台北大巨蛋</p>  說明\n  <p>NT$ 3800</p>              價格\n  <button>立即購票</button>    按鈕\n</div>')}<p><code>&lt;div&gt;</code> 是一個「看不見的盒子」，用來把東西包在一起。<code>&lt;p&gt;</code> 放一段文字，<code>&lt;h2&gt;</code> 放標題，<code>&lt;button&gt;</code> 是按鈕。每個標籤要有<b>開頭和結尾</b>（<code>&lt;p&gt;…&lt;/p&gt;</code>）。</p>`,
      choice('<code>&lt;div&gt;</code> 在卡片裡的用途是？', ['當外層盒子，把卡片的內容包在一起', '顯示一張圖片', '讓文字變粗'], 0, 'div 是無形的盒子，專門用來包東西、排版。')),
    gstep(`<p>⚠️ 做完你會發現：標題<b>沒有變大</b>、按鈕<b>看起來很樸素</b>，全部都擠在左上角。這是正常的！Tailwind 一載入就會<b>把瀏覽器預設的樣式清乾淨</b>（叫 preflight），讓每個標籤都是「素顏」，之後樣式全部由你用 class 決定。</p><p><b>下一步預告：</b>第 2 關要用 <code>p-4</code>、<code>mb-2</code> 這類 class 加上<b>間距</b>，讓內容不再擠在一起。</p>`,
      choice('為什麼 <code>&lt;h2&gt;</code> 看起來跟一般文字一樣大？', ['Tailwind 把預設樣式清掉了，大小要自己用 class 設', '程式壞掉了', 'h2 本來就跟文字一樣大'], 0, 'Tailwind 的 preflight 會重設預設樣式，這是故意的。')),
  ], {
    todo: ['TODO 1: 在 #card 裡寫日期小標籤：<p>12 / 20</p>', 'TODO 2: 寫標題：<h2>星光巡迴演唱會</h2>', 'TODO 3: 寫說明：<p>2026-12-20 · 台北大巨蛋</p>', 'TODO 4: 寫價格：<p>NT$ 3800</p>', 'TODO 5: 寫按鈕：<button>立即購票</button>'],
    rest: {
      brief: '第 1 步：在外層盒子 <code>#card</code> 裡，依序寫出 5 個元素：日期 <code>&lt;p&gt;</code>、標題 <code>&lt;h2&gt;</code>、說明 <code>&lt;p&gt;</code>、價格 <code>&lt;p&gt;</code>、按鈕 <code>&lt;button&gt;</code>。這一步不用寫任何 class。',
      hint: '順序要一樣：日期 → 標題 → 說明 → 價格 → 按鈕。每個標籤都要有結尾，例如 <code>&lt;h2&gt;星光巡迴演唱會&lt;/h2&gt;</code>。',
      steps: [
        `在 <code>&lt;div id="card"&gt;</code> 裡面打<pre>&lt;p&gt;12 / 20&lt;/p&gt;</pre>為什麼：這是日期小標籤，之後會變成粉紅色的圓角標籤。`,
        `換行，打<pre>&lt;h2&gt;星光巡迴演唱會&lt;/h2&gt;</pre>為什麼：標題用 h2，是這張卡片最重要的字。`,
        `換行，打<pre>&lt;p&gt;2026-12-20 · 台北大巨蛋&lt;/p&gt;</pre>為什麼：一行說明，告訴大家時間和地點。`,
        `換行，打<pre>&lt;p&gt;NT$ 3800&lt;/p&gt;\n&lt;button&gt;立即購票&lt;/button&gt;</pre>為什麼：價格和按鈕，卡片的最後兩樣東西。`,
        `最常見的錯：標籤忘了結尾（少了 <code>&lt;/h2&gt;</code> 的斜線），或把按鈕寫在 <code>&lt;/div&gt;</code> 外面。5 個元素都要<b>在 #card 裡面</b>，而且順序不能亂。`,
      ],
      must: [{ re: /<h2[^>]*>\s*星光巡迴演唱會\s*<\/h2>/, msg: '請用 <h2> 寫標題「星光巡迴演唱會」' }, { re: /<button[^>]*>\s*立即購票\s*<\/button>/, msg: '請用 <button> 寫「立即購票」' }, { re: />\s*NT\$\s*3800\s*</, msg: '請寫出價格 NT$ 3800' }, { re: /12 \/ 20/, msg: '請寫日期標籤 12 / 20' }, { re: /id="card"/, msg: '外層盒子的 id="card" 不要刪掉' }],
    },
  }),

  unit(2, '間距：內距與外距，內容不再擠在一起', [
    gstep(`<p>現在內容都貼在一起，而且貼在邊邊。這一步用<b>間距</b>解決：</p><ul><li><b>內距 padding（p）</b>：盒子「裡面」的空間，內容離邊緣的距離。像紙箱裡塞的氣泡紙。</li><li><b>外距 margin（m）</b>：盒子「外面」的空間，跟旁邊東西的距離。像兩個紙箱之間留的走道。</li></ul><p>口訣你學過：<b>數字 × 4 = px</b>。<code>p-4</code> = 16px，<code>mb-2</code> = 下方外距 8px。</p>`,
      choice('卡片內容離卡片邊緣太近，要加什麼？', ['內距（p-4）', '外距（m-4）', '寬度（w-4）'], 0, '內容和邊緣之間的空間是內距 padding。')),
    gstep(`<p>這一關要用的 class 都在這裡，一個一個看：</p>${pre('<div id="card" class="w-72 p-4">     卡片：寬 288px、四邊內距 16px\n  <p class="mb-2">…           日期：下方外距 8px\n  <h2 class="mb-1">…          標題：下方外距 4px\n  <p class="mb-3">…           說明：下方外距 12px\n  <p class="mb-4">…           價格：下方外距 16px\n  <button class="px-4 py-2">  按鈕：左右內距 16px、上下 8px')}<p><code>w-72</code>：72 × 4 = 288px。<code>mb</code> = margin-bottom（下方外距）。<code>px</code> = 左右、<code>py</code> = 上下。</p>`,
      choice('<code>mb-3</code> 是多少 px 的下方外距？', ['12px', '3px', '30px'], 0, '3 × 4 = 12px。')),
    gstep(`<p>⚠️ 常見的坑：</p><ul><li><code>mb</code>（下方）和 <code>mt</code>（上方）搞混。</li><li>想要按鈕<b>左右</b>撐開，結果寫成 <code>py</code>（那是上下）。</li><li>卡片的 <code>p-4</code> 是<b>四邊一起</b>；只想上下要寫 <code>py-4</code>。</li></ul><p><b>下一步預告：</b>第 3 關要加<b>顏色、圓角、陰影</b>，讓它真的像一張卡片。</p>`,
      choice('<code>px-4 py-2</code> 的意思是？', ['左右內距 16px、上下內距 8px', '左右外距 16px、上下外距 8px', '寬 16px、高 8px'], 0, 'p 是內距，x 左右、y 上下。')),
  ], {
    todo: ['TODO 1: #card 加 class="w-72 p-4"（寬 288px、內距 16px）', 'TODO 2: 日期 <p> 加 mb-2、標題 <h2> 加 mb-1、說明 <p> 加 mb-3、價格 <p> 加 mb-4', 'TODO 3: 按鈕加 px-4 py-2'],
    rest: {
      brief: '第 2 步：加上間距。卡片：寬 288px、內距 16px。日期下方外距 8px、標題 4px、說明 12px、價格 16px。按鈕：左右內距 16px、上下內距 8px。（照著 TODO 做，右邊「目標」可以對照）',
      hint: '卡片 <code>w-72 p-4</code>；日期 <code>mb-2</code>；標題 <code>mb-1</code>；說明 <code>mb-3</code>；價格 <code>mb-4</code>；按鈕 <code>px-4 py-2</code>。',
      steps: [
        `在 <code>&lt;div id="card"&gt;</code> 的標籤裡加上 <code>class="w-72 p-4"</code><br>為什麼：<code>w-72</code> 是 288px 寬，<code>p-4</code> 是四邊內距 16px，卡片才有「裡面的空間」。`,
        `日期那行改成 <code>&lt;p class="mb-2"&gt;</code>，標題改成 <code>&lt;h2 class="mb-1"&gt;</code><br>為什麼：外距讓每個元素和下一個之間有呼吸空間，標題和說明最近所以只給 4px。`,
        `說明改成 <code>&lt;p class="mb-3"&gt;</code>，價格改成 <code>&lt;p class="mb-4"&gt;</code><br>為什麼：價格和按鈕要離遠一點，所以最大 16px。`,
        `按鈕改成 <code>&lt;button class="px-4 py-2"&gt;</code><br>為什麼：按鈕本身的內距，之後有背景色時才會看起來像「一顆按鈕」。`,
        `最常見的錯：<code>class</code> 寫了兩次（<code>class="…" class="…"</code>）。一個標籤只能有<b>一個</b> class 屬性，多個 class 用空格隔開放在同一組引號裡。`,
      ],
    },
  }),

  unit(3, '顏色、圓角、陰影：長出卡片的樣子', [
    gstep(`<p>現在有間距，但還是看不出「卡片」。卡片的特徵是：<b>白底、淺灰邊框、圓角、淡淡的陰影</b>，像一張浮在桌上的紙。</p><ul><li><code>bg-white</code>：白色背景</li><li><code>border border-gray-200</code>：1px 邊框 + 淺灰色</li><li><code>rounded-xl</code>：圓角 12px</li><li><code>shadow-md</code>：中等陰影</li></ul>`,
      choice('讓卡片看起來「浮起來」，用哪個 class？', ['shadow-md', 'rounded-xl', 'border'], 0, 'shadow 系列就是陰影。')),
    gstep(`<p>日期標籤和按鈕也要上色：</p>${pre('<p class="inline-block px-3 py-1 mb-2 bg-pink-100 rounded-full">   淡粉紅膠囊\n<button class="px-4 py-2 bg-pink-500 text-white rounded-lg">  粉紅底白字、圓角 8px')}<p><code>rounded-full</code> 讓兩端完全變圓（膠囊形）。<code>inline-block</code> 讓標籤<b>只佔文字那麼寬</b>，不然 p 會橫向撐滿整張卡片。顏色的深淺：100 很淺、500 標準、900 很深。</p>`,
      choice('日期標籤想要「只佔文字那麼寬」，加什麼？', ['inline-block', 'w-full', 'block'], 0, 'inline-block 讓元素寬度貼著內容。')),
    gstep(`<p>⚠️ 常見的坑：</p><ul><li>只寫 <code>border-gray-200</code> 沒寫 <code>border</code>：邊框不會出現（只有顏色，沒有粗細）。</li><li>按鈕只寫 <code>bg-pink-500</code> 沒寫 <code>text-white</code>：字是黑色，在粉紅底上不好讀。</li><li>日期標籤原本的 <code>mb-2</code> 要<b>留著</b>，不要被新 class 蓋掉。</li></ul><p><b>下一步預告：</b>第 4 關調整<b>文字</b>：標題變大變粗、說明變小變灰、價格強調。</p>`,
      choice('想要有 1px 的灰色邊框，要寫？', ['border border-gray-200', 'border-gray-200', 'gray-border'], 0, '要有 border 才有粗細，再用顏色 class 指定顏色。')),
  ], {
    todo: ['TODO 1: #card 的 class 後面加上 bg-white border border-gray-200 rounded-xl shadow-md', 'TODO 2: 日期 <p> 的 class 改成 inline-block px-3 py-1 mb-2 bg-pink-100 rounded-full', 'TODO 3: 按鈕的 class 改成 px-4 py-2 bg-pink-500 text-white rounded-lg'],
    rest: {
      brief: '第 3 步：卡片加上白底、1px 淺灰邊框（gray-200）、圓角 12px、中等陰影。日期變成淡粉紅（pink-100）的膠囊（只佔文字寬，左右內距 12px、上下 4px，圓到底）。按鈕變粉紅底（pink-500）白字、圓角 8px。',
      hint: '卡片 <code>bg-white border border-gray-200 rounded-xl shadow-md</code>；日期 <code>inline-block px-3 py-1 bg-pink-100 rounded-full</code>（記得保留 mb-2）；按鈕加 <code>bg-pink-500 text-white rounded-lg</code>。',
      steps: [
        `卡片的 class 改成 <code>w-72 p-4 bg-white border border-gray-200 rounded-xl shadow-md</code><br>為什麼：前面的 <code>w-72 p-4</code> 保留，後面接新的；白底、邊框、圓角、陰影合起來就是卡片。`,
        `日期的 class 改成 <code>inline-block px-3 py-1 mb-2 bg-pink-100 rounded-full</code><br>為什麼：<code>inline-block</code> 讓它貼著文字寬，<code>px-3 py-1</code> 是標籤內的空間，<code>rounded-full</code> 是膠囊形。`,
        `按鈕的 class 改成 <code>px-4 py-2 bg-pink-500 text-white rounded-lg</code><br>為什麼：粉紅底配白字最清楚，<code>rounded-lg</code> 圓角 8px。`,
        `對照右邊「目標」：應該看到白色的圓角卡片，有淡淡陰影，上面是粉紅的標籤和按鈕。`,
        `最常見的錯：改 class 時把前面的 <code>w-72 p-4</code>、<code>mb-2</code> 弄丟了。新的 class 是「接在後面」，不是「取代」。`,
      ],
      must: [{ re: /shadow/, msg: '請加上陰影（shadow-md）' }, { re: /rounded-full/, msg: '日期標籤請用 rounded-full 做膠囊形' }],
    },
  }),

  unit(4, '文字排版：字級、粗細、文字顏色', [
    gstep(`<p>現在每段字都一樣大、一樣黑，看不出重點。好的卡片要有<b>層次</b>：最重要的字最大最粗，次要的字小小的、灰灰的。</p><ul><li>標題：<code>text-xl font-bold text-gray-900</code>（20px、粗體、近黑色）</li><li>說明：<code>text-sm text-gray-500</code>（14px、灰色）</li></ul><p>字級 <code>text-</code> 後面接 xs、sm、base、lg、xl…；粗細 <code>font-</code> 後面接 medium、semibold、bold。</p>`,
      choice('說明文字要「小小的、灰灰的」，用？', ['text-sm text-gray-500', 'text-xl text-black', 'font-bold'], 0, '小字級加灰色，就是次要資訊的標準寫法。')),
    gstep(`<p>日期、價格、按鈕也一起調：</p>${pre('日期 <p>：… text-xs font-bold text-pink-600     12px、粗、深粉紅\n價格 <p>：… text-lg font-bold text-pink-600    18px、粗、深粉紅\n按鈕：… font-medium                            字稍微粗一點')}<p>注意 <code>text-</code> 有兩種用法：後面接<b>大小</b>（<code>text-xl</code>）或<b>顏色</b>（<code>text-pink-600</code>），電腦看你後面接什麼來分辨，兩種可以一起寫。</p>`,
      choice('<code>text-lg</code> 和 <code>text-pink-600</code> 分別是？', ['字級 18px、文字顏色深粉紅', '都是顏色', '都是字級'], 0, 'text- 後面接大小就是字級，接顏色就是文字顏色。')),
    gstep(`<p>⚠️ 常見的坑：</p><ul><li>把粗體寫成 <code>text-bold</code>，正確是 <code>font-bold</code>。</li><li>日期標籤原本有 <code>bg-pink-100</code>，這一關是在後面<b>加</b>字的樣式，背景要留著。</li><li>按鈕的 <code>text-white</code> 不要被誤刪。</li></ul><p><b>下一步預告：</b>第 5 關用 <code>flex</code> 把<b>價格和按鈕排成同一排</b>，一左一右。</p>`,
      choice('想要粗體，正確的 class 是？', ['font-bold', 'text-bold', 'bold'], 0, '粗細用 font- 開頭。')),
  ], {
    todo: ['TODO 1: 日期 <p> 的 class 後面加 text-xs font-bold text-pink-600', 'TODO 2: 標題 <h2> 的 class 改成 mb-1 text-xl font-bold text-gray-900', 'TODO 3: 說明 <p> 的 class 改成 mb-3 text-sm text-gray-500', 'TODO 4: 價格 <p> 的 class 改成 mb-4 text-lg font-bold text-pink-600', 'TODO 5: 按鈕的 class 後面加 font-medium'],
    rest: {
      brief: '第 4 步：調整文字。日期：12px、粗體、pink-600。標題：20px、粗體、gray-900。說明：14px、gray-500。價格：18px、粗體、pink-600。按鈕：字體 medium 粗細。（前面做好的樣式都要保留）',
      hint: '日期 <code>text-xs font-bold text-pink-600</code>；標題 <code>text-xl font-bold text-gray-900</code>；說明 <code>text-sm text-gray-500</code>；價格 <code>text-lg font-bold text-pink-600</code>；按鈕 <code>font-medium</code>。',
      steps: [
        `日期的 class 最後面接上 <code>text-xs font-bold text-pink-600</code><br>為什麼：小小的粗體粉紅字，搭配淡粉紅底最好看。`,
        `標題的 class 改成 <code>mb-1 text-xl font-bold text-gray-900</code><br>為什麼：最大、最粗、最黑，視線第一個會看到它。`,
        `說明的 class 改成 <code>mb-3 text-sm text-gray-500</code><br>為什麼：次要資訊，小而灰。`,
        `價格的 class 改成 <code>mb-4 text-lg font-bold text-pink-600</code>，按鈕最後面加 <code>font-medium</code><br>為什麼：價格要突出，所以用大一點、粗一點、跟主色一樣的粉紅。`,
        `最常見的錯：把 <code>font-bold</code> 寫成 <code>text-bold</code>，或是只寫了字級忘了顏色。逐個元素對照 TODO 檢查。`,
      ],
    },
  }),

  unit(5, '卡片裡的排版：用 flex 讓價格和按鈕同一排', [
    gstep(`<p>現在價格在上、按鈕在下，卡片偏長。購票卡片常見的設計是：<b>價格在左、按鈕在右，同一排</b>。這要用你學過的 <code>flex</code>。</p><p>做法有兩件事：①把價格和按鈕<b>包進一個新的 div</b>（因為 flex 要加在「外層」，管裡面的小孩）；②在這個 div 上加 flex 的 class。</p>`,
      choice('想讓兩個元素橫向排成一排，flex 要加在？', ['它們共同的外層盒子', '其中一個元素自己', '最外面的整個網頁'], 0, 'flex 加在外層，管裡面的子元素怎麼排。')),
    gstep(`<p>外層 div 的寫法：</p>${pre('<div class="flex items-center justify-between mt-4">\n  <p class="text-lg font-bold text-pink-600">NT$ 3800</p>\n  <button …>立即購票</button>\n</div>')}<ul><li><code>flex</code>：子元素橫向排列。</li><li><code>justify-between</code>：頭尾貼邊，一個靠左一個靠右。</li><li><code>items-center</code>：上下置中對齊（價格和按鈕不同高也會對齊中線）。</li><li><code>mt-4</code>：和上面說明保持 16px。</li></ul>`,
      choice('價格靠左、按鈕靠右，用哪個 class？', ['justify-between', 'items-center', 'gap-4'], 0, 'justify-between 讓頭尾貼邊。')),
    gstep(`<p>⚠️ 常見的坑：</p><ul><li>只寫 <code>justify-between</code> 沒寫 <code>flex</code>，沒效果。</li><li>價格原本的 <code>mb-4</code> 要<b>拿掉</b>：現在換成外層用 <code>mt-4</code> 管距離，不然會多出一塊空白。</li><li>價格和按鈕兩個都要放進<b>同一個</b> div 裡。</li></ul><p><b>下一步預告：</b>第 6 關幫按鈕加上 <code>hover:</code>，滑鼠移上去會變色。</p>`,
      choice('把價格的 <code>mb-4</code> 拿掉、改在外層加 <code>mt-4</code>，是因為？', ['現在由外層負責和上面的距離，避免多一塊空白', '因為 mb-4 是錯的 class', '因為 flex 不能有外距'], 0, '距離的責任換了位置，舊的就要拿掉。')),
  ], {
    todo: ['TODO 1: 用一個 <div> 把「價格 <p>」和「按鈕」一起包起來', 'TODO 2: 這個 <div> 加 class="flex items-center justify-between mt-4"', 'TODO 3: 價格 <p> 的 class 拿掉 mb-4（變成 text-lg font-bold text-pink-600）'],
    rest: {
      brief: '第 5 步：把價格和按鈕包進同一個 div，讓它們橫向一排：頭尾貼邊（價格靠左、按鈕靠右）、上下置中、和上方說明距離 16px。價格不再需要自己的下方外距。',
      hint: '新的 div：<code>flex items-center justify-between mt-4</code>。價格的 class 變成 <code>text-lg font-bold text-pink-600</code>。',
      steps: [
        `在價格 <code>&lt;p&gt;</code> 前面打<pre>&lt;div class="flex items-center justify-between mt-4"&gt;</pre>為什麼：這個 div 就是新的「一排」，flex 管它裡面的價格和按鈕。`,
        `在按鈕後面打 <code>&lt;/div&gt;</code> 把它關起來<br>為什麼：價格和按鈕都要在這個 div 裡面，只包到一個是不會同一排的。`,
        `把價格 <code>&lt;p&gt;</code> 的 class 改成 <code>text-lg font-bold text-pink-600</code>（拿掉 <code>mb-4</code>）<br>為什麼：和上面的距離交給外層的 <code>mt-4</code>。`,
        `看右邊：價格應該在左、按鈕在右，上下對齊。`,
        `最常見的錯：<code>&lt;/div&gt;</code> 放錯位置，不小心把整張卡片的結尾也吃掉。縮排對齊看看：新的 div 要比 #card 多縮一層。`,
      ],
      must: [{ re: /\bflex\b/, msg: '請在外層 div 加 flex' }, { re: /justify-between/, msg: '請用 justify-between 讓價格靠左、按鈕靠右' }],
    },
  }),

  unit(6, '按鈕的 hover 狀態：滑過去會變色', [
    gstep(`<p>按鈕現在靜止時很好看，但<b>滑鼠移上去沒有任何反應</b>，使用者會不確定「這能按嗎？」。好的按鈕要有回饋：滑過去顏色變深一點。</p><p>你在第 5 堂學過：在 class 前面加<b>前綴</b>表示「某個狀態才套用」。<code>hover:bg-pink-600</code> = 「滑鼠移上去時，背景變 pink-600（比 500 深一階）」。</p>`,
      choice('<code>hover:bg-pink-600</code> 什麼時候生效？', ['滑鼠移到按鈕上面時', '一直都生效', '按鍵盤時'], 0, 'hover 就是滑鼠懸停。')),
    gstep(`<p>變色如果「啪」一下瞬間換掉，會有點生硬。再加一個 <code>transition</code>，顏色就會<b>平順地漸變</b>：</p>${pre('<button class="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium\n  hover:bg-pink-600 transition">立即購票</button>')}<p>class 可以換行寫，空格和換行都算分隔。平常是 pink-500，滑過去 0.15 秒左右漸漸變成 pink-600。</p>`,
      choice('<code>transition</code> 的作用是？', ['讓顏色變化平順漸變，不是瞬間跳換', '讓按鈕變大', '讓按鈕消失'], 0, 'transition 給狀態變化加上動畫。')),
    gstep(`<p>⚠️ 常見的坑：</p><ul><li>寫成 <code>hover-bg-pink-600</code>（用橫線）：前綴後面一定是<b>冒號</b>。</li><li>只寫 <code>hover:bg-pink-600</code> 卻把原本的 <code>bg-pink-500</code> 刪掉：平常就沒有底色了。「平常」和「hover」兩個都要留。</li></ul><p>這一關的檢查，滑鼠沒辦法自動移上去，所以會看你有沒有寫 <code>hover:bg-</code>，以及 <code>transition</code> 有沒有生效。</p><p><b>下一步預告：</b>第 7 關把一張卡片變成<b>三張</b>，用 <code>grid</code> 排成一排。</p>`,
      choice('hover 前綴後面接什麼符號？', ['冒號 :', '橫線 -', '空格'], 0, 'hover:bg-pink-600，冒號。')),
  ], {
    todo: ['TODO 1: 按鈕的 class 後面加 hover:bg-pink-600（滑鼠移上去變深一階）', 'TODO 2: 再加 transition（讓顏色漸變）'],
    rest: {
      brief: '第 6 步：按鈕加上 hover 狀態：滑鼠移上去背景變 pink-600，而且顏色變化要平順（transition）。原本的 pink-500 背景要保留。',
      hint: '按鈕的 class 最後面接上：<code>hover:bg-pink-600 transition</code>。',
      steps: [
        `找到按鈕的 class（<code>px-4 py-2 bg-pink-500 text-white rounded-lg font-medium</code>），在最後面按空格<br>為什麼：新 class 接在後面，原本的都要留著。`,
        `打 <code>hover:bg-pink-600</code><br>為什麼：<code>hover:</code> 前綴 = 滑鼠移上去才套用，背景換成深一階的粉紅。`,
        `再空格，打 <code>transition</code><br>為什麼：讓顏色漸變，不會突然跳色。`,
        `完整是 <code>px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition</code>。`,
        `最常見的錯：<code>hover</code> 後面少了冒號，或把原本的 <code>bg-pink-500</code> 刪掉。`,
      ],
      must: [{ re: /hover:bg-pink-600/, msg: '請加 hover:bg-pink-600，滑過去變深一階' }, { re: /\btransition\b/, msg: '請加 transition 讓顏色漸變' }],
    },
  }),

  unit(7, '三張卡片：用 grid 排成一排', [
    gstep(`<p>活動頁不會只有一張卡片。這一步把卡片<b>複製成三張</b>，再用 <code>grid</code> 排成一排。</p><p>做法：①最外面再包一個大盒子 <code>#list</code>；②卡片複製成 3 份放在裡面；③ <code>#list</code> 加 <code>grid grid-cols-3 gap-4</code>（3 欄、間距 16px）。</p>`,
      choice('三張卡片排成 3 欄，grid 要加在？', ['包住三張卡片的外層盒子', '每一張卡片上', '按鈕上'], 0, 'grid 加在外層，管裡面的子元素怎麼排。')),
    gstep(`<p>結構會長這樣：</p>${pre('<div id="list" class="grid grid-cols-3 gap-4">\n  <div class="p-4 bg-white …">   卡片 1（內容都一樣）\n  </div>\n  <div class="p-4 bg-white …">   卡片 2\n  </div>\n  <div class="p-4 bg-white …">   卡片 3\n  </div>\n</div>')}<p><b>兩個重點改動：</b></p><ul><li><code>id="card"</code> 拿掉（<code>id</code> 在網頁上只能出現一次，複製三份會重複），改由外層 <code>#list</code> 用 id。</li><li>卡片的 <code>w-72</code> 要<b>拿掉</b>：格子會自己決定每一欄多寬，卡片固定寬度反而會擠爆。</li></ul>`,
      choice('卡片複製三份，為什麼要把 <code>id="card"</code> 拿掉？', ['id 不能重複，同一個 id 只能出現一次', '因為 id 會讓卡片消失', '因為 Tailwind 不支援 id'], 0, 'id 是獨一無二的名字，不能三張卡片都叫 card。')),
    gstep(`<p>⚠️ 常見的坑：</p><ul><li>只寫 <code>grid-cols-3</code> 卻忘了 <code>grid</code>，卡片還是直向疊在一起。</li><li>忘記拿掉 <code>w-72</code>，每張卡片都是 288px，三張擠出邊界。</li><li>複製時漏了結尾的 <code>&lt;/div&gt;</code>，後面的卡片會跑進前一張裡面。</li></ul><p>目前右邊預覽視窗不寬，三欄會有點窄，這很正常。<b>下一步預告：</b>第 8 關讓手機只顯示一欄、電腦才三欄，用 <code>md:</code> 前綴。</p>`,
      choice('在 grid 裡，卡片的固定寬度 <code>w-72</code> 應該？', ['拿掉，讓格子決定寬度', '加大一點', '留著，一定要'], 0, '寬度交給 grid 的欄來分配。')),
  ], {
    todo: ['TODO 1: 最外面包一個 <div id="list" class="grid grid-cols-3 gap-4">', 'TODO 2: 把卡片複製成 3 份放進去（三張內容一樣就好）', 'TODO 3: 卡片的 id="card" 拿掉，class 裡的 w-72 也拿掉（其他 class 都留著）'],
    rest: {
      brief: '第 7 步：用 <code>#list</code> 包住三張一模一樣的卡片，排成 3 欄、間距 16px。每張卡片都要有完整的內容與前面做好的樣式，但不要有 <code>w-72</code>，也不要重複 <code>id="card"</code>。',
      hint: '外層 <code>&lt;div id="list" class="grid grid-cols-3 gap-4"&gt;</code>。卡片 class：<code>p-4 bg-white border border-gray-200 rounded-xl shadow-md</code>。可以把第一張整段複製貼上兩次。',
      steps: [
        `把原本的 <code>&lt;div id="card" class="…"&gt;</code> 這一行改成<pre>&lt;div class="p-4 bg-white border border-gray-200 rounded-xl shadow-md"&gt;</pre>為什麼：拿掉 id 和 <code>w-72</code>，其他保留。`,
        `選取整張卡片（從這個 div 到對應的結尾），複製，在後面貼上兩次<br>為什麼：得到三張一模一樣的卡片。`,
        `在三張卡片的最外面，前面加<pre>&lt;div id="list" class="grid grid-cols-3 gap-4"&gt;</pre>最後面加 <code>&lt;/div&gt;</code><br>為什麼：<code>grid grid-cols-3</code> 把子元素分成 3 欄，<code>gap-4</code> 是卡片間距 16px。`,
        `看右邊：三張卡片應該並排。`,
        `最常見的錯：沒拿掉 <code>w-72</code>，或只貼了一張。數一數有沒有三個 <code>&lt;h2&gt;</code>。`,
      ],
      must: [{ re: /grid-cols-3/, msg: '請在 #list 加 grid-cols-3' }, { re: /(<h2[\s\S]*){3}/, msg: '請放三張卡片（要有三個 <h2>）' }, { re: /id="list"/, msg: '外層請用 id="list"' }],
    },
  }),

  unit(8, '響應式：手機一欄、電腦三欄', [
    gstep(`<p>最後一關！手機螢幕很窄，三欄會擠得看不清楚。我們要：<b>手機一欄（直向疊）、電腦（寬螢幕）才三欄</b>。</p><p>Tailwind 是<b>手機優先</b>：沒前綴的 class 是給「所有螢幕」，特別是小螢幕；加了 <code>md:</code> 前綴，才是「寬度 ≥ 768px」才套用。所以寫法是「先寫手機的樣子，再用 md: 改成電腦的樣子」。</p>`,
      choice('手機優先的意思是？', ['沒前綴的 class 先給小螢幕，大螢幕再用 md: 這類前綴加強', '一定要先寫電腦版', '手機看不到網頁'], 0, '先寫手機，再往大螢幕加。')),
    gstep(`<p>#list 的 class 從 <code>grid grid-cols-3 gap-4</code> 改成：</p>${pre('grid grid-cols-1 gap-4 md:grid-cols-3')}<ul><li><code>grid-cols-1</code>：預設一欄（手機）。</li><li><code>md:grid-cols-3</code>：螢幕寬 ≥ 768px 才變三欄。</li><li><code>grid</code>、<code>gap-4</code>：不管螢幕多寬都一樣，所以不用前綴。</li></ul><p>記法：<b>只有「要改變的那一個」才加前綴</b>，其他共通的不用重寫。</p>`,
      choice('「手機一欄、電腦三欄」該怎麼寫？', ['grid-cols-1 md:grid-cols-3', 'md:grid-cols-1 grid-cols-3', 'grid-cols-1 grid-cols-3'], 0, '沒前綴是手機，md: 是電腦。')),
    gstep(`<p>⚠️ 常見的坑：</p><ul><li>把順序想反：寫成 <code>grid-cols-3 md:grid-cols-1</code>，結果變成「手機三欄、電腦一欄」。</li><li><code>md:</code> 後面的冒號漏掉。</li><li>想用 <code>sm:</code>、<code>lg:</code> 也可以：sm 640px、md 768px、lg 1024px。</li></ul><p>🎉 做完這一步，你就從<b>空白頁面</b>完成了一張完整的卡片頁：<b>內容 → 間距 → 顏色圓角陰影 → 文字 → flex → hover → grid → 響應式</b>。每一步你都知道「為什麼」。檢查會把前面所有樣式一起重新驗一次。</p>`,
      choice('如果寫成 <code>grid-cols-3 md:grid-cols-1</code>，結果是？', ['手機三欄、電腦一欄（剛好反過來）', '手機一欄、電腦三欄', '完全沒效果'], 0, '沒前綴是手機，md: 是 768px 以上，意思被你寫反了。')),
  ], {
    todo: ['TODO: #list 的 class 從 "grid grid-cols-3 gap-4" 改成 "grid grid-cols-1 gap-4 md:grid-cols-3"（手機一欄，電腦三欄）'],
    rest: {
      brief: '第 8 步（最後一步）：讓三張卡片「手機一欄、螢幕寬 768px 以上才三欄」。前面做好的所有樣式（間距、顏色、陰影、文字、flex、hover）都要保留。',
      hint: '只要改 #list 的 class：<code>grid grid-cols-1 gap-4 md:grid-cols-3</code>。',
      steps: [
        `找到 <code>&lt;div id="list" class="grid grid-cols-3 gap-4"&gt;</code><br>為什麼：響應式的欄數只要改最外層這一個地方。`,
        `把 <code>grid-cols-3</code> 改成 <code>grid-cols-1</code>，然後在後面加 <code>md:grid-cols-3</code><br>為什麼：沒前綴的是手機（一欄），<code>md:</code> 是寬螢幕（三欄）。完整是 <code>grid grid-cols-1 gap-4 md:grid-cols-3</code>。`,
        `把右邊預覽視窗想成手機：應該一張一張疊起來。`,
        `最常見的錯：把前綴放反（<code>md:grid-cols-1</code>），或只加了 <code>md:grid-cols-3</code> 卻沒寫 <code>grid-cols-1</code>（這個遊戲的檢查要你明確寫出手機版）。`,
      ],
      must: [{ re: /md:grid-cols-3/, msg: '請加 md:grid-cols-3（電腦三欄）' }, { re: /(^|\s|")grid-cols-1/, msg: '請明確寫 grid-cols-1（手機一欄）' }],
    },
  }),
];

const QUIZ = [
  choice('做一個要排很多樣式的元件，比較好的做法是？', ['先蓋出內容，再一層一層加樣式、每步都看結果', '一開始就寫完全部 class', '先寫完樣式再放文字'], 0),
  choice('想讓「價格靠左、按鈕靠右」同一排，要在？', ['它們共同的外層加 flex justify-between', '在按鈕上加 flex', '在價格上加 mb-4'], 0),
  choice('<code>grid-cols-1 md:grid-cols-3</code> 的意思是？', ['手機一欄，螢幕 ≥ 768px 變三欄', '手機三欄，電腦一欄', '永遠一欄'], 0),
  choice('<code>hover:bg-pink-600 transition</code> 的效果是？', ['滑鼠移上去，背景平順變成深一階的粉紅', '按鈕永遠是深粉紅', '滑鼠移上去按鈕消失'], 0),
];

const EVENT = {
  npc: 'pm', mood: 'happy', text: '下週要上線一個活動頁：三張活動卡片，手機電腦都要好看。你一個人從頭做得完嗎？',
  options: [{ label: '可以，我先蓋內容，再一步一步加間距、顏色、排版，最後才做響應式', fx: { quality: 10, team: 6 } }, { label: '我一次把所有 class 寫完再看畫面', fx: { quality: -6, stress: 8 } }],
};

export const GUIDED = { chapter: { id: 'tw-cg', title: '第三章　手把手專案：活動卡片（從純 HTML 做到響應式）', lessons: TG_UNITS, quiz: QUIZ, projects: [], event: 'tw-cg' }, event: EVENT };
