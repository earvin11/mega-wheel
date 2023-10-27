import { SupportEntity } from './support.entity'

export interface AnswerTicket extends Pick<SupportEntity, 'answer' | 'operator'> {}
