import { v4 as uuidv4 } from 'uuid';
import Flight from '../models/Flight.js';
import Booking from '../models/Booking.js';

export const createBooking = async (req, res) => {
  const { flightId, passengers, seats } = req.body;

  if (!flightId || !Array.isArray(passengers) || !seats || !Array.isArray(seats)) {
    return res.status(400).json({ message: 'Missing or invalid booking details' });
  }
  if (passengers.length !== seats.length) {
    return res.status(400).json({ message: 'No seat selected.' });
  }

  try {
    const flight = await Flight.findById(flightId);
    if (!flight) return res.status(404).json({ message: 'Flight not found' });

    const missingPassengerDetails = passengers.some(passenger => 
      !passenger.name || !passenger.age || passenger.age<1 || !passenger.gender || !passenger.seat
    );
    if (missingPassengerDetails) {
      return res.status(400).json({ message: 'Passenger details are missing or invalid' });
    }

    // 🔒 Check for seat availability
    const isSeatTaken = seats.some(seat => flight.bookedSeats.includes(seat));
    if (isSeatTaken) {
      return res.status(400).json({ message: 'One or more selected seats are already booked.' });
    }

    if (flight.availableSeats < seats.length) {
      return res.status(400).json({ message: 'Not enough seats available.' });
    }

    // ✅ Update flight seat info
    flight.availableSeats -= seats.length;
    flight.bookedSeats.push(...seats);
    await flight.save();

    // 📝 Create booking
    const booking = await Booking.create({
      user: req.user._id,
      flight: flightId,
      passengers,
      seats,
      confirmationNumber: uuidv4(),
    });

    res.status(201).json({
      message: 'Booking successful',
      confirmationNumber: booking.confirmationNumber,
      booking,
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('flight') // optionally populate flight details
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.error('Booking fetch error:', err);
    res.status(500).json({ message: 'Could not fetch bookings' });
  }
};