import React from 'react';
import { STATUS_COLORS } from '../../utils/constants';

interface BadgeProps {
  status?: string;
  type?: 'status' | 'live' | 'mock' | 'busStatus';
  label?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, type = 'status', label, className = '' }) => {
  if (type === 'live') {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
        LIVE DATA
      </span>
    );
  }

  if (type === 'mock') {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
        DEMO / MANUAL
      </span>
    );
  }

  if (type === 'busStatus') {
    const isAct = status === 'active';
    const isMaint = status === 'maintenance';
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isAct
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : isMaint
            ? 'bg-amber-50 text-amber-700 border border-amber-200'
            : 'bg-slate-100 text-slate-700 border border-slate-300'
        } ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isAct ? 'bg-emerald-500' : isMaint ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
        {status ? status.toUpperCase() : 'UNKNOWN'}
      </span>
    );
  }

  const colorConfig = (status && STATUS_COLORS[status]) || {
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-300',
    label: status || 'Unknown',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${colorConfig.bg} ${colorConfig.text} border ${colorConfig.border} ${className}`}
    >
      {label || colorConfig.label}
    </span>
  );
};
