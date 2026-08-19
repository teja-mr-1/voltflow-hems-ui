import React, { useState } from 'react';
import { useEnergy } from '../../context/EnergyContext';
import { 
  Car, 
  Users, 
  TrendingUp, 
  ArrowRightLeft,
  Zap,
  Share2,
  Sliders
} from 'lucide-react';

export const FutureLabView = () => {
  const { addNotification } = useEnergy();
  const [activeTab, setActiveTab] = useState('v2h');
  const [v2hDischarging, setV2hDischarging] = useState(false);
  const [communityExport, setCommunityExport] = useState(false);
  const [communityBattery, setCommunityBattery] = useState(false);
  const [bidKw, setBidKw] = useState(2.2);
  const [bidActive, setBidActive] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem' }}>Future Energy Innovation Lab</h2>
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>Manually activate next-generation energy features. You control if and when they run.</div>
      </div>

      {/* Feature Selector Tabs */}
      <div data-demo="futurelab-nav" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'v2h', label: 'Vehicle-to-Home (V2H)', icon: Car, explain: 'Power your house from your electric car during expensive hours.' },
          { id: 'community', label: 'Neighborhood Battery Sharing', icon: Users, explain: 'Trade clean solar power with nearby neighbors or join a shared battery pool.' },
          { id: 'market', label: 'Flexibility Market Bidding', icon: TrendingUp, explain: 'Bid power reductions into the electricity grid to earn cash payouts.' },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button 
              key={tab.id}
              id={`btn-future-${tab.id}`}
              className={`btn-secondary ${activeTab === tab.id ? 'active' : ''}`}
              data-explain-title={tab.label}
              data-explain={tab.explain}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
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

      {/* Tab 1: Vehicle-to-Home (V2H) */}
      {activeTab === 'v2h' && (
        <div 
          className="glass-card" 
          data-demo="futurelab-v2h-card"
          data-explain-title="Vehicle-to-Home (V2H) Power Flow"
          data-explain="Uses your electric car as a home battery to power your lights and appliances when grid electricity is expensive."
        >
          <div className="card-header">
            <div>
              <div className="card-title">
                <Car size={20} color="var(--primary-emerald)" /> Vehicle-to-Home (V2H) Bidirectional Flow
              </div>
            </div>
            <div className="pill-badge green">V2H Hardware Compatible</div>
          </div>

          <div className="grid-cols-12" style={{ alignItems: 'center', marginTop: '0.5rem' }}>
            <div className="col-span-7" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div 
                style={{ padding: '1rem', background: '#ffffff', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.08)' }}
                data-explain-title="V2H Monthly Earnings"
                data-explain="Estimated extra cash saved per month by powering your home from stored car battery electricity."
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Projected V2H Monthly Earnings</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#047857' }}>+ €62.40 / month</div>
              </div>

              {/* V2H SOC Floor Slider */}
              <div
                data-explain-title="V2H Battery Safety Floor"
                data-explain="Discharge limit: stops drawing power from your car once battery hits this percentage to protect your driving range."
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>
                  <span>EV Battery Floor Limit (stop discharging below)</span>
                  <span style={{ color: '#047857', fontWeight: 800 }}>30% SOC</span>
                </div>
                <input type="range" min="20" max="60" defaultValue="30" style={{ width: '100%', accentColor: '#059669' }} />
              </div>

              <button 
                className={`btn-primary ${v2hDischarging ? 'active' : ''}`}
                style={{ width: 'fit-content', background: v2hDischarging ? '#d97706' : undefined }}
                data-explain-title="Activate V2H Discharge"
                data-explain="Immediately starts powering your home from your electric car battery."
                onClick={() => {
                  setV2hDischarging(!v2hDischarging);
                  addNotification(
                    v2hDischarging ? 'info' : 'warning',
                    v2hDischarging ? 'V2H Stopped' : 'V2H Active',
                    v2hDischarging ? 'EV stopped discharging to home.' : 'Tesla now powering home at 3.5 kW.'
                  );
                }}
              >
                <ArrowRightLeft size={16} /> {v2hDischarging ? 'Stop V2H Discharging Flow' : 'Activate V2H Discharge Now'}
              </button>
            </div>

            <div 
              className="col-span-5" 
              data-explain-title="Live V2H Flow Monitor"
              data-explain="Shows whether electricity is actively flowing from your car into the home or standing by."
              style={{ background: '#ffffff', padding: '1.25rem', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(0,0,0,0.08)' }}
            >
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Live Energy Flow</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: v2hDischarging ? '#d97706' : '#64748b' }}>
                {v2hDischarging ? '⚡ EV ➔ HOUSE (3.5 kW)' : '🅿️ EV Idle (Standby Ready)'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                EV Battery: 78% &nbsp;·&nbsp; Floor: 30% SOC
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Neighborhood Battery Sharing */}
      {activeTab === 'community' && (
        <div 
          className="glass-card" 
          data-demo="futurelab-community-card"
          data-explain-title="Neighborhood Energy Sharing"
          data-explain="Trade surplus solar energy directly with your neighbors or pool battery capacity for community resilience."
        >
          <div className="card-header">
            <div>
              <div className="card-title">
                <Users size={20} color="var(--battery-cyan)" /> Neighborhood Energy Sharing &amp; Community Battery
              </div>
            </div>
            <div className="pill-badge" style={{ background: 'rgba(2,132,199,0.1)', color: '#0369a1' }}>Beta Feature</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Peer Solar Export Toggle */}
            <div 
              data-explain-title="Peer-to-Peer Solar Export"
              data-explain="Sell extra daytime solar power directly to neighboring homes at €0.14/kWh instead of standard grid export."
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.1rem', background: communityExport ? 'rgba(5,150,105,0.07)' : '#ffffff', borderRadius: '12px', border: `1px solid ${communityExport ? 'rgba(5,150,105,0.3)' : 'rgba(0,0,0,0.08)'}` }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: communityExport ? '#047857' : '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Share2 size={16} /> 🏡 Peer-to-Peer Solar Export
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px' }}>Sell surplus solar to neighbours at €0.14/kWh — above grid export rate.</div>
              </div>
              <div className={`switch-toggle ${communityExport ? 'active' : ''}`} onClick={() => {
                setCommunityExport(!communityExport);
                addNotification(communityExport ? 'info' : 'success', communityExport ? 'P2P Stopped' : 'P2P Export Active', communityExport ? 'Stopped selling to neighbours.' : 'Now selling surplus solar to Block C neighbours.');
              }}>
                <div className="switch-handle" />
              </div>
            </div>

            {/* Community Battery Pool Toggle */}
            <div 
              data-explain-title="Community Battery Pool Opt-In"
              data-explain="Join your Powerwall to a shared 120 kWh neighborhood battery pool to help neighbors and earn €8.20/month."
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.1rem', background: communityBattery ? 'rgba(2,132,199,0.07)' : '#ffffff', borderRadius: '12px', border: `1px solid ${communityBattery ? 'rgba(2,132,199,0.3)' : 'rgba(0,0,0,0.08)'}` }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: communityBattery ? '#0369a1' : '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={16} /> 🔋 Community Battery Pool Opt-In
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '3px' }}>Your Powerwall contributes to a shared 120 kWh neighbourhood reserve. Earn €8.20/month.</div>
              </div>
              <div className={`switch-toggle ${communityBattery ? 'active' : ''}`} onClick={() => {
                setCommunityBattery(!communityBattery);
                addNotification(communityBattery ? 'info' : 'success', communityBattery ? 'Pool Exited' : 'Community Pool Joined', communityBattery ? 'Removed from community battery pool.' : 'Powerwall now part of Block B shared reserve.');
              }}>
                <div className="switch-handle" />
              </div>
            </div>

            {/* Neighbourhood status */}
            <div 
              data-explain-title="Neighborhood Cluster Status"
              data-explain="Live status of participating homes on your electrical transformer block."
              style={{ padding: '0.85rem 1rem', background: '#f8faff', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.07)', fontSize: '0.82rem', color: '#334155' }}
            >
              <strong>Neighbourhood Block C Status:</strong>&nbsp; 6 of 12 households opted in. Shared reserve: 72 kWh available. Avg export rate: €0.14/kWh.
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Flexibility Market Bidding */}
      {activeTab === 'market' && (
        <div 
          className="glass-card" 
          data-demo="futurelab-market-card"
          data-explain-title="Flexibility Market Bidding"
          data-explain="Offer unused household power back to the grid during high-demand moments in exchange for peak payout cash."
        >
          <div className="card-header">
            <div>
              <div className="card-title">
                <TrendingUp size={20} color="var(--solar-amber)" /> Flexibility Market Bidding
              </div>
            </div>
            <div className={`pill-badge ${bidActive ? 'green' : ''}`} style={!bidActive ? { background: 'rgba(0,0,0,0.06)', color: '#64748b' } : {}}>
              {bidActive ? '● Bid Active' : '○ No Active Bid'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {/* Bid Size Slider */}
            <div
              data-explain-title="Load Reduction Bid Slider"
              data-explain="Choose how many kilowatts (kW) of household power you want to offer to cut during grid peak events."
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                <span><Sliders size={13} style={{ display: 'inline', marginRight: '5px' }} />Manual Bid Size</span>
                <span style={{ color: '#d97706', fontWeight: 800 }}>{bidKw.toFixed(1)} kW load reduction</span>
              </div>
              <input type="range" min="0.5" max="7" step="0.1" value={bidKw} onChange={e => setBidKw(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#d97706' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94a3b8' }}>
                <span>0.5 kW (Min)</span><span>7.0 kW (Max — Full EV Shed)</span>
              </div>
            </div>

            {/* Current Bid Status */}
            <div 
              data-explain-title="Market Bid Status"
              data-explain="Shows whether your offer is active on the regional grid frequency balancing exchange."
              style={{ padding: '1rem', background: bidActive ? 'rgba(217,119,6,0.08)' : '#ffffff', border: `1px solid ${bidActive ? 'rgba(217,119,6,0.3)' : 'rgba(0,0,0,0.08)'}`, borderRadius: '12px' }}
            >
              <div style={{ fontWeight: 700, color: '#b45309', fontSize: '0.875rem' }}>📈 Frequency Balancing Market</div>
              <div style={{ fontSize: '0.825rem', color: '#0f172a', marginTop: '4px', fontWeight: 500 }}>
                {bidActive ? `Active Bid: ${bidKw.toFixed(1)} kW load reduction offered at €85.00 / MWh` : 'No active bid. Use the slider and submit to enter the market.'}
              </div>
            </div>

            {/* Bid Actions */}
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => { setBidActive(true); addNotification('success', 'Bid Submitted', `${bidKw.toFixed(1)} kW reduction bid placed at €85/MWh on balancing market.`); }}
                data-explain-title="Submit Market Bid"
                data-explain="Sends your power reduction offer to the regional grid market to earn cash payments."
                style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1.5px solid rgba(5,150,105,0.4)', background: 'rgba(5,150,105,0.08)', color: '#047857', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                ✓ Submit Bid to Market
              </button>
              <button
                onClick={() => { setBidActive(false); addNotification('warning', 'Bid Withdrawn', 'Removed your household from the current balancing market round.'); }}
                data-explain-title="Withdraw Market Bid"
                data-explain="Cancels your market bid so your appliances can run normally without reductions."
                style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: '1.5px solid rgba(225,29,72,0.3)', background: 'rgba(225,29,72,0.06)', color: '#be123c', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                ✕ Withdraw from Market
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
