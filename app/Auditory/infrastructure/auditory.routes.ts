import Route from '@ioc:Adonis/Core/Route'
import auditoryController from './dependencies'

const AuditoriesRoutes = () => {
  Route.post('/search', auditoryController.searchAuditories)
}

export default AuditoriesRoutes
