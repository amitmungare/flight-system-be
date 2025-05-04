import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import Flight from '../models/Flight.js';

dotenv.config();

const importData = async () => {
  try {
    const data = fs.readFileSync('./seeder/UI_Assignment_Flight_Data.json');
    const flights = JSON.parse(data);

    await mongoose.connect(process.env.MONGO_URI);

    await Flight.deleteMany();
    await Flight.insertMany(flights);

    console.log('Flights imported from JSON');
    process.exit();
  } catch (error) {
    console.error('Error importing JSON:', error);
    process.exit(1);
  }
};

importData();
