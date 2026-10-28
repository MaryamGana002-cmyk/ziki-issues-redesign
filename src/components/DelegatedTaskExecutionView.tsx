import React, { useState } from 'react';
import {
  Bot,
  CheckCircle2,
  Play,
  GitPullRequest,
  Check
} from 'lucide-react';
import { DelegatedTask } from '../types';

interface DelegatedTaskExecutionViewProps {
  task: DelegatedTask;
  onUpdateTask: (updatedTask: DelegatedTask) => void;
  onShowToast: (msg: string) => void;
}

export const DelegatedTaskExecutionView: React.FC<DelegatedTaskExecutionViewProps> = ({
  task,
  onUpdateTask,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'plan' | 'diff' | 'tests'>('plan');

  // Stage E: Advance execution to next step (simulated progress)
  const handleAdvanceStep = () => {
    if (task.status === 'completed') return;

    if (task.status === 'analysing' || task.status === 'needs_input') {
      const updatedPlan = task.plan.map((s, idx) => ({
        ...s,
        status: idx <= 2 ? ('completed' as const) : idx === 3 ? ('active' as const) : ('pending' as const),
      }));

      const updated: DelegatedTask = {
        ...task,
        status: 'working',
        currentStepIndex: 3,
        lastUpdate: 'Just now',
        nextExpectedAction: 'Implementing fix and generating tests',
        plan: updatedPlan,
      };
      onUpdateTask(updated);
      onShowToast('Contributor Alpha is working on the implementation.');
      return;
    }

    if (task.status === 'working') {
      const updatedPlan = task.plan.map((s, idx) => ({
        ...s,
        status: idx <= 4 ? ('completed' as const) : idx === 5 ? ('active' as const) : ('pending' as const),
      }));

      const updated: DelegatedTask = {
        ...task,
        status: 'in_review',
        currentStepIndex: 5,
        lastUpdate: 'Just now',
        nextExpectedAction: 'Ready for human review and final PR sign-off',
        plan: updatedPlan,
      };
      onUpdateTask(updated);
      onShowToast('Contributor Alpha has completed implementation and opened PR for review.');
      return;
    }

    if (task.status === 'in_review') {
      handleFinalApproval();
    }
  };

  // Stage F & G: Human approves result
  const handleFinalApproval = () => {
    const updatedPlan = task.plan.map((s) => ({ ...s, status: 'completed' as const }));
    const updated: DelegatedTask = {
      ...task,
      status: 'completed',
      currentStepIndex: 6,
      lastUpdate: 'Just now',
      nextExpectedAction: 'Completed & merged into main branch.',
      plan: updatedPlan,
    };
    onUpdateTask(updated);
    onShowToast(`Issue #${task.issueNumber} successfully approved and closed.`);
  };

  const getStatusBadge = () => {
    switch (task.status) {
      case 'queued':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">Queued</span>;
      case 'analysing':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 animate-pulse">Analysing Issue</span>;
      case 'needs_input':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse">Needs Your Input</span>;
      case 'working':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800">Agent Working</span>;
      case 'in_review':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">In Review</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">Completed &amp; Verified</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f2937] rounded-xl overflow-hidden shadow-sm dark:shadow-xl mb-6 transition-colors">
      {/* Task Header */}
      <div className="p-5 border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#0f172a] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Bot size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded">
                Issue #{task.issueNumber}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                {task.issueTitle}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
              <span>Assigned to <strong className="text-slate-800 dark:text-slate-200">{task.agentName}</strong></span>
              <span>•</span>
              <span className="capitalize">Scope: {task.scope}</span>
              <span>•</span>
              <span>Updated {task.lastUpdate}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {getStatusBadge()}
          {task.status !== 'completed' && task.status !== 'needs_input' && (
            <button
              onClick={handleAdvanceStep}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Step forward simulated agent workflow"
            >
              <Play size={12} />
              <span>Advance Agent</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 space-y-5">

        {/* Human Resolution Banner (When already decided) */}
        {task.humanResolution && (
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
              <div>
                <strong>Human Decision Applied:</strong> {task.humanResolution.optionLabel}
                {task.humanResolution.notes && (
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px] italic">
                    Note: &ldquo;{task.humanResolution.notes}&rdquo;
                  </span>
                )}
              </div>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{task.humanResolution.resolvedAt}</span>
          </div>
        )}

        {/* STAGE C & E: Proposed Plan & Progress Tracking */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Agent Action Plan &amp; Progress (Simulated Workflow)
              </h4>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Step {task.currentStepIndex + 1} of {task.plan.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {task.plan.map((step, idx) => {
              const isCompleted = step.status === 'completed';
              const isActive = step.status === 'active';
              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isActive
                      ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-500/10 shadow-xs'
                      : isCompleted
                      ? 'border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#0b1021]/80 opacity-90'
                      : 'border-slate-100 dark:border-[#1f2937]/50 bg-slate-50/60 dark:bg-[#0b1021]/30 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase">
                      Step {idx + 1}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 size={13} className="text-emerald-500 dark:text-emerald-400" />
                    ) : isActive ? (
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600"></span>
                    )}
                  </div>
                  <h5 className={`text-xs font-semibold leading-tight ${isActive ? 'text-blue-700 dark:text-blue-300 font-bold' : isCompleted ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                    {step.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* STAGE F: Human Reviews the Result (When In Review or Completed) */}
        {(task.status === 'in_review' || task.status === 'completed') && task.resultSummary && (
          <div className="border border-purple-300 dark:border-purple-500/40 bg-purple-50/50 dark:bg-purple-950/10 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-200 dark:border-[#1f2937] pb-3">
              <div className="flex items-center gap-2">
                <GitPullRequest size={18} className="text-purple-600 dark:text-purple-400" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Stage F: Agent Result &amp; Verification Summary
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('plan')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${activeTab === 'plan' ? 'bg-purple-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('diff')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${activeTab === 'diff' ? 'bg-purple-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  Code Changes
                </button>
                <button
                  onClick={() => setActiveTab('tests')}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${activeTab === 'tests' ? 'bg-purple-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  Test Evidence
                </button>
              </div>
            </div>

            {activeTab === 'plan' && (
              <div className="space-y-3 text-xs text-slate-800 dark:text-slate-300">
                <div className="p-3 bg-white dark:bg-[#0b1021] border border-slate-200 dark:border-[#1f2937] rounded-lg">
                  <span className="font-bold text-slate-900 dark:text-slate-200 block mb-1">Applied Solution:</span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{task.resultSummary.solution}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white dark:bg-[#0b1021] border border-slate-200 dark:border-[#1f2937] rounded-lg">
                    <span className="font-bold text-slate-900 dark:text-slate-200 block mb-1">Key Changes:</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                      {task.resultSummary.changesSummary.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#0b1021] border border-slate-200 dark:border-[#1f2937] rounded-lg">
                    <span className="font-bold text-slate-900 dark:text-slate-200 block mb-1">Known Limitations:</span>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{task.resultSummary.knownLimitations}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'diff' && (
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[11px] text-slate-300 overflow-x-auto space-y-1">
                <div className="text-slate-500 pb-1 border-b border-slate-800 flex items-center justify-between">
                  <span>Touched Files: {task.resultSummary.filesTouched.join(', ')}</span>
                  <span className="text-emerald-400">+48 lines</span>
                </div>
                <div className="text-emerald-400 pt-2">+ async function acquireTokenMutex(clientId, timeoutMs = 5000) &#123;</div>
                <div className="text-emerald-400">+   const lock = await redis.set(`lock:token:$&#123;clientId&#125;`, '1', 'PX', timeoutMs, 'NX');</div>
                <div className="text-emerald-400">+   if (!lock) return exponentialBackoffRetry(clientId);</div>
                <div className="text-emerald-400">+   return refreshJWTPayload(clientId);</div>
                <div className="text-emerald-400">+ &#125;</div>
                <div className="text-slate-400">// ... token verification handshake verified across all socket connections</div>
              </div>
            )}

            {activeTab === 'tests' && (
              <div className="p-3.5 bg-white dark:bg-[#0b1021] border border-slate-200 dark:border-[#1f2937] rounded-lg text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 size={15} />
                  <span>{task.resultSummary.testResults}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Synthetic test suite executed: Concurrent reconnect simulation (100 parallel sockets), lease expiration, failover recovery. 0 memory leaks detected.
                </p>
              </div>
            )}

            {/* Stage F Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-purple-200 dark:border-[#1f2937]">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {task.status === 'completed'
                  ? 'Task completed. Issue is resolved.'
                  : 'Requires human approval to merge into main.'}
              </span>

              {task.status !== 'completed' && (
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => {
                      onShowToast('Changes requested. Contributor Alpha notified.');
                    }}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    Request Changes
                  </button>
                  <button
                    onClick={handleFinalApproval}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check size={14} />
                    <span>Approve &amp; Merge Fix</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STAGE G: Completion State */}
        {task.status === 'completed' && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Check size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Issue #{task.issueNumber} Resolved &amp; Completed
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Contributor Alpha carried out investigation, test generation, and fix application with human direction.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const updated: DelegatedTask = {
                  ...task,
                  status: 'working',
                  currentStepIndex: 3,
                  lastUpdate: 'Just now',
                };
                onUpdateTask(updated);
                onShowToast('Task reopened for further investigation.');
              }}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
            >
              Reopen task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
