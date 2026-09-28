import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, Clock, Eye, AlertCircle, Edit3, X } from 'lucide-react';
import { Complaint, ComplaintStatus } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';

export const OfficerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolution modal state
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [statusInput, setStatusInput] = useState<ComplaintStatus>('in_progress');
  const [remarkInput, setRemarkInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchOfficerComplaints();
  }, [user]);

  const fetchOfficerComplaints = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch all complaints, filtering for officer assignment or all
      const response = await api.getAllComplaints();
      if (response.success && response.data?.complaints) {
        // Filter complaints assigned to this officer, or all if name match
        const allComps: Complaint[] = response.data.complaints;
        if (user?.name) {
          const assigned = allComps.filter(
            (c) =>
              !c.assignedOfficer ||
              c.assignedOfficer.toLowerCase().includes(user.name.toLowerCase()) ||
              c.assignedOfficer.toLowerCase().includes('officer')
          );
          setComplaints(assigned.length > 0 ? assigned : allComps);
        } else {
          setComplaints(allComps);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch assigned complaints.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveResolution = async () => {
    if (!selectedComplaint?._id) return;

    setIsProcessing(true);
    try {
      if (statusInput === 'resolved') {
        await api.resolveComplaint(selectedComplaint._id, remarkInput || 'Issue reviewed and resolved by Transport Officer.');
      } else {
        await api.updateComplaintStatus(selectedComplaint._id, {
          status: statusInput,
          adminRemark: remarkInput,
        });
      }
      setSelectedComplaint(null);
      await fetchOfficerComplaints();
    } catch (err: any) {
      setError(err.message || 'Failed to update complaint.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 text-sm">Loading assigned complaint queue...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-teal-500 text-slate-950 font-extrabold px-2.5 py-0.5 rounded">
              OFFICER PORTAL
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {user?.id}</span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1">{user?.name}</h2>
          <p className="text-xs text-slate-400">Assigned Transport Enforcement Officer • Tamil Nadu RTA</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold bg-slate-800/80 p-3 rounded-xl border border-slate-700">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Assigned</span>
            <span className="text-white text-base font-bold">{complaints.length}</span>
          </div>
          <div className="w-px h-8 bg-slate-700"></div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase">Pending</span>
            <span className="text-amber-400 text-base font-bold">{complaints.filter((c) => c.status !== 'resolved').length}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Complaints List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          Assigned Complaint Queue
        </h3>

        {complaints.length > 0 ? (
          <div className="grid gap-4">
            {complaints.map((c) => (
              <div
                key={c._id || c.complaintId}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 hover:border-teal-500 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-base bg-slate-100 px-3 py-0.5 rounded-lg border border-slate-200">
                      {c.complaintId}
                    </span>
                    <span className="font-bold text-slate-800 text-sm">Bus: {c.busNumber}</span>
                  </div>
                  <Badge status={c.status} />
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-bold text-teal-700 text-sm">{c.category}</span>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">{c.description}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Boarding Location</span>
                    <span className="font-semibold text-slate-800">{c.boardingLocation}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Destination</span>
                    <span className="font-semibold text-slate-800">{c.destination}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Date & Time</span>
                    <span className="font-semibold text-slate-800">{c.incidentDate} at {c.incidentTime}</span>
                  </div>
                </div>

                {c.adminRemark && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900">
                    <strong className="block text-emerald-950 font-semibold">Officer Remark:</strong>
                    <p className="mt-0.5">{c.adminRemark}</p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedComplaint(c);
                      setStatusInput(c.status);
                      setRemarkInput(c.adminRemark || '');
                    }}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Update Status & Remark</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500 text-xs">
            No complaints currently assigned to your queue.
          </div>
        )}
      </div>

      {/* UPDATE STATUS MODAL */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 relative">
            <button
              onClick={() => setSelectedComplaint(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
              Investigate & Update - {selectedComplaint.complaintId}
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Set Progress Status</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value as ComplaintStatus)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  <option value="under_review">Under Review</option>
                  <option value="in_progress">Action In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Officer Findings & Action Remark *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter details of action taken (e.g. driver warned, depot check conducted, fine levied)..."
                  value={remarkInput}
                  onChange={(e) => setRemarkInput(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 bg-slate-100 text-xs font-semibold text-slate-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveResolution}
                disabled={isProcessing}
                className="px-5 py-2 bg-teal-600 text-xs font-semibold text-white rounded-xl hover:bg-teal-700 shadow-sm"
              >
                Save Official Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
