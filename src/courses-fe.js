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
