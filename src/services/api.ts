import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor pour les réponses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur API:", error);
    toast.error("Une erreur technique est survenue.");
    return Promise.reject(error);
  }
);

export default api;