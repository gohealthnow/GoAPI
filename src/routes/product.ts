import { Router } from "express";
import ProductController from "../controllers/product.controller";

const productRouter = Router();

productRouter.get("/", (req, res) => {
  ProductController.create(req,res);
});

export default productRouter;
