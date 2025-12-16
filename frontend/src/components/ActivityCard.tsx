import { useState } from "react";
import type { Activity } from "../types";
import { ACTIVITY_CATEGORIES } from "../types";

interface ActivityCardProps {
  activity: Activity;
  onToggleComplete: (id: number) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (id: number) => void;
}

const ActivityCard = ({
  activity,
  onToggleComplete,
  onEdit,
  onDelete,
}: ActivityCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const getCategoryInfo = () => {
    return ACTIVITY_CATEGORIES.find((c) => c.value === activity.category) || {
      icon: "📌",
      label: "Other",
    };
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      setIsDeleting(true);
      onDelete(activity.id);
    }
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
      {/* Header */}
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
            <span className="activity-time">
              <span className="time-icon">🕐</span>
              {activity.time}
            </span>
          )}
          {activity.cost && activity.cost > 0 && (
            <span
              style={{
                color: "var(--primary)",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              €{activity.cost.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
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

      {/* Actions */}
      <div className="activity-card-actions">
        <button
          className="btn-icon"
          onClick={() => onToggleComplete(activity.id)}
          title={activity.completed ? "Mark as incomplete" : "Mark as complete"}
          style={{
            color: activity.completed ? "#4CAF50" : "var(--dark-gray)",
          }}
        >
          {activity.completed ? "✅" : "⭕"}
        </button>
        <button
          className="btn-icon btn-edit"
          onClick={() => onEdit(activity)}
          title="Edit activity"
        >
          ✏️
        </button>
        <button
          className="btn-icon btn-delete"
          onClick={handleDelete}
          title="Delete activity"
          disabled={isDeleting}
        >
          {isDeleting ? "⏳" : "🗑️"}
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;