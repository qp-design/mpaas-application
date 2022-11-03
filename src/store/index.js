import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import set from './setters'
import state from './state'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  mutations: {set},
  getters
})

export default store
