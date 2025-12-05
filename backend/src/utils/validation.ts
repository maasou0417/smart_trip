export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  return null; // Valid
};

export const validateName = (name: string): string | null => {
  if (name.length < 2) {
    return "Name must be at least 2 characters long";
  }
  if (name.length > 50) {
    return "Name must be less than 50 characters";
  }
  return null;
};

export const sanitizeInput = (input: string): string => {
  return input.trim();
};