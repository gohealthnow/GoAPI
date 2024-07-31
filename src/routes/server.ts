import { Router } from "express";
import testController from "../controllers/test.controller";

const serverRouter = Router();

serverRouter.get("/", (req, res) => {
  /* #swagger.tags = ['Server']
        #swagger.path = '/server'
        #swagger.description = 'Endpoint para testar a conexão com o servidor.'
        #swagger.responses[200] = {
            description: 'Servidor conectado.'
        }
        #swagger.responses[500] = {
            description: 'Erro no servidor.'
        }
    */
  testController.connectionServer(req, res);
});

export default serverRouter;
