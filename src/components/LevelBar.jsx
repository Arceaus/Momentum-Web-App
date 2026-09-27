import React from 'react';
import { useApp } from '../context/AppContext';
import { Zap } from 'lucide-react';

export default function LevelBar() {
  const { currentLevel, currentLevelXP, xpPerLevel, progressPercent } = useApp();

  return (
    <div className="level-bar-panel">
      <div className="level-tag-wrap">
        <span className="level-badge">
          <span className="level-txt">Level</span>
          <span className="level-num font-mono">{currentLevel}</span>
        </span>
      </div>

      <div className="level-rail-track" title={`${progressPercent}% progress to Level ${currentLevel + 1}`}>
        <div className="level-rail-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="xp-metric">
        <Zap size={12} className="xp-icon" />
        <span className="xp-numbers font-mono">{currentLevelXP} / {xpPerLevel} XP</span>
        <span className="xp-pct font-mono">({progressPercent}%)</span>
      </div>

      <style>{`
        .level-bar-panel {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.15rem;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-sm);
          gap: 1.25rem;
        }

        .level-tag-wrap {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .level-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-heading);
          font-size: 0.775rem;
          font-weight: 700;
          color: var(--text-primary);
          background: var(--bg-subtle);
          border: 1px solid var(--border-subtle);
          padding: 3px 8px;
          border-radius: var(--radius-xs);
        }

        .level-num {
          font-weight: 700;
        }

        .level-rail-track {
          flex: 1;
          height: 4px;
          background: var(--bg-surface-sunken);
          border-radius: 1px;
          overflow: hidden;
        }

        .level-rail-fill {
          height: 100%;
          background: var(--accent);
          transition: width 0.3s ease;
        }

        .xp-metric {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: var(--text-secondary);
          flex-shrink: 0;
          white-space: nowrap;
        }

        .xp-icon {
          color: var(--accent);
        }

        .xp-numbers {
          font-weight: 600;
          color: var(--text-primary);
        }

        .xp-pct {
          color: var(--text-muted);
          font-size: 0.7rem;
        }

        @media (max-width: 600px) {
          .level-bar-panel {
            padding: 0.65rem 0.9rem;
            gap: 0.75rem;
          }
          .xp-pct {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
