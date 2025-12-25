import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import TripsPage from "./pages/Trips";
import CreateTripPage from "./pages/CreateTrip";
import TripDetailsPage from "./pages/TripDetails";
import type { JSX } from "react";
import "./index.css";
import SkipLink from "./components/SkipLink";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="page-loader">
        <div className="loading-spinner loading-spinner-large">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  return children;
};

// AppContent must be inside AuthProvider
const AppContent = () => {
  return (
    <div className="app">
      <SkipLink />

      <header role="banner">
        <Navbar />
      </header>

      <main
        id="main-content"
        role="main"
        tabIndex={-1}
        style={{ outline: "none" }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/trips"
            element={
              <ProtectedRoute>
                <TripsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trips/new"
            element={
              <ProtectedRoute>
                <CreateTripPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trips/:id"
            element={
              <ProtectedRoute>
                <TripDetailsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* ✅ FOOTER */}
      <footer
        role="contentinfo"
        style={{
          background: "var(--dark)",
          color: "var(--white)",
          padding: "2rem 1rem",
          marginTop: "4rem",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p style={{ marginBottom: "1rem", fontSize: "0.95rem" }}>
            © 2024 Smart Trip. All rights reserved.
          </p>

          <nav aria-label="Footer navigation">
            <a
              href="#privacy"
              style={{
                color: "var(--primary-light)",
                margin: "0 1rem",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              Privacy Policy
            </a>

            <a
              href="#terms"
              style={{
                color: "var(--primary-light)",
                margin: "0 1rem",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              Terms of Service
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
