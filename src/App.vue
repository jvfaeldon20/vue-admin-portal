<template>
  <div id="app">
    <v-app id="inspire">
      <v-app>
        <v-app-bar
          app
          clipped-left
          color="grey lighten-3"
          style="height: 75px"
          v-if="!isError"
        >
          <v-img 
            src="./assets/img/gisauto.png"
            max-height="60"
            max-width="140"
            :aspect-ratio="16/9"
            :width="width"
            right
            class="ml-4"
            alt="GIS AUTO Logo"
          >
          </v-img>
          <v-app-bar-nav-icon @click="drawer=!drawer" color="blue-grey"></v-app-bar-nav-icon>
          <h1 class="page-name font-weight-light">{{header}}</h1>
          <v-spacer></v-spacer>
          <v-img 
            src="./assets/img/trendmicro.png"
            max-height="50"
            max-width="190"
            :aspect-ratio="16/9"
            :width="width"
            right
          >
          </v-img>
        </v-app-bar>
    
        <v-navigation-drawer
          v-model="drawer"
          app
          clipped
          color="blue darken-4"
          width=100
          v-if="!isError"
        >
          <!-- nav-drawer menus -->
          <v-list
            dense
          >
            <v-list-item-group align="center">
              <v-list-item
                v-for="item in items"
                :key="item.title"
                :to="item.to"
                class="pa-3 pt-7 pb-7"
                @click="header=item.title"
              >
                 
                  <v-list-item-content>
                    <!-- <v-icon class="white--text menu-icon text-4">{{item.icon}}</v-icon> -->
                    <!-- <v-list-item-title class="white--text">{{item.title}}</v-list-item-title> -->
                    <v-tooltip right>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          class="white--text menu-icon text-4"
                          dark
                          v-bind="attrs"
                          v-on="on"
                        >
                          {{item.icon}}
                        </v-icon>
                      </template>
                      <span color="primary">{{item.title}}</span>
                    </v-tooltip>
                  </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>

          <!-- nav-drawer footer -->
          <template v-slot:append>
            <div class="v-navigation-footer-base">
           
              <v-card-actions class="d-flex-justify-space-between white--text ">
                    <v-speed-dial
                        fab
                        v-model="fab"
                        :direction="direction"
                        :open-on-hover="hover"
                        :transition="transition"
                      >
                        <template v-slot:activator>
                          <v-btn
                            v-model="fab"
                            color="blue darken-2"
                            dark
                            fab
                            class="ml-3 mt-3 mb-1"
                          >
                            <v-icon v-if="fab">
                              mdi-close
                            </v-icon>
                            <v-avatar color="primary" size="42" v-else>
                              <span class="white--text text-uppercase text-h6">{{ username.charAt(0) }}</span>
                            </v-avatar>
                          </v-btn>
                        </template>
                        <v-btn
                          dark
                          small
                          tile
                          color="light-blue"
                          to="/"
                          @click="logout()"
                        >
                          Logout
                        </v-btn>
                      </v-speed-dial>
                  </v-card-actions>
            </div>
          </template>

        </v-navigation-drawer>
    
        <!-- main content -->
        <v-main class="blue-grey darken-3" >
          <v-container>
              <router-view></router-view>
          </v-container>
        </v-main>

      </v-app>
    </v-app>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  data: () => ({
    drawer: null,
    header: "Automations",
    width: 0,
    username: $cookies.get("admin_user"),
    items: [
      { title: 'Automations',     icon: 'mdi-code-tags',                   to: '/automation-list' },
      { title: 'Dashboard',       icon: 'mdi-view-dashboard',              to: '/dashboard-service-usage' },
      { title: 'Access Groups',   icon: 'mdi-account-group',               to: '/access-group-list' },
      { title: 'Automation Logs', icon: 'mdi-format-list-bulleted-square', to: '/automation-system-log' },
    ],
    attrs: '',
    on: '',
    url: process.env.VUE_APP_API_URL,
    direction: 'top',
      fab: false,
      fling: false,
      hover: false,
      tabs: null,
      top: false,
      right: true,
      bottom: true,
      left: false,
      transition: 'slide-x-reverse-transition',
  }),
  created() {
    this.$root.$refs.App = this;
    this.tmlogo          = localStorage.getItem("tmlogo")
  },
  computed: {
    isAutomation() {
      return this.$route.name === "automation-list";
    },
    isError() {
      return this.$route.name === "404";
    },
  },
  methods: {
    validateSession() {
      var self = this;
      axios
        .get("/get_user_session")
        .then(function(response) {
          if (response.status == 200) {
            // console.log("Logged In");
          } else if (response.status == 401) {
            self.logout();
            // console.log(response);
          }
        })
        .catch(function(error) {
          self.logout();
          // console.log(error);
        });
    },
    logout() {
      // console.log(this.$session.id());
      this.$session.destroy();
      localStorage.removeItem("vue-session-key");
      window.location.reload();
      this.$cookies.remove("admin_user")
      axios
        .post("/logout")
        .then(function(response) {
          if (response.status == 200) {
            // console.log("Success");
            this.$router.push('/');
          } else {
            console.log(response.data);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  },
  props: {
    source: String
  },
}
</script>

<style>
  body {
    font-family: 'Roboto', sans-serif;
  }
  
  .v-main__wrap{
    background-color: #EEEEEE;
  }

  .menu-icon{
    font-size: 35px !important;
  }

  .v-navigation-footer-base{
    background-color: #384355 !important;
  }
/* 
  .v-navigation-drawer{
    width: 200px !important;
  } */

  /* .v-main{
    padding: 64px 0px 0px 190px !important;
  } */

  .v-navigation-footer-base{
    background-color: #384355 !important;
  }

  .v-toolbar__content{
    padding: 0px !important;
  }

  .v-list{
    padding: 0px !important;
  }

  .v-responsive__content{
    /* width: 153px !important; */
    width: 73px !important;
  }

  .page-name{
    color: #1976d2 !important;
    /* padding-left: 120px; */
  }

  v-data-table{
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }


</style>