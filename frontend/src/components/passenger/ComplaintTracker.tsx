import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, Clock, ShieldCheck, AlertCircle, FileText, Check, ArrowRight } from 'lucide-react';
import { Complaint } from '../../types';
import { api } from '../../services/api';
import { Badge } from '../common/Badge';

interface ComplaintTrackerProps {
  initialComplaintId?: string | null;
  onNavigateHome?: () => void;
}

export const ComplaintTracker: React.FC<ComplaintTrackerProps> = ({ initialComplaintId, onNavigateHome }) => {
  const [searchId, setSearchId] = useState(initialComplaintId || '');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialComplaintId) {
      handleSearch(initialComplaintId);
    }
  }, [initialComplaintId]);

  const handleSearch = async (idToSearch?: string) => {
    const query = idToSearch || searchId.trim();
    if (!query) {
      setError('Please enter a Complaint ID.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getComplaintById(query);
      if (response.success && response.data?.complaint) {
        setComplaint(response.data.complaint);
      } else {
        setComplaint(null);
        setError(`No complaint found with ID '${query}'.`);
      }
    } catch (err: any) {
      setComplaint(null);
      setError(err.message || 'Failed to locate complaint records.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTimelineSteps = (currentStatus?: string) => {
    const statuses = ['submitted', 'under_review', 'in_progress', 'resolved'];
    const currentIdx = statuses.indexOf(currentStatus || 'submitted');

    return [
      { id: 'submitted', title: 'Complaint Submitted', desc: 'Complaint logged into monitoring database', done: currentIdx >= 0, active: currentIdx === 0 },
      { id: 'received', title: 'Complaint Received', desc: 'Received by Regional Transport Authority', done: currentIdx >= 0, active: currentIdx === 0 },
      { id: 'under_review', title: 'Under Review', desc: 'Assigned to Transport Officer for investigation', done: currentIdx >= 1, active: currentIdx === 1 },
      { id: 'in_progress', title: 'Action In Progress', desc: 'Depot manager taking corrective measures', done: currentIdx >= 2, active: currentIdx === 2 },
      { id: 'resolved', title: 'Resolved', desc: 'Case closed with official remark', done: currentIdx >= 3, active: currentIdx === 3 },
    ];
  };

  return (
    <div className="space-y-6">
      {/* Search Bar Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-teal-600" />
            Track Complaint Status
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Enter your Complaint Reference Number (e.g. CB-2026-000124)</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="e.g. CB-2026-000124"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Track Status'}
          </button>
        </form>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* TRACKING RESULTS CARD */}
      {complaint && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          {/* Top Info Grid */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Complaint ID</span>
                <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">{complaint.complaintId}</h4>
              </div>
              <Badge status={complaint.status} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-medium block">Bus Number</span>
                <span className="font-bold text-slate-900 text-sm">{complaint.busNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Category</span>
                <span className="font-semibold text-teal-700 text-sm">{complaint.category}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Submitted Date</span>
                <span className="font-medium text-slate-800 text-sm">
                  {complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : complaint.incidentDate}
                </span>
              </div>
            </div>

            <div className="text-xs pt-2 border-t border-slate-200/60">
              <span className="text-slate-500 font-medium block">Description:</span>
              <p className="text-slate-800 bg-white p-3 rounded-lg border border-slate-200 mt-1">{complaint.description}</p>
            </div>
          </div>

          {/* TIMELINE SECTION */}
          <div className="space-y-4 pt-2">
            <h4 className="text-base font-bold text-slate-900">Complaint Progress Timeline</h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {getTimelineSteps(complaint.status).map((step, idx) => (
                <div key={step.id} className="relative flex items-start gap-4">
                  {/* Circle Indicator */}
                  <div
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      step.done
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-50'
                        : step.active
                        ? 'bg-amber-500 text-white ring-4 ring-amber-50 animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {step.done ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                  </div>

                  <div className="space-y-0.5">
                    <h5 className={`text-sm font-bold ${step.done || step.active ? 'text-slate-900' : 'text-slate-400'}`}>
                      {step.title}
                    </h5>
                    <p className="text-xs text-slate-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RESOLVED OFFICER REMARK BANNER */}
          {complaint.status === 'resolved' && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>✓ Complaint Resolved</span>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <span className="font-semibold text-emerald-900 block">Officer Remark:</span>
                <p>{complaint.adminRemark || 'Issue has been reviewed and necessary action has been taken.'}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
