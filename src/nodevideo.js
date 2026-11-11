// Node.js 影片式教學的內容（6 部）。每一步的欄位說明見 video-player.js。
import { startPlayer } from './video-player.js';

const HELLO1 = `console.log('哈囉，Node.js！');`;
const HELLO2 = `${HELLO1}

const name = '小明';
console.log(\`你好，\${name}\`);`;
const HELLO3 = `${HELLO2}

function add(a, b) {
  return a + b;
}
console.log(add(2, 3));`;

const LISTEN = `app.listen(3000, () => {
  console.log('伺服器啟動：http://localhost:3000');
});`;
const SRV1 = `const express = require('express');
const app = express();`;
const ROOT = `app.get('/', (req, res) => {
  res.send('哈囉，我是伺服器');
});`;
const SRV2 = `${SRV1}

${ROOT}`;
const SRV3 = `${SRV2}

${LISTEN}`;
const HELLO_API = `app.get('/api/hello', (req, res) => {
  res.json({ message: '哈囉' });
});`;
const SRV4 = `${SRV2}

${HELLO_API}

${LISTEN}`;

const DATA = `let scores = [{ id: 1, name: '小明', score: 80 }];
let nextId = 2;`;
const GET = `app.get('/scores', (req, res) => {
  res.json(scores);
});`;
const POST1 = `app.post('/scores', (req, res) => {
  const { name, score } = req.body;
  const item = { id: nextId++, name, score };
  scores.push(item);
  res.status(201).json(item);
});`;
const POST2 = `app.post('/scores', (req, res) => {
  const { name, score } = req.body;
  if (!name || typeof score !== 'number') {
    return res.status(400).json({ error: '要有 name，score 要是數字' });
  }
  const item = { id: nextId++, name, score };
  scores.push(item);
  res.status(201).json(item);
});`;
const DEL = `app.delete('/scores/:id', (req, res) => {
  const id = Number(req.params.id);
  scores = scores.filter((s) => s.id !== id);
  res.status(204).end();
});`;
const api = (head, ...parts) => [head, ...parts, LISTEN].join('\n\n');
const API1 = api(SRV1, DATA, GET);
const API2 = api(`${SRV1}\napp.use(express.json());`, DATA, GET, POST1);
const API3 = api(`${SRV1}\napp.use(express.json());`, DATA, GET, POST2);
const API4 = api(`${SRV1}\napp.use(express.json());`, DATA, GET, POST2, DEL);
const HEAD5 = `${SRV1}\napp.use(express.json());\napp.use(express.static('public'));`;
const API5 = api(HEAD5, DATA, GET, POST2, DEL);

const TEST = `fetch('http://localhost:3000/scores', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: '小華', score: 95 }),
})
  .then((res) => res.json())
  .then((data) => console.log(data));`;

const PAGE1 = `<!doctype html>
<meta charset="utf-8">
<h1>排行榜</h1>
<ol id="list"></ol>

<input id="who" placeholder="名字">
<input id="num" type="number" placeholder="分數">
<button id="send">送出</button>`;
const LOAD = `async function load() {
  const res = await fetch('/scores');
  const scores = await res.json();
  scores.sort((a, b) => b.score - a.score);
  list.innerHTML = scores
    .map((s) => \`<li>\${s.name}：\${s.score} 分</li>\`)
    .join('');
}
load();`;
const SEND = `send.onclick = async () => {
  await fetch('/scores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: who.value, score: Number(num.value) }),
  });
  load();
};`;
const PAGE2 = `${PAGE1}

<script>
${LOAD}
</script>`;
const PAGE3 = `${PAGE1}

<script>
${LOAD}

${SEND}
</script>`;

const FS_HEAD = `const fs = require('fs');
${HEAD5}`;
const FS_DATA = `const FILE = 'scores.json';
let scores = fs.existsSync(FILE)
  ? JSON.parse(fs.readFileSync(FILE, 'utf8'))
  : [{ id: 1, name: '小明', score: 80 }];
let nextId = Math.max(0, ...scores.map((s) => s.id)) + 1;
const save = () => fs.writeFileSync(FILE, JSON.stringify(scores, null, 2));`;
const POST3 = POST2.replace('  scores.push(item);', '  scores.push(item);\n  save();');
const DEL2 = DEL.replace('  res.status(204)', '  save();\n  res.status(204)');
const API6 = api(FS_HEAD, FS_DATA, GET, POST2, DEL);
const API7 = api(FS_HEAD, FS_DATA, GET, POST3, DEL2);

const board = (rows) => `<h3 style="margin:0 0 6px">排行榜</h3><ol style="margin:0 0 8px;padding-left:22px">${rows.map((r) => `<li>${r}</li>`).join('')}</ol><span class="fake">名字</span><span class="fake">分數</span><span class="fake btn">送出</span>`;

export const EPISODES = [
  { title: '認識 Node.js 與安裝', steps: [
    { say: '歡迎來到 Node.js 教學。這一系列總共六部，每一部都很短，我們一步一步慢慢來。', slide: ['🟢 Node.js 入門', '一共 6 部・一步一步走'] },
    { say: 'JavaScript 本來只能在瀏覽器裡面跑。Node.js 讓它可以直接在你的電腦、或是伺服器上跑。', slide: ['瀏覽器裡的 JavaScript → 做畫面（前端）', '電腦上的 JavaScript（Node.js）→ 給資料（後端）'] },
    { say: '前端負責畫面，後端負責保管資料。前端去問後端要資料，後端回答。我們這系列就是要自己寫一個後端。', slide: ['前端：「請給我排行榜」', '⬇️ 請求　　⬆️ 回應', '後端：「這是資料，拿去」'] },
    { say: '先安裝。打開 nodejs.org，下載左邊寫著 LTS 的版本，意思是穩定版。下載後一直按下一步就裝好了。', web: { url: 'https://nodejs.org', html: '<h3 style="margin:0 0 8px">Node.js</h3><span class="fake btn">下載 LTS（穩定版）</span><p style="margin:8px 0 0">下載後打開，一直按「下一步」。</p>' } },
    { say: '接著打開終端機。Windows 按開始，搜尋 PowerShell。Mac 搜尋「終端機」。它就是用打字叫電腦做事的視窗。', slide: ['Windows：開始 → 搜尋 PowerShell', 'Mac：搜尋「終端機」'] },
    { say: '輸入 node 空一格 減號 v，按 Enter。有出現版本號碼，就代表裝好了。', term: ['$ node -v', 'v22.11.0'] },
    { say: '再輸入 npm 減號 v。npm 是跟著 Node.js 一起裝好的工具，之後用它來安裝別人寫好的套件。', term: ['$ node -v', 'v22.11.0', '$ npm -v', '10.9.0'] },
    { say: '這一部就到這裡。你已經裝好 Node.js，也認識終端機了。下一部來寫第一支程式。', slide: ['✅ 裝好 Node.js', '✅ 會開終端機', '✅ 認識 node 和 npm'] },
  ] },
  { title: '第一支程式', steps: [
    { say: '先建立一個放程式的資料夾。mkdir 是建立資料夾，cd 是走進去。', term: ['$ mkdir my-api', '$ cd my-api'] },
    { say: '用 VS Code 打開這個資料夾，新增一個檔案叫 hello.js，寫下這一行。console.log 的意思是「把字印出來」。', file: 'hello.js', code: HELLO1 },
    { say: '回到終端機，輸入 node 空一格 hello.js。Node.js 就會執行這個檔案，把字印出來。', term: ['$ node hello.js', '哈囉，Node.js！'] },
    { say: '再加兩行。const 是建立一個變數，把資料取個名字存起來。反引號裡面的錢字號大括號，可以把變數塞進文字裡。', file: 'hello.js', code: HELLO2 },
    { say: '再加一個函式。函式就是把一段動作包起來取名字，之後可以重複使用。這個 add 會把兩個數字加起來。', file: 'hello.js', code: HELLO3 },
    { say: '存檔之後，要重新執行一次才會看到新的結果。記住：改了程式，就要重新執行。', term: ['$ node hello.js', '哈囉，Node.js！', '你好，小明', '5'] },
    { say: '如果打錯字，會出現紅色的錯誤訊息。不要怕，先看兩個地方：哪個檔案第幾行，還有它說什麼不對。這裡是第 4 行，nam 沒有定義，少打了一個 e。', term: ['$ node hello.js', 'hello.js:4', 'console.log(`你好，${nam}`);', '', 'ReferenceError: nam is not defined'] },
    { say: '這一部學會了：寫檔案、用 node 執行、變數、函式、看錯誤訊息。下一部來開伺服器。', slide: ['✅ node 檔名 → 執行程式', '✅ const 變數、function 函式', '✅ 錯誤訊息：看第幾行、看原因'] },
  ] },
  { title: '第一個伺服器', steps: [
    { say: '伺服器就是一支一直開著的程式，等別人來問問題，然後回答。別人問，叫做請求。它回答，叫做回應。', slide: ['伺服器 = 一直開著、等人來問的程式', '請求（request）→ 回應（response）'] },
    { say: '先在資料夾裡輸入 npm init 減號 y。它會產生一個 package.json，用來記錄這個專案用了哪些套件。', term: ['$ npm init -y', 'Wrote to my-api/package.json'] },
    { say: '再安裝 Express。它是最多人用的 Node.js 伺服器套件，幫我們省掉很多麻煩。', term: ['$ npm install express', 'added 68 packages in 2s'] },
    { say: '新增 server.js。第一行是把 Express 拿進來用，第二行是建立一個伺服器，取名叫 app。', file: 'server.js', code: SRV1 },
    { say: '這段的意思是：有人來問首頁，也就是斜線，就回他一句話。req 是對方的請求，res 是我們的回應。', file: 'server.js', code: SRV2 },
    { say: '最後叫伺服器開始等人。3000 是門牌號碼，叫做 port。', file: 'server.js', code: SRV3 },
    { say: '執行它。你會發現終端機停在那裡不動，這是正常的，因為伺服器正在等人來問。', term: ['$ node server.js', '伺服器啟動：http://localhost:3000'] },
    { say: '打開瀏覽器，輸入 localhost 冒號 3000。localhost 就是你自己的電腦。看到這句話，你的第一個伺服器就成功了。', web: { url: 'http://localhost:3000', html: '哈囉，我是伺服器' } },
    { say: '再加一個網址。這次不回文字，改回 JSON。JSON 是前端和後端交換資料最常用的格式。', file: 'server.js', code: SRV4 },
    { say: '重點來了：改了伺服器的程式，要先按 Ctrl 加 C 把它停掉，再重新執行一次。', term: ['^C', '$ node server.js', '伺服器啟動：http://localhost:3000'] },
    { say: '打開這個新網址，就會看到 JSON 資料。這種專門給資料的網址，就叫做 API。', web: { url: 'http://localhost:3000/api/hello', html: '<code>{"message":"哈囉"}</code>' } },
    { say: '這一部學會了：安裝套件、開伺服器、回文字和回 JSON。下一部來做真的 API。', slide: ['✅ npm install 安裝套件', '✅ app.get(網址, 怎麼回答)', '✅ 改完要 Ctrl+C 再重開'] },
  ] },
  { title: '做一組排行榜 API', steps: [
    { say: '這一部做排行榜的 API。API 最常見的動作有四個：GET 是讀取，POST 是新增，PUT 是修改，DELETE 是刪除。', slide: ['GET 讀取　　POST 新增', 'PUT 修改　　DELETE 刪除'] },
    { say: '把 server.js 改成這樣。先用一個陣列放分數，再加一個網址：有人用 GET 來問 scores，就把整個陣列回給他。', file: 'server.js', code: API1 },
    { say: '重開伺服器，打開 scores 這個網址，就能看到目前的排行榜資料。', web: { url: 'http://localhost:3000/scores', html: '<code>[{"id":1,"name":"小明","score":80}]</code>' } },
    { say: '接著做新增。上面多的那一行，是讓伺服器看得懂對方送來的 JSON。下面的 post 會從 req.body 拿出名字和分數，放進陣列，再回覆 201，意思是「新增成功」。', file: 'server.js', code: API2 },
    { say: '瀏覽器的網址列只能做 GET，所以我們另外寫一個小檔案 test.js 來測試新增。fetch 就是「發出請求」，前端也是用同一個寫法。', file: 'test.js', code: TEST },
    { say: '伺服器要保持開著。所以再開第二個終端機視窗，在裡面執行 test.js。看到回傳的新資料，就代表新增成功。', term: ['$ node test.js', "{ id: 2, name: '小華', score: 95 }"] },
    { say: '後端一定要檢查對方送來的資料。這裡加上檢查：沒有名字，或分數不是數字，就回 400，意思是「你送的資料有問題」。', file: 'server.js', code: API3 },
    { say: '最後做刪除。網址裡的冒號 id 是一個空格，對方填幾號，就刪掉幾號。204 的意思是「成功了，沒有東西要回」。', file: 'server.js', code: API4 },
    { say: '順便記三個常見的狀態碼：2 開頭是成功，4 開頭是對方的錯，5 開頭是伺服器自己的錯。', slide: ['200／201／204　成功', '400／404　對方送錯、找不到', '500　伺服器自己壞了'] },
    { say: '這一部你做出了一組真的 API：讀取、新增、刪除，還有資料檢查。下一部讓網頁來用它。', slide: ['✅ GET /scores 讀取', '✅ POST /scores 新增＋檢查', '✅ DELETE /scores/:id 刪除'] },
  ] },
  { title: '讓前端接上後端', steps: [
    { say: '這一部最重要，因為這就是前端工程師每天在做的事：讓網頁去呼叫 API。', slide: ['網頁 → fetch → API → 資料 → 畫到畫面上'] },
    { say: '先在 server.js 加一行。它的意思是：public 資料夾裡的檔案，都可以直接用瀏覽器打開。', file: 'server.js', code: API5 },
    { say: '建立 public 資料夾，裡面新增 index.html。先放標題、一個清單、兩個輸入框和一個按鈕。', file: 'public/index.html', code: PAGE1 },
    { say: '加上程式。load 會去問後端要分數，等資料回來，由高到低排好，再變成一行一行畫到清單上。await 的意思是「等它做完再往下」。', file: 'public/index.html', code: PAGE2 },
    { say: '重開伺服器，打開 localhost 3000。網頁真的從你寫的後端拿到資料了。', web: { url: 'http://localhost:3000', html: board(['小明：80 分']) } },
    { say: '再讓按鈕可以新增。按下去的時候，把輸入框的內容用 POST 送給後端，送完再重新讀一次清單。', file: 'public/index.html', code: PAGE3 },
    { say: '重新整理網頁，輸入小華、95，按送出。清單馬上更新，而且分數高的排在前面。', web: { url: 'http://localhost:3000', html: board(['小華：95 分', '小明：80 分']) } },
    { say: '這一部你把前端和後端接起來了。面試常問「前端怎麼跟後端溝通」，答案就是你剛剛做的這些。', slide: ['✅ fetch 發請求', '✅ await 等資料回來', '✅ 把資料畫到畫面上'] },
  ] },
  { title: '把資料存起來，以及下一步', steps: [
    { say: '現在有一個問題：伺服器一重開，新增的分數就不見了。因為資料只放在記憶體裡，程式關掉就沒了。', term: ['^C', '$ node server.js', '伺服器啟動：http://localhost:3000', '（小華的 95 分不見了）'] },
    { say: '最簡單的解法是存成檔案。fs 是 Node.js 內建的檔案工具。啟動時，如果有 scores.json 就讀進來；save 則是把目前的資料寫回檔案。', file: 'server.js', code: API6 },
    { say: '然後在新增和刪除的地方，各加一行 save。資料一有變動，就存一次檔。', file: 'server.js', code: API7 },
    { say: '重開伺服器，新增一筆，再重開一次。資料還在，而且資料夾裡多了一個 scores.json。', term: ['$ node server.js', '伺服器啟動：http://localhost:3000', '$ node test.js', "{ id: 2, name: '小華', score: 95 }", '（重開之後，小華還在 ✅）'] },
    { say: '真正的專案不會存檔案，會用資料庫，因為資料多的時候比較快，也比較安全。建議先學 SQLite，不用另外安裝伺服器。', slide: ['記憶體 → 檔案 → 資料庫', '下一步：SQLite'] },
    { say: '最後一步是部署，也就是把程式放到網路上的主機，讓別人也打得開。到這裡，你就有一個可以寫進履歷的作品了。', slide: ['部署 = 放到網路上，別人也能用', '有網址的作品，最適合放履歷'] },
    { say: '恭喜你看完六部。接下來請自己從頭做一次，不要看答案。卡住的地方，回來看那一部就好。也可以回遊戲的教室，做 Node.js 課的練習。', slide: ['🎉 全部看完了', '現在換你：自己從頭做一次'] },
  ] },
];

if (typeof document !== 'undefined') startPlayer(EPISODES, 'nodevideo');
