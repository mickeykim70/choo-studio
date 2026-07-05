import { useState } from 'react';

// 단위원(주황) 기준으로 초록 원 크기를 바꿔도 "호 ÷ 반지름 = 라디안"은 불변임을 보이는 시뮬.
const GREEN = '#4a7a5a';
const ORANGE = '#c0562f';
const INK = '#3a352c';
const SOFT = '#7a7259';
const LINE = '#cdbfa0';
const YELLOW = '#f2d675';

const cx = 160, cy = 165, Ru = 38;

function pt(a, Rr) {
  return [cx + Rr * Math.cos(a), cy - Rr * Math.sin(a)];
}
function arcPts(a1, Rr) {
  const n = Math.max(2, Math.ceil(a1 / 0.04));
  const p = [];
  for (let i = 0; i <= n; i++) {
    const a = a1 * i / n;
    const q = pt(a, Rr);
    p.push(q[0].toFixed(1) + ',' + q[1].toFixed(1));
  }
  return p;
}
function circleGroup(Rr, color, t, sw) {
  let g = '';
  g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + Rr.toFixed(1) + '" fill="none" stroke="' + LINE + '" stroke-width="1.4"/>';
  if (t > 0) {
    g += '<polygon points="' + (cx + ',' + cy + ' ' + arcPts(t, Rr).join(' ')) + '" fill="' + color + '" fill-opacity="0.08"/>';
  }
  const st = pt(0, Rr);
  g += '<line x1="' + cx + '" y1="' + cy + '" x2="' + st[0].toFixed(1) + '" y2="' + st[1].toFixed(1) + '" stroke="' + LINE + '" stroke-width="1.2" stroke-dasharray="4 3"/>';
  if (t > 0) {
    g += '<polyline points="' + arcPts(t, Rr).join(' ') + '" fill="none" stroke="' + color + '" stroke-width="' + sw + '" stroke-linecap="round"/>';
  }
  for (let j = 1; j <= Math.floor(t + 1e-9); j++) {
    const d = pt(j, Rr);
    g += '<circle cx="' + d[0].toFixed(1) + '" cy="' + d[1].toFixed(1) + '" r="2.6" fill="#fffdf6" stroke="' + color + '" stroke-width="1.4"/>';
  }
  const e = pt(t, Rr);
  g += '<line x1="' + cx + '" y1="' + cy + '" x2="' + e[0].toFixed(1) + '" y2="' + e[1].toFixed(1) + '" stroke="' + color + '" stroke-width="1.8"/>';
  g += '<circle cx="' + e[0].toFixed(1) + '" cy="' + e[1].toFixed(1) + '" r="3.6" fill="' + color + '"/>';
  return g;
}

function buildScene(t, ru) {
  const Ro = Ru * ru;
  let g = '';
  if (Ro >= Ru) { g += circleGroup(Ro, GREEN, t, 5); g += circleGroup(Ru, ORANGE, t, 5); }
  else { g += circleGroup(Ru, ORANGE, t, 5); g += circleGroup(Ro, GREEN, t, 4); }
  g += '<circle cx="' + cx + '" cy="' + cy + '" r="3" fill="' + INK + '"/>';

  const rx = 320, rw = 290, kAbs = 14, uRad = 44;
  g += '<text x="' + rx + '" y="46" font-size="14" font-weight="700" fill="' + SOFT + '">① 실제 길이 — 다르다</text>';
  g += '<rect x="' + rx + '" y="60" width="' + Math.max(0, ru * t * kAbs).toFixed(1) + '" height="13" rx="3" fill="' + GREEN + '" fill-opacity="0.9"/>';
  g += '<text x="' + rx + '" y="90" font-size="13" fill="' + GREEN + '">초록 원 호 = ' + (ru * t).toFixed(2) + '</text>';
  g += '<rect x="' + rx + '" y="100" width="' + (1 * t * kAbs).toFixed(1) + '" height="13" rx="3" fill="' + ORANGE + '" fill-opacity="0.9"/>';
  g += '<text x="' + rx + '" y="130" font-size="13" fill="' + ORANGE + '">단위원 호 = ' + t.toFixed(2) + '</text>';

  g += '<line x1="' + rx + '" y1="150" x2="' + (rx + rw) + '" y2="150" stroke="' + LINE + '" stroke-width="1"/>';
  g += '<text x="' + rx + '" y="178" font-size="14" font-weight="700" fill="' + SOFT + '">② 반지름 단위 — 똑같다</text>';
  const lenU = (t * uRad).toFixed(1);
  g += '<rect x="' + rx + '" y="192" width="' + lenU + '" height="13" rx="3" fill="' + GREEN + '" fill-opacity="0.9"/>';
  g += '<text x="' + rx + '" y="222" font-size="13" fill="' + GREEN + '">초록: 반지름 ' + t.toFixed(2) + '개</text>';
  g += '<rect x="' + rx + '" y="232" width="' + lenU + '" height="13" rx="3" fill="' + ORANGE + '" fill-opacity="0.9"/>';
  g += '<text x="' + rx + '" y="262" font-size="13" fill="' + ORANGE + '">단위원: 반지름 ' + t.toFixed(2) + '개 (같음!)</text>';
  for (let m = 1; m <= Math.floor(t + 1e-9); m++) {
    const xt = rx + m * uRad;
    g += '<line x1="' + xt.toFixed(1) + '" y1="188" x2="' + xt.toFixed(1) + '" y2="249" stroke="#fffdf6" stroke-width="1.6"/>';
  }
  g += '<text x="' + rx + '" y="292" font-size="14" font-weight="700" fill="' + INK + '">→ 이 개수 = 라디안. 크기와 무관.</text>';
  return g;
}

const presets = [
  { label: '1 라디안', v: 1 },
  { label: 'π/2', v: Math.PI / 2 },
  { label: 'π', v: Math.PI },
  { label: '2π', v: 2 * Math.PI },
];

export default function RadianRatio() {
  const [t, setT] = useState(Math.PI / 2);
  const [pct, setPct] = useState(180);
  const ru = pct / 100;
  const card = { background: '#fffdf6', border: '1px dashed ' + LINE, borderRadius: 10, padding: '8px 12px' };
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <span style={{ color: SOFT, fontSize: '1rem', whiteSpace: 'nowrap', minWidth: 92 }}>각도 θ (공통)</span>
        <input type="range" min={0} max={2 * Math.PI} step={0.01} value={t}
          onChange={(e) => setT(parseFloat(e.target.value))} style={{ flex: 1, accentColor: INK }} />
        <b style={{ minWidth: 74, fontSize: '1rem' }}>{t.toFixed(2)} rad</b>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <span style={{ color: GREEN, fontSize: '1rem', whiteSpace: 'nowrap', minWidth: 92 }}>초록 원 크기</span>
        <input type="range" min={1} max={300} step={1} value={pct}
          onChange={(e) => setPct(parseFloat(e.target.value))} style={{ flex: 1, accentColor: GREEN }} />
        <b style={{ minWidth: 74, fontSize: '1rem', color: GREEN }}>{ru.toFixed(2)}배</b>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 10, marginBottom: 14 }}>
        <div style={card}>
          <div style={{ fontSize: '0.85rem', color: ORANGE }}>단위원 (주황)</div>
          <div style={{ fontSize: '0.98rem', fontWeight: 700 }}>반지름 1 · 호 {t.toFixed(2)}</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: '0.85rem', color: GREEN }}>초록 원</div>
          <div style={{ fontSize: '0.98rem', fontWeight: 700 }}>반지름 {ru.toFixed(2)} · 호 {(ru * t).toFixed(2)}</div>
        </div>
        <div style={{ background: YELLOW, borderRadius: 10, padding: '8px 12px' }}>
          <div style={{ fontSize: '0.85rem', color: '#7a5a10' }}>호 ÷ 반지름</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: INK }}>{t.toFixed(2)}</div>
        </div>
      </div>
      <svg viewBox="0 0 640 320" style={{ width: '100%', height: 'auto' }}
        role="img" aria-label="단위원과 크기를 바꾼 원의 호를 실제 길이와 반지름 단위로 비교하는 그림"
        dangerouslySetInnerHTML={{ __html: buildScene(t, ru) }} />
    </div>
  );
}
