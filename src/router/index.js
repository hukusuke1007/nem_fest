import Vue from 'vue'
import Router from 'vue-router'

// Library
import VueQrcodeReader from 'vue-qrcode-reader'
import VueLocalForage from 'vue-localforage'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'
import VueQriously from 'vue-qriously'
import 'vue2-toast/lib/toast.css'
import Toast from 'vue2-toast'
// import Toasted from 'vue-toasted'
// Page
import TopPage from '@/pages/TopPage'
import Dashboard from '@/pages/Dashboard'

Vue.use(Router)
Vue.use(Vuetify, {
  theme: {
    original: colors.purple.base
  },
  options: {
    themeVariations: ['original', 'secondary']
  }
})
Vue.use(VueQrcodeReader)
Vue.use(VueLocalForage)
Vue.use(VueQriously)
Vue.use(Toast, {
  defaultType: 'bottom',
  duration: 3000,
  wordWrap: true,
  width: '200px'
})

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TopPage',
      component: TopPage
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    }
  ]
})
