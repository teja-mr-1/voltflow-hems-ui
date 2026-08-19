import React, { useState } from 'react';
import { useEnergy } from '../../context/EnergyContext';
import { Pause, Clock, AlertTriangle } from 'lucide-react';

export const OverrideModal = ({ onClose }) => {
  const { isGlobalPaused, toggleGlobalPause } = useEnergy();
  const [durationMins, setDurationMins] = useState(60);

  const handleConfirm = () => {
    toggleGlobalPause(durationMins);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--solar-amber)' }}>
            <Pause size={20} />
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Global Override & System Pause</span>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="form-group" style={{ marginTop: '0.75rem' }}>
          <label className="form-label">Select Pause Duration</label>
          <select 
            className="form-select" 
            value={durationMins} 
            onChange={e => setDurationMins(parseInt(e.target.value))}
          >
            <option value={30}>30 Minutes</option>
            <option value={60}>1 Hour</option>
            <option value={180}>3 Hours</option>
            <option value={480}>8 Hours (Until Morning)</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-override active" style={{ padding: '0.6rem 1.2rem' }} onClick={handleConfirm}>
            {isGlobalPaused ? 'Resume Automation Now' : `Pause for ${durationMins} Mins`}
          </button>
        </div>
      </div>
    </div>
  );
};
