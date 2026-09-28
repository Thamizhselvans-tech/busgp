import React, { useState } from 'react';
import { Bus, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ScreenState } from '../types';

interface LoginPageProps {
  onNavigate: (screen: ScreenState) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') {
        onNavigate('ADMIN_DASHBOARD');
      } else if (loggedUser.role === 'officer') {
        onNavigate('OFFICER_DASHBOARD');
      } else {
        onNavigate('HOME');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
    setIsSubmitting(true);
    try {
      const loggedUser = await login(demoEmail, demoPass);
      if (loggedUser.role === 'admin') {
        onNavigate('ADMIN_DASHBOARD');
      } else if (loggedUser.role === 'officer') {
        onNavigate('OFFICER_DASHBOARD');
      } else {
        onNavigate('HOME');
      }
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center text-slate-950 mx-auto shadow-md">
            <Bus className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Sign In to SmartBus</h2>
          <p className="text-xs text-slate-500">Government Bus Complaint & Monitoring Portal</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* DEMO ACCESSIBLE SHORTCUT BUTTONS */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            ⚡ Quick Demo One-Click Logins
          </p>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoLogin('passenger@example.com', 'password123')}
              className="p-2.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 rounded-xl text-center space-y-1 transition group"
            >
              <UserCheck className="w-4 h-4 text-teal-600 mx-auto" />
              <span className="block text-[11px] font-bold text-slate-700 group-hover:text-teal-700">Passenger</span>
            </button>

            <button
              onClick={() => handleDemoLogin('officer.ramesh@tnbus.gov.in', 'officer123')}
              className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 rounded-xl text-center space-y-1 transition group"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600 mx-auto" />
              <span className="block text-[11px] font-bold text-slate-700 group-hover:text-indigo-700">Officer</span>
            </button>

            <button
              onClick={() => handleDemoLogin('admin@tnbus.gov.in', 'admin123')}
              className="p-2.5 bg-slate-50 hover:bg-slate-200 border border-slate-200 rounded-xl text-center space-y-1 transition group"
            >
              <Lock className="w-4 h-4 text-slate-800 mx-auto" />
              <span className="block text-[11px] font-bold text-slate-900">Admin</span>
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <button onClick={() => onNavigate('REGISTER')} className="font-bold text-teal-600 hover:underline">
              Create Passenger Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
