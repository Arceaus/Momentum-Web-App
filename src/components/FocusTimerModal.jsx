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
      <div className="focus-instrument-card" onClick={(e) => e.stopPropagation()}>
        {/* Instrument Status Bar */}
        <div className="instrument-top-bar">
          <div className="status-label-group">
            <span className="instrument-tag">FOCUS INSTRUMENT</span>
            <span className="instrument-pipe">/</span>
            <span className="category-meta">{task.category ? task.category.toUpperCase() : 'FOCUS'}</span>
          </div>

          <button
            type="button"
            className="instrument-close-btn"
            onClick={onClose}
            aria-label="Close focus timer"
            title="Close timer (Esc)"
          >
            <X size={15} />
          </button>
        </div>

        {/* Primary Time Display Block */}
        <div className="timer-main-display">
          <span className="session-eyebrow">
            SESSION DURATION · {targetMinutes}M TARGET
          </span>

          <div className="clock-digits-wrap" aria-live="polite">
            <span className="clock-digits font-mono">{formatTime(secondsLeft)}</span>
          </div>

          <div className="timer-status-row">
            {secondsLeft === 0 ? (
              <span className="status-badge finished">✓ TARGET REACHED</span>
            ) : isRunning ? (
              <span className="status-badge running">
                <span className="pulsing-pip" aria-hidden="true" />
                ACTIVE FOCUS SESSION
              </span>
            ) : (
              <span className="status-badge paused">❚❚ PAUSED</span>
            )}
          </div>
        </div>

        {/* Restrained Precision Rail Progress Indicator */}
        <div className="instrument-progress-section">
          <div className="progress-labels">
            <span className="mono-stat">{progressPercent}% ELAPSED</span>
            <span className="mono-stat">{formatTime(secondsLeft)} REMAINING</span>
          </div>
          <div className="instrument-rail" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
            <div className="instrument-rail-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Thin Separator Rule */}
        <hr className="instrument-rule" />

        {/* Current Task Context Section */}
        <div className="current-task-context">
          <span className="task-context-label">CURRENT TARGET ENTRY</span>
          <h3 className="current-task-title">{task.title}</h3>
        </div>

        {/* Restrained Action Controls */}
        <div className="instrument-controls-row">
          <button
            type="button"
            className="control-btn secondary"
            onClick={handleReset}
            title="Reset timer to target duration"
          >
            <RotateCcw size={14} /> Reset
          </button>

          <button
            type="button"
            className={`control-btn ${isRunning ? 'active-toggle' : 'primary-toggle'}`}
            onClick={() => setIsRunning(!isRunning)}
            title={isRunning ? 'Pause focus timer' : 'Resume focus timer'}
          >
            {isRunning ? (
              <>
                <Pause size={14} /> Pause Focus
              </>
            ) : (
              <>
                <Play size={14} /> Resume Focus
              </>
            )}
          </button>

          <button
            type="button"
            className="control-btn complete"
            onClick={handleComplete}
            title="Mark task completed and finish session"
          >
            <Check size={14} /> Complete Task
          </button>
        </div>
      </div>

      <style>{`
        /* ==========================================================================
           Focus Timer Instrument Card (Serious, Quiet, Calibrated)
           ========================================================================== */
        .focus-instrument-card {
          width: 90%;
          max-width: 460px;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 1.75rem;
          box-shadow: var(--shadow-modal);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          text-align: center;
          animation: modalSettle var(--duration-fast) var(--ease-tactile);
        }

        /* Top Status Bar */
        .instrument-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .status-label-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .instrument-tag {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-primary);
        }

        .instrument-pipe {
          color: var(--text-faint);
          font-size: 0.7rem;
        }

        .category-meta {
          font-family: var(--font-mono);
          font-size: 0.675rem;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }

        .instrument-close-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: transparent;
          border: 1px solid transparent;
          color: var(--text-muted);
          border-radius: var(--radius-xs);
          cursor: pointer;
          transition: all var(--duration-fast) ease;
        }

        .instrument-close-btn:hover {
          color: var(--text-primary);
          background: var(--bg-hover);
          border-color: var(--border-subtle);
        }

        /* Main Time Block */
        .timer-main-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 0.5rem 0;
        }

        .session-eyebrow {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }

        .clock-digits-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 0;
        }

        .clock-digits {
          font-family: var(--font-mono);
          font-size: 4.75rem;
          font-weight: 500;
          line-height: 1;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          font-feature-settings: "tnum";
          font-variant-numeric: tabular-nums;
        }

        .timer-status-row {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 4px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          padding: 2px 7px;
          border-radius: var(--radius-xs);
          border: 1px solid var(--border-subtle);
          background: var(--bg-subtle);
          color: var(--text-secondary);
        }

        .status-badge.running {
          color: var(--accent);
          background: var(--accent-light);
          border-color: var(--accent-border);
        }

        .pulsing-pip {
          width: 5px;
          height: 5px;
          background: var(--accent);
          border-radius: 0;
        }

        .status-badge.paused {
          color: var(--text-muted);
        }

        .status-badge.finished {
          color: var(--success);
          background: var(--success-light);
          border-color: var(--success-border);
        }

        /* Precision Progress Rail */
        .instrument-progress-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .progress-labels {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        .instrument-rail {
          width: 100%;
          height: 4px;
          background: var(--bg-surface-sunken);
          border-radius: var(--radius-none);
          overflow: hidden;
        }

        .instrument-rail-fill {
          height: 100%;
          background: var(--accent);
          transition: width var(--duration-normal) var(--ease-tactile);
        }

        /* Dividing Rule */
        .instrument-rule {
          width: 100%;
          height: 1px;
          border: none;
          background: var(--border-subtle);
          margin: 0;
        }

        /* Current Task Section */
        .current-task-context {
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: left;
        }

        .task-context-label {
          font-family: var(--font-mono);
          font-size: 0.675rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }

        .current-task-title {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.35;
          word-break: break-word;
        }

        /* Controls Row */
        .instrument-controls-row {
          display: grid;
          grid-template-columns: 1fr 1.3fr 1.3fr;
          gap: 8px;
          margin-top: 0.25rem;
        }

        .control-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-family: var(--font-heading);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-tactile);
          border: 1px solid var(--border);
        }

        .control-btn:active {
          transform: translateY(1px);
        }

        .control-btn.secondary {
          background: var(--bg-surface);
          color: var(--text-secondary);
        }

        .control-btn.secondary:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
          border-color: var(--border-strong);
        }

        .control-btn.primary-toggle {
          background: var(--text-primary);
          color: var(--text-inverse);
          border-color: var(--text-primary);
        }

        .control-btn.primary-toggle:hover {
          background: var(--accent);
          border-color: var(--accent);
        }

        .control-btn.active-toggle {
          background: var(--bg-subtle);
          color: var(--text-primary);
          border-color: var(--border-base);
        }

        .control-btn.active-toggle:hover {
          background: var(--bg-hover);
          border-color: var(--border-strong);
        }

        .control-btn.complete {
          background: var(--accent);
          color: white;
          border-color: var(--accent);
        }

        .control-btn.complete:hover {
          background: var(--accent-hover);
          border-color: var(--accent-hover);
        }

        @media (max-width: 480px) {
          .focus-instrument-card {
            padding: 1.35rem 1.15rem;
            width: 94%;
          }
          .clock-digits {
            font-size: clamp(2.85rem, 15vw, 3.75rem);
          }
          .instrument-controls-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          .control-btn {
            min-height: 44px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}
