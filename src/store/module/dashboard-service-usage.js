import axios from 'axios';

const state = {
    serviceusage:  [
        {
            "month": "January",
            "result": []
        },
        {
            "month": "February",
            "result": []
        },
        {
            "month": "March",
            "result": []
        },
        {
            "month": "April",
            "result": []
        },
        {
            "month": "May",
            "result": []
        },
        {
            "month": "June",
            "result": []
        },
        {
            "month": "July",
            "result": []
        },
        {
            "month": "August",
            "result": []
        },
        {
            "month": "September",
            "result": []
        },
        {
            "month": "October",
            "result": []
        },
        {
            "month": "November",
            "result": []
        },
        {
            "month": "December",
            "result": []
        }
    ],
    serviceusagedata:[],

}

const actions = { 
    async fetchServiceListChart({commit}){
        const response = await axios.get(`/chart_data`)
        commit('setServiceUsageChart', response.data)
    },

    async filterServiceUsageData({commit}, filterMonth){
        const response = await axios.post(`/usage_collection_chart`,filterMonth)
        return response
    },

    async fetchServiceUsageData({commit}){
        const response = await axios.get(`/usage_collection_chart`)
        commit('setServiceUsageData', response.data)
        return response
    }
}

const getters = {
    allLogSearch: state => {
        return state.serviceusage.map( data => data.result.find( i => i.category == 'log search'))
    },
    allManualTrigger: state => {
        return state.serviceusage.map( data => data.result.find( i => i.category == 'manual trigger'))
    },
}

const mutations = {
    setServiceUsageChart: (state,serviceusage) => state.serviceusage = serviceusage.data,
    setServiceUsageData: (state,serviceusagedata) => state.serviceusagedata = serviceusagedata.data,
}

export default{
    state, actions, getters, mutations
}
