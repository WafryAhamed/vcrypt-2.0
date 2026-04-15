import { useState, useEffect, useCallback, useMemo } from 'react';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

interface ApiError {
  message: string;
}

interface AuthData {
  token: string;
  role: string;
  userId: string;
  address?: string;
}

interface LoginResponse {
  token: string;
  role: string;
  _id: string;
  walletAddress?: string;
}

interface VehicleData {
  vin: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  registrationNumber: string;
  ownerAddress?: string;
  [key: string]: unknown;
}

interface DocumentData {
  name: string;
  type: string;
  hash: string;
  [key: string]: unknown;
}

interface UserRegistrationData {
  email: string;
  password: string;
  walletAddress?: string;
  role?: string;
  [key: string]: unknown;
}

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err && typeof err === 'object' && 'response' in err) {
    const axiosErr = err as AxiosError<ApiError>;
    return axiosErr.response?.data?.message || fallback;
  }
  return fallback;
};

const useMongoDB = () => {
  const { isAuthenticated, walletAddress } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get token from localStorage
  const getToken = useCallback((): string | null => {
    const userData = localStorage.getItem('auth');
    if (userData) {
      const parsedData: AuthData = JSON.parse(userData);
      return parsedData.token;
    }
    return null;
  }, []);

  // Configure axios with auth header
  const authAxios: AxiosInstance = useMemo(
    () =>
      axios.create({
        baseURL: API_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    []
  );

  // Add auth token to requests if available
  useEffect(() => {
    const token = getToken();
    if (token) {
      authAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete authAxios.defaults.headers.common['Authorization'];
    }
  }, [isAuthenticated, getToken, authAxios]);

  // Vehicle operations
  const registerVehicle = async (vehicleData: VehicleData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAxios.post('/vehicles', {
        ...vehicleData,
        ownerAddress: vehicleData.ownerAddress || walletAddress,
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err, 'Error registering vehicle'));
      setLoading(false);
      throw err;
    }
  };

  const getMyVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAxios.get('/vehicles/my', {
        params: { walletAddress },
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err, 'Error fetching vehicles'));
      setLoading(false);
      throw err;
    }
  };

  const verifyVehicle = async (searchType: string, searchValue: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_URL}/vehicles/verify/${searchType}/${searchValue}`
      );
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err, 'Vehicle not found'));
      setLoading(false);
      throw err;
    }
  };

  const transferVehicle = async (
    vehicleId: string,
    recipientAddress: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAxios.post(
        `/vehicles/${vehicleId}/transfer`,
        {
          recipientAddress,
          currentOwnerAddress: walletAddress,
        }
      );
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err, 'Error transferring vehicle'));
      setLoading(false);
      throw err;
    }
  };

  const uploadDocument = async (
    vehicleId: string,
    documentData: DocumentData
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAxios.post(
        `/vehicles/${vehicleId}/documents`,
        documentData
      );
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err, 'Error uploading document'));
      setLoading(false);
      throw err;
    }
  };

  // Transaction operations
  const getTransactionsByVehicle = async (vehicleId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAxios.get(
        `/transactions/vehicle/${vehicleId}`
      );
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err, 'Error fetching transactions'));
      setLoading(false);
      throw err;
    }
  };

  const getMyTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAxios.get('/transactions/my', {
        params: { walletAddress },
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err, 'Error fetching transactions'));
      setLoading(false);
      throw err;
    }
  };

  // User operations
  const loginWithCredentials = async (
    username: string,
    password: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<LoginResponse>(
        `${API_URL}/users/login`,
        {
          username,
          password,
        }
      );
      setLoading(false);
      // Update auth context and localStorage
      const {
        token,
        role,
        _id,
        walletAddress: userWalletAddress,
      } = response.data;
      localStorage.setItem(
        'auth',
        JSON.stringify({
          token,
          role,
          userId: _id,
          address: userWalletAddress,
        })
      );
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed'));
      setLoading(false);
      throw err;
    }
  };

  const loginWithWallet = async (address: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<LoginResponse>(
        `${API_URL}/users/login`,
        {
          walletAddress: address,
        }
      );
      setLoading(false);
      // Update auth context and localStorage
      const { token, role, _id } = response.data;
      localStorage.setItem(
        'auth',
        JSON.stringify({
          token,
          role,
          userId: _id,
          address,
        })
      );
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed'));
      setLoading(false);
      throw err;
    }
  };

  const registerUser = async (userData: UserRegistrationData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/users/register`, userData);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed'));
      setLoading(false);
      throw err;
    }
  };

  // Admin operations
  const getAllVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAxios.get('/vehicles');
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err, 'Error fetching vehicles'));
      setLoading(false);
      throw err;
    }
  };

  const updateVehicleStatus = async (vehicleId: string, status: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAxios.put(`/vehicles/${vehicleId}/status`, {
        status,
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err, 'Error updating vehicle status'));
      setLoading(false);
      throw err;
    }
  };

  const getAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAxios.get('/users');
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(getErrorMessage(err, 'Error fetching users'));
      setLoading(false);
      throw err;
    }
  };

  return {
    loading,
    error,
    // Vehicle operations
    registerVehicle,
    getMyVehicles,
    verifyVehicle,
    transferVehicle,
    uploadDocument,
    // Transaction operations
    getTransactionsByVehicle,
    getMyTransactions,
    // User operations
    loginWithCredentials,
    loginWithWallet,
    registerUser,
    // Admin operations
    getAllVehicles,
    updateVehicleStatus,
    getAllUsers,
  };
};

// Default export keeps the same name for backward compatibility
export default useMongoDB;

// Named export with the new name
export { useMongoDB as useApi };
