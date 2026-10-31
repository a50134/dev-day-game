// 「串接 API」課程：用真的公開 API（Open-Meteo 天氣與地名、USGS 地震、Frankfurter 匯率、維基百科、OpenStreetMap 地圖）練習。
// 練習 kind 'web'：一般網頁（HTML + JavaScript）。檢查時會真的等網路回來，並和 API 現在的答案比對。

const pre = (code) => `<pre>${code.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>`;
const choice = (q, options, answer, why) => ({ type: 'choice', q, options, answer, why });
const web = (o) => ({ kind: 'web', ...o });
const txt = (el) => (el?.textContent || '').trim();

const WEATHER = 'https://api.open-meteo.com/v1/forecast?current=temperature_2m&latitude=25.05&longitude=121.52';
const get = async (url) => (await fetch(url)).json();
const NONET = '（測試時連不上網路，沒辦法和真正的 API 比對，請檢查網路後再按一次）';

/* ============================ 第 1 堂 ============================ */
const A1 = {
  id: 'api1', title: '第 1 堂　API 是什麼？第一次 fetch',
  steps: [
    { say: `<p><b>API</b> 就是網路上的「點餐窗口」：你送出一個網址（點餐），對方回你一包資料（餐點），通常是 <b>JSON</b>（長得像 JavaScript 物件的文字）。例如這個網址會回傳台北現在的氣溫，你把它貼到瀏覽器網址列就看得到：</p>${pre('https://api.open-meteo.com/v1/forecast?current=temperature_2m&latitude=25.05&longitude=121.52')}<p>前端工程師的工作，就是用程式去「點餐」，再把拿到的資料放到畫面上。</p>`,
      check: choice('API 回傳給你的資料，通常是什麼格式？', ['JSON', '圖片', 'Excel 檔'], 0, '大部分 API 都回 JSON，長得像 JavaScript 的物件。') },
    { say: `<p>從網址到畫面，一共 <b>6 步</b>，這是整個串接 API 最重要的流程：</p>${pre("1. url                  準備好網址\n2. fetch(url)          送出請求，等對方回應（要 await）\n3. response            對方的「回應」——像一個信封，還不是資料\n4. response.json()     把信封拆開，變成 JavaScript 物件（也要 await）\n5. data                這才是真正的資料\n6. 放進畫面            temp.textContent = data.current.temperature_2m")}<p>記法：<b>fetch 拿信封，json() 拆信封，然後用資料</b>。</p>`,
      check: choice('<code>fetch(url)</code> 拿到的 <code>response</code>，已經是可以直接用的資料了嗎？', ['還不是，要再用 response.json() 拆開', '是，直接拿來用', '是，要用 response.text 拿'], 0, 'response 是信封，response.json() 拆開才是 data。') },
    { say: `<p>拿到 <code>data</code> 之後，要<b>自己看懂它的樣子</b>，才知道資料在哪裡。API 回來的 JSON 大概長這樣（縮短過）：</p>${pre('{\n  "latitude": 25.05,\n  "current": {\n    "time": "2026-10-29T14:00",\n    "temperature_2m": 24.3\n  }\n}')}<p>用 <code>.</code> 一層一層往裡走：<code>data.current.temperature_2m</code> 就是 24.3。不確定長怎樣時，先 <code>console.log(data)</code> 印出來看。</p>`,
      check: choice('上面那包 JSON 是 <code>data</code>，要拿到 24.3 要怎麼寫？', ['data.current.temperature_2m', 'data.temperature_2m', 'data.current[0]'], 0, '氣溫在 current 裡面的 temperature_2m，一層一層用 . 走進去。') },
    { say: `<p>把 6 步寫成程式（<b>async / await</b> 寫法，現在最常見）：</p>${pre("async function loadTemp() {\n  const response = await fetch(url);        // 2、3 送出請求，拿到信封\n  const data = await response.json();       // 4、5 拆信封，拿到資料\n  console.log(data);                        // 先印出來看長怎樣\n  temp.textContent = data.current.temperature_2m;  // 6 放進畫面\n}\n\nloadTemp();   // 記得要呼叫它，函式才會跑")}<p><code>await</code> 就是「<b>等這件事做完，再往下一行</b>」。用了 <code>await</code> 的函式，前面一定要寫 <code>async</code>。</p>`,
      check: choice('<code>await</code> 的意思是？', ['等這件事做完，再往下一行', '讓程式跑得更快', '把資料存起來'], 0, 'fetch 要等網路，await 就是等它回來。') },
    { say: `<p><b>前端怎麼串、後端怎麼串，差在哪裡？</b>兩邊都是用 <code>fetch</code>，語法幾乎一樣，差在<b>「誰」去敲 API</b>：</p>
      <ul><li><b>前端串接：</b>網頁在<b>使用者的瀏覽器</b>裡直接 fetch 第三方 API。簡單，但：①要金鑰的 API，金鑰會被每個人看到 ②對方沒開放 CORS 就會被瀏覽器擋 ③使用者正在看畫面，所以要顯示「載入中／失敗」。</li>
      <li><b>後端串接：</b>你的<b>伺服器</b>去 fetch 第三方 API，再把整理好的資料給你的前端。金鑰藏在伺服器、沒有 CORS 問題，還可以<b>快取</b>（同一個問題 10 分鐘內直接回上次的答案，省額度也比較快）。</li></ul>
      <p>像台灣公車用的 TDX 要申請金鑰，就是典型要走後端的例子：前端 → 你的後端（帶金鑰）→ TDX。</p>`,
      check: choice('想用一個要付費金鑰的 API，金鑰最好放哪裡？', ['你的後端伺服器', '直接寫在前端的 JavaScript', '寫在網頁標題裡'], 0, '前端的程式每個人都看得到，金鑰要藏在後端。') },
    { say: `<p>你問的「cache、try catch」——其實是<b>兩件不同的事</b>：</p>
      <ul><li><code>try / catch</code>（接住）：<b>錯誤處理</b>。網路斷了、對方壞了，程式會丟出錯誤，用 try/catch 接住，改顯示友善的訊息。<b>前端、後端都要用</b>。下一堂會一步一步教。</li>
      <li><code>cache</code>（快取）：<b>把答案先存起來</b>，下次直接用。主要是<b>後端</b>（或瀏覽器）用來省額度、加速，不是用來處理錯誤。</li></ul>
      <p>差別在於「接住之後做什麼」：前端是<b>顯示訊息給使用者</b>（或讓他重試）；後端是<b>記錄下來，並回 500／502 之類的狀態碼</b>給前端。</p>`,
      check: choice('「接住錯誤，讓畫面顯示『載入失敗』」要用？', ['try / catch', 'cache', 'console.log'], 0, 'try/catch 管錯誤；cache 是存答案。') },
  ],
  final: web({
    brief: '把「網址到畫面」的 6 步寫出來：在 <code>loadTemp()</code> 裡用 <code>fetch</code> 向 <code>url</code> 要台北現在的氣溫，把 <code>data.current.temperature_2m</code> 顯示在 <code>data-testid="temp"</code> 的元素裡。',
    hint: '三行就夠：<code>const response = await fetch(url);</code>　<code>const data = await response.json();</code>　<code>temp.textContent = data.current.temperature_2m;</code>。寫完按「送出檢查」，會和 API 現在的答案比對。',
    demo: `<p>換個例子看完整流程：用 API 查<b>東京現在的風速</b>。每一步都寫了「做什麼」和「為什麼」。</p>${pre(`async function loadWind() {
  // 做什麼：送出請求。為什麼：沒有請求就沒有資料，這是第一步。
  const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=35.68&longitude=139.69&current=wind_speed_10m');
  // 做什麼：拆信封。為什麼：fetch 拿到的只是信封，要 json() 才拿得到裡面的資料。
  const data = await response.json();
  // 做什麼：放進畫面。為什麼：資料不放進畫面，使用者看不到。
  document.querySelector('#wind').textContent = data.current.wind_speed_10m;
}
// 做什麼：呼叫函式。為什麼：函式不呼叫就不會跑。
loadWind();`)}`,
    steps: [
      `在 <code>loadTemp()</code> 裡第一行：<pre>const response = await fetch(url);</pre>這是「送出請求，拿到信封」。<br>為什麼：沒有請求就拿不到資料，這是所有事情的起點。`,
      `第二行：<pre>const data = await response.json();</pre>「拆信封」，<code>data</code> 就是資料。<br>為什麼：fetch 只給信封，不拆開就用不到裡面的資料。`,
      `第三行，把氣溫放進畫面：<pre>temp.textContent = data.current.temperature_2m;</pre><br>為什麼：資料要放進畫面，使用者才看得到。`,
      `按「送出檢查」。氣溫沒出現？確認最下面有 <code>loadTemp();</code>（函式要呼叫才會跑）。<br>為什麼：函式不呼叫就不會執行，畫面不會有任何變化。`
    ],
    starter: `<h2>台北現在的氣溫</h2>
<p><span data-testid="temp">--</span> °C</p>
<script>
const url = '${WEATHER}';
const temp = document.querySelector('[data-testid="temp"]');

async function loadTemp() {
  // 步驟 1: const response = await fetch(url);   送出請求，拿到信封
  // 步驟 2: const data = await response.json();  拆信封，拿到資料
  // 步驟 3: 把 data.current.temperature_2m 放進 temp.textContent
}

loadTemp();
</script>
`,
    solution: `<h2>台北現在的氣溫</h2>
<p><span data-testid="temp">--</span> °C</p>
<script>
const url = '${WEATHER}';
const temp = document.querySelector('[data-testid="temp"]');

async function loadTemp() {
  const response = await fetch(url);
  const data = await response.json();
  temp.textContent = data.current.temperature_2m;
}

loadTemp();
</script>
`,
    must: [{ re: /fetch\(/, msg: '請用 fetch 向 API 要資料' }],
    test: async (c) => {
      const el = c.t('temp');
      if (!el) return ['缺少 data-testid="temp" 的元素'];
      if (!(await c.waitFor(() => /\d/.test(el.textContent)))) return ['等了 7 秒，氣溫還是沒出現。有 fetch 嗎？有呼叫 loadTemp() 嗎？有把 current.temperature_2m 放進畫面嗎？'];
      let real; try { real = (await get(WEATHER)).current.temperature_2m; } catch (e) { return [NONET]; }
      const shown = parseFloat(el.textContent);
      return Math.abs(shown - real) > 2 ? [`畫面上是 ${shown}，但 API 現在回傳 ${real}，數字不一樣`] : [];
    },
  }),
};

/* ============================ 第 2 堂 ============================ */
const A2 = {
  id: 'api2', title: '第 2 堂　載入中、失敗與 try / catch / finally',
  steps: [
    { say: `<p>真實世界的網路會<b>慢</b>、會<b>斷</b>、對方會<b>壞掉</b>。所以畫面至少要有三種狀態：<b>載入中</b>、<b>成功</b>、<b>失敗</b>。只做「成功」的網頁，一遇到網路不好就變成一片空白。</p>`,
      check: choice('串接 API 的畫面，至少要處理哪幾種狀態？', ['載入中、成功、失敗', '只有成功', '只有失敗'], 0, '使用者永遠需要知道現在發生什麼事。') },
    { say: `<p><code>try / catch</code> 的意思：<b>先試試看，出錯就跳到 catch</b>。</p>${pre("try {\n  // 可能會出錯的事，放這裡\n} catch (error) {\n  // try 裡面一出錯，就會直接跳到這裡\n  // error 就是那個錯誤，error.message 是它的文字說明\n}")}<p>沒有 try/catch，出錯的那一行之後的程式全部停掉，畫面就卡在「載入中…」。有了它，你可以改成顯示「載入失敗」。</p>`,
      check: choice('<code>try</code> 裡面某一行出錯了，程式會？', ['跳到 catch 去處理', '整個網頁當掉', '照常往下跑 try 裡面剩下的程式'], 0, '出錯那行之後的 try 內容會被跳過，直接進 catch。') },
    { say: `<p><b>很多人踩的坑：</b><code>fetch</code> 只有在「根本連不上」（斷網）才會丟錯誤。對方回 404、500 這種錯，<code>fetch</code> <b>不會</b>丟錯誤，要自己檢查 <code>response.ok</code>（狀態碼 200～299 才是 true），不對就用 <code>throw</code> 自己丟一個，強迫進 catch：</p>${pre("try {\n  const response = await fetch(url);\n\n  // fetch 不會判斷 4xx/5xx 錯誤，因此自己加上判斷\n  if (!response.ok) {\n    // 手動把 4xx/5xx 變成一個錯誤，強迫進入 catch\n    throw new Error(\`連線失敗：\${response.status}\`);\n  }\n\n  const data = await response.json();\n  console.log('成功取得資料：', data);\n} catch (error) {\n  // 同時處理「網路層」以及「我們手動丟出的 4xx/5xx 錯誤」\n  console.log('錯誤：', error.message);\n}")}`,
      check: choice('伺服器回 500，<code>await fetch(url)</code> 本身會丟錯誤嗎？', ['不會，要自己檢查 response.ok', '會，一定會', '只有 404 會'], 0, 'fetch 只有網路失敗才丟錯；500 要靠 response.ok。') },
    { say: `<p>所以 catch 會接到<b>兩種</b>錯誤，<code>error.message</code> 的內容不一樣：</p>${pre("斷網        → error.message 是 'Failed to fetch'（瀏覽器丟的）\n伺服器 500  → error.message 是 '連線失敗：500'（你自己 throw 的那句）")}<p>把它顯示在畫面上，使用者和你除錯時都更清楚：</p>${pre("statusEl.textContent = `載入失敗：${error.message}`;")}<p><code>&#96;…&#36;{變數}…&#96;</code> 這種用反引號的寫法叫<b>樣板字串</b>，可以把變數直接塞進文字裡。</p>`,
      check: choice('伺服器回 500，上面程式的 <code>error.message</code> 會是？', ['連線失敗：500（我們自己 throw 的那句）', 'Failed to fetch', 'undefined'], 0, 'throw new Error(...) 裡寫的文字，就是 error.message。') },
    { say: `<p>還有第三個角色 <code>finally</code>：<b>不管成功或失敗，最後都會跑</b>。很適合做「收尾」，例如載入結束把按鈕解鎖、把轉圈圈藏起來：</p>${pre("async function load() {\n  button.disabled = true;      // 載入中，先鎖住按鈕\n  try {\n    // ……fetch、檢查 response.ok、顯示資料……\n  } catch (error) {\n    // ……顯示失敗……\n  } finally {\n    button.disabled = false;   // 成功、失敗都要解鎖\n  }\n}")}<p>如果把「解鎖」只寫在 try 的最後，一旦失敗就沒跑到，按鈕會永遠鎖死。</p>`,
      check: choice('<code>finally</code> 裡的程式什麼時候會執行？', ['成功、失敗都會', '只有成功時', '只有失敗時'], 0, 'finally 不管有沒有出錯都會跑。') },
  ],
  final: web({
    brief: '完成 <code>load()</code>：開始時顯示「載入中…」並鎖住按鈕；成功時把氣溫（加上 °C）放進 <code>temp</code>、狀態改「完成」；失敗（斷網<b>或</b>伺服器回 500）時狀態顯示「載入失敗：」加上 <code>error.message</code>、<code>temp</code> 清空；最後用 <code>finally</code> 把按鈕解鎖。按「重新整理」會再跑一次。',
    hint: '照著 TODO 1～5 的順序，每個 TODO 只有一兩行。5 個都寫完，才算完整的「載入中／成功／失敗／收尾」。檢查時會故意斷網、故意讓伺服器回 500。',
    demo: `<p>換個例子：載入<b>隨機狗狗圖片</b>，示範載入中、失敗、收尾。</p>${pre(`async function loadDog() {
  // 做什麼：先顯示載入中。為什麼：使用者才知道程式有在動。
  status.textContent = '載入中…';
  try {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    // 做什麼：檢查 ok。為什麼：對方回 500 時 fetch 不會報錯，要自己丟錯誤。
    if (!response.ok) throw new Error('連線失敗：' + response.status);
    const data = await response.json();
    // 做什麼：顯示成功。為什麼：讓使用者看到結果。
    img.src = data.message;
    status.textContent = '完成';
  } catch (error) {
    // 做什麼：顯示失敗。為什麼：斷網或出錯時，不要讓畫面卡在載入中。
    status.textContent = '載入失敗：' + error.message;
  } finally {
    // 做什麼：把按鈕開回來。為什麼：成功失敗都要收尾，才能重試。
    again.disabled = false;
  }
}`)}`,
    steps: [
      `TODO 1：送出請求<pre>const response = await fetch(API);</pre><br>為什麼：沒有請求就沒有資料。`,
      `TODO 2：檢查對方有沒有回錯誤<pre>if (!response.ok) {
  throw new Error(&#96;連線失敗：&#36;{response.status}&#96;);
}</pre><br>為什麼：對方回 500 時 fetch 不會自己報錯，要自己檢查才接得到。`,
      `TODO 3：成功時<pre>const data = await response.json();
temp.textContent = data.current.temperature_2m + ' °C';
statusEl.textContent = '完成';</pre><br>為什麼：成功時要把結果給使用者看，並告訴他完成了。`,
      `TODO 4：寫在 catch 裡<pre>statusEl.textContent = &#96;載入失敗：&#36;{error.message}&#96;;
temp.textContent = '';</pre><br>為什麼：失敗時畫面不能卡在載入中，要讓使用者知道出事了。`,
      `TODO 5：寫在 finally 裡<pre>reload.disabled = false;</pre>五個都寫完再按「送出檢查」。<br>為什麼：不管成功或失敗都要收尾，按鈕才能再按。`
    ],
    starter: `<h2>台北氣溫</h2>
<p data-testid="status">載入中…</p>
<p data-testid="temp"></p>
<button id="reload" data-testid="reload">重新整理</button>
<script>
const API = '${WEATHER}';
const statusEl = document.querySelector('[data-testid="status"]');
const temp = document.querySelector('[data-testid="temp"]');
const reload = document.querySelector('#reload');

async function load() {
  statusEl.textContent = '載入中…';
  reload.disabled = true;   // 載入的時候先把按鈕鎖起來
  try {
    // TODO 1: const response = await fetch(API);
    // TODO 2: 如果 !response.ok，用 throw new Error(\`連線失敗：\${response.status}\`) 自己丟出錯誤
    // TODO 3: const data = await response.json();
    //         temp 顯示氣溫（記得加 ' °C'），statusEl 設成「完成」
  } catch (error) {
    // TODO 4: statusEl 顯示 \`載入失敗：\${error.message}\`，temp 清空
  } finally {
    // TODO 5: reload.disabled = false   不管成功失敗，都要把按鈕打開
  }
}

load();
reload.onclick = load;
</script>
`,
    solution: `<h2>台北氣溫</h2>
<p data-testid="status">載入中…</p>
<p data-testid="temp"></p>
<button id="reload" data-testid="reload">重新整理</button>
<script>
const API = '${WEATHER}';
const statusEl = document.querySelector('[data-testid="status"]');
const temp = document.querySelector('[data-testid="temp"]');
const reload = document.querySelector('#reload');

async function load() {
  statusEl.textContent = '載入中…';
  reload.disabled = true;
  try {
    const response = await fetch(API);
    if (!response.ok) {
      throw new Error(\`連線失敗：\${response.status}\`);
    }
    const data = await response.json();
    temp.textContent = data.current.temperature_2m + ' °C';
    statusEl.textContent = '完成';
  } catch (error) {
    statusEl.textContent = \`載入失敗：\${error.message}\`;
    temp.textContent = '';
  } finally {
    reload.disabled = false;
  }
}

load();
reload.onclick = load;
</script>
`,
    must: [{ re: /try\s*\{/, msg: '請用 try { } 把 fetch 包起來' }, { re: /catch/, msg: '請用 catch 接住錯誤' }, { re: /\.ok\b/, msg: '請檢查 response.ok（伺服器回 500 時 fetch 不會丟錯誤）' }, { re: /finally/, msg: '請用 finally 把按鈕解鎖（不管成功失敗都要跑）' }, { re: /error\.message|err\.message|e\.message/, msg: '失敗時請把 error.message 一起顯示出來' }],
    test: async (c) => {
      const f = [], st = () => txt(c.t('status')), tp = () => txt(c.t('temp'));
      if (!c.t('status') || !c.t('temp') || !c.t('reload')) return ['缺少 status / temp / reload 元素（不要刪掉 data-testid）'];
      const btn = c.t('reload');
      if (!(await c.waitFor(() => /完成/.test(st()) && /\d/.test(tp())))) f.push('網路正常時，應該顯示氣溫並把狀態改成「完成」（等了 7 秒沒有）');
      if (!(await c.waitFor(() => !btn.disabled, 1500))) return [...f, '載入結束後按鈕還是鎖住的。解鎖要寫在 finally 裡（成功失敗都會跑）'];
      c.win.__failFetch = true; // 模擬斷網
      await c.click(btn);
      if (!(await c.waitFor(() => /失敗/.test(st()), 3000))) f.push('斷網時，狀態應該顯示「載入失敗」，目前是「' + st() + '」');
      else {
        if (tp() !== '') f.push('載入失敗時，temp 應該清空');
        if (!/Failed to fetch/.test(st())) f.push('斷網時，要把 error.message 一起顯示，像「載入失敗：Failed to fetch」，目前是「' + st() + '」');
      }
      if (!(await c.waitFor(() => !btn.disabled, 1500))) return [...f, '失敗之後按鈕還是鎖住的。解鎖要寫在 finally 裡，不能只寫在 try 的最後'];
      c.win.__failFetch = 'http'; // 模擬伺服器回 500
      await c.click(btn);
      if (!(await c.waitFor(() => /失敗/.test(st()), 3000))) f.push('伺服器回 500 時，也應該顯示「載入失敗」（目前是「' + st() + '」）。記得檢查 response.ok');
      else if (!/500/.test(st())) f.push('伺服器回 500 時，要顯示 throw 的那句，像「載入失敗：連線失敗：500」，目前是「' + st() + '」');
      if (!(await c.waitFor(() => !btn.disabled, 1500))) return [...f, '按鈕還是鎖住的，請用 finally 解鎖'];
      c.win.__failFetch = false;
      await c.click(btn);
      if (!(await c.waitFor(() => /完成/.test(st()) && /\d/.test(tp())))) f.push('網路恢復後按「重新整理」，應該又能顯示氣溫');
      return f;
    },
  }),
};

/* ============================ 第 3 堂 ============================ */
const A3 = {
  id: 'api3', title: '第 3 堂　帶參數查詢：搜尋城市',
  steps: [
    { say: `<p>很多 API 要靠<b>網址參數</b>告訴它你要什麼，接在 <code>?</code> 後面、用 <code>&amp;</code> 分開：</p>${pre("https://geocoding-api.open-meteo.com/v1/search?name=Tokyo&count=1&language=zh")}<p>這個 API 把「城市名稱」換成「經緯度」（叫<b>地理編碼</b>）。拿到經緯度，才能再去查那裡的天氣。</p>`,
      check: choice('網址裡 <code>?name=Tokyo&amp;count=1</code> 的 <code>name</code>、<code>count</code> 是什麼？', ['查詢參數', '資料庫', '標題'], 0, '用 ? 開頭、& 分隔的就是查詢參數。') },
    { say: `<p>使用者輸入的文字<b>一定要用 <code>encodeURIComponent()</code> 轉碼</b>再放進網址，否則空格、中文、<code>&amp;</code> 會把網址弄壞：</p>${pre("const url = base + '?name=' + encodeURIComponent(input.value);")}`,
      check: choice('使用者輸入的城市名，放進網址前要？', ['encodeURIComponent()', 'toUpperCase()', '直接放'], 0, '避免特殊字元弄壞網址。') },
    { say: `<p>要<b>連續呼叫兩個 API</b>（先查經緯度、再查天氣）時，用 <code>await</code> 一個接一個：</p>${pre("const g = await (await fetch(geoUrl)).json();\nconst { latitude, longitude } = g.results[0];\nconst w = await (await fetch(weatherUrl + '&latitude=' + latitude + '&longitude=' + longitude)).json();")}<p>注意：查不到城市時，<code>g.results</code> <b>根本不存在</b>（undefined），要先判斷，不然會當掉。</p>`,
      check: choice('查一個不存在的城市，回傳的 JSON 會怎樣？', ['沒有 results 這個欄位，要先判斷', '一定有 results，只是空的', '網頁會自動報錯'], 0, '永遠不要假設資料一定長你想的那樣。') },
  ],
  final: web({
    brief: '做一個城市天氣查詢：輸入城市名按「查詢」→ 用 geocoding API 查出經緯度，<code>place</code> 顯示城市名，<code>temp</code> 顯示該地氣溫（°C）。查不到城市時，<code>place</code> 顯示「找不到這個城市」。',
    hint: '先 fetch geocoding（記得 <code>encodeURIComponent</code>），沒有 <code>g.results</code> 就顯示找不到並 <code>return</code>；有的話取 <code>g.results[0]</code> 的 name、latitude、longitude，再 fetch 天氣。',
    demo: `<p>換個例子：用國名查<b>國家資料</b>（查不到會回 404）。</p>${pre(`btn.onclick = async () => {
  // 做什麼：先清空並顯示搜尋中。為什麼：避免留著上一次的舊結果。
  info.textContent = '搜尋中…';
  try {
    // 做什麼：把輸入轉碼再放進網址。為什麼：空白、中文直接放網址會壞掉。
    const response = await fetch('https://restcountries.com/v3.1/name/' + encodeURIComponent(input.value.trim()));
    // 做什麼：處理查不到。為什麼：404 不會丟錯，不處理畫面會一片空白。
    if (response.status === 404) { info.textContent = '找不到這個國家'; return; }
    const list = await response.json();
    // 做什麼：取第一筆的值。為什麼：API 回的是陣列，我們只要最像的那筆。
    const { name, capital } = list[0];
    info.textContent = name.common + ' 首都：' + capital[0];
  } catch (error) {
    info.textContent = '網路出問題了，請稍後再試';
  }
};`)}`,
    steps: [
      `onclick 函式最前面，先顯示搜尋中：<pre>place.textContent = '搜尋中…';
temp.textContent = '';</pre>然後後面的程式都放進 <code>try { }</code>。<br>為什麼：讓使用者知道有在動，也避免留著舊結果。`,
      `查城市（記得轉碼）：<pre>const response = await fetch(GEO + encodeURIComponent(input.value.trim()));
const g = await response.json();</pre><br>為什麼：空白、中文直接放網址會壞掉，轉碼才安全。`,
      `查不到時沒有 <code>g.results</code>：<pre>if (!g.results) {
  place.textContent = '找不到這個城市';
  return;
}</pre><br>為什麼：查不到時沒有結果，不處理的話後面會出錯、畫面空白。`,
      `有結果就取出三個值，顯示城市名：<pre>const { name, latitude, longitude } = g.results[0];
place.textContent = name;</pre><br>為什麼：之後查天氣要用這三個值，先取出來比較好用。`,
      `用經緯度查天氣：<pre>const wr = await fetch(WEATHER + '&latitude=' + latitude + '&longitude=' + longitude);
const w = await wr.json();
temp.textContent = w.current.temperature_2m + ' °C';</pre><br>為什麼：天氣 API 需要經緯度才知道查哪裡。`,
      `最後補 <code>catch (error) { place.textContent = '網路出問題了，請稍後再試'; }</code>。<br>為什麼：網路出錯時要有友善的訊息，而不是整個壞掉。`
    ],
    starter: `<input data-testid="city-input" placeholder="輸入城市，例如 Tokyo">
<button data-testid="go">查詢</button>
<h3 data-testid="place"></h3>
<p data-testid="temp"></p>
<script>
const GEO = 'https://geocoding-api.open-meteo.com/v1/search?count=1&language=zh&name=';
const WEATHER = 'https://api.open-meteo.com/v1/forecast?current=temperature_2m';
const input = document.querySelector('[data-testid="city-input"]');
const place = document.querySelector('[data-testid="place"]');
const temp = document.querySelector('[data-testid="temp"]');

document.querySelector('[data-testid="go"]').onclick = async () => {
  // TODO 1: 用 GEO + encodeURIComponent(input.value) 查城市
  // TODO 2: 沒有 results → place 顯示「找不到這個城市」
  // TODO 3: 有的話 place 顯示城市名；再用 latitude / longitude 查天氣，temp 顯示「氣溫 °C」
};
</script>
`,
    solution: `<input data-testid="city-input" placeholder="輸入城市，例如 Tokyo">
<button data-testid="go">查詢</button>
<h3 data-testid="place"></h3>
<p data-testid="temp"></p>
<script>
const GEO = 'https://geocoding-api.open-meteo.com/v1/search?count=1&language=zh&name=';
const WEATHER = 'https://api.open-meteo.com/v1/forecast?current=temperature_2m';
const input = document.querySelector('[data-testid="city-input"]');
const place = document.querySelector('[data-testid="place"]');
const temp = document.querySelector('[data-testid="temp"]');

document.querySelector('[data-testid="go"]').onclick = async () => {
  place.textContent = '搜尋中…';
  temp.textContent = '';
  try {
    const g = await (await fetch(GEO + encodeURIComponent(input.value.trim()))).json();
    if (!g.results) { place.textContent = '找不到這個城市'; return; }
    const { name, latitude, longitude } = g.results[0];
    place.textContent = name;
    const w = await (await fetch(WEATHER + '&latitude=' + latitude + '&longitude=' + longitude)).json();
    temp.textContent = w.current.temperature_2m + ' °C';
  } catch (error) {
    place.textContent = '網路出問題了，請稍後再試';
  }
};
</script>
`,
    must: [{ re: /encodeURIComponent/, msg: '輸入的文字要用 encodeURIComponent() 轉碼再放進網址' }],
    test: async (c) => {
      const f = [], inp = c.t('city-input'), go = c.t('go');
      if (!inp || !go || !c.t('place') || !c.t('temp')) return ['缺少 city-input / go / place / temp 元素'];
      let real; try { real = (await get('https://geocoding-api.open-meteo.com/v1/search?count=1&language=zh&name=Tokyo')).results[0]; } catch (e) { return [NONET]; }
      await c.type(inp, 'Tokyo'); await c.click(go);
      if (!(await c.waitFor(() => txt(c.t('place')).includes(real.name) && /\d/.test(txt(c.t('temp')))))) f.push(`查 Tokyo 後，place 應該顯示「${real.name}」、temp 要有氣溫（等了 7 秒，目前 place=「${txt(c.t('place'))}」temp=「${txt(c.t('temp'))}」）`);
      await c.type(inp, 'zzqxwvv'); await c.click(go);
      if (!(await c.waitFor(() => txt(c.t('place')).includes('找不到')))) f.push(`查不到的城市，place 應該顯示「找不到這個城市」（目前是「${txt(c.t('place'))}」）。提示：查不到時 g.results 不存在`);
      else if (txt(c.t('temp'))) f.push('查不到城市時，temp 應該是空的');
      return f;
    },
  }),
};

/* ============================ 第 4 堂 ============================ */
const MAPDOC = (body) => `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
${body}`;
const A4 = {
  id: 'api4', title: '第 4 堂　地圖：Leaflet 與 OpenStreetMap',
  steps: [
    { say: `<p>地圖本身也是「串接」：<b>Leaflet</b> 是免費的地圖函式庫，圖片（圖磚）來自 <b>OpenStreetMap</b>（免費開放地圖，不需要金鑰）。你只要給它一個 <code>div</code> 和座標：</p>${pre("const map = L.map('map').setView([25.05, 121.52], 12); // [緯度, 經度], 縮放")}<p>縮放 1 是全世界、15 左右是街道。</p>`,
      check: choice('<code>setView([25.05, 121.52], 12)</code> 的順序是？', ['[緯度, 經度], 縮放', '[經度, 緯度], 縮放', '縮放, 經度, 緯度'], 0, 'Leaflet 一律是「緯度在前、經度在後」。') },
    { say: `<p>光有 <code>setView</code> 是一片空白，要加上「圖層」才有地圖，再放一個標記：</p>${pre("L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {\n  attribution: '© OpenStreetMap',\n}).addTo(map);\n\nL.marker([25.05, 121.52]).addTo(map);")}<p>用 OpenStreetMap 的圖，要保留「© OpenStreetMap」的標示，這是使用條件。</p>`,
      check: choice('地圖要顯示出圖片，需要加上？', ['tileLayer（圖層）', 'console.log', 'fetch'], 0, 'tileLayer 負責把一張張小圖拼起來。') },
    { say: `<p>把兩個 API 合起來：<b>搜尋地名 → 拿到座標 → 地圖飛過去</b>。換位置用 <code>map.setView(...)</code>，移動標記用 <code>marker.setLatLng(...)</code>：</p>${pre("map.setView([latitude, longitude], 11);\nmarker.setLatLng([latitude, longitude]);")}`,
      check: choice('要移動已經存在的標記，用？', ['marker.setLatLng([緯度, 經度])', 'L.map(...)', 'fetch(marker)'], 0, '不用重新建立，改位置就好。') },
  ],
  final: web({
    brief: '完成 <code>showCity(name)</code>：用 <code>geocode(name)</code> 拿到座標後，① 把地圖移到那裡（<code>setView</code>，縮放 10 左右）② 在那裡放<b>一個</b>標記 ③ 在 <code>data-testid="coords"</code> 顯示「緯度, 經度」（取到小數第 2 位）。最後呼叫 <code>showCity(\'Tokyo\')</code>。',
    hint: '先 <code>L.tileLayer(...)</code> 加圖層；<code>const marker = L.marker([0, 0]).addTo(map)</code> 先放一個；之後用 <code>map.setView</code> 與 <code>marker.setLatLng</code>。座標文字：<code>latitude.toFixed(2) + \', \' + longitude.toFixed(2)</code>。',
    demo: `<p>換個例子：在地圖上標出<b>國際太空站 (ISS)</b> 現在的位置。</p>${pre(`async function showIss() {
  const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
  const { latitude, longitude } = await response.json();
  // 做什麼：加圖層。為什麼：沒有圖層，地圖只有一片灰。
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  // 做什麼：先放標記。為什麼：標記只建一次，之後只要移動它。
  const marker = L.marker([0, 0]).addTo(map);
  // 做什麼：地圖飛過去。為什麼：不然看到的還是舊地方。
  map.setView([latitude, longitude], 3);
  // 做什麼：標記也移過去。為什麼：標記才是使用者找的點。
  marker.setLatLng([latitude, longitude]);
  coords.textContent = latitude.toFixed(2) + ', ' + longitude.toFixed(2);
}`)}`,
    steps: [
      `TODO 1：加圖層<pre>L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);</pre><br>為什麼：沒有圖層，地圖只是一片空白。`,
      `TODO 2：先放一個標記，位置之後再改<pre>const marker = L.marker([0, 0]).addTo(map);</pre><br>為什麼：標記只要建一次，之後移動它就好，不用重建。`,
      `TODO 3 第一行：地圖飛過去<pre>map.setView([latitude, longitude], 10);</pre><br>為什麼：不移動地圖，使用者看到的還是舊的地方。`,
      `TODO 3 第二行：標記也過去<pre>marker.setLatLng([latitude, longitude]);</pre><br>為什麼：標記才是使用者要找的點，要跟著過去。`,
      `TODO 3 第三行：顯示座標<pre>document.querySelector('[data-testid=&quot;coords&quot;]').textContent =
  latitude.toFixed(2) + ', ' + longitude.toFixed(2);</pre><br>為什麼：座標文字讓使用者確認真的查到了正確位置。`
    ],
    starter: MAPDOC(`<p data-testid="coords">--</p>
<div id="map" data-testid="map" style="height:260px"></div>
<script>
// 已經寫好：用地名查座標（上一堂學的）
async function geocode(name) {
  const g = await (await fetch('https://geocoding-api.open-meteo.com/v1/search?count=1&name=' + encodeURIComponent(name))).json();
  return g.results[0]; // { latitude, longitude, name }
}

const map = L.map('map').setView([25.05, 121.52], 5);
// TODO 1: 加上 OpenStreetMap 圖層 https://tile.openstreetmap.org/{z}/{x}/{y}.png
// TODO 2: 放一個標記 marker

async function showCity(name) {
  const { latitude, longitude } = await geocode(name);
  // TODO 3: 地圖移到這裡、標記移到這裡、coords 顯示「緯度, 經度」（小數第 2 位）
}
showCity('Tokyo');
</script>
`),
    solution: MAPDOC(`<p data-testid="coords">--</p>
<div id="map" data-testid="map" style="height:260px"></div>
<script>
async function geocode(name) {
  const g = await (await fetch('https://geocoding-api.open-meteo.com/v1/search?count=1&name=' + encodeURIComponent(name))).json();
  return g.results[0];
}

const map = L.map('map').setView([25.05, 121.52], 5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
const marker = L.marker([25.05, 121.52]).addTo(map);

async function showCity(name) {
  const { latitude, longitude } = await geocode(name);
  map.setView([latitude, longitude], 10);
  marker.setLatLng([latitude, longitude]);
  document.querySelector('[data-testid="coords"]').textContent = latitude.toFixed(2) + ', ' + longitude.toFixed(2);
}
showCity('Tokyo');
</script>
`),
    must: [{ re: /tileLayer/, msg: '請加上 L.tileLayer(...) 圖層，地圖才會有圖' }],
    test: async (c) => {
      const f = [];
      let real; try { real = (await get('https://geocoding-api.open-meteo.com/v1/search?count=1&name=Tokyo')).results[0]; } catch (e) { return [NONET]; }
      if (!(await c.waitFor(() => c.doc.querySelector('.leaflet-container')))) return ['找不到地圖（.leaflet-container）。有用 L.map(\'map\') 嗎？'];
      const want = real.latitude.toFixed(2) + ', ' + real.longitude.toFixed(2);
      if (!(await c.waitFor(() => txt(c.t('coords')) === want))) f.push(`coords 應該顯示「${want}」（Tokyo 的座標），目前是「${txt(c.t('coords'))}」`);
      if (c.doc.querySelectorAll('.leaflet-marker-icon').length !== 1) f.push(`地圖上應該剛好有 1 個標記，目前有 ${c.doc.querySelectorAll('.leaflet-marker-icon').length} 個`);
      // 看圖磚的網址：z/x/y 換算成經緯度範圍，Tokyo 要落在某一張圖磚裡，才代表地圖真的移到那裡
      await c.waitFor(() => c.doc.querySelector('img.leaflet-tile[src*="openstreetmap"]'), 6000);
      const tiles = [...c.doc.querySelectorAll('img.leaflet-tile')].map((i) => (i.src.match(/\/(\d+)\/(\d+)\/(\d+)\.png/) || []).slice(1).map(Number)).filter((a) => a.length === 3);
      if (!tiles.length) f.push('沒有看到 OpenStreetMap 的圖磚。有加 tileLayer 嗎？');
      else {
        const lonOf = (x, z) => (x / 2 ** z) * 360 - 180, latOf = (y, z) => (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / 2 ** z))) * 180) / Math.PI;
        const hit = tiles.some(([z, x, y]) => real.longitude >= lonOf(x, z) && real.longitude <= lonOf(x + 1, z) && real.latitude <= latOf(y, z) && real.latitude >= latOf(y + 1, z));
        if (!hit) f.push('地圖沒有移到東京（畫面上的圖磚都不包含東京）。有呼叫 map.setView 嗎？');
        if (!tiles.some(([z]) => z >= 8)) f.push('縮放比例太小了，用 setView([緯度, 經度], 10) 靠近一點');
      }
      return f;
    },
  }),
};

/* ============================ 第 5 堂 ============================ */
const QUAKE = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson';
const A5 = {
  id: 'api5', title: '第 5 堂　即時資料列表：全球地震',
  steps: [
    { say: `<p>很多 API 回傳的是<b>一整串資料</b>（陣列）。美國地質調查局（USGS）提供免費、不用金鑰的地震資料，每分鐘更新。回傳長這樣：</p>${pre('{ "features": [\n  { "properties": { "mag": 5.1, "place": "Japan region", "time": 1793000000000 } },\n  ...\n] }')}<p>你的工作是：<b>把資料「看懂」，再挑出需要的欄位</b>。把回傳印出來看（<code>console.log(data)</code>）是最好的習慣。</p>`,
      check: choice('拿到不熟悉的 API 回傳，第一件事是？', ['先印出來看結構', '直接猜欄位名稱', '複製別人的程式'], 0, '看過結構才知道資料在哪。') },
    { say: `<p>陣列整理三兄弟：<code>sort</code> 排序、<code>slice</code> 取前幾個、<code>map</code> 換成畫面要的樣子：</p>${pre("features\n  .sort((a, b) => b.properties.mag - a.properties.mag)  // 大到小\n  .slice(0, 5)                                         // 前 5 筆\n  .map((f) => 'M' + f.properties.mag + ' ' + f.properties.place);")}`,
      check: choice('<code>.sort((a, b) =&gt; b - a)</code> 會把數字怎麼排？', ['從大到小', '從小到大', '隨機'], 0, 'b - a 是大的在前面。') },
    { say: `<p>把資料變成畫面：用 <code>map</code> 產生 HTML，再放進列表。<b>注意：</b>API 回來的文字如果直接塞進 <code>innerHTML</code>，萬一裡面有惡意的 HTML 就會被執行（XSS）。顯示純文字請用 <code>textContent</code>，或 <code>createElement</code>：</p>${pre("const li = document.createElement('li');\nli.textContent = 'M' + mag + ' ' + place;\nlist.append(li);")}`,
      check: choice('顯示 API 回來的文字，比較安全的做法是？', ['textContent', 'innerHTML', 'eval'], 0, 'textContent 不會執行裡面的 HTML。') },
  ],
  final: web({
    brief: '抓過去 24 小時全球 M4.5 以上的地震，依<b>規模大到小</b>排序，只顯示前 5 筆，每筆一個 <code>li data-testid="quake"</code>，內容像「M5.1　Japan region」。',
    hint: '<code>data.features.sort((a, b) =&gt; b.properties.mag - a.properties.mag).slice(0, 5)</code>，每筆建立 li，用 <code>textContent</code> 放文字。',
    demo: `<p>換個例子：列出 GitHub 帳號<b>星星最多的 3 個專案</b>。</p>${pre(`async function loadRepos() {
  // 做什麼：拿資料。為什麼：列表的內容都來自這份陣列。
  const response = await fetch('https://api.github.com/users/octocat/repos');
  const repos = await response.json();
  // 做什麼：依星星數由大到小排，取前 3。為什麼：只想看最熱門的，不要整份。
  repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3)
    .forEach((r) => {
      // 做什麼：每筆做一個 li。為什麼：一筆資料對應一行畫面。
      const li = document.createElement('li');
      // 做什麼：用 textContent 放字。為什麼：比 innerHTML 安全。
      li.textContent = r.stargazers_count + ' 顆星　' + r.name;
      list.append(li);
    });
}
loadRepos();`)}`,
    steps: [
      `先拿資料：<pre>const response = await fetch(API);
const data = await response.json();</pre>建議包成 <code>async function load() { ... }</code>，最後呼叫 <code>load();</code>。<br>為什麼：列表的內容都來自這份資料。`,
      `地震陣列在 <code>data.features</code>。每一筆的規模是 <code>f.properties.mag</code>，地點是 <code>f.properties.place</code>。<br>為什麼：要先知道陣列在哪一層，才取得到每筆的規模和地點。`,
      `排序＋取前 5 筆：<pre>data.features
  .sort((a, b) =&gt; b.properties.mag - a.properties.mag)
  .slice(0, 5)</pre><br>為什麼：只想看最大的幾筆，所以要先排序再截取。`,
      `接著 <code>.forEach((f) =&gt; { ... })</code>，裡面每筆做一個 li：<pre>const li = document.createElement('li');
li.dataset.testid = 'quake';
li.textContent = 'M' + f.properties.mag + '　' + f.properties.place;
list.append(li);</pre><br>為什麼：一筆資料對應畫面上一行，用 textContent 放字比較安全。`
    ],
    starter: `<h3>最近 24 小時的大地震 Top 5</h3>
<ul id="list"></ul>
<script>
const API = '${QUAKE}';
const list = document.querySelector('#list');
// TODO: fetch API → 依 properties.mag 由大到小排序 → 取前 5 筆
//       每筆建立 <li data-testid="quake">，內容像「M5.1　Japan region」
</script>
`,
    solution: `<h3>最近 24 小時的大地震 Top 5</h3>
<ul id="list"></ul>
<script>
const API = '${QUAKE}';
const list = document.querySelector('#list');
async function load() {
  const response = await fetch(API);
  const data = await response.json();
  data.features
    .sort((a, b) => b.properties.mag - a.properties.mag)
    .slice(0, 5)
    .forEach((f) => {
      const li = document.createElement('li');
      li.dataset.testid = 'quake';
      li.textContent = 'M' + f.properties.mag + '　' + f.properties.place;
      list.append(li);
    });
}
load();
</script>
`,
    must: [{ re: /sort\(/, msg: '請用 sort 依規模排序' }],
    test: async (c) => {
      const f = [];
      let real; try { real = (await get(QUAKE)).features; } catch (e) { return [NONET]; }
      const want = Math.min(5, real.length);
      if (!(await c.waitFor(() => c.ta('quake').length >= 1))) return ['等了 7 秒，沒有看到任何 data-testid="quake" 的項目'];
      const items = c.ta('quake').map(txt);
      if (items.length !== want) f.push(`應該顯示 ${want} 筆，目前 ${items.length} 筆`);
      const mags = items.map((t) => parseFloat((t.match(/M\s*(\d+(\.\d+)?)/) || [])[1]));
      if (mags.some((m) => Number.isNaN(m))) f.push('每筆的內容要像「M5.1　地點」（以 M 加規模開頭）');
      else if (mags.some((m, i) => i && m > mags[i - 1])) f.push('要依規模由大到小排序，目前是：' + mags.join('、'));
      const places = new Set(real.map((r) => r.properties.place));
      if (!items.some((t) => [...places].some((p) => p && t.includes(p)))) f.push('項目裡要顯示地震的地點（properties.place）');
      return f;
    },
  }),
};

const API_QUIZ1 = [
  choice('<code>fetch</code> 遇到伺服器回 500，會？', ['不會丟錯誤，要自己檢查 response.ok', '一定丟錯誤', '自動重試'], 0),
  choice('要付費金鑰的 API，比較安全的做法是？', ['前端呼叫自己的後端，後端帶金鑰去查', '把金鑰寫在前端 JS', '把金鑰貼在網頁上讓使用者輸入'], 0),
  choice('<code>try / catch</code> 是用來？', ['接住錯誤', '把答案存起來下次用', '加快網路速度'], 0),
  choice('<code>cache</code>（快取）主要是？', ['把答案先存起來，省額度、加速', '處理錯誤', '排序資料'], 0),
];
const API_QUIZ2 = [
  choice('使用者輸入的文字要放進網址參數，應該先？', ['encodeURIComponent()', 'toLowerCase()', '直接放'], 0),
  choice('Leaflet 的 <code>setView([a, b], 10)</code>，a 是？', ['緯度', '經度', '縮放'], 0),
  choice('查不到資料時，API 回傳的 JSON 可能「沒有」某個欄位，所以要？', ['先判斷欄位存不存在', '直接用，反正不會錯', '重新整理網頁'], 0),
  choice('顯示 API 回來的文字，比較安全的是？', ['textContent', 'innerHTML', 'eval'], 0),
];

/* ============================ 小專案 ============================ */
const FX = 'https://api.frankfurter.dev/v1/latest?base=USD&symbols=JPY';
const API_P1 = web({
  brief: '專案：匯率換算。輸入美金金額，按「換算」，<code>result</code> 顯示換成日圓的金額（整數，四捨五入）。匯率用 Frankfurter API（<code>data.rates.JPY</code>）。失敗時 <code>result</code> 顯示「匯率查詢失敗」。',
  hint: '<code>const data = await (await fetch(FX)).json(); const jpy = Math.round(Number(amount.value) * data.rates.JPY);</code> 別忘了 try/catch 與 response.ok。',
    demo: `<p>換個例子：歐元換<b>台幣</b>的小工具。</p>${pre(`btn.onclick = async () => {
  // 做什麼：顯示查詢中。為什麼：讓使用者知道有在動。
  result.textContent = '查詢中…';
  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=EUR&to=TWD');
    // 做什麼：檢查 ok。為什麼：伺服器出錯時 fetch 不會自己報錯。
    if (!response.ok) throw new Error('連線失敗：' + response.status);
    const data = await response.json();
    // 做什麼：金額乘匯率。為什麼：輸入框裡是字串，要先轉成數字才能算。
    result.textContent = Math.round(Number(amount.value) * data.rates.TWD);
  } catch (error) {
    // 做什麼：顯示失敗訊息。為什麼：不然使用者只會看到卡在查詢中。
    result.textContent = '匯率查詢失敗';
  }
};`)}`,
  steps: [
    `按鈕的 onclick 已經是 <code>async</code>。先寫 <code>result.textContent = '查詢中…';</code>，後面放進 <code>try { }</code>。<br>為什麼：讓使用者知道程式有在動，try 才接得住後面的錯誤。`,
    `<pre>const response = await fetch(FX);
if (!response.ok) throw new Error(&#96;連線失敗：&#36;{response.status}&#96;);
const data = await response.json();</pre><br>為什麼：沒檢查 ok 的話，伺服器出錯時你還是會拿到壞資料。`,
    `算日圓：<pre>const jpy = Math.round(Number(amount.value) * data.rates.JPY);
result.textContent = jpy.toLocaleString();</pre><br>為什麼：輸入框的值是字串，要轉成數字才能乘匯率。`,
    `<code>catch (error)</code> 裡：<pre>result.textContent = '匯率查詢失敗';</pre><br>為什麼：出錯時不顯示訊息，使用者只會看到卡住的畫面。`
  ],
  starter: `<input data-testid="amount" type="number" value="100"> 美金
<button data-testid="convert">換算</button>
<p>≈ <span data-testid="result">--</span> 日圓</p>
<script>
const FX = '${FX}';
const amount = document.querySelector('[data-testid="amount"]');
const result = document.querySelector('[data-testid="result"]');
document.querySelector('[data-testid="convert"]').onclick = async () => {
  // TODO: fetch FX，用 data.rates.JPY 算出日圓（四捨五入），顯示在 result；失敗顯示「匯率查詢失敗」
};
</script>
`,
  solution: `<input data-testid="amount" type="number" value="100"> 美金
<button data-testid="convert">換算</button>
<p>≈ <span data-testid="result">--</span> 日圓</p>
<script>
const FX = '${FX}';
const amount = document.querySelector('[data-testid="amount"]');
const result = document.querySelector('[data-testid="result"]');
document.querySelector('[data-testid="convert"]').onclick = async () => {
  try {
    const response = await fetch(FX);
    if (!response.ok) throw new Error(\`連線失敗：\${response.status}\`);
    const data = await response.json();
    result.textContent = Math.round(Number(amount.value) * data.rates.JPY);
  } catch (error) {
    result.textContent = '匯率查詢失敗';
  }
};
</script>
`,
  must: [{ re: /catch/, msg: '請用 try / catch 處理失敗' }],
  test: async (c) => {
    const f = [];
    if (!c.t('amount') || !c.t('convert') || !c.t('result')) return ['缺少 amount / convert / result 元素'];
    let rate; try { rate = (await get(FX)).rates.JPY; } catch (e) { return [NONET]; }
    await c.type(c.t('amount'), '100'); await c.click(c.t('convert'));
    const want = Math.round(100 * rate);
    if (!(await c.waitFor(() => Math.abs(parseInt(txt(c.t('result')).replace(/,/g, ''), 10) - want) <= Math.ceil(want * 0.01)))) f.push(`100 美金應該約是 ${want} 日圓（今天匯率 ${rate}），目前顯示「${txt(c.t('result'))}」`);
    c.win.__failFetch = true;
    await c.click(c.t('convert'));
    if (!(await c.waitFor(() => txt(c.t('result')).includes('失敗'), 3000))) f.push('斷網時，result 應該顯示「匯率查詢失敗」');
    c.win.__failFetch = false;
    return f;
  },
});
const WIKI = 'https://zh.wikipedia.org/api/rest_v1/page/summary/';
const API_P2 = web({
  brief: '專案：維基百科查詢。輸入詞條按「查詢」，<code>title</code> 顯示標題、<code>extract</code> 顯示摘要（<code>data.title</code>、<code>data.extract</code>）。詞條不存在（API 回 404）時，<code>title</code> 顯示「找不到這個詞條」。',
  hint: 'API：<code>WIKI + encodeURIComponent(詞條)</code>。404 時 <code>fetch</code> 不會丟錯誤，要用 <code>response.ok</code> 或 <code>response.status === 404</code> 判斷。',
    demo: `<p>換個例子：查<b>寶可夢</b>（名字不存在會回 404）。</p>${pre(`btn.onclick = async () => {
  name.textContent = '查詢中…';
  try {
    // 做什麼：轉碼後查詢。為什麼：使用者輸入的字不一定能直接放網址。
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + encodeURIComponent(term.value.trim().toLowerCase()));
    // 做什麼：自己判斷 404。為什麼：404 時 fetch 不會丟錯，不判斷就會往下拆壞資料。
    if (response.status === 404) { name.textContent = '找不到這隻寶可夢'; return; }
    if (!response.ok) throw new Error('連線失敗：' + response.status);
    // 做什麼：拆信封並顯示。為什麼：成功才有資料可以放進畫面。
    const data = await response.json();
    name.textContent = data.name + ' 重量 ' + data.weight;
  } catch (error) {
    name.textContent = '查詢失敗';
  }
};`)}`,
  steps: [
    `先清空舊內容，後面放進 <code>try { }</code>：<pre>title.textContent = '查詢中…';
extract.textContent = '';</pre><br>為什麼：舊內容不清掉，使用者會誤以為是新結果。`,
    `查詞條（轉碼）：<pre>const response = await fetch(WIKI + encodeURIComponent(term.value.trim()));</pre><br>為什麼：使用者輸入的字不一定能直接放進網址，要轉碼。`,
    `404 代表沒有這個詞條，fetch 不會丟錯，要自己判斷：<pre>if (response.status === 404) {
  title.textContent = '找不到這個詞條';
  return;
}
if (!response.ok) throw new Error(&#96;連線失敗：&#36;{response.status}&#96;);</pre><br>為什麼：404 時 fetch 不會丟錯，不自己判斷就無法顯示「找不到」。`,
    `成功時：<pre>const data = await response.json();
title.textContent = data.title;
extract.textContent = data.extract;</pre><br>為什麼：成功時才有 title 和 extract 可以顯示。`,
    `<code>catch (error)</code> 裡顯示失敗訊息，例如 <code>title.textContent = '查詢失敗';</code>。<br>為什麼：網路斷掉時要讓使用者知道失敗，而不是畫面空白。`
  ],
  starter: `<input data-testid="term" placeholder="輸入詞條，例如 臺灣">
<button data-testid="search">查詢</button>
<h3 data-testid="title"></h3>
<p data-testid="extract"></p>
<script>
const WIKI = '${WIKI}';
const term = document.querySelector('[data-testid="term"]');
const title = document.querySelector('[data-testid="title"]');
const extract = document.querySelector('[data-testid="extract"]');
document.querySelector('[data-testid="search"]').onclick = async () => {
  // TODO: fetch WIKI + encodeURIComponent(term.value)；成功顯示 title 與 extract；404 顯示「找不到這個詞條」
};
</script>
`,
  solution: `<input data-testid="term" placeholder="輸入詞條，例如 臺灣">
<button data-testid="search">查詢</button>
<h3 data-testid="title"></h3>
<p data-testid="extract"></p>
<script>
const WIKI = '${WIKI}';
const term = document.querySelector('[data-testid="term"]');
const title = document.querySelector('[data-testid="title"]');
const extract = document.querySelector('[data-testid="extract"]');
document.querySelector('[data-testid="search"]').onclick = async () => {
  title.textContent = '查詢中…';
  extract.textContent = '';
  try {
    const response = await fetch(WIKI + encodeURIComponent(term.value.trim()));
    if (response.status === 404) { title.textContent = '找不到這個詞條'; return; }
    if (!response.ok) throw new Error(\`連線失敗：\${response.status}\`);
    const data = await response.json();
    title.textContent = data.title;
    extract.textContent = data.extract;
  } catch (error) {
    title.textContent = '查詢失敗，請稍後再試';
  }
};
</script>
`,
  must: [{ re: /encodeURIComponent/, msg: '輸入的詞條要用 encodeURIComponent() 轉碼' }],
  test: async (c) => {
    const f = [];
    if (!c.t('term') || !c.t('search') || !c.t('title') || !c.t('extract')) return ['缺少 term / search / title / extract 元素'];
    let real; try { real = await get(WIKI + encodeURIComponent('臺灣')); } catch (e) { return [NONET]; }
    await c.type(c.t('term'), '臺灣'); await c.click(c.t('search'));
    if (!(await c.waitFor(() => txt(c.t('title')) === real.title && txt(c.t('extract')).length > 20))) f.push(`查「臺灣」後，title 應該是「${real.title}」、extract 要有摘要（目前 title=「${txt(c.t('title'))}」）`);
    await c.type(c.t('term'), 'zzqxwvvnotfound'); await c.click(c.t('search'));
    if (!(await c.waitFor(() => txt(c.t('title')).includes('找不到')))) f.push(`查不到的詞條，title 應該顯示「找不到這個詞條」（目前是「${txt(c.t('title'))}」）。404 不會讓 fetch 丟錯誤，要看 response.status 或 response.ok`);
    else if (txt(c.t('extract'))) f.push('找不到時，extract 應該清空');
    return f;
  },
});
const HOURLY = 'https://api.open-meteo.com/v1/forecast?latitude=25.05&longitude=121.52&hourly=temperature_2m&forecast_days=1&timezone=Asia%2FTaipei';
const API_P3 = web({
  brief: '專案：逐時氣溫。抓台北今天的逐時預報（<code>data.hourly.time</code> 與 <code>data.hourly.temperature_2m</code> 是兩個<b>對應的陣列</b>），顯示<b>前 6 筆</b>，每筆一個 <code>li data-testid="hour"</code>，內容像「00:00　21.7°C」。',
  hint: '時間字串像 <code>2026-10-29T03:00</code>，用 <code>time.slice(11, 16)</code> 取出「03:00」。用索引 <code>i</code> 同時取兩個陣列的值：<code>data.hourly.time.slice(0, 6).map((t, i) =&gt; ...)</code>。',
    demo: `<p>換個例子：東京<b>逐時風速</b>的前 4 筆（兩個對應的陣列）。</p>${pre(`async function loadWind() {
  const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=35.68&longitude=139.69&hourly=wind_speed_10m&forecast_days=1&timezone=Asia%2FTokyo');
  const data = await response.json();
  // 做什麼：只取前 4 個時間，用 i 去對風速。為什麼：兩個陣列同一個位置才是同一小時。
  data.hourly.time.slice(0, 4).forEach((t, i) => {
    const li = document.createElement('li');
    // 做什麼：切出時分。為什麼：原始字串太長，使用者只想看「03:00」。
    li.textContent = t.slice(11, 16) + '　' + data.hourly.wind_speed_10m[i] + ' km/h';
    list.append(li);
  });
}
loadWind();`)}`,
  steps: [
    `先拿資料：<pre>const response = await fetch(API);
const data = await response.json();</pre><br>為什麼：沒有資料就沒得顯示，這是起點。`,
    `<code>data.hourly.time</code>（時間）和 <code>data.hourly.temperature_2m</code>（氣溫）是兩個<b>對應</b>的陣列：第 i 個時間配第 i 個氣溫。<br>為什麼：兩個陣列同一個位置才是同一小時，要靠索引對起來。`,
    `只取前 6 個時間，用索引 <code>i</code> 去對氣溫：<pre>data.hourly.time.slice(0, 6).forEach((t, i) =&gt; {
  ...
});</pre><br>為什麼：只要前 6 筆，用 slice 先截好再逐筆處理。`,
    `forEach 裡面：<pre>const li = document.createElement('li');
li.dataset.testid = 'hour';
li.textContent = t.slice(11, 16) + '　' + data.hourly.temperature_2m[i] + '°C';
list.append(li);</pre><code>t.slice(11, 16)</code> 把「2026-10-29T03:00」切成「03:00」。<br>為什麼：原始時間太長，切成「03:00」使用者才看得懂。`
  ],
  starter: `<h3>台北今天的逐時氣溫（前 6 筆）</h3>
<ul id="list"></ul>
<script>
const API = '${HOURLY}';
const list = document.querySelector('#list');
// TODO: fetch API，取 data.hourly.time 與 data.hourly.temperature_2m 的前 6 筆
//       每筆建立 <li data-testid="hour">，內容像「00:00　21.7°C」
</script>
`,
  solution: `<h3>台北今天的逐時氣溫（前 6 筆）</h3>
<ul id="list"></ul>
<script>
const API = '${HOURLY}';
const list = document.querySelector('#list');
async function load() {
  const response = await fetch(API);
  const data = await response.json();
  data.hourly.time.slice(0, 6).forEach((t, i) => {
    const li = document.createElement('li');
    li.dataset.testid = 'hour';
    li.textContent = t.slice(11, 16) + '　' + data.hourly.temperature_2m[i] + '°C';
    list.append(li);
  });
}
load();
</script>
`,
  test: async (c) => {
    const f = [];
    let real; try { real = (await get(HOURLY)).hourly; } catch (e) { return [NONET]; }
    if (!(await c.waitFor(() => c.ta('hour').length >= 1))) return ['等了 7 秒，沒有看到任何 data-testid="hour" 的項目'];
    const items = c.ta('hour').map(txt);
    if (items.length !== 6) f.push(`應該剛好 6 筆，目前 ${items.length} 筆`);
    items.forEach((t, i) => {
      if (i >= 6) return;
      if (!t.includes(real.time[i].slice(11, 16))) f.push(`第 ${i + 1} 筆應該是 ${real.time[i].slice(11, 16)} 的資料，目前是「${t}」`);
      else if (!t.includes(String(real.temperature_2m[i]))) f.push(`第 ${i + 1} 筆（${real.time[i].slice(11, 16)}）的氣溫應該是 ${real.temperature_2m[i]}，目前是「${t}」`);
    });
    return f.slice(0, 4);
  },
});

/* ============================ 第 6 堂：快取 1 ============================ */
const WBASE = 'https://api.open-meteo.com/v1/forecast?current=temperature_2m';
const CITIES = "{ taipei: [25.05, 121.52], tokyo: [35.68, 139.69] }";
const A6 = {
  id: 'api6', title: '第 6 堂　快取 1：什麼時候該用 cache？記憶體快取',
  steps: [
    { say: `<p>先看<b>痛點</b>。你做了一個天氣網頁，使用者每點一次「台北」，程式就去敲一次 API：</p>
      <ul><li><b>慢：</b>每次網路來回大約幾百毫秒，使用者要等。</li>
      <li><b>浪費額度：</b>很多免費 API 有次數限制（例如一天 1 萬次）。100 個人各點 10 次，額度就被用掉了。</li>
      <li><b>對方也累：</b>台北 10 分鐘內的氣溫其實幾乎沒變，何必每次重問？</li></ul>
      <p>比喻：你想知道今天幾度。每次都跑去氣象局問（<b>敲 API</b>），不如第一次問完<b>抄在便條紙上</b>（<b>cache 快取</b>），接下來直接看便條紙。</p>`,
      check: choice('<code>cache</code>（快取）的核心想法是？', ['問過的答案先存起來，下次直接用', '讓 fetch 出錯時不要當掉', '把資料變成 JSON'], 0, '快取 = 便條紙：存起來，省下重複的請求。') },
    { say: `<p><b>什麼時候該用？什麼時候不能用？</b>這是最重要的判斷：</p>
      <ul><li>✅ <b>適合：</b>短時間內不會變的資料——天氣（10 分鐘）、匯率、城市／商品分類清單、維基百科文章。</li>
      <li>✅ <b>適合：</b>同一個問題一直被重複問；或 API 很慢、有次數限制。</li>
      <li>❌ <b>不適合：</b>要<b>即時</b>的資料——演唱會剩餘座位、訂單狀態、結帳金額。存起來的是舊的，會讓使用者買到已經賣掉的位子。</li>
      <li>❌ <b>不適合：</b>每個人不一樣的<b>私人資料</b>放在<b>共用</b>快取（後端快取），會被別人看到。</li></ul>
      <p>口訣：<b>「慢一點知道也沒關係」的資料才能快取</b>。</p>`,
      check: choice('下面哪一種資料<b>最不</b>適合快取？', ['演唱會「現在還剩幾個座位」', '台北 10 分鐘內的氣溫', '日圓兌美金的匯率'], 0, '座位會一直被買走，存起來的數字很快就是錯的。') },
    { say: `<p>設計快取，永遠要回答<b>三個問題</b>：</p>
      <ol><li><b>存在哪？</b>記憶體（變數）、localStorage、後端、瀏覽器自己的 HTTP 快取。</li>
      <li><b>用什麼當 key（找東西的標籤）？</b>例如城市名 <code>'taipei'</code>。不同問題一定要不同 key，不然台北會拿到東京的答案。</li>
      <li><b>多久過期（TTL，Time To Live）？</b>天氣 10 分鐘，匯率 1 小時，城市清單可以 1 天。</li></ol>
      <p>這一堂先學最簡單的：存在<b>記憶體</b>，下一堂學 localStorage 加過期時間。</p>`,
      check: choice('快取的 key（標籤）如果「東京」和「台北」用同一個，會怎樣？', ['查東京會拿到台北的答案', '什麼事都不會發生', '網頁會自動報錯'], 0, 'key 要能分辨不同的問題。') },
    { say: `<p><b>前端快取 vs 後端快取：</b></p>
      <ul><li><b>前端快取：</b>存在<b>這個使用者</b>的瀏覽器裡，只幫到他自己。</li>
      <li><b>後端快取：</b>存在你的<b>伺服器</b>，<b>所有使用者共用</b>。第一個人查過，之後的人全部秒回，最能省第三方 API 的額度。</li></ul>
      ${pre("// 後端（Node.js）的快取長這樣：一個 Map 加上過期時間\nconst cache = new Map();   // key → { data, savedAt }\nconst TTL = 10 * 60 * 1000;   // 10 分鐘（毫秒）\n\nasync function getWeather(city) {\n  const hit = cache.get(city);\n  if (hit && Date.now() - hit.savedAt < TTL) return hit.data;  // 還新鮮 → 直接回\n\n  const response = await fetch(urlOf(city));   // 沒有或過期 → 才去問第三方\n  if (!response.ok) throw new Error(`連線失敗：${response.status}`);\n  const data = await response.json();\n  cache.set(city, { data, savedAt: Date.now() });\n  return data;\n}")}<p>前端的寫法和它幾乎一樣，這就是你問的「前端、後端的差別」：<b>邏輯相同，差在存在誰那裡、幫到誰</b>。</p>`,
      check: choice('想讓<b>所有使用者</b>都共用同一份天氣快取、省 API 額度，要放在？', ['你的後端伺服器', '每個人的瀏覽器', '網頁標題'], 0, '後端快取是共用的；前端快取只屬於單一使用者。') },
    { say: `<p>記憶體快取用 JavaScript 內建的 <code>Map</code>，三個指令就夠了：</p>${pre("const cache = new Map();\n\ncache.set('taipei', 24.3);   // 存：key → 值\ncache.has('taipei');          // 有嗎？ true / false\ncache.get('taipei');          // 取：24.3")}<p>缺點：它只活在這一頁的記憶體裡，<b>重新整理網頁就全部消失</b>。（下一堂用 localStorage 解決）</p>`,
      check: choice('用 <code>Map</code> 做的記憶體快取，重新整理網頁後？', ['全部消失', '還在', '自動上傳到後端'], 0, '變數活在記憶體裡，頁面重新載入就重來了。') },
    { say: `<p>最重要的流程：<b>先問快取，沒有才問 API，問完順手存起來</b>。用你上課那種 <code>response</code>／<code>error</code> 寫法：</p>${pre("async function load(name) {\n  // ① 先問快取：有就直接用，不必發請求\n  if (cache.has(name)) {\n    show(cache.get(name), '來自快取');\n    return;                      // ← 很重要：用完快取就結束\n  }\n  try {\n    // ② 沒有才去問 API\n    const response = await fetch(url);\n    if (!response.ok) throw new Error(`連線失敗：${response.status}`);\n    const data = await response.json();\n    // ③ 存起來，下次就不用再問\n    cache.set(name, data.current.temperature_2m);\n    show(data.current.temperature_2m, '來自網路');\n  } catch (error) {\n    show('', '載入失敗：' + error.message);\n  }\n}")}<p>注意：只有成功（<code>response.ok</code>）才存。失敗的結果<b>不能</b>存，不然下次還是拿到錯的。</p>`,
      check: choice('流程的正確順序是？', ['先查快取 → 沒有才 fetch → 成功後存起來', '先 fetch → 再查快取', '只有 fetch，不用存'], 0, '快取的目的就是「能不問就不問」。') },
    { say: `<p><b>小型示範專案：匯率快取。</b>按「美金」或「歐元」，顯示換成日圓的匯率。每一步為什麼這樣做：</p>${pre("const rates = new Map();                  // 為什麼：準備一個便條紙\n\nasync function showRate(base) {\n  if (rates.has(base)) {                  // 為什麼：先看便條紙有沒有\n    out.textContent = base + ' → ' + rates.get(base) + '（快取）';\n    return;                               // 為什麼：有就結束，不碰網路\n  }\n  try {\n    const response = await fetch('https://api.frankfurter.dev/v1/latest?base=' + base + '&symbols=JPY');\n    if (!response.ok) throw new Error(`連線失敗：${response.status}`);  // 為什麼：fetch 不會自己判斷 4xx/5xx\n    const data = await response.json();\n    rates.set(base, data.rates.JPY);      // 為什麼：成功才存，下次直接用\n    out.textContent = base + ' → ' + data.rates.JPY + '（網路）';\n  } catch (error) {\n    out.textContent = '失敗：' + error.message;   // 為什麼：使用者要知道發生什麼事\n  }\n}")}<p>測試方法：連點兩次「美金」，第二次應該顯示「快取」；再點「歐元」會顯示「網路」。接下來換你，用天氣做同樣的事。</p>`,
      check: choice('連點兩次「美金」，第二次為什麼不會再發請求？', ['因為 rates 裡已經有 USD 的答案', '因為網路變快了', '因為 fetch 壞了'], 0, '<code>rates.has(base)</code> 為 true，直接 return。') },
  ],
  final: web({
    brief: '台北、東京氣溫查詢加上<b>記憶體快取</b>：按「台北」或「東京」，<code>temp</code> 顯示氣溫、<code>source</code> 顯示「來自網路」或「來自快取」。<b>同一個城市第二次查，不可以再發請求</b>（要顯示「來自快取」）。',
    hint: '照 TODO 1～4 做：先問 <code>cache.has(name)</code>，沒有才 fetch，成功後 <code>cache.set(name, 氣溫)</code>。檢查時會偷偷數你發了幾次請求。',
    demo: `<p>範例（匯率換算器）：同一個幣別只問一次 API。</p>${pre("const rates = new Map();\nasync function showRate(base) {\n  if (rates.has(base)) { out.textContent = rates.get(base) + '（快取）'; return; }  // 先問便條紙\n  const response = await fetch(URL + base);                                       // 沒有才問 API\n  const data = await response.json();\n  rates.set(base, data.rates.JPY);                                                // 存起來\n  out.textContent = data.rates.JPY + '（網路）';\n}")}<p>為什麼 <code>return</code> 要寫在 if 裡面？因為用快取回答完就結束了，不能再往下去 fetch。</p>`,
    steps: [
      `看 starter：<code>cities</code> 是各城市的座標，<code>cache</code> 是準備好的 Map，<code>show()</code> 負責把結果放進畫面。你只要補 <code>load(name)</code>。<br>為什麼：座標和畫面都先幫你準備好，讓你專心練快取。`,
      `TODO 1：先問快取<pre>if (cache.has(name)) {\n  show(cache.get(name), '來自快取');\n  return;\n}</pre>為什麼：有答案就不用發請求，這就是快取省下的那一次。`,
      `TODO 2：沒有才去 API<pre>const [lat, lon] = cities[name];\nconst response = await fetch(WBASE + '&latitude=' + lat + '&longitude=' + lon);\nif (!response.ok) throw new Error('連線失敗：' + response.status);\nconst data = await response.json();</pre>為什麼：不同城市座標不同；檢查 <code>response.ok</code> 是因為 fetch 不會替你判斷 500。`,
      `TODO 3：存起來並顯示<pre>cache.set(name, data.current.temperature_2m);\nshow(data.current.temperature_2m, '來自網路');</pre>為什麼：下次再查同一個城市，TODO 1 就找得到了。`,
      `TODO 4（catch）：<pre>show('', '載入失敗：' + error.message);</pre>為什麼：失敗要讓使用者知道，而且<b>失敗不要存進快取</b>。<br>最常犯的錯：忘了在「用快取回答」後面寫 <code>return</code>，結果快取和網路都跑了一次。`,
    ],
    starter: `<h3>城市氣溫</h3>
<button data-testid="taipei">台北</button> <button data-testid="tokyo">東京</button>
<p data-testid="temp">--</p>
<p data-testid="source"></p>
<script>
const WBASE = '${WBASE}';
const cities = ${CITIES};
const temp = document.querySelector('[data-testid="temp"]');
const source = document.querySelector('[data-testid="source"]');
const cache = new Map();   // 快取：城市名 → 氣溫

function show(value, from) {
  temp.textContent = value === '' ? '--' : value + ' °C';
  source.textContent = from;
}

async function load(name) {
  // TODO 1: 如果 cache.has(name)：show(cache.get(name), '來自快取') 然後 return
  try {
    // TODO 2: 用 cities[name] 的座標 fetch（WBASE + '&latitude=' + lat + '&longitude=' + lon），檢查 response.ok，response.json()
    // TODO 3: cache.set(name, 氣溫)，show(氣溫, '來自網路')
  } catch (error) {
    // TODO 4: show('', '載入失敗：' + error.message)
  }
}

document.querySelector('[data-testid="taipei"]').onclick = () => load('taipei');
document.querySelector('[data-testid="tokyo"]').onclick = () => load('tokyo');
</script>
`,
    solution: `<h3>城市氣溫</h3>
<button data-testid="taipei">台北</button> <button data-testid="tokyo">東京</button>
<p data-testid="temp">--</p>
<p data-testid="source"></p>
<script>
const WBASE = '${WBASE}';
const cities = ${CITIES};
const temp = document.querySelector('[data-testid="temp"]');
const source = document.querySelector('[data-testid="source"]');
const cache = new Map();

function show(value, from) {
  temp.textContent = value === '' ? '--' : value + ' °C';
  source.textContent = from;
}

async function load(name) {
  if (cache.has(name)) {
    show(cache.get(name), '來自快取');
    return;
  }
  try {
    const [lat, lon] = cities[name];
    const response = await fetch(WBASE + '&latitude=' + lat + '&longitude=' + lon);
    if (!response.ok) throw new Error('連線失敗：' + response.status);
    const data = await response.json();
    cache.set(name, data.current.temperature_2m);
    show(data.current.temperature_2m, '來自網路');
  } catch (error) {
    show('', '載入失敗：' + error.message);
  }
}

document.querySelector('[data-testid="taipei"]').onclick = () => load('taipei');
document.querySelector('[data-testid="tokyo"]').onclick = () => load('tokyo');
</script>
`,
    must: [{ re: /cache\.has\(|cache\.get\(/, msg: '請先用 cache.has(...) 問快取' }, { re: /cache\.set\(/, msg: '成功拿到資料後，要用 cache.set(...) 存起來' }],
    test: async (c) => {
      const f = [], T = (id) => c.t(id), src = () => txt(T('source')), tp = () => txt(T('temp'));
      if (!T('taipei') || !T('tokyo') || !T('temp') || !T('source')) return ['缺少 taipei / tokyo / temp / source 元素（不要刪掉 data-testid）'];
      c.win.__fc = 0;
      await c.click(T('taipei'));
      if (!(await c.waitFor(() => /網路/.test(src()) && /\d/.test(tp())))) return ['第一次查台北，source 應該顯示「來自網路」、temp 要有氣溫（等了 7 秒沒有）。目前 source=「' + src() + '」'];
      const n1 = c.win.__fc;
      if (n1 !== 1) f.push(`第一次查台北應該只發 1 次請求，目前發了 ${n1} 次`);
      await c.click(T('taipei')); await c.wait(400);
      if (!/快取/.test(src())) f.push('第二次查台北，source 應該顯示「來自快取」，目前是「' + src() + '」。記得先 cache.has(name)，有就 return');
      if (c.win.__fc !== n1) f.push(`第二次查同一個城市不可以再發請求（請求從 ${n1} 次變成 ${c.win.__fc} 次）`);
      await c.click(T('tokyo'));
      if (!(await c.waitFor(() => /網路/.test(src()) && /\d/.test(tp())))) f.push('查東京應該是「來自網路」（不同城市要用不同的 key）');
      const n2 = c.win.__fc;
      await c.click(T('taipei')); await c.wait(400);
      if (!/快取/.test(src()) || c.win.__fc !== n2) f.push('回頭再查台北，應該還在快取裡（來自快取、不發請求）');
      return f;
    },
  }),
};

/* ============================ 第 7 堂：快取 2 ============================ */
const A7 = {
  id: 'api7', title: '第 7 堂　快取 2：localStorage 與過期時間 TTL',
  steps: [
    { say: `<p>上一堂的 <code>Map</code> 快取有個缺點：<b>重新整理就沒了</b>。想讓快取在重新整理、甚至關掉瀏覽器後還在，就存進 <b>localStorage</b>——瀏覽器內建的小倉庫，存在使用者的電腦上。</p><p>限制：<b>只能存文字</b>，而且只屬於這個網站、這個瀏覽器。</p>`,
      check: choice('想讓快取在「重新整理後還在」，要存在？', ['localStorage', 'Map（記憶體）', 'console.log'], 0, 'localStorage 存在瀏覽器裡，重新整理不會消失。') },
    { say: `<p>localStorage 三個指令：</p>${pre("localStorage.setItem('名字', '文字');   // 存\nlocalStorage.getItem('名字');          // 取（沒有的話是 null）\nlocalStorage.removeItem('名字');       // 刪")}<p>注意 <code>getItem</code> 找不到時回傳 <code>null</code>，所以取出來要先判斷有沒有。</p>`,
      check: choice('<code>localStorage.getItem(\'abc\')</code> 如果從來沒存過，會回傳？', ['null', '空字串', '0'], 0, '沒有就是 null，要先判斷。') },
    { say: `<p>要存「物件」怎麼辦？先轉成文字再存，取出來再轉回去：</p>${pre("const obj = { temp: 24.3, savedAt: Date.now() };\nlocalStorage.setItem('k', JSON.stringify(obj));   // 物件 → 文字\n\nconst back = JSON.parse(localStorage.getItem('k'));   // 文字 → 物件\nback.temp;   // 24.3")}<p><code>JSON.stringify</code> 打包，<code>JSON.parse</code> 拆包。</p>`,
      check: choice('把物件存進 localStorage 前，要先用？', ['JSON.stringify', 'JSON.parse', 'Math.round'], 0, 'stringify 打包成文字，parse 拆回物件。') },
    { say: `<p><b>為什麼一定要有過期時間（TTL）？</b>沒有過期的快取會永遠顯示舊資料——一個月前的天氣當然不行。</p><p>做法：存的時候記下<b>存的時間</b> <code>savedAt = Date.now()</code>（現在的毫秒數）。讀的時候算「過了多久」：</p>${pre("const TTL = 10 * 60 * 1000;   // 10 分鐘 = 10 × 60 秒 × 1000 毫秒\n\nconst age = Date.now() - saved.savedAt;   // 存了多久（毫秒）\nif (age > TTL) { /* 太舊了，不能用 */ }")}`,
      check: choice('10 分鐘等於多少毫秒？', ['600000', '10000', '60000'], 0, '10 × 60 × 1000 = 600000。') },
    { say: `<p>把它們組成一個「讀快取」函式：<b>沒有、過期、壞掉</b>都回傳 <code>null</code>：</p>${pre("function readCache() {\n  try {\n    const text = localStorage.getItem(KEY);\n    if (!text) return null;                          // 從來沒存過\n    const saved = JSON.parse(text);                  // 拆包\n    if (Date.now() - saved.savedAt > TTL) return null;   // 太舊了\n    return saved;                                    // 新鮮的，可以用\n  } catch (error) {\n    return null;                                     // 資料被改壞了（JSON.parse 會丟錯）\n  }\n}")}<p>為什麼要 try/catch？使用者可以自己打開開發者工具改 localStorage，<code>JSON.parse</code> 遇到壞掉的文字會丟錯，程式不能因此當掉。</p>`,
      check: choice('<code>readCache()</code> 為什麼要用 try / catch 包起來？', ['localStorage 裡的文字可能被改壞，JSON.parse 會丟錯', '因為 fetch 會丟錯', '為了讓程式變快'], 0, '快取的內容不是你完全能控制的，要防呆。') },
    { say: `<p>搭配 <code>load()</code>：</p>${pre("async function load() {\n  const cached = readCache();\n  if (cached) { show(cached.temp, '來自快取'); return; }   // 新鮮 → 直接用\n\n  try {\n    const response = await fetch(url);\n    if (!response.ok) throw new Error(`連線失敗：${response.status}`);\n    const data = await response.json();\n    const temp = data.current.temperature_2m;\n    localStorage.setItem(KEY, JSON.stringify({ temp, savedAt: Date.now() }));  // 存起來＋記時間\n    show(temp, '來自網路');\n  } catch (error) {\n    show('', '載入失敗：' + error.message);\n  }\n}")}<p>重點是 <code>savedAt: Date.now()</code>：<b>每次存都要更新時間</b>，不然快取永遠算「很舊」。</p>`,
      check: choice('快取存進去時，一定要一起記下什麼，才知道何時過期？', ['存的時間 savedAt', '使用者名字', '網址的長度'], 0, '沒有時間就沒辦法判斷過沒過期。') },
    { say: `<p><b>小型示範專案：匯率 1 小時快取。</b>每一步為什麼：</p>${pre("const KEY = 'api-cache-fx';       // 為什麼：固定名字才找得到\nconst TTL = 60 * 60 * 1000;         // 為什麼：匯率一小時內變動不大\n\nfunction readCache() {...同上...}  // 為什麼：把「能不能用」的判斷包成一個函式\n\nasync function load() {\n  const cached = readCache();\n  if (cached) { out.textContent = cached.rate + '（快取）'; return; }\n  try {\n    const response = await fetch(FX);\n    if (!response.ok) throw new Error(`連線失敗：${response.status}`);\n    const data = await response.json();\n    localStorage.setItem(KEY, JSON.stringify({ rate: data.rates.JPY, savedAt: Date.now() }));\n    out.textContent = data.rates.JPY + '（網路）';\n  } catch (error) {\n    out.textContent = '失敗：' + error.message;\n  }\n}")}<p>怎麼測：點兩次，第二次是「快取」；到開發者工具把 <code>savedAt</code> 改成一小時前，再點一次，又會變回「網路」。換你做天氣版！</p>`,
      check: choice('快取已經超過 TTL，再按一次查詢，會？', ['重新發請求，並存下新的快取', '繼續顯示舊資料', '網頁當掉'], 0, '過期 = 不能用，要重新問 API。') },
  ],
  final: web({
    brief: '台北氣溫加上 <b>localStorage 快取（10 分鐘過期）</b>：按「查詢」，<code>temp</code> 顯示氣溫、<code>source</code> 顯示「來自網路」或「來自快取」。快取用 key <code>api-cache-taipei</code> 存成 <code>{ temp, savedAt }</code>。快取沒過期就不可以再發請求；超過 10 分鐘就要重新抓。',
    hint: '先完成 <code>readCache()</code>（沒有、過期、壞掉都回 null），再在 <code>load()</code> 成功後 <code>localStorage.setItem</code>。檢查時會自己把 savedAt 改成 11 分鐘前，看你有沒有重新抓。',
    demo: `<p>範例（匯率 1 小時快取）：</p>${pre("const KEY = 'api-cache-fx', TTL = 60 * 60 * 1000;\nfunction readCache() {\n  try {\n    const saved = JSON.parse(localStorage.getItem(KEY));   // 沒有的話 parse(null) 得到 null\n    if (!saved || Date.now() - saved.savedAt > TTL) return null;   // 沒有或過期 → null\n    return saved;\n  } catch (error) { return null; }                         // 壞掉也當作沒有\n}\nasync function load() {\n  const cached = readCache();\n  if (cached) return show(cached.rate, '快取');             // 新鮮就用\n  const response = await fetch(FX);\n  const data = await response.json();\n  localStorage.setItem(KEY, JSON.stringify({ rate: data.rates.JPY, savedAt: Date.now() }));\n  show(data.rates.JPY, '網路');\n}")}`,
    steps: [
      `看 starter：<code>KEY</code>（倉庫裡的名字）、<code>TTL</code>（10 分鐘）、<code>show()</code> 都準備好了。要補的是 <code>readCache()</code> 和 <code>load()</code> 的 TODO。<br>為什麼：key 和 TTL 寫成常數，之後要改只改一個地方。`,
      `TODO 1（readCache，全部包在 try 裡）：<pre>const text = localStorage.getItem(KEY);\nif (!text) return null;\nconst saved = JSON.parse(text);\nif (Date.now() - saved.savedAt > TTL) return null;\nreturn saved;</pre>為什麼：沒有、過期的情況都回 null，讓 load() 知道「要去問 API」。`,
      `TODO 2（catch 裡）：<pre>return null;</pre>為什麼：快取內容壞掉時，當作沒有快取，不要讓程式當掉。`,
      `TODO 3（load 成功後）：<pre>localStorage.setItem(KEY, JSON.stringify({ temp, savedAt: Date.now() }));</pre>為什麼：要連「存的時間」一起存，下次才知道有沒有過期。`,
      `按「送出檢查」。最常犯的錯：<code>savedAt</code> 寫成固定數字、或忘了 <code>JSON.stringify</code>（直接存物件會變成 "[object Object]"）。`,
    ],
    starter: `<button data-testid="load">查詢台北氣溫</button>
<p data-testid="temp">--</p>
<p data-testid="source"></p>
<script>
const API = '${WBASE}&latitude=25.05&longitude=121.52';
const KEY = 'api-cache-taipei';
const TTL = 10 * 60 * 1000;   // 10 分鐘（毫秒）
const temp = document.querySelector('[data-testid="temp"]');
const source = document.querySelector('[data-testid="source"]');

function show(value, from) {
  temp.textContent = value === '' ? '--' : value + ' °C';
  source.textContent = from;
}

// 回傳「還沒過期」的快取；沒有、過期、壞掉都回傳 null
function readCache() {
  try {
    // TODO 1: 取出 localStorage.getItem(KEY)，沒有就 return null；JSON.parse 後，Date.now() - saved.savedAt > TTL 也 return null；否則 return saved
  } catch (error) {
    // TODO 2: return null
  }
}

async function load() {
  const cached = readCache();
  if (cached) {
    show(cached.temp, '來自快取');
    return;
  }
  try {
    const response = await fetch(API);
    if (!response.ok) throw new Error('連線失敗：' + response.status);
    const data = await response.json();
    const t = data.current.temperature_2m;
    // TODO 3: localStorage.setItem(KEY, JSON.stringify({ temp: t, savedAt: Date.now() }))
    show(t, '來自網路');
  } catch (error) {
    show('', '載入失敗：' + error.message);
  }
}

document.querySelector('[data-testid="load"]').onclick = load;
</script>
`,
    solution: `<button data-testid="load">查詢台北氣溫</button>
<p data-testid="temp">--</p>
<p data-testid="source"></p>
<script>
const API = '${WBASE}&latitude=25.05&longitude=121.52';
const KEY = 'api-cache-taipei';
const TTL = 10 * 60 * 1000;
const temp = document.querySelector('[data-testid="temp"]');
const source = document.querySelector('[data-testid="source"]');

function show(value, from) {
  temp.textContent = value === '' ? '--' : value + ' °C';
  source.textContent = from;
}

function readCache() {
  try {
    const text = localStorage.getItem(KEY);
    if (!text) return null;
    const saved = JSON.parse(text);
    if (Date.now() - saved.savedAt > TTL) return null;
    return saved;
  } catch (error) {
    return null;
  }
}

async function load() {
  const cached = readCache();
  if (cached) {
    show(cached.temp, '來自快取');
    return;
  }
  try {
    const response = await fetch(API);
    if (!response.ok) throw new Error('連線失敗：' + response.status);
    const data = await response.json();
    const t = data.current.temperature_2m;
    localStorage.setItem(KEY, JSON.stringify({ temp: t, savedAt: Date.now() }));
    show(t, '來自網路');
  } catch (error) {
    show('', '載入失敗：' + error.message);
  }
}

document.querySelector('[data-testid="load"]').onclick = load;
</script>
`,
    must: [{ re: /localStorage\.setItem/, msg: '成功後要用 localStorage.setItem 存起來' }, { re: /Date\.now\(\)/, msg: '要用 Date.now() 記下存的時間、並判斷是否過期' }, { re: /JSON\.stringify/, msg: '物件要先用 JSON.stringify 變成文字才能存' }],
    test: async (c) => {
      const f = [], src = () => txt(c.t('source')), btn = c.t('load');
      if (!btn || !c.t('temp') || !c.t('source')) return ['缺少 load / temp / source 元素（不要刪掉 data-testid）'];
      const KEY = 'api-cache-taipei', ls = c.win.localStorage;
      ls.removeItem(KEY); c.win.__fc = 0;
      await c.click(btn);
      if (!(await c.waitFor(() => /網路/.test(src()) && /\d/.test(txt(c.t('temp')))))) return ['第一次查詢，source 應該是「來自網路」、temp 要有氣溫（目前 source=「' + src() + '」）'];
      let saved; try { saved = JSON.parse(ls.getItem(KEY)); } catch (e) { saved = null; }
      if (!saved || typeof saved.temp !== 'number' || typeof saved.savedAt !== 'number') return ['成功後要把 { temp, savedAt } 存進 localStorage 的 "api-cache-taipei"（目前是：' + ls.getItem(KEY) + '）'];
      const n1 = c.win.__fc;
      await c.click(btn); await c.wait(400);
      if (!/快取/.test(src()) || c.win.__fc !== n1) f.push('10 分鐘內再查，應該是「來自快取」而且不發請求');
      ls.setItem(KEY, JSON.stringify({ ...saved, savedAt: Date.now() - 11 * 60 * 1000 }));
      await c.click(btn);
      if (!(await c.waitFor(() => /網路/.test(src()) && c.win.__fc === n1 + 1))) f.push('快取已經超過 10 分鐘，應該重新抓（來自網路、發 1 次新請求），目前 source=「' + src() + '」');
      const n2 = c.win.__fc;
      ls.setItem(KEY, '{壞掉的資料');
      await c.click(btn);
      if (!(await c.waitFor(() => c.win.__fc === n2 + 1, 3000))) f.push('localStorage 的內容壞掉時，readCache 要回 null（用 try / catch），然後重新抓');
      return f;
    },
  }),
};

/* ============================ 第 8 堂：快取 3 ============================ */
const A8 = {
  id: 'api8', title: '第 8 堂　快取 3：失敗時退回舊資料',
  steps: [
    { say: `<p>快取除了加速，還有一個很實用的功能：<b>備案</b>。</p><p>使用者在電梯裡網路斷了，你的網頁該顯示什麼？「載入失敗」＝空白、使用者什麼都看不到。但如果你顯示<b>十分鐘前的氣溫</b>，並標示「這是舊資料」，使用者還是得到有用的資訊。</p><p>原則：<b>有舊資料比沒有資料好，但一定要告訴使用者它是舊的。</b></p>`,
      check: choice('斷網時，顯示「舊資料並標示是舊的」比起「只顯示載入失敗」？', ['對使用者更友善', '比較危險，不該這樣做', '一樣'], 0, '有參考值總比空白好，但要誠實標示。') },
    { say: `<p>流程圖（用文字畫）：</p>${pre("嘗試 fetch\n ├─ 成功 → 顯示新資料 → 存進快取（記時間）\n └─ 失敗（斷網 或 500）→ 進 catch\n        ├─ 快取裡有舊資料 → 顯示舊資料 + 「網路失敗，顯示舊資料」\n        └─ 完全沒有 → 顯示「載入失敗：」+ error.message")}<p>注意這裡<b>不管有沒有過期</b>，只要有就能當備案——因為這時候新資料拿不到，舊的總比沒有好。</p>`,
      check: choice('斷網、而且從來沒有存過快取，應該顯示？', ['載入失敗：加上錯誤原因', '舊資料', '空白，什麼都不用說'], 0, '沒有任何資料可以給時，才顯示失敗訊息。') },
    { say: `<p>程式長這樣（接續你學過的 <code>response</code>／<code>error</code>）：</p>${pre("async function load() {\n  try {\n    const response = await fetch(url);\n    if (!response.ok) throw new Error(`連線失敗：${response.status}`);\n    const data = await response.json();\n    localStorage.setItem(KEY, JSON.stringify({ temp: data.current.temperature_2m, savedAt: Date.now() }));\n    show(data.current.temperature_2m, '最新資料');\n  } catch (error) {\n    const old = JSON.parse(localStorage.getItem(KEY) || 'null');   // 沒存過就是 null\n    if (old) {\n      show(old.temp, `網路失敗（${error.message}），顯示舊資料`);\n    } else {\n      show('', `載入失敗：${error.message}`);\n    }\n  }\n}")}<p><code>localStorage.getItem(KEY) || 'null'</code>：沒存過會得到 null，<code>JSON.parse(null)</code> 雖然也行，但寫成 <code>'null'</code> 比較清楚。</p>`,
      check: choice('catch 裡讀到 <code>old</code>（有舊資料），要做什麼？', ['顯示舊資料並說明網路失敗', '丟掉舊資料，顯示空白', '再 fetch 一次'], 0, '把舊資料當備案，並告訴使用者原因。') },
    { say: `<p><b>千萬不要把錯誤結果存進快取。</b>想像伺服器壞掉回了 500，你把「錯誤」存起來了，之後 10 分鐘內每個人都看到錯的——這叫<b>快取污染</b>。</p><p>所以存快取的那行要放在 <code>if (!response.ok) throw ...</code> <b>之後</b>：只有確定成功才會跑到。</p>`,
      check: choice('下面哪個時機才可以把資料存進快取？', ['確認 response.ok 之後', '送出 fetch 之前', '不管成功失敗都存'], 0, '先確認成功，再存。') },
    { say: `<p>快取什麼時候要<b>換新</b>？三種時機：</p><ul><li><b>到期（TTL）：</b>自動換。</li><li><b>使用者主動要求：</b>按「重新整理」按鈕時，應該<b>略過快取</b>強制重新抓。</li><li><b>資料確定改變了：</b>例如使用者剛發了新文章，就把舊的文章列表快取刪掉（<code>removeItem</code>）。</li></ul><p>電腦科學有句名言：「電腦科學只有兩件難事——快取失效，和幫東西取名字。」所以一定要想清楚<b>什麼時候讓快取失效</b>。</p>`,
      check: choice('使用者按了「重新整理」按鈕，想看最新資料，快取該？', ['略過，直接重新抓', '照常使用快取', '把網頁關掉'], 0, '使用者明確要最新的，就不能再給舊的。') },
    { say: `<p><b>小型示範專案：</b>匯率顯示加「斷網退回舊資料」。每一步為什麼：</p>${pre("async function load() {\n  status.textContent = '載入中…';                        // 為什麼：使用者要知道正在做事\n  try {\n    const response = await fetch(FX);\n    if (!response.ok) throw new Error(`連線失敗：${response.status}`);   // 為什麼：500 不會自動丟錯\n    const data = await response.json();\n    localStorage.setItem(KEY, JSON.stringify({ rate: data.rates.JPY }));   // 為什麼：成功才存，且在 ok 之後\n    rate.textContent = data.rates.JPY;\n    status.textContent = '最新資料';\n  } catch (error) {\n    const old = JSON.parse(localStorage.getItem(KEY) || 'null');   // 為什麼：失敗時看看有沒有備案\n    rate.textContent = old ? old.rate : '--';\n    status.textContent = old ? '網路失敗，顯示舊資料' : `載入失敗：${error.message}`;   // 為什麼：誠實告訴使用者\n  }\n}")}<p>接下來換你做天氣版，檢查會自己幫你「斷網」和「讓伺服器回 500」。</p>`,
      check: choice('示範裡，第一次就斷網（從沒成功過），畫面會顯示？', ['載入失敗：加原因', '網路失敗，顯示舊資料', '最新資料'], 0, '沒有舊資料可用，只能顯示失敗。') },
  ],
  final: web({
    brief: '台北氣溫：網路正常時顯示氣溫並把 <code>status</code> 設成「最新資料」，同時存進 localStorage（key <code>api-cache-taipei2</code>）。<b>失敗時</b>（斷網或伺服器回 500）：有存過 → 顯示舊氣溫，<code>status</code> 為「網路失敗（原因），顯示舊資料」；從沒存過 → <code>temp</code> 清空、<code>status</code> 為「載入失敗：原因」。',
    hint: '跟第 2 堂一樣的 try / catch，差別在 catch 裡先看有沒有舊資料。快取只能在 <code>response.ok</code> 之後才存。',
    demo: `<p>範例（匯率）：失敗時用舊的匯率。</p>${pre("try {\n  const response = await fetch(FX);\n  if (!response.ok) throw new Error('連線失敗：' + response.status);\n  const data = await response.json();\n  localStorage.setItem(KEY, JSON.stringify({ rate: data.rates.JPY }));   // 成功才存\n  show(data.rates.JPY, '最新資料');\n} catch (error) {\n  const old = JSON.parse(localStorage.getItem(KEY) || 'null');          // 備案\n  if (old) show(old.rate, '網路失敗（' + error.message + '），顯示舊資料');\n  else show('--', '載入失敗：' + error.message);\n}")}`,
    steps: [
      `starter 的 <code>show()</code> 和按鈕都準備好了，補 <code>load()</code> 裡的 TODO 1～3。<br>為什麼：畫面更新的細節先幫你寫好，專心練「成功存、失敗退回」的流程。`,
      `TODO 1（try 裡）：<pre>const response = await fetch(API);\nif (!response.ok) throw new Error('連線失敗：' + response.status);\nconst data = await response.json();</pre>為什麼：500 要自己丟錯誤，才會進到 catch 去找舊資料。`,
      `TODO 2（成功後）：<pre>const t = data.current.temperature_2m;\nlocalStorage.setItem(KEY, JSON.stringify({ temp: t }));\nshow(t, '最新資料');</pre>為什麼：存快取放在 ok 檢查之後，確保存的是好資料。`,
      `TODO 3（catch 裡）：<pre>const old = JSON.parse(localStorage.getItem(KEY) || 'null');\nif (old) {\n  show(old.temp, '網路失敗（' + error.message + '），顯示舊資料');\n} else {\n  show('', '載入失敗：' + error.message);\n}</pre>為什麼：有備案就用備案，並說明原因；真的什麼都沒有才顯示失敗。<br>最常犯的錯：把「載入失敗」和「顯示舊資料」寫成同一句，使用者就分不出有沒有拿到資料。`,
    ],
    starter: `<button data-testid="load">查詢台北氣溫</button>
<p data-testid="temp">--</p>
<p data-testid="status"></p>
<script>
const API = '${WBASE}&latitude=25.05&longitude=121.52';
const KEY = 'api-cache-taipei2';
const temp = document.querySelector('[data-testid="temp"]');
const statusEl = document.querySelector('[data-testid="status"]');

function show(value, message) {
  temp.textContent = value === '' ? '' : value + ' °C';
  statusEl.textContent = message;
}

async function load() {
  statusEl.textContent = '載入中…';
  try {
    // TODO 1: fetch(API)、檢查 response.ok（不 ok 就 throw new Error('連線失敗：' + response.status)）、response.json()
    // TODO 2: 取出 data.current.temperature_2m，存進 localStorage（JSON.stringify({ temp: 氣溫 })），show(氣溫, '最新資料')
  } catch (error) {
    // TODO 3: 讀 localStorage 的舊資料 old；有 → show(old.temp, '網路失敗（' + error.message + '），顯示舊資料')
    //         沒有 → show('', '載入失敗：' + error.message)
  }
}

document.querySelector('[data-testid="load"]').onclick = load;
</script>
`,
    solution: `<button data-testid="load">查詢台北氣溫</button>
<p data-testid="temp">--</p>
<p data-testid="status"></p>
<script>
const API = '${WBASE}&latitude=25.05&longitude=121.52';
const KEY = 'api-cache-taipei2';
const temp = document.querySelector('[data-testid="temp"]');
const statusEl = document.querySelector('[data-testid="status"]');

function show(value, message) {
  temp.textContent = value === '' ? '' : value + ' °C';
  statusEl.textContent = message;
}

async function load() {
  statusEl.textContent = '載入中…';
  try {
    const response = await fetch(API);
    if (!response.ok) throw new Error('連線失敗：' + response.status);
    const data = await response.json();
    const t = data.current.temperature_2m;
    localStorage.setItem(KEY, JSON.stringify({ temp: t }));
    show(t, '最新資料');
  } catch (error) {
    const old = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (old) {
      show(old.temp, '網路失敗（' + error.message + '），顯示舊資料');
    } else {
      show('', '載入失敗：' + error.message);
    }
  }
}

document.querySelector('[data-testid="load"]').onclick = load;
</script>
`,
    must: [{ re: /try\s*\{/, msg: '請用 try { } 包住 fetch' }, { re: /catch/, msg: '請用 catch 接住錯誤' }, { re: /\.ok\b/, msg: '請檢查 response.ok' }, { re: /localStorage\.setItem/, msg: '成功後請把資料存進 localStorage' }, { re: /localStorage\.getItem/, msg: 'catch 裡請讀取 localStorage 的舊資料' }],
    test: async (c) => {
      const f = [], st = () => txt(c.t('status')), tp = () => txt(c.t('temp')), btn = c.t('load');
      if (!btn || !c.t('temp') || !c.t('status')) return ['缺少 load / temp / status 元素（不要刪掉 data-testid）'];
      const ls = c.win.localStorage; ls.removeItem('api-cache-taipei2');
      c.win.__failFetch = true;
      await c.click(btn);
      if (!(await c.waitFor(() => /失敗/.test(st()), 3000))) f.push('斷網又沒有舊資料時，status 應該顯示「載入失敗：…」，目前是「' + st() + '」');
      else { if (/舊資料/.test(st())) f.push('從沒成功過就沒有舊資料，不能顯示「舊資料」'); if (tp() !== '') f.push('沒有資料時 temp 應該清空'); }
      c.win.__failFetch = 'http'; await c.click(btn); await c.wait(500);
      if (ls.getItem('api-cache-taipei2')) f.push('伺服器回 500 時不可以把錯誤結果存進快取（要在 response.ok 之後才存）');
      c.win.__failFetch = false;
      await c.click(btn);
      if (!(await c.waitFor(() => /最新/.test(st()) && /\d/.test(tp())))) return [...f, '網路正常時，status 應該是「最新資料」且 temp 有氣溫（目前 status=「' + st() + '」）'];
      if (!ls.getItem('api-cache-taipei2')) f.push('成功後要把氣溫存進 localStorage 的 "api-cache-taipei2"');
      const good = tp();
      c.win.__failFetch = true; await c.click(btn);
      if (!(await c.waitFor(() => /舊資料/.test(st()), 3000))) f.push('斷網但有舊資料時，status 應該包含「舊資料」，目前是「' + st() + '」');
      else { if (tp() !== good) f.push(`應該繼續顯示舊的氣溫「${good}」，目前是「${tp()}」`); if (!/Failed to fetch/.test(st())) f.push('status 要帶上 error.message，像「網路失敗（Failed to fetch），顯示舊資料」'); }
      c.win.__failFetch = 'http'; await c.click(btn);
      if (!(await c.waitFor(() => /舊資料/.test(st()), 3000))) f.push('伺服器回 500 時，有舊資料也要顯示舊資料（目前「' + st() + '」）');
      c.win.__failFetch = false;
      return f;
    },
  }),
};

const API_QUIZ3 = [
  choice('下面哪一種資料<b>最適合</b>快取？', ['城市的天氣（10 分鐘內變化很小）', '訂票網站的剩餘座位', '使用者的結帳金額'], 0),
  choice('想讓所有使用者共用快取、省第三方 API 的額度，要放在？', ['你的後端伺服器', '每個人的 localStorage', '網頁的 title'], 0),
  choice('快取一定要搭配什麼，才不會永遠顯示舊資料？', ['過期時間（TTL）', '更多的 console.log', '更大的圖片'], 0),
  choice('伺服器回 500 時，下面哪個做法是對的？', ['不要存進快取，有舊資料就顯示舊的並說明', '把 500 的錯誤也存起來', '什麼都不做'], 0),
];

/* ============================ 手把手專案：城市天氣小站（從空白做到完成） ============================ */
const GEOURL = 'https://geocoding-api.open-meteo.com/v1/search?count=1&language=zh&name=';
const WURL = 'https://api.open-meteo.com/v1/forecast?current=temperature_2m';
const SK = `<h2>城市天氣小站</h2>
<input data-testid="city-input" placeholder="輸入城市，例如 Tokyo">
<button data-testid="go">查詢</button>
<p data-testid="status"></p>
<h3 data-testid="place"></h3>
<p data-testid="temp"></p>
`;
const page = (script) => `${SK}<script>\n${script}</script>\n`;
const VARS = `const input = document.querySelector('[data-testid="city-input"]');
const go = document.querySelector('[data-testid="go"]');
const statusEl = document.querySelector('[data-testid="status"]');
const place = document.querySelector('[data-testid="place"]');
const temp = document.querySelector('[data-testid="temp"]');
`;
const CONSTS = `const GEO = '${GEOURL}';
const WEATHER = '${WURL}';
`;
const STAGES = ['空白頁面：先把畫面蓋出來', '按下按鈕，程式有反應', '查城市：第一次真的呼叫 API', '查不到城市怎麼辦', '查天氣：串起第二個 API', '錯誤處理：載入中、失敗、收尾', '加上快取：問過的城市不再重問', '收尾：空白輸入與 Enter 鍵'];
const progressMap = (n) => `<p><b>📍 專案進度：城市天氣小站</b>（我們從一個空白頁面，一步一步做到完整作品）</p><ol>${STAGES.map((t, i) => `<li>${i + 1 < n ? '✅' : i + 1 === n ? '👉 <b>' : '⬜'} ${t}${i + 1 === n ? '</b>' : ''}</li>`).join('')}</ol>`;
const enter = async (c, v) => { await c.type(c.t('city-input'), v); await c.click(c.t('go')); };
const need = (c) => ['city-input', 'go', 'status', 'place', 'temp'].filter((id) => !c.t(id)).map((id) => `缺少 data-testid="${id}" 的元素（不要刪掉）`);
const realCity = async (n) => (await get(GEOURL + encodeURIComponent(n))).results[0];

// W1：空白 → 畫面
const W1S = `<h2>城市天氣小站</h2>
<!-- TODO 1: 寫一個輸入框 <input data-testid="city-input" placeholder="輸入城市，例如 Tokyo"> -->
<!-- TODO 2: 寫一個按鈕 <button data-testid="go">查詢</button> -->
<!-- TODO 3: 寫三個放結果的地方：<p data-testid="status">、<h3 data-testid="place">、<p data-testid="temp"> -->
`;
// W2
const W2SOL = page(`${VARS}
function search() {
  statusEl.textContent = '搜尋中：' + input.value.trim();
}
go.onclick = search;
`);
const W2S = `${SK}<script>
// TODO 1: 用 document.querySelector 把五個元素各存成變數：input、go、statusEl、place、temp
//         寫法：const input = document.querySelector('[data-testid="city-input"]');
// TODO 2: 寫 function search()：把 statusEl.textContent 設成 '搜尋中：' + input.value.trim()
// TODO 3: 按鈕被按下時執行 search：go.onclick = search;
</script>
`;
// W3
const W3SOL = page(`${CONSTS}${VARS}
async function search() {
  const name = input.value.trim();
  statusEl.textContent = '搜尋中…';
  const response = await fetch(GEO + encodeURIComponent(name));
  const geo = await response.json();
  place.textContent = geo.results[0].name;
  statusEl.textContent = '完成';
}
go.onclick = search;
`);
const W3S = page(`${CONSTS}${VARS}
async function search() {
  const name = input.value.trim();
  statusEl.textContent = '搜尋中…';
  // TODO 1: const response = await fetch(GEO + encodeURIComponent(name));
  // TODO 2: const geo = await response.json();
  // TODO 3: place.textContent = geo.results[0].name;
  statusEl.textContent = '完成';
}
go.onclick = search;
`);
// W4
const W4SOL = page(`${CONSTS}${VARS}
async function search() {
  const name = input.value.trim();
  statusEl.textContent = '搜尋中…';
  const response = await fetch(GEO + encodeURIComponent(name));
  const geo = await response.json();
  if (!geo.results) {
    place.textContent = '找不到這個城市';
    statusEl.textContent = '完成';
    return;
  }
  place.textContent = geo.results[0].name;
  statusEl.textContent = '完成';
}
go.onclick = search;
`);
const W4S = page(`${CONSTS}${VARS}
async function search() {
  const name = input.value.trim();
  statusEl.textContent = '搜尋中…';
  const response = await fetch(GEO + encodeURIComponent(name));
  const geo = await response.json();
  // TODO: 如果 !geo.results：place 顯示「找不到這個城市」、statusEl 設成「完成」，然後 return
  place.textContent = geo.results[0].name;
  statusEl.textContent = '完成';
}
go.onclick = search;
`);
// W5
const W5SOL = page(`${CONSTS}${VARS}
async function search() {
  const name = input.value.trim();
  statusEl.textContent = '搜尋中…';
  const response = await fetch(GEO + encodeURIComponent(name));
  const geo = await response.json();
  if (!geo.results) {
    place.textContent = '找不到這個城市';
    statusEl.textContent = '完成';
    return;
  }
  const { name: cityName, latitude, longitude } = geo.results[0];
  place.textContent = cityName;
  const weatherResponse = await fetch(WEATHER + '&latitude=' + latitude + '&longitude=' + longitude);
  const weather = await weatherResponse.json();
  temp.textContent = weather.current.temperature_2m + ' °C';
  statusEl.textContent = '完成';
}
go.onclick = search;
`);
const W5S = page(`${CONSTS}${VARS}
async function search() {
  const name = input.value.trim();
  statusEl.textContent = '搜尋中…';
  const response = await fetch(GEO + encodeURIComponent(name));
  const geo = await response.json();
  if (!geo.results) {
    place.textContent = '找不到這個城市';
    statusEl.textContent = '完成';
    return;
  }
  // TODO 1: const { name: cityName, latitude, longitude } = geo.results[0];　　place.textContent = cityName;
  // TODO 2: const weatherResponse = await fetch(WEATHER + '&latitude=' + latitude + '&longitude=' + longitude);
  // TODO 3: const weather = await weatherResponse.json();　　temp.textContent = weather.current.temperature_2m + ' °C';
  statusEl.textContent = '完成';
}
go.onclick = search;
`);
// W6
const W6SOL = page(`${CONSTS}${VARS}
async function search() {
  const name = input.value.trim();
  statusEl.textContent = '搜尋中…';
  place.textContent = '';
  temp.textContent = '';
  go.disabled = true;
  try {
    const response = await fetch(GEO + encodeURIComponent(name));
    if (!response.ok) {
      throw new Error(\`連線失敗：\${response.status}\`);
    }
    const geo = await response.json();
    if (!geo.results) {
      place.textContent = '找不到這個城市';
      statusEl.textContent = '完成';
      return;
    }
    const { name: cityName, latitude, longitude } = geo.results[0];
    const weatherResponse = await fetch(WEATHER + '&latitude=' + latitude + '&longitude=' + longitude);
    if (!weatherResponse.ok) {
      throw new Error(\`連線失敗：\${weatherResponse.status}\`);
    }
    const weather = await weatherResponse.json();
    place.textContent = cityName;
    temp.textContent = weather.current.temperature_2m + ' °C';
    statusEl.textContent = '完成';
  } catch (error) {
    statusEl.textContent = \`載入失敗：\${error.message}\`;
  } finally {
    go.disabled = false;
  }
}
go.onclick = search;
`);
const W6S = page(`${CONSTS}${VARS}
async function search() {
  const name = input.value.trim();
  statusEl.textContent = '搜尋中…';
  place.textContent = '';
  temp.textContent = '';
  // TODO 1: go.disabled = true;　（查詢中先把按鈕鎖起來）
  // TODO 2: 把下面整段 fetch ~ 顯示結果，放進 try { ... } 裡面
  const response = await fetch(GEO + encodeURIComponent(name));
  // TODO 3: 兩個 fetch 後面都要檢查 .ok，不 ok 就 throw new Error(\`連線失敗：\${response.status}\`)
  const geo = await response.json();
  if (!geo.results) {
    place.textContent = '找不到這個城市';
    statusEl.textContent = '完成';
    return;
  }
  const { name: cityName, latitude, longitude } = geo.results[0];
  const weatherResponse = await fetch(WEATHER + '&latitude=' + latitude + '&longitude=' + longitude);
  const weather = await weatherResponse.json();
  place.textContent = cityName;
  temp.textContent = weather.current.temperature_2m + ' °C';
  statusEl.textContent = '完成';
  // TODO 4: catch (error) { statusEl.textContent = \`載入失敗：\${error.message}\`; }
  // TODO 5: finally { go.disabled = false; }
}
go.onclick = search;
`);
// W7
const W7SOL = page(`${CONSTS}${VARS}const cache = new Map();   // 快取：城市名 → { place, temp }

async function search() {
  const name = input.value.trim();
  const key = name.toLowerCase();
  if (cache.has(key)) {
    const hit = cache.get(key);
    place.textContent = hit.place;
    temp.textContent = hit.temp;
    statusEl.textContent = '完成（來自快取）';
    return;
  }
  statusEl.textContent = '搜尋中…';
  place.textContent = '';
  temp.textContent = '';
  go.disabled = true;
  try {
    const response = await fetch(GEO + encodeURIComponent(name));
    if (!response.ok) {
      throw new Error(\`連線失敗：\${response.status}\`);
    }
    const geo = await response.json();
    if (!geo.results) {
      place.textContent = '找不到這個城市';
      statusEl.textContent = '完成';
      return;
    }
    const { name: cityName, latitude, longitude } = geo.results[0];
    const weatherResponse = await fetch(WEATHER + '&latitude=' + latitude + '&longitude=' + longitude);
    if (!weatherResponse.ok) {
      throw new Error(\`連線失敗：\${weatherResponse.status}\`);
    }
    const weather = await weatherResponse.json();
    place.textContent = cityName;
    temp.textContent = weather.current.temperature_2m + ' °C';
    cache.set(key, { place: cityName, temp: temp.textContent });
    statusEl.textContent = '完成';
  } catch (error) {
    statusEl.textContent = \`載入失敗：\${error.message}\`;
  } finally {
    go.disabled = false;
  }
}
go.onclick = search;
`);
const W7S = W6SOL.replace("go.onclick = search;", "go.onclick = search;").replace("async function search() {\n  const name = input.value.trim();\n  statusEl", "// TODO 1: 在這裡準備快取：const cache = new Map();\n\nasync function search() {\n  const name = input.value.trim();\n  // TODO 2: const key = name.toLowerCase();　（key 轉小寫，Tokyo 和 tokyo 才會當同一個）\n  // TODO 3: 如果 cache.has(key)：取出 hit = cache.get(key)，place、temp 用 hit 的值，statusEl 設成「完成（來自快取）」，然後 return\n  statusEl").replace("    statusEl.textContent = '完成';\n  } catch", "    // TODO 4: 成功後存起來：cache.set(key, { place: cityName, temp: temp.textContent });\n    statusEl.textContent = '完成';\n  } catch");
// W8
const W8SOL = W7SOL.replace("  const name = input.value.trim();\n  const key", "  const name = input.value.trim();\n  if (name === '') {\n    statusEl.textContent = '請輸入城市名稱';\n    return;\n  }\n  const key").replace("go.onclick = search;", "go.onclick = search;\ninput.addEventListener('keydown', (event) => {\n  if (event.key === 'Enter') {\n    search();\n  }\n});");
const W8S = W7SOL.replace("  const name = input.value.trim();\n  const key", "  const name = input.value.trim();\n  // TODO 1: 如果 name === ''：statusEl 顯示「請輸入城市名稱」然後 return（不要去問 API）\n  const key").replace("go.onclick = search;", "go.onclick = search;\n// TODO 2: 在輸入框按 Enter 也要能查詢：\n//   input.addEventListener('keydown', (event) => { if (event.key === 'Enter') { search(); } });");

const gstep = (say, check) => ({ say, check });
const GW = (n, title, steps, fin) => ({ id: 'w' + n, title: `手把手 ${n}／8　${title}`, steps: steps.map((s, i) => (i === 0 ? { ...s, say: progressMap(n) + s.say } : s)), final: web(fin) });

const W_UNITS = [
  GW(1, '空白頁面：先把畫面蓋出來', [
    gstep(`<p><b>為什麼先做畫面？</b>做網站和蓋房子一樣：先蓋好「空房間」（HTML），再接水電（JavaScript）。先把輸入框、按鈕、顯示結果的地方放好，之後每一步只要「往這些空位填東西」，不會迷路。</p><p>這一步<b>完全不用寫程式邏輯</b>，只要寫 5 個 HTML 標籤。</p>`,
      choice('做串接 API 的小專案，第一步為什麼先蓋畫面？', ['之後每一步都往這些位置填資料，不會迷路', '因為 HTML 比較難', '因為 API 還沒開放'], 0, '先有放資料的位置，才能把資料放進去。')),
    gstep(`<p>5 個標籤，各自的工作：</p>${pre('<input data-testid="city-input" placeholder="輸入城市，例如 Tokyo">   <!-- 讓使用者打字 -->\n<button data-testid="go">查詢</button>                                  <!-- 按下去才開始查 -->\n<p data-testid="status"></p>                                           <!-- 顯示「搜尋中／完成／失敗」 -->\n<h3 data-testid="place"></h3>                                          <!-- 顯示城市名 -->\n<p data-testid="temp"></p>                                             <!-- 顯示氣溫 -->')}<p><code>data-testid</code> 是給「檢查程式」找元素用的名字，<b>不能改</b>。</p>`,
      choice('<code>&lt;button&gt;查詢&lt;/button&gt;</code> 裡的「查詢」是？', ['按鈕上顯示的字', '按鈕的名字，不能改', 'JavaScript 程式'], 0, '標籤中間的文字就是顯示出來的內容。')),
    gstep(`<p><b>下一步預告：</b>第 2 步我們要讓按鈕「按下去有反應」，學會用 JavaScript 找到這些元素、讀取輸入框的文字。這一步先把畫面蓋好。</p>`,
      choice('這一步結束時，網頁應該長什麼樣子？', ['有輸入框和按鈕，但按了沒有反應', '已經能查到氣溫', '一片空白'], 0, '先有畫面，功能後面一步一步加。')),
  ], {
    brief: '第 1 步：把畫面蓋出來。寫出輸入框 <code>city-input</code>、按鈕 <code>go</code>（文字「查詢」），以及三個放結果的 <code>status</code>、<code>place</code>、<code>temp</code>。',
    hint: '照 TODO 1～3，把註解換成真的標籤。標籤要有 <code>data-testid</code>。',
    steps: [`輸入框：<pre>&lt;input data-testid="city-input" placeholder="輸入城市，例如 Tokyo"&gt;</pre>為什麼：使用者要在這裡打城市名。`, `按鈕：<pre>&lt;button data-testid="go"&gt;查詢&lt;/button&gt;</pre>為什麼：按下去才開始查，之後的程式會綁在它身上。`, `三個結果位置：<pre>&lt;p data-testid="status"&gt;&lt;/p&gt;\n&lt;h3 data-testid="place"&gt;&lt;/h3&gt;\n&lt;p data-testid="temp"&gt;&lt;/p&gt;</pre>為什麼：status 說明現在狀態、place 放城市名、temp 放氣溫。最常犯的錯：<code>data-testid</code> 拼錯，檢查就找不到。`],
    starter: W1S, solution: SK,
    test: async (c) => {
      const f = need(c);
      if (c.t('city-input') && c.t('city-input').tagName !== 'INPUT') f.push('city-input 要是 <input>');
      if (c.t('go') && c.t('go').tagName !== 'BUTTON') f.push('go 要是 <button>');
      if (c.t('go') && !/查詢/.test(c.t('go').textContent)) f.push('按鈕上要寫「查詢」');
      return f;
    },
  }),
  GW(2, '按下按鈕，程式有反應', [
    gstep(`<p>畫面有了，現在讓它「活起來」。JavaScript 要做兩件事：<b>① 找到元素</b>　<b>② 按鈕被按時執行一個函式</b>。</p>${pre("const input = document.querySelector('[data-testid=\"city-input\"]');   // 找到輸入框，存進變數\n\nfunction search() {\n  statusEl.textContent = '搜尋中：' + input.value.trim();\n}\n\ngo.onclick = search;   // 按鈕被按 → 執行 search")}`,
      choice('<code>document.querySelector(...)</code> 是做什麼的？', ['在網頁裡找到一個元素', '送出 API 請求', '把文字變成 JSON'], 0, 'querySelector 負責「找元素」。')),
    gstep(`<p>三個重點：</p><ul><li><code>input.value</code>：輸入框裡<b>使用者打的字</b>。</li><li><code>.trim()</code>：去掉頭尾多餘的空白（使用者常常不小心多打空格）。</li><li><code>元素.textContent = '文字'</code>：把文字<b>放進</b>元素裡顯示。</li></ul><p>為什麼要先做這個？因為之後查 API 要的「城市名」就是從 <code>input.value</code> 來的，而「搜尋中…」這種狀態要讓使用者看到。</p>`,
      choice('要拿到使用者在輸入框打的字，用？', ['input.value', 'input.textContent', 'input.click'], 0, '輸入框的內容是 value。')),
    gstep(`<p><b>小提醒：</b><code>go.onclick = search</code> 後面<b>不要加括號</b>。加了括號（<code>search()</code>）是「現在就執行」，不是「按下去才執行」。</p><p>下一步預告：第 3 步，在 search 裡面真的去呼叫 API。</p>`,
      choice('<code>go.onclick = search</code> 和 <code>go.onclick = search()</code> 差在哪？', ['有括號會立刻執行一次，不是按下去才執行', '沒有差別', '有括號比較快'], 0, '沒有括號 = 把函式交給按鈕，等按下才執行。')),
  ], {
    brief: '第 2 步：用 <code>querySelector</code> 找到 5 個元素，寫 <code>search()</code> 讓按鈕被按時，<code>status</code> 顯示「搜尋中：」加上輸入的城市名。',
    hint: '三個 TODO：找元素、寫函式、綁按鈕。',
    steps: [`TODO 1：找出五個元素存成變數<pre>${VARS.replace(/</g, '&lt;')}</pre>為什麼：變數存著元素，後面才能反覆使用。`, `TODO 2：寫函式<pre>function search() {\n  statusEl.textContent = '搜尋中：' + input.value.trim();\n}</pre>為什麼：先用最簡單的事確認「讀得到輸入、寫得到畫面」。`, `TODO 3：<pre>go.onclick = search;</pre>為什麼：按鈕按下去才會跑 search。最常犯的錯：寫成 <code>search()</code>（多了括號）。`],
    starter: W2S, solution: W2SOL,
    test: async (c) => {
      const f = need(c); if (f.length) return f;
      await enter(c, 'Tokyo');
      if (!(await c.waitFor(() => /Tokyo/.test(txt(c.t('status'))), 2000))) f.push('輸入 Tokyo 按「查詢」後，status 應該顯示「搜尋中：Tokyo」，目前是「' + txt(c.t('status')) + '」');
      return f;
    },
  }),
  GW(3, '查城市：第一次真的呼叫 API', [
    gstep(`<p>現在第一次真的去敲 API！用 <b>geocoding（地理編碼）</b>：給它城市名，回你這個城市的名字和經緯度。網址長這樣（你前面學過）：</p>${pre('https://geocoding-api.open-meteo.com/v1/search?count=1&language=zh&name=Tokyo')}<p>回傳的 JSON 大概是：</p>${pre('{\n  "results": [\n    { "name": "東京", "latitude": 35.6895, "longitude": 139.69171 }\n  ]\n}')}<p>城市在 <code>results</code> 這個陣列的<b>第 0 個</b>，所以取名字是 <code>geo.results[0].name</code>。</p>`,
      choice('要拿到第一個搜尋結果的城市名，寫？', ['geo.results[0].name', 'geo.name', 'geo.results.name'], 0, 'results 是陣列，第一個是 [0]。')),
    gstep(`<p>還記得「網址到畫面」六步嗎？這裡照著做：</p>${pre("const response = await fetch(GEO + encodeURIComponent(name));   // 送出請求，拿到信封\nconst geo = await response.json();                             // 拆信封\nplace.textContent = geo.results[0].name;                       // 放進畫面")}<p><b>為什麼要 <code>encodeURIComponent</code>？</b>使用者輸入的字可能有空格或中文，直接放進網址會弄壞網址，轉碼才安全。<b>為什麼函式前面要 <code>async</code>？</b>因為裡面用了 <code>await</code>。</p>`,
      choice('函式裡面用了 <code>await</code>，函式前面一定要加？', ['async', 'function', 'return'], 0, '用 await 的函式要宣告 async。')),
    gstep(`<p>目前這一版<b>還沒處理</b>「查不到城市」和「網路出錯」，所以輸入亂打的城市會當掉。沒關係，這是故意的——我們一步一步補：第 4 步處理查不到，第 6 步處理錯誤。</p>`,
      choice('為什麼這一步先不處理錯誤？', ['一次只做一件事，比較不容易亂掉', '因為錯誤處理不重要', '因為不會出錯'], 0, '拆成小步驟是工程師的習慣。')),
  ], {
    brief: '第 3 步：在 <code>search()</code> 裡呼叫 geocoding API，把查到的城市名（<code>geo.results[0].name</code>）顯示在 <code>place</code>。查完後 <code>status</code> 是「完成」。',
    hint: '三行：fetch、json、顯示。程式前面已經幫你準備好 <code>GEO</code> 網址。',
    steps: [`TODO 1：<pre>const response = await fetch(GEO + encodeURIComponent(name));</pre>為什麼：送出請求，網址 = 基本網址 + 轉碼後的城市名。`, `TODO 2：<pre>const geo = await response.json();</pre>為什麼：把回應拆成能用的物件。`, `TODO 3：<pre>place.textContent = geo.results[0].name;</pre>為什麼：把查到的城市名放進畫面。最常犯的錯：忘了 <code>await</code>，結果拿到的是還沒完成的 Promise，畫面顯示 undefined。`],
    starter: W3S, solution: W3SOL,
    test: async (c) => {
      const f = need(c); if (f.length) return f;
      let real; try { real = await realCity('Tokyo'); } catch (e) { return [NONET]; }
      await enter(c, 'Tokyo');
      if (!(await c.waitFor(() => txt(c.t('place')) === real.name))) f.push(`查 Tokyo 後，place 應該顯示「${real.name}」，目前是「${txt(c.t('place'))}」`);
      else if (!(await c.waitFor(() => /完成/.test(txt(c.t('status'))), 2000))) f.push('查完後 status 應該是「完成」');
      return f;
    },
  }),
  GW(4, '查不到城市怎麼辦', [
    gstep(`<p>使用者可能打錯字，例如 <code>zzqxwvv</code>。這時 API <b>不會報錯</b>，只是回傳的 JSON <b>少了 <code>results</code> 這個欄位</b>：</p>${pre('{ "generationtime_ms": 0.5 }    // 沒有 results！')}<p>如果直接寫 <code>geo.results[0]</code>，因為 <code>geo.results</code> 是 undefined，程式會爆：<code>Cannot read properties of undefined</code>。</p>`,
      choice('查不到城市時，API 回傳的 JSON？', ['沒有 results 欄位', 'results 是空字串', '網頁自動跳出提醒'], 0, '不存在的欄位就是 undefined，要先判斷。')),
    gstep(`<p>做法：<b>在使用資料之前，先確認它存在</b>：</p>${pre("if (!geo.results) {\n  place.textContent = '找不到這個城市';\n  statusEl.textContent = '完成';\n  return;          // 重點：結束函式，後面就不會執行 geo.results[0] 了\n}")}<p><code>!geo.results</code> 的意思：「results 不存在」。<code>return</code> 讓函式在這裡結束。這個習慣叫<b>提早返回（early return）</b>：先處理例外情況，後面的程式就能放心假設資料一定存在。</p>`,
      choice('<code>if (!geo.results) { ...; return; }</code> 裡的 <code>return</code> 為什麼重要？', ['讓函式結束，後面不會再用到不存在的資料', '讓程式跑更快', '把資料存起來'], 0, '不 return 的話，後面的 geo.results[0] 還是會爆。')),
    gstep(`<p>下一步預告：第 5 步，用查到的經緯度去查<b>天氣</b>——兩個 API 接力。</p>`,
      choice('寫「查不到」的判斷，應該放在？', ['使用 geo.results[0] 之前', '使用 geo.results[0] 之後', '放哪裡都一樣'], 0, '先檢查，再使用。')),
  ], {
    brief: '第 4 步：查不到城市（例如 <code>zzqxwvv</code>）時，<code>place</code> 顯示「找不到這個城市」、<code>status</code> 顯示「完成」，並且不能讓程式爆掉。查得到的城市（Tokyo）仍要正常顯示。',
    hint: '一個 if 加 return，放在 <code>geo.results[0]</code> 之前。',
    steps: [`TODO：放在 <code>const geo = ...</code> 後面<pre>if (!geo.results) {\n  place.textContent = '找不到這個城市';\n  statusEl.textContent = '完成';\n  return;\n}</pre>為什麼：先擋掉「沒結果」的情況，後面才能放心用 <code>geo.results[0]</code>。最常犯的錯：判斷寫在 <code>geo.results[0]</code> <b>後面</b>，程式已經爆了。`],
    starter: W4S, solution: W4SOL,
    test: async (c) => {
      const f = need(c); if (f.length) return f;
      await enter(c, 'zzqxwvv');
      if (!(await c.waitFor(() => /找不到/.test(txt(c.t('place'))), 4000))) f.push('查 zzqxwvv 後，place 應該顯示「找不到這個城市」，目前是「' + txt(c.t('place')) + '」。提示：查不到時 geo.results 不存在');
      let real; try { real = await realCity('Tokyo'); } catch (e) { return [...f, NONET]; }
      await enter(c, 'Tokyo');
      if (!(await c.waitFor(() => txt(c.t('place')) === real.name))) f.push('查得到的城市（Tokyo）要正常顯示「' + real.name + '」，目前是「' + txt(c.t('place')) + '」');
      return f;
    },
  }),
  GW(5, '查天氣：串起第二個 API', [
    gstep(`<p>這就是真實專案的樣子：<b>一個 API 的答案，是下一個 API 的輸入</b>。</p>${pre('城市名 ──geocoding API──▶ 經緯度 ──weather API──▶ 氣溫')}<p>geocoding 給了 <code>latitude</code>（緯度）和 <code>longitude</code>（經度），拿它們去問天氣 API：</p>${pre('https://api.open-meteo.com/v1/forecast?current=temperature_2m&latitude=35.68&longitude=139.69')}`,
      choice('為什麼要先查 geocoding，再查天氣？', ['天氣 API 要經緯度，geocoding 才拿得到', '因為天氣 API 比較慢', '因為規定要兩個'], 0, '第二個 API 需要第一個的結果。')),
    gstep(`<p>先用<b>解構</b>一次把三個值拿出來：</p>${pre("const { name: cityName, latitude, longitude } = geo.results[0];")}<p>意思等於分別寫三行 <code>const latitude = geo.results[0].latitude</code>……。<code>name: cityName</code> 是「把 name 改名叫 cityName」，因為外面已經有一個變數叫 <code>name</code>（輸入的城市名），名字不能重複。</p>然後同樣是三步：<code>fetch</code> → <code>json()</code> → 放進畫面。<b>await 要一個一個接</b>：第二個 fetch 要等第一個做完才能開始，因為它需要第一個的結果。`,
      choice('<code>const { name: cityName } = geo.results[0]</code> 的 <code>name: cityName</code> 是？', ['拿 name 欄位，存成叫 cityName 的變數', '把 name 刪掉', '建立新的函式'], 0, '冒號左邊是原本的欄位名，右邊是你要的變數名。')),
    gstep(`<p>要注意：氣溫在 <code>weather.current.temperature_2m</code>。如果不確定，就 <code>console.log(weather)</code> 看結構（回憶第 1 堂：不熟的 API 先印出來看）。</p>`,
      choice('第二個 fetch 的網址要用到第一個 API 的哪些資料？', ['latitude 和 longitude', 'name', '都不用'], 0, '緯度經度是接力的橋樑。')),
  ], {
    brief: '第 5 步：查到城市後，用它的經緯度查天氣，把氣溫（<code>weather.current.temperature_2m</code>）加上「 °C」顯示在 <code>temp</code>，城市名顯示在 <code>place</code>。',
    hint: '3 個 TODO：取三個值並顯示城市名、第二個 fetch、顯示氣溫。',
    steps: [`TODO 1：<pre>const { name: cityName, latitude, longitude } = geo.results[0];\nplace.textContent = cityName;</pre>為什麼：一次拿到城市名和座標。`, `TODO 2：<pre>const weatherResponse = await fetch(WEATHER + '&latitude=' + latitude + '&longitude=' + longitude);</pre>為什麼：用座標問天氣。變數名取 <code>weatherResponse</code>，才不會和第一個 <code>response</code> 打架。`, `TODO 3：<pre>const weather = await weatherResponse.json();\ntemp.textContent = weather.current.temperature_2m + ' °C';</pre>為什麼：拆開並顯示。最常犯的錯：兩個 fetch 的變數都叫 <code>response</code>，會重複宣告出錯。`],
    starter: W5S, solution: W5SOL,
    test: async (c) => {
      const f = need(c); if (f.length) return f;
      let real, rw; try { real = await realCity('Tokyo'); rw = (await get(WURL + '&latitude=' + real.latitude + '&longitude=' + real.longitude)).current.temperature_2m; } catch (e) { return [NONET]; }
      await enter(c, 'Tokyo');
      if (!(await c.waitFor(() => txt(c.t('place')) === real.name && /\d/.test(txt(c.t('temp')))))) return [`查 Tokyo 後，place 應該是「${real.name}」、temp 要有氣溫（等了 7 秒；目前 place=「${txt(c.t('place'))}」temp=「${txt(c.t('temp'))}」）`];
      if (Math.abs(parseFloat(txt(c.t('temp'))) - rw) > 2) f.push(`temp 顯示 ${txt(c.t('temp'))}，但 API 現在回傳 ${rw}`);
      if (!/°C/.test(txt(c.t('temp')))) f.push('temp 要加上「 °C」');
      return f;
    },
  }),
  GW(6, '錯誤處理：載入中、失敗、收尾', [
    gstep(`<p>現在程式在順利時可以用了，但網路斷掉或伺服器壞掉，畫面會卡在「搜尋中…」。這一步把你學過的 <b>try / catch / finally</b> 加進來。</p><p>需要的零件，和第 2 堂完全一樣：</p><ul><li><code>try { }</code>：把會出錯的 fetch 全部放進去</li><li><code>if (!response.ok) throw new Error(...)</code>：伺服器回 500 也要當成錯誤</li><li><code>catch (error)</code>：顯示「載入失敗：」+ <code>error.message</code></li><li><code>finally</code>：不管成功失敗，把按鈕解鎖</li></ul>`,
      choice('把 fetch 放進 <code>try</code> 的目的是？', ['出錯時不會讓程式卡死，可以跳到 catch 處理', '讓 fetch 變快', '讓資料變成 JSON'], 0, 'try 出錯就跳到 catch。')),
    gstep(`<p>這個專案有<b>兩個</b> fetch，所以要檢查<b>兩次</b> <code>.ok</code>：</p>${pre("const response = await fetch(...);\nif (!response.ok) {\n  throw new Error(`連線失敗：${response.status}`);\n}\n// ……\nconst weatherResponse = await fetch(...);\nif (!weatherResponse.ok) {\n  throw new Error(`連線失敗：${weatherResponse.status}`);\n}")}<p>為什麼兩個都要？因為兩個 API 都可能壞掉。</p>`,
      choice('這個專案有兩個 fetch，<code>.ok</code> 要檢查？', ['兩個都要', '只要第一個', '都不用'], 0, '每個 fetch 都可能失敗。')),
    gstep(`<p><b>finally 用在哪？</b>查詢時我們把按鈕鎖起來（<code>go.disabled = true</code>），避免使用者狂按。不管成功失敗最後都要解鎖，所以放 <code>finally</code>。</p><p>⚠️ 注意：「找不到城市」裡的 <code>return</code> 在 try 裡面，<code>finally</code> 仍然會執行——這正是 finally 的好處。</p>`,
      choice('「找不到這個城市」那段有 <code>return</code>，<code>finally</code> 還會執行嗎？', ['會，finally 不管怎麼離開都會跑', '不會', '看運氣'], 0, 'finally 一定會執行。')),
  ], {
    brief: '第 6 步：加上完整的錯誤處理。查詢時 <code>status</code> 顯示「搜尋中…」並鎖住按鈕；成功顯示「完成」；斷網或伺服器回 500 時，<code>status</code> 顯示「載入失敗：」加上 <code>error.message</code>；最後（finally）按鈕要解鎖。',
    hint: '把原本的 fetch 到顯示結果整段放進 try，兩個 fetch 後面都加 .ok 檢查，再補 catch 和 finally。',
    steps: [`TODO 1：在清空結果後<pre>go.disabled = true;</pre>為什麼：查詢中不讓使用者重複按。`, `TODO 2：加上 <code>try {</code>，包住第一個 fetch 到最後的 <code>statusEl.textContent = '完成';</code>。<br>為什麼：整段都可能出錯，所以整段都在 try 裡。縮排會變多，這是正常的。`, `TODO 3：兩個 fetch 後面各加<pre>if (!response.ok) {\n  throw new Error(&#96;連線失敗：&#36;{response.status}&#96;);\n}</pre>（第二個改成 <code>weatherResponse</code>）。為什麼：500 不會自動丟錯，要自己丟。`, `TODO 4、5：try 後面接<pre>} catch (error) {\n  statusEl.textContent = &#96;載入失敗：&#36;{error.message}&#96;;\n} finally {\n  go.disabled = false;\n}</pre>為什麼：失敗要讓使用者知道原因，而且按鈕一定要解鎖。最常犯的錯：大括號 <code>{ }</code> 沒對齊，整個程式壞掉。`],
    starter: W6S, solution: W6SOL,
    must: [{ re: /try\s*\{/, msg: '請用 try { } 包住 fetch' }, { re: /catch/, msg: '請用 catch 接住錯誤' }, { re: /finally/, msg: '請用 finally 把按鈕解鎖' }, { re: /\.ok\b/, msg: '請檢查 response.ok' }],
    test: async (c) => {
      const f = need(c); if (f.length) return f;
      const st = () => txt(c.t('status')), go = c.t('go');
      let real; try { real = await realCity('Tokyo'); } catch (e) { return [NONET]; }
      await enter(c, 'Tokyo');
      if (!(await c.waitFor(() => /完成/.test(st()) && txt(c.t('place')) === real.name))) f.push('網路正常時應該顯示城市並把 status 設成「完成」（目前 status=「' + st() + '」）');
      if (!(await c.waitFor(() => !go.disabled, 1500))) return [...f, '查完後按鈕還是鎖住的，請用 finally 解鎖'];
      c.win.__failFetch = true;
      await enter(c, 'Tokyo');
      if (!(await c.waitFor(() => /失敗/.test(st()), 3000))) f.push('斷網時 status 應該顯示「載入失敗：…」，目前是「' + st() + '」');
      else if (!/Failed to fetch/.test(st())) f.push('要帶上 error.message，像「載入失敗：Failed to fetch」，目前是「' + st() + '」');
      if (!(await c.waitFor(() => !go.disabled, 1500))) return [...f, '失敗後按鈕還是鎖住的，解鎖要寫在 finally 裡'];
      c.win.__failFetch = 'http';
      await enter(c, 'Tokyo');
      if (!(await c.waitFor(() => /失敗/.test(st()), 3000))) f.push('伺服器回 500 時也要顯示「載入失敗」，記得檢查 response.ok');
      else if (!/500/.test(st())) f.push('500 時應該帶上 throw 的那句，像「載入失敗：連線失敗：500」，目前是「' + st() + '」');
      c.win.__failFetch = false;
      return f;
    },
  }),
  GW(7, '加上快取：問過的城市不再重問', [
    gstep(`<p>這是你問的「什麼時候該用 cache」的真實案例：同一個使用者常常重複查同一個城市（來回比較東京、大阪）。天氣 10 分鐘內幾乎不變，而每次查詢要打<b>兩個</b> API——很適合快取。</p><p>這次用<b>記憶體快取</b>（<code>Map</code>），重新整理就會清掉，剛好適合入門。</p>`,
      choice('這個專案「查過的城市不用再查」，用快取合適嗎？', ['合適，天氣短時間不變', '不合適，天氣要即時', '看心情'], 0, '10 分鐘內的氣溫變化很小，快取很合適。')),
    gstep(`<p>快取三問，這次的答案：</p><ul><li><b>存在哪？</b>記憶體 <code>const cache = new Map()</code>。</li><li><b>key 是什麼？</b>城市名「轉小寫」：<code>const key = name.toLowerCase()</code>。為什麼轉小寫？使用者可能打 <code>Tokyo</code> 或 <code>tokyo</code>，我們希望當成同一個。</li><li><b>存什麼？</b>畫面要的結果：<code>{ place: 城市名, temp: 氣溫文字 }</code>。</li></ul>`,
      choice('為什麼 key 要用 <code>toLowerCase()</code>？', ['讓 Tokyo 和 tokyo 算同一個問題', '讓速度更快', '因為 Map 規定'], 0, '不同寫法的同一個問題，要對到同一個 key。')),
    gstep(`<p>流程（你在第 6 堂學過）：</p>${pre("const key = name.toLowerCase();\nif (cache.has(key)) {          // ① 先問快取\n  const hit = cache.get(key);\n  place.textContent = hit.place;\n  temp.textContent = hit.temp;\n  statusEl.textContent = '完成（來自快取）';\n  return;                      // ② 用完就結束，不要再 fetch\n}\n// …… 原本的 try / fetch ……\n// ③ 成功後存起來（放在 try 裡面、顯示結果之後）\ncache.set(key, { place: cityName, temp: temp.textContent });")}<p>⚠️ 存快取的位置：只有<b>成功</b>才存。放在 <code>catch</code> 裡或 fetch 之前都是錯的。「找不到城市」也<b>不</b>存。</p>`,
      choice('快取要在什麼時候存？', ['成功拿到資料並顯示之後', 'fetch 之前', '失敗的時候'], 0, '只存成功的結果，避免快取污染。')),
  ], {
    brief: '第 7 步：加上記憶體快取。同一個城市（不分大小寫、頭尾空白）第二次查，<b>不可以再發請求</b>，<code>status</code> 要顯示「完成（來自快取）」，<code>place</code> 和 <code>temp</code> 要跟第一次一樣。',
    hint: '4 個 TODO：建立 Map、算 key、查快取（有就 return）、成功後存起來。',
    steps: [`TODO 1：在 <code>search</code> 函式外面<pre>const cache = new Map();</pre>為什麼：要放在函式外面，不然每次呼叫都是新的空 Map。`, `TODO 2：<pre>const key = name.toLowerCase();</pre>為什麼：統一大小寫。`, `TODO 3：<pre>if (cache.has(key)) {\n  const hit = cache.get(key);\n  place.textContent = hit.place;\n  temp.textContent = hit.temp;\n  statusEl.textContent = '完成（來自快取）';\n  return;\n}</pre>為什麼：有就直接用，不碰網路。`, `TODO 4：在 try 裡面，顯示結果之後<pre>cache.set(key, { place: cityName, temp: temp.textContent });</pre>為什麼：成功才存。最常犯的錯：<code>const cache = new Map()</code> 寫在 search 裡面，每次都是新的，快取永遠沒有東西。`],
    starter: W7S, solution: W7SOL,
    must: [{ re: /new Map\(\)/, msg: '請用 new Map() 建立快取' }, { re: /cache\.set\(/, msg: '成功後要 cache.set(...) 存起來' }],
    test: async (c) => {
      const f = need(c); if (f.length) return f;
      let real; try { real = await realCity('Tokyo'); } catch (e) { return [NONET]; }
      c.win.__fc = 0;
      await enter(c, 'Tokyo');
      if (!(await c.waitFor(() => txt(c.t('place')) === real.name && /\d/.test(txt(c.t('temp')))))) return ['第一次查 Tokyo 應該正常顯示城市與氣溫'];
      const n1 = c.win.__fc, t1 = txt(c.t('temp'));
      await enter(c, '  tokyo ');
      await c.wait(500);
      if (!/快取/.test(txt(c.t('status')))) f.push('第二次查同一個城市（「  tokyo 」大小寫、空白不同也算同一個），status 應該是「完成（來自快取）」，目前是「' + txt(c.t('status')) + '」');
      if (c.win.__fc !== n1) f.push(`第二次查同一個城市不可以再發請求（請求從 ${n1} 次變成 ${c.win.__fc} 次）`);
      if (txt(c.t('temp')) !== t1 || txt(c.t('place')) !== real.name) f.push('來自快取時，place 和 temp 也要正確顯示');
      await enter(c, 'Paris');
      if (!(await c.waitFor(() => c.win.__fc > n1 && /完成/.test(txt(c.t('status'))) && !/快取/.test(txt(c.t('status')))))) f.push('查不同的城市（Paris）要重新發請求，不能拿到東京的快取');
      return f;
    },
  }),
  GW(8, '收尾：空白輸入與 Enter 鍵', [
    gstep(`<p>最後一步：把作品打磨到「別人可以放心用」。真實使用者會做這些事：</p><ul><li><b>什麼都沒輸入就按查詢</b> → 不要去問 API（浪費請求，API 也會回奇怪的結果），直接提醒「請輸入城市名稱」。</li><li><b>打完字習慣按 Enter</b> → 也要能查詢，不用特地去點按鈕。</li></ul>這叫<b>使用者體驗</b>，不難但很重要。`,
      choice('使用者什麼都沒輸入就按查詢，比較好的處理是？', ['提醒請輸入城市，不去問 API', '送出空白去問 API', '讓網頁當掉'], 0, '空輸入是使用者常犯的錯，要先擋掉。')),
    gstep(`<p>兩段小程式：</p>${pre("// ① 空白輸入：放在 search 最前面\nif (name === '') {\n  statusEl.textContent = '請輸入城市名稱';\n  return;\n}\n\n// ② Enter 鍵：監聽輸入框的鍵盤事件\ninput.addEventListener('keydown', (event) => {\n  if (event.key === 'Enter') {\n    search();\n  }\n});")}<p><code>addEventListener('keydown', ...)</code> 是「有按鍵被按下時」。<code>event.key</code> 是按了哪個鍵。<b>注意：</b>不要寫成 <code>event.key === 'Enter' && search()</code>，那種寫法在這個遊戲的別處會踩雷，用 if 最安全。</p>`,
      choice('偵測「按下 Enter 鍵」，要看？', ["event.key === 'Enter'", 'event.value', 'input.enter'], 0, '按鍵名稱在 event.key。')),
    gstep(`<p>🎉 做完這一步，你就從<b>空白頁面</b>完成了一個完整的串接 API 作品：<b>畫面 → 事件 → 呼叫 API → 查不到處理 → 串第二個 API → 錯誤處理 → 快取 → 使用者體驗</b>。每一步你都知道「為什麼」。檢查會把前面的功能一起重新驗一次。</p>`,
      choice('這個專案裡，「錯誤處理」和「快取」分別解決什麼問題？', ['錯誤處理：出錯時不卡死；快取：重複的問題不重問', '兩個一樣', '錯誤處理：加速；快取：顯示失敗'], 0, '一個管出錯，一個管省請求。')),
  ], {
    brief: '第 8 步（最後一步）：① 輸入空白按查詢，<code>status</code> 顯示「請輸入城市名稱」，不發請求；② 在輸入框按 <b>Enter</b> 也能查詢。前面做好的功能（查城市、天氣、錯誤處理、快取）都要還能用。',
    hint: '兩個 TODO：空白判斷放在 search 最前面；Enter 用 addEventListener。',
    steps: [`TODO 1：在 <code>const name = ...</code> 後面<pre>if (name === '') {\n  statusEl.textContent = '請輸入城市名稱';\n  return;\n}</pre>為什麼：空白就不用往下做了。放在<b>最前面</b>，連快取都不用查。`, `TODO 2：放在 <code>go.onclick = search;</code> 後面<pre>input.addEventListener('keydown', (event) => {\n  if (event.key === 'Enter') {\n    search();\n  }\n});</pre>為什麼：讓使用者打完字直接按 Enter。最常犯的錯：<code>'Enter'</code> 的大小寫寫錯（必須是大寫 E）。`],
    starter: W8S, solution: W8SOL,
    must: [{ re: /keydown|keypress|keyup/, msg: '請用 addEventListener 監聽鍵盤事件（keydown）' }],
    test: async (c) => {
      const f = need(c); if (f.length) return f;
      let real; try { real = await realCity('Tokyo'); } catch (e) { return [NONET]; }
      c.win.__fc = 0;
      await enter(c, '   ');
      await c.wait(300);
      if (!/請輸入/.test(txt(c.t('status')))) f.push('空白輸入按查詢，status 應該顯示「請輸入城市名稱」，目前是「' + txt(c.t('status')) + '」');
      if (c.win.__fc !== 0) f.push('空白輸入不可以發出請求');
      await c.type(c.t('city-input'), 'Tokyo');
      c.t('city-input').dispatchEvent(new c.win.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      if (!(await c.waitFor(() => txt(c.t('place')) === real.name && /\d/.test(txt(c.t('temp')))))) f.push('在輸入框按 Enter 應該也能查詢，顯示「' + real.name + '」與氣溫');
      await enter(c, 'zzqxwvv');
      if (!(await c.waitFor(() => /找不到/.test(txt(c.t('place'))), 4000))) f.push('查不到的城市要顯示「找不到這個城市」');
      c.win.__failFetch = true; await enter(c, 'Berlin');
      if (!(await c.waitFor(() => /失敗/.test(txt(c.t('status'))), 3000))) f.push('斷網時要顯示「載入失敗」');
      c.win.__failFetch = false;
      await c.wait(300);
      await enter(c, 'Tokyo');
      await c.wait(400);
      if (!/快取/.test(txt(c.t('status')))) f.push('查過的 Tokyo 再查，應該來自快取');
      return f;
    },
  }),
];

const API_QUIZ4 = [
  choice('做一個要串接 API 的小專案，比較好的做法是？', ['先蓋畫面，再一步一步加功能，每步都測試', '一次把所有功能全寫完再測', '先寫快取，再想畫面'], 0),
  choice('geocoding 查不到城市時，回傳的 JSON？', ['沒有 results 欄位，要先判斷再使用', 'results 一定存在', '會自動丟出錯誤'], 0),
  choice('兩個 API 接力（先查座標再查天氣），第二個 fetch 要？', ['等第一個完成、用它的結果', '同時開始，不用等', '不需要'], 0),
  choice('<code>finally</code> 在這個專案用來？', ['不管成功失敗都把按鈕解鎖', '顯示失敗訊息', '存快取'], 0),
];

/* ============================ 匯出 ============================ */
export const API_COURSES = [
  { id: 'api', name: '串接 API 實戰', icon: '🔌', teacher: 'Lily 老師', chapters: [
    { id: 'api-c1', title: '第一章　fetch 基本功與錯誤處理', lessons: [A1, A2], quiz: API_QUIZ1, projects: [API_P1], event: 'api-c1' },
    { id: 'api-c2', title: '第二章　真實 API：地名、地圖、地震', lessons: [A3, A4, A5], quiz: API_QUIZ2, projects: [API_P2, API_P3], event: 'api-c2' },
    { id: 'api-c3', title: '第三章　快取 cache：該存什麼、存多久、失敗怎麼辦', lessons: [A6, A7, A8], quiz: API_QUIZ3, projects: [], event: 'api-c3' },
    { id: 'api-c4', title: '第四章　手把手專案：城市天氣小站（從空白做到完成）', lessons: W_UNITS, quiz: API_QUIZ4, projects: [], event: 'api-c4' },
  ] },
];

export const API_EVENTS = {
  'api-c4': { npc: 'pm', mood: 'happy', text: '我們需要一個「城市天氣小站」給客服查詢用，你一個人從頭做得完嗎？',
    options: [{ label: '可以，我先蓋畫面，再一步一步加功能並逐步測試', fx: { quality: 10, team: 6 } }, { label: '我一次全寫完再來測', fx: { quality: -6, stress: 8 } }] },
  'api-c3': { npc: 'lead', mood: 'worried', text: '我們的天氣頁面每次都重新打 API，免費額度三天就用光了。你剛學過快取，要怎麼處理？',
    options: [{ label: '加上 10 分鐘的快取，過期才重抓；失敗時退回舊資料並標示', fx: { quality: 10, team: 5 } }, { label: '把快取設成一年，這樣最省額度', fx: { quality: -8, stress: 6 } }] },
  'api-c1': { npc: 'mate', mood: 'worried', text: '我的天氣頁面，只要網路一慢整個畫面就一片空白，使用者還以為壞掉了……你剛學了串接 API，有什麼建議嗎？',
    options: [{ label: '加上「載入中」和「載入失敗」的畫面，用 try/catch 接住', fx: { team: 8, quality: 6, stress: 4 } }, { label: '叫使用者自己重新整理', fx: { team: -6, quality: -4 } }] },
  'api-c2': { npc: 'lead', mood: 'worried', text: '有人把公車 API 的金鑰直接寫在前端程式裡，被別人拿去亂用，額度都被用光了。你覺得該怎麼改？',
    options: [{ label: '改成前端呼叫我們的後端，金鑰只放在後端，順便做快取', fx: { quality: 10, team: 5 } }, { label: '把金鑰縮短一點，比較不明顯', fx: { quality: -8, stress: 6 } }] },
};
