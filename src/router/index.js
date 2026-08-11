import { createRouter, createWebHashHistory } from 'vue-router'
import PageAccueil    from '../pages/PageAccueil.vue'
import PageFormulaire from '../pages/PageFormulaire.vue'
import PageRegistre   from '../pages/PageRegistre.vue'
import PageDetail     from '../pages/PageDetail.vue'
import PageModifier   from '../pages/PageModifier.vue'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/',                       component: PageAccueil },
    { path: '/formulaire',             component: PageFormulaire },
    { path: '/registre',               component: PageRegistre },
    { path: '/registre/:id',           component: PageDetail },
    { path: '/registre/:id/modifier',  component: PageModifier }
  ]
})
