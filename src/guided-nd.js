// 手把手專案（Node.js 後端）：票務庫存小 API，從空白一路做到完成。8 個小單元，每個 = 3 個講解步驟 + 1 個總練習，
// 每個單元的起始程式 = 上一個單元的解答 + TODO。格式與 courses-api.js 的「城市天氣小站」相同。
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pre = (code) => `<pre>${code.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>`;
const k = (s) => `<code>${esc(s)}</code>`;
const choice = (q, options, answer, why) => ({ type: 'choice', q, options, answer, why });
const js = (o) => ({ kind: 'code', lang: 'js', ...o });
const gstep = (say, check) => ({ say, check });

const STAGES = ['空白檔案：一個函式加 console.log', '票放進陣列：讀取資料', '找票與賣票：有庫存檢查的函式', '第一支 API：GET /tickets 列表', '查單張票：GET /tickets/:id 與 404', '賣票：POST 與 400 驗證', '錯誤處理：try / catch 與 500', '收尾：統計用的 summary API'];
const progressMap = (n) => `<p><b>📍 專案進度：票務庫存小 API</b>（我們從一個空白檔案，一步一步做到完整的後端）</p><ol>${STAGES.map((t, i) => `<li>${i + 1 < n ? '✅' : i + 1 === n ? '👉 <b>' : '⬜'} ${t}${i + 1 === n ? '</b>' : ''}</li>`).join('')}</ol>`;
const GW = (n, title, steps, fin) => ({ id: 'ndw' + n, title: `手把手 ${n}／8　${title}`, steps: steps.map((s, i) => (i === 0 ? { ...s, say: progressMap(n) + s.say } : s)), final: js(fin) });

/* ---------- 各單元的程式碼（解答），起始程式 = 上一份解答 + TODO ---------- */
const C1 = `function ticketLabel(name, price) {
  return name + '：' + price + ' 元';
}

console.log(ticketLabel('星光演唱會', 3800));
`;
const C2 = `${C1}
const tickets = [
  { id: 1, name: '星光演唱會', price: 3800, stock: 5 },
  { id: 2, name: '交響樂之夜', price: 2400, stock: 0 },
  { id: 3, name: '露天音樂祭', price: 1800, stock: 10 },
];

console.log('共', tickets.length, '種票');
for (const t of tickets) {
  console.log(ticketLabel(t.name, t.price));
}
`;
const C3 = `${C2}
function findTicket(id) {
  return tickets.find((t) => t.id === id);
}

function sellTicket(id, qty) {
  const ticket = findTicket(id);
  if (!ticket) return { ok: false, error: '找不到票' };
  if (ticket.stock < qty) return { ok: false, error: '庫存不足' };
  ticket.stock = ticket.stock - qty;
  return { ok: true, ticket };
}

module.exports = { tickets, findTicket, sellTicket };
`;
const C4 = `${C3}
const express = require('express');
const app = express();

app.get('/tickets', (req, res) => {
  res.json(tickets);
});
`;
const C5 = `${C4}
app.get('/tickets/:id', (req, res) => {
  const ticket = findTicket(Number(req.params.id));
  if (!ticket) return res.status(404).json({ error: '找不到票' });
  res.json(ticket);
});
`;
const C6 = C5.replace("const app = express();\n", "const app = express();\napp.use(express.json());\n") + `
app.post('/tickets/:id/sell', (req, res) => {
  const { qty } = req.body;
  if (!Number.isInteger(qty) || qty < 1) {
    return res.status(400).json({ error: '數量要是大於 0 的整數' });
  }
  const ticket = findTicket(Number(req.params.id));
  if (!ticket) return res.status(404).json({ error: '找不到票' });
  const result = sellTicket(ticket.id, qty);
  if (!result.ok) return res.status(409).json({ error: result.error });
  res.json({ ok: true, ticket: result.ticket });
});
`;
const C7 = C6.replace(/function sellTicket[\s\S]*?\n}\n/, `function sellTicket(id, qty) {
  const ticket = findTicket(id);
  if (!ticket) throw new Error('找不到票');
  if (ticket.stock < qty) throw new Error('庫存不足');
  ticket.stock = ticket.stock - qty;
  return ticket;
}
`).replace(/app\.post\('\/tickets\/:id\/sell'[\s\S]*$/, `app.post('/tickets/:id/sell', (req, res) => {
  const { qty } = req.body;
  if (!Number.isInteger(qty) || qty < 1) {
    return res.status(400).json({ error: '數量要是大於 0 的整數' });
  }
  try {
    const ticket = sellTicket(Number(req.params.id), qty);
    res.json({ ok: true, ticket });
  } catch (err) {
    if (err.message === '找不到票') return res.status(404).json({ error: err.message });
    if (err.message === '庫存不足') return res.status(409).json({ error: err.message });
    res.status(500).json({ error: '伺服器出錯了' });
  }
});
`);
const C8 = `${C7}
app.get('/summary', (req, res) => {
  const totalStock = tickets.reduce((sum, t) => sum + t.stock, 0);
  const soldOut = tickets.filter((t) => t.stock === 0).map((t) => t.name);
  res.json({ types: tickets.length, totalStock, soldOut });
});
`;

/* ---------- 起始程式 ---------- */
const S1 = `// 票務庫存小 API：從空白檔案開始

// TODO 1: 寫一個函式 ticketLabel(name, price)，回傳像 '星光演唱會：3800 元' 的文字
//         寫法：function ticketLabel(name, price) { return name + '：' + price + ' 元'; }

// TODO 2: 用 console.log 印出 ticketLabel('星光演唱會', 3800) 的結果
`;
const S2 = `${C1}
// TODO 1: 做一個陣列 tickets，裡面放三張票（物件），欄位是 id、name、price、stock：
//         { id: 1, name: '星光演唱會', price: 3800, stock: 5 }
//         { id: 2, name: '交響樂之夜', price: 2400, stock: 0 }
//         { id: 3, name: '露天音樂祭', price: 1800, stock: 10 }
// TODO 2: 用 console.log('共', tickets.length, '種票') 印出有幾種票
// TODO 3: 用 for (const t of tickets) 一張一張走過去，每張都 console.log(ticketLabel(t.name, t.price))
`;
const S3 = `${C2}
// TODO 1: 寫 function findTicket(id)：在 tickets 裡找 id 相同的那張票，找不到就是 undefined
//         提示：return tickets.find((t) => t.id === id);
// TODO 2: 寫 function sellTicket(id, qty)：
//         先 findTicket 找票；沒有 → return { ok: false, error: '找不到票' }
//         庫存不夠（ticket.stock < qty）→ return { ok: false, error: '庫存不足' }
//         都沒問題才 ticket.stock = ticket.stock - qty，然後 return { ok: true, ticket }
// TODO 3: 最後一行：module.exports = { tickets, findTicket, sellTicket };
`;
const S4 = `${C3}
// TODO 1: 載入 express 並建立 app：
//         const express = require('express');
//         const app = express();
// TODO 2: 做第一支 API：app.get('/tickets', (req, res) => { res.json(tickets); });
`;
const S5 = `${C4}
// TODO: 做 GET /tickets/:id
//   ① const ticket = findTicket(Number(req.params.id));   （網址上的 id 是文字，要 Number）
//   ② 找不到：return res.status(404).json({ error: '找不到票' });
//   ③ 找到了：res.json(ticket);
`;
const S6 = `${C5}
// TODO 1: 在 const app = express(); 的下一行加上 app.use(express.json());（讓 Express 看得懂送來的 JSON）
// TODO 2: 做 POST /tickets/:id/sell，前端會送 { qty: 要買幾張 }：
//   ① const { qty } = req.body;
//   ② qty 不是大於 0 的整數 → return res.status(400).json({ error: '數量要是大於 0 的整數' });
//      （判斷：!Number.isInteger(qty) || qty < 1）
//   ③ const ticket = findTicket(Number(req.params.id)); 找不到 → 404 { error: '找不到票' }
//   ④ const result = sellTicket(ticket.id, qty); 沒成功（!result.ok）→ 409 { error: result.error }
//   ⑤ 成功：res.json({ ok: true, ticket: result.ticket });
`;
const S7 = `${C6}
// TODO 1: 改寫上面的 sellTicket：不要再 return { ok: false ... }，改成丟錯誤
//         找不到票 → throw new Error('找不到票');　庫存不夠 → throw new Error('庫存不足');
//         成功時直接 return ticket;（不用包 { ok, ticket } 了）
// TODO 2: 改寫 POST /tickets/:id/sell 的後半段：qty 的 400 檢查留著，其餘放進 try { ... } catch (err) { ... }
//         try 裡：const ticket = sellTicket(Number(req.params.id), qty); res.json({ ok: true, ticket });
//         catch 裡：err.message 是 '找不到票' → 404；是 '庫存不足' → 409；其他（意外）→ 500 { error: '伺服器出錯了' }
`;
const S8 = `${C7}
// TODO: 做 GET /summary，回傳統計：{ types, totalStock, soldOut }
//   types：有幾種票（tickets.length）
//   totalStock：全部庫存加起來　const totalStock = tickets.reduce((sum, t) => sum + t.stock, 0);
//   soldOut：庫存是 0 的票名字陣列　tickets.filter((t) => t.stock === 0).map((t) => t.name)
//   最後 res.json({ types: tickets.length, totalStock, soldOut });
`;

/* ---------- 共用的檢查片段（tests 字串；會接在玩家程式後面執行） ---------- */
const T_FUNCS = `check(typeof findTicket === 'function' && typeof sellTicket === 'function', '要有 findTicket 與 sellTicket 兩個函式');`;
const T_LIST = `const l = await app.handle('GET', '/tickets');
check(l.status === 200 && Array.isArray(l.body) && l.body.length === 3, 'GET /tickets 應該回 200 和 3 張票的陣列');`;
const T_ONE = `const o = await app.handle('GET', '/tickets/2');
check(o.status === 200 && o.body && o.body.name === '交響樂之夜', 'GET /tickets/2 應該回「交響樂之夜」');
const o404 = await app.handle('GET', '/tickets/99');
check(o404.status === 404 && o404.body && o404.body.error === '找不到票', '找不到的票應該回 404 和 { error: \\'找不到票\\' }，目前是 ' + o404.status);`;
const T_POST = `const sell = (id, body) => app.handle('POST', '/tickets/' + id + '/sell', body);
check((await sell(1, {})).status === 400, '沒傳 qty 應該回 400');
check((await sell(1, { qty: 0 })).status === 400, 'qty 是 0 應該回 400');
check((await sell(1, { qty: '2' })).status === 400, 'qty 是文字 "2" 應該回 400（要是數字）');
check((await sell(1, { qty: 1.5 })).status === 400, 'qty 是 1.5 應該回 400（要是整數）');
check((await sell(99, { qty: 1 })).status === 404, '賣不存在的票應該回 404');
const soldOutRes = await sell(2, { qty: 1 });
check(soldOutRes.status === 409 && soldOutRes.body && soldOutRes.body.error === '庫存不足', '庫存是 0 的票再賣，應該回 409 和 { error: \\'庫存不足\\' }，目前是 ' + soldOutRes.status);`;

/* ---------- 八個單元 ---------- */
const ND_UNITS = [
  GW(1, '空白檔案：一個函式加 console.log', [
    gstep(`<p><b>這個專案要做什麼？</b>一個「票務庫存小 API」：可以列出所有票、查單張票、賣票（庫存會減少），還有一個統計。就像演唱會售票櫃檯後面的那套系統。</p><p>我們不一次做完。第一步只做<b>最小的一件事</b>：寫一個函式，再把它的結果印出來。這就像蓋房子先打地基，簡單，但之後全部都站在上面。</p>`,
      choice('這個專案為什麼要一小步一小步做？', ['每一步都能馬上測試，出錯時知道是哪一步', '因為一次寫完比較浪費時間', '因為 Node.js 一次只能寫一行'], 0, '小步前進，錯了很快就找得到原因。')),
    gstep(`<p>函式就是「一台小機器」：放東西進去，它處理完，用 ${k('return')} 把答案交出來。</p>${pre("function ticketLabel(name, price) {\n  return name + '：' + price + ' 元';\n}\n\nconsole.log(ticketLabel('星光演唱會', 3800));")}<p>逐行看：<br>${k('function ticketLabel(name, price)')}：開一台叫 ticketLabel 的機器，要放進兩樣東西：票名和價錢。<br>${k("return name + '：' + price + ' 元'")}：把文字用 + 接起來，交出答案，例如「星光演唱會：3800 元」。<br>${k('console.log(...)')}：後端沒有畫面，要看結果就得用它印出來。</p>`,
      choice('函式裡的 <code>return</code> 在做什麼？', ['把答案交出來給呼叫它的人', '把答案印在螢幕上', '把函式刪掉'], 0, 'return 是交出答案；印出來是 console.log 的工作。')),
    gstep(`<p><b>最常見的錯：</b>忘了寫 ${k('return')}。函式跑完卻沒交出東西，印出來會是 ${k('undefined')}。另一個常見的錯：${k("'：'")} 的引號沒成對。</p><p><b>下一步預告：</b>第 2 步我們要把三張票放進<b>陣列</b>，學會「一次放很多筆資料」，再用迴圈一張一張讀出來。</p>`,
      choice('函式忘了寫 return，呼叫它會得到？', ['undefined', '空字串', '0'], 0, '沒有 return 就是什麼都沒交出來，結果是 undefined。')),
  ], {
    brief: '第 1 步：寫函式 <code>ticketLabel(name, price)</code>，回傳像「星光演唱會：3800 元」的文字（冒號是全形 ：）。再用 <code>console.log</code> 印出 <code>ticketLabel(\'星光演唱會\', 3800)</code>。',
    hint: '照 TODO 1～2，把註解換成真的程式。回傳的文字格式是：票名 + 全形冒號 + 價錢 + 空白 + 元。',
    steps: [
      `打：${k('function ticketLabel(name, price) {')} 換行。<br>為什麼：先有一個叫 ticketLabel 的函式，檢查才找得到它。name 和 price 是呼叫時才會填進去的東西。`,
      `下一行縮排打：${k("return name + '：' + price + ' 元';")} 再換行打 ${k('}')}。<br>為什麼：把票名、全形冒號、價錢、「 元」接起來交出去。冒號是全形的「：」，空白在「元」前面。`,
      `空一行，打：${k("console.log(ticketLabel('星光演唱會', 3800));")}<br>為什麼：後端沒有畫面，要看結果得靠 console.log 印出來，檢查也會看有沒有印出「星光演唱會：3800 元」。`,
      `按「送出檢查」。<br>為什麼：它會真的執行你的程式。最常見的錯：函式裡忘了 ${k('return')}（印出 undefined），或冒號打成半形 ${k(':')}。`,
    ],
    starter: S1, solution: C1,
    tests: `check(typeof ticketLabel === 'function', '要有一個叫 ticketLabel 的函式');
if (typeof ticketLabel === 'function') {
  check(ticketLabel('星光演唱會', 3800) === '星光演唱會：3800 元', "ticketLabel('星光演唱會', 3800) 應該回傳 '星光演唱會：3800 元'，目前是 " + ticketLabel('星光演唱會', 3800));
  check(ticketLabel('交響樂之夜', 2400) === '交響樂之夜：2400 元', "ticketLabel('交響樂之夜', 2400) 應該回傳 '交響樂之夜：2400 元'");
}
check(output().includes('星光演唱會：3800 元'), '要用 console.log 印出 ticketLabel(\\'星光演唱會\\', 3800) 的結果');`,
  }),

  GW(2, '票放進陣列：讀取資料', [
    gstep(`<p>上一步只處理一張票，但售票系統有很多票。這一步我們把票<b>整理成資料</b>放起來，再讀出來。</p><p>比喻：陣列像一個<b>抽屜櫃</b>，每個抽屜放一張票；物件像<b>一張票的資料卡</b>，上面有 id、名字、價錢、庫存。</p>`,
      choice('用來放「很多筆」資料的是？', ['陣列', '單一個數字', '一個 console.log'], 0, '陣列用中括號 [ ]，一格放一筆。')),
    gstep(`<p>寫法：</p>${pre("const tickets = [\n  { id: 1, name: '星光演唱會', price: 3800, stock: 5 },\n  { id: 2, name: '交響樂之夜', price: 2400, stock: 0 },\n];\n\nconsole.log(tickets.length);   // 2：有幾張\nconsole.log(tickets[0].name);  // 星光演唱會\nfor (const t of tickets) {\n  console.log(t.name);         // 一張一張走過去\n}")}<p>逐行看：<br>${k('{ id: 1, name: ... }')}：一個物件，用「欄位: 值」描述一張票，欄位之間用逗號。<br>${k('tickets.length')}：陣列有幾筆。<br>${k('tickets[0]')}：第一筆。<b>電腦從 0 開始數</b>，不是從 1。<br>${k('t.name')}：用點取出物件的某個欄位。<br>${k('for (const t of tickets)')}：從頭到尾，每次拿一筆叫 t。</p>`,
      choice('<code>tickets[0]</code> 是哪一筆？', ['第一筆', '第二筆', '最後一筆'], 0, '索引從 0 開始，所以 0 是第一筆。')),
    gstep(`<p><b>常見的錯：</b>① 每個物件後面忘了逗號。② 把 ${k('tickets[1]')} 當成第一筆。③ 欄位名字拼錯（${k('stock')} 寫成 ${k('stocks')}），讀出來就是 undefined。</p><p><b>下一步預告：</b>第 3 步我們要寫兩個真正有用的函式：「找票」和「賣票」，賣票時要檢查<b>庫存夠不夠</b>。</p>`,
      choice('庫存欄位 <code>stock</code> 拼成 <code>stocks</code> 去讀，會得到？', ['undefined', '0', '會當掉並顯示紅字'], 0, '物件找不到的欄位，讀出來是 undefined。')),
  ], {
    brief: '第 2 步：做出陣列 <code>tickets</code>（三張票，欄位 id、name、price、stock，內容照 TODO 註解）；印出 <code>共 3 種票</code>；用 <code>for...of</code> 把每張票用 <code>ticketLabel</code> 印出來。',
    hint: '三張票的資料在 TODO 1 註解裡，照抄成物件。每個物件後面都要逗號。迴圈裡用 t.name 和 t.price。',
    steps: [
      `在 TODO 下面打 ${k('const tickets = [')} 換行。<br>為什麼：先準備好「抽屜櫃」，等一下把三張票放進去。`,
      `放三張票，每行一張：<pre>{ id: 1, name: '星光演唱會', price: 3800, stock: 5 },\n{ id: 2, name: '交響樂之夜', price: 2400, stock: 0 },\n{ id: 3, name: '露天音樂祭', price: 1800, stock: 10 },</pre>然後換行打 ${k('];')} 關起來。<br>為什麼：每張票是一個物件，物件與物件之間要有逗號。交響樂之夜的庫存是 0，之後會用來測試「賣完了」。`,
      `打：${k("console.log('共', tickets.length, '種票');")}<br>為什麼：console.log 可以一次印好幾樣，中間會自動加空白，印出「共 3 種票」。`,
      `打迴圈：<pre>for (const t of tickets) {\n  console.log(ticketLabel(t.name, t.price));\n}</pre>為什麼：一張一張拿出來，交給上一步寫的 ticketLabel 轉成文字再印。`,
      `按「送出檢查」。<br>為什麼：它會看陣列內容和印出的文字。最常見的錯：物件後面少逗號、欄位名字拼錯，或是中文引號打成全形的 ' '。`,
    ],
    starter: S2, solution: C2,
    tests: `check(typeof tickets !== 'undefined' && Array.isArray(tickets), '要有一個叫 tickets 的陣列');
if (typeof tickets !== 'undefined' && Array.isArray(tickets)) {
  check(tickets.length === 3, 'tickets 應該有 3 張票，目前是 ' + tickets.length + ' 張');
  const t2 = tickets[1] || {};
  check(t2.id === 2 && t2.name === '交響樂之夜' && t2.price === 2400 && t2.stock === 0, '第二張票應該是 { id: 2, name: \\'交響樂之夜\\', price: 2400, stock: 0 }');
  const t3 = tickets[2] || {};
  check(t3.name === '露天音樂祭' && t3.price === 1800 && t3.stock === 10, '第三張票應該是露天音樂祭，價錢 1800、庫存 10');
}
check(output().includes('共 3 種票'), "要印出「共 3 種票」：console.log('共', tickets.length, '種票')");
check(output().includes('交響樂之夜：2400 元') && output().includes('露天音樂祭：1800 元'), '用迴圈把每張票用 ticketLabel 印出來（要看到「交響樂之夜：2400 元」和「露天音樂祭：1800 元」）');
check(typeof ticketLabel === 'function' && ticketLabel('甲', 1) === '甲：1 元', '第 1 步的 ticketLabel 要保留');`,
  }),

  GW(3, '找票與賣票：有庫存檢查的函式', [
    gstep(`<p>真正的售票系統有兩個核心動作：<b>找票</b>、<b>賣票</b>。我們把它們各寫成一個函式，這樣之後不管是 API 還是別的地方，都可以重複使用，不用到處複製貼上。</p><p>賣票有一個重要規矩：<b>庫存不夠就不能賣</b>。賣出去的票庫存要減少。這叫「業務規則」，後端最重要的工作就是守住它。</p>`,
      choice('把「找票」「賣票」各寫成一個函式的好處是？', ['需要的地方重複使用，不用複製貼上', '電腦跑得比較快', '因為只能寫兩個函式'], 0, '函式把一件事包起來，改一個地方全部都跟著改。')),
    gstep(`<p>三個重點：</p>${pre("function findTicket(id) {\n  return tickets.find((t) => t.id === id);\n}\n\nfunction sellTicket(id, qty) {\n  const ticket = findTicket(id);\n  if (!ticket) return { ok: false, error: '找不到票' };\n  if (ticket.stock < qty) return { ok: false, error: '庫存不足' };\n  ticket.stock = ticket.stock - qty;\n  return { ok: true, ticket };\n}\n\nmodule.exports = { tickets, findTicket, sellTicket };")}<p>逐段看：<br>${k('tickets.find((t) => t.id === id)')}：從抽屜櫃裡找第一張 id 相同的票；找不到會得到 undefined。<br>${k('if (!ticket) return ...')}：找不到就<b>提早回去</b>，後面的就不用做（也避免讀 undefined 的欄位而當掉）。<br>${k('ticket.stock < qty')}：庫存比要買的少，就不能賣。<br>${k('ticket.stock = ticket.stock - qty')}：檢查都過了，才真的扣庫存。<br>${k('module.exports')}：把東西「送出去」讓別的檔案用 ${k('require')} 拿。這叫模組寫法，我們先放著，之後會用到。</p>`,
      choice('賣票時，什麼時候才可以扣庫存？', ['票存在、庫存也夠之後', '一開始就先扣', '不用管，隨便扣'], 0, '先檢查再動手；先扣再檢查，會把庫存弄亂。')),
    gstep(`<p><b>最常見的錯：</b>順序反了，先扣庫存再檢查。庫存不夠時已經被扣成負數了。第二種錯：${k('ticket.stock < qty')} 寫成 ${k('<=')}，結果剛好賣完的最後一張賣不出去。</p><p><b>下一步預告：</b>第 4 步我們要引入 <b>Express</b>，做出第一支 API：<b>GET /tickets</b>，讓前端能要到票的列表。</p>`,
      choice('庫存 5、要買 5，應該？', ['可以賣（賣完剩 0）', '不能賣', '要賣兩次'], 0, '剛好夠就可以賣，所以不夠的條件是 stock < qty，不是 <=。')),
  ], {
    brief: '第 3 步：寫 <code>findTicket(id)</code>（找不到回 undefined）和 <code>sellTicket(id, qty)</code>（找不到票回 <code>{ ok: false, error: \'找不到票\' }</code>、庫存不足回 <code>{ ok: false, error: \'庫存不足\' }</code>、成功就扣庫存並回 <code>{ ok: true, ticket }</code>），最後用 <code>module.exports</code> 送出 tickets、findTicket、sellTicket。',
    hint: '照 TODO 1～3。順序：先找票、再檢查庫存、最後才扣庫存。庫存不夠的條件是 ticket.stock < qty。',
    steps: [
      `打：<pre>function findTicket(id) {\n  return tickets.find((t) =&gt; t.id === id);\n}</pre>為什麼：用 id 在陣列裡找票。注意是三個等號 ${k('===')}，而且 id 是數字。`,
      `打 ${k('function sellTicket(id, qty) {')}，下一行：${k('const ticket = findTicket(id);')}<br>為什麼：賣票第一件事是先找到那張票，直接重用剛寫的 findTicket。`,
      `下一行：${k("if (!ticket) return { ok: false, error: '找不到票' };")}<br>為什麼：沒這張票就不用往下了，回報原因。`,
      `下一行：${k("if (ticket.stock < qty) return { ok: false, error: '庫存不足' };")}<br>為什麼：庫存比要買的少，不能賣。`,
      `下兩行：${k('ticket.stock = ticket.stock - qty;')} 和 ${k('return { ok: true, ticket };')}，再打 ${k('}')} 關起來。<br>為什麼：檢查都過了才扣庫存，並回報成功。`,
      `最後一行打：${k('module.exports = { tickets, findTicket, sellTicket };')} 然後按「送出檢查」。<br>為什麼：把這三樣東西送出去。最常見的錯：先扣庫存再檢查，或把 ${k('<')} 寫成 ${k('<=')}。`,
    ],
    starter: S3, solution: C3,
    tests: `${T_FUNCS}
if (typeof findTicket === 'function' && typeof sellTicket === 'function') {
  check(findTicket(2) && findTicket(2).name === '交響樂之夜', 'findTicket(2) 應該找到「交響樂之夜」');
  check(findTicket(99) === undefined, 'findTicket(99) 找不到，應該回傳 undefined');
  const a = sellTicket(99, 1);
  check(a && a.ok === false && a.error === '找不到票', "sellTicket(99, 1) 應該回傳 { ok: false, error: '找不到票' }");
  const b = sellTicket(2, 1);
  check(b && b.ok === false && b.error === '庫存不足', "庫存是 0 的票，sellTicket(2, 1) 應該回傳 { ok: false, error: '庫存不足' }");
  const c = sellTicket(1, 2);
  check(c && c.ok === true && c.ticket && c.ticket.stock === 3, 'sellTicket(1, 2) 應該成功，而且星光演唱會庫存從 5 變成 3，目前是 ' + (c && c.ticket && c.ticket.stock));
  const d = sellTicket(1, 99);
  check(d && d.ok === false && d.error === '庫存不足', 'sellTicket(1, 99) 庫存不夠，應該回傳 { ok: false, error: \\'庫存不足\\' }');
  check(findTicket(1).stock === 3, '庫存不足時不可以扣庫存（應該還是 3），目前是 ' + findTicket(1).stock);
  const e = sellTicket(1, 3);
  check(e && e.ok === true && findTicket(1).stock === 0, '剛好買光（庫存 3、買 3）應該可以賣，庫存變 0');
}
check(module.exports && typeof module.exports.findTicket === 'function' && typeof module.exports.sellTicket === 'function' && Array.isArray(module.exports.tickets), '最後要有 module.exports = { tickets, findTicket, sellTicket };');
check(output().includes('共 3 種票'), '第 2 步的 console.log 要保留');`,
  }),

  GW(4, '第一支 API：GET /tickets 列表', [
    gstep(`<p>前面的函式只能在這個檔案裡用。前端網頁在別的地方，想要資料，就得有個<b>窗口</b>可以來要。這個窗口叫 <b>API</b>，我們用 <b>Express</b> 來做。</p><p>比喻：Express 是<b>餐廳的櫃檯</b>。客人（前端）走到櫃檯說「我要票的列表」，櫃檯（路由）就去後面（你的函式和資料）拿，再用 JSON 端出來。</p>`,
      choice('API 在這個專案裡像什麼？', ['櫃檯：前端來要東西，後端回資料', '資料庫本身', '網頁的外觀'], 0, 'API 是前後端約好的窗口。')),
    gstep(`<p>寫法：</p>${pre("const express = require('express');\nconst app = express();\n\napp.get('/tickets', (req, res) => {\n  res.json(tickets);\n});")}<p>逐行看：<br>${k("require('express')")}：把 Express 工具拿進來用。<br>${k('const app = express()')}：開一間餐廳，叫 app。<br>${k("app.get('/tickets', ...)")}：定義一條<b>路由</b>：「有人用 GET 要 /tickets 時，就執行後面這個函式」。<br>${k('(req, res)')}：req 是客人的點餐單（請求），res 是出餐口（回應）。<br>${k('res.json(tickets)')}：把 tickets 轉成 JSON 回給前端。</p><p>GET 就是「要東西」，不會改變資料。</p>`,
      choice('<code>app.get(\'/tickets\', ...)</code> 的意思是？', ['有人用 GET 要 /tickets 時執行後面的函式', '刪除 tickets', '建立新的票'], 0, '路由 = 方法 + 網址 + 處理函式。')),
    gstep(`<p><b>最常見的錯：</b>① 忘了 ${k("require('express')")} 或沒建立 ${k('app')}，直接用 app 會出錯。② 網址忘了開頭的斜線，寫成 ${k("'tickets'")}。③ 寫了 ${k('res.json')} 卻忘了把資料放進括號。</p><p><b>下一步預告：</b>第 5 步要做 <b>GET /tickets/:id</b>，查單張票；找不到時要學會回 <b>404</b>。</p>`,
      choice('路由的網址應該怎麼寫？', ["'/tickets'（開頭有斜線）", "'tickets'", "'/tickets/'（結尾也要斜線才行）"], 0, '網址從斜線開始。')),
  ], {
    brief: '第 4 步：載入 express 並建立 <code>app</code>，做出 <code>GET /tickets</code>，回傳全部的票（<code>tickets</code> 陣列）。前面的函式都要保留。',
    hint: '兩個 TODO：先 require 與 app，再 app.get。路由裡 res.json(tickets)。',
    steps: [
      `打：<pre>const express = require('express');\nconst app = express();</pre>為什麼：先把 Express 拿進來，再開一間叫 app 的店。後面所有路由都掛在 app 上。`,
      `空一行，打：${k("app.get('/tickets', (req, res) => {")}<br>為什麼：定義「GET /tickets」這個窗口。`,
      `下一行縮排打：${k('res.json(tickets);')} 然後換行打 ${k('});')} 關起來。<br>為什麼：把全部的票用 JSON 回給前端。`,
      `按「送出檢查」。<br>為什麼：檢查會模擬前端去要 /tickets。最常見的錯：忘了 ${k('const app = express();')}，或路徑寫錯成 ${k("'/ticket'")}（少了 s）。`,
    ],
    starter: S4, solution: C4,
    tests: `${T_FUNCS}
check(typeof app !== 'undefined', '要有 const app = express();');
${T_LIST}
check(l.body && l.body[0] && l.body[0].name === '星光演唱會', '回傳的第一張票應該是「星光演唱會」');`,
    must: [{ re: /require\(\s*['"]express['"]\s*\)/, msg: "請用 require('express') 載入 express" }],
  }),

  GW(5, '查單張票：GET /tickets/:id 與 404', [
    gstep(`<p>列表有了，現在要讓前端<b>查單張票</b>，例如只看 id 是 2 的那張。網址會長這樣：${k('/tickets/2')}、${k('/tickets/3')}。每次最後的數字都不一樣。</p><p>還有一種情況：前端問 ${k('/tickets/99')}，根本沒有這張票。這時不能裝沒事，要明確告訴前端<b>「找不到」，狀態碼 404</b>。</p>`,
      choice('前端要查的票不存在，後端應該回？', ['404 和說明', '200 和空白', '直接當掉'], 0, '找不到就是 404，要明講。')),
    gstep(`<p>寫法：</p>${pre("app.get('/tickets/:id', (req, res) => {\n  const ticket = findTicket(Number(req.params.id));\n  if (!ticket) return res.status(404).json({ error: '找不到票' });\n  res.json(ticket);\n});")}<p>逐行看：<br>${k('/tickets/:id')}：冒號開頭的 ${k(':id')} 代表「會變的部分」。<br>${k('req.params.id')}：取出網址上那個值。<b>它一定是文字</b>，例如 "2"。<br>${k('Number(...)')}：轉成數字 2，因為票的 id 是數字，文字 "2" 和數字 2 用 === 永遠不相等。<br>${k('res.status(404).json(...)')}：先設狀態碼 404，再回 JSON 說明原因。<br>${k('return')}：回完就結束，不要再往下跑到 ${k('res.json(ticket)')}。</p>`,
      choice('網址 /tickets/2 的 <code>req.params.id</code> 是什麼型別？', ['文字 "2"', '數字 2', '陣列'], 0, '網址上的東西一律是文字，要比數字就得 Number()。')),
    gstep(`<p><b>最常見的錯：</b>忘了 ${k('Number(...)')}，結果每張票都回 404。第二種：${k('if (!ticket)')} 沒有加 ${k('return')}，回了 404 還繼續跑，會出現「回應送兩次」的錯。</p><p>常見狀態碼：<b>200</b> 成功、<b>400</b> 你傳錯了、<b>404</b> 找不到、<b>409</b> 衝突、<b>500</b> 後端壞了。</p><p><b>下一步預告：</b>第 6 步做最重要的一支：<b>POST 賣票</b>，還要學會檢查前端送來的資料，不對就回 <b>400</b>。</p>`,
      choice('<code>/tickets/abc</code> 轉成 <code>Number("abc")</code> 會變 <code>NaN</code>，找票的結果會是？', ['找不到，回 404', '找到第一張票', '回 500 並當機'], 0, 'NaN 對不上任何 id，find 回傳 undefined，所以走到 404。')),
  ], {
    brief: '第 5 步：做 <code>GET /tickets/:id</code>：找到就回那張票；找不到回 404 和 <code>{ error: \'找不到票\' }</code>。列表 API 要保留。',
    hint: '用第 3 步寫的 findTicket。記得 Number(req.params.id)，找不到時 return res.status(404).json(...)。',
    steps: [
      `打：${k("app.get('/tickets/:id', (req, res) => {")}<br>為什麼：${k(':id')} 是會變的部分，/tickets/1、/tickets/2 都會進來這裡。`,
      `下一行打：${k('const ticket = findTicket(Number(req.params.id));')}<br>為什麼：網址上的 id 是文字，先 Number 轉成數字，再交給之前寫好的 findTicket 去找。`,
      `下一行打：${k("if (!ticket) return res.status(404).json({ error: '找不到票' });")}<br>為什麼：找不到要明確回 404。加 ${k('return')} 才不會繼續往下跑。`,
      `下一行打：${k('res.json(ticket);')} 再換行打 ${k('});')} 然後按「送出檢查」。<br>為什麼：找到了就把那張票回傳。最常見的錯：忘了 ${k('Number(...)')}，結果每個 id 都回 404。`,
    ],
    starter: S5, solution: C5,
    tests: `${T_LIST}
${T_ONE}
const o3 = await app.handle('GET', '/tickets/3');
check(o3.body && o3.body.stock === 10, 'GET /tickets/3 應該回傳露天音樂祭（庫存 10）');
check((await app.handle('GET', '/tickets/abc')).status === 404, 'GET /tickets/abc 也要回 404');`,
  }),

  GW(6, '賣票：POST 與 400 驗證', [
    gstep(`<p>前端要「買票」，是<b>送東西</b>給後端：我要買 2 張。送東西用 <b>POST</b>，內容（例如 ${k('{ "qty": 2 }')}）放在 ${k('req.body')} 裡。</p><p>重點規矩：<b>永遠不要相信前端送來的資料</b>。可能沒填、填了負數、填了文字。每一種都要先檢查，不對就回 <b>400</b>，意思是「你送來的東西有問題」。</p>`,
      choice('前端送來的資料有問題（例如數量是 -3），後端應該回？', ['400', '404', '200'], 0, '400 = 請求內容有問題，是前端的錯。')),
    gstep(`<p>寫法：</p>${pre("app.use(express.json());\n\napp.post('/tickets/:id/sell', (req, res) => {\n  const { qty } = req.body;\n  if (!Number.isInteger(qty) || qty < 1) {\n    return res.status(400).json({ error: '數量要是大於 0 的整數' });\n  }\n  const ticket = findTicket(Number(req.params.id));\n  if (!ticket) return res.status(404).json({ error: '找不到票' });\n  const result = sellTicket(ticket.id, qty);\n  if (!result.ok) return res.status(409).json({ error: result.error });\n  res.json({ ok: true, ticket: result.ticket });\n});")}<p>逐段看：<br>${k('app.use(express.json())')}：告訴 Express「看得懂前端送來的 JSON」。沒加的話 req.body 讀不到。要放在路由前面。<br>${k('Number.isInteger(qty)')}：qty 是不是整數。文字 "2" 和小數 1.5 都不是。<br>${k('|| qty < 1')}：「或」。不是整數，或小於 1，兩者有一個成立就是錯。<br><b>三種失敗，三個狀態碼</b>：資料有問題 400、票不存在 404、庫存不夠 409（衝突）。順序是：先擋壞資料，再找票，再賣。<br>${k('result.ok')}：用第 3 步 sellTicket 回傳的結果判斷成功或失敗。</p>`,
      choice('POST 送來的內容，在 Express 裡從哪裡讀？', ['req.body', 'req.params.id', 'res.json'], 0, 'POST 的內容在 req.body；網址上的在 req.params。')),
    gstep(`<p><b>最常見的錯：</b>① 忘了 ${k('app.use(express.json())')}，req.body 會是空的。② 把檢查寫在賣票後面，壞資料已經動到庫存。③ 驗證只寫 ${k('!qty')}：qty 是 0 時能擋，但文字 "2" 或 1.5 擋不掉，所以用 ${k('Number.isInteger')}。</p><p><b>下一步預告：</b>第 7 步學<b>錯誤處理</b>：改用 ${k('throw')} 丟錯誤、用 ${k('try / catch')} 接住，並且為「我們沒想到的意外」準備 <b>500</b>。</p>`,
      choice('為什麼後端還要自己驗證資料，不能只靠前端畫面擋？', ['因為任何人都可以繞過畫面直接送資料', '因為前端不會寫程式', '因為驗證會讓網站變慢'], 0, '前端檢查只是方便使用者；真正的把關一定要在後端。')),
  ], {
    brief: '第 6 步：做 <code>POST /tickets/:id/sell</code>，body 是 <code>{ qty }</code>。qty 不是大於 0 的整數 → 400；票不存在 → 404；庫存不足 → 409（<code>{ error: \'庫存不足\' }</code>）；成功 → 回 <code>{ ok: true, ticket }</code>。前面的 API 都要保留。',
    hint: '先加 app.use(express.json());。順序：400 驗證 → findTicket 找不到 404 → sellTicket 沒成功 409 → 成功回 200。',
    steps: [
      `在 ${k('const app = express();')} 的下一行加上 ${k('app.use(express.json());')}<br>為什麼：讓 Express 看得懂送來的 JSON，之後才讀得到 req.body。`,
      `打：${k("app.post('/tickets/:id/sell', (req, res) => {")} 下一行：${k('const { qty } = req.body;')}<br>為什麼：賣票是「送出動作」用 POST；先把前端送來的數量取出來。`,
      `下一行打：<pre>if (!Number.isInteger(qty) || qty &lt; 1) {\n  return res.status(400).json({ error: '數量要是大於 0 的整數' });\n}</pre>為什麼：先檢查資料。不是整數或小於 1 都是壞資料，回 400，後面都不用跑了。`,
      `下一行打：<pre>const ticket = findTicket(Number(req.params.id));\nif (!ticket) return res.status(404).json({ error: '找不到票' });</pre>為什麼：資料沒問題了，才找票。找不到回 404。`,
      `下一行打：<pre>const result = sellTicket(ticket.id, qty);\nif (!result.ok) return res.status(409).json({ error: result.error });</pre>為什麼：交給第 3 步的 sellTicket 去賣；沒成功就是庫存不足，回 409。`,
      `最後打：${k('res.json({ ok: true, ticket: result.ticket });')} 再 ${k('});')} 關起來，按「送出檢查」。<br>為什麼：全部都過了，才回成功。最常見的錯：只寫 ${k('if (!qty)')}，擋不掉文字 "2" 和 1.5。`,
    ],
    starter: S6, solution: C6,
    must: [{ re: /express\.json\(\)/, msg: '請加上 app.use(express.json());，不然 req.body 讀不到' }],
    tests: `${T_LIST}
${T_ONE}
${T_POST}
const okRes = await sell(1, { qty: 2 });
check(okRes.status === 200 && okRes.body && okRes.body.ok === true && okRes.body.ticket && okRes.body.ticket.stock === 3, '賣 2 張星光演唱會應該回 200、{ ok: true, ticket }，而且庫存從 5 變成 3');
const tooMany = await sell(1, { qty: 4 });
check(tooMany.status === 409, '庫存剩 3，要買 4 張應該回 409，目前是 ' + tooMany.status);
check((await app.handle('GET', '/tickets/1')).body.stock === 3, '失敗的購買不可以扣庫存（還是 3）');`,
  }),

  GW(7, '錯誤處理：try / catch 與 500', [
    gstep(`<p>目前的賣票是靠「回傳 ${k('{ ok: false }')}」來報告失敗，每次呼叫都要記得檢查 ${k('ok')}。現實中更常用的做法：失敗時<b>丟出錯誤（throw）</b>，由呼叫的人用 <b>try / catch</b> 接住。</p><p>比喻：廚房出狀況時，不是默默做出一道壞菜，而是<b>大喊一聲</b>，由店長（catch）決定怎麼辦。</p><p>更重要的是：程式難免有<b>我們沒想到的意外</b>。意外發生時，不能讓整個伺服器當掉，要穩穩回 <b>500</b>。</p>`,
      choice('函式遇到錯誤情況，比較好的做法是？', ['throw 丟出錯誤，讓呼叫的人處理', '默默回傳壞資料', '假裝沒事'], 0, '大聲報錯，比默默出錯好找原因。')),
    gstep(`<p>寫法：</p>${pre("function sellTicket(id, qty) {\n  const ticket = findTicket(id);\n  if (!ticket) throw new Error('找不到票');\n  if (ticket.stock < qty) throw new Error('庫存不足');\n  ticket.stock = ticket.stock - qty;\n  return ticket;\n}\n\n// 路由裡\ntry {\n  const ticket = sellTicket(Number(req.params.id), qty);\n  res.json({ ok: true, ticket });\n} catch (err) {\n  if (err.message === '找不到票') return res.status(404).json({ error: err.message });\n  if (err.message === '庫存不足') return res.status(409).json({ error: err.message });\n  res.status(500).json({ error: '伺服器出錯了' });\n}")}<p>逐段看：<br>${k("throw new Error('庫存不足')")}：丟出一個錯誤，函式<b>立刻停止</b>。<br>${k('try { ... }')}：「試試看」，裡面的程式如果丟錯，就跳去 catch。<br>${k('catch (err)')}：接住錯誤，${k('err.message')} 是我們丟的那句話。<br>最後一行的 500 是給「意外」用的：沒預料到的錯，回一句<b>通用</b>的「伺服器出錯了」，不要把內部細節（程式的錯誤訊息）傳給使用者。</p>`,
      choice('catch 最後面那行回 500，是為了？', ['處理沒預料到的意外，而且不洩漏內部細節', '處理庫存不足', '處理資料格式錯誤'], 0, '已知的錯各有狀態碼，沒想到的才是 500。')),
    gstep(`<p><b>最常見的錯：</b>① 丟的字和 catch 比對的字不一樣（例如少一個字），結果落到 500。② catch 裡忘了 ${k('return')}。③ 把 ${k('err.message')} 直接回給使用者當 500 的內容，可能洩漏程式內部資訊。</p><p><b>下一步預告：</b>第 8 步是收尾：做一個 <b>GET /summary</b> 統計 API，學 ${k('reduce')} 加總，並把前面所有功能一起驗證。</p>`,
      choice('一個 try 裡面的程式丟了錯，接下來會？', ['跳到 catch 去處理', '繼續執行 try 裡的下一行', '整個程式當掉'], 0, '丟錯後，try 剩下的不會再跑，直接進 catch。')),
  ], {
    brief: '第 7 步：① 把 <code>sellTicket</code> 改成丟錯誤（<code>找不到票</code>、<code>庫存不足</code>），成功回傳 ticket 本身；② 賣票路由用 try / catch 接住：找不到票 404、庫存不足 409、其他意外 500 加 <code>{ error: \'伺服器出錯了\' }</code>。其他行為不變。',
    hint: 'sellTicket：if (...) throw new Error(...)，最後 return ticket。路由：400 驗證留在 try 外面；try 裡呼叫 sellTicket；catch 依 err.message 分三種。',
    steps: [
      `把 sellTicket 裡的 ${k("return { ok: false, error: '找不到票' }")} 改成 ${k("throw new Error('找不到票');")}<br>為什麼：改成丟出錯誤，函式會立刻停止，不用靠呼叫的人檢查 ok。`,
      `把庫存那行改成 ${k("if (ticket.stock < qty) throw new Error('庫存不足');")}<br>為什麼：同樣的道理。丟的這句話等一下 catch 要拿來比對，字要一模一樣。`,
      `最後 ${k('return { ok: true, ticket };')} 改成 ${k('return ticket;')}<br>為什麼：成功時不用再包一層，直接把票交出去。`,
      `路由裡：400 驗證留著，後面改成 ${k('try {')}，裡面：<pre>const ticket = sellTicket(Number(req.params.id), qty);\nres.json({ ok: true, ticket });</pre>為什麼：把可能丟錯的那一行放進 try。舊的 findTicket、result.ok 那幾行都可以刪掉，因為 sellTicket 自己會報錯。`,
      `接著打 catch：<pre>} catch (err) {\n  if (err.message === '找不到票') return res.status(404).json({ error: err.message });\n  if (err.message === '庫存不足') return res.status(409).json({ error: err.message });\n  res.status(500).json({ error: '伺服器出錯了' });\n}</pre>為什麼：已知的錯各有狀態碼，沒想到的意外一律 500。`,
      `按「送出檢查」。<br>為什麼：檢查甚至會故意讓 sellTicket 丟出意外錯誤，看你有沒有回 500。最常見的錯：catch 裡比對的字和 throw 的字不一致，或寫成 ${k('const sellTicket = ...')} 的箭頭函式（檢查需要 ${k('function sellTicket')} 這種寫法）。`,
    ],
    starter: S7, solution: C7,
    must: [{ re: /try\s*\{/, msg: '請用 try { ... } catch (err) { ... } 包住賣票的呼叫' }, { re: /throw\s+new\s+Error/, msg: '請讓 sellTicket 用 throw new Error(...) 丟出錯誤' }],
    tests: `${T_FUNCS}
if (typeof sellTicket === 'function') {
  let e1 = null; try { sellTicket(99, 1); } catch (e) { e1 = e; }
  check(e1 && e1.message === '找不到票', "sellTicket(99, 1) 應該丟出錯誤 new Error('找不到票')");
  let e2 = null; try { sellTicket(2, 1); } catch (e) { e2 = e; }
  check(e2 && e2.message === '庫存不足', "庫存是 0 的票，sellTicket(2, 1) 應該丟出錯誤 new Error('庫存不足')");
  const t = sellTicket(3, 2);
  check(t && t.id === 3 && t.stock === 8, '成功時 sellTicket(3, 2) 應該直接回傳那張票，而且庫存從 10 變 8');
}
${T_LIST}
${T_ONE}
${T_POST}
const okRes = await sell(1, { qty: 1 });
check(okRes.status === 200 && okRes.body && okRes.body.ok === true && okRes.body.ticket && okRes.body.ticket.stock === 4, '賣 1 張星光演唱會應該回 200、{ ok: true, ticket }，庫存變 4，目前是 ' + (okRes.body && okRes.body.ticket && okRes.body.ticket.stock));
const orig = sellTicket;
let patched = true;
try { sellTicket = () => { throw new Error('boom'); }; } catch (e) { patched = false; check(false, '請用 function sellTicket(id, qty) { ... } 的寫法（不要用 const）'); }
if (patched) {
  const boom = await sell(1, { qty: 1 });
  check(boom.status === 500, '意外的錯誤（不是找不到票/庫存不足）應該回 500，目前是 ' + boom.status);
  check(boom.body && boom.body.error === '伺服器出錯了', '500 要回 { error: \\'伺服器出錯了\\' }，不要把原始錯誤訊息傳出去');
  sellTicket = orig;
}`,
  }),

  GW(8, '收尾：統計用的 summary API', [
    gstep(`<p>最後一步：老闆想看<b>統計</b>：有幾種票、全部還剩幾張、哪些票賣完了。前端要拿這些顯示在管理頁面。</p><p>統計不需要新概念，是把前面學的<b>組合起來</b>：讀陣列、加總、篩選、回傳 JSON。做完這一步，你就完成了一個完整的後端。</p>`,
      choice('統計「全部庫存」要做的事是？', ['把每張票的 stock 加起來', '只看第一張票', '把票的名字接起來'], 0, '加總就是把每一筆的數字全部加在一起。')),
    gstep(`<p>寫法：</p>${pre("app.get('/summary', (req, res) => {\n  const totalStock = tickets.reduce((sum, t) => sum + t.stock, 0);\n  const soldOut = tickets.filter((t) => t.stock === 0).map((t) => t.name);\n  res.json({ types: tickets.length, totalStock, soldOut });\n});")}<p>逐行看：<br>${k('reduce((sum, t) => sum + t.stock, 0)')}：像一邊走一邊記帳。sum 是目前的合計，從最後的 0 開始，每看到一張票就加上它的 stock。<br>${k('filter((t) => t.stock === 0)')}：只留下庫存是 0 的票。<br>${k('map((t) => t.name)')}：把每張票換成它的名字，變成名字陣列。<br>${k('{ types, totalStock, soldOut }')}：回傳的 JSON。<br>因為統計是即時算的，所以賣票之後再看，數字會跟著變。</p>`,
      choice('<code>tickets.filter(...).map((t) => t.name)</code> 的結果是？', ['符合條件的票的名字陣列', '一個數字', '一張票'], 0, 'filter 先挑出票，map 再把每張票換成名字。')),
    gstep(`<p>🎉 做完這一步，你從<b>空白檔案</b>完成了一個完整的後端：<b>函式 → 陣列資料 → 找票賣票 → GET 列表 → GET 單張與 404 → POST 與 400 驗證 → try/catch 與 500 → 統計</b>。每一步你都知道為什麼。</p><p><b>最常見的錯：</b>reduce 最後的初始值 ${k('0')} 忘了寫（會出奇怪的結果）；soldOut 把 map 忘了，回傳整張票而不是名字。檢查會把前面所有功能一起重新驗一次。</p>`,
      choice('這個專案裡，404、400、409、500 分別代表？', ['找不到、資料有問題、庫存衝突、後端意外', '全部都是成功', '全部都是同一個意思'], 0, '狀態碼是後端和前端之間的共同語言。')),
  ], {
    brief: '第 8 步（最後一步）：做 <code>GET /summary</code>，回傳 <code>{ types, totalStock, soldOut }</code>：types 是票的種類數、totalStock 是全部庫存加總、soldOut 是庫存為 0 的票名字陣列。賣票後再查，數字要跟著更新。前面的功能都要還能用。',
    hint: 'reduce 加總庫存（初始值 0），filter + map 找出賣完的票名。放在其他路由旁邊就可以。',
    steps: [
      `打：${k("app.get('/summary', (req, res) => {")}<br>為什麼：統計也是一支 GET API。`,
      `下一行打：${k('const totalStock = tickets.reduce((sum, t) => sum + t.stock, 0);')}<br>為什麼：reduce 一邊走一邊累加，最後的 0 是起點。每次都是即時算，所以賣票後會變。`,
      `下一行打：${k('const soldOut = tickets.filter((t) => t.stock === 0).map((t) => t.name);')}<br>為什麼：先挑出庫存 0 的票，再把每張票換成名字。`,
      `下一行打：${k('res.json({ types: tickets.length, totalStock, soldOut });')} 再 ${k('});')} 關起來。<br>為什麼：把三項統計一起回傳。`,
      `按「送出檢查」。<br>為什麼：它會先查統計，再賣票，再查統計一次，還會重新驗證前面所有功能。最常見的錯：reduce 忘了初始值 ${k('0')}，或 soldOut 忘了 ${k('.map(...)')}，回傳了整張票。`,
    ],
    starter: S8, solution: C8,
    tests: `${T_FUNCS}
check(output().includes('共 3 種票'), '第 2 步的 console.log 要保留');
const s1 = await app.handle('GET', '/summary');
check(s1.status === 200 && s1.body, 'GET /summary 應該回 200 和統計物件，目前是 ' + s1.status);
if (s1.body) {
  check(s1.body.types === 3, 'types 應該是 3');
  check(s1.body.totalStock === 15, 'totalStock 應該是 15（5 + 0 + 10），目前是 ' + s1.body.totalStock);
  check(JSON.stringify(s1.body.soldOut) === JSON.stringify(['交響樂之夜']), 'soldOut 應該是 ["交響樂之夜"]（名字陣列），目前是 ' + JSON.stringify(s1.body.soldOut));
}
${T_LIST}
${T_ONE}
${T_POST}
const buyAll = await sell(1, { qty: 5 });
check(buyAll.status === 200 && buyAll.body && buyAll.body.ticket && buyAll.body.ticket.stock === 0, '買光 5 張星光演唱會應該成功（回 200，庫存 0）');
const s2 = await app.handle('GET', '/summary');
if (s2.body) {
  check(s2.body.totalStock === 10, '賣完之後 totalStock 應該變成 10，目前是 ' + s2.body.totalStock);
  check(JSON.stringify(s2.body.soldOut) === JSON.stringify(['星光演唱會', '交響樂之夜']), '賣完之後 soldOut 應該是 ["星光演唱會","交響樂之夜"]，目前是 ' + JSON.stringify(s2.body.soldOut));
}
check((await sell(1, { qty: 1 })).status === 409, '已經賣光的票再賣應該回 409');
const orig = sellTicket;
let patched = true;
try { sellTicket = () => { throw new Error('boom'); }; } catch (e) { patched = false; check(false, '請用 function sellTicket(id, qty) { ... } 的寫法（不要用 const）'); }
if (patched) {
  const boom = await sell(3, { qty: 1 });
  check(boom.status === 500 && boom.body && boom.body.error === '伺服器出錯了', '意外的錯誤應該回 500 和 { error: \\'伺服器出錯了\\' }，目前是 ' + boom.status);
  sellTicket = orig;
}
let e3 = null; try { sellTicket(99, 1); } catch (e) { e3 = e; }
check(e3 && e3.message === '找不到票', "sellTicket(99, 1) 應該丟出 new Error('找不到票')");`,
  }),
];

const QUIZ = [
  choice('做一個後端小專案，比較好的做法是？', ['先做最小的一件事，一步一步加功能並逐步測試', '一次把所有功能寫完再來測', '先寫統計，再想有哪些資料'], 0),
  choice('前端送來的 POST 資料有問題（例如數量是 -3），後端該回？', ['400', '404', '500'], 0),
  choice('網址 /tickets/2 的 <code>req.params.id</code> 是什麼型別，比對數字前要？', ['文字，要先 Number()', '數字，可以直接比', '陣列，要先取第一個'], 0),
  choice('<code>try / catch</code> 在這個專案用來？', ['接住錯誤，已知的錯回對應狀態碼，意外回 500', '讓程式跑得更快', '儲存資料'], 0),
];

const EVENT = { npc: 'pm', mood: 'happy', text: '我們需要一個「票務庫存小 API」給前端用：要能列票、查票、賣票，而且票賣完就不能再賣。你一個人從頭做得完嗎？',
  options: [{ label: '可以，我先寫最小的函式，再一步一步加路由、驗證與錯誤處理，每步都測試', fx: { quality: 10, team: 6 } }, { label: '我一次全寫完再來測，應該不會有問題', fx: { quality: -6, stress: 8 } }] };

export const GUIDED = {
  chapter: { id: 'nd-cg', title: '第三章　手把手專案：票務庫存小 API（從空白做到完成）', lessons: ND_UNITS, quiz: QUIZ, projects: [], event: 'nd-cg' },
  event: EVENT,
};
