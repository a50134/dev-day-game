// TypeScript 小挑戰：用真正的 TypeScript 編譯器檢查玩家改好的程式（第一次使用才載入，約 3MB）
const SRC = 'https://cdnjs.cloudflare.com/ajax/libs/typescript/5.5.4/typescript.min.js';

let tsP;
export const loadTS = () => (tsP ||= window.ts ? Promise.resolve(window.ts) : new Promise((res, rej) => {
  const s = document.createElement('script');
  s.src = SRC;
  s.onload = () => res(window.ts);
  s.onerror = () => { tsP = null; rej(new Error('TypeScript 編譯器載入失敗（需要連網）')); };
  document.head.append(s);
}));

// 不載入完整的 lib.d.ts（太大），只宣告挑戰會用到的最小內建型別
const LIB = `interface Object {} interface Function {} interface CallableFunction extends Function {} interface NewableFunction extends Function {}
interface IArguments {} interface RegExp {} interface Boolean {}
interface String { length: number; toUpperCase(): string; toLowerCase(): string; includes(s: string): boolean; }
interface Number { toFixed(digits?: number): string; toString(): string; }
interface Array<T> { length: number; [n: number]: T; push(...items: T[]): number; includes(x: T): boolean; map<U>(f: (x: T, i: number) => U): U[]; filter(f: (x: T) => boolean): T[]; }
declare const console: { log(...args: unknown[]): void };`;

// 回傳紅線清單（空陣列 = 型別全對）
export function typeErrors(ts, src) {
  const files = { 'lib.d.ts': LIB, 'main.ts': src };
  const host = {
    getSourceFile: (f, lang) => (f in files ? ts.createSourceFile(f, files[f], lang, true) : undefined),
    getDefaultLibFileName: () => 'lib.d.ts', writeFile() {}, getCurrentDirectory: () => '',
    getCanonicalFileName: (f) => f, useCaseSensitiveFileNames: () => true, getNewLine: () => '\n',
    fileExists: (f) => f in files, readFile: (f) => files[f], directoryExists: () => true, getDirectories: () => [],
  };
  const program = ts.createProgram(['lib.d.ts', 'main.ts'], { noLib: true, strict: true, noEmit: true, target: ts.ScriptTarget.ES2020, types: [] }, host);
  const sf = program.getSourceFile('main.ts');
  return [...program.getSyntacticDiagnostics(sf), ...program.getSemanticDiagnostics(sf)].map((d) => {
    const { line } = sf.getLineAndCharacterOfPosition(d.start);
    return `第 ${line + 1} 行：${ts.flattenDiagnosticMessageText(d.messageText, '\n')}`;
  });
}

const noAny = { test: (s) => !/:\s*any\b|\bas any\b|<any>|@ts-ignore|@ts-expect-error/.test(s), msg: '不可以用 any 或 @ts-ignore 矇混過去' };
const keep = (re, msg) => ({ test: (s) => re.test(s), msg });

export const CHALLENGES = [
  {
    id: 'event', after: 'list', title: '活動資料長什麼樣？',
    brief: '資料從 API 來，但程式不知道「活動」長什麼樣子。幫 TixEvent 補上 date、venue、price 的型別，讓紅線消失。',
    hint: 'interface 就是在描述物件的形狀：<code>price: number;</code>。日期這裡用文字，所以是 <code>string</code>。',
    rules: [noAny, keep(/const e: TixEvent/, '請保留 const e: TixEvent 這一行')],
    starter: `interface TixEvent {
  id: number;
  title: string;
  // TODO: 補上 date、venue、price（各是什麼型別？）
}

const e: TixEvent = { id: 1, title: '星光巡迴演唱會', date: '2026-12-20', venue: '台北大巨蛋', price: 3800 };

function formatPrice(ev: TixEvent): string {
  return 'NT$ ' + ev.price;
}
`,
  },
  {
    id: 'seat', after: 'seats', title: '座位有三種狀態',
    brief: '座位可能是「空位、已選、已售出」。型別少寫了一種，還有一筆資料少了欄位。把紅線都修掉。',
    hint: '<code>type Status = \'a\' | \'b\'</code> 是「聯集型別」：值只能是其中一種。資料缺欄位時，補上欄位，或把欄位改成可省略（<code>sold?: boolean</code>）。',
    rules: [noAny, keep(/function statusOf/, '請保留 statusOf 函式')],
    starter: `interface Seat {
  id: string;
  sold: boolean;
}

// 座位有三種狀態
type SeatStatus = 'free' | 'picked'; // TODO: 少了一種

function statusOf(s: Seat, picked: string[]): SeatStatus {
  if (s.sold) return 'sold';
  return picked.includes(s.id) ? 'picked' : 'free';
}

const s2: Seat = { id: 'A2' }; // TODO: 這筆資料少了東西
`,
  },
  {
    id: 'cart', after: 'checkout', title: '總額的型別對不上',
    brief: '結帳函式算出來的是數字，卻被當成文字；傳進去的資料也有一個欄位型別不對。讓紅線消失。',
    hint: '先看函式「回傳」的型別宣告對不對，再看呼叫時傳的值型別對不對。',
    rules: [noAny, keep(/function total/, '請保留 total 函式')],
    starter: `interface Cart {
  count: number;
  price: number;
}

function total(cart: Cart): string { // TODO: 回傳的是什麼型別？
  return cart.count * cart.price;
}

const result: number = total({ count: '2', price: 1800 }); // TODO: 傳入的資料也有錯
`,
  },
  {
    id: 'narrow', title: '價格可能是文字',
    brief: '有些活動價格是「免費」這種文字。字串沒有 toFixed，要先判斷型別（型別收窄），再處理。',
    hint: '<code>if (typeof price === \'string\') return price;</code> 之後，TypeScript 就知道剩下的是 number。',
    rules: [noAny, keep(/typeof/, '請用 typeof 判斷型別')],
    starter: `function showPrice(price: number | string): string {
  return 'NT$ ' + price.toFixed(0); // TODO: 字串沒有 toFixed
}
`,
  },
  {
    id: 'generic', title: '泛型：萬用盒子',
    brief: 'first 可以拿任何陣列的第一個元素，回傳的型別會跟著陣列走。看清楚 first(ids) 是什麼型別，修掉紅線。',
    hint: '<code>T</code> 是「待決定的型別」。傳入 <code>number[]</code>，T 就是 number。',
    rules: [noAny, keep(/first\(ids\)/, '請保留 first(ids) 這一行')],
    starter: `function first<T>(items: T[]): T {
  return items[0];
}

const ids: number[] = [1, 2, 3];
const firstId: string = first(ids); // TODO: first(ids) 是什麼型別？
`,
  },
];

// 紅線 + 規則；空陣列 = 通關
export function judge(ts, ch, src) {
  return [...typeErrors(ts, src), ...ch.rules.filter((r) => !r.test(src)).map((r) => r.msg)];
}
