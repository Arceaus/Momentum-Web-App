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
  high: { label: 'High', color: 'var(--danger)' },
  medium: { label: 'Med', color: 'var(--warning)' },
  low: { label: 'Low', color: 'var(--success)' },
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

  // Group tasks by category when All is selected
  const categoriesToRender = filterCategory === 'All'
    ? CATEGORIES.filter((cat) => filteredTasks.some((t) => t.category === cat))
    : [filterCategory];

  // Capture any tasks with custom/missing category
  const uncategorizedTasks = filterCategory === 'All'
    ? filteredTasks.filter((t) => !CATEGORIES.includes(t.category))
    : [];

  return (
    <div className="work-log-container">
      {/* ---------------------------------------------------------------------
         1. Today Header & Controls
         --------------------------------------------------------------------- */}
      <section className="work-log-header">
        <div className="header-meta-group">
          <div className="log-title-row">
            <h2 className="log-heading">Today</h2>
            <span className="log-count-text">
              {totalTasksToday === 0
                ? 'No tasks'
                : `${completedTodayCount} of ${totalTasksToday} completed`}
            </span>
          </div>

          {/* Simple Clean Progress Counter */}
          {totalTasksToday > 0 && (
            <div className="log-progress-stats">
              <span className="log-stat-num font-mono">{completedTodayCount} / {totalTasksToday}</span>
              <span className="log-stat-pct font-mono">({progressPercent}%)</span>
            </div>
          )}
        </div>

        {/* Category Segmented Strip */}
        <div className="category-filter-strip" role="toolbar" aria-label="Filter tasks by category">
          <button
            type="button"
            className={`filter-btn ${filterCategory === 'All' ? 'active' : ''}`}
            onClick={() => setFilterCategory('All')}
          >
            All <span className="filter-count font-mono">{tasks.length}</span>
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
                {count > 0 && <span className="filter-count font-mono">{count}</span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* Thin Hairline Progress Rail */}
      {totalTasksToday > 0 && (
        <div className="log-progress-rail" aria-hidden="true">
          <div
            className="log-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* ---------------------------------------------------------------------
         2. Completion Milestone Banner (Serene & Literary)
         --------------------------------------------------------------------- */}
      {allDone && (
        <div className="milestone-banner">
          <div className="milestone-content">
            <h3 className="milestone-title">{completionMessage.title}</h3>
            <p className="milestone-subtitle">{completionMessage.subtitle}</p>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------
         3. Integrated Work Log (Open, Ruled Task System)
         --------------------------------------------------------------------- */}
      <section className="work-log-surface" aria-label="Tasks list">
        {filteredTasks.length === 0 ? (
          <div className="empty-ledger">
            <CheckCircle2 size={28} strokeWidth={1.5} className="empty-glyph" />
            <div className="empty-content">
              <h3 className="empty-title">All clear for today</h3>
              <p className="empty-desc">
                {filterCategory === 'All'
                  ? 'No tasks scheduled yet. Add a task below to get started.'
                  : `No tasks in "${filterCategory}".`}
              </p>
            </div>
          </div>
        ) : (
          <div className="work-log-list" role="list">
            {categoriesToRender.map((cat) => {
              const catTasks = filteredTasks.filter((t) => t.category === cat);
              if (catTasks.length === 0) return null;

              return (
                <div key={cat} className="category-group">
                  <div className="category-group-header">
                    <span className="category-group-title">{cat}</span>
                    <span className="category-group-count font-mono">{catTasks.length}</span>
                  </div>

                  <div className="category-group-entries">
                    {catTasks.map((task) => {
                      const globalIdx = tasks.findIndex((t) => t.id === task.id);
                      const displayIdx = String((globalIdx >= 0 ? globalIdx : 0) + 1).padStart(2, '0');
                      const hasXpPop = xpPops.some((p) => p.taskId === task.id);
                      const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
                      const isEditing = editingTaskId === task.id;

                      return (
                        <article
                          key={task.id}
                          className={`ledger-entry ${task.completed ? 'completed' : ''}`}
                          role="listitem"
                        >
                          {/* Floating XP Pop */}
                          {hasXpPop && <span className="xp-pop">+20 XP</span>}

                          {/* Entry Index & Checkbox Area */}
                          <div className="entry-status-cell">
                            <span className="entry-index font-mono">{displayIdx}</span>

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

                            {/* Priority Indicator Pip */}
                            <span
                              className="priority-pip"
                              style={{ backgroundColor: priority.color }}
                              title={`Priority: ${priority.label}`}
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
                            {/* Duration Stamp */}
                            {task.timeEstimate && (
                              <span className="time-stamp font-mono" title={`Estimated focus: ${task.timeEstimate}`}>
                                <Clock size={11} className="stamp-icon" />
                                <span>{task.timeEstimate}</span>
                              </span>
                            )}

                            {/* Focus Button */}
                            {!task.completed && (
                              <button
                                type="button"
                                className="btn-start-focus"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveFocusTask(task);
                                }}
                                title="Start focus session"
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
                              title="Delete task"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Uncategorized group if any */}
            {uncategorizedTasks.length > 0 && (
              <div className="category-group">
                <div className="category-group-header">
                  <span className="category-group-title">Other</span>
                  <span className="category-group-count font-mono">{uncategorizedTasks.length}</span>
                </div>
                <div className="category-group-entries">
                  {uncategorizedTasks.map((task) => {
                    const globalIdx = tasks.findIndex((t) => t.id === task.id);
                    const displayIdx = String((globalIdx >= 0 ? globalIdx : 0) + 1).padStart(2, '0');
                    const hasXpPop = xpPops.some((p) => p.taskId === task.id);
                    const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
                    const isEditing = editingTaskId === task.id;

                    return (
                      <article
                        key={task.id}
                        className={`ledger-entry ${task.completed ? 'completed' : ''}`}
                        role="listitem"
                      >
                        {hasXpPop && <span className="xp-pop">+20 XP</span>}
                        <div className="entry-status-cell">
                          <span className="entry-index font-mono">{displayIdx}</span>
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
                          <span
                            className="priority-pip"
                            style={{ backgroundColor: priority.color }}
                            title={`Priority: ${priority.label}`}
                          />
                        </div>
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
                                >
                                  <Check size={13} />
                                </button>
                                <button
                                  type="button"
                                  className="btn-edit-action cancel"
                                  onClick={handleCancelEdit}
                                >
                                  <X size={13} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="entry-title-wrap"
                              onClick={() => handleCheckClick(task)}
                            >
                              <span className="entry-title-text">{task.title}</span>
                            </div>
                          )}
                        </div>
                        <div className="entry-meta-cell">
                          {task.timeEstimate && (
                            <span className="time-stamp font-mono">
                              <Clock size={11} className="stamp-icon" />
                              <span>{task.timeEstimate}</span>
                            </span>
                          )}
                          {!task.completed && (
                            <button
                              type="button"
                              className="btn-start-focus"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveFocusTask(task);
                              }}
                            >
                              <Play size={10} /> Focus
                            </button>
                          )}
                          {!isEditing && (
                            <button
                              type="button"
                              className="entry-action-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEdit(task);
                              }}
                            >
                              <Edit3 size={13} />
                            </button>
                          )}
                          <button
                            type="button"
                            className="entry-action-btn delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTask(task.id);
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------------
           4. Clean Ruled Add Task Trigger & Inline Composer
           ------------------------------------------------------------------- */}
        <div className="entry-composer-area">
          {isAdding ? (
            <form className="composer-form" onSubmit={handleCreateTask}>
              <div className="composer-input-row">
                <input
                  type="text"
                  className="composer-primary-input"
                  placeholder="What would you like to work on?"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Controls Row */}
              <div className="composer-controls-row">
                <div className="controls-left">
                  <span className="picker-label">Duration:</span>
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
                    className="custom-duration-input font-mono"
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
                    title="Priority"
                  >
                    <option value="high">High priority</option>
                    <option value="medium">Medium priority</option>
                    <option value="low">Low priority</option>
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
                      <Plus size={14} /> Add task
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
              <span>Add a task...</span>
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
           Today Work Log Styles (Editorial + Personal Workspace)
           ========================================================================== */
        .work-log-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          width: 100%;
        }

        /* 1. Header */
        .work-log-header {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .header-meta-group {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .log-title-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }

        .log-heading {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .log-count-text {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .log-progress-stats {
          display: flex;
          align-items: baseline;
          gap: 6px;
          font-size: 0.85rem;
        }

        .log-stat-num {
          font-weight: 600;
          color: var(--text-primary);
        }

        .log-stat-pct {
          color: var(--accent);
          font-size: 0.8rem;
          font-weight: 600;
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
          font-family: var(--font-heading);
          font-size: 0.775rem;
          font-weight: 600;
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
          opacity: 0.75;
        }

        /* Thin Progress Rail */
        .log-progress-rail {
          width: 100%;
          height: 2px;
          background: var(--bg-surface-sunken);
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
        }

        .milestone-content {
          display: flex;
          flex-direction: column;
          gap: 3px;
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

        /* 3. Work Log Surface */
        .work-log-surface {
          display: flex;
          flex-direction: column;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          overflow: hidden;
        }

        .work-log-list {
          display: flex;
          flex-direction: column;
        }

        /* Category Group */
        .category-group {
          display: flex;
          flex-direction: column;
        }

        .category-group-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 1.15rem 0.45rem 1.15rem;
          background: var(--bg-subtle);
          border-bottom: 1px solid var(--border-subtle);
        }

        .category-group-title {
          font-family: var(--font-heading);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: var(--tracking-wide);
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .category-group-count {
          font-size: 0.675rem;
          color: var(--text-faint);
        }

        .category-group-entries {
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
          transition: background-color var(--duration-fast) ease, opacity var(--duration-fast) ease;
          animation: taskInsert var(--duration-fast) var(--ease-tactile);
        }

        @keyframes taskInsert {
          from {
            opacity: 0;
            transform: translateY(-3px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ledger-entry:last-child {
          border-bottom: 1px solid var(--border-subtle);
        }

        .ledger-entry:hover {
          background: var(--bg-hover);
        }

        .ledger-entry.completed {
          background: var(--bg-subtle);
          opacity: 0.7;
        }

        /* Status & Checkbox Cell */
        .entry-status-cell {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-shrink: 0;
        }

        .entry-index {
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

        /* 4. Ruled Add Task Trigger & Composer */
        .entry-composer-area {
          background: var(--bg-surface);
        }

        .composer-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 0.85rem 1.15rem;
          background: transparent;
          border: none;
          border-top: 1px dashed var(--border);
          color: var(--text-muted);
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: color var(--duration-fast) ease, background-color var(--duration-fast) ease;
          text-align: left;
        }

        .composer-trigger:hover {
          color: var(--accent);
          background: var(--bg-hover);
        }

        .trigger-icon {
          color: var(--accent);
        }

        .composer-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 1.15rem;
          border-top: 1px solid var(--border);
          background: var(--bg-subtle);
        }

        .composer-primary-input {
          width: 100%;
          padding: 9px 12px !important;
          background: var(--bg-surface) !important;
          border: 1px solid var(--border) !important;
          border-radius: var(--radius-sm) !important;
          font-family: var(--font-heading) !important;
          font-size: 0.9375rem !important;
          color: var(--text-primary) !important;
        }

        .composer-primary-input:focus {
          border-color: var(--accent) !important;
        }

        .composer-controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .controls-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .picker-label {
          font-family: var(--font-heading);
          font-size: 0.725rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .duration-segmented {
          display: flex;
          gap: 3px;
        }

        .custom-duration-input {
          width: 54px !important;
          padding: 3px 6px !important;
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
          font-family: var(--font-heading) !important;
          font-size: 0.775rem !important;
        }

        .composer-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Mobile Layout */
        @media (max-width: 680px) {
          .log-heading {
            font-size: 1.15rem;
          }

          .custom-checkbox {
            position: relative;
            touch-action: manipulation;
          }

          .custom-checkbox::before {
            content: '';
            position: absolute;
            inset: -8px;
          }

          .ledger-entry {
            display: grid;
            grid-template-columns: auto 1fr;
            grid-template-rows: auto auto;
            align-items: center;
            padding: 0.85rem 0.95rem;
            column-gap: 10px;
            row-gap: 8px;
          }

          .entry-status-cell {
            grid-column: 1;
            grid-row: 1;
            align-self: center;
          }

          .entry-body-cell {
            grid-column: 2;
            grid-row: 1;
            width: 100%;
            min-width: 0;
            padding-left: 0;
          }

          .entry-meta-cell {
            grid-column: 1 / -1;
            grid-row: 2;
            width: 100%;
            padding-left: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 6px;
            border-top: 1px dashed var(--border-subtle);
            flex-wrap: wrap;
            gap: 6px;
          }

          .entry-action-btn {
            width: 32px;
            height: 32px;
          }

          .btn-start-focus {
            padding: 4px 10px;
            font-size: 0.75rem;
            min-height: 30px;
          }

          .category-filter-strip {
            padding-bottom: 4px;
            -webkit-overflow-scrolling: touch;
          }

          .filter-btn {
            min-height: 30px;
            padding: 5px 10px;
            font-size: 0.725rem;
          }

          .composer-controls-row {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }

          .controls-left {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }

          .duration-segmented {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
          }

          .dur-pill {
            flex: 1;
            min-width: 36px;
            text-align: center;
            padding: 6px 4px;
          }

          .controls-right {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            padding-top: 6px;
            border-top: 1px dashed var(--border-subtle);
          }

          .select-control {
            min-height: 34px;
          }

          .composer-primary-input {
            font-size: 1rem !important; /* Prevents iOS auto-zoom */
            min-height: 42px;
          }

          .composer-actions {
            width: 100%;
            justify-content: flex-end;
          }

          .composer-actions button {
            min-height: 34px;
            padding: 6px 14px;
          }
        }
      `}</style>
    </div>
  );
}
