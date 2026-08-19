import React, { createContext, useContext, useState, useEffect } from 'react';

const EnergyContext = createContext();

export const EnergyProvider = ({ children }) => {
  // Theme Mode ('warm_cream' default sand theme)
  const [theme, setTheme] = useState('warm_cream');

  // View Density Mode ('essential' default serene mode | 'pro' full telemetry)
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('voltflow_viewMode') || 'essential');

  // Master Control Mode: true = Smart Autonomous Planner (Ultra-Minimal) | false = Manual Override
  const [isSmartPlanner, setIsSmartPlanner] = useState(() => {
    const saved = localStorage.getItem('voltflow_isSmartPlanner');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('voltflow_isSmartPlanner', JSON.stringify(isSmartPlanner));
  }, [isSmartPlanner]);

  // Sync viewMode to localStorage
  useEffect(() => {
    localStorage.setItem('voltflow_viewMode', viewMode);
  }, [viewMode]);

  // 1. Grid Traffic Light Signal ('green' | 'yellow' | 'red')
  const [gridStatus, setGridStatus] = useState('green'); // default green

  // 2. Override & Emergency State
  const [isGlobalPaused, setIsGlobalPaused] = useState(false);
  const [pauseTimer, setPauseTimer] = useState(0);
  const [isEmergencyBoost, setIsEmergencyBoost] = useState(false);
  const [boostTimer, setBoostTimer] = useState(0);

  // 3. System Control Mode ('auto' | 'approval' | 'recommendation')
  const [controlMode, setControlMode] = useState('auto');

  // 4. Active Household Profile ('family' | 'shared_ev' | 'landlord')
  const [userProfile, setUserProfile] = useState('family');

  // 5. User Priorities & Limits
  const [userLimits, setUserLimits] = useState(() => {
    const saved = localStorage.getItem('voltflow_userLimits');
    return saved ? JSON.parse(saved) : {
      minEvSoc: 25,
      departureTime: '07:30',
      targetTemp: 21.0,
      tempFlexibility: 1.5,
      flexGridMode: true,
      priorityOrder: ['ev_charger', 'battery_storage', 'heat_pump', 'smart_washer'],
    };
  });

  useEffect(() => {
    localStorage.setItem('voltflow_userLimits', JSON.stringify(userLimits));
  }, [userLimits]);

  // 6. Connected Device Fleet Telemetry
  const [devices, setDevices] = useState([
    {
      id: 'ev_charger',
      name: 'Tesla Wall Connector Gen 3',
      category: 'EV Charger',
      status: 'charging',
      powerKw: 7.4,
      health: 'Optimal',
      batterySoc: 64,
      targetSoc: 85,
      deadline: '07:30 AM',
      isPriority: true,
      lastPing: '2 sec ago',
      guaranteeActive: true,
    },
    {
      id: 'battery_storage',
      name: 'Tesla Powerwall 2',
      category: 'Home Battery',
      status: 'discharging',
      powerKw: 3.2,
      capacityKwh: 13.5,
      soc: 78,
      health: '100%',
      lastPing: '1 sec ago',
      guaranteeActive: true,
    },
    {
      id: 'solar_pv',
      name: 'Enphase Solar Microinverter Array',
      category: 'Solar PV',
      status: 'producing',
      powerKw: 5.8,
      peakTodayKw: 6.4,
      health: '98%',
      lastPing: '5 sec ago',
      guaranteeActive: true,
    },
    {
      id: 'heat_pump',
      name: 'Daikin Altherma 3 Heat Pump',
      category: 'HVAC / Heating',
      status: 'modulating',
      powerKw: 1.5,
      currentTemp: 20.8,
      targetTemp: 21.0,
      health: 'Good',
      lastPing: '10 sec ago',
      guaranteeActive: true,
    },
    {
      id: 'smart_washer',
      name: 'Bosch HomeConnect Washer Series 8',
      category: 'Major Appliance',
      status: 'scheduled',
      powerKw: 0.0,
      scheduledTime: '22:30 PM',
      health: 'Standby',
      lastPing: '1 min ago',
      guaranteeActive: false,
    },
    {
      id: 'offline_dryer',
      name: 'Miele Heat Pump Dryer',
      category: 'Major Appliance',
      status: 'offline',
      powerKw: 0.0,
      health: 'Connection Lost',
      lastPing: '42 mins ago',
      guaranteeActive: false,
    },
  ]);

  // 7. Dynamic Electricity Prices (€/kWh) for 24 hours
  const [priceForecast] = useState([
    { hour: '00:00', price: 0.08, solarKw: 0.0, demand: 1.8, isGreenWindow: true },
    { hour: '02:00', price: 0.06, solarKw: 0.0, demand: 1.2, isGreenWindow: true },
    { hour: '04:00', price: 0.05, solarKw: 0.0, demand: 1.1, isGreenWindow: true },
    { hour: '06:00', price: 0.12, solarKw: 0.4, demand: 2.8, isGreenWindow: false },
    { hour: '08:00', price: 0.24, solarKw: 2.1, demand: 4.5, isGreenWindow: false },
    { hour: '10:00', price: 0.18, solarKw: 4.8, demand: 3.2, isGreenWindow: true },
    { hour: '12:00', price: 0.11, solarKw: 6.2, demand: 2.5, isGreenWindow: true },
    { hour: '14:00', price: 0.09, solarKw: 5.9, demand: 2.2, isGreenWindow: true },
    { hour: '16:00', price: 0.15, solarKw: 3.5, demand: 3.8, isGreenWindow: false },
    { hour: '18:00', price: 0.32, solarKw: 0.8, demand: 6.9, isGreenWindow: false }, // PEAK RED TARIFF
    { hour: '20:00', price: 0.28, solarKw: 0.0, demand: 5.2, isGreenWindow: false },
    { hour: '22:00', price: 0.07, solarKw: 0.0, demand: 2.1, isGreenWindow: true },
  ]);

  // 8. Granular Privacy & Data Sharing Permissions
  const [privacySettings, setPrivacySettings] = useState({
    householdProfile: true,
    calendarAccess: true,
    evChargingData: true,
    applianceTelemetry: false, // OFF by default to demonstrate DSO privacy shield!
    dsoAggregatedSharing: true,
    tsoMarketParticipation: true,
  });

  // 9. Notifications System
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'EV Charging Shifted',
      message: 'Local peak demand detected at 18:00. Charging moved to 22:30. EV-Ready Guarantee confirmed for 07:30 AM.',
      time: '12 mins ago',
      read: false,
    },
    {
      id: 2,
      type: 'warning',
      title: 'Device Connection Alert',
      message: 'Miele Heat Pump Dryer lost Wi-Fi connection. Fallback default timer active.',
      time: '42 mins ago',
      read: false,
    },
    {
      id: 3,
      type: 'success',
      title: 'Grid Flexibility Reward Earned',
      message: 'You earned €1.85 by discharging battery storage during peak grid congestion.',
      time: '2 hours ago',
      read: true,
    },
  ]);

  // 10. Audit Log History
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, timestamp: '11:15 AM', actor: 'Automated AI Engine', action: 'Paused EV charging due to yellow grid signal alert' },
    { id: 2, timestamp: '10:30 AM', actor: 'DSO Flexibility Portal', action: 'Queried aggregated shed capacity (2.5 kW ready)' },
    { id: 3, timestamp: '08:45 AM', actor: 'User (Primary Resident)', action: 'Updated EV target SOC deadline to 07:30 AM' },
    { id: 4, timestamp: '07:00 AM', actor: 'System Fallback Engine', action: 'Verified safe local solar priority mode operational' },
  ]);

  // 11. Offline Fallback & Automated Live Background Simulator Engine
  const [isOfflineFallbackMode, setIsOfflineFallbackMode] = useState(false);
  const [isLiveSimulationActive, setIsLiveSimulationActive] = useState(true);
  const [isAutopilotDemo, setIsAutopilotDemo] = useState(false);
  const [autopilotStep, setAutopilotStep] = useState(0);

  // 12. Know Everything Mode (Interactive Universal Explainer)
  const [isKnowEverythingMode, setIsKnowEverythingMode] = useState(false);

  const toggleKnowEverythingMode = () => {
    setIsKnowEverythingMode(prev => {
      const next = !prev;
      if (next) {
        addNotification('info', '💡 Know Everything Mode Activated', 'Hover over any button, card, metric pill, or graph across VoltFlow to reveal instant detailed explanations!');
        addAuditLog('User activated Know Everything Mode (Universal Explainer).');
        triggerSignificance(
          'Know Everything Mode Enabled',
          'Activates interactive tooltip guides across all 40+ UI cards, buttons, and telemetry metrics in VoltFlow HEMS.',
          'Hovering any element reveals its exact backend algorithmic role & user impact.',
          'zap'
        );
      } else {
        addNotification('info', 'Know Everything Mode Deactivated', 'Explainer tooltips set to standard hover mode.');
      }
      return next;
    });
  };

  // Automated Background Grid Signal Loop (Cycles Green -> Yellow -> Red -> Green automatically)
  useEffect(() => {
    if (!isLiveSimulationActive) return;
    const gridCycle = ['green', 'yellow', 'red'];
    let cycleIndex = 0;

    const interval = setInterval(() => {
      cycleIndex = (cycleIndex + 1) % gridCycle.length;
      const nextStatus = gridCycle[cycleIndex];
      setGridStatus(nextStatus);

      if (nextStatus === 'green') {
        addNotification('success', 'Grid Signal: Green (Low Demand)', 'Grid tariff cheap (€0.12/kWh). EV fast charging & storage fill enabled.');
        addAuditLog('Background Simulator: Grid transitioned to GREEN. Resumed EV 11.0 kW charging.');
      } else if (nextStatus === 'yellow') {
        addNotification('warning', 'Grid Signal: Yellow (Solar Peak)', 'Grid tariff moderate (€0.22/kWh). Prioritizing local rooftop solar self-consumption.');
        addAuditLog('Background Simulator: Grid transitioned to YELLOW. Modulating heat pump & EV power.');
      } else if (nextStatus === 'red') {
        addNotification('warning', 'Grid Signal: Red (High Congestion)', 'Grid demand high (€0.38/kWh). EV charging auto-throttled to protect local transformer.');
        addAuditLog('Background Simulator: Grid transitioned to RED. Auto-paused heavy EV load.');
      }
    }, 12000); // Cycles every 12 seconds automatically

    return () => clearInterval(interval);
  }, [isLiveSimulationActive]);

  // Continuous Dynamic Telemetry Stream Engine (Runs every 2.5 seconds)
  useEffect(() => {
    if (!isLiveSimulationActive) return;

    const streamInterval = setInterval(() => {
      setDevices(prevDevices => prevDevices.map(d => {
        if (d.id === 'ev_charger' && d.status === 'charging') {
          const nextSoc = Math.min(100, (d.batterySoc || 64) + 1);
          return { ...d, batterySoc: nextSoc };
        }
        if (d.id === 'battery_storage') {
          const delta = gridStatus === 'red' ? -1 : 1;
          const nextSoc = Math.max(15, Math.min(100, (d.batterySoc || 78) + delta));
          return { 
            ...d, 
            batterySoc: nextSoc,
            powerKw: gridStatus === 'red' ? 3.2 : gridStatus === 'green' ? 4.8 : 2.1,
            status: gridStatus === 'red' ? 'discharging' : 'charging'
          };
        }
        return d;
      }));
    }, 2500);

    return () => clearInterval(streamInterval);
  }, [isLiveSimulationActive, gridStatus]);

  // Dynamic Hardware Telemetry Reaction Engine & Timers
  useEffect(() => {
    let timer;
    if (isEmergencyBoost && boostTimer > 0) {
      timer = setInterval(() => {
        setBoostTimer(prev => {
          if (prev <= 1) {
            setIsEmergencyBoost(false);
            addNotification('success', 'Emergency Boost Complete', 'EV and Heat Pump reached maximum thermal/charge capacity!');
            return 0;
          }
          return prev - 1;
        });

        // Increment EV SOC fill percentage during boost
        setDevices(prevDevices => prevDevices.map(device => {
          if (device.id === 'ev_charger') {
            const currentSoc = device.batterySoc || 64;
            const nextSoc = Math.min(100, currentSoc + 1);
            if (nextSoc === 100) {
              setIsEmergencyBoost(false);
              addNotification('success', 'EV Battery Fully Charged (100%)', 'Emergency Boost completed automatically as EV battery reached 100%.');
            }
            return {
              ...device,
              status: 'BOOSTING',
              powerKw: 11.0,
              batterySoc: nextSoc,
            };
          }
          if (device.id === 'heat_pump') {
            return {
              ...device,
              status: 'MAX BOOST',
              powerKw: 4.5,
              currentTemp: 22.5,
            };
          }
          return device;
        }));

      }, 1000);
    } else if (isGlobalPaused && pauseTimer > 0) {
      timer = setInterval(() => setPauseTimer(prev => prev - 1), 1000);
      setDevices(prevDevices => prevDevices.map(d => ({
        ...d,
        status: d.status === 'offline' ? 'offline' : 'PAUSED',
        powerKw: 0.0
      })));
    } else if (!isEmergencyBoost && !isGlobalPaused) {
      // Revert devices to normal tariff-driven operating parameters
      setDevices(prevDevices => prevDevices.map(device => {
        if (device.id === 'ev_charger') {
          return {
            ...device,
            status: gridStatus === 'red' ? 'paused' : 'charging',
            powerKw: gridStatus === 'red' ? 0.0 : gridStatus === 'green' ? 11.0 : 7.4,
          };
        }
        if (device.id === 'heat_pump') {
          return {
            ...device,
            status: 'modulating',
            powerKw: 1.5,
          };
        }
        return device;
      }));
    }
    return () => clearInterval(timer);
  }, [isEmergencyBoost, boostTimer, isGlobalPaused, pauseTimer, gridStatus]);

  // Handlers
  const toggleGlobalPause = (minutes = 60) => {
    if (isGlobalPaused) {
      setIsGlobalPaused(false);
      setPauseTimer(0);
      addAuditLog('User canceled Global Override Pause.');
      triggerSignificance('Global Pause Canceled', 'Resumed automated HEMS dynamic algorithm optimization.', 'Devices returned to automated grid-responsive schedules.', 'pause');
    } else {
      setIsGlobalPaused(true);
      setPauseTimer(minutes * 60);
      addAuditLog(`User activated Global Override Pause for ${minutes} mins.`);
      triggerSignificance('Global Pause Activated (60m)', 'Freezes all automated HEMS algorithm adjustments. Keeps current appliance power states fixed regardless of grid tariff changes.', 'All background load shifts paused. Appliances locked in current state.', 'pause');
    }
  };

  const toggleEmergencyBoost = (minutes = 30) => {
    if (isEmergencyBoost) {
      setIsEmergencyBoost(false);
      setBoostTimer(0);
      addAuditLog('User canceled Emergency Boost.');
      triggerSignificance('Emergency Boost Canceled', 'Reverted to automated eco tariff-optimization.', 'EV & Heat Pump power returned to normal modulating rates.', 'flame');
    } else {
      setIsEmergencyBoost(true);
      setBoostTimer(minutes * 60);
      addAuditLog(`User activated Emergency High-Power Boost for ${minutes} mins.`);
      triggerSignificance('Emergency High-Power Boost (30m)', 'Overrides electricity prices & grid congestion alerts to force EV Charger to 11 kW and Heat Pump to max capacity immediately.', 'EV charge speed boosted to 11.0 kW (+48% speed boost). Heat pump set to 22.5°C pre-heat.', 'flame');
    }
  };

  const [lastActionSignificance, setLastActionSignificance] = useState(null);

  const triggerSignificance = (title, significance, reaction, iconType = 'zap') => {
    setLastActionSignificance({
      id: Date.now(),
      title,
      significance,
      reaction,
      iconType
    });
  };

  const addAuditLog = (action) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAuditLogs(prev => [{ id: Date.now(), timestamp: timeStr, actor: 'User Control', action }, ...prev]);
  };

  const addNotification = (type, title, message) => {
    setNotifications(prev => [{ id: Date.now(), type, title, message, time: 'Just now', read: false }, ...prev]);
  };

  const addDevice = (newDevice) => {
    setDevices(prev => [...prev, newDevice]);
    addAuditLog(`Added new device: ${newDevice.name}`);
    addNotification('success', 'Device Connected', `${newDevice.name} was successfully paired with VoltFlow HEMS.`);
  };

  return (
    <EnergyContext.Provider
      value={{
        theme,
        setTheme,
        viewMode,
        setViewMode,
        gridStatus,
        setGridStatus,
        isGlobalPaused,
        pauseTimer,
        toggleGlobalPause,
        isEmergencyBoost,
        boostTimer,
        toggleEmergencyBoost,
        controlMode,
        setControlMode,
        userProfile,
        setUserProfile,
        userLimits,
        setUserLimits,
        devices,
        setDevices,
        addDevice,
        priceForecast,
        privacySettings,
        setPrivacySettings,
        notifications,
        setNotifications,
        addNotification,
        auditLogs,
        addAuditLog,
        isOfflineFallbackMode,
        setIsOfflineFallbackMode,
        isLiveSimulationActive,
        setIsLiveSimulationActive,
        isAutopilotDemo,
        setIsAutopilotDemo,
        autopilotStep,
        setAutopilotStep,
        lastActionSignificance,
        setLastActionSignificance,
        triggerSignificance,
        isKnowEverythingMode,
        toggleKnowEverythingMode,
        isSmartPlanner,
        setIsSmartPlanner,
      }}
    >
      {children}
    </EnergyContext.Provider>
  );
};

export const useEnergy = () => useContext(EnergyContext);
