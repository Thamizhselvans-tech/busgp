import { Router } from 'express';
import {
  getAllBuses,
  getNearbyBuses,
  getBusById,
  getBusLocation,
  getBusRoute,
  updateBusLocation,
  createBus,
  updateBus,
  deleteBus,
} from '../controllers/busController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Public / Passenger accessible - Named routes MUST be registered before parameterized /:id routes!
router.get('/nearby', getNearbyBuses);
router.get('/detect', getNearbyBuses);
router.get('/', getAllBuses);

// Parameterized routes
router.get('/:id', getBusById);
router.get('/:id/location', getBusLocation);
router.get('/:id/route', getBusRoute);

// Telemetry update endpoint
router.post('/:id/location', updateBusLocation);

// Admin only routes
router.post('/', authenticate, authorize('admin'), createBus);
router.put('/:id', authenticate, authorize('admin'), updateBus);
router.delete('/:id', authenticate, authorize('admin'), deleteBus);

export default router;
