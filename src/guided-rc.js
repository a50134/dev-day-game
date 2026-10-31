// 手把手專案（React）：購物車，從空白做到完成。結構仿 courses-api.js 的「城市天氣小站」。
const pre = (code) => `<pre>${code.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>`;
const choice = (q, options, answer, why) => ({ type: 'choice', q, options, answer, why });
const react = (o) => ({ kind: 'react', ...o });
const txt = (el) => (el?.textContent || '').replace(/,/g, '').trim();
const RH = 'const { useState } = React;\n\n';

const STAGES = ['空白開始：蓋出標題', '用 map 把陣列變成清單', '把一列拆成 CartItem 元件（props）', 'useState：數量＋／−', '算出合計（衍生資料）', '移除商品', '條件渲染：購物車是空的', '受控輸入框：新增商品'];
const progressMap = (n) => `<p><b>📍 專案進度：購物車</b>（我們從一個空白檔案，一步一步做到完整作品）</p><ol>${STAGES.map((t, i) => `<li>${i + 1 < n ? '✅' : i + 1 === n ? '👉 <b>' : '⬜'} ${t}${i + 1 === n ? '</b>' : ''}</li>`).join('')}</ol>`;

/* ---------- 各階段的程式碼（前一步的解答 = 下一步的起點） ---------- */
const D0 = `const items = [
  { id: 1, name: '牛奶', price: 50 },
  { id: 2, name: '麵包', price: 30 },
  { id: 3, name: '雞蛋', price: 80 },
];
`;
const D1 = `  const [items, setItems] = useState([
    { id: 1, name: '牛奶', price: 50, qty: 1 },
    { id: 2, name: '麵包', price: 30, qty: 1 },
    { id: 3, name: '雞蛋', price: 80, qty: 1 },
  ]);
`;
const CHANGE = `  function changeQty(id, delta) {
    setItems(items.map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it)));
  }
`;
const REMOVE = `  function removeItem(id) {
    setItems(items.filter((it) => it.id !== id));
  }
`;
const ADD = `  function addItem() {
    const name = text.trim();
    if (name === '') return;
    setItems([...items, { id: Date.now(), name, price: 50, qty: 1 }]);
    setText('');
  }
`;

// U1
const S1 = `${RH}function App() {
  return (
    <div>
      {/* TODO: 寫一個標題 <h1 data-testid="title">購物車</h1> */}
    </div>
  );
}
`;
const SOL1 = `${RH}function App() {
  return (
    <div>
      <h1 data-testid="title">購物車</h1>
    </div>
  );
}
`;
// U2
const S2 = `${RH}${D0}
function App() {
  return (
    <div>
      <h1 data-testid="title">購物車</h1>
      {/* TODO 1: 寫 <ul> 把清單包起來 */}
      {/* TODO 2: 在 ul 裡用 items.map((item) => (...)) 對每個商品畫一個 <li data-testid="item"> */}
      {/* TODO 3: li 裡顯示 {item.name} 和 NT$ {item.price}，並且在 li 上加 key={item.id} */}
    </div>
  );
}
`;
const SOL2 = `${RH}${D0}
function App() {
  return (
    <div>
      <h1 data-testid="title">購物車</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id} data-testid="item">
            {item.name} NT$ {item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
`;
// U3
const S3 = `${RH}${D0}
// TODO 1: 在 App 上面寫一個叫 CartItem 的元件（函式），從 props 收 name 和 price，回傳 li（data-testid="item"）
function App() {
  return (
    <div>
      <h1 data-testid="title">購物車</h1>
      <ul>
        {items.map((item) => (
          // TODO 2: 這個 li 整個換成「使用 CartItem 元件」，記得傳 key、name、price 三個屬性
          <li key={item.id} data-testid="item">
            {item.name} NT$ {item.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
`;
const SOL3 = `${RH}${D0}
function CartItem({ name, price }) {
  return (
    <li data-testid="item">
      {name} NT$ {price}
    </li>
  );
}

function App() {
  return (
    <div>
      <h1 data-testid="title">購物車</h1>
      <ul>
        {items.map((item) => (
          <CartItem key={item.id} name={item.name} price={item.price} />
        ))}
      </ul>
    </div>
  );
}
`;
// U4
const S4 = `${RH}function CartItem({ name, price }) {
  // TODO 3: 參數多收 qty、onPlus、onMinus；畫面上加 <button data-testid="minus" onClick={onMinus}>−</button>、<span data-testid="qty">{qty}</span>、<button data-testid="plus" onClick={onPlus}>＋</button>
  return (
    <li data-testid="item">
      {name} NT$ {price}
    </li>
  );
}

function App() {
  // TODO 1: 把檔案最上面的 const items 刪掉，改成在 App 裡面用 useState 放（每個商品多一個 qty: 1）：
  //   const [items, setItems] = useState([{ id: 1, name: '牛奶', price: 50, qty: 1 }, ...]);
  // TODO 2: 寫 function changeQty(id, delta)，用 items.map 只改指定那一個的 qty，最小是 1
  return (
    <div>
      <h1 data-testid="title">購物車</h1>
      <ul>
        {items.map((item) => (
          // TODO 4: 這裡多傳 qty={item.qty} onPlus={() => changeQty(item.id, 1)} onMinus={() => changeQty(item.id, -1)}
          <CartItem key={item.id} name={item.name} price={item.price} />
        ))}
      </ul>
    </div>
  );
}
`;
// 注意 S4 沒有 D0（要玩家自己改成 useState），所以 items 未定義會報錯 → 一定不通過
const cartItem = (params, extra) => `function CartItem({ ${params} }) {
  return (
    <li data-testid="item">
      {name} NT$ {price}
      <button data-testid="minus" onClick={onMinus}>−</button>
      <span data-testid="qty">{qty}</span>
      <button data-testid="plus" onClick={onPlus}>＋</button>${extra || ''}
    </li>
  );
}
`;
const LIST4 = (extraProps) => `      <ul>
        {items.map((item) => (
          <CartItem
            key={item.id}
            name={item.name}
            price={item.price}
            qty={item.qty}
            onPlus={() => changeQty(item.id, 1)}
            onMinus={() => changeQty(item.id, -1)}${extraProps || ''}
          />
        ))}
      </ul>`;
const SOL4 = `${RH}${cartItem('name, price, qty, onPlus, onMinus')}
function App() {
${D1}${CHANGE}  return (
    <div>
      <h1 data-testid="title">購物車</h1>
${LIST4()}
    </div>
  );
}
`;
// U5
const S5 = SOL4.replace('  return (\n    <div>\n      <h1', '  // TODO 1: 在這裡算合計：const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);\n  return (\n    <div>\n      <h1').replace('      </ul>\n    </div>', '      </ul>\n      {/* TODO 2: 寫 <p data-testid="total">合計 NT$ {total}</p> */}\n    </div>');
const SOL5 = SOL4.replace('  return (\n    <div>\n      <h1', '  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);\n  return (\n    <div>\n      <h1').replace('      </ul>\n    </div>', '      </ul>\n      <p data-testid="total">合計 NT$ {total}</p>\n    </div>');
// U6
const SOL6 = `${RH}${cartItem('name, price, qty, onPlus, onMinus, onRemove', '\n      <button data-testid="remove" onClick={onRemove}>移除</button>')}
function App() {
${D1}${CHANGE}${REMOVE}  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  return (
    <div>
      <h1 data-testid="title">購物車</h1>
${LIST4('\n            onRemove={() => removeItem(item.id)}')}
      <p data-testid="total">合計 NT$ {total}</p>
    </div>
  );
}
`;
const S6 = S5.replace("function CartItem({ name, price, qty, onPlus, onMinus })", "function CartItem({ name, price, qty, onPlus, onMinus /* TODO 3: 再收一個 onRemove */ })")
  .replace('＋</button>\n    </li>', '＋</button>\n      {/* TODO 4: 加 <button data-testid="remove" onClick={onRemove}>移除</button> */}\n    </li>')
  .replace('  // TODO 1: 在這裡算合計：const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);', '  // TODO 1: 寫 function removeItem(id)：setItems(items.filter((it) => it.id !== id));\n  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);')
  .replace('      {/* TODO 2: 寫 <p data-testid="total">合計 NT$ {total}</p> */}', '      <p data-testid="total">合計 NT$ {total}</p>')
  .replace('onMinus={() => changeQty(item.id, -1)}', 'onMinus={() => changeQty(item.id, -1)}\n            // TODO 2: 這裡多傳 onRemove={() => removeItem(item.id)}');
// U7
const LIST7 = (inner) => `      {items.length === 0 ? (
        <p data-testid="empty">購物車是空的</p>
      ) : (
${inner}
      )}`;
const SOL7 = SOL6.replace(/      <ul>[\s\S]*<\/ul>/, LIST7(SOL6.match(/      <ul>[\s\S]*<\/ul>/)[0].replace(/^/gm, '  ')));
const S7 = SOL6.replace(/      <ul>[\s\S]*<\/ul>/, '      {/* TODO: 用 items.length === 0 判斷：空的就顯示 <p data-testid="empty">購物車是空的</p>，不是空的才顯示下面這個 <ul> */}\n$&');
// U8
const SOL8 = SOL7.replace(`  const total`, `  const [text, setText] = useState('');\n${ADD}  const total`)
  .replace('      <p data-testid="total">', `      <input data-testid="new-name" placeholder="輸入商品名稱" value={text} onChange={(e) => setText(e.target.value)} />
      <button data-testid="add" onClick={addItem}>新增</button>
      <p data-testid="total">`);
const S8 = SOL7.replace(`  const total`, `  // TODO 1: 加一個 state：const [text, setText] = useState('');
  // TODO 2: 寫 function addItem()：先 trim，空白就 return；否則 setItems([...items, { id: Date.now(), name, price: 50, qty: 1 }])，最後 setText('')
  const total`)
  .replace('      <p data-testid="total">', `      {/* TODO 3: 寫受控輸入框 <input data-testid="new-name" value={text} onChange={(e) => setText(e.target.value)} /> */}
      {/* TODO 4: 寫新增按鈕 <button data-testid="add" onClick={addItem}>新增</button> */}
      <p data-testid="total">`);

/* ---------- 測試（每個階段累積前面的檢查） ---------- */
const PRICE = { 牛奶: 50, 麵包: 30, 雞蛋: 80 };
const rows = (c) => c.ta('item');
const qtyOf = (c, i) => Number(txt(c.ta('qty')[i]));
const expectedTotal = (c) => rows(c).reduce((s, li, i) => { const k = Object.keys(PRICE).find((n) => li.textContent.includes(n)); return s + (k ? PRICE[k] : 50) * qtyOf(c, i); }, 0);
const s1 = (c) => (txt(c.t('title')) === '購物車' ? [] : ['找不到標題：需要 <h1 data-testid="title">購物車</h1>（目前：「' + txt(c.t('title')) + '」）']);
const s2 = (c) => {
  const f = [], r = rows(c);
  if (r.length !== 3) return [`應該有 3 個商品（每個 li 都要有 data-testid="item"），目前 ${r.length} 個`];
  [['牛奶', 50], ['麵包', 30], ['雞蛋', 80]].forEach(([n, p], i) => {
    if (!r[i].textContent.includes(n)) f.push(`第 ${i + 1} 個商品要顯示「${n}」`);
    if (!r[i].textContent.includes(String(p))) f.push(`第 ${i + 1} 個商品要顯示價格 ${p}`);
  });
  return f;
};
const s4 = async (c) => {
  const f = [];
  if (!c.ta('plus').length || !c.ta('minus').length || !c.ta('qty').length) return ['每個商品都要有 minus、qty、plus（data-testid）'];
  if (c.ta('qty').length !== 3 || qtyOf(c, 0) !== 1) f.push('一開始每個商品的數量都是 1');
  await c.click(c.ta('plus')[0]); await c.click(c.ta('plus')[0]);
  if (qtyOf(c, 0) !== 3) f.push(`第一個商品按兩次＋應是 3，目前是 ${qtyOf(c, 0)}`);
  if (qtyOf(c, 1) !== 1) f.push('只按第一個商品的＋，第二個商品的數量不能跟著變（每個商品要各自的數量）');
  for (let i = 0; i < 5; i++) await c.click(c.ta('minus')[0]);
  if (qtyOf(c, 0) !== 1) f.push(`一直按−，數量最少停在 1，目前是 ${qtyOf(c, 0)}`);
  await c.click(c.ta('plus')[0]);
  return f;
};
const s5 = async (c) => {
  const f = [];
  if (!c.t('total')) return ['缺少 <p data-testid="total">'];
  const check = (when) => { if (!txt(c.t('total')).includes(String(expectedTotal(c)))) f.push(`${when}合計應是 ${expectedTotal(c)}，目前顯示「${txt(c.t('total'))}」`); };
  check('目前');
  await c.click(c.ta('plus')[2]);
  check('雞蛋再加一份後');
  await c.click(c.ta('minus')[2]);
  check('雞蛋減一份後');
  return f;
};
const s6 = async (c) => {
  const f = [];
  if (c.ta('remove').length !== 3) return [`每個商品都要有移除按鈕（data-testid="remove"），目前 ${c.ta('remove').length} 個`];
  await c.click(c.ta('remove')[1]);
  if (rows(c).length !== 2) f.push(`按第二個商品的「移除」後應剩 2 個，目前 ${rows(c).length} 個`);
  else if (rows(c).some((li) => li.textContent.includes('麵包'))) f.push('被移除的應該是「麵包」，其他商品要留下');
  if (!txt(c.t('total')).includes(String(expectedTotal(c)))) f.push(`移除後合計應更新成 ${expectedTotal(c)}，目前「${txt(c.t('total'))}」`);
  return f;
};
const s7 = async (c) => {
  const f = [];
  if (c.t('empty')) f.push('還有商品的時候，不可以顯示「購物車是空的」');
  while (c.ta('remove').length) await c.click(c.ta('remove')[0]);
  if (rows(c).length) f.push('全部移除後，清單應該是空的');
  if (!c.t('empty')) f.push('全部移除後，要顯示 <p data-testid="empty">購物車是空的</p>');
  else if (!txt(c.t('empty')).includes('空')) f.push('empty 的文字要是「購物車是空的」');
  return f;
};
const s8 = async (c) => {
  const f = [], inp = c.t('new-name'), add = c.t('add');
  if (!inp || !add) return ['缺少輸入框 new-name 或新增按鈕 add（data-testid）'];
  await c.type(inp, '   '); await c.click(add);
  if (rows(c).length !== 0) f.push('輸入全是空白時按新增，不可以加商品');
  await c.type(inp, '蘋果');
  if (inp.value !== '蘋果') f.push('輸入框要受控：value={text} 加 onChange 更新 text');
  await c.click(add);
  if (rows(c).length !== 1 || !rows(c)[0].textContent.includes('蘋果')) f.push('輸入「蘋果」按新增，清單應出現「蘋果」（目前 ' + rows(c).length + ' 個商品）');
  if (c.t('empty')) f.push('有商品時，「購物車是空的」要消失');
  if (inp.value !== '') f.push('新增成功後，輸入框要清空（setText(\'\')）');
  if (qtyOf(c, 0) !== 1) f.push('新增的商品數量一開始是 1');
  if (!txt(c.t('total')).includes('50')) f.push('蘋果 50 元，合計應是 50，目前「' + txt(c.t('total')) + '」');
  await c.type(inp, '香蕉'); await c.click(add);
  if (rows(c).length !== 2) f.push('再加「香蕉」後應有 2 個商品');
  await c.click(c.ta('plus')[1]);
  if (!txt(c.t('total')).includes('150')) f.push('蘋果 1 個 + 香蕉 2 個 = 150，目前「' + txt(c.t('total')) + '」');
  return f;
};
const chain = (...fs) => async (c) => { const out = []; for (const fn of fs) { out.push(...(await fn(c))); if (out.length) break; } return out; };
const T1 = chain(s1), T2 = chain(s1, s2), T4 = chain(s1, s2, s4), T5 = chain(s1, s2, s4, s5), T6 = chain(s1, s2, s4, s5, s6), T7 = chain(s1, s2, s4, s5, s6, s7), T8 = chain(s1, s2, s4, s5, s6, s7, s8);

/* ---------- 課程內容 ---------- */
const gstep = (say, check) => ({ say, check });
const GR = (n, title, steps, fin) => ({ id: 'rcg' + n, title: `手把手 ${n}／8　${title}`, steps: steps.map((s, i) => (i === 0 ? { ...s, say: progressMap(n) + s.say } : s)), final: react(fin) });

const UNITS = [
  GR(1, '空白開始：蓋出標題', [
    gstep(`<p><b>這一步要做什麼？</b>我們要做一個「購物車」小網頁。大工程不要一次做，先做最小的一塊：<b>一個標題</b>。</p><p><b>為什麼先做這個？</b>像蓋房子先打地基。先讓畫面出現一個東西，確定「寫的程式真的會變成畫面」，之後每一步都往上加一點，就不會迷路。</p>`,
      choice('做大專案，第一步比較好的做法是？', ['先做出最小的一塊，看到畫面', '一次全寫完再看', '先想好所有細節再動手'], 0, '小步前進，每一步都看得到結果。')),
    gstep(`<p>React 的畫面是由<b>元件</b>組成。元件就是一個「回傳畫面的函式」，名字要大寫開頭。我們的整個購物車叫 <code>App</code>：</p>${pre('function App() {\n  return (\n    <div>\n      <h1 data-testid="title">購物車</h1>\n    </div>\n  );\n}')}<ul><li><code>function App()</code>：宣告一個叫 App 的元件。</li><li><code>return ( ... )</code>：回傳要顯示的畫面（JSX，長得像 HTML）。</li><li><code>&lt;div&gt;</code>：最外面一定要有「一個」標籤把東西包起來。</li><li><code>data-testid="title"</code>：給檢查程式用的名牌，不會顯示在畫面上。名牌不要刪掉。</li></ul>`,
      choice('React 元件的名字，第一個字要？', ['大寫', '小寫', '數字'], 0, '大寫開頭 React 才知道它是元件。')),
    gstep(`<p><b>常見的坑：</b></p><ul><li>標籤沒關好，例如少了 <code>&lt;/h1&gt;</code>。</li><li>最外面有兩個標籤並排，沒有用 <code>div</code> 包住。</li><li>把 <code>data-testid</code> 打錯，檢查就找不到標題。</li></ul><p><b>下一步預告：</b>第 2 步，我們有一個商品陣列，要用 <code>map</code> 把它變成一整個清單。</p>`,
      choice('JSX 最外面可以有幾個並排的標籤？', ['只能一個，要用 div 包起來', '隨便幾個', '至少兩個'], 0, '最外層只能有一個根標籤。')),
  ], {
    brief: '第 1 步：在 App 裡寫一個標題 <code>&lt;h1 data-testid="title"&gt;購物車&lt;/h1&gt;</code>。',
    hint: '把 TODO 那行註解整行換成 h1 標籤，按「送出檢查」。',
    steps: [`找到 <code>TODO</code> 那行註解，整行換成：${pre('<h1 data-testid="title">購物車</h1>')}為什麼：這就是畫面上的標題；data-testid 是給檢查用的名牌。`, `確認 h1 還在 <code>&lt;div&gt;</code> 裡面。為什麼：JSX 最外面只能有一個標籤。最常犯的錯：文字「購物車」打成別的字，或標籤沒有關好。`],
    starter: S1, solution: SOL1, must: [], test: T1,
  }),
  GR(2, '用 map 把陣列變成清單', [
    gstep(`<p><b>這一步要做什麼？</b>真的購物車有很多商品。我們先準備一個<b>陣列</b>放 3 個商品，再讓畫面「每個商品畫一列」。</p><p><b>為什麼？</b>商品會一直變（加、減、刪）。如果每一列都手寫，改一次要動很多地方。用陣列＋程式幫我們畫，只要改資料。</p>`,
      choice('為什麼不把每一列都手寫在畫面上？', ['商品會變動，用資料來畫比較好改', '因為手寫會報錯', '因為陣列比較快'], 0, '資料變了，畫面自動跟著變。')),
    gstep(`<p><code>map</code> 的意思是：「陣列裡每一個東西，都變成一個畫面」：</p>${pre('<ul>\n  {items.map((item) => (\n    <li key={item.id} data-testid="item">\n      {item.name} NT$ {item.price}\n    </li>\n  ))}\n</ul>')}<ul><li><code>{items.map(...)}</code>：大括號代表裡面是 JavaScript。</li><li><code>(item) =&gt; ( ... )</code>：每次拿到一個商品，叫它 item，然後回傳一個 li。</li><li><code>{item.name}</code>：把商品的名字放到畫面。</li><li><code>key={item.id}</code>：每一列的「身分證」，React 靠它分辨誰是誰。</li></ul>`,
      choice('<code>items.map((item) =&gt; ...)</code> 做的事是？', ['陣列每個東西各畫一份', '把陣列排序', '把陣列清空'], 0, 'map 把每一個項目轉成一個畫面。')),
    gstep(`<p><b>常見的坑：</b></p><ul><li>忘了加 <code>key</code>：畫面看起來正常，但 React 會在主控台警告，之後刪除、新增會出怪事。</li><li><code>key</code> 要用<b>不會重複</b>的值（像 id），不要用陣列順序。</li><li>箭頭函式後面用小括號 <code>( )</code> 回傳畫面，不是大括號 <code>{ }</code>（大括號要自己寫 return）。</li></ul><p><b>下一步預告：</b>第 3 步，我們把「一列」獨立成自己的元件 <code>CartItem</code>，用 props 傳資料給它。</p>`,
      choice('用 map 畫清單，每一列的 <code>key</code> 應該放什麼？', ['不會重複的值，例如 id', '都放 1', '不用放'], 0, 'key 要讓每一列獨一無二。')),
  ], {
    brief: '第 2 步：檔案上面已經有 <code>items</code> 陣列（3 個商品）。用 <code>map</code> 畫成清單：外面 <code>&lt;ul&gt;</code>，每個商品一個 <code>&lt;li data-testid="item"&gt;</code>，顯示名字和「NT$ 價格」，並加上 <code>key</code>。',
    hint: '<code>&lt;li key={item.id} data-testid="item"&gt;{item.name} NT$ {item.price}&lt;/li&gt;</code>，外面用 items.map 包起來。',
    steps: [`把 <code>TODO</code> 三行註解換成：${pre('<ul>\n  {items.map((item) => (\n    <li key={item.id} data-testid="item">\n      {item.name} NT$ {item.price}\n    </li>\n  ))}\n</ul>')}為什麼：map 幫每個商品畫一個 li，資料變了清單就跟著變。`, `檢查 <code>key={item.id}</code> 有寫在 <code>li</code> 上。為什麼：key 讓 React 知道每一列是誰。最常犯的錯：<code>map</code> 後面用大括號卻沒寫 <code>return</code>，結果什麼都不顯示。`],
    starter: S2, solution: SOL2, must: [{ re: /\.map\(/, msg: '請用 items.map(...) 畫清單' }, { re: /key=/, msg: '每一列都要加 key（例如 key={item.id}）' }], test: T2,
  }),
  GR(3, '把一列拆成 CartItem 元件（props）', [
    gstep(`<p><b>這一步要做什麼？</b>把「一列商品」獨立成自己的元件，叫 <code>CartItem</code>。畫面看起來<b>完全一樣</b>，只是程式整理得更乾淨。</p><p><b>為什麼？</b>下一步每一列要有自己的按鈕和數量，程式會越來越長。把一列獨立出去，像把一張名片設計好，要印幾張都行。</p>`,
      choice('把一列拆成元件，畫面會怎樣？', ['看起來一樣，只是程式更整齊', '畫面全部消失', '多出一個標題'], 0, '這叫重構：外表不變，內部整理。')),
    gstep(`<p>元件要用到的資料，從外面用 <b>props</b> 傳進來，就像打電話給朋友時「帶上要說的話」：</p>${pre('function CartItem({ name, price }) {\n  return (\n    <li data-testid="item">\n      {name} NT$ {price}\n    </li>\n  );\n}\n\n// 使用的時候像寫標籤，把資料寫成屬性：\n<CartItem key={item.id} name={item.name} price={item.price} />')}<ul><li><code>{ name, price }</code>：接收外面傳來的兩個值。</li><li><code>name={item.name}</code>：外面這樣傳，裡面就用 <code>{name}</code> 拿到。</li><li><code>key</code> 仍然要寫在 map 裡的最外層元件上。</li></ul>`,
      choice('怎麼把資料「傳給」元件？', ['像 HTML 屬性一樣寫在標籤上（props）', '用 return', '用 CSS'], 0, '<CartItem name="牛奶" /> 這種寫法就是傳 props。')),
    gstep(`<p><b>常見的坑：</b></p><ul><li>元件名字要<b>大寫</b>：<code>CartItem</code>，寫成 <code>cartItem</code> React 會當成 HTML 標籤。</li><li>參數的名字要和傳進來的屬性<b>完全一樣</b>（<code>name</code> 對 <code>name</code>）。</li><li>屬性用大括號傳變數：<code>name={item.name}</code>；寫成 <code>name="item.name"</code> 會變成純文字。</li></ul><p><b>下一步預告：</b>第 4 步，用 <code>useState</code> 讓每個商品有數量，按＋／−會改變。</p>`,
      choice('<code>name="item.name"</code> 和 <code>name={item.name}</code> 差在哪？', ['前者是純文字，後者才是變數的值', '一樣', '前者比較好'], 0, '要傳變數，一定用大括號。')),
  ], {
    brief: '第 3 步：寫一個 <code>CartItem</code> 元件，用 props（<code>name</code>、<code>price</code>）畫出 <code>&lt;li data-testid="item"&gt;</code>，再用它取代 App 裡的 li。畫面要跟之前一樣。',
    hint: '先寫 function CartItem({ name, price }) { return (<li data-testid="item">...</li>); }，再在 map 裡改成 <code>&lt;CartItem key=... name=... price=... /&gt;</code>。',
    steps: [`在 App 上面加：${pre('function CartItem({ name, price }) {\n  return (\n    <li data-testid="item">\n      {name} NT$ {price}\n    </li>\n  );\n}')}為什麼：把一列獨立出來，之後要改一列只改這裡。`, `把 map 裡原本的 <code>&lt;li&gt;...&lt;/li&gt;</code> 換成：${pre('<CartItem key={item.id} name={item.name} price={item.price} />')}為什麼：用標籤的方式使用元件，屬性就是 props。最常犯的錯：元件名字寫成小寫，或 props 的名字前後對不上。`],
    starter: S3, solution: SOL3, must: [{ re: /function\s+CartItem/, msg: '請寫一個 function CartItem 元件' }, { re: /<CartItem[\s\S]*?name=\{/, msg: '請在 map 裡使用 <CartItem name={...} price={...} />' }], test: T2,
  }),
  GR(4, 'useState：數量＋／−', [
    gstep(`<p><b>這一步要做什麼？</b>每個商品有「數量」，按＋加一、按−減一，數量最少是 1。</p><p><b>為什麼？</b>數量會變，而且變了之後畫面要跟著更新。這種「會變的資料」React 叫它 <b>state</b>。我們把全部商品放進 state，因為下一步要算合計，合計需要知道每個商品的數量。</p>`,
      choice('什麼樣的資料適合放進 state？', ['會改變、而且改變後畫面要更新的', '永遠不變的文字', '圖片網址'], 0, 'state = 會變的資料。')),
    gstep(`<p>用法（你在 React 課學過）：</p>${pre("const [items, setItems] = useState([\n  { id: 1, name: '牛奶', price: 50, qty: 1 },\n  // ... 其他商品\n]);\n\nfunction changeQty(id, delta) {\n  setItems(items.map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it)));\n}")}<ul><li><code>items</code>：目前的商品陣列；<code>setItems</code>：更新它的工具。</li><li><code>items.map(...)</code>：每個商品看一遍，<b>只有 id 對的那個</b>換成新的，其他原封不動。</li><li><code>{ ...it, qty: 新數量 }</code>：「複製 it，但 qty 換成新的」。<code>...</code> 讀作「展開」。</li><li><code>Math.max(1, ...)</code>：取較大的，所以永遠不會小於 1。</li></ul>`,
      choice('<code>{ ...it, qty: 5 }</code> 的意思是？', ['複製 it，只把 qty 換成 5', '把 it 刪掉', '建立全新、只有 qty 的物件'], 0, '... 先展開舊的，後面的欄位會蓋過去。')),
    gstep(`<p>按鈕放在 <code>CartItem</code> 裡，但 state 在 <code>App</code>。所以 App 把「按了要做什麼」用 props 傳下去：</p>${pre('<CartItem ... qty={item.qty}\n  onPlus={() => changeQty(item.id, 1)}\n  onMinus={() => changeQty(item.id, -1)} />\n\n// CartItem 裡：\n<button onClick={onMinus}>−</button>')}<p><b>常見的坑：</b>直接改 <code>item.qty = item.qty + 1</code>，畫面不會動，一定要用 <code>setItems</code>。也別忘了把檔案最上面的 <code>const items</code> 刪掉（資料搬進 state 了）。</p><p><b>下一步預告：</b>第 5 步，用 qty 算出「合計」。</p>`,
      choice('要讓數量改變後畫面更新，必須？', ['呼叫 setItems', '直接改 item.qty', '重新整理網頁'], 0, '只有 setter 會讓 React 重畫。')),
  ], {
    brief: '第 4 步：把商品改放進 <code>useState</code>（每個多 <code>qty: 1</code>）。每一列要有 <code>minus</code>、<code>qty</code>、<code>plus</code>。按＋加 1、按−減 1，最少是 1，而且每個商品各自計算。',
    hint: '5 個 TODO：useState 放商品、changeQty、CartItem 多收 qty/onPlus/onMinus、畫面加按鈕、map 裡多傳三個 props。',
    steps: [`TODO 1：刪掉檔案最上面的 <code>const items = [...]</code>，在 App 的第一行加：${pre("const [items, setItems] = useState([\n  { id: 1, name: '牛奶', price: 50, qty: 1 },\n  { id: 2, name: '麵包', price: 30, qty: 1 },\n  { id: 3, name: '雞蛋', price: 80, qty: 1 },\n]);")}為什麼：商品會變，所以放進 state。`, `TODO 2：寫在 App 裡：${pre('function changeQty(id, delta) {\n  setItems(items.map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it)));\n}')}為什麼：只改對的那個商品，最小停在 1。`, `TODO 3：CartItem 的參數改成 <code>{ name, price, qty, onPlus, onMinus }</code>，li 裡加：${pre('<button data-testid="minus" onClick={onMinus}>−</button>\n<span data-testid="qty">{qty}</span>\n<button data-testid="plus" onClick={onPlus}>＋</button>')}為什麼：按鈕在這裡，按下去通知 App。`, `TODO 4：map 裡的 CartItem 多傳：${pre('qty={item.qty}\nonPlus={() => changeQty(item.id, 1)}\nonMinus={() => changeQty(item.id, -1)}')}為什麼：把資料和「按了要做什麼」交給 CartItem。最常犯的錯：忘了刪掉最上面的 <code>const items</code>（會跟 state 的 items 重複宣告），或把 <code>onClick={onPlus}</code> 寫成 <code>onClick={onPlus()}</code>（括號會讓它一開始就執行）。`],
    starter: S4, solution: SOL4, must: [{ re: /useState\(/, msg: '請用 useState 放商品' }], test: T4,
  }),
  GR(5, '算出合計（衍生資料）', [
    gstep(`<p><b>這一步要做什麼？</b>在清單下面顯示「合計 NT$ …」，等於每個商品 價格 × 數量 全部加起來。</p><p><b>為什麼不另外存一個 total state？</b>因為合計可以從 <code>items</code> 算出來，這叫<b>衍生資料</b>。如果再存一份，兩份容易對不上；每次畫面更新時重算一次最簡單，也永遠正確。</p>`,
      choice('合計可以從商品算出來，比較好的做法是？', ['每次畫面更新時直接算，不另存 state', '另外用 useState 存一份再手動更新', '寫死一個數字'], 0, '能算出來的，就不要再存一份。')),
    gstep(`<p>把一堆東西「加成一個數字」用 <code>reduce</code>：</p>${pre('const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);')}<ul><li><code>0</code>：一開始的總和是 0。</li><li><code>sum</code>：目前累積到的總和。</li><li><code>it</code>：這一輪看的商品。</li><li><code>sum + it.price * it.qty</code>：把這個商品的小計加進去，成為下一輪的 sum。</li></ul><p>例：牛奶 50×1、麵包 30×1、雞蛋 80×1 → 0+50+30+80 = 160。</p>`,
      choice('<code>reduce</code> 的最後一個參數 <code>0</code> 是？', ['總和的起始值', '陣列長度', '最大值'], 0, '從 0 開始往上加。')),
    gstep(`<p>算好之後，用大括號放進畫面：</p>${pre('<p data-testid="total">合計 NT$ {total}</p>')}<p><b>常見的坑：</b></p><ul><li><code>total</code> 要算在 <code>return</code> 的<b>前面</b>（函式裡、return 之前）。</li><li>忘了乘 <code>qty</code>，只加了價格。</li><li>忘了寫起始值 <code>0</code>，第一個商品會被當成 sum，答案會怪怪的。</li></ul><p><b>下一步預告：</b>第 6 步，加一個「移除」按鈕把商品拿掉。</p>`,
      choice('把每個商品的 價格×數量 加起來，要乘什麼？', ['it.price * it.qty', 'it.price + it.qty', 'it.price'], 0, '小計 = 單價 × 數量。')),
  ], {
    brief: '第 5 步：在清單下面加 <code>&lt;p data-testid="total"&gt;合計 NT$ …&lt;/p&gt;</code>，顯示所有商品「價格 × 數量」的總和；按＋／−之後也要跟著變。',
    hint: '<code>const total = items.reduce((sum, it) =&gt; sum + it.price * it.qty, 0);</code> 放在 return 前面。',
    steps: [`TODO 1：在 <code>return</code> 前面加：${pre('const total = items.reduce((sum, it) => sum + it.price * it.qty, 0);')}為什麼：從 items 算出合計，永遠和畫面一致。`, `TODO 2：在 <code>&lt;/ul&gt;</code> 下面加：${pre('<p data-testid="total">合計 NT$ {total}</p>')}為什麼：把算好的數字放到畫面。最常犯的錯：忘了乘 qty，按＋合計卻沒變。`],
    starter: S5, solution: SOL5, must: [], test: T5,
  }),
  GR(6, '移除商品', [
    gstep(`<p><b>這一步要做什麼？</b>每一列加一個「移除」按鈕，按了那個商品就消失，合計也跟著變。</p><p><b>為什麼？</b>真的購物車一定能刪東西。而且你會發現：因為合計是「算出來」的，刪掉商品後<b>不用另外更新合計</b>，它自己就對了。這就是上一步用衍生資料的好處。</p>`,
      choice('刪掉商品後，合計為什麼會自動正確？', ['因為合計每次都從 items 重新算', '因為 React 會猜', '因為 total 是 state'], 0, '合計是算出來的，items 變了它就跟著變。')),
    gstep(`<p>「刪掉某一個」用 <code>filter</code>：留下符合條件的，其他丟掉：</p>${pre('function removeItem(id) {\n  setItems(items.filter((it) => it.id !== id));\n}')}<ul><li><code>it.id !== id</code>：「這個商品的 id 不等於要刪的 id」。</li><li>不等於的留下，等於的（要刪的那個）被丟掉。</li><li>結果是一個新陣列，交給 <code>setItems</code>。</li></ul><p>像整理衣櫃：只留下不是舊衣服的。</p>`,
      choice('<code>items.filter((it) =&gt; it.id !== id)</code> 會得到？', ['沒有那個 id 的新陣列', '只剩那個 id 的陣列', '一個數字'], 0, '!== 是「不等於」，所以那一個被排除。')),
    gstep(`<p>和上一步一樣，按鈕在 CartItem、資料在 App，所以也用 props 傳：</p>${pre('// App 的 map 裡多傳：\nonRemove={() => removeItem(item.id)}\n\n// CartItem 多收 onRemove，並加按鈕：\n<button data-testid="remove" onClick={onRemove}>移除</button>')}<p><b>常見的坑：</b>把 <code>!==</code> 寫成 <code>===</code>，結果「只留下」要刪的那個，其他都消失了。</p><p><b>下一步預告：</b>第 7 步，商品全部刪光時，要顯示「購物車是空的」。</p>`,
      choice('想刪掉 id 是 2 的商品，filter 的條件是？', ['it.id !== 2', 'it.id === 2', 'it.id > 2'], 0, '留下「不是 2」的。')),
  ], {
    brief: '第 6 步：每一列加一個 <code>&lt;button data-testid="remove"&gt;移除&lt;/button&gt;</code>，按了就把那個商品拿掉，合計跟著更新。',
    hint: '4 個 TODO：寫 removeItem（filter）、map 多傳 onRemove、CartItem 收 onRemove、加按鈕。',
    steps: [`TODO 1：在 App 裡加：${pre('function removeItem(id) {\n  setItems(items.filter((it) => it.id !== id));\n}')}為什麼：留下 id 不同的，也就是把指定的刪掉。`, `TODO 2：map 裡的 CartItem 多傳：${pre('onRemove={() => removeItem(item.id)}')}為什麼：把「按了要做什麼」交給 CartItem。`, `TODO 3：CartItem 的參數多收 <code>onRemove</code>。為什麼：不收就拿不到。`, `TODO 4：CartItem 的 li 裡加：${pre('<button data-testid="remove" onClick={onRemove}>移除</button>')}為什麼：這是使用者按的按鈕。最常犯的錯：filter 條件寫成 <code>===</code>，其他商品全被刪掉。`],
    starter: S6, solution: SOL6, must: [{ re: /\.filter\(/, msg: '請用 items.filter(...) 移除商品' }], test: T6,
  }),
  GR(7, '條件渲染：購物車是空的', [
    gstep(`<p><b>這一步要做什麼？</b>商品全刪光時，畫面不要一片空白，要顯示一句「購物車是空的」。</p><p><b>為什麼？</b>空白的畫面會讓使用者以為壞掉了。好的網頁會告訴使用者「現在是什麼狀態」。</p>`,
      choice('購物車空了，為什麼要顯示一句話？', ['讓使用者知道不是壞掉', '因為 React 規定', '為了讓程式變長'], 0, '清楚的狀態提示是好體驗。')),
    gstep(`<p>「如果…就顯示 A，不然顯示 B」叫<b>條件渲染</b>，在 JSX 用三元運算子：</p>${pre('{items.length === 0 ? (\n  <p data-testid="empty">購物車是空的</p>\n) : (\n  <ul> ...原本的清單... </ul>\n)}')}<ul><li><code>items.length === 0</code>：陣列長度是 0，也就是沒有商品。</li><li><code>? A : B</code>：條件為真給 A，否則給 B。像「如果下雨 ? 帶傘 : 戴帽子」。</li><li>外面要包大括號，因為它是 JavaScript。</li></ul>`,
      choice('<code>條件 ? A : B</code> 條件是真的時候會用？', ['A', 'B', '兩個都用'], 0, '? 後面是真的、: 後面是假的。')),
    gstep(`<p><b>常見的坑：</b></p><ul><li>三個等號 <code>===</code> 不要寫成一個 <code>=</code>（一個等號是「設定」，不是「比較」）。</li><li><code>?</code> 後面和 <code>:</code> 後面都要有東西，少一邊會報錯。</li><li>有商品時，「空的」那句話一定要消失。</li></ul><p><b>下一步預告：</b>最後一步，做一個輸入框，讓使用者自己新增商品。</p>`,
      choice('比較「是否等於 0」要用？', ['===', '=', '=>'], 0, '=== 是比較，= 是設定。')),
  ], {
    brief: '第 7 步：商品全部移除後，要顯示 <code>&lt;p data-testid="empty"&gt;購物車是空的&lt;/p&gt;</code>；還有商品時不能出現這句話。',
    hint: '用 <code>items.length === 0 ? (空的訊息) : (原本的 ul)</code>。',
    steps: [`找到 <code>&lt;ul&gt;...&lt;/ul&gt;</code>，把它整個換成：${pre('{items.length === 0 ? (\n  <p data-testid="empty">購物車是空的</p>\n) : (\n  <ul> ...原本 ul 裡的全部... </ul>\n)}')}為什麼：沒有商品顯示提示，有商品才畫清單。`, `確認括號有成對，原本的 <code>ul</code> 內容放進冒號後面。為什麼：括號少一個整個畫面會壞掉。最常犯的錯：<code>===</code> 寫成 <code>=</code>，或忘了外面那一層大括號 <code>{ }</code>。`],
    starter: S7, solution: SOL7, must: [{ re: /length/, msg: '請用 items.length 判斷是不是空的' }], test: T7,
  }),
  GR(8, '受控輸入框：新增商品', [
    gstep(`<p><b>這一步要做什麼？</b>加一個輸入框和「新增」按鈕。打商品名字、按新增，就多一個商品（價格先固定 50 元，數量 1）。</p><p><b>為什麼？</b>這是最後一塊拼圖：資料可以增加、減少、修改，購物車就完整了。之後你可以自己加「輸入價格」。</p>`,
      choice('新增商品要怎麼讓畫面更新？', ['用 setItems 放進新陣列', '直接 push 進 items', '重新整理網頁'], 0, '一樣要透過 setter。')),
    gstep(`<p>輸入框要和 state 綁在一起，叫<b>受控元件</b>：值來自 state，打字時再更新 state：</p>${pre("const [text, setText] = useState('');\n\n<input\n  data-testid=\"new-name\"\n  value={text}\n  onChange={(e) => setText(e.target.value)}\n/>")}<ul><li><code>value={text}</code>：輸入框顯示 state 的值。</li><li><code>onChange</code>：每次打字就觸發。</li><li><code>e.target.value</code>：輸入框現在的內容。</li></ul>只有 <code>value</code> 沒有 <code>onChange</code>，輸入框會打不了字。`,
      choice('受控輸入框需要哪兩個屬性？', ['value 和 onChange', 'class 和 id', 'href 和 src'], 0, 'value 顯示 state，onChange 更新 state。')),
    gstep(`<p>按新增的函式：</p>${pre("function addItem() {\n  const name = text.trim();\n  if (name === '') return;   // 空白就不加\n  setItems([...items, { id: Date.now(), name, price: 50, qty: 1 }]);\n  setText('');               // 清空輸入框\n}")}<ul><li><code>trim()</code>：去掉頭尾空白。</li><li><code>[...items, 新的]</code>：複製舊陣列，再接一個新的在後面（不要用 push）。</li><li><code>Date.now()</code>：當作不重複的 id。</li></ul><p><b>常見的坑：</b>忘了清空輸入框；忘了擋空白。</p><p>🎉 做完這步，你就從空白檔案完成了一個完整的 React 作品：<b>元件 → 清單 → props → state → 衍生資料 → 刪除 → 條件渲染 → 受控表單</b>。檢查會把前面所有功能一起重新驗一次。</p>`,
      choice('新增商品時，把新商品加進陣列的寫法是？', ['setItems([...items, 新商品])', 'items.push(新商品)', 'items = 新商品'], 0, '做一個新陣列再交給 setItems。')),
  ], {
    brief: '第 8 步（最後一步）：加受控輸入框 <code>new-name</code> 與按鈕 <code>add</code>；按新增就加一個商品（價格 50、數量 1），輸入框清空，輸入空白不加。前面的功能（清單、＋／−、合計、移除、空購物車）都要還能用。',
    hint: '4 個 TODO：text state、addItem、受控 input、新增按鈕。',
    steps: [`TODO 1：在 App 裡加：${pre("const [text, setText] = useState('');")}為什麼：輸入框的內容要放在 state。`, `TODO 2：加函式：${pre("function addItem() {\n  const name = text.trim();\n  if (name === '') return;\n  setItems([...items, { id: Date.now(), name, price: 50, qty: 1 }]);\n  setText('');\n}")}為什麼：擋空白、加商品、清空輸入框。`, `TODO 3：加輸入框：${pre('<input data-testid="new-name" value={text} onChange={(e) => setText(e.target.value)} />')}為什麼：受控元件，value 和 onChange 缺一不可。`, `TODO 4：加按鈕：${pre('<button data-testid="add" onClick={addItem}>新增</button>')}為什麼：按了才新增。最常犯的錯：用 <code>items.push(...)</code> 直接改陣列，畫面不會更新。`],
    starter: S8, solution: SOL8, must: [{ re: /value=\{/, msg: '輸入框要受控：value={text}' }, { re: /onChange/, msg: '輸入框要有 onChange' }], test: T8,
  }),
];

const QUIZ = [
  choice('做一個大專案，最適合的做法是？', ['從最小的一塊開始，一步一步加功能並檢查', '一次全部寫完再測', '先寫最難的部分'], 0),
  choice('用 map 畫清單時，每一列的 key 要？', ['用不會重複的值，例如 id', '都用同一個值', '不需要'], 0),
  choice('合計可以從商品算出來，比較好的做法是？', ['每次直接算，不另外存 state', '另外存一份 state 再手動同步', '寫死數字'], 0),
  choice('想刪掉陣列裡 id 為 2 的商品，要用？', ['setItems(items.filter((it) => it.id !== 2))', 'items.pop()', 'items = []'], 0),
];

const EVENT = { npc: 'pm', mood: 'happy', text: '客戶想要一個「購物車」小功能：能看商品、加減數量、算合計、移除、也能新增。你一個人從頭做得完嗎？',
  options: [{ label: '可以，我先蓋標題，再一步一步加清單、數量、合計，每步都檢查', fx: { quality: 10, team: 6 } }, { label: '我先把所有功能一次寫完再來測', fx: { quality: -6, stress: 8 } }] };

export const GUIDED = { chapter: { id: 'rc-cg', title: '第三章　手把手專案：購物車（從空白做到完成）', lessons: UNITS, quiz: QUIZ, projects: [], event: 'rc-cg' }, event: EVENT };
