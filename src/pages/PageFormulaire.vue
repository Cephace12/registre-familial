<script setup>
import { useFamilyStore } from '../composables/useFamilyStore'
import FamilyForm from '../components/FamilyForm.vue'

const { ajouterFiche } = useFamilyStore()
</script>

<template>
  <section class="max-w-md">
    <h2 class="font-display font-semibold text-ink text-[1.15rem] m-0 mb-1.5">Nouvelle fiche</h2>
    <p class="text-[0.85rem] text-charcoal opacity-70 mb-6 mt-0">
      Remplissez les informations ci-dessous pour enregistrer une fiche familiale.
    </p>
    <div class="bg-card border border-line rounded-[4px] p-[26px] shadow-[0_1px_0_rgba(28,43,69,0.04)]">
      <FamilyForm @ajouter="ajouterFiche" />
    </div>
  </section>
</template>
