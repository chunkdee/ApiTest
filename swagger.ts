export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "JSON Server API",
    version: "1.0.0",
    description: "A simple JSON server with multiple endpoints"
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server"
    }
  ],
  paths: {
    "/api/users": {
      get: {
        summary: "Get all users",
        responses: {
          "200": {
            description: "List of users",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      name: { type: "string" },
                      email: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/products": {
      get: {
        summary: "Get all products",
        responses: {
          "200": {
            description: "List of products",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      name: { type: "string" },
                      price: { type: "number" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
