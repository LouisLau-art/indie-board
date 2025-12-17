import { eq, and, gt, sql } from 'drizzle-orm'
import { useDatabase, products, votes } from '../../../database'

// POST /api/products/:id/vote - Vote for a product
export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))

    if (isNaN(id)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid product ID',
        })
    }

    // Get client IP for rate limiting
    const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'

    const db = useDatabase()

    // Check if product exists
    const product = db.select().from(products).where(eq(products.id, id)).get()

    if (!product) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Product not found',
        })
    }

    // Check if user already voted in the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const existingVote = db
        .select()
        .from(votes)
        .where(
            and(
                eq(votes.productId, id),
                eq(votes.ip, ip),
                gt(votes.votedAt, twentyFourHoursAgo)
            )
        )
        .get()

    if (existingVote) {
        throw createError({
            statusCode: 429,
            statusMessage: 'You already voted for this product today. Try again tomorrow!',
        })
    }

    // Record the vote
    db.insert(votes).values({
        productId: id,
        ip,
        votedAt: new Date(),
    }).run()

    // Increment vote count
    const updated = db
        .update(products)
        .set({ votes: sql`${products.votes} + 1` })
        .where(eq(products.id, id))
        .returning()
        .get()

    return updated
})
