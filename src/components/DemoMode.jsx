import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Play, Pause as PauseIcon, SkipForward } from 'lucide-react';

// Full demo script — tab, selector, one-liner description
const DEMO_STEPS = [
  // ── OVERVIEW TAB ──────────────────────────────────────────
  { tab: 'overview', selector: '#nav-tab-overview',         label: 'Energy Overview',             desc: 'Your live household energy dashboard — solar, battery, demand & grid all in one view.' },
  { tab: 'overview', selector: '.kpi-card.solar',           label: 'Solar Generation',             desc: 'Real-time kW output from your rooftop photovoltaic array — updated every second.' },
  { tab: 'overview', selector: '.kpi-card.battery',         label: 'Powerwall Battery',            desc: 'State of charge & current charge/discharge rate of your home battery storage.' },
  { tab: 'overview', selector: '.kpi-card.home',            label: 'Household Demand',             desc: 'Total active power draw across all connected appliances and EV chargers right now.' },
  { tab: 'overview', selector: '.kpi-card.grid',            label: 'Grid Exchange',                desc: 'Net import from or export to the public electricity grid — positive = buying, negative = selling.' },
  { tab: 'overview', selector: '.flow-diagram-container',   label: 'Vector Power Flow Matrix',     desc: 'Animated energy routing — shows how power flows from sources (solar, battery) to loads (home, grid).' },

  // ── DEVICES TAB ───────────────────────────────────────────
  { tab: 'devices',  selector: '#nav-tab-devices',          label: 'Connected Devices',            desc: 'Your full smart hardware fleet — EVs, heat pumps, solar inverters, batteries and appliances.' },
  { tab: 'devices',  selector: '.device-card:nth-child(1)', label: 'Tesla Wall Connector Gen 3',   desc: 'EV charger actively delivering 7.4 kW — currently at 76% SOC, targeting 85% by 07:00 AM.' },
  { tab: 'devices',  selector: '.device-card:nth-child(2)', label: 'Tesla Powerwall 2',            desc: 'Home battery at 84% charge — absorbing surplus solar before peak tariff window opens.' },
  { tab: 'devices',  selector: '.device-card:nth-child(3)', label: 'Enphase Solar Inverter',       desc: 'Solar microinverter producing 5.8 kW — maximum clean generation during midday solar peak.' },
  { tab: 'devices',  selector: '.device-card:nth-child(4)', label: 'Daikin Altherma Heat Pump',    desc: 'HVAC running in MODULATING mode at 1.5 kW — pre-heating house before expensive tariff hour.' },

  // ── SCHEDULING TAB ────────────────────────────────────────
  { tab: 'scheduling', selector: '#nav-tab-scheduling',     label: 'Smart Scheduling',             desc: 'Calendar-based energy planner — automatically shifts tasks to cheapest tariff windows.' },
  { tab: 'scheduling', selector: '.gantt-container',        label: '7-Day Gantt Timeline',         desc: 'Drag-and-drop timeline showing when each appliance runs relative to solar & price forecasts.' },

  // ── CONTROLS TAB ──────────────────────────────────────────
  { tab: 'controls', selector: '#nav-tab-controls',         label: 'Priorities & Controls',        desc: 'Set your non-negotiable thresholds — the system will never breach your safety floors.' },
  { tab: 'controls', selector: '.btn-override',             label: 'Pause All Auto-Changes',       desc: 'Instantly freeze all background schedule shifts — VoltFlow holds current device states.' },
  { tab: 'controls', selector: '.btn-emergency',            label: 'Emergency Boost',              desc: 'Forces EV charger & heat pump to full power — ignores grid tariff for urgent departure.' },
  { tab: 'controls', selector: '.priority-list',            label: 'Device Priority Stack',        desc: 'Drag to re-rank which appliances receive power first during grid load rationing events.' },

  // ── GRID SIGNALS TAB ──────────────────────────────────────
  { tab: 'grid',     selector: '#nav-tab-grid',             label: 'Grid Intelligence',            desc: 'Live DSO substation signals — tariff level, flexibility rewards and curtailment requests.' },
  { tab: 'grid',     selector: '.kpi-card:nth-child(1)',    label: 'Monthly Savings',              desc: '€148.50 saved this month vs flat-rate tariff — by shifting 64% of load to cheap windows.' },
  { tab: 'grid',     selector: '.kpi-card:nth-child(2)',    label: 'Flexibility Cash Earned',      desc: '€42.80 earned from DSO peak-response events — grid paid you to shed load at 18:00–19:00.' },

  // ── SAVINGS TAB ───────────────────────────────────────────
  { tab: 'savings',  selector: '#nav-tab-savings',          label: 'Savings & Rewards',            desc: 'Full financial payback — monthly savings, flexibility earnings, CO2 offset and EV guarantee badge.' },
  { tab: 'savings',  selector: '.glass-card:nth-child(2)',  label: 'EV-Ready Guarantee',           desc: 'System promise: your EV will always be at 85% SOC before your set departure time.' },

  // ── PRIVACY TAB ───────────────────────────────────────────
  { tab: 'privacy',  selector: '#nav-tab-privacy',          label: 'Privacy & Data Shield',        desc: 'Zero-knowledge DSO shield — your appliance types and routines never leave your home gateway.' },
  { tab: 'privacy',  selector: '.switch-toggle',            label: 'Granular Consent Toggles',     desc: 'Per-category consent switches — revoke sharing of EV telemetry or appliance data instantly.' },

  // ── RELIABILITY TAB ───────────────────────────────────────
  { tab: 'reliability', selector: '#nav-tab-reliability',   label: 'Reliability & Fallback',       desc: 'Offline-safe autonomous mode — keeps your home running on local solar if the internet drops.' },
  { tab: 'reliability', selector: '.glass-card',            label: 'Fallback Mode Panel',          desc: 'Simulate an internet outage — VoltFlow switches to local-only control with safe default rules.' },

  // ── FUTURE LAB TAB ────────────────────────────────────────
  { tab: 'future_lab', selector: '#nav-tab-future_lab',     label: 'Future Energy Lab',            desc: 'Preview cutting-edge features: V2H bidirectional EV charging, AI tariff prediction & smart export.' },
  { tab: 'future_lab', selector: '.btn-primary',            label: 'Toggle V2H Discharge Flow',    desc: 'Vehicle-to-Home mode — your EV battery can power your house during expensive peak tariff hours.' },
];

const STEP_DURATION_MS = 3200;
const TOOLTIP_W = 360;
const TOOLTIP_H = 160; // approximate
const MARGIN = 14;

/** Smart tooltip placement — tries below, then above, then right, then left */
function calcTooltipPos(rect, vw, vh) {
  const cx = rect.left + rect.width / 2;

  // Below element
  if (rect.bottom + MARGIN + TOOLTIP_H < vh) {
    return {
      top: rect.bottom + MARGIN,
      left: Math.min(Math.max(cx - TOOLTIP_W / 2, MARGIN), vw - TOOLTIP_W - MARGIN),
      placement: 'below',
    };
  }
  // Above element
  if (rect.top - MARGIN - TOOLTIP_H > 0) {
    return {
      top: rect.top - TOOLTIP_H - MARGIN,
      left: Math.min(Math.max(cx - TOOLTIP_W / 2, MARGIN), vw - TOOLTIP_W - MARGIN),
      placement: 'above',
    };
  }
  // Right
  if (rect.right + MARGIN + TOOLTIP_W < vw) {
    return {
      top: Math.min(Math.max(rect.top, MARGIN), vh - TOOLTIP_H - MARGIN),
      left: rect.right + MARGIN,
      placement: 'right',
    };
  }
  // Left (fallback)
  return {
    top: Math.min(Math.max(rect.top, MARGIN), vh - TOOLTIP_H - MARGIN),
    left: Math.max(rect.left - TOOLTIP_W - MARGIN, MARGIN),
    placement: 'left',
  };
}

export const DemoMode = ({ setActiveTab, onStop }) => {
  const [stepIdx, setStepIdx]     = useState(0);
  const [paused, setPaused]       = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 });
  const [targetPos, setTargetPos] = useState({ x: -200, y: -200 });
  const [highlight, setHighlight] = useState(null); // { top, left, width, height }
  const [tooltipPos, setTooltipPos] = useState(null); // { top, left, placement }

  const intervalRef  = useRef(null);
  const animFrameRef = useRef(null);
  const cursorRef    = useRef({ x: -200, y: -200 });

  const step = DEMO_STEPS[stepIdx];

  // ── Smooth lerp cursor ────────────────────────────────
  useEffect(() => {
    let running = true;
    const tick = () => {
      if (!running) return;
      cursorRef.current.x += (targetPos.x - cursorRef.current.x) * 0.09;
      cursorRef.current.y += (targetPos.y - cursorRef.current.y) * 0.09;
      setCursorPos({ x: cursorRef.current.x, y: cursorRef.current.y });
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(animFrameRef.current); };
  }, [targetPos]);

  // ── Apply a step — switch tab, find element, compute positions ──
  const applyStep = useCallback((idx) => {
    const s = DEMO_STEPS[idx];
    if (!s) return;
    setActiveTab(s.tab);

    // Give React + DOM 180 ms to re-render the new tab
    setTimeout(() => {
      const el = document.querySelector(s.selector);
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vw   = window.innerWidth;
      const vh   = window.innerHeight;

      // Cursor target = element centre (viewport coords)
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      setTargetPos({ x: cx, y: cy });

      // Spotlight box (viewport coords — fixed positioning)
      setHighlight({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });

      // Tooltip smart placement (viewport coords)
      setTooltipPos(calcTooltipPos(rect, vw, vh));

      // Scroll element into view
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }, 180);
  }, [setActiveTab]);

  // ── Initial step ─────────────────────────────────────
  useEffect(() => { applyStep(0); }, []); // eslint-disable-line

  // ── Auto-advance ──────────────────────────────────────
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setStepIdx(prev => {
        const next = prev + 1;
        if (next >= DEMO_STEPS.length) { clearInterval(intervalRef.current); onStop(); return prev; }
        applyStep(next);
        return next;
      });
    }, STEP_DURATION_MS);
    return () => clearInterval(intervalRef.current);
  }, [paused, applyStep, onStop]);

  const handleSkip = () => {
    clearInterval(intervalRef.current);
    const next = stepIdx + 1;
    if (next >= DEMO_STEPS.length) { onStop(); return; }
    setStepIdx(next);
    applyStep(next);
  };

  const progress = ((stepIdx + 1) / DEMO_STEPS.length) * 100;

  // Arrow direction based on placement
  const arrowStyle = (placement) => {
    const base = {
      position: 'absolute',
      width: 0, height: 0,
      pointerEvents: 'none',
    };
    const color = 'rgba(5, 150, 105, 0.35)';
    if (placement === 'below') return { ...base, top: -8, left: '50%', transform: 'translateX(-50%)', borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: `8px solid ${color}` };
    if (placement === 'above') return { ...base, bottom: -8, left: '50%', transform: 'translateX(-50%)', borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: `8px solid ${color}` };
    if (placement === 'right') return { ...base, top: '50%', left: -8, transform: 'translateY(-50%)', borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: `8px solid ${color}` };
    return { ...base, top: '50%', right: -8, transform: 'translateY(-50%)', borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: `8px solid ${color}` };
  };

  return (
    <>
      {/* ── Spotlight highlight ring ── */}
      {highlight && (
        <div
          style={{
            position: 'fixed',
            top:    highlight.top    - 7,
            left:   highlight.left   - 7,
            width:  highlight.width  + 14,
            height: highlight.height + 14,
            borderRadius: '16px',
            border: '2px solid rgba(5, 150, 105, 0.75)',
            boxShadow: '0 0 0 3px rgba(5, 150, 105, 0.12), 0 0 22px rgba(5, 150, 105, 0.28)',
            pointerEvents: 'none',
            zIndex: 9997,
            animation: 'demoPulse 1.8s ease-in-out infinite',
            transition: 'top 0.45s cubic-bezier(0.16,1,0.3,1), left 0.45s cubic-bezier(0.16,1,0.3,1), width 0.45s cubic-bezier(0.16,1,0.3,1), height 0.45s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      )}

      {/* ── Animated Hand Cursor ── */}
      <div
        style={{
          position: 'fixed',
          left: cursorPos.x - 10,
          top:  cursorPos.y - 6,
          pointerEvents: 'none',
          zIndex: 9999,
          filter: 'drop-shadow(0 3px 8px rgba(5,150,105,0.5))',
        }}
      >
        <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
          <path d="M7 17V5a2 2 0 0 1 4 0v7"   stroke="#059669" strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M11 11V9a2 2 0 0 1 4 0v3"   stroke="#059669" strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M15 12v-1a2 2 0 0 1 4 0v2"  stroke="#059669" strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M19 13a2 2 0 0 1 4 0v5c0 4.5-3 9-9 9s-7-4.5-7-9v-3" stroke="#059669" strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
        {/* Ripple */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 24, height: 24, borderRadius: '50%',
          background: 'rgba(5,150,105,0.22)',
          animation: 'demoClickPulse 1.3s ease-out infinite',
          pointerEvents: 'none',
        }} />
      </div>

      {/* ── Smart Positioned Tooltip ── */}
      {tooltipPos && (
        <div
          key={stepIdx}
          style={{
            position: 'fixed',
            top:  tooltipPos.top,
            left: tooltipPos.left,
            width: TOOLTIP_W,
            zIndex: 9998,
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(18px)',
            border: '1px solid rgba(5,150,105,0.3)',
            borderRadius: '14px',
            padding: '0.9rem 1.1rem',
            boxShadow: '0 16px 40px rgba(0,0,0,0.13), 0 4px 14px rgba(5,150,105,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            animation: 'tooltipFadeIn 0.28s cubic-bezier(0.16,1,0.3,1) forwards',
          }}
        >
          {/* Arrow pointing to the element */}
          <div style={arrowStyle(tooltipPos.placement)} />

          {/* Header row: step counter + label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              background: 'rgba(5,150,105,0.1)',
              color: '#047857',
              fontSize: '0.68rem',
              fontWeight: 800,
              padding: '2px 7px',
              borderRadius: '9999px',
              border: '1px solid rgba(5,150,105,0.22)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              flexShrink: 0,
            }}>
              {stepIdx + 1} / {DEMO_STEPS.length}
            </span>
            <span style={{ fontSize: '0.83rem', fontWeight: 750, color: '#0f172a', lineHeight: 1.3 }}>
              {step?.label}
            </span>
          </div>

          {/* One-liner description */}
          <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.55, fontWeight: 500 }}>
            {step?.desc}
          </div>

          {/* Progress bar */}
          <div style={{ height: '3px', background: 'rgba(0,0,0,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #059669, #10b981)',
              borderRadius: '9999px',
              transition: 'width 0.5s ease',
            }} />
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              {paused ? '⏸ Paused' : `⏱ ${STEP_DURATION_MS / 1000}s per step`}
            </span>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {[
                { label: paused ? 'Resume' : 'Pause', icon: paused ? <Play size={12} /> : <PauseIcon size={12} />, onClick: () => setPaused(p => !p), color: '#334155' },
                { label: 'Skip', icon: <SkipForward size={12} />, onClick: handleSkip, color: '#334155' },
                { label: 'Exit', icon: <X size={12} />, onClick: onStop, color: '#be123c', bg: 'rgba(225,29,72,0.07)', border: 'rgba(225,29,72,0.3)' },
              ].map(btn => (
                <button
                  key={btn.label}
                  onClick={btn.onClick}
                  style={{
                    padding: '0.28rem 0.6rem',
                    borderRadius: '7px',
                    border: `1px solid ${btn.border || 'rgba(0,0,0,0.12)'}`,
                    background: btn.bg || '#fff',
                    color: btn.color,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '3px',
                  }}
                >
                  {btn.icon}{btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Top shimmer bar ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '3px',
        background: 'linear-gradient(90deg, #059669, #10b981, #0284c7, #10b981, #059669)',
        backgroundSize: '300% 100%',
        animation: 'demoBarShimmer 2.5s linear infinite',
        zIndex: 10000,
      }} />
    </>
  );
};
