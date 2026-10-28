import React from 'react';
import { Zap } from 'lucide-react';
import { AttentionCategory, AttentionItem } from '../types';

interface AgentAttentionSectionProps {
  agentOnline: boolean;
  agentName?: string;
  agentSubStatus?: string;
  onToggleAgent?: () => void;
  activeAttentionTab: AttentionCategory;
  onSelectAttentionTab: (tab: AttentionCategory) => void;
  attentionItems: AttentionItem[];
  attentionCounts: Record<AttentionCategory, number>;
  onAttentionAction: (item: AttentionItem, actionLabel: string) => void;
}

export const AgentAttentionSection: React.FC<AgentAttentionSectionProps> = ({
  agentOnline,
  activeAttentionTab,
  onSelectAttentionTab,
  attentionItems,
  attentionCounts,
  onAttentionAction,
}) => {
  const currentCategoryItems = attentionItems.filter(
    (item) => item.category === activeAttentionTab
  );

  const totalNeedInput = attentionCounts['need-input'] + attentionCounts['design-feedback'];

  return (
    <section
      className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1f2937] rounded-xl overflow-hidden mb-6 shadow-sm dark:shadow-lg transition-all"
      aria-labelledby="attention-heading"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-5 py-4 border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#0f172a] gap-2">
        <h2
          id="attention-heading"
          className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2"
        >
          <span className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-[11px] shadow-xs">
            <Zap size={12} className="fill-white" />
          </span>
          <span>Agent status &amp; your attention</span>
        </h2>
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span>
            <strong className="text-slate-900 dark:text-slate-200">{totalNeedInput}</strong>{' '}
            {totalNeedInput === 1 ? 'item needs' : 'items need'} your input
          </span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span>
            <strong className="text-slate-900 dark:text-slate-200">{agentOnline ? 1 : 0}</strong>{' '}
            {agentOnline ? 'agent active' : 'agents active'}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {/* Attention Category Tabs */}
        <div
          className="flex border-b border-slate-200 dark:border-[#1f2937] overflow-x-auto scrollbar-none"
          role="tablist"
          aria-label="Attention categories"
        >
          <button
            onClick={() => onSelectAttentionTab('need-input')}
            role="tab"
            aria-selected={activeAttentionTab === 'need-input'}
            className={`py-3 px-5 text-xs sm:text-[13px] font-medium transition-all whitespace-nowrap cursor-pointer border-b-2 flex items-center gap-2 ${
              activeAttentionTab === 'need-input'
                ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-500/5 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border-transparent hover:bg-slate-100/50 dark:hover:bg-[#1f2937]/30'
            }`}
          >
            <span>Need your input</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                attentionCounts['need-input'] > 0
                  ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                  : 'text-slate-500 bg-slate-100 dark:bg-slate-800/60'
              }`}
            >
              {attentionCounts['need-input']}
            </span>
          </button>

          <button
            onClick={() => onSelectAttentionTab('design-feedback')}
            role="tab"
            aria-selected={activeAttentionTab === 'design-feedback'}
            className={`py-3 px-5 text-xs sm:text-[13px] font-medium transition-all whitespace-nowrap cursor-pointer border-b-2 flex items-center gap-2 ${
              activeAttentionTab === 'design-feedback'
                ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-500/5 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border-transparent hover:bg-slate-100/50 dark:hover:bg-[#1f2937]/30'
            }`}
          >
            <span>Design feedback needed</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                attentionCounts['design-feedback'] > 0
                  ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                  : 'text-slate-500 bg-slate-100 dark:bg-slate-800/60'
              }`}
            >
              {attentionCounts['design-feedback']}
            </span>
          </button>

          <button
            onClick={() => onSelectAttentionTab('new-ideas')}
            role="tab"
            aria-selected={activeAttentionTab === 'new-ideas'}
            className={`py-3 px-5 text-xs sm:text-[13px] font-medium transition-all whitespace-nowrap cursor-pointer border-b-2 flex items-center gap-2 ${
              activeAttentionTab === 'new-ideas'
                ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-500/5 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border-transparent hover:bg-slate-100/50 dark:hover:bg-[#1f2937]/30'
            }`}
          >
            <span>New ideas</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                attentionCounts['new-ideas'] > 0
                  ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400'
                  : 'text-slate-500 bg-slate-100 dark:bg-slate-800/60'
              }`}
            >
              {attentionCounts['new-ideas']}
            </span>
          </button>
        </div>

        {/* Attention Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {currentCategoryItems.length === 0 ? (
            <div className="col-span-full text-center py-8 px-4 text-slate-500 dark:text-slate-400 text-sm bg-slate-50 dark:bg-[#0b1021]/40 rounded-lg border border-slate-200 dark:border-[#1f2937]/50">
              Nothing needs your attention right now in this category.
            </div>
          ) : (
            currentCategoryItems.map((item) => (
              <div
                key={item.id}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const primary = item.actions.find((a) => a.primary);
                    if (primary) onAttentionAction(item, primary.label);
                  }
                }}
                className="group border border-slate-200 dark:border-[#1f2937] hover:border-blue-500/60 bg-white dark:bg-[#111827] hover:bg-slate-50 dark:hover:bg-[#1f2937]/50 rounded-lg p-4 transition-all flex flex-col justify-between gap-3 focus-visible:outline-2 focus-visible:outline-blue-500 shadow-xs"
                role="region"
                aria-label={`${item.title}. ${item.desc}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                      {item.title}
                    </span>
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10 px-2 py-0.5 rounded-full shrink-0">
                      {item.count}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-1">{item.desc}</p>
                  {item.details && (
                    <p className="text-[11px] text-slate-500 italic mt-1 line-clamp-2">
                      {item.details}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-[#1f2937]/60">
                  {item.actions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => onAttentionAction(item, action.label)}
                      className={`flex-1 py-1.5 px-3 rounded text-xs font-medium transition-all cursor-pointer text-center ${
                        action.primary
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xs'
                          : 'bg-white dark:bg-transparent border border-slate-300 dark:border-[#1f2937] hover:bg-slate-100 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
