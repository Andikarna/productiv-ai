import { useEffect, useState } from 'react';
import { format, isBefore, addDays } from 'date-fns';

const PRIORITY_COLORS = {
  high: 'var(--color-danger)',
  medium: 'var(--color-warning)',
  low: 'var(--color-success)',
};

const PRIORITY_LABELS = { high: '🔴 Critical', medium: '🟡 Standard', low: '🟢 Routine' };

export default function TaskPanel({ taskHook }) {
  // Use passed taskHook (avoid double hook calling)
  const { tasks, loading, fetchTasks, createTask, createNLTask, toggleTask, deleteTask, pendingCount, overdueCount } = taskHook;
  
  const [showForm, setShowForm] = useState(false);
  const [nlInput, setNlInput] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [submitting, setSubmitting] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'medium' });

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateNL = async (e) => {
    e.preventDefault();
    if (!nlInput.trim()) return;
    setSubmitting(true);
    try {
      await createNLTask(nlInput.trim());
      setNlInput('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateStructured = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    setSubmitting(true);
    try {
      await createTask({
        ...newTask,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate).toISOString() : null,
      });
      setNewTask({ title: '', description: '', dueDate: '', priority: 'medium' });
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTasks = tasks.filter((t) =>
    filterStatus === 'all' ? true : t.status === filterStatus
  );

  const getDueDateLabel = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const now = new Date();
    if (isBefore(date, now)) return { text: 'Overdue', color: 'var(--color-danger)' };
    if (isBefore(date, addDays(now, 1))) return { text: 'Due Today', color: 'var(--color-warning)' };
    return { text: format(date, 'MMM d, HH:mm'), color: 'var(--color-text-faint)' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative' }}>
      
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute', top: '20%', right: '-10%',
        width: '400px', height: '400px', background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)',
        opacity: 0.1, pointerEvents: 'none', zIndex: 0
      }}/>

      {/* Header */}
      <div className="glass" style={{
        padding: '0 32px',
        height: 'var(--header-h)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border)',
        flexShrink: 0,
        zIndex: 10,
        boxShadow: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 style={{ fontSize: '1.2rem', margin: 0, fontFamily: 'var(--font-display)' }}>Task Matrix</h2>
          {pendingCount > 0 && (
            <span className="badge animate-scale-in" style={{ 
              background: overdueCount > 0 ? 'rgba(255, 42, 85, 0.2)' : 'rgba(138, 43, 226, 0.2)',
              color: overdueCount > 0 ? 'var(--color-danger)' : 'var(--color-primary-light)',
              border: `1px solid ${overdueCount > 0 ? 'rgba(255, 42, 85, 0.5)' : 'rgba(138, 43, 226, 0.5)'}`,
            }}>
              {pendingCount} PENDING
            </span>
          )}
        </div>
        <button
          id="btn-new-task"
          onClick={() => setShowForm((v) => !v)}
          className="btn btn-primary"
          style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)' }}
        >
           {showForm ? 'CLOSING' : '+ NEW DIRECTIVE'}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px', zIndex: 1 }}>
        
        {/* Input Forms */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
          {/* Natural language quick-add */}
          <form onSubmit={handleCreateNL} style={{ display: 'flex', gap: '12px' }}>
            <input
              id="task-nl-input"
              className="input"
              style={{ fontSize: '0.95rem' }}
              value={nlInput}
              onChange={(e) => setNlInput(e.target.value)}
              placeholder='Quick Add: "Remind me to push updates at 5pm"'
            />
            <button id="btn-add-nl-task" type="submit" disabled={!nlInput.trim() || submitting} className="btn btn-secondary" style={{ flexShrink: 0, padding: '0 24px' }}>
              {submitting ? '⟳' : 'ADD'}
            </button>
          </form>

          {/* Structured form */}
          <div style={{ overflow: 'hidden', transition: 'max-height var(--bounce)', maxHeight: showForm ? '500px' : '0' }}>
            <form onSubmit={handleCreateStructured} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
               <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Structured Directive</h3>
              <input
                id="task-title-input"
                className="input"
                value={newTask.title}
                onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))}
                placeholder="Directive Title *"
                required
              />
              <input
                id="task-desc-input"
                className="input"
                value={newTask.description}
                onChange={(e) => setNewTask((p) => ({ ...p, description: e.target.value }))}
                placeholder="Details (Optional)"
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  id="task-due-input"
                  type="datetime-local"
                  className="input"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask((p) => ({ ...p, dueDate: e.target.value }))}
                />
                <select
                  id="task-priority-select"
                  className="input"
                  style={{ cursor: 'pointer' }}
                  value={newTask.priority}
                  onChange={(e) => setNewTask((p) => ({ ...p, priority: e.target.value }))}
                >
                  <option value="low">🟢 Routine Priority</option>
                  <option value="medium">🟡 Standard Priority</option>
                  <option value="high">🔴 Critical Priority</option>
                </select>
              </div>
              <button id="btn-submit-task" type="submit" disabled={submitting} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                {submitting ? 'INITIALIZING...' : 'SUBMIT DIRECTIVE'}
              </button>
            </form>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: 'var(--radius-full)', alignSelf: 'flex-start' }}>
          {['pending', 'done', 'all'].map((s) => (
            <button
              key={s}
              id={`filter-${s}`}
              onClick={() => setFilterStatus(s)}
              className="btn"
              style={{
                fontSize: '0.8rem',
                padding: '8px 24px',
                background: filterStatus === s ? 'var(--color-surface)' : 'transparent',
                color: filterStatus === s ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
                boxShadow: filterStatus === s ? 'var(--shadow-sm)' : 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
               {s}
            </button>
          ))}
        </div>

        {/* Task List: Bento Grid Pattern */}
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--color-primary)', padding: '40px', animation: 'pulse-gradient 2s infinite' }}>GATHERING MATRIX DATA...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="animate-slide-up" style={{ textAlign: 'center', color: 'var(--color-text-faint)', padding: '60px 40px', background: 'rgba(0,0,0,0.1)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--color-border)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}>✧</div>
            <p style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>
              {filterStatus === 'pending' ? 'No pending directives. Matrix is clear.' : `No ${filterStatus} directives detected.`}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {filteredTasks.map((task, idx) => {
              const dueDateInfo = getDueDateLabel(task.dueDate);
              const isDone = task.status === 'done';
              return (
                <div
                  key={task.id}
                  className="bento-card animate-slide-up"
                  style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    opacity: isDone ? 0.5 : 1,
                    animationDelay: `${idx * 0.05}s`
                  }}
                >
                   {/* Top Row: Checkbox & Actions */}
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        onClick={() => toggleTask(task.id, task.status)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          border: isDone ? 'none' : `2px solid ${PRIORITY_COLORS[task.priority]}`,
                          background: isDone ? 'var(--color-success)' : 'rgba(0,0,0,0.2)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          color: '#000',
                          fontSize: '14px',
                          transition: 'all var(--bounce)'
                        }}
                      >
                        {isDone ? '✓' : ''}
                      </button>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                         {task.fromChat && (
                            <span className="badge" style={{ background: 'var(--gradient-brand)', color: '#fff', fontSize: '0.6rem' }}>
                              AI GENERATED
                            </span>
                          )}
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="btn btn-ghost"
                            style={{ padding: '4px', color: 'var(--color-danger)' }}
                            title="Purge directive"
                          >
                            ✕
                          </button>
                      </div>
                   </div>

                   {/* Content */}
                   <div style={{ flex: 1 }}>
                     <h4 style={{
                        fontSize: '1.1rem',
                        margin: '0 0 8px',
                        textDecoration: isDone ? 'line-through' : 'none',
                        color: isDone ? 'var(--color-text-faint)' : 'var(--color-text)',
                        lineHeight: '1.4'
                      }}>
                        {task.title}
                     </h4>
                     {task.description && (
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.5' }}>
                           {task.description}
                        </p>
                     )}
                   </div>

                   {/* Footer Metadata */}
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                      <span style={{ fontSize: '0.75rem', color: PRIORITY_COLORS[task.priority], fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                        {PRIORITY_LABELS[task.priority]}
                      </span>
                      {dueDateInfo && (
                        <span style={{ fontSize: '0.75rem', color: dueDateInfo.color, fontFamily: 'var(--font-mono)' }}>
                          / {dueDateInfo.text}
                        </span>
                      )}
                   </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
