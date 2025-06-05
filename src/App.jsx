import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

import Root from "./utils/Root";
import ProtectedRoute from "./utils/ProtectedRoute";

//! Components:
import Unauthorized from "./components/Unauthorized";
import NotFound from "./components/NotFound";
import Categories from "./components/Categories";
import Suppliers from "./components/Suppliers";
import Products from "./components/Products";
import Users from "./components/Users";
import Summary from "./components/Summary";
import EmployeeProducts from "./components/EmployeeProducts";
import Orders from "./components/Orders";
import Profile from "./components/Profile";
import Logout from "./components/Logout";

//! Pages:
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import "./App.css";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <ToastContainer />

      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin/admin-dashboard"
            element={
              <ProtectedRoute requiredRole={["Admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                <ProtectedRoute requiredRole={["Admin"]}>
                  <Summary />
                </ProtectedRoute>
              }
            ></Route>
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="supplier" element={<Suppliers />} />
            <Route path="users" element={<Users />} />
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Employee Dashboard */}
          <Route
            path="/employee/employee-dashboard"
            element={
              <ProtectedRoute requiredRole={["Customer"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<EmployeeProducts />} />
            <Route path="orders" element={<Orders />} />
            <Route path="user-profile" element={<Profile />} />
          </Route>

          {/* Logout */}
          <Route path="/logout" element={<Logout />} />

          {/* Unauthorized Route */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
