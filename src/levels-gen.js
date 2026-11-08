// 其他公司（購購購 / 穩穩 / 找找看）的前端關卡：用三種「樣板」產生，和搶票通的三關同一種做法，只是換資料與文字。
//   listLevel  列表頁：抓資料 → 畫成卡片 → 每張卡片一顆按鈕
//   pickLevel  選取頁：抓資料 → 畫成按鈕格 → 點選切換、不可選的 disabled → 顯示已選數量
//   formLevel  表單頁：抓資料顯示一行摘要 → 兩個欄位逐一驗證 → 顯示錯誤／成功
import { LEVELS, base, jsxHead } from './levels.js';

const [L0, L1, L2] = LEVELS;
const rename = (comps, map, rr = (x) => x) => comps.map((x) => ({ ...x, name: map[x.name] || x.name, testid: map[x.testid] || x.testid, rules: x.rules.map(rr) }));

export function listLevel(c, FIX) {
  const items = FIX[c.api];
  return {
    id: c.id, title: c.title, api: `GET ${c.api} → ${c.shape}`, ticket: c.ticket, hint: c.hint,
    components: rename(L0.components, { '活動卡片': c.cardName, '購票按鈕': c.btnName, 'event-card': c.cardId, 'book-btn': c.btnId }),
    starterJsx: () => jsxHead + `function App() {
  const [items, setItems] = useState([]);
  // TODO 1: 用 fetch('${c.api}') 取得資料，存進 items

  return (
    <main>
      <h1>${c.h1}</h1>
      {/* TODO 2: 每一筆畫成 <div className="card" data-testid="${c.cardId}">：h3 放 ${c.titleKey}、一行 ${c.subHint}、一行 ${c.numHint} */}
      {/* TODO 3: 卡片內放 <button className="book" data-testid="${c.btnId}">${c.btn}</button> */}
    </main>
  );
}
`,
    starterCss: (t) => base(t) + '\n/* TODO: 照規格頁寫 .card 與 .book */\n',
    solutionJsx: () => jsxHead + `function App() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch('${c.api}').then((r) => r.json()).then(setItems);
  }, []);

  return (
    <main>
      <h1>${c.h1}</h1>
      {items.map((e) => (
        <div key={e.id} className="card" data-testid="${c.cardId}">
          <h3>{e.${c.titleKey}}</h3>
          <p>${c.subJsx}</p>
          <p>${c.numJsx}</p>
          <button className="book" data-testid="${c.btnId}">${c.btn}</button>
        </div>
      ))}
    </main>
  );
}
`,
    solutionCss: (t) => L0.solutionCss(t),
    async check(cx) {
      const f = [], cards = cx.ta(c.cardId);
      if (cards.length !== items.length) return [`應有 ${items.length} 張卡片（data-testid="${c.cardId}"），目前 ${cards.length} 張`];
      items.forEach((e, i) => {
        const txt = cards[i].textContent.replace(/,/g, '');
        if (!txt.replace(/\s/g, '').includes(String(e[c.titleKey]).replace(/\s/g, ''))) f.push(`第 ${i + 1} 張卡片缺少「${e[c.titleKey]}」（你的內容：「${txt.trim().slice(0, 40)}」）`);
        if (!txt.includes(String(e[c.numKey]))) f.push(`第 ${i + 1} 張卡片缺少數字 ${e[c.numKey]}`);
      });
      const btns = cx.ta(c.btnId);
      if (btns.length !== items.length) f.push(`每張卡片都要有按鈕（data-testid="${c.btnId}"），目前 ${btns.length} 個`);
      else if (btns.some((b) => cx.bg(b) !== cx.rgb(cx.tokens.primary))) f.push(`按鈕背景應為設計師的主色 ${cx.tokens.primary}（試試 var(--primary)）`);
      const font = cx.win.getComputedStyle(cx.doc.body).fontFamily.replace(/["']/g, '');
      if (!font.startsWith(cx.tokens.font.replace(/["']/g, '').split(',')[0])) f.push('頁面字體跟設計稿不一致，不要刪掉 css 裡的設計變數');
      return f;
    },
  };
}

const num = (el) => Number((el?.textContent.match(/\d+/) || [NaN])[0]);

export function pickLevel(c, FIX) {
  const all = FIX[c.api];
  return {
    id: c.id, title: c.title, api: `GET ${c.api} → [{ id, ${c.offKey} }]`, ticket: c.ticket, hint: c.hint,
    components: rename(L1.components, { '座位網格': c.gridName, '座位按鈕': c.optName, '已選數量': '已選數量', seat: c.optId }, (r) => r.replace('已選 N 席', `已選 N ${c.unit}`).replace(/已售/g, c.offWord)),
    starterJsx: () => jsxHead + `function App() {
  const [items, setItems] = useState([]);
  const [picked, setPicked] = useState([]);
  // TODO 1: fetch('${c.api}') 取得 [{ id, ${c.offKey} }]

  return (
    <main>
      <h1>${c.h1}</h1>
      <div className="grid">
        {/* TODO 2: 每一筆 <button className="seat" data-testid="${c.optId}">，${c.offKey} 為 true 的要 disabled */}
        {/* TODO 3: 點擊切換選取；aria-pressed 反映狀態 */}
      </div>
      {/* TODO 4: <p className="count" data-testid="selected-count">已選 N ${c.unit}</p> */}
    </main>
  );
}
`,
    starterCss: (t) => base(t) + '\n/* TODO: 照規格頁寫 .grid .seat（含三種狀態）.count */\n',
    solutionJsx: () => jsxHead + `function App() {
  const [items, setItems] = useState([]);
  const [picked, setPicked] = useState([]);
  useEffect(() => {
    fetch('${c.api}').then((r) => r.json()).then(setItems);
  }, []);
  const toggle = (id) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <main>
      <h1>${c.h1}</h1>
      <div className="grid">
        {items.map((s) => (
          <button key={s.id} className="seat" data-testid="${c.optId}" disabled={s.${c.offKey}}
            aria-pressed={picked.includes(s.id)} onClick={() => toggle(s.id)}>
            {s.id}
          </button>
        ))}
      </div>
      <p className="count" data-testid="selected-count">已選 {picked.length} ${c.unit}</p>
    </main>
  );
}
`,
    solutionCss: (t) => L1.solutionCss(t),
    async check(cx) {
      const f = [], opts = cx.ta(c.optId);
      if (opts.length !== all.length) return [`應有 ${all.length} 個按鈕（data-testid="${c.optId}"），目前 ${opts.length} 個`];
      const offN = all.filter((s) => s[c.offKey]).length;
      if (opts.filter((s) => s.disabled).length !== offN) f.push(`${c.offWord}的 ${offN} 個必須 disabled`);
      const free = opts.filter((s) => !s.disabled);
      await cx.click(free[0]);
      if (free[0].getAttribute('aria-pressed') !== 'true') f.push('點選後 aria-pressed 應為 true');
      else if (cx.bg(free[0]) !== cx.rgb(cx.tokens.primary)) f.push('已選的背景應為主色（var(--primary)）');
      await cx.click(free[1]);
      if (num(cx.t('selected-count')) !== 2) f.push('選兩個後，selected-count 應顯示 2');
      await cx.click(free[0]);
      if (free[0].getAttribute('aria-pressed') === 'true' || num(cx.t('selected-count')) !== 1) f.push('再點一次已選的應取消選取');
      return f;
    },
  };
}

export function formLevel(c, FIX) {
  const [a, b] = c.fields;
  return {
    id: c.id, title: c.title, api: `GET ${c.api} → ${c.shape}`, ticket: c.ticket, hint: c.hint,
    components: [
      { name: '摘要', bs: 'fs-5 fw-bold', tw: 'text-xl font-bold', cls: '.total', testid: 'total', rules: ['20px / 700', `文字「${c.totalText}」`] },
      L2.components[1],
      { name: '輸入框', bs: 'form-control', tw: L2.components[2].tw, cls: 'input', testid: `${a.id} / ${b.id}`, rules: L2.components[2].rules },
      { name: '送出按鈕', bs: L2.components[3].bs, tw: L2.components[3].tw, cls: '.pay', rules: L2.components[3].rules },
      { name: '錯誤訊息', bs: 'small text-danger m-0', tw: 'text-sm text-[#dc2626] m-0', cls: '.error', testid: 'error', rules: ['14px #dc2626', `${a.label}：「${a.msg}」`, `${b.label}：「${b.msg}」`] },
      { name: '成功訊息', bs: 'fs-6', tw: 'text-base', testid: 'success', rules: [`顯示「${c.success}」並取代表單`] },
    ],
    starterJsx: () => jsxHead + `function App() {
  const [info, setInfo] = useState(null);
  const [form, setForm] = useState({ ${a.id}: '', ${b.id}: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  // TODO 1: fetch('${c.api}') 取得 ${c.shape}

  // TODO 4: 送出處理：preventDefault、依序驗證 ${a.label}、${b.label}，通過就 setDone(true)

  return (
    <main>
      <h1>${c.h1}</h1>
      {/* TODO 2: <p className="total" data-testid="total">${c.totalText}</p> */}
      {/* TODO 3: <form data-testid="checkout-form">：兩個 <input data-testid="${a.id}|${b.id}" /> 和 <button className="pay">${c.btn}</button> */}
      {/* TODO 5: 錯誤 <p className="error" data-testid="error">；成功 <p data-testid="success">${c.success}</p> */}
    </main>
  );
}
`,
    starterCss: (t) => base(t) + '\n/* TODO: 照規格頁寫 .total form input .pay .error */\n',
    solutionJsx: () => jsxHead + `function App() {
  const [info, setInfo] = useState(null);
  const [form, setForm] = useState({ ${a.id}: '', ${b.id}: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    fetch('${c.api}').then((r) => r.json()).then(setInfo);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (${a.bad}) return setError('${a.msg}');
    if (${b.bad}) return setError('${b.msg}');
    setError('');
    setDone(true);
  };

  if (!info) return <p>載入中…</p>;
  if (done) return <p data-testid="success">${c.success}</p>;
  return (
    <main>
      <h1>${c.h1}</h1>
      <p className="total" data-testid="total">${c.totalJsx}</p>
      <form data-testid="checkout-form" onSubmit={submit}>
        <input data-testid="${a.id}" placeholder="${a.label}" value={form.${a.id}}
          onChange={(e) => setForm({ ...form, ${a.id}: e.target.value })} />
        <input data-testid="${b.id}" placeholder="${b.label}" value={form.${b.id}}
          onChange={(e) => setForm({ ...form, ${b.id}: e.target.value })} />
        <button className="pay">${c.btn}</button>
        {error && <p className="error" data-testid="error">{error}</p>}
      </form>
    </main>
  );
}
`,
    solutionCss: (t) => L2.solutionCss(t),
    async check(cx) {
      const f = [];
      if (!cx.t('total')?.textContent.replace(/,/g, '').includes(c.expect)) return [`摘要應顯示 ${c.expect}（data-testid="total"）`];
      const form = cx.t('checkout-form'), i0 = cx.t(a.id), i1 = cx.t(b.id);
      if (!form || !i0 || !i1) return [`缺少 checkout-form / ${a.id} / ${b.id}（data-testid）`];
      form.requestSubmit(); await cx.wait(60);
      if (!cx.t('error')?.textContent.trim()) f.push(`${a.label}空白送出時，應顯示錯誤訊息（data-testid="error"）`);
      await cx.type(i0, a.ok); await cx.type(i1, b.badVal);
      form.requestSubmit(); await cx.wait(60);
      if (!cx.t('error')?.textContent.trim() || cx.t('success')) f.push(`${b.label}填「${b.badVal}」時應顯示錯誤，且不能成功`);
      await cx.type(i1, b.ok);
      form.requestSubmit(); await cx.wait(60);
      if (!cx.t('success')) f.push('資料正確時應顯示 data-testid="success"');
      else if (cx.t('error')) f.push('成功後不應還有錯誤訊息');
      return f;
    },
  };
}
