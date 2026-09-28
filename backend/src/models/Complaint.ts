import mongoose, { Schema, Document } from 'mongoose';
import { IComplaint } from '../types/index.js';

export interface IComplaintDocument extends Omit<IComplaint, '_id'>, Document {}

const ComplaintSchema = new Schema<IComplaintDocument>(
  {
    complaintId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true },
    busId: { type: Schema.Types.ObjectId as any, ref: 'Bus', required: true },
    busNumber: { type: String, required: true },
    route: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Overcrowding',
        'Rash driving',
        'Driver behaviour',
        'Conductor behaviour',
        'Bus cleanliness',
        'Bus timing',
        'Bus condition',
        'AC / Fan issue',
        'Seat issue',
        'Safety issue',
        'Women safety',
        'Other',
      ],
    },
    description: { type: String, required: true, minlength: 10 },
    boardingLocation: { type: String, required: true },
    destination: { type: String, required: true },
    incidentDate: { type: String, required: true },
    incidentTime: { type: String, required: true },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String },
    },
    imageUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'in_progress', 'resolved', 'rejected'],
      default: 'submitted',
    },
    assignedOfficer: { type: Schema.Types.Mixed, default: null },
    adminRemark: { type: String, default: '' },
    resolvedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const Complaint = mongoose.model<IComplaintDocument>('Complaint', ComplaintSchema);
