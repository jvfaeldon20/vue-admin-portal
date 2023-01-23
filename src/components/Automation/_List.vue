<template>
  <div id="automation">
    <v-overlay :value="overlay">
        <v-progress-circular
          :size="loaderSize"
          :width="loaderWidth"
          color="white"
          indeterminate
        ></v-progress-circular>
    </v-overlay>
    <div id="toolbar" class="d-flex justify-space-between">
      <v-btn
        class="menu-icon-button pa-6 ml-2 block"
        color="white--text rounded-0 elevation-0"
        left
        to="/automation-add"
      >
      <v-icon class="text-h5 pr-2">mdi-plus</v-icon>
        New Automation
      </v-btn>
      <div width="600">
        <v-text-field
          id="searchAutomation"
          prepend-inner-icon="mdi-magnify"
          v-model="search"
          label="Search"
          right
          clearable
          class="mr-2"
        ></v-text-field>
      </div>
    </div>
    <div>
      <v-data-iterator
        :items="allAutomationList"
        :search="search"
        :items-per-page.sync="itemsPerPage"
        :page.sync="page"
        hide-default-footer
      >

      <template v-slot:default="props">
        <div id="cards-container">
            <v-card
               v-for="item in props.items" :key="item.project_key" class="card-item rounded-0 pa-3 ma-2 pb-0"
            >
              <v-hover v-slot="{ hover }">
                <v-img :aspect-ratio="16 / 9" :src="menuCardImage(item.project_type)">
                  <v-expand-transition>
                    <v-container
                      v-if="hover"
                      class="d-flex fade-transition grey darken-4 v-card--reveal display-3 white--text"
                      style="height: 100%;"
                    >
                      <v-card-text>
                        <v-container>
                          <v-icon class="white--text mr-2"
                            >mdi-account-outline</v-icon
                          >
                          {{ item.project_owner }}  
                        </v-container>
                        <v-container>
                          <v-icon class="white--text mr-2">mdi-timer-outline</v-icon>
                          {{ item.project_processing_time }} sec. 
                        </v-container>
                        <v-container>
                          <v-icon class="white--text mr-2"
                            >mdi-account-group-outline</v-icon
                          >
                          {{ item.project_access_group_name }} 
                        </v-container>
                      </v-card-text>
                    </v-container>
                  </v-expand-transition>
                </v-img>
              </v-hover>
              <v-card-text class="pt-6" style="position: relative;">
                <v-btn
                  absolute
                  :color="checkTriggerColor(item.project_fqdn)"
                  :disabled="!item.project_fqdn"
                  class="white--text"
                  fab
                  right
                  top
                  v-on:click="showRun(item)"
                >
                  <v-icon class="text-h4">{{ selectIcon(item.project_type) }}</v-icon>
                </v-btn> 
                <v-spacer></v-spacer>
                <h3 class="font-weight-light menu-title mb-2 mt-3">
                  {{ item.project_name }} 
                </h3>
                <div class="font-weight-light text-h7 mb-2">
                  #API/{{item.project_type}} 
                </div>
                <v-spacer></v-spacer>
                  <v-card-actions class="pt-0 pb-0 d-flex-justify-space-between">
                    <AutomationDetails 
                      :project_name               ="item.project_name"
                      :project_owner              ="item.project_owner"
                      :project_access_group_name  ="item.project_access_group_name"
                      :project_type               ="item.project_type"
                      :project_description        ="item.project_description"
                      :project_processing_time    ="item.project_processing_time"
                      :project_jarvis_integrated  ="item.project_jarvis_integrated"
                      :project_integration_date   ="item.project_integration_date"
                      :project_fqdn               ="item.project_fqdn"
                    />
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="pl-0" color="light-blue" rounded
                        v-bind="attrs"
                        v-on="on"
                        text
                      >
                      </v-btn>
                    </template>
                    <v-row align="center" justify="end">
                      <v-menu
                        top
                        offset-y
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ma-2"
                            dark
                            v-bind="attrs"
                            v-on="on"
                            text
                            icon
                          >
                            <v-icon color="light-blue">
                              mdi-dots-vertical
                            </v-icon>
                          </v-btn>
                        </template>
                        <v-list class="pa-0 rounded-0">
                          <v-list-item :to='{name:"Automation-Edit", params:{project_name:item.project_name}}'>
                            <v-list-item-title>Edit</v-list-item-title>
                          </v-list-item>
                          <v-list-item :to='{name:"Automation-Generate-Token",params:{project_key:item.project_key}}'>
                            <v-list-item-title>Generate Token</v-list-item-title>
                          </v-list-item>
                          <v-list-item :to='{name:"Automation-Modify-Form",params:{project_key:item.project_key}}'>
                            <v-list-item-title>Modify Form</v-list-item-title>
                          </v-list-item>
                          <v-list-item :to='{name:"Automation-View-History",params:{project_key:item.project_key,project_name:item.project_name}}'>
                            <v-list-item-title>View History</v-list-item-title>
                          </v-list-item>
                          <AutomationDelete :project_key="item.project_key" :project_name="item.project_name" />
                        </v-list>
                      </v-menu>
                    </v-row>
                  </v-card-actions>
              </v-card-text>
            </v-card>
        </div>
      </template>
      
      <template v-slot:footer>
        <v-row
          class="mt-2 pa-6"
          align="center"
          justify="center"
        >
          <span class="grey--text">Items per page</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                text
                color="primary"
                class="ml-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span
            class="mr-4
            grey--text"
          >
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn
            fab
            dark
            color="blue darken-3"
            class="mr-1"
            @click="formerPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn
            fab
            dark
            color="blue darken-3"
            class="ml-1"
            @click="nextPage"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>

      </v-data-iterator>
      <Run v-model="run" v-bind:automation="active_listForms"></Run>
      <LoadingModal v-model="loading" v-bind:loading="loading"></LoadingModal>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import AutomationDetails        from './dialogs/_Automation-Details'
import LoadingModal             from '../Shared/Loading'
import Run                      from './_Run'
import AutomationDelete         from './dialogs/_Automation-Delete'

export default {
  name:"Automation-List",
  data(){
    return {
      search: '',
      active_request: null,
      active_listForms: null,
      loading: false,
      run: '',
      dialog:false,
      loaderSize: 0,
      loaderWidth: 0,
      overlay: false,
      timeout: -1,
      itemsPerPageArray: [8, 16, 32],
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 8,
    }
  },
  components:{
    AutomationDetails,
    LoadingModal,
    Run,
    AutomationDelete
  },
  computed: {
    ...mapGetters(['allAutomationList']),
    numberOfPages () {
        return Math.ceil(this.allAutomationList.length / this.itemsPerPage)
      },
      filteredKeys () {
        return this.keys.filter(key => key !== 'Name')
      },
    },
  methods: {
    ...mapActions(['fetchAutomation','getFormObjects','addDashboardLog']),
    menuCardImage(projectType) {
      if (projectType == "cronjob"){
        return "automation pic/cronjob.png";
      }else if (projectType == "logview"){
        return "automation pic/logs.png";
      } else if (projectType == "webservice"){
        return "automation pic/webservice.png";
      }
    },
    selectIcon(projectType) {
      if (projectType == "cronjob") {
        return "mdi-play";
      } else if (projectType == "logview") {
        return "mdi-format-list-bulleted";
      } else if (projectType == "webservice") {
        return "mdi-web";
      }
    },
    showRun(item) {
      this.active_request = item;
      var admin_user = this.$cookies.get("admin_user");
      if (item.project_type == "webservice") {
        window.open(item.project_fqdn, "_blank");
        let request_data = {
          user_name: admin_user,
          message: "WEBSERVICE || SERVICE: " + item.project_name,
          category: "manual trigger",
        };
        this.addDashboardLog(request_data);
      } else if (item.project_type == "logview"){
        let request_data = {
          user_name: admin_user,
          message: "LOGVIEW || SERVICE: " + item.project_name,
          category: "manual trigger",
        };
        this.addDashboardLog(request_data);
        this.getListCreateForm(item);
      } else {
        let request_data = {
          user_name: admin_user,
          message: "API/CRONJOB || SERVICE: " + item.project_name,
          category: "manual trigger",
        };
        this.addDashboardLog(request_data)
        this.getListCreateForm(item)
      }
    },
    getListCreateForm(item) {
      let admin_user = this.$cookies.get("admin_user")
      this.loading = true
      let request_data = {
        project_key: item.project_key,
        user_name: admin_user,
      }

      this.getFormObjects(request_data).then((response)=>{
        let form_obj = response.data.result;
          this.active_listForms = {
            project_key: item.project_key,
            project_name: item.project_name,
            project_type: item.project_type,
            user_name: admin_user,
            form_obj: form_obj,
          }

          this.loading = false;
          this.run = true;
      })
    },
    nextPage () {
        if (this.page <= ( this.allAutomationList.length / this.itemsPerPage )) 
          this.page += 1
    },
    formerPage () {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage (number) {
      this.itemsPerPage = number
    },
    deleteItem(item){
      console.log(item)
    },
    checkTriggerColor(item){
      let btnColor = "grey"
      if(item){
        btnColor = "menu-icon-button"
      }
      return btnColor
    }
  },
  mounted() {
    if ( this.allAutomationList && this.allAutomationList.length > 0 ) {
      this.loaderSize = 0;
      this.loaderWidth = 0;
      this.overlay = false;
      return;
    };
    this.fetchAutomation().then(()=>{
      this.loaderSize = 0;
      this.loaderWidth = 0;
      this.overlay = false;
    })
  },
  beforeMount() {
    this.loaderSize = 80
    this.loaderWidth = 9
    this.overlay = true
  }
}
</script>

<style scoped>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}

#cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  grid-gap: 1em;
  margin: 5px 0px 0px 15px;
}

#toolbar{
  margin: 15px 0px 0px 15px;
}

.menu-item-hover {
  background-color: #384355;
}

.menu-icon-button {
  background-color: #6fbd35 !important;
}

.menu-title {
  color: #234899;
  font-size: 25px;
}

.menu-action{
  color: #234899;
  font-size: 16px;
}

.menu-details{
  color: #459CC9;
}

.v-btn__content {
  padding-left: 0px;
}

.v-card__actions {
  padding-left: 0px;
}

.v-btn__content{
  text-transform: unset !important;
  color: #234899;
}


.v-progress-circular {
  margin: 1rem;
}
</style>