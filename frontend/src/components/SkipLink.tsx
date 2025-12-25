const SkipLink = () => {
  return (
    <a
      href="#main-content"
      style={{
        position: "absolute",
        left: "-9999px",
        top: "0",
        zIndex: 9999,
        padding: "1rem 2rem",
        background: "var(--primary)",
        color: "white",
        textDecoration: "none",
        fontWeight: 600,
        borderRadius: "0 0 var(--radius-sm) 0",
      }}
      onFocus={(e) => {
        e.currentTarget.style.left = "0";
      }}
      onBlur={(e) => {
        e.currentTarget.style.left = "-9999px";
      }}
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;
