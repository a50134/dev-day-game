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
- Tailwind v4 + React + TypeScript「I need this」首頁教學（13 部）**只剩動畫版**（使用者要求「全部改動畫版、刪掉影片」，舊的 `tailwind-react-video.html`／`tailwindvideo.js`／`video-anim.js` 已刪）。照六角 Figma 設計稿（Design System 的顏色、字型、按鈕＋UI mockup 首頁），串六角 EC API（products／cart）。程式碼全在 `src/tw-react-code.js`（每個常數都是驗證過的正確版本）。圖片用使用者舊專案 `a50134/I-need-this` 的 `assets/images`，商品圖用該 repo 的 raw.githubusercontent 網址。教學程式裡不能出現反引號與 `$`。
- **講義** `tailwind-react-handout.html`（`src/tw-handout.js` ＋ `tw-handout-notes.js` ＋ `tw-handout-annot.js` ＋ `tw-handout-imports.js`）：程式碼與指令自動取自 `tw-episodes.js`（合併 `tw-react-1/2/3.js`，這是舊影片的資料，**現在只給講義用**），重點、速查表、設計稿對照表在 notes；可列印成 PDF。使用者看不懂「為什麼這樣寫」和 import／export 路徑，所以講義有：① 最前面「import／export 與路徑怎麼看」（出口↔入口對照、兩種 export、路徑口訣、用真實路徑算出的例子表、誰拿了誰、常見錯誤、資料夾分工）；② 每部「一步一步做（每一步為什麼）」`STEP_WHY`；③ 每個檔案的「為什麼要有這個檔案」`FILE_WHY` 和**逐行說明** `LINE_NOTES`（程式碼左、說明右，手機改成下方；工具列可關閉；複製出來的程式碼是乾淨的）。`LINE_NOTES` 是 `[出現在那一行的字, 說明]`，**必須依檔案裡出現的順序寫**（同一檔案的每個版本共用，找不到的版本會略過）；import／export 那幾行的說明由 `tw-handout-imports.js` 從程式碼自動算（會檢查對方真的有那個 export，不會寫錯），不用手寫。新增或改教學程式碼時：跑 `node` 腳本確認每個 needle 都對得到某個版本、每個 import 都解得到檔案。講義還有：「圖片放哪裡、路徑怎麼寫」（舊專案 `assets/images` → 新專案 `public/images` → 程式寫 `/images/…`；圖片清單由程式碼掃出來，並已對照過 `a50134/I-need-this` 的檔名）、每個檔案相對於「上一次出現的版本」的差異標示（`src/tw-handout-diff.js`：藍色＝這一部新增或修改的行；新檔案標「🆕」，回頭修改標「✏️」）。動畫版（`src/story/epNN.js`）才是主角；改教學程式碼時，兩邊都要同步。
- **動畫版（劇場式）**：使用者**不喜歡**「要一直按下一步」和機器人語音。`tw-story.html` → `src/story/app.js`（`?ep=1..13`，目錄、自動接下一部）；引擎 `src/story-player.js`、樣式 `src/story.css`；劇本 `src/story/ep01.js`～`ep13.js`（目錄 `src/story/index.js` 的 `SCRIPTS`）；劇本語法 `src/story/dsl.js`（`T`老師說／`R`新人說／`chapter`／`type`／`open`／`view`／`vp`／`hl`／`float`+`card`／`err`／`term`／`fx`…）；每部開始前專案裡有哪些檔案 ＝ 前面各部 `type` 動作依序套用（`src/story/state.js` 的 `filesAfter`）。老師 Lily 與新人（`chars.js` 的手繪角色）自動從頭演到尾、**完全無聲**（只有對話氣泡）；演法是「新人先試 → 做錯 → 老師用問題點醒 → 新人自己找到原因」。新人在編輯器裡真的打字（`type`：`slow` 小修改、`bulk` 大量內容快速帶過、`broken` 刻意做錯的版本、`noCheck` 中間狀態不跑型別檢查）；`view(ms, mode, scroll)` 用 `tw-preview.html`（iframe：sucrase 轉 TSX、Tailwind 瀏覽器版、`tw-mock-api.js` 假六角 API、`vendor/`、`tw-assets/images/`）真的執行畫面，所以「做錯」的畫面是真的，`scroll` 是畫好後捲到某個標題文字，`vp('mobile'|'desktop')` 切手機／桌面；`err(行, 比對字, 訊息)` 在**目前開著的那個檔案**畫紅色波浪線與訊息（只在該檔案顯示）；`term(指令, 輸出, 錯誤輸出)` 顯示終端機。點畫面暫停、點章節跳轉（引擎會快轉重演到該章）、可調速（⏱ 0.5×～2×）與**打字速度**（⌨️ 慢／中／快；使用者說過打字太快看不清楚，後來又說「可以打快一點，但每打完一行要停一下讓我看」，所以目前每行打完會停頓，不要再調快或取消停頓）、可重播，設定存在 localStorage；筆電區自動放大，程式碼自動換行，🔍 暫停並全螢幕看完整檔案（手機看不到後半段的問題）；`?speed=N`、`?start=章節`、`window.__story.measure()`（量 1× 總長）供測試。
- **第二階段講義**（只有講義、不做動畫版）`tailwind-react-handout-2.html`（`<html data-stage="2">`，同一支 `src/tw-handout.js` 依 `data-stage` 切換）：第 14 部「路由」（React Router）、第 15 部「產品列表」、第 16 部「商品細節」、第 17 部「結帳」（設計稿只有第 1 步購物車，第 2、3 步是自己照樣子排的；程式碼 `tw2-code-checkout.js`，說明 `tw2-annot-checkout.js` 的 `LINE_NOTES4`／`INSERTS`／`applyInserts`）、第 18 部「品牌介紹」（程式碼 `tw2-code-brand.js`，說明 `tw2-annot-brand.js` 的 `LINE_NOTES5`／`INSERTS5`）。第二階段到此全部完成。第 16 部的程式碼在 `src/tw2-code-detail.js`，逐行說明在 `tw2-annot.js` 的 `LINE_NOTES3`。資料在 `src/tw2-episodes.js`（步驟）＋`tw2-code.js`（程式碼常數，修改第一階段檔案時用 `finalOf()` 取最後版本再 `swap()`）＋`tw2-annot.js`（`FILE_WHY2`／`LINE_NOTES2`／`STEP_WHY2`）＋`tw2-notes.js`（`NOTES2`，含 `design`：設計稿截圖、這裡要注意什麼、怎麼量尺寸、尺寸對照表）。第一階段既有檔案（Navbar、api.ts、seed.mjs、App.tsx）新增的逐行說明，直接寫在 `tw-handout-annot.js` 同一份清單的對應位置（第一階段頁面找不到會略過）。設計稿截圖放 `tw-assets/design/`（用 PyMuPDF 從使用者的設計稿 PDF 轉圖並疊上紅色尺寸標註）。**設計稿 PDF 的第 1 頁其實藏著整張桌面首頁（高 5614px，只露出前 1080）**，用 `page.get_image_info()`／`get_drawings()`／`get_texttrace()` 就能量出所有區塊的真實座標，不要用目測；桌面內容寬是 1296（左邊界 x=312）。
- **第二階段驗證方式**：開一個全新的 Vite react-ts 專案（`npm install tailwindcss @tailwindcss/vite axios react-router`），先把第 1～13 部最終程式碼寫進去，再依 `tw2-episodes.js` 的順序一個檔案一個檔案寫入，**每步跑 `tsc -b`、每部跑 `vite build`**；API 用本機假伺服器（`/products`、`/products/all`、`/cart`）；再用瀏覽器 1920 寬量版面對照設計稿（例如首頁輪播 992、圖文區圖高 632／595、頁尾 329；產品列表圖 306×204、側欄 306）。逐行說明的比對字要確認每個都對得到（依出現順序），每個 import 要解得到、具名匯出要真的存在。教學程式碼不能出現反引號與錢字號。
- **圖片檔名**：第一階段程式碼用舊專案 `a50134/I-need-this` 的檔名（`/images/hero-01.png`…）；使用者實際專案 `public/images/` 是 `img/hero img-01.png`、`img/精油產品 01.jpg`、`svg/logo_on-light.svg`、`icon/…` 這類不同檔名。第二階段直接用使用者專案的真實檔名（商品圖 `/images/img/精油產品 0N.jpg` 以相對路徑存進 API）。
- **改或新增動畫版劇本時一定要驗證**：每個 `type` 的 `text` 依序寫進全新 Vite react-ts 專案，每步跑 `tsc -b`（`broken` 預期會失敗、`noCheck` 略過）、每部結束跑 `vite build`，而且 `err` 的訊息必須和真的 `tsc` 輸出一字不差（用 `includes` 比對；多行訊息取最有用的那一行）；做錯的畫面／行為（例如沒寫 `--color-` 前綴就不會產生 class、沒包 Provider 預覽會丟錯）要用真的工具確認過；終端機的 `npm install`／`build`／`lint` 輸出要是真的跑出來的（模組數、檔案大小因環境略有不同）。目前 13 部 1× 總長約 65 分鐘（最長第 6 部約 8 分，最短第 13 部約 3 分）。
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
