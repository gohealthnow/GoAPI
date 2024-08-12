import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { logger } from "../server";
const prisma = new PrismaClient();

const ProductController = {
  create: async (req: Request, res: Response) => {
    const { name, price } = req.body as { name: string; price: number };

    if (!name) return res.status(404).json({ message: "missing name field!" });
    if (!price)
      return res.status(404).json({ message: "missing price field!" });

    const productexisted = await prisma.product
      .findMany({
        where: {
          name: name,
        },
      })
      .then((product) => {
        logger.logger.info(product);
        return product;
      });

    if (productexisted.length > 0)
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

    return res
      .status(201)
      .json({ products: newProduct, message: "Product created!" });
  },
  listAll: async (req: Request, res: Response) => {
    const products = await prisma.product.findMany().catch((error) => {
      logger.logger.error(error);
      return res.status(404).json({ message: "Error listing products" });
    });

    if (!products)
      return res.status(404).json({ message: "No products found" });
    return res.status(200).json({ products: products });
  },
  delete: async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) return res.status(404).json({ message: "missing id field!" });

    await prisma.product
      .delete({
        where: {
          id: Number(id),
        },
      })
      .then(() => {
        return res.status(204).send();
      })
      .catch((error) => {
        logger.logger.error(error);
        return res.status(500).json({ message: { ...error } });
      });
  },
};

export default ProductController;
