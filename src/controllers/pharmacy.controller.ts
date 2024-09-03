import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const pharmacyController = {
  listall: async (req: Request, res: Response) => {
    const pharmacy = await prisma.pharmacy.findMany().catch((error) => {
      return res.status(404).json({ message: "Error listing pharmacy" });
    });

    if (!pharmacy)
      return res.status(404).json({ message: "No pharmacy found" });
    return res.status(200).json({ pharmacy: pharmacy });
  },
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
  create: async (req: Request, res: Response) => {
    const { name, address, email } = req.body;
    
    if (!name || !address || !email)
      return res.status(400).json({
        message: "missing fields!\n you need to send name and address",
      });
    // ! Implementação do correios para pegar o cep e preencher os campos sem precisar pesquisar caso tenha o CEP

    const pharmacy = await prisma.pharmacy
      .create({
        data: {
          name: name,
          email: email,
          image: "https://via.placeholder.com/150",
          phone: "0000-0000",
          geolocation: {
            create: {
              address: address,
              cep: "00000-000",
              city: "City",
              country: "Country",
              latitude: 0.0,
              longitude: 0.0,
              state: "State",
            },
          },
        },
      })
      .catch((error) => {
        return res.status(404).json({ message: "Error creating pharmacy" });
      });

    return res.status(201).json({ pharmacy: pharmacy });
  },
};

export default pharmacyController;
