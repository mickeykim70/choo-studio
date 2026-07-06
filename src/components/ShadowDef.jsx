import { useState } from 'react';

// 단위원 위의 점을 돌리면 두 그림자가 생긴다.
// 위에서 온 평행광선 → 바닥(x축) 그림자 = cosθ (가로 위치)
// 옆에서 온 평행광선 → 벽(y축) 그림자 = sinθ (높이)
// (cosθ, sinθ)가 헷갈릴 수 없는 이유를 "그림자"라는 물리 동작으로 보인다.
const GREEN = '#4a7a5a';   // sin · 세로 그림자
const ORANGE = '#c0562f';  // cos · 가로 그림자
const INK = '#3a352c';
const SOFT = '#7a7259';
const LINE = '#cdbfa0';
const YELLOW = '#f2d675';

const ox = 190, oy = 178, R = 120;

function P(th) {
  return [ox + R * Math.cos(th), oy - R * Math.sin(th)];
}
function arc(a0, a1) {
  const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 0.04));
  const p = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + (a1 - a0) * i / n;
    p.push((ox + R * Math.cos(a)).toFixed(1) + ',' + (oy - R * Math.sin(a)).toFixed(1));
  }
  return p.join(' ');
}

function buildScene(th) {
  const c = Math.cos(th), s = Math.sin(th);
  const [px, py] = P(th);
  const fx = ox + R * c;          // 바닥 그림자 점 (x축 위)
  const wy = oy - R * s;          // 벽 그림자 점 (y축 위)
  let g = '';

  // 축
  g += '<line x1="40" y1="' + oy + '" x2="340" y2="' + oy + '" stroke="' + LINE + '" stroke-width="1.4"/>';
  g += '<line x1="' + ox + '" y1="40" x2="' + ox + '" y2="316" stroke="' + LINE + '" stroke-width="1.4"/>';
  // 원
  g += '<circle cx="' + ox + '" cy="' + oy + '" r="' + R + '" fill="none" stroke="' + LINE + '" stroke-width="1.6"/>';
  // 각 표시(작은 호)
  if (Math.abs(th) > 0.02) g += '<polyline points="' + arc(0, th) + '" fill="none" stroke="' + INK + '" stroke-width="1.4" stroke-opacity="0.4"/>';

  // 평행광선 표시 (위에서 ↓ = cos 만드는 빛, 옆에서 → = sin 만드는 빛)
  for (let i = -1; i <= 1; i++) {
    const lx = px + i * 26;
    g += '<line x1="' + lx.toFixed(1) + '" y1="44" x2="' + lx.toFixed(1) + '" y2="60" stroke="' + ORANGE + '" stroke-width="1.4" stroke-opacity="0.55"/>';
    g += '<polygon points="' + lx.toFixed(1) + ',64 ' + (lx - 3).toFixed(1) + ',57 ' + (lx + 3).toFixed(1) + ',57" fill="' + ORANGE + '" fill-opacity="0.55"/>';
  }
  g += '<text x="' + px.toFixed(1) + '" y="38" font-size="12" fill="' + ORANGE + '" text-anchor="middle">위에서 빛 ↓</text>';
  for (let i = -1; i <= 1; i++) {
    const ly = py + i * 26;
    g += '<line x1="320" y1="' + ly.toFixed(1) + '" x2="336" y2="' + ly.toFixed(1) + '" stroke="' + GREEN + '" stroke-width="1.4" stroke-opacity="0.55"/>';
    g += '<polygon points="316,' + ly.toFixed(1) + ' 323,' + (ly - 3).toFixed(1) + ' 323,' + (ly + 3).toFixed(1) + '" fill="' + GREEN + '" fill-opacity="0.55"/>';
  }
  g += '<text x="333" y="' + (py - 16).toFixed(1) + '" font-size="12" fill="' + GREEN + '" text-anchor="end">← 옆에서 빛</text>';

  // 그림자를 떨구는 점선 (P → 바닥, P → 벽)
  g += '<line x1="' + px.toFixed(1) + '" y1="' + py.toFixed(1) + '" x2="' + fx.toFixed(1) + '" y2="' + oy + '" stroke="' + ORANGE + '" stroke-width="1.4" stroke-dasharray="4 3" stroke-opacity="0.8"/>';
  g += '<line x1="' + px.toFixed(1) + '" y1="' + py.toFixed(1) + '" x2="' + ox + '" y2="' + wy.toFixed(1) + '" stroke="' + GREEN + '" stroke-width="1.4" stroke-dasharray="4 3" stroke-opacity="0.8"/>';

  // 그림자(굵은 선) — 바닥=cos(가로), 벽=sin(세로)
  g += '<line x1="' + ox + '" y1="' + oy + '" x2="' + fx.toFixed(1) + '" y2="' + oy + '" stroke="' + ORANGE + '" stroke-width="5" stroke-linecap="round"/>';
  g += '<line x1="' + ox + '" y1="' + oy + '" x2="' + ox + '" y2="' + wy.toFixed(1) + '" stroke="' + GREEN + '" stroke-width="5" stroke-linecap="round"/>';
  g += '<circle cx="' + fx.toFixed(1) + '" cy="' + oy + '" r="3.4" fill="' + ORANGE + '"/>';
  g += '<circle cx="' + ox + '" cy="' + wy.toFixed(1) + '" r="3.4" fill="' + GREEN + '"/>';

  // 반지름과 점 P
  g += '<line x1="' + ox + '" y1="' + oy + '" x2="' + px.toFixed(1) + '" y2="' + py.toFixed(1) + '" stroke="' + INK + '" stroke-width="1.8"/>';
  g += '<circle cx="' + ox + '" cy="' + oy + '" r="3" fill="' + INK + '"/>';
  g += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="5" fill="' + INK + '"/>';

  // 라벨
  g += '<text x="' + ((ox + fx) / 2).toFixed(1) + '" y="' + (oy + (s >= 0 ? 20 : -10)) + '" font-size="13" fill="' + ORANGE + '" text-anchor="middle" font-weight="700">cos θ</text>';
  g += '<text x="' + (ox + (c >= 0 ? -14 : 14)) + '" y="' + ((oy + wy) / 2).toFixed(1) + '" font-size="13" fill="' + GREEN + '" text-anchor="' + (c >= 0 ? 'end' : 'start') + '" font-weight="700">sin θ</text>';
  return g;
}

const presets = [
  { label: 'π/6', v: Math.PI / 6 },
  { label: 'π/4', v: Math.PI / 4 },
  { label: 'π/3', v: Math.PI / 3 },
  { label: '2π/3', v: 2 * Math.PI / 3 },
  { label: '5π/4', v: 5 * Math.PI / 4 },
];

export default function ShadowDef() {
  const [th, setTh] = useState(Math.PI / 4);
  const c = Math.cos(th), s = Math.sin(th);
  const card = { background: '#fffdf6', border: '1px dashed ' + LINE, borderRadius: 10, padding: '8px 12px', textAlign: 'center' };
  const btn = {
    fontFamily: 'var(--font-hand), cursive', fontSize: '1rem',
    background: '#fffdf6', border: '1.5px solid ' + LINE, borderRadius: 8,
    padding: '3px 12px', color: INK, cursor: 'pointer',
  };
  return (
    <div style={{ fontFamily: 'var(--font-hand), cursive', margin: '0.4rem 0' }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {presets.map((p) => (
          <button key={p.label} type="button" style={btn} onClick={() => setTh(p.v)}>{p.label}</button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ color: SOFT, fontSize: '1rem', whiteSpace: 'nowrap' }}>점을 돌린다 θ</span>
        <input type="range" min={0} max={2 * Math.PI} step={0.01} value={th}
          onChange={(e) => setTh(parseFloat(e.target.value))} style={{ flex: 1, accentColor: INK }} />
        <b style={{ minWidth: 66, fontSize: '1rem' }}>{th.toFixed(2)} rad</b>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 10, marginBottom: 12 }}>
        <div style={card}>
          <div style={{ fontSize: '0.85rem', color: ORANGE }}>가로 그림자 = cos θ</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: INK }}>{c.toFixed(2)}</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: '0.85rem', color: GREEN }}>세로 그림자 = sin θ</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: INK }}>{s.toFixed(2)}</div>
        </div>
        <div style={{ background: YELLOW, borderRadius: 10, padding: '8px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: '#7a5a10' }}>점의 좌표 (x, y)</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: INK }}>({c.toFixed(2)}, {s.toFixed(2)})</div>
        </div>
      </div>
      <svg viewBox="0 0 380 340" style={{ width: '100%', maxWidth: 420, display: 'block', margin: '0 auto', height: 'auto' }}
        role="img" aria-label="단위원 위 점의 가로 그림자가 cos, 세로 그림자가 sin임을 보이는 그림"
        dangerouslySetInnerHTML={{ __html: buildScene(th) }} />
    </div>
  );
}
