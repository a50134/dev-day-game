// 教室：課程選單、上課（小步驟 + 即時檢查 + 總練習）、章節測驗、小專案
import { COURSES, COURSE_EVENTS } from './courses.js';
import { exercise } from './practice.js';

// 全形英文、全形符號（輸入法沒切乾淨時常見）先轉成半形再比對
const norm = (s) => String(s).normalize('NFKC').trim().toLowerCase().replace(/[`'"\s]/g, '');
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');
// 選項是「文字」：< 和 > 要跳脫，否則像 <div class="a"> 會被當成真的標籤、按鈕變空白（& 不動，保留 &lt; 這類寫法）
export const optHtml = (o) => String(o).replace(/</g, '&lt;').replace(/>/g, '&gt;');
const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
const POOL = [...new Set(COURSES.flatMap((c) => c.chapters.flatMap((ch) => [...ch.lessons.flatMap((l) => l.steps.map((st) => st.check)), ...ch.quiz])).filter((q) => q.type === 'fill').map((q) => q.answers[0]))];

// 填空題一律改成選擇題（正確答案 + 3 個干擾選項），完全不用打字
function fillIn(box, q, done) {
  const right = q.answers.map(norm);
  const options = shuffle([q.answers[0], ...shuffle(POOL.filter((a) => !right.includes(norm(a)))).slice(0, 3)]);
  box.insertAdjacentHTML('beforeend', options.map((o) => `<button class="opt chip">${optHtml(o)}</button>`).join(''));
  box.querySelectorAll('.chip').forEach((c) => (c.onclick = () => done(right.includes(norm(c.textContent)))));
}

const flat = () => COURSES.flatMap((c) => c.chapters.flatMap((ch) => ch.lessons.map((l) => ({ c, ch, l }))));

export function makeCourse({ S, screen, btn, apply, go, say, store }) {
  const done = (k) => !!S.prog[k];
  const mark = (k) => { S.prog[k] = true; store.set('save', S); };

  // 小檢查：選擇題 / 填空。答對呼叫 ok()
  const quickCheck = (box, q, ok) => {
    const result = (good, msg) => { box.querySelector('.qr').innerHTML = good ? `<p class="ok">✅ 答對了！${msg || ''}</p>` : `<p class="fail">❌ 再想想看～</p>`; if (good) ok(); };
    if (q.type === 'choice') {
      box.innerHTML = `<p><b>${q.q}</b></p>${q.options.map((o, i) => `<button class="opt" data-i="${i}">${optHtml(o)}</button>`).join('')}<div class="qr"></div>`;
      box.querySelectorAll('.opt').forEach((b) => (b.onclick = () => result(+b.dataset.i === q.answer, q.why)));
    } else {
      box.innerHTML = `<p><b>${q.q}</b></p><div class="qr"></div>`;
      fillIn(box, q, (good) => result(good, q.why));
    }
  };

  return {
    classroom() {
      const acts = [];
      const add = (fn) => acts.push(fn) - 1;
      const html = COURSES.map((c) => {
        let prev = true; // 同一門課裡，上一堂完成才解鎖下一堂（每門課各自計算）
        return `<div class="card"><h2>${c.icon} ${c.name}</h2>` + c.chapters.map((ch) => {
        const lessons = ch.lessons.map((l) => {
          const ok = done(l.id), open = prev;
          prev = ok;
          return `<div class="row ${open ? '' : 'lock'}">${ok ? '✅' : open ? '▶' : '🔒'} ${l.title} ${open ? btn(ok ? '複習' : '上課', add(() => { S.cur = { lesson: l.id, step: 0 }; go('lesson'); })) : ''}</div>`;
        }).join('');
        const lessonsDone = ch.lessons.every((l) => done(l.id)), quizOk = done(ch.id + '-quiz');
        const quiz = `<div class="row ${lessonsDone ? '' : 'lock'}">${quizOk ? '✅' : lessonsDone ? '📝' : '🔒'} 章節測驗（答對 3/4 以上及格）${lessonsDone ? btn(quizOk ? '再考一次' : '開始測驗', add(() => { S.cur = { quiz: ch.id, i: 0, right: 0 }; go('quiz'); })) : ''}</div>`;
        const projects = ch.projects.map((p, i) => {
          const k = `${ch.id}-p${i}`;
          return `<div class="row ${quizOk ? '' : 'lock'}">${done(k) ? '✅' : quizOk ? '🛠' : '🔒'} 小專案 ${i + 1} ${quizOk ? btn(done(k) ? '再做一次' : '開始', add(() => { S.cur = { project: k, ch: ch.id, i }; go('project'); })) : ''}</div>`;
        }).join('');
        return `<h4>${ch.title}</h4>${lessons}${quiz}${projects}`;
      }).join('') + '</div>';
      }).join('');
      const back = add(() => go(S.back || 'office'));
      screen(`<h1>🏫 教室</h1>${say('teacher', '歡迎來上課！每堂課會先講一個小觀念，馬上讓你試一試。一步一步來，不用急～', 'happy')}${html}${btn('← 返回', back)}`, acts);
    },

    lesson() {
      const entry = flat().find((x) => x.l.id === S.cur.lesson);
      const { l } = entry;
      const n = l.steps.length;
      const stepNo = S.cur.step;
      const dots = Array.from({ length: n + 1 }, (_, i) => `<i class="${i < stepNo ? 'on' : i === stepNo ? 'cur' : ''}"></i>`).join('');
      const exit = () => go('classroom');
      if (stepNo < n) {
        const st = l.steps[stepNo];
        screen(`<h2>${l.title}</h2><div class="dots">${dots}</div>${say('teacher', st.say, 'happy')}<div id="qc" class="qc"></div><div id="nx"></div>${btn('← 回教室', 1)}`, [
          () => { S.cur.step++; go('lesson'); }, exit]);
        quickCheck(qc, st.check, () => { nx.innerHTML = btn(stepNo + 1 < n ? '下一步 →' : '去做總練習 →', 0, 'primary'); });
      } else {
        const ex = l.final;
        screen(`<h2>${l.title}</h2><div class="dots">${dots}</div><div class="split"><div class="side">${say('teacher', ex.brief + '<br><small>' + ex.hint + '</small>', 'happy')}<div id="nx"></div>${btn('← 回教室', 1)}</div><div class="work1"><div id="exbox" class="exbox"></div></div></div>`, [
          () => { exit(); }, exit]);
        const first = !done(l.id);
        exercise(exbox, ex, { key: 'ex-' + l.id, onPass: () => {
          if (first) { mark(l.id); apply({ quality: 2, stress: -3 }); }
          nx.innerHTML = btn('這堂課完成！回教室', 0, 'primary');
        } });
      }
    },

    quiz() {
      const ch = COURSES.flatMap((c) => c.chapters).find((x) => x.id === S.cur.quiz);
      const i = S.cur.i;
      if (i >= ch.quiz.length) {
        const need = Math.ceil(ch.quiz.length * 0.75), pass = S.cur.right >= need;
        const first = pass && !done(ch.id + '-quiz');
        if (first) {
          mark(ch.id + '-quiz');
          apply({ quality: 4, team: 3 });
          (S.pending ||= []).push(ch.event);
        }
        screen(`<h2>測驗結果</h2>${say('teacher', pass ? `答對 ${S.cur.right} / ${ch.quiz.length}，及格了！${first ? '辦公室裡好像有人想找你聊聊～小專案也解鎖了。' : ''}` : `答對 ${S.cur.right} / ${ch.quiz.length}，差一點點，回去複習再來挑戰吧！`, pass ? 'happy' : 'worried')}${btn('回教室', 0, 'primary')}`, [() => go('classroom')]);
        return;
      }
      const q = ch.quiz[i];
      screen(`<h2>${ch.title}　測驗 ${i + 1} / ${ch.quiz.length}</h2>${say('teacher', '放輕鬆，慢慢想。', 'normal')}<div id="qc" class="qc"></div>`, []);
      const answer = (good) => { if (good) S.cur.right++; S.cur.i++; go('quiz'); }; // 測驗不給提示，答完直接下一題
      if (q.type === 'choice') {
        qc.innerHTML = `<p><b>${q.q}</b></p>${q.options.map((o, k) => `<button class="opt" data-i="${k}">${optHtml(o)}</button>`).join('')}`;
        qc.querySelectorAll('.opt').forEach((b) => (b.onclick = () => answer(+b.dataset.i === q.answer)));
      } else {
        qc.innerHTML = `<p><b>${q.q}</b></p>`;
        fillIn(qc, q, answer);
      }
    },

    project() {
      const ch = COURSES.flatMap((c) => c.chapters).find((x) => x.id === S.cur.ch);
      const ex = ch.projects[S.cur.i];
      screen(`<h2>🛠 ${ch.title}　小專案 ${S.cur.i + 1}</h2><div class="split"><div class="side">${say('teacher', ex.brief + '<br><small>' + ex.hint + '</small>', 'happy')}<div id="nx"></div>${btn('← 回教室', 0)}</div><div class="work1"><div id="exbox" class="exbox"></div></div></div>`,
        [() => go('classroom')]);
      const first = !done(S.cur.project);
      exercise(exbox, ex, { key: 'ex-' + S.cur.project, onPass: () => {
        if (first) { mark(S.cur.project); apply({ quality: 3, progress: 2, stress: -2 }); }
        nx.innerHTML = btn('專案完成！回教室', 0, 'primary');
      } });
    },
  };
}

export { COURSE_EVENTS };
