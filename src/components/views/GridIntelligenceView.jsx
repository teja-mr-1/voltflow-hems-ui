import React from 'react';
import { useEnergy } from '../../context/EnergyContext';
import { 
  Radio, 
  DollarSign, 
  Leaf, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Server,
  Activity
} from 'lucide-react';
import { PolymarketScrubberChart } from '../PolymarketScrubberChart';
import { generateSubstationTariffHeartbeatData } from '../../utils/telemetryDataGenerator';

export const GridIntelligenceView = () => {
  const { gridStatus, setGridStatus, userLimits } = useEnergy();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Grid Condition Traffic Signal Hero Banner */}
      <div 
        className="glass-card" 
        data-explain-title="Substation Grid Signal Banner"
        data-explain="Real-time DSO Grid Substation status. Green = cheap renewable power; Yellow = peak solar self-consumption; Red = transformer congestion & active DSO flexibility rewards."
        style={{
          background: gridStatus === 'green' 
            ? 'linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(255, 255, 255, 0.98))'
            : gridStatus === 'yellow'
            ? 'linear-gradient(135deg, rgba(217, 119, 6, 0.1), rgba(255, 255, 255, 0.98))'
            : 'linear-gradient(135deg, rgba(225, 29, 72, 0.1), rgba(255, 255, 255, 0.98))',
          border: `1px solid ${gridStatus === 'green' ? 'rgba(5, 150, 105, 0.3)' : gridStatus === 'yellow' ? 'rgba(217, 119, 6, 0.3)' : 'rgba(225, 29, 72, 0.3)'}`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: gridStatus === 'green' ? '#059669' : gridStatus === 'yellow' ? '#d97706' : '#e11d48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(0,0,0,0.12)'
            }}>
              <Radio size={28} />
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 800 }}>
                Substation Node #402 Signal
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                {gridStatus === 'green' && '🟢 GREEN — Clean Energy Surplus (Low Tariff)'}
                {gridStatus === 'yellow' && '🟡 YELLOW — Moderate Grid Load (Discharging Battery)'}
                {gridStatus === 'red' && '🔴 RED — High Congestion (Flexibility Rewards Active)'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className={`btn-secondary ${gridStatus === 'green' ? 'active' : ''}`} onClick={() => setGridStatus('green')}>Green</button>
            <button className={`btn-secondary ${gridStatus === 'yellow' ? 'active' : ''}`} onClick={() => setGridStatus('yellow')}>Yellow</button>
            <button className={`btn-secondary ${gridStatus === 'red' ? 'active' : ''}`} onClick={() => setGridStatus('red')}>Red</button>
          </div>
        </div>
      </div>

      {/* Substation Engineering Telemetry KPI Row */}
      <div className="kpi-grid">
        <div className="kpi-card solar">
          <div className="kpi-icon-wrap"><Radio size={24} /></div>
          <div>
            <div className="kpi-label">Substation Load</div>
            <div className="kpi-[#059669]" style={{ color: '#059669', fontSize: '1.25rem', fontWeight: 800 }}>3.42 MVA</div>
            <div className="kpi-subtext">Capacity: 5.0 MVA</div>
          </div>
        </div>

        <div className="kpi-card home">
          <div className="kpi-icon-wrap"><Activity size={24} /></div>
          <div>
            <div className="kpi-label">Grid Frequency</div>
            <div className="kpi-val" style={{ color: '#047857' }}>49.98 Hz</div>
            <div className="kpi-subtext">Nominal: 50.00 Hz</div>
          </div>
        </div>

        <div className="kpi-card battery">
          <div className="kpi-icon-wrap"><DollarSign size={24} /></div>
          <div>
            <div className="kpi-label">Dynamic Spot Price</div>
            <div className="kpi-val" style={{ color: '#d97706' }}>€0.08 / kWh</div>
            <div className="kpi-subtext">Off-Peak Rate</div>
          </div>
        </div>

        <div className="kpi-card grid">
          <div className="kpi-icon-wrap"><CheckCircle2 size={24} /></div>
          <div>
            <div className="kpi-label">Congestion Index</div>
            <div className="kpi-val" style={{ color: '#047857' }}>2.1 / 10</div>
            <div className="kpi-subtext">Low Feeder Stress</div>
          </div>
        </div>
      </div>

      {/* Manual DSO Response Action Panel */}
      <div className="glass-card" data-demo="adv-dso-actions" style={{ padding: '1.25rem 1.5rem', borderRadius: '16px', border: `1.5px solid ${gridStatus === 'red' ? 'rgba(225,29,72,0.3)' : gridStatus === 'yellow' ? 'rgba(217,119,6,0.25)' : 'rgba(5,150,105,0.2)'}`, background: '#ffffff' }}>
        <div className="action-cell-label" style={{ marginBottom: '0.85rem' }}>Manual DSO Response Actions — Override Automated Dispatch</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          {[
            { label: 'Shed EV Charger', sub: 'Stop EV draw immediately', cls: 'rose' },
            { label: 'Shed Heat Pump', sub: 'Pause HVAC for 30 min', cls: 'amber' },
            { label: 'Discharge Battery', sub: 'Export Powerwall to grid', cls: 'violet' },
            { label: '💶 Claim Flex Reward', sub: 'Earn payout for load shed', cls: 'emerald' },
          ].map((action, i) => (
            <button key={i} className={`btn-action ${action.cls}`} onClick={() => {}} style={{ flex: '1 1 160px', height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '0.75rem 0.85rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.82rem' }}>{action.label}</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.75, marginTop: '2px', fontWeight: 500 }}>{action.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* GRAPH 2: Pure 3-Line Substation Tariff, Transformer Load & Congestion Risk */}
      <PolymarketScrubberChart
        title="24-Hour Substation Spot Tariff, Transformer Load & Congestion Risk"
        icon={Activity}
        data={generateSubstationTariffHeartbeatData()}
        series1={{ key: 'tariffRate', name: 'Dynamic Spot Tariff (€/kWh)', color: '#059669', unit: ' €/kWh' }}
        series2={{ key: 'gridLoadMva', name: 'Transformer Load (MVA)', color: '#0284c7', unit: ' MVA' }}
        series3={{ key: 'congestionIndex', name: 'Congestion Risk Index', color: '#e11d48', unit: ' /10' }}
        idPrefix="gridScrubber"
      />

    </div>
  );
};
