import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Trip } from "../types";
import { tripsAPI } from "../api/api";

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

  if (loading) return <p>Loading trips...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h1>My Trips</h1>
      <Link to="/trips/new">
        <button>Create New Trip</button>
      </Link>
      {trips.length === 0 ? (
        <p>No trips yet. Create your first trip!</p>
      ) : (
        <div className="trips-grid">
          {trips.map((trip) => (
            <Link to={`/trips/${trip.id}`} key={trip.id}>
              <div className="trip-card">
                <h3>{trip.title}</h3>
                <p>📍 {trip.destination}</p>
                <p>
                  📅 {new Date(trip.start_date).toLocaleDateString()} -{" "}
                  {new Date(trip.end_date).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripsPage;