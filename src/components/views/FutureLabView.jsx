import React, { useState } from 'react';
import { 
  Car, 
  Users, 
  TrendingUp, 
  ArrowRightLeft 
} from 'lucide-react';

export const FutureLabView = () => {
  const [activeTab, setActiveTab] = useState('v2h');
  const [v2hDischarging, setV2hDischarging] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem' }}>Future Energy Innovation Lab (V2H & Community Grid)</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Preview upcoming features: Vehicle-to-Home bidirectional power flow, neighborhood battery sharing, and automated market trading
        </p>
      </div>

      {/* Feature Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {[
          { id: 'v2h', label: 'Vehicle-to-Home (V2H)', icon: Car },
          { id: 'community', label: 'Neighborhood Battery Sharing', icon: Users },
          { id: 'market', label: 'Automated Flexibility Trading', icon: TrendingUp },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button 
              key={tab.id}
              className={`btn-secondary ${activeTab === tab.id ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.6rem 1.1rem',
                background: activeTab === tab.id ? 'rgba(5, 150, 105, 0.12)' : '#ffffff',
                borderColor: activeTab === tab.id ? 'rgba(5, 150, 105, 0.4)' : 'rgba(0, 0, 0, 0.08)',
                color: activeTab === tab.id ? '#047857' : '#334155'
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Vehicle-to-Home (V2H) Simulator */}
      {activeTab === 'v2h' && (
        <div className="glass-card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <Car size={20} color="var(--primary-emerald)" /> Vehicle-to-Home (V2H) Bidirectional Flow Simulator
              </div>
              <div className="card-subtitle">Use your EV's 75 kWh battery to power your entire house during peak electricity tariff hours</div>
            </div>
            <div className="pill-badge green">V2H Hardware Compatible</div>
          </div>

          <div className="grid-cols-12" style={{ alignItems: 'center', marginTop: '0.5rem' }}>
            <div className="col-span-7" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.5, color: '#334155', fontWeight: 500 }}>
                Your EV battery holds enough electricity to power an average household for <strong>4 full days</strong>. V2H lets your car send power BACK into your house when grid tariffs are high (€0.35/kWh) and recharge late at night (€0.06/kWh).
              </p>

              <div style={{ padding: '1rem', background: '#ffffff', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Projected V2H Monthly Earnings</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#047857' }}>+ €62.40 / month</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Based on 3 kW peak discharge between 18:00 - 20:00</div>
              </div>

              <button 
                className={`btn-primary ${v2hDischarging ? 'active' : ''}`}
                style={{ width: 'fit-content', background: v2hDischarging ? '#d97706' : undefined }}
                onClick={() => setV2hDischarging(!v2hDischarging)}
              >
                <ArrowRightLeft size={16} /> {v2hDischarging ? 'Stop V2H Discharging Flow' : 'Toggle V2H Discharge Flow'}
              </button>
            </div>

            <div className="col-span-5" style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Simulated Energy Flow</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: v2hDischarging ? '#d97706' : '#64748b' }}>
                {v2hDischarging ? '⚡ EV ➔ HOUSE (3.5 kW Flow)' : '🅿️ EV Idle (Standby Ready)'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                EV Battery: 78% • Floor Limit: 30% SOC
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Neighborhood Battery Sharing & Local Microgrid */}
      {activeTab === 'community' && (
        <div className="glass-card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <Users size={20} color="var(--battery-cyan)" /> Neighborhood Energy Sharing & Community Battery
              </div>
              <div className="card-subtitle">Share excess rooftop solar with neighbors and pool storage capacity</div>
            </div>
          </div>

          <div className="grid-cols-12">
            <div className="col-span-6" style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0369a1', marginBottom: '0.5rem' }}>
                🏡 Peer-to-Peer Solar Trading
              </div>
              <p style={{ fontSize: '0.825rem', color: '#334155', lineHeight: 1.5, fontWeight: 500 }}>
                Sell surplus solar energy directly to your neighbor at House #14 for €0.12/kWh (higher than grid feed-in tariff of €0.08, lower than their grid price of €0.22).
              </p>
            </div>

            <div className="col-span-6" style={{ background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#047857', marginBottom: '0.5rem' }}>
                🔋 Community Battery Storage Pool
              </div>
              <p style={{ fontSize: '0.825rem', color: '#334155', lineHeight: 1.5, fontWeight: 500 }}>
                Access 100 kWh shared neighborhood battery installed at the local substation during winter months without individual capital expenditure.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Automated Flexibility Market Bidding */}
      {activeTab === 'market' && (
        <div className="glass-card">
          <div className="card-header">
            <div>
              <div className="card-title">
                <TrendingUp size={20} color="var(--solar-amber)" /> Automated Flexibility Market Bidding
              </div>
              <div className="card-subtitle">AI agent places bids on local ancillary frequency response markets (mFRR / aFRR)</div>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '1rem', fontWeight: 500 }}>
            VoltFlow's algorithmic bidding engine automatically places micro-bids to curtail consumption for 15-minute intervals when the national grid needs rapid frequency stabilization.
          </p>

          <div style={{ padding: '1rem', background: 'rgba(217, 119, 6, 0.08)', border: '1px solid rgba(217, 119, 6, 0.3)', borderRadius: '12px', fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 700, color: '#b45309' }}>📈 Frequency Balancing Market Status</div>
            <div style={{ fontSize: '0.825rem', color: '#0f172a', marginTop: '4px', fontWeight: 500 }}>
              Active Bid: 2.2 kW load reduction offered at €85.00 / MWh. Strategy: Auto-approved under low impact threshold.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
