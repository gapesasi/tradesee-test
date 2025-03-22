import { Application } from "express";
import GetWeatherInformationComposer from "../../main/composer/weather/GetWeatherInformation";
import { GetWeatherInformationValidator } from "../validators/GetWeatherInformationValidator";
import ExpressRouterAdapter from "../../main/adapters/ExpressRouterAdapter";

export default (app: Application): void => {
  app.get(
    "/weather",
    GetWeatherInformationValidator,
    ExpressRouterAdapter.adapt(GetWeatherInformationComposer.compose())
  );
};
