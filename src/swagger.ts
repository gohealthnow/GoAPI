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
      url: "http://localhost:3000/doc",
    },
  ],
};

const outputFile = path.join(__dirname, "assets", "swagger-output.json");

console.log(outputFile);

const routesFiles = getRouteFilePaths();

swaggerAutogen(outputFile, routesFiles, doc);
