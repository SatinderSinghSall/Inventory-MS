import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://inventory-management-system-backend-pt9n.onrender.com/api",
});

/*
  https://inventory-management-system-backend-pt9n.onrender.com
  http://localhost:5000
*/

//! ✅ Attach token to request headers:
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ims_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//! ⚠️ Handle 401 responses:
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === "Unauthorized - Token Invalid or Expired"
    ) {
      localStorage.removeItem("ims_token");
      localStorage.removeItem("ims_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
