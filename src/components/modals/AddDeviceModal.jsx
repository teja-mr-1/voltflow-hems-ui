import React, { useState } from 'react';
import { useEnergy } from '../../context/EnergyContext';
import { Cpu, Zap, Battery, Sun, Flame, CheckCircle2, ArrowRight, Wifi } from 'lucide-react';

export const AddDeviceModal = ({ onClose }) => {
  const { addDevice } = useEnergy();
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('EV Charger');
  const [deviceName, setDeviceName] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
      setIsScanning(true);
      setTimeout(() => setIsScanning(false), 1500);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleFinish = () => {
    const newDev = {
      id: `dev_${Date.now()}`,
      name: deviceName || `${selectedCategory} Unit`,
      category: selectedCategory,
      status: 'online',
      powerKw: selectedCategory === 'EV Charger' ? 11.0 : selectedCategory === 'Home Battery' ? 5.0 : 1.8,
      health: '100% Signal',
      lastPing: 'Just now',
      guaranteeActive: true,
    };
    addDevice(newDev);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Cpu size={20} color="var(--primary-emerald)" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Connect New Smart Device</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Step {step} of 4 — Hardware Pairing Wizard</div>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Wizard Step 1: Category Selection */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-label">Select Asset Type to Pair</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { cat: 'EV Charger', icon: Zap },
                { cat: 'Home Battery', icon: Battery },
                { cat: 'Solar PV Array', icon: Sun },
                { cat: 'Heat Pump / HVAC', icon: Flame },
                { cat: 'Major Appliance', icon: Cpu },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div 
                    key={item.cat}
                    onClick={() => setSelectedCategory(item.cat)}
                    style={{
                      padding: '0.85rem',
                      borderRadius: '10px',
                      border: `1px solid ${selectedCategory === item.cat ? 'var(--primary-emerald)' : 'var(--border-glass)'}`,
                      background: selectedCategory === item.cat ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}
                  >
                    <Icon size={18} color="var(--primary-emerald)" />
                    <span>{item.cat}</span>
                  </div>
                );
              })}
            </div>
            <button className="btn-primary" style={{ marginTop: '0.5rem' }} onClick={handleNextStep}>
              Continue to Local Scan <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Wizard Step 2: Local Network Discovery Scan */}
        {step === 2 && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            {isScanning ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <Wifi size={40} className="pulse-red" color="var(--battery-cyan)" />
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Scanning Wi-Fi & Modbus Network...</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <CheckCircle2 size={40} color="var(--primary-emerald)" />
                <div style={{ fontSize: '1rem', fontWeight: 700 }}>Discovered 1 Compatible Asset</div>
                <button className="btn-primary" onClick={handleNextStep}>Configure Authorization</button>
              </div>
            )}
          </div>
        )}

        {/* Wizard Step 3: Device Naming & Credentials */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Custom Device Display Name</label>
              <input 
                className="form-input" 
                placeholder="e.g. Garage Wallbox / Roof Solar Array" 
                value={deviceName}
                onChange={e => setDeviceName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Modbus TCP / OCPP API Secret Key</label>
              <input className="form-input" type="password" defaultValue="••••••••••••" />
            </div>
            <button className="btn-primary" onClick={handleNextStep}>Test Connection & Finalize</button>
          </div>
        )}

        {/* Wizard Step 4: Confirmation */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <CheckCircle2 size={48} color="var(--primary-emerald)" style={{ marginBottom: '0.75rem' }} />
            <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>Device Successfully Paired!</div>
            <button className="btn-primary" onClick={handleFinish}>Return to Hardware Dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
};
