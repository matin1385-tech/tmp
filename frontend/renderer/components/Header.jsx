import React from 'react';
import { Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/router';

export default function Header({ onOpenSettings, showSettings = true }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('eea_auth');
    router.push('/login');
  };

  return (
    <header className="relative w-full bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm select-none">
      <div className="flex items-center gap-3">
        <img
          src="/images/logo-left.jpg"
          alt="Left Logo"
          className="h-10 w-auto object-contain rounded"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <span className="h-6 w-px bg-slate-300" />
        <span className="text-sm font-medium italic tracking-wide bg-gradient-to-r from-[#1e1b4b] to-indigo-500 bg-clip-text text-transparent">
          Dr.Saghaei
        </span>
      </div>

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <span className="text-xl font-semibold tracking-[0.3em] bg-gradient-to-r from-[#1e1b4b] to-indigo-500 bg-clip-text text-transparent">
          E.E.A
        </span>
      </div>

      <div className="flex items-center space-x-3">
        {showSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors shadow-sm cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-600" />
            <span>Settings</span>
          </button>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-red-100 hover:text-red-700 border border-slate-300 hover:border-red-300 transition-colors shadow-sm cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
        <img
          src="/images/logo-right.jpg"
          alt="Right Logo"
          className="h-10 w-auto object-contain rounded"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    </header>
  );
}
