import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

import Root from "./utils/Root";
import ProtectedRoute from "./utils/ProtectedRoute";

//! Components:
import Unauthorized from "./components/Unauthorized";
import Categories from "./components/Categories";
import Suppliers from "./components/Suppliers";
import Products from "./components/Products";
import Users from "./components/Users";
import Logout from "./components/Logout";

//! Pages:
import Login from "./pages/Login";

import "./App.css";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />
          //! Admin Routes:
          <Route
            path="/admin/admin-dashboard"
            element={
              <ProtectedRoute requiredRole={["Admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<h1>Summary of Dashboard.</h1>} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="supplier" element={<Suppliers />} />
            <Route path="users" element={<Users />} />
            <Route path="orders" element={<h1>Orders</h1>} />
            <Route path="profile" element={<h1>Profile</h1>} />
          </Route>
          <Route
            path="/employee/employee-dashboard"
            element={<h1>Customer Dashboard</h1>}
          />
          //! Logout Functionality:
          <Route path="/logout" element={<Logout />}></Route>
          //! Unauthorized Route:
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
