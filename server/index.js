import express from 'express'
import cors from 'cors'
import { db } from './db.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.get('/api/fiches', (_req, res) => {
  const fiches = db.prepare('SELECT * FROM fiches ORDER BY dateNaissance ASC').all()
  res.json(fiches)
})

app.get('/api/fiches/:id', (req, res) => {
  const fiche = db.prepare('SELECT * FROM fiches WHERE id = ?').get(req.params.id)
  if (!fiche) return res.status(404).json({ error: 'Fiche non trouvée' })
  res.json(fiche)
})

app.post('/api/fiches', (req, res) => {
  const { nom, prenoms, dateNaissance, nomPapa, nomMaman, photo, lienParente } = req.body
  const id = crypto.randomUUID()
  const creeLe = new Date().toISOString()

  db.prepare(`
    INSERT INTO fiches (id, nom, prenoms, dateNaissance, nomPapa, nomMaman, photo, lienParente, creeLe)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, nom, prenoms, dateNaissance, nomPapa || null, nomMaman || null, photo || null, lienParente || 'fils', creeLe)

  const fiche = db.prepare('SELECT * FROM fiches WHERE id = ?').get(id)
  res.status(201).json(fiche)
})

app.put('/api/fiches/:id', (req, res) => {
  const { nom, prenoms, dateNaissance, nomPapa, nomMaman, photo, lienParente } = req.body
  db.prepare(`
    UPDATE fiches
    SET nom=?, prenoms=?, dateNaissance=?, nomPapa=?, nomMaman=?, photo=?, lienParente=?
    WHERE id=?
  `).run(nom, prenoms, dateNaissance, nomPapa||null, nomMaman||null, photo||null, lienParente||'fils', req.params.id)
  const fiche = db.prepare('SELECT * FROM fiches WHERE id=?').get(req.params.id)
  if (!fiche) return res.status(404).json({ error: 'Fiche non trouvée' })
  res.json(fiche)
})

app.delete('/api/fiches/:id', (req, res) => {
  db.prepare('DELETE FROM fiches WHERE id = ?').run(req.params.id)
  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => console.log(`Serveur démarré → http://localhost:${PORT}`))
