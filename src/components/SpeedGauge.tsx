"use client";

import { useEffect, useRef, useState } from "react";
import { TestPhase } from "@/types";
import { useTheme } from "@/components/ThemeProvider";

interface SpeedGaugeProps {
  speed: number;
  maxSpeed?: number;
  phase: TestPhase;
  size?: number;
  instant?: boolean;
  resetKey?: number;
  unit: "bit" | "byte";
}

// ─── Spring constants (critically damped) ────────────────────────────────────
const STIFFNESS = 120;
const DAMPING   = 22;
const MASS      = 1;

// ─── Gauge arc geometry ───────────────────────────────────────────────────────
const START_DEG  = -220; // degrees — bottom-left
const END_DEG    =   40; // degrees — bottom-right
const TOTAL_DEG  = END_DEG - START_DEG; // 260°

// ─── Phase helpers ────────────────────────────────────────────────────────────
function getColors(phase: TestPhase): [string, string, string] {
  switch (phase) {
    case "ping":     return ["#818cf8", "#6366f1", "#4f46e5"];
    case "download": return ["#60a5fa", "#3b82f6", "#2563eb"];
    case "upload":   return ["#34d399", "#10b981", "#059669"];
    case "complete": return ["#22d3ee", "#06b6d4", "#0891b2"];
    default:         return ["#818cf8", "#6366f1", "#4f46e5"];
  }
}

function getLabel(phase: TestPhase) {
  switch (phase) {
    case "ping":     return { icon: "◉", text: "Connecting" };
    case "download": return { icon: "↓", text: "Download" };
    case "upload":   return { icon: "↑", text: "Upload" };
    case "complete": return { icon: "✓", text: "Complete" };
    default:         return { icon: "◎", text: "Ready" };
  }
}

// ─── Geometry helpers ─────────────────────────────────────────────────────────
const toRad = (d: number) => (d * Math.PI) / 180;

function polarXY(cx: number, cy: number, r: number, deg: number) {
  return {
    x: cx + r * Math.cos(toRad(deg)),
    y: cy + r * Math.sin(toRad(deg)),
  };
}

/** Build an SVG arc path string for a given radius and angle range. */
function arcD(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polarXY(cx, cy, r, startDeg);
  const e = polarXY(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

/** Arc length for a radius and span in degrees. */
const arcLen = (r: number, deg: number) => r * toRad(deg);

// ─── Ripple ring — pure RAF, no React state ───────────────────────────────────
function Ripple({ cx, cy, color, phase }: { cx: number; cy: number; color: string; phase: number }) {
  const ref = useRef<SVGCircleElement>(null);
  useEffect(() => {
    let raf: number;
    const DURATION = 2200;
    const offset = phase * DURATION;
    let t0: number | null = null;
    const tick = (now: number) => {
      if (t0 === null) t0 = now - offset;
      const p = ((now - t0) % DURATION) / DURATION;
      const el = ref.current;
      if (el) {
        el.setAttribute("r",       String(14 + p * 26));
        el.setAttribute("opacity", String(0.5 * (1 - p)));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);
  return <circle ref={ref} cx={cx} cy={cy} r={14} fill="none" stroke={color} strokeWidth="1" opacity={0} />;
}

// ─── SpeedGauge ───────────────────────────────────────────────────────────────
export function SpeedGauge({
  speed,
  maxSpeed = 1000,
  phase,
  size    = 380,
  instant = false,
  resetKey = 0,
  unit,
}: SpeedGaugeProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  useEffect(() => { setMounted(true); }, []);

  const isDark = resolvedTheme === "dark";

  // ── Theme-aware colors ──────────────────────────────────────────────────
  const trackOuter = isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.06)";
  const trackMain  = isDark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.08)";
  const trackInner = isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.04)";
  const tickMajor  = isDark ? "rgba(255,255,255,0.22)"  : "rgba(0,0,0,0.2)";
  const tickMinor  = isDark ? "rgba(255,255,255,0.08)"  : "rgba(0,0,0,0.08)";
  const tickMajorActive  = isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)";
  const tickMinorActive  = isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.25)";
  const tickLabel  = isDark ? "rgba(255,255,255,0.25)"  : "rgba(0,0,0,0.3)";
  const hubFill    = isDark ? "#06080d" : "#ffffff";
  const hubStroke  = isDark ? "rgba(255,255,255,0.06)"  : "rgba(0,0,0,0.08)";
  const hubInnerStroke = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)";
  const hubGradStart = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)";
  const hubGradEnd   = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)";
  const numberGradBg = isDark
    ? (c1: string, c2: string) => `linear-gradient(135deg, ${c1}, #ffffff, ${c2})`
    : (c1: string, c2: string) => `linear-gradient(135deg, ${c1}, #0f172a, ${c2})`;

  // ── Geometry ──────────────────────────────────────────────────────────────
  const cx    = size / 2;
  const cy    = size / 2;
  const mainR = size / 2 - 40;
  const outerR = mainR + 12;
  const innerR = mainR - 14;

  // Total arc length of the main track — used for dasharray/dashoffset
  const TOTAL_LEN = arcLen(mainR, TOTAL_DEG);

  // ── Spring state (mutable refs — never triggers React renders) ────────────
  // Arc spring: 0–1 percentage (capped at maxSpeed)
  const springPos  = useRef(0);
  const springVel  = useRef(0);
  const targetPct  = useRef(0);
  // Number spring: raw speed in Mbps (uncapped — can exceed maxSpeed)
  const numPos     = useRef(0);
  const numVel     = useRef(0);
  const targetSpeed = useRef(0);
  const lastTs     = useRef<number | null>(null);
  const rafId      = useRef(0);

  // ── DOM refs ──────────────────────────────────────────────────────────────
  // Fill arc: single continuous path, animated via stroke-dashoffset
  const fillRef     = useRef<SVGPathElement>(null);
  const glowRef     = useRef<SVGPathElement>(null);
  const outerArcRef = useRef<SVGPathElement>(null);
  const needleLineRef = useRef<SVGLineElement>(null);
  const needleTipRef  = useRef<SVGCircleElement>(null);
  const numberRef     = useRef<HTMLSpanElement>(null);

  // Major / minor tick refs for color updates
  const N_MAJOR = 11;
  const N_MINOR = 51;
  const majorLineRefs  = useRef<(SVGLineElement  | null)[]>(Array(N_MAJOR).fill(null));
  const majorTextRefs  = useRef<(SVGTextElement  | null)[]>(Array(N_MAJOR).fill(null));
  const minorLineRefs  = useRef<(SVGLineElement  | null)[]>(Array(N_MINOR).fill(null));

  // ── Precompute tick geometry (static) ─────────────────────────────────────
  const majorTicks = Array.from({ length: N_MAJOR }, (_, i) => {
    const deg = START_DEG + (TOTAL_DEG * i) / 10;
    return {
      inner:  polarXY(cx, cy, mainR - 8,  deg),
      outer:  polarXY(cx, cy, mainR + 2,  deg),
      label:  polarXY(cx, cy, mainR - 28, deg),
      val:    Math.round((maxSpeed * i) / 10),
      pctAt:  i / 10,
    };
  });

  const minorTicks = Array.from({ length: N_MINOR }, (_, i) => {
    const deg = START_DEG + (TOTAL_DEG * i) / 50;
    return {
      inner: polarXY(cx, cy, mainR - 3, deg),
      outer: polarXY(cx, cy, mainR + 1, deg),
      pctAt: i / 50,
    };
  });

  // ── Update target on speed/resetKey change ────────────────────────────────
  useEffect(() => {
    targetPct.current   = Math.min(speed / maxSpeed, 1); // arc: capped 0–1
    targetSpeed.current = speed;                          // number: raw, uncapped
    if (instant) {
      springPos.current = targetPct.current;
      springVel.current = 0;
      numPos.current    = speed;
      numVel.current    = 0;
    }
  }, [speed, maxSpeed, instant, resetKey]);

  // ── Reset spring on phase transition ─────────────────────────────────────
  useEffect(() => {
    springPos.current  = 0;
    springVel.current  = 0;
    targetPct.current  = 0;
    numPos.current     = 0;
    numVel.current     = 0;
    targetSpeed.current = 0;
    lastTs.current     = null;
  }, [resetKey]);

  // ── Main animation loop ───────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;

    const [c1, c2] = getColors(phase);

    const animate = (now: number) => {
      // Spring integration (semi-implicit Euler, dt clamped)
      if (lastTs.current === null) lastTs.current = now;
      const dt  = Math.min((now - lastTs.current) / 1000, 0.05);
      lastTs.current = now;

      // Arc spring (0–1, capped)
      const pos  = springPos.current;
      const vel  = springVel.current;
      const tgt  = targetPct.current;
      const acc  = (-STIFFNESS * (pos - tgt) - DAMPING * vel) / MASS;
      const nVel = vel + acc * dt;
      const nPos = Math.max(0, Math.min(1, pos + nVel * dt));
      springPos.current = nPos;
      springVel.current = nVel;

      // Number spring (raw Mbps, uncapped — can exceed maxSpeed)
      const nspd  = numPos.current;
      const nspv  = numVel.current;
      const nspTgt = targetSpeed.current;
      const nspAcc = (-STIFFNESS * (nspd - nspTgt) - DAMPING * nspv) / MASS;
      const nspVelNew = nspv + nspAcc * dt;
      const nspPosNew = Math.max(0, nspd + nspVelNew * dt);
      numPos.current = nspPosNew;
      numVel.current = nspVelNew;

      const pct = nPos;

      // ── Fill arc via stroke-dashoffset (single continuous path) ──────────
      const dashOffset = TOTAL_LEN * (1 - pct);
      const visible    = pct > 0.002;

      if (fillRef.current) {
        fillRef.current.style.strokeDashoffset = String(dashOffset);
        fillRef.current.style.visibility       = visible ? "visible" : "hidden";
      }
      if (glowRef.current) {
        glowRef.current.style.strokeDashoffset = String(dashOffset);
        glowRef.current.style.visibility       = visible ? "visible" : "hidden";
      }
      if (outerArcRef.current) {
        const outerTotal = arcLen(outerR, TOTAL_DEG);
        outerArcRef.current.style.strokeDashoffset = String(outerTotal * (1 - pct));
        outerArcRef.current.style.visibility       = visible ? "visible" : "hidden";
      }

      // ── Needle (direct polar → cartesian, no CSS transform) ──────────────
      const needleAngleDeg = START_DEG + TOTAL_DEG * pct;
      const needleRad      = toRad(needleAngleDeg);
      const needleLen      = mainR - 8;
      const nx = cx + needleLen * Math.cos(needleRad);
      const ny = cy + needleLen * Math.sin(needleRad);

      if (needleLineRef.current) {
        needleLineRef.current.setAttribute("x2",         String(nx));
        needleLineRef.current.setAttribute("y2",         String(ny));
        needleLineRef.current.style.visibility = visible ? "visible" : "hidden";
      }
      if (needleTipRef.current) {
        needleTipRef.current.setAttribute("cx",   String(nx));
        needleTipRef.current.setAttribute("cy",   String(ny));
        needleTipRef.current.setAttribute("fill", c1);
        needleTipRef.current.style.visibility = visible ? "visible" : "hidden";
      }

      // ── Major tick + label colours ────────────────────────────────────────
      for (let i = 0; i < N_MAJOR; i++) {
        const active = majorTicks[i].pctAt <= pct;
        majorLineRefs.current[i]?.setAttribute("stroke", active ? c2 : tickMajor);
        majorTextRefs.current[i]?.setAttribute("fill",   active ? tickMajorActive : tickLabel);
      }

      // ── Minor tick colours ────────────────────────────────────────────────
      for (let i = 0; i < N_MINOR; i++) {
        const active = minorTicks[i].pctAt <= pct;
        minorLineRefs.current[i]?.setAttribute("stroke", active ? tickMinorActive : tickMinor);
      }

      // ── Number readout — uses raw speed spring, NOT capped pct ──────────
      if (numberRef.current) {
        if (phase === "ping") {
          numberRef.current.textContent = "---";
        } else {
          const v = numPos.current; // uncapped raw Mbps value
          numberRef.current.textContent =
            v < 10 ? v.toFixed(2) : v < 100 ? v.toFixed(1) : v.toFixed(0);
        }
        numberRef.current.style.backgroundImage = numberGradBg(c1, c2);
        numberRef.current.style.setProperty("-webkit-background-clip", "text");
        numberRef.current.style.setProperty("background-clip", "text");
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  // Re-run when phase changes so gradient IDs update
  }, [mounted, phase, cx, cy, mainR, outerR, maxSpeed, TOTAL_LEN, isDark, tickMajor, tickMinor, tickMajorActive, tickMinorActive, tickLabel, numberGradBg, majorTicks, minorTicks]);

  // ── Colors for static JSX rendering ──────────────────────────────────────
  const [c1, c2, c3] = getColors(phase);
  const label        = getLabel(phase);
  const isActive     = phase !== "idle" && phase !== "complete";

  // ─── Full arc path (static, for background track and fill base) ───────────
  const fullArc      = arcD(cx, cy, mainR,  START_DEG, END_DEG);
  const fullOuterArc = arcD(cx, cy, outerR, START_DEG, END_DEG);
  const fullInnerArc = arcD(cx, cy, innerR, START_DEG, END_DEG);

  if (!mounted) {
    return (
      <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <div className="shimmer rounded-full" style={{ width: size - 20, height: size - 20 }} />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size }}>

      {/* Ambient glow pulse behind gauge */}
      {isActive && (
        <div
          className="absolute rounded-full gauge-pulse"
          style={{ inset: -10, background: `radial-gradient(circle, ${c2}18 0%, transparent 70%)` }}
        />
      )}

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        <defs>
          {/* One gradient per phase so colour transitions are clean */}
          {(["idle","ping","download","upload","complete"] as TestPhase[]).map(p => {
            const [pc1,,pc3] = getColors(p);
            return (
              <linearGradient key={p} id={`grad-${p}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor={pc1} />
                <stop offset="100%" stopColor={pc3} />
              </linearGradient>
            );
          })}

          <linearGradient id="needleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={c2} stopOpacity="0.15" />
            <stop offset="100%" stopColor={c1} />
          </linearGradient>

          <linearGradient id="centerHubGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor={hubGradStart} />
            <stop offset="100%" stopColor={hubGradEnd} />
          </linearGradient>

          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={c2} stopOpacity="0.3" />
            <stop offset="100%" stopColor={c2} stopOpacity="0" />
          </radialGradient>

          {/* Glow filter for the fill arc */}
          <filter id="arcGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" />
          </filter>

          <filter id="needleGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Background tracks (static) ──────────────────────────────────── */}
        <path d={fullOuterArc} fill="none" stroke={trackOuter}  strokeWidth="1.5"  strokeLinecap="round" />
        <path d={fullArc}      fill="none" stroke={trackMain} strokeWidth="12" strokeLinecap="round" />
        <path d={fullInnerArc} fill="none" stroke={trackInner}  strokeWidth="1"  strokeLinecap="round" />

        {/* ── Glow blur layer (wide, blurred — behind the fill) ────────────── */}
        <path
          ref={glowRef}
          d={fullArc}
          fill="none"
          stroke={c2}
          strokeWidth="22"
          strokeLinecap="round"
          strokeDasharray={TOTAL_LEN}
          strokeDashoffset={TOTAL_LEN}   /* fully hidden initially */
          opacity={isDark ? "0.22" : "0.15"}
          filter="url(#softGlow)"
          style={{ visibility: "hidden" }}
        />

        {/* ── Crisp fill arc — THE main coloured ring ─────────────────────── */}
        <path
          ref={fillRef}
          d={fullArc}
          fill="none"
          stroke={`url(#grad-${phase})`}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={TOTAL_LEN}
          strokeDashoffset={TOTAL_LEN}   /* RAF overwrites this every frame */
          filter="url(#arcGlow)"
          style={{ visibility: "hidden" }}
        />

        {/* ── Outer thin accent arc ─────────────────────────────────────────── */}
        <path
          ref={outerArcRef}
          d={fullOuterArc}
          fill="none"
          stroke={c2}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={arcLen(outerR, TOTAL_DEG)}
          strokeDashoffset={arcLen(outerR, TOTAL_DEG)}
          opacity="0.55"
          style={{ visibility: "hidden" }}
        />

        {/* ── Minor ticks ───────────────────────────────────────────────────── */}
        {minorTicks.map((t, i) => (
          <line
            key={`mn-${i}`}
            ref={el => { minorLineRefs.current[i] = el; }}
            x1={t.inner.x} y1={t.inner.y}
            x2={t.outer.x} y2={t.outer.y}
            stroke={tickMinor}
            strokeWidth="0.8"
          />
        ))}

        {/* ── Major ticks + labels ──────────────────────────────────────────── */}
        {majorTicks.map((t, i) => (
          <g key={`mj-${i}`}>
            <line
              ref={el => { majorLineRefs.current[i] = el; }}
              x1={t.inner.x} y1={t.inner.y}
              x2={t.outer.x} y2={t.outer.y}
              stroke={tickMajor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <text
              ref={el => { majorTextRefs.current[i] = el; }}
              x={t.label.x} y={t.label.y}
              textAnchor="middle" dominantBaseline="middle"
              fill={tickLabel}
              fontSize="10" fontWeight="600"
              fontFamily="var(--font-inter), system-ui, sans-serif"
              letterSpacing="0.05em"
            >
              {t.val}
            </text>
          </g>
        ))}

        {/* ── Centre ambient glow ───────────────────────────────────────────── */}
        <circle cx={cx} cy={cy} r="60" fill="url(#centerGlow)" />

        {/* ── Needle ────────────────────────────────────────────────────────── */}
        <line
          ref={needleLineRef}
          x1={cx} y1={cy} x2={cx} y2={cy}
          stroke="url(#needleGrad)"
          strokeWidth="3" strokeLinecap="round"
          filter="url(#needleGlow)"
          style={{ visibility: "hidden" }}
        />
        <circle
          ref={needleTipRef}
          cx={cx} cy={cy} r="5"
          fill={c1}
          filter="url(#needleGlow)"
          style={{ visibility: "hidden" }}
        />

        {/* ── Centre hub ────────────────────────────────────────────────────── */}
        <circle cx={cx} cy={cy} r="22" fill={hubFill} stroke={hubStroke} strokeWidth="1" />
        <circle cx={cx} cy={cy} r="16" fill="url(#centerHubGrad)" stroke={hubInnerStroke} strokeWidth="1" />
        <circle cx={cx} cy={cy} r="6"  fill={c2} opacity="0.95" filter="drop-shadow(0 0 3px rgba(255,255,255,0.4))" />
        <circle cx={cx} cy={cy} r="2.5"  fill="white" opacity="0.95" />

        {/* ── Ripple rings when active ──────────────────────────────────────── */}
        {isActive && (
          <>
            <Ripple cx={cx} cy={cy} color={c2} phase={0} />
            <Ripple cx={cx} cy={cy} color={c2} phase={0.5} />
          </>
        )}
      </svg>

      {/* ── Speed readout ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
        <span
          className="text-xs font-bold tracking-[0.25em] uppercase gauge-label-pulse"
          style={{ color: c2, animationPlayState: isActive ? "running" : "paused", opacity: isActive ? undefined : 0.8 }}
        >
          {label.icon} {label.text}
        </span>

        <div className="mt-1 flex items-baseline gap-1">
          <span
            ref={numberRef}
            className="text-6xl font-black tabular-nums tracking-tight"
            style={{
              WebkitTextFillColor: "transparent",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              backgroundImage: numberGradBg(c1, c2),
            }}
          >
            0.00
          </span>
        </div>

        <span className="font-bold tracking-[0.2em] text-[10px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
          {phase === "ping" ? "" : (unit === "byte" ? "MB/s" : "Mbps")}
        </span>
      </div>
    </div>
  );
}
