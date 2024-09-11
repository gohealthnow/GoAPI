import swaggerUi from "swagger-ui-express";
import swaggerFile from "./assets/swagger-output.json";
import PinoHttp from "pino-http";
import ngrok from "@ngrok/ngrok";
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";

const server = express();
const HOST = process.env.HOST ?? "localhost";
const PORT = (process.env.PORT as unknown as number) ?? 3000;

export const logger = PinoHttp({
  transport: {
    level: "debug",
    target: "pino-pretty",
    options: {
      destination: 2,
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

server.use(bodyParser.json());
server.use(express.urlencoded({ extended: false }));

server.use(express.static("public"));

server.set("view engine", "ejs");
server.set("views", "./public");

server.use("/", (_req, res) => {
  const indexPath = path.join(__dirname, "src", "public", "index.html");
  fs.readFile(indexPath, "utf8", (err, data) => {
    if (err) {
      logger.logger.error("Error reading index.html", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.send(data);
  });
});
server.listen(PORT, async () => {
  logger.logger.info(`Server running at http://${HOST}:${PORT}`);
  logger.logger.info(`Swagger running at http://${HOST}:${PORT}/docs`);
});

ngrok
  .connect({ addr: PORT, authtoken_from_env: true })
  .then((listener) =>
    logger.logger.info(`Ingress established at: ${listener.url()}`)
  );

export default server;
