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
  {
    title: 'UnoCSS',
    url: 'https://unocss.dev',
    votes: 32,
  },
  {
    title: 'Una UI',
    url: 'https://unaui.com',
    votes: 28,
  },
  {
    title: 'Onu UI',
    url: 'https://github.com/onu-ui/onu-ui',
    votes: 18,
  },
  {
    title: 'DaisyUI',
    url: 'https://daisyui.com',
    votes: 45,
  },
  {
    title: 'Naive UI',
    url: 'https://naiveui.com',
    votes: 40,
  },
  {
    title: 'Drizzle ORM',
    url: 'https://orm.drizzle.team',
    votes: 36,
  },
  {
    title: 'Bun',
    url: 'https://bun.sh',
    votes: 50,
  },
  {
    title: 'Better-SQLite3',
    url: 'https://github.com/WiseLibs/better-sqlite3',
    votes: 25,
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
