import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Flame, X, Clock, Zap } from 'lucide-react';

export default function GitHubContributionGraph() {
  const { activityLog, totalProductiveDays, totalCompletedAllTime } = useApp();
  const [selectedDay, setSelectedDay] = useState(null);

  // Generate 52 weeks of dates ending on live system date (today)
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - (52 * 7 - 1)); // 364 days back

  const daysArray = [];
  const curr = new Date(startDate);
  while (curr <= endDate) {
    const dateStr = curr.toISOString().split('T')[0];
    const rawEntry = activityLog[dateStr];

    const count = typeof rawEntry === 'object' ? (rawEntry.count || 0) : (typeof rawEntry === 'number' ? rawEntry : 0);
    const score = typeof rawEntry === 'object' ? (rawEntry.score || 0) : count * 30;
    const minutes = typeof rawEntry === 'object' ? (rawEntry.minutes || 0) : count * 20;

    // Hybrid Effort Level Thresholds
    let lvl = 0;
    if (score >= 150) lvl = 4;      // Peak Neon Green (e.g. 2h+ deep focus or 5+ tasks)
    else if (score >= 75) lvl = 3;  // Vibrant Green (~1.5h focus)
    else if (score >= 35) lvl = 2;  // Medium Green (~45m-1h focus)
    else if (score >= 1) lvl = 1;   // Light Green (1 task or ~20m focus)

    daysArray.push({
      dateStr,
      dateObj: new Date(curr),
      count,
      score,
      minutes,
      lvl,
    });
    curr.setDate(curr.getDate() + 1);
  }

  // Month labels mapping
  const monthLabels = [];
  let lastMonth = -1;
  daysArray.forEach((d, idx) => {
    const m = d.dateObj.getMonth();
    const weekIdx = Math.floor(idx / 7);
    if (m !== lastMonth && d.dateObj.getDate() <= 7) {
      const monthName = d.dateObj.toLocaleString('en-US', { month: 'short' });
      monthLabels.push({ monthName, weekIdx });
      lastMonth = m;
    }
  });

  // Calculate Streak dynamically from live date
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

  return (
    <div className="github-graph-card glass-card">
      {/* Header */}
      <div className="graph-header">
        <div className="graph-title-group">
          <h3 className="graph-main-title">
            {totalCompletedAllTime} contribution{totalCompletedAllTime === 1 ? '' : 's'} in the last year
          </h3>
          <span className="graph-sub-title">Momentum activity tracker</span>
        </div>

        <div className="graph-meta-chips">
          <div className="meta-chip">
            <Calendar size={13} className="chip-icon green" />
            <span><strong>{totalProductiveDays}</strong> productive days</span>
          </div>
          <div className="meta-chip">
            <Flame size={13} className="chip-icon orange" />
            <span><strong>{streak} day</strong> streak</span>
          </div>
        </div>
      </div>

      {/* Contribution Grid */}
      <div className="graph-scroll-wrapper">
        {/* Month labels top header */}
        <div className="month-labels-row">
          {monthLabels.map((ml, idx) => (
            <span
              key={idx}
              className="month-label-item"
              style={{ gridColumnStart: ml.weekIdx + 1 }}
            >
              {ml.monthName}
            </span>
          ))}
        </div>

        <div className="graph-body">
          {/* Day labels left column */}
          <div className="day-labels-column">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* 52-week Contribution Grid */}
          <div className="github-grid">
            {daysArray.map((day) => {
              const dateFormatted = day.dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
              const tooltipText = `${day.count} task${day.count === 1 ? '' : 's'} (${day.minutes}m focus, ${day.score} effort pts) on ${dateFormatted}`;

              return (
                <div
                  key={day.dateStr}
                  className={`gh-square lvl-${day.lvl}`}
                  title={tooltipText}
                  onClick={() => setSelectedDay(day)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend Footer */}
      <div className="graph-footer">
        <span className="footer-info">Effort score: Task count (10 pts) + Focus time (1 pt/min)</span>
        <div className="legend-group">
          <span className="legend-label">Less</span>
          <div className="legend-cells">
            <div className="gh-square lvl-0" />
            <div className="gh-square lvl-1" />
            <div className="gh-square lvl-2" />
            <div className="gh-square lvl-3" />
            <div className="gh-square lvl-4" />
          </div>
          <span className="legend-label">More</span>
        </div>
      </div>

      {/* Selected Day Inspector Modal */}
      {selectedDay && (
        <div className="modal-overlay" onClick={() => setSelectedDay(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {selectedDay.dateObj.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h3>
              <button className="close-btn" onClick={() => setSelectedDay(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="inspector-stats-grid">
                <div className="inspector-stat">
                  <span className="stat-num">{selectedDay.count}</span>
                  <span className="stat-label">Tasks Done</span>
                </div>
                <div className="inspector-stat">
                  <div className="stat-row">
                    <Clock size={16} className="stat-icon" />
                    <span className="stat-num">{selectedDay.minutes}m</span>
                  </div>
                  <span className="stat-label">Focus Time</span>
                </div>
                <div className="inspector-stat">
                  <div className="stat-row">
                    <Zap size={16} className="stat-icon yellow" />
                    <span className="stat-num">{selectedDay.score}</span>
                  </div>
                  <span className="stat-label">Effort Score</span>
                </div>
              </div>
              <div className="modal-msg">
                {selectedDay.count > 0
                  ? `Great momentum! You logged ${selectedDay.minutes} minutes of deep focus across ${selectedDay.count} completed task${selectedDay.count === 1 ? '' : 's'}.`
                  : "No focus activity logged on this date."}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .github-graph-card {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
          margin-top: 0.5rem;
        }
        .graph-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .graph-main-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .graph-sub-title {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .graph-meta-chips {
          display: flex;
          gap: 8px;
        }
        .meta-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(30, 36, 48, 0.55);
          border: var(--border-light);
          padding: 4px 10px;
          border-radius: var(--radius-pill);
          font-size: 0.775rem;
          color: var(--text-secondary);
        }
        .chip-icon.green { color: var(--gh-3); }
        .chip-icon.orange { color: #F97316; }

        .graph-scroll-wrapper {
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .month-labels-row {
          display: grid;
          grid-template-columns: repeat(52, 10px);
          gap: 3px;
          margin-left: 26px;
          height: 16px;
        }
        .month-label-item {
          font-size: 0.7rem;
          color: var(--text-muted);
          font-family: var(--font-body);
        }
        .graph-body {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .day-labels-column {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          height: 88px;
          font-size: 0.675rem;
          color: var(--text-muted);
          width: 18px;
        }
        .github-grid {
          display: grid;
          grid-template-rows: repeat(7, 10px);
          grid-auto-flow: column;
          grid-auto-columns: 10px;
          gap: 3px;
        }
        .gh-square {
          width: 10px;
          height: 10px;
          border-radius: 2px;
          background-color: var(--gh-0);
          outline: 1px solid rgba(255, 255, 255, 0.03);
          transition: transform 0.15s ease, background-color 0.2s ease;
          cursor: pointer;
        }
        .gh-square:hover {
          transform: scale(1.4);
          z-index: 10;
          outline: 1px solid rgba(255, 255, 255, 0.25);
        }
        .gh-square.lvl-0 { background-color: #161B22; }
        .gh-square.lvl-1 { background-color: #0E4429; }
        .gh-square.lvl-2 { background-color: #006D32; }
        .gh-square.lvl-3 { background-color: #26A641; }
        .gh-square.lvl-4 { background-color: #39D353; }

        .graph-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: var(--border-light);
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .legend-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .legend-cells {
          display: flex;
          gap: 3px;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1rem;
          border-bottom: var(--border-light);
        }
        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: 50%;
          padding: 4px;
          display: flex;
        }
        .close-btn:hover {
          color: var(--text-main);
          background: var(--bg-hover);
        }
        .modal-body {
          padding-top: 1.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          text-align: center;
        }
        .inspector-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          width: 100%;
        }
        .inspector-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255, 255, 255, 0.04);
          padding: 10px 8px;
          border-radius: var(--radius-md);
          border: var(--border-light);
        }
        .stat-num {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--gh-3);
          line-height: 1.2;
        }
        .stat-row {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .stat-icon {
          color: var(--accent-primary);
        }
        .stat-icon.yellow {
          color: #D29922;
        }
        .stat-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-top: 2px;
        }
        .modal-msg {
          font-size: 0.875rem;
          color: var(--text-secondary);
          background: var(--bg-subtle);
          padding: 0.8rem 1.2rem;
          border-radius: var(--radius-md);
          width: 100%;
        }
      `}</style>
    </div>
  );
}
