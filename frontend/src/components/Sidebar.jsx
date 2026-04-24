import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../hooks/useTask';
import { MessageSquare, LayoutList, Activity, Moon, Sun, PanelLeftClose, PanelLeftOpen, LogOut, Zap } from 'lucide-react';

const NAV_ITEMS = [
  { icon: <MessageSquare size={20} />, label: 'Chat Interface', id: 'chat' },
  { icon: <LayoutList size={20} />, label: 'Task Matrix', id: 'tasks' },
  { icon: <Activity size={20} />, label: 'Monitoring', id: 'monitoring' },
];

export default function Sidebar({ activeView, onViewChange, theme, onToggleTheme }) {
  const { user, logout } = useAuth();
  const { pendingCount, overdueCount } = useTask();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="glass-panel"
      style={{
        width: collapsed ? '80px' : 'var(--sidebar-w)',
        transition: 'var(--bounce)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        borderRight: '1px solid var(--color-border)',
        position: 'relative',
        flexShrink: 0,
        zIndex: 10,
        boxShadow: '4px 0 24px rgba(0,0,0,0.2)'
      }}
    >
      {/* Header / Logo */}
      <div style={{
        padding: collapsed ? '24px 0' : '32px 24px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <div className="animate-scale-in" style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'var(--gradient-brand)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          flexShrink: 0,
          boxShadow: 'var(--glow-primary)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <Zap size={24} color="#fff" />
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <h1 style={{ fontSize: '1.25rem', margin: 0, lineHeight: '1.1', whiteSpace: 'nowrap' }}>
              <span className="text-gradient">ProductiveAI</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)', margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.8 }}>
              v2.0 / 2026
            </p>
          </div>
        )}
      </div>

      {/* User Card */}
      {!collapsed && (
        <div className="animate-slide-up stagger-1" style={{
          margin: '20px 16px 8px',
          padding: '14px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--color-border)',
          backdropFilter: 'var(--blur-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--gradient-brand-hover)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontFamily: 'var(--font-display)',
              fontWeight: '800',
              fontSize: '1rem',
              flexShrink: 0,
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3)'
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '0.9rem', fontWeight: '600', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-faint)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)' }}>
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {NAV_ITEMS.map((item, i) => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            onClick={() => onViewChange(item.id)}
            className={`btn btn-ghost animate-slide-up stagger-${i+2}`}
            style={{
              width: '100%',
              justifyContent: collapsed ? 'center' : 'flex-start',
              background: activeView === item.id ? 'rgba(138, 43, 226, 0.15)' : 'transparent',
              color: activeView === item.id ? 'var(--color-primary-light)' : 'var(--color-text-muted)',
              borderColor: activeView === item.id ? 'rgba(138, 43, 226, 0.3)' : 'transparent',
              position: 'relative',
              padding: collapsed ? '14px' : '12px 16px',
              borderRadius: 'var(--radius-md)',
              boxShadow: activeView === item.id ? 'inset 0 0 12px rgba(138,43,226,0.1)' : 'none'
            }}
          >
            <span style={{ fontSize: '1.2rem', filter: activeView === item.id ? 'drop-shadow(0 0 8px var(--color-primary))' : 'none' }}>
              {item.icon}
            </span>
            {!collapsed && <span style={{ fontSize: '0.95rem', fontWeight: '500', fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>{item.label}</span>}
            
            {!collapsed && item.id === 'tasks' && pendingCount > 0 && (
              <span className={`badge ${overdueCount > 0 ? 'badge-danger' : 'badge-primary'}`} style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>
                {pendingCount}
              </span>
            )}
            
            {/* Active Indicator */}
            {activeView === item.id && (
              <div style={{
                position: 'absolute',
                left: 0, top: '50%', transform: 'translateY(-50%)',
                width: '4px', height: '20px',
                background: 'var(--color-accent)',
                borderRadius: '0 4px 4px 0',
                boxShadow: 'var(--glow-accent)'
              }}/>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Controls */}
      <div style={{
        padding: '16px 12px',
        borderTop: '1px solid rgba(255,255,255,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {/* Theme toggle */}
        <button
          id="btn-toggle-theme"
          onClick={onToggleTheme}
          className="btn btn-ghost"
          style={{ width: '100%', justifyContent: collapsed ? 'center' : 'flex-start', gap: '12px', borderRadius: 'var(--radius-md)' }}
          title="Toggle theme"
        >
          <span style={{ fontSize: '1.2rem', display: 'flex' }}>{theme === 'dark' ? <Moon size={20}/> : <Sun size={20}/>}</span>
          {!collapsed && <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-display)' }}>Theme: {theme === 'dark' ? 'Dark' : 'Light'}</span>}
        </button>

        {/* Collapse toggle */}
        <button
          id="btn-collapse-sidebar"
          onClick={() => setCollapsed((c) => !c)}
          className="btn btn-ghost"
          style={{ width: '100%', justifyContent: collapsed ? 'center' : 'flex-start', gap: '12px', borderRadius: 'var(--radius-md)' }}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <span style={{ fontSize: '1.2rem', display: 'flex' }}>{collapsed ? <PanelLeftOpen size={20}/> : <PanelLeftClose size={20}/>}</span>
          {!collapsed && <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-display)' }}>Collapse Panel</span>}
        </button>

        {/* Logout */}
        <button
          id="btn-logout"
          onClick={logout}
          className="btn btn-ghost"
          style={{ width: '100%', justifyContent: collapsed ? 'center' : 'flex-start', gap: '12px', color: 'var(--color-danger)', borderRadius: 'var(--radius-md)' }}
        >
          <span style={{ fontSize: '1.2rem', display: 'flex' }}><LogOut size={20}/></span>
          {!collapsed && <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-display)', fontWeight: '600' }}>Disconnect</span>}
        </button>
      </div>
    </aside>
  );
}
