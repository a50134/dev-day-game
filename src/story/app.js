// 動畫版教學的外殼：選哪一部（?ep=N）、建立目錄、自動接下一部。
import { startStory } from '../story-player.js';
import { SCRIPTS } from './index.js';
import { filesAfter } from './state.js';
const href = (n) => 'tw-story.html?ep=' + n;

const q = new URLSearchParams(location.search);
let n = Math.round(+q.get('ep') || 0);
if (!n) { try { n = +localStorage.getItem('ddg-story-ep') || 1; } catch { n = 1; } }
n = Math.min(Math.max(1, n), SCRIPTS.length);
try { localStorage.setItem('ddg-story-ep', String(n)); } catch {}

const i = n - 1, sc = SCRIPTS[i];
const menu = SCRIPTS.map((s, k) => ({ title: s.title, href: href(k + 1) }));
startStory(document.getElementById('story'), {
  title: `第 ${n} 部　${sc.title}`,
  cast: { teacher: { role: 'teacher', name: 'Lily 老師' }, rookie: { role: 'me', name: '新人' } },
  beats: sc.beats,
  baseFiles: filesAfter(SCRIPTS, i), // 這一部開始前，專案裡已經有的檔案（前面每一部演完的樣子）
  vp: sc.vp,
  menu, index: i,
  next: SCRIPTS[i + 1] ? { title: SCRIPTS[i + 1].title, href: href(n + 1) } : null,
  endTitle: `第 ${n} 部完成！`,
  endSub: sc.endSub || '',
});
