import { Request, Response } from "express";
import { Pharmacy, PharmacyProduct, PrismaClient } from "@prisma/client";
import { logger } from "../server";
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
    const products = await prisma.product
      .findMany({
        include: {
          user: true,
          PharmacyProduct: true,
          reviews: true,
          categories: true,
        },
      })
      .catch((error) => {
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
  getbyid: async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) return res.status(404).json({ message: "missing id field!" });

    const product = await prisma.product
      .findUnique({
        where: {
          id: Number(id),
        },
      })
      .catch((error) => {
        logger.logger.error(error);
        return res.status(404).json({ message: "Error finding product" });
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
            contains: name,
          },
        },
        include: {
          categories: true,
          PharmacyProduct: true,
          reviews: true,
        },
      })
      .catch((error) => {
        logger.logger.error(error);
        return null;
      });

    if (!product)
      return res.status(404).json({ message: "Error finding product" });

    // capturar as farmacias que estão associados no products encontrado no pharmacyProduct
    const productIds = product.map((p) => p.id);

    const pharmacies = await prisma.pharmacyProduct.findMany({
      where: {
        productId: {
          in: productIds,
        },
      },
      include: {
        pharmacy: true,
      },
    });

    return res.status(200).json({ product: product, pharmacies: pharmacies });

  },
  updatebyid: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { price } = req.body;

    if (!id) return res.status(404).json({ message: "missing id field!" });
    if (!price)
      return res.status(404).json({ message: "missing price field!" });

    await prisma.product
      .update({
        where: {
          id: Number(id),
        },
        data: {
          price: price,
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
    const { productId, pharmacyId } = req.params as {
      productId: string;
      pharmacyId: string;
    };
    const { quantity } = req.body as { quantity: number };

    if (!productId)
      return res.status(404).json({ message: "missing product field!" });
    if (!pharmacyId)
      return res.status(404).json({ message: "missing pharmacy field!" });
    if (!quantity)
      return res.status(404).json({ message: "missing quantity field!" });

    if(quantity < 0) return res.status(404).json({ message: "Quantity must be greater than 0" });

    const productexisted = await prisma.product.findUnique({
      where: {
        id: Number(productId),
      },
    });

    if (!productexisted)
      return res.status(404).json({ message: "Product not found" });

    const pharmacyexisted = await prisma.pharmacy.findUnique({
      where: {
        id: Number(pharmacyId),
      },
    });

    if (!pharmacyexisted)
      return res.status(404).json({ message: "Pharmacy not found" });

    const pharmacyProduct = await prisma.pharmacyProduct.findFirst({
      where: {
        pharmacyId: Number(pharmacyId),
        productId: Number(productId),
      },
    });

    if (!pharmacyProduct) {
      await prisma.pharmacyProduct.create({
        data: {
          pharmacyId: Number(pharmacyId),
          productId: Number(productId),
          quantity: quantity,
        },
      });
      return res.status(200).json({ message: "Stock updated" });
    }

    if (pharmacyProduct) {
      await prisma.pharmacyProduct.update({
        where: {
          id: pharmacyProduct.id,
        },
        data: {
          quantity: quantity,
        },
      });
      return res.status(200).json({ message: "Stock updated" });
    }
  },
};

export default ProductController;
