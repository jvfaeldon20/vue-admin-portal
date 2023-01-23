import axios from 'axios';

const state = {
    automationlist: [],
    formObjectList:[],
    token: '',
    projectownerlist:[],
}

const actions = {
    async fetchAutomation({commit}){
        const response = await axios.get(`/projects`)
        commit('setAutomation', response.data)
        return response
    },

    async fetchServiceOwnerLists({commit}){
        const response = await axios.get(`/project_owners`)
        commit('setProjectOwners', response.data)
        return response
    },

    async saveAutomation({commit},formData) {
        const response = await axios.post(`/insert_project`, formData)
        commit('saveAutomation', formData)
        return response
    },

    async updateAutomation({commit}, updateData) {
        let key = updateData.formData.project_key
        const response = await axios.put(`/update_project/${key}`, updateData.formData)
        commit('editAutomation', updateData.formData)
        return response
    },

    async generateToken({commit}, project_key) {
        const response = await axios.get(`/token?project_key=${project_key}`)
        commit('setToken', response.data.token)
        return response
    },

    async generateNewToken({commit}, key) {
        let project_key = {
            'project_key': key
        }
        const response = await axios.post(`/generate_token`,project_key)
        commit('newToken', response.data)
        return response
    },

    async getFormObjectList({commit}, key) {
        let project_key = {
            project_key: key
        }
        const response = await axios.post(`/list_create_form`,project_key)
        commit('formObjectList', response.data)
        return response
    },

    async addFormObject({commit},formObject){
        const response = await axios.post(`/create_form_objects`, formObject)
        return response
    },

    async fetchTriggerHistory({commit},project_key){
        const response = await axios.post(`/list_trigger_request`,project_key)
        return response
    },

    async getFormObjects({commit}, request_data){
        const response = await axios.post(`/list_create_form`,request_data)
        return response
    },

    async addDashboardLog({commit}, dashboard_log){
        const response = await axios.post(`/dashboard_logs`, dashboard_log)
        return response
    },

    async deleteAutomation({ commit }, delete_item) {
        let response = {}
        try{
            await axios.delete(`/project/${delete_item}`)
            response.status = 200
            commit('deleteItem', delete_item)
        }catch(e){
            response.status = 403
            console.error(e)
        }
        return response
    },

}

const getters = {
    allAutomationList: (state) => state.automationlist,
    formObjects: (state) => state.formObjectList,
    allProjectOwners: (state) => state.projectownerlist,
}

const mutations = {
    setAutomation:(state,automationlist) => state.automationlist = automationlist,
    setProjectOwners:(state,projectownerlist) => state.projectownerlist = projectownerlist,
    setToken:(state,token) => state.token = token,
    saveAutomation:(state,automationadd) => state.automationlist.push(automationadd),
    editAutomation: (state, automation) => {
        const index = state.automationlist.findIndex( item => item.project_key === automation.project_key )
        if( index != -1 ){
            state.automationlist.splice( index, 1, automation )
        }
    },
    formObjectList: (state, ObjectList) => state.formObjectList = ObjectList,
    newToken: (state, token) => state.token = token,
    deleteItem: (state, deleteKey) => state.automationlist = state.automationlist.filter((list) => list.project_key != deleteKey),
}

export default{
    state, actions, getters, mutations
}
