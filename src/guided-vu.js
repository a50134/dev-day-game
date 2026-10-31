// 手把手專案：待辦清單（Vue，從空白做到完成）——8 個小單元，每單元 3 步講解 + 1 個總練習
const pre = (code) => `<pre>${code.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>`;
const choice = (q, options, answer, why) => ({ type: 'choice', q, options, answer, why });
const vue = (o) => ({ kind: 'vue', ...o });
const txt = (el) => (el?.textContent || '').replace(/,/g, '').trim();
const BT = (s) => s.replace(/@@/g, '`');

/* ---------- 各階段的程式碼（解答 = 下一階段的起點） ---------- */
const page = (body, script, style = '') => `<div id="app">\n${body}\n</div>\n${style}<script>\n${script}\n</script>\n`;
const sc = (imp, inner, ret, comp = '') => `const { createApp${imp} } = Vue;\nconst app = createApp({\n  setup() {\n${inner}\n    return { ${ret} };\n  },\n});\n${comp}app.mount('#app');`;

const STYLE = '<style>\n  .done { text-decoration: line-through; color: #999; }\n</style>\n';
const TITLE_STATIC = '  <h1 data-testid="title">待辦清單</h1>';
const TITLE = '  <h1 data-testid="title">{{ title }}</h1>\n  <p data-testid="tip">{{ tip }}</p>';
const LIST3 = '  <ul>\n    <li v-for="t in todos" :key="t.id" data-testid="todo">{{ t.text }}</li>\n  </ul>';
const ADDUI = '  <input data-testid="new-input" v-model="newText" placeholder="要做什麼？">\n  <button data-testid="add" @click="add">新增</button>';
const EMPTY = '  <p v-if="todos.length === 0" data-testid="empty">還沒有待辦，先加一個吧！</p>';
const LIST6 = '  <ul>\n    <li v-for="t in todos" :key="t.id" data-testid="todo" :class="{ done: t.done }">\n      <span data-testid="label" @click="t.done = !t.done">{{ t.text }}</span>\n    </li>\n  </ul>';
const REMAIN = '  <p data-testid="remaining">還剩 {{ remaining }} 件沒做</p>';
const LIST8 = '  <ul>\n    <todo-item v-for="t in todos" :key="t.id" :todo="t" @toggle="t.done = !t.done" @remove="remove(t.id)"></todo-item>\n  </ul>';

const T_TITLE = "    const title = ref('待辦清單');\n    const tip = ref('今天的事，一件一件做');";
const T_TODOS3 = "    const todos = ref([\n      { id: 1, text: '買牛奶', done: false },\n      { id: 2, text: '寫作業', done: false },\n      { id: 3, text: '運動一下', done: false },\n    ]);";
const T_TODOS0 = '    const todos = ref([]);';
const T_ADD = (n) => `    const newText = ref('');\n    let nextId = ${n};\n    function add() {\n      const text = newText.value.trim();\n      if (!text) return;\n      todos.value.push({ id: nextId++, text, done: false });\n      newText.value = '';\n    }`;
const T_REMAIN = '    const remaining = computed(() => todos.value.filter((t) => !t.done).length);';
const T_REMOVE = '    function remove(id) {\n      todos.value = todos.value.filter((t) => t.id !== id);\n    }';
const COMP = BT(`app.component('todo-item', {
  props: ['todo'],
  emits: ['toggle', 'remove'],
  template: @@
    <li data-testid="todo" :class="{ done: todo.done }">
      <span data-testid="label" @click="$emit('toggle')">{{ todo.text }}</span>
      <button data-testid="remove" @click="$emit('remove')">刪除</button>
    </li>@@,
});
`);

// 解答 1～8
const S1 = page(TITLE_STATIC, "const { createApp } = Vue;\nconst app = createApp({});\napp.mount('#app');");
const S2 = page(TITLE, sc(', ref', T_TITLE, 'title, tip'));
const S3 = page(`${TITLE}\n${LIST3}`, sc(', ref', `${T_TITLE}\n${T_TODOS3}`, 'title, tip, todos'));
const S4 = page(`${TITLE}\n${ADDUI}\n${LIST3}`, sc(', ref', `${T_TITLE}\n${T_TODOS3}\n${T_ADD(4)}`, 'title, tip, todos, newText, add'));
const S5 = page(`${TITLE}\n${ADDUI}\n${EMPTY}\n${LIST3}`, sc(', ref', `${T_TITLE}\n${T_TODOS0}\n${T_ADD(1)}`, 'title, tip, todos, newText, add'));
const S6 = page(`${TITLE}\n${ADDUI}\n${EMPTY}\n${LIST6}`, sc(', ref', `${T_TITLE}\n${T_TODOS0}\n${T_ADD(1)}`, 'title, tip, todos, newText, add'), STYLE);
const S7 = page(`${TITLE}\n${ADDUI}\n${EMPTY}\n${LIST6}\n${REMAIN}`, sc(', ref, computed', `${T_TITLE}\n${T_TODOS0}\n${T_ADD(1)}\n${T_REMAIN}`, 'title, tip, todos, newText, add, remaining'), STYLE);
const S8 = page(`${TITLE}\n${ADDUI}\n${EMPTY}\n${LIST8}\n${REMAIN}`, sc(', ref, computed', `${T_TITLE}\n${T_TODOS0}\n${T_ADD(1)}\n${T_REMAIN}\n${T_REMOVE}`, 'title, tip, todos, newText, add, remaining, remove', COMP), STYLE);

// 起始程式 = 上一步的解答 + TODO
const E1 = page('  <!-- TODO 1: 寫一個 <h1 data-testid="title">，裡面寫「待辦清單」 -->',
  "// TODO 2: const { createApp } = Vue;\n// TODO 3: const app = createApp({});\n// TODO 4: app.mount('#app');");
const E2 = page(`${TITLE_STATIC}\n  <!-- TODO 3: 在 h1 下面加 <p data-testid="tip">{{ tip }}</p>，並把 h1 的字改成 {{ title }} -->`,
  "// TODO 1: 第一行改成 const { createApp, ref } = Vue;\n// TODO 2: 做一個 setup()，裡面建立 title 和 tip 兩個 ref，最後 return 出去\nconst { createApp } = Vue;\nconst app = createApp({});\napp.mount('#app');");
const E3 = page(`${TITLE}\n  <!-- TODO 2: 用 <ul> 和 <li v-for="t in todos" :key="t.id" data-testid="todo">{{ t.text }}</li> 畫出清單 -->`,
  sc(', ref', `${T_TITLE}\n    // TODO 1: 建立 todos，是三筆資料的陣列（買牛奶、寫作業、運動一下，格式 { id: 1, text: '買牛奶', done: false }）\n    // 記得在下面的 return 裡加上 todos`, 'title, tip'));
const E4 = page(`${TITLE}\n  <!-- TODO 4: 在清單上面加輸入框 <input data-testid="new-input" v-model="newText"> 和按鈕 <button data-testid="add" @click="add">新增</button> -->\n${LIST3}`,
  sc(', ref', `${T_TITLE}\n${T_TODOS3}\n    // TODO 1: const newText = ref('');   let nextId = 4;\n    // TODO 2: 寫 function add()：trim 之後如果是空的就 return；否則 todos.value.push({ id: nextId++, text, done: false })，再把 newText.value 清成 ''\n    // TODO 3: 把 newText、add 加進下面的 return`, 'title, tip, todos'));
const E5 = page(`${TITLE}\n${ADDUI}\n  <!-- TODO 2: 在這裡加 <p v-if="todos.length === 0" data-testid="empty">還沒有待辦，先加一個吧！</p> -->\n${LIST3}`,
  sc(', ref', `${T_TITLE}\n    // TODO 1: 把下面 todos 改成空陣列 ref([])，nextId 也改成 1\n${T_TODOS3}\n${T_ADD(4)}`, 'title, tip, todos, newText, add'));
const E6 = page(`${TITLE}\n${ADDUI}\n${EMPTY}\n  <ul>\n    <!-- TODO: li 加上 :class="{ done: t.done }"；裡面用 <span data-testid="label" @click="t.done = !t.done">{{ t.text }}</span> 包住文字 -->\n    <li v-for="t in todos" :key="t.id" data-testid="todo">{{ t.text }}</li>\n  </ul>`,
  sc(', ref', `${T_TITLE}\n${T_TODOS0}\n${T_ADD(1)}`, 'title, tip, todos, newText, add'), STYLE);
const E7 = page(`${TITLE}\n${ADDUI}\n${EMPTY}\n${LIST6}\n  <!-- TODO 2: 加 <p data-testid="remaining">還剩 {{ remaining }} 件沒做</p> -->`,
  sc(', ref', `${T_TITLE}\n${T_TODOS0}\n${T_ADD(1)}\n    // TODO 1: const remaining = computed(() => todos.value.filter((t) => !t.done).length);\n    // 記得：第一行 import 要加 computed，下面 return 要加 remaining`, 'title, tip, todos, newText, add'), STYLE);
const E8 = page(`${TITLE}\n${ADDUI}\n${EMPTY}\n  <ul>\n    <!-- TODO 3: 把下面的 li 整段換成 <todo-item v-for="t in todos" :key="t.id" :todo="t" @toggle="t.done = !t.done" @remove="remove(t.id)"></todo-item> -->\n    <li v-for="t in todos" :key="t.id" data-testid="todo" :class="{ done: t.done }">\n      <span data-testid="label" @click="t.done = !t.done">{{ t.text }}</span>\n    </li>\n  </ul>\n${REMAIN}`,
  sc(', ref, computed', `${T_TITLE}\n${T_TODOS0}\n${T_ADD(1)}\n${T_REMAIN}\n    // TODO 1: 寫 function remove(id)：todos.value = todos.value.filter((t) => t.id !== id);  並加進下面的 return`, 'title, tip, todos, newText, add, remaining',
    "// TODO 2: 在 app.mount 前面，用 app.component('todo-item', { props: ['todo'], emits: ['toggle', 'remove'], template: ... }) 做一個元件\n//         template 裡放 li（有 :class）、一個 span（點了 $emit('toggle')）、一個刪除按鈕（點了 $emit('remove')）\n"), STYLE);

/* ---------- 進度地圖與包裝 ---------- */
const STAGES = ['空白起步：標題與掛載', '資料登場：ref 與雙大括號', '把清單畫出來：v-for', '新增待辦：v-model 與按鈕', '空清單的提示：v-if', '點一下完成：:class', '還剩幾件：computed', '刪除與元件：props 與 emit'];
const progressMap = (n) => `<p><b>📍 專案進度：待辦清單</b>（我們從一個空白頁面，一步一步做到完整作品）</p><ol>${STAGES.map((t, i) => `<li>${i + 1 < n ? '✅' : i + 1 === n ? '👉 <b>' : '⬜'} ${t}${i + 1 === n ? '</b>' : ''}</li>`).join('')}</ol>`;
const gstep = (say, check) => ({ say, check });
const GW = (n, title, steps, fin) => ({ id: 'vg' + n, title: `手把手 ${n}／8　${title}`, steps: steps.map((s, i) => (i === 0 ? { ...s, say: progressMap(n) + s.say } : s)), final: vue(fin) });

/* ---------- 共用測試小工具 ---------- */
const addItem = async (c, v) => { await c.type(c.t('new-input'), v); await c.click(c.t('add')); };
const needUI = (c) => (c.t('new-input') && c.t('add') ? [] : ['缺少輸入框 new-input 或按鈕 add（不要刪掉）']);
const noRaw = (c) => (c.doc.getElementById('app')?.textContent.includes('{{') ? ['畫面上出現了 {{ }}，代表 Vue 沒有成功掛載或變數沒有 return'] : []);

/* ---------- 8 個單元 ---------- */
export const VG_UNITS = [
  GW(1, '空白起步：標題與掛載', [
    gstep(`<p><b>我們要做什麼？</b>一個「待辦清單」小網站：可以新增事情、點一下打勾完成、顯示還剩幾件、還能刪掉。</p><p>做法就像蓋房子：先打地基，再一層一層往上蓋。這一步只做<b>最小的地基</b>：一個標題，加上讓 Vue 接手這個頁面。</p><p>以後你每做完一步，網站都是「能用」的，不會中途壞掉。</p>`,
      choice('做大專案時，比較好的做法是？', ['先做最小的能用版本，再一步一步加功能', '一次把所有功能寫完再測', '先想好所有細節，一行都不寫'], 0, '小步前進，每步都能看到結果，不容易迷路。')),
    gstep(`<p>Vue 的網頁有兩個部分：</p>${pre(`<div id="app">            <!-- ① 模板：Vue 要接手的那塊畫面 -->
  <h1 data-testid="title">待辦清單</h1>
</div>
<script>
const { createApp } = Vue;    // ② 從 Vue 拿出 createApp 這個工具
const app = createApp({});    // ③ 做出一個 Vue 應用（現在先放空的）
app.mount('#app');            // ④ 掛載：告訴 Vue「請接手 id 是 app 的那塊」
</script>`)}<p>「掛載」就是<b>把 Vue 插到那個 div 上</b>。<code>#app</code> 的 # 代表「id 是 app 的元素」。沒有掛載，Vue 就不知道要管哪一塊。</p>`,
      choice('<code>app.mount(\'#app\')</code> 是在做什麼？', ['讓 Vue 接手 id 是 app 的那塊畫面', '把網頁存成檔案', '刪除 app'], 0, 'mount = 掛載，把 Vue 接到畫面上。')),
    gstep(`<p><b>常見的錯：</b>① <code>#app</code> 打成 <code>app</code>（少了 #），Vue 就找不到那塊畫面。② <code>mount</code> 寫在 <code>&lt;div id="app"&gt;</code> 的前面。這裡 script 放在 div 的後面，所以沒問題。</p><p><b>下一步預告：</b>第 2 步，我們不再把標題寫死，而是把它存進一個「變數」，用 <code>{{ }}</code> 顯示出來。</p>`,
      choice('為什麼 script 要放在 <code>&lt;div id="app"&gt;</code> 的後面？', ['要先有那塊畫面，Vue 才能掛上去', '因為 script 比較重', '放哪裡都完全不重要'], 0, '先有畫面，才有東西可以掛。')),
  ], {
    brief: '第 1 步：做出最小的地基。在 <code>#app</code> 裡寫一個 <code>&lt;h1 data-testid="title"&gt;</code>，文字是「待辦清單」；然後用 <code>createApp</code> 建立應用並掛載到 <code>#app</code>。',
    hint: '四個 TODO 照順序換成真的程式。記得 <code>data-testid</code> 不能拼錯。',
    steps: [`TODO 1：<pre>&lt;h1 data-testid="title"&gt;待辦清單&lt;/h1&gt;</pre>為什麼：這是頁面的標題，檢查程式會用 data-testid 找到它。`, `TODO 2：<pre>const { createApp } = Vue;</pre>為什麼：先從 Vue 拿出建立應用的工具。`, `TODO 3 和 4：<pre>const app = createApp({});\napp.mount('#app');</pre>為什麼：先做出應用，再把它掛到 #app 上，Vue 才開始接手。最常犯的錯：<code>'#app'</code> 少了 # 或忘了寫 mount，Vue 沒有接手畫面。`],
    starter: E1, solution: S1,
    must: [{ re: /createApp\(/, msg: '請用 createApp 建立應用' }, { re: /\.mount\(\s*['"]#app['"]\s*\)/, msg: '請用 app.mount(\'#app\') 掛載' }],
    test: (c) => {
      const f = [];
      if (!c.t('title')) return ['缺少標題 <h1 data-testid="title">'];
      if (txt(c.t('title')) !== '待辦清單') f.push(`標題要顯示「待辦清單」，目前是「${txt(c.t('title'))}」`);
      if (!c.doc.getElementById('app')?.__vue_app__) f.push('Vue 還沒有掛載到 #app（要寫 app.mount(\'#app\')）');
      return f;
    },
  }),
  GW(2, '資料登場：ref 與雙大括號', [
    gstep(`<p>現在標題是「寫死」在畫面裡的。如果之後想改標題，就得去改 HTML。更聰明的做法：把文字放進一個<b>變數</b>，畫面只負責「顯示這個變數」。</p><p>這就是 Vue 的核心想法：<b>資料變了，畫面自動跟著變</b>。你只管改資料，不用自己去動畫面。</p>`,
      choice('Vue 的核心想法是？', ['資料變了，畫面自動跟著變', '要自己一個一個去改畫面', '畫面和資料完全沒關係'], 0, '這是 Vue 最大的好處。')),
    gstep(`<p>三個部分一起用：</p>${pre(`const { createApp, ref } = Vue;     // ① 多拿一個 ref 工具

const app = createApp({
  setup() {                          // ② setup：放資料的地方
    const title = ref('待辦清單');    // ③ ref：做一個「會被 Vue 盯著」的變數
    return { title };                // ④ return：交給模板用
  },
});

<h1>{{ title }}</h1>                 <!-- ⑤ 雙大括號：把變數顯示出來 -->`)}<p><code>ref('待辦清單')</code> 像是「一個盒子，裡面裝著文字」。Vue 會盯著盒子，裡面的東西一變，畫面就更新。</p>`,
      choice('在模板裡顯示變數 <code>title</code>，要寫？', ['{{ title }}', '{title}', '<title>'], 0, 'Vue 的模板用雙大括號。')),
    gstep(`<p><b>常見的錯：</b>① 變數建好了但<b>忘了 return</b>，模板看不到，畫面是空的或出現 <code>{{ title }}</code> 這幾個字。② 在模板裡寫 <code>{{ title.value }}</code>（模板裡<b>不用</b> .value；在 setup 的 JavaScript 裡才要 .value）。</p><p><b>下一步預告：</b>第 3 步，我們放進一整個待辦陣列，用 <code>v-for</code> 把它們一筆一筆畫出來。</p>`,
      choice('畫面上看到字面的 <code>{{ title }}</code>，而不是標題，最可能是？', ['忘了 return title，或根本沒掛載', 'title 太長', '字體不對'], 0, '模板只看得到 return 出來的東西。')),
  ], {
    brief: '第 2 步：把標題改成資料。在 <code>setup()</code> 裡建立 <code>title</code>（「待辦清單」）和 <code>tip</code>（「今天的事，一件一件做」），return 出去；模板用 <code>{{ title }}</code> 和 <code>{{ tip }}</code> 顯示（tip 放在 <code>data-testid="tip"</code> 的 p）。',
    hint: '三件事：import ref、寫 setup 並 return、模板換成 {{ }}。',
    steps: [`TODO 1：第一行<pre>const { createApp, ref } = Vue;</pre>為什麼：ref 是 Vue 的工具，不拿出來就不能用。`, `TODO 2：把 <code>createApp({})</code> 改成<pre>const app = createApp({
  setup() {
    const title = ref('待辦清單');
    const tip = ref('今天的事，一件一件做');
    return { title, tip };
  },
});</pre>為什麼：資料放在 setup，return 之後模板才拿得到。`, `TODO 3：模板換成<pre>&lt;h1 data-testid="title"&gt;{{ title }}&lt;/h1&gt;
&lt;p data-testid="tip"&gt;{{ tip }}&lt;/p&gt;</pre>為什麼：雙大括號把變數的內容顯示出來。最常犯的錯：忘了在 return 裡加 tip，畫面上那一行就是空的。`],
    starter: E2, solution: S2,
    must: [{ re: /\{\{\s*title\s*\}\}/, msg: '請用 {{ title }} 顯示標題' }, { re: /\{\{\s*tip\s*\}\}/, msg: '請用 {{ tip }} 顯示提示' }, { re: /ref\(/, msg: '請用 ref() 建立資料' }],
    test: (c) => {
      const f = noRaw(c);
      if (txt(c.t('title')) !== '待辦清單') f.push(`標題要顯示「待辦清單」，目前是「${txt(c.t('title'))}」`);
      if (!txt(c.t('tip')).includes('一件一件做')) f.push(`tip 要顯示「今天的事，一件一件做」，目前是「${txt(c.t('tip'))}」（記得 return tip）`);
      return f;
    },
  }),
  GW(3, '把清單畫出來：v-for', [
    gstep(`<p>待辦清單的重點是「一排事情」。如果有 3 件事，難道要自己寫 3 個 <code>&lt;li&gt;</code> 嗎？之後使用者還會新增，數量不固定！</p><p>答案是：用<b>陣列</b>存資料，再叫 Vue 「陣列裡每一筆，都幫我畫一個 li」。這個指令叫 <code>v-for</code>。</p>`,
      choice('清單的數量會變動，最適合用什麼存資料？', ['陣列', '單一個數字', '一個很長的字串'], 0, '陣列可以放很多筆，也可以隨時增加。')),
    gstep(`<p>先看資料，一筆待辦是一個物件：</p>${pre(`const todos = ref([
  { id: 1, text: '買牛奶', done: false },   // id：編號、text：內容、done：做完了沒
  { id: 2, text: '寫作業', done: false },
]);`)}<p>再看畫面：</p>${pre(`<ul>
  <li v-for="t in todos" :key="t.id">{{ t.text }}</li>
</ul>`)}<ul><li><code>v-for="t in todos"</code>：陣列裡每一筆（叫它 t），各畫一個 li。</li><li><code>:key="t.id"</code>：給每個 li 一個獨一無二的身分證。冒號代表「後面是變數」。</li><li><code>{{ t.text }}</code>：顯示這一筆的內容。</li></ul>`,
      choice('<code>v-for="t in todos"</code> 的意思是？', ['todos 裡每一筆（叫 t）各畫一個', '把 todos 刪掉', '把 todos 排序'], 0, 'for … in … = 每一個。')),
    gstep(`<p><b>為什麼要 key？</b>如果之後刪掉中間一筆，Vue 靠 key 才知道「哪一個 li 對應哪一筆資料」，不會畫錯。key 要用<b>不會重複</b>的 id，不要用 index（第幾個），因為刪掉一筆後 index 會全部移位。</p><p><b>常見的錯：</b>忘了 return todos；或者把 <code>:key</code> 的冒號漏掉（變成普通文字 "t.id"，每個 key 都一樣）。</p><p><b>下一步預告：</b>第 4 步，加一個輸入框和按鈕，讓使用者自己新增。</p>`,
      choice('<code>:key</code> 最好用什麼？', ['每筆資料獨一無二的 id', '第幾個（index）', '隨便寫一個固定的字'], 0, 'id 不會因為刪除或排序而改變。')),
  ], {
    brief: '第 3 步：建立 <code>todos</code> 陣列（買牛奶、寫作業、運動一下，每筆有 id、text、done），並用 <code>v-for</code> 畫成 <code>&lt;li data-testid="todo"&gt;</code>。',
    hint: '先在 setup 建資料並 return，再把註解換成 ul / li。',
    steps: [`TODO 1：在 setup 裡<pre>const todos = ref([
  { id: 1, text: '買牛奶', done: false },
  { id: 2, text: '寫作業', done: false },
  { id: 3, text: '運動一下', done: false },
]);</pre>並把 <code>todos</code> 加進 return。為什麼：先有資料，畫面才畫得出來。`, `TODO 2：模板<pre>&lt;ul&gt;
  &lt;li v-for="t in todos" :key="t.id" data-testid="todo"&gt;{{ t.text }}&lt;/li&gt;
&lt;/ul&gt;</pre>為什麼：v-for 會替每一筆資料畫一個 li，key 讓 Vue 分得清誰是誰。`, `按「檢查」。最常犯的錯：忘了把 todos 加進 return，清單就是空的。`],
    starter: E3, solution: S3,
    must: [{ re: /v-for=/, msg: '請用 v-for 畫清單' }, { re: /:key=/, msg: 'v-for 要加 :key' }],
    test: (c) => {
      const f = noRaw(c), items = c.ta('todo');
      if (items.length !== 3) return [...f, `應該畫出 3 個 li（data-testid="todo"），目前 ${items.length} 個`];
      ['買牛奶', '寫作業', '運動一下'].forEach((s, i) => { if (!txt(items[i]).includes(s)) f.push(`第 ${i + 1} 項應顯示「${s}」，目前是「${txt(items[i])}」`); });
      return f;
    },
  }),
  GW(4, '新增待辦：v-model 與按鈕', [
    gstep(`<p>現在清單只能看，不能加。這一步讓使用者<b>自己輸入、按「新增」就多一筆</b>。</p><p>要做三件事：① 一個輸入框，② 一個按鈕，③ 按下去時執行「新增」的函式。</p>`,
      choice('這一步要讓使用者能做什麼？', ['輸入文字並新增一筆待辦', '刪除待辦', '改標題'], 0, '新增功能。')),
    gstep(`<p>輸入框要和一個變數連在一起，用 <code>v-model</code>（雙向綁定）：</p>${pre(`<input v-model="newText">
<button @click="add">新增</button>`)}<ul><li><code>v-model="newText"</code>：你打字，<code>newText</code> 就跟著變；newText 變了，輸入框也跟著變。</li><li><code>@click="add"</code>：按鈕被按時，執行 add 函式。<b>後面不要加括號</b>。</li></ul>${pre(`const newText = ref('');
let nextId = 4;                       // 下一筆的編號，接在 3 後面
function add() {
  const text = newText.value.trim();  // 在 setup 裡讀 ref，要加 .value；trim 去掉頭尾空白
  if (!text) return;                  // 空的就不新增
  todos.value.push({ id: nextId++, text, done: false });  // 加進陣列最後面
  newText.value = '';                 // 新增完，把輸入框清空
}`)}`,
      choice('<code>v-model</code> 讓輸入框和變數怎麼樣？', ['雙向連動：打字會改變數，變數變了輸入框也變', '只能看不能改', '把變數刪掉'], 0, '雙向綁定。')),
    gstep(`<p><b>為什麼要 <code>trim()</code> 和 <code>if (!text) return</code>？</b>使用者可能不小心按到按鈕，或只打了空白。沒有擋住，清單就會多出一筆「空的待辦」。</p><p><b>常見的錯：</b>① 在 setup 裡寫 <code>newText = ''</code>（少了 .value），畫面不會變。② <code>todos.push(...)</code> 也要寫成 <code>todos.value.push(...)</code>。③ 函式忘了 return 出去，按鈕找不到 add。</p><p><b>下一步預告：</b>第 5 步，清單是空的時候，顯示一句友善的提示。</p>`,
      choice('在 setup 裡要改 ref 的內容，要寫？', ['newText.value = \'\'', 'newText = \'\'', 'newText()'], 0, 'ref 的內容藏在 .value 裡。')),
  ], {
    brief: '第 4 步：加輸入框 <code>new-input</code>（<code>v-model</code>）和按鈕 <code>add</code>（<code>@click</code>）。按「新增」會把輸入的字加到清單最後，並清空輸入框；只輸入空白不能新增。',
    hint: '先在 setup 寫 newText、nextId、add，再回到模板加輸入框和按鈕。',
    steps: [`TODO 1 和 2：在 setup 裡<pre>const newText = ref('');
let nextId = 4;
function add() {
  const text = newText.value.trim();
  if (!text) return;
  todos.value.push({ id: nextId++, text, done: false });
  newText.value = '';
}</pre>為什麼：add 負責把輸入的字變成一筆新資料，並把輸入框清空。`, `TODO 3：return 裡加上 <code>newText, add</code>。為什麼：模板只拿得到 return 出去的東西。`, `TODO 4：模板加<pre>&lt;input data-testid="new-input" v-model="newText" placeholder="要做什麼？"&gt;
&lt;button data-testid="add" @click="add"&gt;新增&lt;/button&gt;</pre>為什麼：v-model 連輸入框，@click 連 add 函式。最常犯的錯：<code>@click="add()"</code> 或 <code>newText = ''</code> 少了 .value。`],
    starter: E4, solution: S4,
    must: [{ re: /v-model=/, msg: '請用 v-model 綁定輸入框' }, { re: /@click=|v-on:click=/, msg: '請用 @click 綁定按鈕' }],
    test: async (c) => {
      const f = needUI(c); if (f.length) return f;
      if (c.ta('todo').length !== 3) f.push(`一開始應有 3 件，目前 ${c.ta('todo').length} 件`);
      await addItem(c, '買菜');
      const items = c.ta('todo');
      if (items.length !== 4) f.push(`新增「買菜」後應有 4 件，目前 ${items.length} 件`);
      else if (!txt(items[3]).includes('買菜')) f.push(`新的一筆要放在最後面，且顯示「買菜」，目前是「${txt(items[3])}」`);
      if (c.t('new-input').value !== '') f.push('新增完要把輸入框清空');
      const n = c.ta('todo').length;
      await addItem(c, '   ');
      if (c.ta('todo').length !== n) f.push('只輸入空白時，不應該新增');
      return f;
    },
  }),
  GW(5, '空清單的提示：v-if', [
    gstep(`<p>想像你第一次打開這個網站：清單是空的，畫面只有一塊空白，你會不知道這是壞了還是本來就這樣。</p><p>所以清單是空的時候，要顯示一句友善的提示：「還沒有待辦，先加一個吧！」有東西時，這句話就要消失。這叫<b>條件顯示</b>。</p><p>另外，既然使用者可以自己新增，我們也把一開始的 3 筆範例資料拿掉，讓清單從空的開始。</p>`,
      choice('為什麼要在空清單顯示提示？', ['讓使用者知道這不是壞掉，而是還沒有資料', '因為程式規定', '讓畫面看起來比較擠'], 0, '好的介面會告訴使用者現在是什麼狀況。')),
    gstep(`<p>用 <code>v-if</code>：</p>${pre(`<p v-if="todos.length === 0">還沒有待辦，先加一個吧！</p>`)}<ul><li><code>v-if="條件"</code>：條件成立才顯示這個元素，不成立就<b>整個不產生</b>。</li><li><code>todos.length</code>：陣列裡有幾筆。<code>=== 0</code> 代表「剛好是 0 筆」，也就是空的。</li><li>注意：<b>模板裡讀 todos 不用 .value</b>，直接寫 todos.length。</li></ul>`,
      choice('<code>v-if</code> 的條件不成立時，元素會？', ['不會出現在畫面上', '變成透明但還在', '變成紅色'], 0, 'v-if 為假，整個元素不產生。')),
    gstep(`<p><b>常見的錯：</b>① 條件寫成 <code>todos.length = 0</code>（一個等號是「放進去」，三個等號才是「比較」）。② 在模板裡寫 <code>todos.value.length</code>，模板不用 .value。③ 把初始資料清空了，卻忘了把 <code>nextId</code> 改回 1，編號會從 4 開始（不會壞，但很怪）。</p><p><b>下一步預告：</b>第 6 步，點一下待辦就打勾完成，文字會變成刪除線。</p>`,
      choice('「剛好等於 0」的比較，要寫？', ['todos.length === 0', 'todos.length = 0', 'todos.length => 0'], 0, '三個等號才是比較。')),
  ], {
    brief: '第 5 步：把 <code>todos</code> 改成一開始是空陣列、<code>nextId</code> 改成 1；清單空的時候顯示 <code>data-testid="empty"</code> 的提示「還沒有待辦，先加一個吧！」，有東西時提示消失。',
    hint: '兩個地方：setup 裡改成空陣列，模板加一個 v-if 的 p。',
    steps: [`TODO 1：把 todos 那一整段換成<pre>const todos = ref([]);</pre>並把 <code>let nextId = 4;</code> 改成 <code>let nextId = 1;</code>。為什麼：讓清單從空的開始，編號也從 1 開始。`, `TODO 2：在清單上面加<pre>&lt;p v-if="todos.length === 0" data-testid="empty"&gt;還沒有待辦，先加一個吧！&lt;/p&gt;</pre>為什麼：沒有資料時才顯示這句提示。`, `按「檢查」。最常犯的錯：條件寫成 <code>todos.length = 0</code>（一個等號），或在模板裡寫 <code>todos.value.length</code>。`],
    starter: E5, solution: S5,
    must: [{ re: /v-if=/, msg: '請用 v-if 控制提示' }],
    test: async (c) => {
      const f = needUI(c); if (f.length) return f;
      if (c.ta('todo').length !== 0) f.push(`一開始清單應該是空的，目前有 ${c.ta('todo').length} 件`);
      if (!c.t('empty')) f.push('清單是空的時候，要顯示 data-testid="empty" 的提示');
      else if (!txt(c.t('empty')).includes('還沒有待辦')) f.push('提示文字要寫「還沒有待辦，先加一個吧！」');
      await addItem(c, '寫程式');
      if (c.ta('todo').length !== 1) f.push(`新增後應有 1 件，目前 ${c.ta('todo').length} 件`);
      if (c.t('empty')) f.push('清單有東西時，提示要消失');
      return f;
    },
  }),
  GW(6, '點一下完成：:class', [
    gstep(`<p>待辦清單最爽的一刻：<b>做完一件事，點一下，把它劃掉</b>。</p><p>我們每筆資料早就有 <code>done: false</code> 這個欄位。做法很簡單：點一下，就把 done 在 <code>true</code> 和 <code>false</code> 之間切換；畫面上，done 是 true 的就加上一個叫 <code>done</code> 的 CSS class（我們已經準備好「刪除線」的樣式）。</p>`,
      choice('「做完」的狀態要記在哪裡？', ['每筆資料自己的 done 欄位', '寫死在 HTML', '記在使用者腦裡'], 0, '資料決定畫面。')),
    gstep(`<p>兩個新寫法：</p>${pre(`<li :class="{ done: t.done }">
  <span @click="t.done = !t.done">{{ t.text }}</span>
</li>`)}<ul><li><code>:class="{ done: t.done }"</code>：冒號代表後面是變數。意思是「如果 t.done 是 true，就加上 done 這個 class」。</li><li><code>@click="t.done = !t.done"</code>：點一下，把 done 反過來。<code>!</code> 代表「相反」：true 變 false，false 變 true。</li></ul><p>因為 Vue 盯著資料，done 一變，class 就自動加上或拿掉，刪除線也跟著出現或消失。</p>`,
      choice('<code>t.done = !t.done</code> 的效果是？', ['true 變 false、false 變 true', '永遠變成 true', '把 done 刪掉'], 0, '! 是「相反」，用來切換。')),
    gstep(`<p><b>常見的錯：</b>① <code>:class</code> 前面少了冒號，變成普通文字，永遠不會切換。② 寫成 <code>t.done = true</code>，只能打勾，不能取消。③ class 名字拼錯，和 CSS 的 <code>.done</code> 對不上。</p><p><b>下一步預告：</b>第 7 步，用 <code>computed</code> 算出「還剩幾件沒做」。</p>`,
      choice('想讓同一個動作「再點一次就取消」，要用？', ['切換：done = !done', '永遠設成 true', '刪掉元素'], 0, '切換才能來回。')),
  ], {
    brief: '第 6 步：點待辦的文字（<code>data-testid="label"</code>）切換完成。完成的 li 要有 <code>done</code> class（有刪除線），再點一次就取消。',
    hint: 'li 加 <code>:class="{ done: t.done }"</code>；裡面的文字用 span 包起來並加 <code>@click</code>。',
    steps: [`TODO：把 li 換成<pre>&lt;li v-for="t in todos" :key="t.id" data-testid="todo" :class="{ done: t.done }"&gt;
  &lt;span data-testid="label" @click="t.done = !t.done"&gt;{{ t.text }}&lt;/span&gt;
&lt;/li&gt;</pre>為什麼：span 負責「被點」，li 負責「依 done 加上 class」。`, `不用改 setup，因為 done 欄位本來就在資料裡。為什麼：畫面是資料算出來的，改資料就夠了。`, `按「檢查」。最常犯的錯：<code>:class</code> 少了冒號，或寫成 <code>t.done = true</code>，導致點第二次不能取消。`],
    starter: E6, solution: S6,
    must: [{ re: /:class=|v-bind:class=/, msg: '請用 :class 加上 done' }, { re: /!\s*t\.done/, msg: '請用 t.done = !t.done 切換完成狀態' }],
    test: async (c) => {
      const f = needUI(c); if (f.length) return f;
      await addItem(c, '寫程式');
      const li = c.ta('todo')[0], label = c.ta('label')[0];
      if (!li || !label) return ['新增後應有一個 li（todo），裡面有 span（label）'];
      if (li.classList.contains('done')) f.push('剛新增的待辦不應該有 done class');
      await c.click(label);
      if (!li.classList.contains('done')) f.push('點文字後，li 應該有 done class');
      else if (!c.win.getComputedStyle(li).textDecorationLine.includes('line-through')) f.push('完成的待辦應該有刪除線（不要刪掉 style）');
      await c.click(label);
      if (li.classList.contains('done')) f.push('再點一次，done class 應該消失');
      return f;
    },
  }),
  GW(7, '還剩幾件：computed', [
    gstep(`<p>想在清單下面顯示：<b>「還剩 2 件沒做」</b>。這個數字不是我們自己存的，而是<b>由清單算出來的</b>：把 done 不是 true 的數一數。</p><p>算出來的值，不要另外存一份，不然一不小心就會「清單改了、數字忘了改」。Vue 有專門的工具：<code>computed</code>（計算屬性）。</p>`,
      choice('「還剩幾件」這種由其他資料算出來的值，適合用？', ['computed', '手動記一個數字', '寫死在 HTML'], 0, '算出來的值交給 computed，會自動更新。')),
    gstep(`<p>寫法：</p>${pre(`const { createApp, ref, computed } = Vue;     // 多拿 computed

const remaining = computed(() => {
  return todos.value.filter((t) => !t.done).length;
});
// 縮短寫法：computed(() => todos.value.filter((t) => !t.done).length)`)}<ul><li><code>filter((t) => !t.done)</code>：從陣列裡<b>挑出</b>「done 不是 true」的那些。</li><li><code>.length</code>：數一數挑出來幾筆。</li><li>模板：<code>{{ remaining }}</code>，不用 .value 也不用括號。</li></ul><p>神奇的地方：不管你新增、打勾、之後刪除，只要清單變了，remaining 就<b>自動重算</b>。</p>`,
      choice('<code>filter((t) => !t.done)</code> 會得到？', ['done 不是 true 的那些項目', '全部項目', '只有第一個'], 0, 'filter 挑出符合條件的。')),
    gstep(`<p><b>常見的錯：</b>① 忘了在第一行 import <code>computed</code>。② 忘了把 remaining 加進 return。③ 在模板寫 <code>{{ remaining() }}</code>，computed 當成變數用，不加括號。</p><p><b>下一步預告：</b>最後一步（第 8 步），加上「刪除」按鈕，並把一個待辦拆成獨立的<b>元件</b>，學 props 和 emit。</p>`,
      choice('在模板裡顯示 computed 的值 <code>remaining</code>，要寫？', ['{{ remaining }}', '{{ remaining() }}', '{{ remaining.value() }}'], 0, 'computed 在模板裡像普通變數。')),
  ], {
    brief: '第 7 步：用 <code>computed</code> 算出 <code>remaining</code>（還沒完成的件數），顯示在 <code>data-testid="remaining"</code> 的 p：「還剩 N 件沒做」。',
    hint: '三個地方：import computed、寫 remaining 並 return、模板加 p。',
    steps: [`TODO 1：第一行改成 <code>const { createApp, ref, computed } = Vue;</code>，setup 裡加<pre>const remaining = computed(() => todos.value.filter((t) => !t.done).length);</pre>為什麼：把沒完成的挑出來再數一數，清單一變它就自動重算。`, `把 <code>remaining</code> 加進 return。為什麼：模板才拿得到。`, `TODO 2：模板加<pre>&lt;p data-testid="remaining"&gt;還剩 {{ remaining }} 件沒做&lt;/p&gt;</pre>為什麼：把算出來的數字顯示給使用者。最常犯的錯：忘了 import computed，會出現「computed is not defined」的錯誤。`],
    starter: E7, solution: S7,
    must: [{ re: /computed\(/, msg: '請用 computed 算出 remaining' }, { re: /\{\{\s*remaining\s*\}\}/, msg: '請用 {{ remaining }} 顯示件數' }],
    test: async (c) => {
      const f = needUI(c); if (f.length) return f;
      const left = () => Number((txt(c.t('remaining')).match(/還剩\s*(\d+)/) || [NaN, NaN])[1]);
      if (!c.t('remaining')) return ['缺少 data-testid="remaining" 的 p'];
      if (left() !== 0) f.push(`空清單時應顯示「還剩 0 件沒做」，目前是「${txt(c.t('remaining'))}」`);
      await addItem(c, '寫程式'); await addItem(c, '運動');
      if (left() !== 2) f.push(`新增 2 件後應是 2，目前是「${txt(c.t('remaining'))}」`);
      await c.click(c.ta('label')[0]);
      if (left() !== 1) f.push(`完成 1 件後應是 1，目前是「${txt(c.t('remaining'))}」`);
      await addItem(c, '買菜');
      if (left() !== 2) f.push(`再新增 1 件後應是 2，目前是「${txt(c.t('remaining'))}」`);
      return f;
    },
  }),
  GW(8, '刪除與元件：props 與 emit', [
    gstep(`<p>最後一步，兩件事：</p><ol><li><b>刪除</b>：每個待辦旁邊加「刪除」按鈕。</li><li><b>元件</b>：現在 li 的內容越來越多，我們把「一個待辦」拆成獨立的小零件，叫 <code>todo-item</code>。</li></ol><p>為什麼要拆？就像樂高：每個零件自己負責一小塊，主程式只負責「組裝」，不會變成一大坨。</p><p>刪除怎麼做？在主程式寫一個 <code>remove(id)</code>：把清單裡 id 不是這個的留下來，等於把那一筆濾掉：</p>${pre(`function remove(id) {
  todos.value = todos.value.filter((t) => t.id !== id);
}`)}`,
      choice('<code>todos.value.filter((t) => t.id !== id)</code> 會得到？', ['不含指定 id 的新陣列', '只有指定 id 的那一筆', '空陣列'], 0, '!== 是「不等於」，保留其他的，等於刪掉那一筆。')),
    gstep(`<p>元件要「從父層拿資料」，也要「通知父層發生了什麼事」。口訣：<b>props 往下傳資料，emit 往上傳事件</b>。</p>${pre(BT(`app.component('todo-item', {
  props: ['todo'],                 // 接收父層傳來的一筆待辦
  emits: ['toggle', 'remove'],     // 宣告：我會發出這兩種事件
  template: @@
    <li :class="{ done: todo.done }">
      <span @click="$emit('toggle')">{{ todo.text }}</span>
      <button @click="$emit('remove')">刪除</button>
    </li>@@,
});`))}${pre(`<!-- 父層使用 -->
<todo-item v-for="t in todos" :key="t.id" :todo="t"
  @toggle="t.done = !t.done" @remove="remove(t.id)"></todo-item>`)}<ul><li><code>:todo="t"</code>：把這一筆資料傳進去（props）。</li><li><code>$emit('remove')</code>：子元件喊一聲「我要被刪除」。</li><li><code>@remove="remove(t.id)"</code>：父層聽到就真的去刪。</li></ul>`,
      choice('子元件要「通知父層被點了」，用？', ['$emit', 'props', 'v-for'], 0, 'emit 往上通知，props 往下傳資料。')),
    gstep(`<p><b>為什麼子元件不自己刪？</b>資料是父層的，子元件只能「請求」，不能直接動。這樣資料從哪裡來、誰會改它，永遠很清楚。</p><p><b>常見的錯：</b>① 事件名字不一致，例如 emits 寫 remove、<code>$emit</code> 卻寫 Remove，父層就收不到。② 元件要在 <code>app.mount</code> <b>前面</b>註冊。③ 在 HTML 裡元件名稱要用橫線寫 <code>todo-item</code>。</p><p>做完這步，你就完成了整個待辦清單。你從一個空白頁面做出了：標題、清單、新增、空提示、完成切換、剩餘件數、刪除、元件！</p>`,
      choice('元件事件名字 emits 和 $emit 要？', ['完全一致，連大小寫都要一樣', '差不多就好', '完全不用管'], 0, '名字差一點，父層就收不到。')),
  ], {
    brief: '第 8 步（最後）：寫 <code>remove(id)</code>；做 <code>todo-item</code> 元件（props <code>todo</code>、emits <code>toggle</code> / <code>remove</code>，裡面有 label 與刪除按鈕 <code>remove</code>）；父層改用 <code>&lt;todo-item&gt;</code> 畫清單。前面所有功能都要還在。',
    hint: '三個 TODO：remove 函式、元件、父層改用 todo-item。元件要在 app.mount 前面註冊。',
    steps: [`TODO 1：setup 裡加<pre>function remove(id) {
  todos.value = todos.value.filter((t) =&gt; t.id !== id);
}</pre>並把 remove 加進 return。為什麼：這是真正刪資料的人，在父層才安全。`, `TODO 2：在 <code>app.mount</code> 前面加<pre>app.component('todo-item', {
  props: ['todo'],
  emits: ['toggle', 'remove'],
  template: \`
    &lt;li data-testid="todo" :class="{ done: todo.done }"&gt;
      &lt;span data-testid="label" @click="$emit('toggle')"&gt;{{ todo.text }}&lt;/span&gt;
      &lt;button data-testid="remove" @click="$emit('remove')"&gt;刪除&lt;/button&gt;
    &lt;/li&gt;\`,
});</pre>為什麼：把一個待辦的畫面和「點了要通知誰」收在一個零件裡。`, `TODO 3：模板的 li 整段換成<pre>&lt;todo-item v-for="t in todos" :key="t.id" :todo="t"
  @toggle="t.done = !t.done" @remove="remove(t.id)"&gt;&lt;/todo-item&gt;</pre>為什麼：props 把資料傳下去，事件讓子元件通知父層。最常犯的錯：emits 和 $emit 的名字不一致，或把 app.component 寫在 app.mount 後面。`],
    starter: E8, solution: S8,
    must: [{ re: /app\.component\(/, msg: '請用 app.component 做 todo-item 元件' }, { re: /props\s*:/, msg: '元件要用 props 接收 todo' }, { re: /\$emit\(/, msg: '元件要用 $emit 通知父層' }, { re: /<todo-item/, msg: '父層要使用 <todo-item>' }],
    test: async (c) => {
      const f = needUI(c); if (f.length) return f;
      const left = () => Number((txt(c.t('remaining')).match(/還剩\s*(\d+)/) || [NaN, NaN])[1]);
      // 再次驗證前面的行為
      if (c.ta('todo').length !== 0 || !c.t('empty')) f.push('一開始清單應該是空的，並顯示「還沒有待辦」的提示');
      await addItem(c, '   ');
      if (c.ta('todo').length !== 0) f.push('只輸入空白時不應該新增');
      await addItem(c, '買牛奶'); await addItem(c, '寫作業'); await addItem(c, '運動');
      let items = c.ta('todo');
      if (items.length !== 3) return [...f, `新增 3 件後應有 3 個 li，目前 ${items.length} 個`];
      if (c.t('empty')) f.push('有待辦時，空清單提示要消失');
      if (c.ta('remove').length !== 3) return [...f, `每個待辦都要有刪除按鈕（data-testid="remove"），目前 ${c.ta('remove').length} 個`];
      await c.click(c.ta('label')[0]);
      if (!c.ta('todo')[0].classList.contains('done')) f.push('點文字後該項要有 done class');
      if (left() !== 2) f.push(`完成 1 件後應「還剩 2 件」，目前是「${txt(c.t('remaining'))}」`);
      // 刪除中間那一筆
      await c.click(c.ta('remove')[1]);
      items = c.ta('todo');
      if (items.length !== 2) return [...f, `刪除一件後應剩 2 件，目前 ${items.length} 件`];
      if (!txt(items[0]).includes('買牛奶') || !txt(items[1]).includes('運動') || txt(items[1]).includes('寫作業')) f.push('應該刪掉被按的那一筆（寫作業），其他的保留');
      if (!items[0].classList.contains('done')) f.push('刪除別筆之後，買牛奶應該還是完成狀態');
      if (left() !== 1) f.push(`刪除後應「還剩 1 件」，目前是「${txt(c.t('remaining'))}」`);
      // 全部刪光
      await c.click(c.ta('remove')[0]); await c.click(c.ta('remove')[0]);
      if (c.ta('todo').length !== 0) f.push('全部刪光後清單應該是空的');
      if (!c.t('empty')) f.push('全部刪光後，要再次顯示「還沒有待辦」的提示');
      return f;
    },
  }),
];

const QUIZ = [
  choice('把 Vue 接到頁面上，用哪個動作？', ['app.mount(\'#app\')', 'app.delete()', 'ref(\'#app\')'], 0),
  choice('清單每一筆各畫一個 li，要用？', ['v-for 加上 :key', 'v-if', 'v-model'], 0),
  choice('「還剩幾件沒做」這種由清單算出來的值，用？', ['computed', '手動另存一個數字', 'v-for'], 0),
  choice('子元件想通知父層「我被刪除了」，用？', ['$emit', 'props', '直接改父層的資料'], 0),
];

const EVENT = {
  npc: 'mate', mood: 'worried',
  text: '主管要我從頭做一個待辦清單小工具，我一看到空白檔案就不知道從哪裡開始……你都怎麼做？',
  options: [
    { label: '先做最小的畫面並掛上 Vue，再一小步一小步加功能，每步都測', fx: { quality: 10, team: 6 } },
    { label: '一次把所有功能寫完，最後再來除錯', fx: { quality: -6, stress: 8 } },
  ],
};

export const GUIDED = {
  chapter: { id: 'vu-cg', title: '第三章　手把手專案：待辦清單（從空白做到完成）', lessons: VG_UNITS, quiz: QUIZ, projects: [], event: 'vu-cg' },
  event: EVENT,
};
