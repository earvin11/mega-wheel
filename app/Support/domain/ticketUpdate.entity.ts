import { SupportEntity } from './support.entity'

export interface TicketUpdate extends Pick<SupportEntity, 'description' | 'title'> {}
