
export interface User {
  username: string;
  password?: string; // Password is not stored on the user object after login
}

export type CelebrationStatus = 'Pagado' | 'Pendiente';

export interface Celebration {
  folio: string;
  requesterName: string;
  celebrationType: string;
  date: string;
  time: string;
  location: string;
  totalCost: number;
  payments: { amount: number; date: string }[];
  status: CelebrationStatus;
}

export type IntentionType = 'Difuntos' | 'Acción de Gracias' | 'Salud';

export interface Intention {
  id: string;
  intentionFor: string;
  intentionType: IntentionType;
  time: '8:00 AM' | '7:00 PM';
  payment: number;
  date: string;
}

export type Page = 'dashboard' | 'registrations' | 'search' | 'intentions' | 'reports' | 'all-celebrations';
