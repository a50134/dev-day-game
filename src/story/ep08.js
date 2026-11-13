// 第 8 部「首頁：限時提案」：
//   做錯：FeatureSection 還沒有 reverse 屬性，新人就在 PromoSections 先用了 → TS2322（Property 'reverse' does not exist…）
import { T, R, chapter, type, open, view, vp, hl, unhl, float, unfloat, fx, confetti, list, card, wait, err, noerr } from './dsl.js';
import * as C from '../tw-react-code.js';

const PROMO_V1_BAD = C.PROMO_V1.replace('<FeatureSection image="/images/section-02.png" imageAlt="手工皂與刷具">', '<FeatureSection image="/images/section-02.png" imageAlt="手工皂與刷具" reverse>');
const ERR_REV = "Property 'reverse' does not exist on type 'IntrinsicAttributes & FeatureSectionProps'.";

const spec = list(['① 圖左文右：這個季節剛剛好', '② 圖右文左：為日常加點新意', '背景：白 → 淺綠 → 白，中間有葉子分隔線']);
const grad = list(['<code>bg-linear-to-b</code>：由上往下的漸層', '<code>from-white</code> 起點　<code>via-primary-80</code> 中間　<code>to-white</code> 終點', '三個顏色都是第 3 部設定過的']);
const flip = list(['手機：<code>flex-col</code> 上下排', '≥768px：<code>md:flex-row</code> 左右排', '反過來：<code>md:flex-row-reverse</code>', '圖文各占一半：<code>md:w-1/2</code>']);

const beats = [
  chapter('開場', ['第 8 部', '限時提案', '🌿']),
  T('今天做首頁的兩段「圖文並排」，一段圖在左、一段圖在右～'),
  float(card('🌿 設計稿', spec)),
  R('兩段長得很像耶，只是左右相反！', 'happy'),
  T('觀察得好！長得一樣的東西，我們做成一個「共用元件」，叫 `FeatureSection`。', 'happy', { fx: '💡' }),
  unfloat,

  chapter('新人先試'),
  R('我來做！圖片、說明，還有裡面的內容，用 `children` 接～', 'happy', { jump: 'rookie' }),
  type('src/components/FeatureSection.tsx', C.FEATURE_1),
  hl(6, 6),
  T('`children` 就是「包在標籤中間的東西」，型別是 `ReactNode`（任何 React 能畫的內容）。', 'happy'),
  unhl,
  float(card('📱➡️🖥️ 手機上下、桌面左右', flip)),
  wait(4200),
  unfloat,
  T('接著新增 `PromoSections`，把兩段放進去。', 'happy'),
  R('第二段圖要在右邊，我加一個 `reverse` 就好了吧～', 'happy', { jump: 'rookie' }),
  type('src/components/PromoSections.tsx', PROMO_V1_BAD, { broken: true }),
  type('src/App.tsx', C.APP_8, { broken: true }),
  open('src/components/PromoSections.tsx'),
  err(20, 'reverse', ERR_REV),
  { fx: 'shake' },
  R('紅色波浪線！它說 `reverse` 不存在於 `FeatureSectionProps`…', 'surprised', { fx: '❗' }),

  chapter('老師點醒'),
  T('讀讀看：`FeatureSection` 到底接受哪些屬性？', 'normal'),
  open('src/components/FeatureSection.tsx'),
  hl(3, 7),
  R('只有 `image`、`imageAlt`、`children`…我根本沒做過 `reverse`！', 'surprised', { jump: 'rookie', fx: '❗' }),
  unhl,
  T('對！元件只接受你「規定好」的屬性。想要新功能，就先在型別裡加上去。', 'happy', { fx: '💡' }),
  T('我們加兩個「選用」屬性：`reverse` 決定方向、`leaf` 放葉子裝飾。問號代表可以不傳。', 'happy'),
  type('src/components/FeatureSection.tsx', C.FEATURE_2),
  hl(17, 17),
  T('`reverse` 是 `true` 的時候，換成 `md:flex-row-reverse`，左右就反過來了。', 'happy'),
  unhl,
  noerr,
  open('src/components/PromoSections.tsx'),
  view(2600),
  R('紅線不見了，第二段圖跑到右邊了！', 'happy', { fx: '✨' }),

  chapter('漸層與葉子'),
  T('背景是由白變淺綠再變白的漸層。', 'happy'),
  hl(6, 6),
  float(card('🎨 漸層', grad)),
  wait(4200),
  unfloat,
  unhl,
  T('最後給兩段加上葉子裝飾。葉子用 `absolute` 定位，`hidden md:block` 讓手機看不到、桌面才出現。', 'happy'),
  type('src/components/PromoSections.tsx', C.PROMO_V2, { bulk: true }),
  hl(14, 14),
  T('`pointer-events-none` 讓滑鼠可以穿過葉子，不會擋到下面的按鈕。', 'normal'),
  unhl,
  type('src/App.tsx', C.APP_8),
  vp('desktop'),
  view(3000),
  R('兩段圖文交錯，還有葉子分隔線和裝飾，好有質感！', 'happy', { fx: '✨' }),
  vp('mobile'),
  wait(2600),
  R('手機版變成圖在上、文字在下，葉子也藏起來了～', 'surprised', { jump: 'rookie' }),

  chapter('今天學到'),
  T('來，換你當小老師～'),
  R('我來整理！', 'happy'),
  float(card('📝 今天學到', list(['長得一樣的東西做成共用元件，用 <code>children: ReactNode</code> 放內容', '元件只接受型別規定的屬性；<code>reverse?</code>、<code>leaf?</code> 的問號代表選用', '<code>bg-linear-to-b from／via／to</code> 做漸層；<code>flex-col → md:flex-row</code> 手機優先']))),
  wait(6000),
  T('太棒了！下一部要來準備商品資料～', 'happy', { fx: '🎉' }),
  confetti,
  unfloat,
  wait(1500),
];

export default {
  title: '首頁：限時提案',
  endSub: '下一部：先建立商品資料（seed）',
  beats,
};
