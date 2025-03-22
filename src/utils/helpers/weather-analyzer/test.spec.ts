import WeatherAnalyzer from ".";
import { TemperatureRange } from "../../../domain/models";
import { TemperatureRangeName } from "../../../domain/models/TemperatureRange";
import { IWeatherData } from "../../../infra/external/WeatherApi/interface";

describe("WeatherAnalyzer", () => {
  let weatherAnalyzer: WeatherAnalyzer;

  beforeEach(() => {
    weatherAnalyzer = new WeatherAnalyzer();
  });

  const temperatureRange: TemperatureRange = {
    id: 1,
    name: TemperatureRangeName.COLD,
    minTemperature: 15,
    maxTemperature: 25,
  };

  const weatherData: IWeatherData = {
    timezone: "America/Sao_Paulo",
    timezone_abbreviation: "BRT",
    hourly: {
      time: ["2025-03-22T06:00", "2025-03-22T12:00"],
      temperature: [18, 22],
      precipitation: [0, 0],
      precipitationProbability: [0, 0],
    },
    hourly_units: {
      temperature: "°C",
    },
  };

  it("deve retornar análise correta para clima ameno (temperatura média dentro do range)", async () => {
    const result = await weatherAnalyzer.analyzeWeather(weatherData, temperatureRange);

    expect(result.thermalComfort).toContain("ameno");
    expect(result.bestOutdoorTime).toContain("🌤 Melhor horário para atividades ao ar livre:");
    expect(result.clothingRecommendation).toContain("👕 Sugestão de vestuário:");
    expect(result.climateRiskLevel).toContain("Baixo");
    expect(result.airQualityRecommendation).toContain("🌍 Qualidade do ar: Boa");
    expect(result.rainProbabilityAnalysis).toContain("Sem chances altas ou médias de chuva");
  });

  it('deve retornar análise com conforto "frio" quando a média for menor que o mínimo', async () => {
    const expectedWeatherData: IWeatherData = {
      ...weatherData,
      hourly: {
        temperature: [10, 12],
        time: ["2025-03-22T06:00", "2025-03-22T12:00"],
        precipitation: [0, 0],
        precipitationProbability: [0, 0],
      },
    };

    const result = await weatherAnalyzer.analyzeWeather(expectedWeatherData, temperatureRange);

    expect(result.thermalComfort).toContain("frio");
  });

  it('deve retornar análise com conforto "quente" quando a média for maior que o máximo', async () => {
    const expectedWeatherData: IWeatherData = {
      ...weatherData,
      hourly: {
        ...weatherData.hourly,
        temperature: [30, 35],
      },
    };

    const result = await weatherAnalyzer.analyzeWeather(expectedWeatherData, temperatureRange);

    expect(result.thermalComfort).toContain("quente");
  });

  it("deve incluir recomendação de guarda-chuva se houver precipitação", async () => {
    const expectedWeatherData: IWeatherData = {
      ...weatherData,
      hourly: {
        ...weatherData.hourly,
        precipitation: [0, 1],
        precipitationProbability: [0, 50],
      },
    };

    const result = await weatherAnalyzer.analyzeWeather(expectedWeatherData, temperatureRange);

    expect(result.clothingRecommendation).toMatch(/guarda-chuva/);
  });

  it('deve retornar risco climático "Alto" quando a temperatura máxima for maior que 35 e menor ou igual a 40', async () => {
    const expectedWeatherData: IWeatherData = {
      ...weatherData,
      hourly: {
        ...weatherData.hourly,
        temperature: [36, 38],
      },
    };

    const result = await weatherAnalyzer.analyzeWeather(expectedWeatherData, temperatureRange);

    expect(result.climateRiskLevel).toContain("Alto");
  });

  it('deve retornar risco climático "Crítico" quando a temperatura máxima for maior que 40', async () => {
    const expectedWeatherData: IWeatherData = {
      ...weatherData,
      hourly: {
        ...weatherData.hourly,
        temperature: [41, 42],
      },
    };

    const result = await weatherAnalyzer.analyzeWeather(expectedWeatherData, temperatureRange);

    expect(result.climateRiskLevel).toContain("Crítico");
  });

  it("deve analisar corretamente a probabilidade de chuva com dados de precipitação", async () => {
    const expectedWeatherData: IWeatherData = {
      ...weatherData,
      hourly: {
        time: ["2025-03-22T06:00", "2025-03-22T12:00", "2025-03-22T18:00"],
        temperature: [18, 22, 20],
        precipitation: [0, 0, 0],
        precipitationProbability: [35, 75, 55],
      },
    };

    const result = await weatherAnalyzer.analyzeWeather(expectedWeatherData, temperatureRange);

    expect(result.rainProbabilityAnalysis).toContain("Chance alta de chuva entre os horários");
    expect(result.rainProbabilityAnalysis).toContain("Chance média de chuva nos horários");
  });
});
