import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

const state = {
  tasksTable: []
}

const mutations = {
  ADD_TASKS_TABLE_DATA: (state, task) => {
    state.tasksTable.push(task)
  },
  DELETE_TASKS_TABLE_DATA: (state, startTime) => {
    const inx = state.tasksTable.findIndex( t => t.startTime === startTime)
    state.tasksTable.splice(inx, 1)
  }
}

const actions = {
  addTasksTableData({ commit }, task) {
    commit('ADD_TASKS_TABLE_DATA', task)
  },
  deleteTasksTableData({ commit }, startTime) {
    commit('DELETE_TASKS_TABLE_DATA', startTime)
  }
}

const shareStore = new Vuex.Store({
  state,
  mutations,
  actions,
  plugins: [vuexLocal.plugin]
})

export default shareStore
  