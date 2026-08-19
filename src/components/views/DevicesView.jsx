import React, { useState } from 'react';
import { useEnergy } from '../../context/EnergyContext';
import { 
  Cpu, 
  Plus, 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  Zap, 
  Battery, 
  Sun, 
  Flame, 
  RefreshCw, 
  Settings,
  Clock,
  Power
} from 'lucide-react';

export const DevicesView = ({ onOpenAddDeviceWizard }) => {
  const { devices, setDevices, addNotification, isEmergencyBoost, toggleEmergencyBoost, triggerSignificance, isSmartPlanner } = useEnergy();
  const [selectedDevice, setSelectedDevice] = useState(null);

  const handleSimulateEmergencyBoost = () => {
    toggleEmergencyBoost(30);
    triggerSignificance(
      'Emergency High-Power Boost Activated (30m)',
      'Homeowner Priority Override: Ignores electricity prices & grid congestion alerts to force EV Charger to 11.0 kW and Heat Pump to max pre-heat immediately.',
      'EV wall connector boosted to 11.0 kW MAX power (+48% charge rate boost). Fluid SOC battery level filling in real time.',
      'flame'
    );
  };

  // Filter offline devices for fault warning banner
  const offlineDevices = devices.filter(d => d.status === 'offline' || d.health === 'Connection Lost');

  const getDeviceIcon = (category) => {
    switch (category) {
      case 'EV Charger': return <Zap size={20} color="#059669" />;
      case 'Home Battery': return <Battery size={20} color="#0284c7" />;
      case 'Solar PV': return <Sun size={20} color="#d97706" />;
      case 'HVAC / Heating': return <Flame size={20} color="#e11d48" />;
      default: return <Cpu size={20} color="#7c3aed" />;
    }
  };

  const handleReconnect = (deviceId) => {
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, status: 'scheduled', health: 'Optimal', lastPing: 'Just now' } : d));
    addNotification('success', 'Device Reconnected', 'Wi-Fi hand-shake successful. Device back online.');
  };

  const toggleDevicePower = (deviceId) => {
    setDevices(prev => prev.map(d => {
      if (d.id === deviceId) {
        const isCurrentlyActive = d.powerKw > 0;
        const newPower = isCurrentlyActive ? 0.0 : (d.category === 'EV Charger' ? 7.4 : d.category === 'Home Battery' ? 3.2 : 1.5);
        const newStatus = isCurrentlyActive ? 'idle' : (d.category === 'EV Charger' ? 'charging' : 'modulating');
        addNotification(isCurrentlyActive ? 'warning' : 'success', `${d.name} Toggled`, `${d.name} manually switched ${isCurrentlyActive ? 'OFF (Idle)' : 'ON'}`);
        return { ...d, powerKw: newPower, status: newStatus };
      }
      return d;
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Top Header Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '1.4rem', color: '#0f172a' }}>
          {isSmartPlanner ? 'Your Home Appliances' : 'Connected Hardware Fleet'}
        </h2>

        {/* Commissioning tools only in Advanced View */}
        {!isSmartPlanner && (
          <button 
            className="btn-primary" 
            onClick={onOpenAddDeviceWizard}
            data-explain-title="Connect Device Wizard"
            data-explain="Pairs new smart appliances, EV chargers, or solar inverters to VoltFlow."
          >
            <Plus size={16} /> Connect New Device
          </button>
        )}
      </div>

      {/* Connection Loss / Fault Warning Banner */}
      {offlineDevices.length > 0 && (
        <div className={`alert-banner ${isSmartPlanner ? 'info' : 'warning'}`} style={{
          background: isSmartPlanner ? 'rgba(2, 132, 199, 0.08)' : 'rgba(245, 158, 11, 0.1)',
          borderColor: isSmartPlanner ? 'rgba(2, 132, 199, 0.3)' : 'rgba(245, 158, 11, 0.4)'
        }}>
          <AlertTriangle size={20} color={isSmartPlanner ? '#0284c7' : '#d97706'} />
          <div style={{ flex: 1 }}>
            <strong style={{ color: isSmartPlanner ? '#0369a1' : '#b45309' }}>
              {isSmartPlanner 
                ? `1 Appliance Needs Reconnection: ${offlineDevices[0].name}`
                : `Device Loss Notification: ${offlineDevices.length} Hardware Asset Offline`}
            </strong>
            <div style={{ fontSize: '0.78rem', marginTop: '2px', color: isSmartPlanner ? '#334155' : '#475569' }}>
              {isSmartPlanner 
                ? `Lost Wi-Fi signal. VoltFlow is maintaining home heating & EV charging safely in the background.`
                : `${offlineDevices.map(d => d.name).join(', ')} failed to respond to heartbeat ping. System operating under safe fallback routines.`}
            </div>
          </div>
          <button 
            className="btn-secondary"
            style={{ fontSize: '0.75rem', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700 }}
            onClick={() => handleReconnect(offlineDevices[0].id)}
            data-explain-title="Reconnect Device"
            data-explain="Sends Wi-Fi ping to reconnect offline hardware."
          >
            <RefreshCw size={13} /> {isSmartPlanner ? '🔄 Reconnect Wi-Fi' : 'Retry Connection'}
          </button>
        </div>
      )}

      {/* SMART MODE: Clean live-status list — "What is running right now?" */}
      {isSmartPlanner ? (
        <div data-demo="smart-device-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {devices.map((device) => {
            const isOffline = device.status === 'offline';
            const getStatusInfo = () => {
              if (isOffline) return { label: '⚠️ Wi-Fi Disconnected', color: '#e11d48', dotColor: '#e11d48' };
              if (device.category === 'EV Charger') return { label: 'Charging overnight — ready by 07:30 AM', color: '#059669', dotColor: '#059669' };
              if (device.category === 'Home Battery') return { label: `Powering home — ${device.batterySoc || 78}% stored`, color: '#0284c7', dotColor: '#0284c7' };
              if (device.category === 'Solar PV') return { label: 'Generating clean solar power', color: '#d97706', dotColor: '#d97706' };
              if (device.category === 'HVAC / Heating') return { label: `Maintaining ${device.currentTemp || '20.8'}°C indoor comfort`, color: '#0284c7', dotColor: '#0284c7' };
              return { label: 'Scheduled & running automatically', color: '#059669', dotColor: '#059669' };
            };
            const status = getStatusInfo();
            return (
              <div key={device.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 1.25rem', background: '#ffffff', borderRadius: '14px',
                border: isOffline ? '1px solid rgba(225,29,72,0.25)' : '1px solid rgba(0,0,0,0.07)',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {getDeviceIcon(device.category)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>{device.name}</div>
                    <div style={{ fontSize: '0.8rem', color: status.color, fontWeight: 600, marginTop: '2px' }}>{status.label}</div>
                  </div>
                </div>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: status.dotColor, flexShrink: 0,
                  boxShadow: `0 0 6px ${status.dotColor}`
                }} />
              </div>
            );
          })}
        </div>
      ) : (
      /* ADVANCED MODE: Full interactive device-card grid */
      <div className="device-grid">
        {devices.map((device) => {
          const isOffline = device.status === 'offline';
          const isBoosting = device.status === 'BOOSTING' || device.status === 'MAX BOOST';
          const fillPercentage = device.batterySoc || device.soc || (device.powerKw > 0 ? 80 : 15);

          return (
            <div 
              key={device.id} 
              className="device-card"
              style={{
                position: 'relative', overflow: 'hidden',
                border: isBoosting ? '2px solid #d97706' : isOffline ? '1px solid rgba(225,29,72,0.3)' : '1px solid rgba(0,0,0,0.08)',
                boxShadow: isBoosting ? '0 0 20px rgba(217, 119, 6, 0.25)' : '0 4px 12px rgba(0,0,0,0.03)',
                background: '#ffffff', transition: 'all 0.3s ease'
              }}
            >
              {/* Fluid Fill Background */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: `${fillPercentage}%`,
                background: isBoosting 
                  ? 'linear-gradient(180deg, rgba(245,158,11,0.15), rgba(245,158,11,0.04))' 
                  : device.powerKw > 0 
                  ? 'linear-gradient(180deg, rgba(5,150,105,0.12), rgba(5,150,105,0.02))' 
                  : 'transparent',
                pointerEvents: 'none', transition: 'height 0.8s ease-in-out', zIndex: 0
              }} />

              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="device-card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '44px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0, paddingRight: '0.5rem' }}>
                    <div className="device-icon-box" style={{ flexShrink: 0, background: isBoosting ? 'rgba(217,119,6,0.15)' : 'rgba(0,0,0,0.04)' }}>
                      {getDeviceIcon(device.category)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '40px' }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', lineHeight: '1.2' }}>{device.name}</div>
                      <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '2px' }}>{device.category}</div>
                    </div>
                  </div>
                  {/* Manual Power Toggle — Advanced Mode Only */}
                  <button 
                    onClick={() => toggleDevicePower(device.id)}
                    title="Toggle device ON/OFF"
                    style={{
                      width: 36, height: 36, flexShrink: 0, borderRadius: '50%', border: 'none',
                      cursor: isOffline ? 'not-allowed' : 'pointer',
                      background: device.powerKw > 0 ? '#059669' : '#e2e8f0',
                      color: device.powerKw > 0 ? '#ffffff' : '#64748b',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
                      boxShadow: device.powerKw > 0 ? '0 2px 8px rgba(5,150,105,0.3)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                    disabled={isOffline}
                  >
                    <Power size={18} />
                  </button>
                </div>

                {/* Technical Telemetry Grid */}
                <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '10px', padding: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.88rem', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Active Power</span>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: isBoosting ? '#d97706' : device.powerKw > 0 ? '#047857' : '#64748b' }}>
                      {device.powerKw} kW {isBoosting && '🚀'}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Status</span>
                    <span className={`device-status-badge ${isOffline ? 'offline' : device.powerKw > 0 ? 'online' : 'scheduled'}`}>
                      {isOffline ? <WifiOff size={11} /> : <Wifi size={11} />}
                      <span>{device.status.toUpperCase()}</span>
                    </span>
                  </div>
                  {device.batterySoc !== undefined && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                        <span>Charge Progress</span>
                        <span style={{ color: '#0284c7', fontWeight: 800 }}>{device.batterySoc}% (Target 85%)</span>
                      </div>
                      <div style={{ height: '8px', background: 'rgba(0,0,0,0.08)', borderRadius: '4px', marginTop: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${device.batterySoc}%`, background: isBoosting ? 'linear-gradient(90deg, #d97706, #f59e0b)' : '#0284c7', borderRadius: '4px', transition: 'width 0.4s ease' }} />
                      </div>
                    </div>
                  )}
                  {device.currentTemp !== undefined && (
                    <div>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Indoor Temp</span>
                      <span style={{ fontWeight: 700, color: '#d97706' }}>{device.currentTemp}°C</span>
                    </div>
                  )}
                </div>

                {/* Footer: Ping + Configure */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> Ping: {device.lastPing}
                  </span>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '3px 8px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => setSelectedDevice(device)}
                  >
                    <Settings size={12} /> Configure
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Device Config Detail Modal */}
      {selectedDevice && (
        <div className="modal-overlay" onClick={() => setSelectedDevice(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Settings size={20} color="#059669" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedDevice.name}</div>
                </div>
              </div>
              <button className="close-btn" onClick={() => setSelectedDevice(null)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">Device Alias Name</label>
                <input className="form-input" defaultValue={selectedDevice.name} />
              </div>

              <div className="switch-row">
                <div>
                  <div className="switch-label-title">Allow Automatic Smart Scheduling</div>
                </div>
                <div className="switch-toggle active"><div className="switch-handle" /></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button className="btn-secondary" onClick={() => setSelectedDevice(null)}>Cancel</button>
                <button className="btn-primary" onClick={() => setSelectedDevice(null)}>Save Settings</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
