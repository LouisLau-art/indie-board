import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// Products table - stores indie products
export const products = sqliteTable('products', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    url: text('url').notNull(),
    votes: integer('votes').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

// Votes table - tracks IP votes for rate limiting
export const votes = sqliteTable('votes', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
    ip: text('ip').notNull(),
    votedAt: integer('voted_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

// Type exports
export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
export type Vote = typeof votes.$inferSelect
export type NewVote = typeof votes.$inferInsert
