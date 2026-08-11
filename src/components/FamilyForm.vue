<script setup>
import { reactive, ref, watch } from 'vue'

const emit = defineEmits(['ajouter'])

const LIENS = [
  { value: 'fils',               label: 'Fils du Grand-Père',      gen: '1ère génération' },
  { value: 'petit-fils',         label: 'Petit-fils du Grand-Père', gen: '2ème génération' },
  { value: 'arriere-petit-fils', label: 'Arrière-petit-fils',       gen: '3ème génération' }
]

const initialState = () => ({
  nom: '', prenoms: '', dateNaissance: '',
  nomPapa: '', nomMaman: '', photo: null,
  lienParente: 'fils'
})

const form       = reactive(initialState())
const photoApercu = ref(null)
const erreur     = ref('')
const fileInput  = ref(null)

// Quand on passe à "fils", le père n'est pas applicable
watch(() => form.lienParente, (v) => {
  if (v === 'fils') form.nomPapa = ''
})

function surChangementPhoto(event) {
  const fichier = event.target.files?.[0]
  if (!fichier) return
  if (!fichier.type.startsWith('image/')) {
    erreur.value = "Le fichier sélectionné n'est pas une image."
    return
  }
  const lecteur = new FileReader()
  lecteur.onload = () => { form.photo = lecteur.result; photoApercu.value = lecteur.result }
  lecteur.readAsDataURL(fichier)
}

function reinitialiser() {
  Object.assign(form, initialState())
  photoApercu.value = null
  erreur.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

function valider() {
  if (!form.photo)          { erreur.value = 'La photo est obligatoire.'; return false }
  if (!form.nom.trim())     { erreur.value = 'Le nom est obligatoire.'; return false }
  if (!form.prenoms.trim()) { erreur.value = 'Les prénoms sont obligatoires.'; return false }
  if (!form.dateNaissance)  { erreur.value = 'La date de naissance est obligatoire.'; return false }
  const aujourdHui = new Date().toISOString().split('T')[0]
  if (form.dateNaissance > aujourdHui) { erreur.value = 'La date de naissance ne peut pas être dans le futur.'; return false }
  if (!form.nomMaman.trim()) { erreur.value = 'Le nom de la mère est obligatoire.'; return false }
  if (form.lienParente !== 'fils' && !form.nomPapa.trim()) {
    erreur.value = 'Le nom du père est obligatoire.'; return false
  }
  return true
}

function soumettre() {
  erreur.value = ''
  if (!valider()) return
  emit('ajouter', { ...form })
  reinitialiser()
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="soumettre">

    <!-- Photo -->
    <div class="flex flex-col items-center gap-2 mb-1">
      <label
        for="photo-input"
        class="size-24 rounded-full border-2 border-dashed border-line flex items-center justify-center overflow-hidden cursor-pointer bg-parchment hover:border-ochre transition-colors duration-150"
      >
        <img v-if="photoApercu" :src="photoApercu" alt="Aperçu" class="size-full object-cover" />
        <span v-else class="text-[0.7rem] uppercase tracking-[0.06em] text-charcoal opacity-50">Photo</span>
      </label>
      <input id="photo-input" ref="fileInput" type="file" accept="image/*" class="sr-only" @change="surChangementPhoto" />
      <label for="photo-input" class="text-[0.78rem] text-forest cursor-pointer underline underline-offset-2">
        {{ photoApercu ? 'Changer la photo' : 'Ajouter une photo' }}
      </label>
      <span v-if="!photoApercu" class="text-[0.7rem] text-danger opacity-80">Photo obligatoire <span>*</span></span>
    </div>

    <!-- Lien de parenté -->
    <div class="flex flex-col gap-1.5">
      <span class="text-[0.75rem] font-semibold text-ink uppercase tracking-[0.03em]">
        Lien de parenté avec le Grand-Père <span class="text-danger">*</span>
      </span>
      <div class="flex flex-col gap-2">
        <label
          v-for="opt in LIENS" :key="opt.value"
          class="flex items-center justify-between px-3 py-2.5 border rounded-[3px] cursor-pointer transition-colors duration-150"
          :class="form.lienParente === opt.value
            ? 'border-ink bg-ink text-card'
            : 'border-line bg-parchment text-charcoal hover:border-charcoal'"
        >
          <input type="radio" v-model="form.lienParente" :value="opt.value" class="sr-only" />
          <span class="text-[0.88rem] font-medium">{{ opt.label }}</span>
          <span class="text-[0.7rem] opacity-60">{{ opt.gen }}</span>
        </label>
      </div>
    </div>

    <!-- Nom -->
    <div class="flex flex-col gap-1.5">
      <label for="nom" class="text-[0.75rem] font-semibold text-ink uppercase tracking-[0.03em]">
        Nom <span class="text-danger">*</span>
      </label>
      <input id="nom" v-model.trim="form.nom" type="text" placeholder="Ex. KINHOHEGBE"
        class="border border-line rounded-[3px] px-2.5 py-[9px] font-sans text-[0.92rem] bg-parchment text-charcoal focus:outline focus:outline-2 focus:outline-ochre focus:outline-offset-[1px] focus:bg-card" />
    </div>

    <!-- Prénoms -->
    <div class="flex flex-col gap-1.5">
      <label for="prenoms" class="text-[0.75rem] font-semibold text-ink uppercase tracking-[0.03em]">
        Prénoms <span class="text-danger">*</span>
      </label>
      <input id="prenoms" v-model.trim="form.prenoms" type="text" placeholder="Ex. Sourou Roland Céphace"
        class="border border-line rounded-[3px] px-2.5 py-[9px] font-sans text-[0.92rem] bg-parchment text-charcoal focus:outline focus:outline-2 focus:outline-ochre focus:outline-offset-[1px] focus:bg-card" />
    </div>

    <!-- Date de naissance -->
    <div class="flex flex-col gap-1.5">
      <label for="date-naissance" class="text-[0.75rem] font-semibold text-ink uppercase tracking-[0.03em]">
        Date de naissance <span class="text-danger">*</span>
      </label>
      <input id="date-naissance" v-model="form.dateNaissance" type="date"
        class="border border-line rounded-[3px] px-2.5 py-[9px] font-sans text-[0.92rem] bg-parchment text-charcoal focus:outline focus:outline-2 focus:outline-ochre focus:outline-offset-[1px] focus:bg-card" />
    </div>

    <!-- Nom de la mère (toujours visible) -->
    <div class="flex flex-col gap-1.5">
      <label for="nom-maman" class="text-[0.75rem] font-semibold text-ink uppercase tracking-[0.03em]">
        Nom de la mère <span class="text-danger">*</span>
      </label>
      <input id="nom-maman" v-model.trim="form.nomMaman" type="text" placeholder="Ex. AGOSSOU Rosalie"
        class="border border-line rounded-[3px] px-2.5 py-[9px] font-sans text-[0.92rem] bg-parchment text-charcoal focus:outline focus:outline-2 focus:outline-ochre focus:outline-offset-[1px] focus:bg-card" />
    </div>

    <!-- Nom du père (masqué pour les fils directs) -->
    <div v-if="form.lienParente !== 'fils'" class="flex flex-col gap-1.5">
      <label for="nom-papa" class="text-[0.75rem] font-semibold text-ink uppercase tracking-[0.03em]">
        Nom du père <span class="text-danger">*</span>
      </label>
      <input id="nom-papa" v-model.trim="form.nomPapa" type="text" placeholder="Ex. KINHOHEGBE Jean"
        class="border border-line rounded-[3px] px-2.5 py-[9px] font-sans text-[0.92rem] bg-parchment text-charcoal focus:outline focus:outline-2 focus:outline-ochre focus:outline-offset-[1px] focus:bg-card" />
    </div>

    <!-- Note pour les fils directs -->
    <p v-if="form.lienParente === 'fils'" class="m-0 px-3 py-2 bg-forest/6 border border-forest/20 text-forest text-[0.78rem] rounded-[3px]">
      Pour un fils direct du Grand-Père, le nom du père n'est pas requis.
    </p>

    <!-- Erreur -->
    <p v-if="erreur" role="alert" class="m-0 px-2.5 py-2 bg-danger/8 border border-danger/30 text-danger text-[0.82rem] rounded-[3px]">
      {{ erreur }}
    </p>

    <!-- Submit -->
    <button type="submit"
      class="mt-1.5 bg-ink text-card border-none rounded-[3px] px-[18px] py-3 text-[0.9rem] font-semibold tracking-[0.02em] cursor-pointer hover:bg-forest transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ochre focus-visible:outline-offset-2">
      Enregistrer la fiche
    </button>
  </form>
</template>
