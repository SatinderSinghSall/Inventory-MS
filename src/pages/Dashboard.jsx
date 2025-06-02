import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 ml-16 md:ml-64 bg-gray-100 min-h-screen">
        {/* Navbar */}
        <div className="p-4 border-b border-gray-200 sticky top-0 z-30 bg-gray-100">
          <Navbar />
        </div>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
