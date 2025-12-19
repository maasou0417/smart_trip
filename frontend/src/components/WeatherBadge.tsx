import { getWeatherEmoji } from "../types/weather";
import type { WeatherData } from "../types/weather";

interface WeatherBadgeProps {
  weather: WeatherData;
  size?: "small" | "medium";
}

const WeatherBadge = ({ weather, size = "medium" }: WeatherBadgeProps) => {
  const isSmall = size === "small";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: isSmall ? "0.5rem" : "0.75rem",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: isSmall ? "0.5rem 1rem" : "0.75rem 1.25rem",
        borderRadius: "var(--radius-md)",
        fontSize: isSmall ? "0.875rem" : "1rem",
        fontWeight: 600,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <span style={{ fontSize: isSmall ? "1.5rem" : "2rem" }}>
        {getWeatherEmoji(weather.icon)}
      </span>
      <div>
        <div style={{ fontSize: isSmall ? "1.125rem" : "1.5rem", fontWeight: 700 }}>
          {weather.temp}°C
        </div>
        {!isSmall && (
          <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>
            {weather.temp_min}° / {weather.temp_max}°
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherBadge;