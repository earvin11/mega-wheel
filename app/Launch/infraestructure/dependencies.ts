import { playerUseCases } from "App/Player/infraestructure/dependencies";
import { LaunchController } from "./launch.controller";
import { clientUseCases, operatorUseCases } from "App/Operator/infrastructure/dependencies";
import { currencyUseCases } from "App/Currencies/infrastructure/dependencies";
import { wheelFortuneUseCases } from "App/WheelFortune/infraestructure/dependencies";
import { chipUseCases } from "App/Chip/infrastructure/dependencies";

export const launchController = new LaunchController(
    playerUseCases,
    operatorUseCases,
    clientUseCases,
    currencyUseCases,
    wheelFortuneUseCases,
    chipUseCases
);