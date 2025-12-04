export type ItemTag = 'essential' | 'useful' | 'not_required' | 'trap';

export interface TripItem {
  name: string;
  tag: ItemTag;
}

export interface Trip {
  id: string;
  name: string;
  roundItemCount: {
    min: number;
    max: number;
  };
  difficultyDefaults: Record<'easy' | 'medium' | 'hard', number>;
  recommendedLoadout: string[];
  items: TripItem[];
}

export interface GameData {
  trips: Trip[];
}

type DecisionType = 'pack' | 'reject';

export interface DecisionRecord {
  item: TripItem;
  decision: DecisionType;
  correct: boolean;
}
