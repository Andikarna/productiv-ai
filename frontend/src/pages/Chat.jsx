import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import TaskPanel from '../components/TaskPanel';
import MonitoringPanel from '../components/MonitoringPanel';
import { ChatProvider } from '../context/ChatContext';
import { useTask } from '../hooks/useTask';

// Inner component that uses task hook (needs to be inside provider)
function ChatLayout({ theme, onToggleTheme }) {
  const [activeView, setActiveView] = useState('chat');
  const taskHook = useTask();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      {/* Main content */}
      <main style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Chat View */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'opacity 0.2s ease',
          opacity: activeView === 'chat' ? 1 : 0,
          pointerEvents: activeView === 'chat' ? 'all' : 'none',
          position: activeView === 'chat' ? 'relative' : 'absolute',
          width: '100%',
          height: '100%',
        }}>
          <ChatWindow tasks={taskHook.tasks} />
        </div>

        {/* Tasks View */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'opacity 0.2s ease',
          opacity: activeView === 'tasks' ? 1 : 0,
          pointerEvents: activeView === 'tasks' ? 'all' : 'none',
          position: activeView === 'tasks' ? 'relative' : 'absolute',
          width: '100%',
          height: '100%',
        }}>
          {/* Pass hook values down via context-like pattern */}
          <TaskPanel taskHook={taskHook} />
        </div>

        {/* Monitoring View */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'opacity 0.2s ease',
          opacity: activeView === 'monitoring' ? 1 : 0,
          pointerEvents: activeView === 'monitoring' ? 'all' : 'none',
          position: activeView === 'monitoring' ? 'relative' : 'absolute',
          width: '100%',
          height: '100%',
        }}>
          <MonitoringPanel taskHook={taskHook} />
        </div>
      </main>
    </div>
  );
}

export default function Chat({ theme, onToggleTheme }) {
  return (
    <ChatProvider>
      <ChatLayout theme={theme} onToggleTheme={onToggleTheme} />
    </ChatProvider>
  );
}
