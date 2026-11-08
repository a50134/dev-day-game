// 後端題的 Python 版（和 companies.js 的 Node.js 版一一對應，id 相同）。
// 函式名稱用 Python 習慣的 snake_case；測試在 Pyodide 裡真的執行。
const pyx = (o) => ({ kind: 'code', lang: 'py', ...o });
const t = (s) => s.trim() + '\n';

export const PY = {
  'ticket-b1': pyx({
    brief: '寫 <code>list_events(events, max_price)</code>：留下 <code>price</code> ≤ max_price 的活動，依價格由低到高排序，回傳新的 list。',
    hint: '<code>sorted([e for e in events if e[\'price\'] &lt;= max_price], key=lambda e: e[\'price\'])</code>',
    demo: `<p>範例：咖啡菜單，留下 ≤ 100 元的，由便宜排到貴。</p><pre>def cheap(menu, max_price):
    ok = [m for m in menu if m['price'] &lt;= max_price]   # 留下夠便宜的（新 list）
    return sorted(ok, key=lambda m: m['price'])         # key：用價格來比大小</pre>`,
    steps: ['<code>ok = [e for e in events if e[\'price\'] &lt;= max_price]</code><br>為什麼：中括號裡的 for…if 是「篩選」，會做出新的 list，不動原本的。', '<code>sorted(ok, key=lambda e: e[\'price\'])</code><br>為什麼：sorted 回傳排好的新 list；key 告訴它「用價格比」。', '前面加 <code>return</code>，把結果交出去。'],
    starter: t("def list_events(events, max_price):\n    # TODO: 留下 price <= max_price，依價格由低到高，回傳新 list\n    return events"),
    solution: t("def list_events(events, max_price):\n    ok = [e for e in events if e['price'] <= max_price]\n    return sorted(ok, key=lambda e: e['price'])"),
    tests: t(`
evs = [{'id': 1, 'price': 3800}, {'id': 2, 'price': 1800}, {'id': 3, 'price': 2800}]
f = globals().get('list_events')
check(callable(f), '要有 list_events 函式')
if callable(f):
    r = f(evs, 3000)
    check(isinstance(r, list) and len(r) == 2, '價格 3000 以下應該有 2 筆')
    check(len(r) == 2 and r[0]['id'] == 2 and r[1]['id'] == 3, '要依價格由低到高排序（id 2 在 id 3 前面）')
    check(len(evs) == 3 and evs[0]['id'] == 1, '不要改動原本的 events')`),
  }),
  'ticket-b2': pyx({
    brief: '寫 <code>reserve(seats, seat_id)</code>：找不到回 <code>{\'ok\': False, \'error\': \'座位不存在\'}</code>；已被選走回 <code>{\'ok\': False, \'error\': \'座位已被選走\'}</code>；否則把 sold 改成 True，回 <code>{\'ok\': True}</code>。',
    hint: '先檢查（不存在、已售），都沒問題才改 sold。同一個座位訂第二次，要失敗。',
    demo: `<p>範例：包廂只能一組客人訂。</p><pre>def book(rooms, rid):
    room = next((r for r in rooms if r['id'] == rid), None)   # 找房間，找不到是 None
    if room is None:
        return {'ok': False, 'error': '沒這間'}                # 先擋掉不存在
    if room['taken']:
        return {'ok': False, 'error': '被訂走了'}              # 再擋掉已被訂
    room['taken'] = True                                       # 都沒問題才訂
    return {'ok': True}</pre>`,
    steps: ['<code>seat = next((s for s in seats if s[\'id\'] == seat_id), None)</code><br>為什麼：next 取第一個符合的，找不到就是 None。', '<code>if seat is None: return {…「座位不存在」}</code>，<code>if seat[\'sold\']: return {…「座位已被選走」}</code><br>為什麼：先把不行的情況擋掉，這就是「防止重複訂位」。', '最後 <code>seat[\'sold\'] = True</code>，<code>return {\'ok\': True}</code><br>為什麼：確認沒問題才修改。'],
    starter: t("def reserve(seats, seat_id):\n    # TODO: 找座位 → 不存在/已售就回錯誤 → 否則標成 sold，回 {'ok': True}\n    pass"),
    solution: t("def reserve(seats, seat_id):\n    seat = next((s for s in seats if s['id'] == seat_id), None)\n    if seat is None:\n        return {'ok': False, 'error': '座位不存在'}\n    if seat['sold']:\n        return {'ok': False, 'error': '座位已被選走'}\n    seat['sold'] = True\n    return {'ok': True}"),
    tests: t(`
seats = [{'id': 'A1', 'sold': False}, {'id': 'A2', 'sold': True}]
f = globals().get('reserve')
check(callable(f), '要有 reserve 函式')
if callable(f):
    r1 = f(seats, 'A1')
    check(r1 is not None and r1.get('ok') is True and seats[0]['sold'] is True, '空位 A1 應訂成功，sold 變 True')
    r2 = f(seats, 'A1')
    check(r2 is not None and r2.get('ok') is False and r2.get('error') == '座位已被選走', "同一個座位訂第二次要回 {'ok': False, 'error': '座位已被選走'}")
    r3 = f(seats, 'A2')
    check(r3 is not None and r3.get('error') == '座位已被選走', '本來就售出的 A2 不能訂')
    r4 = f(seats, 'Z9')
    check(r4 is not None and r4.get('ok') is False and r4.get('error') == '座位不存在', "不存在的座位要回 {'ok': False, 'error': '座位不存在'}")`),
  }),
  'ticket-b3': pyx({
    brief: '寫 <code>checkout(count, price, email)</code>：數量 ≤ 0 回 <code>{\'ok\': False, \'error\': \'數量要大於 0\'}</code>；email 沒有 @ 回 <code>{\'ok\': False, \'error\': \'Email 格式錯誤\'}</code>；成功回 <code>{\'ok\': True, \'total\': count * price}</code>。',
    hint: '先驗證、再計算。驗證失敗用 <code>return</code> 提早離開。',
    demo: `<p>範例：點餐，數量要 ≥ 1，成功就回總價。</p><pre>def order(n, price):
    if n &lt;= 0:
        return {'ok': False, 'error': '至少 1 份'}   # 不合格：提早離開
    return {'ok': True, 'total': n * price}        # 合格才計算</pre>`,
    steps: ['<code>if count &lt;= 0: return {…「數量要大於 0」}</code><br>為什麼：不合理的資料要在最前面擋掉。', '<code>if \'@\' not in email: return {…「Email 格式錯誤」}</code><br>為什麼：前端的檢查可以被繞過，後端一定要再檢查。', '<code>return {\'ok\': True, \'total\': count * price}</code>'],
    starter: t("def checkout(count, price, email):\n    # TODO: 驗證數量、驗證 email，通過後回 {'ok': True, 'total': ...}\n    pass"),
    solution: t("def checkout(count, price, email):\n    if count <= 0:\n        return {'ok': False, 'error': '數量要大於 0'}\n    if '@' not in email:\n        return {'ok': False, 'error': 'Email 格式錯誤'}\n    return {'ok': True, 'total': count * price}"),
    tests: t(`
f = globals().get('checkout')
check(callable(f), '要有 checkout 函式')
if callable(f):
    a = f(2, 1800, 'a@b.co')
    check(a == {'ok': True, 'total': 3600}, "checkout(2, 1800, 'a@b.co') 應回 {'ok': True, 'total': 3600}")
    b = f(0, 1800, 'a@b.co')
    check(b == {'ok': False, 'error': '數量要大於 0'}, "數量 0 要回 {'ok': False, 'error': '數量要大於 0'}")
    c = f(2, 1800, 'abc')
    check(c == {'ok': False, 'error': 'Email 格式錯誤'}, "email 沒有 @ 要回 {'ok': False, 'error': 'Email 格式錯誤'}")`),
  }),
  'shop-b1': pyx({
    brief: '寫 <code>search_products(products, keyword)</code>：留下 <code>in_stock</code> 為 True 且 <code>name</code> 含 keyword（不分大小寫）的商品，依 price 由低到高排序。',
    hint: '<code>keyword.lower() in p[\'name\'].lower()</code> 比對；再 sorted。',
    demo: `<p>範例：書店搜尋，只留有書的、書名含關鍵字的。</p><pre>def find(books, kw):
    hit = [b for b in books if b['have'] and kw.lower() in b['title'].lower()]  # 兩個條件都要成立
    return sorted(hit, key=lambda b: b['price'])                                 # 便宜的在前</pre>`,
    steps: ['<code>[p for p in products if p[\'in_stock\'] and …]</code><br>為什麼：缺貨的商品不能賣，也不該出現在搜尋結果。', '名稱比對：<code>keyword.lower() in p[\'name\'].lower()</code><br>為什麼：兩邊都轉小寫，使用者打 NIKE 或 nike 都找得到。', '<code>sorted(…, key=lambda p: p[\'price\'])</code> 並 return。'],
    starter: t("def search_products(products, keyword):\n    # TODO: 有庫存 + 名稱含關鍵字（不分大小寫），價格由低到高\n    return products"),
    solution: t("def search_products(products, keyword):\n    hit = [p for p in products if p['in_stock'] and keyword.lower() in p['name'].lower()]\n    return sorted(hit, key=lambda p: p['price'])"),
    tests: t(`
ps = [{'id': 1, 'name': 'Run Shoes', 'price': 2480, 'in_stock': True}, {'id': 2, 'name': 'run bag', 'price': 800, 'in_stock': True}, {'id': 3, 'name': 'Run Cap', 'price': 300, 'in_stock': False}, {'id': 4, 'name': 'Water Bottle', 'price': 500, 'in_stock': True}]
f = globals().get('search_products')
check(callable(f), '要有 search_products 函式')
if callable(f):
    r = f(ps, 'RUN')
    check(len(r) == 2, '搜尋 RUN 應該只有 2 筆（缺貨的不算、名稱不分大小寫）')
    check(len(r) == 2 and r[0]['id'] == 2 and r[1]['id'] == 1, '要依價格由低到高排序')`),
  }),
  'shop-b2': pyx({
    brief: '寫 <code>add_to_cart(cart, product, qty)</code>：qty ≤ 0 → <code>{\'ok\': False, \'error\': \'數量要大於 0\'}</code>；已有 + qty 超過 product[\'stock\'] → <code>{\'ok\': False, \'error\': \'庫存不足\'}</code>；否則加入（同商品合併 qty），回 <code>{\'ok\': True, \'cart\': cart}</code>。',
    hint: '失敗時不要改動 cart。同商品：有就 <code>line[\'qty\'] += qty</code>，沒有就 <code>cart.append({\'id\': …, \'qty\': qty})</code>。',
    demo: `<p>範例：借書，同一本書最多借 3 本，已借的要算進去。</p><pre>def borrow(lst, book, n):
    line = next((l for l in lst if l['id'] == book['id']), None)   # 借過沒
    have = line['qty'] if line else 0                               # 已借幾本
    if have + n > book['max']:
        return {'ok': False}                                        # 超過上限：不改任何東西
    if line: line['qty'] += n
    else: lst.append({'id': book['id'], 'qty': n})                  # 合併或新增
    return {'ok': True}</pre>`,
    steps: ['<code>line = next((l for l in cart if l[\'id\'] == product[\'id\']), None)</code> 和 <code>have = line[\'qty\'] if line else 0</code><br>為什麼：庫存要看「已經在購物車的 + 這次」，所以要先知道已有幾個。', '<code>if qty &lt;= 0: return …</code>、<code>if have + qty &gt; product[\'stock\']: return …</code><br>為什麼：失敗要在修改之前就回傳，購物車才不會被弄髒。', '<code>if line: line[\'qty\'] += qty</code> <code>else: cart.append({…})</code>，最後 <code>return {\'ok\': True, \'cart\': cart}</code>'],
    starter: t("def add_to_cart(cart, product, qty):\n    # TODO: 檢查數量與庫存 → 合併或新增 → 回 {'ok': True, 'cart': cart}\n    pass"),
    solution: t("def add_to_cart(cart, product, qty):\n    line = next((l for l in cart if l['id'] == product['id']), None)\n    have = line['qty'] if line else 0\n    if qty <= 0:\n        return {'ok': False, 'error': '數量要大於 0'}\n    if have + qty > product['stock']:\n        return {'ok': False, 'error': '庫存不足'}\n    if line:\n        line['qty'] += qty\n    else:\n        cart.append({'id': product['id'], 'qty': qty})\n    return {'ok': True, 'cart': cart}"),
    tests: t(`
p = {'id': 1, 'stock': 3}
cart = []
f = globals().get('add_to_cart')
check(callable(f), '要有 add_to_cart 函式')
if callable(f):
    a = f(cart, p, 2)
    check(a and a.get('ok') is True and len(cart) == 1 and cart[0]['qty'] == 2, '加 2 個應成功，購物車有一行 qty 2')
    b = f(cart, p, 2)
    check(b and b.get('ok') is False and b.get('error') == '庫存不足', "已有 2、再加 2 超過庫存 3，要回 {'ok': False, 'error': '庫存不足'}")
    check(cart[0]['qty'] == 2, '失敗時購物車不能被改動（qty 應還是 2）')
    c = f(cart, p, 1)
    check(c and c.get('ok') is True and len(cart) == 1 and cart[0]['qty'] == 3, '再加 1 個要合併成同一行 qty 3')
    d = f(cart, p, 0)
    check(d and d.get('ok') is False and d.get('error') == '數量要大於 0', "數量 0 要回 {'ok': False, 'error': '數量要大於 0'}")`),
  }),
  'shop-b3': pyx({
    brief: '寫 <code>order_total(items, coupon=None)</code>：subtotal = 價格×數量加總，coupon 為 <code>\'SAVE100\'</code> 時扣 100（不低於 0）；折完 ≥ 1000 運費 0，否則 60。回傳 <code>{\'subtotal\': …, \'shipping\': …, \'total\': …}</code>。',
    hint: '<code>sum(i[\'price\'] * i[\'qty\'] for i in items)</code> 算小計；<code>max(0, …)</code> 避免變負數。',
    demo: `<p>範例：點餐加總，滿 500 免外送費。</p><pre>def bill(items):
    s = sum(i['price'] * i['n'] for i in items)   # 每項 價格×數量 加起來
    ship = 0 if s >= 500 else 40                   # 滿額免運
    return {'sum': s, 'ship': ship, 'total': s + ship}</pre>`,
    steps: ['<code>subtotal = sum(i[\'price\'] * i[\'qty\'] for i in items)</code><br>為什麼：sum 把一排數字加成一個。', '<code>if coupon == \'SAVE100\': subtotal = max(0, subtotal - 100)</code><br>為什麼：折扣不能把金額扣成負的。', '<code>shipping = 0 if subtotal &gt;= 1000 else 60</code> 然後回傳三個數字的 dict。'],
    starter: t("def order_total(items, coupon=None):\n    # TODO: 小計 → 優惠碼 → 運費 → 回 {'subtotal', 'shipping', 'total'}\n    pass"),
    solution: t("def order_total(items, coupon=None):\n    subtotal = sum(i['price'] * i['qty'] for i in items)\n    if coupon == 'SAVE100':\n        subtotal = max(0, subtotal - 100)\n    shipping = 0 if subtotal >= 1000 else 60\n    return {'subtotal': subtotal, 'shipping': shipping, 'total': subtotal + shipping}"),
    tests: t(`
f = globals().get('order_total')
check(callable(f), '要有 order_total 函式')
if callable(f):
    a = f([{'price': 500, 'qty': 2}, {'price': 300, 'qty': 1}])
    check(a == {'subtotal': 1300, 'shipping': 0, 'total': 1300}, '1300 元免運：應回 subtotal 1300、shipping 0、total 1300')
    b = f([{'price': 500, 'qty': 2}, {'price': 300, 'qty': 1}], 'SAVE100')
    check(b and b.get('subtotal') == 1200 and b.get('total') == 1200, '用 SAVE100 折 100 後 subtotal 應為 1200')
    c = f([{'price': 200, 'qty': 2}])
    check(c and c.get('shipping') == 60 and c.get('total') == 460, '400 元不到 1000，運費 60，總額 460')
    d = f([{'price': 50, 'qty': 1}], 'SAVE100')
    check(d and d.get('subtotal') == 0 and d.get('total') == 60, '折扣不能把金額扣成負數（subtotal 最低 0）')`),
  }),
  'bank-b1': pyx({
    brief: '寫 <code>list_transactions(txs, kind=None)</code>：kind 為 \'in\' 留 amount &gt; 0、\'out\' 留 amount &lt; 0、其他全留；依 date 由新到舊排序，回傳新 list。',
    hint: '先篩選成新 list，再 <code>sorted(..., key=lambda t: t[\'date\'], reverse=True)</code>。',
    demo: `<p>範例：日記，mood 有指定只留那種，新的排前面。</p><pre>def diary(lst, mood=None):
    ok = [d for d in lst if mood is None or d['mood'] == mood]       # 沒指定就全留
    return sorted(ok, key=lambda d: d['date'], reverse=True)          # reverse=True：大的（新的）在前</pre>`,
    steps: ['<code>if kind == \'in\': ok = [t for t in txs if t[\'amount\'] &gt; 0]</code>，<code>elif kind == \'out\'</code> 用 <code>&lt; 0</code>，<code>else: ok = list(txs)</code><br>為什麼：收入是正數、支出是負數。', '<code>sorted(ok, key=lambda t: t[\'date\'], reverse=True)</code><br>為什麼：日期文字（2026-10-05）可以直接比大小；reverse 讓新的在前。', '整段用 <code>return</code> 交出去。<br>為什麼：不改原本的 txs，回傳新的 list，呼叫的人才拿得到結果。'],
    starter: t("def list_transactions(txs, kind=None):\n    # TODO: 依 kind 篩選，日期新的在前\n    return txs"),
    solution: t("def list_transactions(txs, kind=None):\n    if kind == 'in':\n        ok = [t for t in txs if t['amount'] > 0]\n    elif kind == 'out':\n        ok = [t for t in txs if t['amount'] < 0]\n    else:\n        ok = list(txs)\n    return sorted(ok, key=lambda t: t['date'], reverse=True)"),
    tests: t(`
txs = [{'id': 1, 'date': '2026-10-05', 'amount': 52000}, {'id': 2, 'date': '2026-10-06', 'amount': -18000}, {'id': 3, 'date': '2026-10-07', 'amount': -85}]
f = globals().get('list_transactions')
check(callable(f), '要有 list_transactions 函式')
if callable(f):
    a = f(txs)
    check(len(a) == 3 and a[0]['id'] == 3 and a[2]['id'] == 1, '沒給 kind 要全部、日期新的在前（id 3, 2, 1）')
    o = f(txs, 'out')
    check(len(o) == 2 and all(t['amount'] < 0 for t in o), "kind 'out' 只留支出")
    i = f(txs, 'in')
    check(len(i) == 1 and i[0]['id'] == 1, "kind 'in' 只留收入")
    check(txs[0]['id'] == 1 and len(txs) == 3, '不要改動原本的 list')`),
  }),
  'bank-b2': pyx({
    brief: '寫 <code>transfer(accounts, source, target, amount)</code>。accounts 像 <code>{\'A\': {\'balance\': 1000}, \'B\': {\'balance\': 0}}</code>。依序檢查，失敗回 <code>{\'ok\': False, \'error\': …}</code>：金額 ≤ 0 →「金額必須大於 0」；帳戶不存在 →「帳戶不存在」；轉給自己 →「不能轉給自己」；餘額不足 →「餘額不足」。全過才扣款入帳，回 <code>{\'ok\': True}</code>。',
    hint: '錢的事最怕「只扣不入」或「變負數」。所有檢查都過了，才同時改兩個帳戶。',
    demo: `<p>範例：點數轉贈，不能贈超過自己有的。</p><pre>def give(users, a, b, n):
    if n &lt;= 0:
        return {'ok': False, 'error': '至少 1 點'}
    if users[a]['pts'] &lt; n:
        return {'ok': False, 'error': '點數不足'}   # 先檢查完
    users[a]['pts'] -= n                           # 才同時動兩邊
    users[b]['pts'] += n
    return {'ok': True}</pre>`,
    steps: ['<code>if amount &lt;= 0: return {…「金額必須大於 0」}</code><br>為什麼：負數金額可以「轉走別人的錢」，一定要擋。', '<code>if source not in accounts or target not in accounts: …「帳戶不存在」</code>、<code>if source == target: …「不能轉給自己」</code>、<code>if accounts[source][\'balance\'] &lt; amount: …「餘額不足」</code>', '全部通過，再 <code>accounts[source][\'balance\'] -= amount</code>、<code>accounts[target][\'balance\'] += amount</code>，<code>return {\'ok\': True}</code><br>為什麼：失敗時一毛錢都不能動。'],
    starter: t("def transfer(accounts, source, target, amount):\n    # TODO: 檢查（金額、帳戶、不能自己轉自己、餘額）→ 通過才扣款入帳\n    pass"),
    solution: t("def transfer(accounts, source, target, amount):\n    if amount <= 0:\n        return {'ok': False, 'error': '金額必須大於 0'}\n    if source not in accounts or target not in accounts:\n        return {'ok': False, 'error': '帳戶不存在'}\n    if source == target:\n        return {'ok': False, 'error': '不能轉給自己'}\n    if accounts[source]['balance'] < amount:\n        return {'ok': False, 'error': '餘額不足'}\n    accounts[source]['balance'] -= amount\n    accounts[target]['balance'] += amount\n    return {'ok': True}"),
    tests: t(`
acc = {'A': {'balance': 1000}, 'B': {'balance': 0}}
f = globals().get('transfer')
check(callable(f), '要有 transfer 函式')
if callable(f):
    a = f(acc, 'A', 'B', 300)
    check(a and a.get('ok') is True and acc['A']['balance'] == 700 and acc['B']['balance'] == 300, '轉 300：A 剩 700、B 有 300')
    b = f(acc, 'A', 'B', 5000)
    check(b and b.get('ok') is False and b.get('error') == '餘額不足', "餘額不足要回 {'ok': False, 'error': '餘額不足'}")
    check(acc['A']['balance'] == 700 and acc['B']['balance'] == 300, '失敗時兩個帳戶的錢都不能動')
    c = f(acc, 'A', 'B', -100)
    check(c and c.get('ok') is False and c.get('error') == '金額必須大於 0', '負數金額要回「金額必須大於 0」')
    check(acc['A']['balance'] == 700, '負數金額不能讓錢亂跑')
    d = f(acc, 'A', 'Z', 10)
    check(d and d.get('ok') is False and d.get('error') == '帳戶不存在', '帳戶不存在要回「帳戶不存在」')
    e = f(acc, 'A', 'A', 10)
    check(e and e.get('ok') is False and e.get('error') == '不能轉給自己', '轉給自己要回「不能轉給自己」')`),
  }),
  'bank-b3': pyx({
    brief: '寫 <code>monthly_stats(txs)</code>：回傳 <code>{\'income\': …, \'expense\': …, \'net\': …}</code>。income = 正數加總；expense = 負數的絕對值加總；net = income − expense。',
    hint: '用 <code>for t in txs:</code> 走過每筆；正的加 income，負的用 <code>abs(t[\'amount\'])</code> 加到 expense。',
    demo: `<p>範例：零用錢，統計收到多少、花了多少。</p><pre>def pocket(lst):
    got = spent = 0
    for x in lst:               # 一筆一筆看
        if x &gt; 0:
            got += x             # 正數是收到
        else:
            spent += abs(x)      # 負數是花掉：abs 取絕對值
    return {'got': got, 'spent': spent, 'left': got - spent}</pre>`,
    steps: ['<code>income = 0</code>、<code>expense = 0</code>，再 <code>for t in txs:</code><br>為什麼：兩個累加器，一筆一筆加上去。', '迴圈裡：<code>if t[\'amount\'] &gt; 0: income += t[\'amount\']</code> <code>else: expense += abs(t[\'amount\'])</code><br>為什麼：支出存的是負數，報表要顯示正數。', '<code>return {\'income\': income, \'expense\': expense, \'net\': income - expense}</code>'],
    starter: t("def monthly_stats(txs):\n    # TODO: 算 income、expense（取絕對值）、net\n    pass"),
    solution: t("def monthly_stats(txs):\n    income = 0\n    expense = 0\n    for t in txs:\n        if t['amount'] > 0:\n            income += t['amount']\n        else:\n            expense += abs(t['amount'])\n    return {'income': income, 'expense': expense, 'net': income - expense}"),
    tests: t(`
f = globals().get('monthly_stats')
check(callable(f), '要有 monthly_stats 函式')
if callable(f):
    r = f([{'amount': 52000}, {'amount': -18000}, {'amount': -85}])
    check(r and r.get('income') == 52000, 'income 應為 52000')
    check(r and r.get('expense') == 18085, 'expense 應為 18085（負數取絕對值再加總）')
    check(r and r.get('net') == 33915, 'net 應為 33915（income − expense）')
    z = f([])
    check(z == {'income': 0, 'expense': 0, 'net': 0}, '沒有交易時三個數字都是 0')`),
  }),
  'search-b1': pyx({
    brief: '寫 <code>search_docs(docs, q)</code>：docs 是 <code>[{\'id\', \'title\', \'body\'}]</code>。回傳符合的 id list（不分大小寫）；標題有出現的排前面，只有內文有出現的排後面；各組內維持原順序；q 空白（去掉前後空格後）回 <code>[]</code>。',
    hint: '先 <code>k = q.strip().lower()</code>，空的就 return []。做兩個 list 推導，再用 <code>+</code> 接起來。',
    demo: `<p>範例：食譜搜尋，菜名有的排前面，只有做法有的排後面。</p><pre>def find(lst, q):
    k = q.strip().lower()
    if not k:
        return []                                                   # 沒打字：不找
    a = [r for r in lst if k in r['name'].lower()]                   # 菜名符合
    b = [r for r in lst if k not in r['name'].lower() and k in r['how'].lower()]  # 只有做法符合
    return [r['id'] for r in a + b]                                  # 接起來，只留 id</pre>`,
    steps: ['<code>k = q.strip().lower()</code>，<code>if not k: return []</code><br>為什麼：全部轉小寫才不分大小寫；沒打字就不要回全部結果。', '<code>in_title = […標題含 k…]</code>、<code>in_body = […標題不含 k 且內文含 k…]</code><br>為什麼：分成兩組，才能控制「標題優先」。', '<code>return [d[\'id\'] for d in in_title + in_body]</code>'],
    starter: t("def search_docs(docs, q):\n    # TODO: 標題符合的在前，只有內文符合的在後，回傳 id list\n    return []"),
    solution: t("def search_docs(docs, q):\n    k = q.strip().lower()\n    if not k:\n        return []\n    in_title = [d for d in docs if k in d['title'].lower()]\n    in_body = [d for d in docs if k not in d['title'].lower() and k in d['body'].lower()]\n    return [d['id'] for d in in_title + in_body]"),
    tests: t(`
docs = [{'id': 1, 'title': 'CSS 入門', 'body': '學 React 之前先學這個'}, {'id': 2, 'title': 'React 教學', 'body': '元件與 props'}, {'id': 3, 'title': 'Vue 教學', 'body': '跟 react 很像'}, {'id': 4, 'title': '資料庫', 'body': '無關'}]
f = globals().get('search_docs')
check(callable(f), '要有 search_docs 函式')
if callable(f):
    r = f(docs, ' REACT ')
    check(r == [2, 1, 3], '搜尋 react：標題有的 id 2 排第一，只有內文有的 id 1、3 依原順序排後面（應為 [2, 1, 3]），你的結果：' + str(r))
    check(f(docs, '   ') == [], 'q 是空白要回 []')
    check(f(docs, '不存在的字') == [], '找不到要回 []')`),
  }),
  'search-b2': pyx({
    brief: '寫 <code>paginate(items, page, size)</code>：回傳 <code>{\'items\': …, \'page\': …, \'total_pages\': …, \'has_next\': …}</code>。page 從 1 開始；page 小於 1 或超過總頁數就當作第 1 頁。',
    hint: '總頁數 <code>-(-len(items) // size)</code>（無條件進位），或 <code>import math</code> 用 <code>math.ceil</code>。這一頁是 <code>items[(page-1)*size : page*size]</code>。',
    demo: `<p>範例：每頁 3 張照片。</p><pre>import math

def page_of(lst, p, n):
    total = math.ceil(len(lst) / n)          # 總共幾頁（無條件進位）
    if p &lt; 1 or p &gt; total:
        p = 1                                  # 頁數亂填就回第 1 頁
    return {'items': lst[(p - 1) * n : p * n], 'page': p, 'total': total}</pre>`,
    steps: ['<code>total_pages = math.ceil(len(items) / size)</code>（記得 <code>import math</code>）<br>為什麼：7 筆、每頁 3 筆，要 3 頁（不是 2.33），所以無條件進位。', '<code>if page &lt; 1 or page &gt; total_pages: page = 1</code><br>為什麼：使用者可能手動改網址亂填頁數。', '<code>return {\'items\': items[(page - 1) * size : page * size], \'page\': page, \'total_pages\': total_pages, \'has_next\': page &lt; total_pages}</code>'],
    starter: t("import math\n\ndef paginate(items, page, size):\n    # TODO: 算 total_pages、修正 page、切出這一頁\n    pass"),
    solution: t("import math\n\ndef paginate(items, page, size):\n    total_pages = math.ceil(len(items) / size)\n    if page < 1 or page > total_pages:\n        page = 1\n    return {'items': items[(page - 1) * size: page * size], 'page': page, 'total_pages': total_pages, 'has_next': page < total_pages}"),
    tests: t(`
xs = [1, 2, 3, 4, 5, 6, 7]
f = globals().get('paginate')
check(callable(f), '要有 paginate 函式')
if callable(f):
    a = f(xs, 2, 3)
    check(a == {'items': [4, 5, 6], 'page': 2, 'total_pages': 3, 'has_next': True}, '第 2 頁（每頁 3 筆）應為 items [4,5,6]、total_pages 3、has_next True')
    b = f(xs, 3, 3)
    check(b and b.get('items') == [7] and b.get('has_next') is False, '最後一頁 items [7]、has_next False')
    c = f(xs, 99, 3)
    check(c and c.get('page') == 1 and c.get('items') == [1, 2, 3], 'page 超過總頁數要當作第 1 頁')
    d = f(xs, 0, 3)
    check(d and d.get('page') == 1, 'page 小於 1 要當作第 1 頁')`),
  }),
  'search-b3': pyx({
    brief: '寫 <code>make_cache(fn)</code>：回傳新函式，參數相同時只真的呼叫 fn 一次，之後回傳記住的結果。',
    hint: '<code>cache = {}</code> 當記事本，回傳內層函式；用 <code>arg in cache</code> 判斷記過沒。',
    demo: `<p>範例：算很慢的平方，記住算過的。</p><pre>def memo(fn):
    saved = {}                      # 記事本（dict）
    def wrapper(x):
        if x in saved:
            return saved[x]         # 記過了：直接給答案，不用再算
        saved[x] = fn(x)            # 沒記過：才真的算，並記下來
        return saved[x]
    return wrapper</pre>`,
    steps: ['<code>cache = {}</code>，再在裡面寫 <code>def wrapper(arg):</code>，最後 <code>return wrapper</code><br>為什麼：dict 是記事本，外層函式結束後它還在，所以記得住。', 'wrapper 裡先 <code>if arg in cache: return cache[arg]</code><br>為什麼：記過就不用再算，這就是「快取命中」。', '沒記過才 <code>cache[arg] = fn(arg)</code> 然後 <code>return cache[arg]</code>'],
    starter: t("def make_cache(fn):\n    # TODO: 用 dict 記住算過的結果\n    pass"),
    solution: t("def make_cache(fn):\n    cache = {}\n\n    def wrapper(arg):\n        if arg in cache:\n            return cache[arg]\n        cache[arg] = fn(arg)\n        return cache[arg]\n\n    return wrapper"),
    tests: t(`
calls = []
def slow(q):
    calls.append(q)
    return q.upper()
mk = globals().get('make_cache')
check(callable(mk), '要有 make_cache 函式')
if callable(mk):
    f = mk(slow)
    check(callable(f), 'make_cache 要回傳一個函式')
    if callable(f):
        check(f('a') == 'A', "f('a') 應回 'A'")
        f('a')
        f('a')
        check(len(calls) == 1, "同樣的參數 'a' 呼叫 3 次，fn 只能真的執行 1 次，目前執行了 " + str(len(calls)) + ' 次')
        check(f('b') == 'B' and len(calls) == 2, "不同的參數 'b' 要真的算（fn 共執行 2 次）")`),
  }),
};
