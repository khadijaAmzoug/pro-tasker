import axios from "axios";

/**
 * Axios instance for all API calls
 * - baseURL from VITE_API_BASE_URL (e.g. https://your-backend.onrender.com/api)
 * - Attaches JWT token from localStorage
 * - Normalizes error messages
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  withCredentials: false,
});

// Add token before each request (if present)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Normalize server/network errors
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Request failed";
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
