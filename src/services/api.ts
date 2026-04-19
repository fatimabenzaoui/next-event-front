import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "https://fatimabenzaoui.pythonanywhere.com/",
  // baseURL: "http://localhost:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("Aucun token trouvé dans localStorage !");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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