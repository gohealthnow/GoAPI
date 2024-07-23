import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = (req.headers as unknown as { authorization: string })
    .authorization;

  if (!token) {
    return res.status(401).json({ message: "Token não informado" });
  }

  if (process.env.JWT_SECRET) {
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      (
        err: jwt.VerifyErrors | null,
        decoded: string | jwt.JwtPayload | undefined
      ) => {
        if (err) {
          return res.status(401).json({ message: "Token inválido" });
        }

        if (decoded) {
          req.body.userId = (decoded as jwt.JwtPayload)?.id;
        }

        next();
      }
    );
  }
};
