import React, { useState } from 'react';
import { EnergyProvider, useEnergy } from './context/EnergyContext';
import { Header } from './components/Header';
import { NavBar } from './components/NavBar';
import { DemoMode } from './components/DemoMode';

// Views for all 11 requirement modules
import { OverviewView } from './components/views/OverviewView';
import { DevicesView } from './components/views/DevicesView';
import { SchedulingView } from './components/views/SchedulingView';
import { ControlsView } from './components/views/ControlsView';
import { GridIntelligenceView } from './components/views/GridIntelligenceView';
import { SavingsView } from './components/views/SavingsView';
import { PrivacyView } from './components/views/PrivacyView';
import { ReliabilityView } from './components/views/ReliabilityView';
import { FutureLabView } from './components/views/FutureLabView';

// Modals
import { AddDeviceModal } from './components/modals/AddDeviceModal';
import { OverrideModal } from './components/modals/OverrideModal';
import { EmergencyBoostModal } from './components/modals/EmergencyBoostModal';
import { DeadlineModal } from './components/modals/DeadlineModal';

import { AntigravityBackground } from './components/AntigravityBackground';
import { KnowEverythingInspector } from './components/KnowEverythingInspector';

function AppContent() {
  const { isSmartPlanner } = useEnergy();
  const [activeTab, setActiveTab] = useState('overview');
  const [animKey, setAnimKey] = useState(0);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Modal Visibility States
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setAnimKey(k => k + 1);
  };

  // Enforce essential tabs when in Smart Hands-Free mode
  const allowedTabs = isSmartPlanner 
    ? ['overview', 'devices', 'scheduling'] 
    : ['overview', 'devices', 'scheduling', 'controls', 'grid', 'savings', 'privacy', 'reliability', 'future_lab'];

  const effectiveTab = allowedTabs.includes(activeTab) ? activeTab : 'overview';

  return (
    <div className="app-container" style={{ position: 'relative', zIndex: 1 }}>
      {/* Floating Antigravity Background Engine */}
      <AntigravityBackground />

      {/* Sticky Glass Top Header + Navigation Bar */}
      <div className="top-sticky-container">
        <Header 
          onOpenOverrideModal={() => setShowOverrideModal(true)}
          onOpenEmergencyModal={() => setShowEmergencyModal(true)}
          onStartDemo={() => setIsDemoMode(true)}
          isDemoMode={isDemoMode}
        />

        {/* 9 Dedicated Tabs Single-Row Navigation Bar */}
        <NavBar activeTab={effectiveTab} setActiveTab={handleTabChange} />
      </div>

      {/* Primary Dynamic Main Content — Animated Tab View */}
      <main className="main-content">
        <div key={animKey} style={{ animation: 'viewFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
          {/* Module 1: Live Energy Overview */}
          {effectiveTab === 'overview' && <OverviewView />}

          {/* Module 2: Connected Fleet Hardware & Wizard */}
          {effectiveTab === 'devices' && (
            <DevicesView onOpenAddDeviceWizard={() => setShowAddDeviceModal(true)} />
          )}

          {/* Module 3: Smart Scheduling & 7-Day Gantt */}
          {effectiveTab === 'scheduling' && (
            <SchedulingView onOpenDeadlineModal={() => setShowDeadlineModal(true)} />
          )}

          {/* Module 4: Priorities & User Control Thresholds */}
          {effectiveTab === 'controls' && (
            <ControlsView 
              onOpenOverrideModal={() => setShowOverrideModal(true)}
              onOpenEmergencyModal={() => setShowEmergencyModal(true)}
            />
          )}

          {/* Module 5: Grid Signals & AI Advice Explanations */}
          {effectiveTab === 'grid' && <GridIntelligenceView />}

          {/* Modules 6 & 7: Savings, Rewards & EV Guarantees */}
          {effectiveTab === 'savings' && <SavingsView />}

          {/* Module 8: Granular Privacy & DSO Shield */}
          {effectiveTab === 'privacy' && <PrivacyView />}

          {/* Modules 9 & 10: Offline Safe Mode & Household Support */}
          {effectiveTab === 'reliability' && <ReliabilityView />}

          {/* Module 11: Future V2H Energy Lab */}
          {effectiveTab === 'future_lab' && <FutureLabView />}
        </div>
      </main>

      {/* Modals */}
      {showAddDeviceModal && <AddDeviceModal onClose={() => setShowAddDeviceModal(false)} />}
      {showOverrideModal && <OverrideModal onClose={() => setShowOverrideModal(false)} />}
      {showEmergencyModal && <EmergencyBoostModal onClose={() => setShowEmergencyModal(false)} />}
      {showDeadlineModal && <DeadlineModal onClose={() => setShowDeadlineModal(false)} />}

      {/* Universal Interactive Inspector Mode Tooltip Engine */}
      <KnowEverythingInspector />

      {/* Auto Demo Mode Overlay */}
      {isDemoMode && (
        <DemoMode
          setActiveTab={handleTabChange}
          onStop={() => setIsDemoMode(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <EnergyProvider>
      <AppContent />
    </EnergyProvider>
  );
}
