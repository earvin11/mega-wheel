declare module '@ioc:Adonis/Core/HttpContext' {
  
    interface HttpContextContract {
        user: {
            uuid: string;
            userName: string;
            rol: string;
        }    
    }
}
  