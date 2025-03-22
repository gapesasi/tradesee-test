import axios, { AxiosInstance } from "axios";
import { IWeatherData, WeatherApi } from "../interface";

type OpenMetheoWeatherData = {
  latitude: number;
  longitude: number;
  elevation: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation: number[];
    precipitation_probability: number[];
  };
  hourly_units: {
    temperature_2m: string;
  };
};

export class OpenMeteoApi implements WeatherApi {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "https://api.open-meteo.com/v1/forecast",
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        hourly: "temperature_2m,precipitation,precipitation_probability",
        past_days: 0,
        forecast_days: 1,
        timezone: "America/Sao_Paulo",
      },
    });
  }

  async getWeather(lat: string, lon: string): Promise<IWeatherData> {
    const result = await this.api.get<OpenMetheoWeatherData>("", {
      params: {
        latitude: lat,
        longitude: lon,
      },
    });

    return {
      timezone: result.data.timezone,
      timezone_abbreviation: result.data.timezone_abbreviation,
      hourly: {
        time: result.data.hourly.time,
        temperature: result.data.hourly.temperature_2m,
        precipitation: result.data.hourly.precipitation,
        precipitationProbability: result.data.hourly.precipitation_probability,
      },
      hourly_units: {
        temperature: result.data.hourly_units.temperature_2m,
      },
    };
  }
}

export function makeOpenMeteoApi(): WeatherApi {
  return new OpenMeteoApi();
}
