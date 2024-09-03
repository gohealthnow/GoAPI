import { PrismaClient } from "@prisma/client";
import { withPulse } from "@prisma/extension-pulse";

const prismaClientPulse = new PrismaClient().$extends(
  withPulse({ apiKey: process.env.PULSE_API_KEY as string })
);

export default prismaClientPulse;