import { apiFetch } from '@/lib/apiClient';
import { useSessionStore } from '@/store/useSessionStore';
import { Session, Message, GraphNode, GraphEdge } from '@/lib/mockData';

export const USE_MOCK_DATA = false;

const generateId = () => Math.random().toString(36).substring(2, 9);

export const generateTitleFromMessage = (message: string) => {
  if (!message || message.trim() === '') return "New Reasoning Session";
  
  const codeBlocks = message.match(/```[\s\S]*?```/g);
  const textOnly = message.replace(/```[\s\S]*?```/g, '').trim();
  
  if (textOnly === '' && codeBlocks && codeBlocks.length > 0) {
    return "Code Discussion";
  }
  
  const fillers = new Set(["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "with", "is", "are", "was", "were", "i", "you", "we", "they", "he", "she", "it", "this", "that", "of", "can", "could", "would", "should", "how", "what", "why", "when", "where", "do", "does", "did"]);
  const words = textOnly.split(/\s+/).filter(w => !fillers.has(w.toLowerCase().replace(/[^a-z0-9]/g, '')));
  
  const selectedWords = words.slice(0, 8); // ~8 words
  if (selectedWords.length === 0) return textOnly.slice(0, 40) + "...";
  
  let title = selectedWords.join(' ');
  // Normalize casing (capitalize first letter)
  title = title.charAt(0).toUpperCase() + title.slice(1);
  return title.length > 50 ? title.slice(0, 47) + "..." : title;
};

export const createSession = async (firstMessage: string): Promise<Session> => {
  const response = await apiFetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({ question: generateTitleFromMessage(firstMessage) })
  });
  
  if (!response.ok) throw new Error("Failed to create session");
  const body = await response.json();
  
  const { addSession, setActiveSessionId } = useSessionStore.getState();
  const session = body.data || body; // Handle both wrapped and direct responses
  const id = session._id || session.id;
  
  addSession({ ...session, id });
  setActiveSessionId(id);
  return { ...session, id };
};

export const loadMessages = async (sessionId: string | null): Promise<Message[]> => {
  if (!sessionId) return [];
  const session = useSessionStore.getState().sessions.find(s => s?.id === sessionId);
  if (session?.messages?.length) return session.messages;

  try {
    const response = await apiFetch(`/api/session/${sessionId}/messages`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.messages || [];
  } catch (error) {
    console.error("Error loading messages:", error);
    return [];
  }
};

export const loadGraph = async (sessionId: string | null): Promise<{ nodes: GraphNode[], edges: GraphEdge[] } | null> => {
  if (!sessionId) return null;
  const session = useSessionStore.getState().sessions.find(s => s.id === sessionId);
  return session?.graph || null;
};

export const loadReplay = async (sessionId: string | null): Promise<Message[]> => {
  return loadMessages(sessionId);
};
