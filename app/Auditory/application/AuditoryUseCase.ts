import { AuditoryEntity } from '../domain/auditory.entity'
import { AuditoryRepository } from '../domain/auditory.repository'
import { Auditory } from '../domain/auditory.value'
import { SearchAuditoriesParams } from '../domain/search.entity'

export class AuditoryUseCase {
  constructor(private readonly auditoryRepository: AuditoryRepository) {}

  public createAuditory = async (auditoryEntity: AuditoryEntity) => {
    const auditory = new Auditory(auditoryEntity)
    await this.auditoryRepository.createAuditory(auditory)
  }

  public searchAuditories = async (searchParams: SearchAuditoriesParams) => {
    const auditories = await this.auditoryRepository.searchAuditories(searchParams)
    return auditories
  }
}
