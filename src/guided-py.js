// 手把手專案（Python）：訂單統計小工具——從空白檔案一步一步做到完整作品。
// 格式同 courses-api.js 的「城市天氣小站」：每個單元 = 3 個講解小步驟 + 1 個總練習，
// 總練習的起始程式 = 上一步的解答 + 這一步的 TODO。練習是真的用 Python（Pyodide）執行，再用 tests 檢查。

const R = String.raw;
const pre = (code) => `<pre>${code.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</pre>`;
const choice = (q, options, answer, why) => ({ type: 'choice', q, options, answer, why });
const py = (o) => ({ kind: 'code', lang: 'py', ...o });
const gstep = (say, check) => ({ say, check });

/* ---------- 專案進度地圖 ---------- */
const STAGES = ['空白檔案：print 與變數', '一堆訂單：list 裡放 dict', '用 for 迴圈算出總營收', '包成函式：參數與 return', '篩出大單：if 與推導式', '數出每個商品賣幾份：dict 計數', '排行榜：排序找出最暢銷', '收尾：f-string 報表與 try/except'];
const progressMap = (n) => `<p><b>📍 專案進度：訂單統計小工具</b>（我們從一個空白檔案，一步一步做到完整作品）</p><ol>${STAGES.map((t, i) => `<li>${i + 1 < n ? '✅' : i + 1 === n ? '👉 <b>' : '⬜'} ${t}${i + 1 === n ? '</b>' : ''}</li>`).join('')}</ol>`;

/* ---------- 每一步的程式（解答是一路累加的） ---------- */
const A1 = R`# 第 1 步：一筆訂單
product = '拿鐵'
price = 120
qty = 3
line_total = price * qty
print(product, line_total)
`;
const ORDERS = R`orders = [
    {'product': '拿鐵', 'price': 120, 'qty': 3},
    {'product': '美式', 'price': 90, 'qty': 3},
    {'product': '拿鐵', 'price': 120, 'qty': 1},
    {'product': '司康', 'price': 75, 'qty': 2},
    {'product': '美式', 'price': 90, 'qty': 5},
]`;
const A2 = R`
# 第 2 步：把所有訂單放進 list
${ORDERS}
print('共', len(orders), '筆訂單')
`;
const A3 = R`
# 第 3 步：用 for 迴圈算出總營收
grand_total = 0
for o in orders:
    grand_total += o['price'] * o['qty']
print('總營收', grand_total)
`;
const A4 = R`
# 第 4 步：把「算總營收」包成函式
def total_revenue(orders):
    total = 0
    for o in orders:
        total += o['price'] * o['qty']
    return total

grand_total = total_revenue(orders)
print('總營收', grand_total)
`;
const A5 = R`
# 第 5 步：篩出金額大的訂單
def big_orders(orders, min_total):
    return [o for o in orders if o['price'] * o['qty'] >= min_total]

big = big_orders(orders, 200)
print('大單', len(big), '筆')
`;
const A6 = R`
# 第 6 步：每個商品賣了幾份
def count_by_product(orders):
    result = {}
    for o in orders:
        name = o['product']
        result[name] = result.get(name, 0) + o['qty']
    return result

counts = count_by_product(orders)
print(counts)
`;
const A7 = R`
# 第 7 步：找出最暢銷的商品
def top_sellers(counts, n):
    ranked = sorted(counts.items(), key=lambda pair: pair[1], reverse=True)
    return ranked[:n]

for name, qty in top_sellers(counts, 2):
    print(name, qty)
`;
const RAW = R`
# 第 8 步：處理原始文字、做出報表
RAW = [
    '拿鐵,120,3',
    '美式,90,3',
    '拿鐵,120,1',
    '壞掉的一行',
    '司康,75,2',
    '美式,90,5',
    '咖啡,abc,2',
]
`;
const A8 = R`
def parse_line(text):
    name, price, qty = text.split(',')
    return {'product': name, 'price': int(price), 'qty': int(qty)}

def load_orders(lines):
    good = []
    bad = 0
    for line in lines:
        try:
            good.append(parse_line(line))
        except ValueError:
            bad += 1
    return good, bad

def make_report(orders):
    lines = [f'總營收：{total_revenue(orders)} 元', f'訂單數：{len(orders)} 筆']
    for name, qty in top_sellers(count_by_product(orders), 2):
        lines.append(f'{name}：{qty} 份')
    return '\n'.join(lines)

good, bad = load_orders(RAW)
print(make_report(good))
print(f'有 {bad} 行資料格式錯誤，已略過')
`;

const SOL1 = A1, SOL2 = SOL1 + A2, SOL3 = SOL2 + A3, SOL4 = SOL2 + A4, SOL5 = SOL4 + A5, SOL6 = SOL5 + A6, SOL7 = SOL6 + A7, SOL8 = SOL7 + RAW + A8;

/* ---------- 起始程式 = 上一步解答 + TODO ---------- */
const S1 = R`# 訂單統計小工具：我們從一個空白檔案開始
# TODO 1: 建立三個變數：product 是 '拿鐵'、price 是 120、qty 是 3
# TODO 2: 算出這筆訂單的金額：line_total = price * qty
# TODO 3: 用 print(product, line_total) 印出來
`;
const S2 = SOL1 + R`
# TODO: 建立 orders 清單，裡面放 5 筆訂單（每筆都是 dict，有 product、price、qty）
#   {'product': '拿鐵', 'price': 120, 'qty': 3}
#   {'product': '美式', 'price': 90, 'qty': 3}
#   {'product': '拿鐵', 'price': 120, 'qty': 1}
#   {'product': '司康', 'price': 75, 'qty': 2}
#   {'product': '美式', 'price': 90, 'qty': 5}
# TODO: 用 print('共', len(orders), '筆訂單') 印出有幾筆
`;
const S3 = SOL2 + R`
# TODO 1: 先把 grand_total 設成 0
# TODO 2: 用 for o in orders: 走過每筆訂單，把 o['price'] * o['qty'] 加進 grand_total
# TODO 3: 用 print('總營收', grand_total) 印出來
`;
const S4 = SOL3 + R`
# TODO 1: 寫 def total_revenue(orders):，把上面「算總營收」的迴圈搬進去（最後 return 算好的數字）
# TODO 2: 在函式外面用 grand_total = total_revenue(orders) 呼叫它
#         （上面舊的迴圈可以刪掉，或保留也行；最後 print('總營收', grand_total) 要印出來）
`;
const S5 = SOL4 + R`
# TODO 1: 寫 def big_orders(orders, min_total):，用推導式回傳「金額 >= min_total」的訂單
# TODO 2: big = big_orders(orders, 200)
# TODO 3: print('大單', len(big), '筆')
`;
const S6 = SOL5 + R`
# TODO 1: 寫 def count_by_product(orders):，回傳像 {'拿鐵': 4, ...} 的 dict（每個商品賣出的總份數）
#         做法：result = {} → for 走過每筆訂單 → result[名字] = result.get(名字, 0) + o['qty'] → return result
# TODO 2: counts = count_by_product(orders)，然後 print(counts)
`;
const S7 = SOL6 + R`
# TODO 1: 寫 def top_sellers(counts, n):，回傳賣最多的前 n 名，格式 [('美式', 8), ('拿鐵', 4)]
#         提示：sorted(counts.items(), key=lambda pair: pair[1], reverse=True)，再取 [:n]
# TODO 2: 用 for name, qty in top_sellers(counts, 2): 走過前兩名，print(name, qty)
`;
const S8 = SOL7 + RAW + R`
# TODO 1: 寫 parse_line(text)：'拿鐵,120,3' 變成 {'product': '拿鐵', 'price': 120, 'qty': 3}（price、qty 要是數字）
# TODO 2: 寫 load_orders(lines)：回傳 (好的訂單清單, 壞資料有幾行)；每行用 try / except ValueError 接住壞資料
# TODO 3: 寫 make_report(orders)：回傳多行文字（用 f-string），格式見題目
# TODO 4: good, bad = load_orders(RAW)，print(make_report(good))，再 print(f'有 {bad} 行資料格式錯誤，已略過')
`;

/* ---------- 檢查（tests 在玩家程式後面執行；check(條件, 訊息)、output()） ---------- */
// 標準資料與預期（_t 開頭避免和玩家的變數撞名；每次呼叫都給新的 list，免得被玩家的函式改到）
const T_DATA = R`def _t_fresh():
    return [{'product': '拿鐵', 'price': 120, 'qty': 3}, {'product': '美式', 'price': 90, 'qty': 3}, {'product': '拿鐵', 'price': 120, 'qty': 1}, {'product': '司康', 'price': 75, 'qty': 2}, {'product': '美式', 'price': 90, 'qty': 5}]
_t_counts = {'拿鐵': 4, '美式': 8, '司康': 2}
`;
const TEST1 = R`check('product' in dir() and product == '拿鐵', "變數 product 應該是 '拿鐵'")
check('price' in dir() and price == 120, '變數 price 應該是 120（數字，不要加引號）')
check('qty' in dir() and qty == 3, '變數 qty 應該是 3')
check('line_total' in dir() and line_total == 360, '變數 line_total 應該是 360（price * qty）')
check('拿鐵 360' in output(), '要用 print(product, line_total) 印出「拿鐵 360」')`;
const TEST2 = T_DATA + R`check('orders' in dir() and isinstance(orders, list), '要有一個叫 orders 的清單（list）')
if 'orders' in dir() and isinstance(orders, list):
    check(len(orders) == 5, f'orders 應該有 5 筆訂單，目前有 {len(orders)} 筆')
    check(all(isinstance(o, dict) and set(o) == {'product', 'price', 'qty'} for o in orders), '每一筆訂單都要是 dict，而且有 product、price、qty 三個欄位')
    check(orders == _t_fresh(), '5 筆訂單的內容要和題目給的一模一樣（商品、單價、份數、順序都要對）')
check('共 5 筆訂單' in output(), "要印出「共 5 筆訂單」，用 print('共', len(orders), '筆訂單')")`;
const TEST3 = T_DATA + R`check(globals().get('orders') == _t_fresh(), '前面做好的 orders 要保留，不要刪掉或改掉')
check(globals().get('grand_total') == 1350, f"變數 grand_total 應該是 1350，目前是 {globals().get('grand_total')}")
check('總營收 1350' in output(), "要印出「總營收 1350」，用 print('總營收', grand_total)")`;
const TEST4 = T_DATA + R`check('total_revenue' in dir(), '要有 total_revenue 這個函式')
if 'total_revenue' in dir():
    check(total_revenue(_t_fresh()) == 1350, f'total_revenue(orders) 應該是 1350，目前是 {total_revenue(_t_fresh())}（有 return 嗎？）')
    check(total_revenue([]) == 0, '沒有訂單時（空清單）應該回傳 0')
    check(total_revenue([{'product': 'X', 'price': 10, 'qty': 2}]) == 20, "只有一筆 10 元 x 2 份時，應該回傳 20（函式要用傳進去的參數，不要偷用外面的 orders）")
check(globals().get('grand_total') == 1350, 'grand_total 應該是呼叫 total_revenue(orders) 的結果，也就是 1350')
check('總營收 1350' in output(), "要印出「總營收 1350」")`;
const TEST5 = T_DATA + R`check('big_orders' in dir(), '要有 big_orders 這個函式')
if 'big_orders' in dir():
    _t_r = big_orders(_t_fresh(), 200)
    check([o['product'] for o in _t_r] == ['拿鐵', '美式', '美式'] and [o['qty'] for o in _t_r] == [3, 3, 5], f'big_orders(orders, 200) 應該挑出 360、270、450 元的三筆訂單（拿鐵x3、美式x3、美式x5），目前挑出 {len(_t_r)} 筆')
    check(len(big_orders(_t_fresh(), 360)) == 2, '金額剛好等於門檻也要算（>=）：門檻 360 時應該有 2 筆（360 和 450）')
    check(big_orders(_t_fresh(), 1000) == [], '門檻太高、沒有符合的訂單時，要回傳空清單 []')
    check(len(big_orders(_t_fresh(), 0)) == 5, '門檻 0 時，5 筆訂單都要留下')
    check(big_orders([], 100) == [], '空清單要回傳 []')
check('大單 3 筆' in output(), "要印出「大單 3 筆」，用 print('大單', len(big), '筆')")
check(globals().get('grand_total') == 1350, '前面算總營收的部分要保留（grand_total 應該還是 1350）')`;
const TEST6 = T_DATA + R`check('count_by_product' in dir(), '要有 count_by_product 這個函式')
if 'count_by_product' in dir():
    check(count_by_product(_t_fresh()) == _t_counts, f"count_by_product(orders) 應該是 {_t_counts}，目前是 {count_by_product(_t_fresh())}")
    check(count_by_product([]) == {}, '空清單要回傳空的 dict {}')
    check(count_by_product([{'product': 'A', 'price': 1, 'qty': 5}, {'product': 'A', 'price': 1, 'qty': 2}]) == {'A': 7}, '同一個商品的份數要加起來（5 + 2 = 7）')
check(globals().get('counts') == _t_counts, f"變數 counts 應該是 {_t_counts}")`;
const TEST7 = T_DATA + R`check('top_sellers' in dir(), '要有 top_sellers 這個函式')
if 'top_sellers' in dir():
    _t_top = [tuple(p) for p in top_sellers(dict(_t_counts), 2)]
    check(_t_top == [('美式', 8), ('拿鐵', 4)], f"top_sellers(counts, 2) 應該是 [('美式', 8), ('拿鐵', 4)]（賣最多的排最前面），目前是 {_t_top}")
    check([tuple(p) for p in top_sellers(dict(_t_counts), 1)] == [('美式', 8)], 'n 是 1 時只能回傳第 1 名')
    check([tuple(p) for p in top_sellers(dict(_t_counts), 5)] == [('美式', 8), ('拿鐵', 4), ('司康', 2)], 'n 比商品數還大時，就回傳全部（由多到少）')
    check([tuple(p) for p in top_sellers({'A': 1, 'B': 9, 'C': 5}, 3)] == [('B', 9), ('C', 5), ('A', 1)], '換一份資料也要由多到少排好')
check('美式 8' in output() and '拿鐵 4' in output(), '要用 for 印出前兩名：「美式 8」和「拿鐵 4」')
check(globals().get('counts') == _t_counts, '前面算 counts 的部分要保留')`;
const TEST8 = T_DATA + R`_t_raw = ['拿鐵,120,3', '美式,90,3', '拿鐵,120,1', '壞掉的一行', '司康,75,2', '美式,90,5', '咖啡,abc,2']
check('parse_line' in dir(), '要有 parse_line 這個函式')
if 'parse_line' in dir():
    check(parse_line('拿鐵,120,3') == {'product': '拿鐵', 'price': 120, 'qty': 3}, "parse_line('拿鐵,120,3') 應該是 {'product': '拿鐵', 'price': 120, 'qty': 3}（price、qty 要用 int() 變成數字）")
    for _t_bad in ['壞掉的一行', '咖啡,abc,2']:
        try:
            parse_line(_t_bad)
            check(False, f"parse_line('{_t_bad}') 應該要丟出 ValueError（不用自己 raise，split 和 int 會自己丟）")
        except ValueError:
            pass
check('load_orders' in dir(), '要有 load_orders 這個函式')
if 'load_orders' in dir():
    _t_g, _t_b = load_orders(_t_raw)
    check(_t_g == _t_fresh(), f'load_orders 回傳的第 1 個要是 5 筆好訂單，目前是 {len(_t_g)} 筆')
    check(_t_b == 2, f'load_orders 回傳的第 2 個要是壞資料的行數 2，目前是 {_t_b}')
    check(tuple(load_orders([])) == ([], 0), '空清單要回傳 ([], 0)')
    check(tuple(load_orders(['A,1,2'])) == ([{'product': 'A', 'price': 1, 'qty': 2}], 0), "全部都是好資料時，壞資料行數要是 0")
check('make_report' in dir(), '要有 make_report 這個函式')
if 'make_report' in dir():
    _t_rep = make_report(_t_fresh())
    check(_t_rep == '總營收：1350 元\n訂單數：5 筆\n美式：8 份\n拿鐵：4 份', f'make_report(orders) 的文字和題目要求的不一樣，目前是：{_t_rep!r}')
    check(make_report([]) == '總營收：0 元\n訂單數：0 筆', '沒有訂單時應該是「總營收：0 元」換行「訂單數：0 筆」，不用有排行榜')
check('總營收：1350 元' in output() and '美式：8 份' in output(), '要 print(make_report(good)) 把報表印出來')
check('有 2 行資料格式錯誤，已略過' in output(), "要印出「有 2 行資料格式錯誤，已略過」，用 print(f'有 {bad} 行資料格式錯誤，已略過')")
# 前面每一步的功能也要還能用
if all(n in globals() for n in ['total_revenue', 'big_orders', 'count_by_product', 'top_sellers']):
    check(total_revenue(_t_fresh()) == 1350 and total_revenue([]) == 0, '第 4 步的 total_revenue 被改壞了')
    check(len(big_orders(_t_fresh(), 200)) == 3, '第 5 步的 big_orders 被改壞了')
    check(count_by_product(_t_fresh()) == _t_counts, '第 6 步的 count_by_product 被改壞了')
    check([tuple(p) for p in top_sellers(dict(_t_counts), 2)] == [('美式', 8), ('拿鐵', 4)], '第 7 步的 top_sellers 被改壞了')
else:
    check(False, '前面第 4～7 步寫好的函式（total_revenue、big_orders、count_by_product、top_sellers）都要保留')
check(globals().get('orders') == _t_fresh() and globals().get('line_total') == 360, '第 1、2 步的 line_total 與 orders 要保留')`;

/* ---------- 8 個單元 ---------- */
const GP = (n, title, steps, fin) => ({ id: 'pyg' + n, title: `手把手 ${n}／8　${title}`, steps: steps.map((s, i) => (i === 0 ? { ...s, say: progressMap(n) + s.say } : s)), final: py(fin) });

const G_UNITS = [
  GP(1, '空白檔案：print 與變數', [
    gstep(`<p><b>我們要做什麼？</b>一個「訂單統計小工具」：給它一堆咖啡店的訂單，它會算出總營收、哪些是大單、哪個商品賣最好，最後印成一份報表。</p><p><b>為什麼從一筆訂單開始？</b>蓋房子要先打地基。我們先只處理<b>一筆</b>訂單：商品、單價、份數，算出這筆多少錢。連這個都會了，後面只是「一筆變很多筆」而已。</p><p>這一步只學兩個東西：<b>變數</b>和 <b>print</b>。</p>`,
      choice('為什麼我們先只做「一筆訂單」？', ['先把最小的一塊做對，後面再一步一步變大', '因為 Python 一次只能處理一筆', '因為訂單不能有很多筆'], 0, '大專案都是從最小、能跑的一塊開始長大的。')),
    gstep(`<p><b>變數</b>就像「貼了名字標籤的盒子」，東西放進去，以後用名字就拿得到。</p>${pre("product = '拿鐵'          # 文字（字串）要用引號包起來\nprice = 120              # 數字不用引號\nqty = 3\nline_total = price * qty   # 用變數做計算，結果放進新變數 line_total\nprint(product, line_total)  # 印出：拿鐵 360")}<ul><li><code>=</code> 的意思是「把右邊的值<b>放進</b>左邊的盒子」，不是數學的「等於」。</li><li><code>*</code> 是乘法。</li><li><code>print(a, b)</code> 用逗號隔開，會把兩個東西印在同一行，中間自動空一格。</li></ul>`,
      choice('<code>line_total = price * qty</code> 在做什麼？', ['算出 price 乘以 qty，把結果放進 line_total', '檢查 line_total 是不是等於 price 乘 qty', '印出 line_total'], 0, '單個 = 是「放進去」；檢查是不是相等要用 ==。')),
    gstep(`<p><b>常見的坑：</b></p><ul><li>文字忘了引號：<code>product = 拿鐵</code> 會出錯，Python 以為「拿鐵」是一個變數的名字。</li><li>數字亂加引號：<code>price = '120'</code> 變成文字，<code>'120' * 3</code> 會變成「120120120」而不是 360！</li><li>變數名字不能有空格，也不要用中文以外的奇怪符號；我們用 <code>line_total</code> 這種英文加底線。</li></ul><p><b>下一步預告：</b>第 2 步，訂單不會只有一筆。我們要用 <b>list</b>（清單）裝一堆訂單，每一筆訂單用 <b>dict</b>（字典）把商品、單價、份數綁在一起。</p>`,
      choice('<code>price = \'120\'</code>（有加引號）會有什麼問題？', ['它變成文字，拿去乘法會得到怪結果', '沒有問題，跟 120 一樣', '程式會當掉'], 0, '有引號就是文字。數字要計算，就不要加引號。')),
  ], {
    brief: '第 1 步：從空白開始。建立 <code>product</code>（\'拿鐵\'）、<code>price</code>（120）、<code>qty</code>（3），算出 <code>line_total</code>，再用 <code>print(product, line_total)</code> 印出「拿鐵 360」。',
    hint: '照 TODO 1～3，把註解換成真的程式。每行最前面不要空格。',
    steps: [
      `TODO 1：<pre>product = '拿鐵'\nprice = 120\nqty = 3</pre>為什麼：先把這筆訂單的三項資料存進變數，以後算什麼都靠它們。`,
      `TODO 2：<pre>line_total = price * qty</pre>為什麼：單價乘份數就是這筆訂單的金額。我們用變數計算，不要自己心算打 360。`,
      `TODO 3：<pre>print(product, line_total)</pre>為什麼：print 把結果印出來，我們才看得到。最常犯的錯：<code>拿鐵</code> 忘了加引號，或引號前後不一樣（一邊 ' 一邊 "）。`,
    ],
    starter: S1, solution: SOL1,
    must: [{ re: /price\s*\*\s*qty/, msg: '請用 price * qty 算出 line_total，不要直接打 360' }],
    tests: TEST1,
  }),
  GP(2, '一堆訂單：list 裡放 dict', [
    gstep(`<p>一筆訂單做好了。但店裡一天會有<b>很多筆</b>訂單，我們不可能幫每一筆都取一個變數名（order1、order2、order3……會瘋掉）。</p><p>所以要用兩個「裝東西的容器」：</p><ul><li><b>dict（字典）</b>：把<b>一筆訂單</b>的資料綁在一起，像一張填好的訂單表。</li><li><b>list（清單）</b>：把<b>很多筆訂單</b>排成一排，像一疊訂單。</li></ul>`,
      choice('「很多筆訂單排成一排」適合用哪個容器？', ['list（清單）', '一個很長的字串', '很多個不同名字的變數'], 0, 'list 就是用來裝「一排東西」的。')),
    gstep(`<p>寫法：</p>${pre("order = {'product': '拿鐵', 'price': 120, 'qty': 3}   # 一筆訂單 = dict\nprint(order['price'])                              # 用「欄位名字」取值：120\n\norders = [\n    {'product': '拿鐵', 'price': 120, 'qty': 3},\n    {'product': '美式', 'price': 90, 'qty': 3},\n]                                                  # 很多筆 = list，裡面每個都是 dict\nprint(len(orders))                                 # len = 有幾個：2\nprint(orders[0]['product'])                        # 第 0 個（第一筆）的商品：拿鐵")}<ul><li>dict 用大括號 <code>{ }</code>，每個欄位是 <code>'名字': 值</code>，欄位之間用逗號。</li><li>list 用中括號 <code>[ ]</code>，每一個東西之間用逗號。</li><li>位置從 <b>0</b> 開始算：第一個是 <code>[0]</code>。</li></ul>`,
      choice('<code>orders[0][\'product\']</code> 會拿到什麼？', ['第一筆訂單的商品名稱', '最後一筆訂單', '所有訂單的商品'], 0, '先 [0] 拿第一筆（一個 dict），再 [\'product\'] 拿它的商品欄位。')),
    gstep(`<p><b>常見的坑：</b></p><ul><li>最後一筆後面的逗號可以有，但<b>中間漏掉逗號</b>會出錯。</li><li>dict 欄位的名字要加引號：<code>'product'</code>。沒加引號，Python 會以為是變數。</li><li>括號要成對：<code>[</code> 對 <code>]</code>、<code>{</code> 對 <code>}</code>。可以每打完一個就補上另一半。</li></ul><p><b>下一步預告：</b>第 3 步，用 <b>for 迴圈</b>一筆一筆走過 orders，把每一筆的金額加起來，算出總營收。</p>`,
      choice('一個 list 裡面有 5 個 dict，<code>len(orders)</code> 是？', ['5', '3', '1'], 0, 'len 數的是 list 裡面有幾個東西。')),
  ], {
    brief: '第 2 步：建立 <code>orders</code> 清單，放 5 筆訂單（每筆是 dict，有 <code>product</code>、<code>price</code>、<code>qty</code>），再印出「共 5 筆訂單」。上一步的程式保留。',
    hint: '照著 TODO 註解裡的 5 行，一行一行打進中括號裡，每一行結尾要有逗號。',
    steps: [
      `TODO 1：<pre>orders = [\n    {'product': '拿鐵', 'price': 120, 'qty': 3},\n    {'product': '美式', 'price': 90, 'qty': 3},\n    {'product': '拿鐵', 'price': 120, 'qty': 1},\n    {'product': '司康', 'price': 75, 'qty': 2},\n    {'product': '美式', 'price': 90, 'qty': 5},\n]</pre>為什麼：這就是我們的 5 筆訂單，後面所有統計都靠它。換行後縮排 4 格，看起來比較整齊。`,
      `TODO 2：<pre>print('共', len(orders), '筆訂單')</pre>為什麼：len 數出有幾筆，印出來確認 5 筆都放進去了。最常犯的錯：dict 裡的欄位名字拼錯（像 <code>prise</code>），或某一行結尾漏了逗號。`,
    ],
    starter: S2, solution: SOL2,
    must: [{ re: /orders\s*=\s*\[/, msg: '請用 orders = [ ... ] 建立清單' }],
    tests: TEST2,
  }),
  GP(3, '用 for 迴圈算出總營收', [
    gstep(`<p>現在有 5 筆訂單了，老闆最想知道的是：<b>今天總共賣了多少錢？</b></p><p>人在算帳時會怎麼做？一張一張訂單看，把金額加到「累計」裡。程式也是一樣，這就叫<b>迴圈</b>：重複做同一件事。做法是「準備一個存錢的盒子（從 0 開始），每看一筆就加上去」。</p>`,
      choice('算總營收時，存累計金額的變數一開始要是？', ['0', '第一筆的金額', '空字串'], 0, '還沒開始加之前，累計是 0。')),
    gstep(`<p>寫法：</p>${pre("grand_total = 0                          # 累計從 0 開始\nfor o in orders:                        # 一筆一筆走過，每次的那一筆叫 o\n    grand_total += o['price'] * o['qty']   # 把這筆的金額加進去\nprint('總營收', grand_total)             # 走完才印")}<ul><li><code>for o in orders:</code>：最後有<b>冒號</b>。每走到一筆，就把它叫做 <code>o</code>。</li><li>下一行要<b>縮排 4 格</b>，表示「這行屬於迴圈裡面，每一筆都做一次」。</li><li><code>x += 5</code> 是 <code>x = x + 5</code> 的縮寫，意思是「加上去」。</li><li><code>print</code> 沒有縮排，因為要等全部加完才印一次。</li></ul>`,
      choice('<code>grand_total += 10</code> 等於？', ['grand_total = grand_total + 10', 'grand_total = 10', 'grand_total == 10'], 0, '+= 是「在原本的基礎上再加」。')),
    gstep(`<p><b>常見的坑：</b></p><ul><li><code>for</code> 那行忘了冒號，或下一行忘了縮排，會出現 IndentationError。</li><li>把 <code>grand_total = 0</code> 寫進迴圈裡：每一筆都被重設成 0，最後只剩最後一筆的金額。</li><li>把 <code>print</code> 也縮排進迴圈：會印出 5 次，不是 1 次。</li></ul><p><b>下一步預告：</b>第 4 步，我們把「算總營收」包成<b>函式</b>，以後給它任何一批訂單都能算，不用再複製貼上。</p>`,
      choice('總營收如果只印一次，<code>print</code> 要放在哪？', ['迴圈後面、不縮排', '迴圈裡面、縮排', '迴圈上面'], 0, '縮排的才會每一筆做一次；全部加完要印一次，就不縮排。')),
  ], {
    brief: '第 3 步：用 for 迴圈走過 <code>orders</code>，算出總營收存到 <code>grand_total</code>，再印出「總營收 1350」。',
    hint: '三個 TODO：先 grand_total = 0，再 for 迴圈裡累加，最後 print。',
    steps: [
      `TODO 1：<pre>grand_total = 0</pre>為什麼：累計從 0 開始，一筆都還沒加。`,
      `TODO 2：<pre>for o in orders:\n    grand_total += o['price'] * o['qty']</pre>為什麼：每一筆的金額是 price 乘 qty，全部加起來就是總營收。第二行要縮排 4 格。`,
      `TODO 3：<pre>print('總營收', grand_total)</pre>為什麼：不縮排，等迴圈全部跑完才印。最常犯的錯：<code>grand_total = 0</code> 寫在迴圈裡面，每圈都被歸零。`,
    ],
    starter: S3, solution: SOL3,
    must: [{ re: /for\s+\w+\s+in\s+orders\s*:/, msg: '請用 for ... in orders: 走過每一筆訂單' }],
    tests: TEST3,
  }),
  GP(4, '包成函式：參數與 return', [
    gstep(`<p>現在的程式有個小問題：這段「算總營收」是<b>寫死</b>在這個檔案裡的。如果明天想算<b>另一批</b>訂單（例如只算週末的），就得再複製貼上一份。</p><p>解法是<b>函式</b>：像一台「果汁機」，你放進水果（<b>參數</b>），它幫你打好，把果汁交給你（<b>return</b>）。以後換不同水果，機器不用重做。</p>`,
      choice('把程式包成函式最大的好處是？', ['給不同的資料，可以重複使用同一段程式', '程式會跑得比較快', '可以不用縮排'], 0, '函式就是「可以重複使用的一段程式」。')),
    gstep(`<p>寫法：</p>${pre("def total_revenue(orders):        # def 開頭、名字、括號裡是參數、結尾冒號\n    total = 0                     # 縮排 4 格：函式的內容\n    for o in orders:\n        total += o['price'] * o['qty']\n    return total                  # 把結果「交出去」\n\ngrand_total = total_revenue(orders)   # 呼叫函式，接住交出來的結果\nprint('總營收', grand_total)")}<ul><li><code>def</code>：定義（define）函式。括號裡的 <code>orders</code> 是<b>參數</b>，是「函式自己的名字」，呼叫時傳什麼進來，它就代表什麼。</li><li><code>return</code>：把答案交出去，並且<b>立刻結束函式</b>。</li><li>函式<b>定義</b>只是寫好食譜，要<b>呼叫</b>（後面加括號和資料）才會真的執行。</li></ul>`,
      choice('函式裡 <code>return total</code> 的作用是？', ['把算好的結果交給呼叫的人', '把 total 印在畫面上', '重新開始函式'], 0, 'return 是「交出結果」，不是印出來。')),
    gstep(`<p><b>常見的坑：</b></p><ul><li>忘了 <code>return</code>：函式會交出 <code>None</code>（什麼都沒有），<code>grand_total</code> 就不是數字。</li><li>把 <code>return</code> 縮排進 for 裡面：只算第一筆就結束了！<code>return</code> 要和 <code>for</code> 對齊。</li><li><code>print</code> 和 <code>return</code> 不一樣：print 是給人看，return 是給程式拿去用。</li></ul><p><b>下一步預告：</b>第 5 步，老闆說「小訂單不重要，我只想看金額大的」——我們用 <b>if</b> 和<b>推導式</b>篩選。</p>`,
      choice('函式忘了寫 <code>return</code>，呼叫它會得到？', ['None（什麼都沒有）', '0', '會自己猜一個答案'], 0, '沒有 return，Python 就交出 None。')),
  ], {
    brief: '第 4 步：寫 <code>total_revenue(orders)</code>，回傳一批訂單的總營收（空清單回傳 0）。用它算出 <code>grand_total</code> 並印出「總營收 1350」。',
    hint: '把第 3 步的迴圈搬進函式，開頭的 total = 0 放在函式裡，最後 return。',
    steps: [
      `TODO 1：<pre>def total_revenue(orders):\n    total = 0\n    for o in orders:\n        total += o['price'] * o['qty']\n    return total</pre>為什麼：把原本的迴圈整段搬進函式（縮排 4 格）。累計變數叫 total，函式算完用 return 交出去。`,
      `TODO 2：<pre>grand_total = total_revenue(orders)\nprint('總營收', grand_total)</pre>為什麼：呼叫函式，並把交出來的結果接進 grand_total。上面舊的迴圈如果還在，可以刪掉。最常犯的錯：忘了 <code>return</code>，或 return 縮排太多跑進 for 裡面。`,
    ],
    starter: S4, solution: SOL4,
    must: [{ re: /def\s+total_revenue\s*\(\s*\w+\s*\)\s*:/, msg: '請用 def total_revenue(orders): 定義函式' }, { re: /return\b/, msg: '函式要用 return 交出結果' }],
    tests: TEST4,
  }),
  GP(5, '篩出大單：if 與推導式', [
    gstep(`<p>老闆說：「金額 200 元以上的訂單才算<b>大單</b>，我想單獨看這些。」</p><p>這叫<b>篩選</b>：從一堆東西裡，只留下符合條件的。就像篩子，小的漏下去，大的留下來。Python 用 <b>if</b> 判斷「符合嗎？」。</p>`,
      choice('「只留下符合條件的訂單」這件事叫什麼？', ['篩選', '排序', '加總'], 0, '像篩子一樣，不符合的過濾掉。')),
    gstep(`<p>先看「慢慢寫」的版本，用 for 加上 if：</p>${pre("big = []                                    # 空清單，準備放大單\nfor o in orders:\n    if o['price'] * o['qty'] >= 200:       # 金額 >= 200 才進來\n        big.append(o)                       # append：加到清單最後面")}<p>Python 還有一個很愛用的一行寫法，叫<b>推導式（list comprehension）</b>，意思完全一樣：</p>${pre("big = [o for o in orders if o['price'] * o['qty'] >= 200]\n#      ↑ 留下的東西   ↑ 走過每一筆   ↑ 條件成立才留下")}<p>讀法：「對 orders 裡的每個 o，如果金額 &gt;= 200，就留下 o」。外面是<b>中括號</b>，因為結果是新的 list。</p><p>把它包成函式，門檻變成參數 <code>min_total</code>：</p>${pre("def big_orders(orders, min_total):\n    return [o for o in orders if o['price'] * o['qty'] >= min_total]")}<p>函式可以有<b>很多個參數</b>，用逗號隔開。</p>`,
      choice('<code>[o for o in orders if 條件]</code> 會得到？', ['一個新的 list，只有符合條件的 o', '一個數字', '原本的 orders 被修改'], 0, '推導式是做出「新的 list」，不會改到原本的。')),
    gstep(`<p><b>常見的坑：</b></p><ul><li><code>&gt;=</code> 是「大於或等於」，寫成 <code>&gt;</code> 的話，金額剛好等於門檻的訂單會被漏掉。</li><li>推導式最前面的東西是「留下什麼」。留 <code>o</code> 就是留整筆訂單；如果寫成 <code>o['qty']</code>，留下的就只剩份數。</li><li>沒有任何符合時，結果是空清單 <code>[]</code>，不是錯誤。</li></ul><p><b>下一步預告：</b>第 6 步，我們用 <b>dict 計數</b>：算出每個商品各賣了幾份。</p>`,
      choice('金額剛好等於 200 的訂單，要算大單，條件要用？', ['>= 200', '> 200', '== 100'], 0, '>= 包含剛好等於。')),
  ], {
    brief: '第 5 步：寫 <code>big_orders(orders, min_total)</code>，回傳「金額（price * qty）大於或等於 min_total」的訂單清單（建議用推導式）。再印出「大單 3 筆」（門檻 200）。',
    hint: '一行就能寫完：<code>return [o for o in orders if o[\'price\'] * o[\'qty\'] &gt;= min_total]</code>',
    steps: [
      `TODO 1：<pre>def big_orders(orders, min_total):\n    return [o for o in orders if o['price'] * o['qty'] >= min_total]</pre>為什麼：兩個參數：一批訂單、一個門檻。推導式把金額夠大的訂單留下來，整份交出去。`,
      `TODO 2：<pre>big = big_orders(orders, 200)</pre>為什麼：用門檻 200 呼叫，結果存進 big。`,
      `TODO 3：<pre>print('大單', len(big), '筆')</pre>為什麼：len 數出有幾筆符合，應該是 3 筆（360、270、450）。最常犯的錯：把 <code>&gt;=</code> 寫成 <code>&gt;</code>，或推導式前面留成 <code>o['price']</code> 而不是整個 <code>o</code>。`,
    ],
    starter: S5, solution: SOL5,
    must: [{ re: /def\s+big_orders\s*\(/, msg: '請用 def big_orders(orders, min_total): 定義函式' }, { re: /\[[^\]]*\bfor\b[^\]]*\bif\b/, msg: '請用推導式 [... for ... in ... if ...] 篩選' }],
    tests: TEST5,
  }),
  GP(6, '數出每個商品賣幾份：dict 計數', [
    gstep(`<p>老闆接著問：「<b>每個商品各賣了幾份？</b>」拿鐵出現在好幾筆訂單裡，要把它們的份數加在一起。</p><p>這就像統計票數：每看到一張票，就在那個人名下面劃一筆。程式裡我們用 <b>dict 當記分板</b>：商品名字是「欄位」，賣出的份數是「值」。</p>`,
      choice('「每個商品各賣幾份」，適合用什麼當記分板？', ['dict（名字對應數字）', '一個數字', '一個字串'], 0, 'dict 剛好是「名字 → 數字」。')),
    gstep(`<p>寫法：</p>${pre("def count_by_product(orders):\n    result = {}                          # 一開始是空的記分板\n    for o in orders:\n        name = o['product']              # 這筆訂單的商品名字\n        result[name] = result.get(name, 0) + o['qty']\n    return result                        # 全部算完才交出去\n\ncounts = count_by_product(orders)\nprint(counts)    # {'拿鐵': 4, '美式': 8, '司康': 2}")}<ul><li><code>result.get(name, 0)</code>：「查 result 裡 name 目前記了多少；如果還沒記過，就當作 0」。</li><li>整行的意思：<b>原本的份數 + 這一筆的份數</b>，再存回去。</li><li>為什麼不直接寫 <code>result[name] += ...</code>？因為第一次遇到某個商品時，記分板裡還沒有它，會出現 <b>KeyError</b>。用 <code>get(名字, 0)</code> 就安全。</li></ul>`,
      choice('<code>result.get(\'司康\', 0)</code>，如果 result 裡還沒有 \'司康\'，會得到？', ['0', 'KeyError 錯誤', 'None'], 0, 'get 的第二個參數是「找不到時的預設值」。')),
    gstep(`<p><b>常見的坑：</b></p><ul><li><code>return result</code> 縮排太多跑進 for 裡面：只算一筆就結束。</li><li><code>result = {}</code> 寫進迴圈裡：每一筆都被清空。</li><li>加的是份數 <code>o['qty']</code>，不是 <code>1</code>（1 是「算有幾筆訂單」，不是「賣幾份」）。</li></ul><p><b>下一步預告：</b>第 7 步，我們把這份記分板<b>排序</b>，做出「暢銷排行榜」。</p>`,
      choice('如果要算「這個商品被點了幾次（幾筆訂單）」而不是賣幾份，加的應該是？', ['1', "o['qty']", "o['price']"], 0, '每筆訂單算 1 次；而賣幾份要加 qty。我們這題要的是賣幾份。')),
  ], {
    brief: '第 6 步：寫 <code>count_by_product(orders)</code>，回傳每個商品賣出的總份數，像 <code>{\'拿鐵\': 4, \'美式\': 8, \'司康\': 2}</code>。再 <code>counts = count_by_product(orders)</code> 並 <code>print(counts)</code>。',
    hint: '空 dict → for 走過每一筆 → <code>result[名字] = result.get(名字, 0) + o[\'qty\']</code> → return。',
    steps: [
      `TODO 1（函式外框）：<pre>def count_by_product(orders):\n    result = {}</pre>為什麼：先準備好空的記分板。`,
      `TODO 1（迴圈）：<pre>    for o in orders:\n        name = o['product']\n        result[name] = result.get(name, 0) + o['qty']\n    return result</pre>為什麼：每一筆都把份數加到對應商品上；第一次遇到的商品，get 給 0 當起點。return 和 for 對齊，等迴圈跑完才交出去。`,
      `TODO 2：<pre>counts = count_by_product(orders)\nprint(counts)</pre>為什麼：呼叫函式並印出來看結果。最常犯的錯：<code>result[name] += o['qty']</code> 直接加，第一次遇到商品會 KeyError；或 return 縮排進迴圈裡。`,
    ],
    starter: S6, solution: SOL6,
    must: [{ re: /def\s+count_by_product\s*\(/, msg: '請用 def count_by_product(orders): 定義函式' }],
    tests: TEST6,
  }),
  GP(7, '排行榜：排序找出最暢銷', [
    gstep(`<p>記分板有了：<code>{'拿鐵': 4, '美式': 8, '司康': 2}</code>。但老闆想看的是<b>排行榜</b>：誰賣最多，排第一名。</p><p>dict 本身沒有「名次」，所以我們要<b>排序</b>：把它變成一排「(名字, 份數)」，再依份數由多到少排好，最後只取前幾名。</p>`,
      choice('「賣最多的排前面」，這件事需要？', ['排序（由大到小）', '篩選', '轉成文字'], 0, '排行榜就是照數字由大到小排。')),
    gstep(`<p>寫法：</p>${pre("def top_sellers(counts, n):\n    ranked = sorted(counts.items(), key=lambda pair: pair[1], reverse=True)\n    return ranked[:n]\n\nfor name, qty in top_sellers(counts, 2):\n    print(name, qty)      # 美式 8　　拿鐵 4")}<p>一個零件一個零件看：</p><ul><li><code>counts.items()</code>：把 dict 變成一排 <code>(名字, 份數)</code> 的小組合，例如 <code>('美式', 8)</code>。</li><li><code>sorted(...)</code>：排序，<b>回傳一個新的 list</b>。</li><li><code>key=lambda pair: pair[1]</code>：告訴 sorted「照什麼排」。<code>lambda pair: ...</code> 是臨時寫的小函式，拿到一組 pair，回傳 <code>pair[1]</code>（第 2 個，也就是份數）。</li><li><code>reverse=True</code>：預設是小到大，加這個變成大到小。</li><li><code>ranked[:n]</code>：切片，取前 n 個。</li><li><code>for name, qty in ...</code>：每一組直接拆成兩個變數。</li></ul>`,
      choice('<code>sorted(..., reverse=True)</code> 的 <code>reverse=True</code> 是？', ['由大到小排', '把清單反過來印', '刪掉重複的'], 0, '預設小到大，reverse=True 變成大到小。')),
    gstep(`<p><b>常見的坑：</b></p><ul><li>忘了 <code>reverse=True</code>：排行榜變成「賣最少的在第一名」。</li><li><code>key</code> 寫成 <code>pair[0]</code>：那是照「名字」排，不是照份數。</li><li>寫成 <code>counts.sort()</code>：dict 沒有 sort；而 list 的 <code>.sort()</code> 會直接改原本的東西並回傳 None。我們用 <code>sorted()</code>，它回傳新的。</li><li><code>ranked[:n]</code> 的 n 比總數還大也沒關係，會有幾個就給幾個。</li></ul><p><b>下一步預告：</b>最後一步（第 8 步）：把資料變成漂亮的<b>文字報表</b>，並處理「原始資料有錯」的情況。</p>`,
      choice('想照「份數」排序，<code>key</code> 要拿 pair 的哪一個？', ['pair[1]（份數）', 'pair[0]（名字）', 'pair[2]'], 0, "pair 是 ('美式', 8)：[0] 是名字，[1] 才是份數。")),
  ], {
    brief: '第 7 步：寫 <code>top_sellers(counts, n)</code>，回傳賣最多的前 n 名，像 <code>[(\'美式\', 8), (\'拿鐵\', 4)]</code>（由多到少）。再用 for 印出前 2 名：「美式 8」、「拿鐵 4」。',
    hint: '<code>sorted(counts.items(), key=lambda pair: pair[1], reverse=True)</code>，然後取 <code>[:n]</code>。',
    steps: [
      `TODO 1：<pre>def top_sellers(counts, n):\n    ranked = sorted(counts.items(), key=lambda pair: pair[1], reverse=True)\n    return ranked[:n]</pre>為什麼：先照份數由多到少排好，再取前 n 個交出去。`,
      `TODO 2：<pre>for name, qty in top_sellers(counts, 2):\n    print(name, qty)</pre>為什麼：每一名拆成「名字」和「份數」兩個變數，一行印一名；print 要縮排。最常犯的錯：忘了 <code>reverse=True</code>，第一名變成賣最少的。`,
    ],
    starter: S7, solution: SOL7,
    must: [{ re: /sort/, msg: '請用 sorted(...) 排序' }, { re: /reverse\s*=\s*True/, msg: '要由多到少，記得 reverse=True' }],
    tests: TEST7,
  }),
  GP(8, '收尾：f-string 報表與 try/except', [
    gstep(`<p>最後一步，把作品打磨到「真的能用」。現在有兩件事沒做好：</p><ul><li>印出來的東西很零散。老闆想要一份<b>整齊的報表</b>，可以整份貼給別人。</li><li>真實的資料常常<b>有錯</b>（少一欄、數字變成文字），程式遇到就當掉。我們要讓它「跳過壞資料，並告訴你有幾行壞掉」。</li></ul><p>先做報表：用 <b>f-string</b>（字串前面加 <code>f</code>，大括號裡放變數）把數字塞進句子，再用 <code>'\\n'.join(...)</code> 把多行接成一份。</p>${pre("lines = [f'總營收：{total_revenue(orders)} 元', f'訂單數：{len(orders)} 筆']\nfor name, qty in top_sellers(count_by_product(orders), 2):\n    lines.append(f'{name}：{qty} 份')   # append：再加一行\nreport = '\\n'.join(lines)               # 用換行把每一行接起來")}<p>大括號裡不只能放變數，<b>算式、函式呼叫</b>也可以。</p>`,
      choice('<code>f\'訂單數：{len(orders)} 筆\'</code> 會得到？', ['訂單數：5 筆（把 len(orders) 算出來放進去）', "訂單數：{len(orders)} 筆（原樣）", '出錯'], 0, 'f-string 會把大括號裡的算式先算出來。')),
    gstep(`<p>接著處理壞資料。原始資料是一行一行的文字，像 <code>'拿鐵,120,3'</code>。要先切開、轉成數字：</p>${pre("def parse_line(text):\n    name, price, qty = text.split(',')    # 用逗號切成 3 段，分別放進 3 個變數\n    return {'product': name, 'price': int(price), 'qty': int(qty)}\n    # int('120') 把文字變成數字 120")}<p>遇到 <code>'壞掉的一行'</code>（切不成 3 段）或 <code>'咖啡,abc,2'</code>（abc 不是數字），Python 會丟出 <b>ValueError</b>。我們用 <b>try / except</b> 接住它，讓程式繼續跑：</p>${pre("def load_orders(lines):\n    good = []            # 好的訂單\n    bad = 0              # 壞資料有幾行\n    for line in lines:\n        try:\n            good.append(parse_line(line))   # 試試看\n        except ValueError:                  # 如果丟出 ValueError\n            bad += 1                         # 就記一筆壞資料，繼續下一行\n    return good, bad     # 一次交出兩個東西")}<p><code>return good, bad</code> 一次回傳兩個，呼叫時也用兩個變數接：<code>good, bad = load_orders(RAW)</code>。</p>`,
      choice('<code>try / except ValueError</code> 的作用是？', ['出現 ValueError 時不當掉，改走 except 裡面的程式', '讓程式跑得更快', '把 ValueError 變成數字'], 0, 'try 試試看，出錯了就跳到 except，程式不會整個停下來。')),
    gstep(`<p><b>常見的坑：</b></p><ul><li><code>except</code> 要和 <code>try</code> 對齊，後面都要冒號。</li><li>f-string 前面忘了 <code>f</code>：大括號會原樣印出來。</li><li>把整個 for 迴圈包在 try 裡：第一個壞資料就跳出整個迴圈，後面好的都沒處理。<b>try 要包在迴圈裡面、只包一行一行的處理。</b></li><li>報表是<b>一個字串</b>（用 return 交出去），再用 print 印。別在 make_report 裡面直接 print。</li></ul><p>🎉 做完這一步，你就從<b>空白檔案</b>完成了一個完整的小工具：<b>變數 → list/dict → for 迴圈 → 函式 → 篩選 → 計數 → 排序 → 報表與錯誤處理</b>。檢查會把前面每一步的功能一起重新驗一次。</p>`,
      choice('這個專案裡，為什麼 try 要包在 for 迴圈「裡面」？', ['壞資料只影響那一行，其他行還能繼續處理', '這樣程式會比較快', '因為 try 不能放在迴圈外面'], 0, '把每一行分開處理，一行壞掉不會拖累其他行。')),
  ], {
    brief: '第 8 步（最後一步）：① <code>parse_line(text)</code>：<code>\'拿鐵,120,3\'</code> 變成 <code>{\'product\': \'拿鐵\', \'price\': 120, \'qty\': 3}</code>（price、qty 是數字）；② <code>load_orders(lines)</code>：回傳 <code>(好訂單清單, 壞資料行數)</code>，用 try / except ValueError；③ <code>make_report(orders)</code> 回傳（用 f-string）：<pre>總營收：1350 元\n訂單數：5 筆\n美式：8 份\n拿鐵：4 份</pre>（前兩行是總營收、訂單數，後面是前 2 名，冒號是全形「：」）；④ 讀 RAW，印出報表，再印「有 2 行資料格式錯誤，已略過」。前面的功能都要還能用。',
    hint: '四個 TODO：parse_line → load_orders（try/except）→ make_report（f-string + join）→ 最後呼叫並 print。可以直接用前面寫好的 total_revenue、count_by_product、top_sellers。',
    steps: [
      `TODO 1：<pre>def parse_line(text):\n    name, price, qty = text.split(',')\n    return {'product': name, 'price': int(price), 'qty': int(qty)}</pre>為什麼：split 把一行文字切成三段；int 把文字變數字。壞資料會自己丟 ValueError，不用另外寫。`,
      `TODO 2：<pre>def load_orders(lines):\n    good = []\n    bad = 0\n    for line in lines:\n        try:\n            good.append(parse_line(line))\n        except ValueError:\n            bad += 1\n    return good, bad</pre>為什麼：每一行單獨 try，壞的就計數、好的就收進來；最後把兩個結果一起交出去。`,
      `TODO 3：<pre>def make_report(orders):\n    lines = [f'總營收：{total_revenue(orders)} 元', f'訂單數：{len(orders)} 筆']\n    for name, qty in top_sellers(count_by_product(orders), 2):\n        lines.append(f'{name}：{qty} 份')\n    return '\\n'.join(lines)</pre>為什麼：把前面做好的函式組起來：總營收、筆數、前 2 名各一行。用 return 交出整份文字，不在裡面 print。`,
      `TODO 4：<pre>good, bad = load_orders(RAW)\nprint(make_report(good))\nprint(f'有 {bad} 行資料格式錯誤，已略過')</pre>為什麼：讀原始資料、印報表、告知壞資料行數。最常犯的錯：f-string 忘了前面的 <code>f</code>，或把 try 包在整個 for 外面，第一個壞資料就中斷了。`,
    ],
    starter: S8, solution: SOL8,
    must: [{ re: /try\s*:/, msg: '請用 try: 包住會出錯的那一行' }, { re: /except\b/, msg: '請用 except ValueError: 接住錯誤' }, { re: /\bf['"]/, msg: '請用 f-string（字串前面加 f）組出報表' }],
    tests: TEST8,
  }),
];

const PY_QUIZ_G = [
  choice('做一個小工具，比較好的做法是？', ['先做最小的一塊，一步一步加功能並測試', '一次把所有功能寫完再測', '先寫報表，再想資料'], 0),
  choice('<code>[o for o in orders if o[\'qty\'] &gt; 2]</code> 會得到？', ['份數大於 2 的訂單組成的新 list', '一個數字', '所有訂單的份數'], 0),
  choice('<code>result.get(name, 0) + 1</code> 裡的 <code>0</code> 是？', ['name 還沒記過時的起始值', '要加的數字', '第 0 筆訂單'], 0),
  choice('資料裡可能有壞掉的一行，想讓程式跳過它、繼續跑，用？', ['try / except', 'print', 'sorted'], 0),
];

export const GUIDED = {
  chapter: { id: 'py-cg', title: '第三章　手把手專案：訂單統計小工具（從空白做到完成）', lessons: G_UNITS, quiz: PY_QUIZ_G, projects: [], event: 'py-cg' },
  event: {
    npc: 'pm', mood: 'happy', text: '資料組要一個「訂單統計小工具」：算總營收、找大單、排暢銷榜，還要能跳過壞資料。你一個人從頭做得完嗎？',
    options: [{ label: '可以，我先做一筆訂單，再一步一步加功能並逐步測試', fx: { quality: 10, team: 6 } }, { label: '我一次全寫完再來測', fx: { quality: -6, stress: 8 } }],
  },
};
