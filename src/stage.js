// 教室與專案衝刺畫面上方的 3D 小舞台：重用 office3d.js，換成小房間與固定角色。
import { createOffice3D } from './office3d.js';

const LAYOUT = {
  class: { W: 7, H: 4, OBJ: [{ id: 'teacher', x: 3, y: 1, role: 'teacher' }], DECOR: [[0, 0, '📚'], [6, 0, '🪴'], [6, 3, '🪴']], start: { x: 3, y: 3 } },
  work: { W: 9, H: 4, OBJ: [{ id: 'lead', x: 1, y: 1, role: 'lead' }, { id: 'mate', x: 3, y: 1, role: 'mate' }, { id: 'qa', x: 5, y: 1, role: 'qa' }, { id: 'pm', x: 7, y: 1, role: 'pm' }], DECOR: [[8, 3, '🪴'], [0, 3, '☕']], start: { x: 4, y: 3 } },
};
const NAME = { teacher: '老師', lead: '組長', mate: '同事', qa: 'QA', pm: 'PM' };
export const STAGE_PHASES = { classroom: 'class', lesson: 'class', quiz: 'class', workday: 'work' };

let view = null, token = 0;
export const leaveStage = () => { token++; view?.dispose(); view = null; };

// 在 #st3d 裡放小舞台；沒有 WebGL 或使用者選 2D 就把空位拿掉
export function mountStage(S) {
  const host = document.getElementById('st3d'), kind = STAGE_PHASES[S.phase];
  if (!host || !kind) return;
  if (S.view3d === false || new URLSearchParams(location.search).get('view') === '2d') return host.remove();
  const L = LAYOUT[kind], mine = ++token;
  const C = S.camp, stress = S.stats.stress;
  createOffice3D(host, { ...L, marks: {}, nameOf: (o) => NAME[o.id], zoom: 0.5 })
    .then((v) => {
      if (mine !== token) return v.dispose();
      view = v;
      const sad = stress >= 80;
      if (kind === 'class') { v.setPose('teacher', 'wave'); v.setPose('me', S.phase === 'classroom' ? null : 'type'); }
      else {
        v.setPose('me', C?.stage === 'final' ? (C.outcome === 'win' ? 'cheer' : 'sad') : sad ? 'sad' : C?.stage === 'day' ? 'type' : null);
        if (stress >= 70) v.setMark('me', stress >= 85 ? '😵' : '💦');
      }
    })
    .catch((e) => { console.warn('3D 小舞台載入失敗', e); host.remove(); });
}
