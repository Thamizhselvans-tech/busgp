import React, { useState, useEffect } from 'react';
import { Bus as BusIcon, Search, MapPin, PlusCircle, Check, ArrowRight } from 'lucide-react';
import { Bus } from '../../types';
import { api } from '../../services/api';
import { BusLocationService } from '../../services/busLocationService';
import { Badge } from '../common/Badge';

interface BusSelectorProps {
  onSelectBus: (bus: Bus) => void;
  onBackToDetect?: () => void;
}

export const BusSelector: React.FC<BusSelectorProps> = ({ onSelectBus, onBackToDetect }) => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isManualEntry, setIsManualEntry] = useState(false);

  // Custom manual entry form state
  const [manualNumber, setManualNumber] = useState('');
  const [manualRoute, setManualRoute] = useState('');
  const [manualSource, setManualSource] = useState('');
  const [manualDestination, setManualDestination] = useState('');

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    setIsLoading(true);
    try {
      const response = await api.getBuses();
      if (response.success && response.data?.buses?.length > 0) {
        setBuses(response.data.buses);
      } else {
        setBuses(BusLocationService.getMockBuses());
      }
    } catch (err) {
      console.warn('Failed to fetch buses from API, using default database buses:', err);
      setBuses(BusLocationService.getMockBuses());
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBuses = buses.filter(
    (b) =>
      b.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualNumber.trim() || !manualRoute.trim()) return;

    const customBus: Bus = {
      _id: `custom-${Date.now()}`,
      busNumber: manualNumber.toUpperCase().trim(),
      registrationNumber: manualNumber.toUpperCase().trim(),
      route: manualRoute.trim(),
      source: manualSource.trim() || 'Boarding Stop',
      destination: manualDestination.trim() || 'Destination Stop',
      status: 'active',
      isLive: false,
    };

    onSelectBus(customBus);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BusIcon className="w-5 h-5 text-teal-600" />
            Select Bus Manually
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Search by Bus Number or Route, or enter bus details manually</p>
        </div>

        <button
          onClick={() => setIsManualEntry(!isManualEntry)}
          className="text-xs font-semibold px-3 py-2 rounded-xl border border-teal-300 text-teal-700 bg-teal-50 hover:bg-teal-100 transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isManualEntry ? 'Select from List' : 'Enter Unlisted Bus'}</span>
        </button>
      </div>

      {!isManualEntry ? (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by Bus Number (e.g. TN-32-N-1234) or Route..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
            />
          </div>

          {/* Bus List */}
          {isLoading ? (
            <div className="py-8 text-center text-slate-400 text-sm">Loading bus directory...</div>
          ) : filteredBuses.length > 0 ? (
            <div className="grid gap-3 max-h-96 overflow-y-auto pr-1">
              {filteredBuses.map((bus) => (
                <div
                  key={bus._id}
                  onClick={() => onSelectBus(bus)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/30 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">{bus.busNumber}</span>
                      <Badge type="mock" />
                    </div>
                    <p className="text-xs font-medium text-slate-700">{bus.route}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {bus.source} → {bus.destination}
                    </p>
                  </div>

                  <button className="px-3.5 py-1.5 bg-slate-100 group-hover:bg-teal-600 group-hover:text-white text-slate-700 text-xs font-semibold rounded-lg transition flex items-center gap-1">
                    <span>Select</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center space-y-3">
              <p className="text-sm text-slate-500">No buses matching "{searchTerm}"</p>
              <button
                onClick={() => {
                  setManualNumber(searchTerm);
                  setIsManualEntry(true);
                }}
                className="text-xs font-semibold text-teal-600 hover:underline"
              >
                Enter "{searchTerm}" manually as a new bus
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Manual Custom Bus Entry Form */
        <form onSubmit={handleCustomSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bus Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. TN-32-N-1234"
                value={manualNumber}
                onChange={(e) => setManualNumber(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 uppercase"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Route / Bus Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Cuddalore → Pondicherry"
                value={manualRoute}
                onChange={(e) => setManualRoute(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Boarding Location</label>
              <input
                type="text"
                placeholder="e.g. Cuddalore Bus Stand"
                value={manualSource}
                onChange={(e) => setManualSource(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Destination</label>
              <input
                type="text"
                placeholder="e.g. Pondicherry New BS"
                value={manualDestination}
                onChange={(e) => setManualDestination(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsManualEntry(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Use This Bus</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
