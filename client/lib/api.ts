import axios from "axios";
import { getAuthToken } from "./auth";
import { create } from "domain";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// attach the JWT to every outgoing request, if one exists
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export interface PaginationResponse<T> {
  tasks: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const api = {
  auth: {
    login: async (data: { email: string; password: string }) => {
      const response = await apiClient.post("/auth/login", data);
      return response.data;
    },

    register: async (data: {
      name: string;
      email: string;
      password: string;
      number?: string;
    }) => {
      const response = await apiClient.post("/auth/register", data);
      return response.data;
    },

    profile: async () => {
      const response = await apiClient.get("/auth/profile");
      return response.data;
    },

    logout: async () => {
      const response = await apiClient.post("/auth/logout");
      return response.data;
    },
  },

  tasks: {
    getUserTask: async () => {
      const tasks = await apiClient.get("/tasks");
      return tasks.data;
    },
    changeStatus: async (taskId: string, status: string) => {
      const response = await apiClient.patch(`/tasks/${taskId}`, { status });
      return response.data;
    },
    createTask: async (data: { title: string, description: string, status: string, priority: string, dueDate: string }) => {
      const res = await apiClient.post("/tasks/", data);
      return res.data
    },
    updateTask: async (taskId: string, data: {
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
      dueDate?: string;
    }) => {
      const res = await apiClient.patch(`/tasks/edit/${taskId}`, data);
      return res.data;
    },

    getTasksWithPagination: async (
      userId: string,
      page: number = 1,
      limit: number = 10
    ): Promise<PaginationResponse<any>> => {
      const res = await apiClient.get(
        `/tasks/getPagination/${userId}?page=${page}&limit=${limit}`
      );
      return res.data;
    },
  },
};

export default api;