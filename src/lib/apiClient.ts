const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
// In development, Vite proxy handles /api -> http://localhost:5000
// In production, relative paths work if the frontend and backend are served from the same domain.

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  return response;
};
