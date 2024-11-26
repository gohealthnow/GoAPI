import nodemailer from "nodemailer";

// Função para enviar o email
export async function sendEmail(userEmail: string, token: string) {
  // Configuração do transporte do Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "healthgo788@gmail.com",
      pass: "casa123321",
    },
  });

  // Configuração do email
  const mailOptions = {
    from: process.env.email_server,
    to: userEmail,
    subject: "Seu Token",
    html: `
   <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
    <h2 style="color: #333;">Seu Token de Acesso</h2>
    <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 20px;">
     <p style="font-size: 16px; color: #666;">Aqui está o seu token:</p>
     <p style="font-size: 24px; color: #2196f3; font-weight: bold; padding: 10px; background-color: #f0f8ff; border-radius: 3px;">${token}</p>
    </div>
    <p style="color: #888; margin-top: 20px; font-size: 12px;">Este é um email automático, não responda.</p>
   </div>
  `,
  };

  // Enviar o email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email enviado com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar o email:", error);
  }
}

export function generatePassowrdRandom(name: string): string {
  return (
    name.split(" ")[0].toUpperCase() + Math.random().toString(36).substring(2)
  );
}
