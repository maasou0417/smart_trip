import type { WeatherData } from "../types/weather";
import { getWeatherEmoji, getWeatherDescription } from "../types/weather";

interface WeatherCardProps {
  weather: WeatherData;
  showDate?: boolean;
}

const WeatherCard = ({ weather, showDate = true }: WeatherCardProps) => {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "1.5rem",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-md)",
        minWidth: "200px",
      }}
    >
      {/* Date */}
      {showDate && (
        <p
          style={{
            fontSize: "0.875rem",
            opacity: 0.9,
            marginBottom: "0.5rem",
            fontWeight: 600,
          }}
        >
          {new Date(weather.date).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </p>
      )}

      {/* Weather Icon & Temp */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <span style={{ fontSize: "3rem" }}>
          {getWeatherEmoji(weather.icon)}
        </span>
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              lineHeight: 1,
              margin: 0,
            }}
          >
            {weather.temp}°
          </p>
          <p style={{ fontSize: "0.875rem", opacity: 0.9, margin: 0 }}>
            {weather.temp_min}° / {weather.temp_max}°
          </p>
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: "1rem",
          fontWeight: 600,
          marginBottom: "1rem",
          textTransform: "capitalize",
        }}
      >
        {getWeatherDescription(weather.description)}
      </p>

      {/* Details */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "0.5rem",
          fontSize: "0.875rem",
        }}
      >
        <div style={{ opacity: 0.9 }}>
          <span>💨 {weather.wind_speed} m/s</span>
        </div>
        <div style={{ opacity: 0.9 }}>
          <span>💧 {weather.humidity}%</span>
        </div>
        {weather.rain && weather.rain > 0 && (
          <div style={{ opacity: 0.9 }}>
            <span>🌧️ {weather.rain}mm</span>
          </div>
        )}
        {weather.snow && weather.snow > 0 && (
          <div style={{ opacity: 0.9 }}>
            <span>❄️ {weather.snow}mm</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;