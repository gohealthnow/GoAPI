import swaggerUi from "swagger-ui-express";
import swaggerFile from "./assets/swagger-output.json";
import PinoHttp from "pino-http";

import cors from "cors";
import express from "express";

const server = express();
const PORT = process.env.PORT ?? 3000;
const logger = PinoHttp({
  transport: {
    target: "pino-http-print",
    options: {
      destination: 1,
      all: true,
      translateTime: true,
    },
  },
});

export const JWT_SECRET = process.env.JWT_SECRET ?? "default_secret";
export const ADMIN_SECRET = process.env.ADMIN_SECRET;

server.use(cors());
server.use(["/doc", "/docs"], swaggerUi.serve, swaggerUi.setup(swaggerFile));
server.use(logger);

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(express.static("public"));

server.use(express.static("views"));
server.set("view engine", "ejs");
server.set("views", "./views");

server.listen(PORT, () => {
  console.log(
    `\nServer is running!\n\nAPI documentation: http://localhost:${PORT}/doc`
  );
});

export default server;
