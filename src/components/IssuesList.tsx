import React from 'react';
import { MessageSquare, Bot, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { IssueItem, StatusFilter } from '../types';

interface IssuesListProps {
  currentTab: StatusFilter;
  issues: IssueItem[];
  searchQuery: string;
  platformFilter: string;
  onSelectIssue: (issue: IssueItem) => void;
  onNewIssueClick: () => void;
}

export const IssuesList: React.FC<IssuesListProps> = ({
  currentTab,
  issues,
  searchQuery,
  platformFilter,
  onSelectIssue,
  onNewIssueClick,
}) => {
  const filtered = issues.filter((issue) => {
    // Status filter
    if (currentTab !== 'all') {
      if (issue.status !== currentTab) return false;
    }
    // Platform filter
    if (platformFilter !== 'all' && issue.platform !== 'all' && issue.platform !== platformFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        issue.title.toLowerCase().includes(q) ||
        issue.description.toLowerCase().includes(q) ||
        String(issue.number).includes(q) ||
        issue.labels.some((l) => l.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getPriorityBadge = (priority: IssueItem['priority']) => {
    switch (priority) {
      case 'urgent':
        return <span className="text-[10px] font-bold text-red-400 bg-red-950/40 border border-red-800/60 px-1.5 py-0.5 rounded">Urgent</span>;
      case 'high':
        return <span className="text-[10px] font-bold text-amber-400 bg-amber-950/40 border border-amber-800/60 px-1.5 py-0.5 rounded">High</span>;
      case 'medium':
        return <span className="text-[10px] font-bold text-blue-400 bg-blue-950/40 border border-blue-800/60 px-1.5 py-0.5 rounded">Medium</span>;
      case 'low':
        return <span className="text-[10px] font-bold text-slate-400 bg-slate-800/50 border border-slate-700/60 px-1.5 py-0.5 rounded">Low</span>;
    }
  };

  const getStatusIcon = (status: IssueItem['status']) => {
    switch (status) {
      case 'inprogress':
        return <Clock size={15} className="text-blue-400" />;
      case 'done':
        return <CheckCircle2 size={15} className="text-emerald-400" />;
      case 'automerge':
        return <Bot size={15} className="text-purple-400" />;
      default:
        return <AlertCircle size={15} className="text-amber-400" />;
    }
  };

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f2937] rounded-xl overflow-hidden shadow-sm dark:shadow-lg transition-colors">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#0f172a]">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {currentTab.toUpperCase()} ISSUES ({filtered.length})
        </div>
        <button
          onClick={onNewIssueClick}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer shadow-xs"
        >
          + New Issue
        </button>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-[#1f2937]">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            No issues match the selected criteria.
          </div>
        ) : (
          filtered.map((issue) => (
            <div
              key={issue.id}
              onClick={() => onSelectIssue(issue)}
              className="p-4 hover:bg-slate-50 dark:hover:bg-[#1f2937]/50 transition-colors cursor-pointer flex items-start gap-3.5 group"
            >
              <div className="mt-0.5 shrink-0">{getStatusIcon(issue.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    #{issue.number} {issue.title}
                  </span>
                  {getPriorityBadge(issue.priority)}
                  {issue.assignedAgent && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800/60 px-1.5 py-0.5 rounded">
                      <Bot size={10} />
                      {issue.assignedAgent}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mb-2">{issue.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                  <span>Opened {issue.createdAt} by {issue.author}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    {issue.labels.map((lbl) => (
                      <span
                        key={lbl}
                        className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent px-1.5 py-0.5 rounded text-[10px]"
                      >
                        {lbl}
                      </span>
                    ))}
                  </div>
                  <span>•</span>
                  <span className="capitalize">{issue.platform}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-400 text-xs shrink-0 self-center">
                <MessageSquare size={13} />
                <span>{issue.commentsCount}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
