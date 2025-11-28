

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

export interface Activity {
  id: number;
  trip_id: number;
  day_number: number;
  title: string;
  description: string | null;
  time: string | null;
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
}