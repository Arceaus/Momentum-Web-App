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

      {/* Glowing Ambient Background Auras */}
      <div className="bg-ambient-blob blob-1" />
      <div className="bg-ambient-blob blob-2" />
      <div className="bg-ambient-blob blob-3" />

      <div className="app-container">
        {/* Top Centered Hero Header */}
        <Header />

        {/* Centered Minimal Navigation */}
        <Navigation />

        {/* Main Tab View */}
        <main className="main-content">
          {activeTab === 'today' && <TodayView />}
          {activeTab === 'history' && <HistoryLogSection />}
          {activeTab === 'settings' && <SettingsView />}
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
