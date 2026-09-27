import React from 'react';
import { useApp } from '../context/AppContext';
import { Zap } from 'lucide-react';

export default function LevelBar() {
  const { currentLevel, currentLevelXP, xpPerLevel, progressPercent } = useApp();

  const displayLevel = currentLevel < 10 ? `0${currentLevel}` : `${currentLevel}`;

  return (
    <div className="level-bar-instrument">
      <div className="level-tag-wrap">
        <span className="level-mono-badge">LVL {displayLevel}</span>
      </div>

      <div className="level-rail-track" title={`${progressPercent}% progress toward next level`}>
        <div className="level-rail-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="xp-telemetry">
        <Zap size={12} className="xp-telemetry-icon" />
        <span className="mono-numbers">{currentLevelXP} / {xpPerLevel} XP</span>
        <span className="mono-pct">[{progressPercent}%]</span>
      </div>

      <style>{`
        .level-bar-instrument {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
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
        .level-mono-badge {
          font-family: var(--font-mono);
          font-size: 0.775rem;
          font-weight: 700;
          letter-spacing: var(--tracking-mono);
          color: var(--text-primary);
          background: var(--bg-surface-sunken);
          border: 1px solid var(--border-subtle);
          padding: 3px 8px;
          border-radius: var(--radius-xs);
        }

        .level-rail-track {
          flex: 1;
          height: 6px;
          background: var(--bg-surface-sunken);
          border: 1px solid var(--border-subtle);
          border-radius: 2px;
          overflow: hidden;
        }
        .level-rail-fill {
          height: 100%;
          background: var(--accent);
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .xp-telemetry {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-secondary);
          flex-shrink: 0;
          white-space: nowrap;
        }
        .xp-telemetry-icon {
          color: var(--accent);
        }
        .mono-numbers {
          font-weight: 600;
          color: var(--text-primary);
        }
        .mono-pct {
          color: var(--text-muted);
          font-size: 0.7rem;
        }

        @media (max-width: 600px) {
          .level-bar-instrument {
            padding: 0.65rem 0.9rem;
            gap: 0.75rem;
          }
          .mono-pct {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
