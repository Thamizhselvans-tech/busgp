import React, { useState } from 'react';
import { Search, Filter, Eye, CheckCircle2, UserCheck, Edit3, X, MapPin, Calendar, Bus as BusIcon } from 'lucide-react';
import { Complaint, ComplaintCategory, ComplaintStatus } from '../../types';
import { COMPLAINT_CATEGORIES } from '../../utils/constants';
import { Badge } from '../common/Badge';

interface ComplaintsTableProps {
  complaints: Complaint[];
  onUpdateStatus: (id: string, status: ComplaintStatus, remark?: string) => Promise<void>;
  onAssignOfficer: (id: string, officerName: string) => Promise<void>;
  onResolve: (id: string, remark: string) => Promise<void>;
}

export const ComplaintsTable: React.FC<ComplaintsTableProps> = ({
  complaints,
  onUpdateStatus,
  onAssignOfficer,
  onResolve,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal states
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'assign' | 'resolve' | 'status' | null>(null);

  const [officerInput, setOfficerInput] = useState('');
  const [statusInput, setStatusInput] = useState<ComplaintStatus>('under_review');
  const [remarkInput, setRemarkInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const filtered = complaints.filter((c) => {
    const matchesSearch =
      c.complaintId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.boardingLocation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAction = async () => {
    if (!selectedComplaint?._id) return;

    setIsProcessing(true);
    try {
      if (modalMode === 'assign') {
        await onAssignOfficer(selectedComplaint._id, officerInput);
      } else if (modalMode === 'status') {
        await onUpdateStatus(selectedComplaint._id, statusInput, remarkInput);
      } else if (modalMode === 'resolve') {
        await onResolve(selectedComplaint._id, remarkInput || 'Issue reviewed and resolved.');
      }
      setModalMode(null);
      setSelectedComplaint(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      {/* Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Complaint Records</h3>
          <p className="text-xs text-slate-500">Filter, inspect, assign officers, and update complaint progress</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative w-full sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Categories</option>
            {COMPLAINT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100/80 text-slate-600 border-y border-slate-200">
              <th className="py-3 px-4 font-bold">Complaint ID</th>
              <th className="py-3 px-4 font-bold">Bus Number</th>
              <th className="py-3 px-4 font-bold">Category</th>
              <th className="py-3 px-4 font-bold">Location</th>
              <th className="py-3 px-4 font-bold">Date</th>
              <th className="py-3 px-4 font-bold">Status</th>
              <th className="py-3 px-4 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <tr key={c._id || c.complaintId} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-extrabold text-slate-900">{c.complaintId}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{c.busNumber}</td>
                  <td className="py-3 px-4 font-medium text-teal-700">{c.category}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-[150px] truncate">{c.boardingLocation}</td>
                  <td className="py-3 px-4 text-slate-500">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-GB') : c.incidentDate}
                  </td>
                  <td className="py-3 px-4">
                    <Badge status={c.status} />
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => {
                        setSelectedComplaint(c);
                        setModalMode('view');
                      }}
                      className="p-1.5 text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedComplaint(c);
                        setOfficerInput(c.assignedOfficer || 'Officer Ramesh Kumar');
                        setModalMode('assign');
                      }}
                      className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                      title="Assign Officer"
                    >
                      <UserCheck className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedComplaint(c);
                        setStatusInput(c.status);
                        setRemarkInput(c.adminRemark || '');
                        setModalMode('status');
                      }}
                      className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition"
                      title="Update Status"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {c.status !== 'resolved' && (
                      <button
                        onClick={() => {
                          setSelectedComplaint(c);
                          setRemarkInput(c.adminRemark || 'Issue has been reviewed and necessary action has been taken.');
                          setModalMode('resolve');
                        }}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        title="Mark Resolved"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                  No complaints match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="block md:hidden space-y-3">
        {filtered.length > 0 ? (
          filtered.map((c) => (
            <div key={c._id || c.complaintId} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-900">{c.complaintId}</span>
                <Badge status={c.status} />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold text-slate-800">{c.busNumber} • {c.category}</p>
                <p className="text-slate-600 truncate">{c.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setSelectedComplaint(c);
                    setModalMode('view');
                  }}
                  className="px-3 py-1 bg-white border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    setSelectedComplaint(c);
                    setRemarkInput(c.adminRemark || 'Issue has been reviewed and necessary action has been taken.');
                    setModalMode('resolve');
                  }}
                  className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                >
                  Resolve
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-slate-400 text-xs">No complaints match your search.</div>
        )}
      </div>

      {/* MODAL DIALOGS */}
      {modalMode && selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5 relative">
            <button
              onClick={() => setModalMode(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* VIEW MODAL */}
            {modalMode === 'view' && (
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Complaint Details - {selectedComplaint.complaintId}
                </h4>
                <div className="space-y-2 text-xs text-slate-700">
                  <p><strong>Bus Number:</strong> {selectedComplaint.busNumber}</p>
                  <p><strong>Category:</strong> {selectedComplaint.category}</p>
                  <p><strong>Route:</strong> {selectedComplaint.route}</p>
                  <p><strong>Boarding Location:</strong> {selectedComplaint.boardingLocation}</p>
                  <p><strong>Destination:</strong> {selectedComplaint.destination}</p>
                  <p><strong>Assigned Officer:</strong> {selectedComplaint.assignedOfficer || 'Not Assigned'}</p>
                  <p><strong>Status:</strong> {selectedComplaint.status}</p>
                  <div>
                    <strong>Description:</strong>
                    <p className="bg-slate-50 p-3 rounded-lg border border-slate-200 mt-1">{selectedComplaint.description}</p>
                  </div>
                  {selectedComplaint.adminRemark && (
                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-emerald-900">
                      <strong>Remark:</strong> {selectedComplaint.adminRemark}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ASSIGN OFFICER MODAL */}
            {modalMode === 'assign' && (
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-slate-900">Assign Transport Officer</h4>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select / Enter Officer Name</label>
                  <select
                    value={officerInput}
                    onChange={(e) => setOfficerInput(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Officer Ramesh Kumar">Officer Ramesh Kumar</option>
                    <option value="Officer Priya Selvam">Officer Priya Selvam</option>
                    <option value="Officer Suresh Rajan">Officer Suresh Rajan</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setModalMode(null)}
                    className="px-4 py-2 bg-slate-100 text-xs font-semibold text-slate-700 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAction}
                    disabled={isProcessing}
                    className="px-5 py-2 bg-teal-600 text-xs font-semibold text-white rounded-xl hover:bg-teal-700"
                  >
                    Confirm Assignment
                  </button>
                </div>
              </div>
            )}

            {/* UPDATE STATUS MODAL */}
            {modalMode === 'status' && (
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-slate-900">Update Complaint Status</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                    <select
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value as ComplaintStatus)}
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="submitted">Submitted</option>
                      <option value="under_review">Under Review</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Official Remark / Action Taken</label>
                    <textarea
                      rows={3}
                      value={remarkInput}
                      onChange={(e) => setRemarkInput(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Add administrative notes..."
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setModalMode(null)}
                    className="px-4 py-2 bg-slate-100 text-xs font-semibold text-slate-700 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAction}
                    disabled={isProcessing}
                    className="px-5 py-2 bg-teal-600 text-xs font-semibold text-white rounded-xl hover:bg-teal-700"
                  >
                    Save Status
                  </button>
                </div>
              </div>
            )}

            {/* RESOLVE MODAL */}
            {modalMode === 'resolve' && (
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="w-5 h-5" />
                  Mark Complaint as Resolved
                </h4>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Officer Resolution Remark *</label>
                  <textarea
                    rows={3}
                    required
                    value={remarkInput}
                    onChange={(e) => setRemarkInput(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Describe resolution taken..."
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setModalMode(null)}
                    className="px-4 py-2 bg-slate-100 text-xs font-semibold text-slate-700 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAction}
                    disabled={isProcessing}
                    className="px-5 py-2 bg-emerald-600 text-xs font-semibold text-white rounded-xl hover:bg-emerald-700"
                  >
                    Confirm Resolve
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
