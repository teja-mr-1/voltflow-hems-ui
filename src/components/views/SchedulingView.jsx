import React, { useState, useRef, useEffect } from 'react';
import { useEnergy } from '../../context/EnergyContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  TrendingDown, 
  Plus, 
  Sliders,
  Edit2,
  Trash2,
  Check,
  Sun,
  Sparkles,
  MoveHorizontal,
  Eye,
  Grid,
  List
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const SchedulingView = ({ onOpenDeadlineModal }) => {
  const { priceForecast, userLimits, setUserLimits, addAuditLog, addNotification, viewMode, triggerSignificance, isSmartPlanner } = useEnergy();
  
  // Main view mode: 'TODAY' | 'TOMORROW' | 'WEEK'
  const [mainMode, setMainMode] = useState('TODAY');
  const [selectedDayKey, setSelectedDayKey] = useState('Mon Aug 18');
  const [weekSubView, setWeekSubView] = useState('GANTT'); // 'GANTT' or 'GRID'
  const [connectedCalendars, setConnectedCalendars] = useState({ google: false, apple: false });
  const [isNewTaskFlex, setIsNewTaskFlex] = useState(true);

  const handleCalendarConnect = (provider) => {
    setConnectedCalendars(prev => {
      const isNowConnected = !prev[provider];
      const name = provider === 'google' ? 'Google Calendar' : 'Apple Calendar';
      if (isNowConnected) {
        addNotification('success', `${name} Connected`, `Synced routine events & departures with VoltFlow.`);
        addAuditLog(`Connected calendar integration: ${name}`);
      } else {
        addNotification('warning', `${name} Disconnected`, `Unlinked ${name}.`);
      }
      return { ...prev, [provider]: isNowConnected };
    });
  };

  const handleSimulateGanttDrag = () => {
    setWeeklySchedules(prev => ({
      ...prev,
      'Mon Aug 18': prev['Mon Aug 18'].map(t => {
        if (t.id === 1) {
          const isShifted = t.startPercent === '35%';
          return {
            ...t,
            startPercent: isShifted ? '10%' : '35%',
            startTime: isShifted ? '01:00 AM' : '08:30 AM',
            deadline: isShifted ? '07:30 AM' : '15:00 PM',
            costEst: isShifted ? '€2.10 (Saved €4.80)' : '€1.25 (Peak Solar Saved €5.65)'
          };
        }
        return t;
      })
    }));

    triggerSignificance(
      'Temporal Gantt Schedule Drag & Shift',
      'Interactive 24-Hour Timeline: Homeowner holds and slides appliance schedule bars horizontally across the track to align with dynamic tariff dips & solar peaks.',
      'Tesla Wall Connector rescheduled to 08:30 AM - 15:00 PM (Solar Peak Window). Estimated daily cost reduced from €2.10 to €1.25.',
      'calendar'
    );
  };

  // Drag-and-Drop state variables
  const [editingTask, setEditingTask] = useState(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const dragRef = useRef({ startX: 0, initialPercent: 0, isMoved: false, task: null, trackWidth: 600 });

  // 7 Separate Schedule Timelines
  const [weeklySchedules, setWeeklySchedules] = useState({
    'Mon Aug 18': [
      { id: 1, device: 'Tesla Wall Connector', activity: 'EV Charge to 85%', startTime: '01:00 AM', deadline: '07:30 AM', startPercent: '10%', widthPercent: '25%', colorClass: 'green', costEst: '€2.10 (Saved €4.80)', active: true },
      { id: 2, device: 'Bosch Smart Washer', activity: 'Eco Wash Cycle', startTime: '12:00 PM', deadline: '15:30 PM', startPercent: '50%', widthPercent: '15%', colorClass: 'amber', costEst: '€0.12 (Saved €0.90)', active: true },
      { id: 3, device: 'Daikin Heat Pump', activity: 'Thermal Pre-Heat', startTime: '04:00 AM', deadline: '07:00 AM', startPercent: '20%', widthPercent: '18%', colorClass: 'blue', costEst: '€0.85 (Saved €1.40)', active: true },
    ],
    'Tue Aug 19': [
      { id: 101, device: 'Tesla Wall Connector', activity: 'Overnight Solar Charge', startTime: '02:00 AM', deadline: '07:00 AM', startPercent: '12%', widthPercent: '22%', colorClass: 'green', costEst: '€1.80 (Saved €5.10)', active: true },
      { id: 102, device: 'Miele Heat Pump Dryer', activity: 'Solar Peak Dry Cycle', startTime: '13:00 PM', deadline: '16:00 PM', startPercent: '55%', widthPercent: '15%', colorClass: 'amber', costEst: '€0.05 (Free Solar)', active: true },
      { id: 103, device: 'Tesla Powerwall 2', activity: 'Peak Grid Discharge', startTime: '18:00 PM', deadline: '21:00 PM', startPercent: '75%', widthPercent: '15%', colorClass: 'violet', costEst: 'Earns €2.40 Payout', active: true },
    ],
    'Wed Aug 20': [
      { id: 201, device: 'Tesla Wall Connector', activity: 'Off-Peak EV Charge', startTime: '03:00 AM', deadline: '07:00 AM', startPercent: '15%', widthPercent: '20%', colorClass: 'green', costEst: '€2.30', active: true },
      { id: 202, device: 'Daikin Heat Pump', activity: 'HVAC Eco Comfort', startTime: '08:00 AM', deadline: '18:00 PM', startPercent: '33%', widthPercent: '40%', colorClass: 'blue', costEst: '€1.10', active: true },
    ],
    'Thu Aug 21': [
      { id: 301, device: 'Bosch Smart Washer', activity: 'Quick Eco Wash', startTime: '11:00 AM', deadline: '13:00 PM', startPercent: '45%', widthPercent: '12%', colorClass: 'amber', costEst: '€0.08', active: true },
      { id: 302, device: 'Tesla Powerwall 2', activity: 'Grid Support Dispatch', startTime: '17:00 PM', deadline: '20:00 PM', startPercent: '70%', widthPercent: '15%', colorClass: 'violet', costEst: 'Earns €1.90', active: true },
    ],
    'Fri Aug 22': [
      { id: 401, device: 'Tesla Wall Connector', activity: 'Weekend Trip Prep Charge', startTime: '01:00 AM', deadline: '08:00 AM', startPercent: '5%', widthPercent: '30%', colorClass: 'green', costEst: '€3.10', active: true },
      { id: 402, device: 'Miele Heat Pump Dryer', activity: 'Evening Laundry', startTime: '19:00 PM', deadline: '21:30 PM', startPercent: '80%', widthPercent: '12%', colorClass: 'amber', costEst: '€0.45', active: true },
    ],
    'Sat Aug 23': [
      { id: 501, device: 'Solar PV Array', activity: 'Solar Maximum Self-Consume', startTime: '10:00 AM', deadline: '16:00 PM', startPercent: '40%', widthPercent: '28%', colorClass: 'amber', costEst: '€0.00 (Free Solar)', active: true },
      { id: 502, device: 'Bosch Smart Washer', activity: 'Full Load Wash', startTime: '12:30 PM', deadline: '15:00 PM', startPercent: '52%', widthPercent: '12%', colorClass: 'amber', costEst: '€0.00', active: true },
      { id: 503, device: 'Tesla Wall Connector', activity: 'Daytime EV Solar Charge', startTime: '13:00 PM', deadline: '17:00 PM', startPercent: '55%', widthPercent: '18%', colorClass: 'green', costEst: '€0.00', active: true },
    ],
    'Sun Aug 24': [
      { id: 601, device: 'Daikin Heat Pump', activity: 'Pre-Cooling Living Area', startTime: '14:00 PM', deadline: '18:00 PM', startPercent: '58%', widthPercent: '18%', colorClass: 'blue', costEst: '€0.60', active: true },
      { id: 602, device: 'Tesla Powerwall 2', activity: 'Sunday Night Buffer Charge', startTime: '22:00 PM', deadline: '23:59 PM', startPercent: '90%', widthPercent: '10%', colorClass: 'violet', costEst: '€0.70', active: true },
    ],
  });

  // 7-Day List Definition
  const daysList = [
    { key: 'Mon Aug 18', short: 'MON 18', full: 'Mon Aug 18 (Today)', isPeakSolar: true, cost: '€2.10' },
    { key: 'Tue Aug 19', short: 'TUE 19', full: 'Tue Aug 19 (Tomorrow)', isPeakSolar: true, cost: '€1.85' },
    { key: 'Wed Aug 20', short: 'WED 20', full: 'Wed Aug 20', isPeakSolar: false, cost: '€3.40' },
    { key: 'Thu Aug 21', short: 'THU 21', full: 'Thu Aug 21', isPeakSolar: true, cost: '€2.05' },
    { key: 'Fri Aug 22', short: 'FRI 22', full: 'Fri Aug 22', isPeakSolar: false, cost: '€4.10' },
    { key: 'Sat Aug 23', short: 'SAT 23', full: 'Sat Aug 23', isPeakSolar: true, cost: '€1.60' },
    { key: 'Sun Aug 24', short: 'SUN 24', full: 'Sun Aug 24', isPeakSolar: true, cost: '€1.90' },
  ];

  // Active Key Determination
  const activeKey = mainMode === 'TODAY' ? 'Mon Aug 18' : mainMode === 'TOMORROW' ? 'Tue Aug 19' : selectedDayKey;
  const currentTasks = weeklySchedules[activeKey] || [];

  // Helper to convert drag percentage to 24-hour time
  const percentToTime = (pct) => {
    const totalMinutes = Math.round((pct / 100) * 24 * 60);
    const hrs = Math.floor(totalMinutes / 60) % 24;
    const mins = totalMinutes % 60;
    const padH = String(hrs).padStart(2, '0');
    const padM = String(mins).padStart(2, '0');
    return `${padH}:${padM}`;
  };

  // Drag Handlers
  const handleMouseDown = (e, task, trackElement) => {
    e.preventDefault();
    e.stopPropagation();
    const trackWidth = trackElement ? trackElement.getBoundingClientRect().width : 600;
    dragRef.current = {
      startX: e.clientX,
      initialPercent: parseFloat(task.startPercent),
      isMoved: false,
      task: task,
      trackWidth: trackWidth
    };
    setDraggingTaskId(task.id);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!draggingTaskId) return;
      const { startX, initialPercent, task, trackWidth } = dragRef.current;
      const deltaX = e.clientX - startX;
      if (Math.abs(deltaX) > 3) {
        dragRef.current.isMoved = true;
      }

      const deltaPct = (deltaX / trackWidth) * 100;
      const widthPctNum = parseFloat(task.widthPercent);
      const newPct = Math.max(0, Math.min(100 - widthPctNum, initialPercent + deltaPct));

      const newStartTime = percentToTime(newPct);
      const newEndTime = percentToTime(newPct + widthPctNum);

      setWeeklySchedules(prev => ({
        ...prev,
        [activeKey]: prev[activeKey].map(t => {
          if (t.id === draggingTaskId) {
            return {
              ...t,
              startPercent: `${newPct.toFixed(1)}%`,
              startTime: `${newStartTime} AM`,
              deadline: `${newEndTime} PM`
            };
          }
          return t;
        })
      }));
    };

    const handleMouseUp = () => {
      if (!draggingTaskId) return;
      const { isMoved, task } = dragRef.current;
      if (isMoved) {
        addNotification('success', 'Schedule Repositioned', `Moved ${task.device} schedule on ${activeKey}.`);
        addAuditLog(`Drag & Drop rescheduled ${task.device} activity on ${activeKey}.`);
      } else {
        setEditingTask(task);
      }
      setDraggingTaskId(null);
      dragRef.current.isMoved = false;
    };

    if (draggingTaskId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingTaskId, activeKey]);

  const handleUpdateTask = (updatedTask) => {
    setWeeklySchedules(prev => ({
      ...prev,
      [activeKey]: prev[activeKey].map(t => t.id === updatedTask.id ? updatedTask : t)
    }));
    setEditingTask(null);
    addNotification('success', 'Schedule Saved', `Updated ${updatedTask.device} on ${activeKey}`);
  };

  const handleDeleteTask = (taskId) => {
    setWeeklySchedules(prev => ({
      ...prev,
      [activeKey]: prev[activeKey].filter(t => t.id !== taskId)
    }));
    setEditingTask(null);
    addNotification('warning', 'Task Removed', `Task removed from ${activeKey} schedule.`);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTask = {
      id: Date.now(),
      device: formData.get('device'),
      activity: formData.get('activity'),
      startTime: isNewTaskFlex ? '⚡ Auto (Grid-Balanced)' : (formData.get('startTime') || '10:00 AM'),
      deadline: formData.get('deadline') || '14:00 PM',
      isFlexGrid: isNewTaskFlex,
      startPercent: '40%',
      widthPercent: '20%',
      colorClass: 'green',
      costEst: isNewTaskFlex ? '⚡ €0.15 (Grid-Balanced Dip)' : '€0.40 (Dynamic Optimized)',
      active: true
    };
    const targetDay = formData.get('targetDay') || activeKey;
    setWeeklySchedules(prev => ({
      ...prev,
      [targetDay]: [...(prev[targetDay] || []), newTask]
    }));
    setShowAddTaskModal(false);
    addNotification('success', 'Flex Schedule Added', `Added ${newTask.activity} (${isNewTaskFlex ? '⚡ Flex-Grid Mode' : 'Fixed Window'}) to ${targetDay}`);
  };

  const handlePriorityMove = (index, direction) => {
    const newOrder = [...userLimits.priorityOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;
    setUserLimits(prev => ({ ...prev, priorityOrder: newOrder }));
    addAuditLog(`Reordered appliance priority: ${newOrder.join(' > ')}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Manual Scheduling Controls (Advanced View Only) */}
      {!isSmartPlanner && (
        <>
      {/* Top Main Mode Switcher: Crisp 3-Pill Navigation */}
      <div data-demo="adv-schedule-toolbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ 
          display: 'flex', 
          background: 'rgba(255, 255, 255, 0.85)', 
          padding: '4px', 
          borderRadius: '14px', 
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <button 
            className={`btn-secondary ${mainMode === 'TODAY' ? 'active' : ''}`}
            style={{ border: 'none', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, padding: '0.5rem 1.1rem' }}
            onClick={() => { setMainMode('TODAY'); setSelectedDayKey('Mon Aug 18'); }}
          >
            Today (Aug 18)
          </button>

          <button 
            className={`btn-secondary ${mainMode === 'TOMORROW' ? 'active' : ''}`}
            style={{ border: 'none', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, padding: '0.5rem 1.1rem' }}
            onClick={() => { setMainMode('TOMORROW'); setSelectedDayKey('Tue Aug 19'); }}
          >
            Tomorrow (Aug 19)
          </button>

          <button 
            className={`btn-secondary ${mainMode === 'WEEK' ? 'active' : ''}`}
            style={{ border: 'none', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, padding: '0.5rem 1.1rem' }}
            onClick={() => setMainMode('WEEK')}
          >
            📅 7-Day Planner
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn-secondary ${connectedCalendars.apple ? 'active' : ''}`}
            onClick={() => handleCalendarConnect('apple')}
            style={{
              fontSize: '0.78rem',
              padding: '0.45rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: connectedCalendars.apple ? 'rgba(5, 150, 105, 0.12)' : '#ffffff',
              borderColor: connectedCalendars.apple ? 'rgba(5, 150, 105, 0.4)' : 'rgba(0, 0, 0, 0.1)',
              color: connectedCalendars.apple ? '#047857' : '#334155'
            }}
          >
            <CalendarIcon size={14} color={connectedCalendars.apple ? '#059669' : '#64748b'} />
            {connectedCalendars.apple ? '✓ Apple Calendar' : 'Connect Apple Calendar'}
          </button>

          <button 
            className={`btn-secondary ${connectedCalendars.google ? 'active' : ''}`}
            onClick={() => handleCalendarConnect('google')}
            style={{
              fontSize: '0.78rem',
              padding: '0.45rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: connectedCalendars.google ? 'rgba(5, 150, 105, 0.12)' : '#ffffff',
              borderColor: connectedCalendars.google ? 'rgba(5, 150, 105, 0.4)' : 'rgba(0, 0, 0, 0.1)',
              color: connectedCalendars.google ? '#047857' : '#334155'
            }}
          >
            <CalendarIcon size={14} color={connectedCalendars.google ? '#059669' : '#64748b'} />
            {connectedCalendars.google ? '✓ Google Calendar' : 'Connect Google Calendar'}
          </button>

          <button className="btn-primary" data-demo="btn-add-schedule" onClick={() => setShowAddTaskModal(true)}>
            <Plus size={15} /> Add Custom Schedule
          </button>
        </div>
      </div>

      {/* 7-DAY WEEKLY STRIP (Appears only when 7-Day Planner is active) */}
      {mainMode === 'WEEK' && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '0.75rem',
          background: '#ffffff',
          padding: '1rem 1.25rem',
          borderRadius: '16px',
          border: '1px solid rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Select Day Timeline</span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button 
                className={`btn-secondary ${weekSubView === 'GANTT' ? 'active' : ''}`}
                style={{ fontSize: '0.75rem', padding: '3px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                onClick={() => setWeekSubView('GANTT')}
              >
                <List size={13} /> 24h Timeline
              </button>
              <button 
                className={`btn-secondary ${weekSubView === 'GRID' ? 'active' : ''}`}
                style={{ fontSize: '0.75rem', padding: '3px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                onClick={() => setWeekSubView('GRID')}
              >
                <Grid size={13} /> Weekly Grid
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
            {daysList.map(d => {
              const isSelected = selectedDayKey === d.key;
              const taskCount = weeklySchedules[d.key]?.length || 0;
              return (
                <button
                  key={d.key}
                  onClick={() => { setSelectedDayKey(d.key); setWeekSubView('GANTT'); }}
                  style={{
                    padding: '0.65rem 0.5rem',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid #059669' : '1px solid rgba(0,0,0,0.08)',
                    background: isSelected ? 'rgba(5, 150, 105, 0.1)' : '#faf8f4',
                    color: isSelected ? '#047857' : '#334155',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', letterSpacing: '0.04em' }}>{d.short}</span>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>{taskCount} Tasks</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
        </>
      )}

      {/* SMART HANDS-FREE SCHEDULING VIEW VS ADVANCED GANTT VIEW */}
      {isSmartPlanner ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Headline */}
          <div className="glass-card" data-demo="smart-schedule-banner" style={{ padding: '1.25rem 1.5rem', borderRadius: '18px', background: 'linear-gradient(135deg, #ffffff, #f0fdf4)', border: '1px solid rgba(5,150,105,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Today's Autonomous Schedule</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
                  VoltFlow has planned the full day. Every appliance runs at the cheapest and greenest moment — automatically.
                </div>
              </div>
              <div className="pill-badge green" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                <Sparkles size={14} /> AI Auto-Optimized
              </div>
            </div>
          </div>

          {/* Visual Timeline — read-only, no controls */}
          <div className="glass-card" data-demo="smart-schedule-timeline" style={{ padding: '1.25rem 1.5rem', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Today — Aug 19 &nbsp;·&nbsp; 24-Hour Timeline
            </div>

            {/* Hour ruler */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#94a3b8', marginBottom: '0.5rem', paddingRight: '2px' }}>
              {['00:00', '06:00', '12:00', '18:00', '24:00'].map(t => <span key={t}>{t}</span>)}
            </div>

            {/* Timeline rows */}
            {[
              {
                icon: '⚡', name: 'Tesla Model Y', sub: 'EV Charging', color: '#059669', bg: 'rgba(5,150,105,0.15)',
                bars: [{ left: '4.2%', width: '25%' }], // 01:00 – 07:00
                outcome: '100% by 07:30 AM', outcomeColor: '#059669',
                cost: '€2.10 total', costNote: 'Off-peak €0.08/kWh'
              },
              {
                icon: '☀️', name: 'Bosch Smart Washer', sub: 'Eco Wash Cycle', color: '#d97706', bg: 'rgba(217,119,6,0.15)',
                bars: [{ left: '50%', width: '8.4%' }], // 12:00 – 14:00
                outcome: 'Done by 2:00 PM', outcomeColor: '#d97706',
                cost: '€0.00', costNote: 'Free self-solar'
              },
              {
                icon: '🌡️', name: 'Daikin Heat Pump', sub: 'Thermal Pre-heat', color: '#0284c7', bg: 'rgba(2,132,199,0.15)',
                bars: [{ left: '16.7%', width: '8.4%' }], // 04:00 – 06:00
                outcome: '20.8°C warm start', outcomeColor: '#0284c7',
                cost: '€0.52', costNote: 'Off-peak rate'
              },
              {
                icon: '🔋', name: 'Tesla Powerwall 2', sub: 'Battery Charging', color: '#7c3aed', bg: 'rgba(124,58,237,0.15)',
                bars: [{ left: '0%', width: '12.5%' }, { left: '50%', width: '16.7%' }], // 00:00–03:00 + 12:00–16:00
                outcome: '90% by evening', outcomeColor: '#7c3aed',
                cost: 'Solar self-charge', costNote: 'No cost during solar'
              },
            ].map((row, i) => (
              <div key={i} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span>{row.icon}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{row.name}</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>— {row.sub}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: row.outcomeColor, fontWeight: 700 }}>{row.outcome}</span>
                </div>
                <div style={{ position: 'relative', height: '22px', background: 'rgba(0,0,0,0.04)', borderRadius: '6px', overflow: 'hidden' }}>
                  {row.bars.map((bar, bi) => (
                    <div key={bi} style={{
                      position: 'absolute', top: 0, bottom: 0,
                      left: bar.left, width: bar.width,
                      background: row.bg, borderRadius: '4px',
                      border: `1px solid ${row.color}30`
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '3px', textAlign: 'right' }}>
                  {row.cost} &nbsp;·&nbsp; {row.costNote}
                </div>
              </div>
            ))}
          </div>

          {/* Today's Summary — read-only */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem' }}>
            {[
              { label: 'Scheduled Tasks', value: '4', sub: 'All auto-optimized', color: '#059669' },
              { label: 'Today\'s Energy Cost', value: '€2.62', sub: 'vs €9.40 flat rate', color: '#047857' },
              { label: 'Solar Self-Use', value: '84%', sub: 'of generation used locally', color: '#d97706' },
              { label: 'Grid Peak Avoided', value: '18:00–20:00', sub: 'All heavy loads shifted', color: '#7c3aed' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '1rem', background: '#ffffff', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.07)' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: '4px' }}>{s.label}</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>{s.sub}</div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        /* ADVANCED 24-HOUR GANTT TIMELINE VIEW */
        <>
          {/* 1. GANTT 24-HOUR INTERACTIVE TIMELINE */}
          {(mainMode !== 'WEEK' || weekSubView === 'GANTT') && (
        <div 
          className="glass-card"
          data-explain-title="24-Hour Interactive Timeline"
          data-explain="Visual Gantt schedule. Click and drag schedule bars to change run times."
        >
          <div className="card-header">
            <div>
              <div className="card-title" style={{ color: '#0f172a' }}>
                <CalendarIcon size={18} color="#d97706" /> 24-Hour Schedule Timeline — {activeKey}
              </div>
            </div>
            <div className="pill-badge green">{currentTasks.length} Active Tasks</div>
          </div>

          <div className="gantt-container">
            {currentTasks.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                No active tasks scheduled for {activeKey}. Click "+ Add Custom Schedule" to add one!
              </div>
            ) : (
              currentTasks.map((task) => (
                <div key={task.id} className="gantt-row">
                  <div className="gantt-label">
                    <Clock size={14} color="#059669" style={{ flexShrink: 0 }} />
                    <div style={{ minWidth: 0, overflow: 'hidden' }}>
                      <div style={{ color: '#0f172a', fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {task.device}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {task.startTime} – {task.deadline}
                      </div>
                    </div>
                  </div>

                  <div className="gantt-track" id={`track-${task.id}`}>
                    <div 
                      className={`gantt-bar ${task.colorClass}`} 
                      style={{ 
                        left: task.startPercent, 
                        width: task.widthPercent,
                        opacity: draggingTaskId === task.id ? 0.9 : 1,
                        transform: draggingTaskId === task.id ? 'scale(1.02)' : 'none',
                        zIndex: draggingTaskId === task.id ? 30 : 1
                      }}
                      onMouseDown={(e) => handleMouseDown(e, task, document.getElementById(`track-${task.id}`))}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <MoveHorizontal size={13} style={{ opacity: 0.75, flexShrink: 0 }} />
                        <span>⚡ {task.activity} ({task.costEst})</span>
                      </span>
                      <Edit2 size={12} style={{ opacity: 0.8, flexShrink: 0, marginLeft: '6px' }} />
                    </div>
                  </div>
                </div>
              ))
            )}

            <div className="timeline-ticks">
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span>12:00 (Solar Peak)</span>
              <span>16:00</span>
              <span>20:00 (Grid Peak)</span>
              <span>23:59</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. WEEKLY OVERVIEW GRID VIEW */}
      {mainMode === 'WEEK' && weekSubView === 'GRID' && (
        <div className="glass-card">
          <div className="card-header">
            <div>
              <div className="card-title" style={{ color: '#0f172a' }}>
                <Sparkles size={18} color="#059669" /> 7-Day Smart Energy Forecast Overview
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
            {daysList.map((dayItem) => {
              const dayTasks = weeklySchedules[dayItem.key] || [];
              return (
                <div key={dayItem.key} style={{
                  background: dayItem.isPeakSolar ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), #ffffff)' : '#ffffff',
                  border: dayItem.isPeakSolar ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '16px',
                  padding: '1.1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>{dayItem.short}</div>
                    {dayItem.isPeakSolar && <Sun size={18} color="#d97706" title="Peak Solar Generation Day" />}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Est. Daily Cost: <strong style={{ color: '#047857' }}>{dayItem.cost}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <span className="pill-badge green" style={{ fontSize: '0.72rem' }}>{dayTasks.length} Active Tasks</span>
                    <button 
                      className="btn-secondary" 
                      style={{ padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }} 
                      onClick={() => { setSelectedDayKey(dayItem.key); setWeekSubView('GANTT'); }}
                    >
                      <Eye size={12} /> Open Timeline
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pro Mode Spot Tariff & Priority Shedding */}
      {viewMode === 'pro' && (
        <div className="grid-cols-12">
          <div className="glass-card col-span-8">
            <div className="card-header">
              <div className="card-title" style={{ color: '#0f172a' }}>
                <TrendingDown size={18} color="#059669" /> Hourly Spot Tariff (€/kWh) & Solar Yield Forecast
              </div>
            </div>

            <div style={{ height: '200px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceForecast}>
                  <defs>
                    <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                  <YAxis yAxisId="price" stroke="#059669" fontSize={11} unit="€" domain={[0, 0.40]} />
                  <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '8px', color: '#0f172a' }} />
                  <Area yAxisId="price" type="monotone" dataKey="price" name="Tariff (€/kWh)" stroke="#059669" fillOpacity={1} fill="url(#priceGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card col-span-4">
            <div className="card-header">
              <div className="card-title" style={{ color: '#0f172a' }}>
                <Sliders size={18} color="#059669" /> Shedding Priority Order
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {userLimits.priorityOrder.map((itemKey, idx) => {
                const names = {
                  ev_charger: '1. Tesla EV Charger',
                  battery_storage: '2. Tesla Powerwall 2',
                  heat_pump: '3. Daikin Heat Pump',
                  smart_washer: '4. Bosch Washer',
                };
                return (
                  <div key={itemKey} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    padding: '0.5rem 0.75rem',
                    background: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid rgba(0,0,0,0.08)'
                  }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{names[itemKey] || itemKey}</span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      <button className="close-btn" style={{ width: 22, height: 22, fontSize: '0.7rem' }} onClick={() => handlePriorityMove(idx, 'up')}>▲</button>
                      <button className="close-btn" style={{ width: 22, height: 22, fontSize: '0.7rem' }} onClick={() => handlePriorityMove(idx, 'down')}>▼</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )}

      {/* EDIT TASK SCHEDULE MODAL */}
      {editingTask && (
        <div className="modal-overlay" onClick={() => setEditingTask(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>Edit Task Schedule ({activeKey})</div>
              <button className="close-btn" onClick={() => setEditingTask(null)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Appliance Activity</label>
                <input 
                  className="form-input" 
                  value={editingTask.activity} 
                  onChange={e => setEditingTask({ ...editingTask, activity: e.target.value })} 
                />
              </div>

              {/* Flex Grid-Balancing Toggle */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                background: editingTask.isFlexGrid ? 'rgba(5, 150, 105, 0.08)' : '#faf8f4',
                padding: '0.75rem',
                borderRadius: '12px',
                border: editingTask.isFlexGrid ? '1px solid rgba(5, 150, 105, 0.3)' : '1px solid rgba(0,0,0,0.08)'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: editingTask.isFlexGrid ? '#047857' : '#0f172a' }}>
                    ⚡ Flex-Grid Balancing Mode
                  </div>
                  <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '2px' }}>
                    Charge anytime before deadline based on live grid load & spot price dips
                  </div>
                </div>
                <button
                  type="button"
                  className={`btn-secondary ${editingTask.isFlexGrid ? 'active' : ''}`}
                  onClick={() => setEditingTask(prev => ({
                    ...prev,
                    isFlexGrid: !prev.isFlexGrid,
                    startTime: !prev.isFlexGrid ? '⚡ Auto (Grid-Balanced)' : '02:00 AM',
                    costEst: !prev.isFlexGrid ? '⚡ €0.15 (Grid-Balanced Dip)' : '€0.40 (Dynamic Optimized)'
                  }))}
                  style={{
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    background: editingTask.isFlexGrid ? '#059669' : '#ffffff',
                    color: editingTask.isFlexGrid ? '#ffffff' : '#334155',
                    fontWeight: 700
                  }}
                >
                  {editingTask.isFlexGrid ? '✓ Flex ON' : 'Flex OFF'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input 
                    className="form-input" 
                    value={editingTask.isFlexGrid ? '⚡ Auto (Grid-Balanced)' : editingTask.startTime} 
                    disabled={editingTask.isFlexGrid}
                    onChange={e => setEditingTask({ ...editingTask, startTime: e.target.value })} 
                    style={{
                      background: editingTask.isFlexGrid ? 'rgba(5, 150, 105, 0.08)' : '#ffffff',
                      color: editingTask.isFlexGrid ? '#047857' : '#0f172a',
                      fontWeight: editingTask.isFlexGrid ? 700 : 500
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Completion Deadline</label>
                  <input 
                    className="form-input" 
                    value={editingTask.deadline} 
                    onChange={e => setEditingTask({ ...editingTask, deadline: e.target.value })} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <button 
                  className="btn-secondary" 
                  style={{ color: '#e11d48', borderColor: 'rgba(225,29,72,0.3)' }}
                  onClick={() => handleDeleteTask(editingTask.id)}
                >
                  <Trash2 size={15} /> Delete Task
                </button>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-secondary" onClick={() => setEditingTask(null)}>Cancel</button>
                  <button className="btn-primary" onClick={() => handleUpdateTask(editingTask)}>
                    <Check size={15} /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW TASK MODAL */}
      {showAddTaskModal && (
        <div className="modal-overlay" onClick={() => setShowAddTaskModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>Add Custom Appliance Schedule</div>
              <button className="close-btn" onClick={() => setShowAddTaskModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Target Day</label>
                <select className="form-select" name="targetDay" defaultValue={activeKey}>
                  {daysList.map(d => (
                    <option key={d.key} value={d.key}>{d.full}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Appliance Device</label>
                <select className="form-select" name="device">
                  <option value="Tesla Wall Connector">Tesla Wall Connector EV</option>
                  <option value="Bosch Smart Washer">Bosch Smart Washer</option>
                  <option value="Daikin Heat Pump">Daikin Heat Pump HVAC</option>
                  <option value="Miele Heat Pump Dryer">Miele Heat Pump Dryer</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Task Description</label>
                <input className="form-input" name="activity" placeholder="e.g. Quick Charge to 90%" defaultValue="Smart Solar Charge" required />
              </div>

              {/* Flex Grid Balancing Toggle */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                background: isNewTaskFlex ? 'rgba(5, 150, 105, 0.08)' : '#faf8f4',
                padding: '0.75rem',
                borderRadius: '12px',
                border: isNewTaskFlex ? '1px solid rgba(5, 150, 105, 0.3)' : '1px solid rgba(0,0,0,0.08)'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isNewTaskFlex ? '#047857' : '#0f172a' }}>
                    ⚡ Flex-Grid Balancing Mode
                  </div>
                  <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '2px' }}>
                    Charge anytime before deadline based on live grid load & spot price dips
                  </div>
                </div>
                <button
                  type="button"
                  className={`btn-secondary ${isNewTaskFlex ? 'active' : ''}`}
                  onClick={() => setIsNewTaskFlex(prev => !prev)}
                  style={{
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    background: isNewTaskFlex ? '#059669' : '#ffffff',
                    color: isNewTaskFlex ? '#ffffff' : '#334155',
                    fontWeight: 700
                  }}
                >
                  {isNewTaskFlex ? '✓ Flex ON' : 'Flex OFF'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input 
                    className="form-input" 
                    name="startTime" 
                    value={isNewTaskFlex ? '⚡ Auto (Grid-Balanced)' : '11:00 AM'} 
                    disabled={isNewTaskFlex}
                    style={{
                      background: isNewTaskFlex ? 'rgba(5, 150, 105, 0.08)' : '#ffffff',
                      color: isNewTaskFlex ? '#047857' : '#0f172a',
                      fontWeight: isNewTaskFlex ? 700 : 500
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Completion Deadline</label>
                  <input className="form-input" name="deadline" defaultValue="16:00 PM" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
