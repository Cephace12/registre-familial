<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFamilyStore } from '../composables/useFamilyStore'

const route  = useRoute()
const router = useRouter()
const { fiches, mesFicheIds, modifierFiche } = useFamilyStore()

const LIENS = [
  { value: 'fils',               label: 'Fils du Grand-Père',      gen: '1ère génération' },
  { value: 'petit-fils',         label: 'Petit-fils du Grand-Père', gen: '2ème génération' },
  { value: 'arriere-petit-fils', label: 'Arrière-petit-fils',       gen: '3ème génération' }
]

const chargement = ref(true)
const erreur     = ref('')
const photo      = ref(null)
const fileInput  = ref(null)
const form = reactive({
  nom: '', prenoms: '', dateNaissance: '',
  nomPapa: '', nomMaman: '', photo: null, lienParente: 'fils'
})

watch(() => form.lienParente, (v) => { if (v === 'fils') form.nomPapa = '' })

onMounted(async () => {
  const id = route.params.id

  // Vérifier que c'est bien sa propre fiche
  if (!mesFicheIds.value.includes(id)) {
    router.replace(`/registre/${id}`)
    return
  }

  let fiche = fiches.value.find(f => f.id === id)
  if (!fiche) {
    const res = await fetch(`/api/fiches/${id}`)
    if (!res.ok) { router.replace('/registre'); return }
    fiche = await res.json()
  }

  Object.assign(form, {
    nom:          fiche.nom,
    prenoms:      fiche.prenoms,
    dateNaissance: fiche.dateNaissance,
    nomPapa:      fiche.nomPapa  || '',
    nomMaman:     fiche.nomMaman || '',
    photo:        fiche.photo    || null,
    lienParente:  fiche.lienParente || 'fils'
  })
  photo.value = fiche.photo || null
  chargement.value = false
})

function surChangementPhoto(event) {
  const fichier = event.target.files?.[0]
  if (!fichier) return
  if (!fichier.type.startsWith('image/')) { erreur.value = "Ce fichier n'est pas une image."; return }
  const lecteur = new FileReader()
  lecteur.onload = () => { form.photo = lecteur.result; photo.value = lecteur.result }
  lecteur.readAsDataURL(fichier)
}

function valider() {
  if (!form.photo)          { erreur.value = 'La photo est obligatoire.'; return false }
  if (!form.nom.trim())     { erreur.value = 'Le nom est obligatoire.'; return false }
  if (!form.prenoms.trim()) { erreur.value = 'Les prénoms sont obligatoires.'; return false }
  if (!form.dateNaissance)  { erreur.value = 'La date de naissance est obligatoire.'; return false }
  const aujourdHui = new Date().toISOString().split('T')[0]
  if (form.dateNaissance > aujourdHui) { erreur.value = 'La date ne peut pas être dans le futur.'; return false }
  if (!form.nomMaman.trim()) { erreur.value = 'Le nom de la mère est obligatoire.'; return false }
  if (form.lienParente !== 'fils' && !form.nomPapa.trim()) {
    erreur.value = 'Le nom du père est obligatoire.'; return false
  }
  return true
}

async function soumettre() {
  erreur.value = ''
  if (!valider()) return
  await modifierFiche(route.params.id, { ...form })
  router.push(`/registre/${route.params.id}`)
}
</script>

<template>
  <div v-if="chargement" class="py-20 text-center font-mono text-[0.78rem] text-forest opacity-60 uppercase tracking-[0.1em]">
    Chargement…
  </div>

  <div v-else>
    <button
      @click="router.push(`/registre/${route.params.id}`)"
      class="flex items-center gap-2 text-[0.82rem] text-charcoal opacity-60 hover:opacity-100 transition-opacity duration-150 cursor-pointer bg-transparent border-none mb-6 p-0"
    >← Retour au détail</button>

    <div class="max-w-md">
      <h2 class="font-display font-semibold text-ink text-[1.15rem] m-0 mb-1.5">Modifier la fiche</h2>
      <p class="text-[0.85rem] text-charcoal opacity-70 mb-6 mt-0">
        Mettez à jour vos informations personnelles.
      </p>

      <div class="bg-card border border-line rounded-[4px] p-[26px] shadow-[0_1px_0_rgba(28,43,69,0.04)]">
        <form class="flex flex-col gap-4" @submit.prevent="soumettre">

          <!-- Photo -->
          <div class="flex flex-col items-center gap-2 mb-1">
            <label for="photo-mod"
              class="size-24 rounded-full border-2 border-dashed border-line flex items-center justify-center overflow-hidden cursor-pointer bg-parchment hover:border-ochre transition-colors duration-150">
              <img v-if="photo" :src="photo" alt="Aperçu" class="size-full object-cover" />
              <span v-else class="text-[0.7rem] uppercase tracking-[0.06em] text-charcoal opacity-50">Photo</span>
            </label>
            <input id="photo-mod" ref="fileInput" type="file" accept="image/*" class="sr-only" @change="surChangementPhoto" />
            <label for="photo-mod" class="text-[0.78rem] text-forest cursor-pointer underline underline-offset-2">
              {{ photo ? 'Changer la photo' : 'Ajouter une photo' }}
            </label>
          </div>

          <!-- Lien de parenté -->
          <div class="flex flex-col gap-1.5">
            <span class="text-[0.75rem] font-semibold text-ink uppercase tracking-[0.03em]">
              Lien de parenté <span class="text-danger">*</span>
            </span>
            <div class="flex flex-col gap-2">
              <label v-for="opt in LIENS" :key="opt.value"
                class="flex items-center justify-between px-3 py-2.5 border rounded-[3px] cursor-pointer transition-colors duration-150"
                :class="form.lienParente === opt.value
                  ? 'border-ink bg-ink text-card'
                  : 'border-line bg-parchment text-charcoal hover:border-charcoal'">
                <input type="radio" v-model="form.lienParente" :value="opt.value" class="sr-only" />
                <span class="text-[0.88rem] font-medium">{{ opt.label }}</span>
                <span class="text-[0.7rem] opacity-60">{{ opt.gen }}</span>
              </label>
            </div>
          </div>

          <!-- Nom -->
          <div class="flex flex-col gap-1.5">
            <label for="mod-nom" class="text-[0.75rem] font-semibold text-ink uppercase tracking-[0.03em]">Nom <span class="text-danger">*</span></label>
            <input id="mod-nom" v-model.trim="form.nom" type="text"
              class="border border-line rounded-[3px] px-2.5 py-[9px] font-sans text-[0.92rem] bg-parchment text-charcoal focus:outline focus:outline-2 focus:outline-ochre focus:outline-offset-[1px] focus:bg-card" />
          </div>

          <!-- Prénoms -->
          <div class="flex flex-col gap-1.5">
            <label for="mod-prenoms" class="text-[0.75rem] font-semibold text-ink uppercase tracking-[0.03em]">Prénoms <span class="text-danger">*</span></label>
            <input id="mod-prenoms" v-model.trim="form.prenoms" type="text"
              class="border border-line rounded-[3px] px-2.5 py-[9px] font-sans text-[0.92rem] bg-parchment text-charcoal focus:outline focus:outline-2 focus:outline-ochre focus:outline-offset-[1px] focus:bg-card" />
          </div>

          <!-- Date de naissance -->
          <div class="flex flex-col gap-1.5">
            <label for="mod-date" class="text-[0.75rem] font-semibold text-ink uppercase tracking-[0.03em]">Date de naissance <span class="text-danger">*</span></label>
            <input id="mod-date" v-model="form.dateNaissance" type="date"
              class="border border-line rounded-[3px] px-2.5 py-[9px] font-sans text-[0.92rem] bg-parchment text-charcoal focus:outline focus:outline-2 focus:outline-ochre focus:outline-offset-[1px] focus:bg-card" />
          </div>

          <!-- Nom de la mère -->
          <div class="flex flex-col gap-1.5">
            <label for="mod-maman" class="text-[0.75rem] font-semibold text-ink uppercase tracking-[0.03em]">Nom de la mère <span class="text-danger">*</span></label>
            <input id="mod-maman" v-model.trim="form.nomMaman" type="text"
              class="border border-line rounded-[3px] px-2.5 py-[9px] font-sans text-[0.92rem] bg-parchment text-charcoal focus:outline focus:outline-2 focus:outline-ochre focus:outline-offset-[1px] focus:bg-card" />
          </div>

          <!-- Nom du père (masqué pour fils) -->
          <div v-if="form.lienParente !== 'fils'" class="flex flex-col gap-1.5">
            <label for="mod-papa" class="text-[0.75rem] font-semibold text-ink uppercase tracking-[0.03em]">Nom du père <span class="text-danger">*</span></label>
            <input id="mod-papa" v-model.trim="form.nomPapa" type="text"
              class="border border-line rounded-[3px] px-2.5 py-[9px] font-sans text-[0.92rem] bg-parchment text-charcoal focus:outline focus:outline-2 focus:outline-ochre focus:outline-offset-[1px] focus:bg-card" />
          </div>

          <p v-if="form.lienParente === 'fils'" class="m-0 px-3 py-2 bg-forest/6 border border-forest/20 text-forest text-[0.78rem] rounded-[3px]">
            Pour un fils direct du Grand-Père, le nom du père n'est pas requis.
          </p>

          <!-- Erreur -->
          <p v-if="erreur" role="alert" class="m-0 px-2.5 py-2 bg-danger/8 border border-danger/30 text-danger text-[0.82rem] rounded-[3px]">{{ erreur }}</p>

          <!-- Submit -->
          <div class="flex gap-2 mt-1">
            <button type="submit"
              class="flex-1 bg-ink text-card border-none rounded-[3px] py-3 text-[0.9rem] font-semibold cursor-pointer hover:bg-forest transition-colors duration-150">
              Enregistrer les modifications
            </button>
            <button type="button"
              @click="router.push(`/registre/${route.params.id}`)"
              class="px-4 bg-transparent text-charcoal border border-line rounded-[3px] py-3 text-[0.88rem] cursor-pointer hover:border-charcoal transition-colors duration-150">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
