import express from 'express';
import { createBooking, deleteBooking, getBooking, getUserBookings, updateBooking } from '../controllers/bookingController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateJWT, createBooking);
router.get('/', authenticateJWT, getUserBookings);
router.get('/:id', authenticateJWT, getBooking);
router.put('/:id', authenticateJWT, updateBooking);
router.delete('/:id', authenticateJWT, deleteBooking);

export default router;
