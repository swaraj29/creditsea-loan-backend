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
  },
  apis: ["./src/routes/*.ts"], // Automatically scan route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
