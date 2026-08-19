import React, { useState } from 'react';
import { useEnergy } from '../../context/EnergyContext';
import { 
  ShieldCheck, 
  EyeOff, 
  Lock, 
  Trash2, 
  Download, 
  FileText, 
  Server, 
  AlertOctagon
} from 'lucide-react';

export const PrivacyView = () => {
  const { privacySettings, setPrivacySettings, auditLogs, addAuditLog, addNotification } = useEnergy();
  const [showDeletionConfirm, setShowDeletionConfirm] = useState(false);

  const handleToggle = (key) => {
    setPrivacySettings(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      addAuditLog(`Updated privacy consent for domain: ${key} -> ${updated[key] ? 'GRANTED' : 'REVOKED'}`);
      return updated;
    });
  };

  const handleDataDeletion = () => {
    setShowDeletionConfirm(false);
    addAuditLog('User initiated complete personal data deletion request.');
    addNotification('warning', 'Data Erasure Complete', 'All stored historical routines and telemetry logs have been erased.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem' }}>Privacy, Data Security & DSO Privacy Shield</h2>
      </div>

      {/* DSO/TSO Aggregated Privacy Shield Visualizer */}
      <div 
        className="glass-card" 
        data-demo="privacy-shield-card" 
        data-explain-title="Home Privacy Shield Visualizer"
        data-explain="Shows how your private room temperatures and appliance schedules stay inside your home, while only safe totals are sent to the grid."
        style={{
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(255, 255, 255, 0.95))',
          border: '1px solid rgba(124, 58, 237, 0.3)'
        }}
      >
        <div className="card-header">
          <div>
            <div className="card-title" style={{ color: '#6d28d9' }}>
              <ShieldCheck size={20} /> Zero-Knowledge DSO / TSO Flexibility Shield
            </div>
          </div>
          <div className="pill-badge violet">Zero Raw Telemetry Leakage</div>
        </div>

        <div className="grid-cols-12" style={{ marginTop: '0.5rem', alignItems: 'center' }}>
          {/* Private Local Raw Telemetry Box */}
          <div 
            className="col-span-5" 
            data-explain-title="Private Local Data"
            data-explain="These personal habits (room temps, car models, shower schedules) are stored safely on your home device and never sent to anyone."
            style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)' }}
          >
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
              <EyeOff size={16} /> Private Local Telemetry (NEVER Shared)
            </div>
            <ul style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '1.2rem', fontWeight: 500 }}>
              <li>Exact Appliance Types (Tesla Model 3, Daikin Heat Pump)</li>
              <li>Living Room Temperature (20.8°C)</li>
              <li>Washing Machine Schedule & Household Routine Hours</li>
              <li>Exact Room Occupancy & Domestic Water Heating</li>
            </ul>
          </div>

          {/* Anonymizer Shield Filter Arrow */}
          <div 
            className="col-span-2" 
            data-explain-title="Anonymizing Shield Filter"
            data-explain="Mathematical shield that strips out all personal identities before sending energy numbers to the power company."
            style={{ textAlign: 'center' }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🛡️ Anonymizing Shield
            </div>
            <div style={{ fontSize: '1.2rem', color: '#047857' }}>➔ ➔ ➔</div>
          </div>

          {/* Aggregated Public Grid Output */}
          <div 
            className="col-span-5" 
            data-explain-title="Public Grid View"
            data-explain="The only thing the power company sees: a single combined number (e.g. 3.2 kW total reduction) without knowing what appliances you own."
            style={{ background: 'rgba(5, 150, 105, 0.08)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(5, 150, 105, 0.3)' }}
          >
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#047857', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Server size={16} /> What DSO / TSO Sees (Aggregated Only)
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Granular Consent Matrix & Immutable Audit Log */}
      <div className="grid-cols-12">
        {/* Granular Permission Matrix */}
        <div 
          className="glass-card col-span-6" 
          data-demo="privacy-consent-card"
          data-explain-title="Data Sharing Permissions"
          data-explain="Toggle on or off individual data permissions. You have 100% control over what information is shared."
        >
          <div className="card-header">
            <div>
              <div className="card-title">
                <Lock size={18} color="var(--primary-emerald)" /> Granular Data Sharing Permissions
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { key: 'householdProfile', title: 'Household Profile Data', explain: 'Allows VoltFlow to know your household size to optimize heating.' },
              { key: 'calendarAccess', title: 'Calendar & Routine Access', explain: 'Allows VoltFlow to sync with your calendar for EV departure times.' },
              { key: 'evChargingData', title: 'EV Charging Telemetry', explain: 'Allows smart charging optimization to save money on your car battery.' },
              { key: 'applianceTelemetry', title: 'Individual Appliance Power Draw', explain: 'Tracks individual appliance power usage for energy efficiency tips.' },
              { key: 'dsoAggregatedSharing', title: 'DSO Aggregated Flexibility Market', explain: 'Shares anonymous energy totals with grid operator to earn cash rewards.' },
            ].map(item => (
              <div 
                key={item.key} 
                className="switch-row"
                data-explain-title={item.title}
                data-explain={item.explain}
              >
                <div>
                  <div className="switch-label-title">{item.title}</div>
                </div>
                <div 
                  className={`switch-toggle ${privacySettings[item.key] ? 'active' : ''}`}
                  onClick={() => handleToggle(item.key)}
                >
                  <div className="switch-handle" />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button 
              className="btn-secondary" 
              data-explain-title="Export Data File"
              data-explain="Download a complete copy of your energy history and settings as a CSV or JSON file."
              style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Download size={14} /> Export Data (CSV/JSON)
            </button>
            <button 
              className="btn-secondary" 
              data-explain-title="Erase All Personal Data"
              data-explain="Permanently deletes all historical usage logs, habits, and schedules stored on your system."
              style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px', color: '#e11d48', borderColor: 'rgba(225, 29, 72, 0.4)' }}
              onClick={() => setShowDeletionConfirm(true)}
            >
              <Trash2 size={14} /> Delete Stored Personal Data
            </button>
          </div>
        </div>

        {/* Immutable Security Activity Audit Log */}
        <div 
          className="glass-card col-span-6"
          data-explain-title="Security Audit Log"
          data-explain="A permanent, tamper-proof record of every setting change, permission update, and automated action."
        >
          <div className="card-header">
            <div>
              <div className="card-title">
                <FileText size={18} color="var(--battery-cyan)" /> Immutable Activity Security Audit Log
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '320px', overflowY: 'auto' }}>
            {auditLogs.map(log => (
              <div key={log.id} style={{
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.08)',
                fontSize: '0.8rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontWeight: 700, color: '#047857' }}>{log.actor}</span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{log.timestamp}</span>
                </div>
                <div style={{ color: '#1e293b', fontWeight: 500 }}>{log.action}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deletion Confirmation Modal */}
      {showDeletionConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeletionConfirm(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger-rose)' }}>
                <AlertOctagon size={22} />
                <span style={{ fontWeight: 700 }}>Confirm Complete Data Erasure</span>
              </div>
              <button className="close-btn" onClick={() => setShowDeletionConfirm(false)}>✕</button>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#334155', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Are you sure you want to permanently erase all household routines, historical charge logs, and dynamic tariff learning models? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button className="btn-secondary" onClick={() => setShowDeletionConfirm(false)}>Cancel</button>
              <button className="btn-primary" style={{ background: 'var(--danger-rose)', color: '#fff' }} onClick={handleDataDeletion}>
                Yes, Permanently Delete Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
