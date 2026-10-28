import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Wrench,
  ChevronRight,
  Bot,
  Sparkles
} from 'lucide-react';
import {
  StatusFilter,
  AttentionCategory,
  AttentionItem,
  IssueItem,
  ToastMessage,
  AgentSettings,
  DelegatedTask,
  DelegationScope
} from './types';
import { INITIAL_ATTENTION_ITEMS, SAMPLE_ISSUES, INITIAL_DELEGATED_TASK } from './data/mockData';
import { TopBar } from './components/TopBar';
import { Header } from './components/Header';
import { AgentAttentionSection } from './components/AgentAttentionSection';
import { AgentSettingsPanel } from './components/AgentSettingsPanel';
import { IssuesList } from './components/IssuesList';
import { AttentionItemModal } from './components/AttentionItemModal';
import { IssueDetailModal } from './components/IssueDetailModal';
import { ToastContainer } from './components/ToastContainer';
import { ReportAndDelegateModal } from './components/ReportAndDelegateModal';
import { DelegatedTaskExecutionView } from './components/DelegatedTaskExecutionView';

export const App: React.FC = () => {
  // Theme state: support light & dark modes with header toggle (default: light)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('ziki-theme');
      return (saved as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('ziki-theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    showToast(theme === 'light' ? 'Switched to dark mode' : 'Switched to light mode');
  };

  // Navigation & Filter state
  const [currentStatusTab, setCurrentStatusTab] = useState<StatusFilter>('open');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'web' | 'mobile' | 'api'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'priority' | 'comments'>('newest');

  // Agent state
  const [agentOnline, setAgentOnline] = useState(true);
  const [agentName] = useState('Contributor Alpha');
  const [agentSubStatus, setAgentSubStatus] = useState(
    'Contributor Alpha · Investigating Issue #400 (auth timeout)'
  );
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Attention Items state
  const [attentionItems, setAttentionItems] = useState<AttentionItem[]>(INITIAL_ATTENTION_ITEMS);
  const [activeAttentionTab, setActiveAttentionTab] = useState<AttentionCategory>('need-input');

  // Issues repository state
  const [issues, setIssues] = useState<IssueItem[]>(SAMPLE_ISSUES);

  // Delegated Tasks state (Stage C, D, E, F, G)
  const [delegatedTasks, setDelegatedTasks] = useState<DelegatedTask[]>([INITIAL_DELEGATED_TASK]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(INITIAL_DELEGATED_TASK.id);

  // Modals state
  const [selectedAttentionItem, setSelectedAttentionItem] = useState<AttentionItem | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedIssueDetail, setSelectedIssueDetail] = useState<IssueItem | null>(null);

  // Toast feedback state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, timestamp: Date.now() }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Active task for execution view
  const activeDelegatedTask = useMemo(() => {
    return delegatedTasks.find((t) => t.id === selectedTaskId) || delegatedTasks[0];
  }, [delegatedTasks, selectedTaskId]);

  // Attention Counts computed per category
  const attentionCounts: Record<AttentionCategory, number> = useMemo(() => {
    return {
      'need-input': attentionItems.filter((i) => i.category === 'need-input').length,
      'design-feedback': attentionItems.filter((i) => i.category === 'design-feedback').length,
      'new-ideas': attentionItems.filter((i) => i.category === 'new-ideas').length,
    };
  }, [attentionItems]);

  const totalAttentionCount =
    attentionCounts['need-input'] +
    attentionCounts['design-feedback'] +
    attentionCounts['new-ideas'];

  // Toggle Agent state
  const handleToggleAgent = () => {
    const willBeOnline = !agentOnline;
    setAgentOnline(willBeOnline);

    if (willBeOnline) {
      setAgentSubStatus(`${agentName} · Fixing issue #400 (auth timeout)`);
      showToast(`Agent activated. ${agentName} is now online.`);
    } else {
      setAgentSubStatus('Contributor Alpha is ready to help. Start the agent to begin working on issues.');
      showToast('Agent paused.');
    }
  };

  // Handle attention item action
  const handleAttentionAction = (item: AttentionItem, actionLabel: string) => {
    if (actionLabel.toLowerCase().includes('review') || actionLabel.toLowerCase().includes('give feedback')) {
      setSelectedAttentionItem(item);
      return;
    }
    executeAttentionResolution(item, actionLabel);
  };

  const executeAttentionResolution = (
    item: AttentionItem,
    actionLabel: string,
    notes?: string
  ) => {
    showToast(`${actionLabel}: ${item.title}${notes ? ` ("${notes}")` : ''}`);

    if (actionLabel.toLowerCase().includes('create')) {
      const newIssueNum = Math.floor(Math.random() * 50) + 401;
      const createdIssue: IssueItem = {
        id: `iss-${newIssueNum}`,
        number: newIssueNum,
        title: item.title.replace('New idea: ', ''),
        description: item.desc + (item.details ? ` (${item.details})` : ''),
        status: 'open',
        platform: 'web',
        author: 'Maryam Gana Mohammed',
        assignedAgent: 'Contributor Alpha',
        labels: ['enhancement', 'community-request'],
        commentsCount: 1,
        createdAt: 'Just now',
        priority: 'medium',
      };
      setIssues((prev) => [createdIssue, ...prev]);
    }

    setAttentionItems((prev) => prev.filter((i) => i.id !== item.id));
    setSelectedAttentionItem(null);
  };

  // Stage A & B Handler: Report Issue & Delegate to Agent
  const handleReportAndDelegate = (
    newIssueData: Omit<IssueItem, 'id' | 'number' | 'createdAt' | 'commentsCount'>,
    delegateToAgent: boolean,
    delegationScope?: DelegationScope
  ) => {
    const nextNum = Math.max(...issues.map((i) => i.number), 400) + 1;
    const newIssueId = `iss-${nextNum}`;
    const newTaskId = `task-${nextNum}`;

    const newIssue: IssueItem = {
      ...newIssueData,
      id: newIssueId,
      number: nextNum,
      createdAt: 'Just now',
      commentsCount: 0,
      delegatedTaskId: delegateToAgent ? newTaskId : undefined,
    };

    setIssues((prev) => [newIssue, ...prev]);

    if (delegateToAgent && delegationScope) {
      // Create new delegated task workflow (Stage C)
      const newTask: DelegatedTask = {
        id: newTaskId,
        issueId: newIssueId,
        issueNumber: nextNum,
        issueTitle: newIssue.title,
        issueType: newIssue.issueType || 'bug',
        platform: newIssue.platform,
        scope: delegationScope,
        status: 'analysing',
        agentName: 'Contributor Alpha',
        currentStepIndex: 0,
        lastUpdate: 'Just now',
        nextExpectedAction: 'Reviewing issue context & tracing reproduction steps',
        createdAt: 'Just now',
        plan: [
          {
            id: 1,
            title: 'Review Issue Description & Trace Logs',
            description: 'Analyzing provided reproduction steps, expected vs actual behavior.',
            status: 'active',
          },
          {
            id: 2,
            title: 'Identify Likely Root Causes',
            description: 'Tracing call hierarchy and identifying defect surface area.',
            status: 'pending',
          },
          {
            id: 3,
            title: 'Inspect Relevant Codebase Context',
            description: 'Reviewing component dependencies and database constraints.',
            status: 'pending',
          },
          {
            id: 4,
            title: 'Formulate & Execute Fix',
            description: 'Applying implementation within assigned delegation permissions.',
            status: 'pending',
          },
          {
            id: 5,
            title: 'Run Automated Regression Suite',
            description: 'Validating patch against test harnesses to prevent side-effects.',
            status: 'pending',
          },
          {
            id: 6,
            title: 'Prepare Pull Request & Summary',
            description: 'Packaging findings and diff for human sign-off.',
            status: 'pending',
          },
        ],
        decisionNeeded: {
          id: `dec-${nextNum}`,
          question: `Contributor Alpha requires architectural guidance for #${nextNum}`,
          missingInfo: 'Preferred caching and retry backoff parameters.',
          whyItMatters: 'Affects peak load resilience and database connection count.',
          options: [
            {
              id: 'opt-1',
              label: 'Conservative Strategy (Recommended)',
              desc: 'Enforce exponential retry with circuit breaker trip at 3 consecutive failures.',
              consequence: 'Prioritizes system stability and avoids cascading database stampedes.',
              isRecommended: true,
            },
            {
              id: 'opt-2',
              label: 'Aggressive Retry Strategy',
              desc: 'Immediate retry on transient timeouts up to 5 attempts.',
              consequence: 'Lower latency recovery under minor packet drops, but higher backend load.',
              isRecommended: false,
            },
          ],
        },
        resultSummary: {
          solution: `Formulated and verified resolution for ${newIssue.title}.`,
          changesSummary: [
            'Added circuit breaker wrapper for outbound requests',
            'Implemented automated failover fallback handlers',
            'Covered with 8 new integration test cases',
          ],
          testResults: '8/8 new tests passing (100% assertion success)',
          knownLimitations: 'Requires environment variable MAX_RETRY_INTERVAL set in production.',
          filesTouched: ['src/services/apiClient.ts', 'tests/resilience.test.ts'],
        },
      };

      setDelegatedTasks((prev) => [newTask, ...prev]);
      setSelectedTaskId(newTaskId);
      setAgentOnline(true);
      setAgentSubStatus(`Contributor Alpha · Analysing delegated issue #${nextNum}`);
      showToast(`Issue #${nextNum} reported and delegated to Contributor Alpha`);
    } else {
      showToast(`Issue #${nextNum} created without agent delegation`);
    }
  };

  // Handle delegated task updates from the execution view
  const handleUpdateDelegatedTask = (updatedTask: DelegatedTask) => {
    setDelegatedTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );

    // If completed, update corresponding issue in list
    if (updatedTask.status === 'completed') {
      setIssues((prev) =>
        prev.map((i) =>
          i.number === updatedTask.issueNumber
            ? { ...i, status: 'done', assignedAgent: 'Contributor Alpha (Completed)' }
            : i
        )
      );
      setAgentSubStatus('Contributor Alpha is ready for new delegated tasks.');
    }
  };

  // Tab counts
  const tabCounts = useMemo(() => {
    const open = issues.filter((i) => i.status === 'open').length + 107;
    const inprogress = issues.filter((i) => i.status === 'inprogress').length + 37;
    const done = issues.filter((i) => i.status === 'done').length + 107;
    const ready = issues.filter((i) => i.status === 'ready').length;
    const automerge = issues.filter((i) => i.status === 'automerge').length + 6;
    const all = open + inprogress + done + ready + automerge;
    return {
      inbox: totalAttentionCount,
      open,
      inprogress,
      done,
      ready,
      automerge,
      all,
    };
  }, [issues, totalAttentionCount]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b1021] text-slate-900 dark:text-[#f3f4f6] flex flex-col font-sans transition-colors duration-150">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded-md z-50 font-medium"
      >
        Skip to main content
      </a>

      {/* Browser Default Alert Bar */}
      <TopBar onSetDefault={() => showToast('Browser preference updated (demo)')} />

      {/* Header matching exact screenshot with light/dark toggle */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onShowToast={showToast}
        agentOnlineCount={agentOnline ? 1 : 0}
      />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} />

      {/* Main Container */}
      <main id="main-content" className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb & Quick Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <nav
            className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 select-none"
            aria-label="Breadcrumb"
          >
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Ziki
            </a>
            <ChevronRight size={13} className="text-slate-400 dark:text-slate-600" />
            <span className="text-slate-700 dark:text-slate-200 font-medium">Issues</span>
            <ChevronRight size={13} className="text-slate-400 dark:text-slate-600" />
            <span className="text-blue-600 dark:text-blue-400 font-semibold">Human–Agent Delegation</span>
          </nav>

          {/* Prominent Action to Report & Delegate */}
          <button
            onClick={() => setReportModalOpen(true)}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Bot size={15} />
            <span>Report Issue &amp; Delegate Work</span>
            <Sparkles size={13} className="text-blue-200 animate-pulse" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2.5 mb-5 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearchInput(!showSearchInput)}
              className={`w-9 h-9 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                showSearchInput || searchQuery
                  ? 'bg-blue-600/10 dark:bg-blue-600/20 border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-[#1f2937] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600'
              }`}
              aria-label="Search issues"
              title="Search issues"
            >
              <Search size={15} />
            </button>

            {showSearchInput && (
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search issues, labels, #id..."
                className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f2937] focus:border-blue-500 rounded-md px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none w-48 sm:w-64 transition-all shadow-xs"
              />
            )}

            <button
              onClick={() => {
                showToast('Filter options applied');
              }}
              className="w-9 h-9 rounded-md bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f2937] hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Filter issues"
              title="Filter"
            >
              <Filter size={15} />
            </button>

            <button
              onClick={() => {
                const nextSort =
                  sortOrder === 'newest'
                    ? 'priority'
                    : sortOrder === 'priority'
                    ? 'comments'
                    : 'newest';
                setSortOrder(nextSort);
                showToast(`Sorted by ${nextSort}`);
              }}
              className="w-9 h-9 rounded-md bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f2937] hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Sort issues"
              title={`Sort order: ${sortOrder}`}
            >
              <ArrowUpDown size={15} />
            </button>

            <button
              onClick={() => setReportModalOpen(true)}
              className="w-9 h-9 rounded-md bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center font-bold text-base transition-colors shadow-sm cursor-pointer"
              aria-label="Report and delegate new issue"
              title="New Issue Report & Delegation"
            >
              <Plus size={17} />
            </button>
          </div>

          <div className="ml-auto w-full sm:w-auto">
            <select
              value={platformFilter}
              onChange={(e) => {
                setPlatformFilter(e.target.value as any);
                showToast(`Platform filter: ${e.target.value.toUpperCase()}`);
              }}
              className="w-full sm:w-auto bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f2937] hover:border-slate-300 dark:hover:border-slate-600 rounded-md py-1.5 px-3 text-xs text-slate-700 dark:text-slate-300 cursor-pointer focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
            >
              <option value="all">Platform: All</option>
              <option value="web">Platform: Web</option>
              <option value="mobile">Platform: Mobile</option>
              <option value="api">Platform: API / Backend</option>
            </select>
          </div>
        </div>

        {/* Status Tabs Navigation */}
        <div
          className="flex gap-2 bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-[#1f2937] rounded-xl p-1 mb-6 overflow-x-auto scrollbar-none"
          role="tablist"
          aria-label="Issue status filters"
        >

          <button
            onClick={() => setCurrentStatusTab('open')}
            role="tab"
            aria-selected={currentStatusTab === 'open'}
            className={`py-2 px-3.5 rounded-lg text-xs sm:text-[13px] font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              currentStatusTab === 'open'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#1f2937]/50'
            }`}
          >
            <span>Open</span>
            <span
              className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                currentStatusTab === 'open'
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
              }`}
            >
              {tabCounts.open}
            </span>
          </button>

          <button
            onClick={() => setCurrentStatusTab('inprogress')}
            role="tab"
            aria-selected={currentStatusTab === 'inprogress'}
            className={`py-2 px-3.5 rounded-lg text-xs sm:text-[13px] font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              currentStatusTab === 'inprogress'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#1f2937]/50'
            }`}
          >
            <span>In progress</span>
            <span
              className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                currentStatusTab === 'inprogress'
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
              }`}
            >
              {tabCounts.inprogress}
            </span>
          </button>

          <button
            onClick={() => setCurrentStatusTab('done')}
            role="tab"
            aria-selected={currentStatusTab === 'done'}
            className={`py-2 px-3.5 rounded-lg text-xs sm:text-[13px] font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              currentStatusTab === 'done'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#1f2937]/50'
            }`}
          >
            <span>Done</span>
            <span
              className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                currentStatusTab === 'done'
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
              }`}
            >
              {tabCounts.done}
            </span>
          </button>

          <button
            onClick={() => setCurrentStatusTab('ready')}
            role="tab"
            aria-selected={currentStatusTab === 'ready'}
            className={`py-2 px-3.5 rounded-lg text-xs sm:text-[13px] font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              currentStatusTab === 'ready'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#1f2937]/50'
            }`}
          >
            <span>Ready to Merge</span>
            <span
              className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                currentStatusTab === 'ready'
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
              }`}
            >
              {tabCounts.ready}
            </span>
          </button>

          <button
            onClick={() => setCurrentStatusTab('automerge')}
            role="tab"
            aria-selected={currentStatusTab === 'automerge'}
            className={`py-2 px-3.5 rounded-lg text-xs sm:text-[13px] font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              currentStatusTab === 'automerge'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#1f2937]/50'
            }`}
          >
            <span>Auto Merge</span>
            <span
              className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                currentStatusTab === 'automerge'
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
              }`}
            >
              {tabCounts.automerge}
            </span>
          </button>

          <button
            onClick={() => setCurrentStatusTab('all')}
            role="tab"
            aria-selected={currentStatusTab === 'all'}
            className={`py-2 px-3.5 rounded-lg text-xs sm:text-[13px] font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              currentStatusTab === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#1f2937]/50'
            }`}
          >
            <span>All</span>
            <span
              className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                currentStatusTab === 'all'
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
              }`}
            >
              {tabCounts.all}
            </span>
          </button>
        </div>

        {/* Demo Notice Banner */}
        <div
          className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg p-3 sm:px-4 mb-6 text-xs text-blue-800 dark:text-blue-400 flex items-center justify-between gap-2.5 shadow-xs"
          role="status"
        >
          <div className="flex items-center gap-2.5">
            <Wrench size={15} className="shrink-0 text-blue-600 dark:text-blue-400" />
            <span>
              <strong>Human-to-Agent Delegation Active:</strong> Human reports problems and provides decisions; AI agent executes analysis, code generation, and test validation.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-300 hidden md:inline-block">
            Simulated Workflow Prototype
          </span>
        </div>

        {/* Delegated Task Execution View (Stages C, D, E, F, G) */}
        {activeDelegatedTask && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Bot size={13} className="text-blue-600 dark:text-blue-400" />
                  <span>Active Delegated Investigation &amp; Execution</span>
                </span>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full font-semibold">
                  {delegatedTasks.length} {delegatedTasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </div>

              {/* Task switcher if multiple exist */}
              {delegatedTasks.length > 1 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Switch task:</span>
                  <select
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f2937] text-xs text-slate-800 dark:text-slate-300 rounded px-2 py-1 shadow-xs"
                  >
                    {delegatedTasks.map((t) => (
                      <option key={t.id} value={t.id}>
                        #{t.issueNumber} - {t.issueTitle.slice(0, 30)}...
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <DelegatedTaskExecutionView
              task={activeDelegatedTask}
              onUpdateTask={handleUpdateDelegatedTask}
              onShowToast={showToast}
            />
          </div>
        )}

        {/* Hero Section: Agent status & your attention */}
        <AgentAttentionSection
          agentOnline={agentOnline}
          agentName={agentName}
          agentSubStatus={agentSubStatus}
          onToggleAgent={handleToggleAgent}
          activeAttentionTab={activeAttentionTab}
          onSelectAttentionTab={(tab) => {
            setActiveAttentionTab(tab);
          }}
          attentionItems={attentionItems}
          attentionCounts={attentionCounts}
          onAttentionAction={handleAttentionAction}
        />

        {/* Agent Settings Panel (Collapsible) */}
        <AgentSettingsPanel
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onSave={(_newSettings: AgentSettings) => {
            showToast('Agent settings saved successfully');
          }}
        />

        {/* Main Content: Issues List & Delegated Work */}
        <IssuesList
          currentTab={currentStatusTab}
          issues={issues}
          searchQuery={searchQuery}
          platformFilter={platformFilter}
          onSelectIssue={(issue) => setSelectedIssueDetail(issue)}
          onNewIssueClick={() => setReportModalOpen(true)}
        />
      </main>

      {/* Stage A & B: Report Issue & Delegate to Agent Modal */}
      <ReportAndDelegateModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSubmit={handleReportAndDelegate}
      />

      {/* Review Attention Item Modal */}
      <AttentionItemModal
        item={selectedAttentionItem}
        onClose={() => setSelectedAttentionItem(null)}
        onConfirm={(item, actionTitle, notes) =>
          executeAttentionResolution(item, actionTitle, notes)
        }
      />

      {/* Issue Detail Modal */}
      <IssueDetailModal
        issue={selectedIssueDetail}
        onClose={() => setSelectedIssueDetail(null)}
        onAssignToAgent={(issue) => {
          showToast(`Assigned ${agentName} to issue #${issue.number}`);
          setSelectedIssueDetail(null);
        }}
        onResolveIssue={(issue) => {
          setIssues((prev) =>
            prev.map((i) => (i.id === issue.id ? { ...i, status: 'done' } : i))
          );
          showToast(`Issue #${issue.number} marked as resolved!`);
          setSelectedIssueDetail(null);
        }}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 dark:border-[#1f2937] py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>Built for HNG15 Week 5 — Human-to-Agent Issue Reporting &amp; Work Delegation</p>
        <p className="mt-1 text-slate-400 dark:text-slate-600">Product: Ziki | Page: Issues (ziki.dev/issues)</p>
      </footer>
    </div>
  );
};
