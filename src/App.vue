<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useFamilyStore } from './composables/useFamilyStore'
import { useAdmin } from './composables/useAdmin'
import AdminLogin from './components/AdminLogin.vue'

const { fiches, chargerFiches } = useFamilyStore()
const { isAdmin, logout } = useAdmin()

const showAdminModal = ref(false)

onMounted(chargerFiches)
</script>

<template>
  <!-- Conteneur principal — padding-bottom grand sur mobile pour la bottom nav -->
  <div class="max-w-[1080px] mx-auto px-4 sm:px-6 pt-5 sm:pt-8 pb-32 sm:pb-20">

    <!-- ── En-tête ── -->
    <header class="flex items-center gap-3 sm:gap-5 border-b-[3px] border-ink pb-4 sm:pb-5 mb-0">
      <RouterLink to="/">
        <div class="size-11 sm:size-14 rounded-full border-2 border-ochre flex items-center justify-center font-display font-bold text-[0.95rem] sm:text-[1.1rem] text-ochre-dark shrink-0 hover:border-ochre-dark transition-colors duration-150 cursor-pointer">
          RF
        </div>
      </RouterLink>
      <div class="flex-1 min-w-0">
        <p class="font-mono text-[0.6rem] sm:text-[0.7rem] text-forest m-0 mb-0.5 sm:mb-1 truncate">
          Registre familial &middot; Lignée KINHOHEGBE
        </p>
        <h1 class="font-display font-semibold text-[1.1rem] sm:text-[clamp(1.3rem,3vw,2rem)] leading-[1.15] text-ink m-0">
          Livre des Fiches Familiales
        </h1>
      </div>
      <div class="text-right shrink-0">
        <span class="block font-mono text-[1.3rem] sm:text-[1.6rem] font-medium text-ink">
          {{ String(fiches.length).padStart(3, '0') }}
        </span>
        <span class="text-[0.65rem] sm:text-[0.75rem] text-charcoal opacity-65 uppercase tracking-[0.06em]">
          fiche{{ fiches.length > 1 ? 's' : '' }}
        </span>
      </div>
    </header>

    <!-- ── Nav desktop (masquée sur mobile) ── -->
    <nav class="hidden sm:flex items-center border-b border-line mb-8">
      <RouterLink v-slot="{ isActive }" to="/" :exact="true">
        <span :class="isActive ? 'text-ink border-b-2 border-ochre font-semibold' : 'text-charcoal opacity-60 hover:opacity-100'"
          class="inline-block px-4 py-3 text-[0.88rem] -mb-px transition-colors duration-150 cursor-pointer">
          Accueil
        </span>
      </RouterLink>
      <RouterLink v-slot="{ isActive }" to="/registre">
        <span :class="isActive ? 'text-ink border-b-2 border-ochre font-semibold' : 'text-charcoal opacity-60 hover:opacity-100'"
          class="inline-block px-4 py-3 text-[0.88rem] -mb-px transition-colors duration-150 cursor-pointer">
          Registre
        </span>
      </RouterLink>
      <RouterLink v-slot="{ isActive }" to="/formulaire">
        <span :class="isActive ? 'text-ink border-b-2 border-ochre font-semibold' : 'text-charcoal opacity-60 hover:opacity-100'"
          class="inline-block px-4 py-3 text-[0.88rem] -mb-px transition-colors duration-150 cursor-pointer">
          + Nouvelle fiche
        </span>
      </RouterLink>
      <div class="ml-auto pr-1">
        <button v-if="!isAdmin" @click="showAdminModal = true"
          class="flex items-center gap-1.5 px-3 py-1.5 text-[0.72rem] font-mono uppercase tracking-[0.06em] text-charcoal opacity-50 hover:opacity-80 bg-transparent border-none cursor-pointer transition-opacity duration-150">
          🔒 Admin
        </button>
        <button v-else @click="logout"
          class="flex items-center gap-1.5 px-3 py-1.5 text-[0.72rem] font-mono uppercase tracking-[0.06em] text-forest bg-forest/8 border border-forest/20 rounded-[3px] cursor-pointer hover:bg-forest/15 transition-colors duration-150">
          🔓 Admin · Quitter
        </button>
      </div>
    </nav>

    <!-- ── Espace sous le header sur mobile ── -->
    <div class="h-5 sm:hidden"></div>

    <!-- ── Contenu ── -->
    <RouterView />

  </div>

  <!-- ══════════════════════════════════════
       Bottom nav mobile (cachée sur desktop)
       ══════════════════════════════════════ -->
  <nav class="fixed sm:hidden bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-sm border-t border-line"
       style="padding-bottom: env(safe-area-inset-bottom, 0px)">
    <div class="flex">

      <RouterLink v-slot="{ isActive }" to="/" class="flex-1 block no-underline">
        <div class="flex flex-col items-center pt-1.5 pb-2.5 gap-0.5 transition-colors duration-150"
             :class="isActive ? 'text-ink' : 'text-charcoal opacity-40'">
          <div class="w-5 h-0.5 rounded-full mb-1 transition-all duration-200"
               :class="isActive ? 'bg-ochre' : 'bg-transparent'"></div>
          <span class="text-[0.6rem] font-mono uppercase tracking-[0.07em]">Accueil</span>
        </div>
      </RouterLink>

      <RouterLink v-slot="{ isActive }" to="/registre" class="flex-1 block no-underline">
        <div class="flex flex-col items-center pt-1.5 pb-2.5 gap-0.5 transition-colors duration-150"
             :class="isActive ? 'text-ink' : 'text-charcoal opacity-40'">
          <div class="w-5 h-0.5 rounded-full mb-1 transition-all duration-200"
               :class="isActive ? 'bg-ochre' : 'bg-transparent'"></div>
          <span class="text-[0.6rem] font-mono uppercase tracking-[0.07em]">Registre</span>
        </div>
      </RouterLink>

      <RouterLink v-slot="{ isActive }" to="/formulaire" class="flex-1 block no-underline">
        <div class="flex flex-col items-center pt-1.5 pb-2.5 gap-0.5 transition-colors duration-150"
             :class="isActive ? 'text-ink' : 'text-charcoal opacity-40'">
          <div class="w-5 h-0.5 rounded-full mb-1 transition-all duration-200"
               :class="isActive ? 'bg-ochre' : 'bg-transparent'"></div>
          <span class="text-[0.6rem] font-mono uppercase tracking-[0.07em]">+ Fiche</span>
        </div>
      </RouterLink>

      <button
        @click="isAdmin ? logout() : (showAdminModal = true)"
        class="flex-1 bg-transparent border-none cursor-pointer"
      >
        <div class="flex flex-col items-center pt-1.5 pb-2.5 gap-0.5 transition-colors duration-150"
             :class="isAdmin ? 'text-forest' : 'text-charcoal opacity-40'">
          <div class="w-5 h-0.5 rounded-full mb-1"
               :class="isAdmin ? 'bg-forest' : 'bg-transparent'"></div>
          <span class="text-[0.6rem] font-mono uppercase tracking-[0.07em]">
            {{ isAdmin ? 'Admin ✓' : 'Admin' }}
          </span>
        </div>
      </button>

    </div>
  </nav>

  <!-- Modal admin -->
  <div v-if="showAdminModal"
       class="fixed inset-0 bg-ink/20 backdrop-blur-[2px] flex items-end sm:items-center justify-center z-50"
       @click.self="showAdminModal = false">
    <div class="w-full sm:max-w-sm sm:mx-6">
      <AdminLogin @success="showAdminModal = false" @cancel="showAdminModal = false" />
    </div>
  </div>
</template>

<style scoped>
/* Empêche l'underline hérité du RouterLink sur la bottom nav */
a { text-decoration: none; }
</style>
