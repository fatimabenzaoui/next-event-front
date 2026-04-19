import api from "./api";
import type { Student } from "../models/Student";
import type { Event } from "../models/Event";

export const findAllStudents = async (): Promise<Student[]> => {
  const response = await api.get<Student[]>('/api/students/');
  return response.data;
};

export const findStudentById = async (id: number): Promise<Student> => {
  const response = await api.get<Student>(`/api/students/${id}/`);
  return response.data;
};

export const createStudent = async (data: Omit<Student, 'id' | 'school_name'>): Promise<Student> => {
  const response = await api.post<Student>('/api/students/', data);
  return response.data;
};

export const updateStudent = async (id: number, data: Omit<Student, 'id' | 'school_name'>): Promise<Student> => {
  const response = await api.put<Student>(`/api/students/${id}/`, data);
  return response.data;
};

export const deleteStudentById = async (id: number): Promise<void> => {
  await api.delete(`/api/students/${id}/`);
};

export const getSuggestedEvents = async (id: number): Promise<Event[]> => {
  const response = await api.get<Event[]>(`/api/students/${id}/suggested-events/`);
  return response.data;
};
