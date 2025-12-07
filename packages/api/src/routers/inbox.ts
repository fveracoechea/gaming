import { db, schema } from '@gaming/db';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { z } from 'zod';

import { procedures as p } from '../procedure';

/**
 * Get all inbox messages for the current user
 */
export const findMyMessages = p.protected.handler(async ({ context }) => {
  const messages = await db.query.inbox.findMany({
    where: eq(schema.inbox.userId, context.auth.user.id),
    orderBy: desc(schema.inbox.createdAt),
    limit: 100,
  });

  return messages;
});

/**
 * Get unread inbox messages for the current user
 */
export const findUnreadMessages = p.protected.handler(async ({ context }) => {
  const messages = await db.query.inbox.findMany({
    where: and(eq(schema.inbox.userId, context.auth.user.id), isNull(schema.inbox.readAt)),
    orderBy: desc(schema.inbox.createdAt),
    limit: 100,
  });

  return messages;
});

/**
 * Get count of unread messages
 */
export const getUnreadCount = p.protected.handler(async ({ context: { auth } }) => {
  const count = await db.$count(
    schema.inbox,
    and(eq(schema.inbox.userId, auth.user.id), isNull(schema.inbox.readAt)),
  );
  return count;
});

/**
 * Mark a message as read
 */
export const markAsRead = p.protected
  .input(
    z.object({
      messageId: z.uuid(),
    }),
  )
  .handler(async ({ context, input }) => {
    const [message] = await db
      .update(schema.inbox)
      .set({ readAt: new Date() })
      .where(
        and(
          eq(schema.inbox.id, input.messageId),
          eq(schema.inbox.userId, context.auth.user.id),
        ),
      )
      .returning();

    return message;
  });

/**
 * Mark all messages as read
 */
export const markAllAsRead = p.protected.handler(async ({ context }) => {
  await db
    .update(schema.inbox)
    .set({ readAt: new Date() })
    .where(and(eq(schema.inbox.userId, context.auth.user.id), isNull(schema.inbox.readAt)));

  return { success: true };
});

/**
 * Delete a message
 */
export const deleteMessage = p.protected
  .input(
    z.object({
      messageId: z.uuid(),
    }),
  )
  .handler(async ({ context, input }) => {
    await db
      .delete(schema.inbox)
      .where(
        and(
          eq(schema.inbox.id, input.messageId),
          eq(schema.inbox.userId, context.auth.user.id),
        ),
      );

    return { success: true };
  });
