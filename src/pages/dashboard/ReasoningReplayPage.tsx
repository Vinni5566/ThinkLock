import { motion } from 'framer-motion';
import { BrainCircuit, TrendingUp, Activity, MessageSquare, FileText, Clock, ShieldCheck, AlertTriangle, Lock, CheckCircle2, Target, Lightbulb, Zap, XCircle } from 'lucide-react';
import { useSessionStore } from '@/store/useSessionStore';
import { useState, useEffect } from 'react';
import { SessionSelector } from '@/components/dashboard/SessionSelector';

const stepIcon: Record<string, any> = {
  problem: <Target className="w-3.5 h-3.5" />,
  attempt: <BrainCircuit className="w-3.5 h-3.5" />,
  hint: <Lightbulb className="w-3.5 h-3.5" />,
  unlock: <CheckCircle2 className="w-3.5 h-3.5" />,
  improved: <CheckCircle2 className="w-3.5 h-3.5" />,
  blocked: <XCircle className="w-3.5 h-3.5 text-destructive" />,
};

const ReasoningReplayPage = () => {
  const { activeSessionId, sessions, searchQuery } = useSessionStore();
  const session = sessions.find((s) => s.id === activeSessionId);
  const messages = session?.messages || [];
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  useEffect(() => {
    setSelectedMessage(null);
  }, [activeSessionId]);

  useEffect(() => {
    if (messages.length > 0 && !selectedMessage) {
      setSelectedMessage(messages[0]);
    }
  }, [messages, selectedMessage]);

  if (!activeSessionId) {
    return (
      <div className="p-6 h-[calc(100vh-3.5rem)] flex flex-col max-w-4xl mx-auto">
        <SessionSelector />
        <div className="flex-1 flex items-center justify-center p-8 text-center bg-muted/10 rounded-3xl border border-dashed border-border/50">
          <div className="max-w-md space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-black">No chat selected</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Select a chat from the dropdown above to see the reasoning replay.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Reasoning Replay</h1>
        <p className="text-muted-foreground text-sm">Review how your thinking evolved in this session.</p>
      </motion.div>

      <SessionSelector />

      <div className="space-y-4">
          <motion.div
            key={activeSessionId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="gradient-card rounded-2xl overflow-hidden border border-border/50"
          >
            <div className="p-5 border-b border-border flex items-center justify-between flex-wrap gap-3 bg-muted/20">
              <div>
                <h3 className="font-semibold text-sm truncate max-w-xs">{session?.question || 'Thinking Session'}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                   <span>ID: {activeSessionId.substring(0, 8)}...</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-0.5">Reasoning Score</div>
                <div className={`text-xl font-bold ${(session?.analytics?.avgReasoningScore || 0) >= 70 ? 'text-success' : (session?.analytics?.avgReasoningScore || 0) >= 50 ? 'text-warning' : 'text-destructive'}`}>
                  {session?.analytics?.avgReasoningScore || 0}
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm italic">
                  No reasoning steps recorded for this session yet.
                </div>
              ) : (
                messages.map((step, i) => {
                  const isUser = step?.role === 'user';
                  const status = step?.analysis?.status?.toLowerCase() || 'hint';
                  
                  return (
                    <div key={i} className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`mt-1 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${isUser ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                         {isUser ? <Clock className="w-4 h-4" /> : stepIcon[status as keyof typeof stepIcon] || stepIcon.hint}
                      </div>
                      <div className={`space-y-2 max-w-[85%] ${isUser ? 'text-right' : 'text-left'}`}>
                        <div className={`text-xs font-bold uppercase tracking-widest ${isUser ? 'text-primary' : 'text-muted-foreground'}`}>
                          {isUser ? 'User Reasoning Step' : `${status.toUpperCase()} Layer`}
                        </div>
                        <div className={`text-sm px-4 py-3 rounded-2xl border ${
                          isUser
                            ? 'bg-primary/5 border-primary/20 text-foreground'
                            : 'bg-card border-border text-muted-foreground'
                        }`}>
                          {step.content}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
      </div>
    </div>
  );
};

export default ReasoningReplayPage;
