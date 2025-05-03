import express from 'express';
import { getFlightById, searchFlights } from '../controllers/flightController.js';

const router = express.Router();


router.get('/search', searchFlights);
router.get("/:id", getFlightById);

export default router;
