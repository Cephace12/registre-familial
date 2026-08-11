import { ref } from 'vue'

const MES_FICHES_KEY = 'registre-mes-fiches'

const fiches = ref([])
const mesFicheIds = ref(JSON.parse(localStorage.getItem(MES_FICHES_KEY) || '[]'))

function sortByBirthDate(list) {
  return [...list].sort((a, b) => new Date(a.dateNaissance) - new Date(b.dateNaissance))
}

function saveMesFiches() {
  localStorage.setItem(MES_FICHES_KEY, JSON.stringify(mesFicheIds.value))
}

export function useFamilyStore() {
  async function chargerFiches() {
    const res = await fetch('/api/fiches')
    fiches.value = await res.json()
  }

  async function ajouterFiche(fiche) {
    const res = await fetch('/api/fiches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fiche)
    })
    const nouvelle = await res.json()
    mesFicheIds.value = [...mesFicheIds.value, nouvelle.id]
    saveMesFiches()
    fiches.value = sortByBirthDate([...fiches.value, nouvelle])
  }

  async function modifierFiche(id, data) {
    const res = await fetch(`/api/fiches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    const updated = await res.json()
    fiches.value = sortByBirthDate(fiches.value.map(f => f.id === id ? updated : f))
    return updated
  }

  async function supprimerFiche(id) {
    await fetch(`/api/fiches/${id}`, { method: 'DELETE' })
    fiches.value = fiches.value.filter((f) => f.id !== id)
    mesFicheIds.value = mesFicheIds.value.filter(i => i !== id)
    saveMesFiches()
  }

  return { fiches, mesFicheIds, chargerFiches, ajouterFiche, modifierFiche, supprimerFiche }
}
