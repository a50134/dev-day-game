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
    { say: `<p><b>API</b> 就是網路上的「點餐窗口」：你送出一個網址（點餐），對方回你一包資料（餐點），通常是 <b>JSON</b>。例如這個網址會回傳台北現在的氣溫：</p>${pre('https://api.open-meteo.com/v1/forecast?current=temperature_2m&latitude=25.05&longitude=121.52')}<p>在 JavaScript 用 <code>fetch</code> 去要，分兩步：先拿到回應，再把它變成資料：</p>${pre("fetch(url)\n  .then((res) => res.json())   // 第二步：把回應變成物件\n  .then((data) => {\n    console.log(data.current.temperature_2m);\n  });")}`,
      check: choice('<code>fetch(url)</code> 做完之後，要用什麼才能拿到 JSON 資料？', ['res.json()', 'res.text', 'res.data()'], 0, '先 fetch，再 res.json() 把回應變成資料。') },
    { say: `<p><b>前端怎麼串、後端怎麼串，差在哪裡？</b>兩邊都是用 <code>fetch</code>，語法幾乎一樣，差在<b>「誰」去敲 API</b>：</p>
      <ul><li><b>前端串接：</b>網頁在<b>使用者的瀏覽器</b>裡直接 fetch 第三方 API。簡單，但：①要金鑰的 API，金鑰會被每個人看到 ②對方沒開放 CORS 就會被瀏覽器擋 ③使用者正在看畫面，所以要顯示「載入中／失敗」。</li>
      <li><b>後端串接：</b>你的<b>伺服器</b>去 fetch 第三方 API，再把整理好的資料給你的前端。金鑰藏在伺服器、沒有 CORS 問題，還可以<b>快取</b>（同一個問題 10 分鐘內直接回上次的答案，省額度也比較快）。</li></ul>
      <p>像台灣公車用的 TDX 要申請金鑰，就是典型要走後端的例子：前端 → 你的後端（帶金鑰）→ TDX。</p>`,
      check: choice('想用一個要付費金鑰的 API，金鑰最好放哪裡？', ['你的後端伺服器', '直接寫在前端的 JavaScript', '寫在網頁標題裡'], 0, '前端的程式每個人都看得到，金鑰要藏在後端。') },
    { say: `<p>你問的「cache、try catch」——其實是<b>兩件不同的事</b>：</p>
      <ul><li><code>try / catch</code>（接住）：<b>錯誤處理</b>。網路斷了、對方壞了，程式會丟出錯誤，用 try/catch 接住，改顯示友善的訊息。<b>前端、後端都要用</b>。</li>
      <li><code>cache</code>（快取）：<b>把答案先存起來</b>，下次直接用。主要是<b>後端</b>（或瀏覽器）用來省額度、加速，不是用來處理錯誤。</li></ul>
      <p>差別在於「接住之後做什麼」：前端是<b>顯示訊息給使用者</b>（或讓他重試）；後端是<b>記錄下來，並回 500／502 之類的狀態碼</b>給前端。</p>`,
      check: choice('「接住錯誤，讓畫面顯示『載入失敗』」要用？', ['try / catch', 'cache', 'console.log'], 0, 'try/catch 管錯誤；cache 是存答案。') },
  ],
  final: web({
    brief: '用 <code>fetch</code> 向 <code>url</code> 要台北現在的氣溫，把 <code>data.current.temperature_2m</code> 顯示在 <code>data-testid="temp"</code> 的元素裡。',
    hint: '<code>fetch(url).then((res) =&gt; res.json()).then((data) =&gt; { 元素.textContent = data.current.temperature_2m; });</code> 寫完按「送出檢查」，會和 API 現在的答案比對。',
    starter: `<h2>台北現在的氣溫</h2>
<p><span data-testid="temp">--</span> °C</p>
<script>
const url = '${WEATHER}';
// TODO: 用 fetch 向 url 要資料，把 current.temperature_2m 放進 data-testid="temp" 的元素
</script>
`,
    solution: `<h2>台北現在的氣溫</h2>
<p><span data-testid="temp">--</span> °C</p>
<script>
const url = '${WEATHER}';
fetch(url)
  .then((res) => res.json())
  .then((data) => {
    document.querySelector('[data-testid="temp"]').textContent = data.current.temperature_2m;
  });
</script>
`,
    must: [{ re: /fetch\(/, msg: '請用 fetch 向 API 要資料' }],
    test: async (c) => {
      const el = c.t('temp');
      if (!el) return ['缺少 data-testid="temp" 的元素'];
      if (!(await c.waitFor(() => /\d/.test(el.textContent)))) return ['等了 7 秒，氣溫還是沒出現。有 fetch 嗎？有把 current.temperature_2m 放進畫面嗎？'];
      let real; try { real = (await get(WEATHER)).current.temperature_2m; } catch (e) { return [NONET]; }
      const shown = parseFloat(el.textContent);
      return Math.abs(shown - real) > 2 ? [`畫面上是 ${shown}，但 API 現在回傳 ${real}，數字不一樣`] : [];
    },
  }),
};

/* ============================ 第 2 堂 ============================ */
const A2 = {
  id: 'api2', title: '第 2 堂　載入中、失敗與 try/catch',
  steps: [
    { say: `<p>真實世界的網路會<b>慢</b>、會<b>斷</b>、對方會<b>壞掉</b>。所以畫面至少要有三種狀態：<b>載入中</b>、<b>成功</b>、<b>失敗</b>。只做「成功」的網頁，一遇到網路不好就變成一片空白。</p>`,
      check: choice('串接 API 的畫面，至少要處理哪幾種狀態？', ['載入中、成功、失敗', '只有成功', '只有失敗'], 0, '使用者永遠需要知道現在發生什麼事。') },
    { say: `<p><code>async / await</code> 加上 <code>try / catch</code>，讓程式像一般流程一樣好讀：</p>${pre("async function load() {\n  statusEl.textContent = '載入中…';\n  try {\n    const res = await fetch(url);\n    const data = await res.json();\n    statusEl.textContent = '完成';\n  } catch (err) {\n    statusEl.textContent = '載入失敗';\n  }\n}")}<p>斷網時 <code>fetch</code> 會丟出錯誤，被 <code>catch</code> 接住。</p>`,
      check: choice('網路斷了，<code>await fetch(url)</code> 會怎樣？', ['丟出錯誤，被 catch 接住', '回傳空資料', '什麼事都沒發生'], 0, '所以 fetch 一定要放進 try 裡。') },
    { say: `<p><b>很多人踩的坑：</b><code>fetch</code> 遇到 404、500 這種「對方回了錯誤」<b>不會丟錯誤</b>！它只有在「根本連不上」才會。所以要自己檢查 <code>res.ok</code>：</p>${pre("const res = await fetch(url);\nif (!res.ok) throw new Error('HTTP ' + res.status);  // 自己丟出去，讓 catch 接住")}`,
      check: choice('伺服器回 500，<code>await fetch(url)</code> 本身會丟錯誤嗎？', ['不會，要自己檢查 res.ok', '會，一定會', '只有 404 會'], 0, 'fetch 只有網路失敗才丟錯；500 要靠 res.ok。') },
  ],
  final: web({
    brief: '完成 <code>load()</code>：開始時顯示「載入中…」；成功時把氣溫（加上 °C）放進 <code>temp</code>、狀態改「完成」；失敗（斷網<b>或</b>伺服器回 500）時狀態顯示「載入失敗」、<code>temp</code> 清空。按「重新整理」會再跑一次。',
    hint: '用 <code>try { const res = await fetch(API); if (!res.ok) throw new Error(...); ... } catch { ... }</code>。檢查時會故意斷網、故意讓伺服器回 500，看你的畫面有沒有接住。',
    starter: `<h2>台北氣溫</h2>
<p data-testid="status">載入中…</p>
<p data-testid="temp"></p>
<button id="reload" data-testid="reload">重新整理</button>
<script>
const API = '${WEATHER}';
const statusEl = document.querySelector('[data-testid="status"]');
const temp = document.querySelector('[data-testid="temp"]');

async function load() {
  // TODO 1: 先把 statusEl 設成「載入中…」
  // TODO 2: try 裡面 fetch，檢查 res.ok，成功就顯示氣溫、statusEl 設成「完成」
  // TODO 3: catch 裡面把 statusEl 設成「載入失敗」、temp 清空
}

load();
document.querySelector('#reload').onclick = load;
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

async function load() {
  statusEl.textContent = '載入中…';
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    temp.textContent = data.current.temperature_2m + ' °C';
    statusEl.textContent = '完成';
  } catch (err) {
    statusEl.textContent = '載入失敗';
    temp.textContent = '';
  }
}

load();
document.querySelector('#reload').onclick = load;
</script>
`,
    must: [{ re: /try\s*\{/, msg: '請用 try { } 把 fetch 包起來' }, { re: /catch/, msg: '請用 catch 接住錯誤' }, { re: /res\.ok|\.ok\b/, msg: '請檢查 res.ok（伺服器回 500 時 fetch 不會丟錯誤）' }],
    test: async (c) => {
      const f = [], st = () => txt(c.t('status')), tp = () => txt(c.t('temp'));
      if (!c.t('status') || !c.t('temp') || !c.t('reload')) return ['缺少 status / temp / reload 元素（不要刪掉 data-testid）'];
      if (!(await c.waitFor(() => /完成/.test(st()) && /\d/.test(tp())))) f.push('網路正常時，應該顯示氣溫並把狀態改成「完成」（等了 7 秒沒有）');
      c.win.__failFetch = true; // 模擬斷網
      await c.click(c.t('reload'));
      if (!(await c.waitFor(() => /失敗/.test(st()), 3000))) f.push('斷網時，狀態應該顯示「載入失敗」，目前是「' + st() + '」');
      else if (tp() !== '') f.push('載入失敗時，temp 應該清空');
      c.win.__failFetch = 'http'; // 模擬伺服器回 500
      await c.click(c.t('reload'));
      if (!(await c.waitFor(() => /失敗/.test(st()), 3000))) f.push('伺服器回 500 時，也應該顯示「載入失敗」（目前是「' + st() + '」）。記得檢查 res.ok');
      c.win.__failFetch = false;
      await c.click(c.t('reload'));
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
  } catch (err) {
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
fetch(API)
  .then((res) => res.json())
  .then((data) => {
    data.features
      .sort((a, b) => b.properties.mag - a.properties.mag)
      .slice(0, 5)
      .forEach((f) => {
        const li = document.createElement('li');
        li.dataset.testid = 'quake';
        li.textContent = 'M' + f.properties.mag + '　' + f.properties.place;
        list.append(li);
      });
  });
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
  choice('<code>fetch</code> 遇到伺服器回 500，會？', ['不會丟錯誤，要自己檢查 res.ok', '一定丟錯誤', '自動重試'], 0),
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
  hint: '<code>const data = await (await fetch(FX)).json(); const jpy = Math.round(Number(amount.value) * data.rates.JPY);</code> 別忘了 try/catch 與 res.ok。',
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
    const res = await fetch(FX);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    result.textContent = Math.round(Number(amount.value) * data.rates.JPY);
  } catch (err) {
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
  hint: 'API：<code>WIKI + encodeURIComponent(詞條)</code>。404 時 <code>fetch</code> 不會丟錯誤，要用 <code>res.ok</code> 或 <code>res.status === 404</code> 判斷。',
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
    const res = await fetch(WIKI + encodeURIComponent(term.value.trim()));
    if (res.status === 404) { title.textContent = '找不到這個詞條'; return; }
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    title.textContent = data.title;
    extract.textContent = data.extract;
  } catch (err) {
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
    if (!(await c.waitFor(() => txt(c.t('title')).includes('找不到')))) f.push(`查不到的詞條，title 應該顯示「找不到這個詞條」（目前是「${txt(c.t('title'))}」）。404 不會讓 fetch 丟錯誤，要看 res.status 或 res.ok`);
    else if (txt(c.t('extract'))) f.push('找不到時，extract 應該清空');
    return f;
  },
});
const HOURLY = 'https://api.open-meteo.com/v1/forecast?latitude=25.05&longitude=121.52&hourly=temperature_2m&forecast_days=1&timezone=Asia%2FTaipei';
const API_P3 = web({
  brief: '專案：逐時氣溫。抓台北今天的逐時預報（<code>data.hourly.time</code> 與 <code>data.hourly.temperature_2m</code> 是兩個<b>對應的陣列</b>），顯示<b>前 6 筆</b>，每筆一個 <code>li data-testid="hour"</code>，內容像「00:00　21.7°C」。',
  hint: '時間字串像 <code>2026-10-29T03:00</code>，用 <code>time.slice(11, 16)</code> 取出「03:00」。用索引 <code>i</code> 同時取兩個陣列的值：<code>data.hourly.time.slice(0, 6).map((t, i) =&gt; ...)</code>。',
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
fetch(API)
  .then((res) => res.json())
  .then((data) => {
    data.hourly.time.slice(0, 6).forEach((t, i) => {
      const li = document.createElement('li');
      li.dataset.testid = 'hour';
      li.textContent = t.slice(11, 16) + '　' + data.hourly.temperature_2m[i] + '°C';
      list.append(li);
    });
  });
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

/* ============================ 匯出 ============================ */
export const API_COURSES = [
  { id: 'api', name: '串接 API 實戰', icon: '🔌', teacher: 'Lily 老師', chapters: [
    { id: 'api-c1', title: '第一章　fetch 基本功與錯誤處理', lessons: [A1, A2], quiz: API_QUIZ1, projects: [API_P1], event: 'api-c1' },
    { id: 'api-c2', title: '第二章　真實 API：地名、地圖、地震', lessons: [A3, A4, A5], quiz: API_QUIZ2, projects: [API_P2, API_P3], event: 'api-c2' },
  ] },
];

export const API_EVENTS = {
  'api-c1': { npc: 'mate', mood: 'worried', text: '我的天氣頁面，只要網路一慢整個畫面就一片空白，使用者還以為壞掉了……你剛學了串接 API，有什麼建議嗎？',
    options: [{ label: '加上「載入中」和「載入失敗」的畫面，用 try/catch 接住', fx: { team: 8, quality: 6, stress: 4 } }, { label: '叫使用者自己重新整理', fx: { team: -6, quality: -4 } }] },
  'api-c2': { npc: 'lead', mood: 'worried', text: '有人把公車 API 的金鑰直接寫在前端程式裡，被別人拿去亂用，額度都被用光了。你覺得該怎麼改？',
    options: [{ label: '改成前端呼叫我們的後端，金鑰只放在後端，順便做快取', fx: { quality: 10, team: 5 } }, { label: '把金鑰縮短一點，比較不明顯', fx: { quality: -8, stress: 6 } }] },
};
