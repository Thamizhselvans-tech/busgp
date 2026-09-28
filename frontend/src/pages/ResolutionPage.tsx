import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, Search, Clock, FileText, UserCheck, AlertCircle } from 'lucide-react';
import { Complaint, ScreenState } from '../types';
import { api } from '../services/api';
import { Badge } from '../components/common/Badge';

interface ResolutionPageProps {
  onNavigate: (screen: ScreenState) => void;
}

export const ResolutionPage: React.FC<ResolutionPageProps> = ({ onNavigate }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchId, setSearchId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResolvedComplaints();
  }, []);

  const fetchResolvedComplaints = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getAllComplaints();
      if (res.success && (res.complaints || res.data?.complaints)) {
        const list: Complaint[] = res.complaints || res.data?.complaints || [];
        setComplaints(list);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch resolution records.');
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = complaints.filter(
    (c) =>
      c.complaintId.toLowerCase().includes(searchId.toLowerCase()) ||
      c.busNumber.toLowerCase().includes(searchId.toLowerCase()) ||
      c.category.toLowerCase().includes(searchId.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          Transparent Grievance Resolution
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Public administrative records of officer investigation actions, corrective measures, and resolution dates
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Complaint ID (e.g. CMP-2026-000143) or Bus Number..."
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div>
        <button
          onClick={fetchResolvedComplaints}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-xs rounded-xl transition shrink-0"
        >
          Refresh Records
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* RESOLUTION CARDS LIST */}
      {isLoading ? (
        <div className="py-8 text-center text-slate-400 text-xs">Loading resolution records...</div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((c) => {
            const isResolved = c.status === 'Resolved' || c.status === 'resolved';
            return (
              <div
                key={c._id || c.complaintId}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-emerald-500 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Grievance Reference</span>
                    <h3 className="text-xl font-black text-slate-900">{c.complaintId}</h3>
                  </div>
                  <Badge status={c.status} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Bus Number</span>
                    <span className="font-extrabold text-slate-900">{c.busNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                    <span className="font-extrabold text-blue-700">{c.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Officer</span>
                    <span className="font-semibold text-slate-800">{c.assignedOfficer || 'Officer Ramesh Kumar'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Incident Date</span>
                    <span className="font-semibold text-slate-800">{c.incidentDate}</span>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Grievance Description</span>
                  <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700">{c.description}</p>
                </div>

                {isResolved ? (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>✓ Complaint Resolved</span>
                    </div>
                    <div className="text-xs text-emerald-950 space-y-1">
                      <p><strong>Officer Remark:</strong> {c.adminRemark || 'Issue has been reviewed and necessary action has been taken by RTA officer.'}</p>
                      {c.resolvedAt && (
                        <p className="text-[11px] text-emerald-800">
                          <strong>Resolved Date:</strong> {new Date(c.resolvedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-900 flex items-center justify-between">
                    <span>Investigation in progress by Transport Enforcement Officer.</span>
                    <button
                      onClick={() => onNavigate('TRACK_COMPLAINT')}
                      className="px-3 py-1 bg-amber-200 hover:bg-amber-300 font-bold text-[11px] rounded-lg transition"
                    >
                      Track Progress
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-xs text-slate-500">
          No resolution records match your search query.
        </div>
      )}
    </div>
  );
};
