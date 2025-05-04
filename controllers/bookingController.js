import { v4 as uuidv4 } from 'uuid';
import Flight from '../models/Flight.js';
import Booking from '../models/Booking.js';

export const createBooking = async (req, res) => {
  const { flightId, passengers } = req.body;

  if (!flightId || !Array.isArray(passengers)) {
    return res.status(400).json({ message: 'Missing or invalid booking details' });
  }

  const seats = passengers.map(p => p.seat);

  console.log("seats",seats)
  console.log("passengers",passengers)

  if (passengers.length === 0 || seats.some(seat => !seat)) {
    return res.status(400).json({ message: 'No seat selected or seat missing for one or more passengers.' });
  }

  try {
    const flight = await Flight.findById(flightId);
    if (!flight) return res.status(404).json({ message: 'Flight not found' });

    const missingPassengerDetails = passengers.some(passenger => 
      !passenger.name || !passenger.age || passenger.age < 1 || !passenger.gender || !passenger.seat
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


export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id }).populate('flight');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.status(200).json(booking);
  } catch (err) {
    console.error('Get booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateBooking = async (req, res) => {
  const { passengers } = req.body;

  if (!Array.isArray(passengers)) {
    return res.status(400).json({ message: 'Invalid data format' });
  }
  
  const seats = passengers.map(p => p.seat);

  if (passengers.length === 0 || seats.some(seat => !seat)) {
    return res.status(400).json({ message: 'No seat selected or seat missing for one or more passengers.' });
  }

  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const flight = await Flight.findById(booking.flight);
    if (!flight) return res.status(404).json({ message: 'Associated flight not found' });

    // Free previously booked seats
    flight.bookedSeats = flight.bookedSeats.filter(seat => !booking.seats.includes(seat));
    flight.availableSeats += booking.seats.length;

    // Validate new seats
    const isSeatTaken = seats.some(seat => flight.bookedSeats.includes(seat));
    if (isSeatTaken) {
      return res.status(400).json({ message: 'One or more new seats are already booked.' });
    }

    if (flight.availableSeats < seats.length) {
      return res.status(400).json({ message: 'Not enough seats available.' });
    }

    // Apply new booking data
    flight.bookedSeats.push(...seats);
    flight.availableSeats -= seats.length;
    await flight.save();

    booking.passengers = passengers;
    booking.seats = seats;
    await booking.save();

    res.status(200).json({ message: 'Booking updated', booking });
  } catch (err) {
    console.error('Update booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const flight = await Flight.findById(booking.flight);
    if (flight) {
      // Restore seats
      flight.bookedSeats = flight.bookedSeats.filter(seat => !booking.seats.includes(seat));
      flight.availableSeats += booking.seats.length;
      await flight.save();
    }

    await booking.deleteOne();
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    console.error('Delete booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
