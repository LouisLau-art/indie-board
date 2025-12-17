import { sql } from 'drizzle-orm'
import { useDatabase, products } from '../database'

// Seed data - interesting indie products to show on first run
const seedProducts = [
    {
        title: 'Vue.js',
        url: 'https://vuejs.org',
        votes: 42,
    },
    {
        title: 'Nuxt',
        url: 'https://nuxt.com',
        votes: 38,
    },
    {
        title: 'Vite',
        url: 'https://vitejs.dev',
        votes: 35,
    },
]

export default defineNitroPlugin(async () => {
    const db = useDatabase()

    // Create tables if they don't exist (simple migration)
    db.run(sql`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      votes INTEGER NOT NULL DEFAULT 0,
      created_at INTEGER NOT NULL
    )
  `)

    db.run(sql`
    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      ip TEXT NOT NULL,
      voted_at INTEGER NOT NULL
    )
  `)

    // Check if products table is empty
    const existingProducts = db.select().from(products).all()

    if (existingProducts.length === 0) {
        console.log('🌱 Seeding database with initial products...')

        for (const product of seedProducts) {
            db.insert(products).values({
                title: product.title,
                url: product.url,
                votes: product.votes,
                createdAt: new Date(),
            }).run()
        }

        console.log('✅ Database seeded successfully!')
    }
})
