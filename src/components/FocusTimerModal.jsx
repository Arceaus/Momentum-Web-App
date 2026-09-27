import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Check, X } from 'lucide-react';
import { parseMinutes } from '../context/AppContext';

export default function FocusTimerModal({ task, onClose, onCompleteTask }) {
  const targetMinutes = parseMinutes(task.timeEstimate);
  const totalSeconds = targetMinutes * 60;

  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;

    if (secondsLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  const elapsedSeconds = totalSeconds - secondsLeft;
  const progressPercent = totalSeconds > 0 
    ? Math.min(100, Math.round((elapsedSeconds / totalSeconds) * 100)) 
    : 0;

  const handleReset = () => {
    setSecondsLeft(totalSeconds);
    setIsRunning(false);
  };

  const handleComplete = () => {
    const remainingMins = Math.ceil(secondsLeft / 60);
    onCompleteTask(task, remainingMins);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Focus Timer">
      <div className="focus-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Status Bar */}
        <div className="focus-top-bar">
          <span className="focus-badge badge">
            {task.category || 'Focus'}
          </span>

          <button
            type="button"
            className="focus-close-btn"
            onClick={onClose}
            aria-label="Close focus timer"
            title="Close timer (Esc)"
          >
            <X size={15} />
          </button>
        </div>

        {/* Primary Time Display */}
        <div className="timer-main-display">
          <span className="session-eyebrow">
            Session · {targetMinutes} min target
          </span>

          <div className="clock-digits-wrap" aria-live="polite">
            <span className="clock-digits font-mono">{formatTime(secondsLeft)}</span>
          </div>

          <div className="timer-status-row">
            {secondsLeft === 0 ? (
              <span className="status-badge finished">Completed</span>
            ) : isRunning ? (
              <span className="status-badge running">
                <span className="pulsing-pip" aria-hidden="true" />
                Focusing
              </span>
            ) : (
              <span className="status-badge paused">Paused</span>
            )}
          </div>
        </div>

        {/* Restrained Rail Progress Indicator */}
        <div className="timer-progress-section">
          <div className="progress-labels">
            <span><strong className="font-mono">{progressPercent}%</strong> elapsed</span>
            <span><strong className="font-mono">{formatTime(secondsLeft)}</strong> left</span>
          </div>
          <div className="timer-rail" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
            <div className="timer-rail-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Separator Rule */}
        <hr className="timer-rule" />

        {/* Current Task Context */}
        <div className="current-task-context">
          <span className="task-context-label">Current task</span>
          <h3 className="current-task-title">{task.title}</h3>
        </div>

        {/* Action Controls */}
        <div className="timer-controls-row">
          <button
            type="button"
            className="control-btn secondary"
            onClick={handleReset}
            title="Reset timer"
          >
            <RotateCcw size={14} /> Reset
          </button>

          <button
            type="button"
            className={`control-btn ${isRunning ? 'active-toggle' : 'primary-toggle'}`}
            onClick={() => setIsRunning(!isRunning)}
            title={isRunning ? 'Pause timer' : 'Resume timer'}
          >
            {isRunning ? (
              <>
                <Pause size={14} /> Pause
              </>
            ) : (
              <>
                <Play size={14} /> Start
              </>
            )}
          </button>

          <button
            type="button"
            className="control-btn complete"
            onClick={handleComplete}
            title="Mark completed"
          >
            <Check size={14} /> Complete
          </button>
        </div>
      </div>

      <style>{`
        .focus-modal-card {
          width: 90%;
          max-width: 440px;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 1.75rem;
          box-shadow: var(--shadow-modal);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          text-align: center;
          animation: modalSettle var(--duration-fast) var(--ease-tactile);
        }

        .focus-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .focus-badge {
          font-size: 0.725rem;
          font-weight: 600;
        }

        .focus-close-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          border-radius: var(--radius-xs);
          cursor: pointer;
          transition: all var(--duration-fast) ease;
        }

        .focus-close-btn:hover {
          color: var(--text-primary);
          background: var(--bg-hover);
        }

        /* Timer Display */
        .timer-main-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 0.5rem 0;
        }

        .session-eyebrow {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: var(--tracking-wide);
          text-transform: uppercase;
        }

        .clock-digits-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .clock-digits {
          font-size: 3.75rem;
          font-weight: 700;
          letter-spacing: -0.04em;
          color: var(--text-primary);
          line-height: 1;
        }

        .timer-status-row {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: var(--radius-xs);
          border: 1px solid var(--border);
          background: var(--bg-subtle);
          color: var(--text-secondary);
        }

        .status-badge.running {
          color: var(--accent);
          background: var(--accent-light);
          border-color: var(--accent-border);
        }

        .status-badge.finished {
          color: var(--success);
          background: var(--success-light);
          border-color: var(--success-border);
        }

        .status-badge.paused {
          color: var(--text-muted);
        }

        .pulsing-pip {
          width: 5px;
          height: 5px;
          border-radius: 1px;
          background: var(--accent);
        }

        /* Progress Rail */
        .timer-progress-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .progress-labels {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-heading);
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        .progress-labels strong {
          color: var(--text-primary);
        }

        .timer-rail {
          width: 100%;
          height: 3px;
          background: var(--bg-surface-sunken);
          border-radius: 1px;
          overflow: hidden;
        }

        .timer-rail-fill {
          height: 100%;
          background: var(--accent);
          transition: width 0.3s ease;
        }

        .timer-rule {
          width: 100%;
          height: 1px;
          background: var(--border-subtle);
          border: none;
          margin: 0.25rem 0;
        }

        /* Task Context */
        .current-task-context {
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: center;
        }

        .task-context-label {
          font-family: var(--font-heading);
          font-size: 0.725rem;
          font-weight: 600;
          color: var(--text-muted);
          letter-spacing: var(--tracking-wide);
          text-transform: uppercase;
        }

        .current-task-title {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.35;
          word-break: break-word;
        }

        /* Action Controls */
        .timer-controls-row {
          display: grid;
          grid-template-columns: 1fr 1.35fr 1fr;
          gap: 8px;
          padding-top: 4px;
        }

        .control-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: var(--radius-xs);
          font-family: var(--font-heading);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--duration-fast) ease;
        }

        .control-btn.secondary {
          background: var(--bg-subtle);
          border: 1px solid var(--border);
          color: var(--text-secondary);
        }

        .control-btn.secondary:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
        }

        .control-btn.primary-toggle {
          background: var(--text-primary);
          color: var(--text-inverse);
          border: 1px solid var(--text-primary);
        }

        .control-btn.primary-toggle:hover {
          background: var(--accent);
          border-color: var(--accent);
        }

        .control-btn.active-toggle {
          background: var(--bg-subtle);
          border: 1px solid var(--border-strong);
          color: var(--text-primary);
        }

        .control-btn.active-toggle:hover {
          background: var(--bg-hover);
        }

        .control-btn.complete {
          background: var(--accent);
          color: white;
          border: 1px solid var(--accent);
        }

        .control-btn.complete:hover {
          background: var(--accent-hover);
        }

        @media (max-width: 480px) {
          .focus-modal-card {
            padding: 1.25rem;
          }
          .clock-digits {
            font-size: 3rem;
          }
          .timer-controls-row {
            grid-template-columns: 1fr;
            gap: 6px;
          }
        }
      `}</style>
    </div>
  );
}
