import { HttpContext } from '@adonisjs/core/build/standalone'
import Hash from '@ioc:Adonis/Core/Hash'
import { GenerateJWT, GenerateJWTForResetPassword } from 'App/Shared/Helpers/generate-jwt'
import { AuthenticationUseCase } from '../application/AuthenticationUseCase'
import { UserLoginEntity } from '../domain/login.entity'
import { UserRegisterEntity } from '../domain/register.entity'
import { UserRegister } from '../domain/register.value'
import jwt, { JwtPayload } from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
import { forgotPasswordEmail } from 'App/Shared/Services/MailerService'
import CreateAuditory from 'App/Shared/Helpers/create-auditory'
import { CreateAuditoryParams } from 'App/Shared/Interfaces/create-auditory.interface'

export class AuthenticationController {
  constructor(private authenticationUseCase: AuthenticationUseCase) {}

  public register = async ({ request, response }: HttpContext) => {
    const { userName, name, lastName, password, email, client, rol } = request.body()
    const hashedPassword = await Hash.make(password)

    const user: UserRegisterEntity = {
      name,
      userName,
      lastName,
      email,
      password: hashedPassword,
      client,
      rol,
      status: true,
    }

    const userRegister = new UserRegister(user)

    try {
      const registeredUser = await this.authenticationUseCase.register(userRegister)
      if (!registeredUser)
        return response.status(400).json({ error: 'Datos de registro incorrectos!' })

      return response.status(201).json({ message: 'Usuario creado!' })
    } catch (error) {
      return response.json({ message: 'No se pudo registrar el usuario!', error })
    }
  }

  public login = async (ctx: HttpContext) => {
    const { request, response } = ctx
    const { userName, password } = request.body()

    const userLogin: UserLoginEntity = {
      userName,
      password,
    }

    try {
      const user = await this.authenticationUseCase.login(userLogin)
      if (!user) return response.status(401).json({ error: 'Usuario o contraseña incorrectos!' })

      const verifyPassword = await Hash.verify(user.password, password)
      if (!verifyPassword)
        return response.status(401).json({ error: 'Usuario o contraseña incorrectos!' })

      const authenticationToken = await GenerateJWT(<string>user.uuid, user.userName, user.client)

      // ? CREANDO LA AUDITORIA
      const auditoryParams: CreateAuditoryParams = {
        action: 'Login',
        ctx,
        user,
      }
      await CreateAuditory(auditoryParams)

      return response.status(200).json({ message: 'Usuario autenticado!', authenticationToken })
    } catch (error) {
      return response.status(400).json({ error: 'No se pudo autenticar en el sistema!' })
    }
  }

  public getUserByUserName = async ({ response, request }: HttpContext) => {
    const { userName } = request.params()

    try {
      const user = await this.authenticationUseCase.getUserbyUserName(userName)
      if (!user) return response.status(404).json({ error: 'No se encuentra el usuario!' })

      return response.status(200).json(user)
    } catch (error) {
      response.status(500).json({ error: 'No se pudo realizar la consulta!' })
    }
  }

  public getUserByToken = async ({ response, request }: HttpContext) => {
    const token = request.header('authentication-user-token')
    if (!token)
      return response.status(401).json({ error: 'Debe proporcionar un token válido de acceso!' })

    try {
      const { id } = <JwtPayload>jwt.verify(token, Env.get('APP_KEY'))
      if (!id)
        return response.status(401).json({ error: 'Debe proporcionar un token válido de acceso!' })

      const user = await this.authenticationUseCase.getUserByToken(id)
      if (!user) return response.status(401).json({ error: 'No se encontró el usuario!' })

      return response.status(200).json({ message: 'Usuario encontrado!', user })
    } catch (error) {
      return response.status(400).json({ error: 'Token mal formado!' })
    }
  }

  public forgotPassword = async ({ response, request }: HttpContext) => {
    const { email } = request.body()

    try {
      const user = await this.authenticationUseCase.forgotPassword(email)
      if (!user) return response.status(404).json({ error: 'No se encuentra el usuario!' })

      const forgotPasswordToken = await GenerateJWTForResetPassword(email)
      await forgotPasswordEmail(email, <string>forgotPasswordToken)
      return response.status(200).json({
        message:
          'Se ha enviado un mensaje a su correo con la información necesaria para restablecer la contraseña!',
        forgotPasswordToken,
      })
    } catch (error) {
      return response.status(404).json({
        error: 'No se pudo enviar el email para recuparar su contraseña. Email no válido!',
      })
    }
  }

  public recoverPassword = async ({ response, request }: HttpContext) => {
    const token = request.header('email-authentication-token')
    if (!token)
      return response.status(401).json({ error: 'Debe proporcionar un token válido de acceso!' })

    const { password } = request.body()
    if (!password)
      return response.status(401).json({ error: 'Debe proporcionar la nueva contraseña!' })

    const hashedPassword = await Hash.make(password)

    try {
      const { email } = <JwtPayload>jwt.verify(token, Env.get('APP_KEY'))
      if (!email)
        return response.status(401).json({ error: 'Debe proporcionar un token válido de acceso!' })

      await this.authenticationUseCase.recoverPassword(email, hashedPassword)

      return response.status(200).json({ message: 'Contraseña actualizada!' })
    } catch (error) {
      return response.status(400).json({ error: 'Token mal formado!' })
    }
  }
}
