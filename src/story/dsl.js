// 劇本小工具：讓每一部的劇本寫起來像在寫對話。
// 用法見各部 ep*.js；每個函式回傳一個「動作（beat）」，引擎（story-player.js）依序執行。
export const T = (text, mood = 'happy', x) => ({ say: 'teacher', text, mood, ...x }); // 老師說
export const R = (text, mood = 'normal', x) => ({ say: 'rookie', text, mood, ...x });  // 新人說
export const chapter = (title, card) => ({ chapter: title, ...(card ? { card, ms: 2300 } : {}) });
export const type = (file, text, o) => ({ code: { file, text, ...o } });               // 新人打字（o.slow 小修改、o.bulk 大量重複內容快速帶過、o.broken 刻意做錯的版本、o.noCheck 中間狀態不跑型別檢查）
export const open = (file) => ({ file });                                              // 切換到某個檔案
export const view = (ms = 1800, mode) => ({ view: { ms, mode } });                      // 讓預覽真的跑一次
export const hl = (a, b = a) => ({ hl: [a, b] });
export const unhl = { hl: null };
export const float = (html) => ({ float: html });
export const unfloat = { float: null };
export const fx = (emoji, on) => ({ fx: emoji, on });
export const shake = { fx: 'shake' };
export const confetti = { fx: 'confetti' };
export const wait = (ms) => ({ wait: ms });
export const vp = (v) => ({ vp: v });
export const term = (cmd, out = [], err) => ({ term: { cmd, out, err } });              // 終端機
export const termClear = (cmd, out = [], err) => ({ term: { cmd, out, err, clear: true } });
export const code = { term: null };                                                     // 回到程式碼畫面
export const err = (line, match, text) => ({ err: { line, match, text } });            // TypeScript 紅色波浪線
export const noerr = { err: null };

// 浮動小卡片
export const card = (title, body) => `<h5>${title}</h5>${body}`;
export const list = (items) => `<ul class="ck">${items.map((t, i) => `<li style="animation-delay:${i * 0.5}s">${t}</li>`).join('')}</ul>`;
export const swatches = (rows) => `<div class="sw-row">${rows.map(([bg, n, h, dark], i) => `<div class="sw" style="background:${bg};color:${dark ? '#fff' : '#222'};animation-delay:${i * 0.06}s">${n}<small>${h}</small></div>`).join('')}</div>`;
export const lineOf = (text, needle) => text.split('\n').findIndex((l) => l.includes(needle)) + 1; // 某段文字在第幾行（給 err、hl 用）
