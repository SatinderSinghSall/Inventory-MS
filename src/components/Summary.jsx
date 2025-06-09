import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  BarChart4,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";

const Summary = () => {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalStock: 0,
    ordersToday: 0,
    revenue: 0,
    totalUsers: 0,
    outOfStock: [],
    highestSaleProduct: null,
    lowStock: [],
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ims_token")}`,
          },
        });
        setDashboardData(response.data);
      } catch (err) {
        if (!err.response?.data?.success) {
          navigate("/login");
        }
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total Products",
            value: dashboardData.totalProducts,
            color: "bg-blue-100 text-blue-700",
            Icon: Package,
          },
          {
            title: "Total Stock",
            value: dashboardData.totalStock,
            color: "bg-green-100 text-green-700",
            Icon: BarChart4,
          },
          {
            title: "Orders Today",
            value: dashboardData.ordersToday,
            color: "bg-yellow-100 text-yellow-700",
            Icon: ShoppingBag,
          },
          {
            title: "Revenue",
            value: `₹${dashboardData.revenue}`,
            color: "bg-purple-100 text-purple-700",
            Icon: TrendingUp,
          },
          {
            title: "Total Users",
            value: dashboardData.totalUsers,
            color: "bg-orange-100 text-orange-700",
            Icon: Users,
          },
        ].map(({ title, value, color, Icon }, index) => (
          <div
            key={index}
            className={`rounded-xl shadow-sm p-5 flex items-center gap-4 ${color}`}
          >
            <Icon size={32} />
            <div>
              <h2 className="text-md font-medium">{title}</h2>
              <p className="text-xl font-bold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Out of Stock */}
        <div className="bg-white rounded-xl p-5 shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Out of Stock Products
          </h3>
          {dashboardData.outOfStock.length > 0 ? (
            <ul className="space-y-2">
              {dashboardData.outOfStock.map((product, index) => (
                <li key={index} className="text-gray-600 text-sm">
                  {product.name}{" "}
                  <span className="text-gray-400 text-xs">
                    ({product.category.name})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No products out of stock.</p>
          )}
        </div>

        {/* Highest Sale Product */}
        <div className="bg-white rounded-xl p-5 shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Highest Sale Product
          </h3>
          {dashboardData.highestSaleProduct?.name ? (
            <div className="text-gray-700 text-sm space-y-1">
              <p>
                <strong>Name:</strong> {dashboardData.highestSaleProduct.name}
              </p>
              <p>
                <strong>Category:</strong>{" "}
                {dashboardData.highestSaleProduct.category}
              </p>
              <p>
                <strong>Total Units Sold:</strong>{" "}
                {dashboardData.highestSaleProduct.totalQuantity}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              {dashboardData.highestSaleProduct?.message || "Loading..."}
            </p>
          )}
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-xl p-5 shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Low Stock Products
          </h3>
          {dashboardData.lowStock.length > 0 ? (
            <ul className="space-y-2">
              {dashboardData.lowStock.map((product, index) => (
                <li key={index} className="text-gray-600 text-sm">
                  <strong>{product.name}</strong> - {product.stock} left{" "}
                  <span className="text-gray-400 text-xs">
                    ({product.category.name})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No low stock products.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summary;
