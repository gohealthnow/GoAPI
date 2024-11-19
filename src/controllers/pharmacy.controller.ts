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
      });

    if (!pharmacy)
      return res.status(404).json({ message: "No pharmacy found" });
    return res.status(200).json({ pharmacy: pharmacy });
  },
  geybyid: async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) return res.status(404).json({ message: "missing id field!" });

    if (isNaN(parseInt(id))) return res.status(404).json({ message: "id must be a number!" });

    const pharmacy = await prisma.pharmacy
      .findUnique({
        where: {
          id: parseInt(id),
        },
        select: {
          image: true,
          PharmacyProduct: true,
          phone: true,
          name: true,
          email: true,
          description: true,
          geolocation: true,
        },
      });

    if (!pharmacy)
      return res.status(404).json({ message: "No pharmacy found" });
    return res.status(200).json({ pharmacy: pharmacy });
  },
  create: async (req: Request, res: Response) => {
    const {
      name,
      cep: customerPostalCode,
      email,
      imageurl,
      phone,
    } = req.body as {
      name: string;
      cep: string;
      email: string;
      imageurl: string;
      phone: string;
    };

    if (!name) return res.status(404).json({ message: "missing name field!" });
    if (!customerPostalCode || ![8, 9].includes(customerPostalCode.length))
      return res.status(404).json({ message: "missing cep field!" });
    if (!email)
      return res.status(404).json({ message: "missing email field!" });
    if (!phone || ![10, 11].includes(phone.length))
      return res.status(404).json({ message: "missing phone field!" });

    const fetchedZipCodeDetails = await consultarCep(
      customerPostalCode
    );

    if (!fetchedZipCodeDetails)
      return res.status(406).json({ message: "No cep found" });

    const pharmacy = await prisma.pharmacy
      .create({
        data: {
          name: name,
          email: email,
          image: imageurl ?? "https://via.placeholder.com/150",
          phone: phone,
          geolocation: {
            create: {
              address: `${fetchedZipCodeDetails.logradouro}, ${fetchedZipCodeDetails.bairro}`,
              cep: fetchedZipCodeDetails.cep,
              city: fetchedZipCodeDetails.localidade,
              additional: fetchedZipCodeDetails.complemento,
              latitude: 0.0,
              longitude: 0.0,
            },
          },
        },
        include: {
          geolocation: true,
        },
      });

    return res.status(201).json({ pharmacy: pharmacy });
  },
  search: async (req: Request, res: Response) => {
    const { name } = req.params;

    if (!name) return res.status(404).json({ message: "missing name field!" });

    const pharmacy = await prisma.pharmacy
      .findMany({
        where: {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
        include: {
          PharmacyProduct: true,
        },
      });

    if (!pharmacy)
      return res.status(404).json({ message: "No pharmacy found" });
    return res.status(200).json({ pharmacy: pharmacy });
  },
};

export default pharmacyController;
