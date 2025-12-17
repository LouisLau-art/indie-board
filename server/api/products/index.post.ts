import { eq, or } from 'drizzle-orm'
import { useDatabase, products } from '../../database'

// Extract root domain from URL (remove subdomain, path, protocol)
function extractRootDomain(urlString: string): string {
    try {
        const url = new URL(urlString)
        const hostname = url.hostname

        // Handle special cases like github.com/user/repo
        if (hostname === 'github.com') {
            // Keep github.com/user/repo format for projects
            const pathParts = url.pathname.split('/').filter(Boolean)
            if (pathParts.length >= 2) {
                return `github.com/${pathParts[0]}/${pathParts[1]}`
            }
            return hostname
        }

        // Remove common subdomain prefixes (www, cn, docs, etc.)
        const parts = hostname.split('.')
        if (parts.length > 2) {
            // Keep only last two parts (e.g., vuejs.org from cn.vuejs.org)
            return parts.slice(-2).join('.')
        }
        return hostname
    } catch {
        return urlString
    }
}

// POST /api/products - Create a new product
export default defineEventHandler(async (event) => {
    const body = await readBody<{ title: string; url: string }>(event)

    // Validate input
    if (!body.title?.trim()) {
        throw createError({
            statusCode: 400,
            statusMessage: '请输入产品名称',
        })
    }

    if (!body.url?.trim()) {
        throw createError({
            statusCode: 400,
            statusMessage: '请输入产品链接',
        })
    }

    // Basic URL validation
    try {
        new URL(body.url)
    } catch {
        throw createError({
            statusCode: 400,
            statusMessage: 'URL 格式无效',
        })
    }

    const db = useDatabase()
    const titleLower = body.title.trim().toLowerCase()
    const rootDomain = extractRootDomain(body.url.trim())

    // Check for duplicate by title (case-insensitive) using Drizzle
    const existingProducts = db.select().from(products).all()

    // Check title duplicate (case-insensitive)
    const titleDuplicate = existingProducts.find(
        p => p.title.toLowerCase() === titleLower
    )
    if (titleDuplicate) {
        throw createError({
            statusCode: 409,
            statusMessage: `产品 "${titleDuplicate.title}" 已存在`,
        })
    }

    // Check URL duplicate (by root domain)
    const urlDuplicate = existingProducts.find(
        p => extractRootDomain(p.url) === rootDomain
    )
    if (urlDuplicate) {
        throw createError({
            statusCode: 409,
            statusMessage: `该网站已存在：${urlDuplicate.title} (${urlDuplicate.url})`,
        })
    }

    // Normalize URL to root/clean version
    let cleanUrl = body.url.trim()
    try {
        const url = new URL(cleanUrl)
        // Keep only origin for non-GitHub URLs
        if (url.hostname !== 'github.com') {
            cleanUrl = url.origin
        } else {
            // For GitHub, keep user/repo
            const pathParts = url.pathname.split('/').filter(Boolean)
            if (pathParts.length >= 2) {
                cleanUrl = `https://github.com/${pathParts[0]}/${pathParts[1]}`
            }
        }
    } catch {
        // Keep original if parsing fails
    }

    const result = db
        .insert(products)
        .values({
            title: body.title.trim(),
            url: cleanUrl,
            votes: 0,
            createdAt: new Date(),
        })
        .returning()
        .get()

    return result
})

