import z from "zod";

// Match status values within a tournament bracket/round
export const MatchStatusEnum = z.enum([
  'PENDING', // created but not started
  'READY', // all participants ready / lobby prepared
  'IN_PROGRESS', // match ongoing
  'COMPLETED', // finished with a winner
  'CANCELED', // intentionally canceled before completion
  'VOID', // invalidated / discarded result
]);

export type MatchStatus = z.infer<typeof MatchStatusEnum>;
