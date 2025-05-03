import express from 'express';
import { createBooking, getUserBookings } from '../controllers/bookingController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/v1/bookings
router.post('/', authenticateJWT, createBooking);
router.get('/my-bookings', authenticateJWT, getUserBookings);

export default router;
