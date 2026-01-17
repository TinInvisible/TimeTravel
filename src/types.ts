export const Destination = {
  Future: 'FUTURE',
  Past: 'PAST'
} as const;

export type Destination = typeof Destination[keyof typeof Destination];

export interface TravelConfig {
  message: string;
  year: string;
  themeColor: string;
  accentColor: string;
  icon: 'rocket' | 'hourglass';
}