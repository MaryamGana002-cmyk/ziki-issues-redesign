import React, { useState } from 'react';
import {
  ChevronDown,
  Bell,
  Bot,
  Shield,
  Volume2,
  Check,
  Sun,
  Moon
} from 'lucide-react';

interface HeaderProps {
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  onShowToast: (msg: string) => void;
  agentOnlineCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  theme = 'dark',
  onToggleTheme,
  onShowToast,
  agentOnlineCount,
}) => {
  const [activeNav, setActiveNav] = useState<'product' | 'marketing' | 'security'>('product');
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [agentsDropdownOpen, setAgentsDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-[#0b1329] text-white border-b border-[#1b2644] sticky top-0 z-40 transition-colors">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Brand & Org Switcher */}
        <div className="flex items-center gap-5 sm:gap-6">
          <div className="flex items-center gap-2.5">
            <a
              href="#"
              className="flex items-center gap-2 text-white font-bold tracking-tight hover:opacity-90 transition-opacity cursor-pointer"
              aria-label="Ziki home"
            >
              {/* Ziki Exact Geometric Logo Icon matching reference screenshot */}
              <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 sm:w-7 sm:h-7"
                  aria-hidden="true"
                >
                  {/* Arrowhead Accent above top-right of Z */}
                  <path
                    d="M21.5 2.5C21.9 2.5 22.3 2.7 22.5 3.1L27.2 10.6C27.6 11.3 27.1 12.2 26.3 12.2H16.7C15.9 12.2 15.4 11.3 15.8 10.6L20.5 3.1C20.7 2.7 21.1 2.5 21.5 2.5Z"
                    fill="#2563EB"
                  />
                  {/* Stylized Bold Z */}
                  <path
                    d="M5.5 13.5C4.67 13.5 4 14.17 4 15C4 15.83 4.67 16.5 5.5 16.5H20.6L5.2 27.2C4.5 27.7 4.5 28.7 5.2 29.2C5.55 29.45 5.95 29.5 6.35 29.5H26.5C27.33 29.5 28 28.83 28 28C28 27.17 27.33 26.5 26.5 26.5H11.4L26.8 15.8C27.5 15.3 27.5 14.3 26.8 13.8C26.45 13.55 26.05 13.5 25.65 13.5H5.5Z"
                    fill="#2563EB"
                  />
                </svg>
              </div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-white select-none">ziki</span>
            </a>

            <span className="text-slate-600/80 select-none text-sm font-light mx-0.5 sm:mx-1">|</span>

            <div className="relative">
              <button
                onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-200 hover:text-white transition-colors cursor-pointer py-1 px-1 rounded"
                aria-expanded={orgDropdownOpen}
              >
                <span>Ziki</span>
                <ChevronDown size={13} className="text-slate-400" />
              </button>
              {orgDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-[#0f172a] border border-[#1e293b] rounded-lg shadow-2xl py-1.5 z-50 text-xs">
                  <div className="px-3 py-1 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                    Organizations
                  </div>
                  <button
                    onClick={() => {
                      setOrgDropdownOpen(false);
                      onShowToast('Switched to Ziki Workspace');
                    }}
                    className="w-full text-left px-3 py-2 flex items-center justify-between text-slate-200 hover:bg-[#1e293b]"
                  >
                    <span>Ziki (Default)</span>
                    <Check size={13} className="text-blue-400" />
                  </button>
                  <button
                    onClick={() => {
                      setOrgDropdownOpen(false);
                      onShowToast('Switched to HNG Labs');
                    }}
                    className="w-full text-left px-3 py-2 text-slate-400 hover:bg-[#1e293b] hover:text-slate-200"
                  >
                    <span>HNG Labs</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Center: Nav Tabs */}
          <nav className="hidden md:flex items-center gap-4 sm:gap-5" aria-label="Main Navigation">
            <button
              onClick={() => {
                setActiveNav('product');
                onShowToast('Product space active');
              }}
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium transition-all py-1 px-3 rounded-full cursor-pointer ${
                activeNav === 'product'
                  ? 'text-white bg-[#142850] border border-[#1e3e78] font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Circle-dot icon matching ⊙ in screenshot */}
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-blue-400" aria-hidden="true">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="8" cy="8" r="2.2" fill="currentColor" />
              </svg>
              <span>Product</span>
            </button>
            <button
              onClick={() => {
                setActiveNav('marketing');
                onShowToast('Marketing space (Demo view)');
              }}
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium transition-all py-1 px-2.5 rounded-full cursor-pointer ${
                activeNav === 'marketing'
                  ? 'text-white bg-[#142850] border border-[#1e3e78]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Volume2 size={14} className="text-slate-400" />
              <span>Marketing</span>
            </button>
            <button
              onClick={() => {
                setActiveNav('security');
                onShowToast('Security space (Demo view)');
              }}
              className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium transition-all py-1 px-2.5 rounded-full cursor-pointer ${
                activeNav === 'security'
                  ? 'text-white bg-[#142850] border border-[#1e3e78]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield size={14} className="text-slate-400" />
              <span>Security</span>
            </button>
          </nav>
        </div>

        {/* Right Side: Agents, User, Points, Notifications, Light/Dark Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Agents Pill Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAgentsDropdownOpen(!agentsDropdownOpen)}
              className="bg-[#0c1830] hover:bg-[#132749] border border-[#1e355f] text-blue-400 rounded-full py-1 px-2.5 sm:px-3 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              aria-label="Agents menu"
            >
              <Bot size={13} className="text-blue-400" />
              <span className="font-semibold text-[11px] sm:text-xs text-white">Agents</span>
              <ChevronDown size={11} className="text-slate-400" />
            </button>
            {agentsDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-2xl py-2 z-50 text-xs">
                <div className="px-3 py-1 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  Active Fleet
                </div>
                <div className="px-3 py-2 border-b border-[#1e293b] flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-200">Contributor Alpha</p>
                    <p className="text-[11px] text-slate-400">
                      {agentOnlineCount > 0 ? 'Working on delegated issues' : 'Offline / Standby'}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      agentOnlineCount > 0
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {agentOnlineCount > 0 ? 'Online' : 'Idle'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setAgentsDropdownOpen(false);
                    onShowToast('Fleet dashboard opened');
                  }}
                  className="w-full text-left px-3 py-2 text-blue-400 hover:bg-[#1e293b] font-medium"
                >
                  Manage all agents →
                </button>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 bg-[#0c1830] hover:bg-[#132749] border border-[#1e355f] rounded-full py-1 px-2 sm:px-2.5 text-slate-200 hover:text-white transition-all cursor-pointer"
              aria-label="User profile"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-900 border border-slate-600 shrink-0 flex items-center justify-center">
                {/* Monochrome stylized portrait matching Maryam Gana Mohammed in hijab */}
                <svg viewBox="0 0 36 36" fill="none" className="w-full h-full" aria-hidden="true">
                  <rect width="36" height="36" fill="#0b0f19" />
                  <path d="M18 6C13.5 6 10 9.8 10 14.5C10 19.5 12.8 23 15 25C11 27 7 29.5 5 36H31C29 29.5 25 27 21 25C23.2 23 26 19.5 26 14.5C26 9.8 22.5 6 18 6Z" fill="#1e2538" />
                  {/* Hijab wrap */}
                  <path d="M18 7C14 7 11.5 10 11.5 14C11.5 18 13.5 21 16 23C13 25.5 9 28 6 36H30C27 28 23 25.5 20 23C22.5 21 24.5 18 24.5 14C24.5 10 22 7 18 7Z" fill="#111625" />
                  {/* Face contour */}
                  <ellipse cx="18" cy="14.5" rx="4.5" ry="5.5" fill="#e2e8f0" />
                  {/* Hijab shadow around face */}
                  <path d="M13.5 13C13.5 9.5 15.5 9 18 9C20.5 9 22.5 9.5 22.5 13C22.5 14 22 17 21 18.5C19.5 16 16.5 16 15 18.5C14 17 13.5 14 13.5 13Z" fill="#090d16" opacity="0.9" />
                  <ellipse cx="18" cy="15" rx="3.5" ry="4.2" fill="#cbd5e1" />
                  {/* Eyes / Features subtle */}
                  <ellipse cx="16.5" cy="14.2" rx="0.6" ry="0.4" fill="#334155" />
                  <ellipse cx="19.5" cy="14.2" rx="0.6" ry="0.4" fill="#334155" />
                  <path d="M17.2 16.8Q18 17.3 18.8 16.8" stroke="#475569" strokeWidth="0.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-slate-200 max-w-[90px] sm:max-w-[130px] truncate">
                Maryam Gana Mohamm…
              </span>
              <ChevronDown size={11} className="text-slate-400" />
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-2xl py-1.5 z-50 text-xs">
                <div className="px-3 py-2 border-b border-[#1e293b]">
                  <p className="font-semibold text-slate-200">Maryam Gana Mohammed</p>
                  <p className="text-[11px] text-slate-400 truncate">meemabintzeenab@gmail.com</p>
                </div>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onShowToast('Account settings viewed');
                  }}
                  className="w-full text-left px-3 py-2 text-slate-200 hover:bg-[#1e293b]"
                >
                  Account Settings
                </button>
                <div className="border-t border-[#1e293b] my-1"></div>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onShowToast('Signed out of demo session');
                  }}
                  className="w-full text-left px-3 py-1.5 text-rose-400 hover:bg-[#1e293b]"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Points Badge */}
          <div
            className="flex items-center gap-1.5 bg-[#382408] border border-[#6b4712] text-[#fcd34d] px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold select-none shrink-0"
            title="Reputation points earned from accepted agent contributions"
          >
            <span>🏆</span>
            <span>4720 pts</span>
          </div>

          {/* Notifications Bell with Counter Badge */}
          <button
            onClick={() => onShowToast('9 unread notification updates')}
            className="relative p-1 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Notifications (9 unread)"
            title="9 unread notifications"
          >
            <Bell size={18} />
            <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 px-1 bg-blue-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-xs">
              9
            </span>
          </button>

          {/* Light / Dark Mode Toggle */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="w-7 h-7 rounded-full bg-[#0c1830] hover:bg-[#132749] border border-[#1e355f] hover:border-blue-400/80 flex items-center justify-center text-amber-300 dark:text-blue-300 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-400 shrink-0"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <Moon size={13} className="text-slate-300 hover:text-white" />
              ) : (
                <Sun size={13} className="text-amber-400" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
