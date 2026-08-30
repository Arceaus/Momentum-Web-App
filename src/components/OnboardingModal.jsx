import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, Lock } from 'lucide-react';

export default function OnboardingModal() {
  const { user, onboardUser } = useApp();
  const [nameInput, setNameInput] = useState('');

  if (user.hasOnboarded) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    onboardUser(nameInput.trim());
  };

  const initialLetter = nameInput.trim() ? nameInput.trim().charAt(0).toUpperCase() : '?';

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card glass-card">
        {/* Top Floating Glow Avatar */}
        <div className="onboarding-avatar-circle">
          <span className="avatar-letter">{initialLetter}</span>
        </div>
        
        <div className="onboarding-title-group">
          <div className="security-tag">
            <Lock size={12} /> PRIVATE DIGITAL WORKSPACE
          </div>
          <h1 className="onboarding-title">Welcome to Momentum</h1>
          <p className="onboarding-subtitle">
            A serene, dark workspace with GitHub-style contribution tracking. Enter your name to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="input-group">
            <label className="onboarding-label">What is your name?</label>
            <input
              type="text"
              className="onboarding-input"
              placeholder="e.g. Sarthak, Alex, Maya..."
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              autoFocus
              required
            />
          </div>

          <button type="submit" className="onboarding-btn">
            <span>Unlock Workspace</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="onboarding-footer">
          <ShieldCheck size={14} className="shield-icon" />
          <span>Your data stays 100% private in your browser</span>
        </div>
      </div>

      <style>{`
        .onboarding-overlay {
          position: fixed;
          inset: 0;
          background: rgba(4, 8, 16, 0.88);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.3s ease;
          padding: 1rem;
        }
        .onboarding-card {
          max-width: 440px;
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          padding: 2.75rem 2.25rem;
          background: rgba(22, 27, 34, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-lg);
        }
        .onboarding-avatar-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--accent-gradient);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 24px var(--accent-glow);
          margin-bottom: 4px;
          transition: transform 0.2s var(--ease-spring);
        }
        .avatar-letter {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.65rem;
        }
        .onboarding-title-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .security-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--accent-primary);
          background: var(--accent-light);
          padding: 3px 10px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--accent-border);
        }
        .onboarding-title {
          font-family: var(--font-heading);
          font-size: 1.85rem;
          font-weight: 700;
          color: var(--text-main);
          letter-spacing: -0.02em;
        }
        .onboarding-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .onboarding-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-align: left;
        }
        .onboarding-label {
          font-size: 0.775rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .onboarding-input {
          width: 100%;
          padding: 13px 18px;
          border-radius: var(--radius-md);
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(30, 36, 48, 0.7);
          font-family: var(--font-body);
          font-size: 1.05rem;
          color: var(--text-main);
          outline: none;
          text-align: center;
          transition: all 0.25s ease;
        }
        .onboarding-input:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 16px var(--accent-glow);
          background: rgba(35, 42, 56, 0.9);
        }
        .onboarding-btn {
          width: 100%;
          padding: 13px;
          border-radius: var(--radius-pill);
          border: none;
          background: var(--accent-secondary);
          color: white;
          font-family: var(--font-heading);
          font-size: 0.975rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 18px var(--accent-glow);
          transition: all 0.25s var(--ease-spring);
        }
        .onboarding-btn:hover {
          background: var(--accent-primary);
          transform: translateY(-1px);
        }
        .onboarding-footer {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.775rem;
          color: var(--text-muted);
          margin-top: 4px;
        }
        .shield-icon {
          color: var(--accent-primary);
        }
      `}</style>
    </div>
  );
}
