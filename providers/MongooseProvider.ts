import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { Mongoose } from 'mongoose'
//import Env from '@ioc:Adonis/Core/Env'

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class MongoProvider {
  public static needsApplication = true

  constructor(protected application: ApplicationContract) {}

  public async register() {
    // Create new Mongoose instance
    const mongoose = new Mongoose()

    // Connect the instance to DB
    //para poder usar las collecciones hay que primero conectarce a mongodb y luego ejecutar el server
    //este metodo se ejecuta luego del server por ende no funcionan las colecciones y se quedan colgadas

    // Attach it to IOC container as singleton
    this.application.container.singleton('Mongoose', () => mongoose)
  }

  public async boot() {
    // All bindings are ready, feel free to use them
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
    // Going to take the Mongoose singleton from container
    // and call disconnect() on it
    // which tells Mongoose to gracefully disconnect from MongoBD server
    await this.application.container.use('Mongoose').disconnect()
  }
}