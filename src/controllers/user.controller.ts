import { Request, Response } from "express";

const userController = {
  authenticate: (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin") {
      res.status(200).json({ message: "Authenticated" });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  },
};

export default userController;
