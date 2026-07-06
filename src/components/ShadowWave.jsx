import { useState, useEffect, useRef } from 'react';

// 원 위를 도는 점의 "세로 그림자(sin, 높이)"를 시간축에 눕히면 사인 곡선이 된다.
// 왼쪽 = 도는 점 / 오른쪽 = 시간축. 같은 높이가 수평 점선으로 이어져 펜이 실시간 작도.
const GREEN = '#4a7a5a';   // sin · 세로 그림자
const INK = '#3a352c';
const SOFT = '#7a7259';
const LINE = '#cdbfa0';
const YELLOW = '#f2d675';

// 좌표계
const cx = 108, cy = 165, R = 92;   // 왼쪽 원
const x0 = 214, W = 402;            // 오른쪽 그래프: x0에서 시작, 폭 W = 한 바퀴(2π)
const yb = cy;                       // 그래프 기준선(원 중심 높이와 동일)
const TAU = Math.PI * 2;

function angToX(a) { return x0 + (a / TAU) * W; }

// 0..phi까지 사인 곡선을 그리는 polyline 점들
function curvePts(phi) {
  const n = Math.max(2, Math.ceil((phi / TAU) * 160));
  const p = [];
  for (let i = 0; i <= n; i++) {
    const a = (phi * i) / n;
    p.push(angToX(a).toFixed(1) + ',' + (yb - R * Math.sin(a)).toFixed(1));
  }
  return p.join(' ');
}

// 각 표시용 원호(왼쪽 원 안, 0..phi)
function arc(phi) {
  const n = Math.max(2, Math.ceil((phi / TAU) * 90));
  const p = [];
  for (let i = 0; i <= n; i++) {
    const a = (phi * i) / n;
    const r = 26;
    p.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy - r * Math.sin(a)).toFixed(1));
  }
  return p.join(' ');
}

function buildScene(phi) {
  const s = Math.sin(phi), c = Math.cos(phi);
  const px = cx + R * c, py = cy - R * s;   // 도는 점
  const penx = angToX(phi);                  // 펜(현재 작도 위치), peny = py
  let g = '';

  // ── 왼쪽 원 ──
  g += '<line x1="' + (cx - R - 14) + '" y1="' + cy + '" x2="' + (cx + R + 14) + '" y2="' + cy + '" stroke="' + LINE + '" stroke-width="1.3"/>';
  g += '<line x1="' + cx + '" y1="' + (cy - R - 14) + '" x2="' + cx + '" y2="' + (cy + R + 14) + '" stroke="' + LINE + '" stroke-width="1.3"/>';
  g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="' + LINE + '" stroke-width="1.6"/>';
  if (phi > 0.02) g += '<polyline points="' + arc(phi) + '" fill="none" stroke="' + INK + '" stroke-width="1.3" stroke-opacity="0.4"/>';

  // 세로 그림자(높이) — 점의 x자리에서 기준선까지
  g += '<line x1="' + px.toFixed(1) + '" y1="' + cy + '" x2="' + px.toFixed(1) + '" y2="' + py.toFixed(1) + '" stroke="' + GREEN + '" stroke-width="5" stroke-linecap="round"/>';

  // ── 다리: 점 높이 → 펜 (같은 높이, 수평 점선) ──
  g += '<line x1="' + px.toFixed(1) + '" y1="' + py.toFixed(1) + '" x2="' + penx.toFixed(1) + '" y2="' + py.toFixed(1) + '" stroke="' + GREEN + '" stroke-width="1.4" stroke-dasharray="4 3" stroke-opacity="0.75"/>';

  // ── 오른쪽 그래프 틀 ──
  g += '<line x1="' + x0 + '" y1="' + yb + '" x2="' + (x0 + W + 6) + '" y2="' + yb + '" stroke="' + LINE + '" stroke-width="1.3"/>';
  // 세로 눈금 π/2, π, 3π/2, 2π
  const ticks = [[Math.PI / 2, 'π/2'], [Math.PI, 'π'], [3 * Math.PI / 2, '3π/2'], [TAU, '2π']];
  for (const [a, lab] of ticks) {
    const tx = angToX(a);
    g += '<line x1="' + tx.toFixed(1) + '" y1="' + (yb - R - 6) + '" x2="' + tx.toFixed(1) + '" y2="' + (yb + R + 6) + '" stroke="' + LINE + '" stroke-width="1" stroke-dasharray="2 4" stroke-opacity="0.7"/>';
    g += '<text x="' + tx.toFixed(1) + '" y="' + (yb + R + 22) + '" font-size="12" fill="' + SOFT + '" text-anchor="middle">' + lab + '</text>';
  }
  // 옅은 전체 주기 안내선(펜이 갈 길)
  g += '<polyline points="' + curvePts(TAU) + '" fill="none" stroke="' + GREEN + '" stroke-width="1.2" stroke-opacity="0.18"/>';
  // 실제 작도된 곡선 0..phi
  if (phi > 0.001) g += '<polyline points="' + curvePts(phi) + '" fill="none" stroke="' + GREEN + '" stroke-width="2.6"/>';

  // ── 점·반지름·펜 ──
  g += '<line x1="' + cx + '" y1="' + cy + '" x2="' + px.toFixed(1) + '" y2="' + py.toFixed(1) + '" stroke="' + INK + '" stroke-width="1.8"/>';
  g += '<circle cx="' + cx + '" cy="' + cy + '" r="3" fill="' + INK + '"/>';
  g += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="5.5" fill="' + INK + '"/>';
  g += '<circle cx="' + penx.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="5" fill="' + GREEN + '"/>';

  // 라벨
  g += '<text x="' + cx + '" y="' + (cy + R + 30) + '" font-size="12" fill="' + SOFT + '" text-anchor="middle">도는 점</text>';
  g += '<text x="' + (x0 + W / 2) + '" y="30" font-size="12" fill="' + GREEN + '" text-anchor="middle">시간 위에 눕힌 그림자 = sin θ</text>';
  return g;
}

export default function ShadowWave() {
  const [phi, setPhi] = useState(Math.PI / 4);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const raf = useRef(0);
  const last = useRef(0);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  // prefers-reduced-motion이면 자동재생 안 함
  const reduce = typeof window !== 'undefined' && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!playing) return;
    last.current = 0;
    const tick = (t) => {
      if (!last.current) last.current = t;
      const dt = Math.min(0.05, (t - last.current) / 1000); // 큰 점프 방지
      last.current = t;
      setPhi((p) => {
        let np = p + speedRef.current * 1.1 * dt; // rad/s
        if (np >= TAU) np -= TAU;                  // 한 바퀴마다 반복
        return np;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing]);

  const s = Math.sin(phi);
  const btn = {
    fontFamily: 'var(--font-hand), cursive', fontSize: '1rem',
    background: '#fffdf6', border: '1.5px solid ' + LINE, borderRadius: 8,
    padding: '4px 16px', color: INK, cursor: 'pointer',
  };

  return (
    <div style={{ fontFamily: 'var(--font-hand), cursive', margin: '0.4rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
        <button type="button" style={{ ...btn, background: playing ? YELLOW : '#fffdf6' }}
          onClick={() => setPlaying((v) => !v)}>{playing ? '❚❚ 멈춤' : '▶ 재생'}</button>
        <button type="button" style={btn} onClick={() => { setPlaying(false); setPhi(0); }}>↺ 처음</button>
        <span style={{ color: SOFT, fontSize: '0.95rem', whiteSpace: 'nowrap' }}>속도</span>
        <input type="range" min={0.3} max={2} step={0.1} value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))} style={{ width: 90, accentColor: INK }} />
        {reduce && <span style={{ color: SOFT, fontSize: '0.8rem' }}>(모션 최소화 설정 감지 — 아래 슬라이더로 직접 돌려보세요)</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <span style={{ color: SOFT, fontSize: '1rem', whiteSpace: 'nowrap' }}>직접 돌리기 θ</span>
        <input type="range" min={0} max={TAU} step={0.01} value={phi}
          onChange={(e) => { setPlaying(false); setPhi(parseFloat(e.target.value)); }}
          style={{ flex: 1, accentColor: INK }} />
        <b style={{ minWidth: 96, fontSize: '1rem' }}>θ={phi.toFixed(2)}, sin={s.toFixed(2)}</b>
      </div>
      <svg viewBox="0 0 636 330" style={{ width: '100%', display: 'block', margin: '0 auto', height: 'auto' }}
        role="img" aria-label="원을 도는 점의 세로 그림자를 시간축에 눕히면 사인 곡선이 그려지는 그림"
        dangerouslySetInnerHTML={{ __html: buildScene(phi) }} />
    </div>
  );
}
