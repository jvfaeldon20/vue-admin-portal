import axios from 'axios'

const state = {
    accessgrouplist: [],
    distrolist: [],
    distro_name: ['All of Trend GIS Automation Team',
                  'All of Trend GIS Communications Team',
                  'All of Trend GIS Global Operations',
                  'All of Trend GIS Leadership Team',
                  'All of Trend GIS Product Cloud Team',
                  'All of Trend GIS Product Success Team',
                  'All of Trend GIS Project Management Team',
                  'All of Trend GIS Solution Development Team',
                  'All of Trend GIS Technology Team',
                  'All of Trend GIS Global Service Desk',
                  'All of Trend GIS Hybrid Cloud Team',
                  'All of Trend GIS Network Team',
                  'All of Trend GIS Private Cloud Team',
                  'All of Trend GIS Shared Services Team',
                  'All of Trend GIS Solution Architects']
}

const actions = {
    async fetchAccessGroup({ commit }) {
        const response = await axios.get(`/get_access_groups`)
        commit('setAccessGroup', response.data);
        return response
    },

    async addAccessGroup({ commit }, new_automation) {
        const response = await axios.post(`/add_new_access_group`, new_automation)
        const newData = { ...new_automation, 'access_group_id': response.data.insert_access_group_result.id }
        commit('addItem', newData)
        return response
    },

    async deleteAccessGroup({ commit }, delete_group) {
        let response = axios.post(`/delete_access_group`, delete_group)
        commit('removeItem', delete_group.access_group_id)
        return response
    },

    async updateDistributionList({commit},updateItem ) {
        const response = await axios.post(`/add_access_group_dl`, updateItem)
        commit('setAccessGroupDList', response)
        return response
    },

    async fetchAccessGroupDList({ commit }, key) {
        let response = await axios.get(`/get_access_group?key=${key}`)
        commit('setAccessGroupDList', response.data)
        return response
    }
}

const getters = {
    allAccessGroupList: (state) => state.accessgrouplist,
}

const mutations = {
    setAccessGroup: (state, accessgrouplist) => state.accessgrouplist = accessgrouplist,
    addItem: (state, accessgroupitem) => state.accessgrouplist.push(accessgroupitem),
    removeItem: (state, accessgrouplistid) => state.accessgrouplist = state.accessgrouplist.filter((list) => list.access_group_id != accessgrouplistid),
    setAccessGroupDList: (state, list) => state.distrolist = list,
}

export default {
    state, actions, getters, mutations
}
