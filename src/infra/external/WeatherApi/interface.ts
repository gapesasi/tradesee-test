export interface IWeatherData {
  timezone: string;
  timezone_abbreviation: string;
  hourly: {
    time: string[];
    temperature: number[];
    precipitation: number[];
    precipitationProbability: number[];
  };
  hourly_units: {
    temperature: string;
  };
}

export interface WeatherApi {
  getWeather(lat: string, lon: string): Promise<IWeatherData>;
}

