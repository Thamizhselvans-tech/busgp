import React, { useState } from 'react';
import { Bus as BusIcon, PlusCircle, Search, Edit2, Trash2, MapPin, CheckCircle2, UserCheck } from 'lucide-react';
import { Bus, BusStatus } from '../../types';
import { Badge } from '../common/Badge';

interface BusManagementProps {
  buses: Bus[];
  onCreateBus: (busData: Partial<Bus>) => Promise<void>;
  onUpdateBus: (id: string, busData: Partial<Bus>) => Promise<void>;
  onDeleteBus: (id: string) => Promise<void>;
}

export const BusManagement: React.FC<BusManagementProps> = ({
  buses,
  onCreateBus,
  onUpdateBus,
  onDeleteBus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);

  // Form State
  const [busNumber, setBusNumber] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [route, setRoute] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [driver, setDriver] = useState('');
  const [conductor, setConductor] = useState('');
  const [assignedOfficer, setAssignedOfficer] = useState('');
  const [status, setStatus] = useState<BusStatus>('active');
  const [isProcessing, setIsProcessing] = useState(false);

  const openCreateModal = () => {
    setEditingBus(null);
    setBusNumber('');
    setRegistrationNumber('');
    setRoute('');
    setSource('');
    setDestination('');
    setDriver('');
    setConductor('');
    setAssignedOfficer('Officer Ramesh Kumar');
    setStatus('active');
    setIsModalOpen(true);
  };

  const openEditModal = (bus: Bus) => {
    setEditingBus(bus);
    setBusNumber(bus.busNumber);
    setRegistrationNumber(bus.registrationNumber);
    setRoute(bus.route);
    setSource(bus.source);
    setDestination(bus.destination);
    setDriver(bus.driver || '');
    setConductor(bus.conductor || '');
    setAssignedOfficer(bus.assignedOfficer || 'Officer Ramesh Kumar');
    setStatus(bus.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const payload: Partial<Bus> = {
        busNumber: busNumber.toUpperCase().trim(),
        registrationNumber: registrationNumber.toUpperCase().trim(),
        route: route.trim(),
        source: source.trim(),
        destination: destination.trim(),
        driver: driver.trim(),
        conductor: conductor.trim(),
        assignedOfficer: assignedOfficer.trim(),
        status,
      };

      if (editingBus && editingBus._id) {
        await onUpdateBus(editingBus._id, payload);
      } else {
        await onCreateBus(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredBuses = buses.filter(
    (b) =>
      b.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BusIcon className="w-5 h-5 text-teal-600" />
            Bus Fleet Directory
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Manage active government buses, assigned officers, and route coverage</p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Bus</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search by Bus Number, Route or Location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Grid of Buses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBuses.map((bus) => (
          <div
            key={bus._id}
            className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-base text-slate-900 bg-white border border-slate-200 px-3 py-0.5 rounded-lg shadow-2xs">
                  {bus.busNumber}
                </span>
                <Badge type="busStatus" status={bus.status} />
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-sm">{bus.route}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {bus.source} → {bus.destination}
                </p>
              </div>

              <div className="text-xs text-slate-600 space-y-0.5 pt-2 border-t border-slate-200/60">
                <p><strong>Driver:</strong> {bus.driver || 'N/A'}</p>
                <p><strong>Conductor:</strong> {bus.conductor || 'N/A'}</p>
                <p className="text-teal-700"><strong>Officer:</strong> {bus.assignedOfficer || 'Unassigned'}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(bus)}
                className="p-2 text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition"
                title="Edit Bus"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              {bus._id && (
                <button
                  onClick={() => onDeleteBus(bus._id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="Remove Bus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <h4 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              {editingBus ? `Edit Bus - ${editingBus.busNumber}` : 'Add New Bus to Fleet'}
            </h4>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bus Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TN-32-N-1234"
                    value={busNumber}
                    onChange={(e) => setBusNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl uppercase text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reg Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TN32N1234"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl uppercase text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Route Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cuddalore → Pondicherry"
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Source *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cuddalore Bus Stand"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Destination *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pondicherry New BS"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Driver Name</label>
                  <input
                    type="text"
                    value={driver}
                    onChange={(e) => setDriver(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Conductor Name</label>
                  <input
                    type="text"
                    value={conductor}
                    onChange={(e) => setConductor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Officer</label>
                  <input
                    type="text"
                    value={assignedOfficer}
                    onChange={(e) => setAssignedOfficer(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as BusStatus)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 font-semibold text-slate-700 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 bg-teal-600 font-semibold text-white rounded-xl text-xs hover:bg-teal-700 shadow-sm"
                >
                  {editingBus ? 'Save Changes' : 'Create Bus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
