import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Lock } from 'lucide-react';

export default function OnboardingModal() {
  const { user, onboardUser } = useApp();
  const [nameInput, setNameInput] = useState('');

  if (user.hasOnboarded) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    onboardUser(nameInput.trim());
  };

  const initialLetter = nameInput.trim() ? nameInput.trim().charAt(0).toUpperCase() : '—';

  return (
    <div className="onboarding-scrim">
      <div className="onboarding-document">
        {/* Top Protocol Header */}
        <div className="onboarding-masthead">
          <div className="protocol-badge">
            <span className="mono-label">MOMENTUM // SYSTEM INITIALIZATION</span>
            <span className="mono-spec">PROTOCOL 01</span>
          </div>
          <div className="onboarding-stamp">[{initialLetter}]</div>
        </div>

        {/* Philosophy Intro */}
        <div className="philosophy-statement">
          <h1 className="philosophy-title">
            A personal system for getting work done and seeing your progress.
          </h1>
          <p className="philosophy-prose">
            Designed without vanity metrics, algorithmic distractions, or external surveillance. Momentum functions as an intentional personal instrument: record your daily commitments, focus with calibrated clarity, and construct an archival record of your genuine output.
          </p>
        </div>

        {/* Three System Tenets */}
        <div className="tenets-ledger">
          <div className="tenet-row">
            <span className="tenet-idx">01</span>
            <div className="tenet-detail">
              <span className="tenet-heading">Intentional Ledger</span>
              <span className="tenet-text">Record what matters today. Strike through items as completed.</span>
            </div>
          </div>

          <div className="tenet-row">
            <span className="tenet-idx">02</span>
            <div className="tenet-detail">
              <span className="tenet-heading">Calibrated Focus</span>
              <span className="tenet-text">Single-task focus sessions paired with tactile auditory feedback.</span>
            </div>
          </div>

          <div className="tenet-row">
            <span className="tenet-idx">03</span>
            <div className="tenet-detail">
              <span className="tenet-heading">Private Archive</span>
              <span className="tenet-text">52-week activity chronicles persisted locally in browser IndexedDB.</span>
            </div>
          </div>
        </div>

        {/* Operator Identity Form */}
        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="form-field-group">
            <label className="field-label" htmlFor="onboarding-name">
              Operator Identity / Callsign
            </label>
            <div className="input-with-stamp">
              <input
                id="onboarding-name"
                type="text"
                className="onboarding-input"
                placeholder="Enter your name or handle..."
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                autoFocus
                required
              />
              <div className="live-preview-chip">
                [{initialLetter}]
              </div>
            </div>
          </div>

          <button type="submit" className="onboarding-submit-btn">
            <span>Initialize Workspace</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Micro Guarantee Footer */}
        <div className="onboarding-security-footer">
          <div className="security-badge">
            <Lock size={12} />
            <span>100% CLIENT-SIDE INDEXEDDB PERSISTENCE · ZERO TELEMETRY</span>
          </div>
        </div>
      </div>

      <style>{`
        .onboarding-scrim {
          position: fixed;
          inset: 0;
          background: rgba(24, 23, 21, 0.72);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1.5rem;
          animation: scrimFadeIn var(--duration-fast) ease-out;
        }

        .onboarding-document {
          max-width: 520px;
          width: 100%;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-modal);
          padding: 2.25rem 2.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          animation: docSlideIn var(--duration-normal) var(--ease-tactile);
        }

        /* Masthead */
        .onboarding-masthead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-subtle);
        }
        .protocol-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .mono-label {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          letter-spacing: var(--tracking-mono);
          color: var(--text-secondary);
          font-weight: 600;
        }
        .mono-spec {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--accent);
          background: var(--accent-light);
          border: 1px solid var(--accent-border);
          padding: 1px 6px;
          border-radius: var(--radius-xs);
        }
        .onboarding-stamp {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
          background: var(--bg-surface-sunken);
          border: 1px solid var(--border);
          padding: 3px 8px;
          border-radius: var(--radius-xs);
        }

        /* Statement */
        .philosophy-statement {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .philosophy-title {
          font-family: var(--font-display);
          font-size: 1.85rem;
          line-height: 1.25;
          color: var(--text-primary);
          font-weight: 400;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .philosophy-prose {
          font-family: var(--font-body);
          font-size: 0.865rem;
          color: var(--text-secondary);
          line-height: 1.55;
          margin: 0;
        }

        /* Tenets */
        .tenets-ledger {
          display: flex;
          flex-direction: column;
          gap: 8px;
          background: var(--bg-surface-sunken);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
        }
        .tenet-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .tenet-idx {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--accent);
          min-width: 18px;
        }
        .tenet-detail {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .tenet-heading {
          font-family: var(--font-heading);
          font-size: 0.775rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: var(--text-primary);
        }
        .tenet-text {
          font-family: var(--font-body);
          font-size: 0.75rem;
          color: var(--text-muted);
          line-height: 1.35;
        }

        /* Form */
        .onboarding-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .field-label {
          font-family: var(--font-mono);
          font-size: 0.725rem;
          letter-spacing: var(--tracking-mono);
          color: var(--text-secondary);
          text-transform: uppercase;
          font-weight: 600;
        }
        .input-with-stamp {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .onboarding-input {
          flex: 1;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          background: var(--bg-surface);
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: var(--text-primary);
          outline: none;
          transition: border-color var(--duration-fast) ease;
        }
        .onboarding-input:focus {
          border-color: var(--text-primary);
        }
        .live-preview-chip {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--accent);
          background: var(--accent-light);
          border: 1px solid var(--accent-border);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          min-width: 44px;
          text-align: center;
        }

        .onboarding-submit-btn {
          width: 100%;
          background: var(--text-primary);
          color: var(--text-inverse);
          border: 1px solid var(--text-primary);
          padding: 11px 18px;
          border-radius: var(--radius-sm);
          font-family: var(--font-heading);
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: opacity var(--duration-fast) ease, transform var(--duration-fast) ease;
        }
        .onboarding-submit-btn:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }

        /* Micro Security */
        .onboarding-security-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 4px;
        }
        .security-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.04em;
          color: var(--text-muted);
        }

        @keyframes scrimFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes docSlideIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 600px) {
          .onboarding-scrim {
            padding: 1rem;
          }
          .onboarding-document {
            padding: 1.5rem 1.15rem;
            gap: 1.15rem;
          }
          .philosophy-title {
            font-size: clamp(1.35rem, 5.5vw, 1.65rem);
          }
          .onboarding-input {
            font-size: 1rem; /* Prevents unwanted iOS auto-zoom */
            min-height: 44px;
          }
          .onboarding-submit-btn {
            min-height: 44px;
            font-size: 0.875rem;
          }
        }
      `}</style>
    </div>
  );
}
