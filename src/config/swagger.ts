import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CreditSea Loan Backend API",
      version: "1.0.0",
      description: "Complete API reference for CreditSea Loan Backend",
    },
    servers: [
      { url: "http://localhost:5001/api" },
      { url: "https://creditsea-loan-backend.onrender.com/api" },
    ],
    components: {
      schemas: {
        // Response for successful API calls
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
            data: { type: "object", example: {} },
            timestamp: { type: "string", example: new Date().toISOString() },
          },
        },
        // Response for errors
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Validation failed" },
            error: { type: "string", example: "Email is required" },
            timestamp: { type: "string", example: new Date().toISOString() },
          },
        },
        // User schema for creating users
        RegisterUser: {
          type: "object",
          properties: {
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@creditsea.com" },
            password: { type: "string", example: "securepassword123" },
            role: { type: "string", example: "verifier" },
          },
          required: ["name", "email", "password"],
        },
        // User schema for login
        LoginUser: {
          type: "object",
          properties: {
            email: { type: "string", example: "admin@creditsea.com" },
            password: { type: "string", example: "admin123" },
          },
          required: ["email", "password"],
        },
        // Loan application schema
        LoanApplication: {
          type: "object",
          properties: {
            name: { type: "string", example: "Swaraj Kumar" },
            email: { type: "string", example: "swaraj@example.com" },
            phone: { type: "string", example: "9876543210" },
            amount: { type: "number", example: 200000 },
            purpose: { type: "string", example: "Home renovation" },
            tenure: { type: "number", example: 24 },
            monthlyIncome: { type: "number", example: 75000 },
            employmentType: { type: "string", example: "Salaried" },
            panCard: { type: "string", example: "ABCDE1234F" },
            aadharCard: { type: "string", example: "123456789012" },
          },
          required: [
            "name",
            "email",
            "phone",
            "amount",
            "purpose",
            "tenure",
            "monthlyIncome",
            "employmentType",
          ],
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // Scan all route files for JSDoc comments
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
