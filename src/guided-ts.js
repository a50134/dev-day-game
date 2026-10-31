// TypeScript「手把手專案：票券資料小工具」——從空白檔案，一步一步做到完整作品（8 小步）。
// 練習 kind 'ts'：用真正的 TypeScript 編譯器檢查紅線，再加上 rules 檢查有沒有照步驟寫。

const pre = (code) => `<pre>${code.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>`;
const choice = (q, options, answer, why) => ({ type: 'choice', q, options, answer, why });
const noAny = { test: (s) => !/:\s*any\b|\bas any\b|<any>|@ts-ignore|@ts-expect-error/.test(s), msg: '不可以用 any 或 @ts-ignore 矇混過去' };
const ts = (o) => ({ kind: 'ts', ...o, rules: [noAny, ...o.rules] });
// 規則只看「程式」，不看 // 註解（TODO 註解裡的範例不算數）
const nc = (s) => s.replace(/\/\/.*$/gm, '');
const k = (re, msg) => ({ test: (s) => re.test(nc(s)), msg });

/* ---------- 程式碼零件（每一步的起始檔和解答都由這些組成，確保前後一致） ---------- */
const V1 = `const title: string = '星光演唱會';
const price: number = 3800;
const sold: boolean = false;
`;
const ITF_B = `interface Ticket {
  id: number;
  title: string;
  price: number;
  sold: boolean;
}
`;
const ITF_S = `type Status = 'free' | 'picked' | 'sold';

interface Ticket {
  id: number;
  title: string;
  price: number;
  status: Status;
}
`;
const ITF_R = `type Status = 'free' | 'picked' | 'sold';

interface Ticket {
  readonly id: number;
  title: string;
  price: number;
  status: Status;
  note?: string;
}
`;
const ONE = `const ticket: Ticket = { id: 1, title: '星光演唱會', price: 3800, sold: false };
`;
const DATA_B = `const tickets: Ticket[] = [
  { id: 1, title: '星光演唱會', price: 3800, sold: false },
  { id: 2, title: '爵士之夜', price: 1800, sold: true },
  { id: 3, title: '搖滾音樂祭', price: 2600, sold: false },
];
`;
const DATA_S = `const tickets: Ticket[] = [
  { id: 1, title: '星光演唱會', price: 3800, status: 'free' },
  { id: 2, title: '爵士之夜', price: 1800, status: 'sold' },
  { id: 3, title: '搖滾音樂祭', price: 2600, status: 'picked' },
];
`;
const DATA_R = `const tickets: Ticket[] = [
  { id: 1, title: '星光演唱會', price: 3800, status: 'free', note: '前排座位' },
  { id: 2, title: '爵士之夜', price: 1800, status: 'sold' },
  { id: 3, title: '搖滾音樂祭', price: 2600, status: 'picked' },
];
`;
const F_TOTAL = `function totalPrice(list: Ticket[]): number {
  let sum = 0;
  for (let i = 0; i < list.length; i++) {
    sum = sum + list[i].price;
  }
  return sum;
}

const total: number = totalPrice(tickets);
`;
const F_FMT = `function formatId(id: number | string): string {
  if (typeof id === 'string') {
    return id.toUpperCase();
  }
  return 'No.' + id.toFixed(0);
}
`;
const F_NOTE = `function noteOf(t: Ticket): string {
  if (t.note === undefined) {
    return '沒有備註';
  }
  return t.note;
}
`;
const F_FIRST = `function firstOf<T>(items: T[]): T {
  return items[0];
}
`;

/* ---------- 各步的「完成樣子」 ---------- */
const SOL1 = `${V1}
console.log(title, price, sold);
`;
const SOL2 = `${ITF_B}
${ONE}
console.log(ticket);
`;
const SOL3 = `${ITF_B}
${DATA_B}
console.log(tickets.length);
`;
const SOL4 = `${ITF_B}
${DATA_B}
${F_TOTAL}
console.log(total);
`;
const SOL5 = `${ITF_S}
${DATA_S}
${F_TOTAL}
console.log(total);
`;
const SOL6 = `${ITF_S}
${DATA_S}
${F_TOTAL}
${F_FMT}
console.log(total, formatId(tickets[0].id), formatId('a12'));
`;
const SOL7 = `${ITF_R}
${DATA_R}
${F_TOTAL}
${F_FMT}
${F_NOTE}
console.log(total, formatId(tickets[0].id), noteOf(tickets[0]));
`;
const SOL8 = `${ITF_R}
${DATA_R}
${F_TOTAL}
${F_FMT}
${F_NOTE}
${F_FIRST}
const firstTicket: Ticket = firstOf(tickets);
const firstSeat: string = firstOf(['A1', 'A2', 'A3']);
console.log(total, formatId(firstTicket.id), noteOf(firstTicket), firstSeat);
`;

/* ---------- 各步的起始檔（上一步的完成樣子 + TODO） ---------- */
const S1 = `// 票券資料小工具——第 1 步：先把「一張票」的資料存進變數
// TODO 1: 寫 const title: string = '星光演唱會';   （票名是文字）
// TODO 2: 寫 const price: number = 3800;           （價格是數字）
// TODO 3: 寫 const sold: boolean = false;          （有沒有賣掉，是 true 或 false）

console.log(title, price, sold);
`;
const S2 = `${V1}
// TODO 1: 寫一張「票的說明書」interface Ticket：id（number）、title（string）、price（number）、sold（boolean）
// TODO 2: 用說明書做一張票：const ticket: Ticket = { id: 1, title: '星光演唱會', price: 3800, sold: false };
// TODO 3: 把最後一行改成 console.log(ticket);
console.log(title, price, sold);
`;
const S3 = `${ITF_B}
${ONE}
// TODO 1: 把上面那一行 const ticket 整行刪掉，改成一疊票：const tickets: Ticket[] = [ ... ];
// TODO 2: 陣列裡放 3 張票：原本的星光演唱會、{ id: 2, title: '爵士之夜', price: 1800, sold: true }、{ id: 3, title: '搖滾音樂祭', price: 2600, sold: false }
// TODO 3: 把最後一行改成 console.log(tickets.length);
console.log(ticket);
`;
const S4 = `${ITF_B}
${DATA_B}
// TODO 1: 寫函式 function totalPrice(list: Ticket[]): number { ... }，把每張票的 price 加起來再 return
// TODO 2: 呼叫它：const total: number = totalPrice(tickets);
// TODO 3: 把最後一行改成 console.log(total);
console.log(tickets.length);
`;
const S5 = `${ITF_B}
${DATA_B}
${F_TOTAL}
// TODO 1: 在 interface 上面寫 type Status = 'free' | 'picked' | 'sold';
// TODO 2: interface Ticket 裡，把 sold: boolean 換成 status: Status;
// TODO 3: 三張票的資料也要換：sold: false 換成 status: 'free'、sold: true 換成 status: 'sold'，最後一張改成 status: 'picked'
console.log(total);
`;
const S6 = `${ITF_S}
${DATA_S}
${F_TOTAL}
// TODO 1: 寫 function formatId(id: number | string): string，下面這個版本會紅線，因為字串沒有 toFixed
// TODO 2: 在 return 前面加 if (typeof id === 'string') { return id.toUpperCase(); }
function formatId(id: number | string): string {
  return 'No.' + id.toFixed(0);
}

console.log(total, formatId(tickets[0].id), formatId('a12'));
`;
const S7 = `${ITF_S.replace('  id: number;', '  id: number; // TODO 1: 前面加 readonly').replace('  status: Status;', '  status: Status;\n  // TODO 2: 加一個可以不填的 note（文字）')}
${DATA_S.replace("status: 'free' },", "status: 'free' }, // TODO 3: 第一張票加上 note: '前排座位'")}
${F_TOTAL}
${F_FMT}
// TODO 4: 寫 function noteOf(t: Ticket): string：沒有備註回傳 '沒有備註'，有就回傳備註
function noteOf(t: Ticket): string {
  return t.note;
}

console.log(total, formatId(tickets[0].id), noteOf(tickets[0]));
`;
const S8 = `${ITF_R}
${DATA_R}
${F_TOTAL}
${F_FMT}
${F_NOTE}
// TODO 1: 下面這個 firstOf 只能用在票券陣列。請改成泛型：function firstOf<T>(items: T[]): T
function firstOf(items: Ticket[]): Ticket {
  return items[0];
}

const firstTicket: Ticket = firstOf(tickets);
const firstSeat: string = firstOf(['A1', 'A2', 'A3']); // TODO 2: 這行會紅線，改成泛型就會好
console.log(total, formatId(firstTicket.id), noteOf(firstTicket), firstSeat);
`;

/* ---------- 規則（逐步累積） ---------- */
const R_ITF_B = [
  k(/interface Ticket\s*\{/, '請保留 interface Ticket'),
  k(/interface Ticket\s*\{[^}]*\bid:\s*number/, 'Ticket 要有 id: number'),
  k(/interface Ticket\s*\{[^}]*\btitle:\s*string/, 'Ticket 要有 title: string'),
  k(/interface Ticket\s*\{[^}]*\bprice:\s*number/, 'Ticket 要有 price: number'),
];
const R_SOLD = k(/interface Ticket\s*\{[^}]*\bsold:\s*boolean/, 'Ticket 要有 sold: boolean');
const R_ARR = [k(/const tickets:\s*Ticket\[\]\s*=/, '請寫 const tickets: Ticket[] = [ ... ]'), k(/(\bid:\s*\d[\s\S]*){3}/, 'tickets 裡要放 3 張票（id 1、2、3）')];
const R_TOTAL = [k(/function totalPrice\(list:\s*Ticket\[\]\):\s*number/, '請寫 function totalPrice(list: Ticket[]): number'), k(/list\[\w+\]\.price/, 'totalPrice 要用 list[i].price 把每張票的價格加起來'), k(/const total:\s*number\s*=\s*totalPrice\(tickets\)/, '請寫 const total: number = totalPrice(tickets);')];
const R_STATUS = [
  k(/type Status\s*=[^;]*'free'[^;]*'picked'[^;]*'sold'|type Status\s*=[^;]*'picked'[^;]*'free'[^;]*'sold'|type Status\s*=[^;]*'sold'[^;]*'free'[^;]*'picked'/, "請寫 type Status = 'free' | 'picked' | 'sold'（三種都要有）"),
  k(/interface Ticket\s*\{[^}]*\bstatus:\s*Status/, 'Ticket 裡要有 status: Status'),
  { test: (s) => !/\bsold:\s*(boolean|true|false)/.test(nc(s)), msg: '舊的 sold: boolean / sold: false 都要換成 status' },
];
const R_FMT = [k(/function formatId\(id:\s*number\s*\|\s*string\):\s*string/, '請寫 function formatId(id: number | string): string'), k(/typeof id/, '請用 typeof id 判斷型別（型別收窄）')];
const R_NOTE = [
  k(/interface Ticket\s*\{[^}]*\breadonly id:\s*number/, 'id 要加 readonly（readonly id: number）'),
  k(/interface Ticket\s*\{[^}]*\bnote\?:\s*string/, '請加可省略的欄位 note?: string'),
  k(/note:\s*'/, '第一張票要有 note: \'前排座位\''),
  k(/function noteOf\(t:\s*Ticket\):\s*string/, '請寫 function noteOf(t: Ticket): string'),
  k(/t\.note\s*===\s*undefined|t\.note\s*!==\s*undefined|t\.note\s*==\s*null|if\s*\(\s*!?t\.note\s*\)/, 'noteOf 要先判斷有沒有 note（例如 t.note === undefined）'),
];
const R_GEN = [k(/function firstOf<T>\(items:\s*T\[\]\):\s*T/, '請寫成泛型：function firstOf<T>(items: T[]): T'), k(/const firstSeat:\s*string\s*=\s*firstOf\(/, '請保留 const firstSeat: string = firstOf(...) 這一行')];

/* ---------- 進度地圖與單元 ---------- */
const STAGES = ['變數與基本型別：把一張票的資料存起來', 'interface：替「票」畫一張說明書', '陣列：一疊票券', '函式：算出總金額', '聯集型別：票的三種狀態', '型別收窄：處理「可能是兩種」的值', '可省略與唯讀：備註和編號', '泛型：萬用的小幫手'];
const progressMap = (n) => `<p><b>📍 專案進度：票券資料小工具</b>（我們從一個空白檔案，一步一步做到完整作品）</p><ol>${STAGES.map((t, i) => `<li>${i + 1 < n ? '✅' : i + 1 === n ? '👉 <b>' : '⬜'} ${t}${i + 1 === n ? '</b>' : ''}</li>`).join('')}</ol>`;
const gstep = (say, check) => ({ say, check });
const GW = (n, title, steps, fin) => ({ id: 'tsg' + n, title: `手把手 ${n}／8　${title}`, steps: steps.map((s, i) => (i === 0 ? { ...s, say: progressMap(n) + s.say } : s)), final: ts(fin) });

const TS_UNITS = [
  GW(1, '變數與基本型別：把一張票的資料存起來', [
    gstep(`<p><b>我們要做什麼？</b>做一個「票券資料小工具」：能存票、算總金額、分辨票的狀態。就像蓋房子，我們從打地基開始——先學會把<b>一張票的資料</b>存起來。</p><p><b>為什麼要有型別？</b>想像你在整理抽屜：一格放「文字」、一格放「數字」、一格放「是／否」。放錯格子，TypeScript 會在你寫的當下就用<b>紅線</b>提醒你，不用等網頁壞掉才發現。</p>`,
      choice('TypeScript 的「型別」最像什麼？', ['整理抽屜時，每一格只能放同一種東西', '把網頁變漂亮的顏色', '讓程式跑得更快'], 0, '型別規定每個資料格子裝什麼，放錯就紅線。')),
    gstep(`<p>三種最基本的型別：</p>${pre("const title: string = '星光演唱會';  // 文字，一定要有引號\nconst price: number = 3800;           // 數字，沒有引號\nconst sold: boolean = false;          // 是／否，只有 true 和 false")}<p>拆開看：<code>const</code> 是「宣告一個存放資料的名字」，<code>title</code> 是名字，<code>: string</code> 是「這格只能放文字」，<code>=</code> 後面是放進去的資料。這個「冒號加型別」就叫<b>型別標註</b>。</p>`,
      choice('<code>const price: number = 3800;</code> 裡的 <code>: number</code> 是什麼意思？', ['這個變數只能放數字', '價格要乘以 number', '把 3800 變成文字'], 0, '冒號後面的是型別標註，number 代表數字。')),
    gstep(`<p><b>常見的坑：</b>有引號的就是文字。<code>const price: number = '3800';</code> 會紅線，因為 <code>'3800'</code> 有引號，是文字不是數字。另外別忘了每行結尾的分號 <code>;</code>。</p><p><b>下一步預告：</b>現在一張票的資料散成三個變數，很難整理。第 2 步我們要用 <code>interface</code> 替「票」畫一張說明書，把它們收成一個東西。</p>`,
      choice('<code>const price: number = \'3800\';</code> 為什麼會紅線？', ['因為 \'3800\' 有引號，是文字', '因為 3800 太大', '因為少了 boolean'], 0, '有引號 = string，不能放進 number 的格子。')),
  ], {
    brief: '第 1 步：照 TODO 1～3，寫出 title（string）、price（number）、sold（boolean）三個有型別標註的變數，讓最後一行的 console.log 不再紅線。',
    hint: '格式：<code>const 名字: 型別 = 值;</code>。文字要引號、數字不要、布林是 true/false。',
    steps: [`TODO 1：把註解換成這一行<pre>const title: string = '星光演唱會';</pre>為什麼：票名是文字，要有引號，型別是 string。`, `TODO 2：下一行寫<pre>const price: number = 3800;</pre>為什麼：價格是數字，不加引號。`, `TODO 3：再寫<pre>const sold: boolean = false;</pre>為什麼：有沒有賣掉只有兩種答案，用 boolean。最後一行 console.log 本來就在，變數有了它就不紅線。最常犯的錯：把 3800 寫成 '3800'（加了引號變成文字）。`],
    starter: S1, solution: SOL1,
    rules: [k(/^const title:\s*string\s*=/m, '請寫 const title: string = ...'), k(/^const price:\s*number\s*=/m, '請寫 const price: number = ...'), k(/^const sold:\s*boolean\s*=/m, '請寫 const sold: boolean = ...')],
  }),
  GW(2, 'interface：替「票」畫一張說明書', [
    gstep(`<p><b>現在的問題：</b>一張票的資料散成三個變數（title、price、sold），票一多就亂了。我們想把它們<b>收成一個東西</b>：物件。</p><p>物件長得像一張表格：<code>{ id: 1, title: '星光演唱會', price: 3800, sold: false }</code>。但物件有可能少寫欄位、拼錯名字，所以要先有一張<b>說明書</b>規定「票必須長這樣」，這就是 <code>interface</code>。</p>`,
      choice('<code>interface</code> 的工作是什麼？', ['描述物件必須長什麼樣子', '執行一段程式', '把物件印出來'], 0, 'interface 只負責描述形狀，像一張表格的欄位說明。')),
    gstep(`<p>寫法：</p>${pre("interface Ticket {\n  id: number;\n  title: string;\n  price: number;\n  sold: boolean;\n}\n\nconst ticket: Ticket = { id: 1, title: '星光演唱會', price: 3800, sold: false };")}<p>拆開看：<code>interface Ticket</code> 是替說明書取名字（慣例用大寫開頭）。大括號裡每一行是「欄位名: 型別;」。下面 <code>const ticket: Ticket</code> 的意思是「ticket 這個東西必須符合 Ticket 說明書」。資料要<b>剛剛好</b>：少欄位、多欄位、型別不對，都會紅線。</p>`,
      choice('<code>const t: Ticket = { id: 1, title: \'A\', price: 100 };</code> 會怎樣？', ['紅線：少了 sold 欄位', '沒事', '紅線：id 不能是數字'], 0, '說明書有 sold，資料就一定要給。')),
    gstep(`<p><b>常見的坑：</b>① 欄位名拼錯（<code>titel</code>）；② 說明書裡每行結尾要 <code>;</code>；③ 說明書名字大寫 <code>Ticket</code>，使用的時候名字要一模一樣。</p><p><b>下一步預告：</b>一張票不夠用，第 3 步我們要把很多張票放進一個<b>陣列</b>，變成一疊票。</p>`,
      choice('interface 名字 <code>Ticket</code> 和使用時的 <code>: Ticket</code>，要？', ['一模一樣（包含大小寫）', '可以隨便寫', '一個大寫一個小寫'], 0, '名字對不上，TypeScript 就找不到那張說明書。')),
  ], {
    brief: '第 2 步：寫出 interface Ticket（id、title、price、sold），再用它做出一張票 ticket，並把最後一行改成 console.log(ticket)。',
    hint: '說明書的欄位要和資料一一對上：id number、title string、price number、sold boolean。',
    steps: [`TODO 1：寫說明書<pre>interface Ticket {\n  id: number;\n  title: string;\n  price: number;\n  sold: boolean;\n}</pre>為什麼：先規定「票」長什麼樣子，後面所有票都要照這個做。`, `TODO 2：做一張票<pre>const ticket: Ticket = { id: 1, title: '星光演唱會', price: 3800, sold: false };</pre>為什麼：把原本散開的三個資料收進一個物件。`, `TODO 3：最後一行改成<pre>console.log(ticket);</pre>為什麼：現在要看的是整張票。上面三個舊變數可以留著，也可以刪掉。最常犯的錯：欄位名稱和說明書不一樣（例如寫成 name），或漏了 sold。`],
    starter: S2, solution: SOL2,
    rules: [...R_ITF_B, R_SOLD, k(/const ticket:\s*Ticket\s*=/, '請寫 const ticket: Ticket = { ... }'), k(/console\.log\(ticket\)/, '最後一行請改成 console.log(ticket);')],
  }),
  GW(3, '陣列：一疊票券', [
    gstep(`<p><b>現在的問題：</b>演唱會不會只有一張票。我們需要<b>一疊票</b>——這就是<b>陣列</b>。陣列像一排置物櫃，每一格放一張票，格子有編號，從 <b>0</b> 開始數。</p><p>TypeScript 要知道「這排櫃子只能放 Ticket」，所以型別寫成 <code>Ticket[]</code>（Ticket 加一個中括號，念成「Ticket 陣列」）。</p>`,
      choice('「一疊票」的型別怎麼寫？', ['Ticket[]', 'Ticket.list', '[Ticket]票'], 0, '型別後面加 [] 就是陣列。')),
    gstep(`<p>寫法：</p>${pre("const tickets: Ticket[] = [\n  { id: 1, title: '星光演唱會', price: 3800, sold: false },\n  { id: 2, title: '爵士之夜', price: 1800, sold: true },\n];\n\ntickets.length;          // 2，有幾張票\ntickets[0].title;        // '星光演唱會'，第 0 格那張票的票名")}<p>拆開看：中括號 <code>[ ]</code> 裡每張票用逗號分開。<code>tickets.length</code> 是張數。<code>tickets[0]</code> 是第一張（<b>從 0 開始</b>），後面接 <code>.title</code> 就能取欄位。陣列裡的每張票，都要符合 Ticket 說明書，少欄位一樣紅線。</p>`,
      choice('<code>tickets[0]</code> 拿到的是？', ['第一張票', '第零張以外的票', '票的張數'], 0, '編號從 0 開始，tickets[0] 是第一張。')),
    gstep(`<p><b>常見的坑：</b>① 票和票之間漏了逗號；② 以為編號從 1 開始，結果 <code>tickets[3]</code> 其實不存在；③ 把 <code>Ticket[]</code> 寫成 <code>Ticket</code>（少了中括號）。</p><p><b>下一步預告：</b>有一疊票之後，我們要寫第一個<b>函式</b>：把所有票的價格加起來，算出總金額。</p>`,
      choice('3 張票放在陣列，最後一張要用？', ['tickets[2]', 'tickets[3]', 'tickets[last]'], 0, '編號 0、1、2，所以最後一張是 2。')),
  ], {
    brief: '第 3 步：把單張的 ticket 改成一疊票 tickets（Ticket[]），放 3 張票：星光演唱會、爵士之夜（賣掉了）、搖滾音樂祭，最後一行改成 console.log(tickets.length)。',
    hint: '用中括號包起來，每張票之間用逗號分開，型別寫 <code>Ticket[]</code>。',
    steps: [`TODO 1：把 <code>const ticket...</code> 那行刪掉，改成<pre>const tickets: Ticket[] = [\n  { id: 1, title: '星光演唱會', price: 3800, sold: false },\n];</pre>為什麼：原本那張票變成陣列的第一格。`, `TODO 2：在第一張後面（逗號後）再加兩張<pre>  { id: 2, title: '爵士之夜', price: 1800, sold: true },\n  { id: 3, title: '搖滾音樂祭', price: 2600, sold: false },</pre>為什麼：一疊票要有好幾張才有意思，之後要拿來算總額。`, `TODO 3：最後一行改成<pre>console.log(tickets.length);</pre>為什麼：舊的 ticket 已經不存在，不改會紅線。最常犯的錯：票和票中間漏逗號，或型別寫成 Ticket 而不是 Ticket[]。`],
    starter: S3, solution: SOL3,
    rules: [...R_ITF_B, R_SOLD, ...R_ARR, k(/console\.log\(tickets\.length\)/, '最後一行請改成 console.log(tickets.length);')],
  }),
  GW(4, '函式：算出總金額', [
    gstep(`<p><b>現在要做什麼？</b>算這疊票的<b>總金額</b>。這種「給資料、回答案」的事，要用<b>函式</b>。函式像一台果汁機：丟水果進去（參數），出來一杯果汁（回傳值）。</p><p>TypeScript 會要求你說清楚：<b>丟進去的是什麼型別、出來的是什麼型別</b>。這樣有人丟錯東西，立刻紅線。</p>`,
      choice('函式的「參數」像果汁機的什麼？', ['丟進去的水果', '出來的果汁', '機器的顏色'], 0, '參數是丟進函式的資料，回傳值是出來的結果。')),
    gstep(`<p>寫法：</p>${pre("function totalPrice(list: Ticket[]): number {\n  let sum = 0;\n  for (let i = 0; i < list.length; i++) {\n    sum = sum + list[i].price;\n  }\n  return sum;\n}\n\nconst total: number = totalPrice(tickets);")}<p>拆開看：<code>list: Ticket[]</code> 是參數（丟進去一疊票）；括號後面的 <code>: number</code> 是<b>回傳型別</b>（出來的是數字）。<code>let sum = 0</code> 是一個會變的累加器。<code>for</code> 從 0 開始，一格一格走完整個陣列，每走一格就把那張票的價格加到 sum。最後 <code>return sum</code> 把答案交出去。</p>`,
      choice('<code>function totalPrice(list: Ticket[]): number</code> 最後的 <code>: number</code> 代表？', ['這個函式回傳數字', '參數是數字', '函式叫 number'], 0, '參數括號後面的型別，是回傳值的型別。')),
    gstep(`<p><b>常見的坑：</b>① 回傳型別寫成 <code>string</code>，但 return 的是數字，會紅線；② 忘記 <code>return</code>；③ 迴圈條件寫成 <code>i &lt;= list.length</code>，會多走一格，拿到不存在的票。</p><p><b>下一步預告：</b>現在用 <code>sold: boolean</code> 只能分「賣掉／沒賣掉」，但票其實有三種狀態。第 5 步用<b>聯集型別</b>解決。</p>`,
      choice('函式宣告回傳 <code>number</code>，結果 <code>return \'abc\'</code>，會？', ['紅線：文字不是數字', '沒事', '自動變成 0'], 0, 'return 的東西要符合宣告的回傳型別。')),
  ], {
    brief: '第 4 步：寫 function totalPrice(list: Ticket[]): number，把每張票的 price 加起來回傳；再用 const total: number = totalPrice(tickets) 算出總額，最後一行印出 total。',
    hint: '先 <code>let sum = 0</code>，用 for 迴圈走過 list，每次 <code>sum = sum + list[i].price</code>，最後 return sum。',
    steps: [`TODO 1：寫函式外殼<pre>function totalPrice(list: Ticket[]): number {\n  let sum = 0;\n  return sum;\n}</pre>為什麼：先寫「丟進來一疊票、回傳數字」，型別對了再補細節。`, `接著把 <code>return sum</code> 前面補上迴圈<pre>  for (let i = 0; i < list.length; i++) {\n    sum = sum + list[i].price;\n  }</pre>為什麼：從第 0 張走到最後一張，一張一張把價格加進去。`, `TODO 2：函式下面呼叫<pre>const total: number = totalPrice(tickets);</pre>為什麼：把整疊 tickets 丟進去，答案存成 number。`, `TODO 3：最後一行改成<pre>console.log(total);</pre>最常犯的錯：迴圈寫成 <code>i &lt;= list.length</code>（多走一格），或忘了 return。`],
    starter: S4, solution: SOL4,
    rules: [...R_ITF_B, R_SOLD, ...R_ARR, ...R_TOTAL, k(/console\.log\(total\)/, '最後一行請改成 console.log(total);')],
  }),
  GW(5, '聯集型別：票的三種狀態', [
    gstep(`<p><b>現在的問題：</b>真實的票有三種狀態：<b>空位（free）</b>、<b>已選（picked，放在購物車還沒付錢）</b>、<b>已售出（sold）</b>。<code>boolean</code> 只有兩種答案，不夠用。</p><p>可以改成文字（string），但 string 什麼字都能放，打錯字（<code>'soldd'</code>）也不會有人發現。我們要的是「只能是這三個字其中一個」——這就是<b>聯集型別</b>。</p>`,
      choice('為什麼不直接用 string 當狀態？', ['打錯字也不會被發現', 'string 太貴', 'string 不能放中文'], 0, 'string 什麼都能放，聯集型別才能把選項鎖死。')),
    gstep(`<p>寫法：</p>${pre("type Status = 'free' | 'picked' | 'sold';\n\ninterface Ticket {\n  id: number;\n  title: string;\n  price: number;\n  status: Status;      // 取代原本的 sold: boolean\n}\n\nconst t: Ticket = { id: 1, title: 'A', price: 100, status: 'sold' };  // OK\n// status: 'soldd' 會紅線")}<p>拆開看：<code>type Status = ...</code> 是替一個型別取別名。中間的直線 <code>|</code> 念成「或」：Status 是 free 或 picked 或 sold。寫在引號裡的叫<b>字面值</b>，一個字都不能錯。這個改動要三處一起改：型別本身、interface 的欄位、每張票的資料。</p>`,
      choice('<code>type Status = \'free\' | \'picked\' | \'sold\'</code> 裡的 <code>|</code> 念成？', ['或', '而且', '除以'], 0, '聯集型別：值是其中一個就好。')),
    gstep(`<p><b>常見的坑：</b>① 只改了 interface，忘了改資料裡的 <code>sold: false</code>（紅線：多了欄位）；② 引號用中文全形；③ 拼字和 Status 定義不同。好消息是：紅線會告訴你每一個沒改到的地方，一個一個修就好。</p><p><b>下一步預告：</b>有了「可能是這個或那個」的型別後，用的時候要先判斷是哪一個。第 6 步學<b>型別收窄</b>。</p>`,
      choice('把 <code>sold: boolean</code> 改成 <code>status: Status</code> 後，資料裡還寫 <code>sold: false</code>，會？', ['紅線，要一起改', '沒事', '自動轉換'], 0, '資料要和新的說明書剛剛好對上。')),
  ], {
    brief: '第 5 步：用聯集型別取代 boolean。寫 type Status = \'free\' | \'picked\' | \'sold\'，Ticket 的 sold 換成 status: Status，三張票的資料也一起換（free、sold、picked）。',
    hint: '三處都要改：type Status、interface 欄位、每張票的資料。',
    steps: [`TODO 1：在 interface 上面寫<pre>type Status = 'free' | 'picked' | 'sold';</pre>為什麼：先定義「狀態只能是這三個字」。`, `TODO 2：interface Ticket 裡，把 <code>sold: boolean;</code> 換成<pre>  status: Status;</pre>為什麼：欄位名字和型別都換掉了。`, `TODO 3：三張票的資料改成<pre>{ id: 1, ..., status: 'free' },\n{ id: 2, ..., status: 'sold' },\n{ id: 3, ..., status: 'picked' },</pre>為什麼：資料要和新說明書一樣。最常犯的錯：漏改某一張票，或字寫成 'soldd'，紅線會指出來。`],
    starter: S5, solution: SOL5,
    rules: [...R_ITF_B, ...R_ARR, ...R_TOTAL, ...R_STATUS],
  }),
  GW(6, '型別收窄：處理「可能是兩種」的值', [
    gstep(`<p><b>現在的問題：</b>客服查票時，輸入的編號有時是數字 <code>1</code>，有時是座位文字 <code>'a12'</code>。我們要寫一個 <code>formatId</code>，參數型別是 <code>number | string</code>（數字<b>或</b>文字）。</p><p>麻煩來了：數字有 <code>toFixed</code>，文字沒有；文字有 <code>toUpperCase</code>，數字沒有。TypeScript 不確定你手上是哪一種，就<b>什麼都不讓你用</b>。要先確認，這叫<b>型別收窄</b>。</p>`,
      choice('參數是 <code>number | string</code>，直接呼叫 <code>id.toFixed(0)</code> 為什麼紅線？', ['可能是 string，string 沒有 toFixed', '因為 toFixed 不存在', '因為 id 是空的'], 0, '兩種可能裡有一種不支援，TypeScript 就不放行。')),
    gstep(`<p>寫法：</p>${pre("function formatId(id: number | string): string {\n  if (typeof id === 'string') {\n    return id.toUpperCase();   // 這裡 id 一定是 string\n  }\n  return 'No.' + id.toFixed(0); // 走到這裡，id 只剩 number\n}")}<p>拆開看：<code>typeof id === 'string'</code> 是問「id 是文字嗎？」。在 <code>if</code> 大括號裡面，TypeScript 就<b>知道</b> id 是文字，可以放心用 <code>toUpperCase</code>。因為 if 裡面已經 return，走到後面就只剩 number，所以 <code>toFixed</code> 也合法。範圍越問越小，就叫「收窄」。</p>`,
      choice('進到 <code>if (typeof id === \'string\') { ... }</code> 的大括號裡，id 是？', ['一定是 string', '還是 number 或 string', '一定是 number'], 0, '判斷成立的範圍內，TypeScript 把型別收窄成 string。')),
    gstep(`<p><b>常見的坑：</b>① 忘了 <code>return</code>，函式往下走，後面的 number 程式碼對 string 又紅線；② <code>typeof</code> 回傳的是文字，要用引號：<code>'string'</code>、<code>'number'</code>；③ 用 <code>===</code>（三個等號），別寫成一個等號。</p><p><b>下一步預告：</b>票有時候會有「備註」，有時候沒有；票號一旦發出就不該被改。第 7 步學<b>可省略欄位</b>和<b>唯讀</b>。</p>`,
      choice('<code>typeof id === \'number\'</code> 裡的 <code>\'number\'</code> 需要？', ['引號，因為 typeof 回傳的是文字', '不用引號', '要改成大寫'], 0, "typeof 的答案是一段文字，例如 'string'。")),
  ], {
    brief: '第 6 步：寫 formatId(id: number | string): string。如果 id 是文字，回傳大寫；如果是數字，回傳 \'No.\' 加上它。目前的版本直接用 toFixed 會紅線，用 typeof 收窄修好它。',
    hint: '在 return 前面加 <code>if (typeof id === \'string\') { return id.toUpperCase(); }</code>。',
    steps: [`TODO 1：這個函式已經寫好了外殼，目前只有 <code>return 'No.' + id.toFixed(0);</code>，會紅線。為什麼：id 可能是 string，string 沒有 toFixed。`, `TODO 2：在 return 前面加<pre>  if (typeof id === 'string') {\n    return id.toUpperCase();\n  }</pre>為什麼：先處理文字的情況並離開函式，後面就只剩數字了，toFixed 就合法。`, `檢查整個函式<pre>function formatId(id: number | string): string {\n  if (typeof id === 'string') {\n    return id.toUpperCase();\n  }\n  return 'No.' + id.toFixed(0);\n}</pre>最常犯的錯：'string' 忘了引號寫成 typeof id === string，或把 if 裡的 return 漏掉。`],
    starter: S6, solution: SOL6,
    rules: [...R_ITF_B, ...R_ARR, ...R_TOTAL, ...R_STATUS, ...R_FMT],
  }),
  GW(7, '可省略與唯讀：備註和編號', [
    gstep(`<p><b>現在的問題：</b>兩件事。① 有些票有備註（「前排座位」），大部分沒有，不該逼每張票都寫。② 票號 <code>id</code> 一旦發出就不能被偷偷改掉。</p><p>TypeScript 兩個小符號剛好解決：<code>?</code> 代表「可以不填」，<code>readonly</code> 代表「只能讀，不能改」。</p>`,
      choice('「備註可有可無」應該用哪個符號？', ['欄位名後面加 ?', '前面加 readonly', '型別改成 boolean'], 0, '? 代表可省略。')),
    gstep(`<p>寫法：</p>${pre("interface Ticket {\n  readonly id: number;   // 只能讀，不能改\n  title: string;\n  price: number;\n  status: Status;\n  note?: string;         // 可以不填\n}\n\nfunction noteOf(t: Ticket): string {\n  if (t.note === undefined) {\n    return '沒有備註';\n  }\n  return t.note;\n}")}<p>拆開看：<code>readonly id</code> 之後，寫 <code>t.id = 99</code> 就會紅線。<code>note?: string</code> 的實際型別是「string 或 undefined」（沒填就是 undefined，「什麼都沒有」）。所以用的時候要先<b>收窄</b>：先問 <code>=== undefined</code>，沒有就先離開，後面才安全。這跟上一步是同一招。</p>`,
      choice('<code>note?: string</code> 沒填的時候，值是？', ['undefined（什麼都沒有）', '空字串', '0'], 0, '可省略欄位沒填，就是 undefined。')),
    gstep(`<p><b>常見的坑：</b>① 把 <code>?</code> 放錯位置：要緊接在欄位名後面、冒號前面（<code>note?: string</code>）；② 直接 <code>return t.note</code>，但它可能是 undefined，函式又說要回傳 string，所以紅線，要先判斷；③ <code>readonly</code> 寫在欄位名前面，不是型別後面。</p><p><b>下一步預告：</b>最後一步！把「取第一個元素」做成對任何型別都能用的<b>泛型</b>小幫手，收尾。</p>`,
      choice('<code>return t.note;</code> 在函式回傳 string 時為什麼紅線？', ['note 可能是 undefined', 'note 不存在', 'return 不能用在 interface'], 0, '沒收窄之前，note 的型別是 string | undefined。')),
  ], {
    brief: '第 7 步：① id 加 readonly；② 加可省略的 note?: string，並替第一張票加上 note: \'前排座位\'；③ 修好 noteOf：沒有備註就回傳「沒有備註」，有就回傳備註。',
    hint: '<code>readonly</code> 寫在欄位名前面，<code>?</code> 寫在欄位名後面。noteOf 要先判斷 undefined。',
    steps: [`TODO 1：interface 裡把 <code>id: number;</code> 改成<pre>  readonly id: number;</pre>為什麼：票號發出後不能被改。`, `TODO 2：status 下面加<pre>  note?: string;</pre>為什麼：備註可有可無，所以加 ?。`, `TODO 3：第一張票最後加<pre>note: '前排座位'</pre>為什麼：讓第一張票有備註（要放在 status: 'free' 後面，記得加逗號），另外兩張不用寫。`, `TODO 4：把 noteOf 改成<pre>function noteOf(t: Ticket): string {\n  if (t.note === undefined) {\n    return '沒有備註';\n  }\n  return t.note;\n}</pre>為什麼：直接 return t.note 可能是 undefined，先判斷並離開，後面就是 string。最常犯的錯：<code>?</code> 寫在冒號後面（<code>note: ?string</code>），或忘了判斷 undefined。`],
    starter: S7, solution: SOL7,
    rules: [...R_ITF_B.slice(0, 1), ...R_ARR, ...R_TOTAL, ...R_STATUS, ...R_FMT, ...R_NOTE],
  }),
  GW(8, '泛型：萬用的小幫手', [
    gstep(`<p><b>最後一個工具：泛型。</b>我們想寫一個 <code>firstOf</code>：拿陣列的第一個元素。拿票券陣列時，答案是 Ticket；拿座位編號陣列，答案是 string。難道要寫很多個函式嗎？</p><p>泛型像<b>萬用盒子</b>：盒子上寫「T」，意思是「裡面放什麼型別，之後再決定」。丟進去的是什麼，出來的就是什麼，型別不會丟失。</p>`,
      choice('泛型最適合解決什麼問題？', ['同一套邏輯想用在不同型別', '讓程式變慢', '取代變數'], 0, '一份程式碼，搭配不同的型別使用。')),
    gstep(`<p>寫法：</p>${pre("function firstOf<T>(items: T[]): T {\n  return items[0];\n}\n\nconst firstTicket: Ticket = firstOf(tickets);          // T 是 Ticket\nconst firstSeat: string = firstOf(['A1', 'A2', 'A3']); // T 是 string")}<p>拆開看：函式名後面的 <code>&lt;T&gt;</code> 是「宣告有一個待決定的型別叫 T」（名字可以換，但 T 是慣例）。<code>items: T[]</code> 是「T 的陣列」，<code>: T</code> 是「回傳一個 T」。呼叫時 TypeScript 自己看你丟什麼，就把 T 換成什麼，不需要自己寫。</p>`,
      choice('<code>firstOf([1, 2, 3])</code> 的回傳型別是？', ['number', 'T', 'string'], 0, '丟 number 陣列進去，T 就是 number，回傳 number。')),
    gstep(`<p><b>常見的坑：</b>① 忘了在函式名後面寫 <code>&lt;T&gt;</code>，TypeScript 會說找不到 T；② 把回傳型別寫成 <code>any</code>，型別就丟了（這個遊戲也不允許用 any）；③ 以為 T 要自己傳，其實通常讓 TypeScript 自己推就好。</p><p>🎉 <b>這是最後一步。</b>檢查會把前面七步的功能一起重新驗一次：變數、interface、陣列、函式、聯集、收窄、可省略與唯讀、泛型。</p>`,
      choice('泛型函式裡的 <code>&lt;T&gt;</code>，目的是？', ['先宣告「有個待決定的型別叫 T」', '把 T 變成文字', '讓函式變成非同步'], 0, '宣告 T 之後，參數和回傳才可以使用 T。')),
  ], {
    brief: '第 8 步（最後一步）：把 firstOf 改成泛型 function firstOf<T>(items: T[]): T，讓 firstOf(tickets) 是 Ticket、firstOf([\'A1\',...]) 是 string。前面做好的所有功能都要保留。',
    hint: '只要改函式的第一行：加上 <code>&lt;T&gt;</code>，並把 Ticket 換成 T。',
    steps: [`TODO 1：把<pre>function firstOf(items: Ticket[]): Ticket {</pre>改成<pre>function firstOf<T>(items: T[]): T {</pre>為什麼：加 &lt;T&gt; 宣告萬用型別，參數與回傳的 Ticket 都換成 T。`, `TODO 2：下面 <code>const firstSeat: string = firstOf(['A1', 'A2', 'A3']);</code> 那行的紅線會自動消失，不用改。為什麼：T 現在能是 string 了。`, `全部檢查一次<pre>function firstOf<T>(items: T[]): T {\n  return items[0];\n}</pre>最常犯的錯：只改了 <code>(items: T[])</code> 卻忘了在函式名後面宣告 <code>&lt;T&gt;</code>，或回傳型別忘了改成 T。`],
    starter: S8, solution: SOL8,
    rules: [...R_ITF_B.slice(0, 1), ...R_ARR, ...R_TOTAL, ...R_STATUS, ...R_FMT, ...R_NOTE, ...R_GEN],
  }),
];

const QUIZ = [
  choice('做一個 TypeScript 小工具，比較好的步驟是？', ['先存基本資料，再一步一步加型別、陣列、函式，每步看紅線', '一次全部寫完再看紅線', '先寫泛型，再想資料'], 0),
  choice('票的狀態只能是 free、picked、sold 三種，用哪種型別最好？', ["聯集型別 'free' | 'picked' | 'sold'", 'string', 'boolean'], 0),
  choice('參數是 <code>number | string</code>，要用 <code>toFixed</code> 前要先做什麼？', ['用 typeof 判斷，把型別收窄成 number', '加 any', '不用做什麼'], 0),
  choice('<code>note?: string</code> 的 <code>?</code> 是什麼意思？', ['這個欄位可以不填', '這個欄位是疑問句', '這個欄位只能讀'], 0),
];

const EVENT = { npc: 'qa', mood: 'worried', text: '我在測票券頁面，有人把狀態打成 "soldd"，程式沒有任何錯誤，結果整排票都顯示不出來……你剛學完型別，怎麼防呢？',
  options: [{ label: "把狀態改成聯集型別 'free' | 'picked' | 'sold'，打錯字編輯器馬上紅線", fx: { quality: 10, team: 6 } }, { label: '狀態用 string 就好，叫大家打字小心一點', fx: { quality: -8, stress: 6 } }] };

export const GUIDED = {
  chapter: { id: 'ts-cg', title: '第三章　手把手專案：票券資料小工具（從空白做到完成）', lessons: TS_UNITS, quiz: QUIZ, projects: [], event: 'ts-cg' },
  event: EVENT,
};
