import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🗺️</span>
          <h2>Smart Trip</h2>
        </Link>

        <div className="nav-links">
          {user ? (
            <>
              <Link to="/trips" className="nav-link">
                My Trips
              </Link>
              <div className="nav-user">
                <span className="user-greeting">Hi, {user.name}! 👋</span>
                <button onClick={logout} className="btn-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="btn-register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;