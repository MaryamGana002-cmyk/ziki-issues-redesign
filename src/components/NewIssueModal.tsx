import React, { useState } from 'react';
import { X, Plus, Bot } from 'lucide-react';
import { IssueItem } from '../types';

interface NewIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (issue: Omit<IssueItem, 'id' | 'number' | 'createdAt' | 'commentsCount'>) => void;
}

export const NewIssueModal: React.FC<NewIssueModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [platform, setPlatform] = useState<'web' | 'mobile' | 'api' | 'all'>('web');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [assignAgent, setAssignAgent] = useState(true);
  const [labelInput, setLabelInput] = useState('bug, feature');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const labels = labelInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status: 'open',
      platform,
      priority,
      author: 'Maryam Gana Mohammed',
      assignedAgent: assignAgent ? 'Contributor Alpha' : undefined,
      labels: labels.length > 0 ? labels : ['triage'],
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2937] bg-[#0f172a]">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Plus size={16} className="text-blue-400" />
            <span>Create New Issue</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-[#1f2937]"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Issue Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Fix session timeout on mobile safari"
              className="w-full bg-[#0b1021] border border-[#1f2937] focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, reproduction steps, or requirements..."
              className="w-full bg-[#0b1021] border border-[#1f2937] focus:border-blue-500 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
                className="w-full bg-[#0b1021] border border-[#1f2937] focus:border-blue-500 rounded-lg p-2 text-xs text-slate-300 focus:outline-none"
              >
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="api">API / Backend</option>
                <option value="all">Cross-platform</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-[#0b1021] border border-[#1f2937] focus:border-blue-500 rounded-lg p-2 text-xs text-slate-300 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Labels (comma-separated)
            </label>
            <input
              type="text"
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              className="w-full bg-[#0b1021] border border-[#1f2937] focus:border-blue-500 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none"
            />
          </div>

          <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={assignAgent}
              onChange={(e) => setAssignAgent(e.target.checked)}
              className="rounded border-slate-700 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
              <Bot size={13} className="text-blue-400" />
              Assign to Contributor Alpha immediately
            </span>
          </label>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1f2937]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-md border border-[#1f2937] hover:border-slate-500 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer"
            >
              Create Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
