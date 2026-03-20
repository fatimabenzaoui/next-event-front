import api from "./api";
import type { SchoolAddress } from "../models/SchoolAddress";

/**
 * Récupère toutes les adresses
 * @returns Une promesse avec la liste des adresses
 */
export const findAllSchoolAddresses = async (): Promise<SchoolAddress[]> => {
  const response = await api.get<SchoolAddress[]>("/api/school-addresses/");
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
export const findSchoolAddressById = async (id: number): Promise<SchoolAddress> => {
  const response = await api.get<SchoolAddress>(`/api/school-addresses/${id}/`);
  return response.data;
}

/**
 * Supprime une adresse par son ID
 * @param id L'ID de l'adresse à supprimer
 * @returns Une promesse qui se résout si la suppression est réussie
 */
export const deleteSchoolAddressById = async (id: number): Promise<void> => {
  await api.delete(`/api/school-addresses/${id}/`);
};

/**
 * Crée une nouvelle adresse
 * @param eventData Les données de l'adresse à créer
 * @returns Une promesse avec l'adresse créée
 */
export const createSchoolAddress = async (data: Omit<SchoolAddress, "id">): Promise<SchoolAddress> => {
  const response = await api.post<SchoolAddress>("/api/school-addresses/", data);
  return response.data;
}

/**
 * Met à jour une adresse
 * @param id 
 * @param data 
 * @returns 
 */
export const updateSchoolAddress = async (id: number, data: Omit<SchoolAddress, "id">): Promise<SchoolAddress> => {
  const response = await api.put<SchoolAddress>(`/api/school-addresses/${id}/`, data);
  return response.data;
};