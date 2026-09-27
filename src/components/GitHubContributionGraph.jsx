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

    // Archival Effort Density Ranks (0 to 4)
    let lvl = 0;
    if (score >= 150) lvl = 4;      // Peak terracotta mark (2h+ deep focus or 5+ tasks)
    else if (score >= 75) lvl = 3;  // Heavy carbon ink (~1.5h focus)
    else if (score >= 35) lvl = 2;  // Medium graphite wash (~45m-1h focus)
    else if (score >= 1) lvl = 1;   // Light graphite tint (1 task or ~20m focus)

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
    <div className="activity-chronicle-card" aria-label="Activity Contribution Tracker">
      {/* Section Header */}
      <div className="chronicle-header">
        <div className="chronicle-title-group">
          <span className="chronicle-eyebrow">CHRONICLE // ANNUAL EFFORT</span>
          <h3 className="chronicle-title">
            <span className="mono-stat font-mono">{totalCompletedAllTime}</span> contributions in the past year
          </h3>
        </div>

        <div className="chronicle-telemetry">
          <div className="telemetry-chip">
            <Calendar size={12} className="chip-icon" />
            <span className="chip-text">
              <strong>{totalProductiveDays}</strong> productive days
            </span>
          </div>

          <div className="telemetry-chip streak">
            <Flame size={12} className="chip-icon flame" />
            <span className="chip-text">
              <strong>{streak}d</strong> streak
            </span>
          </div>
        </div>
      </div>

      {/* Contribution Grid */}
      <div className="chronicle-grid-container">
        {/* Month labels top header */}
        <div className="month-labels-strip" aria-hidden="true">
          {monthLabels.map((ml, idx) => (
            <span
              key={idx}
              className="month-label font-mono"
              style={{ gridColumnStart: ml.weekIdx + 1 }}
            >
              {ml.monthName}
            </span>
          ))}
        </div>

        <div className="grid-body-row">
          {/* Day of week labels left column */}
          <div className="weekday-labels-col font-mono" aria-hidden="true">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* 52-week Contribution Cells Grid */}
          <div className="archival-cells-grid" role="grid" aria-label="Annual contribution density">
            {daysArray.map((day) => {
              const dateFormatted = day.dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const tooltipText = `${day.count} task${day.count === 1 ? '' : 's'} (${day.minutes}m focus, ${day.score} effort pts) on ${dateFormatted}`;

              return (
                <div
                  key={day.dateStr}
                  className={`gh-square lvl-${day.lvl}`}
                  title={tooltipText}
                  onClick={() => setSelectedDay(day)}
                  role="gridcell"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedDay(day);
                    }
                  }}
                  aria-label={tooltipText}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend & Scoring Guidance */}
      <div className="chronicle-footer">
        <span className="scoring-formula font-mono">
          Effort formula: 10 pts per task + 1 pt per minute focused
        </span>

        <div className="legend-strip font-mono">
          <span className="legend-label">LESS</span>
          <div className="legend-cells-row" aria-hidden="true">
            <div className="gh-square lvl-0" />
            <div className="gh-square lvl-1" />
            <div className="gh-square lvl-2" />
            <div className="gh-square lvl-3" />
            <div className="gh-square lvl-4" />
          </div>
          <span className="legend-label">MORE</span>
        </div>
      </div>

      {/* Selected Day Inspector Modal */}
      {selectedDay && (
        <div className="modal-overlay" onClick={() => setSelectedDay(null)} role="dialog" aria-modal="true" aria-label="Day Activity Inspector">
          <div className="inspector-panel" onClick={(e) => e.stopPropagation()}>
            <div className="inspector-header">
              <div className="inspector-title-group">
                <span className="inspector-eyebrow">ACTIVITY ARCHIVE ENTRY</span>
                <h4 className="inspector-date">
                  {selectedDay.dateObj.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </h4>
              </div>

              <button
                type="button"
                className="close-btn"
                onClick={() => setSelectedDay(null)}
                aria-label="Close inspector modal"
              >
                <X size={15} />
              </button>
            </div>

            <div className="inspector-body">
              {/* 3 Metric Columns */}
              <div className="inspector-metrics-grid">
                <div className="inspector-metric-box">
                  <span className="metric-val font-mono">{selectedDay.count}</span>
                  <span className="metric-tag">TASKS COMPLETED</span>
                </div>

                <div className="inspector-metric-box">
                  <div className="metric-row">
                    <Clock size={14} className="metric-icon" />
                    <span className="metric-val font-mono">{selectedDay.minutes}m</span>
                  </div>
                  <span className="metric-tag">FOCUS DURATION</span>
                </div>

                <div className="inspector-metric-box">
                  <div className="metric-row">
                    <Zap size={14} className="metric-icon accent" />
                    <span className="metric-val font-mono">{selectedDay.score}</span>
                  </div>
                  <span className="metric-tag">EFFORT SCORE</span>
                </div>
              </div>

              <div className="inspector-note font-mono">
                {selectedDay.count > 0
                  ? `[LOGGED]: ${selectedDay.minutes} minutes of deep focus logged across ${selectedDay.count} task${selectedDay.count === 1 ? '' : 's'}.`
                  : "[REST DAY]: No focus activity recorded on this calendar date."}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* ==========================================================================
           Activity Chronicle Card (Editorial Archival Density Tracker)
           ========================================================================== */
        .activity-chronicle-card {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }

        .chronicle-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .chronicle-title-group {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .chronicle-eyebrow {
          font-family: var(--font-mono);
          font-size: 0.675rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }

        .chronicle-title {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .chronicle-telemetry {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .telemetry-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 8px;
          border-radius: var(--radius-xs);
          border: 1px solid var(--border);
          background: var(--bg-subtle);
          font-family: var(--font-mono);
          font-size: 0.725rem;
          color: var(--text-secondary);
        }

        .telemetry-chip.streak {
          background: var(--accent-light);
          border-color: var(--accent-border);
          color: var(--accent);
        }

        .chip-icon {
          color: var(--text-muted);
        }

        .chip-icon.flame {
          color: var(--accent);
        }

        /* Contribution Grid Scroll Wrapper */
        .chronicle-grid-container {
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: thin;
        }

        .month-labels-strip {
          display: grid;
          grid-template-columns: repeat(52, 10px);
          gap: 3px;
          margin-left: 28px;
          height: 16px;
        }

        .month-label {
          font-size: 0.675rem;
          color: var(--text-muted);
          line-height: 1;
        }

        .grid-body-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .weekday-labels-col {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          height: 88px;
          font-size: 0.65rem;
          color: var(--text-muted);
          width: 20px;
          line-height: 1;
        }

        .archival-cells-grid {
          display: grid;
          grid-template-rows: repeat(7, 10px);
          grid-auto-flow: column;
          grid-auto-columns: 10px;
          gap: 3px;
        }

        /* Cells Ramp */
        .gh-square {
          width: 10px !important;
          height: 10px !important;
          border-radius: 1px !important;
          outline: 1px solid rgba(24, 23, 21, 0.08) !important;
          cursor: pointer;
          transition: outline-color var(--duration-fast) ease !important;
        }

        .gh-square:hover {
          transform: none !important;
          outline: 1.5px solid var(--border-strong) !important;
          z-index: 2;
        }

        .gh-square.lvl-0 { background-color: var(--gh-0) !important; }
        .gh-square.lvl-1 { background-color: var(--gh-1) !important; }
        .gh-square.lvl-2 { background-color: var(--gh-2) !important; }
        .gh-square.lvl-3 { background-color: var(--gh-3) !important; }
        .gh-square.lvl-4 { background-color: var(--gh-4) !important; }

        /* Footer & Guidance */
        .chronicle-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          padding-top: 0.85rem;
          border-top: 1px solid var(--border-subtle);
        }

        .scoring-formula {
          font-size: 0.7rem;
          color: var(--text-muted);
          letter-spacing: 0.01em;
        }

        .legend-strip {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.675rem;
          color: var(--text-muted);
        }

        .legend-cells-row {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        /* Day Activity Inspector Modal */
        .inspector-panel {
          width: 90%;
          max-width: 440px;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 1.75rem;
          box-shadow: var(--shadow-modal);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          animation: modalSettle var(--duration-fast) var(--ease-tactile);
        }

        .inspector-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .inspector-title-group {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .inspector-eyebrow {
          font-family: var(--font-mono);
          font-size: 0.675rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }

        .inspector-date {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .inspector-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .inspector-metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }

        .inspector-metric-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.75rem 0.5rem;
          background: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xs);
          gap: 4px;
        }

        .metric-row {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .metric-val {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.1;
        }

        .metric-icon {
          color: var(--text-muted);
        }

        .metric-icon.accent {
          color: var(--accent);
        }

        .metric-tag {
          font-family: var(--font-mono);
          font-size: 0.625rem;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          text-align: center;
        }

        .inspector-note {
          padding: 0.65rem 0.85rem;
          background: var(--bg-surface-sunken);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-xs);
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }
      `}</style>
    </div>
  );
}
