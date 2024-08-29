import { Router } from "express";
import pharmacyController from "../controllers/pharmacy.controller";

const pharmacyRouter = Router();

pharmacyRouter.get("/:id", (req, res) => {
  /* #swagger.tags = ['Pharmacy']
        #swagger.path = '/pharmacy/{id}'
        #swagger.description = 'Endpoint para listar uma farmácia.'
        #swagger.parameters['id'] = { description: 'Pharmacy
        identification.', required: true }
        #swagger.responses[200] = {
            description: 'Farmácia listada com sucesso.'
        }
        #swagger.responses[404] = {
            description: 'Erro ao listar farmácia.'
        }
        #swagger.responses[500] = {
            description: 'Erro no servidor.'
        }
    */
   pharmacyController.geybyid(req, res);
});

export default pharmacyRouter;
