import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignInForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const response = await fetch("http://localhost:8080/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming your backend sends back a flag indicating if OTP is needed
        if (data.otpRequired) {
          navigate("/otp");
        } else {
          // Handle successful sign in (e.g., redirect to home)
          navigate("/home");
        }
      } else {
        // Handle error (e.g., show a message)
        console.error("Sign in failed");
      }
    } catch (error) {
      console.error("Error signing in:", error);
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
