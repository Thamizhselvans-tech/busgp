import React from 'react';
import { ArrowLeft, Check, Bus as BusIcon, Clock, ShieldCheck } from 'lucide-react';
import { Complaint, ScreenState } from '../types';
import { Badge } from '../components/common/Badge';

interface ComplaintDetailsPageProps {
  complaint: Complaint | null;
  onNavigate: (screen: ScreenState) => void;
}

export const ComplaintDetailsPage: React.FC<ComplaintDetailsPageProps> = ({ complaint, onNavigate }) => {
  const comp = complaint || {
    complaintId: 'CMP-2026-000143',
    busNumber: '21G',
    route: 'Tambaram → Guindy',
    category: 'Bus did not stop',
    description: 'Bus 21G skipped the Saidapet stop at 8:30 PM despite multiple waiting passengers waving signal.',
    status: 'Pending',
    createdAt: '2026-09-27T20:32:00Z',
    boardingLocation: 'Saidapet',
    destination: 'Guindy',
    incidentDate: '27 Sep 2026',
    incidentTime: '08:32 PM',
  };

  const steps = [
    { title: 'Submitted', date: '27 Sep 2026, 08:32 PM', done: true },
    { title: 'Assigned', date: '27 Sep 2026, 09:10 PM', done: true },
    { title: 'Under Investigation', date: 'In Progress', done: false, active: true },
    { title: 'Action Taken', date: 'Pending', done: false },
    { title: 'Resolved', date: 'Pending', done: false },
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6 pb-24">
      {/* Header back button */}
      <button
        onClick={() => onNavigate('MY_COMPLAINTS')}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Complaints</span>
      </button>

      {/* Complaint Title & Status */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Complaint Reference</span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">{comp.complaintId}</h2>
          </div>
          <Badge status={comp.status} />
        </div>

        {/* TIMELINE WITH DOTS & LINES */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Investigation Timeline</h4>

          <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex items-start gap-3">
                <div
                  className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
                    step.done
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                      : step.active
                      ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                      : 'bg-slate-200 border-2 border-white'
                  }`}
                >
                  {step.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>

                <div>
                  <h5 className={`text-xs font-bold ${step.done || step.active ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.title}
                  </h5>
                  <p className="text-[11px] text-slate-500">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BUS INFO CARD */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <span className="text-xs font-bold text-slate-700 block">Bus Information</span>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-base shrink-0">
              <BusIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm">{comp.busNumber}</h4>
              <p className="text-xs font-medium text-slate-600">{comp.route}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
