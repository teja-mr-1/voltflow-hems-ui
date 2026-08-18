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
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          You retain 100% control over your personal household data. Zero raw telemetry is disclosed to energy market actors.
        </p>
      </div>

      {/* DSO/TSO Aggregated Privacy Shield Visualizer */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(255, 255, 255, 0.95))',
        border: '1px solid rgba(124, 58, 237, 0.3)'
      }}>
        <div className="card-header">
          <div>
            <div className="card-title" style={{ color: '#6d28d9' }}>
              <ShieldCheck size={20} /> Zero-Knowledge DSO / TSO Flexibility Shield
            </div>
            <div className="card-subtitle">How VoltFlow protects your domestic privacy while supporting the grid</div>
          </div>
          <div className="pill-badge violet">Zero Raw Telemetry Leakage</div>
        </div>

        <div className="grid-cols-12" style={{ marginTop: '0.5rem', alignItems: 'center' }}>
          {/* Private Local Raw Telemetry Box */}
          <div className="col-span-5" style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)' }}>
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
          <div className="col-span-2" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🛡️ Anonymizing Shield
            </div>
            <div style={{ fontSize: '1.2rem', color: '#047857' }}>➔ ➔ ➔</div>
          </div>

          {/* Aggregated Public Grid Output */}
          <div className="col-span-5" style={{ background: 'rgba(5, 150, 105, 0.08)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(5, 150, 105, 0.3)' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#047857', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
              <Server size={16} /> What DSO / TSO Sees (Aggregated Only)
            </div>
            <p style={{ fontSize: '0.825rem', lineHeight: 1.5, color: '#0f172a', fontWeight: 500 }}>
              <em>"Substation Node #402 can reduce consumption by <strong style={{ color: '#047857' }}>2.0 kW</strong> between 18:00 and 19:00 without sharing which appliances are running."</em>
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Granular Consent Matrix & Immutable Audit Log */}
      <div className="grid-cols-12">
        {/* Granular Permission Matrix */}
        <div className="glass-card col-span-6">
          <div className="card-header">
            <div>
              <div className="card-title">
                <Lock size={18} color="var(--primary-emerald)" /> Granular Data Sharing Permissions
              </div>
              <div className="card-subtitle">Toggle consent per data category with instant revocation</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { key: 'householdProfile', title: 'Household Profile Data', desc: 'Occupancy count and home square footage for thermal modeling.' },
              { key: 'calendarAccess', title: 'Calendar & Routine Access', desc: 'Read departure deadlines and vacation windows for smart scheduling.' },
              { key: 'evChargingData', title: 'EV Charging Telemetry', desc: 'Vehicle battery SOC and charger plug state.' },
              { key: 'applianceTelemetry', title: 'Individual Appliance Power Draw', desc: 'Raw real-time power draw curves per domestic appliance.' },
              { key: 'dsoAggregatedSharing', title: 'DSO Aggregated Flexibility Market', desc: 'Participate in local grid balancing to earn flexibility rewards.' },
            ].map(item => (
              <div key={item.key} className="switch-row">
                <div>
                  <div className="switch-label-title">{item.title}</div>
                  <div className="switch-label-desc">{item.desc}</div>
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
            <button className="btn-secondary" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Download size={14} /> Export Data (CSV/JSON)
            </button>
            <button 
              className="btn-secondary" 
              style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px', color: '#e11d48', borderColor: 'rgba(225, 29, 72, 0.4)' }}
              onClick={() => setShowDeletionConfirm(true)}
            >
              <Trash2 size={14} /> Delete Stored Personal Data
            </button>
          </div>
        </div>

        {/* Immutable Security Activity Audit Log */}
        <div className="glass-card col-span-6">
          <div className="card-header">
            <div>
              <div className="card-title">
                <FileText size={18} color="var(--battery-cyan)" /> Immutable Activity Security Audit Log
              </div>
              <div className="card-subtitle">Real-time log of when data was accessed or system settings changed</div>
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
