import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Session, mockSession } from '@/lib/mockData';
import { apiFetch } from '@/lib/apiClient';

// We'll initialize our mock DB with the one full mock session we have,
// plus maybe skeletons for the history items.
const initialMockSessions: Session[] = [];

interface SessionState {
  activeSessionId: string | null;
  sessions: Session[];
  searchQuery: string;
  setActiveSessionId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  addSession: (session: Session) => void;
  updateSession: (id: string, partial: Partial<Session>) => void;
  fetchSessions: () => Promise<void>;
  fetchMessages: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  clearAllSessions: () => Promise<void>;
}

export const useSessionStore = create<SessionState>()(
  (set, get) => ({
    activeSessionId: null,
    sessions: initialMockSessions,
    searchQuery: '',
    setActiveSessionId: (id) => {
      set({ activeSessionId: id });
      if (id) {
        get().fetchMessages(id);
      }
    },
    setSearchQuery: (query) => set({ searchQuery: query }),
    addSession: (session) => set((state) => ({ 
      sessions: [session, ...state.sessions] 
    })),
    updateSession: (id, partial) => set((state) => ({
      sessions: state.sessions.map(s => s.id === id ? { ...s, ...partial } : s)
    })),
    fetchSessions: async () => {
      try {
        const response = await apiFetch('/api/session');
        if (!response.ok) {
          console.error("Failed to fetch sessions: Server returned", response.status);
          return;
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          console.warn("fetchSessions: Expected array but received:", data);
          set({ sessions: [] });
          return;
        }

        const currentSessions = get().sessions;
        const normalizedData = data.filter(Boolean).map((s: any) => {
          const id = String(s._id || s.id);
          const existing = currentSessions.find(cs => String(cs?.id) === id);
          return {
            ...s,
            id,
            question: s.title || s.question || "Untitled Session",
            createdAt: s.lastMessageAt ? new Date(s.lastMessageAt).toLocaleDateString() : new Date().toLocaleDateString(),
            messages: s.messages || existing?.messages || [],
            analytics: s.analytics || existing?.analytics || s.sessionStats || s.stats || existing?.analytics,
            stats: s.stats || s.sessionStats || s.analytics || existing?.stats
          };
        });

        set({ sessions: normalizedData });
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      }
    },
    clearAllSessions: async () => {
      console.log('Clearing all sessions');
      set({ sessions: [], activeSessionId: null });
      
      try {
        const response = await apiFetch('/api/session', {
          method: 'DELETE'
        });
        if (!response.ok) {
          console.warn("Failed to clear history on server, but cleared locally.");
        }
      } catch (error) {
        console.error("Failed to clear history:", error);
      }
    },
    fetchMessages: async (sessionId: string) => {
      try {
        const response = await apiFetch(`/api/session/${sessionId}/messages`);
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.messages)) {
            get().updateSession(sessionId, { messages: data.messages });
          } else {
            console.warn("fetchMessages: Expected array but received:", data);
            get().updateSession(sessionId, { messages: [] });
          }
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    },
    deleteSession: async (sessionId: string) => {
      if (!sessionId) return;
      const idStr = String(sessionId);
      
      console.log(`Deleting session: ${idStr}`);

      // Optimistic update
      set((state) => ({
        sessions: state.sessions.filter(s => String(s.id) !== idStr && String(s._id) !== idStr),
        activeSessionId: state.activeSessionId === idStr ? null : state.activeSessionId
      }));

      try {
        const response = await apiFetch(`/api/session/${idStr}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          console.error(`Failed to delete session ${idStr} on server:`, response.status);
          // Optional: Re-fetch if it failed to stay in sync
          get().fetchSessions();
        }
      } catch (error) {
        console.error("Failed to delete session:", error);
        get().fetchSessions();
      }
    }
  })
);
