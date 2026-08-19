import React, { useState } from 'react';
import { useEnergy } from '../../context/EnergyContext';
import { Flame, Zap } from 'lucide-react';

export const EmergencyBoostModal = ({ onClose }) => {
  const { isEmergencyBoost, toggleEmergencyBoost } = useEnergy();
  const [boostMins, setBoostMins] = useState(30);

  const handleConfirm = () => {
    toggleEmergencyBoost(boostMins);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--danger-rose)' }}>
            <Flame size={20} />
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Emergency High-Power Boost</span>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="form-group" style={{ marginTop: '0.75rem' }}>
          <label className="form-label">Boost Duration</label>
          <select 
            className="form-select" 
            value={boostMins} 
            onChange={e => setBoostMins(parseInt(e.target.value))}
          >
            <option value={15}>15 Minutes (Quick Top-Up)</option>
            <option value={30}>30 Minutes</option>
            <option value={60}>60 Minutes (Full Max Power)</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-emergency active" style={{ padding: '0.6rem 1.2rem' }} onClick={handleConfirm}>
            {isEmergencyBoost ? 'Stop Emergency Boost' : `Activate ${boostMins}-Min Boost`}
          </button>
        </div>
      </div>
    </div>
  );
};
