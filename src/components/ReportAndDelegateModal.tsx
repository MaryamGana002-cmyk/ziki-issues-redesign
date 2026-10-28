import React, { useState } from 'react';
import {
  X,
  Bot,
  CheckCircle2,
  ArrowRight,
  Search,
  Code,
  FileCheck,
  Zap,
  Info
} from 'lucide-react';
import { DelegationScope, IssueItem } from '../types';

interface ReportAndDelegateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    issueData: Omit<IssueItem, 'id' | 'number' | 'createdAt' | 'commentsCount'>,
    delegateToAgent: boolean,
    delegationScope?: DelegationScope
  ) => void;
}

export const ReportAndDelegateModal: React.FC<ReportAndDelegateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [step, setStep] = useState<'report' | 'delegate'>('report');

  // Stage A: Human reports the issue
  const [title, setTitle] = useState('');
  const [issueType, setIssueType] = useState<'bug' | 'feature' | 'performance' | 'security' | 'refactor'>('bug');
  const [platform, setPlatform] = useState<'web' | 'mobile' | 'api' | 'all'>('web');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('high');
  const [description, setDescription] = useState('');
  const [expectedBehavior, setExpectedBehavior] = useState('');
  const [actualBehavior, setActualBehavior] = useState('');
  const [reproSteps, setReproSteps] = useState('');

  // Stage B: Delegation configuration
  const [delegationScope, setDelegationScope] = useState<DelegationScope>('implement');
  const [requireHumanReview, setRequireHumanReview] = useState(true);

  if (!isOpen) return null;

  const handleNextToDelegation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setStep('delegate');
  };

  const handleFinalSubmit = (delegate: boolean) => {
    const labels: string[] = [issueType, platform];
    if (priority === 'urgent' || priority === 'high') labels.push('priority');

    onSubmit(
      {
        title: title.trim(),
        description: description.trim(),
        status: delegate ? 'inprogress' : 'open',
        platform,
        priority,
        author: 'Maryam Gana Mohammed',
        assignedAgent: delegate ? 'Contributor Alpha' : undefined,
        labels,
        issueType,
        expectedBehavior: expectedBehavior.trim(),
        actualBehavior: actualBehavior.trim(),
        reproSteps: reproSteps.trim(),
        delegationScope: delegate ? delegationScope : undefined,
      },
      delegate,
      delegate ? delegationScope : undefined
    );

    // Reset form
    setTitle('');
    setDescription('');
    setExpectedBehavior('');
    setActualBehavior('');
    setReproSteps('');
    setStep('report');
    onClose();
  };

  const scopeDetails: Record<DelegationScope, { title: string; desc: string; icon: any; agentAction: string }> = {
    diagnose: {
      title: 'Investigate & Diagnose',
      desc: 'Agent reviews logs, inspects codebase, and identifies the root cause without modifying code.',
      icon: Search,
      agentAction: 'Contributor Alpha will trace execution call stacks, inspect recent commit history, and produce a diagnostic report.',
    },
    propose: {
      title: 'Propose a Solution',
      desc: 'Agent formulates alternative architectural solutions, outlines trade-offs, and drafts a technical specification.',
      icon: Zap,
      agentAction: 'Contributor Alpha will analyze system constraints, evaluate 2-3 solution approaches, and request human feedback on the best path.',
    },
    implement: {
      title: 'Implement a Fix',
      desc: 'Agent generates a patch branch, writes unit tests, verifies regression safety, and opens a pull request for human sign-off.',
      icon: Code,
      agentAction: 'Contributor Alpha will independently author the code modifications, add test coverage, and halt at final PR review for your approval.',
    },
    review: {
      title: 'Review Existing Implementation',
      desc: 'Agent performs static analysis, scans for security vulnerabilities, and evaluates test coverage on an existing patch.',
      icon: FileCheck,
      agentAction: 'Contributor Alpha will run automated linting, security AST checkers, and verify boundary edge cases.',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f2937] rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl my-6 transition-colors">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#0f172a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                {step === 'report' ? 'Report New Issue' : 'Delegate Work to Agent'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {step === 'report'
                  ? 'Stage A: Define the problem context and evidence'
                  : 'Stage B: Assign execution scope to Contributor Alpha'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded hover:bg-slate-100 dark:hover:bg-[#1f2937] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex border-b border-slate-200 dark:border-[#1f2937] bg-slate-50/50 dark:bg-[#0b1021]/50 text-xs font-semibold px-6 py-2 gap-4">
          <div className={`flex items-center gap-1.5 ${step === 'report' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-400'}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${step === 'report' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>
              1
            </span>
            <span>Issue Details (Human)</span>
          </div>
          <span className="text-slate-400 dark:text-slate-600">›</span>
          <div className={`flex items-center gap-1.5 ${step === 'delegate' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-400'}`}>
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${step === 'delegate' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>
              2
            </span>
            <span>Agent Delegation Scope</span>
          </div>
        </div>

        {/* STAGE A: Report the Issue */}
        {step === 'report' && (
          <form onSubmit={handleNextToDelegation} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Division of Responsibilities Hint */}
            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg p-3 text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2.5">
              <Info size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong>Human Responsibility:</strong> Identify the issue and provide context. Contributor Alpha will automatically investigate, formulate solutions, and report back for your decision.
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Issue Title <span className="text-rose-500 dark:text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Intermittent auth handshake timeout on client websocket reconnect"
                className="w-full bg-white dark:bg-[#0b1021] border border-slate-300 dark:border-[#1f2937] focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Example: &ldquo;Payment gateway webhook drops signatures under high load&rdquo;
              </p>
            </div>

            {/* Type, Platform, Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Issue Type
                </label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value as any)}
                  className="w-full bg-white dark:bg-[#0b1021] border border-slate-300 dark:border-[#1f2937] focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="bug">🐛 Bug</option>
                  <option value="performance">⚡ Performance</option>
                  <option value="security">🛡️ Security</option>
                  <option value="feature">✨ Feature</option>
                  <option value="refactor">♻️ Refactor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as any)}
                  className="w-full bg-white dark:bg-[#0b1021] border border-slate-300 dark:border-[#1f2937] focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="web">Web Application</option>
                  <option value="mobile">Mobile (iOS / Android)</option>
                  <option value="api">Backend &amp; API</option>
                  <option value="all">Cross-platform</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-white dark:bg-[#0b1021] border border-slate-300 dark:border-[#1f2937] focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="urgent">🔴 Urgent</option>
                  <option value="high">🟠 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
              </div>
            </div>

            {/* Problem Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Problem Description <span className="text-rose-500 dark:text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what is failing, error messages, and operational impact..."
                className="w-full bg-white dark:bg-[#0b1021] border border-slate-300 dark:border-[#1f2937] focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Expected vs Actual Behaviour */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Expected Behaviour
                </label>
                <textarea
                  rows={2}
                  value={expectedBehavior}
                  onChange={(e) => setExpectedBehavior(e.target.value)}
                  placeholder="e.g. Socket should silently refresh auth token and maintain connection..."
                  className="w-full bg-white dark:bg-[#0b1021] border border-slate-300 dark:border-[#1f2937] focus:border-blue-500 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Actual Behaviour
                </label>
                <textarea
                  rows={2}
                  value={actualBehavior}
                  onChange={(e) => setActualBehavior(e.target.value)}
                  placeholder="e.g. Socket disconnects with error 4001, forcing page reload..."
                  className="w-full bg-white dark:bg-[#0b1021] border border-slate-300 dark:border-[#1f2937] focus:border-blue-500 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Reproduction Steps / Evidence */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Supporting Evidence / Reproduction Steps (Optional)
              </label>
              <textarea
                rows={2}
                value={reproSteps}
                onChange={(e) => setReproSteps(e.target.value)}
                placeholder="1. Open app and remain active for >60 mins&#10;2. Observe console network drop"
                className="w-full bg-white dark:bg-[#0b1021] border border-slate-300 dark:border-[#1f2937] focus:border-blue-500 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none font-mono text-[11px]"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-[#1f2937]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-slate-300 dark:border-[#1f2937] text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Continue to Delegation</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        )}

        {/* STAGE B: Human Delegates the Work */}
        {step === 'delegate' && (
          <div className="p-6 space-y-5">
            {/* Delegation Scope Options */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Select Task Scope to Delegate
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['diagnose', 'propose', 'implement', 'review'] as DelegationScope[]).map((scopeKey) => {
                  const item = scopeDetails[scopeKey];
                  const Icon = item.icon;
                  const isSelected = delegationScope === scopeKey;
                  return (
                    <div
                      key={scopeKey}
                      onClick={() => setDelegationScope(scopeKey)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-600/10 shadow-xs ring-1 ring-blue-500'
                          : 'border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#0b1021]/60 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            <span>{item.title}</span>
                            {isSelected && <CheckCircle2 size={13} className="text-blue-600 dark:text-blue-400" />}
                          </h4>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-snug">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Clear Explanation of What the Agent Will Do */}
            <div className="p-4 bg-slate-50 dark:bg-[#0b1021] border border-blue-200 dark:border-blue-500/30 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300">
                <Bot size={15} className="text-blue-600 dark:text-blue-400" />
                <span>What Contributor Alpha will do:</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {scopeDetails[delegationScope].agentAction}
              </p>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-[#1f2937] pt-2 mt-2">
                Simulated execution plan: Review issue → Identify root cause → Code analysis → Automated validation → Human review checkpoint.
              </div>
            </div>

            {/* Permission Checkbox */}
            <label className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={requireHumanReview}
                onChange={(e) => setRequireHumanReview(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <span>
                <strong>Require human approval before applying changes:</strong> Agent will ask questions when decisions are needed and request sign-off on the final PR.
              </span>
            </label>

            {/* Action Buttons: Delegate vs Save without delegation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-[#1f2937]">
              <button
                type="button"
                onClick={() => setStep('report')}
                className="w-full sm:w-auto px-4 py-2 rounded-md border border-slate-300 dark:border-[#1f2937] text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                Back to Issue Details
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleFinalSubmit(false)}
                  className="w-full sm:w-auto px-4 py-2 rounded-md border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Save as Unassigned Issue
                </button>
                <button
                  type="button"
                  onClick={() => handleFinalSubmit(true)}
                  className="w-full sm:w-auto px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Bot size={15} />
                  <span>Submit Issue &amp; Assign to Agent</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
