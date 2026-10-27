// 每關：PM 工單 + 設計規格 + 起始 JSX/CSS + 參考解答。
// 設計稿畫面 = 參考解答；規格頁(spec.js)的數字與解答 CSS 對應同一份設計變數 t。
const base = (t) => `:root { --primary: ${t.primary}; --radius: ${t.radius}px; }
body { font-family: ${t.font}; margin: 0; padding: 24px; color: #222; font-size: 16px; }
h1 { font-size: 28px; font-weight: 700; margin: 0 0 16px; }
`;
const jsxHead = `const { useState, useEffect } = React;

`;

export const LEVELS = [
  {
    id: 'list',
    title: '活動列表頁',
    api: 'GET /api/events → [{ id, title, date, venue, price }]',
    ticket: '【TIX-101】首頁要顯示熱門活動。每個活動一張卡片，要有標題、日期、場地、價格，和一顆「立即購票」按鈕（主色背景）。照右邊設計稿與規格做。',
    hint: 'JSX：useEffect + fetch 取資料存進 state，events.map 畫卡片。CSS：照規格頁寫 .card 與 .book。QA 靠 data-testid 找元素，別漏掉。',
    components: [
      { name: '頁面標題 h1', bs: 'fs-3 fw-bold mb-3', tw: 'text-[28px] font-bold mb-4', rules: ['28px / 700', '色 #222', '下距 16px'] },
      { name: '活動卡片', bs: 'border rounded p-3 mb-3　｜　h3：fs-5 fw-semibold mb-1　｜　p：small text-secondary my-1', tw: 'border border-[#ddd] rounded-[var(--radius)] p-3 mb-3　｜　h3：text-lg font-semibold mb-1　｜　p：text-sm text-[#666] my-0.5', cls: '.card', testid: 'event-card', rules: ['邊框 1px #ddd', '圓角 var(--radius)', '內距 12px', '卡片間距 12px', '標題 h3 18px / 600', '日期場地價格 14px #666'] },
      { name: '購票按鈕', bs: 'btn text-white mt-2　（背景色與圓角在 styles.css 用 var(--primary)、var(--radius)）', tw: 'bg-[var(--primary)] text-white text-base rounded-[var(--radius)] px-4 py-2 mt-2', cls: '.book', testid: 'book-btn', rules: ['背景 var(--primary)', '文字 #fff 16px', '內距 8px 16px', '圓角 var(--radius)', '無邊框', '上距 8px'] },
    ],
    starterJsx: () => jsxHead + `function App() {
  const [events, setEvents] = useState([]);
  // TODO 1: 用 fetch('/api/events') 取得活動，存進 events

  return (
    <main>
      <h1>熱門活動</h1>
      {/* TODO 2: 每個活動畫成 <div className="card" data-testid="event-card">：h3 標題、日期·場地、價格 */}
      {/* TODO 3: 卡片內放 <button className="book" data-testid="book-btn">立即購票</button> */}
    </main>
  );
}
`,
    starterCss: (t) => base(t) + `
/* TODO: 照規格頁寫 .card 與 .book */
`,
    solutionJsx: () => jsxHead + `function App() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    fetch('/api/events').then((r) => r.json()).then(setEvents);
  }, []);

  return (
    <main>
      <h1>熱門活動</h1>
      {events.map((e) => (
        <div key={e.id} className="card" data-testid="event-card">
          <h3>{e.title}</h3>
          <p>{e.date} · {e.venue}</p>
          <p>NT$ {e.price}</p>
          <button className="book" data-testid="book-btn">立即購票</button>
        </div>
      ))}
    </main>
  );
}
`,
    solutionCss: (t) => base(t) + `.card { border: 1px solid #ddd; border-radius: var(--radius); padding: 12px; margin-bottom: 12px; }
.card h3 { font-size: 18px; font-weight: 600; margin: 0 0 4px; }
.card p { font-size: 14px; color: #666; margin: 2px 0; }
.book { background: var(--primary); color: #fff; font-size: 16px; border: 0; border-radius: var(--radius); padding: 8px 16px; margin-top: 8px; cursor: pointer; }
`,
  },
  {
    id: 'seats',
    title: '座位選擇頁',
    api: 'GET /api/seats → [{ id, sold }]',
    ticket: '【TIX-102】使用者要能選座位。已售出的不能點；點可選座位會變主色並加入已選，再點一次取消；下方顯示已選數量。',
    hint: `<b>React 觀念：</b>「state」是會變的資料，用 <code>useState</code> 存；改了 state，畫面會自動更新。所以「選了哪些座位」要放進 state，不能自己改 DOM。
<ol>
<li><b>取資料</b>（頁面載入時跑一次）：<pre>useEffect(() => {
  fetch('/api/seats').then((r) => r.json()).then(setSeats);
}, []);</pre></li>
<li><b>把每筆資料畫成按鈕</b>：<pre>{seats.map((s) => (
  &lt;button key={s.id} className="seat" data-testid="seat" disabled={s.sold}&gt;
    {s.id}
  &lt;/button&gt;
))}</pre><code>key</code> 要放在最外層，是 React 認列表用的；<code>disabled={s.sold}</code> 讓已售的不能點。</li>
<li><b>記住選了哪些</b>：<code>picked</code> 是一個座位編號的陣列，已經在程式開頭宣告好了。</li>
<li><b>點擊時切換</b>：state 不能直接 push，要給 setPicked 一個「新陣列」：<pre>const toggle = (id) =>
  setPicked((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);</pre>然後在按鈕加 <code>onClick={() => toggle(s.id)}</code>。</li>
<li><b>讓 CSS 知道哪個被選</b>：按鈕加 <code>aria-pressed={picked.includes(s.id)}</code>，styles.css 的 <code>.seat[aria-pressed="true"]</code> 就會生效。</li>
<li><b>數量</b>：<code>已選 {picked.length} 席</code>。</li>
</ol>在 JSX 裡，<code>{ }</code> 裡面寫 JavaScript；註解 <code>{/* */}</code> 是給你看的 TODO，可以刪掉。`,
    components: [
      { name: '座位網格', bs: 'd-grid gap-2　（5 欄 56px 寫在 styles.css）', tw: 'grid grid-cols-[repeat(5,56px)] gap-2', cls: '.grid', rules: ['grid 5 欄，每欄 56px', '間距 8px'] },
      { name: '座位按鈕', bs: 'btn border　（已選／已售狀態用 styles.css 的 aria-pressed、disabled）', tw: 'h-10 border border-[#ddd] rounded-[var(--radius)] bg-white aria-[pressed=true]:bg-[var(--primary)] aria-[pressed=true]:text-white disabled:bg-[#ccc] disabled:cursor-not-allowed', cls: '.seat', testid: 'seat', rules: ['高 40px', '邊框 1px #ddd', '圓角 var(--radius)', '可選：背景 #fff', '已選（aria-pressed=true）：背景 var(--primary)、文字 #fff', '已售（disabled）：背景 #ccc、cursor not-allowed'] },
      { name: '已選數量', bs: 'small text-secondary mt-3', tw: 'text-sm text-[#666] mt-4', cls: '.count', testid: 'selected-count', rules: ['14px #666', '上距 16px', '文字「已選 N 席」'] },
    ],
    starterJsx: () => jsxHead + `function App() {
  const [seats, setSeats] = useState([]);
  const [picked, setPicked] = useState([]);
  // TODO 1: fetch('/api/seats') 取得座位 [{ id, sold }]

  return (
    <main>
      <h1>選擇座位</h1>
      <div className="grid">
        {/* TODO 2: 每個座位 <button className="seat" data-testid="seat">，sold 的要 disabled */}
        {/* TODO 3: 點擊切換選取；aria-pressed 反映狀態 */}
      </div>
      {/* TODO 4: <p className="count" data-testid="selected-count">已選 N 席</p> */}
    </main>
  );
}
`,
    starterCss: (t) => base(t) + `
/* TODO: 照規格頁寫 .grid .seat（含三種狀態）.count */
`,
    solutionJsx: () => jsxHead + `function App() {
  const [seats, setSeats] = useState([]);
  const [picked, setPicked] = useState([]);
  useEffect(() => {
    fetch('/api/seats').then((r) => r.json()).then(setSeats);
  }, []);
  const toggle = (id) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <main>
      <h1>選擇座位</h1>
      <div className="grid">
        {seats.map((s) => (
          <button key={s.id} className="seat" data-testid="seat" disabled={s.sold}
            aria-pressed={picked.includes(s.id)} onClick={() => toggle(s.id)}>
            {s.id}
          </button>
        ))}
      </div>
      <p className="count" data-testid="selected-count">已選 {picked.length} 席</p>
    </main>
  );
}
`,
    solutionCss: (t) => base(t) + `.grid { display: grid; grid-template-columns: repeat(5, 56px); gap: 8px; }
.seat { height: 40px; border: 1px solid #ddd; border-radius: var(--radius); background: #fff; cursor: pointer; }
.seat[aria-pressed="true"] { background: var(--primary); color: #fff; }
.seat[disabled] { background: #ccc; cursor: not-allowed; }
.count { font-size: 14px; color: #666; margin-top: 16px; }
`,
  },
  {
    id: 'checkout',
    title: '結帳頁',
    api: 'GET /api/cart → { count, price }',
    ticket: '【TIX-103】結帳頁顯示總額（數量 × 單價）。表單要有姓名和 Email：姓名不可空白、Email 要有 @，錯誤時顯示訊息；成功後顯示「訂購完成」。',
    hint: 'JSX：controlled input（value + onChange），送出時 e.preventDefault()，依序驗證，錯誤放 state 顯示在 data-testid="error"，成功顯示 data-testid="success"。',
    components: [
      { name: '總額', bs: 'fs-5 fw-bold', tw: 'text-xl font-bold', cls: '.total', testid: 'total', rules: ['20px / 700', '文字「總額 NT$ 數字」'] },
      { name: '表單', bs: 'd-flex flex-column gap-3　（最大寬 320px 寫在 styles.css）', tw: 'flex flex-col gap-3 max-w-xs', cls: 'form', testid: 'checkout-form', rules: ['直向排列，間距 12px', '最大寬 320px'] },
      { name: '輸入框', bs: 'form-control', tw: 'px-3 py-2 border border-[#ddd] rounded-[var(--radius)] text-base', cls: 'input', testid: 'name / email', rules: ['內距 8px 12px', '邊框 1px #ddd', '圓角 var(--radius)', '16px'] },
      { name: '送出按鈕', bs: 'btn text-white　（背景色與圓角在 styles.css）', tw: 'bg-[var(--primary)] text-white text-base rounded-[var(--radius)] px-4 py-2', cls: '.pay', rules: ['背景 var(--primary)', '文字 #fff 16px', '內距 8px 16px', '圓角 var(--radius)', '無邊框'] },
      { name: '錯誤訊息', bs: 'small text-danger m-0', tw: 'text-sm text-[#dc2626] m-0', cls: '.error', testid: 'error', rules: ['14px #dc2626', '姓名空白：「請輸入姓名」', 'Email 無 @：「Email 格式錯誤」'] },
      { name: '成功訊息', bs: 'fs-6', tw: 'text-base', testid: 'success', rules: ['顯示「訂購完成！」並取代表單'] },
    ],
    starterJsx: () => jsxHead + `function App() {
  const [cart, setCart] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  // TODO 1: fetch('/api/cart') 取得 { count, price }

  // TODO 4: 送出處理：preventDefault、驗證姓名/Email，通過就 setDone(true)

  return (
    <main>
      <h1>結帳</h1>
      {/* TODO 2: <p className="total" data-testid="total">總額 NT$ ...</p> */}
      {/* TODO 3: <form data-testid="checkout-form">：兩個 <input data-testid="name|email" /> 和 <button className="pay">送出</button> */}
      {/* TODO 5: 錯誤 <p className="error" data-testid="error">；成功 <p data-testid="success">訂購完成！</p> */}
    </main>
  );
}
`,
    starterCss: (t) => base(t) + `
/* TODO: 照規格頁寫 .total form input .pay .error */
`,
    solutionJsx: () => jsxHead + `function App() {
  const [cart, setCart] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    fetch('/api/cart').then((r) => r.json()).then(setCart);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('請輸入姓名');
    if (!form.email.includes('@')) return setError('Email 格式錯誤');
    setError('');
    setDone(true);
  };

  if (!cart) return <p>載入中…</p>;
  if (done) return <p data-testid="success">訂購完成！</p>;
  return (
    <main>
      <h1>結帳</h1>
      <p className="total" data-testid="total">總額 NT$ {cart.count * cart.price}</p>
      <form data-testid="checkout-form" onSubmit={submit}>
        <input data-testid="name" placeholder="姓名" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input data-testid="email" placeholder="Email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <button className="pay">送出</button>
        {error && <p className="error" data-testid="error">{error}</p>}
      </form>
    </main>
  );
}
`,
    solutionCss: (t) => base(t) + `.total { font-size: 20px; font-weight: 700; }
form { display: flex; flex-direction: column; gap: 12px; max-width: 320px; }
input { padding: 8px 12px; border: 1px solid #ddd; border-radius: var(--radius); font-size: 16px; }
.pay { background: var(--primary); color: #fff; font-size: 16px; border: 0; border-radius: var(--radius); padding: 8px 16px; cursor: pointer; }
.error { font-size: 14px; color: #dc2626; margin: 0; }
`,
  },
];
