import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Bus as BusIcon, ClipboardList, RefreshCw, AlertCircle, BarChart2 } from 'lucide-react';
import { Complaint, Bus, ComplaintStatus } from '../types';
import { api } from '../services/api';
import { DashboardStats } from '../components/admin/DashboardStats';
import { ComplaintsTable } from '../components/admin/ComplaintsTable';
import { BusManagement } from '../components/admin/BusManagement';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'complaints' | 'buses'>('complaints');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [compRes, busRes] = await Promise.all([api.getAllComplaints(), api.getBuses()]);

      if (compRes.success && compRes.data?.complaints) {
        setComplaints(compRes.data.complaints);
      }
      if (busRes.success && busRes.data?.buses) {
        setBuses(busRes.data.buses);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load administrative data.');
    } finally {
      setIsLoading(false);
    }
  };

  // Complaint Actions
  const handleUpdateStatus = async (id: string, status: ComplaintStatus, remark?: string) => {
    try {
      await api.updateComplaintStatus(id, { status, adminRemark: remark });
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to update status.');
    }
  };

  const handleAssignOfficer = async (id: string, officerName: string) => {
    try {
      await api.assignOfficer(id, officerName);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to assign officer.');
    }
  };

  const handleResolve = async (id: string, remark: string) => {
    try {
      await api.resolveComplaint(id, remark);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to resolve complaint.');
    }
  };

  // Bus Fleet Actions
  const handleCreateBus = async (busData: Partial<Bus>) => {
    try {
      await api.createBus(busData);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to create bus.');
    }
  };

  const handleUpdateBus = async (id: string, busData: Partial<Bus>) => {
    try {
      await api.updateBus(id, busData);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to update bus.');
    }
  };

  const handleDeleteBus = async (id: string) => {
    try {
      await api.deleteBus(id);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete bus.');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500 text-sm">Loading RTA Admin Portal...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-teal-500 text-slate-950 font-extrabold px-2 py-0.5 rounded uppercase">
              ADMIN CONTROL CENTER
            </span>
            <span className="text-xs text-slate-400">RTA Tamil Nadu</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">Grievance & Fleet Management</h2>
          <p className="text-xs text-slate-400">Real-time public complaint monitoring and transport officer assignment</p>
        </div>

        <button
          onClick={loadData}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <DashboardStats complaints={complaints} />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'complaints'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>All Complaints ({complaints.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('buses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'buses'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BusIcon className="w-4 h-4" />
          <span>Bus Fleet Management ({buses.length})</span>
        </button>
      </div>

      {/* Active Tab View */}
      {activeTab === 'complaints' ? (
        <ComplaintsTable
          complaints={complaints}
          onUpdateStatus={handleUpdateStatus}
          onAssignOfficer={handleAssignOfficer}
          onResolve={handleResolve}
        />
      ) : (
        <BusManagement
          buses={buses}
          onCreateBus={handleCreateBus}
          onUpdateBus={handleUpdateBus}
          onDeleteBus={handleDeleteBus}
        />
      )}
    </div>
  );
};
