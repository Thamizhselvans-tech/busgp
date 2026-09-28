import React, { useState } from 'react';
import {
  Bus as BusIcon,
  MapPin,
  Compass,
  AlertTriangle,
  FileText,
  Search,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { ScreenState, DetectionState, Bus, Complaint } from '../types';
import { useLocation } from '../hooks/useLocation';
import { BusLocationService } from '../services/busLocationService';
import { api } from '../services/api';
import { BusDetector } from '../components/passenger/BusDetector';
import { BusSelector } from '../components/passenger/BusSelector';
import { ComplaintForm } from '../components/passenger/ComplaintForm';
import { ComplaintTracker } from '../components/passenger/ComplaintTracker';
import { MyComplaints } from '../components/passenger/MyComplaints';
import { Badge } from '../components/common/Badge';

interface PassengerPageProps {
  currentScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
}

export const PassengerPage: React.FC<PassengerPageProps> = ({ currentScreen, onNavigate }) => {
  const { locationState, coords, requestLocation } = useLocation();

  // State Model
  const [detectionState, setDetectionState] = useState<DetectionState>('idle');
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [detectedBuses, setDetectedBuses] = useState<Bus[]>([]);
  const [createdComplaint, setCreatedComplaint] = useState<Complaint | null>(null);
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  // Transition 1: Locate Nearby Bus
  const handleLocateBus = async () => {
    onNavigate('BUS_DETECTION');
    setDetectionState('detecting');

    // Request location
    const currentCoords = await requestLocation();
    
    // Call service abstraction
    const result = await BusLocationService.detectNearbyBuses(currentCoords?.lat, currentCoords?.lng);

    if (result.success && result.isLiveAvailable && result.buses.length > 0) {
      setDetectedBuses(result.buses);
      setDetectionState('live_found');
      onNavigate('LIVE_FOUND');
    } else {
      setDetectedBuses([]);
      setDetectionState('live_missing');
      onNavigate('LIVE_MISSING');
    }
  };

  // Transition 2: Select Bus (Auto or Manual)
  const handleSelectBus = (bus: Bus) => {
    setSelectedBus(bus);
    setDetectionState(bus.isLive ? 'live_found' : 'manual');
    onNavigate('BUS_SELECTED');
  };

  // Transition 3: Open Complaint Form
  const handleOpenComplaint = () => {
    onNavigate('COMPLAINT_FORM');
  };

  // Transition 4: Submit Complaint
  const handleSubmitComplaint = async (formData: Partial<Complaint>) => {
    setIsSubmittingComplaint(true);
    setSubmissionError(null);

    try {
      const response = await api.createComplaint(formData);
      if (response.success && response.data?.complaint) {
        const newComp: Complaint = response.data.complaint;
        setCreatedComplaint(newComp);
        setTrackingId(newComp.complaintId);
        onNavigate('COMPLAINT_SUBMITTED');
      } else {
        throw new Error(response.message || 'Submission failed.');
      }
    } catch (err: any) {
      console.error('Complaint Submit Error:', err);
      setSubmissionError(err.message || 'Failed to submit complaint. Your entered data has been preserved. Please try again.');
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  // Reset to Home
  const handleReset = () => {
    setSelectedBus(null);
    setDetectedBuses([]);
    setDetectionState('idle');
    setCreatedComplaint(null);
    setSubmissionError(null);
    onNavigate('HOME');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
      {/* 1. HOME SCREEN */}
      {currentScreen === 'HOME' && (
        <div className="space-y-6">
          {/* Main Hero Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 space-y-4 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                <Smartphone className="w-3.5 h-3.5" />
                Citizen Mobile Service
              </span>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Report & Track Bus Issues in Real-Time
              </h1>

              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                Detect your nearby bus automatically, log complaints against overcrowding, rash driving, or safety issues, and receive official RTA officer tracking.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={handleLocateBus}
                  className="px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 group"
                >
                  <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                  <span>Detect Nearby Bus</span>
                </button>

                <button
                  onClick={() => onNavigate('BUS_SELECTION')}
                  className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-2xl border border-slate-700 transition flex items-center justify-center gap-2"
                >
                  <BusIcon className="w-4 h-4 text-teal-400" />
                  <span>Select Bus Manually</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Action Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => onNavigate('TRACKING')}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-500 transition cursor-pointer space-y-3 group"
            >
              <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-xl flex items-center justify-center font-bold">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition">
                  Track Complaint Status
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your Complaint Reference Number (CB-2026-XXXXXX) to view officer investigation progress.
                </p>
              </div>
              <div className="text-xs font-semibold text-teal-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Check Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={() => onNavigate('MY_COMPLAINTS')}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-500 transition cursor-pointer space-y-3 group"
            >
              <div className="w-10 h-10 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-700 transition">
                  My Complaint History
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  View all submitted reports linked to your profile and track active RTA officer responses.
                </p>
              </div>
              <div className="text-xs font-semibold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>View History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BUS DETECTION SCREEN */}
      {['BUS_DETECTION', 'LIVE_FOUND', 'LIVE_MISSING'].includes(currentScreen) && (
        <BusDetector
          detectionState={detectionState}
          locationState={locationState}
          buses={detectedBuses}
          onSelectBus={handleSelectBus}
          onManualSelect={() => {
            setDetectionState('manual');
            onNavigate('BUS_SELECTION');
          }}
          onRetryDetect={handleLocateBus}
        />
      )}

      {/* 3. BUS SELECTION SCREEN */}
      {currentScreen === 'BUS_SELECTION' && (
        <BusSelector
          onSelectBus={handleSelectBus}
          onBackToDetect={() => onNavigate('BUS_DETECTION')}
        />
      )}

      {/* 4. BUS SELECTED SCREEN */}
      {currentScreen === 'BUS_SELECTED' && selectedBus && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 text-center">
          <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Bus Confirmed
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{selectedBus.busNumber}</h2>
            <p className="text-sm font-semibold text-slate-700">{selectedBus.route}</p>
            <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {selectedBus.source} → {selectedBus.destination}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleOpenComplaint}
              className="w-full sm:w-auto px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              <span>Report Complaint Against This Bus</span>
            </button>

            <button
              onClick={() => onNavigate('BUS_SELECTION')}
              className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
            >
              Choose Different Bus
            </button>
          </div>
        </div>
      )}

      {/* 5. COMPLAINT FORM SCREEN */}
      {currentScreen === 'COMPLAINT_FORM' && (
        <ComplaintForm
          selectedBus={selectedBus}
          onSubmitComplaint={handleSubmitComplaint}
          onChangeBus={() => onNavigate('BUS_SELECTION')}
          isSubmitting={isSubmittingComplaint}
          submissionError={submissionError}
        />
      )}

      {/* 6. COMPLAINT SUBMITTED SCREEN */}
      {currentScreen === 'COMPLAINT_SUBMITTED' && createdComplaint && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center space-y-6 max-w-lg mx-auto">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">Complaint Submitted Successfully!</h2>
            <p className="text-xs text-slate-500">
              Your grievance has been logged into the Regional Transport Monitoring system.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Complaint Reference ID</span>
            <p className="text-2xl font-black text-teal-700 tracking-tight">{createdComplaint.complaintId}</p>
            <p className="text-xs text-slate-500 pt-1">
              Please save this ID to track your complaint progress anytime.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('TRACKING')}
              className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Track Complaint Now</span>
            </button>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
            >
              Return to Home
            </button>
          </div>
        </div>
      )}

      {/* 7. TRACKING SCREEN */}
      {currentScreen === 'TRACKING' && (
        <ComplaintTracker initialComplaintId={trackingId} onNavigateHome={handleReset} />
      )}

      {/* 8. MY COMPLAINTS SCREEN */}
      {currentScreen === 'MY_COMPLAINTS' && (
        <MyComplaints
          onTrackComplaint={(id) => {
            setTrackingId(id);
            onNavigate('TRACKING');
          }}
          onNewComplaint={() => onNavigate('HOME')}
        />
      )}
    </div>
  );
};
