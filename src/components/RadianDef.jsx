import { useState } from 'react';

// 반지름을 자로 삼아 호를 잰다 — 각의 크기 = "호가 반지름 몇 개인가".
// 도(度)는 한 글자도 쓰지 않는다. π·2π는 각도가 아니라 호의 길이(반 바퀴·한 바퀴)로 등장.
const GREEN = '#4a7a5a';
const ORANGE = '#c0562f';
const INK = '#3a352c';
const SOFT = '#7a7259';
const LINE = '#cdbfa0';

const cx = 150, cy = 140, R = 90;
const rx = 30, ry = 290, scale = 68;

function pt(a) {
  return [cx + R * Math.cos(a), cy - R * Math.sin(a)];
}
function arcPts(a0, a1) {
  const n = Math.max(2, Math.ceil((a1 - a0) / 0.04));
  const p = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + (a1 - a0) * i / n;
    const q = pt(a);
    p.push(q[0].toFixed(1) + ',' + q[1].toFixed(1));
  }
  return p;
}
const band = (k) => (k % 2 === 0 ? GREEN : ORANGE);

function buildScene(t) {
  let g = '';
  g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="' + LINE + '" stroke-width="1.5"/>';
  const st = pt(0);
  g += '<line x1="' + cx + '" y1="' + cy + '" x2="' + st[0].toFixed(1) + '" y2="' + st[1].toFixed(1) + '" stroke="' + SOFT + '" stroke-width="1.8"/>';
  g += '<text x="' + ((cx + st[0]) / 2).toFixed(1) + '" y="' + (cy - 7) + '" font-size="12" fill="' + SOFT + '" text-anchor="middle">반지름</text>';
  for (let k = 0; k < Math.ceil(t - 1e-9); k++) {
    const a0 = Math.max(0, k), a1 = Math.min(t, k + 1);
    if (a1 <= a0) continue;
    g += '<polyline points="' + arcPts(a0, a1).join(' ') + '" fill="none" stroke="' + band(k) + '" stroke-width="7" stroke-linecap="round"/>';
  }
  for (let j = 1; j <= Math.floor(t + 1e-9); j++) {
    const d = pt(j);
    const o = [cx + (R + 15) * Math.cos(j), cy - (R + 15) * Math.sin(j)];
    g += '<circle cx="' + d[0].toFixed(1) + '" cy="' + d[1].toFixed(1) + '" r="3.4" fill="#fffdf6" stroke="' + band(j - 1) + '" stroke-width="1.6"/>';
    g += '<text x="' + o[0].toFixed(1) + '" y="' + (o[1] + 4).toFixed(1) + '" font-size="12" fill="' + SOFT + '" text-anchor="middle">' + j + '</text>';
  }
  const e = pt(t);
  g += '<line x1="' + cx + '" y1="' + cy + '" x2="' + e[0].toFixed(1) + '" y2="' + e[1].toFixed(1) + '" stroke="' + INK + '" stroke-width="2.2"/>';
  g += '<circle cx="' + e[0].toFixed(1) + '" cy="' + e[1].toFixed(1) + '" r="4.5" fill="' + INK + '"/>';
  g += '<circle cx="' + cx + '" cy="' + cy + '" r="3" fill="' + INK + '"/>';

  g += '<text x="' + rx + '" y="' + (ry - 30) + '" font-size="13" fill="' + SOFT + '">호를 쭉 펴서 반지름 자에 대면 ↓ (눈금 한 칸 = 반지름 하나)</text>';
  g += '<line x1="' + rx + '" y1="' + ry + '" x2="' + (rx + 2 * Math.PI * scale).toFixed(1) + '" y2="' + ry + '" stroke="' + LINE + '" stroke-width="1.5"/>';
  for (let b = 0; b < Math.ceil(t - 1e-9); b++) {
    const x0 = rx + Math.max(0, b) * scale, x1 = rx + Math.min(t, b + 1) * scale;
    g += '<rect x="' + x0.toFixed(1) + '" y="' + (ry - 8) + '" width="' + (x1 - x0).toFixed(1) + '" height="16" fill="' + band(b) + '" fill-opacity="0.85"/>';
  }
  for (let m = 1; m <= 6; m++) {
    const xt = rx + m * scale;
    g += '<line x1="' + xt.toFixed(1) + '" y1="' + (ry - 10) + '" x2="' + xt.toFixed(1) + '" y2="' + (ry + 10) + '" stroke="' + LINE + '" stroke-width="1"/>';
    g += '<text x="' + xt.toFixed(1) + '" y="' + (ry + 25) + '" font-size="12" fill="' + SOFT + '" text-anchor="middle">' + m + '</text>';
  }
  const xpi = rx + Math.PI * scale, x2pi = rx + 2 * Math.PI * scale;
  g += '<line x1="' + xpi.toFixed(1) + '" y1="' + (ry - 16) + '" x2="' + xpi.toFixed(1) + '" y2="' + (ry + 16) + '" stroke="' + ORANGE + '" stroke-width="1.5" stroke-dasharray="3 3"/>';
  g += '<text x="' + xpi.toFixed(1) + '" y="' + (ry - 21) + '" font-size="12" fill="' + ORANGE + '" text-anchor="middle">π · 반 바퀴</text>';
  g += '<line x1="' + x2pi.toFixed(1) + '" y1="' + (ry - 16) + '" x2="' + x2pi.toFixed(1) + '" y2="' + (ry + 16) + '" stroke="' + GREEN + '" stroke-width="1.5" stroke-dasharray="3 3"/>';
  g += '<text x="' + x2pi.toFixed(1) + '" y="' + (ry - 21) + '" font-size="12" fill="' + GREEN + '" text-anchor="middle">2π · 한 바퀴</text>';
  const xp = rx + t * scale;
  g += '<polygon points="' + xp.toFixed(1) + ',' + (ry - 11) + ' ' + (xp - 5).toFixed(1) + ',' + (ry - 21) + ' ' + (xp + 5).toFixed(1) + ',' + (ry - 21) + '" fill="' + INK + '"/>';
  return g;
}

const presets = [
  { label: '호 = 반지름 1개', v: 1 },
  { label: '반 바퀴 (호 = π)', v: Math.PI },
  { label: '한 바퀴 (호 = 2π)', v: 2 * Math.PI },
];

export default function RadianDef() {
  const [t, setT] = useState(1);
  const btn = {
    fontFamily: 'var(--font-hand), cursive', fontSize: '1rem',
    background: '#fffdf6', border: '1.5px solid ' + LINE, borderRadius: 8,
    padding: '3px 12px', color: INK, cursor: 'pointer',
  };
  return (
    <div style={{ fontFamily: 'var(--font-hand), cursive', margin: '0.4rem 0' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {presets.map((p) => (
          <button key={p.label} type="button" style={btn} onClick={() => setT(p.v)}>{p.label}</button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <span style={{ color: SOFT, fontSize: '1rem', whiteSpace: 'nowrap' }}>호를 늘린다</span>
        <input type="range" min={0} max={2 * Math.PI} step={0.01} value={t}
          onChange={(e) => setT(parseFloat(e.target.value))} style={{ flex: 1, accentColor: GREEN }} />
      </div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 8 }}>
        <div style={{ background: '#fffdf6', border: '1px dashed ' + LINE, borderRadius: 10, padding: '6px 12px' }}>
          호의 길이 = <b style={{ color: GREEN }}>{t.toFixed(2)}</b> × 반지름
        </div>
        <div style={{ background: '#f2d675', borderRadius: 10, padding: '6px 12px' }}>
          이 값이 곧 각의 크기 = <b>{t.toFixed(2)}</b> 라디안
        </div>
      </div>
      <svg viewBox="0 0 500 320" style={{ width: '100%', height: 'auto' }}
        role="img" aria-label="반지름을 자로 삼아 호를 재는 그림과 반지름 단위 눈금자"
        dangerouslySetInnerHTML={{ __html: buildScene(t) }} />
    </div>
  );
}
