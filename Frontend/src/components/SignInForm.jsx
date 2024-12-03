import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";

function SignInForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Email and Password are required.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      const { "jwt-token": token, role } = response.data;

      if (token) {
        Cookies.set("jwt-token", token, { expires: 7 }); // Save token to cookies
        login(token);

        switch (role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "trainer":
            navigate("/trainer/dashboard");
            break;
          default:
            navigate("/user/dashboard");
        }
      } else {
        setError("Login failed, token not received.");
      }
    } catch (err) {
      console.error("Sign in failed:", err);
      setError(
        err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : "Login failed, please check your credentials."
      );
    } finally {
      setIsLoading(false);
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
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex items-center justify-between">
          <button
            disabled={isLoading}
            className={`bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            type="button"
            onClick={handleSignIn}
          >
            {isLoading ? "Logging In..." : "Log In"}
          </button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <Link to="/signup" className="text-teal-500 hover:text-teal-700">
          Don't have an account? Sign Up
        </Link>
      </div>
    </div>
  );
}

export default SignInForm;
