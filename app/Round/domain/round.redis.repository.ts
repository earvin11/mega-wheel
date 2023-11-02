import { Phase } from "App/Game/domain/types/phase.interfaces";

export interface RoundRedisRepository {
  changeCurrentPhase(table: string, phase: Phase): Promise<void>
  getCurrentPhase(table: string): Promise<Phase>
}