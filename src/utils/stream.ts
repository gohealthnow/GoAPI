import { idUser, io, logger } from "../server";
import { PrismaClient } from "@prisma/client";
import createSubscriber from "pg-listen"

const prisma = new PrismaClient();

// Accepts the same connection config object that the "pg" package would take
const pgClient = createSubscriber({ connectionString: process.env.DATABASE_URL_STRING })

pgClient.notifications.on("quantity_change", async (msg) => {
    logger.logger.info("Evento de atualização recebido:", {...msg});

    // Parse do payload recebido, assumindo que o payload é um JSON com pharmacyId e productId
    const { pharmacyId, productId, quantity } = msg;
    
    // Encontrar o produto e o usuário relacionado
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { user: true },
    });

    if (product) {
      // Para cada usuário associado ao produto, enviar uma notificação
      for (const user of product.user) {
        if (user.id) {
          const socketId = idUser.get(user.id);
          if (socketId) {
            io.to(socketId).emit("productAvailable", {
              message: `O produto ${product.name} que você reservou está disponível para retirada na farmácia!`,
              pharmacyId,
              productId,
              quantity,
            });
            logger.logger.info(`Notificação enviada para o usuário: ${user.name}, ${socketId}`);
          } else {
            logger.logger.info(`Usuário ${user.id} não está conectado via Socket.io`);
          }
        }
      }
  }
})

pgClient.events.on("error", (error) => {
  console.error("Fatal database connection error:", error)
  process.exit(1)
})

process.on("exit", () => {
  pgClient.close()
})

export async function connect () {
  await pgClient.connect()
  await pgClient.listenTo("quantity_change")
  await sendSampleMessage()
}

export async function sendSampleMessage () {
  await pgClient.notify("quantity_change", { pharmacyId: 1, productId: 1, quantity: 10 })
}