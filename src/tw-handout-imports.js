// 講義用：把每個檔案的 import／export 自動解釋成白話（不是手寫的，所以不會和程式碼不一致）。
// 這支沒有用到瀏覽器功能，可以直接用 node 測試（見 CLAUDE.md）。

// 解析一行 import（只處理本專案會出現的寫法；多行 import 會先被 joinImports 合成一行）
//   import X from 'a'　import { a, b } from 'a'　import X, { a } from 'a'　import type { T } from 'a'
//   import { a, type T } from 'a'　import './index.css'　import * as C from 'a'
export function parseImportLine(line) {
  const side = line.match(/^import\s+['"]([^'"]+)['"]\s*;?$/);
  if (side) return { spec: side[1], sideEffect: true, def: null, named: [], typeOnly: false };
  const m = line.match(/^import\s+(type\s+)?(.+?)\s+from\s+['"]([^'"]+)['"]\s*;?$/);
  if (!m) return null;
  const typeOnly = !!m[1];
  let rest = m[2].trim(), def = null, named = [], ns = null;
  const brace = rest.match(/\{([^}]*)\}/);
  if (brace) {
    named = brace[1].split(',').map((s) => s.trim()).filter(Boolean).map((s) => {
      const isType = /^type\s+/.test(s);
      const body = s.replace(/^type\s+/, '');
      const [name, alias] = body.split(/\s+as\s+/);
      return { name, alias: alias || null, type: typeOnly || isType };
    });
    rest = rest.replace(brace[0], '').replace(/,\s*$/, '').trim();
  }
  const star = rest.match(/^\*\s+as\s+(\w+)/);
  if (star) ns = star[1]; else if (rest) def = rest.replace(/,$/, '').trim() || null;
  return { spec: m[3], sideEffect: false, def, named, ns, typeOnly };
}

// 把跨多行的 import（大括號裡換行）合成一行；回傳 [{ line: 行號(從 1 開始), text: 合併後的一行, span: 佔幾行 }]
export function importsOf(code) {
  const lines = code.split('\n'), out = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/^import\s/.test(lines[i])) continue;
    let text = lines[i], span = 1;
    while (!/from\s+['"][^'"]+['"]\s*;?$/.test(text) && !/^import\s+['"]/.test(text) && i + span < lines.length) text += ' ' + lines[i + span++].trim();
    const p = parseImportLine(text.replace(/\s+/g, ' '));
    if (p) out.push({ line: i + 1, span, ...p });
    i += span - 1;
  }
  return out;
}

// 這個檔案「對外開放」了什麼
export function exportsOf(code) {
  const res = { default: null, named: [] };
  for (const l of code.split('\n')) {
    let m;
    if ((m = l.match(/^export default\s+(?:async\s+)?(?:function\s+|class\s+)?(\w+)?/))) res.default = m[1] || '(匿名)';
    else if ((m = l.match(/^export\s+(?:async\s+)?(?:function|const|let|class)\s+(\w+)/))) res.named.push({ name: m[1], type: false });
    else if ((m = l.match(/^export\s+(?:type|interface)\s+(\w+)/))) res.named.push({ name: m[1], type: true });
  }
  return res;
}

// 'src/components/Navbar.tsx' ＋ '../hooks/useCart' → 'src/hooks/useCart.tsx 或 .ts'（用 files 裡真的有的那個）
export function resolveSpec(fromFile, spec, files) {
  if (!spec.startsWith('.')) return { pkg: spec };
  const parts = fromFile.split('/').slice(0, -1);
  for (const seg of spec.split('/')) {
    if (seg === '.' || seg === '') continue;
    if (seg === '..') parts.pop(); else parts.push(seg);
  }
  const base = parts.join('/');
  for (const ext of ['', '.tsx', '.ts', '.css', '.js']) if (files[base + ext] !== undefined) return { file: base + ext };
  return { missing: base };
}

const short = (f) => f.replace(/^src\//, '');
// './x' → 同資料夾；'../x' → 往上一層…
export function pathHint(spec) {
  if (spec.startsWith('./')) return '<code>./</code> ＝ 同一個資料夾';
  const ups = (spec.match(/\.\.\//g) || []).length;
  return ups ? `<code>${'../'.repeat(ups)}</code> ＝ 往上 ${ups} 層資料夾，再往下找` : '';
}

// 一行 import 的白話解釋（HTML）
export function describeImport(imp, fromFile, files) {
  const r = resolveSpec(fromFile, imp.spec, files);
  const where = r.pkg ? `套件 <b>${imp.spec}</b>（路徑開頭<b>沒有點</b>，代表去 <code>node_modules</code> 找）`
    : r.file ? `<b>${short(r.file)}</b>（<code>${imp.spec}</code>：${pathHint(imp.spec)}）`
    : `<b>${imp.spec}</b>（${r.missing ? '這個檔案是範本原本就有的' : ''}）`;
  if (imp.sideEffect) return `把 ${where} 整個載進來執行，不拿任何東西（CSS 常這樣寫）。`;
  const target = r.file ? exportsOf(files[r.file]) : null;
  const bits = [];
  if (imp.def) {
    const ok = !target || target.default;
    bits.push(`拿它的<b>預設匯出</b> <code>${imp.def}</code>（<b>沒有大括號</b>，名字可以自己取）${ok ? '' : ' ⚠️ 對方沒有 export default'}`);
  }
  if (imp.ns) bits.push(`把全部匯出裝進 <code>${imp.ns}</code>`);
  if (imp.named.length) {
    const names = imp.named.map((n) => `<code>${n.name}</code>${n.type ? '（型別）' : ''}`).join('、');
    const bad = target ? imp.named.filter((n) => !target.named.some((t) => t.name === n.name)).map((n) => n.name) : [];
    bits.push(`拿<b>具名匯出</b> ${names}（<b>要加大括號</b>，名字要和對方 export 的<b>一模一樣</b>）${bad.length ? ' ⚠️ 對方沒有 ' + bad.join('、') : ''}`);
  }
  if (imp.typeOnly) bits.push('只當<b>型別</b>用，所以寫 <code>import type</code>（打包時會整行消失）');
  return `從 ${where} ${bits.join('；')}。`;
}

// 一行 export 的白話解釋
export function describeExport(line) {
  let m;
  if ((m = line.match(/^export default\s+(?:async\s+)?(?:function\s+|class\s+)?(\w+)/))) return `把 <code>${m[1]}</code> 設成這個檔案的<b>預設匯出</b>：別的檔案用 <code>import ${m[1]} from '…這個檔案…'</code> 拿（不加大括號）。一個檔案只能有一個。`;
  if ((m = line.match(/^export\s+(?:async\s+)?(?:function|const|let|class)\s+(\w+)/))) return `<b>具名匯出</b> <code>${m[1]}</code>：別的檔案要寫 <code>import { ${m[1]} } from '…這個檔案…'</code>（加大括號、名字一樣）。一個檔案可以有很多個。`;
  if ((m = line.match(/^export\s+(?:type|interface)\s+(\w+)/))) return `把型別 <code>${m[1]}</code> 開放出去：別的檔案用 <code>import type { ${m[1]} } from '…'</code> 拿。`;
  return null;
}

// 引用關係：每個檔案 import 了誰（只算專案裡的檔案）、被誰 import
export function buildGraph(files) {
  const uses = {}, usedBy = {};
  for (const f of Object.keys(files)) { uses[f] = []; usedBy[f] = usedBy[f] || []; }
  for (const [f, code] of Object.entries(files)) {
    if (!/\.(tsx?|mjs|js)$/.test(f)) continue;
    for (const imp of importsOf(code)) {
      const r = resolveSpec(f, imp.spec, files);
      if (r.file && r.file !== f) { uses[f].push(r.file); (usedBy[r.file] = usedBy[r.file] || []).push(f); }
    }
  }
  return { uses, usedBy };
}
