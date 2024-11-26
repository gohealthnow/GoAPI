import jwt from "jsonwebtoken";

export function generateToken(userId: string): string {
  const secretKey = process.env.JWT_SECRET ?? "minecraft123";
  const token = jwt.sign({ id: userId }, secretKey, { expiresIn: "1h" });
  return token;
}
