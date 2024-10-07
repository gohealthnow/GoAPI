import express from "express";
import userController from "../controllers/user.controller";
const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  /* #swagger.tags = ['User']
      #swagger.path = '/user/'
      #swagger.description = 'Endpoint
      para listar todos os usuários.'
      #swagger.responses[200] = {
        description: 'Usuários listados com sucesso.',
        schema: {
          $ref: '#/definitions/User'
        }
      }
      #swagger.responses[400] = {
        description: 'Erro ao listar usuários.'
      }
      #swagger.responses[500] = {
        description: 'Erro no servidor.'
      }
  */
  userController.listAll(req, res);
});

userRouter.get("/:id", (req, res) => {
  /* #swagger.tags = ['User']
      #swagger.path = '/user/{id}'
      #swagger.description = 'Endpoint para obter um usuário.'
      #swagger.responses[200] = {
        description: 'Usuário obtido com sucesso.',
        schema: {
          $ref: '#/definitions/User'
        }
      }
      #swagger.responses[404] = {
        description: 'Usuário não encontrado.'
      }
      #swagger.responses[500] = {
        description: 'Erro no servidor.'
      }
  */
  userController.getUserById(req, res);
});

userRouter.post("/login", (req, res) => {
  /* #swagger.tags = ['User']
      #swagger.path = '/user/login'
      #swagger.description = 'Endpoint
      para realizar login.'
      #swagger.parameters['User'] = {
        in: 'body',
        description: 'User information.',
        required: true,
        schema: {
            $email: 'calculte@univer.com',
            $password: '123456',
          },
        }
      #swagger.responses[200] = {
        description: 'Login realizado com sucesso.',
        schema: {
          $ref: '#/definitions/User'
        }
      }
      #swagger.responses[401] = {
        description: 'Credenciais inválidas.'
      }
      #swagger.responses[500] = {
        description: 'Erro no servidor.'
      }
  */
  userController.authenticate(req, res);
});

userRouter.post("/register", (req, res) => {
  /* #swagger.tags = ['User']
      #swagger.path = '/user/register'
      #swagger.description = 'Endpoint para realizar registro.'
      #swagger.parameters['User'] = {
        in: 'body',
        description: 'User information.',
        required: true,
        schema: {
            $email: 'user@gohealth.com',
            $password: '123456',
            $name: 'User',
          },
        }
      #swagger.responses[201] = {
        description: 'Registro realizado com sucesso.',
        schema: {
          $ref: '#/definitions/User'
        }
      }
      #swagger.responses[500] = {
        description: 'Erro no servidor.'
      }
  */
  userController.create(req, res);
});

userRouter.get("/logout", (req, res) => {
  /* #swagger.tags = ['User']
      #swagger.path = '/user/logout'
      #swagger.description = 'Endpoint para realizar logout.'
      #swagger.responses[200] = {
        description: 'Logout realizado com sucesso.'
      }
  */
  userController.logout(req, res);
});

userRouter.get("/profile", (req, res) => {
  /* #swagger.tags = ['User']
      #swagger.path = '/user/profile'
      #swagger.description = 'Endpoint para obter informações do usuário.'
      #swagger.responses[200] = {
        description: 'Informações do usuário obtidas com sucesso.',
        schema: {
          $ref: '#/definitions/User'
        }
      }
  */
  userController.getProfile(req, res);
});

userRouter.put("/role", (req, res) => {
  /* #swagger.tags = ['User']
      #swagger.path = '/user/role'
      #swagger.description = 'Endpoint para atualizar o papel do usuário.'
      #swagger.parameters['User'] = {
        in: 'params',
        description: 'User information.',
        required: true,
        schema: {
            $id: 1,
            $role: 'admin',
          },
        }
      #swagger.security = [{
        "BearerAuth": []
      }]
      #swagger.responses[200] = {
        description: 'Papel do usuário atualizado com sucesso.'
      }
      #swagger.responses[500] = {
        description: 'Erro no servidor.'
      }
  */
  userController.switchRole(req, res);
});

userRouter.delete("/:id", (req, res) => {
  /* #swagger.tags = ['User']
      #swagger.path = '/user/{id}'
      #swagger.description = 'Endpoint para deletar um usuário.'
      #swagger.responses[200] = {
        description: 'Usuário deletado com sucesso.'
      }
      #swagger.responses[500] = {
        description: 'Erro no servidor.'
      }
  */
  userController.delete(req, res);
});

userRouter.post("/product", async (req, res) => {
  /* #swagger.tags = ['User']
      #swagger.path = '/user/product/'
       #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update Information',
        required: true,
        schema: {
            $id: 1,
            $prodid: 6,
          },
      }
      #swagger.description = 'Endpoint para linkar um produto ao usuário.'
      #swagger.responses[204] = {
        description: 'Produto linkado ao usuário com sucesso.'
      }
      #swagger.responses[500] = {
        description: 'Erro no servidor.'
      }
  */
  userController.linkProductToUser(req, res);
});

userRouter.post("/product/buy", async (req, res) => {
  /* #swagger.tags = ['User']
      #swagger.path = '/user/product/buy'
      #swagger.description = 'Endpoint para realizar a compra de um produto.'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Product Information',
        required: true,
        schema: {
            $id: 1,
            $prodid: 6,
            $quantity: 1,
          },
      }
      #swagger.responses[204] = {
        description: 'Produto comprado com sucesso.'
      }
      #swagger.responses[500] = {
        description: 'Erro no servidor.'
      }
  */
  userController.buy(req, res);
})

userRouter.post("/order", async (req, res) => {
  /* #swagger.tags = ['User']
      #swagger.path = '/user/order'
      #swagger.description = 'Endpoint para listar as compras do usuário.'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'User Information',
        required: true,
        schema: {
            $id: 1,
            }
        },
      #swagger.responses[200] = {
        description: 'Compras listadas com sucesso.',
        schema: {
          $ref: '#/definitions/Order'
        }
      }
      #swagger.responses[500] = {
        description: 'Erro no servidor.'
      }
  */
  userController.getOrders(req, res);
});

userRouter.post("/review", async (req, res) => {
  /* #swagger.tags = ['User']
      #swagger.path = '/user/review'
      #swagger.description = 'Endpoint para realizar uma avaliação.'
      #swagger.parameters['body'] = {
        in: 'body',
        description: 'Review Information',
        required: true,
        schema: {
            $id: 1,
            $prodid: 6,
            $rating: 5,
            $comment: 'Muito bom!',
          },
      }
      #swagger.responses[204] = {
        description: 'Avaliação realizada com sucesso.'
      }
      #swagger.responses[500] = {
        description: 'Erro no servidor.'
      }
  */
  userController.createReview(req, res);
})

export default userRouter;

// Produtos para add: Alpazolan, Oxicodona, Dipirona