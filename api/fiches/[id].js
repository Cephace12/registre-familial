import { neon } from '@neondatabase/serverless'

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
    profession: r.profession ?? null,
    situationMatrimoniale: r.situationmatrimoniale ?? null,
    nombreEnfants: r.nombreenfants ?? null,
    creeLe: r.creele
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { id } = req.query

  try {
    const sql = getSql()

    if (req.method === 'GET') {
      const [row] = await sql`SELECT * FROM fiches WHERE id = ${id}`
      if (!row) return res.status(404).json({ error: 'Fiche non trouvée' })
      return res.json(toFiche(row))
    }

    if (req.method === 'PUT') {
      const { nom, prenoms, dateNaissance, nomPapa, nomMaman, photo, lienParente, profession, situationMatrimoniale, nombreEnfants } = req.body
      const [row] = await sql`
        UPDATE fiches
        SET nom = ${nom}, prenoms = ${prenoms}, datenaissance = ${dateNaissance},
            nompapa = ${nomPapa ?? null}, nommaman = ${nomMaman ?? null},
            photo = ${photo ?? null}, lienparente = ${lienParente ?? 'fils'},
            profession = ${profession ?? null},
            situationmatrimoniale = ${situationMatrimoniale ?? null},
            nombreenfants = ${nombreEnfants !== '' && nombreEnfants != null ? Number(nombreEnfants) : null}
        WHERE id = ${id}
        RETURNING *
      `
      if (!row) return res.status(404).json({ error: 'Fiche non trouvée' })
      return res.json(toFiche(row))
    }

    if (req.method === 'DELETE') {
      await sql`DELETE FROM fiches WHERE id = ${id}`
      return res.status(204).end()
    }

    res.status(405).json({ error: 'Méthode non autorisée' })
  } catch (err) {
    console.error('[API /fiches/:id]', err)
    res.status(500).json({ error: err.message })
  }
}
