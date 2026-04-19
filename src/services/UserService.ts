import api from "./api";
import type { User } from "../models/User";

/**
 * Récupère tous les utilisateurs
 * @returns Une promesse avec la liste des utilisateurs
 */
export const findAllUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/api/auth/users/');
  return response.data;
};