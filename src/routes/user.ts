import express from "express";
import testController from "../controllers/test.controller";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  testController.get(req, res);
});

export default userRouter;
