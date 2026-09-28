import mongoose, { Schema, Document } from 'mongoose';
import { IBus } from '../types/index.js';

export interface IBusDocument extends Omit<IBus, '_id'>, Document {}

const BusSchema = new Schema<IBusDocument>(
  {
    busNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    registrationNumber: { type: String, required: true, trim: true },
    route: { type: String, required: true, trim: true },
    source: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    driver: { type: String, default: '' },
    conductor: { type: String, default: '' },
    assignedOfficer: { type: Schema.Types.Mixed, default: null },
    status: {
      type: String,
      enum: ['moving', 'stopped', 'selected', 'offline', 'active', 'inactive', 'maintenance', 'APPROACHING', 'RUNNING', 'DELAYED'],
      default: 'moving',
    },
    currentLat: { type: Number, default: 13.0827 },
    currentLng: { type: Number, default: 80.2707 },
    speed: { type: Number, default: 28 },
    heading: { type: Number, default: 90 },
    routeCoordinates: { type: [[Number]], default: [] }, // Array of [lat, lng]
    lastUpdated: { type: Date, default: Date.now },
    isSimulated: { type: Boolean, default: true },
    isLiveAvailable: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Bus = mongoose.model<IBusDocument>('Bus', BusSchema);
