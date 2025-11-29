import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { tripsAPI, activitiesAPI } from "../api/api";
import type { TripWithActivities, Activity } from "../types";

const TripDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<TripWithActivities | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showActivityForm, setShowActivityForm] = useState(false);

  useEffect(() => {
    loadTrip();
  }, [id]);

  const loadTrip = async () => {
    try {
      const data = await tripsAPI.getById(Number(id));
      setTrip(data);
    } catch (err) {
      setError("Failed to load trip");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async () => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      await tripsAPI.delete(Number(id));
      navigate("/trips");
    } catch (err) {
      setError("Failed to delete trip");
    }
  };

  const handleDeleteActivity = async (activityId: number) => {
    if (!window.confirm("Delete this activity?")) return;

    try {
      await activitiesAPI.delete(activityId);
      loadTrip(); // Reload trip
    } catch (err) {
      setError("Failed to delete activity");
    }
  };

  if (loading) {
    return (
      <div className="page-loader">
        <div className="loading-spinner loading-spinner-large">
          <div className="spinner"></div>
        </div>
        <p className="loader-message">Loading trip...</p>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="error-container">
        <div className="error-icon">❌</div>
        <h2 className="error-title">Oops!</h2>
        <p className="error-message">{error || "Trip not found"}</p>
        <Link to="/trips" className="btn-primary">
          Back to Trips
        </Link>
      </div>
    );
  }

  // Group activities by day
  const activitiesByDay = trip.activities.reduce((acc, activity) => {
    if (!acc[activity.day_number]) {
      acc[activity.day_number] = [];
    }
    acc[activity.day_number].push(activity);
    return acc;
  }, {} as Record<number, Activity[]>);

  const tripDays = Math.ceil(
    (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) /
      (1000 * 60 * 60 * 24)
  ) + 1;

  return (
    <div>
      {/* Trip Header */}
      <div className="page-header">
        <div>
          <h1>{trip.title}</h1>
          <p style={{ fontSize: "1.125rem", color: "var(--dark-gray)" }}>
            📍 {trip.destination}
          </p>
          <p style={{ color: "var(--dark-gray)" }}>
            📅 {new Date(trip.start_date).toLocaleDateString()} -{" "}
            {new Date(trip.end_date).toLocaleDateString()}
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={() => setShowActivityForm(!showActivityForm)}
            className="btn-primary"
          >
            ➕ Add Activity
          </button>
          <button onClick={handleDeleteTrip} className="btn-secondary">
            🗑️ Delete Trip
          </button>
        </div>
      </div>

      {/* Add Activity Form */}
      {showActivityForm && (
        <AddActivityForm
          tripId={trip.id}
          onSuccess={() => {
            setShowActivityForm(false);
            loadTrip();
          }}
          onCancel={() => setShowActivityForm(false)}
        />
      )}

      {/* Activities by Day */}
      {tripDays === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3 className="empty-state-title">No activities yet</h3>
          <p className="empty-state-message">
            Start planning your trip by adding activities!
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {Array.from({ length: tripDays }, (_, i) => i + 1).map((day) => (
            <div key={day}>
              <h2 style={{ marginBottom: "1rem", color: "var(--dark)" }}>
                Day {day}
              </h2>
              {activitiesByDay[day] && activitiesByDay[day].length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {activitiesByDay[day].map((activity) => (
                    <div key={activity.id} className="activity-card">
                      <div className="activity-card-header">
                        <span className="activity-day-badge">Day {activity.day_number}</span>
                        {activity.time && (
                          <span className="activity-time">
                            <span className="time-icon">🕐</span>
                            {activity.time}
                          </span>
                        )}
                      </div>
                      <div className="activity-card-body">
                        <h3 className="activity-title">{activity.title}</h3>
                        {activity.description && (
                          <p className="activity-description">{activity.description}</p>
                        )}
                      </div>
                      <div className="activity-card-actions">
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDeleteActivity(activity.id)}
                          title="Delete activity"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    background: "var(--light-gray)",
                    padding: "2rem",
                    borderRadius: "var(--radius-md)",
                    textAlign: "center",
                    color: "var(--dark-gray)",
                  }}
                >
                  No activities planned for this day
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Add Activity Form Component
const AddActivityForm = ({
  tripId,
  onSuccess,
  onCancel,
}: {
  tripId: number;
  onSuccess: () => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    trip_id: tripId,
    day_number: 1,
    title: "",
    description: "",
    time: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await activitiesAPI.create(formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create activity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ marginBottom: "2rem" }}>
      <h2>Add Activity</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="activity-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="day_number">Day Number *</label>
            <input
              type="number"
              id="day_number"
              min="1"
              value={formData.day_number}
              onChange={(e) =>
                setFormData({ ...formData, day_number: Number(e.target.value) })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="title">Activity Title *</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Visit Eiffel Tower"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Add details about this activity..."
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Adding..." : "Add Activity"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripDetailsPage;