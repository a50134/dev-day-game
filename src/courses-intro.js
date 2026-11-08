// 六門課（TypeScript / Tailwind / React / Vue / Node.js / Python）的「第〇章　超簡單版」：
// 每章 4 個小單元，每單元 3 小步。全部不用打字：先看（explore 點一下看結果）→ 再玩（twlab 勾 class）→ 再拼／再選（blocks／blanks）。
// 小工具在 src/lab.js。沒有總練習（final）：做完小工具、答對小檢查就算完成這堂。

const pre = (code) => `<pre>${code.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>`;
const choice = (q, options, answer, why) => ({ type: 'choice', q, options, answer, why });
const step = (say, check) => ({ say, check });
const gate = (say, widget) => ({ say, widget: { ...widget, gate: true } });
const lesson = (id, title, steps) => ({ id, title, steps });
const unit = (id, n, total, title, steps) => lesson(id, `超簡單 ${n}／${total}　${title}`, steps);
const rline = (code, what) => ({ code, what });

const quizOf = (qs) => qs.map((q) => choice(...q));
const mk = (id, name, lessons, quiz, event) => ({
  chapter: { id: id + '-c0', title: `第〇章　${name}超簡單版（先看、再玩、再選，不用打字）`, lessons, quiz: quizOf(quiz), projects: [], event: id + '-c0' },
  event,
});

/* ================================ TypeScript ================================ */
const TS = mk('ts', 'TypeScript', [
  unit('ts0a', 1, 4, '型別就是「盒子上的標籤」', [
    step(`<p>想像你有幾個盒子，每個盒子貼了標籤：</p><ul><li>貼「數字」的盒子，只能放數字。</li><li>貼「文字」的盒子，只能放文字。</li></ul><p>TypeScript 就是替變數<b>貼標籤</b>。標籤寫在變數名字後面，用冒號隔開：</p>${pre('let price: number = 3800;')}<p>白話：「price 是一個只能放<b>數字</b>的盒子，現在放了 3800」。</p>`,
      choice('<code>let price: number = 3800</code> 裡，<code>: number</code> 是什麼？', ['盒子上的標籤（只能放數字）', '變數的名字', '一個函式'], 0, '冒號後面就是標籤（型別）。')),
    gate('<p><b>點每一個按鈕</b>，看看「放對」和「放錯」的差別。放錯時編輯器會出現<b>紅線</b>，把滑鼠移上去就會看到那句英文，我把它翻成白話給你。</p>', {
      type: 'explore', title: '放對、放錯，會怎樣？', gate: true,
      items: [
        { label: '數字放進 number ✅', code: 'let price: number = 3800;', result: '<p class="ok">✅ 沒有紅線</p>', note: '數字放進「只收數字」的盒子，剛剛好。' },
        { label: '文字放進 number ❌', code: "let price: number = '3800';", result: "<p class=\"fail\">🔴 Type 'string' is not assignable to type 'number'.</p>", note: "白話：「文字（string）不能放進只收數字（number）的盒子」。<b>加了引號就變成文字</b>，這是新手最常犯的錯。" },
        { label: 'true / false 放進 boolean ✅', code: 'let soldOut: boolean = false;', result: '<p class="ok">✅ 沒有紅線</p>', note: 'boolean 只有兩個值：<code>true</code>（是）和 <code>false</code>（否）。' },
        { label: '文字放進 boolean ❌', code: "let soldOut: boolean = 'no';", result: "<p class=\"fail\">🔴 Type 'string' is not assignable to type 'boolean'.</p>", note: "<code>'no'</code> 有引號，是文字。要寫 <code>false</code>（不加引號）。" },
        { label: '數字放進 string ❌', code: 'let title: string = 123;', result: "<p class=\"fail\">🔴 Type 'number' is not assignable to type 'string'.</p>", note: '文字一定要有引號：<code>\'123\'</code>。' },
      ] }),
    step(`<p>三個最常用的標籤，請記起來：</p><table class="tbl"><tr><th>標籤</th><th>放什麼</th><th>例子</th></tr><tr><td><code>string</code></td><td>文字（有引號）</td><td><code>'星光演唱會'</code></td></tr><tr><td><code>number</code></td><td>數字（沒引號）</td><td><code>3800</code></td></tr><tr><td><code>boolean</code></td><td>是／否</td><td><code>true</code> 或 <code>false</code></td></tr></table>`,
      choice('「是否售完」這種是／否的資料，標籤用哪個？', ['boolean', 'string', 'number'], 0, 'boolean 專門放 true / false。')),
  ]),
  unit('ts0b', 2, 4, '自己替變數貼標籤', [
    step(`<p>上一堂你看到了放錯會紅線。這堂換你<b>貼標籤</b>：看到值是什麼，就選對應的標籤。</p><p>口訣：<b>有引號 → string；純數字 → number；true/false → boolean</b>。</p>`,
      choice('<code>\'3800\'</code>（有引號）該貼哪個標籤？', ['string', 'number', 'boolean'], 0, '有引號就是文字，即使裡面是數字。')),
    gate('<p>下面三行，每一行都有一個空格。<b>用選的</b>把標籤選出來，選好按「檢查」。</p>', {
      type: 'blanks', title: '替三個變數貼標籤', code: "let title: ⟦1⟧ = '星光演唱會';\nlet price: ⟦2⟧ = 3800;\nlet soldOut: ⟦3⟧ = false;",
      output: '（沒有任何紅線 ✅）',
      blanks: [
        { options: ['string', 'number', 'boolean'], answer: 0, hint: '值有引號，是文字。', why: '值是文字（有引號）→ string' },
        { options: ['string', 'number', 'boolean'], answer: 1, hint: '值是純數字、沒引號。', why: '值是數字 → number' },
        { options: ['string', 'number', 'boolean'], answer: 2, hint: '值是 false，只有是／否兩種。', why: '值是 true / false → boolean' },
      ] }),
    step(`<p>小提醒：很多時候你<b>可以不寫標籤</b>，TypeScript 會自己看值猜出來（叫型別推論）：</p>${pre("let price = 3800;   // 它知道這是 number\nprice = 'abc';      // 🔴 照樣紅線")}<p>所以不用緊張，先學會「看懂」標籤就夠了。</p>`,
      choice('<code>let price = 3800;</code>（沒寫標籤）之後放 <code>\'abc\'</code> 進去，會？', ['紅線，因為它已經猜出是 number', '沒事', '變成 string'], 0, 'TypeScript 看值就猜出標籤了。')),
  ]),
  unit('ts0c', 3, 4, 'interface：替「一包資料」畫說明書', [
    step(`<p>真實的資料常常是「一包」：一張票有編號、名字、是否售完。這一包叫<b>物件</b>。</p><p><code>interface</code> 就是替這一包資料畫一張<b>說明書</b>：規定它「有哪些欄位、各是什麼標籤」：</p>${pre('interface Ticket {\n  id: number;\n  title: string;\n  sold: boolean;\n}')}<p>白話：「Ticket 這種東西，一定有 id（數字）、title（文字）、sold（是／否）三個欄位」。</p>`,
      choice('<code>interface Ticket { ... }</code> 的用途是？', ['規定一包資料有哪些欄位、各是什麼標籤', '執行一個函式', '把畫面變成紅色'], 0, '它就是「說明書」，不會執行任何事。')),
    gate('<p>下面是上面那張說明書，被<b>打亂</b>了。請<b>照順序點積木</b>：先 <code>interface Ticket {</code>，再依序 <code>id</code>、<code>title</code>、<code>sold</code>，最後 <code>}</code> 收尾。放錯會告訴你那行該是什麼。</p>', {
      type: 'blocks', title: '拼出 Ticket 說明書', output: '（說明書寫好了，沒有紅線 ✅）',
      lines: [
        rline('interface Ticket {', '說明書的開頭：宣告一個叫 Ticket 的說明書。'),
        rline('  id: number;', '第一個欄位：id，標籤是 number。'),
        rline('  title: string;', '第二個欄位：title，標籤是 string。'),
        rline('  sold: boolean;', '第三個欄位：sold，標籤是 boolean。'),
        rline('}', '說明書的結尾，把大括號關起來。'),
      ] }),
    step(`<p>有了說明書，就能替「一包資料」貼上它：</p>${pre("const t: Ticket = {\n  id: 1,\n  title: '星光演唱會',\n  sold: false,\n};")}<p>意思：「t 這包資料，要照 Ticket 說明書來」。照著寫對了，沒有紅線。</p>`,
      choice('<code>const t: Ticket = {...}</code> 的 <code>: Ticket</code> 是？', ['要求 t 照 Ticket 說明書來', '把 t 改名叫 Ticket', '刪掉 t'], 0, '一樣是「標籤」，只是這次標籤是我們自己畫的說明書。')),
  ]),
  unit('ts0d', 4, 4, '說明書會抓出哪些錯？', [
    step(`<p>說明書最有用的地方：<b>資料不照規矩，馬上紅線</b>。不用等到網站壞掉才發現。</p><p>下面這張說明書請先看一眼，等一下用它做實驗：</p>${pre('interface Ticket {\n  id: number;\n  title: string;\n  sold: boolean;\n}')}`,
      choice('說明書規定了幾個欄位？', ['3 個', '2 個', '5 個'], 0, 'id、title、sold 三個。')),
    gate('<p>點每個按鈕，看看哪種寫法會紅線、為什麼。</p>', {
      type: 'explore', title: '資料不照說明書，會怎樣？', gate: true,
      items: [
        { label: '三個欄位都對 ✅', code: "const t: Ticket = { id: 1, title: '星光', sold: false };", result: '<p class="ok">✅ 沒有紅線</p>', note: '欄位齊全、標籤都對。' },
        { label: '少一個欄位 ❌', code: "const t: Ticket = { id: 1, title: '星光' };", result: "<p class=\"fail\">🔴 Property 'sold' is missing in type '{ id: number; title: string; }' but required in type 'Ticket'.</p>", note: "白話：「說明書要求有 <code>sold</code>，你沒給」。補上少的欄位就好。" },
        { label: '多一個欄位 ❌', code: "const t: Ticket = { id: 1, title: '星光', sold: false, price: 3800 };", result: "<p class=\"fail\">🔴 Object literal may only specify known properties, and 'price' does not exist in type 'Ticket'.</p>", note: "白話：「說明書裡沒有 <code>price</code> 這個欄位」。想用它，就要先去說明書加上 <code>price: number;</code>。" },
        { label: '標籤放錯 ❌', code: "const t: Ticket = { id: '1', title: '星光', sold: false };", result: "<p class=\"fail\">🔴 Type 'string' is not assignable to type 'number'.</p>", note: "<code>id</code> 要的是數字，<code>'1'</code> 有引號是文字。" },
      ] }),
    step(`<p>修紅線的三步，給你一個固定流程：</p><ol><li>把滑鼠移到紅線上，看那句英文的<b>最後幾個字</b>（欄位名稱）。</li><li>對照說明書：少了、多了、還是標籤不對？</li><li>改成跟說明書一樣，紅線就消失。</li></ol>`,
      choice('看到 <code>Property \'sold\' is missing</code>，代表？', ['少了 sold 這個欄位', '多了 sold', 'sold 的標籤放錯'], 0, 'missing = 缺少。')),
  ]),
], [
  ['<code>let age: number = 18</code> 裡的 <code>number</code> 是？', ['標籤（型別）', '變數名字', '函式'], 0, '冒號後面是型別。'],
  ["<code>let a: number = '5'</code> 會怎樣？", ['紅線，因為文字放進了 number', '沒事', '變成數字'], 0, '有引號就是文字。'],
  ['<code>interface</code> 的用途？', ['替一包資料畫說明書', '讓畫面變色', '連網路'], 0, '它規定欄位和標籤。'],
  ['資料少了說明書要求的欄位，會？', ['出現紅線', '自動補上', '網站重開'], 0, '紅線會提醒你少了什麼。'],
], { npc: 'mate', mood: 'worried', text: '欸，我寫的物件一直有紅線，說什麼 "is missing in type"……那是什麼意思？', options: [{ label: '告訴他：少了說明書要求的欄位，補上就好', fx: { team: 8, quality: 6, stress: 2 } }, { label: '叫他用 any 蓋掉', fx: { team: -4, quality: -6 } }] });

/* ================================ Tailwind ================================ */
const TW = mk('tw', 'Tailwind', [
  unit('tw0a', 1, 4, 'class 就是「貼貼紙」', [
    step(`<p>網頁預設很樸素。Tailwind 讓你用<b>貼貼紙</b>的方式裝飾：每張貼紙是一個 class，寫在標籤的 <code>class="…"</code> 裡。</p>${pre('<h1 class="text-2xl font-bold">星光演唱會</h1>')}<p><code>text-2xl</code> = 字變大，<code>font-bold</code> = 粗體。想要什麼效果，就多貼一張。</p>`,
      choice('想讓字變粗，要貼哪張貼紙？', ['font-bold', 'bold', 'text-bold'], 0, '粗體是 font-bold。')),
    gate('<p>下面是一個標題。<b>勾選 class</b>，右邊的畫面會馬上改變。<b>任務：把字變大（text-2xl）又變粗（font-bold）。</b></p>', {
      type: 'twlab', title: '替標題貼貼紙', html: '<h1 class="{C}">星光巡迴演唱會</h1>', h: 90,
      classes: [{ c: 'text-2xl', what: '字變大（24px）。' }, { c: 'font-bold', what: '粗體。' }, { c: 'text-red-500', what: '字變紅色。' }, { c: 'underline', what: '加底線。' }],
      need: ['text-2xl', 'font-bold'], task: '勾選 text-2xl 和 font-bold。' }),
    step(`<p>重點整理：</p><ul><li>多張貼紙之間用<b>空格</b>隔開（不要逗號）：<code>class="text-2xl font-bold"</code></li><li>貼紙的順序不重要。</li><li>不想要某個效果，把那張貼紙拿掉就好。</li></ul>`,
      choice('哪個寫法正確？', ['class="text-2xl font-bold"', 'class="text-2xl, font-bold"', 'class="text-2xl+font-bold"'], 0, '用空格隔開。')),
  ]),
  unit('tw0b', 2, 4, '空間：padding 和圓角', [
    step(`<p>想像一個便利貼：<b>內距（padding）</b>是字和邊邊的距離；<b>外距（margin）</b>是便利貼和別人的距離。</p><ul><li><code>p-4</code>：四邊都有內距。</li><li><code>m-4</code>：四邊都有外距。</li><li><code>rounded-lg</code>：四個角變圓。</li></ul><p>數字越大，距離越大（<code>p-2</code> 小，<code>p-8</code> 大）。</p>`,
      choice('讓字和框的邊緣有一點距離，用？', ['p-4（padding）', 'm-4（margin）', 'text-4'], 0, 'padding 是「框裡面」的距離。')),
    gate('<p>下面有一塊黃色便利貼。<b>任務：加 p-4（內距）和 rounded-lg（圓角）。</b>注意看字和邊的距離、四個角的變化。再試試 m-8，看整塊東西怎麼移動。</p>', {
      type: 'twlab', title: '替便利貼調空間', html: '<div class="bg-yellow-200 {C}">票價 NT$ 3800</div>', h: 150,
      classes: [{ c: 'p-4', what: '內距：字離邊邊遠一點。' }, { c: 'rounded-lg', what: '圓角：四個角變圓。' }, { c: 'm-8', what: '外距：整塊離別人（和邊緣）遠一點。' }, { c: 'shadow-lg', what: '加陰影，看起來浮起來。' }],
      need: ['p-4', 'rounded-lg'], task: '勾選 p-4 和 rounded-lg。' }),
    step(`<p>記法：<b>p = padding（內）、m = margin（外）</b>。後面加方向：<code>px</code> 左右、<code>py</code> 上下、<code>pt</code> 上、<code>pb</code> 下。</p><p>例如按鈕常用 <code>px-4 py-2</code>：左右寬一點、上下窄一點。</p>`,
      choice('<code>px-4 py-2</code> 是？', ['左右內距 4、上下內距 2', '外距 4 和 2', '字級'], 0, 'p 是 padding，x 左右，y 上下。')),
  ]),
  unit('tw0c', 3, 4, '顏色與按鈕', [
    step(`<p>顏色的寫法：<b>用途-顏色-深淺</b>。</p><ul><li><code>bg-blue-500</code>：背景藍色（bg = background）。</li><li><code>text-white</code>：字白色。</li><li>數字 100 最淺、900 最深。</li></ul>`,
      choice('背景要紅色，用？', ['bg-red-500', 'text-red-500', 'red-bg'], 0, 'bg- 管背景，text- 管字色。')),
    gate('<p>做一顆「買票」按鈕。<b>任務：背景藍色（bg-blue-500）、字白色（text-white）、圓角（rounded）。</b></p>', {
      type: 'twlab', title: '做一顆按鈕', html: '<button class="px-4 py-2 {C}">買票</button>', h: 110,
      classes: [{ c: 'bg-blue-500', what: '背景藍色。' }, { c: 'text-white', what: '字白色。' }, { c: 'rounded', what: '小圓角。' }, { c: 'bg-red-500', what: '背景紅色（和藍色擇一就好）。' }],
      need: ['bg-blue-500', 'text-white', 'rounded'], task: '勾選 bg-blue-500、text-white、rounded。' }),
    step(`<p>滑鼠移上去變色：在 class 前面加 <code>hover:</code>。</p>${pre('<button class="bg-blue-500 hover:bg-blue-700">買票</button>')}<p>平常藍色，滑鼠移上去變深藍。</p>`,
      choice('讓滑鼠移上去才變色，在 class 前面加？', ['hover:', 'mouse:', 'on:'], 0, 'hover: 就是「滑鼠移上去時」。')),
  ]),
  unit('tw0d', 4, 4, '排版：flex 讓東西排成一排', [
    step(`<p>預設的方塊是<b>上下堆疊</b>。想讓它們<b>橫著排一排</b>，在外面那層加 <code>flex</code>。</p><ul><li><code>gap-4</code>：每個方塊之間留空隙。</li><li><code>justify-between</code>：頭尾貼邊，中間平均分開。</li><li><code>items-center</code>：上下置中對齊。</li></ul>`,
      choice('讓三個方塊橫著排，外層要加？', ['flex', 'row', 'inline'], 0, 'flex 把子元素排成一排。')),
    gate('<p>下面有三個座位方塊，現在是上下堆疊。<b>任務：外層加 flex 和 gap-4。</b>然後再試試 justify-between，看它們怎麼分開。</p>', {
      type: 'twlab', title: '把座位排成一排', html: '<div class="{C}"><div class="bg-blue-200 p-3">A1</div><div class="bg-blue-200 p-3">A2</div><div class="bg-blue-200 p-3">A3</div></div>', h: 190,
      classes: [{ c: 'flex', what: '子元素橫著排。' }, { c: 'gap-4', what: '方塊之間的空隙。' }, { c: 'justify-between', what: '頭尾貼邊、中間平均分開（要先有 flex 才看得出來）。' }, { c: 'items-center', what: '上下置中。' }],
      need: ['flex', 'gap-4'], task: '勾選 flex 和 gap-4。' }),
    step(`<p>小技巧：如果加了 <code>justify-between</code> 沒反應，先檢查外層有沒有 <code>flex</code>。<b>justify、items、gap 都要搭配 flex 才有用。</b></p>`,
      choice('加了 <code>justify-between</code> 沒有任何變化，最可能是？', ['外層沒加 flex', '顏色不對', '字太小'], 0, 'justify / items / gap 都要搭配 flex。')),
  ]),
], [
  ['Tailwind 的 class 之間用什麼隔開？', ['空格', '逗號', '分號'], 0, '空格。'],
  ['<code>p-4</code> 是？', ['內距', '外距', '粗體'], 0, 'p = padding。'],
  ['背景藍色用？', ['bg-blue-500', 'text-blue-500', 'blue-500'], 0, 'bg- 管背景。'],
  ['讓三個方塊橫著排用？', ['flex', 'block', 'hidden'], 0, 'flex。'],
], { npc: 'lead', mood: 'happy', text: '我的按鈕看起來平平的，你學過 Tailwind，幫我加一點質感？', options: [{ label: '加 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700', fx: { team: 8, quality: 6, stress: 2 } }, { label: '叫他去找設計師', fx: { team: -2 } }] });

/* ================================ React ================================ */
const RC = mk('rc', 'React', [
  unit('rc0a', 1, 4, '元件：自己做的積木', [
    step(`<p>React 把網頁拆成一塊一塊的<b>積木</b>，叫<b>元件</b>。元件就是一個函式，<b>名字大寫開頭</b>，回傳「這塊積木長什麼樣」：</p>${pre('function Hello() {\n  return <h1>哈囉</h1>;\n}')}<p>做好一塊積木，就能像貼標籤一樣用 <code>&lt;Hello /&gt;</code> 放到任何地方，想放幾次放幾次。</p>`,
      choice('React 的元件長什麼樣？', ['一個大寫開頭、回傳畫面的函式', '一個 CSS 檔', '一個資料庫'], 0, '函式 + 回傳畫面。')),
    gate('<p>點每個按鈕，看看畫面長什麼樣子。</p>', {
      type: 'explore', title: '元件放進畫面', gate: true,
      items: [
        { label: '放一個 <Hello />', code: 'function Hello() {\n  return <h1>哈囉</h1>;\n}\n\nfunction App() {\n  return <Hello />;\n}', result: '<h1>哈囉</h1>', note: '<code>&lt;Hello /&gt;</code> 就是把剛做好的積木放進來。' },
        { label: '放兩個 <Hello />', code: 'function App() {\n  return (\n    <div>\n      <Hello />\n      <Hello />\n    </div>\n  );\n}', result: '<h1>哈囉</h1><h1>哈囉</h1>', note: '一塊積木，想用幾次就用幾次。這就是元件的好處：<b>寫一次，到處用</b>。回傳的最外面只能有一個標籤，所以用 <code>&lt;div&gt;</code> 包起來。' },
        { label: '名字改成小寫 ❌', code: 'function hello() {\n  return <h1>哈囉</h1>;\n}\n\n// <hello /> ← 小寫', result: '<p class="fail">🔴 畫面上什麼都沒有（甚至出現警告）</p>', note: 'React 看到<b>小寫</b>會以為是一般 HTML 標籤（像 <code>&lt;div&gt;</code>），不是你做的元件。<b>元件名字一定要大寫開頭</b>。' },
      ] }),
    step(`<p>JSX（函式裡長得像 HTML 的部分）和 HTML 有兩個小差別：</p><ul><li><code>class</code> 要寫成 <code>className</code>。</li><li>每個標籤都要<b>關起來</b>：<code>&lt;img /&gt;</code>、<code>&lt;input /&gt;</code> 最後要有斜線。</li></ul>`,
      choice('在 JSX 裡要加 CSS class，寫？', ['className="a"', 'class="a"', 'klass="a"'], 0, 'class 是 JS 的保留字，所以用 className。')),
  ]),
  unit('rc0b', 2, 4, '大括號 { }：把變數放進畫面', [
    step(`<p>畫面上的字有時是「會變的資料」，例如價格。把資料先存進變數，再用<b>大括號 { }</b> 放進畫面：</p>${pre('const price = 3800;\n\nreturn <p>NT$ {price}</p>;')}<p>大括號的意思是：「這裡不是文字，是 JavaScript，請算出來再放進去」。</p>`,
      choice('想在畫面顯示變數 price 的值，要寫？', ['{price}', 'price', '"price"'], 0, '用大括號包起來。')),
    gate('<p>點每個按鈕，看加不加大括號差在哪。</p>', {
      type: 'explore', title: '大括號的差別', gate: true,
      items: [
        { label: '沒有大括號 ❌', code: 'const price = 3800;\nreturn <p>NT$ price</p>;', result: '<p>NT$ price</p>', note: '沒有大括號，React 把 <code>price</code> 當成普通文字，直接印出「price」這四個字。' },
        { label: '有大括號 ✅', code: 'const price = 3800;\nreturn <p>NT$ {price}</p>;', result: '<p>NT$ 3800</p>', note: '大括號把變數換成它的值。「NT$ 」是固定文字，不用括。' },
        { label: '大括號裡算數學', code: 'const price = 3800;\nreturn <p>兩張 {price * 2}</p>;', result: '<p>兩張 7600</p>', note: '大括號裡可以放任何 JavaScript 的運算。' },
      ] }),
    step(`<p>常見錯誤：把大括號放到引號裡面。</p>${pre("<p title=\"{price}\">…</p>   // ❌ 變成文字 {price}\n<p title={price}>…</p>     // ✅ 用在屬性時，大括號不要加引號")}<p>記法：大括號<b>取代</b>引號，兩個不要同時出現。</p>`,
      choice('屬性要放變數，哪個對？', ['title={price}', 'title="{price}"', 'title=price'], 0, '大括號取代引號。')),
  ]),
  unit('rc0c', 3, 4, 'props：幫積木傳資料', [
    step(`<p>同一塊積木，想讓它顯示<b>不同內容</b>（A 卡片、B 卡片）怎麼辦？用 <b>props</b>：像填表格一樣，使用積木時把資料傳進去。</p>${pre("function Card(props) {\n  return <p>{props.name}</p>;\n}\n\n<Card name=\"星光\" />\n<Card name=\"海洋\" />")}<p>在使用的地方寫 <code>name=\"星光\"</code>，在積木裡面就用 <code>props.name</code> 拿出來。</p>`,
      choice('<code>&lt;Card name="星光" /&gt;</code>，積木裡面要怎麼拿到 "星光"？', ['props.name', 'name.props', 'Card.name'], 0, '傳進去的資料都放在 props 這個物件裡。')),
    gate('<p>點每個按鈕，看畫面。</p>', {
      type: 'explore', title: 'props 傳資料', gate: true,
      items: [
        { label: '傳 "星光"', code: '<Card name="星光" />', result: '<p>星光</p>', note: '傳什麼，積木裡就顯示什麼。' },
        { label: '傳 "海洋"', code: '<Card name="海洋" />', result: '<p>海洋</p>', note: '同一塊積木，換個資料就變成另一張卡片。這就是 props 的用處。' },
        { label: '忘了傳 name ❌', code: '<Card />', result: '<p></p><p class="muted">（空白，什麼都沒顯示）</p>', note: '沒傳就拿到 <code>undefined</code>，React 不會顯示它，畫面是空的、也沒有錯誤訊息。畫面空白時，先檢查「有沒有傳」。' },
        { label: '傳數字要用大括號', code: '<Card price={3800} />', result: '<p>3800</p>', note: '文字用引號 <code>"星光"</code>，其他（數字、變數）用大括號 <code>{3800}</code>。' },
      ] }),
    step(`<p>流程圖：</p>${pre('使用的地方：  <Card name="星光" />\n                     ↓ 傳進去\n積木裡面：    function Card(props) { props.name }  → 星光')}`,
      choice('props 是從哪裡來的？', ['使用積木的地方傳進來的', '網路自動下載', '寫在 CSS 裡'], 0, '使用者（呼叫的人）填，積木拿來用。')),
  ]),
  unit('rc0d', 4, 4, 'useState：會變的資料', [
    step(`<p>按鈕點一下，數字加 1——畫面上<b>會變的資料</b>要用 <code>useState</code> 存：</p>${pre('const [count, setCount] = useState(0);')}<ul><li><code>count</code>：現在的值（一開始 0）。</li><li><code>setCount</code>：用來<b>改值</b>的遙控器。</li><li><code>useState(0)</code>：括號裡是起始值。</li></ul>`,
      choice('<code>const [count, setCount] = useState(0)</code> 中，要改值該用？', ['setCount(...)', 'count = ...', 'useState(...)'], 0, '一定要透過 set 那個函式改，React 才知道要更新畫面。')),
    gate('<p>點每個按鈕，看看怎麼改值才有用。</p>', {
      type: 'explore', title: '改值的正確方法', gate: true,
      items: [
        { label: '一開始', code: 'const [count, setCount] = useState(0);\n// <p>{count}</p>', result: '<p>0</p>', note: '起始值是 0。' },
        { label: '點一下 +1 按鈕 ✅', code: '<button onClick={() => setCount(count + 1)}>+1</button>', result: '<p>1</p>', note: '點一下 → <code>setCount(1)</code> → React 重新畫畫面 → 看到 1。點三下就是 3。' },
        { label: '直接改 count ❌', code: '<button onClick={() => { count = count + 1; }}>+1</button>', result: '<p class="fail">畫面還是 0</p>', note: '直接改變數，React 不知道，畫面不會更新。<b>一定要用 setCount</b>。' },
      ] }),
    step(`<p>整理四個常見詞：</p><table class="tbl"><tr><th>寫法</th><th>意思</th></tr><tr><td><code>function App()</code></td><td>做一塊積木</td></tr><tr><td><code>{ }</code></td><td>把變數放進畫面</td></tr><tr><td><code>props</code></td><td>幫積木傳資料</td></tr><tr><td><code>useState</code></td><td>存會變的資料</td></tr></table>`,
      choice('「存會變的資料」用哪個？', ['useState', 'props', 'className'], 0, 'useState。')),
  ]),
], [
  ['React 元件的名字要？', ['大寫開頭', '小寫開頭', '數字開頭'], 0, '大寫，不然會被當成 HTML 標籤。'],
  ['畫面顯示變數 price 要寫？', ['{price}', 'price', '"price"'], 0, '大括號。'],
  ['同一個元件顯示不同內容，用？', ['props', 'CSS', 'alert'], 0, '用 props 傳資料。'],
  ['改 state 要用？', ['setCount(...)', 'count = ...', 'delete count'], 0, '用 set 函式。'],
], { npc: 'mate', mood: 'worried', text: '我的按鈕點了，變數有變，畫面卻沒動……', options: [{ label: '提醒他：要用 useState 的 set 函式改，不能直接改變數', fx: { team: 8, quality: 6, stress: 2 } }, { label: '叫他重新整理網頁', fx: { team: -4, quality: -2 } }] });

/* ================================ Vue ================================ */
const VU = mk('vu', 'Vue', [
  unit('vu0a', 1, 4, '雙大括號 {{ }}：把資料放進畫面', [
    step(`<p>Vue 的畫面寫在<b>模板</b>（長得像 HTML）裡。想放資料，用<b>雙大括號</b> <code>{{ }}</code>：</p>${pre('<h1>{{ title }}</h1>')}<p>意思：「把 title 這個資料的值放在這裡」。</p>`,
      choice('Vue 模板裡顯示 title，怎麼寫？', ['{{ title }}', '{title}', '${title}'], 0, 'Vue 用雙大括號。')),
    gate('<p>點每個按鈕，看加不加雙大括號的差別。</p>', {
      type: 'explore', title: '雙大括號的差別', gate: true,
      items: [
        { label: '有雙大括號 ✅', code: "const title = '星光演唱會';\n<h1>{{ title }}</h1>", result: '<h1>星光演唱會</h1>', note: '雙大括號會換成 title 的值。' },
        { label: '沒有大括號 ❌', code: "const title = '星光演唱會';\n<h1>title</h1>", result: '<h1>title</h1>', note: '沒括起來，就是普通文字，畫面印出「title」這四個字。' },
        { label: '大括號裡算數學', code: '<p>{{ 3800 * 2 }}</p>', result: '<p>7600</p>', note: '雙大括號裡可以放簡單的 JavaScript 運算。' },
      ] }),
    step(`<p>小提醒：Vue 的 <code>{{ }}</code> 是<b>兩個</b>大括號（React 是一個）。兩個框架很像，別混在一起。</p>`,
      choice('Vue 用幾個大括號？', ['兩個 {{ }}', '一個 { }', '三個'], 0, 'Vue 兩個，React 一個。')),
  ]),
  unit('vu0b', 2, 4, 'ref：會變的資料', [
    step(`<p>畫面上會變的資料（計數、輸入框內容）用 <code>ref()</code> 建立：</p>${pre("const count = ref(0);")}<p>在 <b>JavaScript 裡</b>讀、改它，要加 <code>.value</code>；但在<b>模板裡</b>直接寫名字就好：</p>${pre("count.value++;     // JS 裡：要 .value\n// 模板：{{ count }}  ← 不用 .value")}`,
      choice('在 JavaScript 裡讀 count 的值，寫？', ['count.value', 'count', 'count()'], 0, 'ref 的值藏在 .value 裡。')),
    gate('<p>點每個按鈕，看畫面怎麼變。</p>', {
      type: 'explore', title: 'ref 和 .value', gate: true,
      items: [
        { label: '一開始', code: 'const count = ref(0);\n// 模板：<p>{{ count }}</p>', result: '<p>0</p>', note: '起始值是 0。' },
        { label: '點 +1 按鈕 ✅', code: 'function add() {\n  count.value++;\n}\n// <button @click="add">+1</button>', result: '<p>1</p>', note: '<code>count.value++</code> 改了值，Vue 自動更新畫面。' },
        { label: '忘了 .value ❌', code: 'function add() {\n  count++;   // 少了 .value\n}', result: '<p class="fail">🔴 出現錯誤，畫面不會變</p>', note: '<code>count</code> 本身是個「盒子」，要改裡面的值，要用 <code>count.value</code>。' },
      ] }),
    step(`<p>口訣：<b>JS 裡要 .value，模板裡不用</b>。</p>`,
      choice('在模板裡顯示 count，要寫？', ['{{ count }}', '{{ count.value }}', '{count}'], 0, '模板會自動拆開 ref，不用 .value。')),
  ]),
  unit('vu0c', 3, 4, 'return：交出去模板才看得到', [
    step(`<p>在 <code>setup()</code> 裡建立的資料，要用 <code>return</code> 交出去，<b>模板才看得到</b>：</p>${pre("setup() {\n  const title = ref('星光演唱會');\n  return { title };   // 沒 return，模板就找不到\n}")}<p>像是你做好一道菜，沒端出去，客人就吃不到。</p>`,
      choice('模板顯示不出 setup 裡的資料，最可能是？', ['忘了 return 它', '忘了分號', '字太小'], 0, '要 return 才看得到。')),
    gate('<p>點每個按鈕，看有沒有 return 的差別。</p>', {
      type: 'explore', title: 'return 的差別', gate: true,
      items: [
        { label: '有 return ✅', code: "setup() {\n  const title = ref('星光');\n  return { title };\n}\n// <h1>{{ title }}</h1>", result: '<h1>星光</h1>', note: 'title 交出去了，模板看得到。' },
        { label: '忘了 return ❌', code: "setup() {\n  const title = ref('星光');\n  return { };\n}\n// <h1>{{ title }}</h1>", result: '<h1></h1><p class="fail">（空白；Console 會警告 title 不存在）</p>', note: '沒交出去，模板找不到 title。畫面空白時，先檢查 return。' },
        { label: '多個資料一起 return', code: 'return { title, price };', result: '<h1>星光</h1><p>3800</p>', note: '用逗號隔開，想給模板用的都要寫進去。' },
      ] }),
    step(`<p>排查畫面空白的順序：</p><ol><li>模板有沒有寫 <code>{{ }}</code>？</li><li>setup 有沒有 return 這個名字？</li><li>名字有沒有拼錯（大小寫也算）？</li></ol>`,
      choice('畫面空白，第一個該查？', ['有沒有 return', '電腦有沒有插電', '網頁字體'], 0, '八成是忘了 return。')),
  ]),
  unit('vu0d', 4, 4, 'v-for、v-if、@click', [
    step(`<p>三個最常用的「指令」（寫在標籤上、以 <code>v-</code> 開頭的特殊屬性）：</p><table class="tbl"><tr><th>寫法</th><th>用途</th></tr><tr><td><code>v-for</code></td><td>一個一個重複畫（畫一排座位）</td></tr><tr><td><code>v-if</code></td><td>條件成立才畫（賣完才顯示「已售完」）</td></tr><tr><td><code>@click</code></td><td>點到時做事</td></tr></table>`,
      choice('「畫出一整排座位」用？', ['v-for', 'v-if', '@click'], 0, 'for = 重複。')),
    gate('<p>點每個按鈕，看畫面。</p>', {
      type: 'explore', title: '三個指令', gate: true,
      items: [
        { label: 'v-for', code: "const seats = ['A1', 'A2', 'A3'];\n<li v-for=\"s in seats\">{{ s }}</li>", result: '<ul><li>A1</li><li>A2</li><li>A3</li></ul>', note: '清單有幾個，就畫幾個。<code>s</code> 是每一次拿到的那一個。' },
        { label: 'v-if（成立）', code: 'const sold = true;\n<p v-if="sold">已售完</p>', result: '<p>已售完</p>', note: 'sold 是 true，所以畫出來。' },
        { label: 'v-if（不成立）', code: 'const sold = false;\n<p v-if="sold">已售完</p>', result: '<p class="muted">（什麼都沒有）</p>', note: 'sold 是 false，這個標籤就不會出現。' },
        { label: '@click', code: '<button @click="count++">+1</button>', result: '<button>+1</button> <small>→ 每點一次，count 加 1</small>', note: '<code>@click</code> 後面放「點到時要做的事」。' },
      ] }),
    step(`<p>記法：<code>v-for</code> 重複、<code>v-if</code> 判斷、<code>@click</code> 點擊，都是寫在標籤上的小開關。</p>`,
      choice('賣完才顯示「已售完」，用？', ['v-if', 'v-for', '@click'], 0, 'if = 如果。')),
  ]),
], [
  ['Vue 模板顯示資料用？', ['{{ }}', '{ }', '< >'], 0, '雙大括號。'],
  ['JS 裡讀 ref 的值用？', ['.value', '.get', '()'], 0, '.value。'],
  ['setup 裡的資料要給模板用，要？', ['return', 'delete', 'export'], 0, 'return。'],
  ['重複畫出一排用？', ['v-for', 'v-if', 'v-on'], 0, 'v-for。'],
], { npc: 'mate', mood: 'worried', text: '我的 Vue 畫面是空的，Console 說 "property was accessed but not defined"。', options: [{ label: '提醒他：資料有沒有從 setup return 出去', fx: { team: 8, quality: 6, stress: 2 } }, { label: '叫他重寫整個元件', fx: { team: -4, quality: -2, stress: 6 } }] });

/* ================================ Node.js（程式真的會執行） ================================ */
const ND = mk('nd', 'Node.js', [
  unit('nd0a', 1, 4, '後端是什麼？console.log 印出來看', [
    step(`<p><b>前端</b>是你看到的網頁畫面；<b>後端</b>是躲在後面的程式：負責存資料、算東西、回答前端的問題（例如「還有哪些座位？」）。</p><p>後端沒有畫面，要看結果，就用 <code>console.log</code> 把東西「印」出來。</p>${pre("console.log('哈囉');")}`,
      choice('後端沒有畫面，想看到結果，用？', ['console.log', 'alert', '看畫面'], 0, 'console.log 把東西印出來。')),
    gate('<p>下面的程式被打亂了。<b>依序點積木</b>：先準備座位清單，再印出座位數。拼對後程式會<b>真的執行</b>。</p>', {
      type: 'blocks', title: '拼出一支 Node 程式',
      lines: [
        rline("const seats = ['A1', 'A2', 'A3'];", '先準備資料：一個座位清單（陣列）。'),
        rline("console.log('座位數：', seats.length);", '印出座位的數量。.length 是「有幾個」。'),
      ] }),
    step(`<p>三個基本動作：</p><ul><li><code>const x = ...</code>：把資料存進變數。</li><li><code>陣列.length</code>：有幾個東西。</li><li><code>console.log(...)</code>：印出來看。</li></ul><p>先有資料，才能印；順序反了會出現 <code>seats is not defined</code>。</p>`,
      choice('順序反過來（先印 seats，再建立 seats）會？', ['出錯：seats is not defined', '照樣正常', '印出 0'], 0, '程式由上往下跑，還沒建立就想用。')),
  ]),
  unit('nd0b', 2, 4, '函式：算一次、用很多次', [
    step(`<p>函式像一台<b>小機器</b>：丟東西進去，它處理完交一個答案出來。</p>${pre('function total(qty) {\n  return qty * 3800;\n}\n\nconsole.log(total(2));   // 7600')}<ul><li><code>qty</code>：丟進去的東西（張數）。</li><li><code>return</code>：把答案交出來。</li></ul>`,
      choice('函式裡 <code>return</code> 的功能？', ['把答案交出來', '印出來', '刪掉函式'], 0, 'return = 交出答案。')),
    gate('<p>空格用選的：函式要把答案<b>交出來</b>要用哪個字？選好按「檢查」，程式會真的執行。</p>', {
      type: 'blanks', title: '補完 total 函式', code: 'function total(qty) {\n  ⟦1⟧ qty * 3800;\n}\n\nconsole.log(total(2));',
      blanks: [{ options: ['return', 'console.log', 'function'], answer: 0, hint: '要把答案交出去，給呼叫的人用。', why: 'return 把算好的答案交出去。' }] }),
    gate('<p>看看<b>忘了 return</b> 會怎樣。點兩個按鈕比較。</p>', {
      type: 'explore', title: 'return 有沒有差別', gate: true,
      items: [
        { label: '有 return ✅', code: 'function total(qty) {\n  return qty * 3800;\n}\nconsole.log(total(2));', result: '<pre>7600</pre>', note: '答案交出來了，console.log 印出 7600。' },
        { label: '忘了 return ❌', code: 'function total(qty) {\n  qty * 3800;\n}\nconsole.log(total(2));', result: '<pre>undefined</pre>', note: '算是算了，但沒交出來，呼叫的人拿到的是 <code>undefined</code>（什麼都沒有）。印出 undefined，第一個想到：是不是忘了 return。' },
      ] }),
  ]),
  unit('nd0c', 3, 4, '陣列：處理一整排資料', [
    step(`<p>後端常常要處理<b>一整排</b>資料（很多張票）。陣列有幾個好用的工具：</p><ul><li><code>.map(...)</code>：每個東西都「加工」一次，得到一份新的清單。</li><li><code>.filter(...)</code>：只留下符合條件的。</li><li><code>.push(x)</code>：加一個在最後。</li></ul>`,
      choice('每張票的價格都要乘 2，得到新清單，用？', ['.map', '.push', '.length'], 0, 'map = 每個都加工一次。')),
    gate('<p>空格用選的：把每個價格都<b>乘 2</b>，用哪個工具？程式會真的執行。</p>', {
      type: 'blanks', title: '每個價格乘 2', code: 'const prices = [100, 200, 300];\nconst doubled = prices.⟦1⟧((p) => p * 2);\nconsole.log(doubled);',
      blanks: [{ options: ['map', 'filter', 'push'], answer: 0, hint: '每個都要加工（乘 2），清單數量不變。', why: 'map 對每一個東西做加工，回傳新清單。' }] }),
    gate('<p>再看 <code>filter</code>：只留下符合條件的。空格用選的。</p>', {
      type: 'blanks', title: '只留下大於 150 的', code: 'const prices = [100, 200, 300];\nconst big = prices.⟦1⟧((p) => p > 150);\nconsole.log(big);',
      blanks: [{ options: ['filter', 'map', 'length'], answer: 0, hint: '要「篩選」，只留符合條件的。', why: 'filter 留下條件成立的，其他丟掉。' }] }),
  ]),
  unit('nd0d', 4, 4, '非同步：等資料回來', [
    step(`<p>後端常常要「<b>等</b>」：查資料庫、打 API 都要花時間。程式不會卡在原地，而是先拿一張<b>承諾單（Promise）</b>，資料回來再接著做。</p><p><code>await</code> 的意思是：「請在這裡<b>等承諾兌現</b>，再往下」。用了 <code>await</code>，外面的函式要加 <code>async</code>。</p>`,
      choice('<code>await</code> 要寫在哪裡？', ['async 函式裡面', '隨便哪裡', '只能寫在檔案最上面'], 0, 'await 一定要在 async 函式裡。')),
    gate('<p>拼出「等 0.1 秒再印出訊息」。<b>依序點積木</b>：先做一個「等一下才給答案」的工具，再寫 async 函式，最後呼叫它。</p>', {
      type: 'blocks', title: '拼出 async / await',
      lines: [
        rline("const wait = () => new Promise((r) => setTimeout(() => r('資料來了'), 100));", '做一個要等 0.1 秒才給答案的工具（模擬查資料庫）。'),
        rline('async function main() {', '宣告 async 函式 main（裡面才能用 await）。'),
        rline('  const msg = await wait();', '等 wait 給答案，再把答案存進 msg。'),
        rline('  console.log(msg);', '印出答案。'),
        rline('}', '函式結尾。'),
        rline('main();', '呼叫 main，開始執行。'),
      ] }),
    step(`<p>忘了 <code>await</code> 會拿到「承諾單」本身，而不是資料：</p>${pre("const msg = wait();      // ❌ 拿到 Promise { <pending> }\nconst msg = await wait(); // ✅ 拿到 '資料來了'")}<p>印出 <code>Promise { &lt;pending&gt; }</code> = 忘了 await。</p>`,
      choice('印出 <code>Promise { &lt;pending&gt; }</code>，最可能是？', ['忘了 await', '忘了 return', '忘了分號'], 0, '還沒等到答案，就直接拿來用。')),
  ]),
], [
  ['後端沒有畫面，想看結果用？', ['console.log', 'alert', '雙擊'], 0, 'console.log。'],
  ['函式要把答案交出來用？', ['return', 'print', 'await'], 0, 'return。'],
  ['每個價格都加工一次，用？', ['.map', '.push', '.length'], 0, 'map。'],
  ['<code>await</code> 要寫在？', ['async 函式裡', '任何地方', '只能在最上面'], 0, 'async 函式裡。'],
], { npc: 'lead', mood: 'happy', text: '我的函式明明有算，印出來卻是 undefined。', options: [{ label: '問他：函式裡有沒有 return？', fx: { team: 8, quality: 6, stress: 2 } }, { label: '叫他重開機', fx: { team: -4, quality: -2 } }] });

/* ================================ Python（結果是事先寫好的，已用 python3 核對） ================================ */
const PY = mk('py', 'Python', [
  unit('py0a', 1, 4, 'print 和變數', [
    step(`<p>Python 很好讀，像在寫英文。用 <code>print</code> 印出東西；變數<b>直接取名字、用等號放東西</b>，不用先宣告：</p>${pre("price = 3800\ntitle = '星光演唱會'\nprint(title, price)")}`,
      choice('Python 印出東西用？', ['print()', 'console.log()', 'echo()'], 0, 'print。')),
    gate('<p>依序點積木：先建立兩個變數，再印出來。拼對會顯示執行結果。</p>', {
      type: 'blocks', title: '拼出 Python 小程式', output: '星光演唱會 3800',
      lines: [
        rline("title = '星光演唱會'", '把文字存進變數 title。'),
        rline('price = 3800', '把數字存進變數 price。'),
        rline('print(title, price)', '印出兩個變數，中間自動空一格。'),
      ] }),
    step(`<p>跟 JavaScript 比一比：</p><table class="tbl"><tr><th></th><th>JavaScript</th><th>Python</th></tr><tr><td>印出</td><td><code>console.log(x)</code></td><td><code>print(x)</code></td></tr><tr><td>建立變數</td><td><code>const x = 1;</code></td><td><code>x = 1</code></td></tr><tr><td>結尾</td><td>分號 ;</td><td>不用</td></tr></table>`,
      choice('Python 建立變數要寫 const 或 let 嗎？', ['不用，直接 x = 1', '要寫 const', '要寫 var'], 0, '直接寫名字、等號、值。')),
  ]),
  unit('py0b', 2, 4, 'f-string：把變數塞進句子', [
    step(`<p>想印「買了 2 張，共 7600 元」，數字是變數算出來的。在字串前面加一個 <code>f</code>，就可以在字串裡用 <code>{ }</code> 塞變數：</p>${pre("qty = 2\nprint(f'買了 {qty} 張，共 {qty * 3800} 元')")}`,
      choice('<code>f\'共 {price} 元\'</code> 的 <code>f</code> 讓字串能做什麼？', ['用 { } 塞入變數的值', '把字變大', '加粗'], 0, 'f-string。')),
    gate('<p>補空格：要讓 <code>{total}</code> 被換成變數的值，字串前面要加什麼？</p>', {
      type: 'blanks', title: '補完 f-string', code: "total = 7600\nprint(⟦1⟧'總價 {total}')", output: '總價 7600',
      blanks: [{ options: ['f', 'x', 'p'], answer: 0, hint: '就是 format 的第一個字母。', why: '字串前面加 f，大括號裡的變數才會被換成值。' }] }),
    gate('<p>看看<b>忘了 f</b> 會怎樣。</p>', {
      type: 'explore', title: 'f 有沒有差別', gate: true,
      items: [
        { label: '有 f ✅', code: "total = 7600\nprint(f'總價 {total}')", result: '<pre>總價 7600</pre>', note: '變數被換成 7600。' },
        { label: '忘了 f ❌', code: "total = 7600\nprint('總價 {total}')", result: '<pre>總價 {total}</pre>', note: '沒有 f，大括號原封不動印出來。看到畫面印出大括號，就是忘了 f。' },
      ] }),
  ]),
  unit('py0c', 3, 4, '縮排：Python 最特別的地方', [
    step(`<p>JavaScript 用大括號 <code>{ }</code> 圈出「這幾行是同一塊」。Python <b>沒有大括號</b>，改用<b>縮排</b>（往右空 4 格）。</p>${pre("if price > 3000:\n    print('比較貴')   # 縮排：屬於 if 裡面\nprint('結束')         # 沒縮排：if 外面")}<p>冒號 <code>:</code> 代表「底下縮排的是這一塊」。</p>`,
      choice('Python 用什麼表示「這幾行是同一塊」？', ['縮排', '大括號', '分號'], 0, '縮排。')),
    gate('<p>點每個按鈕，看縮排對不對。</p>', {
      type: 'explore', title: '縮排的影響', gate: true,
      items: [
        { label: '縮排正確 ✅', code: "price = 3800\nif price > 3000:\n    print('比較貴')\nprint('結束')", result: '<pre>比較貴\n結束</pre>', note: '價格大於 3000，所以印出「比較貴」，最後印出「結束」。' },
        { label: '條件不成立', code: "price = 100\nif price > 3000:\n    print('比較貴')\nprint('結束')", result: '<pre>結束</pre>', note: 'if 裡面的整塊都不跑，只有沒縮排的「結束」會印。' },
        { label: '忘了縮排 ❌', code: "price = 3800\nif price > 3000:\nprint('比較貴')", result: '<pre>IndentationError: expected an indented block after \'if\' statement on line 2</pre>', note: '白話：「if 後面應該要縮排，你沒縮」。Python 一看到冒號就期待下一行縮排。' },
      ] }),
    step(`<p>三個小規則：</p><ol><li>冒號 <code>:</code> 後面換行要縮排 4 格。</li><li>同一塊裡的每一行縮排都要一樣。</li><li>看到 <code>IndentationError</code>，就是縮排有問題。</li></ol>`,
      choice('看到 <code>IndentationError</code>，要查？', ['縮排', '拼字', '網路'], 0, 'Indentation = 縮排。')),
  ]),
  unit('py0d', 4, 4, 'list 和 for：一排資料一個一個處理', [
    step(`<p><b>list</b>（清單）用中括號，裝一排東西，位置從 <b>0</b> 開始算。<b>for</b> 讓你把清單裡的東西一個一個拿出來處理：</p>${pre("seats = ['A1', 'A2', 'A3']\nprint(seats[0])        # A1（第一個是 0）\nfor s in seats:\n    print(s)")}`,
      choice('<code>seats = [\'A1\', \'A2\', \'A3\']</code>，<code>seats[0]</code> 是？', ['A1', 'A2', '0'], 0, '位置從 0 開始。')),
    gate('<p>依序點積木，印出每一個座位。注意 <code>print(s)</code> 要縮排，它會跟著 for 重複。</p>', {
      type: 'blocks', title: '拼出 for 迴圈', output: 'A1\nA2\nA3',
      lines: [
        rline("seats = ['A1', 'A2', 'A3']", '先準備一個座位清單。'),
        rline('for s in seats:', '一個一個拿出來，每一次叫它 s，冒號後面要縮排。'),
        rline('    print(s)', '縮排 4 格，表示屬於 for：每一個 s 都印一次。'),
      ] }),
    step(`<p><b>dict</b>（字典）用大括號，一個「名字」對一個「值」，像一張資料卡：</p>${pre("ticket = {'title': '星光', 'price': 3800}\nprint(ticket['price'])   # 3800")}<p>用名字（key）找值。</p>`,
      choice('<code>ticket[\'price\']</code> 在做什麼？', ['用名字取出 dict 裡的值', '把 ticket 刪掉', '建立新清單'], 0, '用 key 找值。')),
  ]),
], [
  ['Python 印出東西用？', ['print()', 'echo', 'console.log'], 0, 'print。'],
  ['f-string 的 f 要加在？', ['引號前面', '引號後面', '變數後面'], 0, 'f\'...\'。'],
  ['Python 用什麼圈出一塊程式？', ['縮排', '大括號', '分號'], 0, '縮排。'],
  ['list 第一個的位置是？', ['0', '1', '-1'], 0, '從 0 開始。'],
], { npc: 'mate', mood: 'worried', text: '我的 Python 一直說 IndentationError，我什麼都沒動啊？', options: [{ label: '告訴他：冒號後面的那一行要縮排 4 格', fx: { team: 8, quality: 6, stress: 2 } }, { label: '叫他改用別的語言', fx: { team: -4, quality: -2 } }] });

export const INTRO = { ts: TS, tw: TW, rc: RC, vu: VU, nd: ND, py: PY };
