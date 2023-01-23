import axios from "axios"

const state = {

}


const actions = {
    async userValidate({commit},loginData){
        const response = axios.post(`/login`, loginData)
        return response
    },

    async duoValidate({commit},loginData){
        const response = axios.post(`/login_duo`, loginData)
        return response
    },

    async checkAdminPermission({commit},username){
        const response = axios.post(`/check_admin_access`,username)
        return response
    }
}


const getters = {

}


const mutations = {

}


export default {
    state, actions, getters, mutations
}