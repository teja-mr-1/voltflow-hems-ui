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
  Lock
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
    addAuditLog
  } = useEnergy();

  const handleSliderChange = (key, value) => {
    setUserLimits(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem' }}>Priorities, Thresholds & System Override Controls</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Set your non-negotiable household requirements, device priority stack, and automation approval preferences
        </p>
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
              <div className="card-subtitle">Immediately stop all background schedule shifts and freeze device states</div>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            When activated, VoltFlow will suspend automated grid response, price optimization, and EV charge shifts until the timer expires or you resume.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
              <div className="card-subtitle">Bypass grid price limits and immediately charge EV / heat home at max rate</div>
            </div>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            For unexpected journeys or severe weather: forces EV chargers and heating appliances to full power regardless of current grid tariff.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
        <div className="glass-card col-span-5">
          <div className="card-header">
            <div>
              <div className="card-title">
                <ShieldCheck size={18} color="var(--primary-emerald)" /> Automation Approval Strategy
              </div>
              <div className="card-subtitle">Choose how much autonomy you grant to VoltFlow HEMS</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              {
                id: 'auto',
                title: 'Automatic Control (Recommended)',
                desc: 'AI automatically shifts devices to low-cost grid windows while guaranteeing deadlines.',
                icon: ShieldCheck,
                badge: 'Hands-Free'
              },
              {
                id: 'approval',
                title: 'Approval-Based Control',
                desc: 'App notifies you before significant schedule changes; requires tap to confirm.',
                icon: CheckCircle2,
                badge: 'Prompt First'
              },
              {
                id: 'recommendation',
                title: 'Recommendations Only',
                desc: 'Displays cost-saving suggestions only. Devices remain under manual control.',
                icon: Lock,
                badge: 'Advisory'
              },
            ].map(strategy => (
              <div 
                key={strategy.id}
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
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {strategy.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Non-Negotiable Limits & Sliders */}
        <div className="glass-card col-span-7">
          <div className="card-header">
            <div>
              <div className="card-title">
                <Sliders size={18} color="var(--battery-cyan)" /> User Non-Negotiable Limits & Comfort Thresholds
              </div>
              <div className="card-subtitle">Safety floors the system will never breach during cost optimization</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* EV Minimum SOC Floor Slider */}
            <div>
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
              <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
                If EV battery falls below {userLimits.minEvSoc}%, it will charge immediately regardless of electricity price.
              </div>
            </div>

            {/* Departure Deadline Input */}
            <div className="form-group">
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
              <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
                Vehicle is guaranteed to reach 85% target battery level before this time every morning.
              </div>
            </div>

            {/* Indoor Temperature Band Slider */}
            <div>
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
              <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
                Heat pump pre-heats house during cheap tariff hours within this flex range.
              </div>
            </div>

            {/* Priority Device Rank Stack */}
            <div>
              <div className="form-label" style={{ marginBottom: '0.5rem' }}>Device Priority Stack (Order during Grid Load Rationing)</div>
              <div className="priority-list">
                {[
                  { rank: 1, name: 'Tesla EV Charger (Commute Ready)', tag: 'Priority 1' },
                  { rank: 2, name: 'Powerwall Home Battery Storage', tag: 'Priority 2' },
                  { rank: 3, name: 'Daikin Heat Pump HVAC', tag: 'Priority 3' },
                  { rank: 4, name: 'Bosch Smart Dishwasher / Washer', tag: 'Priority 4' },
                ].map(item => (
                  <div key={item.rank} className="priority-item">
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
