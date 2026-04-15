import axios from 'axios';
import { User, Vehicle, Transaction, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

axiosInstance.interceptors.request.use((config) => {
  const headers = getAuthHeaders();
  if (headers.Authorization) {
    config.headers.Authorization = headers.Authorization;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt');
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export const api = {
  auth: {
    siwe: async (data: { walletAddress: string; signature: string; message: string }): Promise<ApiResponse<{ user: User; token: string }>> => {
      const resp = await axiosInstance.post('/auth/siwe', data);
      return resp as any as ApiResponse<{ user: User; token: string }>;
    },
  },
  users: {
    register: async (data: any): Promise<ApiResponse<{ user: User; token: string }>> => {
      const resp = await axiosInstance.post('/users/register', data);
      return resp as any as ApiResponse<{ user: User; token: string }>;
    },
    login: async (data: any): Promise<ApiResponse<{ user: User; token: string }>> => {
      const resp = await axiosInstance.post('/users/login', data);
      return resp as any as ApiResponse<{ user: User; token: string }>;
    },
    getProfile: async (): Promise<ApiResponse<User & { vehicles: Vehicle[] }>> => {
      const resp = await axiosInstance.get('/users/profile');
      return resp as any as ApiResponse<User & { vehicles: Vehicle[] }>;
    },
    updateWallet: async (walletAddress: string): Promise<ApiResponse<User>> => {
      const resp = await axiosInstance.patch('/users/wallet', { walletAddress });
      return resp as any as ApiResponse<User>;
    },
  },
  vehicles: {
    register: async (data: any): Promise<ApiResponse<Vehicle>> => {
      const resp = await axiosInstance.post('/vehicles/register', data);
      return resp as any as ApiResponse<Vehicle>;
    },
    getMyVehicles: async (): Promise<ApiResponse<Vehicle[]>> => {
      const resp = await axiosInstance.get('/vehicles/my');
      return resp as any as ApiResponse<Vehicle[]>;
    },
    getByVin: async (vin: string): Promise<ApiResponse<Vehicle>> => {
      const resp = await axiosInstance.get(`/vehicles/${vin}`);
      return resp as any as ApiResponse<Vehicle>;
    },
    transfer: async (data: { vin: string; toUserId: number; txHash: string }): Promise<ApiResponse<{ vehicle: Vehicle; transaction: Transaction }>> => {
      const resp = await axiosInstance.post('/vehicles/transfer', data);
      return resp as any as ApiResponse<{ vehicle: Vehicle; transaction: Transaction }>;
    },
    verify: async (vin: string): Promise<ApiResponse<{ verified: boolean; vehicle: Vehicle; transactionCount: number; currentOwner: any; history: any[] }>> => {
      const resp = await axiosInstance.get(`/vehicles/verify/${vin}`);
      return resp as any as ApiResponse<{ verified: boolean; vehicle: Vehicle; transactionCount: number; currentOwner: any; history: any[] }>;
    },
  },
  transactions: {
    create: async (data: any): Promise<ApiResponse<Transaction>> => {
      const resp = await axiosInstance.post('/transactions', data);
      return resp as any as ApiResponse<Transaction>;
    },
    getMy: async (): Promise<ApiResponse<Transaction[]>> => {
      const resp = await axiosInstance.get('/transactions/my');
      return resp as any as ApiResponse<Transaction[]>;
    },
    getByVehicle: async (vehicleId: number): Promise<ApiResponse<Transaction[]>> => {
      const resp = await axiosInstance.get(`/transactions/vehicle/${vehicleId}`);
      return resp as any as ApiResponse<Transaction[]>;
    },
    updateStatus: async (data: { txHash: string; status: string }): Promise<ApiResponse<Transaction>> => {
      const resp = await axiosInstance.patch('/transactions/status', data);
      return resp as any as ApiResponse<Transaction>;
    },
  },
};
