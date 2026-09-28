import React, { useState, useEffect } from 'react';
import { Search, MapPin, Bus as BusIcon, Navigation, Clock, Gauge, ArrowRight } from 'lucide-react';
import { Bus, ScreenState } from '../types';
import { LeafletMap } from '../components/map/LeafletMap';
import { BusLocationService } from '../services/busLocationService';

interface RouteTrackingPageProps {
  onNavigate: (screen: ScreenState) => void;
  onSelectBusForReport: (bus: Bus) => void;
}

export const RouteTrackingPage: React.FC<RouteTrackingPageProps> = ({
  onNavigate,
  onSelectBusForReport,
}) => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [searchRoute, setSearchRoute] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    setIsLoading(true);
    try {
      const res = await BusLocationService.detectNearbyBuses(13.0827, 80.2707, 30);
      if (res.success && res.buses) {
        setBuses(res.buses);
        if (res.buses.length > 0) {
          setSelectedBus(res.buses[0]);
        }
      }
    } catch (err) {
      console.warn('Route tracking fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBuses = buses.filter(
    (b) =>
      b.busNumber.toLowerCase().includes(searchRoute.toLowerCase()) ||
      b.route.toLowerCase().includes(searchRoute.toLowerCase()) ||
      b.source.toLowerCase().includes(searchRoute.toLowerCase()) ||
      b.destination.toLowerCase().includes(searchRoute.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Route Tracking</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a bus route to view its full geographic polyline, bus stops, and live vehicle telemetry
          </p>
        </div>

        {/* Route Search */}
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search route (e.g. 21G, Saidapet, Guindy)..."
            value={searchRoute}
            onChange={(e) => setSearchRoute(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: ROUTE LIST & SELECTED ROUTE PANEL */}
        <div className="space-y-4 order-2 lg:order-1">
          {/* Selected Route Info Card */}
          {selectedBus ? (
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-5 border border-blue-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-blue-800/80 pb-3">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-400/20 px-2.5 py-0.5 rounded border border-amber-400/30">
                  ACTIVE ROUTE POLYLINE
                </span>
                <span className="text-xs text-emerald-400 font-bold">🟢 Telemetry Active</span>
              </div>

              <div>
                <span className="font-black text-white text-2xl">{selectedBus.busNumber}</span>
                <h3 className="text-base font-extrabold text-blue-200 mt-0.5">{selectedBus.route}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {selectedBus.source} → {selectedBus.destination}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-800/80 p-3 rounded-2xl border border-slate-700 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Speed</span>
                  <span className="font-extrabold text-white text-sm">{selectedBus.speed || 28} km/h</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Distance</span>
                  <span className="font-extrabold text-white text-sm">{selectedBus.distance || '1.2 km'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">ETA</span>
                  <span className="font-extrabold text-amber-400 text-sm">{selectedBus.eta || '6 min'}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectBusForReport(selectedBus);
                  onNavigate('REPORT_COMPLAINT');
                }}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Report Complaint Against {selectedBus.busNumber}</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-100 p-4 rounded-2xl text-xs text-slate-500 text-center">
              Select a route from the list below to view polyline details.
            </div>
          )}

          {/* Route Directory */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3 max-h-[480px] overflow-y-auto">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Available Routes ({filteredBuses.length})
            </h3>

            <div className="space-y-2.5">
              {filteredBuses.map((bus) => (
                <div
                  key={bus._id}
                  onClick={() => setSelectedBus(bus)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    selectedBus?._id === bus._id
                      ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                      : 'border-slate-200 bg-slate-50/40 hover:bg-white hover:border-blue-400'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-base">{bus.busNumber}</span>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        Route Active
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700">{bus.route}</p>
                    <p className="text-[11px] text-slate-500">
                      {bus.source} → {bus.destination}
                    </p>
                  </div>

                  <button className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-extrabold rounded-xl shrink-0">
                    View Route
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REAL LEAFLET MAP SHOWING ROUTE POLYLINE */}
        <div className="lg:col-span-2 order-1 lg:order-2 h-[480px] lg:h-[620px] sticky top-20">
          <LeafletMap
            userLocation={{ lat: 13.0827, lng: 80.2707 }}
            buses={buses}
            selectedBus={selectedBus}
            onSelectBus={(bus) => setSelectedBus(bus)}
            onReportComplaint={(bus) => {
              onSelectBusForReport(bus);
              onNavigate('REPORT_COMPLAINT');
            }}
            onRefresh={loadBuses}
            searchRadiusKm={30}
          />
        </div>
      </div>
    </div>
  );
};
