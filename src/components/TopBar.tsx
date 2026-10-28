import React, { useState } from 'react';
import { X } from 'lucide-react';

interface TopBarProps {
  onSetDefault: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onSetDefault }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <aside aria-label="Browser notification" className="bg-[#1e1b4b] text-[#9ca3af] text-xs px-5 py-1.5 flex items-center justify-between border-b border-[#2e2a72]">
      <span className="font-normal text-slate-300">
        Google Chrome isn't your default browser
      </span>
      <div className="flex items-center gap-3">
        <button
          onClick={onSetDefault}
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
        >
          Set as default
        </button>
        <button
          onClick={() => setVisible(false)}
          className="text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5 rounded"
          aria-label="Dismiss banner"
        >
          <X size={13} />
        </button>
      </div>
    </aside>
  );
};
