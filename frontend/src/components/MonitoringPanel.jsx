import { useEffect } from 'react';

export default function MonitoringPanel({ taskHook }) {
  const { tasks, fetchTasks, loading } = taskHook;

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Derived stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  
  const overdueTasks = tasks.filter(
    t => t.status === 'pending' && t.dueDate && new Date(t.dueDate) < new Date()
  ).length;

  const highPriority = tasks.filter(t => t.priority === 'high' && t.status === 'pending').length;

  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative' }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute', bottom: '10%', left: '10%',
        width: '400px', height: '400px', background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
        opacity: 0.1, pointerEvents: 'none', zIndex: 0
      }}/>

      {/* Header */}
      <div className="glass" style={{
        padding: '0 32px',
        height: 'var(--header-h)',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--color-border)',
        flexShrink: 0,
        zIndex: 10,
        boxShadow: 'none'
      }}>
        <h2 style={{ fontSize: '1.2rem', margin: 0, fontFamily: 'var(--font-display)' }}>System Monitoring Dashboard</h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', zIndex: 1 }}>
        {loading ? (
           <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--color-primary-light)', animation: 'pulse-gradient 2s infinite' }}>
             ANALYZING SYSTEM METRICS...
           </div>
        ) : (
          <>
            {/* Main Progress Bar */}
            <div className="bento-card animate-slide-up" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', margin: 0 }}>Overall Task Completion</h3>
                <span className="text-gradient" style={{ fontSize: '2rem', fontWeight: '700', fontFamily: 'var(--font-display)' }}>
                  {progressPercent}%
                </span>
              </div>
              <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-full)', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}>
                <div style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  background: 'var(--gradient-brand)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: 'var(--glow-primary)'
                }}/>
              </div>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              
              <MetricCard 
                title="Total Directives" 
                value={totalTasks} 
                icon="📊" 
                delay={1} 
              />
              
              <MetricCard 
                title="Pending / Active" 
                value={pendingTasks} 
                icon="⏳" 
                color="var(--color-warning)" 
                delay={2} 
              />
              
              <MetricCard 
                title="Overdue" 
                value={overdueTasks} 
                icon="⚠️" 
                color="var(--color-danger)" 
                delay={3} 
              />
              
              <MetricCard 
                title="Critical Priority" 
                value={highPriority} 
                icon="🔴" 
                color="var(--color-danger)" 
                delay={4} 
              />
            </div>

            {/* Recent Activity List (Dummy/Computed from Tasks) */}
            <div className="glass-panel animate-slide-up stagger-5" style={{ padding: '32px', borderRadius: 'var(--radius-xl)' }}>
               <h3 style={{ fontSize: '1rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px' }}>
                 Recent Task Status
               </h3>
               {tasks.slice(0, 5).map(task => (
                 <div key={task.id} style={{
                   display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                   padding: '16px 0', borderBottom: '1px solid var(--color-border)'
                 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: task.status === 'done' ? 'var(--color-success)' : 'var(--color-warning)',
                        boxShadow: `0 0 8px ${task.status === 'done' ? 'var(--color-success)' : 'var(--color-warning)'}`
                      }}/>
                      <span style={{ fontSize: '0.95rem', textDecoration: task.status === 'done' ? 'line-through' : 'none', color: task.status === 'done' ? 'var(--color-text-faint)' : 'var(--color-text)' }}>
                        {task.title}
                      </span>
                   </div>
                   <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', fontSize: '0.7rem' }}>
                     {task.priority.toUpperCase()}
                   </span>
                 </div>
               ))}
               {tasks.length === 0 && (
                 <p style={{ color: 'var(--color-text-faint)' }}>No recent activity found.</p>
               )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color = 'var(--color-text)', delay }) {
  return (
    <div className={`bento-card animate-slide-up stagger-${delay}`} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
           width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)',
           display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
           border: '1px solid rgba(255,255,255,0.05)'
        }}>
          {icon}
        </div>
      </div>
      <div>
         <h4 style={{ fontSize: '2.5rem', margin: '0', fontFamily: 'var(--font-display)', color, lineHeight: '1' }}>
           {value}
         </h4>
         <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '8px 0 0 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
           {title}
         </p>
      </div>
    </div>
  );
}
