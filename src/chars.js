// 手繪風 SVG 角色：同一個臉型，靠髮型、配件、衣服顏色區分；mood 換表情
export const ROLES = {
  me: { name: '我（新人前端）', shirt: '#7c9cff', hair: '#5b3a29', extra: 'headphones' },
  pm: { name: 'PM 小專', shirt: '#ffb347', hair: '#3b3b4f', extra: 'bun' },
  designer: { name: '設計師 小美', shirt: '#ff7a90', hair: '#8a4b6b', extra: 'beret' },
  qa: { name: 'QA 小測', shirt: '#6ccf9c', hair: '#2f4f4f', extra: 'glasses' },
  lead: { name: '組長 老王', shirt: '#9a9aae', hair: '#b8b8c8', extra: 'glassesBeard' },
  mate: { name: '同事 阿宅', shirt: '#c39bff', hair: '#2b2b2b', extra: 'ponytail' },
  teacher: { name: 'Lily 老師', shirt: '#5bc0be', hair: '#7a5c3e', extra: 'glasses' },
};

const EXTRA = {
  headphones: (h) => `<path d="M22 50 Q22 20 50 20 Q78 20 78 50" fill="none" stroke="#444" stroke-width="5"/><rect x="17" y="46" width="10" height="16" rx="5" fill="#444"/><rect x="73" y="46" width="10" height="16" rx="5" fill="#444"/>`,
  bun: (h) => `<circle cx="50" cy="14" r="9" fill="${h}"/>`,
  beret: () => `<ellipse cx="46" cy="22" rx="28" ry="10" fill="#e8445c"/><circle cx="50" cy="11" r="4" fill="#e8445c"/>`,
  glasses: () => `<g fill="none" stroke="#333" stroke-width="2.5"><circle cx="39" cy="50" r="8"/><circle cx="61" cy="50" r="8"/><path d="M47 50 H53"/></g>`,
  glassesBeard: () => `<g fill="none" stroke="#333" stroke-width="2.5"><rect x="30" y="43" width="16" height="13" rx="4"/><rect x="54" y="43" width="16" height="13" rx="4"/><path d="M46 49 H54"/></g><path d="M34 66 Q50 86 66 66 Q50 74 34 66Z" fill="#b8b8c8"/>`,
  ponytail: (h) => `<circle cx="80" cy="42" r="10" fill="${h}"/>`,
};

const EYES = {
  happy: `<path d="M33 50 Q39 43 45 50 M55 50 Q61 43 67 50" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round"/>`,
  normal: `<circle cx="39" cy="50" r="3.5" fill="#333"/><circle cx="61" cy="50" r="3.5" fill="#333"/>`,
  worried: `<circle cx="39" cy="51" r="3.5" fill="#333"/><circle cx="61" cy="51" r="3.5" fill="#333"/><path d="M33 43 L45 40 M55 40 L67 43" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><path d="M76 38 Q80 46 76 50 Q72 46 76 38Z" fill="#7ad7ff"/>`,
  surprised: `<circle cx="39" cy="50" r="6" fill="#fff" stroke="#333" stroke-width="2"/><circle cx="61" cy="50" r="6" fill="#fff" stroke="#333" stroke-width="2"/><circle cx="39" cy="50" r="2.5" fill="#333"/><circle cx="61" cy="50" r="2.5" fill="#333"/>`,
};
const MOUTH = {
  happy: `<path d="M41 62 Q50 72 59 62" fill="#ff8a8a" stroke="#333" stroke-width="2.5" stroke-linejoin="round"/>`,
  normal: `<path d="M44 64 Q50 68 56 64" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>`,
  worried: `<path d="M43 67 Q47 62 50 66 Q53 62 57 67" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>`,
  surprised: `<ellipse cx="50" cy="66" rx="4" ry="5" fill="#a33" stroke="#333" stroke-width="2"/>`,
};

export function avatar(role = 'me', mood = 'normal', size = 96) {
  const r = ROLES[role] || ROLES.me;
  const hairFront = r.extra === 'beret' ? '' : `<path d="M24 48 Q22 16 50 16 Q78 16 76 48 Q66 33 50 33 Q34 33 24 48Z" fill="${r.hair}"/>`;
  const sideHair = r.extra === 'beret' ? `<rect x="21" y="34" width="10" height="38" rx="5" fill="${r.hair}"/><rect x="69" y="34" width="10" height="38" rx="5" fill="${r.hair}"/>` : '';
  return `<svg class="avatar" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="${r.name}">
  ${r.extra === 'ponytail' ? EXTRA.ponytail(r.hair) : ''}${r.extra === 'bun' ? EXTRA.bun(r.hair) : ''}${sideHair}
  <path d="M14 100 Q16 78 50 78 Q84 78 86 100Z" fill="${r.shirt}"/>
  <circle cx="50" cy="50" r="27" fill="#ffe3cf"/>
  ${hairFront}
  <circle cx="31" cy="60" r="5" fill="#ffb3b3" opacity=".7"/><circle cx="69" cy="60" r="5" fill="#ffb3b3" opacity=".7"/>
  ${EYES[mood] || EYES.normal}${MOUTH[mood] || MOUTH.normal}
  ${r.extra === 'headphones' ? EXTRA.headphones() : r.extra === 'beret' ? EXTRA.beret() : r.extra === 'glasses' ? EXTRA.glasses() : r.extra === 'glassesBeard' ? EXTRA.glassesBeard() : ''}
</svg>`;
}

// 對話框：頭像 + 名字 + 泡泡
export const say = (role, text, mood = 'normal') =>
  `<div class="dlg">${avatar(role, mood)}<div class="bubble"><b>${(ROLES[role] || ROLES.me).name}</b><p>${text}</p></div></div>`;
