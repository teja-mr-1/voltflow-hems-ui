import React from 'react';
import { useEnergy } from '../../context/EnergyContext';
import { 
  Sliders, 
  Pause, 
  Flame, 
  ShieldCheck, 
  GripVertical, 
  Battery, 
  Thermometer, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  Lock,
  User
} from 'lucide-react';

export const ControlsView = ({ onOpenOverrideModal, onOpenEmergencyModal }) => {
  const { 
    controlMode, 
    setControlMode, 
    userLimits, 
    setUserLimits, 
    isGlobalPaused, 
    pauseTimer, 
    toggleGlobalPause,
    isEmergencyBoost,
    boostTimer,
    toggleEmergencyBoost,
    userProfile,
    setUserProfile,
    addAuditLog
  } = useEnergy();

  const handleSliderChange = (key, value) => {
    setUserLimits(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem' }}>Manual Overrides & Hardware Limits</h2>
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>Take manual control: pause automation, force emergency charging, and set your non-negotiable comfort limits.</div>
      </div>

      {/* Emergency & Pause Quick Action Hero Row */}
      <div className="grid-cols-12">
        <div 
          className="glass-card col-span-6" 
          data-explain-title="Pause Settings Card"
          data-explain="Temporarily freezes all background adjustments for 1 hour."
          style={{ background: isGlobalPaused ? 'rgba(245, 158, 11, 0.12)' : undefined, borderColor: isGlobalPaused ? 'var(--solar-amber)' : undefined }}
        >
          <div className="card-header">
            <div>
              <div className="card-title" style={{ color: 'var(--solar-amber)' }}>
                <Pause size={20} /> Instant Global Override & System Pause
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Status: {isGlobalPaused ? `PAUSED (${Math.floor(pauseTimer / 60)} mins remaining)` : 'AUTOMATION ACTIVE'}
            </span>
            <button 
              className={`btn-override ${isGlobalPaused ? 'active' : ''}`}
              onClick={onOpenOverrideModal}
              data-explain-title="Pause Button"
              data-explain="Click to freeze automatic settings."
              style={{ padding: '0.6rem 1.25rem' }}
            >
              <Pause size={16} /> {isGlobalPaused ? 'Modify / Resume Automation' : 'Pause All Auto-Changes'}
            </button>
          </div>
        </div>

        <div 
          className="glass-card col-span-6" 
          data-explain-title="Emergency Boost Card"
          data-explain="Supercharges EV and heating at full power immediately."
          style={{ background: isEmergencyBoost ? 'rgba(244, 63, 94, 0.12)' : undefined, borderColor: isEmergencyBoost ? 'var(--danger-rose)' : undefined }}
        >
          <div className="card-header">
            <div>
              <div className="card-title" style={{ color: 'var(--danger-rose)' }}>
                <Flame size={20} /> Emergency Priority High-Power Boost
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Status: {isEmergencyBoost ? `BOOST ACTIVE (${Math.floor(boostTimer / 60)} mins remaining)` : 'STANDBY'}
            </span>
            <button 
              className={`btn-emergency ${isEmergencyBoost ? 'active' : ''}`}
              onClick={onOpenEmergencyModal}
              data-explain-title="Boost Button"
              data-explain="Click to run full power boost immediately."
              style={{ padding: '0.6rem 1.25rem' }}
            >
              <Flame size={16} /> {isEmergencyBoost ? 'Stop Emergency Boost' : 'Trigger Emergency Boost'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Control Strategy & User Preference Threshold Sliders */}
      <div className="grid-cols-12">
        {/* Control Strategy Mode Chooser */}
        <div 
          className="glass-card col-span-5" 
          data-demo="control-strategy-card"
          data-explain-title="Automation Strategy"
          data-explain="Choose how independent VoltFlow is: 100% autonomous, ask for permission before shifting heavy appliances, or simple recommendations."
        >
          <div className="card-header">
            <div>
              <div className="card-title">
                <ShieldCheck size={18} color="var(--primary-emerald)" /> Automation Approval Strategy
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              {
                id: 'auto',
                title: 'Automatic Control (Recommended)',
                icon: ShieldCheck,
                badge: 'Hands-Free',
                explain: 'VoltFlow automatically manages all charging, solar storage, and heating in the background.'
              },
              {
                id: 'approval',
                title: 'Approval-Based Control',
                icon: CheckCircle2,
                badge: 'Prompt First',
                explain: 'VoltFlow sends a quick phone prompt before shifting heavy appliances like EV charging.'
              },
              {
                id: 'recommendation',
                title: 'Recommendations Only',
                icon: Lock,
                badge: 'Advisory',
                explain: 'VoltFlow only gives tips and notifications; you turn appliances on or off manually.'
              },
            ].map(strategy => (
              <div 
                key={strategy.id}
                data-explain-title={strategy.title}
                data-explain={strategy.explain}
                onClick={() => {
                  setControlMode(strategy.id);
                  addAuditLog(`Switched control mode to ${strategy.title}`);
                }}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  border: `1px solid ${controlMode === strategy.id ? 'var(--primary-emerald)' : 'var(--border-glass)'}`,
                  background: controlMode === strategy.id ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: controlMode === strategy.id ? 'var(--primary-emerald)' : 'var(--text-main)' }}>
                    {strategy.title}
                  </div>
                  <span className={`pill-badge ${controlMode === strategy.id ? 'green' : 'amber'}`}>{strategy.badge}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* User Non-Negotiable Limits & Sliders */}
        <div 
          className="glass-card col-span-7" 
          data-demo="control-sliders-card"
          data-explain-title="Your Minimum Comfort Rules"
          data-explain="Set unbreakable boundaries: guarantee your EV always has driving range, set your home temperature, and pick appliance priority order."
        >
          <div className="card-header">
            <div>
              <div className="card-title">
                <Sliders size={18} color="var(--battery-cyan)" /> User Non-Negotiable Limits & Comfort Thresholds
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Flex-Deadline Grid-Balancing Mode Switch */}
            <div 
              className="switch-row" 
              data-explain-title="Flex-Deadline Smart Mode"
              data-explain="When ON, VoltFlow automatically times your car charging to soak up free solar and cheap night electricity before your morning departure."
              style={{
                background: userLimits.flexGridMode ? 'rgba(5, 150, 105, 0.08)' : 'rgba(0,0,0,0.02)',
                padding: '0.85rem',
                borderRadius: '12px',
                border: userLimits.flexGridMode ? '1px solid rgba(5, 150, 105, 0.3)' : '1px solid rgba(0,0,0,0.06)'
              }}
            >
              <div>
                <div className="switch-label-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: userLimits.flexGridMode ? '#047857' : '#0f172a' }}>
                  ⚡ Flex-Deadline Grid-Balancing Mode
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                  Disregards fixed start times. Automatically dispatches EV & heat pump charging during low grid demand & price dips anytime before deadline.
                </div>
              </div>
              <div 
                className={`switch-toggle ${userLimits.flexGridMode ? 'active' : ''}`}
                onClick={() => {
                  const nextVal = !userLimits.flexGridMode;
                  handleSliderChange('flexGridMode', nextVal);
                  addAuditLog(`Toggled Flex-Deadline Grid-Balancing Mode: ${nextVal ? 'ENABLED' : 'DISABLED'}`);
                }}
              >
                <div className="switch-handle" />
              </div>
            </div>

            {/* EV Minimum SOC Floor Slider */}
            <div 
              data-explain-title="Minimum Car Battery Floor"
              data-explain="Guarantees your EV battery never drops below this percentage so you can always drive in an emergency."
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Battery size={15} color="var(--battery-cyan)" /> Minimum EV Battery Reserve Floor
                </span>
                <span style={{ fontWeight: 700, color: 'var(--battery-cyan)', fontSize: '0.9rem' }}>
                  {userLimits.minEvSoc}% (Immediate Reserve)
                </span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="50" 
                value={userLimits.minEvSoc}
                onChange={e => handleSliderChange('minEvSoc', parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--battery-cyan)' }}
              />
            </div>

            {/* Departure Deadline Input */}
            <div 
              className="form-group"
              data-explain-title="Morning Departure Time"
              data-explain="The exact time you leave home in the morning. VoltFlow guarantees your car is charged to 100% by this time."
            >
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={15} color="var(--solar-amber)" /> Default EV Departure Deadline
              </label>
              <input 
                type="time" 
                className="form-input" 
                value={userLimits.departureTime}
                onChange={e => handleSliderChange('departureTime', e.target.value)}
                style={{ width: '200px' }}
              />
            </div>

            {/* Indoor Temperature Band Slider */}
            <div
              data-explain-title="Room Temperature Comfort Band"
              data-explain="The warmest and coolest indoor temperatures you find comfortable. VoltFlow keeps your rooms within this exact range."
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Thermometer size={15} color="var(--danger-rose)" /> Acceptable Indoor Temperature Comfort Band
                </span>
                <span style={{ fontWeight: 700, color: 'var(--solar-amber)', fontSize: '0.9rem' }}>
                  {(userLimits.targetTemp - userLimits.tempFlexibility).toFixed(1)}°C — {(userLimits.targetTemp + userLimits.tempFlexibility).toFixed(1)}°C
                </span>
              </div>
              <input 
                type="range" 
                min="18" 
                max="24" 
                step="0.5"
                value={userLimits.targetTemp}
                onChange={e => handleSliderChange('targetTemp', parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--solar-amber)' }}
              />
            </div>

            {/* Priority Device Rank Stack */}
            <div
              data-explain-title="Appliance Priority Order"
              data-explain="Choose which appliances are most essential to you. Higher ranked appliances stay powered on during grid peak stress."
            >
              <div className="form-label" style={{ marginBottom: '0.5rem' }}>Device Priority Stack (Order during Grid Load Rationing)</div>
              <div className="priority-list">
                {[
                  { rank: 1, name: 'Tesla EV Charger (Commute Ready)', tag: 'Priority 1', explain: 'Highest priority — ensures your car is charged first before anything else.' },
                  { rank: 2, name: 'Powerwall Home Battery Storage', tag: 'Priority 2', explain: 'Second priority — keeps home battery topped up with solar energy.' },
                  { rank: 3, name: 'Daikin Heat Pump HVAC', tag: 'Priority 3', explain: 'Third priority — maintains indoor room warmth and domestic hot water.' },
                  { rank: 4, name: 'Bosch Smart Dishwasher / Washer', tag: 'Priority 4', explain: 'Lowest priority — can be easily delayed by an hour if power is expensive.' },
                ].map(item => (
                  <div 
                    key={item.rank} 
                    className="priority-item"
                    data-explain-title={item.name}
                    data-explain={item.explain}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <GripVertical size={16} color="var(--text-subtle)" />
                      <div className="priority-rank">{item.rank}</div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{item.name}</span>
                    </div>
                    <span className="pill-badge green">{item.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
