

interface LiveRegionProps {
  message: string;
  politeness?: "polite" | "assertive";
}

const LiveRegion = ({ message, politeness = "polite" }: LiveRegionProps) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      style={{
        position: "absolute",
        left: "-10000px",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
    >
      {message}
    </div>
  );
};

export default LiveRegion;