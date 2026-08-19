import React, { useState } from 'react';
import { useEnergy } from '../context/EnergyContext';
import { 
  Zap, 
  Pause, 
  Flame, 
  User, 
  WifiOff, 
  Bell, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Clock,
  Moon,
  Play,
  Sparkles,
  Sliders
} from 'lucide-react';

export const Header = ({ onOpenOverrideModal, onOpenEmergencyModal, onStartDemo, isDemoMode }) => {
  const { 
    viewMode,
    setViewMode,
    gridStatus, 
    setGridStatus, 
    isGlobalPaused, 
    pauseTimer, 
    isEmergencyBoost, 
    boostTimer, 
    controlMode, 
    userProfile, 
    setUserProfile, 
    notifications,
    isOfflineFallbackMode,
    isLiveSimulationActive,
    setIsLiveSimulationActive,
    isAutopilotDemo,
    setIsAutopilotDemo,
    isKnowEverythingMode,
    toggleKnowEverythingMode,
    isSmartPlanner,
    setIsSmartPlanner
  } = useEnergy();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Quick toggle grid signal for testing/demo purposes
  const cycleGridStatus = () => {
    if (gridStatus === 'green') setGridStatus('yellow');
    else if (gridStatus === 'yellow') setGridStatus('red');
    else setGridStatus('green');
  };

  return (
    <header className="top-header">
      {/* Brand Identity & Version */}
      <div className="brand-section">
        <div className="brand-logo-icon">
          <Zap size={22} />
        </div>
        <div>
          <div className="brand-title">
            VoltFlow <span className="brand-badge">HEMS OS v2.4</span>
          </div>
        </div>
      </div>

      <div className="header-actions">
        {/* Offline Fallback Banner Indicator */}
        {isOfflineFallbackMode && (
          <div className="pill-badge amber" style={{ border: '1px solid rgba(245, 158, 11, 0.4)', padding: '4px 10px' }}>
            <WifiOff size={13} /> Safe Fallback Mode Active
          </div>
        )}

        {/* Smart Control vs Advanced View Segment Switcher */}
        <div style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.04)',
          padding: '3px',
          borderRadius: '12px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)'
        }}
        data-explain-title="Control Mode Switcher"
        data-explain="Toggle between Smart Hands-Free AI Control and Advanced Technical View."
        >
          <button
            id="btn-mode-smart"
            onClick={() => setIsSmartPlanner(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '0.35rem 0.75rem',
              borderRadius: '9px',
              border: 'none',
              background: isSmartPlanner ? '#059669' : 'transparent',
              color: isSmartPlanner ? '#ffffff' : '#64748b',
              fontSize: '0.78rem',
              fontWeight: 750,
              cursor: 'pointer',
              boxShadow: isSmartPlanner ? '0 2px 8px rgba(5, 150, 105, 0.25)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={13} color={isSmartPlanner ? '#ffffff' : '#059669'} />
            <span>⚡ Smart Hands-Free</span>
          </button>

          <button
            id="btn-mode-advanced"
            onClick={() => setIsSmartPlanner(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '0.35rem 0.75rem',
              borderRadius: '9px',
              border: 'none',
              background: !isSmartPlanner ? '#0f172a' : 'transparent',
              color: !isSmartPlanner ? '#ffffff' : '#64748b',
              fontSize: '0.78rem',
              fontWeight: 750,
              cursor: 'pointer',
              boxShadow: !isSmartPlanner ? '0 2px 8px rgba(15, 23, 42, 0.2)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Sliders size={13} color={!isSmartPlanner ? '#ffffff' : '#64748b'} />
            <span>⚙️ Advanced View</span>
          </button>
        </div>

        {/* Traffic Light Grid Condition Pill */}
        <div 
          className={`grid-signal-pill ${gridStatus}`}
          onClick={cycleGridStatus}
          title="Click to cycle local grid condition state (Green -> Yellow -> Red)"
          data-explain-title="Grid Price Signal"
          data-explain="Shows if electricity is cheap, normal, or expensive right now."
        >
          <span className={`signal-dot ${gridStatus}`} />
          <span>
            {gridStatus === 'green' && 'Local Grid: Low Demand'}
            {gridStatus === 'yellow' && 'Local Grid: Moderate Peak'}
            {gridStatus === 'red' && 'Local Grid: High Congestion'}
          </span>
          <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>(Click to cycle)</span>
        </div>

        {/* ▶ Auto Demo Mode Button */}
        <button
          onClick={isDemoMode ? undefined : onStartDemo}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            border: isDemoMode ? '1.5px solid rgba(5,150,105,0.5)' : '1.5px solid rgba(5,150,105,0.35)',
            background: isDemoMode ? 'rgba(5,150,105,0.14)' : 'rgba(5,150,105,0.08)',
            color: '#047857',
            fontSize: '0.8rem',
            fontWeight: 750,
            cursor: isDemoMode ? 'default' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isDemoMode ? '0 0 12px rgba(5,150,105,0.2)' : 'none'
          }}
          title="Start guided auto-demo tour"
          data-explain-title="Auto Demo"
          data-explain="Plays an automatic guided tour showing how the app works."
        >
          <Play size={14} fill={isDemoMode ? '#059669' : 'none'} />
          {isDemoMode ? 'Demo Running…' : '▶ Auto Demo'}
        </button>

        {/* 💡 Know Everything Mode Button */}
        <button
          onClick={toggleKnowEverythingMode}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '0.5rem 0.95rem',
            borderRadius: '10px',
            border: isKnowEverythingMode ? '1.5px solid #059669' : '1.5px solid rgba(5,150,105,0.35)',
            background: isKnowEverythingMode ? '#059669' : 'rgba(5,150,105,0.08)',
            color: isKnowEverythingMode ? '#ffffff' : '#047857',
            fontSize: '0.8rem',
            fontWeight: 750,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isKnowEverythingMode ? '0 0 14px rgba(5,150,105,0.4)' : 'none'
          }}
          title="Click to toggle interactive universal explainer inspector"
          data-explain-title="Simple Explainer"
          data-explain="Shows quick easy-to-understand explanations on hover."
        >
          <Sparkles size={14} color={isKnowEverythingMode ? '#ffffff' : '#059669'} />
          {isKnowEverythingMode ? '💡 Know Everything [ ON ]' : '💡 Know Everything Mode'}
        </button>

        {/* Notifications Dropdown Drawer */}
        <div style={{ position: 'relative' }}>
          <button 
            className="close-btn"
            style={{ position: 'relative', width: '36px', height: '36px' }}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--danger-rose)',
                boxShadow: '0 0 6px var(--danger-rose)'
              }} />
            )}
          </button>

          {showNotifications && (
            <div className="glass-card" style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '340px',
              zIndex: 500,
              padding: '1rem',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              background: '#ffffff',
              boxShadow: '0 10px 30px rgba(0,0,0,0.12)'
            }}>
              <div className="card-header" style={{ marginBottom: '0.75rem' }}>
                <span className="card-title" style={{ fontSize: '0.9rem', color: '#0f172a' }}>System Alerts & Guarantees</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{notifications.length} alerts</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{
                    padding: '0.65rem',
                    borderRadius: '8px',
                    background: '#faf8f4',
                    border: '1px solid rgba(0,0,0,0.06)',
                    borderLeft: `3px solid ${n.type === 'warning' ? 'var(--solar-amber)' : n.type === 'success' ? 'var(--primary-emerald)' : 'var(--battery-cyan)'}`
                  }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {n.type === 'warning' ? <AlertTriangle size={12} color="var(--solar-amber)" /> : <Info size={12} color="var(--battery-cyan)" />}
                      {n.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{n.message}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-subtle)', marginTop: '4px' }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
