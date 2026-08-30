import React from 'react';
import { AlertCircle, Clock, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function EarlyCompletionModal({ task, remainingMinutes, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="early-modal-card glass-card" onClick={(e) => e.stopPropagation()}>
        {/* Warning Icon Header */}
        <div className="warning-icon-wrap">
          <AlertCircle size={28} className="warning-icon" />
        </div>

        <h3 className="early-modal-title">Focus Time Remaining!</h3>

        <div className="remaining-chip">
          <Clock size={14} />
          <span><strong>{remainingMinutes} minute{remainingMinutes === 1 ? '' : 's'}</strong> left in target duration</span>
        </div>

        <p className="early-modal-desc">
          You are completing <strong>"{task.title}"</strong> early! Are you sure your task is fully finished?
        </p>

        <div className="early-modal-actions">
          <button type="button" className="btn-modal-cancel" onClick={onCancel}>
            <ArrowLeft size={15} /> Keep Focusing
          </button>
          
          <button type="button" className="btn-modal-confirm" onClick={onConfirm}>
            <CheckCircle2 size={15} /> Yes, Completed Early! 🎉
          </button>
        </div>
      </div>

      <style>{`
        .early-modal-card {
          max-width: 440px;
          width: 90%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.1rem;
          padding: 2.25rem 1.75rem;
          text-align: center;
        }
        .warning-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(210, 153, 34, 0.15);
          border: 1px solid rgba(210, 153, 34, 0.4);
          color: #D29922;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .early-modal-title {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .remaining-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(210, 153, 34, 0.15);
          color: #E3B341;
          padding: 4px 14px;
          border-radius: var(--radius-pill);
          font-size: 0.825rem;
          border: 1px solid rgba(210, 153, 34, 0.3);
        }
        .early-modal-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.55;
        }
        .early-modal-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          margin-top: 0.5rem;
        }
        .btn-modal-cancel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.08);
          border: var(--border-light);
          color: var(--text-secondary);
          padding: 10px 14px;
          border-radius: var(--radius-pill);
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-modal-cancel:hover {
          background: var(--bg-hover);
          color: var(--text-main);
        }
        .btn-modal-confirm {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: var(--accent-secondary);
          border: none;
          color: white;
          padding: 10px 14px;
          border-radius: var(--radius-pill);
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px var(--accent-glow);
          transition: all 0.2s ease;
        }
        .btn-modal-confirm:hover {
          background: var(--accent-primary);
        }
      `}</style>
    </div>
  );
}
