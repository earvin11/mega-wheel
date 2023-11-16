import { playerUseCases } from "App/Player/infraestructure/dependencies";
import { LaunchController } from "./launch.controller";
import { operatorUseCases } from "App/Operator/infrastructure/dependencies";
import { clientUseCases } from "App/Client/infrastructure/dependencies";
import { currencyUseCases } from "App/Currencies/infrastructure/dependencies";
import { wheelFortuneUseCases } from "App/WheelFortune/infraestructure/dependencies";

export const launchController = new LaunchController(
    playerUseCases,
    operatorUseCases,
    clientUseCases,
    currencyUseCases,
    wheelFortuneUseCases
);