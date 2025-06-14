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
  AlertTriangle,
  PackageX,
} from "lucide-react";
import { CiDeliveryTruck } from "react-icons/ci";

const Summary = () => {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalStock: 0,
    ordersToday: 0,
    revenue: 0,
    totalSuppliers: 0,
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
            title: "Total Suppliers",
            value: dashboardData.totalSuppliers,
            color: "bg-pink-100 text-pink-700",
            Icon: CiDeliveryTruck,
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
        <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-red-500">
          <div className="flex items-center gap-2 mb-4 text-red-600">
            <PackageX className="w-5 h-5" />
            <h3 className="text-lg font-semibold text-gray-800">
              Out of Stock
            </h3>
          </div>
          {dashboardData.outOfStock.length > 0 ? (
            <ul className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {dashboardData.outOfStock.map((product, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-sm text-gray-700 border-b pb-1"
                >
                  <span className="font-medium">{product.name}</span>
                  <span className="text-gray-400 text-xs">
                    {product.category.name}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No products out of stock.</p>
          )}
        </div>

        {/* Highest Sale Product */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-4 text-green-600">
            <TrendingUp className="w-5 h-5" />
            <h3 className="text-lg font-semibold text-gray-800">
              Highest Sale Product
            </h3>
          </div>
          {dashboardData.highestSaleProduct?.name ? (
            <div className="text-sm text-gray-700 space-y-2">
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
        <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-yellow-500">
          <div className="flex items-center gap-2 mb-4 text-yellow-600">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-lg font-semibold text-gray-800">Low Stock</h3>
          </div>
          {dashboardData.lowStock.length > 0 ? (
            <ul className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {dashboardData.lowStock.map((product, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-sm text-gray-700 border-b pb-1"
                >
                  <div>
                    <span className="font-medium">{product.name}</span>
                    <div className="text-gray-400 text-xs">
                      {product.category.name}
                    </div>
                  </div>
                  <span className="text-yellow-600 font-semibold">
                    {product.stock} left
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
