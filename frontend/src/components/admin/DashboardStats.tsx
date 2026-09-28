import React from 'react';
import { ClipboardList, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Complaint } from '../../types';

interface DashboardStatsProps {
  complaints: Complaint[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ complaints }) => {
  const total = complaints.length;
  const newSubmitted = complaints.filter((c) => c.status === 'submitted').length;
  const underReview = complaints.filter((c) => c.status === 'under_review').length;
  const inProgress = complaints.filter((c) => c.status === 'in_progress').length;
  const resolved = complaints.filter((c) => c.status === 'resolved').length;

  const stats = [
    { label: 'Total Complaints', count: total, icon: ClipboardList, color: 'bg-slate-100 text-slate-800 border-slate-200' },
    { label: 'New / Submitted', count: newSubmitted, icon: AlertCircle, color: 'bg-blue-50 text-blue-800 border-blue-200' },
    { label: 'Under Review', count: underReview, icon: Clock, color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { label: 'In Progress', count: inProgress, icon: Clock, color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    { label: 'Resolved', count: resolved, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className={`p-4 rounded-2xl border ${stat.color} shadow-sm space-y-2`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">{stat.label}</span>
              <Icon className="w-4 h-4 opacity-70" />
            </div>
            <p className="text-2xl font-black tracking-tight text-slate-900">{stat.count}</p>
          </div>
        );
      })}
    </div>
  );
};
