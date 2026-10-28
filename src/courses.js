// 課程資料：TypeScript、Tailwind 各 5 堂、分兩章。
// 每堂 = 幾個「小步驟（講解 + 即時小檢查）」+ 一個「總練習」；每章 = 章節測驗 + 小專案。
import { CHALLENGES } from './ts.js';
import { FE_COURSES, FE_EVENTS } from './courses-fe.js';
import { BE_COURSES, BE_EVENTS } from './courses-be.js';

const ch = (id) => CHALLENGES.find((c) => c.id === id);
const noAny = { test: (s) => !/:\s*any\b|\bas any\b|<any>|@ts-ignore|@ts-expect-error/.test(s), msg: '不可以用 any 或 @ts-ignore 矇混過去' };
const keep = (re, msg) => ({ test: (s) => re.test(s), msg });
const pre = (code) => `<pre>${code.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>`;
const choice = (q, options, answer, why) => ({ type: 'choice', q, options, answer, why });
const fill = (q, answers, why) => ({ type: 'fill', q, answers, why });

// Tailwind 練習：build(c) 產生 HTML，c 是各元素的 class；solution 是參考解答的 class
const tw = (o) => ({ kind: 'tw', ...o });
const ts = (o) => ({ kind: 'ts', rules: [noAny], ...o });

/* ============================ TypeScript ============================ */
const TS_L1 = {
  id: 'ts1', title: '第 1 堂　型別是什麼？',
  steps: [
    { say: `<p>JavaScript 的變數什麼都能放，很自由，但也很容易放錯。<b>TypeScript = JavaScript + 型別</b>：在變數名稱後面加 <code>: 型別</code>，告訴電腦「這裡只能放這種東西」。</p>${pre("let age: number = 18;\nlet name: string = '小明';")}`,
      check: choice('<code>let age: number = 18</code> 裡的 <code>number</code> 代表什麼？', ['變數的名字', '這個變數只能放數字', '這是一個函式'], 1, '對！冒號後面就是「型別」，number 表示只能放數字。') },
    { say: `<p>最常用的三個基本型別：</p><ul><li><code>string</code>：文字，要加引號，例如 <code>'星光演唱會'</code></li><li><code>number</code>：數字，例如 <code>3800</code></li><li><code>boolean</code>：只有 <code>true</code> 或 <code>false</code> 兩種，例如「是否售完」</li></ul>`,
      check: fill('用來存「是否售完」（true / false）的型別叫什麼？', ['boolean'], '就是 boolean（布林）。') },
    { say: `<p>型別的好處：<b>寫錯會馬上出現紅線</b>，不用等到網站壞掉才發現。</p>${pre("let price: number = '3800'; // 🔴 紅線：不能把文字放進 number")}<p>價格是數字，就別給它加引號。</p>`,
      check: choice('哪一行會出現紅線？', ["let a: string = 'hi';", "let b: number = '5';", 'let c: boolean = false;'], 1, '第二行把文字 \'5\' 放進了 number。') },
  ],
  final: ts({
    brief: '下面三行有兩行放錯了東西。修到沒有紅線（改值或改型別都可以）。',
    hint: '價格 <code>3800</code> 不要加引號；「是否售完」的值要是 <code>true</code> 或 <code>false</code>。',
    rules: [noAny, keep(/let price/, '請保留 price 這一行'), keep(/let soldOut/, '請保留 soldOut 這一行')],
    starter: "// 讓所有紅線消失\nlet title: string = '星光巡迴演唱會';\nlet price: number = '3800';\nlet soldOut: boolean = 'no';\n",
  }),
};

const TS_L2 = {
  id: 'ts2', title: '第 2 堂　用 interface 描述物件',
  steps: [
    { say: `<p>網站的資料常是「物件」，有好幾個欄位。<code>interface</code> 就是替物件畫一張「長相說明書」：</p>${pre("interface Seat {\n  id: string;\n  sold: boolean;\n}\n\nconst s: Seat = { id: 'A1', sold: false };")}`,
      check: choice('<code>interface</code> 的作用是什麼？', ['描述一個物件長什麼樣子', '執行一段程式', '畫出畫面'], 0, '對，它只負責「描述形狀」，不會執行。') },
    { say: `<p>物件要<b>剛剛好</b>符合說明書：少一個欄位、多一個欄位、欄位型別不對，都會紅線。</p>${pre("const s: Seat = { id: 'A1' }; // 🔴 少了 sold")}`,
      check: choice('<code>const s: Seat = { id: \'A1\' }</code> 錯在哪？', ['少了 sold 欄位', 'id 的型別錯了', '沒有錯'], 0, '說明書要求 sold，卻沒有給。') },
    { say: `<p>有的欄位可以不填，就在名稱後面加一個 <code>?</code>：</p>${pre("interface Seat {\n  id: string;\n  note?: string; // 可有可無\n}")}`,
      check: fill('想讓 note 欄位「可以不填」，要在名稱後面加什麼符號？', ['?', '？'], '加 ? 就變成可選欄位。') },
  ],
  final: { kind: 'ts', ...ch('event') },
};

const TS_L3 = {
  id: 'ts3', title: '第 3 堂　陣列與函式的型別',
  steps: [
    { say: `<p>陣列型別 = 「裡面東西的型別」加上 <code>[]</code>：</p>${pre("const ids: number[] = [1, 2, 3];\nconst names: string[] = ['A1', 'A2'];")}`,
      check: fill('存一排座位編號（文字）的陣列，型別怎麼寫？', ['string[]', 'Array<string>'], '文字的陣列：string[]。') },
    { say: `<p>函式要標兩種型別：<b>參數</b>（括號裡）和<b>回傳值</b>（括號後面）：</p>${pre("function add(a: number, b: number): number {\n  return a + b;\n}")}`,
      check: choice('括號後面那個 <code>: number</code> 代表什麼？', ['第二個參數', '這個函式會回傳 number', '函式的名字'], 1, '對，回傳值一定要是 number。') },
    { say: `<p>呼叫時傳錯型別，也會紅線：</p>${pre("add(1, 2);     // ✅\nadd('1', 2);   // 🔴 第一個應該是 number")}`,
      check: choice('哪個呼叫會紅線？', ['add(3, 4)', "add('3', 4)", 'add(0, 0)'], 1, '第一個參數給了文字。') },
  ],
  final: { kind: 'ts', ...ch('cart') },
};

const TS_L4 = {
  id: 'ts4', title: '第 4 堂　聯集型別與型別收窄',
  steps: [
    { say: `<p>一個值可能是好幾種型別？用 <code>|</code>（唸「或」）把型別串起來，叫<b>聯集型別</b>：</p>${pre("let id: number | string;\nid = 5;      // ✅\nid = 'A1';   // ✅")}`,
      check: choice('<code>let id: number | string</code> 可以放什麼？', ['只能放數字', '數字或文字都可以', '只能放文字'], 1, '| 就是「或」。') },
    { say: `<p>聯集也能把值限制成<b>幾個固定的文字</b>，很適合「狀態」：</p>${pre("type SeatStatus = 'free' | 'picked' | 'sold';")}<p>這樣 <code>status = 'abc'</code> 就會紅線。</p>`,
      check: fill("想讓 type X 只能是 'a' 或 'b'，寫成 <code>type X = 'a' ___ 'b'</code>，空格填什麼符號？", ['|'], '用 | 串起來。') },
    { say: `<p>聯集的值可能是兩種型別，所以<b>不能直接用某一種的功能</b>。要先用 <code>typeof</code> 判斷，TypeScript 才知道現在是哪一種（<b>型別收窄</b>）：</p>${pre("function show(v: number | string) {\n  if (typeof v === 'string') return v;     // 這裡 v 是 string\n  return v.toFixed(0);                      // 這裡 v 是 number\n}")}`,
      check: choice('為什麼要先寫 <code>typeof</code> 判斷？', ['讓程式跑比較快', '確定值是哪一種型別，才能用那種型別的功能', '因為 JavaScript 規定'], 1, '先收窄，才不會對文字呼叫數字的功能。') },
  ],
  final: { kind: 'ts', ...ch('narrow') },
};

const TS_L5 = {
  id: 'ts5', title: '第 5 堂　泛型與 React 的型別',
  steps: [
    { say: `<p><b>泛型</b>像一個「待填的型別」，習慣寫成 <code>T</code>。你傳什麼進去，T 就變成什麼：</p>${pre("function first<T>(items: T[]): T {\n  return items[0];\n}\nfirst([1, 2, 3]);   // T 是 number\nfirst(['a', 'b']);  // T 是 string")}`,
      check: choice("<code>first(['a', 'b'])</code> 回傳的型別是什麼？", ['number', 'string', 'boolean'], 1, '傳入 string[]，所以 T 是 string。') },
    { say: `<p>在 React 裡，元件接收的資料叫 <b>props</b>，也用 interface 描述：</p>${pre("interface CardProps {\n  title: string;\n  price: number;\n}\n\nfunction Card({ title, price }: CardProps) {\n  return <p>{title} NT$ {price}</p>;\n}")}`,
      check: choice('<code>CardProps</code> 在這裡的作用是？', ['規定 Card 元件要收到哪些資料、型別是什麼', '讓元件變漂亮', '連接資料庫'], 0, '對，用錯會立刻紅線。') },
    { say: `<p><code>useState</code> 也是泛型。尖括號裡放狀態的型別：</p>${pre("const [picked, setPicked] = useState<string[]>([]);  // 一開始是空陣列，但說好之後放文字")}`,
      check: fill('想用 useState 存「座位編號（文字）的陣列」，寫成 <code>useState&lt;___&gt;([])</code>，空格填什麼？', ['string[]'], '就是 string[]。') },
  ],
  final: { kind: 'ts', ...ch('generic') },
};

const TS_QUIZ1 = [
  choice("<code>let n: number = 'a'</code> 會發生什麼事？", ['沒事', '出現紅線（型別不符）', '網站當機'], 1, '文字不能放進 number。'),
  choice('<code>interface</code> 是用來做什麼的？', ['描述物件的形狀', '寫迴圈', '連網路'], 0),
  fill('「文字的陣列」型別怎麼寫？（用 [] 的寫法）', ['string[]'], 'string[]'),
  choice('<code>function f(x: string): number</code>，哪個回傳是合法的？', ["return 'a'", 'return 1', 'return true'], 1, '回傳值要是 number。'),
];
const TS_QUIZ2 = [
  choice('<code>let id: number | string</code> 能放什麼？', ['只能數字', '數字或文字', '只能文字'], 1),
  choice('對 <code>number | string</code> 直接呼叫 <code>toFixed()</code> 為什麼紅線？', ['字串沒有 toFixed，要先用 typeof 判斷', 'toFixed 不存在', '數字太長'], 0),
  fill('<code>Array&lt;___&gt;</code> 等同於 <code>string[]</code>，空格填？', ['string']),
  choice('<code>function first&lt;T&gt;(items: T[]): T</code>，傳入 <code>number[]</code>，回傳什麼型別？', ['number', 'string', 'T'], 0, 'T 會變成 number。'),
];

const TS_P1 = ts({
  brief: '專案：購物車商品。① 定義 <code>interface Item</code>（name 文字、price 數字、qty 數字、note 可以不填的文字）② 讓下面的程式沒有紅線。',
  hint: '可不填的欄位要加 <code>?</code>，像 <code>note?: string;</code>。',
  rules: [noAny, keep(/interface Item/, '請保留 interface Item'), keep(/note\?\s*:/, 'note 要是可省略欄位（note?: ...）')],
  starter: `interface Item {
  // TODO: 定義 name、price、qty、note
}

const items: Item[] = [
  { name: '星光演唱會', price: 3800, qty: 2 },
  { name: '周邊 T-shirt', price: 650, qty: 1, note: '尺寸 M' },
];

function lineTotal(item: Item): number {
  return item.price * item.qty;
}

const first: number = lineTotal(items[0]);
`,
});
const TS_P2 = ts({
  brief: '專案：座位表。每一列是「座位編號（文字）的陣列」，整張表是「列的陣列」。修好三處型別。',
  hint: '一列是 <code>string[]</code>，整張表是「一列的陣列」＝ <code>string[][]</code>。',
  rules: [noAny, keep(/function countSeats/, '請保留 countSeats 函式')],
  starter: `const rows: string = [['A1', 'A2', 'A3'], ['B1', 'B2', 'B3']]; // TODO: 型別寫錯了

function countSeats(table: string[][]): number {
  return table.length * 3;
}

const firstRow: number[] = rows[0]; // TODO
const total: string = countSeats(rows); // TODO
`,
});
const TS_P3 = ts({
  brief: '專案：API 回應。伺服器回傳可能成功或失敗。讓 <code>ApiResult</code> 同時接受兩種，修掉紅線。',
  hint: '用 <code>|</code> 把兩個 interface 串起來：<code>type ApiResult = Ok | Fail;</code>。',
  rules: [noAny, keep(/function describe/, '請保留 describe 函式')],
  starter: `interface Ok { status: 'ok'; data: string[]; }
interface Fail { status: 'error'; message: string; }

type ApiResult = Ok; // TODO: 應該是「成功或失敗」

function describe(r: ApiResult): string {
  if (r.status === 'ok') return '共 ' + r.data.length + ' 筆';
  return r.message;
}

const a: ApiResult = { status: 'ok', data: ['A1', 'A2'] };
const b: ApiResult = { status: 'error', message: '連線逾時' };
`,
});
const TS_P4 = ts({
  brief: '專案：泛型盒子。<code>Box&lt;T&gt;</code> 裝一個任意型別的值。修好兩處型別對不上的地方。',
  hint: '<code>Box&lt;string&gt;</code> 的 value 要是文字；<code>unbox(seatsBox)</code> 回傳的是 <code>string[]</code>。',
  rules: [noAny, keep(/interface Box<T>/, '請保留 interface Box<T>'), keep(/function unbox/, '請保留 unbox 函式')],
  starter: `interface Box<T> {
  value: T;
}

const nameBox: Box<string> = { value: 123 }; // TODO
const seatsBox: Box<string[]> = { value: ['A1', 'A2'] };

function unbox<T>(b: Box<T>): T {
  return b.value;
}

const n: number = unbox(seatsBox); // TODO
`,
});

/* ============================ Tailwind ============================ */
const W1 = {
  id: 'tw1', title: '第 1 堂　Tailwind 是什麼？',
  steps: [
    { say: `<p>平常寫 CSS，要另外開一個檔案寫規則。<b>Tailwind 把每個小樣式做成一個現成的 class</b>，直接寫在標籤的 <code>class</code>（React 裡是 <code>className</code>）：</p>${pre('<h1 class="text-lg font-bold">活動標題</h1>')}<p><code>text-lg</code> = 字大一點，<code>font-bold</code> = 粗體。像貼貼紙一樣，要什麼貼什麼。</p>`,
      check: choice('想要「粗體字」，加哪個 class？', ['font-bold', 'bold', 'text-bold'], 0, 'font-bold 是粗體。') },
    { say: `<p>字的大小用 <code>text-</code> 開頭：</p><table><tr><td><code>text-sm</code></td><td>14px</td></tr><tr><td><code>text-base</code></td><td>16px（預設）</td></tr><tr><td><code>text-lg</code></td><td>18px</td></tr><tr><td><code>text-xl</code></td><td>20px</td></tr><tr><td><code>text-2xl</code></td><td>24px</td></tr></table>`,
      check: fill('16px 的字級 class 是什麼？', ['text-base'], 'text-base。') },
    { say: `<p>多個 class 用<b>空格</b>隔開，一起生效：</p>${pre('<h1 class="text-2xl font-bold">活動標題</h1>')}<p>順序不重要，也不用逗號。</p>`,
      check: choice('哪個寫法是對的？', ['class="text-2xl, font-bold"', 'class="text-2xl font-bold"', 'class="text-2xl+font-bold"'], 1, '用空格隔開。') },
  ],
  final: tw({
    brief: '讓標題變成：字級 24px、粗體。（右邊「目標」是做好的樣子）',
    hint: '24px = <code>text-2xl</code>；粗體 = <code>font-bold</code>。寫在 <code>class="…"</code> 的引號裡，用空格隔開。',
    build: (c) => `<h1 id="t" class="${c.t || ''}">星光巡迴演唱會</h1>`,
    solution: { t: 'text-2xl font-bold' },
    checks: [{ sel: '#t', props: ['font-size', 'font-weight'] }],
  }),
};

const W2 = {
  id: 'tw2', title: '第 2 堂　間距與尺寸',
  steps: [
    { say: `<p>Tailwind 的間距有一個口訣：<b>數字 × 4 = px</b>。</p><ul><li><code>p-1</code> = 4px、<code>p-2</code> = 8px、<code>p-3</code> = 12px、<code>p-4</code> = 16px、<code>p-6</code> = 24px</li></ul><p><code>p</code> 是內距（padding，內容和邊框的距離）。</p>`,
      check: fill('12px 的內距，class 是什麼？', ['p-3'], '12 ÷ 4 = 3，所以 p-3。') },
    { say: `<p>方向與種類：</p><ul><li><code>p</code> 內距、<code>m</code> 外距（margin，和別人的距離）</li><li>加方向：<code>x</code> 左右、<code>y</code> 上下、<code>t</code> 上、<code>b</code> 下、<code>l</code> 左、<code>r</code> 右</li><li>例：<code>px-4</code> 左右內距 16px，<code>mt-2</code> 上外距 8px</li></ul>`,
      check: choice('只想要「上方外距 8px」，用哪個？', ['mt-2', 'pt-2', 'm-2'], 0, 'm = 外距，t = 上，2 = 8px。') },
    { say: `<p>寬高：<code>w-</code> 寬、<code>h-</code> 高，同樣數字 × 4：<code>w-32</code> = 128px、<code>h-10</code> = 40px。滿版用 <code>w-full</code>。</p>`,
      check: fill('高度 40px，class 是什麼？', ['h-10'], '40 ÷ 4 = 10。') },
  ],
  final: tw({
    brief: '讓按鈕：左右內距 16px、上下內距 8px、上方外距 8px、寬度 128px。',
    hint: '16px=<code>px-4</code>；8px=<code>py-2</code>；上方外距 8px=<code>mt-2</code>；128px=<code>w-32</code>。',
    build: (c) => `<button id="t" class="bg-gray-200 ${c.t || ''}">立即購票</button>`,
    solution: { t: 'px-4 py-2 mt-2 w-32' },
    checks: [{ sel: '#t', props: ['padding-left', 'padding-top', 'margin-top', 'width'] }],
  }),
};

const W3 = {
  id: 'tw3', title: '第 3 堂　顏色、邊框、圓角',
  steps: [
    { say: `<p>顏色 = <code>前綴-色名-深淺</code>。前綴 <code>bg-</code> 背景、<code>text-</code> 文字、<code>border-</code> 邊框。深淺 50（最淺）到 950（最深），500 是標準色：</p>${pre('<button class="bg-pink-500 text-white">購票</button>')}`,
      check: choice('想要「紅色背景、白字」？', ['bg-red-500 text-white', 'red-bg white-text', 'bg-white text-red-500'], 0, 'bg- 管背景，text- 管文字。') },
    { say: `<p>邊框與圓角：</p><ul><li><code>border</code> = 1px 邊框；<code>border-gray-300</code> = 邊框顏色</li><li><code>rounded</code> 小圓角、<code>rounded-md</code> 6px、<code>rounded-lg</code> 8px、<code>rounded-full</code> 全圓</li></ul>`,
      check: fill('圓角 8px，class 是什麼？', ['rounded-lg'], 'rounded-lg。') },
    { say: `<p>內建的值不夠用？用<b>中括號</b>自己指定任何值：</p>${pre('<div class="bg-[#e11d48] p-[10px] rounded-[var(--radius)]">')}<p>設計師給的色碼、設計變數都能直接放進去。</p>`,
      check: choice('想用設計師給的 <code>#e11d48</code> 當背景，怎麼寫？', ['bg-[#e11d48]', 'bg-#e11d48', 'background-e11d48'], 0, '中括號包起來。') },
  ],
  final: tw({
    brief: '做一張卡片：背景 pink-500、白字、1px 灰色邊框（gray-300）、圓角 8px、內距 16px。',
    hint: '<code>bg-pink-500 text-white border border-gray-300 rounded-lg p-4</code>（自己拼拼看，別直接抄）。',
    build: (c) => `<div id="t" class="${c.t || ''}">一張卡片<br>NT$ 3800</div>`,
    solution: { t: 'bg-pink-500 text-white border border-gray-300 rounded-lg p-4' },
    checks: [{ sel: '#t', props: ['background-color', 'color', 'border-top-width', 'border-top-color', 'border-top-left-radius', 'padding-top'] }],
  }),
};

const W4 = {
  id: 'tw4', title: '第 4 堂　Flex 與 Grid 排版',
  steps: [
    { say: `<p>想讓子元素<b>橫向排成一排</b>，在外層加 <code>flex</code>；想直排加 <code>flex flex-col</code>；元素之間的距離用 <code>gap-</code>（數字 × 4）：</p>${pre('<div class="flex gap-4">\n  <div>A</div><div>B</div>\n</div>')}`,
      check: fill('讓子元素橫向排列，外層要加哪個 class？', ['flex'], 'flex。') },
    { say: `<p>對齊：<code>justify-</code> 管<b>主軸</b>（橫排時是左右）、<code>items-</code> 管<b>交叉軸</b>（橫排時是上下）。</p><ul><li><code>justify-between</code>：頭尾貼邊、中間撐開</li><li><code>justify-center</code> / <code>items-center</code>：置中</li></ul>`,
      check: choice('想讓左右兩個元素「一個貼左、一個貼右」？', ['justify-between', 'items-center', 'gap-4'], 0, 'justify-between。') },
    { say: `<p>Grid 是格狀排版，很適合座位表：</p>${pre('<div class="grid grid-cols-5 gap-2">  <!-- 5 欄，間距 8px -->')}`,
      check: fill('想排成 3 欄，class 是 <code>grid-cols-?</code>，問號填什麼數字？', ['3', 'grid-cols-3'], 'grid-cols-3。') },
  ],
  final: tw({
    brief: '讓外層容器變成「5 欄格狀、間距 8px」，五個方塊就會排成一整排。',
    hint: '<code>grid grid-cols-5 gap-2</code>。',
    build: (c) => `<div id="t" class="${c.t || ''}">${'<div class="h-10 bg-gray-200 rounded"></div>'.repeat(5)}</div>`,
    solution: { t: 'grid grid-cols-5 gap-2' },
    checks: [{ sel: '#t', props: ['display', 'column-gap', 'grid-template-columns'] }],
  }),
};

const W5 = {
  id: 'tw5', title: '第 5 堂　狀態與響應式',
  steps: [
    { say: `<p>在 class 前面加<b>前綴</b>，表示「某個狀態才套用」。<code>hover:</code> = 滑鼠移上去：</p>${pre('<button class="bg-pink-500 hover:bg-pink-600">')}<p>平常是 pink-500，滑過去變深一點。</p>`,
      check: choice('<code>hover:bg-pink-600</code> 什麼時候生效？', ['一直都生效', '滑鼠移到上面時', '按下鍵盤時'], 1, 'hover = 滑鼠懸停。') },
    { say: `<p>還有 <code>disabled:</code>（按鈕被停用）、<code>focus:</code>（被點進去）、<code>aria-[pressed=true]:</code>（按下去的狀態，座位表會用）：</p>${pre('<button class="bg-pink-500 disabled:bg-gray-300">')}`,
      check: fill('按鈕被停用時變灰，寫成 <code>___:bg-gray-300</code>，空格填？', ['disabled'], 'disabled。') },
    { say: `<p>響應式：Tailwind 是「手機優先」。沒前綴 = 所有螢幕；<code>md:</code> = 螢幕寬 ≥ 768px 才套用：</p>${pre('<div class="w-full md:w-1/2">  <!-- 手機滿版，電腦半寬 -->')}`,
      check: choice('<code>md:w-1/2</code> 的意思？', ['螢幕寬 768px 以上時寬度變一半', '所有螢幕寬度都一半', '只在手機'], 0, 'md: 之後才生效。') },
  ],
  final: tw({
    brief: '這顆按鈕是「已售完」（disabled）。平常背景 pink-500、白字；但 disabled 時背景要變 gray-300、字變 gray-500。請用 <code>disabled:</code> 前綴。',
    hint: '<code>bg-pink-500 text-white disabled:bg-gray-300 disabled:text-gray-500</code>。',
    build: (c) => `<button id="t" disabled class="px-4 py-2 rounded-lg ${c.t || ''}">已售完</button>`,
    solution: { t: 'bg-pink-500 text-white disabled:bg-gray-300 disabled:text-gray-500' },
    checks: [{ sel: '#t', props: ['background-color', 'color'] }],
    must: [{ re: /disabled:bg-/, msg: '請用 disabled: 前綴來設定停用狀態' }],
  }),
};

const TW_QUIZ1 = [
  choice('16px 的內距是哪個 class？', ['p-2', 'p-4', 'p-16'], 1, '16 ÷ 4 = 4。'),
  fill('粗體的 class 是？', ['font-bold']),
  choice('怎麼用 Tailwind 寫背景色 <code>#e11d48</code>？', ['bg-[#e11d48]', 'bg-e11d48', 'color-#e11d48'], 0),
  choice('哪個圓角最接近 8px？', ['rounded-sm', 'rounded-lg', 'rounded-full'], 1),
];
const TW_QUIZ2 = [
  choice('讓子元素橫向排成一排，外層用？', ['block', 'flex', 'hidden'], 1),
  fill('5 欄的格狀排版 class 是 <code>grid-cols-?</code>，寫出完整 class：', ['grid-cols-5']),
  choice('滑鼠移上去才變色，用哪個前綴？', ['hover:', 'active:', 'md:'], 0),
  choice('<code>md:w-1/2</code> 的意思是？', ['螢幕 ≥ 768px 時寬度一半', '永遠寬度一半', '只在手機'], 0),
];

const TW_P1 = tw({
  brief: `專案：票券卡片。照規格幫四個元素加 class：
<table>
<tr><td><b>#card</b></td><td>1px 灰邊 gray-300、圓角 8px、內距 16px、寬 288px</td></tr>
<tr><td><b>#title</b></td><td>20px、粗體、下方外距 4px</td></tr>
<tr><td><b>#info</b></td><td>14px、灰字 gray-500、下方外距 12px</td></tr>
<tr><td><b>#btn</b></td><td>背景 pink-500、白字、圓角 8px、左右內距 16px、上下內距 8px</td></tr></table>`,
  hint: '288px = <code>w-72</code>；4px 外距 = <code>mb-1</code>；12px = <code>mb-3</code>。',
  build: (c) => `<div id="card" class="${c.card || ''}">
  <h2 id="title" class="${c.title || ''}">星光巡迴演唱會</h2>
  <p id="info" class="${c.info || ''}">2026-12-20 · 台北大巨蛋</p>
  <button id="btn" class="${c.btn || ''}">立即購票</button>
</div>`,
  solution: { card: 'border border-gray-300 rounded-lg p-4 w-72', title: 'text-xl font-bold mb-1', info: 'text-sm text-gray-500 mb-3', btn: 'bg-pink-500 text-white rounded-lg px-4 py-2' },
  checks: [
    { sel: '#card', props: ['border-top-width', 'border-top-color', 'border-top-left-radius', 'padding-top', 'width'] },
    { sel: '#title', props: ['font-size', 'font-weight', 'margin-bottom'] },
    { sel: '#info', props: ['font-size', 'color', 'margin-bottom'] },
    { sel: '#btn', props: ['background-color', 'color', 'border-top-left-radius', 'padding-left', 'padding-top'] },
  ],
});
const TW_P2 = tw({
  brief: `專案：座位三態。三顆座位按鈕都是：寬 56px、高 40px、1px 灰邊 gray-300、圓角 6px、背景白。
<br>只有 <b>#s2</b>（已選）背景變 pink-500、白字；<b>#s3</b>（已售）背景變 gray-300、字 gray-500。`,
  hint: '寬 56px=<code>w-14</code>、高 40px=<code>h-10</code>、圓角 6px=<code>rounded-md</code>。已選／已售請用 <code>aria-[pressed=true]:</code> 與 <code>disabled:</code> 前綴，三顆可以寫同一串 class。',
  build: (c) => `<div class="flex gap-2">
  <button id="s1" class="${c.s || ''}">A1</button>
  <button id="s2" aria-pressed="true" class="${c.s || ''}">A2</button>
  <button id="s3" disabled class="${c.s || ''}">A3</button>
</div>`,
  solution: { s: 'w-14 h-10 border border-gray-300 rounded-md bg-white aria-[pressed=true]:bg-pink-500 aria-[pressed=true]:text-white disabled:bg-gray-300 disabled:text-gray-500' },
  checks: ['#s1', '#s2', '#s3'].map((sel) => ({ sel, props: ['width', 'height', 'background-color', 'color', 'border-top-left-radius', 'border-top-width'] })),
  must: [{ re: /aria-\[pressed=true\]:/, msg: '已選狀態請用 aria-[pressed=true]: 前綴' }, { re: /disabled:/, msg: '已售狀態請用 disabled: 前綴' }],
});
const TW_P3 = tw({
  brief: `專案：結帳表單。
<table>
<tr><td><b>#form</b></td><td>直向 flex、間距 12px、寬 288px</td></tr>
<tr><td><b>#name、#email</b></td><td>1px 灰邊 gray-300、圓角 8px、左右內距 12px、上下內距 8px</td></tr>
<tr><td><b>#pay</b></td><td>背景 pink-500、白字、圓角 8px、左右 16px 上下 8px 內距</td></tr></table>`,
  hint: '直向 flex = <code>flex flex-col</code>；間距 12px = <code>gap-3</code>。',
  build: (c) => `<form id="form" class="${c.form || ''}">
  <input id="name" placeholder="姓名" class="${c.input || ''}">
  <input id="email" placeholder="Email" class="${c.input || ''}">
  <button id="pay" class="${c.pay || ''}">送出</button>
</form>`,
  solution: { form: 'flex flex-col gap-3 w-72', input: 'border border-gray-300 rounded-lg px-3 py-2', pay: 'bg-pink-500 text-white rounded-lg px-4 py-2' },
  checks: [
    { sel: '#form', props: ['display', 'flex-direction', 'row-gap', 'width'] },
    ...['#name', '#email'].map((sel) => ({ sel, props: ['border-top-width', 'border-top-color', 'border-top-left-radius', 'padding-left', 'padding-top'] })),
    { sel: '#pay', props: ['background-color', 'color', 'border-top-left-radius', 'padding-left', 'padding-top'] },
  ],
});

/* ============================ 章節與事件 ============================ */
const BASE_COURSES = [
  { id: 'ts', name: 'TypeScript', icon: '🟦', teacher: 'Lily 老師', chapters: [
    { id: 'ts-c1', title: '第一章　基礎型別', lessons: [TS_L1, TS_L2, TS_L3], quiz: TS_QUIZ1, projects: [TS_P1, TS_P2], event: 'ts-c1' },
    { id: 'ts-c2', title: '第二章　進階型別', lessons: [TS_L4, TS_L5], quiz: TS_QUIZ2, projects: [TS_P3, TS_P4], event: 'ts-c2' },
  ] },
  { id: 'tw', name: 'Tailwind CSS', icon: '🌬', teacher: 'Lily 老師', chapters: [
    { id: 'tw-c1', title: '第一章　基本語法', lessons: [W1, W2, W3], quiz: TW_QUIZ1, projects: [TW_P1], event: 'tw-c1' },
    { id: 'tw-c2', title: '第二章　排版與狀態', lessons: [W4, W5], quiz: TW_QUIZ2, projects: [TW_P2, TW_P3], event: 'tw-c2' },
  ] },
];
export const COURSES = [...BASE_COURSES, ...FE_COURSES, ...BE_COURSES];

// 通過章節測驗後，辦公室裡會有人帶著小事件來找你（頭上出現 💬）
export const COURSE_EVENTS = {
  ...FE_EVENTS,
  ...BE_EVENTS,
  'ts-c1': { npc: 'mate', mood: 'worried', text: '欸新人！我的 PR 裡到處都是 any，組長說要補型別……你剛學完，可以幫我看看嗎？',
    options: [{ label: '教他用 interface 描述資料，一起改', fx: { team: 8, quality: 6, stress: 4 } }, { label: '直接幫他全改好', fx: { quality: 6, stress: 8, team: 3 } }, { label: '說沒空', fx: { team: -6 } }] },
  'ts-c2': { npc: 'lead', mood: 'happy', text: '聽說你學會聯集型別和泛型了？這個 API 可能回傳成功或失敗，你覺得型別怎麼設計比較好？',
    options: [{ label: '用「成功 | 失敗」聯集，用 status 判斷', fx: { quality: 10, team: 5 } }, { label: '全部設成可選欄位就好', fx: { quality: -4 } }] },
  'tw-c1': { npc: 'designer', mood: 'happy', text: '哇，我看到你用 Tailwind 做的按鈕了，間距跟我設計的幾乎一樣！可以也幫我把票券卡片做成元件嗎？',
    options: [{ label: '好呀，用設計變數對齊', fx: { team: 8, quality: 6, stress: 4 } }, { label: '先把手上的做完', fx: { stress: -2, team: -2 } }] },
  'tw-c2': { npc: 'pm', mood: 'worried', text: '手機版看起來怪怪的……學過 Tailwind 的你，知道怎麼讓電腦版和手機版排得不一樣嗎？',
    options: [{ label: '用 md: 前綴，手機先排好再往上加', fx: { quality: 10, team: 4 } }, { label: '先放著，之後再說', fx: { quality: -4, team: -2 } }] },
};
