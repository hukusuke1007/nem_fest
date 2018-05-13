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
import VueClipboard from 'vue-clipboard2'
// import Toasted from 'vue-toasted'
// Page
import TopPage from '@/pages/TopPage'
import Dashboard from '@/pages/Dashboard'
import History from '@/pages/History'

Vue.use(Router)
Vue.use(Vuetify, {
  theme: {
    original: colors.purple.base,
    originalGrey: '#AFB1BF',
    originalRed: '#E77373',
    originalBlue: '#5663B8',
    originalGreen: '#3FAC86'
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
  width: '280px'
})
Vue.use(VueClipboard)

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
    },
    {
      path: '/history',
      name: 'History',
      component: History
    }
  ]
})
