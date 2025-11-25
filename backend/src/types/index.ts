
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

export interface Activity {
  id: number;
  trip_id: number;
  day_number: number;
  title: string;
  description: string | null;
  time: string | null;      // tex: "09:00" 
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
}

export interface UpdateActivityDto {
  day_number?: number;
  title?: string;
  description?: string;
  time?: string;
}

// Response Types - represent data the frontend receives

export interface AuthResponse {
  user: Omit<User, "password">;
  token: string;
}

export interface TripWithActivities extends Trip {
  activities: Activity[];
}