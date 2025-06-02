import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

const Root = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "Admin") {
        navigate("/admin/admin-dashboard");
      } else if (user.role === "customer") {
        navigate("/employee/employee-dashboard");
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  return null;
};

export default Root;
