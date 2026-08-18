import React, { useState, useEffect } from 'react';
import { useEnergy } from '../context/EnergyContext';
import { HelpCircle, Sparkles, X } from 'lucide-react';

export const KnowEverythingInspector = () => {
  const { isKnowEverythingMode, toggleKnowEverythingMode } = useEnergy();
  const [hoverInfo, setHoverInfo] = useState(null);

  useEffect(() => {
    if (!isKnowEverythingMode) {
      setHoverInfo(null);
      return;
    }

    const handleMouseOver = (e) => {
      const explainEl = e.target.closest('[data-explain]') || 
                        e.target.closest('button') || 
                        e.target.closest('.glass-card') || 
                        e.target.closest('.kpi-card') || 
                        e.target.closest('.device-card') ||
                        e.target.closest('.nav-tab');

      if (!explainEl) {
        return;
      }

      let text = explainEl.getAttribute('data-explain');
      let label = explainEl.getAttribute('data-explain-title') || explainEl.getAttribute('aria-label');

      // Smart text generator if no explicit data-explain exists
      if (!text) {
        const titleEl = explainEl.querySelector('.card-title, h1, h2, h3, h4, .kpi-label, strong') || explainEl;
        const rawTitle = (titleEl ? titleEl.innerText : explainEl.innerText || '').trim();

        if (rawTitle) {
          const lower = rawTitle.toLowerCase();
          label = rawTitle.split('\n')[0].substring(0, 30);

          if (lower.includes('charger') || lower.includes('ev')) {
            text = 'Manages electric vehicle charge speed and battery target.';
          } else if (lower.includes('heat pump') || lower.includes('hvac') || lower.includes('temp')) {
            text = 'Controls home heating power and water pre-heat temperature.';
          } else if (lower.includes('battery') || lower.includes('powerwall') || lower.includes('storage')) {
            text = 'Manages home battery charging and solar power storage.';
          } else if (lower.includes('solar') || lower.includes('pv')) {
            text = 'Rooftop solar panels producing free clean electricity.';
          } else if (lower.includes('grid') || lower.includes('tariff') || lower.includes('price')) {
            text = 'Displays real-time electricity rates and grid demand.';
          } else if (lower.includes('saving') || lower.includes('reward') || lower.includes('cash')) {
            text = 'Tracks money saved and utility rewards earned.';
          } else if (lower.includes('privacy') || lower.includes('shield') || lower.includes('data')) {
            text = 'Keeps your household energy usage data private and local.';
          } else if (lower.includes('offline') || lower.includes('backup') || lower.includes('blackout')) {
            text = 'Ensures continuous power during grid outages.';
          } else if (lower.includes('v2h') || lower.includes('future') || lower.includes('vehicle')) {
            text = 'Allows your car battery to send power back into your home.';
          } else if (lower.includes('add') || lower.includes('device') || lower.includes('connect')) {
            text = 'Click to pair new smart appliances or EV chargers.';
          } else if (lower.includes('override') || lower.includes('pause')) {
            text = 'Temporarily stops automatic background power adjustments.';
          } else if (lower.includes('boost') || lower.includes('emergency')) {
            text = 'Forces maximum power to EV charging and heating immediately.';
          } else {
            // Clean dynamic text derived from title
            text = `Displays status and controls for ${label.toLowerCase()}.`;
          }
        } else {
          label = 'Control Button';
          text = 'Click to adjust this appliance setting.';
        }
      }

      const rect = explainEl.getBoundingClientRect();

      // Position tooltip neatly beside element
      let top = rect.top - 8;
      let left = rect.right + 12;

      // Adjust if overflowing right screen edge
      if (left + 240 > window.innerWidth) {
        left = Math.max(10, rect.left);
        top = rect.bottom + 8;
      }
      // Adjust if overflowing top
      if (top < 10) {
        top = rect.bottom + 8;
      }

      setHoverInfo({
        text,
        label,
        top,
        left,
      });
    };

    const handleMouseOut = (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest) {
        setHoverInfo(null);
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isKnowEverythingMode]);

  if (!isKnowEverythingMode) return null;

  return (
    <>
      {/* Bottom Floating Status Pill */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 99999,
        background: 'rgba(15, 23, 42, 0.94)',
        backdropFilter: 'blur(16px)',
        color: '#ffffff',
        padding: '0.55rem 0.95rem',
        borderRadius: '14px',
        border: '1px solid rgba(5, 150, 105, 0.4)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        fontSize: '0.8rem'
      }}>
        <div style={{
          background: '#059669',
          color: '#ffffff',
          borderRadius: '50%',
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justify: 'center'
        }}>
          <Sparkles size={14} />
        </div>
        <div>
          <div style={{ fontWeight: 800, color: '#34d399', fontSize: '0.82rem' }}>💡 Simple Explainer Active</div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Hover any card or button for instant details</div>
        </div>
        <button
          onClick={toggleKnowEverythingMode}
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: 'none',
            color: '#cbd5e1',
            padding: '3px 7px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginLeft: '0.4rem'
          }}
        >
          <X size={13} />
        </button>
      </div>

      {/* Precise Tooltip Box */}
      {hoverInfo && (
        <div style={{
          position: 'fixed',
          top: `${hoverInfo.top}px`,
          left: `${hoverInfo.left}px`,
          zIndex: 100000,
          maxWidth: '240px',
          background: '#ffffff',
          border: '1.5px solid #059669',
          borderRadius: '12px',
          padding: '0.6rem 0.85rem',
          boxShadow: '0 8px 24px rgba(5, 150, 105, 0.2), 0 2px 8px rgba(0,0,0,0.08)',
          pointerEvents: 'none',
          animation: 'fadeInTooltip 0.12s ease-out'
        }}>
          {hoverInfo.label && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.7rem',
              fontWeight: 800,
              color: '#047857',
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
              marginBottom: '3px'
            }}>
              <HelpCircle size={12} color="#059669" />
              {hoverInfo.label}
            </div>
          )}
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#0f172a',
            lineHeight: 1.35
          }}>
            {hoverInfo.text}
          </div>
        </div>
      )}
    </>
  );
};
