// API Configuration - All from environment variables
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
export const API_URL = `${BASE_URL}/api`;
const API_KEY = import.meta.env.VITE_FRONTEND_API_KEY || "";

// Ensure API key is set
if (!API_KEY) {
  console.warn("Warning: VITE_FRONTEND_API_KEY is not set in .env file");
}

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers || {});
  if (API_KEY) {
    headers.set("x-api-key", API_KEY);
  }

  return fetch(url, {
    ...options,
    headers,
  });
};
