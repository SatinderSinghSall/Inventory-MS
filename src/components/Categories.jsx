import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/api";
import { Pencil, Trash2, X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [formCategory, setFormCategory] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/category", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
        },
      });
      if (response.data.success) {
        setCategories(response.data.categories);
        setFilteredCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Fetch error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Failed to fetch categories."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = formCategory.trim();
    const trimmedDesc = formDescription.trim();

    if (!trimmedName) {
      toast.error("Category name is required");
      return;
    }

    if (trimmedName.length > 50) {
      toast.error("Category name must be 50 characters or fewer.");
      return;
    }

    if (trimmedDesc.length > 500) {
      toast.error("Description must be 500 characters or fewer.");
      return;
    }

    // Check for duplicate name
    const isDuplicate = categories.some(
      (cat) =>
        cat.name.trim().toLowerCase() === trimmedName.toLowerCase() &&
        cat._id !== editingId
    );
    if (isDuplicate) {
      toast.error("A category with this name already exists.");
      return;
    }

    // Skip if no changes were made
    if (editingId) {
      const original = categories.find((c) => c._id === editingId);
      if (
        original &&
        original.name === trimmedName &&
        original.description === trimmedDesc
      ) {
        toast("No changes detected.", { icon: "ℹ️" });
        return;
      }
    }

    setSaving(true);
    try {
      const method = editingId ? "put" : "post";
      const url = editingId ? `/category/${editingId}` : "/category/add";
      const payload = { name: trimmedName, description: trimmedDesc };

      const response = await axiosInstance[method](url, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
        },
      });

      if (response.data.success) {
        toast.success(editingId ? "Category Updated!" : "Category Added!");
        fetchCategories();
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
      console.error(error.response?.data || error);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormCategory("");
    setFormDescription("");
  };

  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!categoryToDelete) return;

    setDeleting(true);
    try {
      const response = await axiosInstance.delete(
        `/category/${categoryToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
          },
        }
      );
      if (response.data.success) {
        setCategories((prev) =>
          prev.filter((cat) => cat._id !== categoryToDelete._id)
        );
        setFilteredCategories((prev) =>
          prev.filter((cat) => cat._id !== categoryToDelete._id)
        );
        toast.success("Category deleted!");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Delete failed.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  const handleSearchInput = (e) => {
    const value = e.target.value.toLowerCase();
    setFilteredCategories(
      categories.filter((c) => c.name.toLowerCase().includes(value))
    );
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormCategory(category.name);
    setFormDescription(category.description);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-6">
        📁 Manage Categories
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            {editingId ? "✏️ Edit Category" : "➕ Add New Category"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={50}
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="e.g., Electronics"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder:text-gray-400 shadow-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows="3"
                maxLength={500}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Optional description..."
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 placeholder:text-gray-400 shadow-sm resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className={`group cursor-pointer flex-1 min-w-[140px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all duration-200 shadow ${
                  editingId
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-600 hover:bg-blue-700"
                } disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {editingId ? "Save Changes" : "Add Category"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 cursor-pointer min-w-[140px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-500 hover:bg-gray-600 text-white text-sm font-semibold transition-all duration-200 shadow"
                >
                  <X size={16} />
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Category List Section */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <input
              type="text"
              onChange={handleSearchInput}
              placeholder="🔍 Search categories..."
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="bg-white rounded-xl shadow p-4 min-h-[200px]">
            {loading ? (
              <div className="py-10 text-center text-gray-500">
                <Loader2 size={24} className="mx-auto animate-spin" />
                Loading categories...
              </div>
            ) : filteredCategories.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCategories.map((category, index) => (
                  <div
                    key={category._id}
                    className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800 text-lg truncate">
                        {category.name}
                      </h3>
                      <span className="text-xs text-gray-400">
                        #{index + 1}
                      </span>
                    </div>
                    {category.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {category.description}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg transition"
                        disabled={editingId === category._id}
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(category)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p className="text-lg">😕 No categories found</p>
                <p className="text-sm mt-1">
                  Try adding a new one or change your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <strong>{categoryToDelete?.name}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 cursor-pointer flex items-center justify-center gap-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-60"
                disabled={deleting}
              >
                {deleting && <Loader2 className="animate-spin" size={16} />}
                Yes, Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCategoryToDelete(null);
                }}
                className="px-4 py-2 cursor-pointer bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
