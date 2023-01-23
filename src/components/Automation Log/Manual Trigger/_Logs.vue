<template>
  <div id="automation-log">
    <div id="toolbar" class="d-flex justify-space-between">
      <v-btn
        class="menu-icon-button pa-6 ml-2 block"
        color="white--text rounded-0 elevation-0"
        left
        to="/automation-system-log"
      >
        <v-icon class="mr-2">mdi-format-list-bulleted-square</v-icon>
        System Logs
      </v-btn>
      <div width="600">
      </div>
    </div>
    <div id="cards-container">
      <v-card class="card-item rounded-0 pa-3 ma-2 pb-0">
        <v-col class="d-flex" cols="12">
          <v-col cols="2">
            <v-select
              id="automation"
              :clearable="true"
              clear-icon="mdi-close-circle-outline"
              v-model="automation"
              :items="automation_name"
              label="Automation"
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-select
              id="requestor"
              :clearable="true"
              clear-icon="mdi-close-circle-outline"
              v-model="username"
              :items="user_name"
              label="Requestor"
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-text-field
              id="triggerReason"
              :clearable="true"
              clear-icon="mdi-close-circle-outline"
              v-model="message"
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
          <v-col cols="2">
            <v-select
              id="accessGroup"
              :clearable="true"
              clear-icon="mdi-close-circle-outline"
              v-model="group"
              :items="access_group"
              label="Access Group"
            ></v-select>
          </v-col>
          <v-col cols="2">
          </v-col>
        </v-col>
        <v-col class="d-flex" cols="12">
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
        </v-col>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: "Automation-Log-List",
  data: () => ({
    automation: "",
    readonly: false,
    username: "",
    message: "",
    date: "",
    group: "",
    hover:"",
    logs: [],
    sortBy: "TRIGGER DATE",
    pagination: {
      sortby: "TRIGGER DATE",
      descending: true,
    },
    search: "",
    loading: true,
    automation_name: [],
    user_name: [],
    access_group: [],
    loadingModal:false,
    show_log_search:'',
    active_request:{},
    show_request_details:'',
    
    logDetails:'',
  }),
  created() {
    this.$root.$refs.SysList = this;
  },
  computed: {
    ...mapGetters(["limitedManualLogList"]),
    headers() {
      return [
        {
          text: "AUTOMATION",
          value: "automation",
          filter: (value) => {
            if (!this.automation) return true;
            return value == this.automation;
          },
          class: "font-weight-black",
        },
        {
          text: "REQUESTOR",
          value: "username",
          filter: (value) => {
            if (!this.username) return true;
            if (value.includes(this.username)) return this.username;
          },
          class: "font-weight-black",
        },
        {
          text: "TRIGGER REASON",
          value: "message",
          filter: (value) => {
            if (!this.message) return true;
            if (value.includes(this.message)) return this.message;
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
        {
          text: "ACCESS GROUP",
          value: "group",
          filter: (value) => {
            if (!this.group) return true;
            return value == this.group;
          },
          class: "font-weight-black",
        },
      ];
    },
  },
  mounted() {
    this.fetchManualLogs().then((log)=>{
        this.logs = this.limitedManualLogList;

        this.limitedManualLogList.map( e => {
          this.automation_name.push(e.automation)
          this.access_group.push(e.group)
          this.user_name.push(e.username)
        } )

        
        this.loading = false;
        this.automation_name.sort();
        this.access_group.sort();
    })

  },
  methods: {
    ...mapActions(["fetchManualLogs"]),
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

div >>> table > tbody > tr:hover {
  background: #B3E5FC !important;
}
</style>
