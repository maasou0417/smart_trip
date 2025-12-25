import { useState, type FormEvent, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { validateEmail } from "../utils/validation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/trips");
    }
  }, [user, navigate]);

  const handleEmailBlur = () => {
    const validation = validateEmail(email);
    setFieldErrors((prev) => ({
      ...prev,
      email: validation.isValid ? "" : validation.error || "",
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({ email: "", password: "" });

    // Validate
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setFieldErrors((prev) => ({
        ...prev,
        email: emailValidation.error || "",
      }));
      return;
    }

    if (!password) {
      setFieldErrors((prev) => ({
        ...prev,
        password: "Password is required",
      }));
      return;
    }

    setLoading(true);

    try {
      await login({ email, password });
      navigate("/trips");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Login failed. Please try again.";
      setError(errorMessage);

      // Check for rate limit error
      if (errorMessage.includes("Too many")) {
        setError(
          "Too many login attempts. Please wait 15 minutes and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Welcome Back! 👋</h1>
      <p
        style={{
          textAlign: "center",
          color: "var(--dark-gray)",
          marginBottom: "2rem",
        }}
      >
        Login to continue planning your trips
      </p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} aria-label="Login form">
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((prev) => ({ ...prev, email: "" }));
            }}
            onBlur={handleEmailBlur}
            placeholder="your@email.com"
            disabled={loading}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            aria-required="true"
            autoComplete="email"
            style={{
              borderColor: fieldErrors.email
                ? "#D32F2F"
                : "var(--light-gray)",
            }}
            required
          />
          {fieldErrors.email && (
            <p
            id="email-error"
            role="alert"
            aria-live="polite"
              style={{
                color: "#D32F2F",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
              }}
            >
              {fieldErrors.email}
            </p>
          )}
        </div>
<div>
  <label htmlFor="password">Password</label>

  <div
    style={{
      position: "relative",
      width: "100%",          // container matches input width only
      display: "inline-block" // prevents stretching
    }}
  >
    <input
      type={showPassword ? "text" : "password"}
      id="password"
      value={password}
      onChange={(e) => {
        setPassword(e.target.value);
        setFieldErrors((prev) => ({ ...prev, password: "" }));
      }}
      placeholder="Enter your password"
      disabled={loading}
      aria-invalid={!!fieldErrors.password}
      aria-describedby={fieldErrors.password ? "password-error" : undefined}
      aria-required="true"
      autoComplete="current-password"
      style={{
        width: "100%",                       // match container exactly
        borderColor: fieldErrors.password ? "#D32F2F" : "var(--light-gray)",
        paddingRight: "2.5rem",              // space for eye icon
        boxSizing: "border-box",             // prevents overflow
      }}
      required
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? "Hide password" : "ShowPassword"}
      aria-pressed={showPassword}
      style={{
        position: "absolute",
        right: "0.75rem",
        top: "20%",
        transform: "translateY(-45%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "1.25rem",
        padding: 0,
        height: "1.25rem",
        width: "1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      disabled={loading}
    >
      <span aria-hidden="true">{showPassword ? "🙈" : "👁️"}</span>
    </button>
  </div>

  {fieldErrors.password && (
    <p 
    id="password-error"
    role="alert"
    aria-live="polite"
    style={{
     color: "#D32F2F", 
    fontSize: "0.875rem",
     marginTop: "0.25rem" }}>
      {fieldErrors.password}
    </p>
  )}
</div>


        <button
         type="submit" 
         disabled={loading}
         aria-busy={loading}
         >
          {loading ? (
            <span style={{ display: "flex", 
            alignItems: "center",
             gap: "0.5rem",
              justifyContent: "center" }}>
              <span className="inline-loader" aria-hidden="true">⏳</span>
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>
      </form>

      <p>
        Don't have an account?{" "}
        <Link to="/register">Create one here</Link>
      </p>
    </div>
  );
};

export default LoginPage;