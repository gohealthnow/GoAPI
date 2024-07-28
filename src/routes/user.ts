import express from "express";
import userController from "../controllers/user.controller";
const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  userController.listAll(req, res);
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
  userController.swirchRole(req, res);
});

export default userRouter;
