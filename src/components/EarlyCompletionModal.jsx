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
          <h3 className="early-modal-title">Mark complete early?</h3>
          <div className="remaining-chip">
            <Clock size={12} />
            <span>
              <strong className="font-mono">{remainingMinutes}m</strong> remaining in estimate
            </span>
          </div>
          <p className="early-modal-desc">
            You still have estimated time left on <strong>"{task.title}"</strong>. Is this task finished?
          </p>
        </div>

        <div className="early-modal-actions">
          <button type="button" className="btn-modal-cancel" onClick={onCancel}>
            <ArrowLeft size={14} /> Keep focusing
          </button>
          
          <button type="button" className="btn-modal-confirm" onClick={onConfirm}>
            <Check size={14} /> Mark completed
          </button>
        </div>
      </div>

      <style>{`
        .early-modal-card {
          max-width: 400px;
          width: 90%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          padding: 2rem 1.75rem;
          text-align: center;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-modal);
          animation: modalSettle var(--duration-fast) var(--ease-tactile);
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
          font-size: 1.2rem;
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
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid var(--warning-border);
        }

        .early-modal-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .early-modal-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          justify-content: center;
        }

        .early-modal-actions button {
          flex: 1;
        }

        @media (max-width: 480px) {
          .early-modal-actions {
            flex-direction: column;
          }
          .early-modal-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
