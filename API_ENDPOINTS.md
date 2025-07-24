# API Endpoints Documentation

Complete API reference for CreditSea Loan Backend system with detailed request/response examples. **✅ All APIs tested and validated with MongoDB Atlas Cloud Database.**

## Base URL
```
http://localhost:5001/api
```

## Database
- **MongoDB Atlas Cloud**: Connected to cloud database cluster
- **Database Name**: creditsea  
- **Connection**: Secure cloud connection with authentication

## Table of Contents
- [Authentication](#authentication)
- [Loan Applications](#loan-applications)
- [User Management](#user-management)
- [Error Responses](#error-responses)
- [Response Formats](#response-formats)

---

## Authentication

### Register User (Admin/Verifier)
Create a new admin or verifier account.

**Endpoint:** `POST /auth/register`  
**Access:** Public  
**Content-Type:** `application/json`

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@creditsea.com",
  "password": "securepassword123",
  "role": "verifier"
}
```

#### Request Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | User's full name (2-50 characters) |
| `email` | string | Yes | Valid email address (must be unique) |
| `password` | string | Yes | Password (minimum 6 characters) |
| `role` | string | No | User role: `admin` or `verifier` (default: `verifier`) |

#### Success Response (201)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "66b8f123456789abcdef0123",
      "name": "John Doe",
      "email": "john@creditsea.com",
      "role": "verifier",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Error Responses
```json
// 400 - Validation Error
{
  "success": false,
  "message": "Validation failed",
  "error": "Email is required",
  "timestamp": "2024-01-15T10:30:00.000Z"
}

// 409 - Conflict (Email already exists)
{
  "success": false,
  "message": "User already exists",
  "error": "Email is already registered",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Login User
Authenticate admin or verifier and receive JWT token.

**Endpoint:** `POST /auth/login`  
**Access:** Public  
**Content-Type:** `application/json`

#### Request Body
```json
{
  "email": "admin@creditsea.com",
  "password": "admin123"
}
```

#### Request Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Registered email address |
| `password` | string | Yes | User password |

#### Success Response (200)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "66b8f123456789abcdef0123",
      "name": "Admin User",
      "email": "admin@creditsea.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Error Responses
```json
// 401 - Invalid Credentials
{
  "success": false,
  "message": "Invalid credentials",
  "error": "Email or password is incorrect",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Loan Applications

### Submit Loan Application
Submit a new loan application (public endpoint).

**Endpoint:** `POST /applications/submit`  
**Access:** Public  
**Content-Type:** `application/json`

#### Request Body ✅ VALIDATED
```json
{
  "name": "Admin Reject Test User",
  "email": "adminreject@test.com",
  "phone": "9876543210",
  "amount": 200000,
  "purpose": "Testing admin rejection workflow",
  "tenure": 24,
  "monthlyIncome": 30000,
  "employmentType": "employed",
  "panCard": "ABCDE1234F",
  "aadharCard": "123456789012"
}
```

#### Request Fields
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `name` | string | Yes | Applicant's full name | Min 2 characters |
| `email` | string | Yes | Valid email address | Valid email format |
| `phone` | string | Yes | 10-digit mobile number | Exactly 10 digits |
| `amount` | number | Yes | Loan amount | ₹1,000 - ₹1,00,00,000 |
| `purpose` | string | Yes | Purpose of loan | Min 3 characters |
| `tenure` | number | Yes | Loan tenure in months | 6-84 months |
| `monthlyIncome` | number | Yes | Monthly income in rupees | Positive number |
| `employmentType` | string | Yes | Type of employment | Required field |
| `panCard` | string | No | PAN card number | Optional |
| `aadharCard` | string | No | Aadhar card number | Optional |

#### Success Response (201) ✅ VALIDATED
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "id": "68828303cd3f3d2d8cac58e8",
    "status": "pending",
    "submittedAt": "2025-07-24T19:01:23.882Z"
  },
  "timestamp": "2025-07-24T19:01:23.883Z"
}
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Get Applications
Retrieve loan applications based on user role and query parameters.

**Endpoint:** `GET /applications`  
**Access:** Protected (Admin/Verifier)  
**Headers:** `Authorization: Bearer <token>`

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status: `pending`, `verified`, `approved`, `rejected` |
| `page` | number | Page number for pagination (default: 1) |
| `limit` | number | Items per page (default: 10, max: 100) |
| `search` | string | Search in name, email, or phone |

#### Example Request
```
GET /applications?status=pending&page=1&limit=10&search=swaraj
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Applications retrieved successfully",
  "data": [
    {
      "_id": "66b8f123456789abcdef0456",
      "name": "Swaraj Kumar",
      "email": "swaraj@example.com",
      "phone": "9876543210",
      "amount": 500000,
      "purpose": "Home renovation",
      "tenure": 24,
      "monthlyIncome": 75000,
      "employmentType": "Salaried",
      "status": "pending",
      "submittedBy": "192.168.1.1",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Get Dashboard Statistics
Retrieve dashboard statistics for applications.

**Endpoint:** `GET /applications/stats`  
**Access:** Protected (Admin/Verifier)  
**Headers:** `Authorization: Bearer <token>`

#### Success Response (200) ✅ VALIDATED
```json
{
  "success": true,
  "message": "Dashboard statistics fetched successfully",
  "data": {
    "totalApplications": 2,
    "pendingApplications": 0,
    "verifiedApplications": 1,
    "approvedApplications": 1,
    "rejectedApplications": 0,
    "totalLoanAmount": 800000,
    "approvedLoanAmount": 500000,
    "averageLoanAmount": 400000
  },
  "timestamp": "2025-07-24T18:50:45.308Z"
}
```

#### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| `totalApplications` | number | Total number of applications |
| `pendingApplications` | number | Applications awaiting review |
| `verifiedApplications` | number | Applications marked as verified |
| `approvedApplications` | number | Applications approved by admin |
| `rejectedApplications` | number | Applications rejected |
| `totalLoanAmount` | number | Sum of all requested loan amounts |
| `approvedLoanAmount` | number | Sum of approved loan amounts |
| `averageLoanAmount` | number | Average loan amount requested |

---

### Verify Application
Mark an application as verified (Verifier only).

**Endpoint:** `PATCH /applications/:id/verify`  
**Access:** Protected (Verifier/Admin)  
**Headers:** `Authorization: Bearer <token>`

#### Success Response (200)
```json
{
  "success": true,
  "message": "Application verified successfully",
  "data": {
    "application": {
      "_id": "66b8f123456789abcdef0456",
      "status": "verified",
      "verifiedBy": "66b8f123456789abcdef0123",
      "verifiedAt": "2024-01-15T11:00:00.000Z",
      // ... other fields
    }
  },
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

---

### Reject Application (Verifier)
Reject an application with reason (Verifier only).

**Endpoint:** `PATCH /applications/:id/reject`  
**Access:** Protected (Verifier/Admin)  
**Headers:** `Authorization: Bearer <token>`

#### Request Body
```json
{
  "rejectionReason": "Insufficient income documentation"
}
```

#### Success Response (200)
```json
{
  "success": true,
  "message": "Application rejected successfully",
  "data": {
    "application": {
      "_id": "66b8f123456789abcdef0456",
      "status": "rejected",
      "rejectionReason": "Insufficient income documentation",
      "verifiedBy": "66b8f123456789abcdef0123",
      "verifiedAt": "2024-01-15T11:00:00.000Z",
      // ... other fields
    }
  },
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

---

### Approve Application
Approve a verified application (Admin only).

**Endpoint:** `PATCH /applications/:id/approve`  
**Access:** Protected (Admin only)  
**Headers:** `Authorization: Bearer <token>`

#### Success Response (200)
```json
{
  "success": true,
  "message": "Application approved successfully",
  "data": {
    "application": {
      "_id": "66b8f123456789abcdef0456",
      "status": "approved",
      "adminActionBy": "66b8f123456789abcdef0789",
      "adminActionAt": "2024-01-15T12:00:00.000Z",
      // ... other fields
    }
  },
  "timestamp": "2024-01-15T12:00:00.000Z"
}
```

---

### Admin Reject Application
Admin rejection of application (Admin only).

**Endpoint:** `PATCH /applications/:id/admin-reject`  
**Access:** Protected (Admin only)  
**Headers:** `Authorization: Bearer <token>`

#### Request Body
```json
{
  "rejectionReason": "Application does not meet policy requirements"
}
```

#### Success Response (200) ✅ VALIDATED
```json
{
  "success": true,
  "message": "Application rejected by admin",
  "data": {
    "_id": "68828303cd3f3d2d8cac58e8",
    "name": "Admin Reject Test User",
    "email": "adminreject@test.com",
    "phone": "9876543210",
    "amount": 200000,
    "purpose": "Testing admin rejection workflow",
    "tenure": 24,
    "monthlyIncome": 30000,
    "employmentType": "employed",
    "panCard": "ABCDE1234F",
    "aadharCard": "123456789012",
    "status": "rejected",
    "submittedBy": "::1",
    "createdAt": "2025-07-24T19:01:23.882Z",
    "updatedAt": "2025-07-24T19:03:10.802Z",
    "__v": 0,
    "adminActionAt": "2025-07-24T19:03:10.802Z",
    "adminActionBy": {
      "_id": "68825cf688c628e05d20b542",
      "name": "Admin User",
      "email": "admin@creditsea.com"
    },
    "rejectionReason": "Insufficient monthly income for requested loan amount. Minimum ₹40,000 required for ₹2,00,000 loan."
  }
}
```

---

## User Management

### Get User Profile
Retrieve current user's profile information.

**Endpoint:** `GET /users/profile`  
**Access:** Protected (Admin/Verifier)  
**Headers:** `Authorization: Bearer <token>`

#### Success Response (200) ✅ VALIDATED
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "id": "68825cf688c628e05d20b542",
    "name": "Admin User",
    "email": "admin@creditsea.com",
    "role": "admin",
    "createdAt": "2025-07-24T16:19:02.748Z"
  },
  "timestamp": "2025-07-24T19:05:13.022Z"
}
```

---

### Get All Users
Retrieve all users in the system (Admin only).

**Endpoint:** `GET /users`  
**Access:** Protected (Admin only)  
**Headers:** `Authorization: Bearer <token>`

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| `role` | string | Filter by role: `admin` or `verifier` |
| `page` | number | Page number for pagination (default: 1) |
| `limit` | number | Items per page (default: 10) |

#### Success Response (200) ✅ VALIDATED
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "_id": "68825cf688c628e05d20b542",
      "name": "Admin User",
      "email": "admin@creditsea.com",
      "role": "admin",
      "createdAt": "2025-07-24T16:19:02.748Z",
      "updatedAt": "2025-07-24T16:19:02.748Z",
      "__v": 0
    },
    {
      "_id": "68825cf688c628e05d20b544",
      "name": "Verifier User",
      "email": "verifier@creditsea.com",
      "role": "verifier",
      "createdAt": "2025-07-24T16:19:02.969Z",
      "updatedAt": "2025-07-24T16:19:02.969Z",
      "__v": 0
    },
    {
      "_id": "68827747eb104556df8ffee1",
      "name": "Test User",
      "email": "testuser@creditsea.com",
      "role": "verifier",
      "createdAt": "2025-07-24T18:11:19.066Z",
      "updatedAt": "2025-07-24T18:11:19.066Z",
      "__v": 0
    }
  ],
  "timestamp": "2025-07-24T19:06:13.149Z"
}
```

---

### Add User
Create a new user (Admin only).

**Endpoint:** `POST /users`  
**Access:** Protected (Admin only)  
**Headers:** `Authorization: Bearer <token>`

#### Request Body
```json
{
  "name": "New Verifier",
  "email": "newverifier@creditsea.com",
  "password": "securepassword123",
  "role": "verifier"
}
```

#### Success Response (201) ✅ VALIDATED
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "6882849ecd3f3d2d8cac58f0",
    "name": "New Test Verifier",
    "email": "newverifier@creditsea.com",
    "role": "verifier",
    "createdAt": "2025-07-24T19:08:14.598Z"
  },
  "timestamp": "2025-07-24T19:08:14.599Z"
}
```

---

### Delete User
Delete a user from the system (Admin only).

**Endpoint:** `DELETE /users/:id`  
**Access:** Protected (Admin only)  
**Headers:** `Authorization: Bearer <token>`

#### Success Response (200) ✅ VALIDATED
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "id": "6882849ecd3f3d2d8cac58f0",
    "name": "New Test Verifier",
    "email": "newverifier@creditsea.com"
  },
  "timestamp": "2025-07-24T19:09:28.785Z"
}
```

---

## Error Responses

### Common HTTP Status Codes

#### 400 - Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Email is required",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Authentication required",
  "error": "No token provided",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 403 - Forbidden
```json
{
  "success": false,
  "message": "Access denied",
  "error": "Insufficient permissions",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 404 - Not Found
```json
{
  "success": false,
  "message": "Resource not found",
  "error": "Application not found",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 409 - Conflict
```json
{
  "success": false,
  "message": "Resource already exists",
  "error": "Email is already registered",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 422 - Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "name": "Name is required",
    "email": "Invalid email format",
    "amount": "Amount must be between ₹1,000 and ₹1,00,00,000"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 500 - Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Something went wrong",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Response Formats

### Success Response Structure
```typescript
interface ApiResponse<T> {
  success: true;
  message: string;
  data?: T;
  timestamp: string;
}
```

### Error Response Structure
```typescript
interface ErrorResponse {
  success: false;
  message: string;
  error: string | object;
  timestamp: string;
}
```

### Paginated Response Structure
```typescript
interface PaginatedResponse<T> {
  success: true;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  timestamp: string;
}
```

---

## Authentication

### JWT Token Structure
```typescript
interface JWTPayload {
  id: string;
  email: string;
  role: 'admin' | 'verifier';
  iat: number;  // Issued at
  exp: number;  // Expires at
}
```

### Authorization Header
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjhmMTIzNDU2Nzg5YWJjZGVmMDEyMyIsImVtYWlsIjoiYWRtaW5AY3JlZGl0c2VhLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwNTMxNDYwMCwiZXhwIjoxNzA1OTE5NDAwfQ.signature
```

---

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute per IP
- **Public endpoints**: 10 requests per minute per IP  
- **Protected endpoints**: 100 requests per minute per user

---

## API Versioning

Current API version: `v1`  
All endpoints are prefixed with `/api/`

Future versions will be available at `/api/v2/`, `/api/v3/`, etc.

---

**For additional support or questions, please refer to the main README.md file.**
