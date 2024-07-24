import swaggerUi from "swagger-ui-express";
import swaggerFile from "./assets/swagger-output.json";

import cors from "cors";
import express from "express";
import bodyParser from "body-parser";

const server = express();
const PORT = process.env.PORT ?? 3000;

server.use(cors());
server.use(["/doc", "/docs"], swaggerUi.serve, swaggerUi.setup(swaggerFile));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
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
