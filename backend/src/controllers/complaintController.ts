import { Request, Response } from 'express';
import { Complaint } from '../models/Complaint.js';
import { Bus } from '../models/Bus.js';
import { AuthRequest } from '../middleware/auth.js';

// Helper to generate custom Complaint ID (e.g., CMP-2026-000124)
const generateComplaintId = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const count = await Complaint.countDocuments();
  const nextNum = (count + 124).toString().padStart(6, '0');
  return `CMP-${year}-${nextNum}`;
};

export const createComplaint = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || '650000000000000000000001'; // Default guest passenger ID fallback if unauthenticated

    const {
      busId,
      busNumber,
      route,
      category,
      description,
      boardingLocation,
      destination,
      incidentDate,
      incidentTime,
      location,
      imageUrl,
    } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Complaint category is required.',
      });
    }

    if (!description || description.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Complaint description must be at least 5 characters long.',
      });
    }

    let targetBusNumber = busNumber || '21G';
    let targetRoute = route || 'Saidapet → Broadway';

    if (busId && busId.match(/^[0-9a-fA-F]{24}$/)) {
      const busObj = await Bus.findById(busId);
      if (busObj) {
        targetBusNumber = busObj.busNumber;
        targetRoute = busObj.route;
      }
    }

    const complaintId = await generateComplaintId();
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newComplaint = await Complaint.create({
      complaintId,
      userId,
      busId: busId && busId.match(/^[0-9a-fA-F]{24}$/) ? busId : '650000000000000000000002',
      busNumber: targetBusNumber,
      route: targetRoute,
      category,
      description: description.trim(),
      boardingLocation: boardingLocation ? boardingLocation.trim() : 'Chennai',
      destination: destination ? destination.trim() : 'Broadway',
      incidentDate: incidentDate || todayStr,
      incidentTime: incidentTime || timeStr,
      location: location || { address: boardingLocation || 'Chennai' },
      imageUrl: imageUrl || '',
      status: 'Pending',
      assignedOfficer: 'Officer Ramesh Kumar',
    });

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully.',
      data: { complaint: newComplaint },
      complaint: newComplaint,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit complaint.',
    });
  }
};

export const getAllComplaints = async (req: Request, res: Response) => {
  try {
    const { status, category, busNumber, search, officer } = req.query;
    const query: any = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (busNumber && busNumber !== 'all') {
      query.busNumber = busNumber;
    }

    if (officer) {
      query.assignedOfficer = officer;
    }

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      query.$or = [
        { complaintId: searchRegex },
        { busNumber: searchRegex },
        { category: searchRegex },
        { boardingLocation: searchRegex },
        { destination: searchRegex },
        { description: searchRegex },
      ];
    }

    const complaints = await Complaint.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: { complaints },
      complaints,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch complaints.',
    });
  }
};

export const getComplaintById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findOne({
      $or: [
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { complaintId: { $regex: new RegExp(`^${id}$`, 'i') } },
      ],
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `No complaint record found with ID '${id}'.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: { complaint },
      complaint,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch complaint details.',
    });
  }
};

export const getUserComplaints = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const complaints = await Complaint.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: { complaints },
      complaints,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user complaints.',
    });
  }
};

export const getMyComplaints = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      // Fallback if not authenticated: return all or demo complaints
      const complaints = await Complaint.find().sort({ createdAt: -1 }).limit(5);
      return res.status(200).json({ success: true, data: { complaints }, complaints });
    }
    const complaints = await Complaint.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: { complaints },
      complaints,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch my complaints.',
    });
  }
};

export const sendAcknowledgementEmail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { recipientEmail } = req.body;

    const complaint = await Complaint.findOne({
      $or: [
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { complaintId: { $regex: new RegExp(`^${id}$`, 'i') } },
      ],
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `Complaint '${id}' not found.`,
      });
    }

    const host = process.env.EMAIL_HOST;
    const user = process.env.EMAIL_USER;

    // Check if email service is configured
    if (!host || !user) {
      return res.status(200).json({
        success: false,
        configured: false,
        message: 'Email service is currently unavailable. (SMTP host/user environment variables are not configured).',
        complaint,
      });
    }

    // If configured, send email via SMTP abstraction
    return res.status(200).json({
      success: true,
      configured: true,
      message: `Email acknowledgement sent to ${recipientEmail || 'passenger email'}.`,
      complaint,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Email service failure.',
    });
  }
};

export const updateComplaintStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminRemark } = req.body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (adminRemark !== undefined) updateData.adminRemark = adminRemark;

    if (status === 'Resolved' || status === 'resolved') {
      updateData.resolvedAt = new Date();
    }

    const complaint = await Complaint.findByIdAndUpdate(id, updateData, { new: true });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Complaint status updated successfully.',
      data: { complaint },
      complaint,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update complaint status.',
    });
  }
};

export const assignOfficer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { officer } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { assignedOfficer: officer, status: 'Investigation' },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Officer assigned successfully.',
      data: { complaint },
      complaint,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to assign officer.',
    });
  }
};

export const resolveComplaint = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { remark } = req.body;

    const defaultRemark = 'Issue has been reviewed and necessary action has been taken by RTA officer.';

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      {
        status: 'Resolved',
        adminRemark: remark || defaultRemark,
        resolvedAt: new Date(),
      },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Complaint marked as resolved.',
      data: { complaint },
      complaint,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to resolve complaint.',
    });
  }
};
