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
} from "../types/index";

const API_URL = "http://localhost:5000/api";

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Lägg till token i varje request automatiskt
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


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
};


// TRIPS API

export const tripsAPI = {
  getAll: async (): Promise<Trip[]> => {
    const response = await api.get("/trips");
    return response.data;
  },
  getById: async (id: number): Promise<TripWithActivities> => {
    const response = await api.get(`/trips/${id}`);  // ✅ Fixed: parentheses + template literal
    return response.data;
  },
  create: async (data: TripFormData): Promise<Trip> => {
    const response = await api.post("/trips", data);
    return response.data;
  },
  update: async (id: number, data: Partial<TripFormData>): Promise<Trip> => {
    const response = await api.put(`/trips/${id}`, data);  // ✅ Fixed
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/trips/${id}`);  // ✅ Fixed
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
    const response = await api.put(`/activities/${id}`, data);  // ✅ Fixed
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/activities/${id}`);  // ✅ Fixed
  },
};