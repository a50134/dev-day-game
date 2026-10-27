// 專案衝刺：連續 10 個工作天（兩週）。同一個大型專案要在期限前完成，
// 每天 9:00–18:00（每格 30 分鐘）：手上有大小不同、期限不同、重要程度不同的工單，
// 會議、PR 審查、緊急 bug 會打斷你；每天下班後檢討「哪些該優先」，隔天繼續。
// 數字取「常見範圍」來模擬，實際會因公司與團隊而異；大型專案也被壓縮成兩週，真實的通常更久。
import { say } from './chars.js';

const SLOTS = 18; // 9:00 → 18:00
const FIXED = { 1: 'standup', 6: 'lunch', 12: 'sprint' };
const CAP = 4.5; // 每天大約能有的專注小時數（預測進度用）
const DAYS = 10;
const clock = (s) => `${String(9 + Math.floor(s / 2)).padStart(2, '0')}:${s % 2 ? '30' : '00'}`;
const hrs = (slots) => slots / 2;
const f1 = (n) => (Math.round(n * 10) / 10).toString();

// 可重現的亂數（種子存在存檔裡，重新整理後不會變）
const rnd = (C) => {
  C.rs = (C.rs + 0x6D2B79F5) >>> 0;
  let t = C.rs;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const shuffle = (C, arr) => arr.map((x) => [rnd(C), x]).sort((a, b) => a[0] - b[0]).map((p) => p[1]);

/* ---------------- 工單 ---------------- */
// imp：重要程度 urgent 緊急（影響線上／客戶）、high 重要（承諾過的）、normal 一般
const LTPL = { title: '專案：購票流程改版（含 A/B 測試）', effort: 26, due: 9, imp: 'high' };
const TPL = {
  S: [
    { title: 'bug：結帳頁輸入優惠碼後金額沒更新', effort: 1.5, due: 0, imp: 'high' },
    { title: 'bug：活動列表圖片在手機版跑版', effort: 2, due: 1, imp: 'normal' },
    { title: '文案：首頁橫幅改成雙十二活動', effort: 1, due: 0, imp: 'normal' },
    { title: 'bug：忘記密碼信件沒有寄出', effort: 2, due: 1, imp: 'high' },
    { title: '小改：結帳按鈕在小螢幕被切到', effort: 1, due: 2, imp: 'normal' },
    { title: 'bug：座位圖在 Safari 無法點選', effort: 3, due: 1, imp: 'urgent' },
    { title: '小改：活動頁加上分享按鈕', effort: 1.5, due: 3, imp: 'normal' },
    { title: '文案：FAQ 頁面錯字修正', effort: 0.5, due: 3, imp: 'normal' },
  ],
  M: [
    { title: '功能：座位圖支援手機手勢縮放', effort: 8, due: 4, imp: 'high' },
    { title: '功能：會員登入加上「記住我」', effort: 6, due: 5, imp: 'normal' },
    { title: '功能：訂單查詢頁（含篩選）', effort: 8, due: 6, imp: 'high' },
  ],
};
// 每天會多出哪些新工單（第 1 天另外是初始工單）
const ARRIVE = { 2: ['S'], 3: ['S'], 4: ['M'], 5: ['S'], 6: ['S'], 7: ['M'], 8: ['S'], 9: ['S'] };
const SIZE_NAME = { S: '小單', M: '中型功能', L: '大型專案' };
const IMP = { urgent: ['🔴', '緊急'], high: ['🟠', '重要'], normal: ['⚪', '一般'] };
const dueText = (t) => (t.left <= 0 ? '' : t.due < 0 ? `已逾期 ${-t.due} 天` : t.due === 0 ? '今天 17:30 前' : t.size === 'L' ? `第 ${DAYS} 天（含）前` : `${t.due} 天後`);

function mk(C, size, tpl) {
  // 已經有同名、還沒做完的工單時，標明是「再次追加」，避免看起來像重複
  if (C.tickets.some((t) => t.left > 0 && t.title === tpl.title)) tpl = { ...tpl, title: tpl.title + '（再次追加）' };
  return { id: 't' + C.nextId++, size, title: tpl.title, effort: tpl.effort, left: tpl.effort, due: tpl.due, imp: tpl.imp, doneDay: null };
}
function drawTpl(C, size) {
  const used = new Set(C.tickets.map((t) => t.title));
  const pool = TPL[size].filter((t) => !used.has(t.title));
  return shuffle(C, pool.length ? pool : TPL[size])[0];
}

/* ---------------- 突發事件與固定行程 ---------------- */
// slots：花費的 30 分鐘格數（0 = 約 3 分鐘內的快速回覆，不會打斷專注）
// defer：延後處理（累積成更急的事）；add：新增工單；scope：大型專案工時增加
const INTERRUPTS = [
  { id: 'incident', who: 'lead', mood: 'surprised', text: '購票頁面顯示 500 錯誤，客服說已經有使用者在抱怨了！',
    options: [
      { label: '放下手邊的事，立刻查', slots: 2, fx: { quality: 6, stress: 8, team: 4 } },
      { label: '請值班同事先處理，我簡短回覆一聲（約 3 分鐘）', slots: 0, fx: { quality: -3, stress: 3, team: -3 } },
      { label: '先排進待辦，等手上的做完', slots: 0, defer: true, fx: { quality: -8, stress: 6, team: -4 } },
    ] },
  { id: 'review', who: 'mate', mood: 'worried', text: '能幫我看一下這個 PR 嗎？卡在你這邊，上線時間快到了。',
    options: [
      { label: '認真看完並留下意見', slots: 1, fx: { team: 6, quality: 4 } },
      { label: '回覆「下午前會看」', slots: 0, defer: true, fx: { team: -1 } },
      { label: '大致掃過就先 approve', slots: 0, fx: { team: 2, quality: -6 } },
    ] },
  { id: 'progress', who: 'pm', mood: 'happy', text: '想跟你確認一下，今天的進度還來得及嗎？',
    options: [
      { label: '簡短回報進度（約 3 分鐘）', slots: 0, fx: { team: 2, stress: 2 } },
      { label: '約個會詳細討論', slots: 1, fx: { team: 4, stress: -2 } },
      { label: '已讀不回', slots: 0, defer: true, fx: { team: -6 } },
    ] },
  { id: 'design', who: 'designer', mood: 'happy', text: '按鈕的間距我想微調一下，你現在方便看新稿嗎？',
    options: [
      { label: '現在看稿，一起討論', slots: 1, fx: { quality: 4, team: 4 } },
      { label: '請她先寫在工單上，晚點處理', slots: 0, fx: { team: -1, quality: 2 } },
    ] },
  { id: 'newbie', who: 'mate', mood: 'worried', text: '我的專案一直 build 失敗……你有空幫我看一下嗎？',
    options: [
      { label: '陪他一起 debug', slots: 1, fx: { team: 8, stress: 2 } },
      { label: '丟文件連結給他，請他先試試', slots: 0, fx: { team: 1 } },
      { label: '說晚點再說', slots: 0, defer: true, fx: { team: -3 } },
    ] },
  { id: 'extra', who: 'pm', mood: 'happy', text: '老闆臨時要加一個小修：首頁活動日期格式改成 2026/12/20，今天能上嗎？',
    options: [
      { label: '接下來（多一張今天要交的小單）', slots: 0, add: { size: 'S', tpl: { title: '小改：首頁活動日期格式改成 2026/12/20', effort: 1, due: 0, imp: 'normal' } }, fx: { stress: 3, team: 3 } },
      { label: '說明手上已滿，請 PM 排優先順序', slots: 1, fx: { quality: 2, team: 2, stress: -2 } },
    ] },
  { id: 'env', who: 'qa', mood: 'worried', text: '測試環境又掛了，我沒辦法驗你的修正。',
    options: [
      { label: '一起查環境', slots: 2, fx: { team: 6, quality: 3, stress: 4 } },
      { label: '在自己電腦先測，晚點再同步', slots: 1, fx: { quality: -2 } },
      { label: '請維運處理，我先做別的', slots: 0, defer: true, fx: { team: -1 } },
    ] },
  { id: 'meeting', who: 'lead', mood: 'normal', text: '臨時開個 30 分鐘的會，討論下週上線時程，你一定要在。',
    options: [
      { label: '參加', slots: 1, fx: { team: 3, quality: 1 } },
      { label: '請對方會後同步重點給我', slots: 0, fx: { team: -4, stress: -1 } },
    ] },
];

// 專案進行到某一天才會發生的事（固定在早上出現）
const SPECIALS = {
  3: { id: 'scope', who: 'pm', mood: 'normal', text: '客戶看完 demo，想在購票流程再加一個「候補通知」功能……你覺得可以放進這次上線嗎？',
    options: [
      { label: '接下來（大型專案 +4 小時）', slots: 0, scope: 4, fx: { team: 4, stress: 5 } },
      { label: '約個會談範圍，只做最簡版（+2 小時，花 30 分鐘）', slots: 1, scope: 2, fx: { quality: 3, team: 2 } },
      { label: '說明時程吃緊，請排到下一版', slots: 0, fx: { team: -4, stress: -2, quality: 2 } },
    ] },
  5: { id: 'prod', who: 'lead', mood: 'surprised', text: '線上購票剛剛有一批訂單金額算錯！要馬上止血。',
    options: [
      { label: '全力處理，並寫事後檢討單（花 1 小時）', slots: 2, add: { size: 'S', tpl: { title: '事後檢討：寫出錯誤原因與預防措施', effort: 1.5, due: 1, imp: 'high' } }, fx: { quality: 8, team: 4, stress: 8 } },
      { label: '先回滾上一版，之後再查（30 分鐘）', slots: 1, add: { size: 'S', tpl: { title: 'bug：找出訂單金額算錯的真正原因', effort: 3, due: 2, imp: 'urgent' } }, fx: { stress: 4, quality: 2 } },
      { label: '請值班同事處理，我繼續做手上的事', slots: 0, defer: true, fx: { team: -5, quality: -6 } },
    ] },
  6: { id: 'handover', who: 'lead', mood: 'normal', text: '小陳臨時請假，他手上的「訂單查詢」bug 需要有人接，今天內要回覆客戶。',
    options: [
      { label: '接手', slots: 0, add: { size: 'S', tpl: { title: 'bug：接手小陳的訂單查詢問題', effort: 3, due: 1, imp: 'high' } }, fx: { team: 6, stress: 4 } },
      { label: '請組長另外找人', slots: 0, fx: { team: -3, stress: -2 } },
    ] },
  8: { id: 'demo', who: 'pm', mood: 'happy', text: '大客戶後天要看 demo，要把「座位圖手機版」先調到可展示的程度。',
    options: [
      { label: '全力準備（多一張緊急工單）', slots: 0, add: { size: 'M', tpl: { title: 'demo：座位圖手機版調整到可展示', effort: 5, due: 2, imp: 'urgent' } }, fx: { team: 5, stress: 6 } },
      { label: '說明風險，只展示桌機版（花 30 分鐘溝通）', slots: 1, fx: { quality: 2, team: -1 } },
    ] },
  9: { id: 'freeze', who: 'qa', mood: 'worried', text: '明天上線凍結，最後一輪回歸測試需要你配合修 bug。',
    options: [
      { label: '配合測試，修 bug（花 1 小時）', slots: 2, fx: { quality: 8, stress: 3 } },
      { label: '只修最嚴重的一個（30 分鐘）', slots: 1, fx: { quality: 4 } },
      { label: '說這輪來不及', slots: 0, fx: { quality: -8, team: -4 } },
    ] },
};

const FIXED_EVENTS = {
  standup: { who: 'lead', mood: 'happy', type: 'meet', text: '站會時間：說說昨天做了什麼、今天要做什麼、有沒有卡住的。（站會本身約 15 分鐘，加上前後收尾，常常吃掉半小時）',
    options: [
      { label: '三句話講完重點', slots: 1, fx: { team: 2 } },
      { label: '順便把技術細節講很久', slots: 1, fx: { team: -2, stress: 2, quality: 1 } },
    ] },
  lunch: { who: 'mate', mood: 'happy', type: 'lunch', text: '午餐時間到了！要不要一起去吃飯？',
    options: [
      { label: '好好吃飯、散個步', slots: 2, fx: { stress: -8 } },
      { label: '邊吃邊回訊息、看 PR（清掉 1 個延後的事）', slots: 2, clear: true, fx: { stress: 2 } },
    ] },
  sprint: { who: 'pm', mood: 'normal', type: 'meet', text: 'Sprint 規劃會議：這次要排哪些票、各自要花多久。',
    options: [
      { label: '認真參與，把需求問清楚', slots: 1, fx: { quality: 3, team: 3 } },
      { label: '一邊開會一邊偷改 bug', slots: 1, fx: { stress: 3, quality: -2 } },
    ] },
};
const findDef = (id) => INTERRUPTS.find((x) => x.id === id) || Object.values(SPECIALS).find((x) => x.id === id);

/* ---------------- 建立專案與每一天 ---------------- */
export function newCamp(seed) {
  const C = { rs: seed >>> 0, day: 1, total: DAYS, stage: 'morning', nextId: 1, tickets: [], hist: [], arrivals: [], advice: null, deferred: 0, lateCount: 0, w: null, sickDays: 0, outcome: null };
  C.tickets.push(mk(C, 'L', LTPL), mk(C, 'M', drawTpl(C, 'M')));
  C.tickets.push(mk(C, 'S', drawTpl(C, 'S')));
  C.tickets.push(mk(C, 'S', drawTpl(C, 'S')));
  C.arrivals = C.tickets.map((t) => t.id);
  return C;
}

function newDayState(C, sick) {
  const w = { slot: 0, tl: Array(SLOTS).fill(''), done: {}, pen: false, last: null, spent: { focus: 0, lost: 0, overtime: 0 }, by: {}, log: [], startDue: {}, startLeft: {} };
  const cand = [2, 3, 4, 5, 8, 9, 10, 11, 13, 14, 15, 16];
  const slots = shuffle(C, cand).slice(0, 4).sort((a, b) => a - b);
  const ids = shuffle(C, INTERRUPTS.map((x) => x.id)).slice(0, 4);
  w.ints = slots.map((slot, i) => ({ slot, id: ids[i] }));
  if (SPECIALS[C.day]) w.ints.push({ slot: 2, id: SPECIALS[C.day].id });
  if (sick) { for (let i = 0; i < 4; i++) w.tl[i] = 'sick'; w.slot = 4; }
  C.tickets.forEach((t) => { w.startDue[t.id] = t.due; w.startLeft[t.id] = t.left; });
  return w;
}

const slotsOf = (w, type) => w.tl.filter((x) => x === type).length;
function nextEvent(w) {
  const all = [
    ...Object.entries(FIXED).map(([slot, id]) => ({ slot: +slot, key: 'f' + id, kind: 'fixed', id })),
    ...w.ints.map((x) => ({ slot: x.slot, key: 'i' + x.id, kind: 'int', id: x.id })),
  ].filter((e) => !w.done[e.key]).sort((a, b) => a.slot - b.slot);
  return { due: all.find((e) => e.slot <= w.slot), upcoming: all.find((e) => e.slot > w.slot) };
}
function advance(w, type, n) {
  for (let k = 0; k < n && w.slot < SLOTS; k++) w.tl[w.slot++] = type;
}

/* ---------------- 優先順序評分（也用在每天的檢討）---------------- */
const impW = { urgent: 3, high: 2, normal: 1 };
function score(t, due) {
  const urg = due <= 0 ? 6 : 4 / due;
  const pace = t.size === 'L' ? (t.left / Math.max(1, due + 1) / CAP) * 4 : 0;
  return impW[t.imp] * 2 + urg + pace;
}
const reason = (t, due) => `${IMP[t.imp][0]}${IMP[t.imp][1]}、${due < 0 ? '已逾期' : due === 0 ? '今天到期' : t.size === 'L' ? `期限前還剩 ${due + 1} 天` : `${due} 天後到期`}${t.size === 'L' ? '、是這次衝刺的主要目標' : ''}`;

function retro(C, w) {
  const active = C.tickets.filter((t) => w.startLeft[t.id] > 0);
  const by = (t) => w.by[t.id] || 0;
  const ranked = [...active].sort((a, b) => score(b, w.startDue[b.id]) - score(a, w.startDue[a.id]));
  const notes = [];
  // 1. 當天到期卻沒完成
  ranked.filter((t) => w.startDue[t.id] === 0 && t.left > 0).forEach((t) => notes.push(`⚠️ 「${t.title}」今天到期卻沒完成。這種單要在早上就先做，或提早跟 PM 溝通延期，而不是拖到下班。`));
  // 2. 時間花錯地方
  const top = ranked[0];
  if (top && top.left > 0 && by(top) < 1) {
    const wasted = ranked.slice(1).find((t) => by(t) >= 1.5 && score(t, w.startDue[t.id]) < score(top, w.startDue[top.id]));
    if (wasted) notes.push(`🎯 你今天花了 ${f1(by(wasted))} 小時在「${wasted.title}」（${reason(wasted, w.startDue[wasted.id])}），但更該優先的「${top.title}」（${reason(top, w.startDue[top.id])}）只做了 ${f1(by(top))} 小時。`);
  }
  // 3. 大型專案進度
  const L = C.tickets.find((t) => t.size === 'L');
  if (L && L.left > 0) {
    const remainDays = Math.max(1, L.due);
    const need = L.left / remainDays;
    notes.push(need > CAP * 0.8
      ? `📉 大型專案開始吃緊：還剩 ${f1(L.left)} 小時、${L.due} 個工作天，平均每天要投入約 ${f1(need)} 小時；但每天真正能專注的時間大約只有 4–5 小時，而且還有別的事要做。要保護專注時間、少接插單，必要時提早跟 PM 談範圍。`
      : `📈 大型專案進度健康：剩 ${f1(L.left)} 小時、${L.due} 個工作天，平均每天約 ${f1(need)} 小時就趕得上。`);
    if (by(L) >= 2) notes.push(`👍 你今天推進了大型專案 ${f1(by(L))} 小時，這是最重要的投資。`);
    else if (by(L) < 1 && L.due <= 5) notes.push(`⏰ 你今天只投入大型專案 ${f1(by(L))} 小時。期限只剩 ${L.due} 天，小事很容易把時間吃光，要主動把專注時間留給它。`);
  }
  // 4. 打斷處理風格
  const defTodayCount = w.log.filter((x) => x.deferred).length;
  if (defTodayCount >= 2) notes.push(`📌 你今天延後了 ${defTodayCount} 個請求。它們不會消失，明天會變成更急的事。`);
  const intH = hrs(slotsOf(w, 'int'));
  if (intH >= 1.5) notes.push(`🔔 處理打斷花了 ${f1(intH)} 小時。可以試試「先用 3 分鐘快速回覆、約好時間再詳談」，保護專注時間。`);
  if (w.spent.focus < 3) notes.push(`🕳️ 今天有效專注只有 ${f1(w.spent.focus)} 小時，其中 ${f1(w.spent.lost)} 小時耗在切換上。連續做同一件事，效率會好很多。`);
  return { ranked, notes: notes.slice(0, 6) };
}

const projection = (C) => {
  const L = C.tickets.find((t) => t.size === 'L');
  const done = L.effort - L.left;
  const avg = Math.max(0.5, done / C.day);
  const needDays = Math.ceil(L.left / avg);
  const finish = C.day + needDays;
  return { L, avg, finish, onTrack: L.left <= 0 || finish <= C.total };
};

/* ---------------- 畫面 ---------------- */
const boardHtml = (C) => {
  const list = C.tickets.filter((t) => t.left > 0 || t.doneDay === C.day);
  const L = C.tickets.find((t) => t.size === 'L');
  return `<div class="board"><h4>📋 我手上的工單（${list.filter((t) => t.left > 0).length} 張進行中）</h4>` + list.map((t) => {
    const pct = Math.round(100 * (1 - t.left / t.effort));
    return `<div class="tk ${t.left <= 0 ? 'done' : t.due < 0 ? 'late' : ''}"><span class="tag s${t.size}">${SIZE_NAME[t.size]}</span> <span title="${IMP[t.imp][1]}">${IMP[t.imp][0]}</span> ${t.left <= 0 ? '✅' : ''}${t.id === L.id ? ' ⭐' : ''}
      <div class="tkt">${t.title}</div><div class="bar"><i style="width:${pct}%"></i></div>
      <small>預估 ${f1(t.effort)} 小時・剩 ${f1(Math.max(0, t.left))} 小時${t.left > 0 ? '・' + dueText(t) : ''}</small></div>`;
  }).join('') + '</div>';
};
const timelineHtml = (w) => `<div class="timeline">${Array.from({ length: SLOTS }, (_, i) =>
  `<span class="tl ${w.tl[i] || (i === w.slot ? 'now' : '')}" title="${clock(i)}"></span>`).join('')}</div>
  <p class="legend"><i class="tl focus"></i>專注開發 <i class="tl meet"></i>會議 <i class="tl int"></i>被打斷處理 <i class="tl lunch"></i>午餐 <i class="tl rest"></i>休息</p>`;
const dayBar = (C) => `<div class="daybar">${Array.from({ length: C.total }, (_, i) => `<i class="${i + 1 < C.day ? 'on' : i + 1 === C.day ? 'cur' : ''}">${i + 1}</i>`).join('')}</div>`;
const projHtml = (C) => {
  const p = projection(C);
  const pct = Math.round(100 * (1 - p.L.left / p.L.effort));
  return `<div class="card proj"><b>⭐ ${p.L.title}</b><div class="bar big"><i style="width:${pct}%"></i></div>
    <small>進度 ${pct}%（剩 ${f1(p.L.left)} 小時）・${p.L.left <= 0 ? '已完成！' : p.onTrack ? `照目前每天約 ${f1(p.avg)} 小時的速度，預計第 ${p.finish} 天完成（期限第 ${C.total} 天）` : `照目前每天約 ${f1(p.avg)} 小時的速度，預計第 ${p.finish} 天才完成，會比期限（第 ${C.total} 天）晚`}</small></div>`;
};
const fxText = (fx = {}) => Object.entries(fx).map(([k, v]) => `${{ quality: '品質', stress: '壓力', team: '同事關係', progress: '進度' }[k]}${v > 0 ? '+' : ''}${v}`).join('、');

export function makeWorkday({ S, screen, btn, apply, go, say: sayFn, store }) {
  const say2 = sayFn || say;
  const save = () => store.set('save', S);
  const eff = () => (S.stats.stress >= 85 ? 0.65 : S.stats.stress >= 70 ? 0.8 : 1);

  /* ---- 開場 ---- */
  function intro() {
    screen(`<h1>📋 專案衝刺</h1>${say2('lead', '這次不是一天，是兩週！你要在 10 個工作天內，把「購票流程改版」這個大型專案做完上線。', 'happy')}
      <div class="card"><h3>規則</h3><ul>
        <li>每天 9:00–18:00，手上同時有<b>大型專案、中型功能、小單</b>，各有不同的<b>期限</b>和<b>重要程度</b>（🔴緊急 🟠重要 ⚪一般）。</li>
        <li>每天會<b>進來新的工單</b>，也會被<b>會議、PR 審查、緊急 bug</b> 打斷；中間還會發生需求變更、線上事故、同事請假這類大事。</li>
        <li>每天下班後會有<b>檢討</b>：告訴你哪些該優先、你的時間花得對不對。</li>
        <li>目標：<b>大型專案如期完成</b>，同時不要把自己累垮（壓力太高效率會下降，甚至請病假）。</li></ul>
        <p><small>大型專案在這裡被壓縮成兩週，真實的通常是數週到數個月。數字取常見範圍，因公司而異。</small></p></div>
      ${btn('開始第 1 天 ☕', 0, 'primary')} ${btn('← 回辦公室', 1)}`,
    [() => { S.camp = newCamp(S.wdSeed ?? (Date.now() % 1e9)); S.wdSeed = null; save(); go('workday'); }, () => go('office')]);
  }

  /* ---- 每天早上 ---- */
  function morning(C) {
    const arrivals = C.arrivals.map((id) => C.tickets.find((t) => t.id === id)).filter(Boolean);
    const overdue = C.tickets.filter((t) => t.left > 0 && t.due < 0);
    const todayDue = C.tickets.filter((t) => t.left > 0 && t.due === 0);
    const sick = C.sickToday ? `<div class="card warn-card">😵 你昨天壓力太高，今天一早頭痛睡過頭，上午 11 點才進公司（前 2 小時沒了）。</div>` : '';
    screen(`<h1>☀️ 第 ${C.day} 天　<small>共 ${C.total} 天</small></h1>${dayBar(C)}${say2('lead', C.day === 1 ? '早安！先看看手上有哪些工單，想一想今天要怎麼排。' : '早安！新的一天。先看看昨天的檢討建議和今天新進的工單。', 'happy')}
      ${sick}
      ${C.advice && C.day > 1 ? `<div class="card"><h3>昨天的檢討重點</h3><p>${C.advice}</p></div>` : ''}
      ${arrivals.length && C.day > 1 ? `<div class="card"><h3>📥 今天新進的工單</h3><ul>${arrivals.map((t) => `<li>${IMP[t.imp][0]} <b>${t.title}</b>（${SIZE_NAME[t.size]}，約 ${f1(t.effort)} 小時，期限 ${dueText(t)}）</li>`).join('')}</ul></div>` : ''}
      ${todayDue.length ? `<div class="card"><h3>⏰ 今天到期</h3><ul>${todayDue.map((t) => `<li><b>${t.title}</b>（剩 ${f1(t.left)} 小時）</li>`).join('')}</ul></div>` : ''}
      ${overdue.length ? `<div class="card"><h3>🔴 已經逾期</h3><ul>${overdue.map((t) => `<li><b>${t.title}</b>（逾期 ${-t.due} 天，剩 ${f1(t.left)} 小時）</li>`).join('')}</ul></div>` : ''}
      ${projHtml(C)}${boardHtml(C)}
      ${btn('開始這一天', 0, 'primary')}`,
    [() => { C.w = newDayState(C, C.sickToday); C.sickToday = false; C.stage = 'day'; save(); go('workday'); }]);
  }

  /* ---- 一天之中 ---- */
  function play(C) {
    const w = C.w;
    if (w.slot >= SLOTS) { C.stage = 'overtime'; save(); return go('workday'); }
    const { due, upcoming } = nextEvent(w);
    const acts = [];
    const add = (fn) => acts.push(fn) - 1;
    const head = `<h2>🕘 第 ${C.day} 天 ${clock(w.slot)}</h2>${dayBar(C)}${timelineHtml(w)}`;
    const e = eff();
    const state = w.pen ? '😵 剛被打斷，前 15 分鐘效率比較低' : e < 1 ? `😫 壓力很高，效率下降約 ${Math.round((1 - e) * 100)}%` : '🔥 專注狀態良好';

    const resolve = (type, opt, key, title) => {
      apply(opt.fx || {});
      if (opt.defer) C.deferred++;
      if (opt.clear && C.deferred > 0) C.deferred--;
      if (opt.add) { const t = mk(C, opt.add.size, opt.add.tpl); C.tickets.push(t); w.startDue[t.id] = t.due; w.startLeft[t.id] = t.left; }
      if (opt.scope) { const L = C.tickets.find((t) => t.size === 'L'); L.effort += opt.scope; L.left += opt.scope; }
      w.log.push({ title, choice: opt.label, fx: fxText(opt.fx), deferred: !!opt.defer, slots: opt.slots });
      w.done[key] = true;
      if (opt.slots) { advance(w, type, opt.slots); if (type === 'int') w.pen = true; }
      save(); go('workday');
    };

    let stage;
    if (due) {
      const def = due.kind === 'fixed' ? FIXED_EVENTS[due.id] : findDef(due.id);
      const type = due.kind === 'fixed' ? def.type : 'int';
      const opts = def.options.map((o) => btn(`${o.label} <small>${o.slots ? '（' + o.slots * 30 + ' 分鐘）' : '（幾乎不花時間）'}</small>`, add(() => resolve(type, o, due.key, def.text.slice(0, 18))), 'opt')).join('');
      stage = `${say2(def.who, def.text, def.mood)}${opts}`;
    } else {
      const room = Math.min(2, (upcoming ? upcoming.slot : SLOTS) - w.slot, SLOTS - w.slot);
      const work = (t, n) => {
        const switching = w.pen || (w.last && w.last !== t.id);
        const loss = switching ? 0.25 : 0;
        const gain = Math.max(0, n * 0.5 * e - loss);
        t.left = Math.max(0, t.left - gain);
        w.spent.focus += gain; w.spent.lost += n * 0.5 - gain;
        w.by[t.id] = (w.by[t.id] || 0) + gain;
        advance(w, 'focus', n);
        w.pen = false; w.last = t.id;
        if (t.left <= 0 && t.doneDay === null) { t.doneDay = C.day; apply(t.size === 'S' ? { quality: 2, stress: -3, progress: 2 } : { quality: 4, progress: 4 }); }
        save(); go('workday');
      };
      const order = C.tickets.filter((t) => t.left > 0);
      const buttons = order.map((t) => {
        const switching = w.pen || (w.last && w.last !== t.id);
        const b = (n) => (room >= n ? btn(`專注 ${n * 30} 分`, add(() => work(t, n))) : '');
        return `<div class="pick"><span title="${IMP[t.imp][1]}">${IMP[t.imp][0]}</span> <b>${t.title}</b> <small>（${SIZE_NAME[t.size]}・剩 ${f1(t.left)} 小時・${dueText(t)}）</small> ${switching ? '<small class="warn">切換過去會損耗約 15 分鐘</small>' : ''}<br>${b(1)} ${b(2)}</div>`;
      }).join('');
      const rest = btn('☕ 休息 30 分鐘（壓力 −3）', add(() => { apply({ stress: -3 }); advance(w, 'rest', 1); save(); go('workday'); }));
      const clearBtn = C.deferred > 0 ? btn(`📨 整理訊息，處理延後的事（剩 ${C.deferred} 個）`, add(() => { C.deferred--; apply({ team: 2, stress: -2 }); advance(w, 'int', 1); w.pen = true; save(); go('workday'); })) : '';
      stage = `${say2('me', `現在 ${clock(w.slot)}。${upcoming ? '下一件事大約在 ' + clock(upcoming.slot) + '。' : ''}要先做哪一張？`, 'normal')}<p class="state">${state}</p>${buttons}<div class="pick">${rest} ${clearBtn}</div>`;
    }
    screen(`${head}<div class="wd">${boardHtml(C)}<div class="stage">${stage}</div></div>`, acts);
  }

  /* ---- 下班：要不要加班 ---- */
  function overtime(C) {
    const w = C.w;
    const acts = [];
    const add = (fn) => acts.push(fn) - 1;
    const close = () => { C.stage = 'review'; closeDay(C); save(); go('workday'); };
    const stay = (t, h) => add(() => {
      const gain = h * 0.9;
      t.left = Math.max(0, t.left - gain);
      w.spent.focus += gain; w.spent.overtime += h; w.by[t.id] = (w.by[t.id] || 0) + gain;
      if (t.left <= 0 && t.doneDay === null) { t.doneDay = C.day; apply(t.size === 'S' ? { quality: 2, stress: -3, progress: 2 } : { quality: 4, progress: 4 }); }
      apply({ stress: h === 1 ? 6 : 14, team: -1 });
      close();
    });
    const list = C.tickets.filter((t) => t.left > 0).map((t) => `<div class="pick"><span>${IMP[t.imp][0]}</span> <b>${t.title}</b> <small>（剩 ${f1(t.left)} 小時・${dueText(t)}）</small><br>${btn('加班 1 小時（壓力 +6）', stay(t, 1))} ${btn('加班 2 小時（壓力 +14）', stay(t, 2))}</div>`).join('');
    screen(`<h2>🌆 第 ${C.day} 天 18:00　下班時間</h2>${dayBar(C)}${say2('mate', '下班啦～你要走了嗎？還是想把手上的東西再推一下？', 'normal')}
      <p>加班可以多推進一點，但壓力會累積；壓力太高明天效率會變差，甚至請病假。</p>
      <div class="pick">${btn('🏠 準時下班', add(close), 'primary')}</div>${list}`, acts);
  }

  // 結算今天：逾期懲罰、延後事項、檢討建議
  function closeDay(C) {
    const w = C.w;
    C.tickets.filter((t) => t.left > 0 && t.due === 0).forEach(() => { C.lateCount++; apply({ quality: -6, team: -3, stress: 5 }); });
    C.tickets.filter((t) => t.left > 0 && t.due < 0).forEach(() => apply({ stress: 2, team: -1 }));
    const r = retro(C, w);
    C.advice = r.notes.length ? r.notes.slice(0, 2).join('<br>') : '今天的安排沒有明顯問題，繼續保持。';
    C.hist.push({ day: C.day, focus: w.spent.focus, lost: w.spent.lost, overtime: w.spent.overtime, by: w.by, L: w.by[C.tickets.find((t) => t.size === 'L').id] || 0 });
    C.lastRetro = { ranked: r.ranked.map((t) => t.id), notes: r.notes };
  }

  /* ---- 每天的檢討 ---- */
  function review(C) {
    const w = C.w, r = C.lastRetro;
    const row = (name, h, cls) => `<tr><td><i class="tl ${cls}"></i> ${name}</td><td>${f1(h)} 小時</td><td>${Math.round((h / 9) * 100)}%</td></tr>`;
    const meet = hrs(slotsOf(w, 'meet')), inter = hrs(slotsOf(w, 'int')), lunch = hrs(slotsOf(w, 'lunch')), rest = hrs(slotsOf(w, 'rest')), sick = hrs(slotsOf(w, 'sick'));
    const L = C.tickets.find((t) => t.size === 'L');
    const decisions = w.log.length ? `<ul>${w.log.map((x) => `<li>${x.title}…：你選了「${x.choice}」${x.fx ? `（${x.fx}）` : ''}</li>`).join('')}</ul>` : '<p>今天沒有重大決定。</p>';
    // 明天建議順序：用「明天的期限」重新評分
    const next = C.tickets.filter((t) => t.left > 0).sort((a, b) => score(b, b.due - 1) - score(a, a.due - 1)).slice(0, 3);
    const nextHtml = next.length ? `<ol>${next.map((t) => `<li><b>${t.title}</b> — ${reason(t, t.due - 1)}</li>`).join('')}</ol>` : '<p>所有工單都完成了！</p>';
    const last = C.day >= C.total || L.left <= 0;
    screen(`<h1>🌙 第 ${C.day} 天檢討</h1>${dayBar(C)}${say2('lead', `今天真正「專注寫程式」的時間是 ${f1(w.spent.focus)} 小時，佔 9 小時的 ${Math.round((w.spent.focus / 9) * 100)}%。我們來看看哪裡可以更好。`, w.spent.focus >= 4 ? 'happy' : 'worried')}
      ${projHtml(C)}
      <div class="card"><h3>🧭 優先順序檢討</h3>${r.notes.length ? '<ul>' + r.notes.map((n) => `<li>${n}</li>`).join('') + '</ul>' : '<p>今天的安排沒有明顯問題。</p>'}</div>
      <div class="card"><h3>🔎 今天的關鍵決定與後果</h3>${decisions}</div>
      <div class="card"><h3>⏳ 你今天的時間去哪了</h3><table class="tbl">
        ${row('專注開發（有效）', w.spent.focus, 'focus')}${row('會議', meet, 'meet')}${row('處理打斷', inter, 'int')}${row('午餐', lunch, 'lunch')}${row('休息', rest + sick, 'rest')}
        <tr><td>⚡ 切換／壓力造成的損耗</td><td>${f1(w.spent.lost)} 小時</td><td>${Math.round((w.spent.lost / 9) * 100)}%</td></tr>
        ${w.spent.overtime ? `<tr><td>🌃 加班</td><td>${f1(w.spent.overtime)} 小時</td><td></td></tr>` : ''}</table></div>
      ${last ? '' : `<div class="card"><h3>📅 明天建議的優先順序</h3>${nextHtml}</div>`}
      ${btn(last ? '看衝刺結果 🏁' : '明天見 🌅', 0, 'primary')}`,
    [() => { last ? finishCamp(C) : nextDay(C); save(); go('workday'); }]);
  }

  function nextDay(C) {
    C.tickets.forEach((t) => { if (t.left > 0) t.due -= 1; });
    // 累積的延後請求，會變成一張緊急的小單
    if (C.deferred >= 2) {
      const t = mk(C, 'S', { title: '跟進：前幾天沒回的請求（PR 審查、訊息）', effort: Math.max(1, C.deferred * 0.5), due: 0, imp: 'urgent' });
      C.tickets.push(t); C.deferred = 0; C.pileup = t.id;
    } else C.pileup = null;
    C.day += 1;
    C.arrivals = [];
    (ARRIVE[C.day] || []).forEach((size) => { const t = mk(C, size, drawTpl(C, size)); C.tickets.push(t); C.arrivals.push(t.id); });
    if (C.pileup) C.arrivals.push(C.pileup);
    apply({ stress: -8 });
    C.sickToday = false;
    if (S.stats.stress >= 90) { C.sickToday = true; C.sickDays++; apply({ stress: -15 }); }
    C.stage = 'morning'; C.w = null;
  }

  function finishCamp(C) {
    const L = C.tickets.find((t) => t.size === 'L');
    C.outcome = L.left <= 0 ? 'win' : 'late';
    if (C.outcome === 'win') apply({ progress: 15, quality: 8, team: 5 }); else apply({ progress: 5, stress: 5 });
    C.stage = 'final';
  }

  /* ---- 結果 ---- */
  function final(C) {
    const L = C.tickets.find((t) => t.size === 'L');
    const win = C.outcome === 'win';
    const costly = win && (C.lateCount >= 5 || C.sickDays >= 2); // 贏了，但代價很大
    const totalFocus = C.hist.reduce((s, h) => s + h.focus, 0);
    const totalL = C.hist.reduce((s, h) => s + h.L, 0);
    const bars = C.hist.map((h) => `<tr><td>第 ${h.day} 天</td><td><div class="hbar"><i class="big" style="width:${Math.round(h.L * 40)}px"></i><i class="oth" style="width:${Math.round((h.focus - h.L) * 40)}px"></i></div></td><td>${f1(h.L)} / ${f1(h.focus)} 小時</td></tr>`).join('');
    const done = C.tickets.filter((t) => t.left <= 0).length;
    screen(`<h1>${costly ? '🥵 專案上線了，但代價不小' : win ? '🎉 專案如期上線！' : '⏰ 專案延期了'}</h1>${say2('lead', costly ? `你在第 ${C.day} 天把「${L.title}」做完了，但小單逾期 ${C.lateCount} 次、病假 ${C.sickDays} 天。真實工作中，這樣的做法撐不了太久。` : win ? `你在第 ${C.day} 天把「${L.title}」做完了。這兩週你同時顧了大專案、小單和一堆打斷，很不容易。` : `期限到了，「${L.title}」還剩 ${f1(L.left)} 小時沒做完。別氣餒，這在真實工作中很常見——重點是學到怎麼避免。`, win && !costly ? 'happy' : 'worried')}
      <div class="card"><h3>衝刺總結</h3><ul>
        <li>完成工單 <b>${done}</b> / ${C.tickets.length} 張；小單／功能<b>逾期 ${C.lateCount} 次</b>；請過 <b>${C.sickDays}</b> 天病假。</li>
        <li>十天總共有效專注 <b>${f1(totalFocus)}</b> 小時，其中投入大型專案 <b>${f1(totalL)}</b> 小時（專案需要約 ${f1(L.effort)} 小時）。</li>
        <li>最後狀態：壓力 ${S.stats.stress}、品質 ${S.stats.quality}、同事關係 ${S.stats.team}。</li></ul></div>
      <div class="card"><h3>每天的專注時間（藍色＝大型專案，灰色＝其他）</h3><table class="tbl">${bars}</table></div>
      <div class="card"><h3>${win ? (costly ? '贏了，但可以更好' : '做對了什麼') : '下次可以怎麼做'}</h3><ul>
        ${costly ? '<li>你只把心力放在大專案，其他小單和請求被擱著、逾期，還讓自己累到請病假。</li><li>真實工作中，小單通常是客戶或同事正在等的事，長期拖著會傷害信任；壓力過高也會讓效率下降。</li><li>下次試試：每天先處理「今天到期」的小單，再把整塊專注時間留給大專案，並用「快速回覆」處理打斷。</li>' : win ? '<li>你把專注時間留給了最重要的事，同時處理好該優先的急事。</li><li>真實工作中，這種「保護專注時間 + 及時溝通」的習慣，比寫得快更重要。</li>'
          : '<li><b>提早溝通：</b>發現大專案吃緊的那天，就跟 PM 談範圍或期限，不要等到最後一天。</li><li><b>縮小範圍：</b>先上線最核心的版本（MVP），其他放下一版。</li><li><b>保護專注：</b>每天固定留 2–3 小時給大專案，用「快速回覆＋約時間」處理打斷。</li><li><b>別一味加人或加班：</b>加班會讓壓力累積、效率下降；臨時加人也要花時間交接。</li>'}
        <li><small>這是遊戲模擬：大型專案被壓縮成兩週，數字取常見範圍，真實情況因公司與團隊而異。</small></li></ul></div>
      ${btn('再挑戰一次', 0, 'primary')} ${btn('← 回辦公室', 1)}`,
    [() => { S.camp = newCamp(Date.now() % 1e9); save(); go('workday'); }, () => go('office')]);
  }

  return {
    workday() {
      const C = S.camp;
      if (!C) return intro();
      ({ morning, day: play, overtime, review, final }[C.stage] || morning)(C);
    },
  };
}
