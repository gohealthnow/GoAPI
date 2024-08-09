import { Router } from "express";
import ProductController from "../controllers/product.controller";

const productRouter = Router();

productRouter.post("/create", (req, res) => {
  ProductController.create(req,res);
});

export default productRouter;
