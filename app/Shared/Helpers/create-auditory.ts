import { HttpContext } from '@adonisjs/core/build/standalone'
import { AuditoryEntity } from '../../Auditory/domain/auditory.entity'
import { Auditory } from '../../Auditory/domain/auditory.value'
import auditoryController from '../../Auditory/infrastructure/dependencies'
import { CreateAuditoryParams } from '../Interfaces/create-auditory.interface'

interface Actions {
  typeAction: string
  route: string
  ipAddress: string
}

const AuditoryActions = ({ request }: HttpContext): Actions => {
  const actions = {
    typeAction: request.method(),
    route: request.completeUrl(true),
    ipAddress: request.ip(),
  }

  return actions
}

const CreateAuditory = async ({ action, ctx, resource, user }: CreateAuditoryParams) => {
  const actions = AuditoryActions(ctx)

  const auditory: AuditoryEntity = {
    ...actions,
    action,
    resource: resource ? resource : '',
    user_uuid: user ? user.uuid : null,
  }

  const newAuditory = new Auditory(auditory)
  await auditoryController.createAuditory(newAuditory)
}

export default CreateAuditory
