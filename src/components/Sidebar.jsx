import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBox,
  FaShoppingCart,
  FaTruck,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaTable,
} from "react-icons/fa";

const Sidebar = () => {
  const adminMenuItems = [
    {
      name: "Dashboard",
      path: "/admin/admin-dashboard",
      icon: <FaHome />,
      isParent: true,
    },
    { name: "Suppliers", path: "supplier", icon: <FaTruck />, isParent: false },
    {
      name: "Categories",
      path: "categories",
      icon: <FaTable />,
      isParent: false,
    },
    { name: "Products", path: "products", icon: <FaBox />, isParent: false },
    { name: "Users", path: "users", icon: <FaUsers />, isParent: false },
    {
      name: "Orders",
      path: "orders",
      icon: <FaShoppingCart />,
      isParent: false,
    },
    { name: "Profile", path: "profile", icon: <FaCog />, isParent: true },
    { name: "Logout", path: "/logout", icon: <FaSignOutAlt />, isParent: true },
  ];

  const userMenuItems = [
    {
      name: "Products",
      path: ".",
      icon: <FaBox />,
      isParent: true,
    },
    {
      name: "Orders",
      path: "orders",
      icon: <FaShoppingCart />,
      isParent: false,
    },
    {
      name: "Profile",
      path: "user-profile",
      icon: <FaCog />,
      isParent: false,
    },
    { name: "Logout", path: "/logout", icon: <FaSignOutAlt />, isParent: true },
  ];

  const [mainItems, setMainItems] = useState([]);
  const [logoutItem, setLogoutItem] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("ims_user"));
    const items = user?.role === "Admin" ? adminMenuItems : userMenuItems;
    setMainItems(items.filter((item) => item.name !== "Logout"));
    setLogoutItem(items.find((item) => item.name === "Logout"));
  }, []);

  return (
    <aside className="fixed h-screen w-20 md:w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-200 shadow-lg flex flex-col justify-between transition-all duration-300 rounded-r-xl">
      {/* Branding */}
      <div className="flex items-center justify-center h-16 border-b border-gray-700 px-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 cursor-default select-none">
          <span className="hidden md:inline">Inventory MS</span>
          <span className="md:hidden">IMS</span>
        </h1>
      </div>

      {/* Menu + Logout */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden">
        <nav className="overflow-y-auto px-2 py-6 space-y-3">
          {mainItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.isParent}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-3 rounded-lg text-base font-semibold tracking-wide transition duration-200
                ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className="hidden md:inline">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        {logoutItem && (
          <div className="px-5 py-4 border-t border-gray-700">
            <NavLink
              to={logoutItem.path}
              className="flex items-center gap-4 w-full px-4 py-3 text-base font-semibold tracking-wide bg-red-600 rounded-lg hover:bg-red-700 transition duration-200"
            >
              <span className="text-xl">{logoutItem.icon}</span>
              <span className="hidden md:inline">{logoutItem.name}</span>
            </NavLink>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-xs py-3 border-t border-gray-700 select-none">
        © {new Date().getFullYear()} IMS
      </footer>
    </aside>
  );
};

export default Sidebar;
