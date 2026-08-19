import React, { useState } from 'react';
import { useEnergy } from '../../context/EnergyContext';
import { 
  WifiOff, 
  ShieldAlert, 
  Users, 
  MessageSquare, 
  Send
} from 'lucide-react';

export const ReliabilityView = () => {
  const { 
    isOfflineFallbackMode, 
    setIsOfflineFallbackMode, 
    userProfile, 
    setUserProfile,
    addNotification,
    addAuditLog 
  } = useEnergy();

  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const toggleFallbackSimulator = () => {
    const nextState = !isOfflineFallbackMode;
    setIsOfflineFallbackMode(nextState);
    if (nextState) {
      addNotification('warning', 'Offline Fallback Simulated', 'Internet connection severed. VoltFlow switched to autonomous local solar & safe battery defaults.');
      addAuditLog('Triggered simulated network disconnect fallback mode.');
    } else {
      addNotification('success', 'Connection Restored', 'Cloud hand-shake verified. Resumed normal dynamic schedule optimization.');
      addAuditLog('Restored online grid sync from simulated fallback.');
    }
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSubmitted(true);
    addNotification('info', 'Feedback Received', 'Thank you. Your schedule adjustment report was logged for AI routine tuning.');
    setTimeout(() => {
      setFeedbackText('');
      setFeedbackSubmitted(false);
    }, 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem' }}>Reliability, Safe Fallback & Household Support</h2>
      </div>

      {/* Network Disconnection / Internet Loss Safe Fallback Simulator Banner */}
      <div 
        className="glass-card" 
        data-demo="reliability-offline-card" 
        data-explain-title="Offline Outage Simulator"
        data-explain="Test how VoltFlow protects your home during internet or power network outages using local hardware memory."
        style={{
          background: isOfflineFallbackMode ? 'rgba(217, 119, 6, 0.1)' : '#ffffff',
          border: `1px solid ${isOfflineFallbackMode ? 'rgba(217, 119, 6, 0.4)' : 'rgba(0, 0, 0, 0.1)'}`
        }}
      >
        <div className="card-header">
          <div>
            <div className="card-title" style={{ color: isOfflineFallbackMode ? '#b45309' : '#0f172a' }}>
              <WifiOff size={20} /> Autonomous Offline Fallback Simulator
            </div>
          </div>
          <button 
            className={`btn-secondary ${isOfflineFallbackMode ? 'active' : ''}`} 
            onClick={toggleFallbackSimulator}
            data-explain-title="Toggle Internet Loss Test"
            data-explain="Simulates an internet disconnect to prove your home stays warm and battery continues charging safely."
          >
            {isOfflineFallbackMode ? 'Restore Normal Connection' : 'Test Internet / Signal Loss Fallback'}
          </button>
        </div>

        {isOfflineFallbackMode && (
          <div style={{ padding: '1rem', background: '#ffffff', borderRadius: '10px', marginTop: '0.5rem', border: '1px solid rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={16} /> Offline Safe Mode Active — Local Solar & Safety Defaults
            </div>
            <ul style={{ fontSize: '0.825rem', color: '#334155', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '1.2rem', fontWeight: 500 }}>
              <li><strong>Local Solar Priority:</strong> EV and battery continue charging directly from roof PV solar without needing cloud API.</li>
              <li><strong>Safe Hardware Defaults:</strong> Heat pump reverts to 20.0°C baseline safety thermostat setting.</li>
              <li><strong>Critical Requirements Preserved:</strong> EV battery floor ({25}%) remains protected by local wallbox hardware controller.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Main Grid: Multi-User Profiles & Problem Feedback Widget */}
      <div className="grid-cols-12">
        {/* Household Multi-User Profiles */}
        <div 
          className="glass-card col-span-6" 
          data-demo="reliability-profiles-card"
          data-explain-title="Household Access Tiers"
          data-explain="Assign custom permission levels for homeowners, family members, shared EV drivers, or renting tenants."
        >
          <div className="card-header">
            <div>
              <div className="card-title">
                <Users size={18} color="var(--primary-emerald)" /> Household Profiles & Access Tiers
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { id: 'family', name: 'Primary Resident / Admin', role: 'Full Control', explain: 'Full access to all hardware limits, savings payouts, and automated rules.' },
              { id: 'shared_ev', name: 'Shared EV Driver Profile', role: 'EV Charging Only', explain: 'Can plug in and set EV departure times without accessing heating or battery controls.' },
              { id: 'landlord', name: 'Guest / Tenant View', role: 'Read Only', explain: 'Read-only dashboard view showing current temperatures and energy usage.' },
            ].map(profile => (
              <div 
                key={profile.id}
                data-explain-title={profile.name}
                data-explain={profile.explain}
                onClick={() => setUserProfile(profile.id)}
                style={{
                  padding: '0.85rem',
                  borderRadius: '10px',
                  border: `1px solid ${userProfile === profile.id ? 'rgba(5, 150, 105, 0.4)' : 'rgba(0, 0, 0, 0.08)'}`,
                  background: userProfile === profile.id ? 'rgba(5, 150, 105, 0.08)' : '#ffffff',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700 }}>
                  <span style={{ color: userProfile === profile.id ? '#047857' : '#0f172a' }}>{profile.name}</span>
                  <span className="pill-badge green">{profile.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback & Schedule Problem Report Widget */}
        <div 
          className="glass-card col-span-6"
          data-explain-title="Schedule Feedback Reporter"
          data-explain="Report unexpected schedule conflicts or comfort issues so VoltFlow AI can improve your future routine."
        >
          <div className="card-header">
            <div>
              <div className="card-title">
                <MessageSquare size={18} color="var(--battery-cyan)" /> Schedule Feedback & Problem Reporting
              </div>
            </div>
          </div>

          <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div className="form-group">
              <label className="form-label">Feedback Category</label>
              <select className="form-select">
                <option>EV wasn't charged enough for unexpected trip</option>
                <option>Room felt too cold / warm during thermal flex window</option>
                <option>Washing machine finished too late</option>
                <option>General system query or suggestion</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Explain what happened</label>
              <textarea 
                className="form-input" 
                rows="3" 
                placeholder="Example: I had to leave early at 06:00 AM instead of 07:30 AM..."
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
              />
            </div>

            <button 
              className="btn-primary" 
              type="submit" 
              data-explain-title="Submit Routine Feedback"
              data-explain="Sends your report to the local learning engine to adapt tomorrow's schedule."
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Send size={15} /> {feedbackSubmitted ? 'Feedback Sent!' : 'Submit Schedule Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
