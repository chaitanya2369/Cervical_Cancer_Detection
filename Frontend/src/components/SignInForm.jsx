import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Ensure correct path

function SignInForm() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    // Simulate response with hardcoded values for testing
    const data = { token: "12345", role: "trainer" };

    if (data) {
      const { token, role } = data;
      login(token); // Use the 'login' function from context

      // Navigate based on role
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "trainer") {
        navigate("/trainer/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } else {
      console.error("Sign in failed");
    }
  };

  return (
    <div>
      <h1 className="font-bold text-2xl mb-4 text-center">Log In</h1>
      <form>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleSignIn}
          >
            Log In
          </button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <Link to="/signup" className="text-teal-500 hover:text-teal-700">
          Already have an account? Sign Up
        </Link>
      </div>
    </div>
  );
}

export default SignInForm;
