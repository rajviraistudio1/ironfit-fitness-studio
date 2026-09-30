export type FitnessGoal =
  | 'Weight Loss'
  | 'Muscle Gain'
  | 'General Fitness'
  | 'Strength Training'
  | 'Other';

export type PreferredWorkoutTime = 'Morning' | 'Afternoon' | 'Evening';

export type LeadStatus = 'New' | 'Contacted' | 'Follow-up' | 'Converted' | 'Closed';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  fitness_goal: FitnessGoal;
  preferred_workout_time: PreferredWorkoutTime;
  message?: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export interface LeadFormData {
  name: string;
  phone: string;
  email: string;
  fitness_goal: FitnessGoal;
  preferred_workout_time: PreferredWorkoutTime;
  message?: string;
  // Honeypot field for anti-spam (should be empty for humans)
  website_field?: string;
  form_loaded_at?: number;
}

export interface Trainer {
  name: string;
  role: string;
  experience: string;
  specializations: string[];
  image?: string;
}

export interface Testimonial {
  author: string;
  quote: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string | string[];
}

export interface ServiceItem {
  title: string;
  description: string;
}

export interface FacilityItem {
  name: string;
  iconName: string;
}

export interface AdminUser {
  email: string;
  name: string;
  role: 'owner' | 'admin';
}

export interface DashboardMetrics {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  followUpLeads: number;
  convertedLeads: number;
  closedLeads: number;
}
