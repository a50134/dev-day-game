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
- 練習類型（`src/practice.js`）：`ts`、`tw`、`react`、`vue`、`web`（串真 API 的一般網頁）、`code`（Node.js / Python，`src/runner.js` 用 Web Worker 真的執行，Python 用 Pyodide）。
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
