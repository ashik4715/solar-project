import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Solar Store API",
      version: "1.0.0",
      description: "API documentation for Solar Store e-commerce platform",
      contact: {
        name: "Solar Store Support",
        email: "support@solarstore.com",
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
        description: "API Server",
      },
    ],
    components: {
      securitySchemes: {
        sessionAuth: {
          type: "apiKey",
          in: "cookie",
          name: "session",
          description: "Session cookie authentication",
        },
      },
    },
    tags: [
      {
        name: "Products",
        description: "Product management endpoints",
      },
      {
        name: "Categories",
        description: "Category management endpoints",
      },
      {
        name: "Customers",
        description: "Customer management endpoints",
      },
      {
        name: "Quotes",
        description: "Quote generation and management endpoints",
      },
      {
        name: "Orders",
        description: "Order management endpoints",
      },
      {
        name: "Auth",
        description: "Authentication endpoints",
      },
      {
        name: "Contact",
        description: "Contact form submission",
      },
      {
        name: "Upload",
        description: "File upload endpoints",
      },
    ],
  },
  apis: ["./src/app/api/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
