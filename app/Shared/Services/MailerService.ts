import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'c249b3d49fc959',
    pass: '0dcf4372c7b8b1',
  },
})

transporter
  .verify()
  .then((ok) => console.log({ mesagge: 'Nodemailer listo para enviar mensajes', ok }))
  .catch((error) => console.log({ error }))

export const forgotPasswordEmail = async (email: string, token: string): Promise<void> => {
  const url = `http://localhost:5000/resset-password/token?=${token}`
  const htmlTemplate = `
          <p>Cambio de contraseña:</p>
          <p>Hemos recibido su solicitud de cambio de contraseña. Si quiere modificar su contraseña de Sprint Game puede seguir el siguiente enlace.</p>
          <p>${url}</p>
  
  
          <p>Si ha recibido este email por error, ignore este mensaje</p>
  
          <p>Atentamente: <b>Sprint Game</b></p>
      `
  await transporter.sendMail({
    from: '"Sprint Gamong Team" <e4d8f1871a-ade949+1@inbox.mailtrap.io>',
    to: email,
    subject: 'Solicitud de cambio de contraseña',
    html: htmlTemplate,
  })
}
