import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { logger } from "../server";
const prisma = new PrismaClient();

const ProductController = {
  create: async (req: Request, res: Response) => {
    const { name, price } = req.body;

    if (!name) return res.status(404).json({ message: "missing name field!" });
    if (!price)
      return res.status(404).json({ message: "missing price field!" });

    const productexisted = await prisma.product.findUnique({
      where: name,
    });

    if (productexisted)
      return res.status(409).json({ message: "Product already exists" });

    const newProduct = await prisma.product
      .create({
        data: {
          name: name,
          price: price,
        },
      })
      .then((product) => {
        return product;
      })
      .catch((error) => {
        logger.logger.error(error);
        return error;
      });

    return res.status(201).json({ newProduct, message: "Product created!" });
  },
};

export default ProductController;
