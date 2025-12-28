export enum PoliceStation {
  ENGLISH_BAZAR = 'English Bazar',
  OLD_MALDA = 'Old Malda',
  KALIACHAK = 'Kaliachak',
  CHANCHAL = 'Chanchal',
  RATUA = 'Ratua',
  GAZOLE = 'Gazole',
  MANIKCHAK = 'Manikchak',
  BAMANGOLA = 'Bamangola',
  HABIBPUR = 'Habibpur',
  HARISHCHANDRAPUR = 'Harishchandrapur',
  PUKHURIA = 'Pukhuria',
  VAISHNAVNAGAR = 'Vaishnavnagar',
  MOTHABARI = 'Mothabari',
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  policeStation: PoliceStation;
  bio: string;
  photos: string[]; // Array of data URLs
  interests: string[];
  phoneNumber?: string;
  password?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface ChatSession {
  id: string;
  participant: UserProfile; // The other person
  messages: Message[];
}

export type ViewState = 'landing' | 'onboarding' | 'dashboard';
export type DashboardTab = 'public' | 'random' | 'messages' | 'profile';