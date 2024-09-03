import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`${backendUrl}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      
  
      const data = await response.json();
      
  
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        console.error("Error message from backend:", data.message);
        setError(data.message || 'Invalid username or password.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('../../bg.png')",
      }}
    >
      <div className="w-full max-w-md p-6 rounded-lg shadow-md bg-gray-800 bg-opacity-80">
        <h1 className="text-3xl font-semibold text-center text-gray-300 mb-4">
          Login to <span className="text-blue-500">QuizApp</span>
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label className="block text-gray-300 mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              className="w-full p-2 rounded-lg text-gray-800 bg-gray-200"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              className="w-full p-2 rounded-lg text-gray-800 bg-gray-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-blue-500 transition duration-300 ${
              loading ? "cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="loader inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="mt-4 text-gray-400 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
