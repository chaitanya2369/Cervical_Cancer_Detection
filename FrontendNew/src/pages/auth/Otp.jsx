import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Button from "../../components/general/Button";

export default function Otp() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state || "";
  useEffect(() => {
    if (timeLeft > 0 && resendDisabled) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setResendDisabled(false);
      setTimeLeft(30);
    }
  }, [timeLeft, resendDisabled]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
    setError("");
  };
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleResendOtp = async () => {
    if (!resendDisabled) {
      try {
        const response = await fetch(`${apiUrl}auth/resend-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (data.success) {
          setResendDisabled(true);
          setTimeLeft(30);
          setError("OTP resent successfully.");
        } else {
          setError(data.message || "Failed to resend OTP.");
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
        console.error("Resend OTP error:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (!otpValue || otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: otpValue,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (data.success) {
        navigate("/login");
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please check your network and try again.");
      console.error("OTP verification error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-300 to-sky-400 relative">
      <div className="absolute inset-0 bg-white opacity-10 mix-blend-overlay pointer-events-none"></div>

      <header className="w-full bg-slate-700 bg-opacity-90 text-white py-4 shadow-md z-10 relative">
        <div className="container mx-auto flex items-center justify-between px-6">
          <Link to="/">
            <h1 className="text-white font-bold text-3xl">
              Cervi<span className="text-teal-400">Scan</span>
            </h1>
          </Link>
          <nav>
            <Link to="/login" className="text-white hover:underline ml-4">
              Back to Login
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex items-center justify-center py-10 relative z-10">
        <div className="bg-white/30 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md text-center border border-white/20">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white flex items-center justify-center shadow-md">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c1.38 0 2.5-1.12 2.5-2.5S13.38 6 12 6s-2.5 1.12-2.5 2.5S10.62 11 12 11zm0 2c-2.48 0-4.5 2.02-4.5 4.5v1h9v-1c0-2.48-2.02-4.5-4.5-4.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Verify Your Email
          </h2>
          <p className="text-sm text-gray-600 mt-1 mb-6">
            Enter the 6-digit code sent to {email || "your email"}.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6 text-center">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  id={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  maxLength="1"
                  className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-xl"
                  autoFocus={index === 0}
                />
              ))}
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-900"
            >
              Verify OTP
            </Button>
            <p className="text-sm text-gray-600 mt-4">
              Didn’t receive the code?{" "}
              <button
                onClick={handleResendOtp}
                disabled={resendDisabled}
                className={`text-blue-500 hover:underline ${
                  resendDisabled ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                Resend OTP {resendDisabled && `(${timeLeft}s)`}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
