import { useState, type FormEvent } from "react";
import type { ActivityFormData } from "../types";
import { ACTIVITY_CATEGORIES } from "../types";

interface ActivityFormProps {
  tripId: number;
  maxDays: number;
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: Partial<ActivityFormData>;
  isEdit?: boolean;
}

const ActivityForm = ({
  tripId,
  maxDays,
  onSuccess,
  onCancel,
  initialData,
  isEdit = false,
}: ActivityFormProps) => {
  const [formData, setFormData] = useState<ActivityFormData>({
    trip_id: tripId,
    day_number: initialData?.day_number || 1,
    title: initialData?.title || "",
    description: initialData?.description || "",
    time: initialData?.time || "",
    category: initialData?.category || undefined,
    location: initialData?.location || "",
    cost: initialData?.cost || undefined,
    notes: initialData?.notes || "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (formData.day_number < 1 || formData.day_number > maxDays) {
      setError(`Day number must be between 1 and ${maxDays}`);
      return;
    }

    setLoading(true);

    try {
      // We'll implement the API call in the parent component
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save activity");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => {

    const { name, value } = e.target;

    if (name === "cost") {
      setFormData({
        ...formData,
        [name]: value ? parseFloat(value) : undefined,
      });
    } else if (name === "day_number") {
      setFormData({
        ...formData,
        [name]: parseInt(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  return (
    <div className="form-container" style={{ marginBottom: "2rem" }}>
      <h2>{isEdit ? "✏️ Edit Activity" : "➕ Add Activity"}</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="activity-form">
        {/* Day Number & Time */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="day_number">
              Day Number * (1-{maxDays})
            </label>
            <input
              type="number"
              id="day_number"
              name="day_number"
              min="1"
              max={maxDays}
              value={formData.day_number}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Activity Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Visit Eiffel Tower"
            disabled={loading}
            required
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category || ""}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Select a category</option>
            {ACTIVITY_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Location & Cost */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Champ de Mars, Paris"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cost">Cost (€)</label>
            <input
              type="number"
              id="cost"
              name="cost"
              min="0"
              step="0.01"
              value={formData.cost || ""}
              onChange={handleChange}
              placeholder="0.00"
              disabled={loading}
            />
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add details about this activity..."
            disabled={loading}
          />
        </div>

        {/* Notes */}
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Booking info, tips, reminders..."
            disabled={loading}
            style={{ minHeight: "80px" }}
          />
        </div>

        {/* Buttons */}
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
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="inline-loader">⏳</span>
                {isEdit ? "Updating..." : "Adding..."}
              </span>
            ) : isEdit ? (
              "Update Activity"
            ) : (
              "Add Activity"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;