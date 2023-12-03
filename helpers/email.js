import nodemailer from "nodemailer"

const emailSignup = async (data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const { name, email, token } = data;

      await transport.sendMail({
        from: "BienesRaices.com",
        to: email,
        subject: "Cofirmación de cuenta en BienesRaices.com",
        text: "Cofirmación de cuenta en BienesRaices.com",
        html: `
          <p>Hola ${name}, por favor, confirma tu cuenta en BienesRaices.com</p>

          <p>Tu cuenta ya esta lista, solo debes confirmarla con el siguiente enlace:
          <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}">Confirmar cuenta</a></p>

          <p>Si tu no creaste esta cuenta, por favor, ignora este mensaje</p>
        `
      })
}

const emailForgotPassword = async (data) => {
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const { name, email, token } = data;

    await transport.sendMail({
      from: "BienesRaices.com",
      to: email,
      subject: "Cambio de contraeña en BienesRaices.com",
      text: "Cambio de contraeña en BienesRaices.com",
      html: `
        <p>Hola ${name}, para establecer una nueva contraseña, por favor sigue el siguiente enlace:
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/forgot-password/${token}">Cambiar contraeña</a></p>

        <p>Si tu no solicitaste este cambio de contraseña, por favor, ignora este mensaje</p>
      `
    })
}

export {
    emailSignup,
    emailForgotPassword
}