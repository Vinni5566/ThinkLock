import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { BrainCircuit } from 'lucide-react';
import { useSessionStore } from '@/store/useSessionStore';
import { SessionSelector } from '@/components/dashboard/SessionSelector';

const getLayoutedElements = (nodes: any[], edges: any[]): { layoutedNodes: Node[], layoutedEdges: Edge[] } => {
    return {
        layoutedNodes: nodes.map((node) => {
            let bg = 'hsl(215 28% 17%)';
            let color = '#fff';
            let border = '1px solid hsl(215 28% 30%)';
            let borderRadius = '12px';

            if (node.type === 'problem') { 
              bg = 'hsl(239 84% 67%)'; 
              border = 'none'; 
              borderRadius = '16px';
            } else if (node.type === 'attempt') { 
              bg = 'hsl(45 93% 47% / 0.15)'; 
              color = 'hsl(45 93% 57%)'; 
              border = '1px solid hsl(45 93% 47% / 0.4)'; 
            } else if (node.type === 'hint') { 
              bg = 'hsl(270 76% 60%)'; 
              border = 'none'; 
            } else if (node.type === 'concept') { 
              bg = 'hsl(280 80% 50% / 0.2)'; 
              color = 'hsl(280 80% 70%)'; 
              border = '1px solid hsl(280 80% 50% / 0.4)';
              borderRadius = '30px'; 
            } else if (node.type === 'step') { 
              bg = 'hsl(180 70% 40% / 0.15)'; 
              color = 'hsl(180 70% 60%)'; 
              border = '1px solid hsl(180 70% 40% / 0.3)';
              borderRadius = '8px';
            } else if (node.type === 'improvement') { 
              bg = 'hsl(142 71% 45% / 0.2)'; 
              color = 'hsl(142 71% 55%)'; 
              border = '1px solid hsl(142 71% 45% / 0.3)'; 
            } else if (node.type === 'gaming' || node.type === 'gaming-msg') {
              bg = 'hsl(0 84% 60% / 0.2)';
              color = 'hsl(0 84% 60%)';
              border = '1px solid hsl(0 84% 60% / 0.4)';
              borderRadius = node.type === 'gaming' ? '8px' : '12px';
            }

            return {
                id: node.id,
                position: node.position || { x: 0, y: 0 },
                data: { label: node.label },
                style: { 
                    background: bg, 
                    color, 
                    border, 
                    borderRadius, 
                    padding: '12px 20px', 
                    fontWeight: 600, 
                    fontSize: '12px', 
                    width: node.type === 'concept' ? 140 : 200, 
                    textAlign: 'center' as const 
                }
            };
        }),
        layoutedEdges: edges.map((edge) => ({
            id: `e${edge.from}-${edge.to}`,
            source: edge.from,
            target: edge.to,
            animated: edge.type === 'step',
            style: { stroke: edge.type === 'concept' ? 'hsl(280 80% 50% / 0.3)' : 'hsl(215 28% 40%)', strokeWidth: edge.type === 'concept' ? 1 : 2 }
        }))
    };
};

const Legend = () => (
  <div className="absolute top-4 left-4 bg-card/90 backdrop-blur p-4 rounded-xl border border-border shadow-lg z-10 flex flex-col gap-3 text-xs w-52">
    <div className="font-bold uppercase tracking-wider text-muted-foreground mb-1 text-[10px]">Cognitive Map Legend</div>
    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[hsl(239,84%,67%)]" /> Core Problem</div>
    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[hsl(45,93%,47%)] border border-[hsl(45,93%,47%)] opacity-80" /> User Reasoning</div>
    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-[30px] bg-[hsl(280,80,50,0.2)] border border-[hsl(280,80,50,0.4)]" /> Core Concept</div>
    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[hsl(180,70,40,0.15)] border border-[hsl(180,70,40,0.3)]" /> Reasoning Step</div>
    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[hsl(270,76%,60%)]" /> AI Guidance</div>
    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[hsl(142,71%,45%)] border border-[hsl(142,71%,45%)] opacity-80" /> Breakthrough</div>
    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-[hsl(0,84%,60%,0.2)] border border-[hsl(0,84%,60%,0.4)]" /> Gaming Detected</div>
  </div>
);

const ThinkingGraphPage = () => {
  const { activeSessionId, sessions } = useSessionStore();
  const session = sessions.find(s => s.id === activeSessionId);
  const messages = session?.messages || [];

  const graphData = useMemo(() => {
    if (messages.length === 0) return null;

    const nodes: any[] = [];
    const edges: any[] = [];
    let verticalPos = 0;

    messages.forEach((msg, i) => {
      const msgId = `msg-${i}`;
      let type = 'attempt';
      
      // Crisp label: max 40 chars
      let label = msg.content.length > 40 
        ? msg.content.substring(0, 37).trim() + '...' 
        : msg.content;

      if (msg.role === 'user') {
        type = i === 0 ? 'problem' : 'attempt';
      } else {
        const state = msg.analysis?.status?.toLowerCase() || 'hint';
        type = state === 'unlock' ? 'improvement' : state === 'hint' ? 'hint' : 'attempt';
      }

      // Detect Gaming in this message
      const isGaming = msg.analysis?.gamingRisk === 'high';
      if (isGaming) {
        const gamingNodeId = `gaming-${i}`;
        nodes.push({
          id: gamingNodeId,
          label: '⚠️ GAMING DETECTED',
          type: 'gaming',
          position: { x: 500, y: verticalPos - 40 }
        });
        edges.push({ from: msgId, to: gamingNodeId, type: 'gaming' });
      }

      nodes.push({ 
        id: msgId, 
        label, 
        type: isGaming ? 'gaming-msg' : type, 
        position: { x: 250, y: verticalPos } 
      });

      // Add Concept Nodes for this message
      const concepts = msg.analysis?.conceptsDetected || [];
      if (concepts.length > 0) {
        concepts.forEach((concept, ci) => {
          const conceptId = `concept-${i}-${ci}`;
          nodes.push({
            id: conceptId,
            label: concept,
            type: 'concept',
            position: { x: 20, y: verticalPos + (ci * 60) - 30 }
          });
          edges.push({ from: msgId, to: conceptId, type: 'concept' });
        });
      }

      // Add Reasoning Steps for AI responses
      const steps = msg.analysis?.reasoningSteps || [];
      if (steps.length > 0) {
        steps.forEach((step, si) => {
          const stepId = `step-${i}-${si}`;
          nodes.push({
            id: stepId,
            label: step.length > 40 ? step.substring(0, 37) + '...' : step,
            type: 'step',
            position: { x: 480, y: verticalPos + (si * 70) + (isGaming ? 60 : 0) }
          });
          edges.push({ from: msgId, to: stepId, type: 'step' });
        });
        verticalPos += Math.max(steps.length * 80, 150);
      } else {
        verticalPos += 150;
      }

      if (i > 0) {
        edges.push({ from: `msg-${i - 1}`, to: msgId });
      }
    });

    return { nodes, edges };
  }, [messages]);

  const { nodes, edges } = useMemo(() => {
    if (!graphData) return { nodes: [], edges: [] };
    const { layoutedNodes, layoutedEdges } = getLayoutedElements(graphData.nodes, graphData.edges);
    return { nodes: layoutedNodes, edges: layoutedEdges };
  }, [graphData]);

  if (!activeSessionId || messages.length === 0) {
    return (
      <div className="p-6 h-[calc(100vh-3.5rem)] flex flex-col">
        <SessionSelector />
        <div className="flex-1 flex items-center justify-center p-8 text-center bg-muted/10 rounded-3xl border border-dashed border-border/50">
            <div className="max-w-md space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
                <BrainCircuit className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-black">{!activeSessionId ? 'No Session Selected' : 'Graph Initializing'}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
                {!activeSessionId 
                    ? 'Select a session from the dropdown above to view its thinking graph.'
                    : 'Your thinking graph will be constructed as you exchange messages in this session.'}
            </p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] relative p-6">
      <SessionSelector />
      
      <div className="flex-1 relative border border-border/50 rounded-3xl overflow-hidden shadow-inner bg-card/30">
        <Legend />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          attributionPosition="bottom-left"
          className="bg-background/20"
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="hsl(215 28% 17% / 0.5)" />
          <Controls className="!bg-card !border-border !rounded-xl !shadow-lg [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground" />
        </ReactFlow>
      </div>
    </div>
  );
};

export default ThinkingGraphPage;
