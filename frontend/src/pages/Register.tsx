import { useState, type FormEvent, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "../utils/validation";
import PasswordStrength from "../components/PasswordStrength";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { register, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/trips");
    }
  }, [user, navigate]);

  /*

  const handleNameBlur = () => {
    const validation = validateName(name);
    setFieldErrors((prev) => ({
      ...prev,
      name: validation.isValid ? "" : validation.error || "",
    }));
  };

  const handleEmailBlur = () => {
    const validation = validateEmail(email);
    setFieldErrors((prev) => ({
      ...prev,
      email: validation.isValid ? "" : validation.error || "",
    }));
  };

  const handlePasswordBlur = () => {
    const validation = validatePassword(password);
    setFieldErrors((prev) => ({
      ...prev,
      password: validation.isValid ? "" : validation.error || "",
    }));
  };


  */
 
  const handleConfirmPasswordBlur = () => {
    if (confirmPassword && password !== confirmPassword) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setFieldErrors((prev) => ({
        ...prev,
        confirmPassword: "",
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    const errors = {
      name: nameValidation.isValid ? "" : nameValidation.error || "",
      email: emailValidation.isValid ? "" : emailValidation.error || "",
      password: passwordValidation.isValid
        ? ""
        : passwordValidation.error || "",
      confirmPassword: "",
    };

    // Check password match
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);

    // If any errors, stop
    if (Object.values(errors).some((err) => err !== "")) {
      return;
    }

    setLoading(true);

    try {
      await register({ name, email, password });
      navigate("/trips");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Registration failed. Please try again.";
      setError(errorMessage);

      // Check for specific errors
      if (errorMessage.includes("already registered")) {
        setFieldErrors((prev) => ({
          ...prev,
          email: "This email is already registered",
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>Create Account 🚀</h1>
      <p
        style={{
          textAlign: "center",
          color: "var(--dark-gray)",
          marginBottom: "2rem",
        }}
      >
        Start planning your dream trips today
      </p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Full Name</label>
          <input
            placeholder="Enter your full name"
            type="text"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setFieldErrors((prev) => ({ ...prev, name: "" }));
            }}
            required
          />
          {fieldErrors.name && (
            <p
              style={{
                color: "#D32F2F",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
              }}
            >
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
           placeholder="Enter your email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((prev) => ({ ...prev, email: "" }));
            }}
            required
          />
          {fieldErrors.email && (
            <p
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
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErrors((prev) => ({ ...prev, password: "" }));
              }}
              placeholder="Create a strong password"
              disabled={loading}
              style={{
                width: "100%",
                borderColor: fieldErrors.password
                  ? "#D32F2F"
                  : "var(--light-gray)",
                paddingRight: "2.5rem",
                boxSizing: "border-box",
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "6%",
                transform: "translateY(-45)",
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
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {fieldErrors.password && (
            <p
              style={{
                color: "#D32F2F",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
              }}
            >
              {fieldErrors.password}
            </p>
          )}

          <PasswordStrength password={password} />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              onBlur={handleConfirmPasswordBlur}
              placeholder="Confirm your password"
              disabled={loading}
              style={{
                width: "100%",
                borderColor: fieldErrors.confirmPassword
                  ? "#D32F2F"
                  : "var(--light-gray)",
                paddingRight: "2.5rem",
                boxSizing: "border-box",
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p
              style={{
                color: "#D32F2F",
                fontSize: "0.875rem",
                marginTop: "0.25rem",
              }}
            >
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                justifyContent: "center",
              }}
            >
              <span className="inline-loader">⏳</span>
              Creating account...
            </span>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterPage;