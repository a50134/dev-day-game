// 教學即時預覽：收到「目前這一步的所有檔案」，在瀏覽器裡編譯並執行，畫面是真的（可以 hover、點擊、輪播會動）。
// 流程：每個 .ts/.tsx 用 sucrase 轉成 JS → 相對路徑的 import 換成 blob 網址 → 動態載入 App → 用 React 畫出來。
// CSS 交給 Tailwind 的瀏覽器版（<style type="text/tailwindcss">）。
import React, { createRoot } from 'react';
import { transform } from 'sucrase';
import { installMock } from './tw-mock-api.js';

const IMG_BASE = new URL('../tw-assets/images/', import.meta.url).href;
const PHOTO_PNG = /\b(hero-0[123]|section-0[12]|category-0[1-4]|bgc-img)\.png\b/g; // 照片已壓成 jpg，檔名不同

const fixText = (code) =>
  code
    .replaceAll('/images/', IMG_BASE)
    .replace(PHOTO_PNG, '$1.jpg')
    .replaceAll('import.meta.env.VITE_API_BASE', '"https://ec-course-api.hexschool.io/v2"')
    .replaceAll('import.meta.env.VITE_API_PATH', '"demo"');

const root = document.getElementById('root');
const showError = (e) => {
  root.innerHTML = '';
  const pre = document.createElement('pre');
  pre.style.cssText = 'margin:0;padding:12px;color:#b91c1c;font:12px/1.5 ui-monospace,monospace;white-space:pre-wrap';
  pre.textContent = '預覽失敗：' + (e?.message || e);
  root.append(pre);
};

function resolvePath(files, from, spec) {
  const parts = from.split('/').slice(0, -1);
  for (const seg of spec.split('/')) { if (seg === '..') parts.pop(); else if (seg !== '.') parts.push(seg); }
  const base = parts.join('/');
  return [base, base + '.tsx', base + '.ts', base + '.jsx', base + '.js', base + '/index.tsx'].find((p) => p in files);
}

async function build(files, entry) {
  const urls = new Map(), busy = new Set();
  const load = async (path) => {
    if (urls.has(path)) return urls.get(path);
    if (busy.has(path)) throw new Error('發現循環引用：' + path);
    busy.add(path);
    let js = transform(fixText(files[path]), { transforms: ['typescript', 'jsx'], jsxRuntime: 'automatic', production: true, disableESTransforms: true }).code;
    for (const m of [...js.matchAll(/(?:import|export)\s+(?:[^'"]*?\s+from\s+)?['"](\.{1,2}\/[^'"]+)['"]/g)]) {
      const spec = m[1];
      if (/\.css$/.test(spec)) { js = js.replaceAll(m[0], ''); continue; }
      const target = resolvePath(files, path, spec);
      if (!target) throw new Error(path + ' 找不到 ' + spec);
      const url = await load(target);
      js = js.replaceAll("'" + spec + "'", '"' + url + '"').replaceAll('"' + spec + '"', '"' + url + '"');
    }
    const url = URL.createObjectURL(new Blob([js], { type: 'text/javascript' }));
    urls.set(path, url); busy.delete(path);
    return url;
  };
  return import(await load(entry));
}

async function render({ files, mode }) {
  try {
    installMock(mode);
    document.querySelectorAll('style[type="text/tailwindcss"]').forEach((s) => s.remove());
    const css = files['src/index.css'];
    if (css && css.trim()) {
      const style = document.createElement('style');
      style.type = 'text/tailwindcss';
      style.textContent = fixText(css);
      document.head.append(style);
    }
    const app = files['src/App.tsx'] ? await build(files, 'src/App.tsx') : null;
    if (!app) return showError('這一步還沒有 App.tsx');
    createRoot(root).render(React.createElement(app.default));
  } catch (e) { showError(e); }
  // 畫面畫好了（等 Tailwind 產生完 CSS）就通知外面，讓動畫版可以平順地換上新畫面
  requestAnimationFrame(() => setTimeout(() => parent.postMessage({ type: 'preview-rendered' }, '*'), 350));
}

window.addEventListener('message', (e) => { if (e.data?.type === 'render') render(e.data); });
parent.postMessage({ type: 'preview-ready' }, '*');
