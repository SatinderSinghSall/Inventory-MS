import React, { useState } from "react";
import axiosInstance from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showContactAdminModal, setShowContactAdminModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { Login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!email || !password) {
      setErrorMessage("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
        rememberMe,
      });

      if (data.success) {
        await Login(data.user, data.token);
        toast.success("Logged in successfully!");
        navigate(
          data.user.role === "Admin"
            ? "/admin/admin-dashboard"
            : "/employee/employee-dashboard"
        );
      } else {
        setErrorMessage(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      setErrorMessage(message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Modal component for reuse
  const Modal = ({ title, children, onClose }) => (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center px-4
               bg-white/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close modal"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 via-green-600 to-green-800 px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('/pattern.svg')] bg-repeat"></div>

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 sm:p-12 z-10">
        <h1 className="text-2xl font-bold text-center text-green-800 mb-3 tracking-tight font-sevillana">
          Inventory Management System
        </h1>
        <p className="text-center text-gray-600 mb-8 font-medium tracking-wide">
          Sign in to your account
        </p>

        {errorMessage && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 flex items-center space-x-3 bg-red-100 border border-red-400 text-red-700 text-sm font-semibold rounded-lg px-4 py-3 shadow-sm animate-fadeIn"
          >
            <svg
              className="w-6 h-6 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
              ></path>
            </svg>
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field with icon */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                className="w-full px-5 py-3 pl-12 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 12H8m0 0l4 4m-4-4l4-4"
                />
              </svg>
            </div>
          </div>

          {/* Password Field with icon */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full px-5 py-3 pl-12 pr-12 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
              {/* Lock icon */}
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11c.667 0 1.333 1.5 2 1.5s1.333-1.5 2-1.5"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12a6 6 0 0112 0v3a6 6 0 01-12 0v-3z"
                />
              </svg>
              {/* Show/hide toggle icon */}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye-off icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-5-10-5s1.61-2.698 4.223-4.525M6.098 6.098C4.218 7.62 2 10 2 10s4.477 5 10 5c.806 0 1.59-.106 2.342-.304M16.742 16.742L20 20m-4-4l-9-9m9 9L4 4"
                    />
                  </svg>
                ) : (
                  // Eye icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center text-sm text-gray-600 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-5 w-5 rounded border-gray-300 text-green-600 shadow-sm focus:ring-green-500 focus:ring-2 align-middle"
              />
              <span className="ml-2 leading-none">Remember me</span>
            </label>

            <button
              type="button"
              className="text-sm cursor-pointer text-green-700 hover:underline focus:outline-none focus:ring-1 focus:ring-green-700"
              onClick={() => setShowForgotPasswordModal(true)}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 active:bg-green-800 transition duration-300 flex justify-center items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02]"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Don't have an account?{" "}
          <span
            className="text-green-700 hover:underline cursor-pointer"
            onClick={() => setShowContactAdminModal(true)}
          >
            Contact Admin
          </span>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <Modal
          title="Forgot Password"
          onClose={() => setShowForgotPasswordModal(false)}
        >
          <p className="text-gray-700 mb-4">
            Password recovery is still under maintenance. Please contact your
            administrator for assistance.
          </p>
          <button
            onClick={() => setShowForgotPasswordModal(false)}
            className="mt-2 w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          >
            Close
          </button>
        </Modal>
      )}

      {/* Contact Admin Modal */}
      {showContactAdminModal && (
        <Modal
          title="Contact Admin"
          onClose={() => setShowContactAdminModal(false)}
        >
          <p className="text-gray-700 mb-4">
            To create an account, please contact your administrator directly via
            email or phone.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {/* You can add real contact info here */}
            Email:{" "}
            <a
              href="mailto:satindersinghsall111@gmail.com"
              className="text-green-600 underline"
            >
              satindersinghsall111@gmail.com
            </a>
            <br />
            Phone:{" "}
            <a href="tel:0000000000" className="text-green-600 underline">
              0000000000
            </a>
          </p>
          <button
            onClick={() => setShowContactAdminModal(false)}
            className="mt-2 w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          >
            Close
          </button>
        </Modal>
      )}
    </div>
  );
};

export default Login;
