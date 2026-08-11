<script setup>
import { useRouter } from 'vue-router'
import { useAdmin } from '../composables/useAdmin'
import { useFamilyStore } from '../composables/useFamilyStore'

defineProps({ fiches: { type: Array, required: true } })
const emit = defineEmits(['supprimer'])

const router       = useRouter()
const { isAdmin }  = useAdmin()
const { mesFicheIds } = useFamilyStore()

const LIEN_BADGE = {
  'fils':               { label: 'Fils',           cls: 'bg-ink/10 text-ink' },
  'petit-fils':         { label: 'Petit-fils',      cls: 'bg-forest/10 text-forest' },
  'arriere-petit-fils': { label: 'Arr.-petit-fils', cls: 'bg-ochre/10 text-ochre-dark' }
}

function formaterDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function calculerAge(dateStr) {
  const n = new Date(dateStr), a = new Date()
  let age = a.getFullYear() - n.getFullYear()
  const d = a.getMonth() - n.getMonth()
  if (d < 0 || (d === 0 && a.getDate() < n.getDate())) age--
  return age
}

function initiales(nom, prenoms) {
  return `${prenoms?.trim()?.[0] ?? ''}${nom?.trim()?.[0] ?? ''}`.toUpperCase() || '?'
}
</script>

<template>
  <div v-if="fiches.length === 0" class="py-10 px-3 text-center text-charcoal">
    <p class="m-0">Aucune fiche pour l'instant.</p>
    <p class="mt-1.5 m-0 text-[0.85rem] opacity-60">Utilisez le formulaire pour enregistrer la première fiche familiale.</p>
  </div>

  <ol v-else class="list-none m-0 p-0 flex flex-col">
    <li
      v-for="(fiche, index) in fiches"
      :key="fiche.id"
      class="ligne grid items-center gap-3 py-3.5 px-2 border-b border-dashed border-line last:border-b-0 cursor-pointer hover:bg-parchment/60 rounded-[3px] transition-colors duration-150"
      @click="router.push(`/registre/${fiche.id}`)"
    >
      <span class="num font-mono text-[0.72rem] text-forest opacity-80">
        {{ String(index + 1).padStart(3, '0') }}
      </span>

      <div class="photo size-12 rounded-full overflow-hidden border-[1.5px] border-line shrink-0 flex items-center justify-center bg-parchment">
        <img v-if="fiche.photo" :src="fiche.photo" :alt="`Photo de ${fiche.prenoms} ${fiche.nom}`" class="size-full object-cover" />
        <span v-else class="font-display text-[0.85rem] text-ochre-dark font-semibold">{{ initiales(fiche.nom, fiche.prenoms) }}</span>
      </div>

      <div class="infos min-w-0">
        <p class="m-0 text-[0.95rem] text-ink">
          {{ fiche.prenoms }} <strong class="uppercase">{{ fiche.nom }}</strong>
        </p>
        <span
          v-if="fiche.lienParente && LIEN_BADGE[fiche.lienParente]"
          class="inline-block font-mono text-[0.6rem] px-1.5 py-0.5 rounded-[2px] uppercase tracking-[0.05em] mt-0.5 mb-0.5"
          :class="LIEN_BADGE[fiche.lienParente].cls"
        >{{ LIEN_BADGE[fiche.lienParente].label }}</span>
        <p class="mt-0.5 mb-0 text-[0.78rem] text-charcoal opacity-70">
          Né(e) le {{ formaterDate(fiche.dateNaissance) }}
        </p>
      </div>

      <div class="age flex flex-col items-center justify-center size-11 rounded-full border-[1.5px] border-ochre shrink-0"
        :title="`Âge au ${new Date().toLocaleDateString('fr-FR')}`"
      >
        <span class="font-mono text-[0.95rem] font-medium text-ochre-dark leading-none">{{ calculerAge(fiche.dateNaissance) }}</span>
        <span class="text-[0.55rem] text-ochre-dark uppercase">ans</span>
      </div>

      <!-- Actions -->
      <div class="actions flex flex-col gap-1 items-end">
        <!-- Modifier : visible uniquement pour la propre fiche -->
        <button
          v-if="mesFicheIds.includes(fiche.id)"
          type="button"
          class="bg-transparent border border-ink/30 rounded-[3px] px-2.5 py-1 text-[0.7rem] text-ink whitespace-nowrap cursor-pointer hover:border-ink hover:bg-ink/6 transition-colors duration-150"
          @click.stop="router.push(`/registre/${fiche.id}/modifier`)"
        >Modifier</button>

        <!-- Retirer : visible uniquement pour l'admin -->
        <button
          v-if="isAdmin"
          type="button"
          class="bg-transparent border border-line rounded-[3px] px-2.5 py-1 text-[0.7rem] text-danger whitespace-nowrap cursor-pointer hover:border-danger hover:bg-danger/6 transition-colors duration-150"
          @click.stop="emit('supprimer', fiche.id)"
        >Retirer</button>
      </div>
    </li>
  </ol>
</template>

<style scoped>
.ligne {
  grid-template-columns: 34px 48px 1fr auto auto;
}

@media (max-width: 560px) {
  .ligne {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      'photo age'
      'infos infos'
      'actions actions';
  }
  .num     { display: none; }
  .photo   { grid-area: photo; }
  .infos   { grid-area: infos; }
  .age     { grid-area: age; }
  .actions { grid-area: actions; flex-direction: row; }
}
</style>
