// 可走動的辦公室樞紐：方向鍵 / WASD 移動，靠近人物按空白鍵互動。
// 主線的每一步都從這裡出發：走到對的人身上才會進入下一個畫面。
import { avatar, say, ROLES } from './chars.js';
import { COURSE_EVENTS } from './courses.js';
import { createOffice3D } from './office3d.js';

export const W = 14, H = 9;
export const OBJ = [
  { id: 'pm', x: 2, y: 2, role: 'pm', goal: 'req' },
  { id: 'designer', x: 6, y: 2, role: 'designer', goal: 'design' },
  { id: 'qa', x: 10, y: 2, role: 'qa' },
  { id: 'lead', x: 11, y: 6, role: 'lead', goal: 'tech' },
  { id: 'mate', x: 7, y: 6, role: 'mate' },
  { id: 'desk', x: 2, y: 6, emoji: '💻', name: '我的座位', goal: 'level' },
  { id: 'class', x: 13, y: 4, emoji: '🏫', name: '教室' },
  { id: 'board', x: 8, y: 1, emoji: '📋', name: '任務看板' },
];
const DECOR = [[4, 4, '🪴'], [9, 4, '🪴'], [0, 8, '🪴'], [8, 6, '☕'], [0, 3, '📚'], [13, 1, '🖨️'], [5, 8, '🛋️']];
const GOAL_OBJ = { req: 'pm', design: 'designer', tech: 'lead', level: 'desk', event: 'lead', end: 'lead' };
const GOAL_TEXT = { req: '去找 PM 小專，開需求會議', design: '去找設計師小美，討論風格', tech: '去找組長老王，決定技術', level: '回到自己的座位，開始寫程式', event: '找組長老王，處理突發狀況', end: '找組長老王，聽聽今天的總結' };
const CHAT = {
  pm: ['需求會議已經開完囉，加油～', '有需求變更我會第一時間告訴你！'],
  designer: ['設計稿都給你了，有問題隨時來問我～', '字體和顏色都在規格頁喔。'],
  qa: ['提交 QA 前，先自己測過一遍喔！', '我會幫你把關品質，放心。'],
  lead: ['型別或樣式不熟的話，可以去右邊的教室上課。', '慢慢來，一步一步做。'],
  mate: ['今天的咖啡特別香～', '要不要去 TS 練習場動動腦？'],
  desk: ['現在還不用開工，先把前面的事情做完吧。'],
};

const blocked = (x, y) => x < 0 || y < 0 || x >= W || y >= H || OBJ.some((o) => o.x === x && o.y === y) || DECOR.some(([dx, dy]) => dx === x && dy === y);
let live = null; // 目前辦公室畫面的操作；離開辦公室就設為 null

document.addEventListener('keydown', (e) => {
  if (!live || live.open() || e.target.closest?.('input,textarea,.cm-editor') || e.ctrlKey || e.metaKey) return;
  const d = { arrowup: [0, -1], w: [0, -1], arrowdown: [0, 1], s: [0, 1], arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0] }[e.key.toLowerCase()];
  if (d) { e.preventDefault(); live.move(...d); }
  else if ([' ', 'enter', 'e'].includes(e.key.toLowerCase())) { e.preventDefault(); live.act(); }
});

let activeView = null, token = 0; // 3D 場景；離開辦公室時要釋放
export const leaveOffice = () => { live = null; token++; activeView?.dispose(); activeView = null; };

export function makeOffice({ S, screen, apply, go, store }) {
  return function office() {
    const pos = (x, y) => `left:calc(var(--t)*${x});top:calc(var(--t)*${y})`;
    const pending = (S.pending ||= []);
    const markFor = (o) => (pending.some((id) => COURSE_EVENTS[id].npc === o.id) ? '<span class="mark">💬</span>' : GOAL_OBJ[S.goal] === o.id ? '<span class="mark">❗</span>' : '');
    const nm = (o) => o.name || ROLES[o.role].name.split(' ').pop();
    const ents = OBJ.map((o) => `<div class="ent ${o.role ? 'npc' : 'prop'}" style="${pos(o.x, o.y)}">${markFor(o)}${o.role ? avatar(o.role, GOAL_OBJ[S.goal] === o.id ? 'happy' : 'normal', 44) : `<span class="emo">${o.emoji}</span>`}<span class="nm">${nm(o)}</span></div>`).join('')
      + DECOR.map(([x, y, e]) => `<div class="ent prop" style="${pos(x, y)}"><span class="emo">${e}</span></div>`).join('');
    const want3d = S.view3d !== false && new URLSearchParams(location.search).get('view') !== '2d';
    const marksMap = {};
    OBJ.forEach((o) => { const m = pending.some((id) => COURSE_EVENTS[id].npc === o.id) ? '💬' : GOAL_OBJ[S.goal] === o.id ? '❗' : ''; if (m) marksMap[o.id] = m; });
    screen(`<h1>🏢 辦公室</h1><p class="goal">🎯 ${GOAL_TEXT[S.goal] || '自由活動'}　<small>方向鍵／WASD 移動，靠近人物按空白鍵互動；📋 任務看板可以體驗「專案衝刺」</small> <button class="vt" data-a="5">切換 ${want3d ? '2D' : '3D'}</button></p>
      <div class="map ${want3d ? 'map3d' : ''}" id="m3" style="--w:${W};--h:${H}"><div id="ovl" hidden></div></div>
      <p id="ptext" class="prompt">&nbsp;</p>
      <div class="dpad"><button data-a="0">▲</button><div><button data-a="2">◀</button><button data-a="4" class="primary">互動</button><button data-a="3">▶</button></div><button data-a="1">▼</button></div>`,
    [() => live.move(0, -1), () => live.move(0, 1), () => live.move(-1, 0), () => live.move(1, 0), () => live.act(), () => { S.view3d = !want3d; go('office'); }]);

    // 畫面：優先 3D，失敗（沒有 WebGL 等）就退回 2D 地圖
    let view = null;
    const init2d = () => {
      m3.classList.remove('map3d');
      m3.innerHTML = `${ents}<div id="me" class="ent me" style="${pos(S.pos.x, S.pos.y)}">${avatar('me', 'happy', 44)}</div><div id="ovl" hidden></div>`;
      view = { setPlayer: (x, y) => { me.style.cssText = pos(x, y); } };
    };
    if (want3d) {
      const mine = ++token;
      createOffice3D(m3, { W, H, OBJ, DECOR, marks: marksMap, nameOf: nm, start: S.pos })
        .then((v) => { if (mine !== token) return v.dispose(); view = v; activeView = v; })
        .catch((e) => { console.warn('3D 載入失敗，改用 2D', e); if (mine === token) init2d(); });
    } else init2d();

    const near = () => OBJ.find((o) => Math.max(Math.abs(o.x - S.pos.x), Math.abs(o.y - S.pos.y)) <= 1);
    const update = () => {
      const o = near();
      ptext.innerHTML = o ? `按 <kbd>空白鍵</kbd>：${o.id === 'class' ? '進教室上課' : o.id === 'board' ? '看任務看板，體驗真實的一天' : `和 ${nm(o)} 互動`}` : '&nbsp;';
    };
    const close = () => { ovl.hidden = true; ovl.innerHTML = ''; };
    const dialog = (html, buttons) => {
      ovl.hidden = false;
      ovl.innerHTML = `<div class="ovbox">${html}<div class="ovbtn"></div></div>`;
      buttons.forEach((b) => {
        const el = document.createElement('button');
        el.textContent = b.label;
        el.className = b.cls || '';
        el.onclick = b.fn;
        ovl.querySelector('.ovbtn').append(el);
      });
      ovl.querySelector('.ovbtn button')?.focus();
    };
    const closeBtn = { label: '好', fn: close };
    let chat = 0;
    const talk = (o) => {
      const evId = pending.find((id) => COURSE_EVENTS[id].npc === o.id);
      if (evId) {
        const ev = COURSE_EVENTS[evId];
        return dialog(say(o.role, ev.text, ev.mood), ev.options.map((op) => ({ label: op.label, fn: () => { apply(op.fx); S.pending = pending.filter((x) => x !== evId); go('office'); } })));
      }
      if (GOAL_OBJ[S.goal] === o.id) return go(S.goal);
      if (o.id === 'class') { S.back = 'office'; return go('classroom'); }
      if (o.id === 'board') { S.back = 'office'; return go('workday'); }
      const lines = CHAT[o.id] || ['你好呀～'];
      const line = lines[chat++ % lines.length];
      if (o.id === 'mate') return dialog(say('mate', line, 'happy'), [{ label: '🧩 去 TS 練習場', cls: 'primary', fn: () => { S.back = 'office'; S.lunch = false; go('tsmenu'); } }, closeBtn]);
      dialog(o.role ? say(o.role, line, 'happy') : `<p class="say">${line}</p>`, [closeBtn]);
    };

    live = {
      open: () => !ovl.hidden,
      move(dx, dy) {
        const x = S.pos.x + dx, y = S.pos.y + dy;
        if (!view || !ovl.hidden || blocked(x, y)) return;
        S.pos = { x, y };
        view.setPlayer(x, y);
        store.set('save', S);
        update();
      },
      act() { const o = near(); if (o && ovl.hidden) talk(o); },
    };
    update();
  };
}
