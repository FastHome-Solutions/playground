import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { apolloProvider } from './services/BenefitMatrixService'
import { createPinia } from 'pinia'

loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .use(apolloProvider)
  .use(createPinia())
  .mount('#app')
