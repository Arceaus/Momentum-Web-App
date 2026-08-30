import React, { useState } from 'react';
import { useApp, parseMinutes } from '../context/AppContext';
import { History, ChevronDown, ChevronUp, Calendar, Trash2, CheckCircle2, Clock, Sparkles } from 'lucide-react';

export default function HistoryLogSection() {
  const { historyLog, deleteDateHistory } = useApp();

  const [expandedDates, setExpandedDates] = useState(() => {
    const initial = {};
    if (historyLog && historyLog.length > 0) {
      historyLog.forEach((item, idx) => {
        if (idx < 2) initial[item.dateStr] = true;
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
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
      }
    } catch (e) {
      console.warn('Date format error:', e);
    }
    return (displayDate || dateStr).toUpperCase();
  };

  return (
    <div className="history-section-card glass-card">
      <div className="history-header">
        <div className="history-title-group">
          <History size={20} className="history-icon" />
          <div>
            <h3 className="history-main-title">History & Accomplishments</h3>
            <span className="history-sub-title">Detailed record of completed past tasks</span>
          </div>
        </div>
      </div>

      <div className="history-list">
        {(!historyLog || historyLog.length === 0) ? (
          <div className="empty-history">
            <Calendar size={32} opacity={0.6} />
            <p>No past accomplishments recorded yet. Complete tasks on Today to build your history log!</p>
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
              <div key={dayItem.dateStr} className="history-day-card">
                {/* Accordion Header */}
                <div
                  className="history-day-header"
                  onClick={() => toggleExpand(dayItem.dateStr)}
                >
                  <div className="day-header-left">
                    <div className="day-title-row">
                      <span className="day-bold-date">{headerDateStr}</span>
                    </div>

                    <div className="day-meta-stats">
                      <span className="stat-chip">
                        <Sparkles size={11} className="chip-sparkle" /> {taskCount} task{taskCount === 1 ? '' : 's'} completed
                      </span>
                      <span className="stat-chip">
                        <Clock size={11} className="chip-clock" /> {formatFocusDuration(totalMins)}
                      </span>
                    </div>
                  </div>

                  <div className="day-header-right">
                    <button
                      type="button"
                      className="delete-date-btn"
                      onClick={(e) => handleDeleteDate(e, dayItem.dateStr)}
                      title="Delete this date's history"
                    >
                      <Trash2 size={15} />
                    </button>
                    <div className="chevron-wrap">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </div>

                {/* Expandable Task Detail List */}
                {isExpanded && (
                  <div className="history-task-body">
                    <div className="history-divider" />

                    <div className="history-task-list">
                      {dayItem.tasks.map((task) => {
                        const mins = parseMinutes(task.timeEstimate);
                        return (
                          <div key={task.id} className="history-task-row">
                            <CheckCircle2 size={16} className="check-done-icon" />
                            <div className="task-info">
                              <span className="task-name">{task.title}</span>
                              <span className="task-sub-meta">
                                {task.category || 'Focus'} • {mins} min{mins === 1 ? '' : 's'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .history-section-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-top: 0.5rem;
        }
        .history-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .history-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .history-icon {
          color: var(--accent-primary);
        }
        .history-main-title {
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .history-sub-title {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .empty-history {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1rem;
          color: var(--text-muted);
          gap: 10px;
          text-align: center;
          font-size: 0.875rem;
        }
        .history-day-card {
          background: var(--bg-surface-solid);
          border: var(--border-light);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: border-color 0.2s ease;
        }
        .history-day-card:hover {
          border-color: rgba(255, 255, 255, 0.18);
        }
        .history-day-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 1.35rem;
          background: transparent;
          border: none;
          color: var(--text-main);
          cursor: pointer;
          font-family: var(--font-body);
          text-align: left;
        }
        .day-header-left {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .day-bold-date {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.05rem;
          letter-spacing: 0.05em;
          color: var(--text-main);
        }
        .day-meta-stats {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .stat-chip {
          font-size: 0.775rem;
          color: var(--text-secondary);
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .chip-sparkle {
          color: var(--accent-primary);
        }
        .chip-clock {
          color: #38BDF8;
        }
        .day-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--text-muted);
        }
        .delete-date-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 5px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          transition: all 0.2s ease;
        }
        .delete-date-btn:hover {
          color: var(--badge-coral-text);
          background: var(--badge-coral-bg);
        }
        .chevron-wrap {
          display: flex;
          align-items: center;
          color: var(--text-secondary);
        }
        .history-task-body {
          display: flex;
          flex-direction: column;
          padding: 0 1.35rem 1.25rem 1.35rem;
        }
        .history-divider {
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin-bottom: 1rem;
        }
        .history-task-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .history-task-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 4px 0;
        }
        .check-done-icon {
          color: var(--accent-primary);
          flex-shrink: 0;
          margin-top: 3px;
        }
        .task-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .task-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-main);
          line-height: 1.3;
        }
        .task-sub-meta {
          font-size: 0.775rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
