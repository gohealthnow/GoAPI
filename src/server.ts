import swaggerUi from "swagger-ui-express";
import swaggerFile from "./assets/swagger-output.json";
import PinoHttp from "pino-http";
import ngrok from "@ngrok/ngrok";
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { connectWithRetry, pgClient } from "./utils/stream";

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

const app = express();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN ?? "",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  logger.logger.info(`Usuário conectado: ${socket.id}`);
  io.emit("userConnected", { id: socket.id });

  // Listener para o evento "stock"
  socket.on("stock", (data) => {
    logger.logger.info(`Evento "stock" recebido com dados: ` + data);
    // Aqui você pode adicionar a lógica para tratar o evento "stock"
  });
});

export const JWT_SECRET = process.env.JWT_SECRET ?? "default_secret";
export const ADMIN_SECRET = process.env.ADMIN_SECRET;

app.use(cors());
app.use(["/doc", "/docs"], swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(logger);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

pgClient.connect();

app.set("view engine", "ejs");
app.set("views", "./public");

app.use(express.static(path.join(__dirname, "..", "public")));

ngrok
  .connect({ addr: PORT, authtoken_from_env: true })
  .then((listener) =>
    logger.logger.info(`Ingress established at: ${listener.url()}`)
  );

server.listen(PORT, () => {
  logger.logger.info(`Server running at http://${HOST}:${PORT}`);
  logger.logger.info(`Swagger running at http://${HOST}:${PORT}/docs`);
});

// Adicionar manipulador de erros ao servidor
server.on("error", (err) => {
  logger.logger.error("Erro no servidor:", err);
});

pgClient.on("error", (err: Error) => {
  logger.logger.error("Erro no cliente do PostgreSQL: " + err);
  if (err.stack === 'ECONNRESET' || err.message.includes('Connection terminated unexpectedly')) {
    connectWithRetry();
  }
});


export default app;
