import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CategoryController = {
  listall: async (req: Request, res: Response) => {
    const category = await prisma.category.findMany();

    if (!category)
      return res.status(404).json({ message: "No category found" });
    return res.status(200).json({ category: category });
  },
  getbyid: async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) return res.status(404).json({ message: "missing id field!" });

    if (isNaN(parseInt(id)))
      return res.status(404).json({ message: "id must be a number!" });

    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!category)
      return res.status(404).json({ message: "No category found" });
    return res.status(200).json({ category: category });
  },
  create: async (req: Request, res: Response) => {
    const { name } = req.body as {
      name: string;
    };

    if (!name) return res.status(404).json({ message: "missing name field!" });

    // verificar se a categoria já existe

    const categoryExists = await prisma.category.findFirst({
      where: {
        name: name.toLowerCase(),
      },
    });

    if (categoryExists)
      return res.status(409).json({ message: "Category already exists!" });

    const category = await prisma.category.create({
      data: {
        name: name.toLowerCase(),
      },
    });

    return res.status(200).json({ category: category });
  },
  delete: async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) return res.status(404).json({ message: "missing id field!" });

    if (isNaN(parseInt(id)))
      return res.status(404).json({ message: "id must be a number!" });

    const category = await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    });

    return res.status(204).json({ category: category });
  },

  update: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body as {
      name: string;
    };

    if (!id) return res.status(404).json({ message: "missing id field!" });

    if (!name) return res.status(404).json({ message: "missing name field!" });

    if (isNaN(parseInt(id)))
      return res.status(404).json({ message: "id must be a number!" });

    const category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: name,
      },
    });

    return res.status(200).json({ category: category });
  },

  getProducts: async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) return res.status(404).json({ message: "missing id field!" });

    if (isNaN(parseInt(id)))
      return res.status(404).json({ message: "id must be a number!" });

    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        products: true,
      },
    });

    if (!category)
      return res.status(404).json({ message: "No category found" });
    return res.status(200).json({ category: category });
  },

  addProduct: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { prodid } = req.body as {
      prodid: number;
    };

    if (!id) return res.status(404).json({ message: "missing id field!" });

    if (!prodid)
      return res.status(404).json({ message: "missing prodid field!" });

    if (isNaN(parseInt(id)))
      return res.status(400).json({ message: "id must be a number!" });

    const productExists = await prisma.product.findFirst({
      where: {
        id: prodid,
      },
    });

    if (!productExists)
      return res.status(404).json({ message: "Product not found!" });

    const category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        products: {
          connect: {
            id: prodid,
          },
        },
      },
    });

    return res.status(200).json({ category: category });
  },

  removeProduct: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { productid } = req.body as {
      productid: number;
    };

    if (!id) return res.status(404).json({ message: "missing id field!" });

    if (!productid)
      return res.status(404).json({ message: "missing productid field!" });

    if (isNaN(parseInt(id)))
      return res.status(404).json({ message: "id must be a number!" });

    const category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        products: {
          disconnect: {
            id: productid,
          },
        },
      },
    });

    return res.status(200).json({ category: category });
  },

  updateProduct: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { productid } = req.body as {
      productid: number;
    };

    if (!id) return res.status(404).json({ message: "missing id field!" });

    if (!productid)
      return res.status(404).json({ message: "missing productid field!" });

    if (isNaN(parseInt(id)))
      return res.status(404).json({ message: "id must be a number!" });

    const category = await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        products: {
          set: {
            id: productid,
          },
        },
      },
    });

    return res.status(200).json({ category: category });
  },

  getbyName: async (req: Request, res: Response) => {
    const { name } = req.params;

    if (!name) return res.status(404).json({ message: "missing name field!" });

    const category = await prisma.category.findFirst({
      where: {
        name: name,
      },
    });

    if (!category)
      return res.status(404).json({ message: "No category found" });
    return res.status(200).json({ category: category });
  },

  getProductsbyName: async (req: Request, res: Response) => {
    const { name } = req.params;

    if (!name) return res.status(404).json({ message: "missing name field!" });

    const category = await prisma.category.findFirst({
      where: {
        name: name,
      },
      include: {
        products: true,
      },
    });

    if (!category)
      return res.status(404).json({ message: "No category found" });
    return res.status(200).json({ category: category });
  },
};

export default CategoryController;
