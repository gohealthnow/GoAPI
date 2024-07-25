import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const userController = {
  authenticate: async (req: Request, res: Response) => {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };

    const user = await prisma.user.findFirst({
      where: {
        name: username,
      },
    });

    if (user && user.password === password) {
      const token = jwt.sign({ username }, "secret", { expiresIn: "1h" });
      return res.json({ token });
    }

    return res.status(401).json({ message: "Invalid username or password" });
  },
};

export default userController;
