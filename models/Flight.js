import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  airline: {
    type: String,
    required: true,
  },
  airlineCode: {
    type: String,
    required: true,
  },
  flightNumber: {
    type: Number,
    required: true,
  },
  origin: {
    type: String,
    required: true,
    uppercase: true,
  },
  destination: {
    type: String,
    required: true,
    uppercase: true,
  },
  price: {
    type: Number,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  departure: {
    type: Date,
    required: true,
  },
  arrival: {
    type: Date,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  operationalDays: {
    type: [Number],
    required: true,
  },
  bookedSeats: [String],
});

const Flight = mongoose.model('Flight', flightSchema);

export default Flight;
