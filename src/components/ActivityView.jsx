import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Calendar, CheckCircle, TrendingUp, Award, X } from 'lucide-react';

export default function ActivityView() {
  const { activityLog, totalProductiveDays, totalCompletedAllTime } = useApp();
  const [selectedDay, setSelectedDay] = useState(null);

  // Generate 52 weeks of dates ending on Aug 30, 2026
  const endDate = new Date(2026, 7, 30);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - (52 * 7 - 1)); // 52 weeks back

  // Create array of 364 days
  const daysArray = [];
  const curr = new Date(startDate);
  while (curr <= endDate) {
    const dateStr = curr.toISOString().split('T')[0];
    const count = activityLog[dateStr] || 0;

    // Calculate level (0 to 4)
    let lvl = 0;
    if (count >= 6) lvl = 4;
    else if (count >= 4) lvl = 3;
    else if (count >= 2) lvl = 2;
    else if (count >= 1) lvl = 1;

    daysArray.push({
      dateStr,
      dateObj: new Date(curr),
      count,
      lvl,
    });
    curr.setDate(curr.getDate() + 1);
  }

  // Month labels mapping (find week index where month starts)
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

  // Calculate Streak
  let streak = 0;
  const todayStr = new Date(2026, 7, 30).toISOString().split('T')[0];
  let checkDate = new Date(2026, 7, 30);
  while (true) {
    const ds = checkDate.toISOString().split('T')[0];
    if (activityLog[ds] && activityLog[ds] > 0) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return (
    <div className="activity-container">
      {/* Header */}
      <div className="section-header">
        <h1 className="main-title">Your activity</h1>
        <div className="stats-badges">
          <div className="stat-chip">
            <Calendar size={14} className="chip-icon mint" />
            <span><strong>{totalProductiveDays}</strong> productive days</span>
          </div>
          <div className="stat-chip">
            <Flame size={14} className="chip-icon peach" />
            <span><strong>{streak} day</strong> streak</span>
          </div>
          <div className="stat-chip">
            <CheckCircle size={14} className="chip-icon sky" />
            <span><strong>{totalCompletedAllTime}</strong> tasks completed</span>
          </div>
        </div>
      </div>

      {/* Heatmap Card */}
      <div className="heatmap-card glass-card">
        <div className="heatmap-header">
          <h3 className="heatmap-title">Contribution Graph</h3>
          <span className="heatmap-sub">Past 365 Days</span>
        </div>

        <div className="heatmap-scroll-area">
          {/* Month labels header */}
          <div className="month-labels">
            {monthLabels.map((ml, idx) => (
              <span
                key={idx}
                className="month-label"
                style={{ gridColumnStart: ml.weekIdx + 1 }}
              >
                {ml.monthName}
              </span>
            ))}
          </div>

          <div className="heatmap-wrapper">
            {/* Minimal Day Labels */}
            <div className="day-labels">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Heatmap Grid */}
            <div className="heatmap-grid">
              {daysArray.map((day) => {
                const dateFormatted = day.dateObj.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
                const tooltipText = `${day.count} task${day.count === 1 ? '' : 's'} on ${dateFormatted}`;

                return (
                  <div
                    key={day.dateStr}
                    className={`heatmap-square lvl-${day.lvl}`}
                    title={tooltipText}
                    onClick={() => setSelectedDay(day)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="heatmap-footer">
          <span className="legend-text">Less</span>
          <div className="legend-squares">
            <div className="heatmap-square lvl-0" />
            <div className="heatmap-square lvl-1" />
            <div className="heatmap-square lvl-2" />
            <div className="heatmap-square lvl-3" />
            <div className="heatmap-square lvl-4" />
          </div>
          <span className="legend-text">More</span>
        </div>
      </div>

      {/* Selected Day Detail Modal */}
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
              <div className="day-stat-big">
                <span className="stat-num">{selectedDay.count}</span>
                <span className="stat-label">Tasks completed on this day</span>
              </div>
              <div className="modal-msg">
                {selectedDay.count > 0
                  ? "Great momentum! Keep up the serene productivity pace."
                  : "No tasks were logged on this date. Rest days are essential for growth."}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .activity-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .stats-badges {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 6px;
        }
        .stat-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-surface-solid);
          border: var(--border-light);
          padding: 6px 14px;
          border-radius: var(--radius-pill);
          font-size: 0.825rem;
          color: var(--text-secondary);
          box-shadow: var(--shadow-sm);
        }
        .stat-chip strong {
          color: var(--text-main);
        }
        .chip-icon.mint { color: var(--mint-primary); }
        .chip-icon.peach { color: var(--peach-primary); }
        .chip-icon.sky { color: var(--sky-primary); }

        .heatmap-card {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .heatmap-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .heatmap-title {
          font-size: 1.15rem;
          font-weight: 700;
        }
        .heatmap-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .heatmap-scroll-area {
          display: flex;
          flex-direction: column;
          gap: 6px;
          overflow-x: auto;
        }
        .month-labels {
          display: grid;
          grid-template-columns: repeat(52, 12px);
          gap: 4px;
          margin-left: 32px;
          height: 18px;
        }
        .month-label {
          font-size: 0.725rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .heatmap-wrapper {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .day-labels {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          height: 108px;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-muted);
          width: 24px;
        }
        .heatmap-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          padding-top: 8px;
          border-top: var(--border-light);
        }
        .legend-text {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .legend-squares {
          display: flex;
          gap: 4px;
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
          background: var(--bg-subtle);
        }
        .modal-body {
          padding-top: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          text-align: center;
        }
        .day-stat-big {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .stat-num {
          font-family: var(--font-heading);
          font-size: 3rem;
          font-weight: 700;
          color: var(--mint-primary);
          line-height: 1;
        }
        .stat-label {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-weight: 500;
          margin-top: 4px;
        }
        .modal-msg {
          font-size: 0.9rem;
          color: var(--text-secondary);
          background: var(--bg-subtle);
          padding: 0.8rem 1.2rem;
          border-radius: var(--radius-md);
        }
      `}</style>
    </div>
  );
}
