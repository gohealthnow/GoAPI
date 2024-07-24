import express from "express";
import testController from "../controllers/test.controller";
import userController from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  testController.get(req, res);
});

userRouter.post("/authenticate", (req, res) => {
  userController.authenticate(req, res);
});

export default userRouter;
