
// Database types === database tabellerna ser ut i Supabase

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  created_at: Date;
}


export interface Trip {
  id: number;
  user_id: number;
  title: string;
  destination: string;
  start_date: Date;
  end_date: Date;
  created_at: Date;
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
  time: string | null;      // tex: "09:00" 
  category: ActivityCategory | null; // New
  location: string | null;  // New
  cost: number | null;  // New
  notes: string | null;   // New
  completed: boolean;   // New
  created_at: Date;
}


// DTO TYPES (Data Transfer Objects - represent data the frontend sends)

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateTripDto {
  title: string;
  destination: string;
  start_date: string;       // tex: "2025-06-01"
  end_date: string;
}


export interface UpdateTripDto {
  title?: string;
  destination?: string;
  start_date?: string;
  end_date?: string;
}

export interface CreateActivityDto {
  trip_id: number;
  day_number: number;
  title: string;
  description?: string;
  time?: string;
  category?: ActivityCategory; // New
  location?: string;  // New
  cost?: number;  // New
  notes?: string;  // New
}

export interface UpdateActivityDto {
  day_number?: number;
  title?: string;
  description?: string;
  time?: string;
  category?: ActivityCategory; // New
  location?: string;  // New
  cost?: number;  // New
  notes?: string;  // New
  completed?: boolean;  // New
} 

// Itinerary helpers
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

// Response Types - represent data the frontend receives

export interface AuthResponse {
  user: Omit<User, "password">;
  token: string;
}

export interface TripWithActivities extends Trip {
  activities: Activity[];
}