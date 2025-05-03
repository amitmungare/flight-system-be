import Flight from "../models/Flight";

export const searchFlights = async (req, res) => {
  try {
    const { origin, destination, departureDate, passengers } = req.query;

    if (!origin && !destination && !departureDate && !passengers) {
      const allFlights = await Flight.find();
      return res.status(200).json(allFlights);
    }

    // Validate required fields
    if (!origin || !destination || !departureDate || !passengers) {
      return res.status(400).json({ message: 'Origin, destination, departure date, and number of passengers are required.' });
    }

    const numPassengers = parseInt(passengers, 10);
    if (isNaN(numPassengers) || numPassengers <= 0) {
      return res.status(400).json({ message: 'Number of passengers must be a valid positive integer.' });
    }

    const startOfDay = new Date(departureDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    
    const endOfDay = new Date(departureDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Query matching flight(s)
    const flights = await Flight.find({
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      departure: { $gte: startOfDay, $lte: endOfDay },
      availableSeats: { $gte: numPassengers },
    });

    if (!flights || flights.length === 0) {
      return res.status(404).json({ message: 'No available flights found for the given criteria.' });
    }

    return res.status(200).json(flights);
  } catch (error) {
    console.error('Flight search error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getFlightById = async (req, res) => {
  try {
    const { id } = req.params;

    const flight = await Flight.findById(id);

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    res.status(200).json(flight);
  } catch (error) {
    console.error("Error fetching flight by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};





