import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { logger } from "../server";
import { capitalize } from "../utils/filled";
const prisma = new PrismaClient();

const ProductController = {
  create: async (req: Request, res: Response) => {
    const { name, price } = req.body;
    if (!name) return res.status(404).json({ message: "missing name field!" });
    if (!price)
      return res.status(404).json({ message: "missing price field!" });

    const productexisted = await prisma.product
      .findMany({
        where: {
          name: capitalize(name),
        },
        include: {
          categories: true,
          PharmacyProduct: true,
          reviews: true,
          user: true,
        },
      });

    if (productexisted.length > 0)
      return res.status(409).json({ message: "Product already exists" });

    const newProduct = await prisma.product
      .create({
        data: {
          name: name,
          price: price,
          promotion: false
        },
        include: {
          categories: true,
          PharmacyProduct: true,
          reviews: true,
          user: true,
        },
      });

      if(!newProduct) {
        return res.status(501).json({
          message: "Product not created!"
        })
      }

    return res
      .status(201)
      .json({ products: newProduct, message: "Product created!" });
  },
  listAll: async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({
      include: {
        categories: true,
        PharmacyProduct: true,
        reviews: true,
        user: true,
        Order: true,
      },
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
      });
  },
  getbyid: async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) return res.status(404).json({ message: "missing id field!" });

    const product = await prisma.product
      .findUnique({
        where: {
          id: Number(id),
        },
        include: {
          categories: true,
          PharmacyProduct: true,
          reviews: true,
          user: true,
        },
      });

    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json({ product: product });
  },
  getbyName: async (req: Request, res: Response) => {
    const { name } = req.params;

    if (!name) return res.status(404).json({ message: "missing name field!" });

    const product = await prisma.product
      .findMany({
        where: {
          name: {
            contains: capitalize(name),
          },
        },
        include: {
          categories: true,
          PharmacyProduct: true,
          reviews: true,
          user: true,
        },
      });

    if (!product)
      return res.status(404).json({ message: "Error finding product" });

    const productIds = product.map((p) => p.id);

    const pharmacies = await prisma.pharmacyProduct.findMany({
      where: {
        productId: {
          in: productIds,
        },
      },
      include: {
        pharmacy: true,
        product: true,
      },
    });

    return res.status(200).json({ product: product, pharmacies: pharmacies });
  },
  updatebyid: async (req: Request, res: Response) => {
    const { id: productId } = req.params;
    const { price, promotion } = req.body;

    if (!productId) return res.status(404).json({ message: "missing id field!" });

    const existingProduct = await prisma.product.findUnique({
      where: {
      id: Number(productId),
      },
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    await prisma.product
      .update({
      where: {
        id: Number(productId),
      },
      data: {
        price: price !== undefined ? price : existingProduct.price,
        promotion: promotion !== undefined ? promotion : existingProduct.promotion,
      },
      include: {
        categories: true,
        PharmacyProduct: true,
        reviews: true,
        user: true,
      },
      })
      .then(() => {
      // emitir o evento de atualização no banco de dados
      prisma.$executeRaw`notify_pharmacy_product_changes();`;
      return res.status(204).send();
      })
      .catch((error) => {
      logger.logger.error(error);
      return res.status(500).json({ message: { ...error } });
      });
  },
  stock: async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };

    if (!id) return res.status(404).json({ message: "missing id field!" });

    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        Product: true,
        Review: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const products = await prisma.product.findMany({
      where: {
        user: {
          some: {
            id: Number(id),
          },
        },
      },
      include: {
        categories: true,
        PharmacyProduct: true,
        reviews: true,
        user: true,
      },
    });

    logger.logger.info(products);

    if (!products)
      return res.status(404).json({ message: "No products found" });

    // capturar os produtos que estão disponíveis para retirada

    const pharmacytoProduct = await prisma.pharmacyProduct.findMany({
      where: {
        quantity: {
          gt: 0,
        },
      },
    });

    if (!pharmacytoProduct)
      return res.status(404).json({ message: "No products found" });

    return res.status(200).json({ products: pharmacytoProduct });
  },
  updateStock: async (req: Request, res: Response) => {
    const { pharmacyId, productId, quantity } = req.body;

    try {
      const pharmacyProduct = await prisma.pharmacyProduct.findMany({
        where: {
          pharmacyId: pharmacyId,
          productId: productId,
        },
      });

      if (!pharmacyProduct) {
        // Create new record if doesn't exist
        await prisma.pharmacyProduct.create({
          data: {
            pharmacyId: Number(pharmacyId),
            productId: Number(productId),
            quantity: quantity,
          },
        });
        return res.status(200).json({ message: "Stock created" });
      }

      // Update existing record
      await prisma.pharmacyProduct.update({
        where: {
          id: pharmacyId.id,
        },
        data: {
          quantity: quantity,
        },
      });
      return res.status(200).json({ message: "Stock updated" });

    } catch (error) {
      console.error('Error updating stock:', error);
      return res.status(500).json({ 
        error: "Failed to update stock",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },
};

export default ProductController;
