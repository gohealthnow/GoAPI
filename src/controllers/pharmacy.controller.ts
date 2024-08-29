import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const pharmacyController = {
  geybyid: async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) return res.status(404).json({ message: "missing id field!" });

    const pharmacy = await prisma.pharmacy
      .findUnique({
        where: {
          id: parseInt(id),
        },
      })
      .catch((error) => {
        return res.status(404).json({ message: "Error listing pharmacy" });
      });

    if (!pharmacy)
      return res.status(404).json({ message: "No pharmacy found" });
    return res.status(200).json({ pharmacy: pharmacy });
  },
};

export default pharmacyController;
