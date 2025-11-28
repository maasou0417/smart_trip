import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import TripsPage from "./pages/Trips";
import type { JSX } from "react";
import "./index.css"

// Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

// NavLinks must be inside AuthProvider
const NavLinks = () => {
  const { user, logout } = useAuth();
  return (
    <div className="nav-links">
      <Link to="/">Home</Link>
      {user ? (
        <>
          <Link to="/trips">My Trips</Link>
          <button onClick={logout}>Logout</button>
          <span>Hi, {user.name}!</span>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </div>
  );
};

// AppContent must be inside AuthProvider to use hooks
const AppContent = () => {
  return (
    <div className="app">
      <nav>
        <h2>Smart Trip</h2>
        <NavLinks />
      </nav>
      <main>
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
        </Routes>
      </main>
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