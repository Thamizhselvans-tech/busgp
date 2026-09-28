import React, { useState } from 'react';
import { MapPin, Bus as BusIcon, CheckCircle2, AlertCircle, ArrowRight, Check } from 'lucide-react';
import { Bus, ComplaintCategory, Complaint, ScreenState } from '../types';
import { COMPLAINT_CATEGORIES } from '../utils/constants';

interface ReportComplaintPageProps {
  initialBus: Bus | null;
  onSubmit: (formData: Partial<Complaint>) => Promise<void>;
  onNavigate: (screen: ScreenState) => void;
}

export const ReportComplaintPage: React.FC<ReportComplaintPageProps> = ({
  initialBus,
  onSubmit,
  onNavigate,
}) => {
  const [activeStep, setActiveStep] = useState(1);

  // Form State
  const [locationMode, setLocationMode] = useState<'current' | 'manual'>('current');
  const [manualStop, setManualStop] = useState('Saidapet Bus Stop');
  const [busDetectionTab, setBusDetectionTab] = useState<'auto' | 'manual'>('auto');
  
  const [selectedBus, setSelectedBus] = useState<Bus>(
    initialBus || {
      _id: 'bus-21g',
      busNumber: '21G',
      registrationNumber: 'TN01N9988',
      route: 'Tambaram → Guindy',
      source: 'Tambaram',
      destination: 'Guindy',
      currentLocationName: 'Saidapet',
      eta: '5 min',
      expectedArrival: '8:35 PM',
      status: 'APPROACHING',
      isLive: true,
    }
  );

  const [category, setCategory] = useState<ComplaintCategory>('Bus did not stop');
  const [details, setDetails] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!details.trim() || details.trim().length < 5) {
      setError('Please describe what happened in detail (minimum 5 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<Complaint> = {
        busId: selectedBus._id,
        busNumber: selectedBus.busNumber,
        route: selectedBus.route,
        category,
        description: details.trim(),
        boardingLocation: locationMode === 'current' ? 'Chennai, Tamil Nadu (Saidapet)' : manualStop,
        destination: selectedBus.destination || 'Guindy',
        incidentDate: new Date().toISOString().split('T')[0],
        incidentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'Pending',
      };

      await onSubmit(payload);
    } catch (err: any) {
      setError(err.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
      {/* 5-STEP WIZARD HEADER */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 max-w-2xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setActiveStep(1)}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${activeStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              1
            </div>
            <span className={activeStep === 1 ? 'text-blue-700 font-bold' : ''}>Location</span>
          </div>
          <div className="flex-1 h-0.5 bg-slate-200 mx-2"></div>

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setActiveStep(2)}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${activeStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              2
            </div>
            <span className={activeStep === 2 ? 'text-blue-700 font-bold' : ''}>Bus identification</span>
          </div>
          <div className="flex-1 h-0.5 bg-slate-200 mx-2"></div>

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setActiveStep(3)}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${activeStep >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              3
            </div>
            <span className={activeStep === 3 ? 'text-blue-700 font-bold' : ''}>Complaint Details</span>
          </div>
          <div className="flex-1 h-0.5 bg-slate-200 mx-2"></div>

          {/* Step 4 */}
          <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setActiveStep(4)}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${activeStep >= 4 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              4
            </div>
            <span className={activeStep === 4 ? 'text-blue-700 font-bold' : ''}>Evidence</span>
          </div>
          <div className="flex-1 h-0.5 bg-slate-200 mx-2"></div>

          {/* Step 5 */}
          <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setActiveStep(5)}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold ${activeStep >= 5 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
              5
            </div>
            <span className={activeStep === 5 ? 'text-blue-700 font-bold' : ''}>Submit</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitForm} className="space-y-6">
        {/* SECTION 1: SELECT LOCATION */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">1. Select Location</h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50">
              <input
                type="radio"
                name="location"
                checked={locationMode === 'current'}
                onChange={() => setLocationMode('current')}
                className="mt-0.5 accent-blue-600"
              />
              <div className="space-y-0.5 flex-1">
                <span className="font-bold text-slate-900">Use Current Location</span>
                <p className="text-slate-500">Chennai, Tamil Nadu • Lat: 13.0827, Lng: 80.2707</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50">
              <input
                type="radio"
                name="location"
                checked={locationMode === 'manual'}
                onChange={() => setLocationMode('manual')}
                className="mt-0.5 accent-blue-600"
              />
              <div className="space-y-2 flex-1">
                <span className="font-bold text-slate-900">Select Bus Stop Manually</span>
                {locationMode === 'manual' && (
                  <select
                    value={manualStop}
                    onChange={(e) => setManualStop(e.target.value)}
                    className="w-full max-w-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Saidapet Bus Stop">Saidapet Bus Stop</option>
                    <option value="Guindy Bus Stand">Guindy Bus Stand</option>
                    <option value="Tambaram West Bus Stop">Tambaram West Bus Stop</option>
                    <option value="Broadway Bus Terminus">Broadway Bus Terminus</option>
                  </select>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* SECTION 2: BUS IDENTIFICATION */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">2. Bus Identification</h3>

          {/* Sub-tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl w-fit text-xs font-bold">
            <button
              type="button"
              onClick={() => setBusDetectionTab('auto')}
              className={`px-4 py-1.5 rounded-lg transition ${
                busDetectionTab === 'auto' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Automatic Detection
            </button>
            <button
              type="button"
              onClick={() => setBusDetectionTab('manual')}
              className={`px-4 py-1.5 rounded-lg transition ${
                busDetectionTab === 'manual' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Manual Entry
            </button>
          </div>

          {/* Selected Bus Card */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shrink-0">
                <BusIcon className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-base">{selectedBus.busNumber}</span>
                  <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded">
                    {selectedBus.status}
                  </span>
                  <span className="text-xs text-blue-700 font-bold">ETA: {selectedBus.eta || '5 min'}</span>
                </div>
                <p className="text-xs font-semibold text-slate-700">{selectedBus.route}</p>
                <p className="text-[11px] text-slate-500">
                  Current Location: {selectedBus.currentLocationName || 'Saidapet'} • Expected Arrival: {selectedBus.expectedArrival || '8:35 PM'}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-blue-700 transition shrink-0"
            >
              Select This Bus
            </button>
          </div>
        </div>

        {/* SECTION 3: COMPLAINT CATEGORY */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">3. Complaint Category</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {COMPLAINT_CATEGORIES.map((cat) => (
              <label
                key={cat}
                className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                  category === cat
                    ? 'border-blue-600 bg-blue-50/60 font-bold text-blue-900'
                    : 'border-slate-200 bg-slate-50/40 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={category === cat}
                  onChange={() => setCategory(cat)}
                  className="accent-blue-600"
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* SECTION 4: COMPLAINT DETAILS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">4. Complaint Details</h3>

          <div>
            <textarea
              rows={4}
              required
              placeholder="Describe what happened..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full p-3.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            ></textarea>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Submitting Complaint...' : 'Submit Complaint'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
