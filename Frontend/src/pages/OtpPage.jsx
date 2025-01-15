import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OtpPage() {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const loc = useLocation();

  const { name,email,password } = loc.state || {}; // Extract email from state

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      setErrorMessage("Please enter the OTP.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp, email,name,password }),
      });

      if (response.ok) {
        navigate("/login");
      } else {
        setErrorMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <img
        src="./images/otpverification.png"
        className="w-1/2"
        alt="OTP Verification"
      />
      <p>One Time Password has been sent via Email to</p>
      <p className="font-bold">{email || "your registered email"}</p>
      <h1 className="font-medium mb-4">Enter OTP to Verify</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
        />
        {errorMessage && (
          <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
        )}
        <button
          type="submit"
          className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Submit OTP
        </button>
      </form>
    </div>
  );
}

export default OtpPage;
