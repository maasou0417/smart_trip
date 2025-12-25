interface LoadingProps {
  size?: "small" | "medium" | "large";
  message?: string;
}

const Loading = ({ size = "medium", message }: LoadingProps) => {
  return (
    <div className="page-loader"
    role="status"
    aria-live="polite"
    aria-label={message || "Loading content"}>
      <div className={`loading-spinner loading-spinner-${size}`}>
        <div className="spinner" aria-hidden="true"></div>
      </div>
      {message && <p className="loader-message">{message}</p>}
      <span className="sr-only">Loading, please wait!</span>
    </div>
  );
};

export default Loading;