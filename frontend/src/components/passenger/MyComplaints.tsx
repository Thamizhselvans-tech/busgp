import React, { useEffect, useState } from 'react';
import { ClipboardList, Bus as BusIcon, Calendar, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Complaint } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';

interface MyComplaintsProps {
  onTrackComplaint: (complaintId: string) => void;
  onNewComplaint: () => void;
}

export const MyComplaints: React.FC<MyComplaintsProps> = ({ onTrackComplaint, onNewComplaint }) => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserComplaints();
  }, [user]);

  const fetchUserComplaints = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getUserComplaints(user.id);
      if (response.success && response.data?.complaints) {
        setComplaints(response.data.complaints);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load your complaint history.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 text-sm">Loading your submitted complaints...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-teal-600" />
            My Submitted Complaints
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Track the status of all complaints submitted from your account</p>
        </div>

        <button
          onClick={onNewComplaint}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-sm transition"
        >
          + Report New Issue
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {complaints.length > 0 ? (
        <div className="grid gap-4">
          {complaints.map((c) => (
            <div
              key={c._id || c.complaintId}
              onClick={() => onTrackComplaint(c.complaintId)}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-teal-500 hover:shadow-md transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded">
                    {c.complaintId}
                  </span>
                  <span className="font-bold text-slate-800 text-sm flex items-center gap-1">
                    <BusIcon className="w-4 h-4 text-teal-600" />
                    {c.busNumber}
                  </span>
                </div>
                <Badge status={c.status} />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-teal-700">{c.category}</span>
                <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Submitted: {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-GB') : c.incidentDate}
                </span>

                <span className="font-semibold text-teal-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  View Timeline <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-800">No Complaints Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't submitted any complaints yet. You can report overcrowding, rash driving, or safety issues anytime.
            </p>
          </div>
          <button
            onClick={onNewComplaint}
            className="px-5 py-2.5 bg-teal-600 text-white font-semibold text-xs rounded-xl hover:bg-teal-700 transition"
          >
            Report a Complaint
          </button>
        </div>
      )}
    </div>
  );
};
