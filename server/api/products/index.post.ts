import { useDatabase, products } from '../../database'

// POST /api/products - Create a new product
export default defineEventHandler(async (event) => {
    const body = await readBody<{ title: string; url: string }>(event)

    // Validate input
    if (!body.title?.trim()) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Title is required',
        })
    }

    if (!body.url?.trim()) {
        throw createError({
            statusCode: 400,
            statusMessage: 'URL is required',
        })
    }

    // Basic URL validation
    try {
        new URL(body.url)
    } catch {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid URL format',
        })
    }

    const db = useDatabase()

    const result = db
        .insert(products)
        .values({
            title: body.title.trim(),
            url: body.url.trim(),
            votes: 0,
            createdAt: new Date(),
        })
        .returning()
        .get()

    return result
})
