import axios from 'axios'

const state = {
    automationLogs:[],
    manualLogs:[],
    automationLogDetails:[],
    automationGlobalLogs:[],
}

const actions = {
    async fetchSystemLogs({commit}){
        const response = await axios.get(`/get_system_logs`)
        commit('setSystemLogs', response.data)
        return response
    },

    async fetchManualLogs({commit}){
        const response = await axios.get(`/get_request_history`)
        commit('setManualLogs', response.data)
        return response
    },

    async fetchSystemLogDetails({commit}, log_sequence_id){
        let request_data = {
            log_sequence_id: log_sequence_id,
        }

        const response = await axios.post(`/get_automation_logs_details`, request_data)
        commit('setSystemLogDetails',response.data)
        return response
    },

    async fetchSystemGlobalLogs({commit}, global_search){
        const response = await axios.post(`/select_all_automation_logs_details`, global_search)
        commit('setSystemGlobalLogs',response.data)
        return response
    },

    async addDashboardLog({commit}, dashboard_log){
        const response = await axios.post(`/dashboard_logs`, dashboard_log)
        return response
    }
}

const getters = {
    allSystemLogList: (state) => state.automationLogs,
    allManualLogList: (state) => state.manualLogs,
    limitedSystemLogList: (state) => state.automationLogs.system_logs,
    limitedManualLogList: (state) => {
        let startDate = new Date()
        let dd        = String(startDate.getDate()).padStart(2,"0")
        let month     = String(startDate.getMonth()+1).padStart(2,"0")
        let mm        = (month < 3) ? 1:month
        let yyyy      = startDate.getFullYear()
       
        startDate         = Date.parse(`${yyyy}-${mm}-01`)
        let newDateFilter = []
        let counter       = 0
        state.manualLogs.trigger_dates.forEach(i => {
            let triggerDate = Date.parse(i)
        
            if(triggerDate>startDate){
                newDateFilter.push({
                    automation: state.manualLogs.project_names[counter],
                    username:   state.manualLogs.trigger_requestors[counter],
                    message:    state.manualLogs.trigger_messages[counter],
                    date:       state.manualLogs.trigger_dates[counter],
                    group:      state.manualLogs.access_group_name[counter]
                },
            )}
            counter++
        });
        
        return newDateFilter
    }
}

const mutations = {
    setSystemLogs:(state,automationLogs) => state.automationLogs = automationLogs,
    setManualLogs:(state,manualLogs) => state.manualLogs = manualLogs,
    setSystemLogDetails:(state,automationLogDetails) => state.automationLogDetails = automationLogDetails,
    setSystemGlobalLogs:(state,automationGlobalLogs) => state.automationGlobalLogs = automationGlobalLogs,
}

export default{
    state, actions, getters, mutations
}
