interface LoadingProps {
  size?: "small" | "medium" | "large";
  message?: string;
}

const Loading = ({ size = "medium", message }: LoadingProps) => {
  return (
    <div className="page-loader">
      <div className={`loading-spinner loading-spinner-${size}`}>
        <div className="spinner"></div>
      </div>
      {message && <p className="loader-message">{message}</p>}
    </div>
  );
};

export default Loading;