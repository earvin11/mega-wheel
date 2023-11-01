import { WheelFortuneControlRedisUseCases } from "../apllication/wheel-fortune.redis.use-cases";
import { WheelFortuneUseCases } from "../apllication/wheel-fortune.use-cases";
import { WheelFortuneController } from "./wheelFortune.controller";
import { WheelFortuneMongoRepository } from "./wheelFortune.mongo-repository";
import { WheelFortuneControlRedisRepository } from "./wheelFortune.redis-repository";

export const wheelFortuneControlRedisRepository = new WheelFortuneControlRedisRepository();
export const wheelFortuneControlRedisUseCases = new WheelFortuneControlRedisUseCases(wheelFortuneControlRedisRepository);
export const wheelFortuneMongoRepository = new WheelFortuneMongoRepository();
export const wheelFortuneUseCases = new WheelFortuneUseCases(wheelFortuneMongoRepository);
export const wheelFortuneController = new WheelFortuneController(wheelFortuneUseCases, wheelFortuneControlRedisUseCases);