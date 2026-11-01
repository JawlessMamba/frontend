import axios from "axios";

const api = axios.create({
  // Docker build sets VITE_API_URL=/api/ (proxied by nginx); local dev talks to the backend directly
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:2300/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Attach token automatically for authenticated requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // get JWT from localStorage
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`; // attach token
    }
    return config;
  },
  (error) => {
    console.log("Request error: ", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Invalid/expired token: clear session and send user back to login
    if (error.response?.status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
