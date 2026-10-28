# 前端工程師的一天（訂票版）

不用安裝，起一個靜態伺服器即可（ES module 不能直接用 file:// 開）：

```bash
python3 serve.py
```

- 遊戲：http://localhost:8000/
- 需要連網（React、Babel、CodeMirror、TypeScript 編譯器、Tailwind、字體都從 CDN 載入）

## 遊戲流程
可走動的 3D 辦公室（方向鍵／WASD，空白鍵互動；沒有 WebGL 或按「切換 2D」會用 2D 地圖）→ 找 PM 開需求會議 → 找設計師討論風格 → 找組長選技術 → 回座位實作三頁（右邊有設計稿、規格、Tailwind／Bootstrap 速查）→ 突發事件 → 結算。
教室有 TypeScript、Tailwind、React、Vue、Node.js 後端、Python 六門課（每堂課都能自由進去上；Node.js 與 Python 的練習會真的執行你寫的程式：JavaScript 在 Web Worker 裡模擬 Node.js 與 Express，Python 用瀏覽器內的 Pyodide，第一次要下載約 10～30 秒）（各 5 堂、兩章，章節測驗及格後有小專案與辦公室小事件；上方列隨時可進教室）。右上角「🧩 TS 練習場」可隨時練習。

## 專案衝刺（上班日模式）
辦公室裡走到 📋 任務看板：連續 10 個工作天，要把一個大型專案如期完成。每天 9:00–18:00，手上同時有大／中／小工單（期限、重要程度不同），每天進新單、被會議與突發事件打斷，中途有需求變更、線上事故、同事請假等大事；每天下班後有優先順序檢討與明日建議，壓力太高會請病假。（`src/workday.js`）

## 自我檢查（用瀏覽器開，看到 ALL OK 才算正常）
- `test.html`：三個實作關卡，起始程式必須不過、參考解答必須過
- `test-course.html`：所有課程總練習與小專案，同上
- `smoke.html`、`smoke2.html`：真的操作遊戲（走動、互動、上課、測驗、主線串接）
- `smoke3.html`、`smoke4.html`：各種總練習貼上答案、按「送出檢查」、重置、看解答
- `smoke6.html`：3D 辦公室（畫面、走路、互動、切換 2D／3D、離開時釋放）
- `smoke5.html`：專案衝刺用三種策略玩完 10 天（專注大專案／只做小單／每天加班），檢查流程、存檔、時間帳與勝負

## 結構
- `src/main.js` 主流程；`src/office.js` 辦公室邏輯與 2D 地圖；`src/office3d.js` 3D 場景（Three.js）；`src/course-ui.js` 教室／上課／測驗／專案
- `src/courses.js`、`src/courses-fe.js` 課程資料（TS／Tailwind、React／Vue）；`src/practice.js` 練習引擎（TS 修紅線、Tailwind 比對樣式）；`src/ts.js` TS 編譯器與挑戰
- `src/levels.js`、`src/checks.js`、`src/sandbox.js`、`src/fixtures.js` 實作關卡（預覽、假 API、QA 檢查）
- `src/scenes.js` 文字；`src/chars.js` SVG 角色；`src/editor.js` CodeMirror；`src/store.js` 存檔
