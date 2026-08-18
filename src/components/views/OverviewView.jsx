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
  TrendingUp
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
  const { devices, viewMode, gridStatus, setGridStatus, triggerSignificance } = useEnergy();

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
      {/* Top 4 Live Telemetry Widgets */}
      <div className="kpi-grid">
        <div 
          className="kpi-card solar"
          data-explain-title="Solar Panels"
          data-explain="Rooftop solar producing free clean power for your house."
        >
          <div className="kpi-icon-wrap"><Sun size={24} /></div>
          <div>
            <div className="kpi-label">Solar Microinverter PV</div>
            <div className="kpi-val" style={{ color: '#d97706' }}>{solarPower} kW</div>
            <div className="kpi-subtext">Peak Today: 6.4 kW</div>
          </div>
        </div>

        <div 
          className="kpi-card battery"
          data-explain-title="Home Battery"
          data-explain="Stores extra solar energy to power your house at night."
        >
          <div className="kpi-icon-wrap"><Battery size={24} /></div>
          <div>
            <div className="kpi-label">Powerwall Storage</div>
            <div className="kpi-val" style={{ color: '#0284c7' }}>{batterySoc}% ({batteryPower} kW)</div>
            <div className="kpi-subtext">Discharging • 13.5 kWh</div>
          </div>
        </div>

        <div 
          className="kpi-card home"
          data-explain-title="Home Power Use"
          data-explain="Current electricity being used right now by your appliances."
        >
          <div className="kpi-icon-wrap"><Home size={24} /></div>
          <div>
            <div className="kpi-label">Active Power Draw</div>
            <div className="kpi-val" style={{ color: '#047857' }}>{totalHouseholdDraw} kW</div>
            <div className="kpi-subtext">EV + HVAC Active</div>
          </div>
        </div>

        <div 
          className="kpi-card grid"
          data-explain-title="Grid Power Flow"
          data-explain="Shows if your home is selling solar power or buying from grid."
        >
          <div className="kpi-icon-wrap"><Zap size={24} /></div>
          <div>
            <div className="kpi-label">Net Substation Flow</div>
            <div className="kpi-val" style={{ color: isGridExporting ? '#047857' : '#6d28d9' }}>
              {isGridExporting ? `Exporting ${Math.abs(netGridFlow)} kW` : `Importing ${netGridFlow} kW`}
            </div>
            <div className="kpi-subtext">{isGridExporting ? 'Feed-in: €0.14/kWh' : 'Tariff: €0.08/kWh'}</div>
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
            <div className="pill-badge green">Pro Telemetry Sync</div>
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
          subtitle="Real-time multi-channel power telemetry and storage flow"
          icon={TrendingUp}
          data={generateSolarGridHeartbeatData()}
          series1={{ key: 'solarKw', name: 'Solar PV', color: '#d97706', unit: ' kW' }}
          series2={{ key: 'homeKw', name: 'Home Load', color: '#0284c7', unit: ' kW' }}
          series3={{ key: 'batteryKw', name: 'Powerwall Flow', color: '#e11d48', unit: ' kW' }}
          idPrefix="overviewScrubber"
        />
      </div>
    </div>
  );
};
