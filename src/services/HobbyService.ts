import api from "./api";
import type { Hobby } from "../models/Hobby";

export const findAllHobbies = async (): Promise<Hobby[]> => {
  const response = await api.get<Hobby[]>('/api/hobbies/');
  return response.data;
};

export const createHobby = async (data: Omit<Hobby, 'id'>): Promise<Hobby> => {
  const response = await api.post<Hobby>('/api/hobbies/', data);
  return response.data;
};

export const updateHobby = async (id: number, data: Omit<Hobby, 'id'>): Promise<Hobby> => {
  const response = await api.put<Hobby>(`/api/hobbies/${id}/`, data);
  return response.data;
};

export const deleteHobbyById = async (id: number): Promise<void> => {
  await api.delete(`/api/hobbies/${id}/`);
};
