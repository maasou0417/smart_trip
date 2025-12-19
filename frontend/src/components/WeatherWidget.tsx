import { useWeather } from "../hooks/useWeather";
import WeatherCard from "./WeatherCard";
import type { WeatherData } from "../types/weather";

interface WeatherWidgetProps {
  destination: string;
  days?: number;
  title?: string;
}

const WeatherWidget = ({
  destination,
  days = 5,
  title = "Weather Forecast",
}: WeatherWidgetProps) => {
  const { weather, loading, error, refetch } = useWeather(destination, days);

  if (loading) {
    return (
      <div
        style={{
          background: "var(--white)",
          padding: "2rem",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <h3 style={{ marginBottom: "1rem", color: "var(--dark)" }}>
          {title} 🌤️
        </h3>
        <div className="loading-spinner loading-spinner-medium">
          <div className="spinner"></div>
        </div>
        <p style={{ textAlign: "center", color: "var(--dark-gray)" }}>
          Loading weather data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: "var(--white)",
          padding: "2rem",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <h3 style={{ marginBottom: "1rem", color: "var(--dark)" }}>
          {title} 🌤️
        </h3>
        <div
          style={{
            background: "#FFF3E0",
            padding: "1rem",
            borderRadius: "var(--radius-sm)",
            borderLeft: "4px solid #FF9800",
          }}
        >
          <p style={{ color: "#E65100", margin: 0, fontSize: "0.95rem" }}>
            ℹ️ {error}
          </p>
        </div>
        <button
          onClick={refetch}
          className="btn-secondary"
          style={{ marginTop: "1rem", width: "100%" }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!weather || weather.forecast.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        background: "var(--white)",
        padding: "2rem",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h3 style={{ color: "var(--dark)", margin: 0 }}>
          {title} 🌤️
        </h3>
        <p style={{ color: "var(--dark-gray)", fontSize: "0.95rem", margin: 0 }}>
          {weather.city}, {weather.country}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {weather.forecast.map((day: WeatherData) => (
          <WeatherCard key={day.date} weather={day} />
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget;