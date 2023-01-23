import Vue                   from 'vue'
import Automation            from './module/automation.js'
import AccessGroup           from './module/access-group.js'
import AutomationSystemLogs  from './module/automation-logs-system.js'
import DashboardServiceUsage from './module/dashboard-service-usage.js'
import DashboardUserUsage    from './module/dashboard-user-usage.js'
import Login                 from './module/login.js'
import Vuex                  from 'vuex'
import createPersistedState  from 'vuex-persistedstate'

// load vuex
Vue.use(Vuex);

const store = new Vuex.Store({
    modules:{
        Automation,
        AccessGroup,
        AutomationSystemLogs,
        DashboardServiceUsage,
        DashboardUserUsage,
        Login,
    },
    plugins: [
        createPersistedState({
          paths: ['Automation', 'AccessGroup'],
        }),
      ],
});



// export store
export default store




