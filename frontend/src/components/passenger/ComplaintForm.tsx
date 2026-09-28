import React, { useState } from 'react';
import {
  Bus as BusIcon,
  AlertCircle,
  Camera,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  Upload,
  X,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { Bus, ComplaintCategory, Complaint } from '../../types';
import { COMPLAINT_CATEGORIES } from '../../utils/constants';

interface ComplaintFormProps {
  selectedBus: Bus | null;
  onSubmitComplaint: (formData: Partial<Complaint>) => Promise<void>;
  onChangeBus: () => void;
  isSubmitting: boolean;
  submissionError: string | null;
}

export const ComplaintForm: React.FC<ComplaintFormProps> = ({
  selectedBus,
  onSubmitComplaint,
  onChangeBus,
  isSubmitting,
  submissionError,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  // Form states
  const [category, setCategory] = useState<ComplaintCategory | ''>('');
  const [description, setDescription] = useState('');
  const [boardingLocation, setBoardingLocation] = useState(selectedBus?.source || '');
  const [destination, setDestination] = useState(selectedBus?.destination || '');
  const [incidentDate, setIncidentDate] = useState(todayStr);
  const [incidentTime, setIncidentTime] = useState(timeStr);
  const [currentLocationAddr, setCurrentLocationAddr] = useState(selectedBus?.source || '');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Review step state
  const [isReviewStep, setIsReviewStep] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setValidationError(null);

    if (!file) return;

    // Check image type
    if (!file.type.startsWith('image/')) {
      setValidationError('Invalid file type. Please upload a valid image (JPEG, PNG, WEBP).');
      return;
    }

    // Check image size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setValidationError('Image size exceeds 5MB limit. Please upload a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = (): boolean => {
    setValidationError(null);

    if (!selectedBus) {
      setValidationError('Please select a bus before submitting your complaint.');
      return false;
    }

    if (!category) {
      setValidationError('Please select a complaint category.');
      return false;
    }

    if (!description.trim() || description.trim().length < 10) {
      setValidationError('Complaint description must be at least 10 characters long.');
      return false;
    }

    if (!boardingLocation.trim()) {
      setValidationError('Boarding location is required.');
      return false;
    }

    if (!destination.trim()) {
      setValidationError('Destination location is required.');
      return false;
    }

    return true;
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsReviewStep(true);
    }
  };

  const handleFinalSubmit = async () => {
    if (!validateForm() || !selectedBus) return;

    const payload: Partial<Complaint> = {
      busId: selectedBus._id,
      busNumber: selectedBus.busNumber,
      route: selectedBus.route,
      category: category as ComplaintCategory,
      description: description.trim(),
      boardingLocation: boardingLocation.trim(),
      destination: destination.trim(),
      incidentDate,
      incidentTime,
      location: { address: currentLocationAddr || boardingLocation },
      imageUrl: imagePreview || '',
    };

    await onSubmitComplaint(payload);
  };

  if (!selectedBus) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
        <p className="text-sm text-slate-700 font-medium">Please select a bus before submitting your complaint.</p>
        <button
          onClick={onChangeBus}
          className="px-5 py-2.5 bg-teal-600 text-white font-semibold text-sm rounded-xl hover:bg-teal-700 transition"
        >
          Select Bus Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bus Header Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-teal-500 text-slate-950 font-extrabold px-2.5 py-0.5 rounded tracking-wide uppercase">
              Selected Bus
            </span>
            <span className="text-xl font-bold tracking-tight text-white">{selectedBus.busNumber}</span>
          </div>
          <p className="text-sm text-slate-300 font-medium">{selectedBus.route}</p>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            {selectedBus.source} → {selectedBus.destination}
          </p>
        </div>

        <button
          onClick={onChangeBus}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition self-start sm:self-auto"
        >
          Change Bus
        </button>
      </div>

      {/* Validation or API Error Alerts */}
      {(validationError || submissionError) && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Attention Required</p>
            <p className="text-xs mt-0.5 text-rose-700">{validationError || submissionError}</p>
          </div>
        </div>
      )}

      {/* FORM INPUT STEP */}
      {!isReviewStep ? (
        <form onSubmit={handleProceedToReview} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              Complaint Details
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Please provide accurate information for quick officer investigation</p>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Complaint Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition"
              required
            >
              <option value="">-- Select Category --</option>
              {COMPLAINT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description Textarea */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Describe your complaint <span className="text-rose-500">*</span>
              </label>
              <span className={`text-[11px] font-medium ${description.length >= 10 ? 'text-emerald-600' : 'text-slate-400'}`}>
                {description.length} / min 10 chars
              </span>
            </div>
            <textarea
              rows={4}
              required
              placeholder="Provide specific details about what occurred on the bus (e.g. location, timing, ticket details, driver behavior)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            ></textarea>
          </div>

          {/* Journey Locations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Boarding Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={boardingLocation}
                onChange={(e) => setBoardingLocation(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Destination <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Incident Date
              </label>
              <input
                type="date"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Incident Time
              </label>
              <input
                type="text"
                value={incidentTime}
                onChange={(e) => setIncidentTime(e.target.value)}
                placeholder="e.g. 10:30 AM"
                className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Photo Upload (Optional) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-slate-400" />
              Upload Photo Evidence (Optional)
            </label>

            {imagePreview ? (
              <div className="relative w-full max-w-xs h-40 rounded-xl overflow-hidden border border-slate-200 group">
                <img src={imagePreview} alt="Evidence" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute top-2 right-2 p-1.5 bg-slate-900/80 text-white rounded-full hover:bg-rose-600 transition"
                  title="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl cursor-pointer bg-slate-50 hover:bg-teal-50/20 transition">
                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-600">Click to upload photo</span>
                <span className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 5MB</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition"
            >
              <span>Review Complaint</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      ) : (
        /* REVIEW & CONFIRMATION STEP */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-teal-600" />
              Review Your Complaint
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Please review your submission details before sending</p>
          </div>

          <div className="space-y-4 text-sm text-slate-700 bg-slate-50 p-5 rounded-xl border border-slate-200">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-200/60">
              <span className="text-xs text-slate-500 font-medium">Selected Bus:</span>
              <span className="font-bold text-slate-900 text-right">{selectedBus.busNumber}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-200/60">
              <span className="text-xs text-slate-500 font-medium">Category:</span>
              <span className="font-semibold text-teal-700 text-right">{category}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-200/60">
              <span className="text-xs text-slate-500 font-medium">Boarding → Destination:</span>
              <span className="font-medium text-slate-800 text-right">
                {boardingLocation} → {destination}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-200/60">
              <span className="text-xs text-slate-500 font-medium">Incident Date & Time:</span>
              <span className="font-medium text-slate-800 text-right">
                {incidentDate} at {incidentTime}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-medium block">Description:</span>
              <p className="text-xs bg-white p-3 rounded-lg border border-slate-200 text-slate-800 whitespace-pre-wrap">
                {description}
              </p>
            </div>

            {imagePreview && (
              <div className="space-y-1 pt-2">
                <span className="text-xs text-slate-500 font-medium block">Photo Attachment:</span>
                <img src={imagePreview} alt="Review attachment" className="w-24 h-24 object-cover rounded-lg border border-slate-300" />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsReviewStep(false)}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Edit Form Data</span>
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalSubmit}
              className="w-full sm:w-auto px-7 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting Complaint...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Submit Complaint</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
