import path from "path";
import { getRouteFilePaths } from "./utils/filled";

const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });
const PORT = process.env.PORT ?? 3000;
const URL = process.env.URL ?? "localhost";

const doc = {
  info: {
    version: "1.0.0",
    title: "My API",
    description: "Some description...",
  },
  servers: [
    {
      url: `http://${URL}:${PORT}`,
    },
  ],
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "User",
      description: "User routes",
      path: "/user",
    },
    {
      name: "Products",
      description: "Products routes",
      path: "/products",
    },
  ],

  definitions: {
    User: {
      type: "object",
      properties: {
        id: { type: "number" },
        name: { type: "string" },
        email: { type: "string" },
        product: { type: "array", items: { $ref: "#/definitions/Product" } },
        bio: { type: "string" },
        role: { type: "string" },
        avatar: { type: "string" },
      },
    },
    Product: {
      type: "object",
      properties: {
        id: { type: "number" },
        name: { type: "string" },
        description: { type: "string" },
        price: { type: "number" },
        stock: { type: "number" },
        image: { type: "string" },
        weight: { type: "number" },
        dimensions: { type: "string" },
        rating: { type: "number" },
        createdAt: { type: "string" },
        updatedAt: { type: "string" },
      },
    },
  },
};

const outputFile = path.join(__dirname, "assets", "swagger-output.json");

console.log(outputFile);

const routesFiles = getRouteFilePaths();

swaggerAutogen(outputFile, routesFiles, doc);
