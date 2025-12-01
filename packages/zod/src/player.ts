import z from 'zod';

export const SearchPlayersSchema = z.object({
  query: z
    .string()
    .min(1, 'Search query cannot be empty')
    .max(100, 'Search query is too long'),
});

export const CreatePlayerProfileSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  description: z.string().max(1000, 'Description is too long').optional(),
  matchesPlayed: z.number().int().min(0).default(0),
  tournamentsWon: z.number().int().min(0).default(0),
  tournamentsPlayed: z.number().int().min(0).default(0),
});

export const UpdatePlayerProfileSchema = z.object({
  description: z.string().max(1000, 'Description is too long').optional(),
  matchesPlayed: z.number().int().min(0).optional(),
  tournamentsWon: z.number().int().min(0).optional(),
  tournamentsPlayed: z.number().int().min(0).optional(),
});
