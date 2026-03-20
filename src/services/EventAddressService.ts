import api from "./api";
import type { EventAddress } from "../models/EventAddress";

/**
 * Récupère toutes les adresses
 * @returns Une promesse avec la liste des adresses
 */
export const findAllEventAddresses = async (): Promise<EventAddress[]> => {
  const response = await api.get<EventAddress[]>("/api/event-addresses/");
  return response.data;
}

/**
 * Géocode une adresse via l'API backend
 * @param address L'adresse à géocoder
 * @returns Une promesse avec les coordonnées { latitude, longitude }
 */
export const geocodeAddress = async (address: string): Promise<{ latitude: number; longitude: number }> => {
  try {
    const response = await api.get(`/api/geocode/?address=${encodeURIComponent(address)}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors du géocodage de l'adresse :", address, error);
    throw error; // Propage l'erreur pour que le composant puisse la gérer
  }
};

/**
 * Récupère une adresse par son ID
 * @param id L'ID de l'adresse
 * @returns Une promesse avec l'adresse
 */
export const findEventAddressById = async (id: number): Promise<EventAddress> => {
  const response = await api.get<EventAddress>(`/api/event-addresses/${id}/`);
  return response.data;
}

/**
 * Supprime une adresse par son ID
 * @param id L'ID de l'adresse à supprimer
 * @returns Une promesse qui se résout si la suppression est réussie
 */
export const deleteEventAddressById = async (id: number): Promise<void> => {
  await api.delete(`/api/event-addresses/${id}/`);
};

/**
 * Crée une nouvelle adresse
 * @param eventData Les données de l'adresse à créer
 * @returns Une promesse avec l'adresse créée
 */
export const createEventAddress = async (data: Omit<EventAddress, "id">): Promise<EventAddress> => {
  const response = await api.post<EventAddress>("/api/event-addresses/", data);
  return response.data;
}

/**
 * Met à jour une adresse
 * @param id 
 * @param data 
 * @returns 
 */
export const updateEventAddress = async (id: number, data: Omit<EventAddress, "id">): Promise<EventAddress> => {
  const response = await api.put<EventAddress>(`/api/event-addresses/${id}/`, data);
  return response.data;
};
