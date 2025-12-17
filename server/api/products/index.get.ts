import { desc } from 'drizzle-orm'
import { useDatabase, products } from '../../database'

// GET /api/products - List all products ordered by votes
export default defineEventHandler(async () => {
    const db = useDatabase()

    const allProducts = db
        .select()
        .from(products)
        .orderBy(desc(products.votes))
        .all()

    return allProducts
})
