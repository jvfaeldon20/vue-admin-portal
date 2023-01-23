import axios from 'axios';

const state = {
    userusage: [
        {
            "logs": [
                {
                    "id": 2181,
                    "username": "jonelf",
                    "message": "API/CRONJOB || SERVICE: Create Pin Code Automation",
                    "timestamp": "2021-09-17 18:24:00",
                    "category": "manual trigger"
                },
            ],
            "user_usage_count": [
                {
                    "username": "",
                    "category": [
                        {
                            "name": "",
                            "total": 0
                        },
                        {
                            "name": "manual trigger",
                            "total": 0
                        }
                    ]
                },
                {
                    "username": "jonelf",
                    "category": [
                        {
                            "name": "",
                            "total": 0
                        },
                        {
                            "name": "manual trigger",
                            "total": 0
                        }
                    ]
                },
            ],
            "legends": [
                {
                    "total": 0,
                    "category": ""
                },
                {
                    "total": 0,
                    "category": "log search"
                },
                {
                    "total": 0,
                    "category": "manual trigger"
                }
            ]
        }
    ]
}

const actions = { 
    async fetchUserListData({commit}){
        const response = await axios.get(`/usage_collection_chart`);
        commit('setUserUsageChart', response.data)
        return response
    },

    async filterUserListData({commit},filterMonth){
        const response = await axios.post(`/usage_collection_chart`, filterMonth);
        return response
    },
}

const getters = {
    allUserLogSearch: (state) =>  state.userusage.map( e => e.user_usage_count.map( i => i.category.find( x => x.name == 'log search' ) ) ),
    allUserManualTrigger: (state) => state.userusage.map( e => e.user_usage_count.map( i => i.category.find( x => x.name == 'manual trigger' ) ) ),
}

const mutations = {
    setUserUsageChart: (state,userusage) => state.userusage = [userusage],
}

export default{
    state, actions, getters, mutations
}
