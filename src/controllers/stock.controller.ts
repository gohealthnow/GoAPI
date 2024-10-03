import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const stockerController = {
  getAvailableQuantity: async (req: Request, res: Response) => {
    const { pharmacy, product } = req.params;
    let availableQuantity;
    try {
      availableQuantity = await prisma.pharmacyProduct.findUnique({
        where: {
          pharmacyId_productId: {
            pharmacyId: parseInt(pharmacy),
            productId: parseInt(product),
          },
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!availableQuantity || availableQuantity.quantity === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ availableQuantity });
  },
};
