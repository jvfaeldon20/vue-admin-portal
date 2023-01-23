<template>
  <div id="automation-log">
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
        to="/automation-manual-log"
      >
      <v-icon class="mr-2">mdi-format-list-bulleted-square</v-icon>
        Manual Logs
      </v-btn>
      <div width="800">
        <v-text-field
          id="autoLogSysTriggerGlobalSearch"
          prepend-outer-icon="mdi-folder-search-outline"
          v-model="global_search"
          label="Global Search"
          right
          clearable
          v-on:keyup.enter="globalSearch"
        >
          <template v-slot:prepend>
            <v-tooltip
              bottom
              color="primary"
            >
              <template v-slot:activator="{ on }">
                <v-icon v-on="on" color="primary">
                  mdi-help-circle-outline
                </v-icon>
              </template>
              To search globally, please input a keyword and press "<strong>Enter</strong>"
            </v-tooltip>
          </template>
        </v-text-field>
      </div>
    </div>
    <div id="cards-container">
      <v-card class="card-item rounded-0 pa-3 ma-2 pb-0">
        <v-col class="d-flex" cols="12">
          <v-col cols="2">
            <v-select
              id="status"
              :clearable="true"
              clear-icon="mdi-close-circle-outline"
              v-model="log_sequence_status"
              :items="automation_status"
              label="Status"
            ></v-select>
          </v-col>
          <v-col cols="2">
             <v-select
              id="projectname"
              :clearable="true"
              clear-icon="mdi-close-circle-outline"
              v-model="project_name"
              :items="automation_name"
              label="Project Name"
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-menu
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  label="Date Start"
                  append-icon="mdi-calendar"
                  readonly
                  v-model="log_sequence_start"
                  v-on="on"
                  :clearable="true"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="log_sequence_start"
                locale="en-in"
                no-title
                class="calendar-hover"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="2">
            <v-menu
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  label="Date End"
                  append-icon="mdi-calendar"
                  readonly
                  v-model="log_sequence_finished"
                  v-on="on"
                  :clearable="true"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="log_sequence_finished"
                locale="en-in"
                no-title
                class="calendar-hover"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="2">
            <v-text-field
              id="referenceid"
              :clearable="true"
              clear-icon="mdi-close-circle-outline"
              v-model="log_sequence_reference_id"
              type="string"
              label="Reference ID"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-select
              id="accessgroupname"
              :clearable="true"
              clear-icon="mdi-close-circle-outline"
              v-model="access_group_name"
              :items="access_group"
              label="Access Group"
            ></v-select>
          </v-col>
        </v-col>
        <v-col class="d-flex" cols="12">
          
          <v-col cols="2"></v-col>
          <v-col cols="2"></v-col>
          <v-col cols="2"></v-col>
          <v-col cols="2"></v-col>
          <v-col cols="4" align="right">
            <v-btn
              color="primary"
              class="pa-6 white--text rounded-0 mr-2"
              :disabled="loading"
              @click="clearFilter"
            >
              <v-icon class="mr-2">mdi-filter-remove-outline</v-icon>Clear Filters
            </v-btn>
            <v-btn
              class="pa-6 white--text rounded-0 menu-icon-button"
              :disabled="loading"
              @click="downloadData"
            >
              <v-icon class="mr-2">mdi-download-outline</v-icon>Download CSV
            </v-btn>
          </v-col>
        </v-col>
        <v-col class="d-flex" cols="12">
          <v-col cols="12">
             <v-data-table
                :headers="headers"
                :items="logs"
                :search="search"
                v-bind:options.sync="pagination"
                :items-per-page-options="[10, 20, 50]"
                class="rounded-0 .data-logs"
                light
              >
                <template v-slot:item.log_sequence_status="{ item }">
                  <v-chip :color="getColor(item.log_sequence_status)" dark>{{
                    item.log_sequence_status
                  }}</v-chip>
                </template>
                <template v-slot:item.messages="{ item }">
                  <v-btn :to='{name:"Automation-System-Log-Detail",params:{log_sequence_id:item.log_sequence_id, project_name:item.project_name}}' @click="addLogData(item.project_name)"  text color="blue">View</v-btn>
                </template>
              </v-data-table>
              <GlobalLogSearch
                v-model="show_log_search"
                v-bind:logDetails="logDetails"
              ></GlobalLogSearch>
              <LoadingModal
                v-model="loadingModal"
                v-bind:loading="loadingModal"
              ></LoadingModal>
          </v-col>
        </v-col>
      </v-card>
    </div>
  </div>
</template>

<script>
import GlobalLogSearch    from "./_Log-Global-Search"
import LoadingModal from "@/components/Shared/Loading"
import downloadCsv  from "download-csv" 
import { mapActions, mapGetters } from 'vuex'

export default {
  name: "Automation-Log-System-List",
  components: {
    LoadingModal,
    GlobalLogSearch,
  },
  data: () => ({
    value: 0,
    interval: {},
    loaderSize: 0,
    loaderWidth: 0,
    overlay: false,
    access_group: [],
    access_group_name: "",
    active_request: null,
    automation_name: [],
    automation_status: [],
    loading: true,
    loadingModal: false,
    logs: [],
    logDetails: [],
    log_sequence_finished: "",
    log_sequence_status: "",
    log_sequence_start: "",
    log_sequence_reference_id: "",
    pagination: {
      sortby: " DATE START",
      descending: true,
    },
    project_name: "",
    search: "",
    show_log_search: false,
    status_color: [
      {
        text: "done",
        color: "success",
      },
      {
        text: "delayed",
        color: "gray",
      },
      {
        text: "failed",
        color: "error",
      },
    ],
    global_search: '',
  }),
  created() {
    this.$root.$refs.SysList = this;
  },
  computed: {
    ...mapGetters(['limitedSystemLogList','allSystemLogList']),
    headers() {
      return [
        {
          text: "AUTOMATION",
          value: "project_name",
          filter: (value) => {
            if (!this.project_name) return true;
            if (value.includes(this.project_name)) return this.project_name;
          },
          class: "font-weight-black",
        },
        {
          text: "STATUS",
          value: "log_sequence_status",
          filter: (value) => {
            if (!this.log_sequence_status) return true;
            if (value.includes(this.log_sequence_status))
              return this.log_sequence_status;
          },
          align: "center",
          class: "font-weight-black",
        },
        {
          text: "PROGRESS TIME",
          value: "log_sequence_prog_time",
          filter: (value) => {
            if (!this.log_sequence_prog_time) return true;
            if (value.includes(this.log_sequence_prog_time))
              return this.log_sequence_prog_time;
          },
          align: "center",
          class: "font-weight-black",
        },
        {
          text: "START DATE",
          value: "log_sequence_start",
          filter: (value) => {
            if (!this.log_sequence_start) return true;
            if (value.includes(this.log_sequence_start))
              return this.log_sequence_start;
          },
          align: "center",
          class: "font-weight-black",
        },
        {
          text: "END DATE",
          value: "log_sequence_finished",
          filter: (value) => {
            if (!this.log_sequence_finished) return true;
            if (value.includes(this.log_sequence_finished))
              return this.log_sequence_finished;
          },
          align: "center",
          class: "font-weight-black",
        },
        {
          text: "REFERENCE ID",
          value: "log_sequence_reference_id",
          filter: (value) => {
            if (!this.log_sequence_reference_id) return true;
            if (value.includes(this.log_sequence_reference_id))
              return this.log_sequence_reference_id;
          },
          class: "font-weight-black",
        },
        {
          text: "ACCESS GROUP",
          value: "access_group_name",
          filter: (value) => {
            if (!this.access_group_name) return true;
            if (value.includes(this.access_group_name))
              return this.access_group_name;
          },
          class: "font-weight-black",
        },
        {
          text: "LOGS",
          value: "messages",
          align: "center",
          class: "font-weight-black",
        },
      ];
    },
  },
  beforeMount() {
    this.loaderSize  = 80
    this.loaderWidth = 9
    this.overlay     = true
  },
  mounted(){
    if(this.logs && this.logs.length > 0){
      this.loaderSize  = 0;
      this.loaderWidth = 0;
      this.overlay     = false;
      return
    }

    this.fetchSystemLogs().then(()=>{
      this.logs = this.limitedSystemLogList;
      this.logs.forEach((log) =>{
        if(!this.automation_name.includes(log["project_name"])){
          this.automation_name.push(log["project_name"])
        }

        if(!this.automation_status.includes(log["log_sequence_status"])){
          this.automation_status.push(log["log_sequence_status"])
        }

        if(!this.access_group.includes(log["access_group_name"])){
          this.access_group.push(log["access_group_name"])
        }

        this.loaderSize  = 0;
        this.loaderWidth = 0;
        this.overlay     = false;
        this.loading     = false;
        this.automation_name.sort();
        this.automation_status.sort();
        this.access_group.sort();
      })
    })

  },
  methods: {
    ...mapActions(['fetchSystemLogs','fetchSystemGlobalLogs','addDashboardLog']),
    getColor(status) {
      if(status == "done") return "#6fbd35";
      else if (status == "failed")  return "#F24C4F";
      else if (status == "delayed") return "#F57D3C";
      else return "#03a9f4";
    },

    clearFilter(){
      this.log_sequence_status = ''
      this.project_name = ''
      this.log_sequence_start =''
      this.log_sequence_finished=''
      this.log_sequence_reference_id = ''
      this.access_group_name = ''
      this.fetchSystemLogs()
    },

    downloadData(){
        // for custom csv 
        // creatCsvFile(this.logs, this.headers)
        // downloadFile(csvfile,"System Logs.csv")
        // detectionClientType()
        downloadCsv(this.logs);
    },

    globalSearch(){
      this.overlay      = true
      this.loadingModal = true

      // 1.) get global logs 
      let request_data = {
        log_message: this.global_search,
      }
      this.fetchSystemGlobalLogs(request_data).then((response)=>{
        this.logDetails      = response.data.result
        this.show_log_search = true
        this.overlay         = false
        this.loadingModal    = false
      })
      
      // 2.) add dashboard log
      let admin_user = this.$cookies.get("admin_user")
      let dashboard_log = {
        user_name: admin_user,
        message: `LOG SEARCH || ${this.global_search}`,
        category: "log search"
      }

      this.addDashboardLog(dashboard_log)
    },

    // triggered when viewing log details
    addLogData(project_name){
      let admin_user = this.$cookies.get("admin_user")
      let dashboard_log = {
        user_name: admin_user,
        message: `LOG SEARCH || ${project_name}`,
        category: "log search"
      }
      this.addDashboardLog(dashboard_log)
    }

  },
};
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
  grid-gap: 1em;
  margin: 5px 0px 0px 15px;
}

#toolbar {
  margin: 15px 0px 0px 15px;
}

.menu-item-hover {
  background-color: #384355;
}

.menu-icon-button {
  background-color: #6fbd35 !important;
}

.menu-icon-button-text{
  color:#6fbd35 !important;
} 

.menu-title {
  color: #234899;
  font-size: 25px;
}

.menu-action {
  color: #234899;
  font-size: 16px;
}

.menu-details {
  color: #459cc9;
}

.v-btn__content {
  padding-left: 0px;
}

.v-card__actions {
  padding-left: 0px;
}

.v-btn__content {
  text-transform: unset !important;
  color: #234899;
}

.v-progress-circular {
  margin: 1rem;
}

div >>> table > tbody > tr:hover {
  background: #B3E5FC !important;
}

</style>
