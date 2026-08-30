import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, X, Clock, Sparkles } from 'lucide-react';
import { parseMinutes } from '../context/AppContext';

export default function FocusTimerModal({ task, onClose, onCompleteTask }) {
  const targetMinutes = parseMinutes(task.timeEstimate);
  const totalSeconds = targetMinutes * 60;

  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let timer = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, secondsLeft]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
  };

  const progressPercent = Math.min(100, Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100));

  const handleReset = () => {
    setSecondsLeft(totalSeconds);
    setIsRunning(false);
  };

  const handleComplete = () => {
    const remainingMins = Math.ceil(secondsLeft / 60);
    onCompleteTask(task, remainingMins);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="focus-timer-card glass-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="timer-header">
          <div className="timer-tag">
            <Sparkles size={13} /> LIVE FOCUS TRACKER
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Task Title */}
        <h2 className="timer-task-title">{task.title}</h2>

        {/* Circular Progress Display */}
        <div className="timer-display-wrap">
          <div className="timer-circle-bg">
            <span className="timer-clock-text">{formatTime(secondsLeft)}</span>
            <span className="timer-sub-label">
              {secondsLeft === 0 ? "Target time reached!" : `${targetMinutes}m target duration`}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="timer-progress-track">
          <div className="timer-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* Action Controls */}
        <div className="timer-controls">
          <button
            type="button"
            className="control-btn secondary"
            onClick={handleReset}
            title="Reset Timer"
          >
            <RotateCcw size={16} /> Reset
          </button>

          <button
            type="button"
            className="control-btn primary"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? (
              <>
                <Pause size={18} /> Pause Focus
              </>
            ) : (
              <>
                <Play size={18} /> Resume Focus
              </>
            )}
          </button>

          <button
            type="button"
            className="control-btn success"
            onClick={handleComplete}
          >
            <CheckCircle2 size={18} /> Complete
          </button>
        </div>
      </div>

      <style>{`
        .focus-timer-card {
          max-width: 480px;
          width: 90%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          padding: 2.25rem;
          text-align: center;
        }
        .timer-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .timer-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.725rem;
          font-weight: 700;
          color: var(--accent-primary);
          background: var(--accent-light);
          padding: 3px 10px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--accent-border);
        }
        .timer-task-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--text-main);
          word-break: break-word;
        }
        .timer-display-wrap {
          margin: 0.5rem 0;
        }
        .timer-circle-bg {
          width: 190px;
          height: 190px;
          border-radius: 50%;
          background: rgba(30, 36, 48, 0.6);
          border: 2px solid var(--accent-border);
          box-shadow: 0 0 30px var(--accent-glow), inset 0 0 20px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .timer-clock-text {
          font-family: var(--font-heading);
          font-size: 2.75rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: 0.04em;
          line-height: 1;
        }
        .timer-sub-label {
          font-size: 0.775rem;
          color: var(--text-muted);
          margin-top: 6px;
        }
        .timer-progress-track {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-pill);
          overflow: hidden;
        }
        .timer-progress-fill {
          height: 100%;
          background: var(--accent-gradient);
          border-radius: var(--radius-pill);
          transition: width 0.3s ease;
        }
        .timer-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          margin-top: 0.5rem;
        }
        .control-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 14px;
          border-radius: var(--radius-pill);
          font-family: var(--font-heading);
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
        }
        .control-btn.secondary {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-secondary);
        }
        .control-btn.secondary:hover {
          background: var(--bg-hover);
          color: var(--text-main);
        }
        .control-btn.primary {
          background: var(--text-main);
          color: var(--text-inverse);
        }
        .control-btn.primary:hover {
          opacity: 0.9;
        }
        .control-btn.success {
          background: var(--accent-secondary);
          color: white;
          box-shadow: 0 4px 14px var(--accent-glow);
        }
        .control-btn.success:hover {
          background: var(--accent-primary);
        }
      `}</style>
    </div>
  );
}
