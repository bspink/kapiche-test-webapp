import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    authenticated: false
  },
  getters: {
    authenticated: (state) => {
      console.log(`${state.authenticated}`)
      return state.authenticated
    }
  },
  mutations: {
    authenticate: (state, isAuthenticated) => {
      state.authenticated = isAuthenticated
    }
  },
  actions: {
  }
})
