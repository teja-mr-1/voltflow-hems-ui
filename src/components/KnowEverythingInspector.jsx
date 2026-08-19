import React, { useState, useEffect, useRef } from 'react';
import { useEnergy } from '../context/EnergyContext';
import { HelpCircle, Sparkles, X, Info } from 'lucide-react';

/**
 * Universal Plain-English Semantic Dictionary for Common Citizens
 * Maps element keywords, IDs, classes, and titles to simple, jargon-free explanations.
 */
function getCitizenExplanation(el) {
  // 1. First priority: explicit data-explain & data-explain-title attributes
  const explicitText = el.getAttribute('data-explain') || el.closest('[data-explain]')?.getAttribute('data-explain');
  const explicitTitle = el.getAttribute('data-explain-title') || el.closest('[data-explain-title]')?.getAttribute('data-explain-title');
  if (explicitText) {
    return {
      title: explicitTitle || 'Feature Explanation',
      text: explicitText,
    };
  }

  // 2. Semantic matching based on IDs, attributes, text content, and classes
  const id = (el.id || '').toLowerCase();
  const cls = (el.className || '').toString().toLowerCase();
  const textContent = (el.innerText || '').toLowerCase();
  const titleAttr = (el.getAttribute('title') || '').toLowerCase();
  const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();
  const typeAttr = (el.getAttribute('type') || '').toLowerCase();
  const tagName = el.tagName.toLowerCase();
  const combined = `${id} ${cls} ${textContent} ${titleAttr} ${ariaLabel}`;

  // ── Top Header & Mode Selectors ──
  if (id.includes('btn-mode-smart') || (combined.includes('smart hands-free') && (tagName === 'button' || cls.includes('mode-btn')))) {
    return {
      title: '⚡ Smart Hands-Free Mode',
      text: 'VoltFlow runs 100% on autopilot in the background. AI automatically balances your solar, car charging, and heating with zero manual effort.',
    };
  }
  if (id.includes('btn-mode-advanced') || (combined.includes('advanced view') && (tagName === 'button' || cls.includes('mode-btn')))) {
    return {
      title: '⚙️ Advanced View',
      text: 'Take back the steering wheel. Unlocks full manual control, live device overrides, hardware limits, and deep charts across all 9 tabs.',
    };
  }
  if (combined.includes('grid-signal-pill') || combined.includes('local grid:') || combined.includes('green — clean energy surplus') || combined.includes('yellow — moderate') || combined.includes('red — high congestion')) {
    return {
      title: '🚦 Grid Traffic Light Status',
      text: 'Shows current city power status: Green = cheap solar/wind; Yellow = normal rate; Red = peak grid demand and high prices.',
    };
  }
  if (combined.includes('demo') || id.includes('demo')) {
    return {
      title: '▶ Autopilot Live Demo',
      text: 'Starts a step-by-step automated tour showing you how every feature in the app works for everyday homeowners.',
    };
  }
  if (id.includes('know-everything') || combined.includes('know everything')) {
    return {
      title: '💡 Know Everything Mode',
      text: 'Turns this interactive guide on or off. Hover over anything on screen to see what it is in plain English. Press Esc to exit.',
    };
  }

  // ── Navigation Tabs ──
  if (id === 'nav-tab-overview' || combined.includes('nav-tab-overview') || (combined.includes('overview') && cls.includes('nav-tab'))) {
    return {
      title: '📊 Energy Overview',
      text: 'Your main dashboard showing live rooftop solar, home battery storage, total home power use, and daily savings.',
    };
  }
  if (id === 'nav-tab-devices' || combined.includes('nav-tab-devices') || (combined.includes('devices') && cls.includes('nav-tab'))) {
    return {
      title: '🔌 Connected Appliances',
      text: 'Shows all your smart home devices — like your EV charger, home battery, and heat pump — with live status and power switches.',
    };
  }
  if (id === 'nav-tab-scheduling' || combined.includes('nav-tab-scheduling') || (combined.includes('scheduling') && cls.includes('nav-tab'))) {
    return {
      title: '📅 Smart Scheduling',
      text: 'View and edit your weekly appliance schedule. Drag blocks to run washing machines or car charging during cheap power hours.',
    };
  }
  if (id === 'nav-tab-controls' || combined.includes('nav-tab-controls') || (combined.includes('controls') && cls.includes('nav-tab'))) {
    return {
      title: '🎛️ Master System Controls',
      text: 'Set your non-negotiable safety guardrails — like minimum car battery reserve floor and emergency high-power boost.',
    };
  }
  if (id === 'nav-tab-grid' || combined.includes('nav-tab-grid') || (combined.includes('grid') && cls.includes('nav-tab'))) {
    return {
      title: '⚡ Local Grid Signals',
      text: 'Live electricity prices and neighborhood power grid demand from your local electricity network.',
    };
  }
  if (id === 'nav-tab-savings' || combined.includes('nav-tab-savings') || (combined.includes('savings') && cls.includes('nav-tab'))) {
    return {
      title: '💶 Savings & Rewards',
      text: 'Track your total monthly money saved, cash rewards earned for balancing the grid, and reduced carbon footprint.',
    };
  }
  if (id === 'nav-tab-privacy' || combined.includes('nav-tab-privacy') || (combined.includes('privacy') && cls.includes('nav-tab'))) {
    return {
      title: '🛡️ Home Privacy Shield',
      text: 'Guarantees your private routines, appliance usage, and room temperatures stay inside your home and are never leaked.',
    };
  }
  if (id === 'nav-tab-reliability' || combined.includes('nav-tab-reliability') || (combined.includes('reliability') && cls.includes('nav-tab'))) {
    return {
      title: '📶 Offline & Reliability',
      text: 'Shows how your home continues running safely on solar and battery power even if the internet goes down.',
    };
  }
  if (id === 'nav-tab-future_lab' || combined.includes('nav-tab-future_lab') || (combined.includes('future') && cls.includes('nav-tab'))) {
    return {
      title: '🚀 Future Energy Lab',
      text: 'Next-generation features: power your house from your electric car (V2H), share solar with neighbors, and earn market rewards.',
    };
  }

  // ── Overview View Elements ──
  if (combined.includes('smart-overview-hero') || combined.includes('clean energy right now')) {
    return {
      title: '🌿 Clean Energy Headline',
      text: 'Shows what percentage of your home is currently running on clean green power, and how much money the AI saved you today.',
    };
  }
  if (combined.includes('solar generation') || combined.includes('solar pv') || combined.includes('solar kw') || (cls.includes('solar') && cls.includes('kpi-card'))) {
    return {
      title: '☀️ Rooftop Solar Power',
      text: 'Shows exactly how much free, clean electricity your rooftop solar panels are producing right now.',
    };
  }
  if (combined.includes('home battery') || combined.includes('powerwall') || (cls.includes('battery') && cls.includes('kpi-card'))) {
    return {
      title: '🔋 Home Battery Storage',
      text: 'Shows how full your home battery is, and whether it is storing daytime solar or powering your home in the evening.',
    };
  }
  if (combined.includes('household demand') || combined.includes('total home power') || (cls.includes('home') && cls.includes('kpi-card'))) {
    return {
      title: '🏠 Total Home Power Use',
      text: 'The total amount of electricity being consumed right now by all lights, heat pumps, and appliances in your home.',
    };
  }
  if (combined.includes('grid exchange') || combined.includes('importing from grid') || (cls.includes('grid') && cls.includes('kpi-card'))) {
    return {
      title: '⚡ City Grid Power',
      text: 'Shows if your home is buying electricity from the city power company, or exporting surplus solar power back for credits.',
    };
  }
  if (combined.includes('flow-diagram') || combined.includes('power flow') || tagName === 'svg') {
    return {
      title: '🗺️ Live Power Flow Map',
      text: 'An animated visual map showing where your electricity is coming from (solar/grid) and where it is going (battery/home).',
    };
  }
  if (combined.includes('power usage share') || combined.includes('power-share') || combined.includes('pie') || cls.includes('recharts-pie')) {
    return {
      title: '🥧 Power Usage Breakdown',
      text: 'A pie chart breaking down exactly which appliances (EV charger, heat pump, kitchen) are drawing power right now.',
    };
  }
  if (combined.includes('24-hour energy heartbeat') || combined.includes('energy profile') || cls.includes('recharts-area')) {
    return {
      title: '📈 24-Hour Energy Graph',
      text: 'Interactive timeline showing your solar production curve, home consumption peaks, and battery storage throughout the day.',
    };
  }

  // ── Quick Manual Actions (Overview / Controls) ──
  if (combined.includes('force charge') || combined.includes('force ev')) {
    return {
      title: '⚡ Force Charge Car Now',
      text: 'Instantly charges your electric car at maximum speed (7.2 kW), bypassing all scheduled waiting times.',
    };
  }
  if (combined.includes('powerwall mode') || combined.includes('battery mode') || combined.includes('hold reserve')) {
    return {
      title: '🔋 Battery Storage Mode',
      text: 'Click to cycle between Solar Self-Consumption (standard), Hold Reserve (storm backup), and Export to Grid (peak payout).',
    };
  }
  if (combined.includes('suspend') || combined.includes('pause running')) {
    return {
      title: '⏸ Pause Running Appliances',
      text: 'Temporarily stops washing machines or dishwashers to reduce power draw during expensive peak hours.',
    };
  }
  if (combined.includes('connect device') || combined.includes('add device') || combined.includes('pair hardware') || id.includes('btn-add-device')) {
    return {
      title: '🔌 Add New Smart Appliance',
      text: 'Easy pairing wizard to connect a new electric car charger, solar inverter, home battery, or heat pump.',
    };
  }
  if (combined.includes('pause all auto-changes') || combined.includes('1-hour pause') || id.includes('btn-override')) {
    return {
      title: '⏸ 1-Hour Automation Pause',
      text: 'Emergency brake. Freezes all background automated changes for 1 hour so you have complete manual control.',
    };
  }
  if (combined.includes('emergency boost') || combined.includes('high-power boost') || id.includes('btn-emergency')) {
    return {
      title: '🔥 Emergency Power Boost',
      text: 'Forces your EV charger and heat pump to run at full blast immediately, ignoring all electricity prices.',
    };
  }

  // ── Devices View Elements ──
  if (combined.includes('tesla wall connector') || combined.includes('ev charger')) {
    return {
      title: '🚗 Tesla EV Charger',
      text: 'Smart car charger. Automatically charges your vehicle using surplus daytime solar and ultra-cheap night rates.',
    };
  }
  if (combined.includes('tesla powerwall') || combined.includes('home storage battery')) {
    return {
      title: '🔋 Tesla Powerwall 2',
      text: '13.5 kWh home battery. Stores free solar electricity made during the day so you can power your house at night for free.',
    };
  }
  if (combined.includes('solar pv array') || combined.includes('solar inverter')) {
    return {
      title: '☀️ Solar PV Inverter',
      text: 'Rooftop solar generator. Converts sunlight into clean electricity for your home appliances and battery.',
    };
  }
  if (combined.includes('daikin heat pump') || combined.includes('heat pump')) {
    return {
      title: '🌡️ Daikin Heat Pump HVAC',
      text: 'Smart heating and cooling. Pre-heats or pre-cools your home when power is cheap to maintain perfect room comfort.',
    };
  }
  if (combined.includes('bosch smart washer') || combined.includes('smart washer') || combined.includes('washing machine')) {
    return {
      title: '🧺 Bosch Smart Washer',
      text: 'Smart laundry washer. Delays its cycle start until rooftop solar output peaks or dynamic grid prices drop to their lowest.',
    };
  }
  if (combined.includes('miele heat pump dryer') || combined.includes('dryer')) {
    return {
      title: '👕 Miele Smart Dryer',
      text: 'Energy-efficient dryer. Runs automatically during peak solar hours to dry clothes with zero grid electricity costs.',
    };
  }
  if (combined.includes('reconnect wifi') || combined.includes('device offline')) {
    return {
      title: '⚠️ Reconnect Device',
      text: 'Attempts to reconnect this appliance to your home Wi-Fi network and resumes automated energy scheduling.',
    };
  }

  // ── Controls View Elements ──
  if (combined.includes('automation approval') || combined.includes('control strategy')) {
    return {
      title: '🛡️ Automation Approval Strategy',
      text: 'Choose how independent VoltFlow is: 100% autonomous, ask for permission before shifting heavy appliances, or simple recommendations.',
    };
  }
  if (combined.includes('flex-deadline') || combined.includes('grid-balancing mode')) {
    return {
      title: '⚡ Flex-Deadline Smart Mode',
      text: 'Allows VoltFlow to automatically shift your car charging to cheap solar and night hours anytime before your morning departure.',
    };
  }
  if (combined.includes('minimum ev battery') || combined.includes('soc floor') || combined.includes('min soc')) {
    return {
      title: '🚗 Minimum Car Battery Floor',
      text: 'Guarantees your EV battery never drops below this percentage so you can always drive in an unexpected emergency.',
    };
  }
  if (combined.includes('departure deadline') || (typeAttr === 'time' && combined.includes('time'))) {
    return {
      title: '⏰ Morning Departure Time',
      text: 'The exact time you leave home in the morning. VoltFlow guarantees your car is charged to 100% by this time.',
    };
  }
  if (combined.includes('temperature comfort') || combined.includes('indoor temp') || combined.includes('thermostat')) {
    return {
      title: '🌡️ Room Temperature Comfort Band',
      text: 'The warmest and coolest indoor temperatures you find comfortable. VoltFlow keeps your rooms within this exact range.',
    };
  }
  if (combined.includes('priority-list') || combined.includes('device priority') || cls.includes('priority-item')) {
    return {
      title: '🔢 Appliance Priority Order',
      text: 'Choose which appliances are most essential to you. Higher ranked appliances stay powered on during grid peak stress.',
    };
  }

  // ── Scheduling View Elements ──
  if (combined.includes('today') && tagName === 'button') {
    return {
      title: '📅 Today’s Schedule',
      text: 'Shows 24-hour appliance schedule and cost estimates for today.',
    };
  }
  if (combined.includes('tomorrow') && tagName === 'button') {
    return {
      title: '📅 Tomorrow’s Schedule',
      text: 'Shows tomorrow’s optimized appliance schedule based on forecasted solar and electricity rates.',
    };
  }
  if (combined.includes('7-day week') || combined.includes('week') && tagName === 'button') {
    return {
      title: '📅 7-Day Weekly Schedule',
      text: 'View and edit your full weekly energy schedule across all 7 days.',
    };
  }
  if (combined.includes('add custom task') || combined.includes('add schedule task') || combined.includes('add task')) {
    return {
      title: '➕ Schedule Appliance Run',
      text: 'Set a new appliance task (like EV charging or dishwasher) with your preferred deadline and flexibility window.',
    };
  }
  if (combined.includes('google calendar') || combined.includes('apple calendar') || combined.includes('connect calendar')) {
    return {
      title: '📆 Sync Personal Calendar',
      text: 'Connect your Google or Apple calendar so VoltFlow knows when you are away from home or taking road trips.',
    };
  }
  if (combined.includes('timeline') || combined.includes('gantt') || combined.includes('drag & shift') || combined.includes('drag')) {
    return {
      title: '↔️ Draggable Schedule Timeline',
      text: 'Interactive 24-hour timeline. Slide appliance bars horizontally to change when they run during the day.',
    };
  }

  // ── Grid Intelligence View Elements ──
  if (combined.includes('substation load') || combined.includes('3.42 mva')) {
    return {
      title: '🏭 Neighborhood Substation Load',
      text: 'Total electrical demand on your neighborhood transformer. Lower load means cheaper energy rates.',
    };
  }
  if (combined.includes('grid frequency') || combined.includes('49.98 hz') || combined.includes('50.00 hz')) {
    return {
      title: '⚡ Power Grid Stability Frequency',
      text: 'Standard grid frequency (50 Hz). If it dips, VoltFlow can pause appliances to help balance the grid and earn cash.',
    };
  }
  if (combined.includes('dynamic spot price') || combined.includes('spot tariff')) {
    return {
      title: '💶 Dynamic Spot Electricity Price',
      text: 'Live wholesale electricity cost per kWh right now. VoltFlow charges batteries when this price is low.',
    };
  }
  if (combined.includes('congestion index') || combined.includes('feeder stress')) {
    return {
      title: '🚦 Grid Congestion Risk',
      text: 'Score from 1 to 10 showing how crowded the city power grid is. High scores unlock bonus payout rewards.',
    };
  }
  if (combined.includes('shed ev') || combined.includes('shed heat pump') || combined.includes('discharge battery') || combined.includes('claim flex reward')) {
    return {
      title: '⚡ Manual Grid Action Button',
      text: 'Allows you to manually reduce appliance power or export battery electricity to help the city grid and earn rewards.',
    };
  }

  // ── Savings & Rewards Elements ──
  if (combined.includes('total money saved') || combined.includes('saved this month')) {
    return {
      title: '💶 Total Monthly Money Saved',
      text: 'Total money saved on your electricity bill this month by shifting appliance use to cheap solar and night hours.',
    };
  }
  if (combined.includes('flexibility cash') || combined.includes('grid flexibility')) {
    return {
      title: '💰 Grid Flexibility Earnings',
      text: 'Direct cash payments earned from the grid operator for helping relieve grid congestion during peak hours.',
    };
  }
  if (combined.includes('carbon footprint') || combined.includes('co2')) {
    return {
      title: '🌿 Carbon Emissions Prevented',
      text: 'Total carbon dioxide emissions prevented this month by using rooftop solar instead of fossil fuel power plants.',
    };
  }
  if (combined.includes('departure guarantee') || combined.includes('100% ready')) {
    return {
      title: '🚗 EV Departure Guarantee',
      text: 'Confirmation that your electric car battery will be charged and ready to go before your morning commute.',
    };
  }
  if (combined.includes('optimization strategy') || combined.includes('aggressive') || combined.includes('balanced') || combined.includes('comfort first')) {
    return {
      title: '⚙️ Savings Optimization Mode',
      text: 'Choose your priority: Aggressive (maximum bill reduction), Balanced (even blend), or Comfort First (zero delays).',
    };
  }
  if (combined.includes('claim') && combined.includes('reward')) {
    return {
      title: '💶 Claim Flexibility Reward',
      text: 'Transfers your earned grid flexibility cash rewards directly into your energy wallet.',
    };
  }
  if (combined.includes('neighborhood benchmark') || combined.includes('household benchmark')) {
    return {
      title: '📊 Neighborhood Comparison',
      text: 'Compares your household solar usage, peak shifting, and rewards against the average home in your neighborhood.',
    };
  }

  // ── Privacy & Security Elements ──
  if (combined.includes('privacy shield') || combined.includes('zero-knowledge')) {
    return {
      title: '🛡️ Home Privacy Shield Visualizer',
      text: 'Shows how your private room temperatures and appliance schedules stay inside your home, while only safe totals are sent to the grid.',
    };
  }
  if (combined.includes('private local telemetry') || combined.includes('never shared')) {
    return {
      title: '🔒 Private Local Data',
      text: 'These personal habits (room temps, car models, shower schedules) are stored safely on your home device and never sent to anyone.',
    };
  }
  if (combined.includes('anonymizing shield') || combined.includes('anonymizer')) {
    return {
      title: '🛡️ Anonymizing Filter',
      text: 'Mathematical shield that strips out all personal identities before sending energy numbers to the power company.',
    };
  }
  if (combined.includes('what dso') || combined.includes('aggregated only')) {
    return {
      title: '📊 Public Grid View',
      text: 'The only thing the power company sees: a single combined number (e.g. 3.2 kW total reduction) without knowing what appliances you own.',
    };
  }
  if (combined.includes('granular data sharing') || combined.includes('permission')) {
    return {
      title: '🔐 Data Sharing Permissions',
      text: 'Toggle on or off individual data permissions. You have 100% control over what information is shared.',
    };
  }
  if (combined.includes('export data')) {
    return {
      title: '📥 Export Data File',
      text: 'Download a complete copy of your energy history and settings as a CSV or JSON file.',
    };
  }
  if (combined.includes('delete') && combined.includes('data')) {
    return {
      title: '🗑️ Erase All Personal Data',
      text: 'Permanently deletes all historical usage logs, habits, and schedules stored on your system.',
    };
  }
  if (combined.includes('audit log') || combined.includes('security activity')) {
    return {
      title: '📜 Security Audit Log',
      text: 'A permanent, tamper-proof record of every setting change, permission update, and automated action.',
    };
  }

  // ── Reliability & Offline Elements ──
  if (combined.includes('offline fallback') || combined.includes('internet loss')) {
    return {
      title: '📶 Offline Outage Simulator',
      text: 'Test how VoltFlow protects your home during internet or power network outages using local hardware memory.',
    };
  }
  if (combined.includes('household profiles') || combined.includes('access tiers')) {
    return {
      title: '👥 Household Access Tiers',
      text: 'Assign custom permission levels for homeowners, family members, shared EV drivers, or renting tenants.',
    };
  }
  if (combined.includes('problem reporting') || combined.includes('schedule feedback')) {
    return {
      title: '📝 Schedule Feedback Reporter',
      text: 'Report unexpected schedule conflicts or comfort issues so VoltFlow AI can improve your future routine.',
    };
  }

  // ── Future Energy Lab Elements ──
  if (id.includes('btn-future-v2h') || combined.includes('vehicle-to-home') || combined.includes('v2h')) {
    return {
      title: '🚗⚡ Vehicle-to-Home (V2H)',
      text: 'Use your electric car as a giant home battery! Power your home from your car when grid power is expensive to cut electricity bills.',
    };
  }
  if (id.includes('btn-future-community') || combined.includes('neighborhood battery') || combined.includes('community battery')) {
    return {
      title: '🏡 Neighborhood Battery Sharing',
      text: 'Sell extra rooftop solar power directly to your neighbors, or share a neighborhood battery pool to earn extra monthly cash.',
    };
  }
  if (id.includes('btn-future-market') || combined.includes('market bidding') || combined.includes('flexibility market')) {
    return {
      title: '📈 Flexibility Market Bidding',
      text: 'Offer unused household power back to the grid market during peak times to get paid top rates for keeping the grid stable.',
    };
  }
  if (combined.includes('peer-to-peer solar export') || combined.includes('peer solar')) {
    return {
      title: '🏡 Peer-to-Peer Solar Export',
      text: 'Sell extra daytime solar power directly to neighboring homes at €0.14/kWh instead of standard grid export.',
    };
  }
  if (combined.includes('community battery pool') || combined.includes('shared reserve')) {
    return {
      title: '🔋 Community Battery Pool Opt-In',
      text: 'Join your Powerwall to a shared 120 kWh neighborhood battery pool to help neighbors and earn €8.20/month.',
    };
  }

  // ── Controls, Inputs & Toggles Generic Heuristics ──
  if (cls.includes('switch-toggle') || cls.includes('switch-row')) {
    return {
      title: '🔘 On / Off Setting Switch',
      text: 'Toggle this switch to turn this automated energy feature on or off.',
    };
  }
  if (typeAttr === 'range' || cls.includes('slider')) {
    return {
      title: '🎚️ Comfort & Limit Slider',
      text: 'Slide left or right to set your minimum comfort threshold or power reserve level.',
    };
  }
  if (typeAttr === 'time') {
    return {
      title: '⏰ Target Time Setting',
      text: 'Choose your desired completion time or departure deadline.',
    };
  }
  if (tagName === 'button' || cls.includes('btn')) {
    const btnText = (el.innerText || '').trim();
    if (btnText && btnText.length < 35) {
      return {
        title: `🔘 ${btnText}`,
        text: `Click this button to activate the ${btnText.toLowerCase()} action.`,
      };
    }
  }

  // Generic card title extraction
  const titleEl = el.querySelector('.card-title, h1, h2, h3, h4, .kpi-label, strong') || el;
  const rawTitle = (titleEl ? titleEl.innerText : el.innerText || '').trim();
  if (rawTitle && rawTitle.length > 2 && rawTitle.length < 45) {
    const cleanTitle = rawTitle.split('\n')[0].replace(/[^a-zA-Z0-9\s\-–—/]/g, '').trim();
    if (cleanTitle) {
      return {
        title: `📊 ${cleanTitle}`,
        text: `Live status, metrics, and automated controls for ${cleanTitle.toLowerCase()}.`,
      };
    }
  }

  return {
    title: '⚡ Energy System Element',
    text: 'Live status, telemetry data, or interactive control for your household energy system.',
  };
}

export const KnowEverythingInspector = () => {
  const { isKnowEverythingMode, toggleKnowEverythingMode } = useEnergy();
  const [hoverInfo, setHoverInfo] = useState(null);
  const [highlightBox, setHighlightBox] = useState(null);
  const activeElRef = useRef(null);

  useEffect(() => {
    if (!isKnowEverythingMode) {
      setHoverInfo(null);
      setHighlightBox(null);
      activeElRef.current = null;
      return;
    }

    const handleMouseOver = (e) => {
      // Find the closest meaningful UI element
      const target = e.target.closest('[data-explain]') || 
                     e.target.closest('button') || 
                     e.target.closest('.glass-card') || 
                     e.target.closest('.kpi-card') || 
                     e.target.closest('.device-card') ||
                     e.target.closest('.nav-tab') ||
                     e.target.closest('.switch-row') ||
                     e.target.closest('.grid-signal-pill') ||
                     e.target.closest('.priority-item') ||
                     e.target.closest('input[type="range"]');

      if (!target || target === activeElRef.current) {
        return;
      }

      activeElRef.current = target;
      const explanation = getCitizenExplanation(target);
      const rect = target.getBoundingClientRect();

      setHighlightBox({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });

      const tooltipWidth = 290;
      const tooltipHeight = 110;
      const margin = 14;

      // Smart placement: try below first, then above, then right, then left
      let top = rect.bottom + margin;
      let left = Math.min(Math.max(rect.left + rect.width / 2 - tooltipWidth / 2, margin), window.innerWidth - tooltipWidth - margin);

      if (top + tooltipHeight > window.innerHeight - margin) {
        // Place above
        top = rect.top - tooltipHeight - margin;
        if (top < margin) {
          top = Math.max(margin, Math.min(rect.top, window.innerHeight - tooltipHeight - margin));
          left = rect.right + margin;
          if (left + tooltipWidth > window.innerWidth - margin) {
            left = Math.max(margin, rect.left - tooltipWidth - margin);
          }
        }
      }

      setHoverInfo({
        title: explanation.title,
        text: explanation.text,
        top,
        left,
      });
    };

    const handleScrollOrResize = () => {
      if (activeElRef.current) {
        const rect = activeElRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setHighlightBox({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          });
        }
      }
    };

    const handleMouseLeave = (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest) {
        setHoverInfo(null);
        setHighlightBox(null);
        activeElRef.current = null;
      }
    };

    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mouseout', handleMouseLeave, { passive: true });
    window.addEventListener('scroll', handleScrollOrResize, { passive: true, capture: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('scroll', handleScrollOrResize, { capture: true });
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isKnowEverythingMode]);

  // ── Keyboard shortcut listener (Esc key exits Know Everything Mode) ──
  useEffect(() => {
    if (!isKnowEverythingMode) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.code === 'Escape') {
        e.preventDefault();
        toggleKnowEverythingMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isKnowEverythingMode, toggleKnowEverythingMode]);

  if (!isKnowEverythingMode) return null;

  return (
    <>
      {/* ── Visual Target Highlight Box ── */}
      {highlightBox && (
        <div
          style={{
            position: 'fixed',
            top: highlightBox.top - 4,
            left: highlightBox.left - 4,
            width: highlightBox.width + 8,
            height: highlightBox.height + 8,
            borderRadius: '14px',
            border: '2px solid rgba(5, 150, 105, 0.85)',
            boxShadow: '0 0 0 3px rgba(5, 150, 105, 0.15), 0 0 20px rgba(5, 150, 105, 0.25)',
            pointerEvents: 'none',
            zIndex: 99990,
            transition: 'top 0.12s ease-out, left 0.12s ease-out, width 0.12s ease-out, height 0.12s ease-out',
          }}
        />
      )}

      {/* ── Bottom Floating Mode Status Pill ── */}
      <div style={{
        position: 'fixed',
        bottom: '22px',
        right: '22px',
        zIndex: 99999,
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(16px)',
        color: '#ffffff',
        padding: '0.6rem 1rem',
        borderRadius: '16px',
        border: '1.5px solid rgba(5, 150, 105, 0.5)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.3), 0 0 16px rgba(5,150,105,0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.82rem'
      }}>
        <div style={{
          background: '#059669',
          color: '#ffffff',
          borderRadius: '50%',
          width: 26,
          height: 26,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 10px rgba(5,150,105,0.5)'
        }}>
          <Sparkles size={15} />
        </div>
        <div>
          <div style={{ fontWeight: 800, color: '#34d399', fontSize: '0.85rem' }}>💡 Simple Explainer Active</div>
          <div style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>Hover over any card, button, or graph</div>
        </div>
        <button
          onClick={toggleKnowEverythingMode}
          style={{
            background: 'rgba(255,255,255,0.14)',
            border: 'none',
            color: '#cbd5e1',
            padding: '4px 9px',
            borderRadius: '8px',
            cursor: 'pointer',
            marginLeft: '0.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.74rem',
            fontWeight: 700
          }}
        >
          <kbd style={{ background: 'rgba(255,255,255,0.2)', padding: '1px 5px', borderRadius: '4px', fontSize: '0.68rem', fontFamily: 'inherit' }}>Esc</kbd>
          <span>Exit</span>
        </button>
      </div>

      {/* ── Plain-English Tooltip ── */}
      {hoverInfo && (
        <div style={{
          position: 'fixed',
          top: `${hoverInfo.top}px`,
          left: `${hoverInfo.left}px`,
          zIndex: 100000,
          width: '290px',
          maxWidth: 'calc(100vw - 28px)',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid #059669',
          borderRadius: '14px',
          padding: '0.8rem 1rem',
          boxShadow: '0 12px 36px rgba(0,0,0,0.18), 0 4px 14px rgba(5, 150, 105, 0.25)',
          pointerEvents: 'none',
          animation: 'fadeInTooltip 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}>
          {hoverInfo.title && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#047857',
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
              marginBottom: '4px'
            }}>
              <Info size={13} color="#059669" />
              {hoverInfo.title}
            </div>
          )}
          <div style={{
            fontSize: '0.84rem',
            fontWeight: 600,
            color: '#0f172a',
            lineHeight: 1.45
          }}>
            {hoverInfo.text}
          </div>
        </div>
      )}
    </>
  );
};
