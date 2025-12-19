
export * from "./weather";

// Matchar exakt vad backend returnerar
export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Trip {
  id: number;
  user_id: number;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export type ActivityCategory =
  | "sightseeing"
  | "food"
  | "transport"
  | "accommodation"
  | "entertainment"
  | "shopping"
  | "outdoor"
  | "other";

export interface Activity {
  id: number;
  trip_id: number;
  day_number: number;
  title: string;
  description: string | null;
  time: string | null;
  category: ActivityCategory | null; // New
  location: string | null;  // New
  cost: number | null;  // New
  notes: string | null;  // New
  completed: boolean;  // New
  created_at: string;
}

export interface TripWithActivities extends Trip {
  activities: Activity[];
}

// Auth responses
export interface AuthResponse {
  user: User;
  token: string;
}

// Form data
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
}

export interface TripFormData {
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
}

export interface ActivityFormData {
  trip_id: number;
  day_number: number;
  title: string;
  description?: string;
  time?: string;
  category?: ActivityCategory; // New 
  location?: string;  // New 
  cost?: number;  // New 
  notes?: string; // New 
}

export interface DayItinerary {
  day_number: number;
  date: string;
  activities: Activity[];
  total_cost: number;
}

export interface TripItinerary {
  trip: Trip;
  days: DayItinerary[];
  total_activities: number;
  total_cost: number;
}

export const ACTIVITY_CATEGORIES: { value: ActivityCategory; label: string; icon: string }[] = [
  { value: "sightseeing", label: "Sightseeing", icon: "🏛️"},
  { value: "food", label: "Food", icon: "🍽️"},
  { value: "transport", label: "Transport", icon: "🚗"},
  { value: "accommodation", label: "Accommodation", icon: "🏨"},
  { value: "entertainment", label: "Entertainment", icon: "🎭"},
  { value: "shopping", label: "Shopping", icon: "🛍️"},
  { value: "outdoor", label: "Outdoor", icon: "🏞️"},
  { value: "other", label: "Other", icon: "📌"},
]