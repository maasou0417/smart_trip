import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { tripsAPI } from "../api/api";
import type { TripFormData } from "../types";

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
        </div>

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