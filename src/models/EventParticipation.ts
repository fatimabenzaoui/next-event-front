export type ParticipationStatus = 'REGISTERED' | 'CONFIRMED' | 'ATTENDED' | 'CANCELLED';

export interface EventParticipation {
  id: number;
  student: number;
  student_name: string;
  event: number;
  event_name: string;
  registration_date: string;
  status: ParticipationStatus;
}
