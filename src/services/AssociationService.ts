import api from "./api";
import type { Association } from "../models/Association";

/**
 * Récupère toutes les associations
 * @returns Une promesse avec la liste des associations
 */
export const findAllAssociations = async (): Promise<Association[]> => {
  const response = await api.get<Association[]>('/api/associations/');
  return response.data;
};

/**
 * Récupère une association par son ID
 * @param id L'ID de l'association
 * @returns Une promesse avec l'association
 */
export const findAssociationById = async (id: number): Promise<Association> => {
  const response = await api.get<Association>(`/api/associations/${id}/`);
  return response.data;
}

/**
 * Supprime une association par son ID
 * @param id L'ID de l'association à supprimer
 * @returns Une promesse qui se résout si la suppression est réussie
 */
export const deleteAssociationById = async (id: number): Promise<void> => {
  await api.delete(`/api/associations/${id}/`);
};