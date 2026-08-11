-- Coller ce script dans l'éditeur SQL de Neon (neon.tech → projet → SQL Editor)
-- À n'exécuter qu'une seule fois

CREATE TABLE IF NOT EXISTS fiches (
  id            TEXT PRIMARY KEY,
  nom           TEXT NOT NULL,
  prenoms       TEXT NOT NULL,
  datenaissance TEXT NOT NULL,
  nompapa       TEXT,
  nommaman      TEXT,
  photo         TEXT,
  lienparente   TEXT NOT NULL DEFAULT 'fils',
  creele        TEXT NOT NULL
);
