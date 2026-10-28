import React from 'react';
import { X, Bot, Clock, MessageSquare, CheckCircle } from 'lucide-react';
import { IssueItem } from '../types';

interface IssueDetailModalProps {
  issue: IssueItem | null;
  onClose: () => void;
  onAssignToAgent: (issue: IssueItem) => void;
  onResolveIssue: (issue: IssueItem) => void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  onClose,
  onAssignToAgent,
  onResolveIssue,
}) => {
  if (!issue) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f2937] rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#0f172a]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10 px-2 py-0.5 rounded">
              #{issue.number}
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 capitalize">{issue.status}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded hover:bg-slate-200 dark:hover:bg-[#1f2937]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">{issue.title}</h3>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Opened by {issue.author}</span>
              <span>•</span>
              <span>{issue.createdAt}</span>
              <span>•</span>
              <span className="capitalize">{issue.platform}</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#0b1021] border border-slate-200 dark:border-[#1f2937] rounded-lg p-3.5 text-xs text-slate-800 dark:text-slate-300 leading-relaxed">
            {issue.description}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-[#1f2937]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Labels:</span>
              <div className="flex gap-1.5 flex-wrap">
                {issue.labels.map((l) => (
                  <span key={l} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent px-1.5 py-0.5 rounded text-[10px]">
                    {l}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <MessageSquare size={13} />
              <span>{issue.commentsCount} comments</span>
            </div>
          </div>

          {issue.assignedAgent ? (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <Bot size={15} />
                <span>Assigned to <strong>{issue.assignedAgent}</strong></span>
              </div>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <Clock size={11} /> Active
              </span>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-[#1f2937] rounded-lg flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">No agent currently assigned</span>
              <button
                onClick={() => onAssignToAgent(issue)}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <Bot size={12} />
                <span>Assign Contributor Alpha</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#0f172a]">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md border border-slate-300 dark:border-[#1f2937] text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:text-white"
          >
            Close
          </button>
          {issue.status !== 'done' && (
            <button
              onClick={() => onResolveIssue(issue)}
              className="px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <CheckCircle size={13} />
              <span>Mark as Resolved</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
