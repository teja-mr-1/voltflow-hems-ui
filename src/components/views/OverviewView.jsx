import React from 'react';
import { useEnergy } from '../../context/EnergyContext';
import { 
  Sun, 
  Battery, 
  Home, 
  Zap, 
  PieChart as PieChartIcon,
  BarChart3,
  ShieldCheck,
  Flame,
  Pause,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip,
} from 'recharts';
import { PolymarketScrubberChart } from '../PolymarketScrubberChart';
import { generateSolarGridHeartbeatData } from '../../utils/telemetryDataGenerator';

export const OverviewView = () => {
  const { 
    devices, 
    viewMode, 
    gridStatus, 
    setGridStatus, 
    triggerSignificance, 
    isSmartPlanner,
    setIsSmartPlanner,
    isEmergencyBoost,
    toggleEmergencyBoost,
    addNotification
  } = useEnergy();

  const handleSimulateGridCongestion = () => {
    if (gridStatus === 'green') {
      setGridStatus('yellow');
      triggerSignificance(
        'Grid Signal: Yellow (Solar Peak)',
        'Local grid tariff moderate (€0.22/kWh). Prioritizing local rooftop solar self-consumption for heat pump & home loads.',
        'Heat pump modulating at 1.5 kW. EV charging rate adjusted to 7.4 kW.',
        'zap'
      );
    } else if (gridStatus === 'yellow') {
      setGridStatus('red');
      triggerSignificance(
        'Grid Signal: Red (High Congestion Alert)',
        'Local DSO grid transformer overloaded (€0.38/kWh). Automated load shedding pauses heavy EV draw and discharges home battery.',
        'EV Charger auto-throttled to 0.0 kW (PAUSED). Powerwall discharging 3.2 kW to grid (Earns €1.85 reward).',
        'zap'
      );
    } else {
      setGridStatus('green');
      triggerSignificance(
        'Grid Signal: Green (Low Demand)',
        'Grid capacity abundant and cheap (€0.12/kWh). EV fast charging & battery storage filling enabled.',
        'EV Charger resumed fast charging at 11.0 kW. Powerwall charging at 4.8 kW.',
        'zap'
      );
    }
  };

  // Calculate Live Power Totals
  const solarPower = devices.find(d => d.id === 'solar_pv')?.powerKw || 5.8;
  const batteryPower = devices.find(d => d.id === 'battery_storage')?.powerKw || 3.2;
  const batterySoc = devices.find(d => d.id === 'battery_storage')?.soc || 78;
  const evPower = devices.find(d => d.id === 'ev_charger')?.powerKw || 7.4;
  const heatPumpPower = devices.find(d => d.id === 'heat_pump')?.powerKw || 1.5;

  const totalHouseholdDraw = (evPower + heatPumpPower + 1.2).toFixed(1);
  const netGridFlow = (parseFloat(totalHouseholdDraw) - solarPower - batteryPower).toFixed(1);
  const isGridExporting = netGridFlow < 0;

  const deviceBreakdownData = [
    { name: 'EV Charger', value: 45, color: '#059669', kw: evPower },
    { name: 'Heat Pump', value: 25, color: '#0284c7', kw: heatPumpPower },
    { name: 'Powerwall', value: 15, color: '#d97706', kw: batteryPower },
    { name: 'Base Load', value: 15, color: '#7c3aed', kw: 1.2 },
  ];

  const hourlyGridData = [
    { time: '06:00', importKw: 2.1, solarKw: 0.4 },
    { time: '08:00', importKw: 4.5, solarKw: 2.1 },
    { time: '10:00', importKw: 0.0, solarKw: 4.8 },
    { time: '12:00', importKw: 0.0, solarKw: 6.2 },
    { time: '14:00', importKw: 0.0, solarKw: 5.9 },
    { time: '16:00', importKw: 0.8, solarKw: 3.5 },
    { time: '18:00', importKw: 3.9, solarKw: 0.8 },
    { time: '20:00', importKw: 2.4, solarKw: 0.0 },
    { time: '22:00', importKw: 1.2, solarKw: 0.0 },
  ];

  // ----------------------------------------------------
  // COMPREHENSIVE ENERGY OVERVIEW DASHBOARD
  // ----------------------------------------------------
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* SMART HANDS-FREE CITIZEN VIEW */}
      {isSmartPlanner ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Hero Headline */}
          <div className="glass-card" data-demo="smart-overview-hero" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(240,253,244,0.95) 100%)',
            padding: '1.75rem 2rem', borderRadius: '20px',
            border: '1.5px solid rgba(5,150,105,0.25)',
            boxShadow: '0 8px 30px rgba(5,150,105,0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: 'rgba(5,150,105,0.12)', color: '#047857',
                  padding: '4px 12px', borderRadius: '20px',
                  fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase',
                  letterSpacing: '0.5px', marginBottom: '0.75rem'
                }}>
                  <Sparkles size={14} color="#059669" /> Smart Planner Active
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25 }}>
                  Your home is running on <span style={{ color: '#059669' }}>92% clean energy</span> right now.
                </div>
                <div style={{ fontSize: '0.95rem', color: '#64748b', marginTop: '0.4rem', fontWeight: 500 }}>
                  Automated grid balancing has saved you <strong style={{ color: '#047857' }}>€4.80 today</strong> by shifting EV charging & heat pump cycles to low-cost spot dips.
                </div>
              </div>
              <div className="pill-badge green" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                <Sparkles size={14} /> All Systems Autonomous
              </div>
            </div>
          </div>

          {/* 4 Today's Outcome Stats — read-only, no controls */}
          <div data-demo="smart-outcome-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { icon: Sun, color: '#d97706', bg: 'rgba(217,119,6,0.1)', label: 'Solar Generated Today', value: '28.4 kWh', sub: 'Peak 6.2 kW at 12:30 PM' },
              { icon: ShieldCheck, color: '#059669', bg: 'rgba(5,150,105,0.1)', label: 'Money Saved Today', value: '€4.80', sub: 'vs flat-rate tariff billing' },
              { icon: BarChart3, color: '#0284c7', bg: 'rgba(2,132,199,0.1)', label: 'Clean Energy Share', value: '92%', sub: 'Self-solar + stored battery' },
              { icon: Home, color: '#7c3aed', bg: 'rgba(124,58,237,0.1)', label: 'Grid Imported Today', value: '3.1 kWh', sub: 'Only during morning ramp-up' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="glass-card" style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.07)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                    <div style={{ width: 38, height: 38, borderRadius: '10px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={20} />
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>{stat.label}</div>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{stat.sub}</div>
                </div>
              );
            })}
          </div>

          {/* Today's Grid Conditions — read-only */}
          <div className="glass-card" data-demo="smart-grid-calm" style={{ padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>TODAY'S GRID CONDITIONS</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#047857' }}>🟢 Grid Calm — Optimal Conditions All Day</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Low tariff window 01:00–06:00 AM. VoltFlow charged your EV in full at €0.08/kWh.</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Peak Tariff Today</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#d97706' }}>€0.38/kWh at 18:00</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>All loads shifted before peak ✓</div>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* ADVANCED TECHNICAL TELEMETRY VIEW */
        <>
          {/* ⚙️ ADVANCED: Direct Device Quick-Actions (unique to Overview) */}
          <div className="glass-card" data-demo="adv-device-actions" style={{ padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1.5px solid rgba(5,150,105,0.2)', background: 'linear-gradient(135deg, #ffffff, #f8faff)' }}>
            <div className="action-cell-label" style={{ marginBottom: '0.75rem' }}>
              ⚙️ Live Device Quick-Actions
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>

              {/* Force EV Charge Now */}
              <div className="action-cell">
                <div className="action-cell-label">EV — Tesla Model Y</div>
                <div className="action-cell-sub">Currently: Scheduled 01:00 AM</div>
                <button className="btn-action emerald" onClick={() => addNotification('warning', 'EV Force Charging', 'Bypassed schedule — charging Tesla at 7.2 kW max rate right now.')}>
                  ⚡ Force Charge Now
                </button>
              </div>

              {/* Manual Battery Mode */}
              <div className="action-cell" style={{ flex: '1 1 200px' }}>
                <div className="action-cell-label">Powerwall — Battery Mode</div>
                <div style={{ display: 'flex', gap: '5px', marginTop: '8px' }}>
                  <button className="btn-action cyan" style={{ fontSize: '0.7rem' }} onClick={() => addNotification('info', 'Battery: Charge', 'Powerwall set to force-charge mode.')}>↑ Charge</button>
                  <button className="btn-action neutral" style={{ fontSize: '0.7rem' }} onClick={() => addNotification('info', 'Battery: Hold', 'Powerwall holding current charge level.')}>⏸ Hold</button>
                  <button className="btn-action violet" style={{ fontSize: '0.7rem' }} onClick={() => addNotification('info', 'Battery: Export', 'Powerwall exporting to grid.')}>↓ Export</button>
                </div>
              </div>

              {/* Suspend Running Appliance */}
              <div className="action-cell">
                <div className="action-cell-label">Washer — Currently Running</div>
                <div className="action-cell-sub">Eco Wash · 38 min remaining</div>
                <button className="btn-action amber" onClick={() => addNotification('warning', 'Washer Suspended', 'Bosch washer cycle paused manually. Will resume when you allow it.')}>
                  ⏸ Suspend Cycle Now
                </button>
              </div>

            </div>
          </div>

          {/* Vector Flow Matrix & Appliance Pie Share */}
      <div className="grid-cols-12">
        <div 
          className="glass-card col-span-7"
          data-explain-title="Power Flow Map"
          data-explain="Live diagram showing where electricity is currently flowing."
        >
          <div className="card-header">
            <div className="card-title" style={{ color: '#0f172a' }}>
              <Zap size={18} color="#059669" /> Vector Power Flow Matrix
            </div>
            <div className="pill-badge green">Manual Telemetry</div>
          </div>

          <div className="flow-diagram-container" style={{ background: 'linear-gradient(135deg, #faf8f4, #f1ece1)', padding: '1.25rem', borderRadius: '20px' }}>
            <svg width="100%" height="240" viewBox="0 0 620 240" fill="none">
              <defs>
                {/* Glow Filters */}
                <filter id="glowEmerald" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="glowAmber" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Cable Gradients */}
                <linearGradient id="solarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="batteryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="homeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
                <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>

              {/* Smooth Curved Bezier Conduits */}
              {/* Solar to Core Bus */}
              <path d="M 160 60 C 230 60, 250 120, 310 120" stroke="#d97706" strokeWidth="6" opacity="0.2" strokeLinecap="round" />
              <path d="M 160 60 C 230 60, 250 120, 310 120" stroke="url(#solarGrad)" strokeWidth="3" className="energy-conduit" strokeLinecap="round" />

              {/* Battery to Core Bus */}
              <path d="M 160 180 C 230 180, 250 120, 310 120" stroke="#0284c7" strokeWidth="6" opacity="0.2" strokeLinecap="round" />
              <path d="M 160 180 C 230 180, 250 120, 310 120" stroke="url(#batteryGrad)" strokeWidth="3" className="energy-conduit" strokeLinecap="round" />

              {/* Core Bus to Household */}
              <path d="M 310 120 C 370 120, 390 60, 460 60" stroke="#059669" strokeWidth="6" opacity="0.2" strokeLinecap="round" />
              <path d="M 310 120 C 370 120, 390 60, 460 60" stroke="url(#homeGrad)" strokeWidth="3.5" className="energy-conduit" strokeLinecap="round" />

              {/* Core Bus to Grid Flow */}
              <path d="M 310 120 C 370 120, 390 180, 460 180" stroke="#7c3aed" strokeWidth="6" opacity="0.2" strokeLinecap="round" />
              <path d="M 310 120 C 370 120, 390 180, 460 180" stroke="url(#gridGrad)" strokeWidth="3" className="energy-conduit" strokeLinecap="round" />

              {/* NODE 1: SOLAR PV (Top Left) */}
              <g transform="translate(30, 30)">
                <rect width="135" height="60" rx="14" fill="#ffffff" stroke="#d97706" strokeWidth="2" filter="drop-shadow(0 4px 12px rgba(217,119,6,0.15))" />
                <circle cx="28" cy="30" r="16" fill="rgba(217,119,6,0.12)" />
                <path d="M 28 20 A 10 10 0 1 0 28 40 A 10 10 0 1 0 28 20 Z M 28 15 L 28 17 M 28 43 L 28 45 M 13 30 L 15 30 M 41 30 L 43 30" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
                <text x="54" y="26" fill="#475569" fontSize="10" fontWeight="700" letterSpacing="0.05em">SOLAR ARRAY</text>
                <text x="54" y="44" fill="#d97706" fontSize="14" fontWeight="800">+{solarPower} kW</text>
              </g>

              {/* NODE 2: BATTERY STORAGE (Bottom Left) */}
              <g transform="translate(30, 150)">
                <rect width="135" height="60" rx="14" fill="#ffffff" stroke="#0284c7" strokeWidth="2" filter="drop-shadow(0 4px 12px rgba(2,132,199,0.15))" />
                <circle cx="28" cy="30" r="16" fill="rgba(2,132,199,0.12)" />
                <rect x="21" y="20" width="14" height="20" rx="3" stroke="#0284c7" strokeWidth="2" fill="none" />
                <rect x="23" y="24" width="10" height="12" fill="#0284c7" rx="1" />
                <text x="54" y="26" fill="#475569" fontSize="10" fontWeight="700" letterSpacing="0.05em">POWERWALL</text>
                <text x="54" y="44" fill="#0284c7" fontSize="13" fontWeight="800">{batterySoc}% ({batteryPower} kW)</text>
              </g>

              {/* NODE 3: CENTRAL SMART ENERGY CORE (BUS) */}
              <g transform="translate(310, 120)">
                {/* Glowing Outer Aura */}
                <circle cx="0" cy="0" r="34" fill="rgba(5, 150, 105, 0.12)" stroke="rgba(5, 150, 105, 0.3)" strokeWidth="1.5" className="energy-core-bus" />
                <circle cx="0" cy="0" r="24" fill="#059669" filter="drop-shadow(0 4px 10px rgba(5,150,105,0.4))" />
                <path d="M -2 -10 L -9 2 L -1 2 L -3 10 L 8 -2 L 1 -2 Z" fill="#ffffff" />
                <text x="0" y="46" fill="#047857" fontSize="10" fontWeight="800" textAnchor="middle" letterSpacing="0.06em">SMART BUS</text>
              </g>

              {/* NODE 4: HOUSEHOLD LOAD (Top Right) */}
              <g transform="translate(455, 30)">
                <rect width="135" height="60" rx="14" fill="#ffffff" stroke="#059669" strokeWidth="2" filter="drop-shadow(0 4px 12px rgba(5,150,105,0.15))" />
                <circle cx="28" cy="30" r="16" fill="rgba(5,150,105,0.12)" />
                <path d="M 20 34 L 28 20 L 36 34 H 22 V 40 H 34 V 34" stroke="#059669" strokeWidth="2" strokeLinejoin="round" fill="none" />
                <text x="54" y="26" fill="#475569" fontSize="10" fontWeight="700" letterSpacing="0.05em">HOME DEMAND</text>
                <text x="54" y="44" fill="#047857" fontSize="14" fontWeight="800">-{totalHouseholdDraw} kW</text>
              </g>

              {/* NODE 5: GRID SUBSTATION (Bottom Right) */}
              <g transform="translate(455, 150)">
                <rect width="135" height="60" rx="14" fill="#ffffff" stroke="#7c3aed" strokeWidth="2" filter="drop-shadow(0 4px 12px rgba(124,58,237,0.15))" />
                <circle cx="28" cy="30" r="16" fill="rgba(124,58,237,0.12)" />
                <path d="M 28 18 L 20 40 H 36 Z M 24 30 H 32" stroke="#7c3aed" strokeWidth="2" strokeLinejoin="round" fill="none" />
                <text x="54" y="26" fill="#475569" fontSize="10" fontWeight="700" letterSpacing="0.05em">GRID FLOW</text>
                <text x="54" y="44" fill="#6d28d9" fontSize="13" fontWeight="800">
                  {isGridExporting ? `OUT -${Math.abs(netGridFlow)} kW` : `IN +${netGridFlow} kW`}
                </text>
              </g>
            </svg>
          </div>
        </div>

        <div 
          className="glass-card col-span-5"
          data-demo="adv-power-share"
          data-explain-title="Power Usage Share"
          data-explain="Pie chart showing which appliances use the most electricity."
        >
          <div className="card-header">
            <div className="card-title" style={{ color: '#0f172a' }}>
              <PieChartIcon size={18} color="#0284c7" /> Power Share Breakdown
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', height: '220px' }}>
            <ResponsiveContainer width="55%" height="100%">
              <PieChart>
                <Pie data={deviceBreakdownData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value">
                  {deviceBreakdownData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', color: '#0f172a' }} />
              </PieChart>
            </ResponsiveContainer>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '45%' }}>
              {deviceBreakdownData.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.color }} />
                    <span style={{ color: '#475569', fontWeight: 500 }}>{d.name}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{d.kw} kW</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GRAPH 1: Pure 3-Line Smooth Telemetry Curve (Solar PV, Home Load & Storage Flow) */}
      <div 
        data-explain-title="24-Hour Energy Graph"
        data-explain="Hover cursor across graph to inspect solar, battery, and home load."
      >
        <PolymarketScrubberChart
          title="24-Hour Solar PV, Home Demand & Powerwall Storage Telemetry"
          icon={TrendingUp}
          data={generateSolarGridHeartbeatData()}
          series1={{ key: 'solarKw', name: 'Solar PV', color: '#d97706', unit: ' kW' }}
          series2={{ key: 'homeKw', name: 'Home Load', color: '#0284c7', unit: ' kW' }}
          series3={{ key: 'batteryKw', name: 'Powerwall Flow', color: '#e11d48', unit: ' kW' }}
          idPrefix="overviewScrubber"
        />
      </div>
        </>
      )}
    </div>
  );
};
