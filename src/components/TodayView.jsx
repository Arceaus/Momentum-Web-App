import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import GitHubContributionGraph from './GitHubContributionGraph';
import { Plus, Trash2, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

const CATEGORIES = ['Focus', 'Work', 'Creative', 'Personal', 'Health', 'Reading'];

const CATEGORY_CLASSES = {
  Focus: 'badge-focus',
  Work: 'badge-work',
  Creative: 'badge-creative',
  Personal: 'badge-personal',
  Health: 'badge-health',
  Reading: 'badge-reading',
};

export default function TodayView() {
  const {
    tasks,
    toggleTask,
    deleteTask,
    addTask,
    xpPops,
    completedTodayCount,
    totalTasksToday
  } = useApp();

  const [filterCategory, setFilterCategory] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('Focus');
  const [timeInput, setTimeInput] = useState('20m');
  const [priorityInput, setPriorityInput] = useState('medium');

  const filteredTasks = tasks.filter((t) => {
    if (filterCategory === 'All') return true;
    return t.category === filterCategory;
  });

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!titleInput.trim()) return;

    addTask({
      title: titleInput,
      category: categoryInput,
      timeEstimate: timeInput.trim() || '15m',
      priority: priorityInput,
    });

    setTitleInput('');
    setIsAdding(false);
  };

  const allDone = totalTasksToday > 0 && completedTodayCount === totalTasksToday;

  return (
    <div className="today-container">
      {/* Section Header */}
      <div className="section-header">
        <div className="title-group">
          <h2 className="main-title">Today</h2>
          <span className="task-counter">
            {completedTodayCount} of {totalTasksToday} completed
          </span>
        </div>

        {/* Category Filters */}
        <div className="filter-pills">
          <button
            className={`filter-pill ${filterCategory === 'All' ? 'active' : ''}`}
            onClick={() => setFilterCategory('All')}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Completion Celebration Banner */}
      {allDone && (
        <div className="completion-banner">
          <Sparkles className="sparkle-icon" size={20} />
          <div>
            <div className="banner-title">You're in peak momentum!</div>
            <div className="banner-subtitle">All tasks completed for today. Take a restful break or add one more focus item.</div>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state glass-card">
            <CheckCircle2 size={38} strokeWidth={1.4} className="empty-icon" />
            <div className="empty-title">Your workspace is ready</div>
            <p className="empty-text">Click "+ Add task" below to start your daily focus momentum.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const hasXpPop = xpPops.some((p) => p.taskId === task.id);
            const categoryClass = CATEGORY_CLASSES[task.category] || 'badge-focus';

            return (
              <div
                key={task.id}
                className={`task-item ${task.completed ? 'completed' : ''}`}
              >
                {/* Floating XP Animation */}
                {hasXpPop && <div className="xp-pop">+20 XP</div>}

                {/* Priority Dot */}
                <span
                  className={`priority-dot priority-${task.priority || 'medium'}`}
                  title={`Priority: ${task.priority || 'medium'}`}
                />

                {/* Animated Custom Checkbox */}
                <button
                  type="button"
                  className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
                  onClick={() => toggleTask(task.id)}
                  aria-label={`Mark task as ${task.completed ? 'incomplete' : 'complete'}`}
                >
                  <svg className="check-icon" width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path d="M1 5L4.5 8.5L11 1.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Task Title */}
                <span className="task-title" onClick={() => toggleTask(task.id)}>
                  {task.title}
                </span>

                {/* Category Badge & Meta */}
                <div className="task-meta">
                  <span className={`badge ${categoryClass}`}>
                    {task.category}
                  </span>
                  {task.timeEstimate && (
                    <span className="time-tag">
                      <Clock size={11} />
                      {task.timeEstimate}
                    </span>
                  )}

                  {/* Delete Button */}
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => deleteTask(task.id)}
                    title="Delete task"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Form or Trigger */}
      {isAdding ? (
        <form className="add-task-card glass-card" onSubmit={handleCreateTask}>
          <input
            type="text"
            className="add-task-input"
            placeholder="What would you like to achieve today?"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            autoFocus
          />
          <div className="add-task-options">
            <div className="selectors-group">
              <select
                className="category-select"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                className="category-select"
                value={priorityInput}
                onChange={(e) => setPriorityInput(e.target.value)}
              >
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>

              <input
                type="text"
                className="time-input"
                placeholder="20m"
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
              />
            </div>
            <div className="action-buttons">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                <Plus size={16} /> Add Task
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button className="add-task-trigger" onClick={() => setIsAdding(true)}>
          <Plus size={18} />
          <span>Add task</span>
        </button>
      )}

      {/* GitHub Contribution Graph on Home Page */}
      <GitHubContributionGraph />

      <style>{`
        .today-container {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .title-group {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }
        .main-title {
          font-size: 1.85rem;
          font-weight: 700;
        }
        .task-counter {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
        }
        .filter-pills {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 2px;
        }
        .filter-pill {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 4px 12px;
          border-radius: var(--radius-pill);
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .filter-pill:hover {
          background: var(--bg-hover);
        }
        .filter-pill.active {
          background: var(--text-main);
          color: var(--text-inverse);
          border-color: var(--text-main);
        }
        .completion-banner {
          display: flex;
          align-items: center;
          gap: 14px;
          background: var(--accent-light);
          border: 1px solid var(--accent-border);
          border-radius: var(--radius-md);
          padding: 1.1rem 1.4rem;
          color: var(--text-main);
        }
        .sparkle-icon {
          color: var(--accent-primary);
          flex-shrink: 0;
        }
        .banner-title {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1rem;
        }
        .banner-subtitle {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .task-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3.5rem 1rem;
          text-align: center;
          gap: 8px;
        }
        .empty-icon {
          color: var(--accent-primary);
          opacity: 0.85;
          margin-bottom: 4px;
        }
        .empty-title {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-main);
        }
        .empty-text {
          font-size: 0.875rem;
          color: var(--text-muted);
        }
        .task-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .time-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .delete-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          opacity: 0;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
        }
        .task-item:hover .delete-btn {
          opacity: 0.7;
        }
        .delete-btn:hover {
          opacity: 1 !important;
          color: var(--badge-coral-text);
          background: var(--badge-coral-bg);
        }
        .add-task-trigger {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 0.95rem;
          background: rgba(22, 27, 34, 0.35);
          backdrop-filter: blur(16px);
          border: 1px dashed rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-md);
          font-family: var(--font-heading);
          font-size: 0.925rem;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .add-task-trigger:hover {
          background: var(--bg-surface);
          border-color: var(--accent-primary);
          color: var(--accent-primary);
        }
        .add-task-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .add-task-input {
          width: 100%;
          border: none;
          outline: none;
          font-family: var(--font-body);
          font-size: 1rem;
          font-weight: 500;
          background: transparent;
          color: var(--text-main);
        }
        .add-task-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding-top: 8px;
          border-top: var(--border-light);
        }
        .selectors-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .category-select, .time-input {
          padding: 5px 12px;
          border-radius: var(--radius-pill);
          border: var(--border-glass);
          background: rgba(30, 36, 48, 0.8);
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-main);
          outline: none;
          color-scheme: dark;
        }
        .category-select option {
          background-color: #161B22 !important;
          color: #E6EDF3 !important;
        }
        .time-input {
          width: 65px;
          text-align: center;
        }
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        .btn-primary {
          background: var(--accent-secondary);
          color: white;
          border: none;
          padding: 7px 16px;
          border-radius: var(--radius-pill);
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          box-shadow: 0 4px 12px var(--accent-glow);
          transition: all 0.2s ease;
        }
        .btn-primary:hover {
          background: var(--accent-primary);
        }
        .btn-secondary {
          background: transparent;
          color: var(--text-secondary);
          border: none;
          padding: 7px 14px;
          border-radius: var(--radius-pill);
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
        }
        .btn-secondary:hover {
          color: var(--text-main);
          background: var(--bg-hover);
        }
      `}</style>
    </div>
  );
}
