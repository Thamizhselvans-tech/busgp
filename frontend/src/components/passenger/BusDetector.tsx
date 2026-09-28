import React, { useEffect } from 'react';
import { Bus, MapPin, Radio, AlertTriangle, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Bus as BusType, DetectionState, LocationPermissionState } from '../../types';
import { Badge } from '../common/Badge';

interface BusDetectorProps {
  detectionState: DetectionState;
  locationState: LocationPermissionState;
  buses: BusType[];
  onSelectBus: (bus: BusType) => void;
  onManualSelect: () => void;
  onRetryDetect: () => void;
  errorMessage?: string | null;
}

export const BusDetector: React.FC<BusDetectorProps> = ({
  detectionState,
  locationState,
  buses,
  onSelectBus,
  onManualSelect,
  onRetryDetect,
  errorMessage,
}) => {
  return (
    <div className="space-y-6">
      {/* Detecting State */}
      {detectionState === 'detecting' && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-6">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 bg-teal-100 rounded-full animate-ping opacity-40"></div>
            <div className="absolute inset-2 bg-teal-50 rounded-full border border-teal-200"></div>
            <div className="relative z-10 p-4 bg-teal-500 rounded-full text-white shadow-md">
              <Radio className="w-8 h-8 animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Scanning for Nearby Buses...</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Using GPS telemetry to locate active government buses within 5 km of your position.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={onManualSelect}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline transition"
            >
              Skip scan and select bus manually
            </button>
          </div>
        </div>
      )}

      {/* Live Buses Found */}
      {detectionState === 'live_found' && buses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Nearby Buses Detected
                <Badge type="live" />
              </h3>
              <p className="text-xs text-slate-500">Select the bus you are currently traveling in or waiting for</p>
            </div>
            <button
              onClick={onRetryDetect}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              title="Refresh scan"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="grid gap-3">
            {buses.map((bus) => (
              <div
                key={bus._id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-500 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-lg text-slate-900 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg tracking-wide">
                      {bus.busNumber}
                    </span>
                    <Badge type="live" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">{bus.route}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {bus.source} → {bus.destination}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600 pt-1 font-medium">
                    {bus.distance && <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200">Distance: {bus.distance}</span>}
                    {bus.eta && <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200">ETA: {bus.eta}</span>}
                  </div>
                </div>

                <button
                  onClick={() => onSelectBus(bus)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl shadow-sm flex items-center justify-center gap-2 group-hover:translate-x-0.5 transition"
                >
                  <span>Select Bus</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={onManualSelect}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium underline"
            >
              Don't see your bus? Select or search manually
            </button>
          </div>
        </div>
      )}

      {/* Live Missing or Location Denied */}
      {(detectionState === 'live_missing' || locationState === 'denied' || locationState === 'unavailable') && (
        <div className="bg-white rounded-2xl p-6 border border-amber-200 bg-amber-50/40 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              {locationState === 'denied'
                ? 'Location Access Unavailable'
                : 'Live Bus Detection Unavailable'}
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              {locationState === 'denied'
                ? 'Location permission was denied. You can still select your bus manually from the directory.'
                : 'Live bus telemetry signals are currently unavailable in your immediate area. You can enter or select your bus manually.'}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onManualSelect}
              className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition"
            >
              <span>Select Bus Manually</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onRetryDetect}
              className="w-full sm:w-auto px-4 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-xl transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Signal Scan</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
