import axios from 'axios';

/**
 * Shared Axios instance.
 *
 * - baseURL points at the API prefix.
 * - withCredentials: true ensures the httpOnly JWT cookie is sent on every request.
 * - Response interceptor handles global 401 redirects.
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Response interceptor ─────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If a protected request returns 401, the session has expired.
      // Redirect to login — but only if we're not already there.
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
