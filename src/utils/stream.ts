import { Client } from "pg";
import { idUser, io, logger } from "../server";
import { PrismaClient } from "@prisma/client";
import { log } from "console";

const prisma = new PrismaClient();

// Configurando o cliente do PostgreSQL
export const pgClient = new Client({
  connectionString: process.env.DATABASE_URL,
});

export const connectWithRetry = () => {
  pgClient.connect((err) => {
    if (err) {
      logger.logger.error("Erro ao conectar ao PostgreSQL: " + err);
      setTimeout(connectWithRetry, 5000); // Tentar reconectar após 5 segundos
    } else {
      logger.logger.info("Conectado ao PostgreSQL");
      pgClient.query("LISTEN quantity_change");
    }
  });
};

// Manipulador de evento para quando o PostgreSQL notificar uma mudança
pgClient.on("notification", async (msg) => {
  logger.logger.info("Evento de atual", msg);
  // if (msg.channel === "quantity_change") {
  //   logger.logger.info("Evento de atualização recebido:", msg.payload);

  //   // Parse do payload recebido, assumindo que o payload é um JSON com pharmacyId e productId
  //   const payload = JSON.parse(msg.payload!);
  //   const { pharmacyId, productId, quantity } = payload;
    
  //   // Encontrar o produto e o usuário relacionado
  //   const product = await prisma.product.findUnique({
  //     where: { id: productId },
  //     include: { user: true },
  //   });

  //   if (product) {
  //     // Para cada usuário associado ao produto, enviar uma notificação
  //     for (const user of product.user) {
  //       if (user.id) {
  //         io.to(idUser.get(user.id)).emit("productAvailable", {
  //           message: `O produto ${product.name} que você reservou está disponível para retirada na farmácia!`,
  //           pharmacyId,
  //           productId,
  //           quantity,
  //         });
  //         logger.logger.info(
  //           `Notificação enviada para o usuário: ${user.name}`
  //         );
  //       } else {
  //         logger.logger.info(
  //           `Usuário ${user.id} não está conectado via Socket.io`
  //         );
  //       }
  //     }
  //   } else {
  //     logger.logger.info(
  //       `Produto ou usuário não encontrado para productId: ${productId}`
  //     );
  //   }
  // }
});

connectWithRetry();