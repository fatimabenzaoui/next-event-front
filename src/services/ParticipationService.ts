import api from "./api";
import type { EventParticipation, ParticipationStatus } from "../models/EventParticipation";

export const findAllParticipations = async (): Promise<EventParticipation[]> => {
  const response = await api.get<EventParticipation[]>('/api/participations/');
  return response.data;
};

export const findParticipationsByStudent = async (studentId: number): Promise<EventParticipation[]> => {
  const response = await api.get<EventParticipation[]>(`/api/participations/?student_id=${studentId}`);
  return response.data;
};

export const findParticipationsByEvent = async (eventId: number): Promise<EventParticipation[]> => {
  const response = await api.get<EventParticipation[]>(`/api/participations/?event_id=${eventId}`);
  return response.data;
};

export const createParticipation = async (data: { student: number; event: number; status?: ParticipationStatus }): Promise<EventParticipation> => {
  const response = await api.post<EventParticipation>('/api/participations/', data);
  return response.data;
};

export const updateParticipationStatus = async (id: number, status: ParticipationStatus): Promise<EventParticipation> => {
  const response = await api.patch<EventParticipation>(`/api/participations/${id}/`, { status });
  return response.data;
};

export const deleteParticipationById = async (id: number): Promise<void> => {
  await api.delete(`/api/participations/${id}/`);
};
