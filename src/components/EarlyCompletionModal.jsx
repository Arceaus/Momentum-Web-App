import React from 'react';
import { AlertCircle, Clock, Check, ArrowLeft } from 'lucide-react';

export default function EarlyCompletionModal({ task, remainingMinutes, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel} role="dialog" aria-modal="true" aria-label="Early Completion Confirmation">
      <div className="early-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Warning Indicator */}
        <div className="warning-icon-wrap" aria-hidden="true">
          <AlertCircle size={22} className="warning-icon" />
        </div>

        <div className="early-modal-text-group">
          <h3 className="early-modal-title">Focus Time Remaining</h3>
          <div className="remaining-chip">
            <Clock size={12} />
            <span>
              <strong>{remainingMinutes} minute{remainingMinutes === 1 ? '' : 's'}</strong> remaining in target session
            </span>
          </div>
          <p className="early-modal-desc">
            You are logging <strong>"{task.title}"</strong> as complete early. Confirm whether this focus objective is fully accomplished.
          </p>
        </div>

        <div className="early-modal-actions">
          <button type="button" className="btn-modal-cancel" onClick={onCancel}>
            <ArrowLeft size={14} /> Resume Focus
          </button>
          
          <button type="button" className="btn-modal-confirm" onClick={onConfirm}>
            <Check size={14} /> Confirm Completion
          </button>
        </div>
      </div>

      <style>{`
        /* ==========================================================================
           Early Completion Modal (Serious, Restrained, Utilitarian)
           ========================================================================== */
        .early-modal-card {
          max-width: 420px;
          width: 90%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          padding: 2rem 1.75rem;
          text-align: center;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-modal);
        }

        .warning-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-xs);
          background: var(--warning-light);
          border: 1px solid var(--warning-border);
          color: var(--warning);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .early-modal-text-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .early-modal-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .remaining-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: var(--warning-light);
          color: var(--warning);
          padding: 3px 8px;
          border-radius: var(--radius-xs);
          font-family: var(--font-mono);
          font-size: 0.725rem;
          font-weight: 500;
          border: 1px solid var(--warning-border);
        }

        .early-modal-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-top: 4px;
        }

        .early-modal-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          width: 100%;
          margin-top: 0.25rem;
        }

        .btn-modal-cancel {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-family: var(--font-heading);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--duration-fast) ease;
        }

        .btn-modal-cancel:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
          border-color: var(--border-strong);
        }

        .btn-modal-confirm {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: var(--text-primary);
          border: 1px solid var(--text-primary);
          color: var(--text-inverse);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-family: var(--font-heading);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--duration-fast) ease;
        }

        .btn-modal-confirm:hover {
          background: var(--accent);
          border-color: var(--accent);
        }
      `}</style>
    </div>
  );
}
