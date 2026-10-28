// Node.js 後端、Python 課程（格式同 courses-fe.js）。練習是真的寫程式、真的執行，再用 tests 檢查結果。
// tests 用 check(條件, 訊息)、output()（目前印出的文字）；JS 的 tests 可以用 await，也能直接用玩家寫的變數與函式。

const pre = (code) => `<pre>${code.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>`;
const choice = (q, options, answer, why) => ({ type: 'choice', q, options, answer, why });
const js = (o) => ({ kind: 'code', lang: 'js', ...o });
const py = (o) => ({ kind: 'code', lang: 'py', ...o });

/* ============================ Node.js ============================ */
const N1 = {
  id: 'nd1', title: '第 1 堂　JavaScript 也能寫後端',
  steps: [
    { say: `<p><b>後端</b>是跑在伺服器上的程式：前端畫面要看到哪些活動、哪些座位被訂走，都是向後端要資料。<b>Node.js</b> 讓你用同一個 JavaScript，在瀏覽器以外的地方執行。</p>`,
      check: choice('Node.js 是什麼？', ['讓 JavaScript 能在瀏覽器外執行的環境', '一種資料庫', '一種 CSS 框架'], 0, '對，所以前端會的 JavaScript，後端也能用。') },
    { say: `<p>後端沒有畫面，要看結果就用 <code>console.log</code> 把東西印出來（和 Python 的 print 一樣）：</p>${pre("const seats = ['A1', 'A2'];\nconsole.log('座位數：', seats.length);")}`,
      check: choice('想把變數 total 的值印出來看，要寫？', ['console.log(total)', 'print(total)', 'alert(total)'], 0, 'Node.js 沒有畫面，用 console.log。') },
    { say: `<p>程式變大就要分檔案。用 <code>module.exports</code> 把東西「送出去」，另一個檔案用 <code>require</code> 「拿進來」：</p>${pre("// price.js\nmodule.exports = { ticket: 3800 };\n\n// app.js\nconst { ticket } = require('./price');")}<p>Node.js 內建了 <code>fs</code>（讀寫檔案）、<code>path</code> 等模組，也是用 require 載入。</p>`,
      check: choice('<code>require(\'fs\')</code> 在做什麼？', ['載入 Node.js 內建的檔案模組', '安裝一個網站', '刪除一個檔案'], 0, 'require 就是「拿進來用」。') },
  ],
  final: js({
    brief: '寫一個函式 <code>price(qty)</code>，回傳 qty 張票的總價（每張 3800 元）。再用 <code>console.log</code> 印出 <code>price(2)</code> 的結果。',
    hint: '<code>function price(qty) { return qty * 3800; }</code>，然後 <code>console.log(price(2));</code>。寫完按「送出檢查」。',
    starter: '// TODO 1: 寫 price(qty)，回傳 qty 張票的總價（每張 3800）\n\n// TODO 2: 用 console.log 印出 price(2)\n',
    solution: 'function price(qty) {\n  return qty * 3800;\n}\n\nconsole.log(price(2));\n',
    tests: "check(typeof price === 'function', '要有一個叫 price 的函式');\nif (typeof price === 'function') { check(price(1) === 3800, 'price(1) 應該是 3800'); check(price(2) === 7600, 'price(2) 應該是 7600'); }\ncheck(output().includes('7600'), '要用 console.log 印出 price(2) 的結果（7600）');",
  }),
};
const N2 = {
  id: 'nd2', title: '第 2 堂　非同步：等資料回來',
  steps: [
    { say: `<p>查資料庫、打外部 API 都要<b>等</b>。程式不會傻傻停著，而是先做別的事，資料回來再接著做——這叫<b>非同步</b>。等待中的結果用 <b>Promise</b>（承諾）表示。</p>`,
      check: choice('為什麼後端常需要非同步？', ['因為查資料庫、呼叫 API 都要等待', '因為 JavaScript 不能同步', '因為這樣比較好看'], 0, '等待時不卡住其他請求，伺服器才撐得住很多人同時搶票。') },
    { say: `<p><code>async</code> / <code>await</code> 讓非同步看起來像一般的程式，一行一行往下讀：</p>${pre("async function getSeat() {\n  const seat = await db.find('A1'); // 等結果回來\n  return seat;\n}")}<p><code>await</code> 只能寫在 <code>async</code> 函式裡面。</p>`,
      check: choice('await 要寫在哪裡？', ['async 函式裡面', '任何地方都可以', '只能寫在檔案最前面'], 0, '要在 async 函式裡。') },
    { say: `<p>等待可能<b>失敗</b>（例如找不到座位）。失敗時會丟出錯誤，用 <code>try / catch</code> 接住，程式才不會整個壞掉：</p>${pre("try {\n  const seat = await db.find('Z9');\n} catch (err) {\n  console.log('出錯：', err.message);\n}")}`,
      check: choice('await 的那件事失敗了，要怎麼處理？', ['用 try / catch 接住', '不用管', '把電腦重開'], 0, '接住錯誤，才能回一個友善的訊息。') },
  ],
  final: js({
    brief: '寫 <code>async function getSeatName(id)</code>：用 <code>await fakeDb(id)</code> 查座位，成功就回傳座位的 <code>id</code>；失敗（找不到）就回傳文字「查無座位」。',
    hint: '<code>try { const seat = await fakeDb(id); return seat.id; } catch (err) { return \'查無座位\'; }</code>',
    starter: "// 假資料庫：只有 A1 查得到，其他都會失敗\nconst fakeDb = (id) => new Promise((ok, no) => setTimeout(() => (id === 'A1' ? ok({ id, sold: false }) : no(new Error('找不到座位'))), 50));\n\n// TODO: 寫 async function getSeatName(id)\n",
    solution: "const fakeDb = (id) => new Promise((ok, no) => setTimeout(() => (id === 'A1' ? ok({ id, sold: false }) : no(new Error('找不到座位'))), 50));\n\nasync function getSeatName(id) {\n  try {\n    const seat = await fakeDb(id);\n    return seat.id;\n  } catch (err) {\n    return '查無座位';\n  }\n}\n",
    must: [{ re: /await/, msg: '請用 await 等查詢結果' }],
    tests: "check(typeof getSeatName === 'function', '要有一個叫 getSeatName 的函式');\nif (typeof getSeatName === 'function') {\n  check((await getSeatName('A1')) === 'A1', \"查 A1 應該回傳 'A1'\");\n  check((await getSeatName('Z9')) === '查無座位', \"查 Z9 失敗時應該回傳 '查無座位'\");\n}",
  }),
};
const N3 = {
  id: 'nd3', title: '第 3 堂　整理資料：陣列與物件',
  steps: [
    { say: `<p>後端的日常就是整理資料。資料常是「物件組成的陣列」：</p>${pre("const seats = [\n  { id: 'A1', sold: false, price: 3800 },\n  { id: 'A2', sold: true, price: 3800 },\n];")}<p><code>filter</code> 挑出符合條件的，<code>map</code> 把每一筆換成別的，<code>find</code> 找出第一筆。</p>`,
      check: choice('<code>seats.filter((s) => !s.sold)</code> 會得到？', ['還沒售出的座位（新陣列）', '第一個座位', '座位的數量'], 0, 'filter 回傳符合條件的新陣列。') },
    { say: `<p><code>map</code> 把每一筆資料換成另一種樣子，<code>reduce</code> 把一整排合成一個值（例如總和）：</p>${pre("seats.map((s) => s.id);        // ['A1', 'A2']\nseats.reduce((sum, s) => sum + s.price, 0); // 7600")}`,
      check: choice('<code>[1, 2, 3].map((n) => n * 2)</code> 會得到？', ['[2, 4, 6]', '12', '[1, 2, 3]'], 0, 'map 回傳換過的新陣列。') },
    { say: `<p>後端和前端交換資料用 <b>JSON</b>（長得像物件的文字）。<code>JSON.stringify</code> 把物件變成文字，<code>JSON.parse</code> 變回來：</p>${pre("const text = JSON.stringify({ id: 'A1' }); // '{\"id\":\"A1\"}'\nJSON.parse(text).id;                         // 'A1'")}`,
      check: choice('<code>JSON.parse(text)</code> 在做什麼？', ['把 JSON 文字變回物件', '把物件變成文字', '刪除 JSON'], 0, 'parse = 解析文字。') },
  ],
  final: js({
    brief: '寫兩個函式：<code>availableIds(seats)</code> 回傳「還沒售出」座位的 id 陣列；<code>revenue(seats)</code> 回傳「已售出」座位的價格總和。',
    hint: '<code>seats.filter((s) =&gt; !s.sold).map((s) =&gt; s.id)</code>；<code>seats.filter((s) =&gt; s.sold).reduce((sum, s) =&gt; sum + s.price, 0)</code>',
    starter: "const seats = [\n  { id: 'A1', sold: false, price: 3800 },\n  { id: 'A2', sold: true, price: 3800 },\n  { id: 'A3', sold: true, price: 2800 },\n];\n\n// TODO 1: availableIds(seats) → 沒售出的 id 陣列\n// TODO 2: revenue(seats) → 已售出座位的價格總和\n",
    solution: "const seats = [\n  { id: 'A1', sold: false, price: 3800 },\n  { id: 'A2', sold: true, price: 3800 },\n  { id: 'A3', sold: true, price: 2800 },\n];\n\nconst availableIds = (list) => list.filter((s) => !s.sold).map((s) => s.id);\nconst revenue = (list) => list.filter((s) => s.sold).reduce((sum, s) => sum + s.price, 0);\n",
    tests: "check(typeof availableIds === 'function' && typeof revenue === 'function', '要有 availableIds 和 revenue 兩個函式');\nif (typeof availableIds === 'function') check(JSON.stringify(availableIds(seats)) === '[\"A1\"]', 'availableIds(seats) 應該是 [\"A1\"]');\nif (typeof revenue === 'function') check(revenue(seats) === 6600, 'revenue(seats) 應該是 6600（3800 + 2800）');\nif (typeof availableIds === 'function') check(JSON.stringify(availableIds([{ id: 'B1', sold: false, price: 1 }, { id: 'B2', sold: false, price: 1 }])) === '[\"B1\",\"B2\"]', '換一批資料也要對：兩個都沒售出時應該是 [\"B1\",\"B2\"]');",
  }),
};
const N4 = {
  id: 'nd4', title: '第 4 堂　Express：做出第一支 API',
  steps: [
    { say: `<p><b>API</b> 就是前端和後端約定好的「窗口」：前端說「給我活動列表」，後端回一包 JSON。<b>Express</b> 是最常用的 Node.js 工具，用「路由」定義每個窗口：</p>${pre("app.get('/events', (req, res) => {\n  res.json([{ id: 1, title: '星光演唱會' }]);\n});")}`,
      check: choice('<code>app.get(\'/events\', ...)</code> 的意思是？', ['有人用 GET 要 /events 時，執行後面的函式', '把 events 資料刪掉', '建立一個叫 events 的資料庫'], 0, '路由 = 網址 + 方法 + 處理函式。') },
    { say: `<p>網址可以帶參數：<code>/events/:id</code> 的 <code>:id</code> 會出現在 <code>req.params.id</code>，而且<b>是文字</b>，要比對數字時要先 <code>Number()</code>。網址 <code>?keyword=星</code> 的部分在 <code>req.query</code>：</p>${pre("app.get('/events/:id', (req, res) => {\n  const id = Number(req.params.id);\n  ...\n});")}`,
      check: choice('<code>/events/2</code> 的 <code>req.params.id</code> 是什麼型別？', ['文字 "2"', '數字 2', '陣列'], 0, '網址裡的東西一律是文字。') },
    { say: `<p>找不到東西時，要回 <b>404</b> 狀態碼告訴前端，用 <code>res.status(404).json(...)</code>。常見狀態碼：<b>200</b> 成功、<b>400</b> 你傳錯了、<b>404</b> 找不到、<b>500</b> 後端壞了。</p>`,
      check: choice('前端要的活動不存在，後端應該回？', ['404', '200', '500'], 0, '404 = 找不到。') },
  ],
  final: js({
    brief: '做兩支 API：<code>GET /events</code> 回傳全部活動；<code>GET /events/:id</code> 回傳該活動，找不到就回 404 和 <code>{ error: \'找不到活動\' }</code>。',
    hint: '<code>events.find((e) =&gt; e.id === Number(req.params.id))</code>。找不到時 <code>res.status(404).json({ error: \'找不到活動\' })</code>。',
    starter: "const express = require('express');\nconst app = express();\nconst events = [\n  { id: 1, title: '星光巡迴演唱會' },\n  { id: 2, title: '交響樂之夜' },\n];\n\n// TODO 1: GET /events 回傳全部活動\n// TODO 2: GET /events/:id 回傳該活動；找不到回 404 與 { error: '找不到活動' }\n",
    solution: "const express = require('express');\nconst app = express();\nconst events = [\n  { id: 1, title: '星光巡迴演唱會' },\n  { id: 2, title: '交響樂之夜' },\n];\n\napp.get('/events', (req, res) => res.json(events));\n\napp.get('/events/:id', (req, res) => {\n  const found = events.find((e) => e.id === Number(req.params.id));\n  if (!found) return res.status(404).json({ error: '找不到活動' });\n  res.json(found);\n});\n",
    tests: "const a = await app.handle('GET', '/events');\ncheck(a.status === 200 && Array.isArray(a.body) && a.body.length === 2, 'GET /events 應該回傳 2 個活動的陣列');\nconst b = await app.handle('GET', '/events/2');\ncheck(b.body && b.body.title === '交響樂之夜', 'GET /events/2 應該回傳「交響樂之夜」');\nconst c = await app.handle('GET', '/events/99');\ncheck(c.status === 404, '找不到的活動應該回 404，目前是 ' + c.status);\ncheck(c.body && c.body.error === '找不到活動', '404 要附上 { error: \\'找不到活動\\' }');",
  }),
};
const N5 = {
  id: 'nd5', title: '第 5 堂　POST、驗證與搶票衝突',
  steps: [
    { say: `<p>前端「送東西給後端」（例如訂位）用 <b>POST</b>，內容放在 <code>req.body</code>。要先加上 <code>app.use(express.json())</code>，Express 才看得懂 JSON：</p>${pre("app.use(express.json());\napp.post('/book', (req, res) => {\n  const { seat } = req.body;\n  ...\n});")}`,
      check: choice('<code>req.body</code> 要能用，需要先加？', ['app.use(express.json())', 'app.get(\'/body\')', 'require(\'body\')'], 0, '告訴 Express 要解析 JSON。') },
    { say: `<p><b>永遠不要相信前端傳來的資料</b>。缺欄位、格式錯，要回 <b>400</b> 和說明，不要直接當作沒事：</p>${pre("if (!seat) {\n  return res.status(400).json({ error: '請選擇座位' });\n}")}`,
      check: choice('前端沒傳必填的欄位，後端應該回？', ['400', '200', '404'], 0, '400 = 請求有問題。') },
    { say: `<p>搶票最怕<b>兩個人同時訂到同一個座位</b>。後端要自己檢查，已經被訂走的回 <b>409</b>（衝突），成功建立回 <b>201</b>。這也是前端驗證擋不住、一定要後端做的原因。</p>`,
      check: choice('座位已被別人訂走，後端應該回？', ['409', '201', '404'], 0, '409 = 衝突。') },
  ],
  final: js({
    brief: '做 <code>POST /book</code>（body：<code>{ seat }</code>）：沒傳 seat → 400；座位已在 <code>booked</code> 裡 → 409；否則加進 booked，回 201 和 <code>{ ok: true }</code>。',
    hint: '<code>booked.has(seat)</code> 檢查，<code>booked.add(seat)</code> 訂位。順序：先檢查有沒有傳、再檢查有沒有被訂走、最後才訂位。',
    starter: "const express = require('express');\nconst app = express();\napp.use(express.json());\nconst booked = new Set(['A2']); // 已經被訂走的座位\n\n// TODO: POST /book\n",
    solution: "const express = require('express');\nconst app = express();\napp.use(express.json());\nconst booked = new Set(['A2']);\n\napp.post('/book', (req, res) => {\n  const { seat } = req.body;\n  if (!seat) return res.status(400).json({ error: '請選擇座位' });\n  if (booked.has(seat)) return res.status(409).json({ error: '座位已被訂走' });\n  booked.add(seat);\n  res.status(201).json({ ok: true });\n});\n",
    tests: "check((await app.handle('POST', '/book', {})).status === 400, '沒傳 seat 應該回 400');\ncheck((await app.handle('POST', '/book', { seat: 'A2' })).status === 409, '已被訂走的 A2 應該回 409');\nconst ok = await app.handle('POST', '/book', { seat: 'A1' });\ncheck(ok.status === 201 && ok.body && ok.body.ok === true, '訂 A1 應該回 201 和 { ok: true }');\ncheck((await app.handle('POST', '/book', { seat: 'A1' })).status === 409, 'A1 被訂走後，再訂一次應該回 409（不能重複訂位）');",
  }),
};

const ND_QUIZ1 = [
  choice('<code>require(\'./price\')</code> 的用途是？', ['載入另一個檔案或模組', '安裝電腦軟體', '重新整理網頁'], 0),
  choice('<code>async</code> 函式回傳的是？', ['Promise', '一定是文字', '什麼都不會回傳'], 0),
  choice('<code>[1, 2, 3, 4].filter((n) => n % 2 === 0)</code> 會得到？', ['[2, 4]', '[1, 3]', '6'], 0),
  choice('<code>await</code> 通常搭配什麼使用？', ['async 函式', 'CSS 檔案', 'HTML 標籤'], 0),
];
const ND_QUIZ2 = [
  choice('前端要「取得」活動列表，通常用哪種方法？', ['GET', 'POST', 'DELETE'], 0),
  choice('後端找不到要的資料，應該回哪個狀態碼？', ['404', '201', '409'], 0),
  choice('兩個人搶同一個座位，後來的人應該得到？', ['409（衝突）', '201（建立成功）', '200（沒事）'], 0),
  choice('<code>req.params.id</code> 取到的值是什麼型別？', ['文字', '數字', '布林值'], 0),
];

const ND_P1 = js({
  brief: '專案：訂單統計。寫 <code>totalByEvent(orders)</code>，把訂單依活動名稱加總張數，回傳像 <code>{ 星光: 5, 交響: 1 }</code> 的物件。',
  hint: '<code>const result = {};</code>，走過每筆訂單，<code>result[o.event] = (result[o.event] || 0) + o.qty;</code>',
  starter: "const orders = [\n  { event: '星光', qty: 2 },\n  { event: '交響', qty: 1 },\n  { event: '星光', qty: 3 },\n];\n\n// TODO: 寫 totalByEvent(orders)\n",
  solution: "const orders = [\n  { event: '星光', qty: 2 },\n  { event: '交響', qty: 1 },\n  { event: '星光', qty: 3 },\n];\n\nfunction totalByEvent(list) {\n  const result = {};\n  for (const o of list) result[o.event] = (result[o.event] || 0) + o.qty;\n  return result;\n}\n",
  tests: "check(typeof totalByEvent === 'function', '要有 totalByEvent 函式');\nif (typeof totalByEvent === 'function') {\n  const r = totalByEvent(orders);\n  check(r['星光'] === 5, '星光應該是 5（2 + 3），目前是 ' + r['星光']);\n  check(r['交響'] === 1, '交響應該是 1');\n  check(JSON.stringify(totalByEvent([])) === '{}', '沒有訂單時應該回傳空物件 {}');\n}",
});
const ND_P2 = js({
  brief: '專案：活動搜尋 API。<code>GET /events?keyword=星</code> 回傳標題包含關鍵字的活動；沒帶 keyword 就回傳全部。',
  hint: '關鍵字在 <code>req.query.keyword</code>。<code>events.filter((e) =&gt; e.title.includes(keyword))</code>。沒帶 keyword 時是 undefined。',
  starter: "const express = require('express');\nconst app = express();\nconst events = [\n  { id: 1, title: '星光巡迴演唱會' },\n  { id: 2, title: '交響樂之夜' },\n  { id: 3, title: '星空露天音樂祭' },\n];\n\napp.get('/events', (req, res) => {\n  res.json(events); // TODO: 依 req.query.keyword 篩選\n});\n",
  solution: "const express = require('express');\nconst app = express();\nconst events = [\n  { id: 1, title: '星光巡迴演唱會' },\n  { id: 2, title: '交響樂之夜' },\n  { id: 3, title: '星空露天音樂祭' },\n];\n\napp.get('/events', (req, res) => {\n  const { keyword } = req.query;\n  res.json(keyword ? events.filter((e) => e.title.includes(keyword)) : events);\n});\n",
  tests: "const n = async (u) => (await app.handle('GET', u)).body.length;\ncheck((await n('/events')) === 3, '沒帶 keyword 應該回傳 3 個活動');\ncheck((await n('/events?keyword=' + encodeURIComponent('星'))) === 2, 'keyword=星 應該回傳 2 個活動');\ncheck((await n('/events?keyword=' + encodeURIComponent('交響'))) === 1, 'keyword=交響 應該回傳 1 個活動');\ncheck((await n('/events?keyword=' + encodeURIComponent('不存在'))) === 0, '沒有符合的應該回傳空陣列');",
});
const ND_P3 = js({
  brief: '專案：買票 API。<code>POST /seats/:id/buy</code>：座位不存在 → 404；已售出 → 409；否則把它改成已售出，回 200 和該座位。',
  hint: '先 <code>seats.find((s) =&gt; s.id === req.params.id)</code>（這次 id 是文字，不用轉數字）。找不到 404，<code>seat.sold</code> 為 true 就 409，否則 <code>seat.sold = true</code>。',
  starter: "const express = require('express');\nconst app = express();\nconst seats = [\n  { id: 'A1', sold: false },\n  { id: 'A2', sold: true },\n];\n\n// TODO: POST /seats/:id/buy\n",
  solution: "const express = require('express');\nconst app = express();\nconst seats = [\n  { id: 'A1', sold: false },\n  { id: 'A2', sold: true },\n];\n\napp.post('/seats/:id/buy', (req, res) => {\n  const seat = seats.find((s) => s.id === req.params.id);\n  if (!seat) return res.status(404).json({ error: '沒有這個座位' });\n  if (seat.sold) return res.status(409).json({ error: '已售出' });\n  seat.sold = true;\n  res.json(seat);\n});\n",
  tests: "check((await app.handle('POST', '/seats/Z9/buy')).status === 404, '不存在的座位應該回 404');\ncheck((await app.handle('POST', '/seats/A2/buy')).status === 409, '已售出的 A2 應該回 409');\nconst r = await app.handle('POST', '/seats/A1/buy');\ncheck(r.status === 200 && r.body && r.body.sold === true, '買 A1 應該回 200，而且座位變成已售出');\ncheck((await app.handle('POST', '/seats/A1/buy')).status === 409, '買完再買一次應該回 409');",
});

/* ============================ Python ============================ */
const P1 = {
  id: 'py1', title: '第 1 堂　Python 的長相',
  steps: [
    { say: `<p>Python 是很好讀的語言，後端、資料分析、自動化都常用。用 <code>print</code> 印出東西，變數<b>不用宣告型別</b>，直接取名字就好：</p>${pre("price = 3800\ntitle = '星光演唱會'\nprint(title, price)")}`,
      check: choice('Python 印出東西用？', ['print()', 'console.log()', 'echo()'], 0, '一個 print 就搞定。') },
    { say: `<p>字串前面加 <code>f</code>，就能用 <code>{ }</code> 把變數塞進去（f-string）：</p>${pre("qty = 2\nprint(f'買了 {qty} 張，共 {qty * 3800} 元')")}`,
      check: choice('<code>f\'共 {price} 元\'</code> 會把什麼放進字串？', ['變數 price 的值', '文字 price', '什麼都不會'], 0, '大括號裡的會被算出來。') },
    { say: `<p>Python 最特別的是<b>縮排</b>：同一塊程式要往右縮 4 個空格，沒有大括號。<code>#</code> 後面是註解：</p>${pre("if price > 3000:\n    print('比較貴')   # 這行縮排，表示屬於 if")}`,
      check: choice('Python 用什麼表示「這幾行是同一塊」？', ['縮排', '大括號 { }', '分號 ;'], 0, '縮排不對就會出錯，要特別小心。') },
  ],
  final: py({
    brief: '已經有 <code>price</code> 和 <code>qty</code>。請算出總價存到 <code>total</code>，再用 <code>print</code> 和 f-string 印出「總價 7600」（數字要用變數）。',
    hint: '<code>total = price * qty</code>，然後 <code>print(f\'總價 {total}\')</code>。',
    starter: 'price = 3800\nqty = 2\n\n# TODO 1: 算出總價，存到 total\n\n# TODO 2: 用 print 和 f-string 印出「總價 7600」\n',
    solution: "price = 3800\nqty = 2\n\ntotal = price * qty\nprint(f'總價 {total}')\n",
    tests: "check('total' in dir() and total == 7600, '變數 total 應該是 7600')\ncheck('總價 7600' in output(), '要印出「總價 7600」')",
  }),
};
const P2 = {
  id: 'py2', title: '第 2 堂　list 與 dict',
  steps: [
    { say: `<p><b>list</b>（清單）用中括號，裝一排東西；從 0 開始算位置：</p>${pre("seats = ['A1', 'A2']\nseats.append('A3')   # 加到最後\nprint(seats[0], len(seats))  # A1 3")}`,
      check: choice('<code>seats = [\'A1\', \'A2\']</code>，<code>seats[0]</code> 是？', ['A1', 'A2', '0'], 0, '位置從 0 開始算。') },
    { say: `<p><b>dict</b>（字典）用大括號，一個「名字」對一個「值」，像 JavaScript 的物件：</p>${pre("event = {'title': '星光', 'price': 3800}\nprint(event['title'])\nevent['city'] = '台北'   # 新增欄位")}`,
      check: choice('<code>event[\'price\']</code> 是在做什麼？', ['用名字取出 dict 裡的值', '把 event 刪掉', '建立新的 list'], 0, '用 key（名字）找值。') },
    { say: `<p>用 <code>for</code> 一個一個走過 list，記得<b>冒號</b>和縮排：</p>${pre("for s in seats:\n    print(s)")}`,
      check: choice('<code>for s in seats:</code> 下一行要怎麼寫？', ['往右縮排', '不用縮排', '加分號'], 0, '冒號後面的內容要縮排。') },
  ],
  final: py({
    brief: '在 <code>seats</code> 清單最後加上 <code>\'A3\'</code>；在 <code>event</code> 字典新增一個欄位 <code>\'city\'</code>，值是 <code>\'台北\'</code>。',
    hint: '<code>seats.append(\'A3\')</code>；<code>event[\'city\'] = \'台北\'</code>。',
    starter: "seats = ['A1', 'A2']\nevent = {'title': '星光演唱會', 'price': 3800}\n\n# TODO 1: 把 'A3' 加到 seats 最後面\n\n# TODO 2: 在 event 新增 'city'，值是 '台北'\n",
    solution: "seats = ['A1', 'A2']\nevent = {'title': '星光演唱會', 'price': 3800}\n\nseats.append('A3')\nevent['city'] = '台北'\n",
    tests: "check(seats == ['A1', 'A2', 'A3'], \"seats 應該是 ['A1', 'A2', 'A3']，目前是 \" + str(seats))\ncheck(event.get('city') == '台北', \"event 應該有 'city': '台北'\")\ncheck(event.get('title') == '星光演唱會' and event.get('price') == 3800, '原本的 title 和 price 要保留')",
  }),
};
const P3 = {
  id: 'py3', title: '第 3 堂　函式與 if',
  steps: [
    { say: `<p>用 <code>def</code> 定義函式，<code>return</code> 回傳結果（記得冒號和縮排）：</p>${pre("def total(price, qty):\n    return price * qty\n\nprint(total(3800, 2))")}`,
      check: choice('定義函式要用哪個關鍵字？', ['def', 'function', 'func'], 0, 'Python 是 def。') },
    { say: `<p><code>if / elif / else</code> 讓程式做判斷（elif 就是「不然如果」）：</p>${pre("if age < 12:\n    print('兒童票')\nelif age >= 65:\n    print('敬老票')\nelse:\n    print('全票')")}`,
      check: choice('<code>elif</code> 是什麼意思？', ['前面的條件不成立時，再檢查這個條件', '結束程式', '重複執行'], 0, 'else if 的縮寫。') },
    { say: `<p>比較用 <code>==</code>（相等）、<code>!=</code>、<code>&lt;</code>、<code>&gt;=</code>；多個條件用 <code>and</code>、<code>or</code>、<code>not</code>（是英文字，不是符號）。</p>${pre("if age >= 12 and age < 65:\n    print('全票')")}`,
      check: choice('「兩個條件都要成立」用？', ['and', '&&', 'both'], 0, 'Python 用英文單字 and。') },
  ],
  final: py({
    brief: '寫 <code>ticket_price(age)</code>：未滿 12 歲回傳 1900；65 歲以上回傳 2500；其他回傳 3800。',
    hint: '<code>if age &lt; 12: return 1900</code>，<code>elif age &gt;= 65: return 2500</code>，<code>else: return 3800</code>。',
    starter: '# TODO: 寫 ticket_price(age)\n',
    solution: 'def ticket_price(age):\n    if age < 12:\n        return 1900\n    elif age >= 65:\n        return 2500\n    else:\n        return 3800\n',
    tests: "check('ticket_price' in dir(), '要有 ticket_price 這個函式')\nif 'ticket_price' in dir():\n    for a, p in [(5, 1900), (11, 1900), (12, 3800), (30, 3800), (64, 3800), (65, 2500), (80, 2500)]:\n        check(ticket_price(a) == p, f'{a} 歲應該是 {p}，目前是 {ticket_price(a)}')",
  }),
};
const P4 = {
  id: 'py4', title: '第 4 堂　迴圈與推導式',
  steps: [
    { say: `<p><code>range(n)</code> 產生 0 到 n-1 的數字，常和 <code>for</code> 一起用：</p>${pre("for i in range(3):\n    print(i)   # 0 1 2")}`,
      check: choice('<code>range(3)</code> 會走過哪些數字？', ['0, 1, 2', '1, 2, 3', '0, 1, 2, 3'], 0, '從 0 開始，不包含 3。') },
    { say: `<p><b>推導式</b>（comprehension）一行就能從舊 list 做出新 list，Python 很愛用：</p>${pre("nums = [1, 2, 3, 4]\ndouble = [n * 2 for n in nums]          # [2, 4, 6, 8]\nevens = [n for n in nums if n % 2 == 0] # [2, 4]")}`,
      check: choice('<code>[n * 2 for n in [1, 2, 3]]</code> 會得到？', ['[2, 4, 6]', '[1, 2, 3]', '12'], 0, '每個都乘以 2。') },
    { say: `<p>內建好用工具：<code>sum()</code> 加總、<code>len()</code> 數量、<code>sorted()</code> 排序、<code>max()</code> / <code>min()</code>：</p>${pre("sum([3800, 2800])   # 6600\nlen(['A1', 'A2'])    # 2")}`,
      check: choice('想知道 list 有幾個東西，用？', ['len()', 'sum()', 'count()'], 0, 'len = length。') },
  ],
  final: py({
    brief: '寫兩個函式：<code>sold_ids(seats)</code> 回傳「已售出」座位的 id 清單；<code>revenue(seats)</code> 回傳已售出座位的價格總和。（建議用推導式和 sum）',
    hint: '<code>[s[\'id\'] for s in seats if s[\'sold\']]</code>；<code>sum(s[\'price\'] for s in seats if s[\'sold\'])</code>',
    starter: "seats = [\n    {'id': 'A1', 'sold': False, 'price': 3800},\n    {'id': 'A2', 'sold': True, 'price': 3800},\n    {'id': 'A3', 'sold': True, 'price': 2800},\n]\n\n# TODO: 寫 sold_ids(seats) 和 revenue(seats)\n",
    solution: "seats = [\n    {'id': 'A1', 'sold': False, 'price': 3800},\n    {'id': 'A2', 'sold': True, 'price': 3800},\n    {'id': 'A3', 'sold': True, 'price': 2800},\n]\n\ndef sold_ids(seats):\n    return [s['id'] for s in seats if s['sold']]\n\ndef revenue(seats):\n    return sum(s['price'] for s in seats if s['sold'])\n",
    tests: "check('sold_ids' in dir() and 'revenue' in dir(), '要有 sold_ids 和 revenue 兩個函式')\nif 'sold_ids' in dir():\n    check(sold_ids(seats) == ['A2', 'A3'], \"sold_ids(seats) 應該是 ['A2', 'A3']\")\n    check(sold_ids([{'id': 'B1', 'sold': False, 'price': 1}]) == [], '都沒售出時應該是空清單 []')\nif 'revenue' in dir():\n    check(revenue(seats) == 6600, 'revenue(seats) 應該是 6600')",
  }),
};
const P5 = {
  id: 'py5', title: '第 5 堂　出錯了怎麼辦：例外',
  steps: [
    { say: `<p>程式會遇到錯誤（例如把 0 當除數）。用 <code>try / except</code> 接住，程式才不會整個停下來：</p>${pre("try:\n    n = int('abc')\nexcept ValueError:\n    print('這不是數字')")}`,
      check: choice('<code>try / except</code> 是用來？', ['接住錯誤，讓程式繼續', '讓程式跑更快', '印出文字'], 0, '像 JavaScript 的 try / catch。') },
    { say: `<p>自己也能用 <code>raise</code> 丟出錯誤，提醒呼叫的人「這樣不行」：</p>${pre("def check_qty(qty):\n    if qty <= 0:\n        raise ValueError('張數要大於 0')")}`,
      check: choice('想主動丟出一個錯誤，用？', ['raise', 'throw', 'error'], 0, 'Python 用 raise。') },
    { say: `<p><code>set</code>（集合）不會有重複的東西，很適合記錄「哪些座位被訂走」。<code>in</code> 檢查在不在裡面，<code>.add()</code> 加進去：</p>${pre("booked = {'A2'}\n'A2' in booked   # True\nbooked.add('A3')")}`,
      check: choice('想檢查 <code>\'A1\'</code> 有沒有在集合 <code>booked</code> 裡，用？', ["'A1' in booked", 'booked.has(A1)', 'booked == A1'], 0, 'in 就是「在不在裡面」。') },
  ],
  final: py({
    brief: '寫 <code>book(booked, seat)</code>：如果 seat 已經在 booked 裡，就 <code>raise ValueError(\'座位已被訂走\')</code>；否則把 seat 加進 booked，並回傳 <code>\'訂位成功\'</code>。',
    hint: '<code>if seat in booked: raise ValueError(\'座位已被訂走\')</code>，然後 <code>booked.add(seat)</code>、<code>return \'訂位成功\'</code>。',
    starter: '# TODO: 寫 book(booked, seat)\n',
    solution: "def book(booked, seat):\n    if seat in booked:\n        raise ValueError('座位已被訂走')\n    booked.add(seat)\n    return '訂位成功'\n",
    tests: "check('book' in dir(), '要有 book 這個函式')\nif 'book' in dir():\n    b = {'A2'}\n    check(book(b, 'A1') == '訂位成功', \"訂 A1 應該回傳 '訂位成功'\")\n    check('A1' in b, '訂位成功後，A1 要被加進 booked')\n    try:\n        book(b, 'A1')\n        check(False, 'A1 已經被訂走，再訂應該要 raise ValueError')\n    except ValueError as e:\n        check('已被訂走' in str(e), \"錯誤訊息要是 '座位已被訂走'\")",
  }),
};

const PY_QUIZ1 = [
  choice('Python 用什麼表示「這幾行是同一塊」？', ['縮排', '大括號 { }', 'begin / end'], 0),
  choice('<code>[\'A1\', \'A2\', \'A3\'][1]</code> 是？', ['A2', 'A1', 'A3'], 0),
  choice('想用變數 total 做字串，應該寫？', ["f'共 {total} 元'", "'共 total 元'", "'共 ' + total + ' 元'"], 0),
  choice('「年齡大於等於 12 而且小於 65」的寫法是？', ['age >= 12 and age < 65', 'age >= 12 && age < 65', '12 <= age <= 65 or'], 0),
];
const PY_QUIZ2 = [
  choice('<code>[n * 2 for n in [1, 2, 3]]</code> 會得到？', ['[2, 4, 6]', '[1, 2, 3]', '12'], 0),
  choice('<code>sum([1, 2, 3])</code> 會得到？', ['6', '3', '[1, 2, 3]'], 0),
  choice('<code>try / except</code> 的用途是？', ['接住錯誤，程式不會當掉', '讓程式跑更快', '宣告變數'], 0),
  choice('想檢查東西有沒有在集合裡，用？', ['in', 'has', '=='], 0),
];

const PY_P1 = py({
  brief: '專案：平均分數。寫 <code>average(nums)</code> 回傳數字清單的平均值；清單是空的就回傳 0。',
  hint: '<code>if not nums: return 0</code>，否則 <code>sum(nums) / len(nums)</code>。',
  starter: '# TODO: 寫 average(nums)\n',
  solution: 'def average(nums):\n    if not nums:\n        return 0\n    return sum(nums) / len(nums)\n',
  tests: "check('average' in dir(), '要有 average 這個函式')\nif 'average' in dir():\n    check(average([4, 6]) == 5, 'average([4, 6]) 應該是 5')\n    check(average([1, 2, 3, 4]) == 2.5, 'average([1, 2, 3, 4]) 應該是 2.5')\n    check(average([]) == 0, '空清單應該回傳 0（不能出錯）')",
});
const PY_P2 = py({
  brief: '專案：訂單分組。寫 <code>group_by_event(orders)</code>，把訂單依活動加總張數，回傳像 <code>{\'星光\': 5, \'交響\': 1}</code> 的 dict。',
  hint: '<code>result = {}</code>，走過每筆訂單：<code>result[o[\'event\']] = result.get(o[\'event\'], 0) + o[\'qty\']</code>。',
  starter: "orders = [\n    {'event': '星光', 'qty': 2},\n    {'event': '交響', 'qty': 1},\n    {'event': '星光', 'qty': 3},\n]\n\n# TODO: 寫 group_by_event(orders)\n",
  solution: "orders = [\n    {'event': '星光', 'qty': 2},\n    {'event': '交響', 'qty': 1},\n    {'event': '星光', 'qty': 3},\n]\n\ndef group_by_event(orders):\n    result = {}\n    for o in orders:\n        result[o['event']] = result.get(o['event'], 0) + o['qty']\n    return result\n",
  tests: "check('group_by_event' in dir(), '要有 group_by_event 這個函式')\nif 'group_by_event' in dir():\n    check(group_by_event(orders) == {'星光': 5, '交響': 1}, \"應該是 {'星光': 5, '交響': 1}，目前是 \" + str(group_by_event(orders)))\n    check(group_by_event([]) == {}, '空清單應該回傳 {}')",
});
const PY_P3 = py({
  brief: '專案：解析訂單文字。寫 <code>parse_order(text)</code>：<code>\'星光,2\'</code> 變成 <code>{\'event\': \'星光\', \'qty\': 2}</code>（qty 是數字）；如果張數不是數字，要 <code>raise ValueError</code>。',
  hint: '<code>name, n = text.split(\',\')</code> 把文字切開；<code>int(n)</code> 轉數字，不是數字它自己就會 raise ValueError。',
  starter: '# TODO: 寫 parse_order(text)\n',
  solution: "def parse_order(text):\n    name, n = text.split(',')\n    return {'event': name, 'qty': int(n)}\n",
  tests: "check('parse_order' in dir(), '要有 parse_order 這個函式')\nif 'parse_order' in dir():\n    check(parse_order('星光,2') == {'event': '星光', 'qty': 2}, \"'星光,2' 應該變成 {'event': '星光', 'qty': 2}\")\n    check(parse_order('交響,10')['qty'] == 10, 'qty 要是數字 10，不是文字')\n    try:\n        parse_order('星光,很多')\n        check(False, \"張數不是數字時要 raise ValueError\")\n    except ValueError:\n        pass",
});

/* ============================ 匯出 ============================ */
export const BE_COURSES = [
  { id: 'nd', name: 'Node.js 後端', icon: '🟢', teacher: 'Lily 老師', chapters: [
    { id: 'nd-c1', title: '第一章　JavaScript 後端基礎', lessons: [N1, N2, N3], quiz: ND_QUIZ1, projects: [ND_P1], event: 'nd-c1' },
    { id: 'nd-c2', title: '第二章　用 Express 做 API', lessons: [N4, N5], quiz: ND_QUIZ2, projects: [ND_P2, ND_P3], event: 'nd-c2' },
  ] },
  { id: 'py', name: 'Python', icon: '🐍', teacher: 'Lily 老師', chapters: [
    { id: 'py-c1', title: '第一章　Python 基礎', lessons: [P1, P2, P3], quiz: PY_QUIZ1, projects: [PY_P1], event: 'py-c1' },
    { id: 'py-c2', title: '第二章　資料處理與錯誤', lessons: [P4, P5], quiz: PY_QUIZ2, projects: [PY_P2, PY_P3], event: 'py-c2' },
  ] },
];

export const BE_EVENTS = {
  'nd-c1': { npc: 'mate', mood: 'worried', text: '我的後端查資料庫的函式，回傳出來是 Promise { <pending> }，不是資料……你學過 async 了，這是怎麼回事？',
    options: [{ label: '少了 await，要等結果回來才能用', fx: { team: 8, quality: 6, stress: 4 } }, { label: '叫他重開機試試', fx: { team: -6 } }] },
  'nd-c2': { npc: 'qa', mood: 'worried', text: '我測到：同一個座位，兩個人同時按購買都成功了！後端要怎麼擋？',
    options: [{ label: '後端要檢查，已售出就回 409', fx: { quality: 10, team: 4 } }, { label: '前端按鈕灰掉就好', fx: { quality: -6 } }] },
  'py-c1': { npc: 'pm', mood: 'happy', text: '聽說你也學 Python 了？資料組想要一個小腳本，把訂單算成報表，你會想怎麼開始？',
    options: [{ label: '先用 list 和 dict 把資料整理好，再寫函式', fx: { quality: 6, team: 6 } }, { label: '全部寫在一個大函式裡', fx: { quality: -3, team: 2 } }] },
  'py-c2': { npc: 'lead', mood: 'happy', text: '使用者輸入的訂單文字有時候格式不對，腳本整個就當掉了。你覺得怎麼處理比較好？',
    options: [{ label: '用 try / except 接住，回報哪一筆有問題', fx: { quality: 10, team: 5 } }, { label: '假設使用者不會輸入錯', fx: { quality: -6, stress: 6 } }] },
};
