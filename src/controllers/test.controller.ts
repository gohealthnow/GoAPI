import { Request, Response } from "express";

const testController = {
  get: (req: Request, res: Response) => {
    res.json({ message: "Hello World" });
  },
};

export default testController;
