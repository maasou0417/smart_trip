import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome to Smart Trip! 🗺️</h1>
      {user ? (
        <p>Hello, {user.name}! Ready to plan your next adventure?</p>
      ) : (
        <p>Please login or register to start planning your trips.</p>
      )}
    </div>
  );
};

export default HomePage;