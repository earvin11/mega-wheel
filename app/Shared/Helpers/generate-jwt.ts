import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'

export const GenerateJWT = (id: string, userName: string, client: string) => {
  return new Promise((resolve, reject) => {
    const payload = { id, userName, client }

    jwt.sign(
      payload,
      Env.get('APP_KEY'),
      {
        expiresIn: '4h',
      },
      (err, token) => {
        if (err) {
          console.log(err)
          reject('No se pudo generar el token')
        } else {
          resolve(token)
        }
      }
    )
  })
}

export const GenerateJWTForResetPassword = (email: string) => {
  return new Promise((resolve, reject) => {
    const payload = { email }

    jwt.sign(
      payload,
      Env.get('APP_KEY'),
      {
        expiresIn: '4h',
      },
      (err, token) => {
        if (err) {
          console.log(err)
          reject('No se pudo generar el token')
        } else {
          resolve(token)
        }
      }
    )
  })
}
