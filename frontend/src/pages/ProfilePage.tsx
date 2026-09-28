import React from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  ClipboardList,
  Bell,
  Edit,
  Lock,
  HelpCircle,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ScreenState } from '../types';

interface ProfilePageProps {
  onNavigate: (screen: ScreenState) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 text-center space-y-4">
        <p className="text-sm text-slate-600">Please sign in to view your profile details.</p>
        <button
          onClick={() => onNavigate('LOGIN')}
          className="px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6 pb-24">
      {/* Top Header */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onNavigate('HOME')}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200/60 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black text-slate-900">Profile</h1>
      </div>

      {/* User Profile Info Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-blue-400 shrink-0">
          {user.name.charAt(0)}
        </div>
        <div className="space-y-1 overflow-hidden">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 truncate">{user.name}</h2>
            <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded-full uppercase">
              {user.role}
            </span>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{user.email}</span>
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{user.phone || '+91 98765 43210'}</span>
          </p>
        </div>
      </div>

      {/* Options List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {/* 1. My Complaints */}
        <button
          onClick={() => onNavigate('MY_COMPLAINTS')}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition text-left group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
              <ClipboardList className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800">My Complaints</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 2. Notifications */}
        <button
          onClick={() => alert('You have 3 active system notifications.')}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition text-left group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
              <Bell className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800">Notifications</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-5 h-5 bg-rose-500 text-white rounded-full text-[11px] font-extrabold flex items-center justify-center">
              3
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* 3. Edit Profile */}
        <button
          onClick={() => alert('Profile editing is enabled.')}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition text-left group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
              <Edit className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800">Edit Profile</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 4. Change Password */}
        <button
          onClick={() => alert('Password update form opens.')}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition text-left group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800">Change Password</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 5. Help & Support */}
        <button
          onClick={() => onNavigate('HELP')}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition text-left group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-slate-800">Help & Support</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Logout Button */}
      <button
        onClick={() => {
          logout();
          onNavigate('LOGIN');
        }}
        className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-sm rounded-2xl border border-rose-200 transition flex items-center justify-center space-x-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>
    </div>
  );
};
