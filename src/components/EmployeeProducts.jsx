import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/api";
import toast from "react-hot-toast";

const EmployeeProducts = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderData, setOrderData] = useState({
    productId: "",
    quantity: 1,
    total: 0,
    stock: 0,
    price: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
        },
      });
      if (response.data.success) {
        setCategories(response.data.categories);
        setProducts(response.data.products);
        setFilteredProducts(response.data.products);
      }
    } catch (error) {
      toast.error("Error fetching products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(value)
    );
    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    if (!categoryId) return setFilteredProducts(products);
    const filtered = products.filter((p) => p.category._id === categoryId);
    setFilteredProducts(filtered);
  };

  const openOrderModal = (product) => {
    setOrderData({
      productId: product._id,
      quantity: 1,
      price: product.price,
      total: product.price,
      stock: product.stock,
    });
    setIsModalOpen(true);
  };

  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value) || 1;
    if (quantity > orderData.stock)
      return toast.error("Exceeds available stock");
    setOrderData((prev) => ({
      ...prev,
      quantity,
      total: quantity * prev.price,
    }));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/order/add", orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
        },
      });
      if (response.data.success) {
        setIsModalOpen(false);
        setOrderData({ productId: "", quantity: 1, total: 0 });
        fetchProducts();
        toast.success("Order placed!");
      }
    } catch (err) {
      toast.error("Error placing order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Browse Products</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          disabled={loading}
          className="w-full md:w-1/3 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          onChange={handleSearch}
          placeholder="Search products..."
          disabled={loading}
          className="w-full md:w-1/3 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
            <tr>
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={product._id} className="hover:bg-gray-50 border-t">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{product.name}</td>
                <td className="p-4">{product.category.name}</td>
                <td className="p-4">${product.price}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4">
                  <button
                    onClick={() => openOrderModal(product)}
                    disabled={loading || product.stock === 0}
                    className={`px-4 py-1 rounded-lg text-white transition ${
                      product.stock === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "cursor-pointer bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Order
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!filteredProducts.length && !loading && (
          <div className="text-center text-gray-400 py-6">
            No products found.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Place Your Order</h2>
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max={orderData.stock}
                  value={orderData.quantity}
                  onChange={handleQuantityChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Available Stock: <strong>{orderData.stock}</strong>
                </p>
                <p className="text-sm text-gray-800">
                  Total:{" "}
                  <span className="font-semibold text-green-700">
                    ₹{orderData.total}
                  </span>
                </p>
              </div>
              <div className="flex justify-between gap-3">
                <button
                  type="submit"
                  className={`flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 ${
                    loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
                  }`}
                  disabled={loading}
                >
                  {loading && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  )}
                  {loading ? "Ordering..." : "Confirm"}
                </button>
                <button
                  type="button"
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg"
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProducts;
