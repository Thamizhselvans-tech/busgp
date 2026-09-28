import { User, Bus, Complaint } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('smart_bus_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'An unexpected API error occurred.');
  }
  return data;
};

export const api = {
  // Auth
  register: async (payload: { name: string; email: string; phone?: string; password: string; role?: string }) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  login: async (payload: { email: string; password: string }) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Buses
  getBuses: async (params?: { search?: string; status?: string; route?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/buses${query ? `?${query}` : ''}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getBusById: async (id: string) => {
    const res = await fetch(`${API_BASE}/buses/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  detectNearbyBuses: async (lat?: number, lng?: number, radius: number = 20) => {
    const query = lat && lng ? `?lat=${lat}&lng=${lng}&radius=${radius}` : `?radius=${radius}`;
    const res = await fetch(`${API_BASE}/buses/nearby${query}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createBus: async (busData: Partial<Bus>) => {
    const res = await fetch(`${API_BASE}/buses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(busData),
    });
    return handleResponse(res);
  },

  updateBus: async (id: string, busData: Partial<Bus>) => {
    const res = await fetch(`${API_BASE}/buses/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(busData),
    });
    return handleResponse(res);
  },

  deleteBus: async (id: string) => {
    const res = await fetch(`${API_BASE}/buses/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Complaints
  createComplaint: async (complaintData: Partial<Complaint>) => {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(complaintData),
    });
    return handleResponse(res);
  },

  getAllComplaints: async (params?: { status?: string; category?: string; busNumber?: string; search?: string; officer?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/complaints${query ? `?${query}` : ''}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getMyComplaints: async () => {
    const res = await fetch(`${API_BASE}/complaints/my`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getComplaintById: async (id: string) => {
    const res = await fetch(`${API_BASE}/complaints/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getUserComplaints: async (userId: string) => {
    const res = await fetch(`${API_BASE}/complaints/user/${userId}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  sendAcknowledgement: async (id: string, recipientEmail?: string) => {
    const res = await fetch(`${API_BASE}/complaints/${id}/acknowledgement`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ recipientEmail }),
    });
    return handleResponse(res);
  },

  updateComplaintStatus: async (id: string, payload: { status?: string; adminRemark?: string }) => {
    const res = await fetch(`${API_BASE}/complaints/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  assignOfficer: async (id: string, officer: string) => {
    const res = await fetch(`${API_BASE}/complaints/${id}/assign`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ officer }),
    });
    return handleResponse(res);
  },

  resolveComplaint: async (id: string, remark?: string) => {
    const res = await fetch(`${API_BASE}/complaints/${id}/resolve`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ remark }),
    });
    return handleResponse(res);
  },
};
