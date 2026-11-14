// 第 7 部「首頁 Hero 輪播」：
//   做錯 ①：圖片沒寫 absolute inset-0 → 圖片把文字框擠到下面被裁掉（畫面是真的）
//   做錯 ②：第三張輪播資料忘了 subtitle → TS2741
import { T, R, chapter, type, open, view, vp, hl, unhl, float, unfloat, fx, confetti, list, card, wait, err, noerr, lineOf } from './dsl.js';
import * as C from '../tw-react-code.js';

const HERO_1_BAD = C.HERO_1.replace('className="absolute inset-0 size-full object-cover"', 'className="size-full object-cover"');
const HERO_2_BAD = C.HERO_2.replace("    subtitle: '純植物精油，無化學添加，適合全家大小使用',\n", '');
const ERR_SUB = "Property 'subtitle' is missing in type '{ image: string; title: string; }' but required in type 'Slide'.";

const spec = list(['高度：手機 740px、桌面 992px，滿版大圖', '文字框 636 × 304，半透明、背景模糊', '指示點：桌面長條、手機圓點']);
const imgRule = list(['<code>absolute inset-0</code>：貼滿整個區塊（疊在上面）', '<code>size-full</code>：寬高 100%', '<code>object-cover</code>：填滿不變形，多的裁掉']);
const dots = list(['手機：<code>size-2.5 rounded-full</code> ＝ 10px 圓點', '桌面：<code>md:h-2 md:w-18</code> ＝ 72×8 長條', '目前這張 <code>bg-primary-100</code>，其他 <code>bg-n-20</code>']);

const beats = [
  chapter('開場', ['第 7 部', 'Hero 輪播', '🖼️']),
  T('今天做首頁最上面的大圖輪播，視覺焦點就是它！'),
  float(card('🖼️ 設計稿', spec)),
  R('哇，好大一張圖，文字還浮在圖片上面！', 'happy'),
  unfloat,

  chapter('新人先試'),
  T('先做一張靜態的就好。新增 `Hero.tsx`，換你囉～', 'happy'),
  R('圖片就用 `img`，寬高 100%、`object-cover`，文字框放在下面～', 'happy', { jump: 'rookie' }),
  type('src/components/Hero.tsx', HERO_1_BAD),
  type('src/App.tsx', C.APP_7),
  vp('desktop'),
  view(2600),
  { fx: 'shake' },
  R('咦？只看到一張大圖，文字框跑哪去了？', 'surprised', { fx: '❗' }),

  chapter('老師點醒'),
  T('想想看：這個 `section` 高度固定（手機 740px、桌面 992px），`img` 把它填滿了。那文字框排在 `img` 的哪裡？', 'normal'),
  R('在圖片「下面」…被 `overflow-hidden` 裁掉了！', 'surprised', { fx: '❗' }),
  T('沒錯。我們要讓圖片「疊在最底下」，不佔位置。你記得 `absolute` 是什麼意思嗎？', 'happy'),
  hl(6, 6),
  R('讓它脫離排版，疊在上面！所以 `section` 要 `relative`，圖片加 `absolute inset-0`！', 'happy', { jump: 'rookie', fx: '💡' }),
  unhl,
  type('src/components/Hero.tsx', C.HERO_1, { slow: true }),
  view(2600),
  R('文字框出現了！半透明的，後面的圖還有點模糊～', 'happy', { fx: '✨' }),
  float(card('📌 圖片貼滿三件套', imgRule)),
  wait(4200),
  unfloat,

  chapter('變成輪播'),
  T('現在讓它變輪播。先把三張圖的資料整理成陣列，每一張有圖、標題、副標。', 'happy'),
  R('我來！三張，每張都有標題和副標～', 'happy', { jump: 'rookie' }),
  type('src/components/Hero.tsx', HERO_2_BAD, { broken: true }),
  err(21, '{', ERR_SUB),
  { fx: 'shake' },
  R('紅線！它說缺少 `subtitle`…', 'surprised', { fx: '❗' }),
  T('讀一下：`type Slide` 規定每張都要有什麼？', 'normal'),
  hl(4, 8),
  R('`image`、`title`、`subtitle` 三個都要！我第三張漏了副標！', 'surprised', { jump: 'rookie' }),
  unhl,
  T('這就是 `type Slide`、`slides: Slide[]` 的用處：資料少一個欄位，馬上被抓到。', 'happy', { fx: '💡' }),
  type('src/components/Hero.tsx', C.HERO_2, { slow: true }),
  noerr,
  view(2600),
  R('三張疊在一起，只有目前這張顯示，圓點可以點！', 'happy', { fx: '✨' }),
  hl(38, 38),
  T('秘訣：三張全疊在一起，只有 `current` 這張是 `opacity-100`，其他是 `opacity-0`，`transition-opacity` 做出淡入淡出。', 'happy'),
  unhl,
  float(card('🔘 指示點', dots)),
  wait(4200),
  unfloat,

  chapter('自動播放'),
  T('最後讓它自己換頁：用 `useEffect` 設計時器，每 5 秒換下一張。', 'happy'),
  type('src/components/Hero.tsx', C.HERO_3),
  hl(31, 37),
  T('`(n + 1) % slides.length` 是「加一，到最後一張回到第一張」。`return` 那行在離開時清掉計時器，不然會一直累積。', 'happy'),
  unhl,
  T('最後面的 `[current]`：`current` 變了就重新計時，所以你手動點了圓點，不會馬上又被自動換掉。', 'normal'),
  view(2200),

  chapter('今天學到'),
  T('來，換你當小老師～'),
  R('我來整理！', 'happy'),
  float(card('📝 今天學到', list(['背景圖要疊在下面：<code>relative</code> ＋ <code>absolute inset-0</code> ＋ <code>object-cover</code>', '<code>type Slide</code> ＋ <code>Slide[]</code>：資料少欄位，TypeScript 先抓到', '<code>useEffect</code> 計時器要記得清掉（<code>return</code> ＋ <code>[current]</code>）']))),
  wait(6000),
  T('太棒了！下一部做「限時提案」兩段圖文並排～', 'happy', { fx: '🎉' }),
  confetti,
  unfloat,
  wait(1500),
];

export default {
  title: '首頁 Hero 輪播',
  endSub: '下一部：首頁——限時提案',
  beats,
};
