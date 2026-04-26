import { motion } from 'framer-motion';
import { useSessionStore } from '@/store/useSessionStore';
import { Activity, BrainCircuit, ShieldAlert, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionSelector } from '@/components/dashboard/SessionSelector';

const DependencyTrackerPage = () => {
  const { sessions, activeSessionId } = useSessionStore();
  const validSessions = sessions.filter(s => s.analytics && s.analytics.aiRelianceRatio !== undefined);
  const hasData = validSessions.length > 0;
  
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const sessionReliance = activeSession?.analytics?.aiRelianceRatio || 0;
  const lastUserMessage = [...(activeSession?.messages || [])].reverse().find(m => m.role === 'user');
  const lastAiMessage = [...(activeSession?.messages || [])].reverse().find(m => m.role === 'assistant');
  
  const avgDependency = hasData 
    ? Math.round(validSessions.reduce((acc, s) => acc + (s.analytics?.aiRelianceRatio || 0), 0) / validSessions.length) 
    : 0;
  const avgReasoning = hasData
    ? Math.round(validSessions.reduce((acc, s) => acc + (s.analytics?.avgReasoningScore || 0), 0) / validSessions.length)
    : 0;
  const independence = 100 - avgDependency;
  const trend = 0;

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Dependency Tracker</h1>
        <p className="text-muted-foreground text-sm">3-Level AI Reliance Analysis</p>
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
                  <Zap className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-black tracking-tighter">Independence Tracking</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Start a session to see how much you rely on AI versus your own cognitive effort.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="gradient-card rounded-2xl p-6 border border-border flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <BrainCircuit className="w-5 h-5 text-primary" />
            </div>
            {trend !== 0 && (
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trend < 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                {trend < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                {Math.abs(trend)}%
              </div>
            )}
          </div>
          <div>
            <div className="text-3xl font-black mb-1">{avgDependency}%</div>
            <div className="text-sm text-muted-foreground font-medium">Overall AI Reliance</div>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="gradient-card rounded-2xl p-6 border border-border flex flex-col justify-between md:col-span-2"
        >
          <h3 className="font-semibold text-sm mb-6">Cumulative Cognitive Load Balance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-2 font-medium">
                <span className="text-success">Independent Thought ({independence}%)</span>
                <span className="text-warning">AI Assisted ({avgDependency}%)</span>
              </div>
              <div className="w-full h-4 rounded-full flex overflow-hidden">
                <div className="bg-success transition-all duration-1000" style={{ width: `${independence}%` }} />
                <div className="bg-warning transition-all duration-1000" style={{ width: `${avgDependency}%` }} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/50">
              {independence > 50 
                ? "Your global independence score is healthy. You are successfully synthesizing insights across multiple topics."
                : "Your global AI dependency is high. The system will increase guidance strictness in future sessions."}
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.3 }}
         className="gradient-card rounded-2xl p-6 border border-border"
      >
        <div className="flex items-center gap-3 mb-6">
          <ShieldAlert className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Long-term Dependency Risks</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {avgDependency > 40 || validSessions.some(s => s.behavioralClassification === 'gaming-behavior') ? (
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="text-xs font-medium text-warning mb-2 uppercase tracking-wide">High Risk Area</div>
              <div className="font-semibold text-sm mb-1">Algorithmic Reliance</div>
              <p className="text-xs text-muted-foreground">
                {avgDependency > 60 ? "Critical dependency detected. Cognitive bypass patterns are established." : "Historical data shows a recurring pattern of high AI reliance in recent sessions."}
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Monitoring</div>
              <div className="font-semibold text-sm mb-1">No High Risks Detected</div>
              <p className="text-xs text-muted-foreground">Your cognitive load patterns are stable. Keep up the good work.</p>
            </div>
          )}

          {avgReasoning > 70 || independence > 60 ? (
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="text-xs font-medium text-success mb-2 uppercase tracking-wide">Healthy Area</div>
              <div className="font-semibold text-sm mb-1">Independent Synthesis</div>
              <p className="text-xs text-muted-foreground">You consistently establish high-level mental models independently.</p>
            </div>
          ) : (
             <div className="p-4 rounded-xl bg-card border border-border">
              <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Monitoring</div>
              <div className="font-semibold text-sm mb-1">Building Independence</div>
              <p className="text-xs text-muted-foreground">Continue engaging deeply with the material to build long-term independence.</p>
            </div>
          )}
        </div>
      </motion.div>
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
              <h3 className="font-bold mb-6 text-lg">Active Session Reliance</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-success">Independent Thought ({100 - sessionReliance}%)</span>
                    <span className="text-warning">AI Assisted ({sessionReliance}%)</span>
                  </div>
                  <div className="w-full h-4 rounded-full flex overflow-hidden">
                    <div className="bg-success transition-all duration-1000" style={{ width: `${100 - sessionReliance}%` }} />
                    <div className="bg-warning transition-all duration-1000" style={{ width: `${sessionReliance}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Classification</div>
                    <div className="font-semibold capitalize">{activeSession.behavioralClassification || 'Unclassified'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Total Detections</div>
                    <div className="font-semibold">{activeSession.analytics?.totalDetections || 0} Flags</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="message" className="space-y-8">
          <SessionSelector />
          {!activeSession ? (
             <div className="p-8 text-center bg-muted/10 rounded-2xl border border-dashed border-border/50">
              <p className="text-muted-foreground font-medium">Send a message or select a chat above to view atomic-level evaluation.</p>
            </div>
          ) : (() => {
            const lastUserMsg = [...(activeSession.messages || [])].reverse().find(m => m.role === 'user');
            const lastAssistantMsg = [...(activeSession.messages || [])].reverse().find(m => m.role === 'assistant');
            const analysis = lastAssistantMsg?.analysis || lastUserMsg?.analysis;
            
            if (!lastUserMsg && !lastAssistantMsg) return null;

            const isBlocked = analysis?.status === 'blocked' || analysis?.gamingRisk === 'high';
            const isWarning = analysis?.status === 'hint' || analysis?.reasoningLevel === 'none' || analysis?.reasoningLevel === 'low';

            return (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="gradient-card rounded-2xl p-8 border border-border/50 space-y-6">
                <h3 className="font-bold text-lg">Latest Message Evaluation</h3>
                <div className="bg-background/50 p-4 rounded-xl border border-border/50 mb-6 text-sm italic">
                  "{lastUserMsg?.content || lastAssistantMsg?.content}"
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card">
                   <ShieldAlert className={`w-6 h-6 ${isBlocked ? 'text-destructive' : isWarning ? 'text-warning' : 'text-success'}`} />
                   <div>
                      <div className="font-semibold">
                        {isBlocked ? 'Dependency Blocked' : isWarning ? 'Low Engagement Detected' : 'Healthy Engagement'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        The AI classified this intent as "{analysis?.intent || 'neutral'}" with a "{analysis?.reasoningLevel || 'none'}" reasoning quality.
                        {analysis?.reasoningLevel === 'high' ? ' Strong independent logic detected.' : 
                         analysis?.reasoningLevel === 'medium' ? ' Found balanced reliance and input.' : 
                         ' This interaction shows minimal independent reasoning effort.'}
                      </div>
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

export default DependencyTrackerPage;
