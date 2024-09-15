import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { consultarCep } from "correios-brasil";

const prisma = new PrismaClient();

const pharmacyController = {
  listall: async (req: Request, res: Response) => {
    const pharmacy = await prisma.pharmacy
      .findMany({
        include: {
          PharmacyProduct: true,
          geolocation: true,
        },
      })
      .catch((error) => {
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
    const { name, customerZipCode, email, imageurl, phone } = req.body;

    if (!name || !customerZipCode || !email)
      return res.status(400).json({
        message: "missing fields!\n you need to send name and address",
      });
    // ! Implementação do correios para pegar o cep e preencher os campos sem precisar pesquisar caso tenha o CEP

    const fetchedZipCodeDetails = await consultarCep(customerZipCode).catch(
      (error) => {
        return res.status(404).json({ message: "Error getting cep", error });
      }
    );

    if (!fetchedZipCodeDetails)
      return res.status(404).json({ message: "No cep found" });

    const pharmacy = await prisma.pharmacy
      .create({
        data: {
          name: name,
          email: email,
          image: imageurl ?? "https://via.placeholder.com/150",
          phone: phone,
          geolocation: {
            create: {
              address: `${fetchedZipCodeDetails.logradouro},${fetchedZipCodeDetails.complemento},${fetchedZipCodeDetails.bairro}`,
              cep: fetchedZipCodeDetails.cep,
              city: fetchedZipCodeDetails.localidade,
              country: "Brasil",
              state: fetchedZipCodeDetails.uf,
              latitude: 0.0,
              longitude: 0.0,
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
