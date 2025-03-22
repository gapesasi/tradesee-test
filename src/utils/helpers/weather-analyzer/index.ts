import { TemperatureRange } from "../../../domain/models";
import { IWeatherData } from "../../../infra/external/WeatherApi/interface";

export interface AnalisisResult {
  thermalComfort: string;
  bestOutdoorTime: string;
  clothingRecommendation: string;
  climateRiskLevel: string;
  airQualityRecommendation: string;
  rainProbabilityAnalysis: string;
}

class WeatherAnalyzer {
  constructor() {}

  public async analyzeWeather(
    weatherData: IWeatherData,
    temperatureRange: TemperatureRange
  ): Promise<AnalisisResult> {
    const minTemp = Math.min(...weatherData.hourly.temperature);
    const maxTemp = Math.max(...weatherData.hourly.temperature);
    const avgTemp = (minTemp + maxTemp) / 2;

    return {
      thermalComfort: this.getThermalComfort(avgTemp, temperatureRange),
      bestOutdoorTime: this.getBestOutdoorTime(weatherData),
      clothingRecommendation: this.getClothingRecommendation(
        avgTemp,
        weatherData,
        temperatureRange
      ),
      climateRiskLevel: this.getClimateRiskLevel(maxTemp),
      airQualityRecommendation: this.getAirQualityRecommendation(),
      rainProbabilityAnalysis: this.getRainProbabilityAnalysis(weatherData),
    };
  }

  private getThermalComfort(avgTemp: number, range: TemperatureRange): string {
    let comfort = "desconhecido";

    if (avgTemp < Number(range.minTemperature)) {
      comfort = "frio";
    } else if (avgTemp > Number(range.maxTemperature)) {
      comfort = "quente";
    } else {
      comfort = "ameno";
    }

    return `✅ Conforto térmico: O clima está ${comfort}.`;
  }

  private getBestOutdoorTime(weatherData: any): string {
    const times = weatherData.hourly.time;
    const temperatures = weatherData.hourly.temperature;

    let bestHour: string | null = null;
    let bestTemperature: number | null = null;

    for (let i = 0; i < times.length; i++) {
      const date = new Date(times[i]);
      const hours = date.getHours();
      const temperature = temperatures[i];
      const formattedTime = date.toISOString().slice(11, 16);

      const isWithinDay = hours >= 5 && hours <= 20;
      const isTemperatureGood = temperature > 20 && temperature < 30;

      if (isWithinDay && isTemperatureGood) {
        bestHour = formattedTime;
        bestTemperature = temperature;
        break;
      }
    }

    return `🌤 Melhor horário para atividades ao ar livre: ${bestHour} (Temperatura: ${bestTemperature}°C, horário GMT-3).`;
  }

  private getClothingRecommendation(
    avgTemp: number,
    weatherData: IWeatherData,
    temperatureRange: TemperatureRange
  ): string {
    let recommendation = "Vista-se confortavelmente.";

    if (avgTemp <= Number(temperatureRange.minTemperature)) {
      recommendation = "Use roupas quentes.";
    } else if (avgTemp >= Number(temperatureRange.maxTemperature)) {
      recommendation = "Use roupas leves e protetor solar.";
    }

    const hasRainProbability = weatherData.hourly.precipitationProbability?.some(
      (p: number) => p >= 50
    );
    const hasRainPrecipitation = weatherData.hourly.precipitation?.some((p: number) => p > 0);

    const hasRain = hasRainProbability && hasRainPrecipitation;

    if (hasRain) {
      recommendation += " 🌧️ E lembre-se de levar um guarda-chuva.";
    }

    return `👕 Sugestão de vestuário: ${recommendation}`;
  }

  private getClimateRiskLevel(maxTemp: number): string {
    let risk = "Baixo";
    if (maxTemp > 35) risk = "Alto";
    if (maxTemp > 40) risk = "Crítico";

    return `⚠️ Nível de risco climático: ${risk}`;
  }

  private getAirQualityRecommendation(): string {
    return `🌍 Qualidade do ar: Boa. Aproveite o dia ao ar livre!`;
  }

  private getRainProbabilityAnalysis(weatherData: IWeatherData): string {
    const precipitationProbabilities: number[] | undefined =
      weatherData.hourly.precipitationProbability;
    let analysis = "🌧️ ";

    const isProbabilityHigh = (p: number) => p >= 70;
    const isProbabilityMedium = (p: number) => p >= 40 && p < 70;

    if (precipitationProbabilities) {
      const times = weatherData.hourly.time;
      const highRainTimes: string[] = [];
      const mediumRainTimes: string[] = [];

      for (let i = 0; i < precipitationProbabilities.length; i++) {
        const prob = precipitationProbabilities[i];
        const formattedTime = new Date(times[i]).toISOString().slice(11, 16);

        if (isProbabilityHigh(prob)) {
          highRainTimes.push(formattedTime);
        } else if (isProbabilityMedium(prob)) {
          mediumRainTimes.push(formattedTime);
        }
      }

      if (highRainTimes.length > 0) {
        analysis += `Chance alta de chuva entre os horários ${highRainTimes.join(", ")}.`;
      }
      if (mediumRainTimes.length > 0) {
        analysis += ` Chance média de chuva nos horários ${mediumRainTimes.join(", ")}.`;
      }
      if (highRainTimes.length === 0 && mediumRainTimes.length === 0) {
        analysis = "🌧️ Sem chances altas ou médias de chuva.";
      }
    } else {
      analysis = "🌧️ Dados de probabilidade de chuva indisponíveis.";
    }

    return analysis;
  }
}

export default WeatherAnalyzer;
