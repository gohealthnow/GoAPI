import { Client } from "pg";
import { idUser, io, logger } from "../server";
import { PrismaClient } from "@prisma/client";
import createSubscriber from "pg-listen"

const prisma = new PrismaClient();

// Accepts the same connection config object that the "pg" package would take
const pgClient = createSubscriber({ connectionString: process.env.DATABASE_URL_STRING })

pgClient.notifications.on("quantity_change", async (msg) => {
  console.log("Received notification in 'quantity_change':", msg)
  if (msg.channel === "quantity_change") {
    logger.logger.info("Evento de atualização recebido:", msg.payload);

    // Parse do payload recebido, assumindo que o payload é um JSON com pharmacyId e productId
    const payload = JSON.parse(msg.payload!);
    const { pharmacyId, productId, quantity } = payload;
    
    // Encontrar o produto e o usuário relacionado
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { user: true },
    });

    if (product) {
      // Para cada usuário associado ao produto, enviar uma notificação
      for (const user of product.user) {
        if (user.id) {
          io.to(idUser.get(user.id)).emit("productAvailable", {
            message: `O produto ${product.name} que você reservou está disponível para retirada na farmácia!`,
            pharmacyId,
            productId,
            quantity,
          });
          logger.logger.info(
            `Notificação enviada para o usuário: ${user.name}`
          );
        } else {
          logger.logger.info(
            `Usuário ${user.id} não está conectado via Socket.io`
          );
        }
      }
    } else {
      logger.logger.info(
        `Produto ou usuário não encontrado para productId: ${productId}`
      );
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
}

export async function sendSampleMessage () {
  await pgClient.notify("quantity_change", { pharmacyId: 1, productId: 1, quantity: 10 })
}