import swaggerUi from "swagger-ui-express";
import swaggerFile from "./assets/swagger-output.json";
import PinoHttp from "pino-http";
import ngrok from "@ngrok/ngrok";
import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import pulsePrisma from "../prisma/pulse";

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
server.use(express.static("views"));

server.set("view engine", "ejs");
server.set("views", "./views");

async function main() {
  const stream = await pulsePrisma.notification.stream({
    name: "notification-stream",
  });

  for await (const event of stream) {
    console.log("New event:", event);
  }
}

main();

server.listen(PORT, () => {
  logger.logger.info(
    `\nServer is running!\n\nAPI documentation: http://${HOST}:${PORT}/doc`
  );
});

// Get your endpoint online
ngrok.connect({ addr: PORT, authtoken_from_env: true })
	.then(listener => logger.logger.info(`Ingress established at: ${listener.url()}`));

export default server;
