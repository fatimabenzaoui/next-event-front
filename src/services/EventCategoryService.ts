import api from "./api";
import type { EventCategory } from "../models/EventCategory";

/**
 * Récupère toutes les catégories
 * @returns Une promesse avec la liste des catégories
 */
export const findAllEventCategories = async (): Promise<EventCategory[]> => {
  const response = await api.get<EventCategory[]>('/api/categories/');
  return response.data;
};

/**
 * Récupère une catégorie par son ID
 * @param id L'ID de la catégorie
 * @returns Une promesse avec la catégorie
 */
export const findEventCategoryById = async (id: string): Promise<EventCategory> => {
  const response = await api.get<EventCategory>(`/api/categories/${id}/`);
  return response.data;
}

/**
 * Supprime une catégorie par son ID
 * @param id L'ID de la catégorie à supprimer
 * @returns Une promesse qui se résout si la suppression est réussie
 */
export const deleteEventCategoryById = async (id: number): Promise<void> => {
  await api.delete(`/api/categories/${id}/`);
};

/**
 * Crée une nouvelle catégorie
 * @param eventData Les données de la catégorie à créer
 * @returns Une promesse avec la catégorie créée
 */
export const createEventCategory = async (data: Omit<EventCategory, "id">): Promise<EventCategory> => {
  const response = await api.post<EventCategory>("/api/categories/", data);
  return response.data;
}

/**
 * Met à jour une catégorie
 * @param id 
 * @param data 
 * @returns 
 */
export const updateEventCategory = async (id: number, data: Omit<EventCategory, "id">): Promise<EventCategory> => {
  const response = await api.put<EventCategory>(`/api/categories/${id}/`, data);
  return response.data;
};

