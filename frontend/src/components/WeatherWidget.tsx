import { useWeather } from "../hooks/useWeather";
import WeatherCard from "./WeatherCard";

interface WeatherWidgetProps {
  destination: string;
  days: number;
  title?: string;
}

const WeatherWidget = ({ destination, days, title }: WeatherWidgetProps) => {
  const { weather, loading, error, refetch, retrying } = useWeather(
    destination,
    days
  );

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          background: "var(--white)",
          padding: "2rem",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-md)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            width: "40px",
            height: "40px",
            border: "4px solid var(--light-gray)",
            borderTop: "4px solid var(--primary)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ marginTop: "1rem", color: "var(--dark-gray)" }}>
          Loading weather forecast...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        style={{
          background: "#FFF3CD",
          border: "2px solid #FFC107",
          padding: "1.5rem",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ flex: 1 }}>
          <p
            style={{
              margin: 0,
              color: "var(--dark)",
              fontWeight: 600,
              marginBottom: "0.5rem",
            }}
          >
            🌤️ {error}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "0.875rem",
              color: "var(--dark-gray)",
            }}
          >
            Your trip planning works fine without weather data. You can try again later.
          </p>
        </div>
        <button
          onClick={refetch}
          disabled={retrying}
          className="btn-secondary"
          style={{ padding: "0.5rem 1rem", whiteSpace: "nowrap" }}
        >
          {retrying ? "Retrying..." : "Try Again"}
        </button>
      </div>
    );
  }

  // No weather data
  if (!weather || !weather.forecast || weather.forecast.length === 0) {
    return (
      <div
        style={{
          background: "var(--light-gray)",
          padding: "1.5rem",
          borderRadius: "var(--radius-lg)",
          textAlign: "center",
          color: "var(--dark-gray)",
        }}
      >
        <p>Weather data not available for this destination</p>
      </div>
    );
  }

  const availableDays = weather.forecast.length;
  const showLimitNotice = days > 5 && availableDays <= 5;

  return (
    <div
      style={{
        background: "var(--white)",
        padding: "1.5rem",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ margin: 0, marginBottom: "0.5rem" }}>
          {title || `Weather Forecast for ${weather.city}`}
        </h2>
        <p
          style={{
            margin: 0,
            color: "var(--dark-gray)",
            fontSize: "0.875rem",
          }}
        >
          📍 {weather.city}, {weather.country}
        </p>

        {/* Show notice if trip is longer than available forecast */}
        {showLimitNotice && (
          <div
            style={{
              marginTop: "1rem",
              background: "#E3F2FD",
              border: "1px solid #2196F3",
              padding: "0.75rem",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.875rem",
              color: "#1565C0",
            }}
          >
            <strong>ℹ️ Note:</strong> Your trip is {days} days, but weather forecasts
            are only available for the first {availableDays} days (free weather
            service limit).
          </div>
        )}
      </div>

      {/* Weather Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {weather.forecast.map((day, index) => (
          <div key={day.date}>
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--dark-gray)",
                marginBottom: "0.5rem",
                textAlign: "center",
              }}
            >
              Day {index + 1}
            </p>
            <WeatherCard weather={day} showDate={true} />
          </div>
        ))}
      </div>

      {/* Helpful message for longer trips */}
      {showLimitNotice && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "var(--light-gray)",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.875rem",
            color: "var(--dark-gray)",
            textAlign: "center",
          }}
        >
          💡 <strong>Tip:</strong> Check the weather again closer to your trip
          dates for days {availableDays + 1}-{days}
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;