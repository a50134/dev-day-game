// 13 部劇本的清單。還沒做好的部會顯示「製作中」。
import { EPISODES } from '../tw-episodes.js';
import ep01 from './ep01.js';
import ep02 from './ep02.js';
import ep03 from './ep03.js';
import ep04 from './ep04.js';
import ep05 from './ep05.js';
import ep06 from './ep06.js';
import ep07 from './ep07.js';

const pending = (i) => ({
  pending: true,
  title: EPISODES[i].title,
  endSub: '這一部的動畫還在製作中',
  beats: [
    { chapter: '製作中', card: [`第 ${i + 1} 部`, EPISODES[i].title, '🛠️'], ms: 2600 },
    { say: 'teacher', mood: 'happy', text: '這一部的動畫還在製作中～先看講義吧！' },
  ],
});

const made = { 0: ep01, 1: ep02, 2: ep03, 3: ep04, 4: ep05, 5: ep06, 6: ep07 };
export const SCRIPTS = EPISODES.map((_, i) => made[i] || pending(i));
