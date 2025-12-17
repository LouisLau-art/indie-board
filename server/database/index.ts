import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'

// Singleton pattern for database connection
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function useDatabase() {
    if (!_db) {
        const sqlite = new Database('./sqlite.db')
        // Enable WAL mode for better concurrent performance
        sqlite.pragma('journal_mode = WAL')
        _db = drizzle(sqlite, { schema })
    }
    return _db
}

// Re-export schema for convenience
export * from './schema'
