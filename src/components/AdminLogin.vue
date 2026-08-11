<script setup>
import { ref } from 'vue'
import { useAdmin } from '../composables/useAdmin'

const emit = defineEmits(['success', 'cancel'])
const { login } = useAdmin()

const pin    = ref('')
const erreur = ref(false)

function soumettre() {
  erreur.value = false
  if (login(pin.value)) {
    emit('success')
  } else {
    erreur.value = true
    pin.value = ''
  }
}
</script>

<template>
  <div class="bg-card border border-line rounded-[4px] p-8 w-full max-w-sm shadow-[0_8px_32px_rgba(28,43,69,0.15)]">
    <div class="flex items-center gap-3 mb-5">
      <div class="size-10 rounded-full bg-ink/8 flex items-center justify-center shrink-0">
        <span class="text-[1rem]">🔒</span>
      </div>
      <div>
        <h3 class="font-display font-semibold text-ink text-[1.05rem] m-0">Accès administrateur</h3>
        <p class="text-[0.75rem] text-charcoal opacity-60 m-0">Entrez le code d'accès</p>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <input
        v-model="pin"
        type="password"
        placeholder="Code d'accès…"
        autocomplete="off"
        @keyup.enter="soumettre"
        class="border border-line rounded-[3px] px-3 py-2.5 font-mono text-[0.92rem] bg-parchment text-charcoal tracking-[0.1em] focus:outline focus:outline-2 focus:outline-ochre focus:outline-offset-[1px] focus:bg-card"
      />

      <p v-if="erreur" class="m-0 px-2.5 py-2 bg-danger/8 border border-danger/30 text-danger text-[0.82rem] rounded-[3px]">
        Code incorrect. Veuillez réessayer.
      </p>

      <div class="flex gap-2 mt-1">
        <button
          @click="soumettre"
          class="flex-1 bg-ink text-card border-none rounded-[3px] py-2.5 text-[0.88rem] font-semibold cursor-pointer hover:bg-forest transition-colors duration-150"
        >
          Confirmer
        </button>
        <button
          @click="emit('cancel')"
          class="px-4 bg-transparent text-charcoal border border-line rounded-[3px] py-2.5 text-[0.88rem] cursor-pointer hover:border-charcoal transition-colors duration-150"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
</template>
