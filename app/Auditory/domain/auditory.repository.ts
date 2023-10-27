import { AuditoryEntity } from './auditory.entity'
import { SearchAuditoriesParams } from './search.entity'

export interface AuditoryRepository {
  createAuditory(auditory: AuditoryEntity): Promise<void>
  searchAuditories(
    searchProps: SearchAuditoriesParams
  ): Promise<{ total: number; auditories: AuditoryEntity[] } | {}>
}
