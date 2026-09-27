import React, { useState, useEffect, useRef } from 'react';
import { useApp, parseMinutes } from '../context/AppContext';
import { getRandomCompletionMessage } from '../utils/quotes';
import GitHubContributionGraph from './GitHubContributionGraph';
import FocusTimerModal from './FocusTimerModal';
import EarlyCompletionModal from './EarlyCompletionModal';
import { Plus, Trash2, Clock, Check, Play, Edit3, X, CheckCircle2 } from 'lucide-react';

const CATEGORIES = ['Focus', 'Work', 'Creative', 'Personal', 'Health', 'Reading'];
const DURATION_PRESETS = ['15m', '25m', '45m', '60m', '90m', '120m'];

const PRIORITY_CONFIG = {
  high: { label: 'P1', full: 'High', color: 'var(--danger)' },
  medium: { label: 'P2', full: 'Med', color: 'var(--warning)' },
  low: { label: 'P3', full: 'Low', color: 'var(--success)' },
};

export default function TodayView() {
  const {
    tasks,
    toggleTask,
    deleteTask,
    addTask,
    updateTask,
    xpPops,
    completedTodayCount,
    totalTasksToday,
  } = useApp();

  const [filterCategory, setFilterCategory] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('Focus');
  const [timeInput, setTimeInput] = useState('25m');
  const [priorityInput, setPriorityInput] = useState('medium');

  // In-place inline edit state
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitleInput, setEditTitleInput] = useState('');

  // Modals state
  const [activeFocusTask, setActiveFocusTask] = useState(null);
  const [earlyTaskGuard, setEarlyTaskGuard] = useState(null);

  const allDone = totalTasksToday > 0 && completedTodayCount === totalTasksToday;
  const [completionMessage, setCompletionMessage] = useState(() => getRandomCompletionMessage());
  const prevAllDoneRef = useRef(allDone);

  useEffect(() => {
    if (allDone && !prevAllDoneRef.current) {
      setCompletionMessage(getRandomCompletionMessage());
    }
    prevAllDoneRef.current = allDone;
  }, [allDone]);

  const filteredTasks = tasks.filter((t) => {
    if (filterCategory === 'All') return true;
    return t.category === filterCategory;
  });

  const progressPercent = totalTasksToday > 0 
    ? Math.round((completedTodayCount / totalTasksToday) * 100) 
    : 0;

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!titleInput.trim()) return;

    addTask({
      title: titleInput.trim(),
      category: categoryInput,
      timeEstimate: timeInput.trim() || '25m',
      priority: priorityInput,
    });

    setTitleInput('');
    setIsAdding(false);
  };

  const handleStartEdit = (task) => {
    setEditingTaskId(task.id);
    setEditTitleInput(task.title);
  };

  const handleSaveEdit = (taskId) => {
    if (editTitleInput.trim()) {
      if (updateTask) {
        updateTask(taskId, { title: editTitleInput.trim() });
      }
    }
    setEditingTaskId(null);
    setEditTitleInput('');
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditTitleInput('');
  };

  const handleCheckClick = (task) => {
    if (task.completed) {
      toggleTask(task.id);
      return;
    }

    const minutes = parseMinutes(task.timeEstimate);
    if (minutes >= 2) {
      setEarlyTaskGuard({ task, remainingMinutes: minutes });
    } else {
      toggleTask(task.id);
    }
  };

  const handleConfirmEarlyComplete = () => {
    if (earlyTaskGuard) {
      toggleTask(earlyTaskGuard.task.id);
      setEarlyTaskGuard(null);
    }
  };

  const handleFocusModalComplete = (task) => {
    setActiveFocusTask(null);
    toggleTask(task.id);
  };

  return (
    <div className="work-log-container">
      {/* ---------------------------------------------------------------------
         1. Work Log Control Bar & Metrics Header
         --------------------------------------------------------------------- */}
      <section className="work-log-header">
        <div className="header-meta-group">
          <div className="log-title-row">
            <h2 className="log-heading">Daily Work Log</h2>
            <span className="log-rule-tag">TODAY</span>
          </div>

          {/* Numerical Progress Indicator */}
          <div className="progress-telemetry">
            <div className="telemetry-figures">
              <span className="figure-completed">{String(completedTodayCount).padStart(2, '0')}</span>
              <span className="figure-slash">/</span>
              <span className="figure-total">{String(totalTasksToday).padStart(2, '0')}</span>
              <span className="figure-label">COMPLETED</span>
            </div>
            {totalTasksToday > 0 && (
              <span className="percent-stamp">[{progressPercent}%]</span>
            )}
          </div>
        </div>

        {/* Category Segmented Strip */}
        <div className="category-filter-strip" role="toolbar" aria-label="Filter tasks by category">
          <button
            type="button"
            className={`filter-btn ${filterCategory === 'All' ? 'active' : ''}`}
            onClick={() => setFilterCategory('All')}
          >
            All <span className="filter-count">{tasks.length}</span>
          </button>
          {CATEGORIES.map((cat) => {
            const count = tasks.filter((t) => t.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
                {count > 0 && <span className="filter-count">{count}</span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* Thin Architectural Rail Progress Bar */}
      {totalTasksToday > 0 && (
        <div className="log-progress-rail" aria-hidden="true">
          <div
            className="log-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* ---------------------------------------------------------------------
         2. Completion Milestone Banner (Restrained, Editorial, Literary)
         --------------------------------------------------------------------- */}
      {allDone && (
        <div className="milestone-banner">
          <div className="milestone-content">
            <span className="milestone-eyebrow">MILESTONE ACHIEVED · 100% COMPLETE</span>
            <h3 className="milestone-title">{completionMessage.title}</h3>
            <p className="milestone-subtitle">{completionMessage.subtitle}</p>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------
         3. Integrated Work Log Ledger (Structured Entries)
         --------------------------------------------------------------------- */}
      <section className="ledger-surface" aria-label="Tasks list">
        {filteredTasks.length === 0 ? (
          <div className="empty-ledger">
            <CheckCircle2 size={32} strokeWidth={1.5} className="empty-glyph" />
            <div className="empty-content">
              <h3 className="empty-title">Console Slate Ready</h3>
              <p className="empty-desc">
                {filterCategory === 'All'
                  ? 'No entries recorded for today yet. Use the entry line below to log your focus targets.'
                  : `No tasks logged in category "${filterCategory}".`}
              </p>
            </div>
          </div>
        ) : (
          <div className="ledger-table" role="list">
            {filteredTasks.map((task, idx) => {
              const hasXpPop = xpPops.some((p) => p.taskId === task.id);
              const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
              const isEditing = editingTaskId === task.id;

              return (
                <article
                  key={task.id}
                  className={`ledger-entry ${task.completed ? 'completed' : ''}`}
                  role="listitem"
                >
                  {/* Floating XP Tag */}
                  {hasXpPop && <span className="xp-pop">+20 XP</span>}

                  {/* Entry Index & Checkbox Area */}
                  <div className="entry-status-cell">
                    <span className="entry-index">{String(idx + 1).padStart(2, '0')}</span>

                    <button
                      type="button"
                      className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
                      onClick={() => handleCheckClick(task)}
                      aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'completed'}`}
                      title={task.completed ? 'Mark incomplete' : 'Mark completed'}
                    >
                      <svg className="check-icon" width="11" height="9" viewBox="0 0 11 9" fill="none">
                        <path
                          d="M1 4.5L4 7.5L10 1.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="square"
                          strokeLinejoin="miter"
                        />
                      </svg>
                    </button>

                    {/* Priority Stamp Pip */}
                    <span
                      className="priority-pip"
                      style={{ backgroundColor: priority.color }}
                      title={`Priority: ${priority.full} (${priority.label})`}
                    />
                  </div>

                  {/* Primary Title / In-place Editor */}
                  <div className="entry-body-cell">
                    {isEditing ? (
                      <div className="inline-edit-wrapper">
                        <input
                          type="text"
                          className="inline-edit-input"
                          value={editTitleInput}
                          onChange={(e) => setEditTitleInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(task.id);
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          autoFocus
                        />
                        <div className="inline-edit-actions">
                          <button
                            type="button"
                            className="btn-edit-action save"
                            onClick={() => handleSaveEdit(task.id)}
                            title="Save changes (Enter)"
                          >
                            <Check size={13} />
                          </button>
                          <button
                            type="button"
                            className="btn-edit-action cancel"
                            onClick={handleCancelEdit}
                            title="Cancel (Esc)"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="entry-title-wrap"
                        onClick={() => handleCheckClick(task)}
                        title="Click to toggle completion"
                      >
                        <span className="entry-title-text">{task.title}</span>
                      </div>
                    )}
                  </div>

                  {/* Metadata & Controls Cell */}
                  <div className="entry-meta-cell">
                    {/* Compact Category Tag */}
                    <span className={`badge badge-${task.category ? task.category.toLowerCase() : 'focus'}`}>
                      {task.category || 'Focus'}
                    </span>

                    {/* Duration Stamp */}
                    {task.timeEstimate && (
                      <span className="time-stamp" title={`Estimated focus: ${task.timeEstimate}`}>
                        <Clock size={11} className="stamp-icon" />
                        <span>{task.timeEstimate}</span>
                      </span>
                    )}

                    {/* Focus Timer Trigger Button */}
                    {!task.completed && (
                      <button
                        type="button"
                        className="btn-start-focus"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveFocusTask(task);
                        }}
                        title="Start focus timer for this task"
                      >
                        <Play size={10} /> Focus
                      </button>
                    )}

                    {/* In-place Edit Button */}
                    {!isEditing && (
                      <button
                        type="button"
                        className="entry-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(task);
                        }}
                        title="Edit task title"
                      >
                        <Edit3 size={13} />
                      </button>
                    )}

                    {/* Delete Button */}
                    <button
                      type="button"
                      className="entry-action-btn delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                      title="Remove task from today"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* -------------------------------------------------------------------
           4. Integrated Entry Composer (Clean, Non-Floating)
           ------------------------------------------------------------------- */}
        <div className="entry-composer-area">
          {isAdding ? (
            <form className="composer-form" onSubmit={handleCreateTask}>
              <div className="composer-input-row">
                <input
                  type="text"
                  className="composer-primary-input"
                  placeholder="Record task title or intention..."
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Duration Presets & Context Row */}
              <div className="composer-controls-row">
                <div className="controls-left">
                  <span className="picker-label">Target Duration:</span>
                  <div className="duration-segmented">
                    {DURATION_PRESETS.map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        className={`dur-pill ${timeInput === dur ? 'active' : ''}`}
                        onClick={() => setTimeInput(dur)}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    className="custom-duration-input"
                    placeholder="25m"
                    value={timeInput}
                    onChange={(e) => setTimeInput(e.target.value)}
                    title="Custom duration (e.g. 35m, 1h, 90m)"
                  />
                </div>

                <div className="controls-right">
                  <select
                    className="select-control"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    title="Task category"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  <select
                    className="select-control"
                    value={priorityInput}
                    onChange={(e) => setPriorityInput(e.target.value)}
                    title="Task priority level"
                  >
                    <option value="high">P1 High</option>
                    <option value="medium">P2 Medium</option>
                    <option value="low">P3 Low</option>
                  </select>

                  <div className="composer-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setIsAdding(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      <Plus size={14} /> Add Entry
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <button
              type="button"
              className="composer-trigger"
              onClick={() => setIsAdding(true)}
            >
              <Plus size={15} className="trigger-icon" />
              <span>Record new focus task...</span>
              <span className="trigger-hint">[+ ADD]</span>
            </button>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------------------------
         5. Focus & Completion Guard Modals
         --------------------------------------------------------------------- */}
      {activeFocusTask && (
        <FocusTimerModal
          task={activeFocusTask}
          onClose={() => setActiveFocusTask(null)}
          onCompleteTask={handleFocusModalComplete}
        />
      )}

      {earlyTaskGuard && (
        <EarlyCompletionModal
          task={earlyTaskGuard.task}
          remainingMinutes={earlyTaskGuard.remainingMinutes}
          onConfirm={handleConfirmEarlyComplete}
          onCancel={() => setEarlyTaskGuard(null)}
        />
      )}

      {/* Contribution Activity Graph on Home Canvas */}
      <GitHubContributionGraph />

      <style>{`
        /* ==========================================================================
           Today Work Log Styles (Editorial + Utilitarian Architecture)
           ========================================================================== */
        .work-log-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          width: 100%;
        }

        /* 1. Header & Telemetry */
        .work-log-header {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .header-meta-group {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .log-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .log-heading {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .log-rule-tag {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: var(--radius-xs);
          background: var(--bg-subtle);
          color: var(--text-muted);
          border: 1px solid var(--border-subtle);
          letter-spacing: 0.05em;
        }

        .progress-telemetry {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .telemetry-figures {
          display: inline-flex;
          align-items: baseline;
          gap: 3px;
          font-family: var(--font-mono);
          font-feature-settings: "tnum";
        }

        .figure-completed {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .figure-slash {
          font-size: 0.9rem;
          color: var(--text-faint);
        }

        .figure-total {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .figure-label {
          font-size: 0.675rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          margin-left: 4px;
        }

        .percent-stamp {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--accent);
        }

        /* Category Filter Segmented Strip */
        .category-filter-strip {
          display: flex;
          align-items: center;
          gap: 4px;
          overflow-x: auto;
          padding-bottom: 2px;
          scrollbar-width: none;
        }

        .category-filter-strip::-webkit-scrollbar {
          display: none;
        }

        .filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          color: var(--text-muted);
          padding: 4px 10px;
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          font-size: 0.725rem;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all var(--duration-fast) ease;
        }

        .filter-btn:hover {
          color: var(--text-primary);
          background: var(--bg-hover);
        }

        .filter-btn.active {
          background: var(--text-primary);
          color: var(--text-inverse);
          border-color: var(--text-primary);
        }

        .filter-count {
          font-size: 0.65rem;
          opacity: 0.7;
        }

        /* Thin Progress Rail */
        .log-progress-rail {
          width: 100%;
          height: 3px;
          background: var(--bg-surface-sunken);
          border-radius: var(--radius-none);
          overflow: hidden;
        }

        .log-progress-fill {
          height: 100%;
          background: var(--accent);
          transition: width var(--duration-normal) var(--ease-tactile);
        }

        /* 2. Milestone Banner */
        .milestone-banner {
          display: flex;
          align-items: center;
          padding: 1.1rem 1.35rem;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-left: 3px solid var(--accent);
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-sm);
        }

        .milestone-content {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .milestone-eyebrow {
          font-family: var(--font-mono);
          font-size: 0.675rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--accent);
        }

        .milestone-title {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 1.35rem;
          font-weight: 400;
          color: var(--text-primary);
          line-height: 1.25;
        }

        .milestone-subtitle {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        /* 3. Structured Ledger Surface */
        .ledger-surface {
          display: flex;
          flex-direction: column;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .ledger-table {
          display: flex;
          flex-direction: column;
        }

        .ledger-entry {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.15rem;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--bg-surface);
          gap: 12px;
          transition: background-color var(--duration-fast) ease;
        }

        .ledger-entry:last-child {
          border-bottom: 1px solid var(--border);
        }

        .ledger-entry:hover {
          background: #FAF8F5;
        }

        .ledger-entry.completed {
          background: #F9F7F4;
          opacity: 0.72;
        }

        /* Status & Checkbox Cell */
        .entry-status-cell {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-shrink: 0;
        }

        .entry-index {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-faint);
          width: 18px;
        }

        .priority-pip {
          width: 5px;
          height: 5px;
          border-radius: 0;
          flex-shrink: 0;
        }

        /* Primary Body Cell */
        .entry-body-cell {
          flex: 1;
          min-width: 0;
        }

        .entry-title-wrap {
          cursor: pointer;
        }

        .entry-title-text {
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--text-primary);
          line-height: 1.4;
          word-break: break-word;
          transition: color var(--duration-fast) ease;
        }

        .ledger-entry.completed .entry-title-text {
          color: var(--text-muted);
          text-decoration: line-through;
          text-decoration-color: var(--text-faint);
          text-decoration-thickness: 1.5px;
        }

        /* In-place Inline Edit */
        .inline-edit-wrapper {
          display: flex;
          align-items: center;
          gap: 6px;
          width: 100%;
        }

        .inline-edit-input {
          flex: 1;
          padding: 4px 8px !important;
          font-size: 0.875rem !important;
          border-radius: var(--radius-xs) !important;
        }

        .inline-edit-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .btn-edit-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border: 1px solid var(--border);
          border-radius: var(--radius-xs);
          background: var(--bg-surface);
          cursor: pointer;
        }

        .btn-edit-action.save {
          color: var(--success);
        }

        .btn-edit-action.cancel {
          color: var(--text-muted);
        }

        /* Metadata & Controls Cell */
        .entry-meta-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .time-stamp {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-mono);
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        .stamp-icon {
          color: var(--text-faint);
        }

        .entry-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          background: transparent;
          border: none;
          color: var(--text-faint);
          border-radius: var(--radius-xs);
          cursor: pointer;
          transition: all var(--duration-fast) ease;
        }

        .ledger-entry:hover .entry-action-btn {
          color: var(--text-muted);
        }

        .entry-action-btn:hover {
          color: var(--text-primary);
          background: var(--bg-hover);
        }

        .entry-action-btn.delete:hover {
          color: var(--danger);
          background: var(--danger-light);
        }

        /* Empty State */
        .empty-ledger {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 3rem 1.75rem;
          border-bottom: 1px solid var(--border);
        }

        .empty-glyph {
          color: var(--text-faint);
          flex-shrink: 0;
        }

        .empty-content {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .empty-title {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .empty-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        /* 4. Integrated Entry Composer */
        .entry-composer-area {
          background: var(--bg-surface);
        }

        .composer-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 0.95rem 1.15rem;
          background: transparent;
          border: none;
          font-family: var(--font-heading);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-muted);
          cursor: pointer;
          transition: background-color var(--duration-fast) ease, color var(--duration-fast) ease;
        }

        .composer-trigger:hover {
          background: var(--bg-subtle);
          color: var(--text-primary);
        }

        .trigger-icon {
          color: var(--accent);
        }

        .trigger-hint {
          margin-left: auto;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-faint);
        }

        /* Active Composer Form */
        .composer-form {
          display: flex;
          flex-direction: column;
          padding: 1.15rem;
          gap: 0.85rem;
          background: var(--bg-subtle);
        }

        .composer-input-row {
          width: 100%;
        }

        .composer-primary-input {
          width: 100%;
          border: 1px solid var(--border) !important;
          background: var(--bg-surface) !important;
          padding: 9px 12px !important;
          font-family: var(--font-body) !important;
          font-size: 0.95rem !important;
          border-radius: var(--radius-sm) !important;
        }

        .composer-controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }

        .controls-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .picker-label {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .duration-segmented {
          display: flex;
          gap: 3px;
        }

        .custom-duration-input {
          width: 54px !important;
          padding: 3px 6px !important;
          font-family: var(--font-mono) !important;
          font-size: 0.75rem !important;
          text-align: center;
        }

        .controls-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .select-control {
          padding: 4px 8px !important;
          font-family: var(--font-mono) !important;
          font-size: 0.775rem !important;
        }

        .composer-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Responsive Layout Adjustments */
        @media (max-width: 680px) {
          .ledger-entry {
            flex-direction: column;
            align-items: flex-start;
            padding: 0.85rem 1rem;
            gap: 8px;
          }

          .entry-status-cell {
            width: 100%;
          }

          .entry-body-cell {
            width: 100%;
            padding-left: 27px; /* Align flush with title under checkbox */
          }

          .entry-meta-cell {
            width: 100%;
            padding-left: 27px;
            justify-content: space-between;
            padding-top: 4px;
            border-top: 1px dashed var(--border-subtle);
          }

          .composer-controls-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .controls-right {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}
