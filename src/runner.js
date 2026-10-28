// 真的執行玩家寫的 JavaScript（模擬 Node.js 環境）和 Python（Pyodide），在 Web Worker 裡跑，卡住會自動中止。
// 玩家程式後面接上 ex.tests；tests 裡用 check(條件, 訊息)、output()（目前印出的文字）檢查。
const JS_WORKER = `
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const show = (a) => a.map((x) => (typeof x === 'string' ? x : x instanceof Error ? x.message : (() => { try { return JSON.stringify(x); } catch (e) { return String(x); } })())).join(' ');
const makeExpress = () => {
  const mw = [], routes = [];
  const add = (m) => (p, h) => routes.push([m, p, h]);
  const app = { use: (f) => mw.push(f), get: add('GET'), post: add('POST'), put: add('PUT'), delete: add('DELETE'), listen: (p, cb) => cb && cb(),
    async handle(method, url, body) {
      const [path, qs = ''] = url.split('?');
      const query = Object.fromEntries(new URLSearchParams(qs));
      const res = { statusCode: 200, body: undefined, status(c) { this.statusCode = c; return this; }, json(b) { this.body = b; return this; }, send(b) { this.body = b; return this; } };
      let params = {}, handler = null;
      for (const [m, p, h] of routes) {
        if (m !== method) continue;
        const a = p.split('/'), b = path.split('/');
        if (a.length !== b.length) continue;
        const ps = {};
        if (a.every((s, i) => (s[0] === ':' ? ((ps[s.slice(1)] = decodeURIComponent(b[i])), true) : s === b[i]))) { params = ps; handler = h; break; }
      }
      const req = { method, path, params, query, body: body || {} };
      const chain = [...mw, ...(handler ? [handler] : [(q, r) => r.status(404).json({ error: 'Not Found' })])];
      for (const f of chain) {
        let next = false;
        await f(req, res, () => (next = true));
        if (!next) break;
      }
      return { status: res.statusCode, body: res.body };
    } };
  return app;
};
const express = () => makeExpress();
express.json = () => (q, r, next) => next();
self.onmessage = async (e) => {
  const { code, tests, files } = e.data;
  const out = [], fails = [], fs = { ...(files || {}) };
  const log = (...a) => out.push(show(a));
  const consoleMock = { log, error: log, warn: log, info: log };
  const mods = {
    express,
    fs: { readFileSync: (n) => { if (!(n in fs)) throw new Error("ENOENT: 找不到檔案 " + n); return fs[n]; }, writeFileSync: (n, d) => { fs[n] = String(d); }, existsSync: (n) => n in fs },
    path: { join: (...a) => a.join('/').replace(/\\/+/g, '/'), basename: (p) => p.split('/').pop(), extname: (p) => (p.includes('.') ? '.' + p.split('.').pop() : '') },
    events: class EventEmitter { constructor() { this.h = {}; } on(n, f) { (this.h[n] ||= []).push(f); return this; } emit(n, ...a) { (this.h[n] || []).forEach((f) => f(...a)); return !!this.h[n]; } },
  };
  mods.events.EventEmitter = mods.events;
  const require = (n) => { const m = mods[String(n).replace(/^node:/, '')]; if (!m) throw new Error("這裡沒有 " + n + " 模組可以用"); return m; };
  const check = (c, m) => { if (!c) fails.push(m); };
  const module = { exports: {} };
  let error = null;
  try {
    await new AsyncFunction('console', 'require', 'check', 'output', 'module', 'exports', code + '\\n;' + tests)(consoleMock, require, check, () => out.join('\\n'), module, module.exports);
  } catch (err) { error = (err && err.message) || String(err); }
  postMessage({ out: out.join('\\n'), fails, error });
};`;

const PY_WORKER = `
importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');
const ready = loadPyodide().then((py) => { postMessage({ ready: true }); return py; });
const PRE = "import sys, io, json\\n__buf = io.StringIO()\\nsys.stdout = __buf\\n__fails = []\\ndef check(c, m):\\n    if not c:\\n        __fails.append(m)\\ndef output():\\n    return __buf.getvalue()\\n";
self.onmessage = async (e) => {
  const py = await ready, { code, tests } = e.data;
  const g = py.toPy({});
  let error = null;
  try { await py.runPythonAsync(PRE + code + '\\n' + tests, { globals: g }); }
  catch (err) { const l = String(err.message || err).trim().split('\\n'); error = l[l.length - 1]; }
  let r = { out: '', fails: [] };
  try { r = JSON.parse(py.runPython("json.dumps({'out': __buf.getvalue(), 'fails': __fails})", { globals: g })); } catch (err) { /* 前處理就失敗 */ }
  g.destroy();
  postMessage({ ...r, error });
};`;

const workers = {};
const spawn = (kind) => {
  const w = new Worker(URL.createObjectURL(new Blob([kind === 'py' ? PY_WORKER : JS_WORKER], { type: 'text/javascript' })));
  const ready = new Promise((res) => { if (kind === 'py') w.onmessage = (e) => e.data.ready && res(); else res(); });
  return { w, ready };
};
const get = (kind) => (workers[kind] ||= spawn(kind));
const kill = (kind) => { workers[kind]?.w.terminate(); delete workers[kind]; };
export const warm = (kind) => get(kind);

// 回傳 { out, fails, error }；error 是程式本身出的錯（語法錯、拋出例外、逾時）
export async function runCode(kind, code, tests, files) {
  const { w, ready } = get(kind);
  const timeout = (ms, msg) => new Promise((res) => !globalThis.__noTimeout && setTimeout(() => res({ out: '', fails: [], error: msg, dead: true }), ms));
  const first = await Promise.race([ready.then(() => 0), timeout(120000, '載入失敗：Python 環境下載太久，請檢查網路後再試')]);
  if (first) { kill(kind); return first; }
  const run = new Promise((res) => { w.onmessage = (e) => !e.data.ready && res(e.data); w.onerror = (e) => res({ out: '', fails: [], error: e.message }); w.postMessage({ code, tests, files }); });
  const r = await Promise.race([run, timeout(10000, '程式跑太久沒結束（是不是有無限迴圈？）')]);
  if (r.dead) kill(kind);
  return r;
}
