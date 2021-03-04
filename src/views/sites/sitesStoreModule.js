import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchSites(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios.get('/api/dashboard/sites/all/', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
  },
}
