import { ComplaintCategory } from '../types';

export const COMPLAINT_CATEGORIES: ComplaintCategory[] = [
  'Bus did not stop',
  'Bus skipped stop',
  'Route issue',
  'Timing issue',
  'Overcrowding',
  'Driver/Conductor behaviour',
  'Rash driving',
  'Bus cleanliness',
  'Bus condition',
  'AC / Fan issue',
  'Seat issue',
  'Safety issue',
  'Other',
];

export const STATUS_COLORS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  Pending: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-300',
    label: 'Pending',
  },
  submitted: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-300',
    label: 'Pending',
  },
  Investigation: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
    label: 'Investigation',
  },
  under_review: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
    label: 'Under Review',
  },
  in_progress: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    border: 'border-indigo-300',
    label: 'Action Taken',
  },
  Resolved: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-300',
    label: 'Resolved',
  },
  resolved: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-300',
    label: 'Resolved',
  },
  rejected: {
    bg: 'bg-rose-100',
    text: 'text-rose-800',
    border: 'border-rose-300',
    label: 'Rejected',
  },
};
