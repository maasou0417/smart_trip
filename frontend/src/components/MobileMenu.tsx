import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        style={{
          display: "none",
          background: "none",
          border: "none",
          fontSize: "1.5rem",
          cursor: "pointer",
          padding: "0.5rem",
        }}
        className="mobile-menu-button"
        aria-label="Toggle menu"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 998,
          }}
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`mobile-menu ${isOpen ? "open" : ""}`}
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? 0 : "-100%",
          width: "280px",
          height: "100vh",
          background: "var(--white)",
          boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.1)",
          zIndex: 999,
          transition: "right 0.3s ease",
          padding: "2rem 1.5rem",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h3 style={{ margin: 0 }}>Menu</h3>
          <button
            onClick={closeMenu}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Link
            to="/"
            onClick={closeMenu}
            style={{
              padding: "1rem",
              borderRadius: "var(--radius-sm)",
              textDecoration: "none",
              color: "var(--dark)",
              fontWeight: 500,
              transition: "background 0.2s",
            }}
            className="mobile-nav-link"
          >
            🏠 Home
          </Link>

          {user ? (
            <>
              <Link
                to="/trips"
                onClick={closeMenu}
                style={{
                  padding: "1rem",
                  borderRadius: "var(--radius-sm)",
                  textDecoration: "none",
                  color: "var(--dark)",
                  fontWeight: 500,
                }}
                className="mobile-nav-link"
              >
                ✈️ My Trips
              </Link>

              <div
                style={{
                  padding: "1rem",
                  background: "var(--light-gray)",
                  borderRadius: "var(--radius-sm)",
                  marginTop: "1rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--dark-gray)",
                    margin: 0,
                  }}
                >
                  Logged in as
                </p>
                <p
                  style={{
                    fontWeight: 600,
                    color: "var(--dark)",
                    margin: "0.25rem 0 0 0",
                  }}
                >
                  {user.name}
                </p>
              </div>

              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                style={{
                  padding: "1rem",
                  background: "var(--primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginTop: "1rem",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                style={{
                  padding: "1rem",
                  borderRadius: "var(--radius-sm)",
                  textDecoration: "none",
                  color: "var(--dark)",
                  fontWeight: 500,
                }}
                className="mobile-nav-link"
              >
                🔐 Login
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
                style={{
                  padding: "1rem",
                  background: "var(--gradient-warm)",
                  color: "white",
                  borderRadius: "var(--radius-sm)",
                  textDecoration: "none",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;