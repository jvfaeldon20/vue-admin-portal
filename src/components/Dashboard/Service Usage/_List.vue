<template>
  <div id="automation-log" class="mt-5">
    <div id="cards-container">
      <v-card class="card-item rounded-0 pa-3 ma-2 pb-0">
        <v-col class="d-flex" cols="12">
          <v-col cols="2">
            <v-select
              id="month"
              clearable
              clear-icon="mdi-close-circle-outline"
              v-model="month"
              :items="monthitems"
              :disabled="loading"
              item-text="monthName"
              item-value="monthNumber"
              label="Month"
              @change="filterMonth"
            ></v-select>
          </v-col>
          <v-col cols="2">
             <v-select
              id="username"
              clearable
              clear-icon="mdi-close-circle-outline"
              v-model="username"
              :items="usernameitems"
              :disabled="loading"
              label="Username"
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-text-field
              id="messages"
              clearable
              :disabled="loading"
              clear-icon="mdi-close-circle-outline"
              v-model="message"
              type="string"
              label="Messages"
            ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-select
              id="category"
              clearable
              clear-icon="mdi-close-circle-outline"
              v-model="category"
              :items="categoryitems"
              :disabled="loading"
              label="Category"
            ></v-select>
          </v-col>
          <v-col cols="2">
            <v-btn
              id="clearFilters"
              color="primary"
              class="pa-6 white--text rounded-0"
              :disabled="loading"
              @click="clearFilter"
            >
              <v-icon class="mr-2">mdi-filter-remove-outline</v-icon>Clear Filters
            </v-btn>
          </v-col>
          <v-col cols="2">
          </v-col>
        </v-col>
        <v-col class="d-flex" cols="12">
          <v-col cols="12">
              <v-data-table
                id="serviceUsageList"
                :headers="headers"
                :items="serviceUsageList"
                :search="search"
                :loading="loading"
                v-bind:options.sync="pagination"
                :items-per-page-options="[10, 20, 50]"
                class="rounded-0"
                light
              >
                <template v-slot:item.category="{ item }">
                  <v-chip :color="getColor(item.category)" class="justify-center" dark >{{
                    item.category
                  }}</v-chip>
                </template>

                <template v-slot:item.message="{ item }" align="left">
                  {{item.message}}
                </template>
               
              </v-data-table>
          </v-col>
        </v-col>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: "Dashboard-Service-Usage-List",
  components: {
  },
  data: () => ({
    access_group: [],
    access_group_name: "",
    active_request: null,
    automation_name: [],
    automation_status: [],
    global_search: "",
    loading: false,
    loadingModal: false,
    logs: [],
    logDetails: [],
    log_sequence_finished: "",
    log_sequence_status: "",
    log_sequence_start: "",
    log_sequence_reference_id: "",
    serviceUsageList: [],
    pagination: {
      sortby: " DATE START",
      descending: true,
    },
    project_name: "",
    search: "",
    show_log_search: false,
    show_request_details: false,
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
    items: [],
    month: '',
    monthitems: [
      {
        monthName: 'January',
        monthNumber: 1,
      },
      {
        monthName: 'February',
        monthNumber: 2,
      },
      {
        monthName: 'March',
        monthNumber: 3,
      },
      {
        monthName: 'April',
        monthNumber: 4,
      },
      {
        monthName: 'May',
        monthNumber: 5,
      },
      {
        monthName: 'June',
        monthNumber: 6,
      },
      {
        monthName: 'July',
        monthNumber: 7,
      },
      {
        monthName: 'August',
        monthNumber: 8,
      },
      {
        monthName: 'September',
        monthNumber: 9,
      },
      {
        monthName: 'October',
        monthNumber: 10,
      },
      {
        monthName: 'November',
        monthNumber: 11,
      },
      {
        monthName: 'December',
        monthNumber: 12,
      },
    ],
    usernameitems: [],
    username: '',
    message: '',
    categoryitems: [],
    category: '',
  
  }),
  created() {
    this.$root.$refs.SysList = this;
  },
  computed: {
    headers() {
      return [
        {
          text: "Username",
          value: "username",
          filter: (value) => {
            if (!this.username) return true;
            if (value.includes(this.username)) return this.username;
          },
          class: "font-weight-black",
        },
        {
          text: "Message",
          value: "message",
          filter: (value) => {
            if (!this.message) return true;
            if (value.toLowerCase().includes(this.message.toLowerCase()))
              return this.message;
          },
          class: "font-weight-black",
        },
        {
          text: "Timestamp",
          value: "timestamp",
          filter: (value) => {
            if (!this.timestamp) return true;
            if (value.includes(this.timestamp))
              return this.timestamp;
          },
          align: "center",
          class: "font-weight-black",
        },
        {
          text: "Category",
          value: "category",
          filter: (value) => {
            if (!this.category) return true;
            if (value.includes(this.category))
              return this.category;
          },
          align: "center",
          class: "font-weight-black",
        }
      ];
    },
  },
  beforeMount(){
    this.loading = true
  },
  mounted() {
    this.fetchServiceUsageData().then((response)=>{
      this.serviceUsageList = response.data.logs
      this.usernameitems    = this.serviceUsageList.map( e => e.username )
      this.categoryitems    = this.serviceUsageList.map( e => e.category )
      this.loading          = false
    }).catch((error)=>{
      console.log(error)
    })
  },
  methods: {
    ...mapActions(['fetchServiceUsageData','filterServiceUsageData']),
    filterMonth() {
      let selected_month    = this.month
      this.loading          = true
      this.serviceUsageList = []

      if (!selected_month){
        this.fetchServiceUsageData()
      }else{
        this.filterServiceUsageData({month: selected_month}).then((response)=>{
            this.serviceUsageList = response.data.logs
            this.usernameitems    = this.serviceUsageList.map( e => e.username )
            this.categoryitems    = this.serviceUsageList.map( e => e.category )
            this.loading          = false
        }).catch(()=>{
           this.fetchServiceUsageData().then((response)=>{
              this.serviceUsageList = response.data.logs
              this.usernameitems    = this.serviceUsageList.map( e => e.username )
              this.categoryitems    = this.serviceUsageList.map( e => e.category )
              this.loading          = false
            })
        })
      }
    },
    clearFilter(){
      this.month     = ""
      this.username  = ""
      this.message   = ""
      this.category  = ""
      this.loading   = true
      this.fetchServiceUsageData().then((response)=>{
        this.serviceUsageList = response.data.logs
        this.usernameitems    = this.serviceUsageList.map( e => e.username )
        this.categoryitems    = this.serviceUsageList.map( e => e.category )
        this.loading          = false
      })
    },
    getColor(categoryName) {
      if(categoryName == "manual trigger")  return "#6fbd35";
      else if (categoryName == "log search")  return "#F24C4F";
      else if (categoryName == "request") return "#F57D3C";
      else return "#03a9f4";
    },
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

.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th{
  color:rgba(0, 0, 0, 0.6);
}
</style>
