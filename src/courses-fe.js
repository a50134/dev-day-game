// React、Vue 課程（格式同 courses.js：每堂 3 個小步驟 + 總練習；每章測驗 + 小專案）。
// 練習用「真的操作畫面」的測試檢查：點按鈕、輸入文字，再看畫面上的結果。
import { FIXTURES } from './fixtures.js';

const pre = (code) => `<pre>${code.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>`;
const choice = (q, options, answer, why) => ({ type: 'choice', q, options, answer, why });
const react = (o) => ({ kind: 'react', ...o });
const vue = (o) => ({ kind: 'vue', ...o });
const txt = (el) => (el?.textContent || '').replace(/,/g, '').trim();
const RH = 'const { useState, useEffect } = React;\n\n';
const vueApp = (setup, body) => `<div id="app">\n${body}\n</div>\n<script>\n${setup}\n</script>\n`;

/* 共用測試 */
const testSeats = (c) => {
  const f = [], seats = c.ta('seat');
  if (seats.length !== 3) return [`應該有 3 個座位（data-testid="seat"），目前 ${seats.length} 個`];
  ['A1', 'A2', 'A3'].forEach((id, i) => { if (!seats[i].textContent.includes(id)) f.push(`第 ${i + 1} 個座位應顯示 ${id}`); });
  if (!seats[1].textContent.includes('已售')) f.push('已售出的 A2 後面要有「已售」');
  if (seats[0].textContent.includes('已售') || seats[2].textContent.includes('已售')) f.push('沒售出的座位不能顯示「已售」');
  return f;
};
const testSearch = async (c) => {
  const f = [], n = () => c.ta('event').length, inp = c.t('search');
  if (!inp) return ['缺少搜尋框 data-testid="search"'];
  if (n() !== 4) f.push(`一開始應顯示 4 個活動，目前 ${n()} 個`);
  await c.type(inp, '星'); if (n() !== 2) f.push(`輸入「星」應剩 2 個，目前 ${n()} 個`);
  await c.type(inp, '交響'); if (n() !== 1) f.push(`輸入「交響」應剩 1 個，目前 ${n()} 個`);
  await c.type(inp, ''); if (n() !== 4) f.push(`清空後應回到 4 個，目前 ${n()} 個`);
  return f;
};
const testCounter = async (c, withTotal) => {
  const f = [], count = () => txt(c.t('count'));
  if (!c.t('plus') || !c.t('minus') || !c.t('count')) return ['缺少 plus / minus / count 元素'];
  await c.click(c.t('plus')); await c.click(c.t('plus'));
  if (count() !== '2') f.push(`按兩次＋後應是 2，目前是 ${count()}`);
  if (withTotal && !txt(c.t('total')).includes('7600')) f.push('兩張 × 3800 = 7600，total 要顯示 7600');
  await c.click(c.t('minus'));
  if (count() !== '1') f.push(`再按一次−應是 1，目前是 ${count()}`);
  if (withTotal && !txt(c.t('total')).includes('3800')) f.push('一張時 total 要顯示 3800');
  for (let i = 0; i < 3; i++) await c.click(c.t('minus'));
  if (count() !== '0') f.push(`一直按−不能小於 0，目前是 ${count()}`);
  return f;
};

/* ============================ React ============================ */
const R1 = {
  id: 'rc1', title: '第 1 堂　元件與 JSX',
  steps: [
    { say: `<p>React 把畫面拆成一塊一塊的<b>元件</b>。元件就是一個「回傳畫面的函式」，名字要<b>大寫開頭</b>：</p>${pre('function Hello() {\n  return <h1>哈囉</h1>;\n}')}`,
      check: choice('React 元件本質上是什麼？', ['一個回傳畫面的函式', '一個 CSS 檔', '一個資料庫'], 0, '對，函式回傳的就是畫面。') },
    { say: `<p>函式裡面那個像 HTML 的寫法叫 <b>JSX</b>。幾個和 HTML 不同的地方：</p><ul><li><code>class</code> 要寫成 <code>className</code>（因為 class 是 JS 的保留字）</li><li>最外面只能有<b>一個</b>標籤，可以用 <code>&lt;div&gt;</code> 包起來</li></ul>`,
      check: choice('哪個在 JSX 裡是對的？', ['<div class="a">', '<div className="a">', '<div classname="a">'], 1, 'JSX 用 className。') },
    { say: `<p>在 JSX 裡用<b>大括號 { }</b> 放 JavaScript，就能顯示變數的值：</p>${pre("const price = 3800;\n\nreturn <p>NT$ {price}</p>;")}`,
      check: choice('想在畫面顯示變數 <code>price</code> 的值，要寫？', ['{price}', 'price', '${price}'], 0, '用大括號包起來。') },
  ],
  final: react({
    brief: '修好 App：用 <code>{title}</code> 把標題顯示在 <code>data-testid="title"</code> 的 h1，用 <code>{price}</code> 把「NT$ 價格」顯示在 <code>data-testid="price"</code> 的 p。',
    hint: '<code>&lt;h1 data-testid="title"&gt;{title}&lt;/h1&gt;</code>；<code>&lt;p data-testid="price"&gt;NT$ {price}&lt;/p&gt;</code>。寫完按「檢查」。',
    demo: `<p>範例（咖啡店）：把店名和一杯拿鐵的價格顯示在畫面上。</p>${pre(`function App() {
  const shop = '小森咖啡';
  const price = 120;
  return (
    <div>
      <h1>{shop}</h1>
      <p>拿鐵 NT$ {price}</p>
    </div>
  );
}`)}<ul><li><code>const shop = ...</code>：先把店名存進變數。為什麼：之後改店名只要改這一行。</li><li><code>{shop}</code>：大括號會把變數的值放到畫面上。為什麼：不用大括號，畫面只會印出 shop 這四個字。</li><li><code>NT$ {price}</code>：固定文字和變數可以接在一起寫。</li></ul>`,
    steps: [
      `<p>找到程式裡的 <code>TODO 1</code> 那一行註解，整行換成：</p>${pre('<h1 data-testid="title">{title}</h1>')}<p>為什麼：測試是靠 data-testid 找到這個標題；{title} 才會把變數的內容放進去。</p>`,
      `<p>找到 <code>TODO 2</code> 那一行，整行換成：</p>${pre('<p data-testid="price">NT$ {price}</p>')}<p>為什麼：「NT$ 」是固定文字直接打，價格是變數，所以只有 price 要包大括號。</p>`,
      `<p>兩行都換好後，按「檢查」，看畫面有沒有出現標題和價格。</p><p>為什麼：先檢查才知道有沒有打錯，錯了再回頭改就好。</p>`,
      `<p>最常見的錯誤：忘了大括號，寫成 <code>&lt;h1&gt;title&lt;/h1&gt;</code>，畫面就只會看到 title 這個字，而不是標題內容。為什麼：沒有大括號，React 會把它當成普通文字。</p>`,
    ],
    starter: `${RH}function App() {
  const title = '星光巡迴演唱會';
  const price = 3800;
  return (
    <div>
      {/* TODO 1: <h1 data-testid="title"> 顯示 title */}
      {/* TODO 2: <p data-testid="price"> 顯示「NT$ 價格」 */}
    </div>
  );
}
`,
    solution: `${RH}function App() {
  const title = '星光巡迴演唱會';
  const price = 3800;
  return (
    <div>
      <h1 data-testid="title">{title}</h1>
      <p data-testid="price">NT$ {price}</p>
    </div>
  );
}
`,
    must: [{ re: /\{\s*title\s*\}/, msg: '請用 {title} 顯示變數，不要直接寫死文字' }, { re: /\{\s*price\s*\}/, msg: '請用 {price} 顯示變數' }],
    test: (c) => {
      const f = [];
      if (txt(c.t('title')) !== '星光巡迴演唱會') f.push('title 要顯示「星光巡迴演唱會」');
      if (!txt(c.t('price')).includes('3800')) f.push('price 要顯示 NT$ 3800');
      return f;
    },
  }),
};

const R2 = {
  id: 'rc2', title: '第 2 堂　Props：傳資料給元件',
  steps: [
    { say: `<p><b>props</b> 是父元件傳給子元件的資料，像函式的參數：</p>${pre('function Card({ title, price }) {\n  return <p>{title} NT$ {price}</p>;\n}\n\n<Card title="星光演唱會" price={3800} />')}`,
      check: choice('props 的作用是？', ['把資料從父元件傳給子元件', '改變瀏覽器網址', '儲存到硬碟'], 0, '對，資料由上往下傳。') },
    { say: `<p>傳 props 的寫法：<b>文字用引號，其他（數字、變數、陣列）用大括號</b>：</p>${pre('<Card title="星光演唱會" price={3800} />')}`,
      check: choice('<code>price</code> 要傳數字 3800，怎麼寫？', ['price="3800"', 'price={3800}', 'price=3800'], 1, '數字要用大括號，引號會變成文字。') },
    { say: `<p>好處：<b>同一個元件可以重複使用</b>，每次傳不同的資料，就畫出不同的內容。網站上的每一張活動卡片，通常都是同一個元件。</p>`,
      check: choice('為什麼要把畫面拆成元件？', ['同一段畫面能重複使用，每次帶不同資料', '讓檔案變大', '因為 React 規定每頁只能一個標籤'], 0, '重複使用就是元件的價值。') },
  ],
  final: react({
    brief: '完成 Card 元件：在 <code>data-testid="card-title"</code> 的 h3 顯示 title，在 <code>data-testid="card-price"</code> 的 p 顯示「NT$ 價格」。App 已經用了兩次 Card。',
    hint: 'Card 的參數已經用 <code>{ title, price }</code> 解開了，直接在 JSX 裡用 <code>{title}</code>、<code>{price}</code>。',
    demo: `<p>範例（書店）：同一個 BookCard 元件，用兩次，每次傳不同的書。</p>${pre(`function BookCard({ name, price }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>NT$ {price}</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <BookCard name="小王子" price={280} />
      <BookCard name="海邊的卡夫卡" price={420} />
    </div>
  );
}`)}<ul><li><code>{ name, price }</code>：把爸爸傳來的資料拆開備用。為什麼：這樣下面可以直接寫 {name}。</li><li><code>name="小王子"</code>：文字用引號傳。<code>price={280}</code>：數字用大括號傳。</li><li>用兩次 BookCard，畫面就有兩本書。為什麼：同一個元件重複使用，只換資料。</li></ul>`,
    steps: [
      `<p>先看 <code>function Card({ title, price })</code> 這一行，確認它已經把 title、price 拆開了，這行不用改。</p><p>為什麼：先知道手上有哪些資料可以用。</p>`,
      `<p>在 <code>TODO</code> 那一行，換成標題：</p>${pre('<h3 data-testid="card-title">{title}</h3>')}<p>為什麼：App 用了兩次 Card，這一行會自動畫出兩個標題。</p>`,
      `<p>接著在標題下面加上價格：</p>${pre('<p data-testid="card-price">NT$ {price}</p>')}<p>為什麼：測試要找到兩個 card-price 來檢查價格。</p>`,
      `<p>按「檢查」。</p>`,
      `<p>最常見的錯誤：把 <code>{title}</code> 寫成 <code>{props.title}</code> 或拼錯變數名字（例如 titel）。為什麼：這個 Card 已經把資料拆開了，名字必須和上面 <code>{ title, price }</code> 一模一樣。</p>`,
    ],
    starter: `${RH}function Card({ title, price }) {
  return (
    <div>
      {/* TODO: <h3 data-testid="card-title"> 顯示 title；<p data-testid="card-price"> 顯示「NT$ 價格」 */}
    </div>
  );
}

function App() {
  return (
    <div>
      <Card title="星光巡迴演唱會" price={3800} />
      <Card title="交響樂之夜" price={1800} />
    </div>
  );
}
`,
    solution: `${RH}function Card({ title, price }) {
  return (
    <div>
      <h3 data-testid="card-title">{title}</h3>
      <p data-testid="card-price">NT$ {price}</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <Card title="星光巡迴演唱會" price={3800} />
      <Card title="交響樂之夜" price={1800} />
    </div>
  );
}
`,
    test: (c) => {
      const f = [], t = c.ta('card-title'), p = c.ta('card-price');
      if (t.length !== 2 || p.length !== 2) return [`應有 2 組 card-title / card-price，目前 ${t.length} / ${p.length}`];
      if (txt(t[0]) !== '星光巡迴演唱會' || txt(t[1]) !== '交響樂之夜') f.push('標題要依序顯示「星光巡迴演唱會」「交響樂之夜」');
      if (!txt(p[0]).includes('3800') || !txt(p[1]).includes('1800')) f.push('價格要依序顯示 3800、1800');
      return f;
    },
  }),
};

const R3 = {
  id: 'rc3', title: '第 3 堂　State：會變的資料',
  steps: [
    { say: `<p><b>state</b> 是「會改變、而且改變後畫面要跟著更新」的資料，用 <code>useState</code> 建立：</p>${pre('const [count, setCount] = useState(0);\n// count     目前的值\n// setCount  用來更新的函式')}`,
      check: choice('<code>useState(0)</code> 裡的 <code>0</code> 是什麼？', ['初始值', '最大值', '函式的名字'], 0, '一開始 count 就是 0。') },
    { say: `<p>用事件更新 state，<b>一定要用 setCount</b>，React 才知道要重新畫畫面：</p>${pre('<button onClick={() => setCount(count + 1)}>＋</button>')}<p>直接寫 <code>count = count + 1</code> 畫面不會變。</p>`,
      check: choice('要更新 state，該怎麼做？', ['呼叫 setCount(新值)', 'count++', 'count = 新值'], 0, '只有 setter 會觸發畫面更新。') },
    { say: `<p>想限制範圍（例如不能小於 0），在更新時算好新值：</p>${pre('setCount(Math.max(0, count - 1)) // 最小是 0')}`,
      check: choice('按「−」不想變成負數，用哪個？', ['setCount(Math.max(0, count - 1))', 'setCount(count - 1)', 'setCount(-1)'], 0, 'Math.max 取兩者較大的。') },
  ],
  final: react({
    brief: '做一個票數選擇器：按 <code>＋</code> 加 1、按 <code>−</code> 減 1，但數字不能小於 0。按鈕和數字的 data-testid 已經寫好。',
    hint: '<code>onClick={() => setCount(count + 1)}</code>；減的時候用 <code>Math.max(0, count - 1)</code>。',
    demo: `<p>範例（咖啡店）：做一個「杯數」計數器，按＋加 1，按−減 1，最少 0。</p>${pre(`function App() {
  const [cups, setCups] = useState(0);
  return (
    <div>
      <button onClick={() => setCups(Math.max(0, cups - 1))}>−</button>
      <span>{cups}</span>
      <button onClick={() => setCups(cups + 1)}>＋</button>
    </div>
  );
}`)}<ul><li><code>useState(0)</code>：建立會變的資料，一開始是 0。為什麼：普通變數改了畫面不會動，state 才會。</li><li><code>setCups(cups + 1)</code>：用 setter 更新。為什麼：React 要靠它才知道要重畫。</li><li><code>Math.max(0, cups - 1)</code>：取 0 和 cups-1 比較大的。為什麼：這樣永遠不會小於 0。</li></ul>`,
    steps: [
      `<p>先看一下第一行 <code>const [count, setCount] = useState(0)</code>，已經寫好了，不用改。</p><p>為什麼：count 是目前的數字，setCount 是用來改它的工具。</p>`,
      `<p>在「＋」按鈕那行，標籤裡加上：</p>${pre('onClick={() => setCount(count + 1)}')}<p>為什麼：點下去時，把 count 換成加 1 的新值，畫面才會更新。</p>`,
      `<p>在「−」按鈕那行加上：</p>${pre('onClick={() => setCount(Math.max(0, count - 1))}')}<p>為什麼：Math.max 讓數字最少停在 0，不會變負的。</p>`,
      `<p>刪掉那行 <code>TODO</code> 註解，按「檢查」。</p>`,
      `<p>最常見的錯誤：寫成 <code>count = count + 1</code> 或 <code>count++</code>。為什麼：直接改變數 React 不知道，數字畫面不會動，一定要用 setCount。</p>`,
    ],
    starter: `${RH}function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button data-testid="minus">−</button>
      <span data-testid="count">{count}</span>
      <button data-testid="plus">＋</button>
      {/* TODO: 讓 ＋ 加 1、− 減 1，但不能小於 0 */}
    </div>
  );
}
`,
    solution: `${RH}function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button data-testid="minus" onClick={() => setCount(Math.max(0, count - 1))}>−</button>
      <span data-testid="count">{count}</span>
      <button data-testid="plus" onClick={() => setCount(count + 1)}>＋</button>
    </div>
  );
}
`,
    test: (c) => testCounter(c, false),
  }),
};

const R4 = {
  id: 'rc4', title: '第 4 堂　列表與條件渲染',
  steps: [
    { say: `<p>資料是陣列時，用 <code>.map</code> 把每一筆變成一個元素：</p>${pre("{seats.map((s) => (\n  <li key={s.id}>{s.id}</li>\n))}")}`,
      check: choice('<code>seats.map(...)</code> 做了什麼？', ['把陣列每一筆轉成一個畫面元素', '刪除陣列', '排序陣列'], 0, 'map 就是「一筆變一個」。') },
    { say: `<p>列表裡每個元素要加 <code>key</code>，通常用資料的 id。React 靠它認出「哪一項是哪一項」，更新時才不會亂：</p>${pre('<li key={s.id}>')}`,
      check: choice('<code>key</code> 的用途是？', ['讓 React 分辨列表中的每一項', '決定字體顏色', '加密資料'], 0, 'key 要穩定且不重複。') },
    { say: `<p>條件渲染：用 <code>&&</code>（為真才顯示）或三元 <code>? :</code>（二選一）：</p>${pre("{s.sold && <span>（已售）</span>}\n{s.sold ? '已售' : '可選'}")}`,
      check: choice('<code>sold</code> 為 true 時才顯示「已售」，怎麼寫？', ["{sold && '已售'}", "{sold || '已售'}", "{'已售' && sold}"], 0, '&& 左邊為真，才會顯示右邊。') },
  ],
  final: react({
    brief: '用 <code>seats.map</code> 把每個座位畫成 <code>&lt;li key=… data-testid="seat"&gt;</code>，顯示座位編號；已售出的後面要加「（已售）」。',
    hint: '<code>&lt;li key={s.id} data-testid="seat"&gt;{s.id}{s.sold &amp;&amp; \'（已售）\'}&lt;/li&gt;</code>',
    demo: `<p>範例（書店）：把書單畫成列表，缺貨的書後面加「（缺貨）」。</p>${pre(`const books = [
  { id: 'b1', soldOut: false },
  { id: 'b2', soldOut: true },
];

function App() {
  return (
    <ul>
      {books.map((b) => (
        <li key={b.id}>{b.id}{b.soldOut && '（缺貨）'}</li>
      ))}
    </ul>
  );
}`)}<ul><li><code>books.map((b) =&gt; ...)</code>：每一本書變成一個 li。為什麼：資料有幾筆，畫面就自動有幾個。</li><li><code>key={b.id}</code>：給每一項一個不會重複的名字。為什麼：React 靠它分辨誰是誰。</li><li><code>b.soldOut && '（缺貨）'</code>：左邊是真的才顯示右邊。為什麼：沒缺貨就什麼都不顯示。</li></ul>`,
    steps: [
      `<p>在 <code>&lt;ul&gt;</code> 裡面，把 TODO 註解換成 map 的外框：</p>${pre('{seats.map((s) => (\n  \n))}')}<p>為什麼：map 會一個座位畫出一個 li。</p>`,
      `<p>在 map 的中間，寫一個 li：</p>${pre('<li key={s.id} data-testid="seat">{s.id}</li>')}<p>為什麼：key 讓 React 分辨每一項；data-testid 給測試找。</p>`,
      `<p>在 <code>{s.id}</code> 後面加上已售的判斷：</p>${pre("{s.sold && '（已售）'}")}<p>為什麼：只有 sold 是 true 的 A2 才會顯示「（已售）」。</p>`,
      `<p>按「檢查」。</p>`,
      `<p>最常見的錯誤：忘了 <code>key</code>，或 map 的箭頭後面用了大括號卻沒有 return。為什麼：沒 key 會有警告；用 <code>=&gt; (</code> 小括號包住 li 就不用 return。</p>`,
    ],
    starter: `${RH}const seats = [
  { id: 'A1', sold: false },
  { id: 'A2', sold: true },
  { id: 'A3', sold: false },
];

function App() {
  return (
    <ul>
      {/* TODO: 用 seats.map 畫出每個座位 <li key=... data-testid="seat">；已售出的後面加「（已售）」 */}
    </ul>
  );
}
`,
    solution: `${RH}const seats = [
  { id: 'A1', sold: false },
  { id: 'A2', sold: true },
  { id: 'A3', sold: false },
];

function App() {
  return (
    <ul>
      {seats.map((s) => (
        <li key={s.id} data-testid="seat">{s.id}{s.sold && '（已售）'}</li>
      ))}
    </ul>
  );
}
`,
    must: [{ re: /\.map\(/, msg: '請用 seats.map 畫列表' }, { re: /key=/, msg: '列表的每一項要加 key' }],
    test: testSeats,
  }),
};

const R5 = {
  id: 'rc5', title: '第 5 堂　表單與載入資料',
  steps: [
    { say: `<p>表單輸入框要和 state 綁在一起（<b>受控元件</b>）：值來自 state，輸入時用 <code>onChange</code> 更新 state：</p>${pre('<input value={name} onChange={(e) => setName(e.target.value)} />')}`,
      check: choice('受控 input 需要哪兩個屬性？', ['value 和 onChange', 'class 和 id', 'href 和 src'], 0, 'value 顯示 state，onChange 更新 state。') },
    { say: `<p>想在畫面<b>載入時</b>做一件事（例如向伺服器要資料），用 <code>useEffect</code>：</p>${pre("useEffect(() => {\n  fetch('/api/events').then((r) => r.json()).then(setEvents);\n}, []);")}`,
      check: choice('<code>useEffect</code> 最後面的 <code>[]</code> 代表？', ['只在第一次載入時執行一次', '每秒執行一次', '永遠不執行'], 0, '空陣列 = 只跑一次。') },
    { say: `<p>資料流程：<b>fetch 拿到資料 → 存進 state → 畫面自動更新</b>。所以 <code>.then(setEvents)</code> 把資料交給 state 的 setter。</p>`,
      check: choice('fetch 拿到資料後，要把它存到哪裡，畫面才會更新？', ['state（用 setter）', '一般變數', 'CSS 檔'], 0, '只有 state 的改變會讓畫面重畫。') },
  ],
  final: react({
    brief: '做一個打招呼表單：input 要受控（value + onChange）；<code>data-testid="hello"</code> 的 p 在名字空白時顯示「請輸入姓名」，否則顯示「你好，名字」。',
    hint: '<code>{name ? \'你好，\' + name : \'請輸入姓名\'}</code>；input 加 <code>value={name}</code> 與 <code>onChange={(e) => setName(e.target.value)}</code>。',
    demo: `<p>範例（書店）：輸入書名，下面立刻顯示「找：書名」。</p>${pre(`function App() {
  const [word, setWord] = useState('');
  return (
    <div>
      <input value={word} onChange={(e) => setWord(e.target.value)} />
      <p>{word ? '找：' + word : '請輸入書名'}</p>
    </div>
  );
}`)}<ul><li><code>value={word}</code>：輸入框顯示的字來自 state。為什麼：這樣 state 才是唯一的資料來源。</li><li><code>onChange=...setWord(e.target.value)</code>：每打一個字就把內容存回 state。為什麼：沒有它，你根本打不進字。</li><li><code>word ? A : B</code>：有字顯示 A，沒字顯示 B。</li></ul>`,
    steps: [
      `<p>先找到 <code>&lt;input ...&gt;</code> 那一行，在 placeholder 後面加上：</p>${pre('value={name}')}<p>為什麼：讓輸入框顯示的內容來自 state 的 name。</p>`,
      `<p>再在同一個 input 加上：</p>${pre('onChange={(e) => setName(e.target.value)}')}<p>為什麼：你打字時，把新內容存進 name，不然輸入框會卡住打不了字。</p>`,
      `<p>把 p 裡的 TODO 註解換成：</p>${pre("{name ? '你好，' + name : '請輸入姓名'}")}<p>為什麼：name 是空字串時算「沒有」，會顯示請輸入姓名；有字就顯示你好。</p>`,
      `<p>按「檢查」。</p>`,
      `<p>最常見的錯誤：只加了 value 卻忘了 onChange，結果輸入框完全打不進字。為什麼：value 把內容鎖在 state，沒有 onChange 去更新 state，就永遠不會變。</p>`,
    ],
    starter: `${RH}function App() {
  const [name, setName] = useState('');
  return (
    <div>
      <input data-testid="name" placeholder="姓名" />
      <p data-testid="hello">{/* TODO: 空白時顯示「請輸入姓名」，否則顯示「你好，名字」 */}</p>
    </div>
  );
}
`,
    solution: `${RH}function App() {
  const [name, setName] = useState('');
  return (
    <div>
      <input data-testid="name" placeholder="姓名" value={name} onChange={(e) => setName(e.target.value)} />
      <p data-testid="hello">{name ? '你好，' + name : '請輸入姓名'}</p>
    </div>
  );
}
`,
    must: [{ re: /value=/, msg: 'input 要加 value={name}（受控）' }, { re: /onChange=/, msg: 'input 要加 onChange' }],
    test: async (c) => {
      const f = [], hello = () => txt(c.t('hello'));
      if (!c.t('name')) return ['缺少 input data-testid="name"'];
      if (!hello().includes('請輸入姓名')) f.push('名字空白時應顯示「請輸入姓名」');
      await c.type(c.t('name'), '小明');
      if (!hello().includes('你好，小明')) f.push(`輸入「小明」後應顯示「你好，小明」，目前是「${hello()}」`);
      return f;
    },
  }),
};

const RC_QUIZ1 = [
  choice('React 元件的名字要怎麼取？', ['大寫開頭', '小寫開頭', '數字開頭'], 0),
  choice('在 JSX 裡設定 CSS class，要寫？', ['className', 'class', 'cssClass'], 0),
  choice('傳數字 5 給 props <code>n</code>，怎麼寫？', ['n="5"', 'n={5}', 'n=5'], 1),
  choice('更新 state 應該？', ['呼叫 setter，例如 setCount(1)', '直接改變數', '重新整理網頁'], 0),
];
const RC_QUIZ2 = [
  choice('<code>.map</code> 畫列表時，每一項要加什麼？', ['key', 'id 屬性就好', '不用加'], 0),
  choice('<code>sold &amp;&amp; &lt;b&gt;已售&lt;/b&gt;</code> 在 sold 是 false 時？', ['什麼都不顯示', '顯示 false', '報錯'], 0),
  choice('受控 input 的值來自？', ['state', 'CSS', 'localStorage'], 0),
  choice('<code>useEffect(..., [])</code> 的 <code>[]</code> 代表？', ['只在第一次載入時執行', '每次畫面更新都執行', '永遠不執行'], 0),
];

const RC_P1 = react({
  brief: '專案：票數選擇器（props + state）。TicketPicker 要有 state 記住張數：＋加 1、−減 1（不能小於 0），<code>count</code> 顯示張數，<code>total</code> 顯示「NT$ 總額」（價格 × 張數）。',
  hint: '把 <code>const [count, setCount] = useState(0)</code> 放進 TicketPicker；total 用 <code>price * count</code> 算。',
  demo: `<p>範例（咖啡店）：每杯 120 元，按＋就多一杯，並算出總額。</p>${pre(`function CoffeeCounter({ price }) {
  const [cups, setCups] = useState(0);
  return (
    <div>
      <button onClick={() => setCups(cups + 1)}>＋</button>
      <span>{cups}</span>
      <p>NT$ {price * cups}</p>
    </div>
  );
}`)}<ul><li><code>useState(0)</code> 放在元件裡面。為什麼：每個元件各記各的杯數。</li><li><code>price</code> 是爸爸傳來的 props，<code>cups</code> 是自己的 state。</li><li><code>price * cups</code>：總額不用另外存，每次畫面重畫時現算。為什麼：這樣永遠和杯數同步。</li></ul>`,
  steps: [
    `<p>在 TicketPicker 的最上面（TODO 那行）寫：</p>${pre('const [count, setCount] = useState(0);')}<p>為什麼：要有地方記住現在選了幾張。</p>`,
    `<p>把 count 那個 span 的 <code>0</code> 換成 <code>{count}</code>。</p><p>為什麼：不然畫面永遠顯示 0。</p>`,
    `<p>在 ＋ 按鈕加 <code>onClick={() => setCount(count + 1)}</code>，− 按鈕加 <code>onClick={() => setCount(Math.max(0, count - 1))}</code>。</p><p>為什麼：加要加 1；減要用 Math.max 避免低於 0。</p>`,
    `<p>把 total 那行換成：</p>${pre('<p data-testid="total">NT$ {price * count}</p>')}<p>為什麼：總額 = 單價 × 張數，張數變了它會自己重算。</p>`,
    `<p>最常見的錯誤：total 那行還留著 <code>NT$ 0</code> 沒改，或忘了把 span 裡的 0 換成 <code>{count}</code>。為什麼：寫死的 0 不會跟著 state 變。</p>`,
  ],
  starter: `${RH}function TicketPicker({ name, price }) {
  // TODO: 用 state 記住張數（從 0 開始，不能小於 0）
  return (
    <div>
      <h3>{name}</h3>
      <button data-testid="minus">−</button>
      <span data-testid="count">0</span>
      <button data-testid="plus">＋</button>
      <p data-testid="total">NT$ 0</p>
    </div>
  );
}

function App() {
  return <TicketPicker name="星光巡迴演唱會" price={3800} />;
}
`,
  solution: `${RH}function TicketPicker({ name, price }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h3>{name}</h3>
      <button data-testid="minus" onClick={() => setCount(Math.max(0, count - 1))}>−</button>
      <span data-testid="count">{count}</span>
      <button data-testid="plus" onClick={() => setCount(count + 1)}>＋</button>
      <p data-testid="total">NT$ {price * count}</p>
    </div>
  );
}

function App() {
  return <TicketPicker name="星光巡迴演唱會" price={3800} />;
}
`,
  test: (c) => testCounter(c, true),
});
const RC_P2 = react({
  brief: '專案：活動列表。頁面載入時用 <code>fetch(\'/api/events\')</code> 取得活動，存進 state，畫成 <code>&lt;li data-testid="event"&gt;標題 · 日期&lt;/li&gt;</code>。',
  hint: '<code>useEffect(() => { fetch(...).then(r => r.json()).then(setEvents); }, []);</code>，再用 <code>events.map</code>。',
  demo: `<p>範例（書店）：頁面載入時向伺服器要書單，畫成列表。</p>${pre(`function App() {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    fetch('/api/books').then((r) => r.json()).then(setBooks);
  }, []);
  return (
    <ul>
      {books.map((b) => <li key={b.id}>{b.name}</li>)}
    </ul>
  );
}`)}<ul><li><code>useState([])</code>：一開始是空的書單。為什麼：資料還沒到，先給空陣列畫面才不會壞。</li><li><code>useEffect(..., [])</code>：只在載入時要一次資料。為什麼：不寫 [] 會一直重複要。</li><li><code>.then(setBooks)</code>：資料來了存進 state，畫面就自動更新。</li></ul>`,
  steps: [
    `<p>在 TODO 1 的位置，先寫 useEffect 的空殼：</p>${pre('useEffect(() => {\n  \n}, []);')}<p>為什麼：useEffect 讓畫面載入後才去要資料；最後的 [] 表示只做一次。</p>`,
    `<p>在大括號中間寫：</p>${pre("fetch('/api/events').then((r) => r.json()).then(setEvents);")}<p>為什麼：fetch 去要資料，r.json() 把它變成陣列，setEvents 存進 state。</p>`,
    `<p>在 TODO 2 的位置寫：</p>${pre('{events.map((e) => (\n  <li key={e.id} data-testid="event">{e.title} · {e.date}</li>\n))}')}<p>為什麼：每個活動畫成一個 li，格式是「標題 · 日期」。</p>`,
    `<p>按「檢查」。</p>`,
    `<p>最常見的錯誤：useEffect 最後忘了寫 <code>[]</code>。為什麼：沒有它，每次畫面更新都會再要一次資料，然後又更新畫面，變成無限迴圈。</p>`,
  ],
  starter: `${RH}function App() {
  const [events, setEvents] = useState([]);
  // TODO 1: 頁面載入時 fetch('/api/events')，把結果存進 events
  return (
    <ul>
      {/* TODO 2: 每個活動畫成 <li key=... data-testid="event">標題 · 日期 */}
    </ul>
  );
}
`,
  solution: `${RH}function App() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    fetch('/api/events').then((r) => r.json()).then(setEvents);
  }, []);
  return (
    <ul>
      {events.map((e) => (
        <li key={e.id} data-testid="event">{e.title} · {e.date}</li>
      ))}
    </ul>
  );
}
`,
  must: [{ re: /useEffect\(/, msg: '請用 useEffect 載入資料' }, { re: /fetch\(/, msg: '請用 fetch 取得資料' }],
  test: (c) => {
    const f = [], li = c.ta('event'), evs = FIXTURES['/api/events'];
    if (li.length !== evs.length) return [`應有 ${evs.length} 個活動，目前 ${li.length} 個`];
    evs.forEach((e, i) => { if (!txt(li[i]).includes(e.title) || !txt(li[i]).includes(e.date)) f.push(`第 ${i + 1} 個要顯示「${e.title} · ${e.date}」`); });
    return f;
  },
});
const RC_P3 = react({
  brief: '專案：活動搜尋。input 受控，列表只顯示「標題包含輸入文字」的活動（空白時全部顯示）。',
  hint: '<code>events.filter((e) =&gt; e.includes(q))</code> 之後再 map；input 加 value 與 onChange。',
  demo: `<p>範例（書店）：輸入關鍵字，只留下書名有包含它的書。</p>${pre(`const books = ['小王子', '海邊的卡夫卡', '王子復仇記'];

function App() {
  const [q, setQ] = useState('');
  const shown = books.filter((b) => b.includes(q));
  return (
    <div>
      <input value={q} onChange={(e) => setQ(e.target.value)} />
      <ul>{shown.map((b) => <li key={b}>{b}</li>)}</ul>
    </div>
  );
}`)}<ul><li><code>useState('')</code>：記住輸入的字，一開始是空的。</li><li><code>b.includes(q)</code>：書名有包含 q 就留下。為什麼：空字串每個名字都包含，所以沒輸入時全部都顯示。</li><li>畫面用 <code>shown</code> 來 map，而不是原本的 books。為什麼：畫的是篩過的結果。</li></ul>`,
  steps: [
    `<p>在 TODO 那行寫：</p>${pre('const shown = events.filter((e) => e.includes(q));')}<p>為什麼：filter 只留下標題包含輸入文字的活動。</p>`,
    `<p>把下面列表的 <code>events.map</code> 改成 <code>shown.map</code>。</p><p>為什麼：畫面要畫篩選後的結果，不是全部。</p>`,
    `<p>在 input 加上 <code>value={q}</code> 和 <code>onChange={(e) => setQ(e.target.value)}</code>。</p><p>為什麼：這樣打的字才會存進 q，列表才會跟著變。</p>`,
    `<p>按「檢查」。</p>`,
    `<p>最常見的錯誤：filter 寫好了，但 map 還是用 <code>events</code>。為什麼：那樣篩選的結果沒被用到，畫面完全不會變。</p>`,
  ],
  starter: `${RH}const events = ['星光巡迴演唱會', '回到那一天 2027', '交響樂之夜', '星空露天音樂祭'];

function App() {
  const [q, setQ] = useState('');
  // TODO: 依輸入的文字篩選（標題包含文字就留下）
  return (
    <div>
      <input data-testid="search" placeholder="搜尋活動" />
      <ul>{events.map((e) => <li key={e} data-testid="event">{e}</li>)}</ul>
    </div>
  );
}
`,
  solution: `${RH}const events = ['星光巡迴演唱會', '回到那一天 2027', '交響樂之夜', '星空露天音樂祭'];

function App() {
  const [q, setQ] = useState('');
  const shown = events.filter((e) => e.includes(q));
  return (
    <div>
      <input data-testid="search" placeholder="搜尋活動" value={q} onChange={(e) => setQ(e.target.value)} />
      <ul>{shown.map((e) => <li key={e} data-testid="event">{e}</li>)}</ul>
    </div>
  );
}
`,
  must: [{ re: /onChange=/, msg: 'input 要加 onChange' }],
  test: testSearch,
});

/* ============================ Vue ============================ */
const VSETUP = (inner, ret, imp = 'ref') => `const { createApp, ${imp} } = Vue;\ncreateApp({\n  setup() {\n${inner}\n    return { ${ret} };\n  },\n}).mount('#app');`;

const V1 = {
  id: 'vu1', title: '第 1 堂　模板與資料',
  steps: [
    { say: `<p>Vue 把畫面寫在 <b>HTML 模板</b>裡，用雙大括號 <code>{{ }}</code> 放資料：</p>${pre('<h1>{{ title }}</h1>')}`,
      check: choice('在 Vue 模板裡顯示變數 <code>title</code>，怎麼寫？', ['{{ title }}', '{title}', '${title}'], 0, 'Vue 用雙大括號。') },
    { say: `<p>會變的資料用 <code>ref()</code> 建立。在 JavaScript 裡讀寫要加 <code>.value</code>，但<b>在模板裡不用</b>：</p>${pre("const count = ref(0);\ncount.value++;      // JS 裡要 .value\n// 模板：{{ count }}  不用 .value")}`,
      check: choice('在 <code>setup</code> 裡讀 <code>count</code> 的值，要寫？', ['count.value', 'count', 'count()'], 0, 'ref 的值藏在 .value。') },
    { say: `<p><code>setup()</code> 裡建立的資料，要 <code>return</code> 出去，模板才看得到：</p>${pre('setup() {\n  const title = ref(\'星光演唱會\');\n  return { title };   // 沒 return，模板就找不到\n}')}`,
      check: choice('模板顯示不出 setup 裡的變數，最可能是？', ['忘了 return 它', '忘了寫分號', '字太小'], 0, '要 return 才能在模板用。') },
  ],
  final: vue({
    brief: '讓價格顯示出來：把 <code>price</code> 也從 setup 回傳，並在 <code>data-testid="price"</code> 的 p 用 <code>{{ price }}</code> 顯示「NT$ 價格」。',
    hint: '<code>return { title, price };</code>，模板裡寫 <code>NT$ {{ price }}</code>。',
    demo: `<p>範例（咖啡店）：顯示店名，價格從 setup 回傳。</p>${pre(`const shop = ref('小森咖啡');
const price = ref(120);
return { shop, price };

<!-- 模板 -->
<h1>{{ shop }}</h1>
<p>拿鐵 NT$ {{ price }}</p>`)}<ul><li><code>ref('小森咖啡')</code>：建立資料。</li><li><code>return { shop, price }</code>：交給模板。為什麼：沒有 return 的資料，模板看不到。</li><li><code>{{ price }}</code>：模板裡用雙大括號顯示，而且不用寫 .value。</li></ul>`,
    steps: [
      `<p>找到 setup 最後那行 <code>return { title }</code> 類的回傳，把 TODO 註解換成 price：</p>${pre('title, price')}<p>為什麼：price 要交給模板，模板才找得到它。</p>`,
      `<p>找到 <code>data-testid="price"</code> 的 p，把裡面的註解換成：</p>${pre('NT$ {{ price }}')}<p>為什麼：雙大括號會把 price 的值顯示出來。</p>`,
      `<p>按「檢查」。</p>`,
      `<p>最常見的錯誤：只在模板寫了 <code>{{ price }}</code>，卻忘了在 return 加 price，畫面會是空的。為什麼：模板只看得到 return 出來的東西。</p>`,
    ],
    starter: vueApp(VSETUP("    const title = ref('星光巡迴演唱會');\n    const price = ref(3800);", 'title /* TODO: 把 price 也交給模板 */'),
      '  <h1 data-testid="title">{{ title }}</h1>\n  <p data-testid="price"><!-- TODO: 顯示 NT$ 價格 --></p>'),
    solution: vueApp(VSETUP("    const title = ref('星光巡迴演唱會');\n    const price = ref(3800);", 'title, price'),
      '  <h1 data-testid="title">{{ title }}</h1>\n  <p data-testid="price">NT$ {{ price }}</p>'),
    must: [{ re: /\{\{\s*price\s*\}\}/, msg: '請用 {{ price }} 顯示價格' }],
    test: (c) => {
      const f = [];
      if (txt(c.t('title')) !== '星光巡迴演唱會') f.push('title 要顯示「星光巡迴演唱會」');
      if (!txt(c.t('price')).includes('3800')) f.push('price 要顯示 NT$ 3800（記得 return price）');
      return f;
    },
  }),
};

const V2 = {
  id: 'vu2', title: '第 2 堂　事件與 v-model',
  steps: [
    { say: `<p>用 <code>@click</code> 綁定點擊事件，後面可以直接寫一小段程式：</p>${pre('<button @click="count++">＋</button>')}`,
      check: choice('<code>@click="count++"</code> 的意思是？', ['點擊時讓 count 加 1', '載入時讓 count 加 1', '把 count 刪掉'], 0, '@click 就是 click 事件。') },
    { say: `<p><code>v-model</code> 讓輸入框和資料<b>雙向綁定</b>：輸入時資料自動更新，資料變了輸入框也跟著變。比 React 的受控元件少寫很多：</p>${pre('<input v-model="name">\n<p>你好，{{ name }}</p>')}`,
      check: choice('<code>v-model</code> 的作用是？', ['輸入框和資料雙向綁定', '決定字體', '載入圖片'], 0, '一個屬性搞定 value + 事件。') },
    { say: `<p>想讓 HTML 屬性吃「變數」而不是文字，在屬性前面加 <code>:</code>（<code>v-bind</code> 的縮寫）：</p>${pre('<button :disabled="sold">選位</button>')}`,
      check: choice('<code>:disabled="sold"</code> 前面的冒號代表？', ['這個屬性的值是變數／運算式', '這是註解', '這是 CSS'], 0, '冒號 = 綁定變數。') },
  ],
  final: vue({
    brief: '① 讓輸入框用 <code>v-model="name"</code> 綁定，<code>data-testid="hello"</code> 就會顯示「你好，名字」 ② 讓 ＋ 按鈕用 <code>@click</code> 把 count 加 1。',
    hint: '<code>&lt;input v-model="name"&gt;</code>；<code>&lt;button @click="count++"&gt;</code>。寫完按「檢查」。',
    demo: `<p>範例（書店）：輸入書名並顯示，另外一個按鈕計算已加入幾本。</p>${pre(`<input v-model="book">
<p>找：{{ book }}</p>
<button @click="n++">加入書單</button>
<span>{{ n }}</span>`)}<ul><li><code>v-model="book"</code>：輸入框和 book 雙向綁定。為什麼：你打字 book 就跟著變，一行搞定。</li><li><code>{{ book }}</code>：顯示 book 目前的值。</li><li><code>@click="n++"</code>：按下去 n 加 1。為什麼：Vue 在模板裡可以直接寫簡短的程式。</li></ul>`,
    steps: [
      `<p>找到 <code>TODO 1</code> 那行的 input，在標籤裡加上：</p>${pre('v-model="name"')}<p>為什麼：這樣打字會自動更新 name，下面的「你好」就會跟著變。</p>`,
      `<p>找到 <code>TODO 2</code> 那行的按鈕，在標籤裡加上：</p>${pre('@click="count++"')}<p>為什麼：按一下 count 就加 1，旁邊的數字就會跟著變。</p>`,
      `<p>按「檢查」，會輸入名字、再按兩次＋來測。</p>`,
      `<p>最常見的錯誤：把 <code>@click</code> 寫成 <code>click</code> 或 <code>onClick</code>。為什麼：Vue 的事件要用 @ 開頭，寫別的它不認得。</p>`,
    ],
    starter: vueApp(VSETUP("    const name = ref('');\n    const count = ref(0);", 'name, count'),
      '  <input data-testid="name" placeholder="姓名"> <!-- TODO 1: 用 v-model 綁定 name -->\n  <p data-testid="hello">你好，{{ name }}</p>\n  <button data-testid="plus">＋</button> <!-- TODO 2: 用 @click 讓 count 加 1 -->\n  <span data-testid="count">{{ count }}</span>'),
    solution: vueApp(VSETUP("    const name = ref('');\n    const count = ref(0);", 'name, count'),
      '  <input data-testid="name" placeholder="姓名" v-model="name">\n  <p data-testid="hello">你好，{{ name }}</p>\n  <button data-testid="plus" @click="count++">＋</button>\n  <span data-testid="count">{{ count }}</span>'),
    must: [{ re: /v-model=/, msg: '請用 v-model 綁定輸入框' }, { re: /@click=|v-on:click=/, msg: '請用 @click 綁定按鈕' }],
    test: async (c) => {
      const f = [];
      if (!c.t('name') || !c.t('plus')) return ['缺少 name 或 plus 元素'];
      await c.type(c.t('name'), '小明');
      if (!txt(c.t('hello')).includes('你好，小明')) f.push('輸入「小明」後應顯示「你好，小明」');
      await c.click(c.t('plus')); await c.click(c.t('plus'));
      if (txt(c.t('count')) !== '2') f.push(`按兩次＋後應是 2，目前是 ${txt(c.t('count'))}`);
      return f;
    },
  }),
};

const V3 = {
  id: 'vu3', title: '第 3 堂　條件與列表',
  steps: [
    { say: `<p><code>v-if</code> 控制「要不要顯示」，條件不成立就<b>不會產生這個元素</b>：</p>${pre('<p v-if="sold">已售完</p>\n<p v-else>還有位子</p>')}`,
      check: choice('<code>v-if</code> 條件不成立時，元素會？', ['不會出現在畫面上', '變透明但還在', '變成紅色'], 0, '整個元素都不會產生。') },
    { say: `<p><code>v-for</code> 把陣列的每一筆畫成一個元素，同樣要加 <code>:key</code>：</p>${pre('<li v-for="s in seats" :key="s.id">{{ s.id }}</li>')}`,
      check: choice('<code>v-for="s in seats"</code> 的意思？', ['對 seats 裡的每一筆（叫 s）各畫一個', '刪除 seats', '把 seats 排序'], 0, 'for … in … 就是「每一個」。') },
    { say: `<p>兩個可以放在一起用：<code>v-for</code> 畫列表，裡面再用 <code>v-if</code> 決定某些內容要不要顯示：</p>${pre('<li v-for="s in seats" :key="s.id">\n  {{ s.id }}\n  <span v-if="s.sold">（已售）</span>\n</li>')}`,
      check: choice('列表中只有已售的座位要多顯示「已售」，用？', ['在 v-for 的元素裡加 v-if="s.sold"', '多寫一個 v-for', '用 CSS 隱藏'], 0, 'v-if 放在內容上。') },
  ],
  final: vue({
    brief: '用 <code>v-for</code> 把座位畫成 <code>&lt;li data-testid="seat"&gt;</code> 顯示編號；已售出的用 <code>v-if</code> 多顯示「（已售）」。',
    hint: '<code>&lt;li v-for="s in seats" :key="s.id" data-testid="seat"&gt;{{ s.id }}&lt;span v-if="s.sold"&gt;（已售）&lt;/span&gt;&lt;/li&gt;</code>',
    demo: `<p>範例（書店）：把書單畫成列表，缺貨的加「（缺貨）」。</p>${pre(`<ul>
  <li v-for="b in books" :key="b.id">
    {{ b.id }}
    <span v-if="b.soldOut">（缺貨）</span>
  </li>
</ul>`)}<ul><li><code>v-for="b in books"</code>：每一本書畫一個 li。為什麼：資料有幾筆，畫面就有幾個。</li><li><code>:key="b.id"</code>：給每一項不重複的名字。為什麼：Vue 靠它分辨誰是誰。</li><li><code>v-if="b.soldOut"</code>：缺貨才出現這個 span。為什麼：沒缺貨就整個不產生。</li></ul>`,
    steps: [
      `<p>在 <code>&lt;ul&gt;</code> 裡，把 TODO 註解換成 li 的外框：</p>${pre('<li v-for="s in seats" :key="s.id" data-testid="seat"></li>')}<p>為什麼：v-for 會對每個座位畫一個 li。</p>`,
      `<p>在 li 中間放座位編號：</p>${pre('{{ s.id }}')}<p>為什麼：要讓每個座位顯示自己的編號。</p>`,
      `<p>編號後面接上：</p>${pre('<span v-if="s.sold">（已售）</span>')}<p>為什麼：只有 sold 是 true 的座位才會多出「（已售）」。</p>`,
      `<p>按「檢查」。</p>`,
      `<p>最常見的錯誤：忘了 <code>:key</code> 前面的冒號，寫成 <code>key="s.id"</code>。為什麼：沒冒號就變成純文字 "s.id"，所有項目 key 都一樣。</p>`,
    ],
    starter: vueApp(VSETUP("    const seats = ref([\n      { id: 'A1', sold: false },\n      { id: 'A2', sold: true },\n      { id: 'A3', sold: false },\n    ]);", 'seats'),
      '  <ul>\n    <!-- TODO: 用 v-for 畫出每個座位 <li data-testid="seat">；已售出的用 v-if 顯示「（已售）」 -->\n  </ul>'),
    solution: vueApp(VSETUP("    const seats = ref([\n      { id: 'A1', sold: false },\n      { id: 'A2', sold: true },\n      { id: 'A3', sold: false },\n    ]);", 'seats'),
      '  <ul>\n    <li v-for="s in seats" :key="s.id" data-testid="seat">{{ s.id }}<span v-if="s.sold">（已售）</span></li>\n  </ul>'),
    must: [{ re: /v-for=/, msg: '請用 v-for 畫列表' }, { re: /v-if=/, msg: '請用 v-if 顯示「已售」' }],
    test: testSeats,
  }),
};

const V4 = {
  id: 'vu4', title: '第 4 堂　computed 與 watch',
  steps: [
    { say: `<p><code>computed</code>（計算屬性）是「由別的資料算出來的資料」，來源一變，它就<b>自動重算</b>：</p>${pre('const total = computed(() => count.value * price.value);')}`,
      check: choice('<code>computed</code> 適合用在？', ['由其他資料算出來的值（例如總額）', '儲存使用者輸入', '載入網頁'], 0, '算出來的值，用 computed。') },
    { say: `<p>在 <code>computed</code> 裡讀 ref 一樣要 <code>.value</code>；回傳的 <code>total</code> 在模板裡直接用 <code>{{ total }}</code>。好處：<b>來源沒變就不重算</b>（有快取），也不用自己記得更新。</p>`,
      check: choice('為什麼不自己在每次點擊後手動算總額？', ['computed 會在來源變動時自動更新，不會漏', '因為手動算比較快', '因為 Vue 禁止'], 0, '自動更新就不會忘。') },
    { say: `<p><code>watch</code> 是「某個資料變了就去做一件事」（例如存檔、發請求）：</p>${pre('watch(count, (n) => {\n  console.log("現在是", n);\n});')}`,
      check: choice('<code>watch(count, ...)</code> 什麼時候執行？', ['count 改變的時候', '網頁載入的時候', '按下鍵盤的時候'], 0, 'watch 盯著資料看。') },
  ],
  final: vue({
    brief: '用 <code>computed</code> 算出 <code>total = count × price</code>，並讓模板顯示。按兩次＋後，total 應是 7600。',
    hint: '<code>const total = computed(() =&gt; count.value * price.value);</code>，並記得 <code>return { count, total }</code>（computed 要先從 Vue 取出來，已經寫好了）。',
    demo: `<p>範例（咖啡店）：杯數乘單價，用 computed 自動算總額。</p>${pre(`const cups = ref(0);
const price = ref(120);
const total = computed(() => cups.value * price.value);
return { cups, total };`)}<ul><li><code>computed(() =&gt; ...)</code>：用別的資料算出新資料。為什麼：cups 一變，total 自動跟著變。</li><li><code>cups.value</code>：在 JS 裡讀 ref 要加 .value。</li><li><code>return { cups, total }</code>：模板才看得到。</li></ul>`,
    steps: [
      `<p>找到 <code>const total = 0;</code> 那行（TODO），改成：</p>${pre('const total = computed(() => count.value * price.value);')}<p>為什麼：總額由 count 和 price 算出來，用 computed 它會自動更新。</p>`,
      `<p>確認 <code>count.value</code> 和 <code>price.value</code> 都有寫 <code>.value</code>。</p><p>為什麼：在 setup 裡讀 ref 一定要 .value。</p>`,
      `<p>確認最後的 <code>return</code> 有包含 total（這題已經寫好 <code>count, total</code>）。</p><p>為什麼：模板才顯示得出 total。</p>`,
      `<p>按「檢查」。</p>`,
      `<p>最常見的錯誤：寫成 <code>count * price</code> 少了 .value。為什麼：那樣乘的是物件而不是數字，結果會是 NaN。</p>`,
    ],
    starter: vueApp(VSETUP("    const count = ref(0);\n    const price = ref(3800);\n    // TODO: 用 computed 算出 total = count × price\n    const total = 0;", 'count, total', 'ref, computed'),
      '  <button data-testid="plus" @click="count++">＋</button>\n  <span data-testid="count">{{ count }}</span>\n  <p data-testid="total">NT$ {{ total }}</p>'),
    solution: vueApp(VSETUP("    const count = ref(0);\n    const price = ref(3800);\n    const total = computed(() => count.value * price.value);", 'count, total', 'ref, computed'),
      '  <button data-testid="plus" @click="count++">＋</button>\n  <span data-testid="count">{{ count }}</span>\n  <p data-testid="total">NT$ {{ total }}</p>'),
    must: [{ re: /computed\(/, msg: '請用 computed() 算出 total' }],
    test: async (c) => {
      const f = [];
      if (!c.t('plus') || !c.t('total')) return ['缺少 plus 或 total 元素'];
      await c.click(c.t('plus')); await c.click(c.t('plus'));
      if (!txt(c.t('total')).includes('7600')) f.push(`按兩次＋後 total 應是 7600，目前是「${txt(c.t('total'))}」`);
      return f;
    },
  }),
};

const V5 = {
  id: 'vu5', title: '第 5 堂　元件、props 與 emit',
  steps: [
    { say: `<p>把一塊畫面做成<b>元件</b>，就能重複使用。用 <code>props</code> 接收父層傳來的資料：</p>${pre("app.component('ticket-card', {\n  props: ['title', 'price'],\n  template: '<p>{{ title }} NT$ {{ price }}</p>',\n});")}`,
      check: choice('<code>props</code> 讓元件做什麼？', ['接收父層傳來的資料', '改變瀏覽器', '連資料庫'], 0, '資料由上往下傳。') },
    { say: `<p>子元件要<b>通知父層</b>發生了什麼事，用 <code>$emit</code> 發出事件，父層用 <code>@事件名</code> 接：</p>${pre('子：<button @click="$emit(\'pick\')">選</button>\n父：<ticket-card @pick="picked++" />')}`,
      check: choice('子元件要通知父層「被點了」，用？', ['$emit', 'props', 'v-for'], 0, 'props 往下、emit 往上。') },
    { say: `<p>記住口訣：<b>props 往下傳資料，emit 往上傳事件</b>。這樣資料流向清楚，不容易亂。元件裡也建議用 <code>emits: ['pick']</code> 宣告自己會發出的事件。</p>`,
      check: choice('「資料往下、事件往上」指的是？', ['props 往下、emit 往上', 'emit 往下、props 往上', '兩個都往下'], 0, '單向資料流。') },
  ],
  final: vue({
    brief: '讓卡片被點時通知父層：在 ticket-card 的 <code>emits</code> 宣告 <code>pick</code>，按鈕點擊時 <code>$emit(\'pick\')</code>。父層已經寫好 <code>@pick="picked++"</code>。',
    hint: '<code>emits: [\'pick\']</code>，按鈕加 <code>@click="$emit(\'pick\')"</code>。',
    demo: `<p>範例（書店）：書卡片被點時通知父層，父層計數。</p>${pre(`子元件：
  emits: ['add'],
  template: '<button @click="$emit(\'add\')">加入</button>'

父層：
  <book-card @add="n++"></book-card>`)}<ul><li><code>emits: ['add']</code>：宣告這個元件會發出 add 事件。為什麼：讓人一看就知道它會通知誰。</li><li><code>$emit('add')</code>：點擊時往上喊一聲。為什麼：子元件不能直接改父層的資料，只能通知。</li><li><code>@add="n++"</code>：父層聽到就加 1。</li></ul>`,
    steps: [
      `<p>在 <code>props: ['title', 'price'],</code> 的下一行，加上：</p>${pre("emits: ['pick'],")}<p>為什麼：先宣告這個卡片會發出 pick 事件。</p>`,
      `<p>找到 <code>data-testid="vpick"</code> 的 button，在標籤裡加上：</p>${pre('@click="$emit(\'pick\')"')}<p>為什麼：按下去就通知父層，父層的 <code>@pick="picked++"</code> 才會收到。</p>`,
      `<p>刪掉 TODO 註解，按「檢查」。</p>`,
      `<p>最常見的錯誤：事件名字不一致，例如 emits 寫 pick、$emit 卻寫 Pick。為什麼：父層聽的是 pick，名字差一個字母就收不到。</p>`,
    ],
    starter: `<div id="app">
  <ticket-card title="星光巡迴演唱會" :price="3800" @pick="picked++"></ticket-card>
  <ticket-card title="交響樂之夜" :price="1800" @pick="picked++"></ticket-card>
  <p data-testid="picked">已選 {{ picked }} 張</p>
</div>
<script>
const { createApp, ref } = Vue;
const app = createApp({ setup() { const picked = ref(0); return { picked }; } });
app.component('ticket-card', {
  props: ['title', 'price'],
  // TODO: 加上 emits，並讓按鈕被點時通知父層（$emit('pick')）
  template: \`<div data-testid="vcard"><h3>{{ title }}</h3><p>NT$ {{ price }}</p><button data-testid="vpick">選這張</button></div>\`,
});
app.mount('#app');
</script>
`,
    solution: `<div id="app">
  <ticket-card title="星光巡迴演唱會" :price="3800" @pick="picked++"></ticket-card>
  <ticket-card title="交響樂之夜" :price="1800" @pick="picked++"></ticket-card>
  <p data-testid="picked">已選 {{ picked }} 張</p>
</div>
<script>
const { createApp, ref } = Vue;
const app = createApp({ setup() { const picked = ref(0); return { picked }; } });
app.component('ticket-card', {
  props: ['title', 'price'],
  emits: ['pick'],
  template: \`<div data-testid="vcard"><h3>{{ title }}</h3><p>NT$ {{ price }}</p><button data-testid="vpick" @click="$emit('pick')">選這張</button></div>\`,
});
app.mount('#app');
</script>
`,
    must: [{ re: /\$emit\(/, msg: '請用 $emit 通知父層' }],
    test: async (c) => {
      const f = [], b = c.ta('vpick');
      if (b.length !== 2) return [`應有 2 張卡片的按鈕（vpick），目前 ${b.length} 個`];
      await c.click(b[0]); await c.click(b[0]); await c.click(b[1]);
      if (!txt(c.t('picked')).includes('3')) f.push(`點三下後父層應顯示「已選 3 張」，目前是「${txt(c.t('picked'))}」`);
      return f;
    },
  }),
};

const VU_QUIZ1 = [
  choice('Vue 模板裡顯示變數 name 要寫？', ['{{ name }}', '{name}', '<name>'], 0),
  choice('setup 裡讀 ref 的值要用？', ['.value', '()', '.get'], 0),
  choice('輸入框和資料雙向綁定用？', ['v-model', 'v-for', 'v-if'], 0),
  choice('<code>v-if</code> 條件不成立時？', ['元素不會出現', '元素變透明', '元素變紅'], 0),
];
const VU_QUIZ2 = [
  choice('由其他資料算出來、會自動更新的值，用？', ['computed', 'ref', 'v-for'], 0),
  choice('資料一變就要做一件事（例如存檔），用？', ['watch', 'v-if', 'props'], 0),
  choice('子元件要通知父層，用？', ['$emit', 'props', 'v-model'], 0),
  choice('<code>v-for</code> 的元素要加什麼？', [':key', 'v-key', 'id 就好'], 0),
];

const VU_P1 = vue({
  brief: '專案：票數選擇器。＋加 1、−減 1，範圍 0～4。數字到 4 時，才顯示 <code>data-testid="full"</code> 的「已達上限」（用 <code>v-if</code>）。',
  hint: '<code>@click="count = Math.min(4, count + 1)"</code>；<code>&lt;p v-if="count === 4" data-testid="full"&gt;</code>。',
  demo: `<p>範例（咖啡店）：杯數範圍 0～5，到 5 才顯示「已達上限」。</p>${pre(`<button @click="cups = Math.max(0, cups - 1)">−</button>
<button @click="cups = Math.min(5, cups + 1)">＋</button>
<p v-if="cups === 5">已達上限</p>`)}<ul><li><code>Math.max(0, ...)</code>：最小停在 0。</li><li><code>Math.min(5, ...)</code>：最大停在 5。為什麼：兩邊都卡住，數字才不會跑出範圍。</li><li><code>v-if="cups === 5"</code>：剛好 5 才出現。為什麼：其他時候整個元素都不存在。</li></ul>`,
  steps: [
    `<p>在 − 按鈕加上：</p>${pre('@click="count = Math.max(0, count - 1)"')}<p>為什麼：最少只能到 0。</p>`,
    `<p>在 ＋ 按鈕加上：</p>${pre('@click="count = Math.min(4, count + 1)"')}<p>為什麼：最多只能到 4。</p>`,
    `<p>在「已達上限」那個 p 加上：</p>${pre('v-if="count === 4"')}<p>為什麼：只有剛好 4 張時，這句話才該出現。</p>`,
    `<p>刪掉 TODO 註解，按「檢查」。</p>`,
    `<p>最常見的錯誤：v-if 條件寫成 <code>count = 4</code>（一個等號）。為什麼：一個等號是「設定成 4」，要判斷是不是 4 要用三個等號 ===。</p>`,
  ],
  starter: vueApp(VSETUP('    const count = ref(0);', 'count'),
    '  <h3>星光巡迴演唱會</h3>\n  <button data-testid="minus">−</button> <!-- TODO: 減 1，最小 0 -->\n  <span data-testid="count">{{ count }}</span>\n  <button data-testid="plus">＋</button> <!-- TODO: 加 1，最大 4 -->\n  <p data-testid="full">已達上限</p> <!-- TODO: 只有 count 等於 4 時才顯示 -->'),
  solution: vueApp(VSETUP('    const count = ref(0);', 'count'),
    '  <h3>星光巡迴演唱會</h3>\n  <button data-testid="minus" @click="count = Math.max(0, count - 1)">−</button>\n  <span data-testid="count">{{ count }}</span>\n  <button data-testid="plus" @click="count = Math.min(4, count + 1)">＋</button>\n  <p v-if="count === 4" data-testid="full">已達上限</p>'),
  must: [{ re: /v-if=/, msg: '請用 v-if 控制「已達上限」' }],
  test: async (c) => {
    const f = [], count = () => txt(c.t('count'));
    if (!c.t('plus') || !c.t('minus')) return ['缺少 plus / minus 元素'];
    for (let i = 0; i < 5; i++) await c.click(c.t('plus'));
    if (count() !== '4') f.push(`一直按＋最多到 4，目前是 ${count()}`);
    if (!c.t('full')) f.push('數字到 4 時要顯示「已達上限」');
    await c.click(c.t('minus'));
    if (count() !== '3') f.push(`按−後應是 3，目前是 ${count()}`);
    if (c.t('full')) f.push('數字不是 4 時，「已達上限」不能出現');
    for (let i = 0; i < 5; i++) await c.click(c.t('minus'));
    if (count() !== '0') f.push(`一直按−最少到 0，目前是 ${count()}`);
    return f;
  },
});
const VU_P2 = vue({
  brief: '專案：活動搜尋。輸入框用 <code>v-model="q"</code>；列表用 <code>computed</code> 只顯示「標題包含輸入文字」的活動（空白時全部顯示）。',
  hint: '<code>const events = computed(() =&gt; all.filter((e) =&gt; e.includes(q.value)));</code>',
  demo: `<p>範例（書店）：輸入書名，列表只留下有包含的書。</p>${pre(`const q = ref('');
const all = ['小王子', '王子復仇記', '海邊的卡夫卡'];
const books = computed(() => all.filter((b) => b.includes(q.value)));

<input v-model="q">`)}<ul><li><code>computed</code>：q 一變，books 自動重新篩。為什麼：不用自己記得更新。</li><li><code>b.includes(q.value)</code>：書名包含輸入的字就留下。</li><li><code>v-model="q"</code>：打字會更新 q。</li></ul>`,
  steps: [
    `<p>在 setup 裡把 <code>const events = all;</code> 改成：</p>${pre('const events = computed(() => all.filter((e) => e.includes(q.value)));')}<p>為什麼：只留下標題包含輸入文字的活動，q 變了它會自動重算。</p>`,
    `<p>在搜尋的 input 標籤加上：</p>${pre('v-model="q"')}<p>為什麼：打的字才會存進 q。</p>`,
    `<p>確認 setup 的 return 裡有 <code>q, events</code>（已經寫好）。</p>`,
    `<p>按「檢查」。</p>`,
    `<p>最常見的錯誤：<code>e.includes(q)</code> 少了 .value。為什麼：在 JS 裡讀 ref 一定要 .value，不然拿到的是物件，篩不出東西。</p>`,
  ],
  starter: vueApp(VSETUP("    const q = ref('');\n    const all = ['星光巡迴演唱會', '回到那一天 2027', '交響樂之夜', '星空露天音樂祭'];\n    const events = all; // TODO: 改成 computed 篩選", 'q, events', 'ref, computed'),
    '  <input data-testid="search" placeholder="搜尋活動"> <!-- TODO: v-model="q" -->\n  <ul>\n    <li v-for="e in events" :key="e" data-testid="event">{{ e }}</li>\n  </ul>'),
  solution: vueApp(VSETUP("    const q = ref('');\n    const all = ['星光巡迴演唱會', '回到那一天 2027', '交響樂之夜', '星空露天音樂祭'];\n    const events = computed(() => all.filter((e) => e.includes(q.value)));", 'q, events', 'ref, computed'),
    '  <input data-testid="search" placeholder="搜尋活動" v-model="q">\n  <ul>\n    <li v-for="e in events" :key="e" data-testid="event">{{ e }}</li>\n  </ul>'),
  must: [{ re: /v-model=/, msg: '請用 v-model 綁定搜尋框' }, { re: /computed\(/, msg: '請用 computed 篩選列表' }],
  test: testSearch,
});
const VU_P3 = vue({
  brief: '專案：購物車總額。列出每個商品（<code>data-testid="item"</code>），並用 <code>computed</code> 算出總額（每項 價格 × 數量 加總），顯示在 <code>data-testid="total"</code>。',
  hint: '<code>items.value.reduce((sum, i) =&gt; sum + i.price * i.qty, 0)</code>。總額應是 3800×2 + 650×1 = 8250。',
  demo: `<p>範例（咖啡店）：用 reduce 把每杯的 價格 × 數量 加總。</p>${pre(`const items = ref([
  { name: '拿鐵', price: 120, qty: 2 },
  { name: '司康', price: 80, qty: 1 },
]);
const sum = computed(() =>
  items.value.reduce((s, i) => s + i.price * i.qty, 0)
);`)}<ul><li><code>reduce(..., 0)</code>：從 0 開始，一項一項往上加。為什麼：就像收銀機一筆筆累加。</li><li><code>i.price * i.qty</code>：單價乘數量，就是這一項的小計。</li><li><code>items.value</code>：JS 裡讀 ref 要 .value。</li><li>用 computed 包起來。為什麼：數量變了總額自動更新。</li></ul>`,
  steps: [
    `<p>在 TODO 那行寫：</p>${pre('const sum = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0));')}<p>為什麼：把每項的 價格 × 數量 加起來，3800×2 + 650×1 = 8250。</p>`,
    `<p>把 setup 的 return 改成：</p>${pre('items, sum')}<p>為什麼：sum 要交給模板才顯示得出來。</p>`,
    `<p>把 total 那行的 <code>0</code> 改成 <code>{{ sum }}</code>，變成：</p>${pre('合計 NT$ {{ sum }}')}<p>為什麼：不然畫面永遠是寫死的 0。</p>`,
    `<p>按「檢查」。</p>`,
    `<p>最常見的錯誤：忘了把 sum 加進 return。為什麼：沒 return，模板找不到 sum，畫面會是空的。</p>`,
  ],
  starter: vueApp(VSETUP("    const items = ref([\n      { name: '星光演唱會', price: 3800, qty: 2 },\n      { name: '周邊 T-shirt', price: 650, qty: 1 },\n    ]);\n    // TODO: 用 computed 算出總額", 'items', 'ref, computed'),
    '  <ul>\n    <li v-for="item in items" :key="item.name" data-testid="item">{{ item.name }} × {{ item.qty }}</li>\n  </ul>\n  <p data-testid="total">合計 NT$ 0</p> <!-- TODO: 顯示 computed 算出的總額 -->'),
  solution: vueApp(VSETUP("    const items = ref([\n      { name: '星光演唱會', price: 3800, qty: 2 },\n      { name: '周邊 T-shirt', price: 650, qty: 1 },\n    ]);\n    const sum = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0));", 'items, sum', 'ref, computed'),
    '  <ul>\n    <li v-for="item in items" :key="item.name" data-testid="item">{{ item.name }} × {{ item.qty }}</li>\n  </ul>\n  <p data-testid="total">合計 NT$ {{ sum }}</p>'),
  must: [{ re: /computed\(/, msg: '請用 computed 算總額' }],
  test: (c) => {
    const f = [];
    if (c.ta('item').length !== 2) f.push(`應有 2 個商品，目前 ${c.ta('item').length} 個`);
    if (!txt(c.t('total')).includes('8250')) f.push(`總額應是 8250，目前是「${txt(c.t('total'))}」`);
    return f;
  },
});

/* ============================ 匯出 ============================ */
export const FE_COURSES = [
  { id: 'rc', name: 'React', icon: '⚛️', teacher: 'Lily 老師', chapters: [
    { id: 'rc-c1', title: '第一章　元件、Props 與 State', lessons: [R1, R2, R3], quiz: RC_QUIZ1, projects: [RC_P1], event: 'rc-c1' },
    { id: 'rc-c2', title: '第二章　列表、表單與載入資料', lessons: [R4, R5], quiz: RC_QUIZ2, projects: [RC_P2, RC_P3], event: 'rc-c2' },
  ] },
  { id: 'vu', name: 'Vue', icon: '💚', teacher: 'Lily 老師', chapters: [
    { id: 'vu-c1', title: '第一章　模板、事件與條件列表', lessons: [V1, V2, V3], quiz: VU_QUIZ1, projects: [VU_P1], event: 'vu-c1' },
    { id: 'vu-c2', title: '第二章　computed 與元件', lessons: [V4, V5], quiz: VU_QUIZ2, projects: [VU_P2, VU_P3], event: 'vu-c2' },
  ] },
];

export const FE_EVENTS = {
  'rc-c1': { npc: 'mate', mood: 'worried', text: '欸！我的按鈕點了，數字卻沒有變……我是直接 count++ 的。你學過 React 了，幫我看看？',
    options: [{ label: '告訴他：要用 setCount，React 才知道要重畫', fx: { team: 8, quality: 6, stress: 4 } }, { label: '叫他自己 google', fx: { team: -6 } }] },
  'rc-c2': { npc: 'qa', mood: 'worried', text: '主控台一直跳出「列表每一項需要唯一的 key」的警告，你知道怎麼處理嗎？',
    options: [{ label: '用資料的 id 當 key，不要用 index', fx: { quality: 10, team: 4 } }, { label: '警告而已，不用管', fx: { quality: -6 } }] },
  'vu-c1': { npc: 'pm', mood: 'happy', text: '聽說你也學會 Vue 了？我們有個內部小工具是 Vue 寫的，你覺得 v-model 和 React 的受控元件比起來怎麼樣？',
    options: [{ label: 'v-model 一行就雙向綁定，比較省事', fx: { quality: 5, team: 6 } }, { label: '各有優缺點，看團隊習慣', fx: { quality: 6, team: 4 } }] },
  'vu-c2': { npc: 'lead', mood: 'happy', text: '購物車總額如果每次點擊都手動重算，很容易漏掉。你學過 computed，應該知道比較好的做法吧？',
    options: [{ label: '用 computed 算總額，來源變了自動更新', fx: { quality: 10, team: 5 } }, { label: '每個按鈕都手動更新總額', fx: { quality: -6, stress: 6 } }] },
};
