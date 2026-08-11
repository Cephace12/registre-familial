<script setup>
import { ref } from 'vue'
import { useFamilyStore } from '../composables/useFamilyStore'
import FamilyForm from '../components/FamilyForm.vue'

const { ajouterFiche } = useFamilyStore()
const succes = ref(false)

async function handleAjouter(fiche) {
  await ajouterFiche(fiche)
  succes.value = true
  setTimeout(() => { succes.value = false }, 4000)
}
</script>

<template>
  <section class="max-w-md">
    <h2 class="font-display font-semibold text-ink text-[1.15rem] m-0 mb-1.5">Nouvelle fiche</h2>
    <p class="text-[0.85rem] text-charcoal opacity-70 mb-6 mt-0">
      Remplissez les informations ci-dessous pour enregistrer une fiche familiale.
    </p>

    <!-- Message de succès -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="succes"
        class="mb-4 px-4 py-3 bg-forest/10 border border-forest/30 text-forest rounded-[4px] flex items-center gap-2 text-[0.88rem] font-medium">
        <span class="text-[1rem]">✓</span>
        Fiche enregistrée avec succès dans le registre familial.
      </div>
    </Transition>

    <div class="bg-card border border-line rounded-[4px] p-[26px] shadow-[0_1px_0_rgba(28,43,69,0.04)]">
      <FamilyForm @ajouter="handleAjouter" />
    </div>
  </section>
</template>
