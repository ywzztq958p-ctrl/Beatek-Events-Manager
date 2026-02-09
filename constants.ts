import { EventData, EventStatus, EventType } from './types';

// Beatek Brand Colors
export const COLORS = {
  primary: '#d946ef', // fuchsia-500
  darkBg: '#09090b',  // zinc-950
  cardBg: '#18181b',  // zinc-900
};

const TODAY = new Date();
const getFutureDate = (days: number) => {
    const future = new Date(TODAY);
    future.setDate(TODAY.getDate() + days);
    return future.toISOString();
};


// Start with a list of mock events to demonstrate functionality
export const MOCK_EVENTS: EventData[] = [
  {
    id: 'evt-1',
    title: 'Mariage de Sophie & Léo',
    date: getFutureDate(10),
    startTime: '16:00',
    endTime: '02:00',
    location: 'Domaine de la Forêt, Mont-Tremblant, QC',
    type: EventType.WEDDING,
    status: EventStatus.SIGNED,
    client: {
      name: 'Sophie Dubois',
      email: 'sophie.d@example.com',
      phone: '514-111-2222',
    },
    assignedStaff: ['DJ Alex', 'MC Jean'],
    equipment: ['Système de son complet', 'Éclairage d\'ambiance', 'Machine à fumée', 'Micro sans fil'],
    notes: 'Playlist spéciale pour la première danse : "Perfect" - Ed Sheeran. Annoncer les discours après le repas principal. Ne pas prendre de demandes de chansons Country.',
    contract: {
      generatedDate: getFutureDate(-5),
      amount: 2500,
      deposit: 500,
      isSignedClient: true,
      isSignedBeatek: true,
      clientSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFJSURBVHhe7cExAQAAAMKg9U9tCU+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD42wANWwABv9DDcgAAAABJRU5ErkJggg==', // Dummy signature
      specialClauses: ['En cas de pluie, l\'équipement sera installé sous la tente fournie par le client.'],
    },
    reminders: [
      { id: 'rem-1-1', label: 'Confirmer la playlist finale', offsetMinutes: 7 * 24 * 60, isDismissed: false },
      { id: 'rem-1-2', label: 'Appel de coordination', offsetMinutes: 2 * 24 * 60, isDismissed: false },
    ],
  },
  {
    id: 'evt-2',
    title: 'Gala Corporatif de TechNova Inc.',
    date: getFutureDate(25),
    startTime: '18:00',
    endTime: '23:00',
    location: 'Hôtel Le St-James, Montréal, QC',
    type: EventType.CORPORATE,
    status: EventStatus.CONTRACT_SENT,
    client: {
      name: 'Martin Tremblay',
      email: 'martin.t@technova.com',
      phone: '438-333-4444',
      company: 'TechNova Inc.',
    },
    assignedStaff: ['DJ White'],
    equipment: ['Système de son pour discours', 'Projecteur et écran', 'Micros-cravates'],
    notes: 'Musique d\'ambiance (lounge/jazz) pendant le cocktail. Discours prévus à 19h30. Logo de TechNova à projeter sur l\'écran.',
    contract: {
      generatedDate: getFutureDate(-2),
      amount: 3200,
      deposit: 800,
      isSignedClient: false,
      isSignedBeatek: true,
    },
    reminders: [],
  },
  {
    id: 'evt-3',
    title: 'Anniversaire 30 ans - Sarah',
    date: getFutureDate(5),
    startTime: '20:00',
    endTime: '01:00',
    location: 'Loft St-Ambroise, Montréal, QC',
    type: EventType.PRIVATE,
    status: EventStatus.CONFIRMED,
    client: {
      name: 'Sarah Gagnon',
      email: 'sarah.g@example.com',
      phone: '514-555-6666',
    },
    assignedStaff: ['DJ Fred'],
    equipment: ['Contrôleur DJ', '2x Haut-parleurs'],
    notes: 'Thème années 90. Beaucoup de demandes pour du Pop et R&B de cette époque.',
    contract: {
      generatedDate: getFutureDate(-10),
      amount: 1200,
      deposit: 300,
      isSignedClient: false,
      isSignedBeatek: true,
    },
    reminders: [
       { id: 'rem-3-1', label: 'Envoyer le contrat pour signature', offsetMinutes: 4320, isDismissed: false },
    ],
  },
   {
    id: 'evt-4',
    title: 'Demande pour Festival "Son et Lumière"',
    date: getFutureDate(60),
    startTime: '14:00',
    endTime: '22:00',
    location: 'Parc Jean-Drapeau, Montréal, QC',
    type: EventType.FESTIVAL,
    status: EventStatus.INQUIRY,
    client: {
      name: 'Julien Roy',
      email: 'j.roy@festivalsmtl.com',
      phone: '438-777-8888',
      company: 'Festivals Montréal',
    },
    assignedStaff: [],
    equipment: [],
    notes: 'Demande d\'information pour la scène secondaire. Besoin d\'une soumission pour 3 DJs sur 8 heures.',
    reminders: [],
  },
];
