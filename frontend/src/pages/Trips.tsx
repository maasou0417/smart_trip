import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Trip } from "../types";
import { tripsAPI } from "../api/api";
import Loading from "../components/Loading";

const TripsPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const data = await tripsAPI.getAll();
      setTrips(data);
    } catch (err) {
      setError("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading your trips..." />;

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">❌</div>
        <h2 className="error-title">Something went wrong</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>My Trips ✈️</h1>
        <Link to="/trips/new" className="btn-primary">
          ➕ Create New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🗺️</div>
          <h3 className="empty-state-title">No trips yet</h3>
          <p className="empty-state-message">
            Start planning your next adventure by creating your first trip!
          </p>
          <Link to="/trips/new" className="btn-primary" style={{ marginTop: "1rem" }}>
            Create Your First Trip
          </Link>
        </div>
      ) : (
        <div className="trips-grid">
          {trips.map((trip) => (
            <Link to={`/trips/${trip.id}`} key={trip.id} className="trip-card-link">
              <div className="trip-card">
                <div className="trip-card-body">
                  <h3 className="trip-card-title">{trip.title}</h3>
                  <div className="trip-card-info">
                    <div className="trip-info-item">
                      <span className="info-icon">📍</span>
                      {trip.destination}
                    </div>
                    <div className="trip-info-item">
                      <span className="info-icon">📅</span>
                      {new Date(trip.start_date).toLocaleDateString()} -{" "}
                      {new Date(trip.end_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="trip-card-footer">
                  <span className="trip-card-cta">View Details →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripsPage;