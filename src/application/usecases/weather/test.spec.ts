import { mock } from "jest-mock-extended";
import { Request } from "express";
import { IWeatherData, WeatherApi } from "../../../infra/external/WeatherApi/interface";
import { StateCapitalRepository } from "../../../infra/repositories/StateCapitalRepository";
import WeatherAnalyzer, { AnalisisResult } from "../../../utils/helpers/weather-analyzer";
import GetWeatherInformationUseCase from "./GetWeatherInformationUseCase";
import NotFoundError from "../../../utils/error/not-found-error";
import { HttpStatusCode } from "../../../utils/helpers/protocols";
import { StateCapital, TemperatureRange } from "../../../domain/models";
import { TemperatureRangeName } from "../../../domain/models/TemperatureRange";

describe("GetWeatherInformationUseCase", () => {
  let weatherApiMock = mock<WeatherApi>();
  let stateCapitalRepositoryMock = mock<StateCapitalRepository>();
  let weatherAnalyzerMock = mock<WeatherAnalyzer>();
  let useCase: GetWeatherInformationUseCase;

  const temperatureRange: TemperatureRange = {
    id: 1,
    name: TemperatureRangeName.COLD,
    minTemperature: 15,
    maxTemperature: 25,
  };

  const stateCapital: StateCapital = {
    id: 1,
    name: "Belo Horizonte",
    state: "MG",
    latitude: "-19.8157",
    longitude: "-43.2096",
    idTemperatureRange: 1,
    temperatureRange,
  };

  const weatherData: IWeatherData = {
    timezone: "America/Sao_Paulo",
    timezone_abbreviation: "BRT",
    hourly: {
      time: ["06:00", "12:00"],
      temperature: [18, 22],
      precipitation: [0, 0],
      precipitationProbability: [0, 0],
    },
    hourly_units: {
      temperature: "°C",
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetWeatherInformationUseCase(
      weatherApiMock,
      stateCapitalRepositoryMock,
      weatherAnalyzerMock
    );
  });

  it('deve retornar o resultado da análise quando a query possui "id" e a capital é encontrada', async () => {
    const request = { query: { id: "1" } } as unknown as Request;

    stateCapitalRepositoryMock.findOne.mockResolvedValue(stateCapital);
    weatherApiMock.getWeather.mockResolvedValue(weatherData);

    const analysisResult: AnalisisResult = {
      thermalComfort: "✅ Conforto térmico: O clima está ameno.",
      bestOutdoorTime: "🌤 Melhor horário para atividades ao ar livre: 06:00 (Temperatura: 18°C, horário GMT-3).",
      clothingRecommendation: "👕 Sugestão de vestuário: Vista-se confortavelmente.",
      climateRiskLevel: "⚠️ Nível de risco climático: Baixo",
      airQualityRecommendation: "🌍 Qualidade do ar: Boa. Aproveite o dia ao ar livre!",
      rainProbabilityAnalysis: "Sem chances altas ou médias de chuva."
    };

    weatherAnalyzerMock.analyzeWeather.mockResolvedValue(analysisResult);

    const response = await useCase.execute(request);

    expect(stateCapitalRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { id: "1" },
      relations: ["temperatureRange"],
    });
    expect(weatherApiMock.getWeather).toHaveBeenCalledWith(
      stateCapital.latitude,
      stateCapital.longitude
    );
    expect(weatherAnalyzerMock.analyzeWeather).toHaveBeenCalledWith(
      weatherData,
      stateCapital.temperatureRange
    );
    expect(response).toEqual({
      statusCode: HttpStatusCode.OK,
      body: analysisResult,
    });
  });

  it('deve retornar o resultado da análise quando a query possui "name" e a capital é encontrada', async () => {
    const request = { query: { name: "Belo Horizonte" } } as unknown as Request;

    stateCapitalRepositoryMock.findOne.mockResolvedValue(stateCapital);
    weatherApiMock.getWeather.mockResolvedValue(weatherData);

    const analysisResult: AnalisisResult = {
      thermalComfort: "✅ Conforto térmico: O clima está ameno.",
      bestOutdoorTime: "🌤 Melhor horário para atividades ao ar livre: 08:00 (Temperatura: 17°C, horário GMT-3).",
      clothingRecommendation: "👕 Sugestão de vestuário: Vista-se confortavelmente.",
      climateRiskLevel: "⚠️ Nível de risco climático: Baixo",
      airQualityRecommendation: "🌍 Qualidade do ar: Boa. Aproveite o dia ao ar livre!",
      rainProbabilityAnalysis: "Sem chances altas ou médias de chuva."
    };

    weatherAnalyzerMock.analyzeWeather.mockResolvedValue(analysisResult);

    const response = await useCase.execute(request);

    expect(stateCapitalRepositoryMock.findOne).toHaveBeenCalledWith({
      where: { name: "Belo Horizonte" },
      relations: ["temperatureRange"],
    });
    expect(weatherApiMock.getWeather).toHaveBeenCalledWith(
      stateCapital.latitude,
      stateCapital.longitude
    );
    expect(weatherAnalyzerMock.analyzeWeather).toHaveBeenCalledWith(
      weatherData,
      stateCapital.temperatureRange
    );
    expect(response).toEqual({
      statusCode: HttpStatusCode.OK,
      body: analysisResult,
    });
  });

  it("deve lançar NotFoundError quando a capital não for encontrada", async () => {
    const request = { query: { id: "1" } } as unknown as Request;
    stateCapitalRepositoryMock.findOne.mockResolvedValue(null);

    await expect(useCase.execute(request)).rejects.toThrow(NotFoundError);
  });
});
