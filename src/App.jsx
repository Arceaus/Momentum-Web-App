import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import TodayView from './components/TodayView';
import HistoryLogSection from './components/HistoryLogSection';
import SettingsView from './components/SettingsView';
import LevelBar from './components/LevelBar';
import OnboardingModal from './components/OnboardingModal';
import Toast from './components/Toast';

function AppContent() {
  const { activeTab, user } = useApp();

  return (
    <>
      {/* Onboarding Modal if user hasn't set their name */}
      {!user.hasOnboarded && <OnboardingModal />}

      <div className="app-container">
        {/* Top Centered Hero Header */}
        <Header />

        {/* Centered Minimal Navigation */}
        <Navigation />

        {/* Main Tab View */}
        <main className="main-content">
          <div key={activeTab} className="workspace-tab-pane">
            {activeTab === 'today' && <TodayView />}
            {activeTab === 'history' && <HistoryLogSection />}
            {activeTab === 'settings' && <SettingsView />}
          </div>
        </main>

        {/* Level Progress Indicator */}
        <LevelBar />

        {/* Toast Notification */}
        <Toast />
      </div>

      <style>{`
        .main-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          min-height: 400px;
        }
        .workspace-tab-pane {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          animation: tabFadeIn var(--duration-fast) ease-out;
        }
        @keyframes tabFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
