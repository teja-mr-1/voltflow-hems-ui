import React from 'react';
import { useEnergy } from '../../context/EnergyContext';
import { 
  Award, 
  Leaf, 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2, 
  Car, 
  Users,
  TrendingUp
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { PolymarketScrubberChart } from '../PolymarketScrubberChart';
import { generateSavingsCumulativeHeartbeatData } from '../../utils/telemetryDataGenerator';

export const SavingsView = () => {
  const { userLimits } = useEnergy();

  const benchmarkData = [
    { category: 'Grid Shift Rewards', personal: 42, neighborhoodAvg: 18 },
    { category: 'Solar Self-Use', personal: 88, neighborhoodAvg: 55 },
    { category: 'Peak Shedding (kWh)', personal: 64, neighborhoodAvg: 30 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem' }}>Savings, Rewards & Grid Impact Overview</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Track financial payback, DSO grid support earnings, CO2 reduction, and EV-Ready Guarantees
        </p>
      </div>

      {/* Financial Payback & Environmental Impact Counter Hero */}
      <div className="kpi-grid">
        <div className="kpi-card solar">
          <div className="kpi-icon-wrap">
            <DollarSign size={24} />
          </div>
          <div>
            <div className="kpi-label">Total Money Saved This Month</div>
            <div className="kpi-val" style={{ color: 'var(--solar-amber)' }}>€148.50</div>
            <div className="kpi-subtext">+34% vs flat rate tariff</div>
          </div>
        </div>

        <div className="kpi-card home">
          <div className="kpi-icon-wrap">
            <Award size={24} />
          </div>
          <div>
            <div className="kpi-label">Grid Flexibility Cash Earned</div>
            <div className="kpi-val" style={{ color: 'var(--primary-emerald)' }}>€42.80</div>
            <div className="kpi-subtext">DSO/TSO peak-response payout</div>
          </div>
        </div>

        <div className="kpi-card battery">
          <div className="kpi-icon-wrap">
            <Leaf size={24} />
          </div>
          <div>
            <div className="kpi-label">CO2 Carbon Footprint Avoided</div>
            <div className="kpi-val" style={{ color: 'var(--battery-cyan)' }}>184 kg</div>
            <div className="kpi-subtext">Equivalent to 9 mature trees</div>
          </div>
        </div>

        <div className="kpi-card grid">
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

      {/* Main Grid: EV-Ready Guarantee Badge & Personal vs Community Benchmark */}
      <div className="grid-cols-12">
        {/* EV-Ready Guarantee Card */}
        <div className="glass-card col-span-5" style={{
          background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(255, 255, 255, 0.95))',
          border: '1px solid rgba(5, 150, 105, 0.3)'
        }}>
          <div className="card-header">
            <div>
              <div className="card-title" style={{ color: '#047857' }}>
                <Car size={20} /> Official EV-Ready Guarantee Badge
              </div>
              <div className="card-subtitle">System commitment verifying required departure battery level</div>
            </div>
            <div className="pill-badge green" style={{ padding: '4px 10px' }}>Active Guarantee</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#ffffff', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(5, 150, 105, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                <CheckCircle2 size={28} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>Departure Target Confirmed</div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  Target 85% Battery by <strong>{userLimits.departureTime} AM</strong> tomorrow.
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.5, fontWeight: 500 }}>
              🔒 <strong>Guarantee Mechanics:</strong> If dynamic grid prices spike unexpectedly, VoltFlow will automatically override economic constraints to ensure your vehicle charges at full rate before your deadline.
            </div>
          </div>
        </div>

        {/* Personal Savings vs Neighborhood Benchmark */}
        <div className="glass-card col-span-7">
          <div className="card-header">
            <div>
              <div className="card-title">
                <Users size={18} color="var(--battery-cyan)" /> Personal Savings vs Neighborhood Household Benchmark
              </div>
              <div className="card-subtitle">Comparison between your home flexibility contribution and city average</div>
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
      </div>

      {/* GRAPH 3: Pure 3-Line 30-Day Financial Returns & Net Earnings */}
      <PolymarketScrubberChart
        title="30-Day Cumulative Energy Savings, Flexibility Earnings & Net Returns"
        subtitle="Cumulative cost optimization and grid flexibility earnings"
        icon={TrendingUp}
        data={generateSavingsCumulativeHeartbeatData()}
        series1={{ key: 'cumulativeSavings', name: 'Tariff Shift Savings (€)', color: '#d97706', unit: ' €' }}
        series2={{ key: 'flexEarnings', name: 'DSO Cash Payout (€)', color: '#059669', unit: ' €' }}
        series3={{ key: 'netReturn', name: 'Net Financial Return (€)', color: '#7c3aed', unit: ' €' }}
        idPrefix="savingsScrubber"
      />
    </div>
  );
};
