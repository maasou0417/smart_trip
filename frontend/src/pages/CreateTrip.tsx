import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { tripsAPI } from "../api/api";
import { useCurrentWeather } from "../hooks/useWeather";
import type { TripFormData } from "../types";
import WeatherCard from "../components/WeatherCard";

const CreateTripPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TripFormData>({
    title: "",
    destination: "",
    start_date: "",
    end_date: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch weather preview when destination is entered
  const { weather, loading: weatherLoading } = useCurrentWeather(
    showPreview && formData.destination ? formData.destination : ""
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const newTrip = await tripsAPI.create(formData);
      navigate(`/trips/${newTrip.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="form-container">
      <h1>✈️ Plan New Trip</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="trip-form">
        <div className="form-group">
          <label htmlFor="title">Trip Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Summer in Paris"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="destination">Destination *</label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="e.g., Paris, France"
            required
          />
          {formData.destination && (
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              style={{
                marginTop: "0.5rem",
                fontSize: "0.875rem",
                padding: "0.5rem 1rem",
                background: "var(--light-gray)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                color: "var(--dark)",
                fontWeight: 600,
              }}
            >
              {showPreview ? "🙈 Hide" : "👁️ Preview"} Weather
            </button>
          )}
        </div>

        {/* Weather Preview */}
        {showPreview && formData.destination && (
          <div style={{ marginBottom: "1.5rem" }}>
            {weatherLoading ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  background: "var(--light-gray)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div className="loading-spinner loading-spinner-medium">
                  <div className="spinner"></div>
                </div>
                <p style={{ marginTop: "1rem", color: "var(--dark-gray)" }}>
                  Loading weather...
                </p>
              </div>
            ) : weather ? (
              <div>
                <h3 style={{ marginBottom: "1rem", color: "var(--dark)" }}>
                  Current Weather Preview 🌤️
                </h3>
                <WeatherCard weather={weather} showDate={false} />
              </div>
            ) : (
              <div
                style={{
                  background: "#FFF3E0",
                  padding: "1rem",
                  borderRadius: "var(--radius-sm)",
                  borderLeft: "4px solid #FF9800",
                }}
              >
                <p style={{ color: "#E65100", margin: 0 }}>
                  ℹ️ Weather data not available for this destination
                </p>
              </div>
            )}
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="start_date">Start Date *</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="end_date">End Date *</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/trips")}
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Trip"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTripPage;