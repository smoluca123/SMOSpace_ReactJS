/**
 * Central catalogue of post reactions. Keep the order here in sync with the
 * `ReactionType` enum on the server (`prisma/schema.prisma`). The picker UI
 * and the engagement-metrics counter both consume this list, so adding a new
 * reaction is a one-line change.
 */
export type IReactionType = 'LIKE' | 'LOVE' | 'HAHA' | 'WOW' | 'SAD' | 'ANGRY';

export interface IReactionConfig {
  type: IReactionType;
  emoji: string;
  label: string;
  /** Tailwind color class applied when this reaction is the user's choice. */
  activeColor: string;
}

export const REACTIONS: IReactionConfig[] = [
  { type: 'LIKE', emoji: '👍', label: 'Like', activeColor: 'text-blue-500' },
  { type: 'LOVE', emoji: '❤️', label: 'Love', activeColor: 'text-red-500' },
  { type: 'HAHA', emoji: '😂', label: 'Haha', activeColor: 'text-yellow-500' },
  { type: 'WOW', emoji: '😮', label: 'Wow', activeColor: 'text-yellow-500' },
  { type: 'SAD', emoji: '😢', label: 'Sad', activeColor: 'text-yellow-500' },
  { type: 'ANGRY', emoji: '😡', label: 'Angry', activeColor: 'text-orange-500' },
];

const REACTION_BY_TYPE: Record<IReactionType, IReactionConfig> = REACTIONS.reduce(
  (acc, reaction) => {
    acc[reaction.type] = reaction;
    return acc;
  },
  {} as Record<IReactionType, IReactionConfig>,
);

export function getReactionConfig(type: IReactionType | null | undefined): IReactionConfig {
  return type ? REACTION_BY_TYPE[type] : REACTION_BY_TYPE.LIKE;
}

export type IReactionCounts = Record<IReactionType, number>;

export function buildEmptyReactionCounts(): IReactionCounts {
  return REACTIONS.reduce((acc, { type }) => {
    acc[type] = 0;
    return acc;
  }, {} as IReactionCounts);
}

/** Top-N reaction types sorted by count (desc), zero-count entries dropped. */
export function getTopReactions(counts: IReactionCounts | undefined, limit = 3): IReactionConfig[] {
  if (!counts) return [];
  return REACTIONS.filter((reaction) => (counts[reaction.type] ?? 0) > 0)
    .sort((a, b) => (counts[b.type] ?? 0) - (counts[a.type] ?? 0))
    .slice(0, limit);
}
