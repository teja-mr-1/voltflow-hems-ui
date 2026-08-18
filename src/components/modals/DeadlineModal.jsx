import React, { useState } from 'react';
import { useEnergy } from '../../context/EnergyContext';
import { Clock, Calendar, CheckCircle2 } from 'lucide-react';

export const DeadlineModal = ({ onClose }) => {
  const { userLimits, setUserLimits, addAuditLog, addNotification } = useEnergy();
  const [appliance, setAppliance] = useState('Tesla Wall Connector');
  const [time, setTime] = useState(userLimits.departureTime);
  const [targetSoc, setTargetSoc] = useState(85);

  const handleSave = () => {
    setUserLimits(prev => ({ ...prev, departureTime: time }));
    addAuditLog(`Set completion deadline for ${appliance} to ${time} AM (Target ${targetSoc}%)`);
    addNotification('success', 'Deadline Configured', `VoltFlow guaranteed ${appliance} ready by ${time} AM.`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '460px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary-emerald)' }}>
            <Clock size={20} />
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Set Appliance Completion Deadline</span>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Select Hardware Appliance</label>
            <select className="form-select" value={appliance} onChange={e => setAppliance(e.target.value)}>
              <option>Tesla Wall Connector (EV)</option>
              <option>Bosch Smart Dishwasher</option>
              <option>Miele Tumble Dryer</option>
              <option>Daikin Thermal Hot Water Storage</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Target Completion Time</label>
            <input className="form-input" type="time" value={time} onChange={e => setTime(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Required Target State / SOC (%)</label>
            <input className="form-input" type="number" min="50" max="100" value={targetSoc} onChange={e => setTargetSoc(e.target.value)} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button className="btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn-primary" onClick={handleSave}>
              <CheckCircle2 size={16} /> Confirm EV-Ready Guarantee Deadline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
