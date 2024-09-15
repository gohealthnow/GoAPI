import { Client } from "pg";
import { io, logger } from "../server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Configurando o cliente do PostgreSQL
export const pgClient = new Client({
  connectionString: process.env.DATABASE_URL,
});

// Escutando eventos do canal 'pharmacy_product_changes'
pgClient.query("LISTEN pharmacy_product_changes");

// Manipulador de evento para quando o PostgreSQL notificar uma mudança
pgClient.on("notification", async (msg) => {
  if (msg.channel === "pharmacy_product_changes") {
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
          io.to(user.id.toString()).emit("productAvailable", {
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
});
