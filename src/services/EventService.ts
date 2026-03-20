import api from "./api";
import type { Event } from "../models/Event";

/**
 * Récupère tous les événements depuis l'API [DASHBOARD]
 * @returns Une promesse avec la liste des événements
 */
export const findAllEvents = async (): Promise<Event[]> => {
  const response = await api.get<Event[]>("api/events/");
  return response.data;
}

/**
 * Récupère tous les événements depuis l'API [HOME]
 * @returns Une promesse avec la liste des événements
 */
export const findAllHomeEvents = async (): Promise<Event[]> => {
  const response = await api.get<Event[]>("api/events/current/");
  return response.data;
}

/**
 * Récupère un événement par son ID
 * @param id L'ID de l'événement
 * @returns Une promesse avec l'événement
 */
export const findEventById = async (id: number): Promise<Event> => {
  const response = await api.get<Event>(`api/events/${id}/`);
  return response.data;
}

/**
 * Crée un nouvel événement avec un flyer
 * @param formData Les données du formulaire (incluant le flyer)
 * @returns Une promesse avec l'événement créé
 */
export const createEvent = async (formData: FormData): Promise<Event> => {
  const response = await api.post<Event>("/api/events/", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

/**
 * Met à jour un évènement
 * @param eventId 
 * @param formData 
 * @returns 
 */
export const updateEventById = async (eventId: number, formData: FormData): Promise<Event> => {
  const response = await api.put<Event>(`/api/events/${eventId}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

/**
 * Supprime un événement par son ID
 * @param id L'ID de l'événement à supprimer
 * @returns Une promesse qui se résout si la suppression est réussie
 */
export const deleteEventById = async (id: number): Promise<void> => {
  await api.delete(`/api/events/${id}/`);
}


/**
 * Récupère le nombre total d'évènements
 * @returns Une promesse avec le nombre d'évènements
 */
export const getEventsCount = async (): Promise<number> => {
  const response = await api.get<{ count: number }>("/api/events/count/");
  return response.data.count;
}

/**
 * Récupère le nombre d'évènements par mois
 * @returns Une promesse avec une liste d'objets contenant le mois et le nombre d'évènements pour ce mois
 */
export const getEventsByMonth = async (): Promise<Array<{ month: string; count: number }>> => {
  const response = await api.get<Array<{ month: string; count: number }>>("/api/events/by-month/");
  return response.data;
}

/**
 * Récupère le nombre d'évènements par catégorie
 * @returns Une promesse avec une liste d'objets contenant le nom de la catégorie et le nombre d'évènements pour cette catégorie
 */
export const getEventsByCategory = async (): Promise<Array<{ category: string; count: number }>> => {
  const response = await api.get<Array<{ category: string; count: number }>>("/api/events/count-by-category/");
  return response.data;
}

/**
 * Récupère le nombre d'évènements par ville
 * @returns Une promesse avec une liste d'objets contenant le nom de la ville et le nombre d'évènements pour cette ville
 */
export const getEventsByCity = async (): Promise<Array<{ name: string; event_count: number }>> => {
  const response = await api.get<Array<{ name: string; event_count: number }>>("/api/events/count-by-city/");
  return response.data;
}

/**
 * Récupère le nombre d'évènements par école
 * @returns Une promesse avec une liste d'objets contenant le nom de l'école et le nombre d'évènements pour cette école
 */
export const getEventsBySchool = async (): Promise<Array<{ name: string; event_count: number }>> => {
  const response = await api.get<Array<{ name: string; event_count: number }>>("/api/events/count-by-school/");
  return response.data;
}

/**
 * Récupère le nombre d'évènements par association
 * @returns Une promesse avec une liste d'objets contenant le nom de l'association et le nombre d'évènements pour cette association
 */
export const getEventsByAssociation = async (): Promise<Array<{ name: string; event_count: number }>> => {
  const response = await api.get<Array<{ name: string; event_count: number }>>("/api/events/count-by-association/");
  return response.data;
}

/**
 * Récupère le top 5 des villes les plus actives (qui a le plus d'évènements)
 * @returns Une promesse avec une liste d'objets contenant le nom de la ville et le nombre d'évènements pour cette ville
 */
export const getTop5Cities = async (): Promise<Array<{ name: string; event_count: number }>> => {
  const response = await api.get<Array<{ name: string; event_count: number }>>("/api/events/top-5-cities/");
  return response.data;
};


/**
 * Récupère les événements d'une ville spécifique
 * @param cityId L'ID de la ville pour laquelle récupérer les événements 
 * @returns Une promesse avec la liste des événements pour cette ville
 */
export const findEventsByCity = async (cityId: number): Promise<Event[]> => {
  const response = await api.get(`/api/events/?city_id=${cityId}`);
  return response.data;
}


/**
 * Récupère les événements d'une catégorie spécifique
 * @param categoryId L'ID de la catégorie pour laquelle récupérer les événements
 * @returns Une promesse avec la liste des événements pour cette catégorie
 */
export const findEventsByCategory = async (categoryId: number): Promise<Event[]> => {
  const response = await api.get<Event[]>(`/api/events/?category_id=${categoryId}`);
  return response.data;
}

/**
 * Récupère les événements d'une école spécifique
 * @param schoolId L'ID de l'école pour laquelle récupérer les événements
 * @returns Une promesse avec la liste des événements pour cette école
 */
export const findEventsBySchool = async (schoolId: number): Promise<Event[]> => {
  const response = await api.get<Event[]>(`/api/events/?school_id=${schoolId}`);
  return response.data;
}

/**
 * Récupère les événements d'une association spécifique
 * @param associationId L'ID de l'association pour laquelle récupérer les événements
 * @returns Une promesse avec la liste des événements pour cette association
 */
export const findEventsByAssociation = async (associationId: number): Promise<Event[]> => {
  const response = await api.get<Event[]>(`/api/events/?association_id=${associationId}`);
  return response.data;
}

