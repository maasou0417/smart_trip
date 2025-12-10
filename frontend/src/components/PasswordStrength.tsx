import { getPasswordStrength } from "../utils/validation";

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  if (!password) return null;

  const { strength, score, feedback } = getPasswordStrength(password);

  const getColor = () => {
    switch (strength) {
      case "weak":
        return "#D32F2F";
      case "fair":
        return "#F57C00";
      case "good":
        return "#FBC02D";
      case "strong":
        return "#388E3C";
      default:
        return "#ccc";
    }
  };

  const getWidth = () => {
    return `${(score / 6) * 100}%`;
  };

  return (
    <div style={{ marginTop: "0.5rem" }}>
      <div
        style={{
          height: "4px",
          background: "var(--light-gray)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: getWidth(),
            background: getColor(),
            transition: "all 0.3s ease",
          }}
        />
      </div>
      <p
        style={{
          fontSize: "0.875rem",
          color: getColor(),
          marginTop: "0.25rem",
          fontWeight: 600,
        }}
      >
        {feedback}
      </p>
    </div>
  );
};

export default PasswordStrength;