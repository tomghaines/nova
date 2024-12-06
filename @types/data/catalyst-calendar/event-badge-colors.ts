import type { BadgeColor } from './badge-colors';

export type EventType =
  | 'General'
  | 'AMA'
  | 'Announcement'
  | 'Earning'
  | 'Branding'
  | 'Burning'
  | 'Conference'
  | 'Contest'
  | 'Exchange'
  | 'Hard Fork'
  | 'Regulation'
  | 'Meetup'
  | 'Partnership'
  | 'Release'
  | 'Swap'
  | 'Testing'
  | 'Update'
  | 'Report'
  | 'NFT'
  | 'DAO'
  | 'Marketing'
  | 'Lock & Unlock';

// Updated color map to ensure the color type is restricted
export const eventTypeToColor: Record<EventType, BadgeColor> = {
  General: 'green',
  AMA: 'ruby',
  Announcement: 'tomato',
  Earning: 'grass',
  Branding: 'gold',
  Burning: 'amber',
  Conference: 'orange',
  Contest: 'plum',
  Exchange: 'pink',
  'Hard Fork': 'crimson',
  Regulation: 'purple',
  Meetup: 'plum',
  Partnership: 'iris',
  Release: 'violet',
  Swap: 'yellow',
  Testing: 'red',
  Update: 'teal',
  Report: 'green',
  NFT: 'grass',
  DAO: 'sky',
  Marketing: 'mint',
  'Lock & Unlock': 'lime'
};
