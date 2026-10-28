import React from 'react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-[84px] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-[#111827] border border-[#1f2937] text-[#f3f4f6] px-4 py-2.5 rounded-md text-xs sm:text-[13px] shadow-2xl flex items-center gap-2 pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200"
          role="status"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
          <span>{toast.text}</span>
        </div>
      ))}
    </div>
  );
};
