import React, { useEffect, useState } from 'react';
import { useEnergy } from '../context/EnergyContext';
import { Zap, Pause, Flame, Info, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export const LiveSignificanceBanner = () => {
  const { lastActionSignificance, setLastActionSignificance } = useEnergy();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (lastActionSignificance) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 6500); // Display for 6.5 seconds
      return () => clearTimeout(timer);
    }
  }, [lastActionSignificance]);

  if (!visible || !lastActionSignificance) return null;

  const { title, significance, reaction, iconType } = lastActionSignificance;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 99999,
      maxWidth: '420px',
      width: '90%',
      background: '#ffffff',
      border: '1px solid rgba(5, 150, 105, 0.3)',
      borderRadius: '18px',
      padding: '1.1rem 1.25rem',
      boxShadow: '0 12px 36px rgba(0, 0, 0, 0.14), 0 0 20px rgba(5, 150, 105, 0.15)',
      animation: 'slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.65rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(5, 150, 105, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            color: '#059669',
            flexShrink: 0
          }}>
            {iconType === 'flame' ? <Flame size={18} color="#e11d48" /> : iconType === 'pause' ? <Pause size={18} color="#d97706" /> : <Zap size={18} color="#059669" />}
          </div>
          <div>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#059669' }}>
              ⚡ Button Significance & Impact
            </span>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              {title}
            </div>
          </div>
        </div>

        <button className="close-btn" style={{ width: 26, height: 26 }} onClick={() => setVisible(false)}>
          <X size={14} />
        </button>
      </div>

      <div style={{ fontSize: '0.78rem', color: '#334155', lineHeight: 1.45, background: '#faf8f4', padding: '0.6rem 0.75rem', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.06)' }}>
        <strong style={{ color: '#0f172a' }}>🎯 Why this button exists:</strong> {significance}
      </div>

      <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
        <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
        <span><strong>Live System Reaction:</strong> {reaction}</span>
      </div>
    </div>
  );
};
