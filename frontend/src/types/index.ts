export type ScreenState =
  | 'HOME'
  | 'NEARBY_BUSES'
  | 'REPORT_COMPLAINT'
  | 'TRACK_COMPLAINT'
  | 'MY_COMPLAINTS'
  | 'COMPLAINT_DETAILS'
  | 'PROFILE'
  | 'ROUTES'
  | 'ACKNOWLEDGEMENT'
  | 'RESOLUTION'
  | 'ABOUT'
  | 'HELP'
  | 'LOGIN'
  | 'REGISTER'
  | 'ADMIN_DASHBOARD'
  | 'OFFICER_DASHBOARD'
  | 'BUS_DETECTION'
  | 'LIVE_FOUND'
  | 'LIVE_MISSING'
  | 'BUS_SELECTION'
  | 'BUS_SELECTED'
  | 'COMPLAINT_FORM'
  | 'COMPLAINT_SUBMITTED'
  | 'TRACKING';

export type DetectionState = 'idle' | 'detecting' | 'live_found' | 'live_missing' | 'manual';

export type LocationPermissionState = 'unknown' | 'requesting' | 'granted' | 'denied' | 'unavailable';

export type UserRole = 'passenger' | 'admin' | 'officer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export type BusStatusType =
  | 'moving'
  | 'stopped'
  | 'selected'
  | 'offline'
  | 'APPROACHING'
  | 'RUNNING'
  | 'DELAYED'
  | 'active'
  | 'maintenance'
  | 'inactive';

export type BusStatus = BusStatusType;

export interface Bus {
  _id: string;
  busNumber: string;
  registrationNumber: string;
  route: string;
  source: string;
  destination: string;
  currentLocationName?: string;
  driver?: string;
  conductor?: string;
  assignedOfficer?: string;
  status: BusStatusType;
  currentLat?: number;
  currentLng?: number;
  lat?: number;
  lng?: number;
  speed?: number;
  heading?: number;
  distance?: string;
  distanceKm?: number;
  eta?: string;
  etaMinutes?: number;
  expectedArrival?: string;
  routeCoordinates?: Array<[number, number]>;
  lastUpdated?: string | Date;
  isSimulated?: boolean;
  isLive?: boolean;
  isLiveAvailable?: boolean;
}

export type ComplaintStatus =
  | 'submitted'
  | 'under_review'
  | 'in_progress'
  | 'resolved'
  | 'rejected'
  | 'Pending'
  | 'Investigation'
  | 'Resolved';

export type ComplaintCategory =
  | 'Bus did not stop'
  | 'Bus skipped stop'
  | 'Route issue'
  | 'Timing issue'
  | 'Overcrowding'
  | 'Driver/Conductor behaviour'
  | 'Rash driving'
  | 'Bus cleanliness'
  | 'Bus condition'
  | 'AC / Fan issue'
  | 'Seat issue'
  | 'Safety issue'
  | 'Other';

export interface Complaint {
  _id?: string;
  complaintId: string;
  userId: string | User;
  busId: string | Bus;
  busNumber: string;
  route: string;
  category: ComplaintCategory;
  description: string;
  boardingLocation: string;
  destination: string;
  incidentDate: string;
  incidentTime: string;
  location?: {
    lat?: number;
    lng?: number;
    address?: string;
  };
  imageUrl?: string;
  status: ComplaintStatus;
  assignedOfficer?: string;
  adminRemark?: string;
  createdAt?: string;
  updatedAt?: string;
  resolvedAt?: string;
}
