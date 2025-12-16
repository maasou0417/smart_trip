import axios from "axios";
import type {
  AuthResponse,
  LoginFormData,
  RegisterFormData,
  Trip,
  TripWithActivities,
  TripFormData,
  Activity,
  ActivityFormData,
  TripItinerary,
} from "../types/index";

const API_URL = "http://localhost:5000/api";

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.error || "";

      // If token expired or invalid, clear storage and redirect to login
      if (
        errorMessage.includes("expired") ||
        errorMessage.includes("Invalid token")
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// AUTH API
export const authAPI = {
  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  verify: async (): Promise<{ user: any; valid: boolean }> => {
    const response = await api.get("/auth/verify");
    return response.data;
  },
};

// TRIPS API
export const tripsAPI = {
  getAll: async (): Promise<Trip[]> => {
    const response = await api.get("/trips");
    return response.data;
  },

  getById: async (id: number): Promise<TripWithActivities> => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },

  create: async (data: TripFormData): Promise<Trip> => {
    const response = await api.post("/trips", data);
    return response.data;
  },

  update: async (id: number, data: Partial<TripFormData>): Promise<Trip> => {
    const response = await api.put(`/trips/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/trips/${id}`);
  },
};

// ACTIVITIES API
export const activitiesAPI = {
  create: async (data: ActivityFormData): Promise<Activity> => {
    const response = await api.post("/activities", data);
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<ActivityFormData>
  ): Promise<Activity> => {
    const response = await api.put(`/activities/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/activities/${id}`);
  },

  toggleComplete: async (id: number): Promise<Activity> => {
    const response = await api.patch(`/activities/${id}/toggle`);
    return response.data;
  },

  getByDay: async (tripId: number,
     dayNumber: number): Promise<Activity[]> => {
    const response = await api.get(`/activities/trip/${tripId}/day/${dayNumber}`);
    return response.data;
  },
};

// Adding new ITINERARYAPI

export const itineraryAPI = {
  get: async (tripId: number): Promise<TripItinerary> => {
    const response = await api.get(`/itinerary/${tripId}`);
    return response.data;
  },

 getStats: async (tripId: number): Promise<any> => {
    const response = await api.get(`/itinerary/${tripId}/stats`);
    return response.data;
  },  
};