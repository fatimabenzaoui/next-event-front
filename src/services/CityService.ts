import api from "./api";
import type { City } from "../models/City";

/**
 * Récupère toutes les villes
 * @returns Une promesse avec la liste des villes
 */
export const findAllCities = async (): Promise<City[]> => {
  const response = await api.get<City[]>('/api/cities/');
  return response.data;
};

/**
 * Récupère une ville par son ID
 * @param id L'ID de la ville
 * @returns Une promesse avec la ville
 */
export const findCityById = async (id: string): Promise<City> => {
  const response = await api.get<City>(`/api/cities/${id}/`);
  return response.data;
}

/**
 * Supprime une ville par son ID
 * @param id L'ID de la ville à supprimer
 * @returns Une promesse qui se résout si la suppression est réussie
 */
export const deleteCityById = async (id: number): Promise<void> => {
  await api.delete(`/api/cities/${id}/`);
};

/**
 * Crée une nouvelle ville
 * @param eventData Les données de la ville à créer
 * @returns Une promesse avec la ville créée
 */
export const createCity = async (data: Omit<City, "id">): Promise<City> => {
  const response = await api.post<City>("/api/cities/", data);
  return response.data;
}

/**
 * Met à jour une ville
 * @param id L'identifiant unique de la ville à mettre à jour
 * @param data Les nouvelles données de la ville
 * @returns Une promesse qui résout avec l'objet `City` mis à jour
 */
export const updateCity = async (id: number, data: Omit<City, "id">): Promise<City> => {
  const response = await api.put<City>(`/api/cities/${id}/`, data);
  return response.data;
};