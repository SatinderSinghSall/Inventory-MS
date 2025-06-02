import React, { useState } from "react";
import { FaSearch, FaBars } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md px-4 py-3 flex flex-wrap items-center justify-between md:px-6 rounded-xl">
      {/* Left: Logo or title */}
      <div className="text-lg md:text-xl font-semibold text-gray-700">
        Manage Inventory
      </div>

      {/* Hamburger menu for small screens */}
      <button
        className="md:hidden text-gray-700 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <FaBars />
      </button>

      {/* Right Section */}
      <div
        className={`${
          menuOpen ? "flex" : "hidden"
        } md:flex flex-col md:flex-row w-full md:w-auto items-start md:items-center gap-4 mt-3 md:mt-0`}
      >
        {/* Search box */}
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search..."
            className="w-full md:w-64 pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
        </div>

        {/* Profile info */}
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium text-gray-700 hidden sm:block">
            {user?.name || "Admin"}
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold">
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
