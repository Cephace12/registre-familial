<script setup>
import { ref, computed } from 'vue'
import { useFamilyStore } from '../composables/useFamilyStore'
import FamilyList from '../components/FamilyList.vue'

const { fiches, supprimerFiche } = useFamilyStore()

const sortOrder  = ref('asc')
const filterLien = ref('tous')

const FILTRES = [
  { value: 'tous',               label: 'Tous' },
  { value: 'fils',               label: 'Fils' },
  { value: 'petit-fils',         label: 'Petit-fils' },
  { value: 'arriere-petit-fils', label: 'Arr.-petit-fils' }
]

function lien(f) {
  return f.lienParente || 'fils'
}

function setFilter(v) { filterLien.value = v }
function setSort(v)   { sortOrder.value  = v }

const counts = computed(() => ({
  tous:               fiches.value.length,
  fils:               fiches.value.filter(f => lien(f) === 'fils').length,
  'petit-fils':       fiches.value.filter(f => lien(f) === 'petit-fils').length,
  'arriere-petit-fils': fiches.value.filter(f => lien(f) === 'arriere-petit-fils').length
}))

const fichesFiltrees = computed(() => {
  const base = filterLien.value === 'tous'
    ? fiches.value
    : fiches.value.filter(f => lien(f) === filterLien.value)

  return [...base].sort((a, b) => {
    const diff = new Date(a.dateNaissance) - new Date(b.dateNaissance)
    return sortOrder.value === 'asc' ? diff : -diff
  })
})
</script>

<template>
  <section>
    <!-- Titre + compteur -->
    <div class="mb-5">
      <h2 class="font-display font-semibold text-ink text-[1.15rem] m-0">Fiches enregistrées</h2>
      <p class="text-[0.78rem] text-charcoal opacity-60 m-0 mt-0.5">
        {{ fichesFiltrees.length }} fiche{{ fichesFiltrees.length > 1 ? 's' : '' }}
        <span v-if="filterLien !== 'tous'"> dans cette catégorie</span>
        <span v-else> au total</span>
      </p>
    </div>

    <!-- Contrôles : filtre + tri -->
    <div class="flex flex-col gap-3 mb-6">

      <!-- Filtre : scroll horizontal sur mobile -->
      <div class="flex gap-1.5 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap pb-1">
        <button
          v-for="f in FILTRES"
          :key="f.value"
          @click="setFilter(f.value)"
          :class="filterLien === f.value
            ? 'bg-ink text-card border-ink'
            : 'bg-card text-charcoal border-line hover:border-charcoal'"
          class="flex items-center gap-1.5 px-3 py-2 text-[0.78rem] font-medium border rounded-[3px] cursor-pointer transition-colors duration-150 shrink-0"
        >
          {{ f.label }}
          <span class="font-mono text-[0.68rem] opacity-60">{{ counts[f.value] }}</span>
        </button>
      </div>

      <!-- Tri : plein-largeur sur mobile -->
      <div class="flex rounded-[3px] overflow-hidden border border-line w-full sm:w-auto">
        <button
          @click="setSort('asc')"
          :class="sortOrder === 'asc' ? 'bg-ink text-card' : 'bg-transparent text-charcoal hover:bg-parchment'"
          class="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 text-[0.78rem] font-medium cursor-pointer border-none transition-colors duration-150"
        >
          <span>↓</span> Plus âgé d'abord
        </button>
        <button
          @click="setSort('desc')"
          :class="sortOrder === 'desc' ? 'bg-ink text-card' : 'bg-transparent text-charcoal hover:bg-parchment'"
          class="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 text-[0.78rem] font-medium cursor-pointer border-none border-l border-line transition-colors duration-150"
        >
          <span>↑</span> Plus jeune d'abord
        </button>
      </div>
    </div>

    <!-- Liste -->
    <div class="bg-card border border-line rounded-[4px] p-4 sm:p-[26px] shadow-[0_1px_0_rgba(28,43,69,0.04)]">
      <FamilyList :fiches="fichesFiltrees" @supprimer="supprimerFiche" />
    </div>
  </section>
</template>
