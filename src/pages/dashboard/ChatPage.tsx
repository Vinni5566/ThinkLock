import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Image, XCircle, AlertTriangle, CheckCircle2, Loader, MessageSquare, BrainCircuit, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { useAuthStore } from '@/store/useAuthStore';
import { LoginModal } from '@/components/auth/LoginModal';

import { useNavigate, useParams } from 'react-router-dom';
import { useSessionStore } from '@/store/useSessionStore';
import { createSession, USE_MOCK_DATA } from '@/lib/sessionService';
import { apiFetch } from '@/lib/apiClient';

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  mode?: "chat" | "blocked" | "hint" | "unlock" | string;
  intent?: "casual" | "question" | "learning" | string;
  reasoning_quality?: "none" | "low" | "medium" | "high" | string;
  feedback?: string;
  state?: string;
};

type SystemState = {
    mode: "chat" | "blocked" | "hint" | "unlock" | string;
    intent: "casual" | "question" | "learning" | string;
    reasoning_quality: "none" | "low" | "medium" | "high" | string;
    feedback: string;
    progress: number;
}

const modeConfig = {
  chat: { label: 'Chat', dot: '💬' },
  blocked: { label: 'Strict', dot: '🔴' },
  hint: { label: 'Guided', dot: '🟡' },
  unlock: { label: 'Unlock', dot: '🟢' },
};

const initialState: SystemState = {
    intent: null as any,
    mode: null as any,
    reasoning_quality: null as any,
    feedback: null as any,
    progress: 0,
};

const TypingIndicator = () => (
    <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-start"
    >
        <div className="max-w-lg rounded-2xl rounded-bl-sm px-4 py-3 border text-sm bg-muted/20">
            <div className="flex gap-1.5 items-center">
                <span className="text-xs font-medium text-muted-foreground">AI is thinking</span>
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground/80 animate-typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                </div>
            </div>
        </div>
    </motion.div>
);

const ChatPage = () => {
  const navigate = useNavigate();
  const { id: urlSessionId } = useParams();
  const { activeSessionId, sessions, updateSession, setActiveSessionId } = useSessionStore();
  
  const activeSession = sessions.find(s => s.id === activeSessionId);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemState, setSystemState] = useState<SystemState>(initialState);
  
  const [messageCount, setMessageCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 1279px)');
  
  const isLimitReached = !isLoggedIn && messageCount >= 3;

  // Sync URL ID with Store
  useEffect(() => {
    if (urlSessionId) {
      if (urlSessionId !== activeSessionId) {
        setActiveSessionId(urlSessionId);
      }
    } else {
      // If we are on /dashboard/chat but have an active session, clear it
      if (activeSessionId !== null) {
        setActiveSessionId(null);
      }
    }
  }, [urlSessionId, activeSessionId, setActiveSessionId]);

  useEffect(() => {
    if (activeSession && activeSession.messages) {
      const normalizedMessages: ChatMessage[] = (activeSession.messages || []).map(m => ({
        role: m.role as any,
        content: m.content || "",
        mode: (m.analysis?.status || 'chat').toLowerCase(),
        intent: m.analysis?.intent || 'learning',
        reasoning_quality: m.analysis?.reasoningLevel || 'medium'
      }));
      setMessages(normalizedMessages);
      
      // Update system state from the last assistant message if available
      const lastAssistantMsg = [...normalizedMessages].reverse().find(m => m.role === 'assistant');
      if (lastAssistantMsg) {
        setSystemState({
          intent: (lastAssistantMsg?.intent || 'learning').toString(),
          mode: (lastAssistantMsg?.mode || 'chat').toLowerCase(),
          reasoning_quality: (lastAssistantMsg?.reasoning_quality || 'medium').toString(),
          feedback: (lastAssistantMsg?.feedback || 'Reviewing reasoning patterns...').toString(),
          progress: typeof activeSession.progress === 'number' ? activeSession.progress : 0
        });
      } else {
        setSystemState(initialState);
      }
    } else {
      setMessages([]);
      setSystemState(initialState);
    }
  }, [activeSessionId, activeSession?.messages?.length]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userContent = input;
    setInput('');
    setIsLoading(true);

    let currentSessionId = activeSessionId;
    let isNewSession = !currentSessionId;

    if (isNewSession) {
      try {
        const newSession = await createSession(userContent);
        currentSessionId = newSession.id;
        
        // Optimistically put the user message into the new session in the store
        const { updateSession, setActiveSessionId } = useSessionStore.getState();
        updateSession(currentSessionId, {
            messages: [{ role: 'user', content: userContent }]
        });
        
        setActiveSessionId(currentSessionId);
        
        // Navigate immediately so the UI transitions to the dedicated chat view
        navigate(`/dashboard/session/${currentSessionId}`, { replace: true });
        
      } catch (err) {
        console.error("Failed to create session:", err);
        setIsLoading(false);
        return;
      }
    } else {
      // Normal optimistic update for existing chats
      setMessages((prev) => [...prev, { role: 'user', content: userContent }]);
    }

    if (USE_MOCK_DATA && currentSessionId) {
        updateSession(currentSessionId, {
            messages: [...(useSessionStore.getState().sessions.find(s => s?.id === currentSessionId)?.messages || []), { role: 'user', content: userContent, analysis: { status: 'attempt' } }]
        });
    }

    try {
      const response = await apiFetch('/api/chat/send', {
        method: 'POST',
        body: JSON.stringify({ 
          content: input, 
          sessionId: currentSessionId 
        }),
      });

      if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
      }

      const body = await response.json();
      if (!body.success || !body.data) throw new Error(body.message || "Operation failed");

      const rawStats = body.data.sessionStats;
      if (!rawStats) throw new Error("No stats returned from AI");

      const aiResponse = {
        role: 'assistant',
        content: rawStats.publicResponse || "Thinking...",
        mode: rawStats.status === 'IDLE' ? 'chat' : (rawStats.status?.toLowerCase() || 'chat'),
        intent: rawStats.intent || 'learning',
        reasoning_quality: rawStats.reasoningLevel || 'medium',
        feedback: rawStats.internalThought?.pattern || "Synthesizing reasoning patterns..."
      };

      setMessages((prev) => [...prev, aiResponse as ChatMessage]);
      setSystemState((prev) => ({
          intent: aiResponse.intent,
          mode: aiResponse.mode,
          reasoning_quality: aiResponse.reasoning_quality,
          feedback: aiResponse.feedback,
          progress: Math.min((prev.progress || 0) + 15, 100)
      }));

      if (currentSessionId) {
          const updatedSysState = { ...systemState, progress: Math.min((systemState.progress || 0) + 15, 100) };
          
          // Get current messages from store to ensure we don't miss any
          const sessionInStore = useSessionStore.getState().sessions.find(s => s?.id === currentSessionId);
          const existingMessages = sessionInStore?.messages || [];
          
          updateSession(currentSessionId, {
              messages: [
                  ...existingMessages,
                  { role: 'user', content: userContent },
                  { 
                    role: 'assistant', 
                    content: aiResponse.content, 
                    analysis: { 
                      status: aiResponse.mode,
                      intent: aiResponse.intent,
                      reasoningLevel: aiResponse.reasoning_quality,
                      feedback: aiResponse.feedback,
                      gamingRisk: rawStats.gamingRisk
                    } 
                  }
              ],
              progress: updatedSysState.progress,
              stats: {
                reasoningScore: rawStats.reasoningScore || 0,
                consistency: ((rawStats.reasoningScore || 0) + (rawStats.independenceScore || 0)) / 2,
                dependency: 100 - (rawStats.independenceScore || 0)
              },
              analytics: {
                avgReasoningScore: rawStats.reasoningScore || 0,
                avgIndependenceScore: ((rawStats.reasoningScore || 0) + (rawStats.independenceScore || 0)) / 2,
                aiRelianceRatio: 100 - (rawStats.independenceScore || 0)
              }
          });

          // Trigger a global refresh to update all tabs (Global, Session, Message)
          await useSessionStore.getState().fetchSessions();
      }

      if (!isLoggedIn) {
        const newCount = messageCount + 1;
        setMessageCount(newCount);
        if (newCount >= 3) {
          setTimeout(() => setIsModalOpen(true), 1000);
        }
      }

    } catch (error) {
      console.error("Failed to get response from AI", error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm having trouble connecting to my brain right now. Please try again in a moment.",
        mode: 'blocked',
        intent: 'question',
        reasoning_quality: 'low',
        feedback: 'Could not connect to the AI service.'
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const safeFormat = (val: any) => {
    if (typeof val !== 'string' || !val) return '';
    return val.charAt(0).toUpperCase() + val.slice(1);
  };

  const FeedbackPanel = () => (
    <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <div>
            <div className="text-xs text-muted-foreground mb-2 font-medium">INTENT</div>
            <div className="text-lg font-bold">{systemState.intent ? safeFormat(systemState.intent) : '---'}</div>
        </div>
        <div>
            <div className="text-xs text-muted-foreground mb-2 font-medium">MODE</div>
            <div className={`text-lg font-bold ${
                !systemState.mode ? 'text-muted-foreground' :
                systemState.mode === 'unlock' ? 'text-green-500' :
                systemState.mode === 'hint' ? 'text-yellow-500' :
                systemState.mode === 'blocked' ? 'text-red-500' :
                'text-blue-500'
            }`}>
                {systemState.mode ? safeFormat(systemState.mode) : '---'}
            </div>
        </div>
        
        {systemState.reasoning_quality && systemState.reasoning_quality !== 'none' && (
          <div>
              <div className="text-xs text-muted-foreground mb-2 font-medium">REASONING QUALITY</div>
              <div className={`text-lg font-bold ${
                  systemState.reasoning_quality === 'high' ? 'text-green-500' :
                  systemState.reasoning_quality === 'medium' ? 'text-yellow-500' :
                  systemState.reasoning_quality === 'low' ? 'text-red-500' :
                  'text-muted-foreground'
              }`}>
                  {safeFormat(systemState.reasoning_quality)}
              </div>
          </div>
        )}

        {systemState.feedback && (
          <div>
              <div className="text-xs text-muted-foreground mb-2 font-medium">AI FEEDBACK</div>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">{systemState.feedback}</p>
          </div>
        )}
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Chat Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mode Indicator & Progress */}
        <div className="px-4 lg:px-6 py-3 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-sm z-10 sticky top-0">
            <div className="flex items-center gap-4">
                {/* Mode Indicator & Back removed per user request */}
                <div className="hidden sm:flex items-center gap-3 pl-4 h-6">
                  <span className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Reasoning Progress</span>
                  <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${systemState.progress}%` }} 
                        className="h-full gradient-primary"
                    />
                  </div>
                  <span className="text-xs font-bold">{systemState.progress}%</span>
                </div>
            </div>
            {isMobile && (
                 <Drawer>
                    <DrawerTrigger asChild>
                        <Button variant="outline" size="sm">Feedback</Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Live Feedback</DrawerTitle>
                            <DrawerDescription>AI analysis of your reasoning.</DrawerDescription>
                        </DrawerHeader>
                        <div className="p-4">
                            <FeedbackPanel />
                        </div>
                    </DrawerContent>
                </Drawer>
            )}
        </div>

        {/* Messages */}
        <div ref={chatContainerRef} className={`flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 transition-all duration-500 ${isLimitReached ? 'blur-[2px] pointer-events-none opacity-60' : ''}`}>
          {messages.length === 0 && !isLoading && (
              <div className="h-full flex items-center justify-center text-center p-6 animate-in fade-in duration-700">
                  <div className="max-w-md space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                          <BrainCircuit className="w-8 h-8 text-primary" />
                      </div>
                      <h2 className="text-2xl font-black">Begin Thinking</h2>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                          Start by asking a question. You won't get answers immediately — <span className="text-foreground font-semibold">you'll earn them.</span>
                      </p>
                  </div>
              </div>
          )}
          
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {msg.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="chat-bubble-user max-w-md text-sm leading-relaxed shadow-sm">{msg.content}</div>
                </div>
              ) : (
                  <div className="flex justify-start">
                      <div className={`max-w-xl rounded-2xl rounded-bl-sm px-5 py-4 border text-sm shadow-sm ${
                          msg.role === 'assistant' && msg.mode === 'blocked' ? 'status-blocked' : msg.mode === 'hint' ? 'status-hint' : 'status-unlocked bg-card'
                      }`}>
                          <div className="flex items-center gap-2 mb-2">
                              {msg.mode === 'blocked' && <XCircle className="w-4 h-4 text-destructive" />}
                              {msg.mode === 'hint' && <AlertTriangle className="w-4 h-4 text-warning" />}
                              {(msg.mode === 'unlock' || msg.mode === 'improved' || !msg.mode) && <CheckCircle2 className="w-4 h-4 text-success" />}
                              <span className="text-xs font-bold tracking-wider uppercase opacity-80">
                                  {msg.mode === 'blocked' ? 'Response Blocked' : msg.mode === 'hint' ? 'Partial Guidance' : 'Guidance Unlocked'}
                              </span>
                          </div>
                          <p className="leading-relaxed opacity-90">{msg.content}</p>
                      </div>
                  </div>
              )}
            </motion.div>
          ))}
          {isLoading && <TypingIndicator />}
        </div>

        {/* Input */}
        <div className="p-4 lg:p-6 border-t border-border bg-background/80 backdrop-blur">
          <div className="flex gap-2 items-end">
            <Button variant="outline" size="icon" className="shrink-0 rounded-xl border-border h-11 w-11" disabled>
              <Image className="w-4 h-4" />
            </Button>
            <div className="flex-1 relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isLimitReached ? "Sign up to continue thinking" : isLoading ? "AI is evaluating your reasoning..." : "Explain your thinking..."}
                className="w-full h-11 rounded-xl border border-border bg-background px-4 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
                disabled={isLoading || isLimitReached}
              />
            </div>
            <Button onClick={handleSend} className="gradient-primary text-primary-foreground rounded-xl h-11 px-6" disabled={isLoading || !input.trim() || isLimitReached}>
              {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Right Panel — Thinking Feedback */}
      {!isMobile && (
        <div className="w-80 border-l border-border flex-col bg-card/50 hidden xl:flex">
            <div className="p-5 border-b border-border">
                <h3 className="font-semibold text-sm">Live Feedback</h3>
            </div>
            <FeedbackPanel />
        </div>
      )}
    </div>
  );
};

export default ChatPage;
