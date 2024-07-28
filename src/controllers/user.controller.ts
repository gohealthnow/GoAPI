import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ADMIN_SECRET, JWT_SECRET } from "../server";
import pino from "pino";

const logger = pino();
const prisma = new PrismaClient();

const userController = {
  authenticate: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    console.log(JWT_SECRET);

    await prisma.user
      .findUnique({
        where: {
          email: email,
          password: password,
        },
      })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: "Invalid credentials" });
        } else {
          const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({ token });
        }
      })
      .catch((error) => {
        return res.status(500).json({ message: error.message });
      });
  },
  create: async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const userExists = await prisma.user
      .findUnique({
        where: {
          email: email,
        },
      })
      .catch((error) => {
        logger.error(error);
      })
      .then((user) => {
        return user;
      });

    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    await prisma.user
      .create({
        data: {
          email: email,
          password: password,
          name: name,
        },
      })
      .then((user) => {
        const token = jwt.sign({ id: user.id }, JWT_SECRET, {
          expiresIn: "1h",
        });
        return res.status(201).json({ token });
      })
      .catch((error) => {
        logger.error(error);
        return res.status(500).json({ message: error.message });
      });
  },
  delete: async (req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.user
      .delete({
        where: {
          id: Number(id),
        },
      })
      .then(() => {
        return res.status(204).send();
      })
      .catch((error) => {
        logger.error(error.message);
        return res.status(500).json({ message: error.message });
      });
  },
  listAll: async (req: Request, res: Response) => {
    const users = await prisma.user.findMany();

    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    }

    return res.status(200).json(users);
  },
  update: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email, password } = req.body;

    await prisma.user
      .update({
        where: {
          id: Number(id),
        },
        data: {
          email: email,
          password: password,
        },
      })
      .then(() => {
        return res.status(204).send();
      })
      .catch((error) => {
        logger.error(error.message);

        return res.status(500).json({ message: error.message });
      });
  },
  logout: (req: Request, res: Response) => {
    return res.status(200).json({ message: "Logout successful" });
  },
  getbyToken: async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(498).json({ message: "No token provided" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        return res.status(200).json(decoded);
      }
    });
  },
  getProfile: async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(498).json({ message: "No token provided" });
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        const user = await prisma.user.findUnique({
          where: {
            id: (decoded as JwtPayload)?.id,
          },
        });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const { password, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
      }
    });
  },
  swirchRole: async (req: Request, res: Response) => {
    const { id, role } = req.query;

    const password = req.headers.authorization?.split(" ")[1];

    if (!password)
      return res.status(400).json({ message: "No password provided" });

    if (!ADMIN_SECRET)
      return res.status(500).json({ message: "No admin password provided" });

    if (password === ADMIN_SECRET) {
      await prisma.user
        .update({
          where: {
            id: Number(id),
          },
          data: {
            role: role as Role,
          },
        })
        .then(() => {
          return res.status(204).send();
        })
        .catch((error) => {
          logger.error(error.message);

          return res.status(500).json({ message: error.message });
        });
    }
  },
};

export default userController;
