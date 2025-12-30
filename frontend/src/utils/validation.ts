export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Invalid email format" };
  }

  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters",
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one uppercase letter",
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one lowercase letter",
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one number",
    };
  }

  return { isValid: true };
};

export const validateName = (name: string): ValidationResult => {
  if (!name) {
    return { isValid: false, error: "Name is required" };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: "Name must be at least 2 characters",
    };
  }

  if (name.length > 50) {
    return {
      isValid: false,
      error: "Name must be less than 50 characters",
    };
  }

  return { isValid: true };
};

// Password strength calculator
export const getPasswordStrength = (
  password: string
): {
  strength: "weak" | "fair" | "good" | "strong";
  score: number;
  feedback: string;
} => {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // Special characters

  if (score <= 2) {
    return { strength: "weak", score, feedback: "Weak password" };
  } else if (score <= 4) {
    return { strength: "fair", score, feedback: "Fair password" };
  } else if (score <= 5) {
    return { strength: "good", score, feedback: "Good password" };
  } else {
    return { strength: "strong", score, feedback: "Strong password" };
  }
};