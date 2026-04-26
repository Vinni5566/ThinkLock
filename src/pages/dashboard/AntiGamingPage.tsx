import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import { useSessionStore } from '@/store/useSessionStore';
import { ShieldCheck } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionSelector } from '@/components/dashboard/SessionSelector';

const riskColors: Record<string, { bg: string, border: string, text: string, icon: any }> = {
  high: { bg: 'bg-destructive/10', border: 'border-destructive/30', text: 'text-destructive', icon: ShieldAlert },
  medium: { bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning', icon: AlertTriangle },
  low: { bg: 'bg-primary/10', border: 'border-primary/30', text: 'text-primary', icon: Info },
};

const AntiGamingPage = () => {
  const { sessions, activeSessionId } = useSessionStore();
  
  // Aggregate stats from all sessions
  const totalDetections = sessions.reduce((acc, s) => acc + (s.analytics?.totalDetections || 0), 0);
  const totalBlocked = sessions.reduce((acc, s) => acc + (s.analytics?.blockedCount || 0), 0);
  const totalWarnings = sessions.reduce((acc, s) => acc + (s.analytics?.warningCount || 0), 0);
  const totalMessages = sessions.reduce((acc, s) => acc + (s.messageCount || 0), 0);
  const gamingScore = totalMessages > 0 ? Math.round((totalDetections / totalMessages) * 100) : 0;
  
  const hasData = totalDetections > 0;
  
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const lastUserMessage = [...(activeSession?.messages || [])].reverse().find(m => m.role === 'user');
  const lastAiMessage = [...(activeSession?.messages || [])].reverse().find(m => m.role === 'assistant');

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Anti-Gaming Governance</h1>
        <p className="text-muted-foreground text-sm">3-Level Cognitive Bypass Detection.</p>
      </motion.div>

      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-2">
          <TabsTrigger value="global">Global (User-Level)</TabsTrigger>
          <TabsTrigger value="session">Session (Chat-Level)</TabsTrigger>
          <TabsTrigger value="message">Message (Atomic)</TabsTrigger>
        </TabsList>

        <div className="mb-8 p-4 rounded-xl bg-muted/30 border border-border/50 text-xs text-muted-foreground flex gap-4">
          <div className="flex-1"><span className="font-bold text-foreground block mb-1">Global (User-Level)</span> Long-term metrics and behavioral trends across your entire account history.</div>
          <div className="w-px bg-border/50" />
          <div className="flex-1"><span className="font-bold text-foreground block mb-1">Session (Chat-Level)</span> Real-time context, topic focus, and current reasoning progress for active conversations.</div>
          <div className="w-px bg-border/50" />
          <div className="flex-1"><span className="font-bold text-foreground block mb-1">Message (Atomic)</span> Granular evaluation of your latest interaction, classifying intent and reasoning quality.</div>
        </div>

        <TabsContent value="global" className="space-y-8">
          {!hasData ? (
            <div className="h-full flex items-center justify-center p-8 text-center bg-muted/10 rounded-2xl">
              <div className="max-w-md space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-success/10 flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-3xl font-black tracking-tighter">Secure System</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  No cognitive bypass attempts detected. Your reasoning integrity is fully maintained.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Detections', value: totalDetections.toString(), color: 'text-foreground' },
          { label: 'Blocked', value: totalBlocked.toString(), color: 'text-destructive' },
          { label: 'Warnings', value: totalWarnings.toString(), color: 'text-warning' },
          { label: 'Gaming Risk', value: `${gamingScore}%`, color: gamingScore > 20 ? 'text-destructive' : 'text-success' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="gradient-card rounded-2xl p-5"
          >
            <div className="text-xs text-muted-foreground mb-1 font-medium">{stat.label}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* High Risk Sessions */}
      <div className="space-y-4">
        <h3 className="font-semibold text-sm">Flagged Reasoning Patterns</h3>
        {sessions.filter(s => (s.analytics?.totalDetections || 0) > 0).length === 0 ? (
          <div className="p-6 rounded-2xl border border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
            No flagged patterns across your history.
          </div>
        ) : (
          <div className="grid gap-4">
            {sessions.filter(s => (s.analytics?.totalDetections || 0) > 0).map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 rounded-2xl border border-destructive/20 bg-destructive/5"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{s.question}</div>
                    <div className="text-xs text-muted-foreground">{s.analytics?.totalDetections} bypass attempts detected</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-destructive border-destructive/30">High Risk</Badge>
              </motion.div>
            ))}
          </div>
        )}
      </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="session" className="space-y-8">
           <SessionSelector />
          {!activeSession ? (
            <div className="p-8 text-center bg-muted/10 rounded-2xl border border-dashed border-border/50">
              <p className="text-muted-foreground font-medium">Select a session from the dropdown above to see Session-Level bypass attempts.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="font-bold text-lg">Active Session Governance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="gradient-card rounded-2xl p-6 border border-border/50">
                  <div className="text-xs text-muted-foreground font-medium mb-1 uppercase">SESSION RISK SCORE</div>
                  <div className={`text-4xl font-black ${ (activeSession.analytics?.totalDetections || 0) > 0 ? 'text-destructive' : 'text-success'}`}>
                    {Math.min((activeSession.analytics?.totalDetections || 0) * 10, 100)}%
                  </div>
                </div>
                <div className="gradient-card rounded-2xl p-6 border border-border/50">
                  <div className="text-xs text-muted-foreground font-medium mb-1 uppercase">BYPASS ATTEMPTS</div>
                  <div className="text-4xl font-black">{activeSession.analytics?.totalDetections || 0}</div>
                </div>
                <div className="gradient-card rounded-2xl p-6 border border-border/50">
                  <div className="text-xs text-muted-foreground font-medium mb-1 uppercase">BLOCKED MESSAGES</div>
                  <div className="text-4xl font-black">{activeSession.analytics?.blockedCount || 0}</div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="message" className="space-y-8">
           <SessionSelector />
           {!lastUserMessage ? (
             <div className="p-8 text-center bg-muted/10 rounded-2xl border border-dashed border-border/50">
              <p className="text-muted-foreground font-medium">Send a message or select a chat above to view atomic-level anti-gaming triggers.</p>
            </div>
          ) : (() => {
            const lastUserMsg = [...(activeSession.messages || [])].reverse().find(m => m.role === 'user');
            const lastAssistantMsg = [...(activeSession.messages || [])].reverse().find(m => m.role === 'assistant');
            const analysis = lastAssistantMsg?.analysis || lastUserMsg?.analysis;
            
            const isBlocked = analysis?.status === 'blocked' || analysis?.gamingRisk === 'high';
            const isHint = analysis?.status === 'hint' || analysis?.gamingRisk === 'medium';

            return (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="gradient-card rounded-2xl p-8 border border-border/50 space-y-6">
                <h3 className="font-bold text-lg">Latest Interaction Audit</h3>
                <div className="bg-background/50 p-4 rounded-xl border border-border/50 mb-6 text-sm italic">
                  "{lastUserMsg?.content || lastAssistantMsg?.content}"
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className={`p-6 rounded-xl border ${
                     isBlocked ? 'bg-destructive/10 border-destructive/30 text-destructive' : 
                     isHint ? 'bg-warning/10 border-warning/30 text-warning' :
                     'bg-success/10 border-success/30 text-success'
                   }`}>
                      <div className="text-xs font-bold uppercase tracking-wider mb-2">Enforcement Action</div>
                      <div className="text-xl font-black mb-1">
                        {isBlocked ? 'Lockdown Triggered' : isHint ? 'Partial Redaction' : 'Passed Inspection'}
                      </div>
                      <p className="text-sm opacity-80">
                        {isBlocked ? 'The system detected a high-risk cognitive bypass attempt. Direct answers were withheld.' : 
                         isHint ? 'Detected moderate risk. Assistance was throttled to enforce independent reasoning.' :
                         'The message exhibits acceptable cognitive effort and reasoning depth.'}
                      </p>
                   </div>
                   <div className={`p-6 rounded-xl border bg-card text-muted-foreground`}>
                      <div className="text-xs font-bold uppercase tracking-wider mb-2">Detected Intent</div>
                      <div className="text-xl font-black mb-1 capitalize text-foreground">
                        {isBlocked ? 'Bypass Attempt' : isHint ? 'Answer Seeking' : (analysis?.intent || 'Standard Interaction')}
                      </div>
                      <p className="text-sm">
                        {isBlocked ? 'Pattern matches high-confidence cognitive gaming signatures.' :
                         isHint ? 'User appears to be fishing for solutions rather than explaining logic.' :
                         analysis?.intent === 'problem-solving' ? 'Interaction shows genuine attempt to understand concepts.' :
                         'The system parsed this input as a standard interaction with no malicious formatting.'}
                      </p>
                   </div>
                </div>
              </motion.div>
            );
          })()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AntiGamingPage;
