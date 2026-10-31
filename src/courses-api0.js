// 「串接 API」超簡單版入門章：先看（真實回應）→ 再玩（一行一行開關）→ 再拼（積木）→ 再選（填空）→ 最後才打字
// 小工具在 src/lab.js；這章的每個動作都會說明：做什麼、為什麼、拿掉會怎樣。

const pre = (code) => `<pre>${code.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>`;
const choice = (q, options, answer, why) => ({ type: 'choice', q, options, answer, why });
const web = (o) => ({ kind: 'web', ...o });
const txt = (el) => (el?.textContent || '').trim();
const get = async (url) => (await fetch(url)).json();
const NONET = '（測試時連不上網路，沒辦法和真正的 API 比對，請檢查網路後再按一次）';
const TAIPEI = 'https://api.open-meteo.com/v1/forecast?current=temperature_2m&latitude=25.05&longitude=121.52';
const widgetStep = (say, widget, check) => ({ say, widget, check });
const gateStep = (say, widget) => ({ say, widget: { ...widget, gate: true } });

const L_URL = { code: "const url = '{URL}';", what: '把「要問誰」寫下來，存進變數 url。', why: '網址就是地址。沒有地址，就不知道要去哪裡要資料。', off: '下面的程式用到 url，找不到這個變數 → 出現 <b>ReferenceError: url is not defined</b>，程式停住。' };
const L_FETCH = { code: 'const response = await fetch(url);', what: '照著地址送出請求，等對方回應，拿到「信封」response。', why: '這一行才是真的「去問」。await 是「等信寄回來再往下」。', off: '根本沒去問，後面的 response 不存在 → <b>ReferenceError: response is not defined</b>。' };
const L_OK = { code: "if (!response.ok) {\n  throw new Error('連線失敗：' + response.status);\n}", what: '檢查對方有沒有回「成功」（200～299）。不成功就自己丟出錯誤。', why: 'fetch 遇到 404、500 不會自己報錯！不檢查的話，程式會把錯誤的內容當成資料繼續用。', off: '404 / 500 時程式不知道出事了，繼續往下拆「錯誤說明」，等到讀 <code>data.current.temperature_2m</code> 才爆出 <b>Cannot read properties of undefined</b>。這個訊息完全看不出真正原因是 404，除錯會很痛苦。' };
const L_JSON = { code: 'const data = await response.json();', what: '把信封拆開，裡面的 JSON 變成 JavaScript 物件 data。', why: 'response 只是信封（有狀態碼、有包裝），資料要用 .json() 拆出來才能用。這一步也要 await，因為拆開也要時間。', off: '你手上只有信封 response，沒有 data → <b>ReferenceError: data is not defined</b>。' };
const L_LOG = { code: "console.log('氣溫：', data.current.temperature_2m);", what: '把氣溫印出來（真正的網頁會改成放進畫面）。', why: '拿到資料還要「用」它，不然使用者什麼都看不到。<code>data.current.temperature_2m</code> 是一層一層走進 JSON 找到氣溫。', off: '一切都做了，但沒有把結果顯示出來，使用者什麼都看不到。' };

const U1 = {
  id: 'apie1', title: '入門 1／6　先親眼看：對方到底回了什麼？',
  steps: [
    { say: `<p>先不寫程式。串接 API 其實只有<b>三件事</b>：</p><ol><li><b>問</b>：用 <code>fetch</code> 去敲一個網址（像寄信問問題）。</li><li><b>拆</b>：對方回的是一個「信封」，用 <code>.json()</code> 把裡面的資料拆出來。</li><li><b>放</b>：把資料放到畫面上給使用者看。</li></ol><p>這 6 堂「入門」課我們一步一步走：先親眼看，再玩，再拼，再選，最後才自己打。每一步都會告訴你：<b>這一行做什麼、為什麼要有、拿掉會怎樣</b>。</p>`,
      check: choice('串接 API 的三件事，順序是？', ['問（fetch）→ 拆（json）→ 放（畫面）', '放 → 問 → 拆', '拆 → 放 → 問'], 0, '先問、再拆、最後放進畫面。') },
    widgetStep(`<p><b>實驗：</b>下面有 5 個按鈕，每個按鈕都會「真的」去敲 API（前 3 個是真的、後 2 個是模擬）。<b>請 5 個都點一遍</b>，看看對方回了什麼：狀態碼、<code>ok</code>、內容。每個下面都有「這代表什麼」。</p>`, { type: 'viewer' },
      choice('網址的路徑打錯，伺服器回 404。這時 <code>await fetch(url)</code>？', ['不會丟錯誤，只是 response.ok 變 false', '一定丟錯誤', '回傳氣溫 0 度'], 0, '你剛剛親眼看到了：404 時 fetch 沒有報錯，只是 ok 是 false。')),
    { say: `<p>把剛剛看到的整理成一張表（請記起來，這是你「除錯」的地圖）：</p>
      <table class="tbl"><tr><th>狀況</th><th>狀態碼</th><th>response.ok</th><th>fetch 會丟錯誤嗎？</th><th>意思</th></tr>
      <tr><td>成功</td><td>200</td><td>true</td><td>不會</td><td>拿到資料了</td></tr>
      <tr><td>參數寫錯</td><td>400</td><td>false</td><td>不會</td><td>你問的東西對方看不懂</td></tr>
      <tr><td>網址路徑打錯</td><td>404</td><td>false</td><td>不會</td><td>沒有這個地方</td></tr>
      <tr><td>伺服器壞了</td><td>500</td><td>false</td><td>不會</td><td>對方的問題，等等再試</td></tr>
      <tr><td>沒網路／網域打錯</td><td>（沒有）</td><td>（沒有）</td><td><b>會！</b></td><td>根本連不上</td></tr></table>
      <p>結論：<b>只有「連不上」才會丟錯誤</b>；對方回 400／404／500 都要靠 <code>response.ok</code> 自己檢查。</p>`,
      check: choice('下面哪一種情況，<code>fetch</code> 會「丟出錯誤」？', ['沒有網路，根本連不上', '回 404', '回 500'], 0, '只有連不上才會丟錯誤；404、500 是對方有回應。') },
  ],
  final: web({
    brief: '第一次自己動手，只改一個地方：下面的程式會顯示<b>台北</b>的氣溫。請把網址裡的經緯度改成<b>東京</b>：<code>latitude=35.68</code>、<code>longitude=139.69</code>，標題也改成「東京現在的氣溫」。',
    hint: '只要改網址裡兩個數字，和標題的字。其他程式都不用動。',
    demo: `<p>網址後面的 <code>latitude</code>（緯度）和 <code>longitude</code>（經度）就是「地點」。換地點 = 換數字：</p>${pre("台北：...&latitude=25.05&longitude=121.52\n大阪：...&latitude=34.69&longitude=135.50    ← 只是換了兩個數字")}`,
    steps: [`找到 <code>const url = '...'</code> 那一行。<br>為什麼：網址就是你「問誰」，改地點就是改網址。`, `把 <code>latitude=25.05</code> 改成 <code>latitude=35.68</code>，<code>longitude=121.52</code> 改成 <code>longitude=139.69</code>。<br>為什麼：緯度、經度決定查哪個地方的天氣。`, `把 <code>&lt;h3&gt;</code> 裡的「台北」改成「東京」，按「送出檢查」。<br>最常犯的錯：只改了一個數字，或把 <code>&amp;</code> 弄丟（網址裡兩個參數要用 &amp; 隔開）。`],
    starter: `<h3>台北現在的氣溫</h3>
<p><span data-testid="temp">--</span> °C</p>
<script>
const url = '${TAIPEI}';
const temp = document.querySelector('[data-testid="temp"]');

async function loadTemp() {
  const response = await fetch(url);
  const data = await response.json();
  temp.textContent = data.current.temperature_2m;
}
loadTemp();
</script>
`,
    solution: `<h3>東京現在的氣溫</h3>
<p><span data-testid="temp">--</span> °C</p>
<script>
const url = 'https://api.open-meteo.com/v1/forecast?current=temperature_2m&latitude=35.68&longitude=139.69';
const temp = document.querySelector('[data-testid="temp"]');

async function loadTemp() {
  const response = await fetch(url);
  const data = await response.json();
  temp.textContent = data.current.temperature_2m;
}
loadTemp();
</script>
`,
    must: [{ re: /latitude=35\.68/, msg: '緯度要改成 latitude=35.68（東京）' }, { re: /longitude=139\.69/, msg: '經度要改成 longitude=139.69（東京）' }, { re: /東京/, msg: '標題請改成「東京現在的氣溫」' }],
    test: async (c) => {
      const el = c.t('temp');
      if (!el) return ['缺少 data-testid="temp" 的元素'];
      if (!(await c.waitFor(() => /\d/.test(el.textContent)))) return ['等了 7 秒，氣溫還沒出現。網址有改壞嗎？（參數之間要用 & 隔開）'];
      let real; try { real = (await get('https://api.open-meteo.com/v1/forecast?current=temperature_2m&latitude=35.68&longitude=139.69')).current.temperature_2m; } catch (e) { return [NONET]; }
      return Math.abs(parseFloat(el.textContent) - real) > 2 ? [`畫面上是 ${el.textContent}，東京現在是 ${real}，數字不一樣`] : [];
    },
  }),
};

const U2 = {
  id: 'apie2', title: '入門 2／6　一行一行玩：每一行少了會怎樣？',
  steps: [
    { say: `<p>最小的串接 API 程式，<b>只有 4 行</b>。用寄信來比喻：</p>${pre("const url = '地址';                      ① 寫好收信地址\nconst response = await fetch(url);    ② 把信寄出去，等對方回信（拿到信封）\nconst data = await response.json();   ③ 把信封拆開，取出裡面的信（資料）\nconsole.log(data.current.temperature_2m);  ④ 讀信的內容，用它")}<p>下一頁你可以<b>把每一行關掉</b>，親眼看看「少了這行會怎樣」。</p>`,
      check: choice('用寄信比喻，<code>response.json()</code> 是？', ['把信封拆開，取出信的內容', '把信寄出去', '寫下地址'], 0, 'fetch 拿到信封，json() 拆信封。') },
    widgetStep(`<p><b>實驗：</b>每一行前面有一個勾勾。<b>取消勾選</b>某一行，再按「▶ 執行看看」，看會發生什麼事。每一行的下面都寫了「做什麼」和「為什麼要有」，取消勾選後會出現「拿掉會怎樣」。<br>建議：先全勾執行一次（正常），再一行一行關掉試試。</p>`, {
      type: 'lab', title: '4 行最小程式', intro: '這是真的程式，會真的去敲台北天氣的 API。', lines: [L_URL, L_FETCH, L_JSON, L_LOG] },
    choice('拿掉 <code>await</code>（只寫 <code>const response = fetch(url);</code>）會怎樣？', ['response 變成「還沒拿到資料的 Promise」，後面都用不了', '程式會更快', '什麼事都沒有'], 0, '沒有 await，不會等信寄回來，你手上只是一張「取件單」(Promise)。')),
    { say: `<p>上面三個很容易搞混的東西，用一張圖分清楚：</p>${pre("fetch(url)            →  Promise（取件單：資料之後會到）\nawait fetch(url)      →  response（信封：有狀態碼，但還不是資料）\nawait response.json() →  data（真正的資料，可以用 data.current... 走進去拿）")}<p>所以<b>為什麼有兩個 await？</b>因為「寄信等回信」要等一次，「拆信封」也要等一次。少一個，你拿到的就是 Promise 或 Response，不是資料。</p>`,
      check: choice('<code>await response.json()</code> 之後拿到的 <code>data</code> 是？', ['真正的資料（物件），可以 data.current... 取值', '信封 response', 'Promise 取件單'], 0, 'data 才是真的資料。') },
  ],
  final: web({
    brief: '下面的程式缺了「拆信封」那一行。請補上：<code>const data = await response.json();</code>，讓台北的氣溫顯示出來。',
    hint: '放在 <code>fetch</code> 那行的後面、<code>temp.textContent = ...</code> 那行的前面。順序不能顛倒（先有 data 才能用 data）。',
    demo: `<p>範例：同樣的三步，換查「東京的風速」：</p>${pre("const response = await fetch(url);        // ② 寄信，拿到信封\nconst data = await response.json();      // ③ 拆信封（你要補的就是這種行）\nwind.textContent = data.current.wind_speed_10m;   // ④ 用資料")}`,
    steps: [`看一下程式：第 ② 行 <code>fetch</code> 已經有了（拿到信封 response），第 ④ 行要用 <code>data</code>，但中間少了第 ③ 行。`, `在兩行中間加上：<pre>const data = await response.json();</pre>為什麼：沒有這行就沒有 data，第 ④ 行會出現 <code>data is not defined</code>，氣溫永遠是「--」。最常犯的錯：忘了 <code>await</code>，或寫成 <code>response.json</code>（少了括號）。`],
    starter: `<h3>台北現在的氣溫</h3>
<p><span data-testid="temp">--</span> °C</p>
<script>
const url = '${TAIPEI}';
const temp = document.querySelector('[data-testid="temp"]');

async function loadTemp() {
  const response = await fetch(url);
  // TODO: 在這裡補上拆信封的那一行：const data = await response.json();
  temp.textContent = data.current.temperature_2m;
}
loadTemp();
</script>
`,
    solution: `<h3>台北現在的氣溫</h3>
<p><span data-testid="temp">--</span> °C</p>
<script>
const url = '${TAIPEI}';
const temp = document.querySelector('[data-testid="temp"]');

async function loadTemp() {
  const response = await fetch(url);
  const data = await response.json();
  temp.textContent = data.current.temperature_2m;
}
loadTemp();
</script>
`,
    must: [{ re: /await\s+response\.json\(\)/, msg: '請補上 await response.json()' }],
    test: async (c) => {
      const el = c.t('temp');
      if (!el) return ['缺少 data-testid="temp" 的元素'];
      if (!(await c.waitFor(() => /\d/.test(el.textContent)))) return ['氣溫還是沒出現。有補上 const data = await response.json(); 嗎？'];
      let real; try { real = (await get(TAIPEI)).current.temperature_2m; } catch (e) { return [NONET]; }
      return Math.abs(parseFloat(el.textContent) - real) > 2 ? [`畫面上是 ${el.textContent}，現在是 ${real}`] : [];
    },
  }),
};

const BLOCK4 = [
  { code: "const url = '{URL}';", what: '寫下要問的網址' },
  { code: 'const response = await fetch(url);', what: '送出請求、拿到信封' },
  { code: 'const data = await response.json();', what: '拆信封、拿到資料' },
  { code: "console.log('氣溫：', data.current.temperature_2m);", what: '用資料（印出氣溫）' },
];
const BLOCK5 = [
  { code: "const url = '{URL}';", what: '寫下要問的網址' },
  { code: 'const response = await fetch(url);', what: '送出請求、拿到信封' },
  { code: "if (!response.ok) {\n  throw new Error('連線失敗：' + response.status);\n}", what: '檢查對方有沒有回成功，沒有就丟出錯誤' },
  { code: 'const data = await response.json();', what: '拆信封、拿到資料' },
  { code: "console.log('氣溫：', data.current.temperature_2m);", what: '用資料（印出氣溫）' },
];
const U3 = {
  id: 'apie3', title: '入門 3／6　拼積木：不用打字，先把順序拼對',
  steps: [
    gateStep(`<p>先練「順序感」。程式是<b>由上往下</b>一行一行跑的，所以順序錯了就會出事（例如還沒有 data 就想用 data）。</p><p>下面的 4 行被打亂了。請<b>依序點積木</b>，拼成正確的順序：先寫地址 → 寄信 → 拆信封 → 用資料。放錯了會告訴你那一行應該是做什麼。拼對後會真的執行給你看。</p>`, { type: 'blocks', title: '拼出 4 行最小程式', lines: BLOCK4 }),
    gateStep(`<p>加一行「<b>檢查有沒有成功</b>」進去。位置很重要：要放在<b>寄信之後、拆信封之前</b>——因為對方回了錯誤，就不用拆了。</p>`, { type: 'blocks', title: '拼出 5 行（含檢查）', lines: BLOCK5 }),
    { say: `<p>這一課的重點整理：</p>${pre("① url           先有地址\n② fetch        才能寄信\n③ ok 檢查      收到信先看是不是『成功』\n④ json()       成功了才拆信封\n⑤ 用資料       最後才放進畫面")}<p>順序反過來會怎樣？例如把 <code>json()</code> 放在 <code>fetch</code> 前面 → <code>response</code> 還不存在，直接報錯 <b>Cannot access 'response' before initialization</b>。</p>`,
      check: choice('為什麼 <code>if (!response.ok)</code> 要放在 <code>await response.json()</code> 前面？', ['錯誤的回應就不用拆了，先擋掉', '因為好看', '沒有原因'], 0, '先確認成功，再拆信封。') },
  ],
  final: web({
    brief: '現在換你寫（只差一點點）。把 <code>loadTemp()</code> 裡的 <b>3 行</b>寫出來：寄信、拆信封、放進畫面。每一行的提示都寫在註解裡，順序跟你剛剛拼的一樣。',
    hint: '三行：<code>const response = await fetch(url);</code>、<code>const data = await response.json();</code>、<code>temp.textContent = data.current.temperature_2m;</code>',
    demo: `<p>範例（查東京風速，格式一模一樣）：</p>${pre("async function loadWind() {\n  const response = await fetch(windUrl);\n  const data = await response.json();\n  wind.textContent = data.current.wind_speed_10m;\n}\nloadWind();")}`,
    steps: [`第一行：<pre>const response = await fetch(url);</pre>為什麼：寄信、拿到信封。`, `第二行：<pre>const data = await response.json();</pre>為什麼：拆信封、拿到資料。`, `第三行：<pre>temp.textContent = data.current.temperature_2m;</pre>為什麼：把氣溫放進畫面。最常犯的錯：<code>loadTemp();</code> 忘了呼叫（函式寫了不會自己跑）。`],
    starter: `<h3>台北現在的氣溫</h3>
<p><span data-testid="temp">--</span> °C</p>
<script>
const url = '${TAIPEI}';
const temp = document.querySelector('[data-testid="temp"]');

async function loadTemp() {
  // 第 1 行：寄信（用 await fetch(url)），結果存成 response
  // 第 2 行：拆信封（用 await response.json()），結果存成 data
  // 第 3 行：把 data.current.temperature_2m 放進 temp.textContent
}
loadTemp();
</script>
`,
    solution: `<h3>台北現在的氣溫</h3>
<p><span data-testid="temp">--</span> °C</p>
<script>
const url = '${TAIPEI}';
const temp = document.querySelector('[data-testid="temp"]');

async function loadTemp() {
  const response = await fetch(url);
  const data = await response.json();
  temp.textContent = data.current.temperature_2m;
}
loadTemp();
</script>
`,
    must: [{ re: /await\s+fetch\(/, msg: '請用 await fetch(url) 寄信' }, { re: /await\s+response\.json\(\)/, msg: '請用 await response.json() 拆信封' }],
    test: async (c) => {
      const el = c.t('temp');
      if (!el) return ['缺少 data-testid="temp" 的元素'];
      if (!(await c.waitFor(() => /\d/.test(el.textContent)))) return ['氣溫沒出現。三行都寫了嗎？最下面的 loadTemp(); 還在嗎？'];
      let real; try { real = (await get(TAIPEI)).current.temperature_2m; } catch (e) { return [NONET]; }
      return Math.abs(parseFloat(el.textContent) - real) > 2 ? [`畫面上是 ${el.textContent}，現在是 ${real}`] : [];
    },
  }),
};

const U4 = {
  id: 'apie4', title: '入門 4／6　選填空：錯誤處理的每個零件',
  steps: [
    gateStep(`<p>這一課用「選」的：每個空格點開，選一個答案。先複習基本 4 行，三個空格。</p>`, {
      type: 'blanks', title: '補完基本程式', code: "const url = '{URL}';\nconst response = ⟦1⟧ fetch(url);\nconst data = await response.⟦2⟧();\nconsole.log('氣溫：', data.⟦3⟧.temperature_2m);",
      blanks: [
        { options: ['await', 'async', 'then'], answer: 0, hint: '要「等」信寄回來。', why: '等 fetch 完成再往下。' },
        { options: ['text', 'json', 'data'], answer: 1, hint: '要把信封拆成 JSON 物件的那個動作。', why: 'json() 把回應拆成可用的物件。' },
        { options: ['weather', 'current', 'result'], answer: 1, hint: '看剛剛 viewer 回的內容，氣溫在哪一層底下？', why: '氣溫在 current 這一層裡面。' },
      ] }),
    gateStep(`<p>再來加上<b>錯誤處理</b>。這個是你上課學過的寫法：<code>try</code>（先試）、<code>catch</code>（出錯了跳到這裡）。選出正確的字：</p>`, {
      type: 'blanks', title: '補完錯誤處理', code: "try {\n  const response = await fetch('{URL}');\n  if (⟦1⟧) {\n    throw new Error('連線失敗：' + response.status);\n  }\n  const data = await response.json();\n  console.log('氣溫：', data.current.temperature_2m);\n} ⟦2⟧ (error) {\n  console.log('出錯了：', error.message);\n}",
      blanks: [
        { options: ['response.ok', '!response.ok', 'response.status'], answer: 1, hint: '「不成功」的時候才要丟錯誤，前面要加驚嘆號。', why: '<code>!response.ok</code> = 對方沒回成功（不是 200～299）。' },
        { options: ['finally', 'catch', 'else'], answer: 1, hint: '出錯了「接住」的那個字。', why: '<code>catch (error)</code> 接住 try 裡丟出的錯誤。' },
      ] }),
    { say: `<p>把「每個零件、做什麼、不寫會怎樣」總整理（這張表就是你做專案時的檢查清單）：</p>
      <table class="tbl"><tr><th>零件</th><th>達成什麼效果</th><th>不寫會怎樣</th></tr>
      <tr><td><code>await</code></td><td>等資料回來再往下</td><td>拿到 Promise（取件單），不是資料</td></tr>
      <tr><td><code>response.ok</code> 檢查</td><td>發現 404／500</td><td>錯誤的內容被當成資料，後面讀不到欄位才爆出看不懂的錯誤（Cannot read properties of undefined）</td></tr>
      <tr><td><code>throw new Error</code></td><td>把 404／500 變成錯誤，丟進 catch</td><td>catch 接不到 404／500</td></tr>
      <tr><td><code>try / catch</code></td><td>接住錯誤、顯示友善訊息</td><td>斷網時程式在那一行停住，畫面卡在「載入中」</td></tr>
      <tr><td><code>response.json()</code></td><td>把信封拆成資料</td><td>只有信封，沒有資料可用</td></tr></table>`,
      check: choice('伺服器回 404，但程式沒有寫 <code>if (!response.ok)</code>，會怎樣？', ['程式不知道出事，繼續往下用錯誤的內容，直到讀不到欄位才爆出看不懂的錯誤', '程式自動停下來並報錯', '自動重試'], 0, '沒有檢查 ok，404 就悄悄混進去了。') },
  ],
  final: web({
    brief: '下面的程式已經有 try / catch，但<b>少了檢查 response.ok</b>。請補上，這樣「伺服器回 500」時畫面才會顯示「載入失敗」。（檢查時會故意讓伺服器回 500 給你看。）',
    hint: '在 <code>await fetch</code> 的下一行，寫 <code>if (!response.ok) { throw new Error(...); }</code>。',
    demo: `<p>範例：</p>${pre("const response = await fetch(url);\nif (!response.ok) {                                      // 對方沒回成功\n  throw new Error('連線失敗：' + response.status);        // 手動丟出錯誤，跳到 catch\n}")}`,
    steps: [`找到 <code>const response = await fetch(url);</code> 這一行。`, `在它的下一行貼上：<pre>if (!response.ok) {\n  throw new Error('連線失敗：' + response.status);\n}</pre>為什麼：伺服器回 500 時 fetch 不會報錯，要自己丟出去，才會進 catch、顯示「載入失敗」。沒有它，畫面會顯示「完成」但氣溫是亂的。最常犯的錯：忘了驚嘆號（<code>!response.ok</code> 才是「不成功」）。`],
    starter: `<p data-testid="status">載入中…</p>
<p data-testid="temp"></p>
<button id="reload" data-testid="reload">重新整理</button>
<script>
const url = '${TAIPEI}';
const statusEl = document.querySelector('[data-testid="status"]');
const temp = document.querySelector('[data-testid="temp"]');

async function load() {
  statusEl.textContent = '載入中…';
  try {
    const response = await fetch(url);
    // TODO: 在這裡補上 if (!response.ok) { throw new Error('連線失敗：' + response.status); }
    const data = await response.json();
    temp.textContent = data.current.temperature_2m + ' °C';
    statusEl.textContent = '完成';
  } catch (error) {
    statusEl.textContent = '載入失敗：' + error.message;
    temp.textContent = '';
  }
}
load();
document.querySelector('#reload').onclick = load;
</script>
`,
    solution: `<p data-testid="status">載入中…</p>
<p data-testid="temp"></p>
<button id="reload" data-testid="reload">重新整理</button>
<script>
const url = '${TAIPEI}';
const statusEl = document.querySelector('[data-testid="status"]');
const temp = document.querySelector('[data-testid="temp"]');

async function load() {
  statusEl.textContent = '載入中…';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('連線失敗：' + response.status);
    }
    const data = await response.json();
    temp.textContent = data.current.temperature_2m + ' °C';
    statusEl.textContent = '完成';
  } catch (error) {
    statusEl.textContent = '載入失敗：' + error.message;
    temp.textContent = '';
  }
}
load();
document.querySelector('#reload').onclick = load;
</script>
`,
    must: [{ re: /\.ok\b/, msg: '請檢查 response.ok' }, { re: /throw\s+new\s+Error/, msg: '請用 throw new Error(...) 丟出錯誤' }],
    test: async (c) => {
      const f = [], st = () => txt(c.t('status')), tp = () => txt(c.t('temp'));
      if (!c.t('status') || !c.t('temp') || !c.t('reload')) return ['缺少 status / temp / reload 元素'];
      if (!(await c.waitFor(() => /完成/.test(st()) && /\d/.test(tp())))) f.push('網路正常時應該顯示氣溫與「完成」');
      c.win.__failFetch = 'http';
      await c.click(c.t('reload'));
      if (!(await c.waitFor(() => /失敗/.test(st()), 3000))) f.push('伺服器回 500 時，應該顯示「載入失敗」，目前是「' + st() + '」。少了 response.ok 檢查，500 就被當成成功了');
      else if (!/500/.test(st())) f.push('要帶上 500，像「載入失敗：連線失敗：500」');
      c.win.__failFetch = false;
      return f;
    },
  }),
};

const U5 = {
  id: 'apie5', title: '入門 5／6　實驗：沒有 try / catch 會怎樣？',
  steps: [
    widgetStep(`<p><b>最後一個實驗，也是最重要的。</b>下面的程式有 <code>ok</code> 檢查、<code>try / catch</code> 兩個開關，還有「模擬環境」可以選。</p><p>請這樣玩（每一個都按「▶ 執行看看」）：</p><ol><li>環境選「<b>一切正常</b>」→ 看到氣溫。</li><li>環境改「<b>沒有網路</b>」，<b>不勾 try/catch</b> → 看到紅色的「沒有被接住的錯誤」。再<b>勾上 try/catch</b> → 變成「抓到錯誤：Failed to fetch」，程式沒有停住。</li><li>環境改「<b>網址路徑打錯（404）</b>」，先<b>拿掉 ok 檢查</b> → 看看拿到什麼（會爆出 Cannot read properties of undefined，但完全看不出是 404 造成的）。再<b>勾回 ok 檢查和 try/catch</b> → 變成清楚的錯誤訊息。</li></ol>`, {
      type: 'lab', title: '錯誤處理實驗室', tryToggle: true, scenes: ['ok', 'off', 'nf', 'bad', 'err'],
      lines: [L_URL, L_FETCH, L_OK, L_JSON, L_LOG] },
      choice('沒有網路時，程式<b>沒有</b>用 try / catch 包起來，會怎樣？', ['出現沒被接住的錯誤，程式在那一行停住', '自動顯示舊資料', '什麼事都沒有'], 0, '你剛剛親眼看到了紅色錯誤。')),
    { say: `<p>實驗的結論，背起來就能做出穩定的專案：</p>
      <ul><li><b>try / catch</b> 管「<b>連不上</b>」（沒網路、網域錯）→ 沒它：程式停住、畫面卡在載入中。</li>
      <li><b>response.ok 檢查 + throw</b> 管「<b>對方回錯誤</b>」（404、400、500）→ 沒它：錯誤內容被當成資料，後面才爆出看不懂的錯誤，找不到真正原因。</li>
      <li>兩個<b>要一起用</b>：ok 檢查負責「發現」，throw 把它丟給 catch，catch 負責「處理」。</li></ul>
      <p>還有一個好用的收尾：<code>finally</code>，不管成功失敗都會跑，常用來「把按鈕解鎖」。</p>`,
      check: choice('「發現 404」和「處理 404」，分別是誰的工作？', ['response.ok 發現並 throw，catch 處理', 'catch 發現，response.ok 處理', 'fetch 全部自動做好'], 0, 'ok 檢查發現、throw 丟出、catch 處理。') },
  ],
  final: web({
    brief: '按「重新整理」時，按鈕會被鎖住（載入中不給重複按）。請補上兩個地方：<b>catch</b> 裡顯示「載入失敗：」加上錯誤原因，<b>finally</b> 裡把按鈕解鎖。（檢查會故意斷網、讓伺服器回 500。）',
    hint: '<code>catch (error)</code> 裡：<code>statusEl.textContent = \'載入失敗：\' + error.message;</code>；<code>finally</code> 裡：<code>reload.disabled = false;</code>',
    demo: `<p>範例：</p>${pre("try {\n  ...\n} catch (error) {\n  msg.textContent = '載入失敗：' + error.message;   // 出錯時：告訴使用者原因\n} finally {\n  btn.disabled = false;                            // 不管成功失敗：把按鈕解鎖\n}")}`,
    steps: [`catch 裡面寫：<pre>statusEl.textContent = '載入失敗：' + error.message;\ntemp.textContent = '';</pre>為什麼：失敗要讓使用者知道原因，並清掉舊資料。`, `finally 裡面寫：<pre>reload.disabled = false;</pre>為什麼：載入開始時鎖了按鈕，不管成功失敗都要解鎖，不然失敗一次就再也按不了。最常犯的錯：只把解鎖寫在 try 最後，失敗時就沒跑到。`],
    starter: `<p data-testid="status">載入中…</p>
<p data-testid="temp"></p>
<button id="reload" data-testid="reload">重新整理</button>
<script>
const url = '${TAIPEI}';
const statusEl = document.querySelector('[data-testid="status"]');
const temp = document.querySelector('[data-testid="temp"]');
const reload = document.querySelector('#reload');

async function load() {
  statusEl.textContent = '載入中…';
  reload.disabled = true;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('連線失敗：' + response.status);
    }
    const data = await response.json();
    temp.textContent = data.current.temperature_2m + ' °C';
    statusEl.textContent = '完成';
  } catch (error) {
    // TODO 1: statusEl 顯示 '載入失敗：' + error.message，temp 清空
  } finally {
    // TODO 2: reload.disabled = false;
  }
}
load();
reload.onclick = load;
</script>
`,
    solution: `<p data-testid="status">載入中…</p>
<p data-testid="temp"></p>
<button id="reload" data-testid="reload">重新整理</button>
<script>
const url = '${TAIPEI}';
const statusEl = document.querySelector('[data-testid="status"]');
const temp = document.querySelector('[data-testid="temp"]');
const reload = document.querySelector('#reload');

async function load() {
  statusEl.textContent = '載入中…';
  reload.disabled = true;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('連線失敗：' + response.status);
    }
    const data = await response.json();
    temp.textContent = data.current.temperature_2m + ' °C';
    statusEl.textContent = '完成';
  } catch (error) {
    statusEl.textContent = '載入失敗：' + error.message;
    temp.textContent = '';
  } finally {
    reload.disabled = false;
  }
}
load();
reload.onclick = load;
</script>
`,
    must: [{ re: /finally\s*\{[\s\S]*disabled\s*=\s*false/, msg: '請在 finally 裡寫 reload.disabled = false' }, { re: /catch\s*\(\s*error\s*\)\s*\{[\s\S]*error\.message/, msg: 'catch 裡請把 error.message 顯示出來' }],
    test: async (c) => {
      const f = [], st = () => txt(c.t('status')), tp = () => txt(c.t('temp')), btn = c.t('reload');
      if (!c.t('status') || !c.t('temp') || !btn) return ['缺少 status / temp / reload 元素'];
      if (!(await c.waitFor(() => /完成/.test(st()) && /\d/.test(tp())))) f.push('網路正常時應該顯示氣溫與「完成」');
      if (!(await c.waitFor(() => !btn.disabled, 1500))) return [...f, '載入結束後按鈕還是鎖住的，要在 finally 解鎖'];
      c.win.__failFetch = true; await c.click(btn);
      if (!(await c.waitFor(() => /失敗/.test(st()), 3000))) f.push('斷網時應該顯示「載入失敗：…」，目前是「' + st() + '」');
      else if (!/Failed to fetch/.test(st())) f.push('要帶上 error.message，像「載入失敗：Failed to fetch」');
      if (!(await c.waitFor(() => !btn.disabled, 1500))) return [...f, '失敗後按鈕還是鎖住的，解鎖要寫在 finally'];
      c.win.__failFetch = 'http'; await c.click(btn);
      if (!(await c.waitFor(() => /失敗/.test(st()), 3000))) f.push('伺服器回 500 也要顯示「載入失敗」');
      c.win.__failFetch = false;
      return f;
    },
  }),
};

const U6 = {
  id: 'apie6', title: '入門 6／6　自己完成一個（我的專案要寫哪些？）',
  steps: [
    { say: `<p>你要做一個「串接 API 的頁面」時，<b>一定要寫的 8 個零件</b>（照順序）。這是你的<b>專案清單</b>，每個都寫出：做什麼、達成什麼效果、沒有的話會怎樣：</p>
      <table class="tbl"><tr><th>#</th><th>要寫什麼</th><th>效果</th><th>沒有它會怎樣</th></tr>
      <tr><td>①</td><td>HTML：放結果的位置（狀態、數字、按鈕）</td><td>有地方顯示資料</td><td>資料拿到了，但沒地方放，使用者看不到</td></tr>
      <tr><td>②</td><td><code>const url = '…'</code> + 找到畫面元素</td><td>知道問誰、放哪裡</td><td><code>url is not defined</code> 或 <code>null</code> 錯誤</td></tr>
      <tr><td>③</td><td><code>async function load()</code></td><td>可以使用 await</td><td>await 報錯：只能用在 async 函式</td></tr>
      <tr><td>④</td><td><code>try { … } catch (error) { … }</code></td><td>出錯不停住</td><td>斷網時程式停住，畫面卡在「載入中」</td></tr>
      <tr><td>⑤</td><td><code>await fetch(url)</code></td><td>送出請求</td><td>根本沒去要資料</td></tr>
      <tr><td>⑥</td><td><code>if (!response.ok) throw …</code></td><td>發現 404／500</td><td>錯誤被當成資料，後面爆出 Cannot read properties of undefined</td></tr>
      <tr><td>⑦</td><td><code>await response.json()</code> 並放進畫面</td><td>拆信封、顯示結果</td><td>沒有資料可用／使用者看不到</td></tr>
      <tr><td>⑧</td><td><code>load();</code> 與按鈕綁定</td><td>真的開始執行</td><td>函式寫了但從來沒有執行，畫面永遠空白</td></tr></table>`,
      check: choice('頁面一直停在「載入中…」，網路又斷了，最可能是少了哪個零件？', ['try / catch（斷網時程式停住）', 'HTML 標題', 'console.log'], 0, '沒有 catch，斷網時程式在 fetch 那行就停了，後面「載入失敗」永遠不會執行。') },
    { say: `<p>常見的「症狀 → 原因」對照（除錯用）：</p>
      <table class="tbl"><tr><th>你看到的狀況</th><th>通常是因為</th></tr>
      <tr><td>畫面完全空白、什麼都沒有</td><td>忘了呼叫 <code>load()</code>；或程式有語法錯誤</td></tr>
      <tr><td>畫面顯示 <code>undefined</code>，或 <code>Cannot read properties of undefined</code></td><td>資料的路徑寫錯（例如少了 <code>.current</code>）；或 404／500 沒檢查 ok，把錯誤內容當資料用</td></tr>
      <tr><td><code>Failed to fetch</code></td><td>沒網路，或網域打錯</td></tr>
      <tr><td><code>連線失敗：404</code></td><td>網址路徑打錯</td></tr>
      <tr><td><code>連線失敗：400</code></td><td>參數寫錯（像 latitude=abc）</td></tr>
      <tr><td><code>連線失敗：500</code></td><td>伺服器壞了，稍後再試</td></tr>
      <tr><td><code>Unexpected token … is not valid JSON</code></td><td>回來的不是 JSON（可能是錯誤頁面），要先檢查 ok</td></tr></table>`,
      check: choice('畫面顯示「連線失敗：404」，最可能是？', ['網址路徑打錯了', '沒有網路', '伺服器壞了'], 0, '404 = 沒有這個地方，多半是網址路徑寫錯。') },
  ],
  final: web({
    brief: '照「專案清單」自己完成：顯示台北氣溫。要有：載入中（鎖住按鈕）、成功（顯示氣溫＋「完成」）、失敗（斷網或 500 都顯示「載入失敗：原因」）、finally 解鎖、按「重新整理」會再跑一次。起始程式只有 8 個標題，每個標題下面請寫出對應的程式。',
    hint: '8 個步驟對照上面的清單，每步都有提示，點開「提示步驟」一個一個看。',
    demo: `<p>8 個零件合起來的樣子（換成查東京風速的範例）：</p>${pre("// ② 準備\nconst url = 'https://…wind…';\nconst out = document.querySelector('#out');\n// ③ async 函式 + ④ try/catch\nasync function load() {\n  out.textContent = '載入中…';\n  try {\n    const response = await fetch(url);                 // ⑤\n    if (!response.ok) throw new Error('連線失敗：' + response.status);  // ⑥\n    const data = await response.json();               // ⑦\n    out.textContent = data.current.wind_speed_10m;\n  } catch (error) {\n    out.textContent = '載入失敗：' + error.message;\n  }\n}\nload();                                                // ⑧")}`,
    steps: [
      `② 準備網址和元素：<pre>const url = '${TAIPEI}';\nconst statusEl = document.querySelector('[data-testid="status"]');\nconst temp = document.querySelector('[data-testid="temp"]');\nconst reload = document.querySelector('#reload');</pre>為什麼：先知道問誰、結果放哪。`,
      `③ 開函式：<pre>async function load() {\n  statusEl.textContent = '載入中…';\n  reload.disabled = true;\n  ...\n}</pre>為什麼：要用 await 就必須 async；一開始先讓使用者知道在載入。`,
      `④ 在函式裡接著寫 try / catch / finally 的骨架：<pre>try {\n  ...\n} catch (error) {\n  ...\n} finally {\n  reload.disabled = false;\n}</pre>為什麼：先把保護網搭好，再往裡面放會出錯的事。`,
      `⑤⑥⑦ 放進 try 裡面：<pre>const response = await fetch(url);\nif (!response.ok) {\n  throw new Error('連線失敗：' + response.status);\n}\nconst data = await response.json();\ntemp.textContent = data.current.temperature_2m + ' °C';\nstatusEl.textContent = '完成';</pre>為什麼：問 → 檢查 → 拆 → 放，順序不能亂。`,
      `catch 裡面：<pre>statusEl.textContent = '載入失敗：' + error.message;\ntemp.textContent = '';</pre>為什麼：失敗時告訴使用者原因，並清掉舊資料。`,
      `⑧ 函式外面最後兩行：<pre>load();\nreload.onclick = load;</pre>為什麼：沒有呼叫，函式不會跑；綁在按鈕上，才能再按一次重新整理。最常犯的錯：大括號 { } 沒配對。`,
    ],
    starter: `<h3>台北氣溫</h3>
<p data-testid="status">載入中…</p>
<p data-testid="temp"></p>
<button id="reload" data-testid="reload">重新整理</button>
<script>
// ② 準備：網址、找到畫面上的四個元素

// ③ 開一個 async 函式 load()：一開始顯示「載入中…」並鎖住按鈕
//   ④ try { … } catch (error) { … } finally { … }
//   ⑤ try 裡：await fetch(url)
//   ⑥ 檢查 response.ok，不成功就 throw new Error(…)
//   ⑦ await response.json()，把氣溫（加 ' °C'）放進 temp，狀態改「完成」
//   catch：狀態顯示「載入失敗：」+ error.message，temp 清空
//   finally：把按鈕解鎖

// ⑧ 呼叫 load()，並讓按鈕被按時也執行 load
</script>
`,
    solution: `<h3>台北氣溫</h3>
<p data-testid="status">載入中…</p>
<p data-testid="temp"></p>
<button id="reload" data-testid="reload">重新整理</button>
<script>
const url = '${TAIPEI}';
const statusEl = document.querySelector('[data-testid="status"]');
const temp = document.querySelector('[data-testid="temp"]');
const reload = document.querySelector('#reload');

async function load() {
  statusEl.textContent = '載入中…';
  reload.disabled = true;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('連線失敗：' + response.status);
    }
    const data = await response.json();
    temp.textContent = data.current.temperature_2m + ' °C';
    statusEl.textContent = '完成';
  } catch (error) {
    statusEl.textContent = '載入失敗：' + error.message;
    temp.textContent = '';
  } finally {
    reload.disabled = false;
  }
}

load();
reload.onclick = load;
</script>
`,
    must: [{ re: /try\s*\{/, msg: '請用 try { } 包住 fetch' }, { re: /catch/, msg: '請用 catch 接住錯誤' }, { re: /\.ok\b/, msg: '請檢查 response.ok' }, { re: /finally/, msg: '請用 finally 解鎖按鈕' }, { re: /async\s+function/, msg: '請用 async function' }],
    test: async (c) => {
      const f = [], st = () => txt(c.t('status')), tp = () => txt(c.t('temp')), btn = c.t('reload');
      if (!c.t('status') || !c.t('temp') || !btn) return ['缺少 status / temp / reload 元素（不要刪掉 data-testid）'];
      if (!(await c.waitFor(() => /完成/.test(st()) && /\d/.test(tp())))) f.push('網路正常時應該顯示氣溫並把狀態改成「完成」');
      if (!(await c.waitFor(() => !btn.disabled, 1500))) return [...f, '載入結束後按鈕還是鎖住的，要在 finally 解鎖'];
      c.win.__failFetch = true; await c.click(btn);
      if (!(await c.waitFor(() => /失敗/.test(st()), 3000))) f.push('斷網時應該顯示「載入失敗：…」，目前是「' + st() + '」');
      else { if (!/Failed to fetch/.test(st())) f.push('要帶上 error.message'); if (tp() !== '') f.push('失敗時 temp 要清空'); }
      if (!(await c.waitFor(() => !btn.disabled, 1500))) return [...f, '失敗後按鈕還是鎖住的，解鎖要寫在 finally'];
      c.win.__failFetch = 'http'; await c.click(btn);
      if (!(await c.waitFor(() => /失敗/.test(st()), 3000))) f.push('伺服器回 500 也要顯示「載入失敗」，記得檢查 response.ok');
      else if (!/500/.test(st())) f.push('500 時要帶上 throw 的那句（連線失敗：500）');
      if (!(await c.waitFor(() => !btn.disabled, 1500))) return [...f, '按鈕還是鎖住的'];
      c.win.__failFetch = false; await c.click(btn);
      if (!(await c.waitFor(() => /完成/.test(st()) && /\d/.test(tp())))) f.push('網路恢復後按「重新整理」應該又能顯示氣溫');
      return f;
    },
  }),
};

const QUIZ = [
  choice('伺服器回 404 時，<code>await fetch(url)</code> 會？', ['不會丟錯誤，要自己檢查 response.ok', '一定丟錯誤', '回傳空資料'], 0),
  choice('沒有網路時，要靠什麼接住錯誤？', ['try / catch', 'response.ok', 'console.log'], 0),
  choice('<code>const data = await response.json()</code> 做的事？', ['把信封拆開，取出資料', '送出請求', '檢查網址'], 0),
  choice('寫專案時，哪一個零件負責「發現 404／500」？', ['if (!response.ok) { throw … }', 'await', 'finally'], 0),
];

export const API0 = {
  chapter: { id: 'api-c0', title: '第〇章　先搞懂再動手：fetch 超簡單版（先看、再玩、再拼、再選、最後才打字）', lessons: [U1, U2, U3, U4, U5, U6], quiz: QUIZ, projects: [], event: 'api-c0' },
  event: { npc: 'mate', mood: 'happy', text: '欸，我昨天的天氣頁面一直卡在「載入中」，你之前學過 fetch，幫我看一下可能是哪裡漏了？',
    options: [{ label: '看看有沒有 try / catch 和 response.ok 檢查，斷網或 500 時才不會卡住', fx: { team: 8, quality: 6, stress: 2 } }, { label: '叫他重新整理看看', fx: { team: -4, quality: -2 } }] },
};
