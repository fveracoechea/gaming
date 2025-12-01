import type { InboxData } from '@gaming/zod/inbox';
import * as t from 'drizzle-orm/pg-core';

import { id, timestamps } from '../common';
import { user } from './auth';

/**
 * Inbox messages for notifying players of actions or events
 * Stores notifications about team invites, rejections, role updates, tournament results, etc.
 * Each message is linked to a user and contains structured data in JSONB format
 */
export const inbox = t.pgTable('inbox', {
  id,
  userId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  data: t.jsonb().$type<InboxData>().notNull(),
  readAt: t.timestamp({ withTimezone: true, mode: 'date' }),
  ...timestamps,
});
