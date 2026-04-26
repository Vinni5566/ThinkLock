export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  analysis?: {
    intent?: string;
    reasoningScore?: number;
    reasoningLevel?: string;
    status?: string;
    gamingRisk?: string;
    feedback?: string;
    conceptsDetected?: string[];
    reasoningSteps?: string[];
  };
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'problem' | 'attempt' | 'hint' | 'improvement' | 'concept' | 'step' | 'gaming' | 'gaming-msg';
}

export interface GraphEdge {
  from: string;
  to: string;
}

export interface SessionStats {
  reasoningScore: number;
  consistency: number;
  dependency: number;
}

export type BehaviorType = 'low_effort' | 'answer_seeking' | 'pattern_copying';

export interface Session {
  id?: string;
  _id?: string;
  title?: string;
  question?: string;
  status?: string;
  progress?: number;
  messages?: Message[];
  messageCount?: number;
  analytics?: {
    avgReasoningScore?: number;
    avgIndependenceScore?: number;
    aiRelianceRatio?: number;
    totalDetections?: number;
    blockedCount?: number;
    warningCount?: number;
    latestInsight?: string;
  };
  behavioralClassification?: string;
  behaviors?: {
    type: string;
    risk: 'low' | 'medium' | 'high';
    description: string;
  }[];
  stats?: SessionStats;
  createdAt?: string;
  lastMessageAt?: string;
  graph?: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
}

export const mockSession: Session = {
  id: "session-1",
  question: "What causes inflation in a modern economy?",
  status: 'partial',
  progress: 60,
  messages: [
    { 
      role: "user", 
      content: "I think inflation is caused by the government printing too much money.", 
      analysis: { status: "attempt" } 
    },
    { 
      role: "assistant", 
      content: "That is a key factor (monetary inflation). However, consider how the balance between total demand and total supply also plays a role. Have you heard of 'demand-pull' vs 'cost-push' inflation?", 
      analysis: { status: "hint" } 
    },
    { 
      role: "user", 
      content: "Demand-pull happens when there's too much demand for products, and cost-push is when production costs like wages or oil prices go up.", 
      analysis: { status: "improved" } 
    }
  ],
  graph: {
    nodes: [
      { id: "q", label: "Inflation Causes", type: "problem" },
      { id: "a1", label: "Monetary Factor", type: "attempt" },
      { id: "h1", label: "Demand/Supply Logic", type: "hint" },
      { id: "a2", label: "Demand-Pull & Cost-Push", type: "improvement" }
    ],
    edges: [
      { from: "q", to: "a1" },
      { from: "a1", to: "h1" },
      { from: "h1", to: "a2" }
    ]
  },
  analytics: {
    avgReasoningScore: 78,
    avgIndependenceScore: 65,
    aiRelianceRatio: 42,
    totalDetections: 1,
    blockedCount: 0,
    warningCount: 1,
    latestInsight: "Demonstrated strong structural understanding but relied on AI for final conclusion."
  },
  behaviors: [
    { type: "low_effort", risk: "low", description: "Initial response was brief but relevant." },
    { type: "answer_seeking", risk: "medium", description: "Requested direct confirmation before fully explaining logic." }
  ],
  createdAt: "2026-03-31"
};

export const mockHistory: Partial<Session>[] = [];
