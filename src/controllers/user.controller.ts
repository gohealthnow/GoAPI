import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ADMIN_SECRET, JWT_SECRET, logger } from "../server";
import { regExpEmail } from "../middlewares/checkin";

const prisma = new PrismaClient();

const userController = {
  authenticate: async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string; password: string };

    if (!email) {
      return res.status(400).json({ message: "Missing email field" });
    }

    if (!password) {
      return res.status(400).json({ message: "Missing password field" });
    }

    const emailconverted = email.toLowerCase();

    await prisma.user
      .findUnique({
        where: {
          email: emailconverted,
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
          const { password, ...userWithoutPassword } = user;
          return res.status(200).json({ token, user: userWithoutPassword });
        }
      })
      .catch((error) => {
        return res.status(500).json({ message: error.message });
      });
  },
  create: async (req: Request, res: Response) => {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    logger.logger.info(req.body);

    if (!name) {
      return res.status(400).json({ message: "Missing name field" });
    }

    if (!email) {
      return res.status(400).json({ message: "Missing email field" });
    }

    if (!password) {
      return res.status(400).json({ message: "Missing password field" });
    }

    const convertedEmail = email.toLowerCase();

    if (!regExpEmail(convertedEmail)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const userExists = await prisma.user
      .findUnique({
        where: {
          email: convertedEmail,
        },
      })
      .catch((error) => {
        logger.logger.error(error);
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
          email: convertedEmail,
          password: password,
          name: name,
        },
      })
      .then((user) => {
        const token = jwt.sign({ id: user.id }, JWT_SECRET, {
          expiresIn: "1h",
        });
        const { password, ...userWithoutPassword } = user;
        return res
          .status(201)
          .json({ token: token, user: userWithoutPassword });
      })
      .catch((error) => {
        logger.logger.error(error);
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
        logger.logger.error(error.message);
        return res.status(500).json({ message: error.message });
      });
  },
  listAll: async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({
      include: {
        Product: true,
        Review: true,
      },
    });

    const usersWithoutPassword = users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    if (!usersWithoutPassword) {
      return res.status(404).json({ message: "Users not found" });
    }

    return res.status(200).json(usersWithoutPassword);
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
        include: {
          Product: true,
          Review: true,
        },
      })
      .then(() => {
        return res.status(204).send();
      })
      .catch((error) => {
        logger.logger.error(error.message);

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
  switchRole: async (req: Request, res: Response) => {
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
          logger.logger.error(error.message);

          return res.status(500).json({ message: error.message });
        });
    }

    return res.status(401).json({ message: "Invalid username or password" });
  },
  getUserById: async (req: Request, res: Response) => {
      const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing id field" });
    }

    const user = await prisma.user
      .findUnique({
        where: {
          id: Number(id),
        },
        include: {
          Product: true,
          Review: true,
        },
      })
      .catch((error) => {
        logger.logger.error(error.message);
        return error;
      })
      .then((user) => {
        return user;
      });

    const { password, ...userWithoutPassword } = user;

    if (!userWithoutPassword) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user: userWithoutPassword });
  },
  linkProductToUser: async (req: Request, res: Response) => {
    const { id, prodid } = req.body as {
      id: string;
      prodid: string;
    };

    if (!id) {
      return res.status(400).json({ message: "Missing id field" });
    }

    if (!prodid) {
      return res.status(400).json({ message: "Missing prodid field" });
    }

    const user = await prisma.user
      .findUnique({
        where: {
          id: Number(id),
        },
      })
      .catch((error) => {
        logger.logger.error(error.message);
        return res.status(500).json({ message: error.message });
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const productExists = await prisma.product
      .findUnique({
        where: {
          id: Number(prodid),
        },
      })
      .catch((error) => {
        logger.logger.error(error.message);
        return res.status(500).json({ message: error.message });
      });

    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    await prisma.user
      .update({
        where: {
          id: Number(id),
        },
        data: {
          Product: {
            connect: {
              id: Number(prodid),
            },
          },
        },
      })
      .then(() => {
        return res.status(204).send();
      })
      .catch((error) => {
        logger.logger.error(error.message);
        return res.status(500).json({ message: error.message });
      });
  },
};

export default userController;
