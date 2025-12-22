import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { tripsAPI, activitiesAPI } from "../api/api";
import type { TripWithActivities, Activity, ActivityFormData } from "../types";
import { ACTIVITY_CATEGORIES } from "../types";
import Loading from "../components/Loading";
import { useWeather } from "../hooks/useWeather";
import WeatherWidget from "../components/WeatherWidget";
import WeatherBadge from "../components/WeatherBadge";

const TripDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<TripWithActivities | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Loading states for individual actions
  const [deletingTrip, setDeletingTrip] = useState(false);
  const [togglingActivity, setTogglingActivity] = useState<number | null>(null);
  const [deletingActivity, setDeletingActivity] = useState<number | null>(null);

  useEffect(() => {
    loadTrip();
  }, [id]);

  const loadTrip = async () => {
    try {
      setError("");
      const data = await tripsAPI.getById(Number(id));
      setTrip(data);
    } catch (err: any) {
      console.error("Failed to load trip:", err);
      const errorMsg = err.response?.data?.error || "Failed to load trip details";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const tripDays = trip
    ? Math.ceil(
        (new Date(trip.end_date).getTime() -
          new Date(trip.start_date).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1
    : 0;

  // Fetch weather for trip destination
  const { weather, loading: weatherLoading, error: weatherError, refetch: refetchWeather, retrying } = useWeather(
    trip?.destination || "",
    tripDays
  );

  const handleDeleteTrip = async () => {
    if (!window.confirm("Are you sure you want to delete this trip? This will also delete all activities.")) return;
    
    setDeletingTrip(true);
    setError("");
    
    try {
      await tripsAPI.delete(Number(id));
      showSuccess("Trip deleted successfully");
      setTimeout(() => navigate("/trips"), 1000);
    } catch (err: any) {
      console.error("Delete trip error:", err);
      const errorMsg = err.response?.data?.error || "Failed to delete trip. Please try again.";
      setError(errorMsg);
    } finally {
      setDeletingTrip(false);
    }
  };

  const handleToggleComplete = async (activityId: number) => {
    setTogglingActivity(activityId);
    setError("");
    
    try {
      await activitiesAPI.toggleComplete(activityId);
      await loadTrip();
    } catch (err: any) {
      console.error("Toggle activity error:", err);
      const errorMsg = err.response?.data?.error || "Failed to update activity status";
      setError(errorMsg);
    } finally {
      setTogglingActivity(null);
    }
  };

  const handleDeleteActivity = async (activityId: number) => {
    if (!window.confirm("Delete this activity?")) return;
    
    setDeletingActivity(activityId);
    setError("");
    
    try {
      await activitiesAPI.delete(activityId);
      await loadTrip();
      showSuccess("Activity deleted successfully");
    } catch (err: any) {
      console.error("Delete activity error:", err);
      const errorMsg = err.response?.data?.error || "Failed to delete activity";
      setError(errorMsg);
    } finally {
      setDeletingActivity(null);
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setShowActivityForm(false);
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Loading state
  if (loading) return <Loading message="Loading trip details..." />;

  // Error state
  if (error && !trip) {
    return (
      <div className="error-container">
        <div className="error-icon">❌</div>
        <h2 className="error-title">Oops!</h2>
        <p className="error-message">{error}</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1.5rem" }}>
          <button onClick={loadTrip} className="btn-primary">
            Try Again
          </button>
          <Link to="/trips" className="btn-secondary">
            Back to Trips
          </Link>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="error-container">
        <div className="error-icon">🔍</div>
        <h2 className="error-title">Trip Not Found</h2>
        <p className="error-message">This trip doesn't exist or you don't have access to it.</p>
        <Link to="/trips" className="btn-primary">
          Back to Trips
        </Link>
      </div>
    );
  }

  const activitiesByDay = trip.activities.reduce((acc, activity) => {
    if (!acc[activity.day_number]) acc[activity.day_number] = [];
    acc[activity.day_number].push(activity);
    return acc;
  }, {} as Record<number, Activity[]>);

  const totalCost = trip.activities.reduce(
    (sum, a) => sum + Number(a.cost || 0),
    0
  );
  const completedActivities = trip.activities.filter((a) => a.completed).length;

  return (
    <div>
      {/* Success Message */}
      {successMessage && (
        <div className="success-container">
          <div className="success-content">
            <span className="success-icon">✅</span>
            <p className="success-message">{successMessage}</p>
          </div>
          <button
            className="success-close"
            onClick={() => setSuccessMessage("")}
          >
            ×
          </button>
        </div>
      )}

      {/* Error Message (for actions) */}
      {error && trip && (
        <div className="error-container" style={{ marginBottom: "1.5rem", padding: "1rem" }}>
          <p className="error-message" style={{ margin: 0 }}>⚠️ {error}</p>
          <button
            onClick={() => setError("")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.5rem",
              padding: "0.25rem",
              marginLeft: "1rem"
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>{trip.title}</h1>
          <p
            style={{
              fontSize: "1.125rem",
              color: "var(--dark-gray)",
              marginTop: "0.5rem",
            }}
          >
            📍 {trip.destination}
          </p>
          <p style={{ color: "var(--dark-gray)", marginTop: "0.25rem" }}>
            📅 {new Date(trip.start_date).toLocaleDateString()} -{" "}
            {new Date(trip.end_date).toLocaleDateString()} ({tripDays} days)
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={() => {
              setShowActivityForm(!showActivityForm);
              setEditingActivity(null);
            }}
            className="btn-primary"
            disabled={deletingTrip}
          >
            ➕ Add Activity
          </button>
          <button 
            onClick={handleDeleteTrip} 
            className="btn-secondary"
            disabled={deletingTrip}
          >
            {deletingTrip ? "Deleting..." : "🗑️ Delete Trip"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard icon="📝" value={trip.activities.length} label="Activities" />
        <StatCard
          icon="✅"
          value={`${completedActivities}/${trip.activities.length}`}
          label="Completed"
        />
        <StatCard
          icon="💰"
          value={`€${totalCost.toFixed(2)}`}
          label="Total Cost"
          color="var(--primary)"
        />
      </div>

      {/* Weather Widget */}
      {trip && (
        <div style={{ marginBottom: "2rem" }}>
          {weatherError ? (
            <div
              style={{
                background: "#FFF3CD",
                border: "1px solid #FFC107",
                padding: "1rem",
                borderRadius: "var(--radius-md)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ margin: 0, color: "var(--dark)", fontWeight: 600 }}>
                  🌤️ {weatherError}
                </p>
                <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem", color: "var(--dark-gray)" }}>
                  Trip planning works without weather data
                </p>
              </div>
              <button
                onClick={refetchWeather}
                disabled={retrying}
                className="btn-secondary"
                style={{ padding: "0.5rem 1rem" }}
              >
                {retrying ? "Retrying..." : "Retry"}
              </button>
            </div>
          ) : weatherLoading ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--dark-gray)" }}>
              <p>Loading weather forecast...</p>
            </div>
          ) : (
            <WeatherWidget
              destination={trip.destination}
              days={tripDays}
              title={`Weather Forecast for ${trip.destination}`}
            />
          )}
        </div>
      )}

      {/* Add Form */}
      {showActivityForm && (
        <ActivityFormWrapper
          tripId={trip.id}
          maxDays={tripDays}
          onSuccess={async (data: ActivityFormData) => {
            try {
              await activitiesAPI.create(data);
              await loadTrip();
              setShowActivityForm(false);
              showSuccess("Activity added! 🎉");
            } catch (err: any) {
              throw err; // Let form handle the error
            }
          }}
          onCancel={() => setShowActivityForm(false)}
        />
      )}

      {/* Edit Form */}
      {editingActivity && (
        <ActivityFormWrapper
          tripId={trip.id}
          maxDays={tripDays}
          activity={editingActivity}
          onSuccess={async (data: Partial<ActivityFormData>) => {
            try {
              await activitiesAPI.update(editingActivity.id, data);
              await loadTrip();
              setEditingActivity(null);
              showSuccess("Activity updated! ✅");
            } catch (err: any) {
              throw err; // Let form handle the error
            }
          }}
          onCancel={() => setEditingActivity(null)}
        />
      )}

      {/* Activities */}
      {trip.activities.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3 className="empty-state-title">No activities yet</h3>
          <p className="empty-state-message">Start planning your perfect trip!</p>
          <button
            onClick={() => setShowActivityForm(true)}
            className="btn-primary"
          >
            Add Your First Activity
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {Array.from({ length: tripDays }, (_, i) => i + 1).map((day) => {
            const dayActivities = activitiesByDay[day] || [];
            const dayCost = dayActivities.reduce(
              (sum, a) => sum + Number(a.cost || 0),
              0
            );
            
            // Get weather for this day
            const dayWeather = weather?.forecast[day - 1];

            return (
              <DaySection
                key={day}
                day={day}
                activities={dayActivities}
                dayCost={dayCost}
                weather={dayWeather}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditActivity}
                onDelete={handleDeleteActivity}
                togglingActivity={togglingActivity}
                deletingActivity={deletingActivity}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// Helper Components
const StatCard = ({ icon, value, label, color }: any) => (
  <div
    style={{
      background: "var(--white)",
      padding: "1.5rem",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-sm)",
      textAlign: "center",
    }}
  >
    <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{icon}</p>
    <p
      style={{
        fontSize: "1.5rem",
        fontWeight: 700,
        color: color || "var(--dark)",
      }}
    >
      {value}
    </p>
    <p style={{ color: "var(--dark-gray)" }}>{label}</p>
  </div>
);

const DaySection = ({
  day,
  activities,
  dayCost,
  weather,
  onToggleComplete,
  onEdit,
  onDelete,
  togglingActivity,
  deletingActivity,
}: any) => (
  <div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1rem",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <h2 style={{ color: "var(--dark)", margin: 0 }}>Day {day}</h2>
        {weather && <WeatherBadge weather={weather} size="small" />}
      </div>

      {dayCost > 0 && (
        <span
          style={{
            background: "var(--light-gray)",
            padding: "0.5rem 1rem",
            borderRadius: "var(--radius-sm)",
            fontWeight: 600,
            color: "var(--primary)",
          }}
        >
          Day Total: €{dayCost.toFixed(2)}
        </span>
      )}
    </div>

    {activities.length > 0 ? (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {activities.map((activity: Activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
            isToggling={togglingActivity === activity.id}
            isDeleting={deletingActivity === activity.id}
          />
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
);

const ActivityCard = ({
  activity,
  onToggleComplete,
  onEdit,
  onDelete,
  isToggling,
  isDeleting,
}: any) => {
  const getCategoryInfo = () => {
    return (
      ACTIVITY_CATEGORIES.find((c) => c.value === activity.category) || {
        icon: "📌",
        label: "Other",
      }
    );
  };

  const categoryInfo = getCategoryInfo();

  return (
    <div
      className={`activity-card ${activity.completed ? "completed" : ""}`}
      style={{
        opacity: activity.completed ? 0.7 : 1,
        borderLeftColor: activity.completed ? "#4CAF50" : "var(--primary)",
      }}
    >
      <div className="activity-card-header">
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span className="activity-day-badge">Day {activity.day_number}</span>
          {activity.category && (
            <span
              style={{
                background: "var(--light-gray)",
                padding: "0.25rem 0.5rem",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.875rem",
              }}
            >
              {categoryInfo.icon} {categoryInfo.label}
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {activity.time && (
            <span className="activity-time">🕐 {activity.time}</span>
          )}
          {Number(activity.cost) > 0 && (
            <span
              style={{
                color: "var(--primary)",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              €{Number(activity.cost).toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <div className="activity-card-body">
        <h3
          className="activity-title"
          style={{
            textDecoration: activity.completed ? "line-through" : "none",
          }}
        >
          {activity.title}
        </h3>

        {activity.location && (
          <p
            style={{
              color: "var(--dark-gray)",
              fontSize: "0.9rem",
              marginBottom: "0.5rem",
            }}
          >
            📍 {activity.location}
          </p>
        )}

        {activity.description && (
          <p className="activity-description">{activity.description}</p>
        )}

        {activity.notes && (
          <div
            style={{
              background: "#FFF9E6",
              padding: "0.75rem",
              borderRadius: "var(--radius-sm)",
              marginTop: "0.75rem",
              borderLeft: "3px solid #FFC107",
            }}
          >
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--dark)",
                margin: 0,
              }}
            >
              📝 <strong>Note:</strong> {activity.notes}
            </p>
          </div>
        )}
      </div>

      <div className="activity-card-actions">
        <button
          className="btn-icon"
          onClick={() => onToggleComplete(activity.id)}
          title={activity.completed ? "Mark incomplete" : "Mark complete"}
          disabled={isToggling || isDeleting}
          style={{
            color: activity.completed ? "#4CAF50" : "var(--dark-gray)",
          }}
        >
          {isToggling ? "⏳" : activity.completed ? "✅" : "⭕"}
        </button>
        <button
          className="btn-icon btn-edit"
          onClick={() => onEdit(activity)}
          title="Edit activity"
          disabled={isToggling || isDeleting}
        >
          ✏️
        </button>
        <button
          className="btn-icon btn-delete"
          onClick={() => onDelete(activity.id)}
          title="Delete activity"
          disabled={isToggling || isDeleting}
        >
          {isDeleting ? "⏳" : "🗑️"}
        </button>
      </div>
    </div>
  );
};

const ActivityFormWrapper = ({
  tripId,
  maxDays,
  activity,
  onSuccess,
  onCancel,
}: any) => {
  const [formData, setFormData] = useState({
    trip_id: tripId,
    day_number: activity?.day_number || 1,
    title: activity?.title || "",
    description: activity?.description || "",
    time: activity?.time || "",
    category: activity?.category || "",
    location: activity?.location || "",
    cost: activity?.cost || "",
    notes: activity?.notes || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "cost"
          ? value
            ? parseFloat(value)
            : ""
          : name === "day_number"
          ? parseInt(value)
          : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    
    if (formData.day_number < 1 || formData.day_number > maxDays) {
      setError(`Day must be between 1 and ${maxDays}`);
      return;
    }
    
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        cost: formData.cost || undefined,
        category: formData.category || undefined,
        location: formData.location || undefined,
        description: formData.description || undefined,
        time: formData.time || undefined,
        notes: formData.notes || undefined,
      };
      await onSuccess(submitData);
    } catch (err: any) {
      console.error("Form submission error:", err);
      const errorMsg = err.response?.data?.error || "Failed to save activity. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ marginBottom: "2rem" }}>
      <h2>{activity ? "✏️ Edit Activity" : "➕ Add Activity"}</h2>
      {error && (
        <div 
          className="error-message" 
          style={{ 
            background: "#FFE5E5", 
            color: "#C62828", 
            padding: "1rem", 
            borderRadius: "var(--radius-sm)",
            marginBottom: "1rem"
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="activity-form">
        <div className="form-row">
          <div className="form-group">
            <label>
              Day * (1-{maxDays})
            </label>
            <input
              type="number"
              name="day_number"
              min="1"
              max={maxDays}
              value={formData.day_number}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Visit Eiffel Tower"
            required
            disabled={loading}
            maxLength={200}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select category</option>
            {ACTIVITY_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Champ de Mars, Paris"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label>Cost (€)</label>
            <input
              type="number"
              name="cost"
              min="0"
              step="0.01"
              value={formData.cost}
              onChange={handleChange}
              placeholder="0.00"
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Details about this activity..."
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Booking info, tips, reminders..."
            style={{ minHeight: "80px" }}
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : activity ? "Update Activity" : "Add Activity"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripDetailsPage;