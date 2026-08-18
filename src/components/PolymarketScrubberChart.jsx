import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine, 
  ReferenceDot 
} from 'recharts';
import { Activity, Clock } from 'lucide-react';

export const PolymarketScrubberChart = ({ 
  title, 
  subtitle,
  icon: IconComponent = Activity, 
  data = [], 
  series1 = { key: 'solarKw', name: 'Solar PV', color: '#059669', unit: ' kW' },
  series2 = { key: 'homeKw', name: 'Home Load', color: '#0284c7', unit: ' kW' },
  series3 = { key: 'gridKw', name: 'Grid / Storage', color: '#e11d48', unit: ' kW' },
  idPrefix = 'lineChart'
}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  // Fallback to latest index if not scrubbing
  const currentIdx = activeIndex !== null ? activeIndex : data.length - 1;
  const activeData = data[currentIdx] || data[0] || {};

  // Percentage along the horizontal axis for Dynamic Line Color Reveal/Shed
  const stopPercent = activeIndex !== null && data.length > 1
    ? Math.max(1, Math.min(100, (activeIndex / (data.length - 1)) * 100))
    : 100;

  const stroke1Id = `${idPrefix}_stroke1`;
  const stroke2Id = `${idPrefix}_stroke2`;
  const stroke3Id = `${idPrefix}_stroke3`;

  const handleMouseMove = (state) => {
    if (state && state.activeTooltipIndex !== undefined && state.activeTooltipIndex !== null) {
      setActiveIndex(state.activeTooltipIndex);
    }
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="glass-card" style={{ padding: '1.4rem' }}>
      {/* Header & Interactive Scrubber Pill Header */}
      <div className="card-header" style={{ marginBottom: '1.1rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <div className="card-title" style={{ color: '#0f172a', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <IconComponent size={18} color="#059669" /> {title}
          </div>
          {subtitle && <div className="card-subtitle" style={{ fontSize: '0.8rem', color: '#64748b' }}>{subtitle}</div>}
        </div>

        {/* Live Interactive Telemetry Pill Badge Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '0.45rem 0.85rem',
          borderRadius: '12px',
          border: '1px solid rgba(5, 150, 105, 0.25)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          flexWrap: 'wrap'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            fontWeight: 800,
            color: '#047857',
            background: 'rgba(5, 150, 105, 0.1)',
            padding: '2px 8px',
            borderRadius: '6px'
          }}>
            <Clock size={12} />
            {activeData.time || 'LIVE'}
          </div>

          {/* Series 1 Badge */}
          {series1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 700 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: series1.color }} />
              <span style={{ color: '#64748b', fontWeight: 600 }}>{series1.name}:</span>
              <span style={{ color: series1.color }}>{activeData[series1.key] !== undefined ? activeData[series1.key] : 0}{series1.unit}</span>
            </div>
          )}

          {/* Series 2 Badge */}
          {series2 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 700 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: series2.color }} />
              <span style={{ color: '#64748b', fontWeight: 600 }}>{series2.name}:</span>
              <span style={{ color: series2.color }}>{activeData[series2.key] !== undefined ? activeData[series2.key] : 0}{series2.unit}</span>
            </div>
          )}

          {/* Series 3 Badge */}
          {series3 && activeData[series3.key] !== undefined && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 700 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: series3.color }} />
              <span style={{ color: '#64748b', fontWeight: 600 }}>{series3.name}:</span>
              <span style={{ color: series3.color }}>{activeData[series3.key]}{series3.unit}</span>
            </div>
          )}

          {activeData.status && (
            <span className={`pill-badge ${activeData.statusColor || 'green'}`} style={{ fontSize: '0.7rem', padding: '2px 7px' }}>
              {activeData.status}
            </span>
          )}
        </div>
      </div>

      {/* Pure 3-Line Smooth Telemetry Canvas (NO Area Fill) */}
      <div style={{ height: '240px', width: '100%', position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
          >
            <defs>
              {/* Series 1 Stroke Gradient (Solid before cursor, sheds/fades after cursor) */}
              {series1 && (
                <linearGradient id={stroke1Id} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={series1.color} stopOpacity={1} />
                  <stop offset={`${stopPercent}%`} stopColor={series1.color} stopOpacity={1} />
                  <stop offset={`${stopPercent}%`} stopColor={series1.color} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={series1.color} stopOpacity={0.15} />
                </linearGradient>
              )}

              {/* Series 2 Stroke Gradient */}
              {series2 && (
                <linearGradient id={stroke2Id} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={series2.color} stopOpacity={1} />
                  <stop offset={`${stopPercent}%`} stopColor={series2.color} stopOpacity={1} />
                  <stop offset={`${stopPercent}%`} stopColor={series2.color} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={series2.color} stopOpacity={0.15} />
                </linearGradient>
              )}

              {/* Series 3 Stroke Gradient */}
              {series3 && (
                <linearGradient id={stroke3Id} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={series3.color} stopOpacity={1} />
                  <stop offset={`${stopPercent}%`} stopColor={series3.color} stopOpacity={1} />
                  <stop offset={`${stopPercent}%`} stopColor={series3.color} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={series3.color} stopOpacity={0.15} />
                </linearGradient>
              )}
            </defs>

            <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              interval={data.length > 30 ? Math.floor(data.length / 8) : 'preserveEnd'} 
              minTickGap={35}
            />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit={series1.unit.trim()} />

            {/* Glass Tooltip */}
            <Tooltip 
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.96)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(5, 150, 105, 0.3)',
                    borderRadius: '10px',
                    padding: '0.6rem 0.9rem',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                    fontSize: '0.78rem'
                  }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>⏱ {d.time}</div>
                    {series1 && d[series1.key] !== undefined && (
                      <div style={{ color: series1.color, fontWeight: 700 }}>
                        {series1.name}: {d[series1.key]}{series1.unit}
                      </div>
                    )}
                    {series2 && d[series2.key] !== undefined && (
                      <div style={{ color: series2.color, fontWeight: 700, marginTop: '2px' }}>
                        {series2.name}: {d[series2.key]}{series2.unit}
                      </div>
                    )}
                    {series3 && d[series3.key] !== undefined && (
                      <div style={{ color: series3.color, fontWeight: 700, marginTop: '2px' }}>
                        {series3.name}: {d[series3.key]}{series3.unit}
                      </div>
                    )}
                  </div>
                );
              }}
            />

            {/* Vertical Crosshair Scrubber Reference Line */}
            {activeData && activeData.time && (
              <ReferenceLine 
                x={activeData.time} 
                stroke="#64748b" 
                strokeWidth={1.5} 
                strokeDasharray="3 3" 
              />
            )}

            {/* Solid Intersection Circle Pins on the 3 Lines at Cursor */}
            {series1 && activeData && activeData[series1.key] !== undefined && (
              <ReferenceDot 
                x={activeData.time} 
                y={activeData[series1.key]} 
                r={4.5} 
                fill={series1.color} 
                stroke="#ffffff" 
                strokeWidth={2} 
              />
            )}
            {series2 && activeData && activeData[series2.key] !== undefined && (
              <ReferenceDot 
                x={activeData.time} 
                y={activeData[series2.key]} 
                r={4.5} 
                fill={series2.color} 
                stroke="#ffffff" 
                strokeWidth={2} 
              />
            )}
            {series3 && activeData && activeData[series3.key] !== undefined && (
              <ReferenceDot 
                x={activeData.time} 
                y={activeData[series3.key]} 
                r={4.5} 
                fill={series3.color} 
                stroke="#ffffff" 
                strokeWidth={2} 
              />
            )}

            {/* Series 1 Crisp Thin Line with Dynamic Stroke Gradient */}
            {series1 && (
              <Line 
                type="monotone" 
                dataKey={series1.key} 
                name={series1.name} 
                stroke={`url(#${stroke1Id})`}
                strokeWidth={1.5}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            )}

            {/* Series 2 Crisp Thin Line with Dynamic Stroke Gradient */}
            {series2 && (
              <Line 
                type="monotone" 
                dataKey={series2.key} 
                name={series2.name} 
                stroke={`url(#${stroke2Id})`}
                strokeWidth={1.5}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            )}

            {/* Series 3 Crisp Thin Line with Dynamic Stroke Gradient */}
            {series3 && (
              <Line 
                type="monotone" 
                dataKey={series3.key} 
                name={series3.name} 
                stroke={`url(#${stroke3Id})`}
                strokeWidth={1.5}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
