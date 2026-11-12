# 前端工程師的一天（dev-day-game）

純靜態網頁遊戲，沒有 build。`python3 serve.py` 後開 http://localhost:8000/ 。線上版是 GitHub Pages（push 到 main 就會更新）。

## 使用者
- 繁體中文，語音輸入，常有錯字（「泰沃的」= Tailwind、「拍粉」= Python、「諾妲js」= Node.js）。沒當過工程師，完全沒學過 TypeScript / Tailwind，所以講解要口語、小步驟。
- 打不了英文：課程裡的題目一律用**選擇題**，不要出填空題。
- 回答用繁體中文，結論先講，不要太長。

## 結構
- `index.html`：所有 CSS。`src/main.js`：流程與標題列。`src/office.js` / `office3d.js`：辦公室（3D 用 Three.js，失敗退回 2D，`?view=2d` 強制 2D）。`src/stage.js`：教室與專案衝刺上方的 3D 小舞台。
- 課程：`src/courses.js`（TypeScript、Tailwind，並彙整全部）、`courses-fe.js`（React、Vue）、`courses-be.js`（Node.js、Python）、`courses-api.js`（串接 API）。每堂 = 3 個小步驟（講解＋選擇題）＋ 1 個總練習；每章 = 測驗＋小專案＋辦公室小事件。
- 每門課最後一章是「手把手專案」（從空白做到完成，6～8 個單元，起始程式 = 上一步解答 + TODO）：`guided-ts/tw/rc/vu/nd/py.js`，串接 API 的在 `courses-api.js`。各有 `smoke-guided-*.html` 測試（Node/Python 的 Worker 在無頭瀏覽器跑不完，改用 node / python3 驗證邏輯）。
- 串接 API 最前面有「第〇章 入門」（`courses-api0.js`）：不用打字的教學小工具在 `lab.js`（viewer 看真實回應／lab 一行一行開關／blocks 拼積木／blanks 選填空），在課程步驟裡用 `widget:` 欄位；`gate: true` 表示做對才能下一步。測試 `smoke11.html`。
- 其他六門課最前面也有「第〇章　超簡單版」（`courses-intro.js`，每門 4 單元×3 小步，沒有總練習：做完小工具＋答對小檢查就算完成這堂，`final` 可省略）。lab.js 另有 `explore`（點一下看事先寫好的結果）、`twlab`（勾 Tailwind class 即時預覽）；`blocks`/`blanks` 加 `output:` 就顯示事先寫好的結果、不執行（Python、TypeScript 用），不加就真的執行（Node 用）。測試 `smoke12.html`（全部小工具）、`smoke13.html`（真實教室走完一章）。測試要點「第 1 堂」請用列的文字找，不要點第一個「上課」。
- 遊戲主線有四家公司（`companies.js`：搶票通、購購購、穩穩、找找看），進公司後選職位：前端（3 個 React 頁面）／後端（3 個 Node.js 函式題，真的執行並測試）／全端（先後端、再前端）。搶票通的前端關卡手寫在 `levels.js`，其他三家用 `levels-gen.js` 的三種樣板（列表 / 選取 / 表單）產生，每關有自己的 `check`；假 API 資料在各公司的 fixtures，`sandbox.js` 的 `buildSrcdoc` 吃 `fixtures`。要新增公司：在 `companies.js` 的 `DATA` 加一包、在 `scenes.js` 的 `COMPANIES` 加一列。測試 `smoke14.html`（每家每關：解答過、起始不過）、`smoke15.html`（選公司／職位／後端關卡／結算）。後端題另有 Python 版（`companies-py.js`，id 相同、snake_case；選後端／全端時在職位畫面選語言，`S.lang`）。工作日 sprint（`workday.js`）有 `THEMES`，工單與事件文字依 `S.company` 換主題（測試 `smoke16.html`）。
- 版面（index.html 最後的 CSS）：>1100px 筆電：`.split` 固定一個螢幕高，說明欄和工作區各自捲動（編輯器佔約 58%）；801–1100px 平板：說明欄變窄、設計稿與預覽上下排；≤800px 手機：單欄、整頁正常捲動。grid 欄要寫 `minmax(0, 1fr)`，不然長程式行會把頁面撐寬。
- 練習類型（`src/practice.js`）：`ts`、`tw`、`react`、`vue`、`web`（串真 API 的一般網頁）、`code`（Node.js / Python，`src/runner.js` 用 Web Worker 真的執行，Python 用 Pyodide）。
- 影片式教學（獨立頁面，自動播放、字幕、可開語音；教室的課程卡片有入口，在 `course-ui.js` 的 `VIDEO`）：播放器 `src/video-player.js`、樣式 `src/video.css`。Node.js：`node-video.html` + `src/nodevideo.js`（6 部，程式要能真的用 node + express 跑）。React：`react-video.html` + `src/reactvideo.js`（7 部，照六角 React 班課綱，程式要能真的用 Vite 建置）。要加新課：寫一個資料檔＋一個 html。
- Tailwind v4 + React + TypeScript「I need this」首頁影片教學：`tailwind-react-video.html` + `src/tailwindvideo.js`（13 部、180 步；講解 `tw-react-1/2/3.js`，程式碼全在 `tw-react-code.js`）。照六角 Figma 設計稿（Design System 的顏色、字型、按鈕＋UI mockup 首頁），串六角 EC API（products／cart）。**改程式碼要重新驗證**：把每個 `file` 步驟的 `code` 依序寫進一個全新的 Vite react-ts 專案，每步跑 `tsc -b`、每部結束跑 `vite build`（`broken: true` 的步驟是刻意示範型別錯誤，會略過）。教學程式裡不能出現反引號與 `$`。圖片用使用者舊專案 `a50134/I-need-this` 的 `assets/images`，商品圖用該 repo 的 raw.githubusercontent 網址。
- 專案衝刺（`src/workday.js`）：10 天、多張工單、突發事件、每日檢討。

## 驗證
檢查頁用瀏覽器開，看到 `ALL OK` 才算過：`test.html`、`test-course.html`、`smoke.html`～`smoke10.html`。改完相關功能要跑。
- 無頭瀏覽器不會自動播放動畫影格，3D 測試用 `window.__o3d.step(dt)` 手動推進。
- 虛擬時間會讓 Worker / Pyodide 的流程提早逾時；Python 題目的邏輯可用本機 `python3` 驗證。
- `smoke10.html` 和 `test-course.html` 的 `web` 題會真的連網（Open-Meteo、USGS、Frankfurter、維基）。

## 注意
- 在 WSL 用 Windows Edge 無頭測試時，網址不要用 `localhost:8000`（WSL 轉發偶爾會截斷 60KB 以上的檔案，頁面變空白、測試亂失敗），改用 `hostname -I` 的 IP，例如 `http://172.x.x.x:8000/`。
- 教室是兩層：先選課（`S.room`），再選單元。測試要先點「進入」。
- 事件處理函式不要寫 `e.key === 'Enter' && fn()`（回傳 false 會吃掉按鍵）。元素 id 不要用 `prompt` 這類 window 既有名稱。
- esm.sh 載入 CodeMirror 不要加 `?deps=`。
- 頂層 `const status` 之類名稱會和 window 衝突，範例程式用 `statusEl`。
- 在雲端工作階段（沒有瀏覽器）：只能改程式與用 node / python3 驗證邏輯；改完請開 PR，不要假設能直接推 main。
