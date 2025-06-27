import { pgTable, uuid, text, boolean, timestamp, unique } from 'drizzle-orm/pg-core';

export const prompts = pgTable('prompts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  isPublic: boolean('is_public').default(false),
  userId: text('user_id'),
  version: text('version'),
  tags: text('tags'),
  coverImg: text('cover_img')
});

export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  userId: text('user_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniqNameUser: unique().on(table.name, table.userId)
}));