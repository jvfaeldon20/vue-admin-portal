<template>
  <div id="automation">
    <div id="toolbar" class="d-flex justify-space-between">
      <v-btn
        class="menu-icon-button pa-6 ml-2"
        color="white--text rounded-0 elevation-0"
        left
        to="/automation-list"
      >
        Back
      </v-btn>
    </div>
    <div id="form-container" class="mt-9">
      <v-card class="card-item rounded-0 pa-3 ma-2 pb-0">
          <div class="rounded-0 ml-2 mr-2 pa-6">
              <h1 class="font-weight-light form-step-title">
                  Trigger History
                  <v-alert
                      dense
                      text
                      type="info"
                      class="rounded-0"
                  >
                  Listed below are the histories of manual triggers of <span class="menu-icon-button pa-1 white--text">{{$route.params.project_name}}</span>
                  </v-alert>
              </h1>
              <v-col class="d-flex" cols="12">
            <v-col cols="2">
              <v-text-field
                  :clearable="true"
                  clear-icon="mdi-close-circle-outline"
                  v-model="requestor"
                  type="string"
                  label="Requestor"
                ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                :clearable="true"
                clear-icon="mdi-close-circle-outline"
                v-model="reason"
                type="string"
                label="Trigger Reason"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-menu
                :close-on-content-click="true"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    label="Trigger Date"
                    append-icon="mdi-calendar"
                    readonly
                    v-model="date"
                    v-on="on"
                    :clearable="true"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  locale="en-in"
                  no-title
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="2"> </v-col>
            <v-col cols="2"></v-col>
            <v-col cols="2">
            </v-col>
          </v-col>
          <v-col cols="12">
             <v-data-table
                :headers="headers"
                :items="logs"
                :search="search"
                :loading="loading"
                :sort-by="sortBy.toLowerCase()"
                v-bind:options.sync="pagination"
                :items-per-page-options="[10, 20, 50]"
                class="rounded-0"
                light
              >
              </v-data-table>
          </v-col>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Automation-View-History',
   data: () => ({
    automation: "",
    readonly: false,

    // table
    requestor: "",
    reason: "",
    date: "",


    hover:"",
    logs: [],
      sortBy: "TRIGGER DATE",
    pagination: {
      sortby: "TRIGGER DATE",
      descending: true,
    },
    search: "",
    loading: false,
    automation_name: [],
    access_group: [],
    loadingModal:false,
    show_log_search:'',
    active_request:{},
    show_request_details:'',
    
    logDetails:'',
  }),
  computed: {
    headers() {
      return [
        {
          text: "REQUESTOR",
          value: "requestor",
          filter: (value) => {
            if (!this.requestor) return true;
            if (value.includes(this.requestor)) return this.requestor;
          },
          class: "font-weight-black",
        },
        {
          text: "TRIGGER REASON",
          value: "reason",
          filter: (value) => {
            if (!this.reason) return true;
            if (value.includes(this.reason)) return this.reason;
          },
          class: "font-weight-black",
        },
        {
          text: "TRIGGER DATE",
          value: "date",
          filter: (value) => {
            if (!this.date) return true;
            if (value.includes(this.date)) return this.date;
          },
          align: "center",
          class: "font-weight-black",
        },
      ];
    },
  },
  beforeMount(){
    this.loading= true
  },
  mounted() {
    let project_key = {project_key: this.$route.params.project_key}
    this.fetchTriggerHistory(project_key).then((response)=>{
      this.loading = false
      let request_result = response.data.result
        request_result.forEach((resp) => {
            this.logs.push({
              requestor: resp.trigger_requestor,
              reason: resp.trigger_request_status,
              date: resp.trigger_request_date,
            });
        });
    })  
  },
  methods: {
    ...mapActions(['fetchTriggerHistory']),
  },
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

#form-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
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
  background-color: #234899 !important;
}

.menu-action{
  color: #234899;
  font-size: 16px;
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

.form-step-title{
    color: #234899;
}

div >>> table > tbody > tr:hover {
  background: #B3E5FC !important;
}
</style>