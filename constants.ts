import { PoliceStation, UserProfile } from './types';

export const POLICE_STATIONS = Object.values(PoliceStation);

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'm1',
    name: 'Rahul Roy',
    age: 24,
    gender: 'Male',
    policeStation: PoliceStation.ENGLISH_BAZAR,
    bio: 'Loves cricket and evening walks near Mahananda river.',
    photos: ['https://picsum.photos/400/600?random=1', 'https://picsum.photos/400/600?random=2', 'https://picsum.photos/400/600?random=3'],
    interests: ['Cricket', 'Music'],
  },
  {
    id: 'f1',
    name: 'Priya Das',
    age: 22,
    gender: 'Female',
    policeStation: PoliceStation.OLD_MALDA,
    bio: 'Foodie. Looking for someone to share momos with.',
    photos: ['https://picsum.photos/400/600?random=4', 'https://picsum.photos/400/600?random=5', 'https://picsum.photos/400/600?random=6'],
    interests: ['Food', 'Travel'],
  },
  {
    id: 'm2',
    name: 'Amit Sk',
    age: 26,
    gender: 'Male',
    policeStation: PoliceStation.KALIACHAK,
    bio: 'Simple living, high thinking.',
    photos: ['https://picsum.photos/400/600?random=7', 'https://picsum.photos/400/600?random=8', 'https://picsum.photos/400/600?random=9'],
    interests: ['Reading', 'Tech'],
  },
  {
    id: 'f2',
    name: 'Sneha Mondal',
    age: 23,
    gender: 'Female',
    policeStation: PoliceStation.GAZOLE,
    bio: 'Nature lover. Mango season is my favorite season.',
    photos: ['https://picsum.photos/400/600?random=10', 'https://picsum.photos/400/600?random=11', 'https://picsum.photos/400/600?random=12'],
    interests: ['Nature', 'Photography'],
  }
];

export const INITIAL_PUBLIC_MESSAGES = [
  { id: '1', senderId: 'm1', senderName: 'Rahul Roy', text: 'Anyone up for a chat?', timestamp: Date.now() - 100000 },
  { id: '2', senderId: 'f1', senderName: 'Priya Das', text: 'Hello everyone from Old Malda!', timestamp: Date.now() - 50000 },
];