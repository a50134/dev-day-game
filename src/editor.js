// 編輯器：CodeMirror 6（語法顏色、括號自動補全、輸入時跳出建議、Tab 接受/跳下一格）。
// 載入失敗（沒網路）就退回普通文字框，介面一樣：{ el, value, onInput }
const DEPS = '';
const esm = (p) => import(`https://esm.sh/${p}${DEPS}`);

// Tailwind 常用 class（輸入 className="..." 時建議）
export const TW = `bg-pink-500 bg-pink-600 bg-gray-200 bg-gray-300 border-gray-300 text-gray-500 text-gray-700 text-2xl rounded-lg rounded-md rounded-full w-14 w-32 w-48 w-72 w-1/2 justify-between justify-center items-center grid-cols-3 grid-cols-5 border-pink-500 hover:bg-pink-600 disabled:text-gray-500 md:w-1/2 mt-1 mb-2 py-1
p-1 p-2 p-3 p-4 p-6 px-3 px-4 py-2 m-0 mt-2 mt-4 mb-1 mb-3 mb-4 my-0.5 gap-2 gap-3 gap-4 grid grid-cols-[repeat(5,56px)] flex flex-col max-w-xs w-full h-10
text-xs text-sm text-base text-lg text-xl text-[28px] font-normal font-semibold font-bold text-white text-[#222] text-[#666] text-[#dc2626]
bg-white bg-[var(--primary)] bg-[#ccc] border border-[#ddd] border-0 rounded rounded-[var(--radius)] cursor-pointer cursor-not-allowed
hover:opacity-90 disabled:bg-[#ccc] disabled:cursor-not-allowed aria-[pressed=true]:bg-[var(--primary)] aria-[pressed=true]:text-white`.split(/\s+/);

function sources(cm) {
  const { snippetCompletion: snip } = cm.autocomplete;
  const jsxSnips = [
    snip('const [${items}, set${Items}] = useState(${[]});', { label: 'useState', detail: '狀態', type: 'function' }),
    snip("useEffect(() => {\n  fetch('/api/${events}').then((r) => r.json()).then(${setItems});\n}, []);", { label: 'useEffect', detail: '載入時 fetch 資料', type: 'function' }),
    snip("fetch('/api/${events}').then((r) => r.json()).then(${setItems});", { label: 'fetch', detail: '取 API 資料', type: 'function' }),
    snip('{${items}.map((${item}) => (\n  <div key={${item}.id}>\n    ${}\n  </div>\n))}', { label: 'map', detail: '列表渲染', type: 'keyword' }),
    snip('<div className="${}" data-testid="${}">\n  ${}\n</div>', { label: 'div', detail: '<div> + testid', type: 'type' }),
    snip('<button className="${}" data-testid="${}" onClick={() => ${}}>${文字}</button>', { label: 'button', detail: '<button> + testid', type: 'type' }),
    snip('<input data-testid="${}" placeholder="${}" value={${}} onChange={(e) => ${}(e.target.value)} />', { label: 'input', detail: 'controlled input', type: 'type' }),
    snip('<form data-testid="${checkout-form}" onSubmit={${submit}}>\n  ${}\n</form>', { label: 'form', detail: '<form>', type: 'type' }),
    snip('<p className="${}" data-testid="${}">${}</p>', { label: 'p', detail: '<p> + testid', type: 'type' }),
    snip('<h3>${}</h3>', { label: 'h3', type: 'type' }),
    snip('const ${submit} = (e) => {\n  e.preventDefault();\n  ${}\n};', { label: 'submit', detail: '表單送出處理', type: 'function' }),
    ...['className', 'data-testid', 'onClick', 'onChange', 'onSubmit', 'aria-pressed', 'disabled', 'key', 'preventDefault'].map((label) => ({ label, type: 'property' })),
  ];
  const jsSource = (ctx) => {
    const line = ctx.state.doc.lineAt(ctx.pos);
    const before = line.text.slice(0, ctx.pos - line.from);
    const inClass = /className=(?:"|\{?`)[^"`]*$/.test(before);
    const w = ctx.matchBefore(inClass ? /[^\s"`]*$/ : /[\w-]+$/);
    if (!w || (w.from === w.to && !ctx.explicit)) return null;
    return { from: w.from, options: inClass ? TW.map((label) => ({ label, type: 'constant' })) : jsxSnips, validFor: /^[^\s"`]*$/ };
  };
  const cssSnips = [
    snip('.${card} {\n  ${}\n}', { label: '.class', detail: '新樣式規則', type: 'keyword' }),
    { label: 'var(--primary)', detail: '主色', type: 'variable' },
    { label: 'var(--radius)', detail: '圓角', type: 'variable' },
  ];
  const cssSource = (ctx) => {
    const w = ctx.matchBefore(/[\w.(-]+$/);
    return w ? { from: w.from, options: cssSnips, validFor: /^[\w.(-]*$/ } : null;
  };
  const vueSnips = [
    snip('v-for="${item} in ${items}" :key="${item}.id"', { label: 'v-for', detail: '列表渲染', type: 'keyword' }),
    snip('v-if="${condition}"', { label: 'v-if', detail: '條件渲染', type: 'keyword' }),
    { label: 'v-else', type: 'keyword' },
    snip('v-model="${name}"', { label: 'v-model', detail: '雙向綁定', type: 'keyword' }),
    snip('@click="${count++}"', { label: '@click', detail: '點擊事件', type: 'keyword' }),
    snip(':${disabled}="${sold}"', { label: ':bind', detail: 'v-bind 縮寫', type: 'keyword' }),
    snip('const ${name} = ref(${0});', { label: 'ref', detail: '響應式資料', type: 'function' }),
    snip('const ${total} = computed(() => ${});', { label: 'computed', detail: '計算屬性', type: 'function' }),
    snip('watch(${source}, (${value}) => {\n  ${}\n});', { label: 'watch', detail: '監聽變化', type: 'function' }),
    snip("createApp({\n  setup() {\n    ${}\n    return { ${} };\n  },\n}).mount('#app');", { label: 'createApp', detail: '建立 Vue 應用', type: 'function' }),
  ];
  const htmlSource = (ctx) => { // class="..." 裡面建議 Tailwind class；其他地方建議 Vue 語法
    const line = ctx.state.doc.lineAt(ctx.pos);
    if (!/class="[^"]*$/.test(line.text.slice(0, ctx.pos - line.from))) {
      const v = ctx.matchBefore(/[\w@:-]+$/);
      return !v || (v.from === v.to && !ctx.explicit) ? null : { from: v.from, options: vueSnips, validFor: /^[\w@:-]*$/ };
    }
    const w = ctx.matchBefore(/[^\s"]*$/);
    if (!w || (w.from === w.to && !ctx.explicit)) return null;
    return { from: w.from, options: TW.map((label) => ({ label, type: 'constant' })), validFor: /^[^\s"]*$/ };
  };
  const tsSnips = [
    ...['string', 'number', 'boolean', 'void', 'unknown'].map((label) => ({ label, type: 'type', detail: '型別' })),
    snip('interface ${Name} {\n  ${field}: ${string};\n}', { label: 'interface', detail: '描述物件形狀', type: 'keyword' }),
    snip("type ${Name} = '${a}' | '${b}';", { label: 'type', detail: '聯集型別', type: 'keyword' }),
    snip('function ${name}(${arg}: ${string}): ${number} {\n  ${}\n}', { label: 'function', detail: '函式（含型別）', type: 'keyword' }),
    snip('const ${name}: ${string} = ${};', { label: 'const', detail: '常數（含型別）', type: 'keyword' }),
    snip("if (typeof ${v} === '${string}') {\n  ${}\n}", { label: 'typeof', detail: '型別收窄', type: 'keyword' }),
  ];
  const tsSource = (ctx) => {
    const w = ctx.matchBefore(/\w+$/);
    return !w || (w.from === w.to && !ctx.explicit) ? null : { from: w.from, options: tsSnips, validFor: /^\w*$/ };
  };
  return { jsSource, cssSource, htmlSource, tsSource };
}

let cmPromise;
const loadCM = () => (cmPromise ||= Promise.all([
  esm('codemirror@6.0.1'), esm('@codemirror/lang-javascript@6.2.3'), esm('@codemirror/lang-css@6.3.1'),
  esm('@codemirror/autocomplete@6.18.6'), esm('@codemirror/commands@6.8.1'), esm('@codemirror/theme-one-dark@6.1.2'),
  esm('@codemirror/view'), esm('@codemirror/lang-html@6.4.9'),
]).then(([c, js, css, autocomplete, commands, dark, view, html]) => ({ c, js, css, autocomplete, commands, dark, view, html })));

export async function createEditor(parent, { lang, onInput }) {
  const el = document.createElement('div');
  el.className = 'cmbox';
  parent.append(el);
  let cm;
  try { cm = await loadCM(); } catch (e) { console.warn('CodeMirror 載入失敗，改用文字框', e); }
  if (!cm) {
    const ta = document.createElement('textarea');
    ta.spellcheck = false;
    ta.oninput = onInput;
    el.append(ta);
    return { el, get value() { return ta.value; }, set value(v) { ta.value = v; } };
  }
  const { jsSource, cssSource, htmlSource, tsSource } = sources(cm);
  const tabKey = { key: 'Tab', run: (v) => cm.autocomplete.acceptCompletion(v) || cm.autocomplete.nextSnippetField(v) || cm.commands.indentMore(v), shift: cm.commands.indentLess };
  const langExt = lang === 'css'
    ? [cm.css.css(), cm.css.cssLanguage.data.of({ autocomplete: cssSource })]
    : lang === 'ts' ? [cm.js.javascript({ typescript: true }), cm.js.javascriptLanguage.data.of({ autocomplete: tsSource })]
    : lang === 'html' ? [cm.html.html(), cm.html.htmlLanguage.data.of({ autocomplete: htmlSource })]
    : [cm.js.javascript({ jsx: true }), cm.js.javascriptLanguage.data.of({ autocomplete: jsSource })];
  const view = new cm.c.EditorView({
    parent: el,
    extensions: [
      cm.view.keymap.of([tabKey]),
      cm.c.basicSetup, langExt, cm.dark.oneDark,
      cm.autocomplete.autocompletion({ defaultKeymap: true }),
      cm.c.EditorView.theme({ '&': { height: '100%' }, '.cm-scroller': { overflow: 'auto', fontSize: '13px' } }),
      cm.c.EditorView.updateListener.of((u) => u.docChanged && onInput()),
    ],
  });
  return {
    el, view, // view 給測試用
    get value() { return view.state.doc.toString(); },
    set value(v) { view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: v } }); },
  };
}
