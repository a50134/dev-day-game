// 第 12 部「商品分類、企業責任、頁尾」：
//   做錯 ①：Button 型別加了 white，但 variants 沒補 → TS2741（Record 保證每個款式都有樣式）
//   做錯 ②：頁尾社群圖示是深色，放在深色背景看不見（忘了 brightness-0 invert）→ 預覽畫面是真的
import { T, R, chapter, type, open, view, vp, hl, unhl, float, unfloat, fx, confetti, list, card, wait, err, noerr } from './dsl.js';
import * as C from '../tw-react-code.js';

const APP_NO_SOCIAL = C.APP_13.split('\n').filter((l) => !l.includes('SocialBar')).join('\n');
const FOOTER_BAD = C.FOOTER.replace(' brightness-0 invert', '');
const ERR_WHITE = "Property 'white' is missing in type '{ fill: string; unfill: string; }' but required in type 'Record<Variant, string>'.";

const todo = list(['四張商品分類圖', '企業責任：可以展開的三張圖', '頁尾', '右邊固定的社群按鈕']);
const bw = list(['<code>brightness-0</code>：圖片全部變黑', '<code>invert</code>：黑色反轉成白色', '不用另外準備白色圖示檔，一個 class 搞定']);
const fixed = list(['<code>fixed right-10 top-1/2</code>：固定在畫面右邊中間', '<code>-translate-y-1/2</code>：往上移自己高度的一半，才是真的置中', '<code>hidden lg:flex</code>：手機隱藏、桌面才顯示']);

const beats = [
  chapter('開場', ['第 12 部', '分類、企業責任、頁尾', '🏁']),
  T('首頁快做完了！今天一口氣做完剩下的部分～'),
  float(card('📋 今天要做', todo)),
  R('好多喔…可是都是學過的東西對不對？', 'happy'),
  T('對！我們會用到前面學的 Button、手機優先、`map`。', 'happy'),
  unfloat,

  chapter('新人先試'),
  T('分類圖上面有一個白色按鈕，但設計稿的 Button 只有實心和空心。換你加第三種：`white`！', 'happy'),
  R('好！先在型別加上 `white`～', 'happy', { jump: 'rookie' }),
  open('src/components/Button.tsx'),
  type('src/components/Button.tsx', C.BUTTON_3_BROKEN, { broken: true, slow: true }),
  err(13, 'variants', ERR_WHITE),
  { fx: 'shake' },
  R('存檔後 `variants` 那行出現紅線了！', 'surprised', { fx: '❗' }),

  chapter('老師點醒'),
  T('讀讀看：它說缺少 `white`，因為要求什麼型別？', 'normal'),
  hl(13, 13),
  R('`Record<Variant, string>`…每個款式都要有對應的 class！', 'surprised', { jump: 'rookie', fx: '❗' }),
  unhl,
  T('對！這就是第 5 部說的：`Record` 保證每個款式都有樣式，漏一個馬上抓到。補上 `white` 的樣式吧～', 'happy', { fx: '💡' }),
  type('src/components/Button.tsx', C.BUTTON_3, { slow: true }),
  noerr,
  R('紅線消失了！白底深色字，滑過變淺綠。', 'happy', { fx: '✨' }),

  chapter('商品分類'),
  T('接著做分類。四張分類的資料放在陣列，每張：圖片貼滿、蓋半透明深色、疊一個白色細框、中間標題和按鈕。', 'happy'),
  type('src/components/Categories.tsx', C.CATEGORIES, { bulk: true }),
  T('重點在 `section`：`grid md:grid-cols-2`。手機預設一欄、四張直排；桌面兩欄，剛好 2×2。', 'happy'),
  type('src/App.tsx', C.APP_12a),
  vp('desktop'),
  view(4200, 'ok', '日常療癒・文青系'),
  R('四張圖 2×2，滑鼠移上去還會慢慢放大！', 'happy', { fx: '✨' }),

  chapter('企業責任'),
  T('企業責任是三張並排的圖，滑過去會展開。先做靜態版本：三張圖並排。', 'happy'),
  type('src/components/Responsibility.tsx', C.RESP_1, { bulk: true }),
  T('背景圖用 `bg-[url(...)]`，中括號是 Tailwind 的「自訂值」寫法，可以直接放圖片網址。', 'normal'),
  T('讓它可以展開：用 `active` 記住哪一張展開。展開的那張桌面 `flex-8`、其他是 `flex-1`，所以展開的比較寬，`transition-all` 讓寬度有動畫。', 'happy'),
  type('src/components/Responsibility.tsx', C.RESP_2, { bulk: true }),
  type('src/App.tsx', C.APP_12),
  view(4200, 'ok', '企業責任'),
  R('第一張展開，其他只剩標題！', 'surprised', { fx: '✨' }),
  vp('mobile'),
  wait(3600),
  T('手機版三張全部展開、直直排，因為寬度不夠並排。`flex md:hidden` 這種組合，就是「手機顯示、桌面隱藏」。', 'happy'),
  vp('desktop'),

  chapter('頁尾'),
  T('最後是頁尾。三欄連結和社群圖示都是陣列資料，用 `map` 畫出來。', 'happy'),
  R('我來！社群圖示直接放上去～', 'happy', { jump: 'rookie' }),
  type('src/components/Footer.tsx', FOOTER_BAD, { bulk: true }),
  type('src/App.tsx', APP_NO_SOCIAL),
  view(4200, 'ok', '關於'),
  { fx: 'shake' },
  R('咦？頁尾圓圈裡面的圖示看不見…', 'surprised', { fx: '❗' }),
  T('想想看：這些圖示本來是什麼顏色？頁尾背景又是什麼顏色？', 'normal'),
  R('圖示是深色，背景是深綠…深色放在深色上當然看不到！要變成白色。', 'surprised', { fx: '❗' }),
  type('src/components/Footer.tsx', C.FOOTER, { slow: true }),
  view(3600, 'ok', '關於'),
  R('變成白色了，看得清楚！', 'happy', { fx: '✨' }),
  float(card('🎨 brightness-0 invert', bw)),
  wait(4200),
  unfloat,

  chapter('固定社群按鈕'),
  T('最後是右邊固定的社群按鈕，捲到哪裡都跟著你。', 'happy'),
  type('src/components/SocialBar.tsx', C.SOCIAL_BAR, { bulk: true }),
  float(card('📌 固定定位', fixed)),
  wait(4600),
  unfloat,
  type('src/App.tsx', C.APP_13),
  view(3600, 'ok', '默默熱賣中'),
  R('右邊有一排固定的社群按鈕！整個首頁從上到下全部完成了！', 'happy', { fx: '🎉' }),
  T('從上往下：導覽列、輪播、兩段限時提案、熱賣商品、四張分類、企業責任、頁尾，跟設計稿首頁一樣的順序。', 'happy'),

  chapter('今天學到'),
  T('來，換你當小老師～'),
  R('我來整理！', 'happy'),
  float(card('📝 今天學到', list(['<code>Record</code> 讓款式漏寫馬上紅線；新增款式要補上樣式', '<code>group-hover</code>、<code>flex-8 / flex-1</code> 做出會展開的卡片', '<code>brightness-0 invert</code> 把深色圖示變白；<code>fixed</code> 做固定的社群按鈕']))),
  wait(6000),
  T('太棒了！最後一部：檢查、整理型別錯誤、上線～', 'happy', { fx: '🎉' }),
  confetti,
  unfloat,
  wait(1500),
];

export default {
  title: '商品分類、企業責任、頁尾',
  endSub: '下一部：檢查、型別錯誤整理與上線',
  beats,
};
