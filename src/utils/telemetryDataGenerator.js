// Organic Heartbeat Telemetry Data Generators with Natural Micro-Zigzags

/**
 * Graph 1: 3-Series Solar PV, Home Load & Storage Flow with Heartbeat Micro-Zigzags (96 points — 15 min resolution)
 */
export function generateSolarGridHeartbeatData() {
  const points = [];
  const totalMinutes = 24 * 60;

  for (let m = 0; m < totalMinutes; m += 15) {
    const hours = Math.floor(m / 60);
    const mins = m % 60;
    const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    const step = m / 15;

    // Organic Heartbeat Harmonics (sine/cosine pulse combinations)
    const wave1 = Math.sin(step * 0.45) * 0.75;
    const wave2 = Math.cos(step * 0.95) * 0.40;
    const pulse = Math.sin(step * 1.7) * 0.30;

    // 1. Solar PV Curve (Amber - bell arc + organic solar jitter)
    let solarBase = 0;
    if (m >= 360 && m <= 1140) {
      const normSolar = (m - 360) / (1140 - 360);
      solarBase = Math.sin(normSolar * Math.PI) * 6.5;
    }
    const solarKw = Math.max(0, parseFloat((solarBase + (solarBase > 0 ? (wave1 + wave2 + pulse) * 0.55 : 0)).toFixed(2)));

    // 2. Household Load Curve (Blue - organic heartbeat undulations)
    let homeBase = 1.2;
    if (m >= 420 && m <= 540) homeBase = 3.8; // Morning surge
    else if (m >= 1050 && m <= 1260) homeBase = 4.6; // Evening surge
    else if (m > 540 && m < 1050) homeBase = 0.6;

    const homeKw = Math.max(0.2, parseFloat((homeBase + wave1 * 0.65 - wave2 * 0.45 + pulse).toFixed(2)));

    // 3. Storage / Powerwall Flow (Red - balancing heartbeat curve)
    let batteryBase = 0.8;
    if (solarKw > homeKw) batteryBase = solarKw - homeKw;
    else batteryBase = homeKw * 0.65;

    const batteryKw = Math.max(0.1, parseFloat((batteryBase - wave2 * 0.5 + wave1 * 0.3 + pulse * 0.5).toFixed(2)));

    let status = 'Grid Balanced';
    let statusColor = 'green';
    if (solarKw > 4.5) { status = '☀️ Solar Peak'; statusColor = 'green'; }
    else if (homeKw > 4.0) { status = '⚡ High Home Load'; statusColor = 'amber'; }
    else if (batteryKw > 3.0) { status = '🔋 Powerwall Active'; statusColor = 'cyan'; }

    points.push({
      time: timeStr,
      solarKw,
      homeKw,
      batteryKw,
      status,
      statusColor
    });
  }
  return points;
}

/**
 * Graph 2: 3-Series Substation Tariff, Transformer Load & Congestion Risk with Heartbeat Micro-Zigzags (96 points)
 */
export function generateSubstationTariffHeartbeatData() {
  const points = [];
  const totalMinutes = 24 * 60;

  for (let m = 0; m < totalMinutes; m += 15) {
    const hours = Math.floor(m / 60);
    const mins = m % 60;
    const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    const step = m / 15;

    const wave1 = Math.sin(step * 0.4) * 0.04;
    const wave2 = Math.cos(step * 0.85) * 0.025;
    const pulse = Math.sin(step * 1.6) * 0.015;

    // 1. Dynamic Tariff (€/kWh) (Green)
    let tariffBase = 0.09;
    if (m >= 420 && m <= 540) tariffBase = 0.24;
    else if (m >= 1050 && m <= 1260) tariffBase = 0.42;
    else if (m > 540 && m < 1050) tariffBase = 0.12;

    const tariffRate = Math.max(0.04, parseFloat((tariffBase + wave1 + wave2 + pulse).toFixed(3)));

    // 2. Transformer Load (MVA) (Blue)
    let mvaBase = 1.6;
    if (m >= 420 && m <= 540) mvaBase = 3.6;
    else if (m >= 1050 && m <= 1260) mvaBase = 5.4;
    else if (m > 540 && m < 1050) mvaBase = 2.0;

    const gridLoadMva = Math.max(0.5, parseFloat((mvaBase + (wave1 + wave2) * 20 + pulse * 10).toFixed(2)));

    // 3. Congestion Risk Index (Red)
    const congestionIndex = parseFloat((gridLoadMva * 1.45 + (wave2 * 30)).toFixed(1));

    let status = 'Normal Grid Load';
    let statusColor = 'green';
    if (tariffRate >= 0.35) { status = '🔴 Red Congestion Spike'; statusColor = 'violet'; }
    else if (tariffRate >= 0.18) { status = '🟡 Moderate Peak'; statusColor = 'amber'; }

    points.push({
      time: timeStr,
      tariffRate,
      gridLoadMva,
      congestionIndex,
      status,
      statusColor
    });
  }
  return points;
}

/**
 * Graph 3: 3-Series 30-Day Savings, Payouts & Net Returns (30 points)
 */
export function generateSavingsCumulativeHeartbeatData() {
  const points = [];
  const days = 30;

  let cumSavings = 0;
  let cumFlex = 0;

  for (let d = 1; d <= days; d++) {
    const timeStr = `Day ${d}`;
    const wave = Math.sin(d * 0.8) * 0.75 + Math.cos(d * 1.4) * 0.45;

    cumSavings += 4.20 + wave * 0.4;
    cumFlex += 1.30 + (Math.cos(d * 0.6) * 0.3);
    const netReturn = cumSavings + cumFlex;

    let status = 'Savings Active';
    let statusColor = 'green';
    if (d === 30) { status = '🎯 €191.30 Month Total'; statusColor = 'green'; }

    points.push({
      time: timeStr,
      cumulativeSavings: parseFloat(cumSavings.toFixed(2)),
      flexEarnings: parseFloat(cumFlex.toFixed(2)),
      netReturn: parseFloat(netReturn.toFixed(2)),
      status,
      statusColor
    });
  }
  return points;
}
