import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useEnergy } from '../context/EnergyContext';
import { X, Play, Pause as PauseIcon, SkipForward, SkipBack, Sparkles, Sliders } from 'lucide-react';

// Plain-English, Non-Technical Demo Tour for Everyday Citizens
const DEMO_STEPS = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PART 1: ⚡ SMART HANDS-FREE MODE (100% Autonomous AI)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    mode: 'smart',
    tab: 'overview',
    selector: '#btn-mode-smart',
    label: 'Smart Hands-Free Mode',
    desc: 'VoltFlow runs 100% on autopilot in the background. You never have to adjust settings — the smart system automatically uses your free solar first and charges your car when electricity prices drop.',
    phase: 'Smart Hands-Free'
  },
  {
    mode: 'smart',
    tab: 'overview',
    selector: '[data-demo="smart-overview-hero"]',
    label: 'Daily Clean Energy & Savings',
    desc: 'Shows you at a glance that your home is running on 92% clean green energy today, saving you money automatically without needing your attention.',
    phase: 'Smart Hands-Free'
  },
  {
    mode: 'smart',
    tab: 'overview',
    selector: '[data-demo="smart-outcome-stats"]',
    label: 'Daily Summary Numbers',
    desc: 'Shows 4 simple numbers: how much solar power you generated today, how much money you saved, your clean energy percentage, and the tiny bit of power pulled from the grid.',
    phase: 'Smart Hands-Free'
  },
  {
    mode: 'smart',
    tab: 'overview',
    selector: '[data-demo="smart-grid-calm"]',
    label: "Today's Electricity Prices",
    desc: 'Shows when electricity is cheap or expensive today. VoltFlow automatically charged your car and battery during the cheapest overnight hours.',
    phase: 'Smart Hands-Free'
  },
  {
    mode: 'smart',
    tab: 'devices',
    selector: '#nav-tab-devices',
    label: 'Your Home Appliances',
    desc: 'A clear list of your smart devices — like your car charger, home battery, and heating — showing that everything is running safely and on time.',
    phase: 'Smart Hands-Free'
  },
  {
    mode: 'smart',
    tab: 'devices',
    selector: '[data-demo="smart-device-list"]',
    label: 'Appliance Peace of Mind',
    desc: 'Reassures you that your car will be fully charged for your morning departure at 07:30 AM and your home is kept warm and comfortable.',
    phase: 'Smart Hands-Free'
  },
  {
    mode: 'smart',
    tab: 'scheduling',
    selector: '#nav-tab-scheduling',
    label: "Today's Automated Schedule",
    desc: 'Shows the daily schedule VoltFlow created for your home. Appliances are timed automatically to run when electricity is cheapest.',
    phase: 'Smart Hands-Free'
  },
  {
    mode: 'smart',
    tab: 'scheduling',
    selector: '[data-demo="smart-schedule-timeline"]',
    label: '24-Hour Schedule Timeline',
    desc: 'A visual bar showing when your car charges, when the heat pump warms the house, and when the washing machine runs without you having to set a timer.',
    phase: 'Smart Hands-Free'
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PART 2: ⚙️ ADVANCED VIEW (Full Manual Control & Engineering)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    mode: 'advanced',
    tab: 'overview',
    selector: '#btn-mode-advanced',
    label: 'Switching to Advanced View',
    desc: 'Want full control? Advanced View lets you take the steering wheel to manually turn appliances on/off, change limits, and explore all 9 tabs.',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'overview',
    selector: '[data-demo="adv-device-actions"]',
    label: 'Quick Appliance Actions',
    desc: 'One-click manual overrides: click to force-charge your car immediately, change battery export modes, or pause a running washing machine.',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'overview',
    selector: '.flow-diagram-container',
    label: 'Live Power Flow Map',
    desc: 'An animated map showing real-time electricity moving between your rooftop solar, home battery, city grid, and home appliances.',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'overview',
    selector: '[data-demo="adv-power-share"]',
    label: 'Power Usage Breakdown',
    desc: 'A pie chart showing exactly which appliances (car charger, heat pump, appliances) are drawing electricity in your home right now.',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'overview',
    selector: '[data-explain-title="24-Hour Energy Graph"]',
    label: '24-Hour Energy Chart',
    desc: 'Move your cursor over the chart to inspect your rooftop solar generation, home power demand, and battery storage throughout the entire day.',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'devices',
    selector: '#nav-tab-devices',
    label: 'Connected Hardware Fleet',
    desc: 'A detailed view of every smart appliance connected to your home, showing current power draw, battery percentage, and signal strength.',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'devices',
    selector: 'button[data-explain-title="Connect Device Wizard"]',
    label: 'Add New Device Wizard',
    desc: 'Easily pair a new electric car charger, solar inverter, home battery, or heat pump in just a few simple steps.',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'devices',
    selector: '.device-card:nth-child(1)',
    label: 'Manual Appliance Power Buttons',
    desc: 'Click power buttons to manually turn any individual appliance on or off, and see animated battery fill levels in real time.',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'scheduling',
    selector: '#nav-tab-scheduling',
    label: '7-Day Calendar & Planner',
    desc: 'Plan your energy schedule for the whole week or connect your Google & Apple calendars so VoltFlow knows when you are home or away.',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'scheduling',
    selector: '.gantt-container',
    label: 'Drag & Drop Schedule Blocks',
    desc: 'Click and drag any appliance bar to change when it starts and stops, locking it into the cheapest electricity hours.',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'controls',
    selector: '#nav-tab-controls',
    label: 'Master Controls & Overrides',
    desc: 'Freeze all background automation for 1 hour if you want complete manual control, or click Emergency Boost to charge everything at maximum speed.',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'controls',
    selector: '.priority-list',
    label: 'Appliance Priority Order',
    desc: 'Decide which appliances are most important to you so VoltFlow keeps your essential items running first during power grid stress.',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'controls',
    selector: '[data-demo="control-sliders-card"]',
    label: 'Your Minimum Comfort Limits',
    desc: 'Set strict rules the system can never break — like never letting your car battery drop below 30% so you always have driving range.',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'grid',
    selector: '#nav-tab-grid',
    label: 'Local Grid Price & Alerts',
    desc: 'See live electricity prices and neighborhood power grid demand sent directly from your local electricity network.',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'grid',
    selector: '[data-demo="adv-dso-actions"]',
    label: 'Manual Grid Response Actions',
    desc: 'Manually pause your car charger or discharge your battery during grid peak hours to earn cash flexibility rewards.',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'savings',
    selector: '#nav-tab-savings',
    label: 'Savings & Cash Rewards',
    desc: 'Track your total monthly financial savings, cash rewards earned for helping the power grid, and your reduced carbon footprint.',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'savings',
    selector: '[data-demo="adv-savings-controls"]',
    label: 'Savings Strategy Selector',
    desc: 'Choose how VoltFlow optimizes your home: Maximum Savings (save the most money), Balanced Mode, or Comfort First (keep home always ready).',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'privacy',
    selector: '#nav-tab-privacy',
    label: 'Home Data Privacy Shield',
    desc: 'Your daily routines and appliance habits are private. VoltFlow keeps your personal data inside your home and never sells it.',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'privacy',
    selector: '[data-demo="privacy-consent-card"]',
    label: 'Data Sharing Controls',
    desc: 'You control your data. Turn sharing on or off for any device with one click, or delete your history whenever you want.',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'reliability',
    selector: '#nav-tab-reliability',
    label: 'Works Offline Without Internet',
    desc: 'If your home internet or Wi-Fi goes down, VoltFlow continues running safely using local solar power and your saved comfort rules.',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'reliability',
    selector: '[data-demo="reliability-profiles-card"]',
    label: 'Family & Guest Access Tiers',
    desc: 'Create simple user profiles with custom permissions for family members, teenage drivers, or visiting guests.',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'future_lab',
    subTabBtn: '#btn-future-v2h',
    selector: '[data-demo="futurelab-v2h-card"]',
    label: 'Power House from Car (V2H)',
    desc: 'Use your parked electric car as a giant home battery! Power your house from your car during expensive hours while keeping enough battery for driving.',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'future_lab',
    subTabBtn: '#btn-future-community',
    selector: '[data-demo="futurelab-community-card"]',
    label: 'Neighborhood Battery Sharing',
    desc: 'Share or sell surplus rooftop solar power directly with your neighbors, and join a shared neighborhood battery pool to earn extra monthly cash.',
    phase: 'Advanced View'
  },
  {
    mode: 'advanced',
    tab: 'future_lab',
    subTabBtn: '#btn-future-market',
    selector: '[data-demo="futurelab-market-card"]',
    label: 'Flexibility Market Bidding',
    desc: 'Offer unused power back to the energy market at peak times to get paid top prices for helping keep the city power grid stable.',
    phase: 'Advanced View'
  }
];

const STEP_DURATION_MS = 3800;
const TOOLTIP_W = 380;
const TOOLTIP_H = 170; // approximate
const MARGIN = 16;

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
  const { isSmartPlanner, setIsSmartPlanner } = useEnergy();
  const [stepIdx, setStepIdx]     = useState(0);
  const [paused, setPaused]       = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 });
  const [targetPos, setTargetPos] = useState({ x: -200, y: -200 });
  const [highlight, setHighlight] = useState(null); // { top, left, width, height }
  const [tooltipPos, setTooltipPos] = useState(null); // { top, left, placement }

  const intervalRef   = useRef(null);
  const animFrameRef  = useRef(null);
  const cursorRef     = useRef({ x: -200, y: -200 });
  const activeElRef   = useRef(null);
  const lastRectRef   = useRef(null);

  const step = DEMO_STEPS[stepIdx];

  // ── Continuous 60fps tracking loop (glues spotlight & tooltip during scroll & animations) ──
  useEffect(() => {
    let running = true;
    const tick = () => {
      if (!running) return;

      // Lerp animated hand cursor
      cursorRef.current.x += (targetPos.x - cursorRef.current.x) * 0.12;
      cursorRef.current.y += (targetPos.y - cursorRef.current.y) * 0.12;
      setCursorPos({ x: cursorRef.current.x, y: cursorRef.current.y });

      // Real-time element position tracking (continuously tracks during smooth scroll & user scroll)
      const el = activeElRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const prev = lastRectRef.current;
        if (!prev || 
            Math.abs(prev.top - rect.top) > 0.5 || 
            Math.abs(prev.left - rect.left) > 0.5 ||
            Math.abs(prev.width - rect.width) > 0.5 || 
            Math.abs(prev.height - rect.height) > 0.5) {
          
          lastRectRef.current = rect;
          const vw = window.innerWidth;
          const vh = window.innerHeight;

          if (rect.width > 0 && rect.height > 0) {
            setHighlight({
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            });

            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            setTargetPos({ x: cx, y: cy });

            setTooltipPos(calcTooltipPos(rect, vw, vh));
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(animFrameRef.current); };
  }, [targetPos.x, targetPos.y]);

  // ── Apply a step — switch mode + tab, trigger subTab if needed, find element, and scroll smoothly ──
  const applyStep = useCallback((idx) => {
    const s = DEMO_STEPS[idx];
    if (!s) return;

    // Automatically synchronize mode (Smart Hands-Free vs Advanced)
    if (s.mode === 'smart') {
      setIsSmartPlanner(true);
    } else if (s.mode === 'advanced') {
      setIsSmartPlanner(false);
    }

    setActiveTab(s.tab);

    // Give React + DOM time to re-render the tab and mode
    setTimeout(() => {
      // If there's a subtab button (e.g. Future Lab tabs), click it to open the view
      if (s.subTabBtn) {
        const subBtn = document.querySelector(s.subTabBtn);
        if (subBtn) {
          subBtn.click();
        }
      }

      // Small delay after clicking subTab to allow sub-card to mount
      setTimeout(() => {
        const el = document.querySelector(s.selector) || document.querySelector(`#nav-tab-${s.tab}`);
        if (!el) return;

        activeElRef.current = el;
        const rect = el.getBoundingClientRect();
        lastRectRef.current = rect;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        setTargetPos({ x: cx, y: cy });
        setHighlight({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
        setTooltipPos(calcTooltipPos(rect, vw, vh));

        // Smoothly scroll the element into center view
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }, 100);
    }, 180);
  }, [setActiveTab, setIsSmartPlanner]);

  // ── Initial step ─────────────────────────────────────
  useEffect(() => { 
    applyStep(0); 
  }, []); // eslint-disable-line

  const handleNext = useCallback(() => {
    clearInterval(intervalRef.current);
    const next = stepIdx + 1;
    if (next >= DEMO_STEPS.length) { onStop(); return; }
    setStepIdx(next);
    applyStep(next);
  }, [stepIdx, applyStep, onStop]);

  const handlePrev = useCallback(() => {
    clearInterval(intervalRef.current);
    const prev = Math.max(0, stepIdx - 1);
    setStepIdx(prev);
    applyStep(prev);
  }, [stepIdx, applyStep]);

  // ── Auto-advance timer ──────────────────────────────────────
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setStepIdx(prev => {
        const next = prev + 1;
        if (next >= DEMO_STEPS.length) { 
          clearInterval(intervalRef.current); 
          onStop(); 
          return prev; 
        }
        applyStep(next);
        return next;
      });
    }, STEP_DURATION_MS);
    return () => clearInterval(intervalRef.current);
  }, [paused, applyStep, onStop]);

  // ── Keyboard Navigation Listener (Space, Arrows, Esc) ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        return;
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setPaused(p => !p);
      } else if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onStop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onStop]);

  const progress = ((stepIdx + 1) / DEMO_STEPS.length) * 100;
  const isSmartStep = step?.mode === 'smart';

  // Arrow direction based on placement
  const arrowStyle = (placement) => {
    const base = {
      position: 'absolute',
      width: 0, height: 0,
      pointerEvents: 'none',
    };
    const color = isSmartStep ? 'rgba(5, 150, 105, 0.35)' : 'rgba(15, 23, 42, 0.35)';
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
            border: isSmartStep ? '2.5px solid rgba(5, 150, 105, 0.95)' : '2.5px solid rgba(15, 23, 42, 0.95)',
            boxShadow: isSmartStep 
              ? '0 0 0 4px rgba(5, 150, 105, 0.18), 0 0 26px rgba(5, 150, 105, 0.35)' 
              : '0 0 0 4px rgba(15, 23, 42, 0.18), 0 0 26px rgba(15, 23, 42, 0.35)',
            pointerEvents: 'none',
            zIndex: 9997,
            animation: 'demoPulse 1.8s ease-in-out infinite',
            transition: 'top 0.1s linear, left 0.1s linear, width 0.15s ease, height 0.15s ease',
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
          filter: isSmartStep ? 'drop-shadow(0 3px 8px rgba(5,150,105,0.5))' : 'drop-shadow(0 3px 8px rgba(15,23,42,0.4))',
        }}
      >
        <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
          <path d="M7 17V5a2 2 0 0 1 4 0v7"   stroke={isSmartStep ? '#059669' : '#0f172a'} strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M11 11V9a2 2 0 0 1 4 0v3"   stroke={isSmartStep ? '#059669' : '#0f172a'} strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M15 12v-1a2 2 0 0 1 4 0v2"  stroke={isSmartStep ? '#059669' : '#0f172a'} strokeWidth="2.2" strokeLinecap="round"/>
          <path d="M19 13a2 2 0 0 1 4 0v5c0 4.5-3 9-9 9s-7-4.5-7-9v-3" stroke={isSmartStep ? '#059669' : '#0f172a'} strokeWidth="2.2" strokeLinecap="round"/>
        </svg>
        {/* Ripple */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 24, height: 24, borderRadius: '50%',
          background: isSmartStep ? 'rgba(5,150,105,0.22)' : 'rgba(15,23,42,0.18)',
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
            border: isSmartStep ? '1.5px solid rgba(5,150,105,0.35)' : '1.5px solid rgba(15,23,42,0.3)',
            borderRadius: '16px',
            padding: '1rem 1.2rem',
            boxShadow: '0 16px 40px rgba(0,0,0,0.14), 0 4px 14px rgba(5,150,105,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            animation: 'tooltipFadeIn 0.28s cubic-bezier(0.16,1,0.3,1) forwards',
          }}
        >
          {/* Arrow pointing to the element */}
          <div style={arrowStyle(tooltipPos.placement)} />

          {/* Header row: phase badge + step counter */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                background: isSmartStep ? 'rgba(5,150,105,0.12)' : 'rgba(15,23,42,0.08)',
                color: isSmartStep ? '#047857' : '#0f172a',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '6px',
                border: isSmartStep ? '1px solid rgba(5,150,105,0.25)' : '1px solid rgba(15,23,42,0.15)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {isSmartStep ? <Sparkles size={11} /> : <Sliders size={11} />}
                {step?.phase}
              </span>
            </div>

            <span style={{
              background: 'rgba(0,0,0,0.04)',
              color: '#64748b',
              fontSize: '0.68rem',
              fontWeight: 750,
              padding: '2px 7px',
              borderRadius: '9999px',
            }}>
              Step {stepIdx + 1} of {DEMO_STEPS.length}
            </span>
          </div>

          {/* Step Title */}
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25 }}>
            {step?.label}
          </div>

          {/* One-liner description */}
          <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.55, fontWeight: 500 }}>
            {step?.desc}
          </div>

          {/* Progress bar */}
          <div style={{ height: '4px', background: 'rgba(0,0,0,0.06)', borderRadius: '9999px', overflow: 'hidden', marginTop: '2px' }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: isSmartStep 
                ? 'linear-gradient(90deg, #059669, #10b981)' 
                : 'linear-gradient(90deg, #0f172a, #334155)',
              borderRadius: '9999px',
              transition: 'width 0.4s ease',
            }} />
          </div>

          {/* Controls row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
              {paused ? '⏸ Paused' : `⏱ ${STEP_DURATION_MS / 1000}s / step`}
            </span>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {[
                { label: 'Prev', icon: <SkipBack size={12} />, onClick: handlePrev, color: '#334155', disabled: stepIdx === 0 },
                { label: paused ? 'Resume' : 'Pause', icon: paused ? <Play size={12} /> : <PauseIcon size={12} />, onClick: () => setPaused(p => !p), color: paused ? '#047857' : '#334155', bg: paused ? 'rgba(5,150,105,0.1)' : '#fff' },
                { label: 'Next', icon: <SkipForward size={12} />, onClick: handleNext, color: '#334155' },
                { label: 'Exit', icon: <X size={12} />, onClick: onStop, color: '#be123c', bg: 'rgba(225,29,72,0.07)', border: 'rgba(225,29,72,0.3)' },
              ].map(btn => (
                <button
                  key={btn.label}
                  onClick={btn.onClick}
                  disabled={btn.disabled}
                  style={{
                    padding: '0.32rem 0.6rem',
                    borderRadius: '8px',
                    border: `1px solid ${btn.border || 'rgba(0,0,0,0.12)'}`,
                    background: btn.bg || '#fff',
                    color: btn.color,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: btn.disabled ? 'not-allowed' : 'pointer',
                    opacity: btn.disabled ? 0.4 : 1,
                    display: 'flex', alignItems: 'center', gap: '3px',
                  }}
                >
                  {btn.icon}{btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Keyboard shortcut hint legend */}
          <div style={{
            fontSize: '0.66rem',
            color: '#64748b',
            background: 'rgba(0,0,0,0.03)',
            borderRadius: '6px',
            padding: '3px 8px',
            textAlign: 'center',
            marginTop: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: 600
          }}>
            <span><kbd style={{ background: '#e2e8f0', padding: '1px 4px', borderRadius: '3px' }}>Space</kbd> Pause</span>
            <span><kbd style={{ background: '#e2e8f0', padding: '1px 4px', borderRadius: '3px' }}>←</kbd>/<kbd style={{ background: '#e2e8f0', padding: '1px 4px', borderRadius: '3px' }}>→</kbd> Prev/Next</span>
            <span><kbd style={{ background: '#e2e8f0', padding: '1px 4px', borderRadius: '3px' }}>Esc</kbd> Exit</span>
          </div>
        </div>
      )}

      {/* ── Top shimmer bar ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '3px',
        background: isSmartStep 
          ? 'linear-gradient(90deg, #059669, #10b981, #0284c7, #10b981, #059669)'
          : 'linear-gradient(90deg, #0f172a, #334155, #059669, #334155, #0f172a)',
        backgroundSize: '300% 100%',
        animation: 'demoBarShimmer 2.5s linear infinite',
        zIndex: 10000,
      }} />
    </>
  );
};
