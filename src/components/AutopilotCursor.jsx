import React, { useEffect, useState } from 'react';
import { useEnergy } from '../context/EnergyContext';
import { Play, Pause, SkipForward, X, MousePointer, Sparkles } from 'lucide-react';

export const AutopilotCursor = ({ activeTab, setActiveTab }) => {
  const { 
    isAutopilotDemo, 
    setIsAutopilotDemo, 
    autopilotStep, 
    setAutopilotStep,
    viewMode,
    setViewMode,
    gridStatus,
    setGridStatus,
    toggleEmergencyBoost,
    addNotification,
    setDevices
  } = useEnergy();

  const [cursorPos, setCursorPos] = useState({ x: 100, y: 100 });
  const [isClicking, setIsClicking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Tour steps definition for all requirement modules
  const tourSteps = [
    {
      id: 0,
      title: '1. Energy Overview & Power Flow',
      desc: 'Live power flow matrix (Solar -> Storage -> Household -> Grid) & KPI summary.',
      tab: 'overview'
    },
    {
      id: 1,
      title: '2. Hardware Devices Fleet & Wizard',
      desc: 'EV Chargers, Heat Pumps, Powerwalls & 4-Step Add Device wizard modal.',
      tab: 'devices'
    },
    {
      id: 2,
      title: '3. Smart Scheduling & 7-Day Gantt',
      desc: 'Nord Pool tariff forecast curve & Gantt drag-and-drop temporal scheduler.',
      tab: 'scheduling'
    },
    {
      id: 3,
      title: '4. Priorities & User Control Panel',
      desc: 'Emergency High-Power Boost, Global Pause, min EV reserve & temperature band sliders.',
      tab: 'controls'
    },
    {
      id: 4,
      title: '5. Grid Signal & AI Explanations',
      desc: 'Substation traffic light signal (Green/Yellow/Red) with human-readable advice.',
      tab: 'grid'
    },
    {
      id: 5,
      title: '6. Savings, Rewards & EV Guarantee',
      desc: 'Financial payback counter, DSO flexibility rewards & 100% EV departure guarantee badge.',
      tab: 'savings'
    },
    {
      id: 6,
      title: '7. Granular Privacy & DSO Shield',
      desc: 'Zero-knowledge DSO data shield, consent permissions matrix & immutable audit log.',
      tab: 'privacy'
    },
    {
      id: 7,
      title: '8. Offline Fallback & Support',
      desc: 'Internet disconnection safe mode simulator, multi-household profiles & feedback form.',
      tab: 'reliability'
    },
    {
      id: 8,
      title: '9. Future Energy Lab (V2H)',
      desc: 'Vehicle-to-Home bidirectional power flow, community microgrid & market bidding.',
      tab: 'future_lab'
    }
  ];

  const currentStepInfo = tourSteps[autopilotStep] || tourSteps[0];

  // Helper to move hand cursor to a target DOM element or relative position
  const moveCursorToElement = (selectorOrPos) => {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;

    if (typeof selectorOrPos === 'string') {
      const el = document.querySelector(selectorOrPos);
      if (el) {
        const rect = el.getBoundingClientRect();
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
      }
    } else if (selectorOrPos && selectorOrPos.x !== undefined) {
      targetX = selectorOrPos.x;
      targetY = selectorOrPos.y;
    }

    setCursorPos({ x: targetX, y: targetY });
  };

  const triggerClickAnimation = () => {
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 300);
  };

  // Main Autopilot Step Sequence Loop
  useEffect(() => {
    if (!isAutopilotDemo || isPaused) return;

    let timeoutId;

    const stepData = tourSteps[autopilotStep] || tourSteps[0];
    setActiveTab(stepData.tab);
    moveCursorToElement(`.nav-tab#nav-tab-${stepData.tab}`);

    timeoutId = setTimeout(() => {
      triggerClickAnimation();
      addNotification('info', 'Autopilot Tour', `Viewing Hub ${autopilotStep + 1}: ${stepData.title}`);

      // Progress to next step after 4 seconds
      timeoutId = setTimeout(() => {
        setAutopilotStep(prev => (prev + 1) % tourSteps.length);
      }, 4000);
    }, 1200);

    return () => clearTimeout(timeoutId);
  }, [isAutopilotDemo, autopilotStep, isPaused]);

  if (!isAutopilotDemo) return null;

  return (
    <>
      {/* Top Autopilot Banner */}
      <div style={{
        position: 'fixed',
        top: '72px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: '#ffffff',
        padding: '0.85rem 1.5rem',
        borderRadius: '9999px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3), 0 0 20px rgba(5, 150, 105, 0.3)',
        border: '1px solid rgba(5, 150, 105, 0.4)',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        backdropFilter: 'blur(16px)',
        maxWidth: '92%',
        width: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(5, 150, 105, 0.2)',
            border: '1px solid #059669',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            color: '#10b981'
          }}>
            <Sparkles size={16} className="animate-spin" />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Autopilot Guided Demo Mode
              <span className="pill-badge green" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                Step {autopilotStep + 1} of {tourSteps.length}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '1px' }}>
              {currentStepInfo.title} — {currentStepInfo.desc}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
          <button 
            className="btn-secondary" 
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', color: '#ffffff', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? <Play size={13} /> : <Pause size={13} />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>

          <button 
            className="btn-secondary" 
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', color: '#ffffff', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
            onClick={() => setAutopilotStep((autopilotStep + 1) % tourSteps.length)}
          >
            <SkipForward size={13} /> Next
          </button>

          <button 
            className="close-btn" 
            style={{ color: '#ffffff', background: 'rgba(225,29,72,0.2)', border: '1px solid rgba(225,29,72,0.4)', width: 30, height: 30 }}
            onClick={() => setIsAutopilotDemo(false)}
            title="Exit Autopilot Demo"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Floating Animated Hand Cursor Pointer */}
      <div 
        style={{
          position: 'fixed',
          top: cursorPos.y,
          left: cursorPos.x,
          zIndex: 10000,
          pointerEvents: 'none',
          transition: 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : 1})`,
          filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))'
        }}
      >
        {/* Pulsing Emerald Target Ring */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '2px solid #059669',
          background: 'rgba(5, 150, 105, 0.15)',
          animation: 'pulse-target 1.5s ease-in-out infinite'
        }} />

        {/* Hand Cursor Emoji Icon */}
        <div style={{ fontSize: '2rem', userSelect: 'none', transform: 'rotate(-20deg)' }}>
          👉
        </div>

        {/* Cursor Title Tag */}
        <div style={{
          position: 'absolute',
          top: '36px',
          left: '20px',
          background: '#059669',
          color: '#ffffff',
          fontSize: '0.7rem',
          fontWeight: 800,
          padding: '2px 8px',
          borderRadius: '6px',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.4)'
        }}>
          Autopilot Hand Cursor
        </div>
      </div>
    </>
  );
};
