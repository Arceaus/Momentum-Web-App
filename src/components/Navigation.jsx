import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, History, Settings } from 'lucide-react';

export default function Navigation() {
  const { activeTab, setActiveTab, completedTodayCount, totalTasksToday, historyLog } = useApp();

  const totalHistoryCount = historyLog ? historyLog.reduce((acc, item) => acc + (item.completedCount || item.tasks.length), 0) : 0;

  const tabs = [
    { id: 'today', label: 'Today', icon: CheckCircle2, badge: totalTasksToday > 0 ? `${completedTodayCount}/${totalTasksToday}` : null },
    { id: 'history', label: 'History', icon: History, badge: totalHistoryCount > 0 ? `${totalHistoryCount}` : null },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="nav-bar-container">
      <nav className="nav-bar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-tab ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {isActive && <div className="nav-tab-bg" />}
              <Icon size={16} strokeWidth={isActive ? 2.3 : 1.8} />
              <span>{tab.label}</span>
              {tab.badge && <span className="nav-badge">{tab.badge}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
