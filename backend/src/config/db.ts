import mongoose from 'mongoose';
import { seedDatabase } from '../services/seedService.js';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart-bus';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ Connected to MongoDB database successfully.');

    // Seed default data if database is empty
    await seedDatabase();
  } catch (error: any) {
    console.error('⚠️  Failed to connect to MongoDB:', error.message);
    console.warn('Backend server will continue running, but MongoDB features will require database service.');
  }
};
