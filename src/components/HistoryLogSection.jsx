import React, { useState } from 'react';
import { useApp, parseMinutes } from '../context/AppContext';
import GitHubContributionGraph from './GitHubContributionGraph';
import { ChevronDown, ChevronUp, Trash2, Check, Clock, Archive } from 'lucide-react';

export default function HistoryLogSection() {
  const { historyLog, deleteDateHistory, activityLog, totalProductiveDays, totalCompletedAllTime } = useApp();

  const [expandedDates, setExpandedDates] = useState(() => {
    const initial = {};
    if (historyLog && historyLog.length > 0) {
      historyLog.forEach((item, idx) => {
        if (idx < 3) initial[item.dateStr] = true;
      });
    }
    return initial;
  });

  const toggleExpand = (dateStr) => {
    setExpandedDates((prev) => ({
      ...prev,
      [dateStr]: !prev[dateStr],
    }));
  };

  const handleDeleteDate = (e, dateStr) => {
    e.stopPropagation();
    deleteDateHistory(dateStr);
  };

  const formatFocusDuration = (totalMins) => {
    if (!totalMins || totalMins <= 0) return '0m focused';
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? mins + 'm ' : ''}focused`;
    }
    return `${mins}m focused`;
  };

  const formatHeaderDate = (dateStr, displayDate) => {
    if (!dateStr) return displayDate || 'DATE';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).toUpperCase();
      }
    } catch (e) {
      console.warn('Date format error:', e);
    }
    return (displayDate || dateStr).toUpperCase();
  };

  // Dynamic streak calculation
  let streak = 0;
  let checkDate = new Date();
  while (true) {
    const ds = checkDate.toISOString().split('T')[0];
    const entry = activityLog[ds];
    const c = typeof entry === 'object' ? (entry.count || 0) : (typeof entry === 'number' ? entry : 0);
    if (c > 0) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Total Focus Hours calculation
  const totalFocusMinutes = Object.values(activityLog || {}).reduce((sum, entry) => {
    const mins = typeof entry === 'object' ? (entry.minutes || 0) : (typeof entry === 'number' ? entry * 20 : 0);
    return sum + mins;
  }, 0);
  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);

  return (
    <div className="history-view-container" aria-label="Personal Work Record">
      {/* ---------------------------------------------------------------------
         1. Typography-First High-Level Statistics Strip (Non-Card Heavy)
         --------------------------------------------------------------------- */}
      <section className="stats-typographic-strip">
        <div className="stat-metric-cell">
          <span className="stat-large-val font-mono">{String(streak).padStart(2, '0')}</span>
          <span className="stat-label-caps">DAY STREAK</span>
        </div>

        <div className="stat-metric-cell">
          <span className="stat-large-val font-mono">{String(totalCompletedAllTime).padStart(2, '0')}</span>
          <span className="stat-label-caps">TASKS COMPLETED</span>
        </div>

        <div className="stat-metric-cell">
          <span className="stat-large-val font-mono">{String(totalProductiveDays).padStart(2, '0')}</span>
          <span className="stat-label-caps">PRODUCTIVE DAYS</span>
        </div>

        <div className="stat-metric-cell">
          <span className="stat-large-val font-mono">{totalFocusHours}h</span>
          <span className="stat-label-caps">TOTAL FOCUS TIME</span>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
         2. Integrated Annual Activity Chronicle (Restrained Archival Grid)
         --------------------------------------------------------------------- */}
      <GitHubContributionGraph />

      {/* ---------------------------------------------------------------------
         3. Archival Work History Ledger (Grouped Chronological Archive)
         --------------------------------------------------------------------- */}
      <section className="archive-ledger-card">
        {/* Ledger Header */}
        <div className="ledger-header">
          <div className="ledger-title-group">
            <span className="ledger-eyebrow">CHRONOLOGICAL ARCHIVE</span>
            <h3 className="ledger-heading">Accomplishment Ledger</h3>
          </div>
          <span className="ledger-counter font-mono">
            {historyLog ? historyLog.length : 0} RECORDED DAYS
          </span>
        </div>

        {/* Chronological Entries */}
        <div className="ledger-entries-list">
          {(!historyLog || historyLog.length === 0) ? (
            <div className="empty-archive">
              <Archive size={32} strokeWidth={1.5} className="empty-archive-glyph" />
              <div className="empty-archive-text">
                <h4>No Historical Records Yet</h4>
                <p>Complete focus tasks on Today to populate your personal accomplishment ledger.</p>
              </div>
            </div>
          ) : (
            historyLog.map((dayItem) => {
              const isExpanded = !!expandedDates[dayItem.dateStr];
              const taskCount = dayItem.completedCount || dayItem.tasks.length;

              const totalMins = dayItem.tasks.reduce((sum, t) => {
                return sum + parseMinutes(t.timeEstimate);
              }, 0);

              const headerDateStr = formatHeaderDate(dayItem.dateStr, dayItem.displayDate);

              return (
                <div key={dayItem.dateStr} className={`archive-date-block ${isExpanded ? 'expanded' : ''}`}>
                  {/* Date Section Header Bar */}
                  <div
                    className="archive-date-bar"
                    onClick={() => toggleExpand(dayItem.dateStr)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        toggleExpand(dayItem.dateStr);
                      }
                    }}
                    aria-expanded={isExpanded}
                  >
                    <div className="date-bar-left">
                      <span className="date-heading font-mono">{headerDateStr}</span>
                      <div className="date-sub-meta">
                        <span className="date-badge font-mono">
                          {taskCount} TASK{taskCount === 1 ? '' : 'S'}
                        </span>
                        <span className="duration-stamp font-mono">
                          <Clock size={11} className="clock-icon" /> {formatFocusDuration(totalMins)}
                        </span>
                      </div>
                    </div>

                    <div className="date-bar-right">
                      <button
                        type="button"
                        className="delete-record-btn"
                        onClick={(e) => handleDeleteDate(e, dayItem.dateStr)}
                        title="Delete this date's archive record"
                        aria-label={`Delete record for ${headerDateStr}`}
                      >
                        <Trash2 size={13} />
                      </button>

                      <span className="expand-indicator">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </span>
                    </div>
                  </div>

                  {/* Historical Task List (Collapsible) */}
                  {isExpanded && (
                    <div className="archive-tasks-table" role="list">
                      {dayItem.tasks.map((task, tIdx) => {
                        const mins = parseMinutes(task.timeEstimate);
                        return (
                          <div key={task.id || tIdx} className="archive-task-row" role="listitem">
                            <div className="task-status-mark" aria-hidden="true">
                              <Check size={12} className="check-mark-icon" />
                            </div>

                            <div className="task-main-cell">
                              <span className="task-title-text">{task.title}</span>
                            </div>

                            <div className="task-meta-cell">
                              <span className={`badge badge-${task.category ? task.category.toLowerCase() : 'focus'}`}>
                                {task.category || 'Focus'}
                              </span>

                              <span className="task-mins font-mono">
                                {mins}m
                              </span>

                              {task.completedAt && (
                                <span className="task-time font-mono" title={`Completed at ${task.completedAt}`}>
                                  {task.completedAt}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      <style>{`
        /* ==========================================================================
           History & Activity View (Personal Work Record Architecture)
           ========================================================================== */
        .history-view-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
        }

        /* 1. Typography-First Statistics Strip */
        .stats-typographic-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
        }

        .stat-metric-cell {
          display: flex;
          flex-direction: column;
          padding: 1.25rem 1.15rem;
          border-right: 1px solid var(--border-subtle);
          gap: 4px;
        }

        .stat-metric-cell:last-child {
          border-right: none;
        }

        .stat-large-val {
          font-size: 2.35rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1;
          letter-spacing: -0.03em;
        }

        .stat-label-caps {
          font-family: var(--font-mono);
          font-size: 0.675rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          margin-top: 2px;
        }

        /* 2. Archival Work History Ledger */
        .archive-ledger-card {
          display: flex;
          flex-direction: column;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .ledger-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .ledger-title-group {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .ledger-eyebrow {
          font-family: var(--font-mono);
          font-size: 0.675rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }

        .ledger-heading {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .ledger-counter {
          font-size: 0.725rem;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }

        /* Date Blocks */
        .ledger-entries-list {
          display: flex;
          flex-direction: column;
        }

        .archive-date-block {
          border-bottom: 1px solid var(--border-subtle);
        }

        .archive-date-block:last-child {
          border-bottom: none;
        }

        .archive-date-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.95rem 1.35rem;
          background: var(--bg-surface);
          cursor: pointer;
          transition: background-color var(--duration-fast) ease;
        }

        .archive-date-bar:hover {
          background: var(--bg-subtle);
        }

        .date-bar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .date-heading {
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: var(--text-primary);
        }

        .date-sub-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .date-badge {
          font-size: 0.675rem;
          font-weight: 600;
          padding: 1px 6px;
          border-radius: var(--radius-xs);
          background: var(--bg-subtle);
          color: var(--text-secondary);
          border: 1px solid var(--border-subtle);
        }

        .duration-stamp {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        .clock-icon {
          color: var(--text-faint);
        }

        .date-bar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .delete-record-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          background: transparent;
          border: none;
          color: var(--text-faint);
          border-radius: var(--radius-xs);
          cursor: pointer;
          transition: all var(--duration-fast) ease;
        }

        .delete-record-btn:hover {
          color: var(--danger);
          background: var(--danger-light);
        }

        .expand-indicator {
          color: var(--text-muted);
          display: flex;
        }

        /* Historical Tasks Table */
        .archive-tasks-table {
          display: flex;
          flex-direction: column;
          background: #FAF8F5;
          border-top: 1px solid var(--border-subtle);
        }

        .archive-task-row {
          display: flex;
          align-items: center;
          padding: 0.65rem 1.35rem 0.65rem 1.85rem;
          border-bottom: 1px solid var(--border-subtle);
          gap: 12px;
          transition: background-color var(--duration-fast) ease;
        }

        .archive-task-row:last-child {
          border-bottom: none;
        }

        .archive-task-row:hover {
          background: #F5F1EB;
        }

        .task-status-mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          border-radius: 1px;
          background: var(--success-light);
          color: var(--success);
          border: 1px solid var(--success-border);
          flex-shrink: 0;
        }

        .check-mark-icon {
          stroke-width: 2.5;
        }

        .task-main-cell {
          flex: 1;
          min-width: 0;
        }

        .task-title-text {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          line-height: 1.35;
          word-break: break-word;
        }

        .task-meta-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .task-mins {
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        .task-time {
          font-size: 0.6875rem;
          color: var(--text-faint);
        }

        /* Empty State */
        .empty-archive {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 3rem 1.5rem;
        }

        .empty-archive-glyph {
          color: var(--text-faint);
          flex-shrink: 0;
        }

        .empty-archive-text {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .empty-archive-text h4 {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .empty-archive-text p {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        /* Responsive */
        @media (max-width: 680px) {
          .stats-typographic-strip {
            grid-template-columns: repeat(2, 1fr);
          }

          .stat-metric-cell:nth-child(2) {
            border-right: none;
          }

          .stat-metric-cell:nth-child(1),
          .stat-metric-cell:nth-child(2) {
            border-bottom: 1px solid var(--border-subtle);
          }

          .archive-task-row {
            flex-wrap: wrap;
            padding: 0.75rem 1rem;
            gap: 6px;
          }

          .task-main-cell {
            width: calc(100% - 28px);
          }

          .task-meta-cell {
            width: 100%;
            padding-left: 28px;
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
