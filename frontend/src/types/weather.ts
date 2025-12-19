
export interface WeatherData {
    date: string;
    temp: number;
    temp_min: number;
    temp_max: number;
    feels_like: number;
    humidity: number;
    description: string;
    icon: string;
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

// Weather icon mapping 
export const WEATHER_ICONS: { [key: string]: string} = {
    "01d": "☀️", // clear sky day
    "01n": "🌙", // clear sky night
    "02d": "⛅", // few clouds day
    "02n": "☁️", // few clouds night
    "03d": "☁️", // scattered clouds
    "03n": "☁️",
    "04d": "☁️", // broken clouds
    "04n": "☁️",
    "09d": "🌧️", // shower rain 
    "09n": "🌧️", 
    "10d": "🌦️", // rain day
    "10n": "🌧️", // rain night
    "11d": "⛈️", // thunderstorm
    "11n": "⛈️",
    "13d": "❄️", // snow day
    "13n": "❄️", // snow night
    "50d": "🌫️", // mist
    "50n": "🌫️",
};

export const getWeatherEmoji = (iconCode: string): string => {
    return WEATHER_ICONS[iconCode] || "🌤️";
};

export const getWeatherDescription = (description: string): string => {
    return description.charAt(0).toUpperCase() + description.slice(1);
}