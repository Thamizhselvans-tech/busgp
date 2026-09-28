import React from 'react';
import { User as UserIcon, LogOut, Bell, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ScreenState } from '../../types';
import { TamilNaduEmblem } from './TamilNaduEmblem';

interface HeaderProps {
  currentScreen?: ScreenState;
  onNavigate?: (screen: ScreenState) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate }) => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleNav = (target: ScreenState) => {
    if (onNavigate) onNavigate(target);
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left Emblem & Government Brand Title */}
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleNav('HOME')}>
          <TamilNaduEmblem className="w-10 h-10 shrink-0 group-hover:scale-105 transition-transform" />

          <div>
            <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
              Government of Tamil Nadu • Transport Department
            </span>
            <h1 className="text-sm sm:text-base font-black text-blue-900 tracking-tight leading-tight">
              SMART BUS COMPLAINT & MONITORING SYSTEM
            </h1>
            <span className="text-[9px] font-semibold text-slate-400 block -mt-0.5">
              Proposed Government Service – Demo
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-5 text-xs font-semibold text-slate-700">
          <button
            onClick={() => handleNav('HOME')}
            className={`transition ${currentScreen === 'HOME' ? 'text-blue-700 font-extrabold underline underline-offset-4' : 'hover:text-blue-700'}`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('NEARBY_BUSES')}
            className={`transition ${currentScreen === 'NEARBY_BUSES' ? 'text-blue-700 font-extrabold underline underline-offset-4' : 'hover:text-blue-700'}`}
          >
            Nearby Buses
          </button>
          <button
            onClick={() => handleNav('REPORT_COMPLAINT')}
            className={`transition ${currentScreen === 'REPORT_COMPLAINT' ? 'text-blue-700 font-extrabold underline underline-offset-4' : 'hover:text-blue-700'}`}
          >
            Report Complaint
          </button>
          <button
            onClick={() => handleNav('ROUTES')}
            className={`transition ${currentScreen === 'ROUTES' ? 'text-blue-700 font-extrabold underline underline-offset-4' : 'hover:text-blue-700'}`}
          >
            Routes
          </button>
          <button
            onClick={() => handleNav('TRACK_COMPLAINT')}
            className={`transition ${currentScreen === 'TRACK_COMPLAINT' ? 'text-blue-700 font-extrabold underline underline-offset-4' : 'hover:text-blue-700'}`}
          >
            Track Status
          </button>

          {isAuthenticated ? (
            <>
              <button
                onClick={() => handleNav('MY_COMPLAINTS')}
                className={`transition ${currentScreen === 'MY_COMPLAINTS' ? 'text-blue-700 font-extrabold underline underline-offset-4' : 'hover:text-blue-700'}`}
              >
                My Complaints
              </button>

              {user?.role === 'admin' && (
                <button
                  onClick={() => handleNav('ADMIN_DASHBOARD')}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Admin
                </button>
              )}

              {user?.role === 'officer' && (
                <button
                  onClick={() => handleNav('OFFICER_DASHBOARD')}
                  className="px-3 py-1.5 bg-indigo-900 text-white rounded-lg text-xs font-bold hover:bg-indigo-800 transition flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Officer
                </button>
              )}

              <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
                <button className="relative text-slate-500 hover:text-blue-700 transition">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full" />
                </button>

                <div
                  onClick={() => handleNav('PROFILE')}
                  className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs border border-blue-500">
                    {user?.name.charAt(0) || 'P'}
                  </div>
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[100px]">{user?.name}</span>
                </div>

                <button onClick={logout} title="Sign Out" className="text-slate-400 hover:text-rose-600 transition ml-1">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <button
                onClick={() => handleNav('LOGIN')}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
              >
                Login
              </button>
              <button
                onClick={() => handleNav('REGISTER')}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* Mobile Header Right Icons (Bell & Avatar) */}
        <div className="flex md:hidden items-center space-x-2">
          {isAuthenticated ? (
            <>
              <button className="p-1.5 text-slate-600 hover:text-blue-700 transition">
                <Bell className="w-5 h-5" />
              </button>
              <div
                onClick={() => handleNav('PROFILE')}
                className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs border border-blue-500 cursor-pointer"
              >
                {user?.name.charAt(0) || 'P'}
              </div>
            </>
          ) : (
            <button
              onClick={() => handleNav('LOGIN')}
              className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
