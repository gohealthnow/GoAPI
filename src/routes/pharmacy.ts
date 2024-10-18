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

pharmacyRouter.get("/", (req, res) => {
  /* #swagger.tags = ['Pharmacy']
        #swagger.path = '/pharmacy/'
        #swagger.description = 'Endpoint para listar todas as farmácias.'
        #swagger.responses[200] = {
            description: 'Farmácias listadas com sucesso.'
        }
        #swagger.responses[404] = {
            description: 'Erro ao listar farmácias.'
        }
        #swagger.responses[500] = {
            description: 'Erro no servidor.'
        }
    */
  pharmacyController.listall(req, res);
});

pharmacyRouter.post("/create", (req, res) => {
  /* #swagger.tags = ['Pharmacy']
            #swagger.path = '/pharmacy/create'
            #swagger.description = 'Endpoint para criar uma farmácia.'
            #swagger.parameters['name'] = { description: 'Pharmacy name.', required: true }
            #swagger.parameters['cep'] = { description: 'Pharmacy postal code.', required: true }
            #swagger.parameters['email'] = { description: 'Pharmacy email.', required: true }
            #swagger.parameters['imageurl'] = { description: 'Pharmacy image url.', required: true }
            #swagger.parameters['phone'] = { description: 'Pharmacy phone.', required: true }
            #swagger.responses[200] = {
                description: 'Farmácia criada com sucesso.'
            }
            #swagger.responses[404] = {
                description: 'Erro ao criar farmácia.'
            }
            #swagger.responses[500] = {
                description: 'Erro no servidor.'
            }
        */
  pharmacyController.create(req, res);
});

pharmacyRouter.get("/search/:name", (req, res) => {
    /* #swagger.tags = ['Pharmacy']
            #swagger.path = '/pharmacy/search/{name}'
            #swagger.description = 'Endpoint para buscar farmácias por nome.'
            #swagger.parameters['name'] = { description: 'Pharmacy name.', required: true }
            #swagger.responses[200] = {
                description: 'Farmácias encontradas com sucesso.'
            }
            #swagger.responses[404] = {
                description: 'Erro ao buscar farmácias.'
            }
            #swagger.responses[500] = {
                description: 'Erro no servidor.'
            }
        */
    pharmacyController.search(req, res);
});

export default pharmacyRouter;
