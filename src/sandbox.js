import { FIXTURES } from './fixtures.js';

const CDN = 'https://cdnjs.cloudflare.com/ajax/libs';
const json = (v) => JSON.stringify(v).replace(/</g, '\\u003c');

// 預覽頁：載入 React + Babel，把玩家的 App 編譯後掛上去；fetch 由 FIXTURES 假裝成 API
export function buildSrcdoc({ code, css = '', tech }) {
  const presets = tech.ts ? "['react',['typescript',{isTSX:true,allExtensions:true}]]" : "['react']";
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC&family=Noto+Serif+TC&display=swap" rel="stylesheet">
${tech.tailwind ? '<script src="https://cdn.tailwindcss.com/3.4.16"></script><script>tailwind.config = { corePlugins: { preflight: false } };</script>' : ''}
${tech.bootstrap ? '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">' : ''}
<style>${css.replace(/<\/style/gi, '<\\/style')}</style>
<script src="${CDN}/react/18.3.1/umd/react.development.min.js"></script>
<script src="${CDN}/react-dom/18.3.1/umd/react-dom.development.min.js"></script>
<script src="${CDN}/babel-standalone/7.24.7/babel.min.js"></script>
</head><body><div id="root"></div><script>
window.__error = null;
const root = document.getElementById('root');
const show = (m) => { window.__error = String(m); root.innerHTML = '<pre style="color:crimson;white-space:pre-wrap"></pre>'; root.firstChild.textContent = String(m); };
window.onerror = (m) => show(m);
document.addEventListener('submit', (e) => e.preventDefault());
const FIX = ${json(FIXTURES)};
window.fetch = (u) => {
  const p = String(u).replace(/^https?:\\/\\/[^/]+/, '');
  return Promise.resolve(p in FIX
    ? new Response(JSON.stringify(FIX[p]), { headers: { 'content-type': 'application/json' } })
    : new Response('{}', { status: 404 }));
};
try {
  const out = Babel.transform(${json(code)}, { presets: ${presets}, filename: 'app.${tech.ts ? 'tsx' : 'jsx'}' }).code;
  (0, eval)(out + '\\n;window.App = App;');
  ReactDOM.createRoot(root).render(React.createElement(window.App));
} catch (e) { show(e.message); }
</script></body></html>`;
}

export function mount(iframe, opts) {
  return new Promise((res) => {
    iframe.onload = () => res();
    iframe.srcdoc = buildSrcdoc(opts);
  });
}
