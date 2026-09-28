import React, { useState } from 'react';
import { Mail, Search, CheckCircle2, AlertCircle, Send, FileText } from 'lucide-react';
import { Complaint, ScreenState } from '../types';
import { api } from '../services/api';
import { Badge } from '../components/common/Badge';

interface EmailAcknowledgementPageProps {
  onNavigate: (screen: ScreenState) => void;
}

export const EmailAcknowledgementPage: React.FC<EmailAcknowledgementPageProps> = ({ onNavigate }) => {
  const [complaintIdInput, setComplaintIdInput] = useState('CMP-2026-000143');
  const [recipientEmail, setRecipientEmail] = useState('passenger@example.com');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ success: boolean; text: string; configured?: boolean } | null>(null);

  const handleLookup = async () => {
    if (!complaintIdInput.trim()) return;

    setIsLoading(true);
    setResultMessage(null);
    try {
      const res = await api.getComplaintById(complaintIdInput.trim());
      if (res.success && (res.complaint || res.data?.complaint)) {
        setComplaint(res.complaint || res.data?.complaint);
      } else {
        setComplaint(null);
        setResultMessage({ success: false, text: `No complaint record found for ID '${complaintIdInput}'.` });
      }
    } catch (err: any) {
      setComplaint(null);
      setResultMessage({ success: false, text: err.message || 'Lookup failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!complaint) return;

    setIsSending(true);
    setResultMessage(null);
    try {
      const res = await api.sendAcknowledgement(complaint.complaintId, recipientEmail);
      if (res.configured === false) {
        setResultMessage({
          success: false,
          configured: false,
          text: 'Email service (SMTP) is currently unconfigured. Set EMAIL_HOST and EMAIL_USER in environment variables to enable live email delivery.',
        });
      } else if (res.success) {
        setResultMessage({
          success: true,
          configured: true,
          text: res.message || `Official acknowledgement receipt sent to ${recipientEmail}.`,
        });
      } else {
        setResultMessage({
          success: false,
          text: res.message || 'Failed to send acknowledgement email.',
        });
      }
    } catch (err: any) {
      setResultMessage({
        success: false,
        text: err.message || 'Failed to send acknowledgement email.',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 pb-24">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Mail className="w-6 h-6 text-blue-600" />
          Email Acknowledgement
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Request official digital grievance receipt and acknowledgement confirmation via email
        </p>
      </div>

      {/* SEARCH CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLookup();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Enter Complaint Reference ID (e.g. CMP-2026-000143)..."
              value={complaintIdInput}
              onChange={(e) => setComplaintIdInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold uppercase focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition shrink-0 disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Lookup Receipt'}
          </button>
        </form>

        {resultMessage && (
          <div
            className={`p-4 rounded-xl text-xs border flex items-start gap-2.5 ${
              resultMessage.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            {resultMessage.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold">{resultMessage.success ? 'Success' : 'Email Service Status'}</p>
              <p className="mt-0.5">{resultMessage.text}</p>
            </div>
          </div>
        )}
      </div>

      {/* COMPLAINT ACKNOWLEDGEMENT DETAILS */}
      {complaint && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Receipt Record</span>
              <h3 className="text-xl font-black text-slate-900">{complaint.complaintId}</h3>
            </div>
            <Badge status={complaint.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Bus Number</span>
              <span className="font-extrabold text-slate-900 text-sm">{complaint.busNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
              <span className="font-extrabold text-blue-700 text-sm">{complaint.category}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Submission Date</span>
              <span className="font-semibold text-slate-800">{complaint.incidentDate || '27 Sep 2026'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Boarding Location</span>
              <span className="font-semibold text-slate-800">{complaint.boardingLocation}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700">Recipient Email Address</label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSendEmail}
              disabled={isSending}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Sending Acknowledgement...' : 'Send Acknowledgement'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
