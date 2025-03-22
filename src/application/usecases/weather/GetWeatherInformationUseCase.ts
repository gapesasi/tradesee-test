import { Request } from "express";
import UseCase from "../../../domain/interfaces/UseCase";
import { StateCapital } from "../../../domain/models";
import { WeatherApi } from "../../../infra/external/WeatherApi/interface";
import { StateCapitalRepository } from "../../../infra/repositories/StateCapitalRepository";
import { GetWeatherInformationParams } from "../../../presentation/validators/GetWeatherInformationValidator";
import NotFoundError from "../../../utils/error/not-found-error";
import { HttpResponse, HttpStatusCode } from "../../../utils/helpers/protocols";
import WeatherAnalyzer, { AnalisisResult } from "../../../utils/helpers/weather-analyzer";

export default class GetWeatherInformationUseCase implements UseCase<AnalisisResult> {
  constructor(
    private readonly weatherApi: WeatherApi,
    private readonly stateCapitalRepository: StateCapitalRepository,
    private readonly weatherAnalyzer: WeatherAnalyzer
  ) {}

  async execute(
    request: Request<any, any, any, GetWeatherInformationParams>
  ): Promise<HttpResponse<AnalisisResult>> {
    const { id, name } = request.query;

    let stateCapital: StateCapital | null = null;

    if (id) {
      stateCapital = await this.stateCapitalRepository.findOne({
        where: { id },
        relations: ["temperatureRange"],
      });
    } else if (name) {
      stateCapital = await this.stateCapitalRepository.findOne({
        where: { name },
        relations: ["temperatureRange"],
      });
    }

    if (!stateCapital) {
      throw new NotFoundError("State capital not found");
    }

    const { latitude, longitude, temperatureRange } = stateCapital;

    const weather = await this.weatherApi.getWeather(latitude, longitude);

    console.info({ hourly: weather.hourly,  });

    const weatherAnalyzerResult = await this.weatherAnalyzer.analyzeWeather(
      weather,
      temperatureRange
    );

    return { statusCode: HttpStatusCode.OK, body: weatherAnalyzerResult };
  }
}
