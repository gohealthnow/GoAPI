import { Router } from "express";
import ProductController from "../controllers/product.controller";

const productRouter = Router();

productRouter.post("/create", (req, res) => {
  /* #swagger.tags = ['Products']
      #swagger.path = '/product/create'
      #swagger.description = 'Endpoint para criar um produto.'
      #swagger.parameters['Product'] = {
        in: 'body',
        description: 'Product information.',
        required: true,
        schema: {
            $name: "Product Name",
            $price: 100.00,
          },
        }
      #swagger.responses[201] = {
        description: 'Produto criado com sucesso.',
        schema: {
          $ref: '#/definitions/Product'
        }
      }
      #swagger.responses[404] = {
        description: 'Erro ao criar produto.'
      }
      #swagger.responses[409] = {
        description: 'Produto já existe.'
      }
      #swagger.responses[500] = {
        description: 'Erro no servidor.'
      }
  */
  ProductController.create(req, res);
});

productRouter.get("/", (req, res) => {
  /* #swagger.tags = ['Products']
      #swagger.path = '/product/'
      #swagger.description = 'Endpoint para listar todos os produtos.'
      #swagger.responses[200] = {
        description: 'Produtos listados com sucesso.',
        schema: {
          $ref: '#/definitions/Product'
        }
      }
      #swagger.responses[404] = {
        description: 'Erro ao listar produtos.'
      }
      #swagger.responses[500] = {
        description: 'Erro no servidor.'
      }
  */
  ProductController.listAll(req, res);
});

productRouter.delete("/:id", (req, res) => {
  /* #swagger.tags = ['Products']
      #swagger.path = '/product/{id}'
      #swagger.description = 'Endpoint para deletar um produto.'
      #swagger.parameters['Product'] = {
        in: 'params',
        description: 'Product information.',
        required: true,
        schema: {
            $id: 1,
          },
        }
      #swagger.responses[204] = {
        description: 'Produto deletado com sucesso.',
      }
      #swagger.responses[404] = {
        description: 'Erro ao deletar produto.'
      }
      #swagger.responses[500] = {
        description: 'Erro no servidor.'
      }
  */
  ProductController.delete(req, res);
});

export default productRouter;
