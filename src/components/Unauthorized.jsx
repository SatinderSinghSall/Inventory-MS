import React from "react";
import { useNavigate } from "react-router";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-6">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8">
        <div className="text-red-500 mb-4">
          <svg
            className="mx-auto h-16 w-16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to view this page.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition duration-200"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
