import React from "react";
import { Link, useNavigate } from "react-router-dom";
function SignInForm() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    // Have to Add form validation and signup logic here
    // After successful signup, navigating to OTP page
    navigate("/otp");
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
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
