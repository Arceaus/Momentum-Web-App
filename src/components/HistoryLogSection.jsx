import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { History, ChevronDown, ChevronUp, CheckCircle2, Clock, Calendar, Trash2 } from 'lucide-react';

const CATEGORY_CLASSES = {
  Focus: 'badge-focus',
  Work: 'badge-work',
  Creative: 'badge-creative',
  Personal: 'badge-personal',
  Health: 'badge-health',
  Reading: 'badge-reading',
};

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
            return (
              <div key={dayItem.dateStr} className="history-day-card">
                {/* Accordion Header */}
                <div
                  className="history-day-header"
                  onClick={() => toggleExpand(dayItem.dateStr)}
                >
                  <div className="day-header-left">
                    <span className="day-display-title">{dayItem.displayDate}</span>
                    <span className="day-count-badge">
                      {dayItem.completedCount || dayItem.tasks.length} completed
                    </span>
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
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Expandable Task Detail List */}
                {isExpanded && (
                  <div className="history-task-list">
                    {dayItem.tasks.map((task) => {
                      const categoryClass = CATEGORY_CLASSES[task.category] || 'badge-focus';
                      return (
                        <div key={task.id} className="history-task-item">
                          <CheckCircle2 size={16} className="check-done-icon" />
                          <span className="history-task-title">{task.title}</span>
                          
                          <div className="history-task-meta">
                            <span className={`badge ${categoryClass}`}>
                              {task.category}
                            </span>
                            {task.timeEstimate && (
                              <span className="time-tag">
                                <Clock size={11} />
                                {task.timeEstimate}
                              </span>
                            )}
                            {task.completedAt && (
                              <span className="completed-time-tag">
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
          border-color: #30363D;
        }
        .history-day-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.95rem 1.2rem;
          background: transparent;
          border: none;
          color: var(--text-main);
          cursor: pointer;
          font-family: var(--font-body);
          text-align: left;
        }
        .day-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .day-display-title {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-main);
        }
        .day-count-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent-primary);
          background: var(--accent-light);
          padding: 2px 8px;
          border-radius: 10px;
          border: 1px solid var(--accent-border);
        }
        .day-header-right {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-muted);
        }
        .delete-date-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          transition: all 0.2s ease;
        }
        .delete-date-btn:hover {
          color: var(--badge-coral-text);
          background: var(--badge-coral-bg);
        }
        .history-task-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 0 1.2rem 1.1rem 1.2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .history-task-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          background: var(--bg-app);
          border-radius: var(--radius-sm);
          border: var(--border-light);
          font-size: 0.9rem;
        }
        .check-done-icon {
          color: var(--accent-primary);
          flex-shrink: 0;
        }
        .history-task-title {
          flex: 1;
          color: var(--text-main);
          font-weight: 500;
          word-break: break-word;
        }
        .history-task-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .completed-time-tag {
          font-size: 0.725rem;
          color: var(--text-muted);
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
