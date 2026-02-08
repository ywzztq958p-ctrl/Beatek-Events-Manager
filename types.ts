
export enum EventType {
  WEDDING = 'Mariage',
  CORPORATE = 'Corporatif',
  PRIVATE = 'Privé',
  CLUB = 'Club/Bar',
  FESTIVAL = 'Festival'
}

export enum EventStatus {
  INQUIRY = 'Demande',
  CONFIRMED = 'Confirmé',
  CONTRACT_SENT = 'Contrat envoyé',
  SIGNED = 'Signé',
  COMPLETED = 'Terminé',
  CANCELLED = 'Annulé'
}

export interface Client {
  name: string;
  email: string;
  phone: string;
  company?: string;
}

export interface ContractDetails {
  generatedDate: string;
  amount: number;
  deposit: number;
  isSignedClient: boolean;
  isSignedBeatek: boolean;
  clientSignature?: string; // base64 data URI
  specialClauses?: string[];
}

export interface Reminder {
  id: string;
  label: string;
  offsetMinutes: number; // Minutes before event start
  isDismissed: boolean;
}

export interface EventData {
  id: string;
  title: string;
  date: string; // ISO string
  startTime: string;
  endTime: string;
  location: string;
  type: EventType;
  status: EventStatus;
  client: Client;
  assignedStaff: string[];
  equipment: string[];
  notes: string;
  contract?: ContractDetails;
  reminders: Reminder[];
}

export type ViewState = 'DASHBOARD' | 'CALENDAR' | 'EVENTS' | 'SETTINGS';
