import React, { useState } from 'react';
import { EnergyProvider } from './context/EnergyContext';
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
        <NavBar activeTab={activeTab} setActiveTab={handleTabChange} />
      </div>

      {/* Primary Dynamic Main Content — Animated Tab View */}
      <main className="main-content">
        <div key={animKey} style={{ animation: 'viewFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
          {/* Module 1: Live Energy Overview */}
          {activeTab === 'overview' && <OverviewView />}

          {/* Module 2: Connected Fleet Hardware & Wizard */}
          {activeTab === 'devices' && (
            <DevicesView onOpenAddDeviceWizard={() => setShowAddDeviceModal(true)} />
          )}

          {/* Module 3: Smart Scheduling & 7-Day Gantt */}
          {activeTab === 'scheduling' && (
            <SchedulingView onOpenDeadlineModal={() => setShowDeadlineModal(true)} />
          )}

          {/* Module 4: Priorities & User Control Thresholds */}
          {activeTab === 'controls' && (
            <ControlsView 
              onOpenOverrideModal={() => setShowOverrideModal(true)}
              onOpenEmergencyModal={() => setShowEmergencyModal(true)}
            />
          )}

          {/* Module 5: Grid Signals & AI Advice Explanations */}
          {activeTab === 'grid' && <GridIntelligenceView />}

          {/* Modules 6 & 7: Savings, Rewards & EV Guarantees */}
          {activeTab === 'savings' && <SavingsView />}

          {/* Module 8: Granular Privacy & DSO Shield */}
          {activeTab === 'privacy' && <PrivacyView />}

          {/* Modules 9 & 10: Offline Safe Mode & Household Support */}
          {activeTab === 'reliability' && <ReliabilityView />}

          {/* Module 11: Future V2H Energy Lab */}
          {activeTab === 'future_lab' && <FutureLabView />}
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
