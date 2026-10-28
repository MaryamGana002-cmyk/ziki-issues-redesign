export type StatusFilter =
  | 'inbox'
  | 'open'
  | 'inprogress'
  | 'done'
  | 'ready'
  | 'automerge'
  | 'all';

export type AttentionCategory = 'need-input' | 'design-feedback' | 'new-ideas';

export interface AttentionAction {
  id: string;
  label: string;
  primary: boolean;
  type?: 'review' | 'approve' | 'decline' | 'dismiss' | 'create';
}

export interface AttentionItem {
  id: string;
  category: AttentionCategory;
  title: string;
  count: number;
  desc: string;
  issueRef?: string;
  details?: string;
  actions: AttentionAction[];
}

export interface Agent {
  name: string;
  isOnline: boolean;
  status: 'offline' | 'working' | 'idle';
  currentTask?: string;
  currentIssueId?: number;
  currentStep: number;
  totalSteps: number;
  stepDescription: string;
  activitySummary: string;
}

export interface AgentSettings {
  notifyOnInput: boolean;
  autoApproveSafe: boolean;
  autonomyLevel: 'standard' | 'supervised' | 'full';
  maxConcurrentIssues: number;
}

export interface IssueItem {
  id: string;
  number: number;
  title: string;
  description: string;
  status: 'open' | 'inprogress' | 'done' | 'ready' | 'automerge';
  platform: 'web' | 'mobile' | 'api' | 'all';
  author: string;
  assignedAgent?: string;
  labels: string[];
  commentsCount: number;
  createdAt: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  // Extra human report details
  issueType?: 'bug' | 'feature' | 'performance' | 'security' | 'refactor';
  expectedBehavior?: string;
  actualBehavior?: string;
  reproSteps?: string;
  delegationScope?: DelegationScope;
  delegatedTaskId?: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  timestamp: number;
}

export type DelegationScope = 'diagnose' | 'propose' | 'implement' | 'review';

export type TaskStatus =
  | 'queued'
  | 'analysing'
  | 'needs_input'
  | 'working'
  | 'in_review'
  | 'completed';

export interface PlanStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'skipped';
}

export interface DecisionOption {
  id: string;
  label: string;
  desc: string;
  consequence: string;
  isRecommended?: boolean;
}

export interface HumanDecisionRequest {
  id: string;
  question: string;
  missingInfo: string;
  whyItMatters: string;
  options: DecisionOption[];
  isBlocked?: boolean;
  blockerReason?: string;
}

export interface TaskResultSummary {
  solution: string;
  changesSummary: string[];
  testResults: string;
  knownLimitations: string;
  filesTouched: string[];
}

export interface DelegatedTask {
  id: string;
  issueId: string;
  issueNumber: number;
  issueTitle: string;
  issueType: string;
  platform: string;
  scope: DelegationScope;
  status: TaskStatus;
  agentName: string;
  plan: PlanStep[];
  currentStepIndex: number;
  lastUpdate: string;
  nextExpectedAction: string;
  decisionNeeded?: HumanDecisionRequest;
  humanResolution?: {
    optionLabel: string;
    notes?: string;
    resolvedAt: string;
  };
  resultSummary?: TaskResultSummary;
  createdAt: string;
}
