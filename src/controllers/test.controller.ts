import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const testController = {
  get: (req: Request, res: Response) => {
    res.json({ message: "Hello World" });
  },

  connectionServer: async (req: Request, res: Response) => {
    await prisma
      .$connect()
      .then(() => {
        res.json({ message: "Database Server is running" });
      })
      .catch((error) => {
        res.json({ message: error.message });
      });
  },
};

export default testController;
