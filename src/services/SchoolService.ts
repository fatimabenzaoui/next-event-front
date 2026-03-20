import api from "./api";
import type { School } from "../models/School";

/**
 * Récupère toutes les écoles
 * @returns Une promesse avec la liste des écoles
 */
export const findAllSchools = async (): Promise<School[]> => {
  const response = await api.get<School[]>('/api/schools/');
  return response.data;
};

/**
 * Récupère une école par son ID
 * @param id L'ID de l'école
 * @returns Une promesse avec l'école
 */
export const findSchoolById = async (id: number): Promise<School> => {
  const response = await api.get<School>(`/api/schools/${id}/`);
  return response.data;
}

/**
 * Supprime une école par son ID
 * @param id L'ID de l'école à supprimer
 * @returns Une promesse qui se résout si la suppression est réussie
 */
export const deleteSchoolById = async (id: number): Promise<void> => {
  await api.delete(`/api/schools/${id}/`);
};

/**
 * Crée une nouvelle école
 * @param schoolData Les données de l'école à créer
 * @returns Une promesse avec l'école créée
 */
export const createSchool = async (data: Omit<School, "id">): Promise<School> => {
  const response = await api.post<School>("/api/schools/", data);
  return response.data;
}

/**
 * Met à jour une école
 * @param id L'identifiant unique de l'école à mettre à jour
 * @param data Les nouvelles données de l'école
 * @returns Une promesse qui résout avec l'objet `School` mis à jour
 */
export const updateSchoolById = async (id: number, data: Omit<School, "id">): Promise<School> => {
  const response = await api.put<School>(`/api/schools/${id}/`, data);
  return response.data;
};

/**
 * Récupère le nombre total d'écoles
 * @returns Une promesse avec le nombre d'écoles
 */
export const getSchoolsCount = async (): Promise<number> => {
  const response = await api.get<{ count: number }>("/api/schools/count/");
  return response.data.count;
}