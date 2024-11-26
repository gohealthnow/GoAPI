import { Router } from "express";
import CategoryController from "../controllers/category.controller";

const CategoryRouter = Router();

CategoryRouter.get("/", (req, res) => {
  /* #swagger.tags = ['Category']
      #swagger.path = '/category/'
      #swagger.description = 'Endpoint para listar todas as categorias.'
      #swagger.responses[200] = {
        description: 'Categorias listadas com sucesso.'
      }
      #swagger.responses[404] = {
        description: 'Nenhuma categoria encontrada.'
      }
      #swagger.responses[500] = {
        description: 'Erro no servidor.'
      }
  */
  CategoryController.listall(req, res);
});

CategoryRouter.get("/:id", (req, res) => {
  /* #swagger.tags = ['Category']
      #swagger.path = '/category/{id}'
      #swagger.description = 'Endpoint para obter uma categoria.'
      #swagger.responses[200] = {
        description: 'Categoria obtida com sucesso.'
      }
      #swagger.responses[404] = {
        description: 'Categoria não encontrada.'
      }
      #swagger.responses[500] = {
        description: 'Erro no servidor.'
      }
  */
  CategoryController.getbyid(req, res);
});

CategoryRouter.post("/create", (req, res) => {
  /* #swagger.tags = ['Category']
      #swagger.path = '/category/create'
      #swagger.description = 'Endpoint para criar uma categoria.'
      #swagger.parameters['Category'] = {
        in: 'body',
        description: 'Category information.',
        required: true,
        schema: {
            $name: "Category Name",
          },
        }
      #swagger.responses[200] = {
        description: 'Categoria criada com sucesso.'
      }
      #swagger.responses[404] = {
        description: 'Erro ao criar categoria.'
      }
      #swagger.responses[500] = {
        description: 'Erro no servidor.'
      }
  */
  CategoryController.create(req, res);
});

CategoryRouter.delete("/:id", (req, res) => {
  /* #swagger.tags = ['Category']
      #swagger.path = '/category/{id}'
      #swagger.description = 'Endpoint para deletar uma categoria.'
      #swagger.responses[204] = {
        description: 'Categoria deletada com sucesso.'
      }
      #swagger.responses[404] = {
        description: 'Erro ao deletar categoria.'
      }
      #swagger.responses[500] = {
        description: 'Erro no servidor.'
      }
  */
  CategoryController.delete(req, res);
});

CategoryRouter.put("/update/:id", (req, res) => {
  /* #swagger.tags = ['Category']
      #swagger.path = '/category/update/{id}'
      #swagger.description = 'Endpoint para atualizar uma categoria.'
      #swagger.parameters['Category'] = {
        in: 'body',
        description: 'Category information.',
        required: true,
        schema: {
            $name: "Category Name",
          },
        }
      #swagger.responses[200] = {
        description: 'Categoria atualizada com sucesso.'
      }
      #swagger.responses[404] = {
        description: 'Erro ao atualizar categoria.'
      }
      #swagger.responses[500] = {
        description: 'Erro no servidor.'
      }
  */
  CategoryController.update(req, res);
});

CategoryRouter.post("/product/:id", (req, res) => {
  /* #swagger.tags = ['Category']
      #swagger.path = '/category/product'
      #swagger.description = 'Endpoint para linkar um produto a uma categoria.'
      #swagger.parameters['Category'] = {
        in: 'body',
        description: 'Category information.',
        required: true,
        schema: {
            $prodid: 6,
          },
        }
      #swagger.responses[204] = {
        description: 'Produto linkado a categoria com sucesso.'
      }
      #swagger.responses[404] = {
        description: 'Erro ao linkar produto a categoria.'
      }
      #swagger.responses[500] = {
        description: 'Erro no servidor.'
      }
  */
  CategoryController.addProduct(req, res);
});

export default CategoryRouter;
