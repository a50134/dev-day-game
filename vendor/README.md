# vendor（教學即時預覽用的第三方檔案）

`tw-preview.html` 在瀏覽器裡執行教學的程式碼，需要下面這些檔案。全部放在本機，不依賴外部 CDN。

| 檔案 | 來源 | 版本 | 授權 |
|---|---|---|---|
| `react-all.js` | `react`、`react-dom`（用 esbuild 打包成單一 ESM 檔，同時提供 `react`、`react/jsx-runtime`、`react-dom/client`） | 19.3.1 | MIT |
| `axios.js` | `axios`（用 esbuild 打包） | 1.21.1 | MIT |
| `sucrase.js` | `sucrase`（把 TypeScript／JSX 轉成 JS，用 esbuild 打包） | 3.35.1 | MIT |
| `tailwind-browser.js` | `@tailwindcss/browser` 的 `dist/index.global.js` | 4.3.5 | MIT |

重新產生：在空資料夾 `npm i esbuild sucrase @tailwindcss/browser react@19 react-dom@19 axios`，
用 esbuild（`--bundle --format=esm --platform=browser --minify`）打包上面三個，再複製 tailwind 的 dist 檔。
