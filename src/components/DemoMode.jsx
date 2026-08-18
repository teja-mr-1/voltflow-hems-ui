import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Play, Pause as PauseIcon, SkipForward } from 'lucide-react';

// Full demo script — tab, selector, one-liner description
const DEMO_STEPS = [
  // ── OVERVIEW TAB ──────────────────────────────────────────
  { tab: 'overview', selector: '#nav-tab-overview',         label: 'Energy Overview',             desc: 'Your live home energy dashboard — see solar, battery, and grid power all in one place.' },
  { tab: 'overview', selector: '.grid-signal-pill',         label: 'Grid Traffic Signal',         desc: 'A simple indicator showing if electricity from the grid is currently cheap (green) or expensive (red).' },
  { tab: 'overview', selector: 'button[title*="universal"]',label: 'Know Everything Mode',        desc: 'Click this anytime to get simple, plain-English explanations for every button and card on your screen.' },
  { tab: 'overview', selector: '.kpi-card.solar',           label: 'Solar Generation',            desc: 'Shows exactly how much free power your rooftop solar panels are producing right now.' },
  { tab: 'overview', selector: '.kpi-card.battery',         label: 'Powerwall Battery',           desc: 'Shows how full your home battery is, and whether it is currently charging or discharging.' },
  { tab: 'overview', selector: '.kpi-card.home',            label: 'Household Demand',            desc: 'The total amount of electricity your house and appliances are using at this exact moment.' },
  { tab: 'overview', selector: '.kpi-card.grid',            label: 'Grid Exchange',               desc: 'Shows if your home is buying power from the city grid, or selling extra solar power back to it.' },
  { tab: 'overview', selector: '.flow-diagram-container',   label: 'Power Flow Map',              desc: 'An animated diagram that visually shows where your electricity is coming from and where it is going.' },
  { tab: 'overview', selector: '.col-span-5',               label: 'Power Usage Share',           desc: 'A simple pie chart breaking down exactly which appliances are using your electricity right now.' },
  { tab: 'overview', selector: '[data-explain-title="24-Hour Energy Graph"]', label: '24-Hour Energy Graph', desc: 'An interactive timeline of your solar generation, home power usage, and battery levels over the day.' },

  // ── DEVICES TAB ───────────────────────────────────────────
  { tab: 'devices',  selector: '#nav-tab-devices',          label: 'Connected Devices',           desc: 'A complete list of your smart hardware — your electric vehicles, heat pumps, and batteries.' },
  { tab: 'devices',  selector: 'button[data-explain-title="Connect Device Wizard"]', label: 'Connect New Device', desc: 'A simple wizard to easily add new smart appliances to your VoltFlow system.' },
  { tab: 'devices',  selector: '.device-card:nth-child(1)', label: 'Electric Vehicle Charger',    desc: 'Your EV charger — shows how fast your car is charging and when it will be full.' },
  { tab: 'devices',  selector: '.device-card:nth-child(2)', label: 'Home Battery',                desc: 'Your home battery — saving extra solar power for you to use when electricity gets expensive later.' },
  { tab: 'devices',  selector: '.device-card:nth-child(3)', label: 'Solar Inverter',              desc: 'Your solar system — maximizing the clean power generated from your roof.' },
  { tab: 'devices',  selector: '.device-card:nth-child(4)', label: 'Smart Heat Pump',             desc: 'Your heating system — running quietly to warm up the house before electricity prices rise.' },

  // ── SCHEDULING TAB ────────────────────────────────────────
  { tab: 'scheduling', selector: '#nav-tab-scheduling',     label: 'Smart Scheduling',            desc: 'Your automated daily planner — it automatically runs appliances when electricity is cheapest.' },
  { tab: 'scheduling', selector: '.day-btn:nth-child(2)',   label: 'Daily Schedule Planner',      desc: 'Pick any day of the week to see exactly when your appliances are scheduled to run.' },
  { tab: 'scheduling', selector: '.gantt-container',        label: 'Weekly Timeline',             desc: 'A visual timeline showing your automated appliance schedule side-by-side with electricity prices.' },

  // ── CONTROLS TAB ──────────────────────────────────────────
  { tab: 'controls', selector: '#nav-tab-controls',         label: 'System Controls',             desc: 'Your master control panel — set your comfort rules so the system never leaves you with a cold house or empty car.' },
  { tab: 'controls', selector: '.btn-override',             label: 'Pause All Auto-Changes',      desc: 'An emergency brake. Click this to instantly stop the system from making any automated changes.' },
  { tab: 'controls', selector: '.btn-emergency',            label: 'Emergency Boost',             desc: 'Need power now? This button forces your EV and heater to run immediately, ignoring electricity prices.' },
  { tab: 'controls', selector: '.priority-list',            label: 'Appliance Priority',          desc: 'Drag and drop to tell the system which appliances are most important to keep running during an outage.' },

  // ── GRID SIGNALS TAB ──────────────────────────────────────
  { tab: 'grid',     selector: '#nav-tab-grid',             label: 'Grid Intelligence',           desc: 'Live updates from your local power grid, showing live electricity prices and grid congestion alerts.' },
  { tab: 'grid',     selector: '[data-explain-title="Substation Grid Signal Banner"]', label: 'Grid Status Banner', desc: 'Alerts you if the neighborhood power grid is overloaded, and how your home is helping to balance it.' },
  { tab: 'grid',     selector: '.kpi-card:nth-child(1)',    label: 'Monthly Savings',             desc: 'The exact amount of money you have saved this month by automatically shifting your power usage.' },
  { tab: 'grid',     selector: '.kpi-card:nth-child(2)',    label: 'Cash Rewards',                desc: 'Extra cash you earned because your home automatically reduced power when the grid was stressed.' },

  // ── SAVINGS TAB ───────────────────────────────────────────
  { tab: 'savings',  selector: '#nav-tab-savings',          label: 'Savings & Rewards',           desc: 'Your financial overview — see all your monthly savings, cash rewards, and environmental impact.' },
  { tab: 'savings',  selector: '.kpi-card:nth-child(3)',    label: 'Carbon Offset Tracker',       desc: 'Calculates the real-world environmental impact of running your home on clean solar energy.' },
  { tab: 'savings',  selector: '.glass-card:nth-child(2)',  label: 'EV-Ready Guarantee',          desc: 'A system promise guaranteeing that your electric car will be charged and ready before you leave.' },

  // ── PRIVACY TAB ───────────────────────────────────────────
  { tab: 'privacy',  selector: '#nav-tab-privacy',          label: 'Privacy & Data',              desc: 'Your personal data shield. VoltFlow ensures your personal habits never leave your home network.' },
  { tab: 'privacy',  selector: '.switch-toggle:nth-child(2)', label: 'Appliance Data Shield',     desc: 'A simple switch to instantly stop sharing your appliance usage data with the local power company.' },
  { tab: 'privacy',  selector: '.switch-toggle',            label: 'Consent Toggles',             desc: 'Granular switches giving you full control over exactly what data is shared and what stays private.' },

  // ── RELIABILITY TAB ───────────────────────────────────────
  { tab: 'reliability', selector: '#nav-tab-reliability',   label: 'Reliability & Fallback',      desc: 'Shows how your home will automatically keep running on solar and battery power if the internet goes down.' },
  { tab: 'reliability', selector: '.glass-card',            label: 'Offline Simulator',           desc: 'Click this to simulate an internet outage and watch the system safely switch to local-only control.' },

  // ── FUTURE LAB TAB ────────────────────────────────────────
  { tab: 'future_lab', selector: '#nav-tab-future_lab',     label: 'Future Energy Lab',           desc: 'A sneak peek at advanced experimental features like letting your EV battery power your house.' },
  { tab: 'future_lab', selector: '.btn-primary',            label: 'Vehicle-to-Home Mode',        desc: 'A cutting-edge feature that allows your electric car to discharge its battery to power your home.' },
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
