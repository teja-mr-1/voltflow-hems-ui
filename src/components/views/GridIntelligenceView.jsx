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

      {/* Financial & Environmental KPI Counters */}
      <div className="kpi-grid">
        <div className="kpi-card solar">
          <div className="kpi-icon-wrap"><DollarSign size={24} /></div>
          <div>
            <div className="kpi-label">Monthly Saved</div>
            <div className="kpi-val" style={{ color: '#d97706' }}>€148.50</div>
            <div className="kpi-subtext">+34% vs flat rate tariff</div>
          </div>
        </div>

        <div className="kpi-card home">
          <div className="kpi-icon-wrap"><ShieldCheck size={24} /></div>
          <div>
            <div className="kpi-label">Grid Flexibility Payout</div>
            <div className="kpi-val" style={{ color: '#047857' }}>€42.80</div>
            <div className="kpi-subtext">DSO peak-response cash</div>
          </div>
        </div>

        <div className="kpi-card battery">
          <div className="kpi-icon-wrap"><Leaf size={24} /></div>
          <div>
            <div className="kpi-label">Carbon Offset</div>
            <div className="kpi-val" style={{ color: '#0284c7' }}>184 kg CO2</div>
            <div className="kpi-subtext">9 trees planted equivalent</div>
          </div>
        </div>

        <div className="kpi-card grid">
          <div className="kpi-icon-wrap"><CheckCircle2 size={24} /></div>
          <div>
            <div className="kpi-label">EV Ready Guarantee</div>
            <div className="kpi-val" style={{ color: '#047857' }}>100% Ready</div>
            <div className="kpi-subtext">Target 85% by {userLimits.departureTime} AM</div>
          </div>
        </div>
      </div>

      {/* GRAPH 2: Pure 3-Line Substation Tariff, Transformer Load & Congestion Risk */}
      <PolymarketScrubberChart
        title="24-Hour Substation Spot Tariff, Transformer Load & Congestion Risk"
        subtitle="Substation dynamic tariff pricing and transformer load telemetry"
        icon={Activity}
        data={generateSubstationTariffHeartbeatData()}
        series1={{ key: 'tariffRate', name: 'Dynamic Spot Tariff (€/kWh)', color: '#059669', unit: ' €/kWh' }}
        series2={{ key: 'gridLoadMva', name: 'Transformer Load (MVA)', color: '#0284c7', unit: ' MVA' }}
        series3={{ key: 'congestionIndex', name: 'Congestion Risk Index', color: '#e11d48', unit: ' /10' }}
        idPrefix="gridScrubber"
      />

      {/* Zero-Knowledge Privacy Shield Card */}
      <div className="glass-card" style={{
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.06), rgba(255, 255, 255, 0.98))',
        border: '1px solid rgba(124, 58, 237, 0.25)'
      }}>
        <div className="card-header">
          <div>
            <div className="card-title" style={{ color: '#6d28d9' }}>
              <Lock size={18} /> Zero-Knowledge DSO Privacy Shield
            </div>
          </div>
          <div className="pill-badge violet">Zero Raw Telemetry Leakage</div>
        </div>

        <div className="grid-cols-12" style={{ marginTop: '0.5rem', alignItems: 'center' }}>
          <div className="col-span-5" style={{ background: '#ffffff', padding: '0.9rem 1.1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#dc2626', marginBottom: '0.4rem' }}>🔒 Private Local Telemetry</div>
            <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500 }}>
              Appliance types, room occupancy, temperature settings, and personal schedules are strictly locked inside your home gateway.
            </div>
          </div>

          <div className="col-span-2" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>Shield Filter</div>
            <div style={{ fontSize: '1.2rem', color: '#047857' }}>➔ ➔ ➔</div>
          </div>

          <div className="col-span-5" style={{ background: 'rgba(5, 150, 105, 0.08)', padding: '0.9rem 1.1rem', borderRadius: '12px', border: '1px solid rgba(5, 150, 105, 0.3)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#047857', marginBottom: '0.4rem' }}>
              <Server size={14} style={{ display: 'inline', marginRight: '4px' }} /> Public DSO Grid Output
            </div>
            <div style={{ fontSize: '0.78rem', color: '#0f172a', fontWeight: 600 }}>
              "Substation Node #402 can curtail <strong>2.0 kW</strong> capacity without disclosing domestic activity."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
