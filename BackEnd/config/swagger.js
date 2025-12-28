import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Gestión de Usuarios",
      version: "1.0.0",
      description: "Documentación Swagger centralizada",
    },
    servers: [
      {
        url: "http://localhost:2025/api/v1",
      },
    ],
  },
  apis: ["./docs/swaggerDoc.js"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
