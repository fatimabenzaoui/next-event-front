import api from "./api";
import type { EventFlyer } from "../models/EventFlyer";

/**
 * Récupère tous les flyers depuis l'API
 * @returns Une promesse avec la liste des flyers
 */
export const findAllEventFlyers = async (): Promise<EventFlyer[]> => {
  const response = await api.get<EventFlyer[]>("/api/flyers/");
  return response.data;
}

/**
 * Récupère le flyer d'un événement par son ID
 * @param id L'ID du flyer de l'événement
 * @returns Une promesse avec le flyer de l'événement
 */
export const findEventFlyerById = async (id: string): Promise<EventFlyer> => {
  const response = await api.get<EventFlyer>(`/api/flyers/${id}/`);
  return response.data;
}

/**
 * Supprime un flyer par son ID
 * @param id L'ID du flyer à supprimer
 * @returns Une promesse qui se résout si la suppression est réussie
 */
export const deleteEventFlyerById = async (id: string): Promise<void> => {
  await api.delete(`/api/flyers/${id}/`);
};

/**
 * Crée un nouveau flyer
 * @param formData Les données du formulaire (le flyer)
 * @returns Une promesse avec le flyer créé
 */
export const createEventFlyer = async (formData: FormData): Promise<EventFlyer> => {
  const response = await api.post<EventFlyer>("/api/flyers/", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Met à jour un flyer
 * @param id L'ID du flyer à mettre à jour
 * @param formData Les données du formulaire (le flyer)
 * @returns Une promesse avec le flyer mis à jour
 */
export const updateEventFlyerById = async (id: string, formData: FormData): Promise<EventFlyer> => {
  const response = await api.put<EventFlyer>(`/api/flyers/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};