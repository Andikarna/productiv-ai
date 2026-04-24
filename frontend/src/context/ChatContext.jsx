import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { chatAPI } from '../services/api';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const abortRef = useRef(null);

  const loadHistory = useCallback(async () => {
    if (historyLoaded) return;
    try {
      const res = await chatAPI.getHistory(1, 50);
      const fetched = res.data.data || [];
      setMessages(fetched.map((m) => ({
        id: m._id,
        role: m.role,
        content: m.content,
        timestamp: m.createdAt,
      })));
      setHistoryLoaded(true);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  }, [historyLoaded]);

  const sendMessage = useCallback(async (text, image = null) => {
    const userMsg = {
      id: `local-${Date.now()}`,
      role: 'user',
      content: text,
      image: image, // Store image to show in UI
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await chatAPI.sendMessage(text, image);
      const aiMsg = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: res.data.message,
        timestamp: new Date().toISOString(),
        metadata: res.data.metadata,
      };
      setMessages((prev) => [...prev, aiMsg]);
      return { success: true, taskDetected: res.data.metadata?.taskDetected };
    } catch (err) {
      const errMsg = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ ${err.response?.data?.message || 'Sorry, something went wrong. Please try again.'}`,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errMsg]);
      return { success: false };
    } finally {
      setIsTyping(false);
    }
  }, []);

  const clearChat = useCallback(async () => {
    try {
      await chatAPI.clearHistory();
      setMessages([]);
      setHistoryLoaded(false);
    } catch (err) {
      console.error('Failed to clear chat:', err);
    }
  }, []);

  return (
    <ChatContext.Provider value={{ messages, isTyping, sendMessage, loadHistory, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};
