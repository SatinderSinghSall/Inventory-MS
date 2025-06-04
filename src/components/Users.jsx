import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/api";
import { FaUserPlus, FaTrashAlt } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [addingUser, setAddingUser] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
        },
      });
      if (response.data.success) {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, address, role } = formData;
    if (!name || !email || !password || !address || !role) {
      alert("Please fill out all fields before submitting.");
      return;
    }

    setAddingUser(true);
    try {
      const token = localStorage.getItem("ims_token");
      const response = await axiosInstance.post("/users/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        fetchUsers();
        setFormData({
          name: "",
          address: "",
          email: "",
          password: "",
          role: "",
        });
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setAddingUser(false);
    }
  };

  const handleSearchInput = (e) => {
    const value = e.target.value.toLowerCase();
    setFilteredUsers(
      users.filter((user) => user.name.toLowerCase().includes(value))
    );
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      const response = await axiosInstance.delete(
        `/users/${userToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
          },
        }
      );
      if (response.data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
        setFilteredUsers((prev) =>
          prev.filter((u) => u._id !== userToDelete._id)
        );
        setShowModal(false);
        setUserToDelete(null);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">User Management</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add User Form */}
          <div className="bg-white p-6 rounded-2xl shadow-md col-span-1">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
              <FaUserPlus className="text-blue-600" />
              Add New User
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {["name", "email", "password", "address"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field}
                  </label>
                  <input
                    type={field === "password" ? "password" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    placeholder={`Enter ${field}`}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Customer">Customer</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={addingUser}
                className={`w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2 rounded-md transition ${
                  addingUser
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
              >
                {addingUser ? (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                ) : (
                  <FaUserPlus />
                )}
                {addingUser ? "Adding..." : "Add User"}
              </button>
            </form>
          </div>

          {/* User List */}
          <div className="lg:col-span-2">
            <input
              type="text"
              onChange={handleSearchInput}
              placeholder="Search users by name..."
              className="w-full mb-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="bg-white shadow rounded-2xl overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user._id}
                      className="border-t hover:bg-gray-50 transition duration-150"
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.role}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <FaTrashAlt />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No users found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold text-red-600">
                {userToDelete?.name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 text-white transition ${
                  deleting
                    ? "bg-red-500 cursor-not-allowed opacity-80"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {deleting ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
