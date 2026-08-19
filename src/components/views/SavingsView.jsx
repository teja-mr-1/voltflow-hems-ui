import React, { useState } from 'react';
import { useEnergy } from '../../context/EnergyContext';
import { 
  Award, 
  Leaf, 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2, 
  Car, 
  Users,
  TrendingUp,
  Zap
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { PolymarketScrubberChart } from '../PolymarketScrubberChart';
import { generateSavingsCumulativeHeartbeatData } from '../../utils/telemetryDataGenerator';

export const SavingsView = () => {
  const { userLimits, addNotification } = useEnergy();
  const [tariffStrategy, setTariffStrategy] = useState('balanced');

  const benchmarkData = [
    { category: 'Grid Shift Rewards', personal: 42, neighborhoodAvg: 18 },
    { category: 'Solar Self-Use', personal: 88, neighborhoodAvg: 55 },
    { category: 'Peak Shedding (kWh)', personal: 64, neighborhoodAvg: 30 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem' }}>Savings, Rewards & Tariff Strategy Control</h2>
        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>Choose your optimization strategy and manually claim DSO flexibility earnings.</div>
      </div>

      {/* ⚙️ Manual Tariff Strategy Selector + Claim Payout */}
      <div 
        className="glass-card" 
        data-demo="adv-savings-controls"
        data-explain-title="Optimization Strategy & Payouts"
        data-explain="Choose how aggressive you want your savings to be, and claim cash rewards you earned from the grid."
        style={{ padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1.5px solid rgba(5,150,105,0.2)', background: 'linear-gradient(135deg, #ffffff, #f8faff)' }}
      >
        <div className="action-cell-label" style={{ marginBottom: '1rem' }}>⚙️ Manual Controls</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start' }}>
          {/* Tariff Strategy Selector */}
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Optimization Strategy</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { id: 'aggressive', label: '⚡ Aggressive', sub: 'Max savings, may delay comfort', cls: 'rose', explain: 'Prioritizes maximum bill reduction, shifting appliance runs strictly to cheapest hours.' },
                { id: 'balanced', label: '⚖️ Balanced', sub: 'Savings + comfort blend', cls: 'emerald', explain: 'Even blend of money savings while keeping home temperature warm and EV ready.' },
                { id: 'comfort', label: '🛋️ Comfort First', sub: 'Prioritize comfort over savings', cls: 'cyan', explain: 'Ensures instantaneous heating and rapid charging whenever you need it.' },
              ].map(s => (
                <button 
                  key={s.id} 
                  className={`btn-action ${tariffStrategy === s.id ? s.cls : 'neutral'}`} 
                  onClick={() => { setTariffStrategy(s.id); addNotification('success', 'Strategy Updated', `Switched to ${s.label} optimization mode.`); }} 
                  data-explain-title={s.label}
                  data-explain={s.explain}
                  style={{
                    flex: 1, height: 'auto', flexDirection: 'column', padding: '0.6rem 0.5rem'
                  }}
                >
                  <span style={{ fontWeight: 800, fontSize: '0.75rem' }}>{s.label}</span>
                  <span style={{ fontSize: '0.65rem', marginTop: '2px', opacity: 0.75, fontWeight: 500 }}>{s.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Claim Payout */}
          <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Pending DSO Reward</div>
            <button
              className="btn-action emerald"
              onClick={() => addNotification('success', 'Payout Claimed!', 'DSO flexibility reward of €12.40 transferred to your energy wallet.')}
              data-explain-title="Claim Flexibility Reward"
              data-explain="Transfers your earned grid flexibility cash rewards (€12.40) directly into your energy wallet."
              style={{ width: 'auto', padding: '0.75rem 1.25rem', fontSize: '0.85rem', borderRadius: '10px' }}
            >
              <Zap size={16} style={{ marginRight: '6px' }} /> Claim €12.40 Reward
            </button>
          </div>
        </div>
      </div>

      {/* Financial Payback & Environmental Impact Counter Hero */}
      <div className="kpi-grid">
        <div 
          className="kpi-card solar"
          data-explain-title="Monthly Money Saved"
          data-explain="Total money saved on your electricity bill this month by shifting appliance use to cheap solar and night hours."
        >
          <div className="kpi-icon-wrap">
            <DollarSign size={24} />
          </div>
          <div>
            <div className="kpi-label">Total Money Saved This Month</div>
            <div className="kpi-val" style={{ color: 'var(--solar-amber)' }}>€148.50</div>
            <div className="kpi-subtext">+34% vs flat rate tariff</div>
          </div>
        </div>

        <div 
          className="kpi-card home"
          data-explain-title="Grid Flexibility Earnings"
          data-explain="Direct cash payments earned from the grid operator for helping relieve grid congestion during peak hours."
        >
          <div className="kpi-icon-wrap">
            <Award size={24} />
          </div>
          <div>
            <div className="kpi-label">Grid Flexibility Cash Earned</div>
            <div className="kpi-val" style={{ color: 'var(--primary-emerald)' }}>€42.80</div>
            <div className="kpi-subtext">DSO/TSO peak-response payout</div>
          </div>
        </div>

        <div 
          className="kpi-card battery"
          data-explain-title="Carbon CO2 Saved"
          data-explain="Total carbon dioxide emissions prevented this month by using rooftop solar instead of fossil fuel power plants."
        >
          <div className="kpi-icon-wrap">
            <Leaf size={24} />
          </div>
          <div>
            <div className="kpi-label">CO2 Carbon Footprint Avoided</div>
            <div className="kpi-val" style={{ color: 'var(--battery-cyan)' }}>184 kg</div>
            <div className="kpi-subtext">Equivalent to 9 mature trees</div>
          </div>
        </div>

        <div 
          className="kpi-card grid"
          data-explain-title="EV Departure Guarantee"
          data-explain="Confirmation that your electric car battery will be charged and ready to go before your morning commute."
        >
          <div className="kpi-icon-wrap">
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="kpi-label">EV Departure Guarantee</div>
            <div className="kpi-val" style={{ color: '#047857' }}>100% Ready</div>
            <div className="kpi-subtext">85% SOC by {userLimits.departureTime} AM</div>
          </div>
        </div>
      </div>

      {/* Personal Savings vs Neighborhood Benchmark */}
      <div 
        className="glass-card col-span-12"
        data-explain-title="Neighborhood Comparison Benchmark"
        data-explain="Compares your household solar usage, peak shifting, and rewards against the average home in your neighborhood."
      >
          <div className="card-header">
            <div>
              <div className="card-title">
                <Users size={18} color="var(--battery-cyan)" /> Personal Savings vs Neighborhood Household Benchmark
              </div>
            </div>
          </div>

          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={benchmarkData} layout="vertical">
                <XAxis type="number" stroke="var(--text-subtle)" fontSize={11} />
                <YAxis dataKey="category" type="category" stroke="var(--text-subtle)" fontSize={11} width={130} />
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Bar dataKey="personal" name="Your Household" fill="#059669" radius={[0, 4, 4, 0]} />
                <Bar dataKey="neighborhoodAvg" name="Neighborhood Avg" fill="#0284c7" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      {/* GRAPH 3: Pure 3-Line 30-Day Financial Returns & Net Earnings */}
      <div
        data-explain-title="30-Day Financial Earnings Graph"
        data-explain="Interactive timeline showing your cumulative daily bill savings, DSO cash payouts, and total net financial returns."
      >
        <PolymarketScrubberChart
          title="30-Day Cumulative Energy Savings, Flexibility Earnings & Net Returns"
          icon={TrendingUp}
          data={generateSavingsCumulativeHeartbeatData()}
          series1={{ key: 'cumulativeSavings', name: 'Tariff Shift Savings (€)', color: '#d97706', unit: ' €' }}
          series2={{ key: 'flexEarnings', name: 'DSO Cash Payout (€)', color: '#059669', unit: ' €' }}
          series3={{ key: 'netReturn', name: 'Net Financial Return (€)', color: '#7c3aed', unit: ' €' }}
          idPrefix="savingsScrubber"
        />
      </div>
    </div>
  );
};
