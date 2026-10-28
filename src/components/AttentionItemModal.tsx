import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, Bot, Lightbulb, Palette, AlertCircle } from 'lucide-react';
import { AttentionItem } from '../types';

interface AttentionItemModalProps {
  item: AttentionItem | null;
  onClose: () => void;
  onConfirm: (item: AttentionItem, actionTitle: string, feedbackNote?: string) => void;
}

export const AttentionItemModal: React.FC<AttentionItemModalProps> = ({
  item,
  onClose,
  onConfirm,
}) => {
  const [feedbackNote, setFeedbackNote] = useState('');

  if (!item) return null;

  const getIcon = () => {
    switch (item.category) {
      case 'need-input':
        return <AlertCircle size={20} className="text-amber-400" />;
      case 'design-feedback':
        return <Palette size={20} className="text-purple-400" />;
      case 'new-ideas':
        return <Lightbulb size={20} className="text-blue-400" />;
      default:
        return <Bot size={20} className="text-blue-400" />;
    }
  };

  const primaryAction = item.actions.find((a) => a.primary) || item.actions[0];
  const secondaryAction = item.actions.find((a) => !a.primary);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2937] bg-[#0f172a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1e293b] flex items-center justify-center">
              {getIcon()}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">{item.title}</h3>
              <p className="text-[11px] text-slate-400">Contributor Alpha waiting for your decision</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#1f2937] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="bg-[#0b1021] border border-[#1f2937] rounded-lg p-3.5">
            <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            {item.details && (
              <div className="mt-2.5 pt-2.5 border-t border-[#1f2937] text-xs text-slate-400">
                <strong className="text-slate-300 font-medium">Proposed Solution: </strong>
                {item.details}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Additional Instructions / Notes (Optional)
            </label>
            <textarea
              value={feedbackNote}
              onChange={(e) => setFeedbackNote(e.target.value)}
              placeholder="e.g., Looks solid, please proceed with PR"
              rows={3}
              className="w-full bg-[#0b1021] border border-[#1f2937] focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-[#1f2937] bg-[#0f172a]">
          {secondaryAction && (
            <button
              onClick={() => onConfirm(item, secondaryAction.label, feedbackNote)}
              className="px-3.5 py-1.5 rounded-md border border-[#1f2937] hover:border-slate-500 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {secondaryAction.label}
            </button>
          )}
          <button
            onClick={() => onConfirm(item, primaryAction.label, feedbackNote)}
            className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <CheckCircle size={13} />
            <span>{primaryAction.label}</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
