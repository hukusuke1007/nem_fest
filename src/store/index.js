import Vue from 'vue'
import Vuex from 'vuex'
// import router from './router'
/*
getter ・・・テンプレートへ値を返します
state ・・・値を保持する
mutation・・・stateの値を変更する
action ・・・mutationを呼び出す
*/
Vue.use(Vuex)

const Auth = {
  namespaced: true,
  state: {
    isAuth: false,
    authPassword: ''
  },
  getters: {
    isAuth: state => state.isAuth,
    authPassword: state => state.authPassword
  },
  mutations: {
    setAuth (state, value) {
      console.log('setAuth: ' + value)
      state.isAuth = value
    },
    setAuthPassword (state, value) {
      console.log('setAuthPassword: ' + value)
      state.authPassword = value
    }
  },
  actions: {
    doAuth ({ commit, getters }, value) {
      commit('setAuth', value)
    },
    doAuthPassword ({ commit, getters }, value) {
      commit('setAuthPassword', value)
    }
  }
}

export default new Vuex.Store({
  modules: {
    Auth
  }
})
