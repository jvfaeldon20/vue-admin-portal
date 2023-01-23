import Vue        from 'vue'
import VueSession from 'vue-session'
import VueCookies from 'vue-cookies'
import TrendChart from 'vue-trend-chart'
import App        from './App'
import router     from './router'
import Login      from './Login'
import store      from './store'
import vuetify    from './plugins/vuetify'
import './plugins/axios';

// Global Variables
var render_page = '';
var options = {
    persist: true
};

// Package Activate
Vue.use(VueCookies)
Vue.$cookies.config(0)
Vue.config.productionTip = false
Vue.use(VueSession, options)
Vue.use(TrendChart)
Vue.mixin({
  data: function() {
    return {
      url:  process.env.VUE_APP_API_URL,
      wiki: process.env.VUE_APP_WIKI_URL,
      dropzoneOptions: {
          url: process.env.VUE_APP_UPLOAD_URL,
          thumbnailWidth: 150,
          maxFilesize: 0.5,
          addRemoveLink: true,
          autoProcessQueue: false,
          addRemoveLinks: true,
      },
    };
  }
});

// Storing of credentials in Local Storage
if (localStorage.getItem('vue-session-key') && Vue.$cookies.get('admin_user') ) {
  render_page = App;
} else {
  render_page = Login;
}

// Instantiation
new Vue({
  router,
  store,
  vuetify,
  render: h => h(render_page)
}).$mount('#app')
