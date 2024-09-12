import swaggerUi from "swagger-ui-express";
import swaggerFile from "./assets/swagger-output.json";
import PinoHttp from "pino-http";
import ngrok from "@ngrok/ngrok";
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { Server } from "socket.io";

const HOST = process.env.HOST ?? "localhost";
const PORT = (process.env.PORT as unknown as number) ?? 3000;

export const logger = PinoHttp({
  transport: {
    level: "info",
    target: "pino-pretty",
    options: {
      destination: 2,
      all: true,
      translateTime: true,
    },
  },
});

const app = express();

const expressServer = app.listen(PORT, () => {
  logger.logger.info(`Server running at http://${HOST}:${PORT}`);
  logger.logger.info(`Swagger running at http://${HOST}:${PORT}/docs`);
});

const io = new Server(expressServer, {
  cors: { origin: true },
});

export const JWT_SECRET = process.env.JWT_SECRET ?? "default_secret";
export const ADMIN_SECRET = process.env.ADMIN_SECRET;

io.on("connection", async (socket) => {
  logger.logger.info("Connection event triggered");
  logger.logger.info(`User connected: ${socket.id}`);
});

app.use(cors());
app.use(["/doc", "/docs"], swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(logger);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "./public");

app.use("/", express.static(path.join(__dirname, "public")));

ngrok
  .connect({ addr: PORT, authtoken_from_env: true })
  .then((listener) =>
    logger.logger.info(`Ingress established at: ${listener.url()}`)
  );

export default app;
