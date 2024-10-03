import { Router } from "express";
import { stockerController } from "../controllers/stock.controller";

const stockRouter = Router();

stockRouter.get("/:pharmacy/:product", (req, res) => {
  /* #swagger.tags = ['Stock']
        #swagger.path = '/stock/{pharmacy}/{product}'
        #swagger.description = 'Endpoint para obter a quantidade disponível de um produto em uma farmácia.'
        #swagger.parameters['pharmacy'] = {
          description: 'Pharmacy ID.',
          required: true,
          type: 'integer'
        }
        #swagger.parameters['product'] = {
          description: 'Product ID.',
          required: true,
          type: 'integer'
        }
        #swagger.responses[200] = {
            description: 'Quantidade disponível obtida com sucesso.'
        }
        #swagger.responses[404] = {
            description: 'Produto não encontrado.'
        }
        #swagger.responses[500] = {
            description: 'Erro no servidor.'
        }
    */
  stockerController.getAvailableQuantity(req, res);
});

export default stockRouter;
