import React from 'react';
import { Home, Bus, FilePlus, ClipboardList, User as UserIcon } from 'lucide-react';
import { ScreenState } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface BottomNavProps {
  currentScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg md:hidden">
      <div className="flex justify-around items-center h-16 px-1">
        {/* 1. Home */}
        <button
          onClick={() => onNavigate('HOME')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition ${
            currentScreen === 'HOME' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* 2. Buses */}
        <button
          onClick={() => onNavigate('NEARBY_BUSES')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition ${
            currentScreen === 'NEARBY_BUSES' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bus className="w-5 h-5" />
          <span className="text-[10px]">Buses</span>
        </button>

        {/* 3. Report */}
        <button
          onClick={() => onNavigate('REPORT_COMPLAINT')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition ${
            currentScreen === 'REPORT_COMPLAINT' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FilePlus className="w-5 h-5" />
          <span className="text-[10px]">Report</span>
        </button>

        {/* 4. Complaints */}
        <button
          onClick={() => onNavigate('MY_COMPLAINTS')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition ${
            ['MY_COMPLAINTS', 'COMPLAINT_DETAILS', 'TRACK_COMPLAINT'].includes(currentScreen)
              ? 'text-blue-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px]">Complaints</span>
        </button>

        {/* 5. Profile / Account */}
        <button
          onClick={() => onNavigate(user ? 'PROFILE' : 'LOGIN')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition ${
            ['PROFILE', 'LOGIN', 'REGISTER', 'ADMIN_DASHBOARD', 'OFFICER_DASHBOARD'].includes(currentScreen)
              ? 'text-blue-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px]">{user ? 'Profile' : 'Login'}</span>
        </button>
      </div>
    </nav>
  );
};
