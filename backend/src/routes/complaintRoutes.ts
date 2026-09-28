import { Router } from 'express';
import {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  getUserComplaints,
  getMyComplaints,
  sendAcknowledgementEmail,
  updateComplaintStatus,
  assignOfficer,
  resolveComplaint,
} from '../controllers/complaintController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Public & Passenger routes
router.post('/', createComplaint);
router.get('/my', authenticate, getMyComplaints);
router.get('/user/:userId', getUserComplaints);
router.get('/:id', getComplaintById);
router.post('/:id/acknowledgement', sendAcknowledgementEmail);

// Admin & Officer management routes
router.get('/', getAllComplaints);
router.put('/:id/status', updateComplaintStatus);
router.put('/:id/assign', assignOfficer);
router.put('/:id/resolve', resolveComplaint);

export default router;
