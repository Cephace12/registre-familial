import { neon } from '@neondatabase/serverless'

export default async function handler(req, res) {
  const diagnostic = {
    DATABASE_URL_present: !!process.env.DATABASE_URL,
    DATABASE_URL_prefix: process.env.DATABASE_URL
      ? process.env.DATABASE_URL.substring(0, 35) + '...'
      : null,
    node_version: process.version,
    timestamp: new Date().toISOString(),
    db_ok: false,
    db_error: null,
    fiches_count: null
  }

  if (process.env.DATABASE_URL) {
    try {
      const sql = neon(process.env.DATABASE_URL)
      const [{ count }] = await sql`SELECT COUNT(*) as count FROM fiches`
      diagnostic.db_ok = true
      diagnostic.fiches_count = Number(count)
    } catch (err) {
      diagnostic.db_error = err.message
    }
  }

  res.json(diagnostic)
}
