const BASE_URL = import.meta.env.VITE_API_URL as string | undefined;
if (!BASE_URL) {
  throw new Error("Missing VITE_API_URL. Set it in your .env file.");
}
export const API_URL = `${BASE_URL.replace(/\/$/, "")}/api`;
const API_KEY = import.meta.env.VITE_FRONTEND_API_KEY as string;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const fullUrl = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;
  
  const headers = {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  return fetch(fullUrl, {
    ...options,
    headers,
  });
};
