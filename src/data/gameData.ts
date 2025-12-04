import rawData from '../../data/items.json';
import type { GameData, Trip } from '../types';

const data = rawData as GameData;

export const trips: Trip[] = data.trips;

export const getTripById = (tripId: string): Trip | undefined =>
  trips.find((trip) => trip.id === tripId);
