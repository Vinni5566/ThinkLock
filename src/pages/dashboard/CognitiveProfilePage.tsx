import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockSession } from '@/lib/mockData';

const performanceData: any[] = [];
const dependencyData: any[] = [];

interface Insight {
  label: string;
  text: string;
  severity: 'warning' | 'success' | 'destructive';
}

const insights: Insight[] = [];

import { useSessionStore } from '@/store/useSessionStore';
import { BrainCircuit, TrendingUp, Activity, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionSelector } from '@/components/dashboard/SessionSelector';

const CognitiveProfilePage = () => {
  const { sessions, activeSessionId } = useSessionStore();
  const validSessions = sessions.filter(s => s.analytics && s.analytics.avgReasoningScore !== undefined);
  const hasData = validSessions.length > 0;
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const lastMessage = activeSession?.messages?.slice(-1)[0];
  
  // Calculate Global Averages
  const avgReasoning = hasData ? Math.round(validSessions.reduce((acc, s) => acc + (s.analytics?.avgReasoningScore || 0), 0) / validSessions.length) : 0;
  const avgConsistency = hasData ? Math.round(validSessions.reduce((acc, s) => acc + (s.analytics?.avgIndependenceScore || 0), 0) / validSessions.length) : 0;
  const avgDependency = hasData ? Math.round(validSessions.reduce((acc, s) => acc + (s.analytics?.aiRelianceRatio || 0), 0) / validSessions.length) : 0;

  // Generate Chart Data from Sessions
  const performanceData = [...validSessions].reverse().map((s, i) => ({
    name: `Session ${i + 1}`,
    score: s.analytics?.avgReasoningScore || 0
  }));

  const dependencyData = [...validSessions].reverse().map((s, i) => ({
    name: `Session ${i + 1}`,
    dependency: s.analytics?.aiRelianceRatio || 0,
    effort: 100 - (s.analytics?.aiRelianceRatio || 0)
  }));

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Cognitive Profile</h1>
        <p className="text-muted-foreground text-sm">3-Level Intelligence Architecture</p>
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
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-black tracking-tighter">No Profile Data</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Your global cognitive evolution will be tracked here once you complete sessions.
                </p>
              </div>
            </div>
          ) : (
            <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="gradient-card rounded-2xl p-8 text-center border border-border/50"
      >
        <div className="text-sm text-muted-foreground mb-2 font-medium tracking-wide">AGGREGATED REASONING SCORE</div>
        <div className="text-7xl font-black gradient-primary-text mb-3">{avgReasoning}</div>
        <div className="text-sm text-muted-foreground">Cumulative baseline established across {sessions.length} sessions</div>
        <div className="w-full max-w-md mx-auto h-3 rounded-full bg-muted mt-6">
          <div className="h-full rounded-full gradient-primary transition-all duration-1000" style={{ width: `${avgReasoning}%` }} />
        </div>

        <div className="grid grid-cols-2 max-w-sm mx-auto gap-4 mt-8 pt-6 border-t border-border/50">
          <div>
            <div className="text-xs text-muted-foreground mb-1 font-medium tracking-wide">AVG CONSISTENCY</div>
            <div className="text-2xl font-bold">{avgConsistency}%</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1 font-medium tracking-wide">AVG INDEPENDENCE</div>
            <div className="text-2xl font-bold">{100 - avgDependency}%</div>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="gradient-card rounded-2xl p-6"
        >
          <h3 className="font-semibold mb-6 text-sm">Global Performance Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(239 84% 67%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(239 84% 67%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 28% 17% / 0.5)" />
              <XAxis dataKey="name" hide />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(215 20% 65%)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(222 47% 11%)', border: '1px solid hsl(215 28% 17%)', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="score" stroke="hsl(239 84% 67%)" fill="url(#scoreGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="gradient-card rounded-2xl p-6"
        >
          <h3 className="font-semibold mb-6 text-sm">Dependency Drift</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={dependencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 28% 17% / 0.5)" />
              <XAxis dataKey="name" hide />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(215 20% 65%)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(222 47% 11%)', border: '1px solid hsl(215 28% 17%)', borderRadius: '12px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="dependency" stroke="hsl(0 84% 60%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="effort" stroke="hsl(142 71% 45%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-6 mt-4 justify-center">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-3 h-0.5 bg-destructive rounded" /> AI Dependency
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-3 h-0.5 bg-success rounded" /> Thinking Effort
            </div>
          </div>
        </motion.div>
      </div>

      {/* Insights */}
      <div>
        <h3 className="font-semibold mb-4 text-sm">Cross-Session Insights</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { 
              label: 'Long-term Pattern', 
              text: avgReasoning > 75 
                ? 'Independent reasoning depth shows positive correlation with session length. Your focus improves as you go.' 
                : avgReasoning > 40
                ? 'Reasoning depth is consistent but shows room for expansion in longer sessions.'
                : 'Reasoning patterns are currently fragmented. Try engaging in deeper multi-turn dialogues.',
              severity: avgReasoning > 75 ? 'success' : 'warning' as any
            },
            { 
              label: 'Improvement Area', 
              text: avgDependency > 50
                ? 'AI Reliance is high. Try to solve the logic gates independently before requesting hints.'
                : avgConsistency < 60
                ? 'Consistency tends to fluctuate. Focus on maintaining a steady reasoning pace.'
                : 'Cognitive resilience is high. You are successfully maintaining independence across sessions.',
              severity: (avgDependency > 50 || avgConsistency < 60) ? 'warning' : 'success' as any
            },
          ].map((insight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className={`rounded-2xl border p-5 ${
                insight.severity === 'destructive' ? 'status-blocked' :
                insight.severity === 'warning' ? 'status-hint' : 'status-unlocked'
              }`}
            >
              <div className="text-xs font-bold tracking-wider uppercase mb-1">{insight.label}</div>
              <p className="text-sm leading-relaxed">{insight.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="session" className="space-y-8">
          <SessionSelector />
          {!activeSession ? (
            <div className="p-8 text-center bg-muted/10 rounded-2xl border border-dashed border-border/50">
              <p className="text-muted-foreground font-medium">Select a session from the dropdown above to see Session-Level context.</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="gradient-card rounded-2xl p-8 border border-border/50">
              <h3 className="font-bold mb-4 text-lg">Active Session Context</h3>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-1">CURRENT TOPIC</div>
                  <div className="font-semibold text-lg">{activeSession.question}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-1">SESSION STATUS</div>
                  <div className="font-semibold text-lg capitalize">{activeSession.status || 'Active'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-1">REASONING SCORE</div>
                  <div className="font-bold text-2xl text-primary">{activeSession.analytics?.avgReasoningScore || activeSession.stats?.reasoningScore || 0}%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium mb-1">MESSAGES</div>
                  <div className="font-bold text-2xl">{activeSession.messages?.length || 0}</div>
                </div>
              </div>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="message" className="space-y-8">
          <SessionSelector />
          {!lastMessage ? (
             <div className="p-8 text-center bg-muted/10 rounded-2xl border border-dashed border-border/50">
              <p className="text-muted-foreground font-medium">Send a message or select a chat above to see the atomic-level breakdown.</p>
            </div>
          ) : (() => {
            const lastUserMsg = [...(activeSession.messages || [])].reverse().find(m => m.role === 'user');
            const lastAssistantMsg = [...(activeSession.messages || [])].reverse().find(m => m.role === 'assistant');
            const analysis = lastAssistantMsg?.analysis || lastUserMsg?.analysis;
            const reasoningScore = analysis?.reasoningScore || activeSession.analytics?.avgReasoningScore || activeSession.stats?.reasoningScore || 0;

            return (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="gradient-card rounded-2xl p-8 border border-border/50 space-y-6">
                <h3 className="font-bold text-lg">Latest Atomic Unit (Message-Level)</h3>
                <div className="bg-background/50 p-4 rounded-xl border border-border/50 mb-6 text-sm italic">
                  "{lastUserMsg?.content || lastAssistantMsg?.content}"
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   <div>
                      <div className="text-xs text-muted-foreground mb-2 font-medium">INTENT CLASSIFICATION</div>
                      <div className="text-lg font-bold capitalize">{analysis?.intent || 'Question'}</div>
                  </div>
                  <div>
                      <div className="text-xs text-muted-foreground mb-2 font-medium">MODE (GOVERNANCE)</div>
                      <div className="text-lg font-bold capitalize">{analysis?.status || 'Chat'}</div>
                  </div>
                  <div>
                      <div className="text-xs text-muted-foreground mb-2 font-medium">REASONING QUALITY</div>
                      <div className="text-lg font-bold capitalize">{analysis?.reasoningLevel || 'Medium'}</div>
                  </div>
                  <div>
                      <div className="text-xs text-muted-foreground mb-2 font-medium">REASONING SCORE</div>
                      <div className="text-xl font-bold text-primary">{reasoningScore}%</div>
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

export default CognitiveProfilePage;
