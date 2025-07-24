// User related interfaces
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface ILoginInput {
  email: string;
  password: string;
}

// Loan Application interfaces
export interface ILoanApplication {
  _id: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  purpose: string;
  tenure: number;
  monthlyIncome: number;
  employmentType: string;
  panCard?: string;
  aadharCard?: string;
  status: ApplicationStatus;
  verifiedBy?: string;
  verifiedAt?: Date;
  adminActionBy?: string;
  adminActionAt?: Date;
  rejectionReason?: string;
  submittedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoanApplicationInput {
  name: string;
  email: string;
  phone: string;
  amount: number;
  purpose: string;
  tenure: number;
  monthlyIncome: number;
  employmentType: string;
  panCard?: string;
  aadharCard?: string;
}

// Enums for better type safety
export enum UserRole {
  ADMIN = 'admin',
  VERIFIER = 'verifier'
}

export enum ApplicationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}
// API Response interfaces for consistent responses
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Dashboard Statistics interface
export interface IDashboardStats {
  totalApplications: number;
  pendingApplications: number;
  verifiedApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalLoanAmount: number;
  approvedLoanAmount: number;
  averageLoanAmount: number;
}

// JWT Payload interface
export interface IJWTPayload {
  id: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// Error handling interfaces
export interface ICustomError extends Error {
  statusCode?: number;
  code?: string;
}
