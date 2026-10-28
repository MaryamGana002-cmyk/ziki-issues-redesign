import React, { useState } from 'react';
import { X, Sliders, Bell, ShieldCheck } from 'lucide-react';
import { AgentSettings } from '../types';

interface AgentSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: AgentSettings) => void;
}

export const AgentSettingsPanel: React.FC<AgentSettingsPanelProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [settings, setSettings] = useState<AgentSettings>({
    notifyOnInput: true,
    autoApproveSafe: true,
    autonomyLevel: 'standard',
    maxConcurrentIssues: 2,
  });

  if (!isOpen) return null;

  const handleToggleNotify = () => {
    setSettings((prev) => {
      const next = { ...prev, notifyOnInput: !prev.notifyOnInput };
      onSave(next);
      return next;
    });
  };

  const handleToggleAutoApprove = () => {
    setSettings((prev) => {
      const next = { ...prev, autoApproveSafe: !prev.autoApproveSafe };
      onSave(next);
      return next;
    });
  };

  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-5 mb-6 shadow-xl animate-in fade-in duration-200">
      <div className="flex items-start justify-between gap-4 mb-3 border-b border-[#1f2937] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Sliders size={15} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Agent settings — Contributor Alpha
            </h3>
            <p className="text-xs text-slate-400">
              Configure autonomy, notification preferences, and approval thresholds.
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-[#1f2937] transition-colors"
          aria-label="Close settings"
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {/* Checkbox 1 */}
        <label className="flex items-start gap-3 p-3 rounded-lg border border-[#1f2937] hover:border-slate-600 bg-[#0f172a] cursor-pointer select-none transition-colors">
          <input
            type="checkbox"
            checked={settings.notifyOnInput}
            onChange={handleToggleNotify}
            className="mt-0.5 w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <div>
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Bell size={12} className="text-blue-400" />
              <span>Notify me when agent needs input</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Send immediate alert whenever a blocker, design approval, or bid plan requires attention.
            </p>
          </div>
        </label>

        {/* Checkbox 2 */}
        <label className="flex items-start gap-3 p-3 rounded-lg border border-[#1f2937] hover:border-slate-600 bg-[#0f172a] cursor-pointer select-none transition-colors">
          <input
            type="checkbox"
            checked={settings.autoApproveSafe}
            onChange={handleToggleAutoApprove}
            className="mt-0.5 w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <div>
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-emerald-400" />
              <span>Auto-approve safe, reversible actions</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Permit static lint fixes, test generation, and branch creation without manual sign-off.
            </p>
          </div>
        </label>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onClose}
          className="w-full sm:w-auto px-5 py-1.5 rounded-md border border-[#1f2937] hover:border-slate-500 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          Close settings
        </button>
      </div>
    </div>
  );
};
