import React, { useEffect } from 'react';
import { useEnergy } from '../context/EnergyContext';
import { 
  Activity, 
  Cpu,
  Calendar, 
  Sliders,
  Radio,
  Award,
  ShieldCheck, 
  WifiOff,
  Rocket,
  Sparkles
} from 'lucide-react';

export const NavBar = ({ activeTab, setActiveTab }) => {
  const { isSmartPlanner, isKnowEverythingMode } = useEnergy();

  const allTabs = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: Activity,
      explainTitle: 'Overview View',
      explainText: 'Overview of live home energy, solar yield, and battery.',
      isEssential: true
    },
    { 
      id: 'devices', 
      label: 'Devices', 
      icon: Cpu,
      explainTitle: 'Devices View',
      explainText: 'Manage connected appliances, EV charger, and solar.',
      isEssential: true
    },
    { 
      id: 'scheduling', 
      label: 'Scheduling', 
      icon: Calendar,
      explainTitle: 'Scheduling View',
      explainText: 'Timetable showing when devices will run at lowest cost.',
      isEssential: true
    },
    { 
      id: 'controls', 
      label: 'Controls', 
      icon: Sliders,
      explainTitle: 'Controls View',
      explainText: 'Adjust battery reserve limits and EV charge deadlines.',
      isEssential: false
    },
    { 
      id: 'grid', 
      label: 'Grid Signals', 
      icon: Radio,
      explainTitle: 'Grid Signals View',
      explainText: 'Live electricity prices and power grid congestion.',
      isEssential: false
    },
    { 
      id: 'savings', 
      label: 'Savings', 
      icon: Award,
      explainTitle: 'Savings View',
      explainText: 'Money saved and cash rewards earned this month.',
      isEssential: false
    },
    { 
      id: 'privacy', 
      label: 'Privacy', 
      icon: ShieldCheck,
      explainTitle: 'Privacy View',
      explainText: 'Settings to keep your household energy data private.',
      isEssential: false
    },
    { 
      id: 'reliability', 
      label: 'Reliability', 
      icon: WifiOff,
      explainTitle: 'Reliability View',
      explainText: 'Blackout backup protection and emergency power reserve.',
      isEssential: false
    },
    { 
      id: 'future_lab', 
      label: 'Future Lab', 
      icon: Rocket,
      explainTitle: 'Future Lab View',
      explainText: 'Experimental Vehicle-to-Home energy sharing.',
      isEssential: false
    },
  ];

  const showAllTabs = !isSmartPlanner;
  const visibleTabs = showAllTabs ? allTabs : allTabs.filter(t => t.isEssential);

  // Auto-reset activeTab to 'overview' if the current tab is an advanced view tab and user switches to Smart Hands-Free
  useEffect(() => {
    if (!showAllTabs) {
      const isCurrentTabValid = visibleTabs.some(t => t.id === activeTab);
      if (!isCurrentTabValid) {
        setActiveTab('overview');
      }
    }
  }, [showAllTabs, activeTab, visibleTabs, setActiveTab]);

  return (
    <div style={{
      width: '100%',
      maxWidth: showAllTabs ? '100%' : '560px',
      margin: '0 auto',
      padding: '0.2rem 1.75rem 0.65rem 1.75rem',
      boxSizing: 'border-box',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <nav 
        className="nav-bar" 
        style={{ 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.35rem', 
          padding: '0.45rem 0.6rem',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
      >
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              className={`nav-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              data-explain-title={tab.explainTitle}
              data-explain={tab.explainText}
              style={{
                flex: 1,
                padding: '0.5rem 0.4rem',
                fontSize: '0.8rem',
                borderRadius: '10px',
                border: isActive ? '1px solid rgba(5, 150, 105, 0.4)' : '1px solid transparent',
                background: isActive ? 'rgba(5, 150, 105, 0.12)' : 'transparent',
                color: isActive ? '#047857' : '#475569',
                fontWeight: isActive ? 700 : 600,
                boxShadow: isActive ? '0 2px 8px rgba(5, 150, 105, 0.15)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease-in-out'
              }}
            >
              <Icon size={15} color={isActive ? '#059669' : '#64748b'} style={{ flexShrink: 0 }} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
