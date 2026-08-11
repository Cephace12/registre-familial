<script setup>
import { RouterLink } from 'vue-router'
import { useFamilyStore } from '../composables/useFamilyStore'

const { fiches } = useFamilyStore()
</script>

<template>
  <div class="flex flex-col items-center text-center py-6 sm:py-10 px-0">

    <!-- Sceau -->
    <div class="relative mb-6 sm:mb-8">
      <div class="size-20 sm:size-28 rounded-full border-[3px] border-ochre flex items-center justify-center bg-card shadow-[0_2px_16px_rgba(193,135,58,0.15)]">
        <div class="flex flex-col items-center leading-tight">
          <span class="font-display font-bold text-[1.2rem] sm:text-[1.5rem] text-ochre-dark">RF</span>
          <span class="font-mono text-[0.45rem] sm:text-[0.5rem] uppercase tracking-[0.18em] text-forest opacity-70 mt-0.5">Registre</span>
        </div>
      </div>
      <div class="absolute -top-2 left-1/2 -translate-x-1/2 font-mono text-[0.55rem] text-ochre tracking-[0.3em] opacity-60">
        ✦ &nbsp; ✦ &nbsp; ✦
      </div>
    </div>

    <!-- Titre -->
    <h2 class="font-display font-bold text-ink text-[clamp(1.4rem,5vw,2.6rem)] leading-[1.1] m-0 mb-2 sm:mb-3 max-w-2xl px-2">
      Registre Familial<br />
      <span class="text-ochre-dark">KINHOHEGBE</span>
    </h2>

    <p class="font-mono text-[0.65rem] sm:text-[0.72rem] text-forest opacity-75 mb-6 sm:mb-8 tracking-[0.12em] uppercase">
      Mémoire &middot; Lignée &middot; Appartenance
    </p>

    <!-- Séparateur -->
    <div class="flex items-center gap-3 w-full max-w-[180px] mb-7 sm:mb-10 opacity-40">
      <div class="flex-1 h-px bg-ink"></div>
      <span class="font-mono text-[0.65rem] text-ink">✦</span>
      <div class="flex-1 h-px bg-ink"></div>
    </div>

    <!-- Dédicace -->
    <div class="bg-card border border-line rounded-[4px] p-5 sm:p-8 max-w-xl w-full mb-6 sm:mb-8 shadow-[0_1px_0_rgba(28,43,69,0.04)] text-left">
      <p class="font-mono text-[0.6rem] sm:text-[0.65rem] tracking-[0.14em] uppercase text-forest opacity-70 m-0 mb-2 sm:mb-3">
        À la mémoire de
      </p>
      <p class="font-display font-semibold text-ink text-[1.1rem] sm:text-[1.25rem] leading-snug m-0 mb-2">
        Feu Grand-Père<br />KINHOHEGBE Viakinnou Antoine
      </p>
      <p class="font-display italic text-ochre-dark text-[0.95rem] sm:text-[1rem] m-0 mb-4 sm:mb-5">
        dit « Avocè Ghadi »
      </p>
      <div class="w-10 h-px bg-ochre mb-4 opacity-50"></div>
      <p class="text-[0.85rem] sm:text-[0.9rem] text-charcoal leading-relaxed m-0">
        Ce registre est établi en hommage au Feu Grand-Père
        <strong class="text-ink">KINHOHEGBE Viakinnou Antoine dit Avocè Ghadi</strong>,
        dont la vie et le nom perdurent à travers sa descendance.
        Il a pour vocation de rassembler et de conserver les noms,
        dates de naissance et filiations de ses <strong class="text-ink">fils et petits-fils</strong>,
        afin que la mémoire de cette lignée ne se perde jamais.
      </p>
    </div>

    <!-- 3 cartes fonctionnalités -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl w-full mb-7 sm:mb-10">
      <div class="bg-card border border-line rounded-[4px] p-4 sm:p-5 text-left shadow-[0_1px_0_rgba(28,43,69,0.04)]">
        <p class="font-display font-semibold text-ink text-[0.95rem] m-0 mb-1">Enregistrer</p>
        <p class="text-[0.78rem] text-charcoal opacity-75 m-0 leading-relaxed">
          Ajoutez chaque membre avec ses informations et une photo.
        </p>
      </div>
      <div class="bg-card border border-line rounded-[4px] p-4 sm:p-5 text-left shadow-[0_1px_0_rgba(28,43,69,0.04)]">
        <p class="font-display font-semibold text-ink text-[0.95rem] m-0 mb-1">Consulter</p>
        <p class="text-[0.78rem] text-charcoal opacity-75 m-0 leading-relaxed">
          Parcourez la liste des membres, triée selon l'âge.
        </p>
      </div>
      <div class="bg-card border border-line rounded-[4px] p-4 sm:p-5 text-left shadow-[0_1px_0_rgba(28,43,69,0.04)]">
        <p class="font-display font-semibold text-ink text-[0.95rem] m-0 mb-1">Conserver</p>
        <p class="text-[0.78rem] text-charcoal opacity-75 m-0 leading-relaxed">
          Les données sont sauvegardées en base pour durer.
        </p>
      </div>
    </div>

    <!-- Compteur -->
    <p class="font-mono text-[0.65rem] sm:text-[0.72rem] tracking-[0.1em] uppercase text-forest opacity-70 mb-5 sm:mb-6">
      {{ fiches.length === 0
        ? 'Aucune fiche enregistrée pour le moment'
        : `${fiches.length} fiche${fiches.length > 1 ? 's' : ''} déjà enregistrée${fiches.length > 1 ? 's' : ''}` }}
    </p>

    <!-- Boutons plein-largeur sur mobile -->
    <div class="flex flex-col sm:flex-row gap-3 w-full max-w-sm sm:max-w-none sm:w-auto">
      <RouterLink to="/registre" class="block">
        <span class="block text-center bg-ink text-card rounded-[3px] px-6 py-3.5 sm:py-3 text-[0.9rem] font-semibold tracking-[0.02em] hover:bg-forest transition-colors duration-150 cursor-pointer">
          Consulter le registre
        </span>
      </RouterLink>
      <RouterLink to="/formulaire" class="block">
        <span class="block text-center bg-transparent text-ink border border-ink rounded-[3px] px-6 py-3.5 sm:py-3 text-[0.9rem] font-semibold tracking-[0.02em] hover:bg-ink hover:text-card transition-colors duration-150 cursor-pointer">
          + Nouvelle fiche
        </span>
      </RouterLink>
    </div>

  </div>
</template>
