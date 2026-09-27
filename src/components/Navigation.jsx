import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, History, Settings } from 'lucide-react';

export default function Navigation() {
  const { activeTab, setActiveTab, completedTodayCount, totalTasksToday, historyLog } = useApp();

  const totalHistoryCount = historyLog ? historyLog.reduce((acc, item) => acc + (item.completedCount || item.tasks.length), 0) : 0;

  const tabs = [
    {
      id: 'today',
      label: 'Today',
      icon: CheckCircle2,
      badge: totalTasksToday > 0 ? `${completedTodayCount}/${totalTasksToday}` : null,
    },
    {
      id: 'history',
      label: 'History',
      icon: History,
      badge: totalHistoryCount > 0 ? `${totalHistoryCount}` : null,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Desktop Integrated Navigation Strip */}
      <nav className="workspace-nav-strip" aria-label="Workspace Navigation">
        <div className="nav-tabs-row">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`workspace-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={14} strokeWidth={isActive ? 2.2 : 1.75} className="tab-icon" />
                <span className="tab-title">{tab.label}</span>
                {tab.badge && (
                  <span className={`tab-counter ${isActive ? 'active' : ''}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Dedicated Docked Navigation System */}
      <nav className="mobile-nav-dock" aria-label="Mobile Bottom Navigation">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`mobile-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="mobile-icon-cluster">
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.75} className="mobile-icon" />
                {tab.badge && (
                  <span className={`mobile-badge ${isActive ? 'active' : ''}`}>
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="mobile-tab-text">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <style>{`
        /* ==========================================================================
           Desktop Navigation Strip (Integrated, Architectural)
           ========================================================================== */
        .workspace-nav-strip {
          width: 100%;
          border-bottom: 1px solid var(--border);
          background: transparent;
          padding: 0;
          display: block;
        }

        .nav-tabs-row {
          display: flex;
          align-items: center;
          gap: 2px;
          margin-bottom: -1px; /* Align active bottom rule flush with container border */
        }

        .workspace-tab-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px;
          border: 1px solid transparent;
          border-bottom: 2px solid transparent;
          background: transparent;
          color: var(--text-muted);
          font-family: var(--font-heading);
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          border-radius: var(--radius-sm) var(--radius-sm) 0 0;
          cursor: pointer;
          transition: color var(--duration-fast) ease, background-color var(--duration-fast) ease;
        }

        .workspace-tab-btn:hover {
          color: var(--text-primary);
          background: var(--bg-hover);
        }

        .workspace-tab-btn.active {
          color: var(--text-primary);
          background: var(--bg-surface);
          border-color: var(--border) var(--border) transparent var(--border);
          border-bottom: 2px solid var(--accent);
        }

        .tab-icon {
          color: inherit;
          flex-shrink: 0;
        }

        .workspace-tab-btn.active .tab-icon {
          color: var(--accent);
        }

        .tab-counter {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          font-weight: 600;
          padding: 1px 6px;
          border-radius: var(--radius-xs);
          background: var(--bg-subtle);
          color: var(--text-secondary);
          border: 1px solid var(--border-subtle);
          letter-spacing: 0.02em;
        }

        .tab-counter.active {
          background: var(--accent-light);
          color: var(--accent);
          border-color: var(--accent-border);
        }

        /* ==========================================================================
           Mobile Docked Navigation System
           ========================================================================== */
        .mobile-nav-dock {
          display: none;
        }

        @media (max-width: 680px) {
          .workspace-nav-strip {
            display: none; /* Transition to mobile bottom dock */
          }

          .mobile-nav-dock {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 999;
            background: var(--bg-surface);
            border-top: 1px solid var(--border);
            padding: 4px 6px;
            padding-bottom: max(6px, env(safe-area-inset-bottom, 6px));
            box-shadow: 0 -2px 10px rgba(24, 23, 21, 0.06);
          }

          .mobile-tab-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            padding: 6px 4px;
            min-height: 48px;
            background: transparent;
            border: none;
            border-top: 2px solid transparent;
            color: var(--text-muted);
            cursor: pointer;
            transition: all var(--duration-fast) ease;
          }

          .mobile-tab-btn:hover {
            color: var(--text-primary);
          }

          .mobile-tab-btn.active {
            color: var(--text-primary);
            border-top-color: var(--accent);
          }

          .mobile-icon-cluster {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mobile-tab-btn.active .mobile-icon {
            color: var(--accent);
          }

          .mobile-tab-text {
            font-family: var(--font-heading);
            font-size: 0.6875rem;
            font-weight: 600;
            letter-spacing: 0.02em;
          }

          .mobile-badge {
            position: absolute;
            top: -6px;
            right: -14px;
            font-family: var(--font-mono);
            font-size: 0.6rem;
            font-weight: 700;
            padding: 0 4px;
            border-radius: var(--radius-xs);
            background: var(--bg-subtle);
            color: var(--text-secondary);
            border: 1px solid var(--border-subtle);
            line-height: 1.3;
          }

          .mobile-badge.active {
            background: var(--accent);
            color: white;
            border-color: var(--accent);
          }
        }
      `}</style>
    </>
  );
}
