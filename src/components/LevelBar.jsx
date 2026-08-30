import React from 'react';
import { useApp } from '../context/AppContext';
import { Zap } from 'lucide-react';

export default function LevelBar() {
  const { currentLevel, currentLevelXP, xpPerLevel, progressPercent } = useApp();

  const displayLevel = currentLevel < 10 ? `0${currentLevel}` : `${currentLevel}`;

  return (
    <div className="level-bar-container glass-card">
      <span className="level-tag">Level {displayLevel}</span>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="xp-details">
        <Zap size={14} className="xp-icon" />
        <span>{currentLevelXP} / {xpPerLevel} XP</span>
      </div>

      <style>{`
        .level-bar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.4rem;
        }
        .level-tag {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-main);
          white-space: nowrap;
        }
        .progress-track {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-pill);
          margin: 0 1.25rem;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: var(--accent-gradient);
          border-radius: var(--radius-pill);
          transition: width 0.5s var(--ease-smooth);
        }
        .xp-details {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
          white-space: nowrap;
        }
        .xp-icon {
          color: var(--accent-primary);
        }
      `}</style>
    </div>
  );
}
