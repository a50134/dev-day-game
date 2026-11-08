// 四家公司的資料：頁面（前端）、後端題、設計稿評論、突發事件、假 API。
// 每家公司有三個前端頁面（levels / levels-gen.js）和三個後端題（Node.js，真的會執行並檢查）。
// 職位：前端 → 只做頁面；後端 → 只做 API；全端 → 先寫後端、再把畫面接上去。
import { PAGES, REVIEWS, EVENTS } from './scenes.js';
import { LEVELS } from './levels.js';
import { FIXTURES } from './fixtures.js';
import { listLevel, pickLevel, formLevel } from './levels-gen.js';

const be = (o) => ({ kind: 'code', lang: 'js', ...o });
const back = (id, title, ticket, hint, ex) => ({ id, title, kind: 'api', ticket, hint, ex });

/* ===================== 搶票通 TixRush ===================== */
const TICKET_BACK = [
  back('ticket-b1', '活動列表 API', '【TIX-201】首頁要的活動資料。寫 <code>listEvents(events, maxPrice)</code>：只留價格 ≤ maxPrice 的活動，依價格<b>由低到高</b>排序，回傳新陣列（不要改動原本的）。',
    '<code>filter</code> 留下符合條件的（會產生新陣列），<code>sort((a, b) => a.price - b.price)</code> 由低到高排。',
    be({
      brief: '寫 <code>listEvents(events, maxPrice)</code>：留下 price ≤ maxPrice 的活動，依價格由低到高排序，回傳新陣列。',
      hint: '<code>return events.filter(...).sort(...)</code>。',
      demo: `<p>範例：咖啡菜單，留下 ≤ 100 元的，由便宜排到貴。</p><pre>function cheap(menu, max) {
  return menu.filter((m) => m.price <= max)   // 留下夠便宜的（得到新陣列）
             .sort((a, b) => a.price - b.price); // a.price - b.price：小的排前面
}</pre>`,
      steps: ['先用 <code>events.filter((e) =&gt; e.price &lt;= maxPrice)</code> 留下符合的。<br>為什麼：filter 只留條件成立的，而且會做出新陣列，不會動到原本的。', '再接 <code>.sort((a, b) =&gt; a.price - b.price)</code>。<br>為什麼：a、b 是兩兩比較的活動，相減為負就排前面，所以是由低到高。', '前面加 <code>return</code>，把結果交出去。<br>為什麼：沒 return，呼叫的人只會拿到 undefined。'],
      starter: 'function listEvents(events, maxPrice) {\n  // TODO: 留下 price <= maxPrice，依價格由低到高，回傳新陣列\n  return events;\n}\n',
      solution: 'function listEvents(events, maxPrice) {\n  return events.filter((e) => e.price <= maxPrice).sort((a, b) => a.price - b.price);\n}\n',
      tests: "const evs = [{ id: 1, title: 'A', price: 3800 }, { id: 2, title: 'B', price: 1800 }, { id: 3, title: 'C', price: 2800 }];\ncheck(typeof listEvents === 'function', '要有 listEvents 函式');\nif (typeof listEvents === 'function') {\n  const r = listEvents(evs, 3000);\n  check(Array.isArray(r) && r.length === 2, '價格 3000 以下應該有 2 筆');\n  check(r[0] && r[1] && r[0].id === 2 && r[1].id === 3, '要依價格由低到高排序（B 在 C 前面）');\n  check(evs.length === 3 && evs[0].id === 1, '不要改動原本的 events 陣列');\n}",
    })),
  back('ticket-b2', '搶座位 API（不能重複訂位）', '【TIX-202】開賣瞬間很多人搶同一個座位。寫 <code>reserve(seats, id)</code>：座位不存在回 <code>{ ok: false, error: \'座位不存在\' }</code>；已被選走回 <code>{ ok: false, error: \'座位已被選走\' }</code>；可以訂就把它標成 sold 並回 <code>{ ok: true }</code>。',
    '先 <code>find</code> 找座位，不存在就先回錯誤；已 sold 回錯誤；最後才改 <code>seat.sold = true</code>。順序很重要：先檢查、再修改。',
    be({
      brief: '寫 <code>reserve(seats, id)</code>：找不到回 <code>{ ok: false, error: \'座位不存在\' }</code>；已被選走回 <code>{ ok: false, error: \'座位已被選走\' }</code>；否則把 sold 改成 true，回 <code>{ ok: true }</code>。',
      hint: '先檢查（不存在、已售），都沒問題才改 sold。同一個座位訂第二次，要失敗。',
      demo: `<p>範例：包廂只能一組客人訂。</p><pre>function book(rooms, id) {
  const r = rooms.find((x) => x.id === id);      // 找房間
  if (!r) return { ok: false, error: '沒這間' };   // 先擋掉不存在
  if (r.taken) return { ok: false, error: '被訂走了' }; // 再擋掉已被訂
  r.taken = true;                                 // 都沒問題才訂
  return { ok: true };
}</pre>`,
      steps: ['用 <code>seats.find((s) =&gt; s.id === id)</code> 找出座位，存進 seat。<br>為什麼：要先知道座位在不在。', '<code>if (!seat) return { ok: false, error: \'座位不存在\' };</code> 然後 <code>if (seat.sold) return { ok: false, error: \'座位已被選走\' };</code><br>為什麼：先把不行的情況擋掉，這就是「防止重複訂位」。', '最後 <code>seat.sold = true;</code> 並 <code>return { ok: true };</code><br>為什麼：確認沒問題才修改，第二個人再來就會被擋。'],
      starter: "function reserve(seats, id) {\n  // TODO: 找座位 → 不存在/已售就回錯誤 → 否則標成 sold，回 { ok: true }\n}\n",
      solution: "function reserve(seats, id) {\n  const seat = seats.find((s) => s.id === id);\n  if (!seat) return { ok: false, error: '座位不存在' };\n  if (seat.sold) return { ok: false, error: '座位已被選走' };\n  seat.sold = true;\n  return { ok: true };\n}\n",
      tests: "const seats = [{ id: 'A1', sold: false }, { id: 'A2', sold: true }];\ncheck(typeof reserve === 'function', '要有 reserve 函式');\nif (typeof reserve === 'function') {\n  const r1 = reserve(seats, 'A1');\n  check(r1 && r1.ok === true && seats[0].sold === true, '空位 A1 應訂成功，sold 變 true');\n  const r2 = reserve(seats, 'A1');\n  check(r2 && r2.ok === false && r2.error === '座位已被選走', '同一個座位訂第二次要回 { ok: false, error: \\'座位已被選走\\' }');\n  const r3 = reserve(seats, 'A2');\n  check(r3 && r3.ok === false && r3.error === '座位已被選走', '本來就售出的 A2 不能訂');\n  const r4 = reserve(seats, 'Z9');\n  check(r4 && r4.ok === false && r4.error === '座位不存在', '不存在的座位要回 { ok: false, error: \\'座位不存在\\' }');\n}",
    })),
  back('ticket-b3', '結帳 API', '【TIX-203】寫 <code>checkout(count, price, email)</code>：數量 ≤ 0 回 <code>{ ok: false, error: \'數量要大於 0\' }</code>；Email 沒有 @ 回 <code>{ ok: false, error: \'Email 格式錯誤\' }</code>；成功回 <code>{ ok: true, total: 數量 × 單價 }</code>。',
    '前端驗證可以被繞過，所以<b>後端一定要再驗證一次</b>。先驗數量、再驗 Email，最後才算總額。',
    be({
      brief: '寫 <code>checkout(count, price, email)</code>：數量 ≤ 0 回 <code>{ ok: false, error: \'數量要大於 0\' }</code>；email 沒有 @ 回 <code>{ ok: false, error: \'Email 格式錯誤\' }</code>；成功回 <code>{ ok: true, total }</code>（total = count × price）。',
      hint: '先驗證、再計算。驗證失敗用 <code>return</code> 提早離開。',
      demo: `<p>範例：點餐，數量要 ≥ 1，成功就回總價。</p><pre>function order(n, price) {
  if (n <= 0) return { ok: false, error: '至少 1 份' }; // 不合格：提早離開
  return { ok: true, total: n * price };               // 合格才計算
}</pre>`,
      steps: ['<code>if (count &lt;= 0) return { ok: false, error: \'數量要大於 0\' };</code><br>為什麼：不合理的資料要在最前面擋掉。', '<code>if (!email.includes(\'@\')) return { ok: false, error: \'Email 格式錯誤\' };</code><br>為什麼：前端的檢查可以被繞過，後端一定要再檢查。', '<code>return { ok: true, total: count * price };</code><br>為什麼：通過所有檢查，才算總額交出去。'],
      starter: "function checkout(count, price, email) {\n  // TODO: 驗證數量、驗證 email，通過後回 { ok: true, total }\n}\n",
      solution: "function checkout(count, price, email) {\n  if (count <= 0) return { ok: false, error: '數量要大於 0' };\n  if (!email.includes('@')) return { ok: false, error: 'Email 格式錯誤' };\n  return { ok: true, total: count * price };\n}\n",
      tests: "check(typeof checkout === 'function', '要有 checkout 函式');\nif (typeof checkout === 'function') {\n  const a = checkout(2, 1800, 'a@b.co');\n  check(a && a.ok === true && a.total === 3600, 'checkout(2, 1800, \\'a@b.co\\') 應回 { ok: true, total: 3600 }');\n  const b = checkout(0, 1800, 'a@b.co');\n  check(b && b.ok === false && b.error === '數量要大於 0', '數量 0 要回 { ok: false, error: \\'數量要大於 0\\' }');\n  const c = checkout(2, 1800, 'abc');\n  check(c && c.ok === false && c.error === 'Email 格式錯誤', 'email 沒有 @ 要回 { ok: false, error: \\'Email 格式錯誤\\' }');\n}",
    })),
];

/* ===================== 購購購 ShopGo ===================== */
const SHOP_FIX = {
  '/api/products': [
    { id: 1, name: '輕量慢跑鞋', brand: 'RunLab', price: 2480 },
    { id: 2, name: '防潑水後背包', brand: 'Packly', price: 1680 },
    { id: 3, name: '保溫瓶 500ml', brand: 'Warmo', price: 680 },
  ],
  '/api/variants': [
    ['黑-S', false], ['黑-M', false], ['黑-L', true], ['白-S', false], ['白-M', true], ['白-L', false], ['灰-M', false], ['灰-L', false],
  ].map(([id, soldOut]) => ({ id, soldOut })),
  '/api/cart': { count: 2, price: 1680 },
};
const SHOP_FRONT = [
  listLevel({
    id: 'shop-list', title: '商品列表頁', api: '/api/products', shape: '[{ id, name, brand, price }]', h1: '熱銷商品',
    ticket: '【SHOP-101】首頁要顯示熱銷商品。每個商品一張卡片，要有商品名稱、品牌、價格，和一顆「加入購物車」按鈕（主色背景）。照右邊設計稿與規格做。',
    hint: 'JSX：useEffect + fetch 取資料存進 state，items.map 畫卡片。CSS：照規格頁寫 .card 與 .book。QA 靠 data-testid 找元素，別漏掉。',
    cardName: '商品卡片', cardId: 'product-card', btnName: '加入購物車按鈕', btnId: 'add-btn', btn: '加入購物車', titleKey: 'name', numKey: 'price',
    subJsx: '{e.brand}', numJsx: 'NT$ {e.price}', subHint: '品牌', numHint: 'NT$ 價格',
  }, SHOP_FIX),
  pickLevel({
    id: 'shop-pick', title: '規格選擇頁', api: '/api/variants', h1: '選擇顏色與尺寸',
    ticket: '【SHOP-102】使用者要選規格（顏色-尺寸）。缺貨的不能點；點可選的會變主色並加入已選，再點一次取消；下方顯示已選數量。',
    hint: '「選了哪些規格」放進 state（picked 陣列）。state 不能直接 push，要給 setPicked 一個新陣列。按鈕加 aria-pressed 讓 CSS 知道哪個被選。',
    gridName: '規格網格', optName: '規格按鈕', optId: 'variant', offKey: 'soldOut', offWord: '缺貨', unit: '件',
  }, SHOP_FIX),
  formLevel({
    id: 'shop-checkout', title: '結帳頁', api: '/api/cart', shape: '{ count, price }', h1: '結帳', btn: '送出訂單', success: '訂單成立！',
    ticket: '【SHOP-103】結帳頁顯示總額（數量 × 單價）。表單要有收件人和手機：收件人不可空白、手機要是 09 開頭共 10 碼；錯誤時顯示訊息，成功後顯示「訂單成立！」。',
    hint: 'controlled input（value + onChange），送出時 e.preventDefault()，依序驗證，錯誤放 state 顯示。手機可用 /^09\\d{8}$/.test(...)。',
    totalText: '總額 NT$ 數字', totalJsx: '總額 NT$ {info.count * info.price}', expect: '3360',
    fields: [
      { id: 'name', label: '收件人', bad: '!form.name.trim()', msg: '請輸入收件人', ok: '小明' },
      { id: 'phone', label: '手機', bad: '!/^09\\d{8}$/.test(form.phone)', msg: '手機格式錯誤', ok: '0912345678', badVal: '123' },
    ].map((f) => ({ badVal: '', ...f })),
  }, SHOP_FIX),
];
const SHOP_BACK = [
  back('shop-b1', '搜尋商品 API', '【SHOP-201】寫 <code>searchProducts(products, keyword)</code>：只回<b>有庫存</b>（inStock 為 true）且名稱含關鍵字（不分大小寫）的商品，依價格由低到高。',
    '<code>filter</code> 同時檢查庫存和名稱；名稱用 <code>toLowerCase().includes(...)</code> 比對，兩邊都轉小寫就不分大小寫。',
    be({
      brief: '寫 <code>searchProducts(products, keyword)</code>：留下 inStock 為 true 且 name 含 keyword（不分大小寫）的商品，依 price 由低到高排序。',
      hint: '<code>p.inStock &amp;&amp; p.name.toLowerCase().includes(keyword.toLowerCase())</code>，再 sort。',
      demo: `<p>範例：書店搜尋，只留有書的、書名含關鍵字的。</p><pre>function find(books, kw) {
  return books
    .filter((b) => b.have && b.title.toLowerCase().includes(kw.toLowerCase())) // 兩個條件都要成立
    .sort((a, b) => a.price - b.price);                                       // 便宜的在前
}</pre>`,
      steps: ['<code>filter((p) =&gt; p.inStock &amp;&amp; …)</code> 先擋掉沒庫存的。<br>為什麼：缺貨的商品不能賣，也不該出現在搜尋結果。', '名稱比對：<code>p.name.toLowerCase().includes(keyword.toLowerCase())</code>。<br>為什麼：兩邊都轉小寫，使用者打 NIKE 或 nike 都找得到。', '最後 <code>.sort((a, b) =&gt; a.price - b.price)</code> 並 return。'],
      starter: 'function searchProducts(products, keyword) {\n  // TODO: 有庫存 + 名稱含關鍵字（不分大小寫），價格由低到高\n  return products;\n}\n',
      solution: 'function searchProducts(products, keyword) {\n  return products\n    .filter((p) => p.inStock && p.name.toLowerCase().includes(keyword.toLowerCase()))\n    .sort((a, b) => a.price - b.price);\n}\n',
      tests: "const ps = [{ id: 1, name: 'Run Shoes', price: 2480, inStock: true }, { id: 2, name: 'run bag', price: 800, inStock: true }, { id: 3, name: 'Run Cap', price: 300, inStock: false }, { id: 4, name: 'Water Bottle', price: 500, inStock: true }];\ncheck(typeof searchProducts === 'function', '要有 searchProducts 函式');\nif (typeof searchProducts === 'function') {\n  const r = searchProducts(ps, 'RUN');\n  check(Array.isArray(r) && r.length === 2, '搜尋 RUN 應該只有 2 筆（缺貨的不算、名稱不分大小寫）');\n  check(r[0] && r[0].id === 2 && r[1] && r[1].id === 1, '要依價格由低到高排序');\n}",
    })),
  back('shop-b2', '加入購物車 API（庫存檢查）', '【SHOP-202】寫 <code>addToCart(cart, product, qty)</code>：qty ≤ 0 回 <code>{ ok:false, error:\'數量要大於 0\' }</code>；購物車內已有的數量 + qty 超過 product.stock 回 <code>{ ok:false, error:\'庫存不足\' }</code>；否則加進購物車（同商品要合併數量）並回 <code>{ ok:true, cart }</code>。',
    '購物車是陣列 <code>[{ id, qty }]</code>。先找同商品那一行（<code>find</code>），算「已有數量 + 這次」有沒有超過庫存，沒問題才改。',
    be({
      brief: '寫 <code>addToCart(cart, product, qty)</code>：qty ≤ 0 → <code>{ ok:false, error:\'數量要大於 0\' }</code>；已有 + qty 超過 product.stock → <code>{ ok:false, error:\'庫存不足\' }</code>；否則加入（同商品合併 qty），回 <code>{ ok:true, cart }</code>。',
      hint: '失敗時不要改動 cart。同商品：有就 <code>line.qty += qty</code>，沒有就 <code>cart.push({ id, qty })</code>。',
      demo: `<p>範例：借書，同一本書最多借 3 本，已借的要算進去。</p><pre>function borrow(list, book, n) {
  const line = list.find((l) => l.id === book.id);   // 同一本書有沒有借過
  const have = line ? line.qty : 0;                   // 已借幾本
  if (have + n > book.max) return { ok: false };      // 超過上限：不改任何東西
  if (line) line.qty += n; else list.push({ id: book.id, qty: n }); // 合併或新增
  return { ok: true };
}</pre>`,
      steps: ['先 <code>const line = cart.find((l) =&gt; l.id === product.id);</code> 和 <code>const have = line ? line.qty : 0;</code><br>為什麼：庫存要看「已經放進購物車的 + 這次」，所以要先知道已有幾個。', '<code>if (qty &lt;= 0) return …</code>、<code>if (have + qty &gt; product.stock) return …</code><br>為什麼：失敗要在修改之前就回傳，購物車才不會被弄髒。', '<code>if (line) line.qty += qty; else cart.push({ id: product.id, qty });</code> 然後 <code>return { ok: true, cart };</code>'],
      starter: "function addToCart(cart, product, qty) {\n  // TODO: 檢查數量與庫存 → 合併或新增 → 回 { ok: true, cart }\n}\n",
      solution: "function addToCart(cart, product, qty) {\n  const line = cart.find((l) => l.id === product.id);\n  const have = line ? line.qty : 0;\n  if (qty <= 0) return { ok: false, error: '數量要大於 0' };\n  if (have + qty > product.stock) return { ok: false, error: '庫存不足' };\n  if (line) line.qty += qty; else cart.push({ id: product.id, qty });\n  return { ok: true, cart };\n}\n",
      tests: "const p = { id: 1, stock: 3 }; const cart = [];\ncheck(typeof addToCart === 'function', '要有 addToCart 函式');\nif (typeof addToCart === 'function') {\n  const a = addToCart(cart, p, 2);\n  check(a && a.ok === true && cart.length === 1 && cart[0].qty === 2, '加 2 個應成功，購物車有一行 qty 2');\n  const b = addToCart(cart, p, 2);\n  check(b && b.ok === false && b.error === '庫存不足', '已有 2、再加 2 超過庫存 3，要回 { ok:false, error:\\'庫存不足\\' }');\n  check(cart[0].qty === 2, '失敗時購物車不能被改動（qty 應還是 2）');\n  const c = addToCart(cart, p, 1);\n  check(c && c.ok === true && cart.length === 1 && cart[0].qty === 3, '再加 1 個要合併成同一行 qty 3');\n  const d = addToCart(cart, p, 0);\n  check(d && d.ok === false && d.error === '數量要大於 0', '數量 0 要回 { ok:false, error:\\'數量要大於 0\\' }');\n}",
    })),
  back('shop-b3', '訂單金額 API', '【SHOP-203】寫 <code>orderTotal(items, coupon)</code>：商品小計 = 每項 價格×數量 加總；優惠碼 <code>SAVE100</code> 折 100（最低 0）；折完 ≥ 1000 免運費，否則運費 60。回傳 <code>{ subtotal, shipping, total }</code>。',
    '<code>reduce</code> 加總；折扣用 <code>Math.max(0, …)</code> 避免變負數；運費是「折完之後」的金額判斷。',
    be({
      brief: '寫 <code>orderTotal(items, coupon)</code>：subtotal = 價格×數量加總，coupon 為 <code>\'SAVE100\'</code> 時扣 100（不低於 0）；折完 ≥ 1000 運費 0，否則 60。回傳 <code>{ subtotal, shipping, total }</code>（total = subtotal + shipping）。',
      hint: '<code>items.reduce((sum, i) =&gt; sum + i.price * i.qty, 0)</code> 算小計。',
      demo: `<p>範例：點餐加總，滿 500 免外送費。</p><pre>function bill(items) {
  const sum = items.reduce((s, i) => s + i.price * i.n, 0); // 每項 價格×數量 加起來
  const ship = sum >= 500 ? 0 : 40;                          // 滿額免運
  return { sum, ship, total: sum + ship };
}</pre>`,
      steps: ['<code>let subtotal = items.reduce((s, i) =&gt; s + i.price * i.qty, 0);</code><br>為什麼：reduce 把一排東西「累加」成一個數字。', '<code>if (coupon === \'SAVE100\') subtotal = Math.max(0, subtotal - 100);</code><br>為什麼：折扣不能把金額扣成負的。', '<code>const shipping = subtotal &gt;= 1000 ? 0 : 60;</code> 然後 <code>return { subtotal, shipping, total: subtotal + shipping };</code>'],
      starter: "function orderTotal(items, coupon) {\n  // TODO: 小計 → 優惠碼 → 運費 → 回 { subtotal, shipping, total }\n}\n",
      solution: "function orderTotal(items, coupon) {\n  let subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);\n  if (coupon === 'SAVE100') subtotal = Math.max(0, subtotal - 100);\n  const shipping = subtotal >= 1000 ? 0 : 60;\n  return { subtotal, shipping, total: subtotal + shipping };\n}\n",
      tests: "check(typeof orderTotal === 'function', '要有 orderTotal 函式');\nif (typeof orderTotal === 'function') {\n  const a = orderTotal([{ price: 500, qty: 2 }, { price: 300, qty: 1 }]);\n  check(a && a.subtotal === 1300 && a.shipping === 0 && a.total === 1300, '1300 元免運：應回 { subtotal: 1300, shipping: 0, total: 1300 }');\n  const b = orderTotal([{ price: 500, qty: 2 }, { price: 300, qty: 1 }], 'SAVE100');\n  check(b && b.subtotal === 1200 && b.total === 1200, '用 SAVE100 折 100 後 subtotal 應為 1200');\n  const c = orderTotal([{ price: 200, qty: 2 }]);\n  check(c && c.shipping === 60 && c.total === 460, '400 元不到 1000，運費 60，總額 460');\n  const d = orderTotal([{ price: 50, qty: 1 }], 'SAVE100');\n  check(d && d.subtotal === 0 && d.total === 60, '折扣不能把金額扣成負數（subtotal 最低 0）');\n}",
    })),
];

/* ===================== 穩穩 SteadyPay ===================== */
const BANK_FIX = {
  '/api/transactions': [
    { id: 1, title: '薪資入帳', date: '2026-10-05', amount: 52000 },
    { id: 2, title: '房租', date: '2026-10-06', amount: -18000 },
    { id: 3, title: '咖啡', date: '2026-10-07', amount: -85 },
  ],
  '/api/bills': [['電費', false], ['水費', true], ['瓦斯', false], ['網路', false], ['手機', true], ['管理費', false]].map(([id, paid]) => ({ id, paid })),
  '/api/account': { balance: 12000 },
};
const BANK_FRONT = [
  listLevel({
    id: 'bank-list', title: '交易紀錄頁', api: '/api/transactions', shape: '[{ id, title, date, amount }]', h1: '近期交易',
    ticket: '【PAY-101】首頁要顯示近期交易。每筆交易一張卡片，要有名稱、日期、金額，和一顆「查看明細」按鈕（主色背景）。照右邊設計稿與規格做。',
    hint: 'JSX：useEffect + fetch 取資料存進 state，items.map 畫卡片。CSS：照規格頁寫 .card 與 .book。金額可能是負數（支出），直接顯示就好。',
    cardName: '交易卡片', cardId: 'tx-card', btnName: '明細按鈕', btnId: 'detail-btn', btn: '查看明細', titleKey: 'title', numKey: 'amount',
    subJsx: '{e.date}', numJsx: 'NT$ {e.amount}', subHint: '日期', numHint: 'NT$ 金額',
  }, BANK_FIX),
  pickLevel({
    id: 'bank-pick', title: '繳費選擇頁', api: '/api/bills', h1: '選擇要繳的帳單',
    ticket: '【PAY-102】使用者要勾選要繳的帳單。已繳過的不能點；點可選的會變主色並加入已選，再點一次取消；下方顯示已選筆數。',
    hint: '「選了哪些帳單」放進 state（picked 陣列）。state 不能直接 push，要給 setPicked 一個新陣列。按鈕加 aria-pressed 讓 CSS 知道哪個被選。',
    gridName: '帳單網格', optName: '帳單按鈕', optId: 'bill', offKey: 'paid', offWord: '已繳', unit: '筆',
  }, BANK_FIX),
  formLevel({
    id: 'bank-transfer', title: '轉帳頁', api: '/api/account', shape: '{ balance }', h1: '轉帳', btn: '確認轉帳', success: '轉帳成功！',
    ticket: '【PAY-103】轉帳頁顯示可用餘額。表單要有轉入帳號和金額：帳號不可空白；金額要大於 0 且不能超過餘額；錯誤時顯示訊息，成功後顯示「轉帳成功！」。',
    hint: 'controlled input（value + onChange），送出時 e.preventDefault()，依序驗證。輸入框的值是文字，比大小前先用 Number(...) 轉成數字。',
    totalText: '可用餘額 NT$ 數字', totalJsx: '可用餘額 NT$ {info.balance}', expect: '12000',
    fields: [
      { id: 'account', label: '轉入帳號', bad: '!form.account.trim()', msg: '請輸入轉入帳號', ok: '123456', badVal: '' },
      { id: 'amount', label: '轉帳金額', bad: 'Number(form.amount) <= 0 || Number(form.amount) > info.balance', msg: '金額必須大於 0 且不能超過餘額', ok: '500', badVal: '999999' },
    ],
  }, BANK_FIX),
];
const BANK_BACK = [
  back('bank-b1', '交易紀錄 API', '【PAY-201】寫 <code>listTransactions(txs, type)</code>：type 是 <code>\'in\'</code> 只留收入（amount &gt; 0）、<code>\'out\'</code> 只留支出（amount &lt; 0）、其他（沒給）全部；日期<b>新的在前</b>（date 是 \'2026-10-05\' 這種文字，可直接比大小）。',
    '<code>filter</code> 依 type 篩選；日期文字可以用 <code>b.date.localeCompare(a.date)</code> 排成新→舊。',
    be({
      brief: '寫 <code>listTransactions(txs, type)</code>：type 為 \'in\' 留 amount &gt; 0、\'out\' 留 amount &lt; 0、其他全留；依 date 由新到舊排序，回傳新陣列。',
      hint: '<code>.filter((t) =&gt; type === \'in\' ? t.amount &gt; 0 : type === \'out\' ? t.amount &lt; 0 : true).sort((a, b) =&gt; b.date.localeCompare(a.date))</code>',
      demo: `<p>範例：日記，type 是 'happy' 只留開心的，新的排前面。</p><pre>function diary(list, type) {
  return list
    .filter((d) => type ? d.mood === type : true)       // 有指定才篩選，沒指定全留
    .sort((a, b) => b.date.localeCompare(a.date));      // b 比 a：新的（大的）排前面
}</pre>`,
      steps: ['先寫篩選：type 是 in 就 <code>t.amount &gt; 0</code>，是 out 就 <code>t.amount &lt; 0</code>，否則 <code>true</code>（全留）。<br>為什麼：收入是正數、支出是負數。', '再 <code>.sort((a, b) =&gt; b.date.localeCompare(a.date))</code>。<br>為什麼：b 和 a 對調就是「大的在前」＝新日期在前。', '整段前面加 return。'],
      starter: 'function listTransactions(txs, type) {\n  // TODO: 依 type 篩選，日期新的在前\n  return txs;\n}\n',
      solution: "function listTransactions(txs, type) {\n  return txs\n    .filter((t) => (type === 'in' ? t.amount > 0 : type === 'out' ? t.amount < 0 : true))\n    .sort((a, b) => b.date.localeCompare(a.date));\n}\n",
      tests: "const txs = [{ id: 1, date: '2026-10-05', amount: 52000 }, { id: 2, date: '2026-10-06', amount: -18000 }, { id: 3, date: '2026-10-07', amount: -85 }];\ncheck(typeof listTransactions === 'function', '要有 listTransactions 函式');\nif (typeof listTransactions === 'function') {\n  const all = listTransactions(txs);\n  check(all.length === 3 && all[0].id === 3 && all[2].id === 1, '沒給 type 要全部、日期新的在前（id 3, 2, 1）');\n  const out = listTransactions(txs, 'out');\n  check(out.length === 2 && out.every((t) => t.amount < 0), \"type 'out' 只留支出\");\n  const inn = listTransactions(txs, 'in');\n  check(inn.length === 1 && inn[0].id === 1, \"type 'in' 只留收入\");\n  check(txs[0].id === 1 && txs.length === 3, '不要改動原本的陣列');\n}",
    })),
  back('bank-b2', '轉帳 API（錢不能亂跑）', '【PAY-202】寫 <code>transfer(accounts, from, to, amount)</code>。accounts 長這樣：<code>{ A: { balance: 1000 }, B: { balance: 0 } }</code>。依序檢查並回 <code>{ ok:false, error }</code>：金額 ≤ 0 →「金額必須大於 0」；帳戶不存在 →「帳戶不存在」；轉給自己 →「不能轉給自己」；餘額不足 →「餘額不足」。成功就扣款、入帳，回 <code>{ ok:true }</code>。',
    '錢的事最怕「只扣不入」或「變負數」。<b>所有檢查都過了，才同時改兩個帳戶</b>。',
    be({
      brief: '寫 <code>transfer(accounts, from, to, amount)</code>：依序檢查「金額必須大於 0」、「帳戶不存在」、「不能轉給自己」、「餘額不足」，失敗回 <code>{ ok:false, error }</code>；全部通過才扣 from、加 to，回 <code>{ ok:true }</code>。',
      hint: '先全部檢查完，最後才寫 <code>accounts[from].balance -= amount; accounts[to].balance += amount;</code>。',
      demo: `<p>範例：點數轉贈，不能贈超過自己有的。</p><pre>function give(users, a, b, n) {
  if (n <= 0) return { ok: false, error: '至少 1 點' };
  if (users[a].pts < n) return { ok: false, error: '點數不足' };  // 先檢查完
  users[a].pts -= n;   // 才同時動兩邊
  users[b].pts += n;
  return { ok: true };
}</pre>`,
      steps: ['<code>if (amount &lt;= 0) return { ok: false, error: \'金額必須大於 0\' };</code><br>為什麼：負數金額可以「轉走別人的錢」，一定要擋。', '<code>if (!accounts[from] || !accounts[to]) …「帳戶不存在」</code>、<code>if (from === to) …「不能轉給自己」</code>、<code>if (accounts[from].balance &lt; amount) …「餘額不足」</code>', '全部通過，再 <code>accounts[from].balance -= amount; accounts[to].balance += amount;</code> 並 <code>return { ok: true };</code><br>為什麼：失敗時一毛錢都不能動。'],
      starter: "function transfer(accounts, from, to, amount) {\n  // TODO: 檢查（金額、帳戶、不能自己轉自己、餘額）→ 通過才扣款入帳\n}\n",
      solution: "function transfer(accounts, from, to, amount) {\n  if (amount <= 0) return { ok: false, error: '金額必須大於 0' };\n  if (!accounts[from] || !accounts[to]) return { ok: false, error: '帳戶不存在' };\n  if (from === to) return { ok: false, error: '不能轉給自己' };\n  if (accounts[from].balance < amount) return { ok: false, error: '餘額不足' };\n  accounts[from].balance -= amount;\n  accounts[to].balance += amount;\n  return { ok: true };\n}\n",
      tests: "const acc = { A: { balance: 1000 }, B: { balance: 0 } };\ncheck(typeof transfer === 'function', '要有 transfer 函式');\nif (typeof transfer === 'function') {\n  const a = transfer(acc, 'A', 'B', 300);\n  check(a && a.ok === true && acc.A.balance === 700 && acc.B.balance === 300, '轉 300：A 剩 700、B 有 300');\n  const b = transfer(acc, 'A', 'B', 5000);\n  check(b && b.ok === false && b.error === '餘額不足', '餘額不足要回 { ok:false, error:\\'餘額不足\\' }');\n  check(acc.A.balance === 700 && acc.B.balance === 300, '失敗時兩個帳戶的錢都不能動');\n  const c = transfer(acc, 'A', 'B', -100);\n  check(c && c.ok === false && c.error === '金額必須大於 0', '負數金額要回「金額必須大於 0」');\n  check(acc.A.balance === 700, '負數金額不能讓錢亂跑');\n  const d = transfer(acc, 'A', 'Z', 10);\n  check(d && d.ok === false && d.error === '帳戶不存在', '帳戶不存在要回「帳戶不存在」');\n  const e = transfer(acc, 'A', 'A', 10);\n  check(e && e.ok === false && e.error === '不能轉給自己', '轉給自己要回「不能轉給自己」');\n}",
    })),
  back('bank-b3', '月報表 API', '【PAY-203】寫 <code>monthlyStats(txs)</code>：回傳 <code>{ income, expense, net }</code>。income = 所有正數金額加總；expense = 所有負數金額<b>取絕對值</b>後加總；net = income − expense。',
    '用 <code>for…of</code> 或 <code>reduce</code> 走過每筆；負數用 <code>Math.abs(...)</code> 變正數。',
    be({
      brief: '寫 <code>monthlyStats(txs)</code>：回傳 <code>{ income, expense, net }</code>。income = 正數加總；expense = 負數的絕對值加總；net = income − expense。',
      hint: '先宣告 <code>let income = 0, expense = 0;</code>，用 for…of 走過每筆，正的加 income，負的加 <code>Math.abs(t.amount)</code> 到 expense。',
      demo: `<p>範例：零用錢，統計收到多少、花了多少。</p><pre>function pocket(list) {
  let got = 0, spent = 0;
  for (const x of list) {              // 一筆一筆看
    if (x > 0) got += x;               // 正數是收到
    else spent += Math.abs(x);         // 負數是花掉：取絕對值變成正數
  }
  return { got, spent, left: got - spent };
}</pre>`,
      steps: ['<code>let income = 0, expense = 0;</code>，再 <code>for (const t of txs) { … }</code><br>為什麼：兩個累加器，一筆一筆加上去。', '迴圈裡：<code>if (t.amount &gt; 0) income += t.amount; else expense += Math.abs(t.amount);</code><br>為什麼：支出存的是負數，報表要顯示正數，所以取絕對值。', '<code>return { income, expense, net: income - expense };</code>'],
      starter: 'function monthlyStats(txs) {\n  // TODO: 算 income、expense（取絕對值）、net\n}\n',
      solution: 'function monthlyStats(txs) {\n  let income = 0, expense = 0;\n  for (const t of txs) {\n    if (t.amount > 0) income += t.amount;\n    else expense += Math.abs(t.amount);\n  }\n  return { income, expense, net: income - expense };\n}\n',
      tests: "check(typeof monthlyStats === 'function', '要有 monthlyStats 函式');\nif (typeof monthlyStats === 'function') {\n  const r = monthlyStats([{ amount: 52000 }, { amount: -18000 }, { amount: -85 }]);\n  check(r && r.income === 52000, 'income 應為 52000');\n  check(r && r.expense === 18085, 'expense 應為 18085（負數取絕對值再加總）');\n  check(r && r.net === 33915, 'net 應為 33915（income − expense）');\n  const z = monthlyStats([]);\n  check(z && z.income === 0 && z.expense === 0 && z.net === 0, '沒有交易時三個數字都是 0');\n}",
    })),
];

/* ===================== 找找看 FindIt ===================== */
const SEARCH_FIX = {
  '/api/results': [
    { id: 1, title: 'React 官方文件', site: 'react.dev', views: 98000 },
    { id: 2, title: 'MDN Web Docs', site: 'developer.mozilla.org', views: 150000 },
    { id: 3, title: '前端面試題整理', site: 'blog.example.com', views: 32000 },
  ],
  '/api/filters': [['影片', false], ['圖片', false], ['新聞', true], ['購物', false], ['地圖', true], ['書籍', false]].map(([id, empty]) => ({ id, empty })),
  '/api/summary': { count: 128 },
};
const SEARCH_FRONT = [
  listLevel({
    id: 'search-list', title: '搜尋結果頁', api: '/api/results', shape: '[{ id, title, site, views }]', h1: '搜尋結果',
    ticket: '【FIND-101】結果頁要顯示搜尋結果。每筆結果一張卡片，要有標題、網站、瀏覽次數，和一顆「開啟」按鈕（主色背景）。照右邊設計稿與規格做。',
    hint: 'JSX：useEffect + fetch 取資料存進 state，items.map 畫卡片。CSS：照規格頁寫 .card 與 .book。QA 靠 data-testid 找元素，別漏掉。',
    cardName: '結果卡片', cardId: 'result-card', btnName: '開啟按鈕', btnId: 'open-btn', btn: '開啟', titleKey: 'title', numKey: 'views',
    subJsx: '{e.site}', numJsx: '{e.views} 次瀏覽', subHint: '網站', numHint: '瀏覽次數',
  }, SEARCH_FIX),
  pickLevel({
    id: 'search-pick', title: '篩選標籤頁', api: '/api/filters', h1: '選擇篩選條件',
    ticket: '【FIND-102】使用者要選篩選條件（影片、圖片…）。沒有結果的標籤不能點；點可選的會變主色並加入已選，再點一次取消；下方顯示已選個數。',
    hint: '「選了哪些標籤」放進 state（picked 陣列）。state 不能直接 push，要給 setPicked 一個新陣列。按鈕加 aria-pressed 讓 CSS 知道哪個被選。',
    gridName: '標籤網格', optName: '標籤按鈕', optId: 'filter', offKey: 'empty', offWord: '沒有結果', unit: '個篩選',
  }, SEARCH_FIX),
  formLevel({
    id: 'search-form', title: '進階搜尋頁', api: '/api/summary', shape: '{ count }', h1: '進階搜尋', btn: '開始搜尋', success: '已送出搜尋！',
    ticket: '【FIND-103】進階搜尋頁顯示目前索引的筆數。表單要有關鍵字和網站：關鍵字至少 2 個字；網站要包含「.」（像 react.dev）；錯誤時顯示訊息，成功後顯示「已送出搜尋！」。',
    hint: 'controlled input（value + onChange），送出時 e.preventDefault()，依序驗證。字數用 form.keyword.trim().length，網址用 form.site.includes(\'.\')。',
    totalText: '共找到 數字 筆結果', totalJsx: '共找到 {info.count} 筆結果', expect: '128',
    fields: [
      { id: 'keyword', label: '關鍵字', bad: 'form.keyword.trim().length < 2', msg: '請至少輸入 2 個字', ok: 'react', badVal: '' },
      { id: 'site', label: '網站', bad: "!form.site.includes('.')", msg: '網站格式錯誤（要有 .）', ok: 'react.dev', badVal: 'abc' },
    ],
  }, SEARCH_FIX),
];
const SEARCH_BACK = [
  back('search-b1', '搜尋排序 API', '【FIND-201】寫 <code>searchDocs(docs, q)</code>：docs 是 <code>[{ id, title, body }]</code>。回傳符合的 <b>id 陣列</b>（不分大小寫）；<b>標題有出現</b>的排前面，只有內文有出現的排後面；各組內維持原本順序；q 是空白就回 <code>[]</code>。',
    '做兩個 filter：標題符合的一組、「標題不符合但內文符合」的一組，再用 <code>[...a, ...b]</code> 接起來，最後 <code>map((d) =&gt; d.id)</code>。',
    be({
      brief: '寫 <code>searchDocs(docs, q)</code>：回傳符合的 id 陣列（不分大小寫）。標題符合的排前面、只有內文符合的排後面，各組維持原順序；q 空白（去掉前後空格後）回 <code>[]</code>。',
      hint: '先 <code>const k = q.trim().toLowerCase();</code>，空的就 return []。',
      demo: `<p>範例：食譜搜尋，菜名有的排前面，只有做法有的排後面。</p><pre>function find(list, q) {
  const k = q.trim().toLowerCase();
  if (!k) return [];                                                   // 沒打字：不找
  const a = list.filter((r) => r.name.toLowerCase().includes(k));        // 菜名符合
  const b = list.filter((r) => !r.name.toLowerCase().includes(k) && r.how.toLowerCase().includes(k)); // 只有做法符合
  return [...a, ...b].map((r) => r.id);                                // 接起來，只留 id
}</pre>`,
      steps: ['<code>const k = q.trim().toLowerCase(); if (!k) return [];</code><br>為什麼：全部轉小寫才不分大小寫；沒打字就不要回全部結果。', '<code>const inTitle = docs.filter(…標題含 k…)</code>；<code>const inBody = docs.filter(…標題不含 k 且內文含 k…)</code><br>為什麼：分成兩組，才能控制「標題優先」。', '<code>return [...inTitle, ...inBody].map((d) =&gt; d.id);</code>'],
      starter: 'function searchDocs(docs, q) {\n  // TODO: 標題符合的在前，只有內文符合的在後，回傳 id 陣列\n  return [];\n}\n',
      solution: "function searchDocs(docs, q) {\n  const k = q.trim().toLowerCase();\n  if (!k) return [];\n  const inTitle = docs.filter((d) => d.title.toLowerCase().includes(k));\n  const inBody = docs.filter((d) => !d.title.toLowerCase().includes(k) && d.body.toLowerCase().includes(k));\n  return [...inTitle, ...inBody].map((d) => d.id);\n}\n",
      tests: "const docs = [{ id: 1, title: 'CSS 入門', body: '學 React 之前先學這個' }, { id: 2, title: 'React 教學', body: '元件與 props' }, { id: 3, title: 'Vue 教學', body: '跟 react 很像' }, { id: 4, title: '資料庫', body: '無關' }];\ncheck(typeof searchDocs === 'function', '要有 searchDocs 函式');\nif (typeof searchDocs === 'function') {\n  const r = searchDocs(docs, ' REACT ');\n  check(JSON.stringify(r) === '[2,1,3]', '搜尋 react：標題有的 id 2 排第一，只有內文有的 id 1、3 依原順序排後面（應為 [2,1,3]），你的結果：' + JSON.stringify(r));\n  check(JSON.stringify(searchDocs(docs, '   ')) === '[]', 'q 是空白要回 []');\n  check(JSON.stringify(searchDocs(docs, '不存在的字')) === '[]', '找不到要回 []');\n}",
    })),
  back('search-b2', '分頁 API', '【FIND-202】結果太多要分頁。寫 <code>paginate(items, page, size)</code>：回傳 <code>{ items, page, totalPages, hasNext }</code>。page 從 1 開始；page 小於 1 或超過總頁數就當作第 1 頁。',
    '總頁數 <code>Math.ceil(items.length / size)</code>；這一頁是 <code>items.slice((page - 1) * size, page * size)</code>。',
    be({
      brief: '寫 <code>paginate(items, page, size)</code>：回傳 <code>{ items, page, totalPages, hasNext }</code>。page 從 1 開始，不合法（&lt; 1 或 &gt; totalPages）就當第 1 頁。hasNext 表示後面還有沒有下一頁。',
      hint: '先算 totalPages，再修正 page，再 slice。',
      demo: `<p>範例：每頁 3 張照片。</p><pre>function pageOf(list, p, n) {
  const total = Math.ceil(list.length / n);        // 總共幾頁（無條件進位）
  if (p < 1 || p > total) p = 1;                    // 頁數亂填就回第 1 頁
  const items = list.slice((p - 1) * n, p * n);     // 第 p 頁是第 (p-1)*n 筆到第 p*n 筆
  return { items, page: p, total };
}</pre>`,
      steps: ['<code>const totalPages = Math.ceil(items.length / size);</code><br>為什麼：7 筆、每頁 3 筆，要 3 頁（不是 2.33），所以無條件進位。', '<code>if (page &lt; 1 || page &gt; totalPages) page = 1;</code><br>為什麼：使用者可能手動改網址亂填頁數。', '<code>return { items: items.slice((page - 1) * size, page * size), page, totalPages, hasNext: page &lt; totalPages };</code>'],
      starter: 'function paginate(items, page, size) {\n  // TODO: 算 totalPages、修正 page、切出這一頁\n}\n',
      solution: 'function paginate(items, page, size) {\n  const totalPages = Math.ceil(items.length / size);\n  if (page < 1 || page > totalPages) page = 1;\n  return { items: items.slice((page - 1) * size, page * size), page, totalPages, hasNext: page < totalPages };\n}\n',
      tests: "const xs = [1, 2, 3, 4, 5, 6, 7];\ncheck(typeof paginate === 'function', '要有 paginate 函式');\nif (typeof paginate === 'function') {\n  const a = paginate(xs, 2, 3);\n  check(a && JSON.stringify(a.items) === '[4,5,6]' && a.page === 2 && a.totalPages === 3 && a.hasNext === true, '第 2 頁（每頁 3 筆）應為 items [4,5,6]、totalPages 3、hasNext true');\n  const b = paginate(xs, 3, 3);\n  check(b && JSON.stringify(b.items) === '[7]' && b.hasNext === false, '最後一頁 items [7]、hasNext false');\n  const c = paginate(xs, 99, 3);\n  check(c && c.page === 1 && JSON.stringify(c.items) === '[1,2,3]', 'page 超過總頁數要當作第 1 頁');\n  const d = paginate(xs, 0, 3);\n  check(d && d.page === 1, 'page 小於 1 要當作第 1 頁');\n}",
    })),
  back('search-b3', '快取 API（同樣的問題不要算兩次）', '【FIND-203】同一個關鍵字很多人搜，每次都重算很浪費。寫 <code>makeCache(fn)</code>：回傳一個新函式，用法跟 fn 一樣，但<b>同樣的參數只會真的呼叫 fn 一次</b>，之後直接回傳記住的結果。',
    '用 <code>Map</code> 當記事本：先 <code>cache.has(key)</code>，有就直接回傳 <code>cache.get(key)</code>；沒有才呼叫 fn，並用 <code>cache.set</code> 記下來。',
    be({
      brief: '寫 <code>makeCache(fn)</code>：回傳新函式，參數相同時只真的呼叫 fn 一次，之後回傳記住的結果。',
      hint: '<code>const cache = new Map();</code>，回傳 <code>(arg) =&gt; { … }</code>。',
      demo: `<p>範例：算很慢的平方，記住算過的。</p><pre>function memo(fn) {
  const saved = new Map();                 // 記事本
  return (x) => {
    if (saved.has(x)) return saved.get(x); // 記過了：直接給答案，不用再算
    const r = fn(x);                       // 沒記過：才真的算
    saved.set(x, r);                       // 記下來
    return r;
  };
}</pre>`,
      steps: ['<code>const cache = new Map();</code> 然後 <code>return (arg) =&gt; { … };</code><br>為什麼：Map 是記事本，外層函式結束後它還在，所以記得住。', '裡面先 <code>if (cache.has(arg)) return cache.get(arg);</code><br>為什麼：記過就不用再算，這就是「快取命中」。', '沒記過才 <code>const r = fn(arg); cache.set(arg, r); return r;</code>'],
      starter: 'function makeCache(fn) {\n  // TODO: 用 Map 記住算過的結果\n}\n',
      solution: 'function makeCache(fn) {\n  const cache = new Map();\n  return (arg) => {\n    if (cache.has(arg)) return cache.get(arg);\n    const r = fn(arg);\n    cache.set(arg, r);\n    return r;\n  };\n}\n',
      tests: "check(typeof makeCache === 'function', '要有 makeCache 函式');\nif (typeof makeCache === 'function') {\n  let n = 0;\n  const f = makeCache((q) => { n++; return q.toUpperCase(); });\n  check(typeof f === 'function', 'makeCache 要回傳一個函式');\n  if (typeof f === 'function') {\n    check(f('a') === 'A', 'f(\\'a\\') 應回 \\'A\\'');\n    f('a'); f('a');\n    check(n === 1, '同樣的參數 \\'a\\' 呼叫 3 次，fn 只能真的執行 1 次，目前執行了 ' + n + ' 次');\n    check(f('b') === 'B' && n === 2, '不同的參數 \\'b\\' 要真的算（fn 共執行 2 次）');\n  }\n}",
    })),
];

/* ===================== 彙整 ===================== */
const reviewsOf = (a, b) => [
  { who: 'designer', mood: 'happy', text: a[0], options: [{ label: a[1], fx: { team: 8, quality: 3 }, radius: 14 }, { label: a[2], fx: { quality: 5, team: -3 } }, { label: a[3], fx: { quality: 8, team: 3 } }] },
  { who: 'designer', mood: 'worried', text: b[0], options: [{ label: b[1], fx: { progress: 3, quality: -3, stress: -3 } }, { label: b[2], fx: { quality: 8, team: 2, stress: 5 } }] },
];
const ev = (who, mood, text, o1, fx1, o2, fx2) => ({ who, mood, text, options: [{ label: o1, fx: fx1 }, { label: o2, fx: fx2 }] });

const build = (c, front, back, fixtures) => ({ ...c, front, back, fixtures, levels: Object.fromEntries([...front, ...back].map((l) => [l.id, l])) });

export const DATA = {
  ticket: build({
    id: 'ticket', product: '訂票網站', pagesText: '訂票網站', mock: { head: '熱門活動', line: '星光巡迴演唱會 · NT$ 3800', btn: '立即購票' },
    pages: [...PAGES.map((p) => ({ ...p, side: 'front' })), ...TICKET_BACK.map((b) => ({ id: b.id, name: '⚙️ ' + b.title, side: 'back' }))],
    reviews: REVIEWS, events: EVENTS,
    backEvents: [
      ev('lead', 'surprised', '開賣瞬間兩個人同時搶同一個座位，系統兩個都說「成功」，客服快被打爆了！', '把「檢查座位 → 標成已售」緊緊放在一起，同一個座位只會成功一次', { quality: 10, stress: 8 }, '先回覆客服說是個案', { quality: -10, team: -5 }),
      ev('qa', 'worried', '有人把數量改成 -5 送出，後端居然回傳了負的總額……', '後端再驗證一次數量與 Email，不相信前端', { quality: 10, stress: 6 }, '請前端多擋一層就好', { quality: -8, team: -3 }),
    ],
  }, LEVELS, TICKET_BACK, FIXTURES),
  shop: build({
    id: 'shop', product: '電商網站', mock: { head: '熱銷商品', line: '輕量慢跑鞋 · NT$ 2480', btn: '加入購物車' },
    pages: [{ id: 'shop-list', name: '商品列表頁', side: 'front' }, { id: 'shop-pick', name: '規格選擇頁', side: 'front' }, { id: 'shop-checkout', name: '結帳頁', side: 'front' }, ...SHOP_BACK.map((b) => ({ id: b.id, name: '⚙️ ' + b.title, side: 'back' }))],
    reviews: reviewsOf(['商品卡片上的「加入購物車」想做得更醒目，你覺得呢？', '同意，圓角加大、顏色用主色', '先維持原樣，商品圖比較重要', '問她：缺貨時按鈕的樣子有沒有設計？'], ['結帳頁的錯誤提示我還沒畫……你先自己決定吧？', '好，我先做紅色文字，之後再對', '請她補畫錯誤狀態，再開工']),
    events: [
      ev('lead', 'surprised', '雙 11 開賣！商品頁載入變很慢，購物車一直轉圈圈！', '加骨架畫面與重試按鈕，緊急上線', { quality: 8, stress: 10 }, '先觀察，等後端擴容', { quality: -8, stress: 5, team: -3 }),
      ev('qa', 'worried', '一個商品只剩 1 件，兩個人同時結帳都成功了，變成超賣……', '結帳前再向後端確認庫存，並提示「庫存不足」', { quality: 10, stress: 8 }, '先回覆客服說是個案', { quality: -10, team: -5 }),
      ev('designer', 'happy', '上線前再改一下，加入購物車的按鈕換位置好嗎？拜託拜託～', '接受，加班改完', { team: 8, stress: 12, progress: -3 }, '協商：放下個 sprint', { team: -5, stress: -5 }),
      ev('pm', 'happy', '臨時插單！加一個優惠碼輸入框，今天要上喔～', '用最簡單的輸入框＋送出做完', { progress: 5, quality: -3, stress: 6 }, '評估後說明風險，排到明天', { quality: 5, team: -3, stress: -3 }),
    ],
    backEvents: [
      ev('qa', 'worried', '有人把購物車數量改成 99999 送出，後端居然讓它成立了……', '後端一定要檢查庫存，不相信前端送來的數字', { quality: 10, stress: 8 }, '前端加上最大數量就好', { quality: -8, team: -3 }),
      ev('pm', 'happy', '行銷說優惠碼活動要加「滿千免運」，今天可以嗎？', '把運費判斷寫在一個地方，改規則只改一行', { progress: 5, quality: 5, stress: 6 }, '到處複製貼上新規則', { progress: 3, quality: -8, stress: 8 }),
    ],
  }, SHOP_FRONT, SHOP_BACK, SHOP_FIX),
  bank: build({
    id: 'bank', product: '網路銀行', mock: { head: '近期交易', line: '薪資入帳 · NT$ 52000', btn: '查看明細' },
    pages: [{ id: 'bank-list', name: '交易紀錄頁', side: 'front' }, { id: 'bank-pick', name: '繳費選擇頁', side: 'front' }, { id: 'bank-transfer', name: '轉帳頁', side: 'front' }, ...BANK_BACK.map((b) => ({ id: b.id, name: '⚙️ ' + b.title, side: 'back' }))],
    reviews: reviewsOf(['金融產品要給人安心感，「查看明細」按鈕你覺得要多醒目？', '同意，用主色、圓角適中', '先維持原樣，避免看起來像廣告', '問她：有沒有 hover 和 disabled 狀態的設計？'], ['轉帳失敗的錯誤提示我還沒畫……你先自己決定吧？', '好，我先做紅色文字，之後再對', '請她補畫錯誤狀態，再開工']),
    events: [
      ev('lead', 'surprised', '發薪日！大家同時登入看餘額，交易紀錄頁一直轉圈圈！', '加骨架畫面與重試按鈕，緊急上線', { quality: 8, stress: 10 }, '先觀察，等後端擴容', { quality: -8, stress: 5, team: -3 }),
      ev('qa', 'worried', '有人在轉帳頁輸入 -100，畫面居然顯示「轉帳成功」……', '前後端都驗證金額必須大於 0 且不超過餘額', { quality: 10, stress: 8 }, '先回覆客服說是個案', { quality: -10, team: -5 }),
      ev('designer', 'happy', '上線前再改一下，主按鈕換位置好嗎？拜託拜託～', '接受，加班改完', { team: 8, stress: 12, progress: -3 }, '協商：放下個 sprint', { team: -5, stress: -5 }),
      ev('pm', 'happy', '稽核說轉帳完要顯示「交易編號」，今天要上喔～', '先在成功畫面加上編號，細節排下一版', { progress: 5, quality: -3, stress: 6 }, '評估後說明風險，排到明天', { quality: 5, team: -3, stress: -3 }),
    ],
    backEvents: [
      ev('qa', 'worried', '網路不穩時，同一筆轉帳被按了兩次，客人被扣了兩次錢！', '加上交易編號，同一編號只處理一次（冪等）', { quality: 10, stress: 8 }, '請客人不要連點', { quality: -8, team: -3 }),
      ev('lead', 'surprised', '稽核發現有一筆轉帳「扣了錢，對方卻沒收到」……', '所有檢查都過了才同時改兩邊的餘額，失敗一毛都不動', { quality: 10, stress: 6 }, '事後手動對帳補錢', { quality: -8, stress: 8, team: -3 }),
    ],
  }, BANK_FRONT, BANK_BACK, BANK_FIX),
  search: build({
    id: 'search', product: '搜尋網站', mock: { head: '搜尋結果', line: 'React 官方文件 · 98000 次瀏覽', btn: '開啟' },
    pages: [{ id: 'search-list', name: '搜尋結果頁', side: 'front' }, { id: 'search-pick', name: '篩選標籤頁', side: 'front' }, { id: 'search-form', name: '進階搜尋頁', side: 'front' }, ...SEARCH_BACK.map((b) => ({ id: b.id, name: '⚙️ ' + b.title, side: 'back' }))],
    reviews: reviewsOf(['搜尋結果的「開啟」按鈕想做得更明顯，你覺得呢？', '同意，圓角加大、顏色用主色', '先維持原樣，標題比較重要', '問她：已造訪連結的顏色有沒有設計？'], ['「找不到結果」的畫面我還沒畫……你先自己決定吧？', '好，我先放一行灰色文字，之後再對', '請她補畫空狀態，再開工']),
    events: [
      ev('lead', 'surprised', '某明星上了熱搜，大家同時搜尋同一個關鍵字，頁面變很慢！', '加骨架畫面與重試按鈕，緊急上線', { quality: 8, stress: 10 }, '先觀察，等後端擴容', { quality: -8, stress: 5, team: -3 }),
      ev('qa', 'worried', '搜尋「<script>」居然會讓頁面跑出奇怪的東西……', '輸入內容一律當成文字顯示，不當成 HTML', { quality: 10, stress: 8 }, '先回覆客服說是個案', { quality: -10, team: -5 }),
      ev('designer', 'happy', '上線前再改一下，搜尋框換位置好嗎？拜託拜託～', '接受，加班改完', { team: 8, stress: 12, progress: -3 }, '協商：放下個 sprint', { team: -5, stress: -5 }),
      ev('pm', 'happy', '臨時插單！加一個「熱門搜尋」排行，今天要上喔～', '用最簡單的清單做完', { progress: 5, quality: -3, stress: 6 }, '評估後說明風險，排到明天', { quality: 5, team: -3, stress: -3 }),
    ],
    backEvents: [
      ev('lead', 'surprised', '熱搜關鍵字每秒被搜幾千次，資料庫快撐不住了！', '加快取：同樣的關鍵字只算一次', { quality: 10, stress: 8 }, '直接把機器加大', { quality: -3, stress: 6, team: -2 }),
      ev('qa', 'worried', '有人把 page 改成 99999，頁面一片空白……', '分頁一律修正成合法頁數', { quality: 10, stress: 6 }, '請使用者不要亂改網址', { quality: -8, team: -3 }),
    ],
  }, SEARCH_FRONT, SEARCH_BACK, SEARCH_FIX),
};
