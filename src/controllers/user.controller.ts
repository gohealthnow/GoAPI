import { Request, Response } from "express";

const userController = {
  authenticate: (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    
  },
};

export default userController;
