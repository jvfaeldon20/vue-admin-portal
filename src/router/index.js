import Vue       from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const routes = [

  // AUTOMATION
  {
    path: '/',
    redirect:'/automation-list'
  },
  {
    path: '/automation-list',
    name: 'Automation-List',
    component: () => import('../views/Automation-List.vue')
  },
  {
    path: '/automation-add',
    name: 'Automation-Add',
    component: () => import('../views/Automation-Add.vue')
  },


  // AUTOMATION CARD ACTIONS
  {
    path: '/automation-edit/:project_name',
    name: 'Automation-Edit',
    component: () => import('../views/Automation-Edit.vue')
  },
  {
    path: '/automation-generate-token/:project_key',
    name: 'Automation-Generate-Token',
    component: () => import('../views/Automation-Generate-Token.vue')
  },
  {
    path: '/automation-modify-form/:project_key',
    name: 'Automation-Modify-Form',
    component: () => import('../views/Automation-Modify-Form.vue')
  },
  {
    path: '/automation-history/:project_key',
    name: 'Automation-View-History',
    component: () => import('../views/Automation-View-History.vue')
  },

  // DASHBOARD
  {
    path: '/dashboard-service-usage',
    name: 'Dashboard-Service-Usage',
    component: () => import('../views/Dashboard-Service-Usage.vue')
  },
  {
    path: '/dashboard-user-usage',
    name: 'Dashboard-User-Usage',
    component: () => import('../views/Dashboard-User-Usage.vue')
  },

  // ACCESS GROUP
  {
    path: '/access-group-list',
    name: 'Access-Group-List',
    component: () => import('../views/Access-Group-List.vue')
  },
  {
    path: '/access-group-add',
    name: 'Access-Group-Add',
    component: () => import('../views/Access-Group-Add.vue')
  },
  {
    path: '/access-group-modify-dlist/:key',
    name: 'Access-Group-Modify-DList',
    component: () => import('../views/Access-Group-Modify-DList.vue')
  },
  {
    path: '/access-group-details/:key&:access_group_name',
    name: 'Access-Group-Details',
    component: () => import('../views/Access-Group-Details.vue')
  },

  // AUTOMATION LOG
  {
    path: '/automation-system-log',
    name: 'Automation-System-Log',
    component: () => import('../views/Automation-System-Log.vue')
  },
  {
    path: '/automation-manual-log',
    name: 'Automation-Manual-Log',
    component: () => import('../views/Automation-Manual-Log.vue')
  },
  {
    path: '/automation-system-log-detail/:log_sequence_id&:project_name',
    name: 'Automation-System-Log-Detail',
    component: () => import('../views/Automation-System-Log-Detail.vue')
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
