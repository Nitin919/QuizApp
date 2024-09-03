import { useState } from "react";
import { useNavigate } from "react-router-dom";


const SignUp = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Frontend validation for password length
    if (inputs.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    // Frontend validation for password match
    if (inputs.password !== inputs.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: inputs.username,
          password: inputs.password,
        }),
      });

      if (response.ok) {
        navigate("/login"); // Redirect to login after successful signup
      } else {
        const data = await response.json();
        setError(data.message || "An error occurred during sign-up.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('bg.png')" }}
    >
      <div className="w-full max-w-md p-6 rounded-lg shadow-md bg-gray-800 bg-opacity-80">
        <h1 className="text-3xl font-semibold text-center text-gray-300 mb-4">
          Sign Up to <span className="text-blue-500">QuizApp</span>
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
              name="username"
              placeholder="Username"
              className="w-full p-2 rounded-lg text-gray-800 bg-gray-200"
              value={inputs.username}
              onChange={handleInputChange}
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
              name="password"
              placeholder="Password"
              className="w-full p-2 rounded-lg text-gray-800 bg-gray-200"
              value={inputs.password}
              onChange={handleInputChange}
              required
              autoComplete="new-password"
            />
            {inputs.password && inputs.password.length < 8 && (
              <p className="text-red-500 text-sm mt-1">
                Password must be at least 8 characters long.
              </p>
            )}
          </div>
          <div>
            <label
              className="block text-gray-300 mb-1"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full p-2 rounded-lg text-gray-800 bg-gray-200"
              value={inputs.confirmPassword}
              onChange={handleInputChange}
              required
              autoComplete="new-password"
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
              "Sign Up"
            )}
          </button>
        </form>
        <p className="mt-4 text-gray-400 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
