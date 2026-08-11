<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFamilyStore } from '../composables/useFamilyStore'

const route  = useRoute()
const router = useRouter()
const { fiches } = useFamilyStore()

const fiche       = ref(null)
const chargement  = ref(false)
const erreur      = ref(false)
const showLightbox = ref(false)

const LIEN_LABEL = {
  'fils':               'Fils du Feu Grand-Père KINHOHEGBE Antoine',
  'petit-fils':         'Petit-fils du Feu Grand-Père KINHOHEGBE Antoine',
  'arriere-petit-fils': 'Arrière-petit-fils du Feu Grand-Père KINHOHEGBE Antoine'
}

const LIEN_BADGE = {
  'fils':               'bg-ink/10 text-ink',
  'petit-fils':         'bg-forest/10 text-forest',
  'arriere-petit-fils': 'bg-ochre/10 text-ochre-dark'
}

function formaterDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })
}

function calculerAge(dateStr) {
  const naissance = new Date(dateStr)
  const aujourdHui = new Date()
  let age = aujourdHui.getFullYear() - naissance.getFullYear()
  const moisDelta = aujourdHui.getMonth() - naissance.getMonth()
  if (moisDelta < 0 || (moisDelta === 0 && aujourdHui.getDate() < naissance.getDate())) age--
  return age
}

function initiales(nom, prenoms) {
  const p = prenoms?.trim()?.[0] ?? ''
  const n = nom?.trim()?.[0] ?? ''
  return `${p}${n}`.toUpperCase() || '?'
}

function onKeyup(e) {
  if (e.key === 'Escape') showLightbox.value = false
}

onMounted(async () => {
  window.addEventListener('keyup', onKeyup)

  const trouve = fiches.value.find(f => f.id === route.params.id)
  if (trouve) { fiche.value = trouve; return }

  chargement.value = true
  try {
    const res = await fetch(`/api/fiches/${route.params.id}`)
    if (!res.ok) { erreur.value = true; return }
    fiche.value = await res.json()
  } catch {
    erreur.value = true
  } finally {
    chargement.value = false
  }
})

onUnmounted(() => window.removeEventListener('keyup', onKeyup))
</script>

<template>
  <div v-if="chargement" class="py-20 text-center font-mono text-[0.78rem] text-forest opacity-60 uppercase tracking-[0.1em]">
    Chargement…
  </div>

  <div v-else-if="erreur" class="py-20 text-center">
    <p class="font-display text-ink text-[1.1rem] mb-2">Fiche introuvable</p>
    <p class="text-[0.85rem] text-charcoal opacity-60 mb-6">Cette fiche n'existe pas ou a été supprimée.</p>
    <button @click="router.push('/registre')"
      class="bg-ink text-card border-none rounded-[3px] px-5 py-2.5 text-[0.88rem] font-semibold cursor-pointer hover:bg-forest transition-colors duration-150">
      ← Retour au registre
    </button>
  </div>

  <div v-else-if="fiche">
    <button @click="router.push('/registre')"
      class="flex items-center gap-2 text-[0.82rem] text-charcoal opacity-60 hover:opacity-100 transition-opacity duration-150 cursor-pointer bg-transparent border-none mb-6 p-0">
      ← Retour au registre
    </button>

    <div class="bg-card border border-line rounded-[4px] shadow-[0_1px_0_rgba(28,43,69,0.04)] overflow-hidden mb-4">
      <div class="h-1.5 bg-gradient-to-r from-ochre via-ink to-forest"></div>

      <div class="p-5 sm:p-8">
        <div class="flex gap-6 sm:gap-8 items-start flex-col sm:flex-row">

          <!-- Photo cliquable -->
          <div class="shrink-0">
            <div
              class="size-28 sm:size-32 rounded-full overflow-hidden border-2 border-line shadow-[0_2px_12px_rgba(28,43,69,0.08)] flex items-center justify-center bg-parchment relative group"
              :class="fiche.photo ? 'cursor-zoom-in' : ''"
              @click="fiche.photo && (showLightbox = true)"
            >
              <img v-if="fiche.photo" :src="fiche.photo"
                :alt="`Photo de ${fiche.prenoms} ${fiche.nom}`"
                class="size-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <span v-else class="font-display text-[2rem] text-ochre-dark font-bold">
                {{ initiales(fiche.nom, fiche.prenoms) }}
              </span>
              <!-- Hint zoom au survol -->
              <div v-if="fiche.photo"
                class="absolute inset-0 bg-ink/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-full">
                <span class="text-card text-[1.4rem]">🔍</span>
              </div>
            </div>
          </div>

          <!-- Infos -->
          <div class="flex-1 min-w-0">
            <h2 class="font-display font-bold text-ink text-[1.4rem] sm:text-[1.6rem] leading-tight m-0 mb-2">
              {{ fiche.prenoms }} <span class="uppercase">{{ fiche.nom }}</span>
            </h2>
            <span v-if="fiche.lienParente"
              class="inline-block font-mono text-[0.65rem] px-2 py-1 rounded-[2px] uppercase tracking-[0.06em] mb-4"
              :class="LIEN_BADGE[fiche.lienParente] ?? 'bg-line text-charcoal'">
              {{ LIEN_LABEL[fiche.lienParente] ?? fiche.lienParente }}
            </span>
            <div class="w-12 h-px bg-ochre mb-4 opacity-50"></div>
            <dl class="grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt class="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-forest opacity-70 mb-0.5">Date de naissance</dt>
                <dd class="text-[0.9rem] sm:text-[0.95rem] text-ink font-medium m-0">{{ formaterDate(fiche.dateNaissance) }}</dd>
              </div>
              <div>
                <dt class="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-forest opacity-70 mb-0.5">Âge</dt>
                <dd class="m-0">
                  <span class="font-display text-[1.4rem] font-semibold text-ochre-dark leading-none">{{ calculerAge(fiche.dateNaissance) }}</span>
                  <span class="text-[0.75rem] text-charcoal opacity-60 ml-1">ans</span>
                </dd>
              </div>
              <div v-if="fiche.nomPapa">
                <dt class="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-forest opacity-70 mb-0.5">Père</dt>
                <dd class="text-[0.95rem] text-ink m-0">{{ fiche.nomPapa }}</dd>
              </div>
              <div v-if="fiche.nomMaman">
                <dt class="font-mono text-[0.62rem] uppercase tracking-[0.1em] text-forest opacity-70 mb-0.5">Mère</dt>
                <dd class="text-[0.95rem] text-ink m-0">{{ fiche.nomMaman }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-card border border-line rounded-[4px] px-6 py-4 shadow-[0_1px_0_rgba(28,43,69,0.04)]">
      <p class="font-mono text-[0.6rem] uppercase tracking-[0.1em] text-forest opacity-60 m-0">
        Enregistré(e) le {{ formaterDate(fiche.creeLe) }}
      </p>
    </div>
  </div>

  <!-- ── Lightbox photo ── -->
  <div
    v-if="showLightbox && fiche?.photo"
    class="fixed inset-0 bg-ink/92 backdrop-blur-sm flex items-center justify-center z-50 p-6"
    @click="showLightbox = false"
  >
    <img
      :src="fiche.photo"
      :alt="`Photo de ${fiche?.prenoms} ${fiche?.nom}`"
      class="max-w-full max-h-full object-contain rounded-[8px] shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
      @click.stop
    />
    <!-- Bouton fermer -->
    <button
      @click="showLightbox = false"
      class="absolute top-4 right-4 size-10 rounded-full bg-card/20 hover:bg-card/40 text-card text-[1.1rem] flex items-center justify-center border-none cursor-pointer transition-colors duration-150"
    >
      ✕
    </button>
    <!-- Nom sous la photo -->
    <p class="absolute bottom-6 left-1/2 -translate-x-1/2 font-display text-card text-[0.95rem] font-semibold text-center opacity-80 m-0 whitespace-nowrap">
      {{ fiche?.prenoms }} {{ fiche?.nom }}
    </p>
  </div>
</template>
