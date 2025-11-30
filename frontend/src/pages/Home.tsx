import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="home-hero">
      <h1>Plan Your Perfect Trip ✈️</h1>
      <p>
        Organize your adventures with ease. Create itineraries, track activities,
        and make every journey unforgettable with Smart Trip.
      </p>
      {user ? (
        <Link to="/trips" className="btn-primary">
          View My Trips
        </Link>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <Link to="/register" className="btn-primary">
            Get Started
          </Link>
          <Link to="/login" className="btn-secondary">
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;