import { AuditoryUseCase } from '../application/AuditoryUseCase'
import { AuditoryController } from './auditory.controller'
import { AuditoryMongoRepository } from './auditory.repository'

const auditoryRepository = new AuditoryMongoRepository()
const auditoryUseCase = new AuditoryUseCase(auditoryRepository)
const auditoryController = new AuditoryController(auditoryUseCase)

export default auditoryController
