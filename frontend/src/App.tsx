import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ScreenState, Bus, Complaint } from './types';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { HomePage } from './pages/HomePage';
import { NearbyBusesPage } from './pages/NearbyBusesPage';
import { ReportComplaintPage } from './pages/ReportComplaintPage';
import { RouteTrackingPage } from './pages/RouteTrackingPage';
import { EmailAcknowledgementPage } from './pages/EmailAcknowledgementPage';
import { ResolutionPage } from './pages/ResolutionPage';
import { ComplaintTracker } from './components/passenger/ComplaintTracker';
import { MyComplaints } from './components/passenger/MyComplaints';
import { ComplaintDetailsPage } from './pages/ComplaintDetailsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminPage } from './pages/AdminPage';
import { OfficerDashboard } from './components/officer/OfficerDashboard';
import { api } from './services/api';
import { Bus as BusIcon, Shield, RefreshCw } from 'lucide-react';

const MainApp: React.FC = () => {
  const { user, isLoading, isAuthenticated, role } = useAuth();
  const [screen, setScreen] = useState<ScreenState>('HOME');
  const [hasInitializedRole, setHasInitializedRole] = useState(false);
  const [selectedBusForReport, setSelectedBusForReport] = useState<Bus | null>(null);
  const [activeComplaintDetails, setActiveComplaintDetails] = useState<Complaint | null>(null);
  const [trackComplaintId, setTrackComplaintId] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Initialize screen state based on restored user session role
  useEffect(() => {
    if (!isLoading && !hasInitializedRole) {
      setHasInitializedRole(true);
      if (role === 'admin') {
        setScreen('ADMIN_DASHBOARD');
      } else if (role === 'officer') {
        setScreen('OFFICER_DASHBOARD');
      } else {
        setScreen('HOME');
      }
    }
  }, [isLoading, role, hasInitializedRole]);

  // Route protection logic
  const handleNavigate = (targetScreen: ScreenState) => {
    setAuthError(null);

    // Protected routes requiring authentication
    const requiresAuth = ['MY_COMPLAINTS', 'ADMIN_DASHBOARD', 'OFFICER_DASHBOARD'].includes(targetScreen);

    if (requiresAuth && !isAuthenticated) {
      setAuthError('Please log in to access this feature.');
      setScreen('LOGIN');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Role-based restrictions
    if (targetScreen === 'ADMIN_DASHBOARD' && role !== 'admin') {
      setAuthError('Access Denied: Administrative privileges required.');
      setScreen(role === 'officer' ? 'OFFICER_DASHBOARD' : 'HOME');
      return;
    }

    if (targetScreen === 'OFFICER_DASHBOARD' && role !== 'officer' && role !== 'admin') {
      setAuthError('Access Denied: Transport Officer privileges required.');
      setScreen('HOME');
      return;
    }

    setScreen(targetScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReportSubmit = async (formData: Partial<Complaint>) => {
    const res = await api.createComplaint(formData);
    if (res.success && (res.complaint || res.data?.complaint)) {
      const comp = res.complaint || res.data?.complaint;
      setTrackComplaintId(comp.complaintId);
      handleNavigate('TRACK_COMPLAINT');
    }
  };

  // 1. SPLASH / LOADING SCREEN DURING SESSION RESTORATION
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
        <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center text-slate-950 mb-6 shadow-2xl animate-pulse">
          <BusIcon className="w-10 h-10" />
        </div>
        <div className="space-y-2 max-w-sm">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Government of Tamil Nadu • Transport Department
          </span>
          <h1 className="text-2xl font-black tracking-tight">Smart Bus System</h1>
          <p className="text-xs text-slate-400">Restoring security session & live bus telemetry...</p>
        </div>
        <div className="mt-8 flex items-center gap-2 text-xs text-slate-400 font-mono">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
          <span>Authenticating Token & MongoDB APIs</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <Header currentScreen={screen} onNavigate={handleNavigate} />

      {/* Global Auth Warning Banner */}
      {authError && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm">
          <Shield className="w-4 h-4 shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {/* Main Feature Page Routing */}
      <main className="flex-1">
        {screen === 'HOME' && <HomePage onNavigate={handleNavigate} />}

        {screen === 'NEARBY_BUSES' && (
          <NearbyBusesPage
            onSelectBusForReport={(bus) => {
              setSelectedBusForReport(bus);
            }}
            onNavigate={handleNavigate}
          />
        )}

        {screen === 'REPORT_COMPLAINT' && (
          <ReportComplaintPage
            initialBus={selectedBusForReport}
            onSubmit={handleReportSubmit}
            onNavigate={handleNavigate}
          />
        )}

        {screen === 'ROUTES' && (
          <RouteTrackingPage
            onNavigate={handleNavigate}
            onSelectBusForReport={(bus) => {
              setSelectedBusForReport(bus);
            }}
          />
        )}

        {screen === 'ACKNOWLEDGEMENT' && (
          <EmailAcknowledgementPage onNavigate={handleNavigate} />
        )}

        {screen === 'RESOLUTION' && (
          <ResolutionPage onNavigate={handleNavigate} />
        )}

        {screen === 'TRACK_COMPLAINT' && (
          <div className="max-w-4xl mx-auto px-4 py-6">
            <ComplaintTracker initialComplaintId={trackComplaintId} />
          </div>
        )}

        {screen === 'MY_COMPLAINTS' && (
          <div className="max-w-4xl mx-auto px-4 py-6">
            <MyComplaints
              onTrackComplaint={(id) => {
                setTrackComplaintId(id);
                handleNavigate('TRACK_COMPLAINT');
              }}
              onNewComplaint={() => handleNavigate('REPORT_COMPLAINT')}
            />
          </div>
        )}

        {screen === 'COMPLAINT_DETAILS' && (
          <ComplaintDetailsPage complaint={activeComplaintDetails} onNavigate={handleNavigate} />
        )}

        {screen === 'PROFILE' && <ProfilePage onNavigate={handleNavigate} />}

        {screen === 'LOGIN' && <LoginPage onNavigate={handleNavigate} />}
        {screen === 'REGISTER' && <RegisterPage onNavigate={handleNavigate} />}

        {screen === 'ADMIN_DASHBOARD' && role === 'admin' && <AdminPage />}
        {screen === 'OFFICER_DASHBOARD' && role === 'officer' && <OfficerDashboard />}
      </main>

      {/* Mobile Navigation */}
      <BottomNav currentScreen={screen} onNavigate={handleNavigate} />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
