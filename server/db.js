import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const db = new Database(join(__dirname, '../registre.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS fiches (
    id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    prenoms TEXT NOT NULL,
    dateNaissance TEXT NOT NULL,
    nomPapa TEXT,
    nomMaman TEXT,
    photo TEXT,
    creeLe TEXT NOT NULL
  )
`)

// Migration : ajoute la colonne si la table existait avant cette version
try {
  db.exec(`ALTER TABLE fiches ADD COLUMN lienParente TEXT NOT NULL DEFAULT 'fils'`)
} catch (_) { /* colonne déjà présente */ }

export { db }
