import mongoose from 'mongoose';

const passengerSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  seat: Number,
});

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
  passengers: [passengerSchema],
  seats: [String],
  bookingDate: { type: Date, default: Date.now },
  confirmationNumber: String,
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
