import { neon } from '@neondatabase/serverless'
import { randomUUID } from 'crypto'

function getSql() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL non défini')
  return neon(process.env.DATABASE_URL)
}

function toFiche(r) {
  return {
    id: r.id,
    nom: r.nom,
    prenoms: r.prenoms,
    dateNaissance: r.datenaissance,
    nomPapa: r.nompapa ?? null,
    nomMaman: r.nommaman ?? null,
    photo: r.photo ?? null,
    lienParente: r.lienparente ?? 'fils',
    creeLe: r.creele
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const sql = getSql()

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM fiches ORDER BY datenaissance ASC`
      return res.json(rows.map(toFiche))
    }

    if (req.method === 'POST') {
      const { nom, prenoms, dateNaissance, nomPapa, nomMaman, photo, lienParente } = req.body
      const id = randomUUID()
      const creeLe = new Date().toISOString()
      const [row] = await sql`
        INSERT INTO fiches (id, nom, prenoms, datenaissance, nompapa, nommaman, photo, lienparente, creele)
        VALUES (${id}, ${nom}, ${prenoms}, ${dateNaissance},
                ${nomPapa ?? null}, ${nomMaman ?? null}, ${photo ?? null},
                ${lienParente ?? 'fils'}, ${creeLe})
        RETURNING *
      `
      return res.status(201).json(toFiche(row))
    }

    res.status(405).json({ error: 'Méthode non autorisée' })
  } catch (err) {
    console.error('[API /fiches]', err)
    res.status(500).json({ error: err.message })
  }
}
