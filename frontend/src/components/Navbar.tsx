import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import mapIcon from "../assets/icons/SmartTrip Icon.jpg";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" aria-label="Smart Trip Home">
          <img 
        src={mapIcon} 
        alt="App Icon" 
        style={{ width: "70px", height: "70px" }}
        className="w-8 h-8 object-contain"
      />
          <h2>Smart Trip</h2>
        </Link>

        {/* Desktop NAv */ }
        
        <div className="nav-links desktop nav">
          {user ? (
            <>
              <Link to="/trips" 
               className="nav-link"
               aria-label="View my trips">
                My Trips
              </Link>
              <div className="nav-user">
                <span className="user-greeting" aria-label={`Logged in as ${user.name}`}>
                  Hi, {user.name}! 👋</span>
                <button
                 onClick={logout} 
                 className="btn-logout"
                 aria-label="Logout from account">
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

         {/* Mobile Menu */ }
         <MobileMenu/>
      </div>
    </nav>
  );
};

export default Navbar;