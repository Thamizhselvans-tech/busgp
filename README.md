# Smart Bus Complaint & Monitoring System 🚍

A mobile-first digital government web application built for passengers, transport officers, and administrators to monitor public buses, detect nearby vehicles, log complaints, track investigation progress in real-time, and manage public transit fleets.

---

## 🌟 Features

### 👨‍✈️ Passenger Features
- **Live Nearby Bus Detection**: Scan for active nearby buses using GPS telemetry abstraction (`BusLocationService`).
- **Graceful Detection Fallback**: Immediate transition to manual selection if live tracking is unavailable or location permissions are denied—no dead-ends.
- **Manual Bus Search & Entry**: Search buses by number or route, or manually input custom bus details.
- **Structured Complaint Filing**:
  - Pre-filled bus information (Bus Number, Route, Boarding, Destination).
  - 12 Complaint Categories (*Overcrowding*, *Rash driving*, *Driver behaviour*, *Conductor behaviour*, *Bus cleanliness*, *Bus timing*, *Bus condition*, *AC / Fan issue*, *Seat issue*, *Safety issue*, *Women safety*, *Other*).
  - Detailed description with live character validation.
  - Optional photo evidence upload & timestamping.
  - Review section before final submission.
- **Real-Time Complaint Tracking**: Track progress via reference ID (e.g. `CB-2026-000124`) with a visual step-by-step timeline and official officer remarks.
- **My Complaints History**: View past grievances submitted from your account.

### 🛡️ Transport Officer Features
- **Assigned Queue**: View grievances assigned to your jurisdiction or bus fleet.
- **Investigation Updates**: Update complaint status (`Under Review`, `Action In Progress`, `Resolved`, `Rejected`).
- **Official Resolution Remarks**: Add detailed administrative notes on corrective measures taken.

### 👑 Admin Dashboard Features
- **Real-Time KPI Cards**: Total Complaints, New Complaints, Under Review, In Progress, Resolved counts.
- **Complaint Management Table**: Filter by status, category, bus, date, or keyword search.
- **Officer Assignment**: Assign specific transport enforcement officers to open complaints.
- **Bus Fleet Directory**: Complete CRUD operations for government buses, status toggles (*Active*, *Inactive*, *Maintenance*), and driver/conductor assignments.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React Icons.
- **Backend**: Node.js, Express.js, TypeScript, REST API architecture.
- **Database**: MongoDB & Mongoose.
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing and Role-Based Access Control (RBAC).

---

## 👥 User Roles & Demo Credentials

The database automatically seeds with realistic demo data on initial launch:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Admin** | `admin@tnbus.gov.in` | `admin123` | Full system control, fleet management, officer assignment |
| **Officer** | `officer.ramesh@tnbus.gov.in` | `officer123` | Inspect assigned complaints, update progress, resolve cases |
| **Passenger** | `passenger@example.com` | `password123` | Detect buses, submit grievances, track timeline |

---

## 🔄 Main State Model & Transitions

The application state model follows the exact state machine specification:

```text
{
  screen: "HOME" | "BUS_DETECTION" | "LIVE_FOUND" | "LIVE_MISSING" | "BUS_SELECTION" | "BUS_SELECTED" | "COMPLAINT_FORM" | "COMPLAINT_SUBMITTED" | "TRACKING",
  location: "unknown" | "requesting" | "granted" | "denied" | "unavailable",
  bus: Bus | null,
  detection: "idle" | "detecting" | "live_found" | "live_missing" | "manual",
  complaint: Complaint | null,
  error: string | null
}
```

### Flow Diagram

```text
HOME ──> LOCATE ──> BUS_DETECTION ┬──> LIVE_FOUND ──> BUS_SELECTED ──> COMPLAINT_FORM ──> SUBMIT ──> COMPLAINT_SUBMITTED ──> TRACKING
                                  │                                                                         │
                                  └──> LIVE_MISSING ──> BUS_SELECTION ──> MANUAL ──> BUS_SELECTED ──────────┘
```

---

## 📡 REST API Architecture

### Auth
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Authenticate & obtain JWT
- `GET /api/auth/me` - Get current user profile

### Buses
- `GET /api/buses` - List all buses (supports search & filter)
- `GET /api/buses/detect` - Detect nearby active buses
- `GET /api/buses/:id` - Get bus by ID
- `POST /api/buses` - Admin create new bus
- `PUT /api/buses/:id` - Admin update bus
- `DELETE /api/buses/:id` - Admin remove bus

### Complaints
- `POST /api/complaints` - Submit a new complaint (generates `CB-2026-XXXXXX` ID)
- `GET /api/complaints` - Admin/Officer fetch complaints (filtered by status, category, bus)
- `GET /api/complaints/:id` - Lookup complaint by ID or reference code
- `GET /api/complaints/user/:userId` - Fetch user's complaints
- `PUT /api/complaints/:id/status` - Update status & administrative notes
- `PUT /api/complaints/:id/assign` - Assign officer to complaint
- `PUT /api/complaints/:id/resolve` - Mark complaint as resolved with officer remark

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB server running locally or MongoDB Atlas URI

### 1. Backend Setup
```bash
cd backend
npm install
npm run build
npm start
```
*Backend runs on `http://localhost:5000`*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 📄 License
Government Digital Public Infrastructure (Open Source)
