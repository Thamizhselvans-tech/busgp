import React, { useState, useEffect } from 'react';
import {
  Radio,
  FileCheck,
  MapPin,
  Mail,
  Search,
  ShieldCheck,
  ArrowRight,
  Bus as BusIcon,
  User,
  Clock,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { ScreenState, Complaint } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface HomePageProps {
  onNavigate: (screen: ScreenState) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { user, isAuthenticated } = useAuth();
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [isLoadingComplaints, setIsLoadingComplaints] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoadingComplaints(true);
      api
        .getMyComplaints()
        .then((res) => {
          if (res.success && res.complaints) {
            setRecentComplaints(res.complaints.slice(0, 3));
          }
        })
        .catch((err) => console.warn('Could not load recent complaints:', err))
        .finally(() => setIsLoadingComplaints(false));
    }
  }, [isAuthenticated]);

  return (
    <div className="space-y-10 pb-24">
      {/* PERSONALIZED USER WELCOME BANNER (WHEN LOGGED IN) */}
      {isAuthenticated && user && (
        <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-6 border-b border-blue-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-teal-400 text-slate-950 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg border border-teal-300">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">Welcome, {user.name}</h2>
                  <span className="text-[10px] bg-teal-400 text-slate-950 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-blue-200 mt-0.5">
                  Logged in as <span className="font-semibold text-white">{user.email}</span> • Citizen Redressal Portal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('MY_COMPLAINTS')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition flex items-center gap-1.5"
              >
                <span>My Grievances</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* HERO SECTION */}
      <section className="bg-slate-50 border-b border-slate-200 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Hero Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>TNSTC & MTC Live Bus Monitoring Portal</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Report Public Bus Service Issues Easily
            </h1>
            <p className="text-base text-slate-600 font-medium max-w-lg leading-relaxed">
              Identify your bus, report service problems with photo evidence, and track your complaint through a transparent digital process.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onNavigate('REPORT_COMPLAINT')}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center gap-2"
              >
                Report a Complaint
              </button>
              <button
                onClick={() => onNavigate('TRACK_COMPLAINT')}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center gap-2"
              >
                Track Complaint Status
              </button>
            </div>
          </div>

          {/* Right Hero Graphics with Authentic TNSTC Bus Asset */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-tr from-blue-950 via-slate-900 to-indigo-950 border border-blue-800 min-h-[320px] flex flex-col justify-between group">
            <img
              src="/tnstc_bus.jpg"
              alt="TNSTC Government Bus"
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            <div className="relative z-10 p-5 flex justify-between items-start">
              <span className="bg-emerald-500 text-slate-950 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                அரசு போக்குவரத்து கழகம் • TNSTC
              </span>
              <span className="text-xs bg-slate-900/80 text-teal-300 px-2.5 py-1 rounded-lg border border-teal-500/40 font-mono">
                🟡 DEMO GPS SIMULATION
              </span>
            </div>

            <div className="relative z-10 p-5 space-y-2 text-left mt-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded">
                  TN-63-N-2093
                </span>
                <span className="text-xs text-blue-200 font-bold">State Transport Fleet</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">Route 21G: Saidapet → Broadway</h3>
              <p className="text-xs text-slate-300">
                Driver: M. Arumugam • Conductor: K. Balan • Speed: 28 km/h
              </p>

              <div className="flex items-center justify-between text-xs text-teal-300 pt-3 border-t border-slate-700/80 font-mono">
                <span>Station: Saidapet Terminal</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active Route Signal
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT COMPLAINTS SECTION (DYNAMIC FROM MONGO DB) */}
      {isAuthenticated && (
        <section className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-black text-slate-900">My Recent Complaints</h2>
            </div>
            <button
              onClick={() => onNavigate('MY_COMPLAINTS')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition"
            >
              View All ({recentComplaints.length}) →
            </button>
          </div>

          {isLoadingComplaints ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-500 animate-pulse">
              Loading complaints from MongoDB...
            </div>
          ) : recentComplaints.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentComplaints.map((c) => (
                <div
                  key={c._id || c.complaintId}
                  onClick={() => onNavigate('MY_COMPLAINTS')}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-600">{c.complaintId}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        c.status === 'Resolved' || c.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'Investigation' || c.status === 'in_progress'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 truncate">Bus {c.busNumber} • {c.category}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 flex justify-between">
                    <span>Date: {new Date(c.createdAt || Date.now()).toLocaleDateString()}</span>
                    <span className="text-blue-600 font-bold">Track →</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-2">
              <AlertCircle className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-600">No active complaints found in your account.</p>
              <button
                onClick={() => onNavigate('REPORT_COMPLAINT')}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                File Your First Complaint
              </button>
            </div>
          )}
        </section>
      )}

      {/* 6 CLICKABLE FEATURE CARDS SECTION */}
      <section className="max-w-7xl mx-auto px-4 space-y-6">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">System Features & Services</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Live Bus Detection */}
          <div
            onClick={() => onNavigate('NEARBY_BUSES')}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all cursor-pointer text-center space-y-3 group"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition">
              Live Bus Detection
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Find nearby buses and track live vehicle positions on a real Leaflet interactive map.
            </p>
            <div className="text-xs font-extrabold text-blue-600 flex items-center justify-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Open Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Easy Complaint */}
          <div
            onClick={() => onNavigate('REPORT_COMPLAINT')}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all cursor-pointer text-center space-y-3 group"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition">
              Easy Complaint
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Report public bus service issues in a few simple steps with photo evidence attachment.
            </p>
            <div className="text-xs font-extrabold text-blue-600 flex items-center justify-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>File Complaint</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Route Tracking */}
          <div
            onClick={() => onNavigate('ROUTES')}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all cursor-pointer text-center space-y-3 group"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition">
              Route Tracking
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              View complete bus route polylines, source, destination, stops, and live vehicle location.
            </p>
            <div className="text-xs font-extrabold text-blue-600 flex items-center justify-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>View Routes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Email Acknowledgement */}
          <div
            onClick={() => onNavigate('ACKNOWLEDGEMENT')}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all cursor-pointer text-center space-y-3 group"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition">
              Email Acknowledgement
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Request official digital complaint confirmation receipts sent directly to your email inbox.
            </p>
            <div className="text-xs font-extrabold text-blue-600 flex items-center justify-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Request Receipt</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 5: Complaint Tracking */}
          <div
            onClick={() => onNavigate('TRACK_COMPLAINT')}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all cursor-pointer text-center space-y-3 group"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition">
              Complaint Tracking
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Track status in real-time using reference IDs and view officer investigation updates.
            </p>
            <div className="text-xs font-extrabold text-blue-600 flex items-center justify-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Track Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 6: Transparent Resolution */}
          <div
            onClick={() => onNavigate('RESOLUTION')}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 transition-all cursor-pointer text-center space-y-3 group"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition">
              Transparent Resolution
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Access public officer resolution records, administrative findings, and action dates.
            </p>
            <div className="text-xs font-extrabold text-blue-600 flex items-center justify-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>View Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 pt-4 space-y-8">
        <h2 className="text-2xl sm:text-3xl font-black text-center text-slate-900 tracking-tight">
          How It Works?
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="bg-slate-900 rounded-2xl p-6 text-white min-h-[260px] flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-2 relative z-10">
              <span className="text-xs bg-teal-400 text-slate-950 font-extrabold px-2.5 py-0.5 rounded">
                Citizen Grievance Workflow
              </span>
              <h3 className="text-xl font-bold">Simple 4-Step Redressal Process</h3>
              <p className="text-xs text-slate-300">Designed for fast mobile usage under 30 seconds</p>
            </div>
            <div className="relative z-10 text-xs text-slate-400 pt-4 border-t border-slate-800">
              Government of Tamil Nadu • Transport Department Digital Portal
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="w-9 h-9 bg-blue-600 text-white font-extrabold rounded-full flex items-center justify-center text-sm shadow-sm">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Find Bus</h4>
              <p className="text-xs text-slate-500">Detect nearby buses via GPS or enter bus number manually.</p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 bg-blue-600 text-white font-extrabold rounded-full flex items-center justify-center text-sm shadow-sm">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Report Issue</h4>
              <p className="text-xs text-slate-500">Submit complaint details with optional photo evidence.</p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 bg-blue-600 text-white font-extrabold rounded-full flex items-center justify-center text-sm shadow-sm">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Get Confirmation</h4>
              <p className="text-xs text-slate-500">Receive unique reference ID via SMS/email.</p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 bg-blue-600 text-white font-extrabold rounded-full flex items-center justify-center text-sm shadow-sm">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Track Status</h4>
              <p className="text-xs text-slate-500">Monitor officer investigation progress until resolution.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
