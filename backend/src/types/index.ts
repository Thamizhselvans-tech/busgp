export type UserRole = 'passenger' | 'admin' | 'officer';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export type BusStatus = 'moving' | 'stopped' | 'selected' | 'offline' | 'active' | 'inactive' | 'maintenance' | 'APPROACHING' | 'RUNNING' | 'DELAYED';

export interface IBus {
  _id?: string;
  busNumber: string; // e.g. 21G, 5E, 102, TN-32-N-1234
  registrationNumber: string;
  route: string; // e.g. Saidapet → Broadway
  source: string;
  destination: string;
  driver?: string;
  conductor?: string;
  assignedOfficer?: string;
  status: BusStatus;
  currentLat: number;
  currentLng: number;
  speed?: number;
  heading?: number;
  routeCoordinates?: Array<[number, number]>;
  lastUpdated?: Date;
  isSimulated?: boolean;
  isLiveAvailable?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ComplaintStatus = 'draft' | 'submitted' | 'under_review' | 'in_progress' | 'resolved' | 'rejected' | 'Pending' | 'Investigation';

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

export interface IComplaint {
  _id?: string;
  complaintId: string; // e.g. CMP-2026-000143
  userId: string;
  busId: string;
  busNumber?: string;
  route?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
  resolvedAt?: Date;
}
