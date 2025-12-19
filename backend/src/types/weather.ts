
export interface WeatherData{
    date: string;
    temp: number; // Celsius
    temp_min: number;
    temp_max: number;
    feels_like: number;
    humidity: number;
    description: string;
    icon: string; // OpenWeather icon code
    wind_speed: number;
    clouds: number;
    rain?: number;
    snow?: number;
}

export interface WeatherForecast{
    city: string;
    country: string;
    forecast: WeatherData[];
}

export interface GeocodingResult{
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
}