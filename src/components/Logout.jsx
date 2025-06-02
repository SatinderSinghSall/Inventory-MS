import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  logout();
  toast.warning("Logged out successfully!");
  navigate("/login");
};

export default Logout;
