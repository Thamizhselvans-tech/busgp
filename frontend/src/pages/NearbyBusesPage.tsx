import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Navigation,
  Bus as BusIcon,
  Search,
  RefreshCw,
  FilePlus,
  AlertCircle,
  Radio,
  Clock,
  Gauge,
  CheckCircle2,
} from 'lucide-react';
import { Bus, ScreenState } from '../types';
import { LeafletMap } from '../components/map/LeafletMap';
import { BusLocationService } from '../services/busLocationService';
import { GeocodingService, GeocodeResult } from '../services/geocodingService';
import { useLocation } from '../hooks/useLocation';

interface NearbyBusesPageProps {
  onSelectBusForReport: (bus: Bus) => void;
  onNavigate: (screen: ScreenState) => void;
}

export const NearbyBusesPage: React.FC<NearbyBusesPageProps> = ({
  onSelectBusForReport,
  onNavigate,
}) => {
  const { locationState, requestLocation, errorMessage } = useLocation();

  // Search and Location States
  const [searchQuery, setSearchQuery] = useState('Chennai');
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userCenter, setUserCenter] = useState<{ lat: number; lng: number }>({
    lat: 13.0827,
    lng: 80.2707,
  });
  const [searchRadiusKm, setSearchRadiusKm] = useState(15);

  // Bus Data States
  const [buses, setBuses] = useState<Bus[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulatedMode, setIsSimulatedMode] = useState(true);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch Nearby Buses Telemetry
  const fetchNearbyBuses = useCallback(async () => {
    try {
      setApiError(null);
      const result = await BusLocationService.detectNearbyBuses(
        userCenter.lat,
        userCenter.lng,
        searchRadiusKm
      );

      if (result.success && result.buses) {
        setBuses(result.buses);
        setIsSimulatedMode(result.isSimulated);
        setLastRefreshedAt(new Date());

        // Keep selected bus reference updated with new animated coordinates
        if (selectedBus) {
          const updatedSelected = result.buses.find((b) => b._id === selectedBus._id);
          if (updatedSelected) {
            setSelectedBus(updatedSelected);
          }
        }
      }
    } catch (err: any) {
      console.warn('Telemetry fetch error:', err);
      setApiError('Unable to refresh live telemetry stream.');
    } finally {
      setIsLoading(false);
    }
  }, [userCenter, searchRadiusKm, selectedBus]);

  // Initial load
  useEffect(() => {
    fetchNearbyBuses();
  }, [userCenter, searchRadiusKm]);

  // Auto Refresh Interval every 5 seconds with proper cleanup!
  useEffect(() => {
    const timer = setInterval(() => {
      fetchNearbyBuses();
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [fetchNearbyBuses]);

  // Geocoding Search Handler
  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await GeocodingService.searchLocation(searchQuery);
      setSearchResults(results);
      if (results.length > 0) {
        const first = results[0];
        setUserCenter({ lat: first.lat, lng: first.lng });
        setSearchResults([]);
      }
    } catch (err) {
      console.warn('Location search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPresetLocation = async (locationName: string) => {
    setSearchQuery(locationName);
    const results = await GeocodingService.searchLocation(locationName);
    if (results.length > 0) {
      setUserCenter({ lat: results[0].lat, lng: results[0].lng });
    }
  };

  // User Geolocation Handler
  const handleUseCurrentLocation = async () => {
    const currentCoords = await requestLocation();
    if (currentCoords) {
      setUserCenter(currentCoords);
      setSearchQuery('My Current Location');
    }
  };

  // Bus Selection Handler
  const handleSelectBus = (bus: Bus) => {
    setSelectedBus(bus);
  };

  const handleReportComplaintForBus = (bus: Bus) => {
    onSelectBusForReport(bus);
    onNavigate('REPORT_COMPLAINT');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 pb-24">
      {/* TOP HEADER & ACCURACY INDICATOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Nearby Buses</h2>

            {/* ACCURACY INDICATOR BADGE */}
            {apiError ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">
                <span className="w-2 h-2 rounded-full bg-rose-600 mr-1.5 animate-ping"></span>
                🔴 GPS UNAVAILABLE
              </span>
            ) : isSimulatedMode ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>
                🟡 DEMO GPS SIMULATION
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600 mr-1.5 animate-pulse"></span>
                🟢 GPS LIVE
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Live GPS telemetry tracking of public transport buses operating within your vicinity
          </p>
        </div>

        {/* SEARCH & LOCATION ACTION CONTROLS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Quick preset locations */}
          <select
            value={searchQuery}
            onChange={(e) => handleSelectPresetLocation(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-600"
          >
            <option value="Chennai">Chennai</option>
            <option value="Cuddalore">Cuddalore</option>
            <option value="Pondicherry">Pondicherry</option>
            <option value="Guindy">Guindy</option>
            <option value="T Nagar">T Nagar</option>
            <option value="Anna Nagar">Anna Nagar</option>
          </select>

          <form onSubmit={handleLocationSearch} className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </form>

          <button
            onClick={handleUseCurrentLocation}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 shrink-0"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Use Current Location</span>
          </button>
        </div>
      </div>

      {/* ERROR OR LOCATION DENIED ALERTS */}
      {(errorMessage || locationState === 'denied' || apiError) && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 p-3.5 rounded-2xl text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{errorMessage || apiError || 'Location access is unavailable. You can search or select a location manually.'}</span>
          </div>
          <button
            onClick={fetchNearbyBuses}
            className="px-3 py-1 bg-amber-200 hover:bg-amber-300 font-bold text-[11px] rounded-lg transition"
          >
            Refresh
          </button>
        </div>
      )}

      {/* MAIN LAYOUT: DESKTOP SIDEBAR + MAP / MOBILE STACK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: BUS LIST & SELECTED BUS PANEL */}
        <div className="space-y-4 order-2 lg:order-1">
          {/* SELECTED BUS PANEL */}
          {selectedBus ? (
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-5 border border-blue-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-blue-800/80 pb-3">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-400/20 px-2.5 py-0.5 rounded border border-amber-400/30">
                  SELECTED BUS
                </span>
                <button
                  onClick={() => setSelectedBus(null)}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Clear Selection
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-white">{selectedBus.busNumber}</h3>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-700">
                    🟢 {selectedBus.status || 'Moving'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-blue-200">{selectedBus.route}</p>
                <p className="text-[11px] text-slate-400">
                  Driver: {selectedBus.driver || 'M. Arumugam'} • Reg: {selectedBus.registrationNumber}
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
                onClick={() => handleReportComplaintForBus(selectedBus)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <FilePlus className="w-4 h-4" />
                <span>Report Complaint Against {selectedBus.busNumber}</span>
              </button>
            </div>
          ) : (
            <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 space-y-1">
              <p className="font-bold">Select a bus on the map or list</p>
              <p className="text-slate-600 text-[11px]">
                Clicking any bus marker displays its live GPS speed, ETA, route polyline, and grievance reporting option.
              </p>
            </div>
          )}

          {/* NEARBY BUSES LIST */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-3 max-h-[520px] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Active Nearby Buses ({buses.length})</h3>
              <span className="text-[11px] text-slate-400 font-mono">Auto 5s Refresh</span>
            </div>

            {isLoading ? (
              <div className="py-8 text-center text-slate-400 text-xs">Scanning GPS telemetry...</div>
            ) : buses.length > 0 ? (
              <div className="space-y-2.5">
                {buses.map((bus) => {
                  const isSelected = selectedBus?._id === bus._id;
                  return (
                    <div
                      key={bus._id}
                      onClick={() => handleSelectBus(bus)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                          : 'border-slate-200 bg-slate-50/40 hover:bg-white hover:border-blue-400'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-base">{bus.busNumber}</span>
                          <span
                            className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                              isSelected
                                ? 'bg-amber-500 text-white'
                                : bus.status === 'stopped'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {bus.status || 'Moving'}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-700">{bus.route}</p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span>Dist: {bus.distance || '1.2 km'}</span>
                          <span>Speed: {bus.speed || 28} km/h</span>
                          <span className="font-bold text-blue-700">ETA {bus.eta || '6 min'}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectBus(bus);
                        }}
                        className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-extrabold rounded-xl transition shadow-2xs shrink-0"
                      >
                        View
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500">No buses found within {searchRadiusKm} km.</p>
                <button
                  onClick={fetchNearbyBuses}
                  className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-xl"
                >
                  Refresh Search
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: REAL LEAFLET MAP */}
        <div className="lg:col-span-2 order-1 lg:order-2 h-[480px] lg:h-[650px] sticky top-20">
          <LeafletMap
            userLocation={userCenter}
            buses={buses}
            selectedBus={selectedBus}
            onSelectBus={handleSelectBus}
            onReportComplaint={handleReportComplaintForBus}
            onRefresh={fetchNearbyBuses}
            searchRadiusKm={searchRadiusKm}
          />
        </div>
      </div>
    </div>
  );
};
