import React from 'react';
import { 
  Activity, 
  Cpu,
  Calendar, 
  Sliders,
  Radio,
  Award,
  ShieldCheck, 
  WifiOff,
  Rocket
} from 'lucide-react';

export const NavBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: Activity,
      explainTitle: 'Overview View',
      explainText: 'Overview of live home energy, solar yield, and battery.'
    },
    { 
      id: 'devices', 
      label: 'Devices', 
      icon: Cpu,
      explainTitle: 'Devices View',
      explainText: 'Manage connected appliances, EV charger, and solar.'
    },
    { 
      id: 'scheduling', 
      label: 'Scheduling', 
      icon: Calendar,
      explainTitle: 'Scheduling View',
      explainText: 'Timetable showing when devices will run at lowest cost.'
    },
    { 
      id: 'controls', 
      label: 'Controls', 
      icon: Sliders,
      explainTitle: 'Controls View',
      explainText: 'Adjust battery reserve limits and EV charge deadlines.'
    },
    { 
      id: 'grid', 
      label: 'Grid Signals', 
      icon: Radio,
      explainTitle: 'Grid Signals View',
      explainText: 'Live electricity prices and power grid congestion.'
    },
    { 
      id: 'savings', 
      label: 'Savings', 
      icon: Award,
      explainTitle: 'Savings View',
      explainText: 'Money saved and cash rewards earned this month.'
    },
    { 
      id: 'privacy', 
      label: 'Privacy', 
      icon: ShieldCheck,
      explainTitle: 'Privacy View',
      explainText: 'Settings to keep your household energy data private.'
    },
    { 
      id: 'reliability', 
      label: 'Reliability', 
      icon: WifiOff,
      explainTitle: 'Reliability View',
      explainText: 'Blackout backup protection and emergency power reserve.'
    },
    { 
      id: 'future_lab', 
      label: 'Future Lab', 
      icon: Rocket,
      explainTitle: 'Future Lab View',
      explainText: 'Experimental Vehicle-to-Home energy sharing.'
    },
  ];

  return (
    <div style={{
      width: '100%',
      margin: '0 auto',
      padding: '0.2rem 1.75rem 0.65rem 1.75rem',
      boxSizing: 'border-box'
    }}>
      <nav 
        className="nav-bar" 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.25rem', 
          padding: '0.45rem 0.6rem',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          width: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {tabs.map((tab) => {
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
                padding: '0.45rem 0.35rem',
                fontSize: '0.78rem',
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
