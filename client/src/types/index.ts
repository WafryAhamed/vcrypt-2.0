export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  OFFICER = 'OFFICER'
}

export enum VehicleStatus {
  ACTIVE = 'ACTIVE',
  TRANSFERRED = 'TRANSFERRED',
  FLAGGED = 'FLAGGED'
}

export enum TransactionType {
  REGISTRATION = 'REGISTRATION',
  TRANSFER = 'TRANSFER',
  VERIFICATION = 'VERIFICATION'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED'
}

export interface User {
  id: number;
  walletAddress: string | null;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: number;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  registrationNumber: string;
  ownerId: number;
  status: VehicleStatus;
  txHash: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: number;
  vehicleId: number;
  fromUserId: number;
  toUserId: number;
  txHash: string;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface WalletState {
  address: `0x${string}` | undefined;
  chainId: number | undefined;
  isConnected: boolean;
  isCorrectNetwork: boolean;
}
