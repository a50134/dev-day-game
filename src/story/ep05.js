// 第 5 部「Button 元件」：
//   做錯 ①：Button 沒有接收 props，傳進去的文字被吃掉（畫面是「按鈕」、不是「實心按鈕」）＋ TS2559
//   做錯 ②：傳了設計稿沒有的款式 variant="blue" ＋ TS2322
import { T, R, chapter, type, open, view, hl, unhl, float, unfloat, fx, confetti, list, card, wait, err, noerr, lineOf } from './dsl.js';
import * as C from '../tw-react-code.js';

const appWith = (second) => `import Button from './components/Button'

function App() {
  return (
    <div className="flex flex-wrap items-center gap-4 p-8">
      <Button>實心按鈕</Button>${second}
    </div>
  )
}

export default App
`;
const APP_A = appWith('');
const APP_BLUE = appWith('\n      <Button variant="blue">空心按鈕</Button>');
const APP_UNFILL = appWith('\n      <Button variant="unfill">空心按鈕</Button>');

const ERR_PROPS = "Type '{ children: string; }' has no properties in common with type 'IntrinsicAttributes'.";
const ERR_BLUE = "Type '\"blue\"' is not assignable to type 'Variant | undefined'.";

const spec = `<table style="width:100%;border-collapse:collapse;font-size:12.5px;text-align:center"><tr style="background:#e3efe8"><th>款式</th><th>預設</th><th>滑過</th><th>按下</th></tr>
<tr><td>fill 實心</td><td style="background:#1d6617;color:#fff">深綠底</td><td style="color:#598e71">透明底</td><td style="background:#e3efe8;color:#1d6617">淺綠底</td></tr>
<tr><td>unfill 空心</td><td style="color:#1d6617">深綠字</td><td style="color:#598e71">中綠字</td><td style="background:#e3efe8;color:#1d6617">淺綠底</td></tr></table>`;
const states = list(['<b>fill</b>：預設深綠底白字 → 滑過透明底中綠字 → 按下淺綠底深綠字', '<b>unfill</b>：只有字，同樣會 hover、active', '桌面和手機的內距大小也不同']);

const beats = [
  chapter('開場', ['第 5 部', 'Button 元件', '🔘']),
  T('今天做第一個「元件」：按鈕！設計稿裡到處都有它～'),
  float(card('🔘 設計稿的按鈕', spec)),
  R('按鈕而已嘛，直接寫 class，每個地方複製貼上就好啦～', 'normal'),
  unfloat,
  T('那我問你：設計稿的按鈕有實心、空心、滑過、按下…好幾種樣子。如果有 30 個按鈕，要改顏色呢？', 'normal'),
  R('…要改 30 個地方。', 'worried', { fx: '💦' }),
  T('所以我們把按鈕做成一個「元件」，只在一個地方寫樣式。來，新增 `components/Button.tsx`～', 'happy'),

  chapter('新人先試'),
  R('最簡單的按鈕，一個函式回傳一個 `button`～😎', 'happy', { jump: 'rookie' }),
  type('src/components/Button.tsx', C.BUTTON_0),
  R('再到 `App.tsx` 用用看，我要一個「實心按鈕」！', 'happy'),
  type('src/App.tsx', APP_A, { broken: true }),
  view(2400),
  err(lineOf(APP_A, '<Button>'), 'Button', ERR_PROPS),
  { fx: 'shake' },
  R('咦？我寫「實心按鈕」，畫面上卻是「按鈕」…而且出現紅色波浪線！', 'surprised', { fx: '❗' }),

  chapter('老師點醒'),
  T('別慌～先讀讀那行紅字：「`{ children: string }` 和 `IntrinsicAttributes` 沒有共同的屬性」。', 'normal'),
  R('聽不懂…', 'worried'),
  T('換個問法：你傳了一段文字給 `Button`，`Button` 有「接收」的地方嗎？', 'happy'),
  open('src/components/Button.tsx'),
  hl(1, 1),
  R('啊！我的 `Button()` 括號裡面是空的，沒有地方接收！', 'surprised', { jump: 'rookie', fx: '❗' }),
  unhl,
  T('對！我們讓它接收「原生按鈕所有的屬性」，像 `onClick`、`disabled`、`children`……一次全包。', 'happy', { fx: '💡' }),
  type('src/components/Button.tsx', C.BUTTON_0b),
  noerr,
  view(2200),
  R('出現「實心按鈕」了！紅線也不見了～', 'happy', { fx: '✨' }),
  T('`ComponentProps<\'button\'>` 就是「一個按鈕所有可以用的屬性」。第一行是 `import type`，因為它只是型別，記得第一部的規則嗎？', 'happy'),

  chapter('做出款式'),
  T('接著做設計稿的兩種款式：實心 `fill` 和空心 `unfill`。', 'happy'),
  R('我來！', 'happy'),
  type('src/components/Button.tsx', C.BUTTON_1),
  hl(3, 3),
  T('`type Variant = \'fill\' | \'unfill\'` 叫「聯集型別」，意思是：只能是這兩個字串其中一個。', 'happy'),
  unhl,
  hl(14, 17),
  T('下面 `Record<Variant, string>` 的意思是：每一種款式，都必須有一組對應的 class，少一個就報錯。', 'happy'),
  unhl,
  T('hover 和 active 就是設計稿那張表的「滑過」和「按下」。暫停後你可以自己把滑鼠移上去試試～', 'normal'),
  R('那我來試個設計稿沒有的：「藍色」！好奇會怎樣～', 'happy', { jump: 'rookie' }),
  open('src/App.tsx'),
  type('src/App.tsx', APP_BLUE, { broken: true }),
  err(lineOf(APP_BLUE, 'variant="blue"'), '"blue"', ERR_BLUE),
  view(2000),
  R('哇，還沒打開瀏覽器，編輯器就先罵我了！', 'surprised', { fx: '❗' }),
  T('這就是 TypeScript 的好處：用錯款式，馬上知道。它說：`"blue"` 不能給 `Variant`，只能是 `fill` 或 `unfill`。', 'happy'),
  R('原來如此！那我改成設計稿有的 `unfill`～', 'happy'),
  type('src/App.tsx', APP_UNFILL, { slow: true }),
  noerr,
  view(2400),
  R('兩個按鈕：一個實心、一個只有字！', 'happy', { fx: '✨' }),

  chapter('加上箭頭'),
  T('設計稿有些按鈕後面有向右的箭頭。我們多加一個 `arrow` 屬性：是 `true` 的時候，在文字後面放箭頭。', 'happy'),
  type('src/components/Button.tsx', C.BUTTON_2),
  type('src/App.tsx', C.APP_5),
  view(2800),
  R('看看商品後面多了一個箭頭！還有「停用中」的按鈕～', 'surprised', { fx: '✨' }),
  float(card('📌 按鈕的做法', states)),
  wait(4500),
  unfloat,

  chapter('今天學到'),
  T('來，換你當小老師～'),
  R('我來整理！', 'happy'),
  float(card('📝 今天學到', list(['元件 ＝ 把畫面收起來重複用，樣式只改一個地方', '<code>ComponentProps&lt;\'button\'&gt;</code> 讓元件接收原生屬性（不然 children 會被吃掉）', '聯集型別 ＋ <code>Record</code>：只能用允許的款式，TypeScript 會先幫你抓錯']))),
  wait(6000),
  T('太棒了！下一部做導覽列～', 'happy', { fx: '🎉' }),
  confetti,
  unfloat,
  wait(1500),
];

export default {
  title: 'Button 元件（TypeScript）',
  endSub: '下一部：導覽列（四種狀態）',
  beats,
};
