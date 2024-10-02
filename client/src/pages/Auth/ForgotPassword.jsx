import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState("request");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username }),
        }
      );
      const data = await response.text();

      if (response.ok) {
        setMessage(data || "Reset code sent");
        setStep("verify");
      } else {
        setMessage(data || "Failed to send reset code");
      }
    } catch (error) {
      console.error("Error sending reset code:", error);
      setMessage("Failed to send reset code");
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const code = e.target.elements.code.value;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}auth/verify-reset-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, code }),
        }
      );
      const data = await response.text();

      if (response.ok) {
        setMessage(data || "Code verified successfully");
        setStep("reset");
      } else {
        setMessage(data || "Failed to verify code");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setMessage("Failed to verify code");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newPassword = e.target.elements.newPassword.value;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, newPassword, username }),
        }
      );
      const data = await response.text();

      if (response.ok) {
        setMessage(data || "Password reset successfully");
      } else {
        setMessage(data || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("Failed to reset password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="bg-white dark:bg-stone-900 p-8 rounded-lg shadow-md w-full max-w-md">
        {step === "request" && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Forgot Password</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Send Reset Code
              </button>
              {message && <p className="mt-4 text-sm text-red-500 dark:text-red-400">{message}</p>}
            </form>
          </div>
        )}

        {step === "verify" && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Verify Reset Code</h2>
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reset Code:</label>
                <input
                  type="text"
                  name="code"
                  required
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Verify Code
              </button>
              {message && <p className="mt-4 text-sm text-red-500 dark:text-red-400">{message}</p>}
            </form>
          </div>
        )}

        {step === "reset" && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Reset Password</h2>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password:</label>
                <input
                  type="password"
                  name="newPassword"
                  required
                  className="mt-1 p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Reset Password
              </button>
              {message && <p className="mt-4 text-sm text-red-500 dark:text-red-400">{message}</p>}
            </form>
          </div>
        )}

        <Link
          to="/"
          className="block mt-6 text-sm text-blue-500 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;  