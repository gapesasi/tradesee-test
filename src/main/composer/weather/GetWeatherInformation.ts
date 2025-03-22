import GetWeatherInformationUseCase from "../../../application/usecases/weather/GetWeatherInformationUseCase";
import Composer from "../../../domain/abstracts/Composer";
import { makeOpenMeteoApi } from "../../../infra/external/WeatherApi/OpenMetheo";
import { makeStateCapitalRepository } from "../../../infra/repositories/StateCapitalRepository";
import DefaultRouter from "../../../utils/helpers/default-router";
import WeatherAnalyzer from "../../../utils/helpers/weather-analyzer";

export default class GetWeatherInformationComposer implements Composer {
  static compose(): DefaultRouter {
    const weatherAnalyzer = new WeatherAnalyzer();

    const useCase = new GetWeatherInformationUseCase(
      makeOpenMeteoApi(),
      makeStateCapitalRepository(),
      weatherAnalyzer
    );

    return new DefaultRouter(useCase);
  }
}
