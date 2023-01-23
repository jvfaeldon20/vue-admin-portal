<template>
  <div id="automation-log" class="mt-5">
    <div id="cards-container">
      <v-card class="card-item rounded-0 pa-3 ma-2 pb-0">
        <v-col class="d-flex" cols="12">
          <v-col cols="2">
            <v-select
              id="month"
              :disabled="loading"
              clearable
              clear-icon="mdi-close-circle-outline"
              v-model="month"
              label="Month"
              :items="monthitems"
              item-text="monthName"
              item-value="monthNumber"
              @change="filterMonth"
            ></v-select>
          </v-col>
          <v-col cols="2">
             <v-select
              id="username"
              :disabled="loading"
              clearable
              v-model="username"
              label="Username"
              :items="usernameitems"
            ></v-select>
          </v-col>
          <v-col cols="2"></v-col>
          <v-col cols="2"></v-col>
          <v-col cols="2"></v-col>
          <v-col cols="2">
          </v-col>

        </v-col>
        <v-col class="d-flex" cols="12">
          <v-col cols="12">
             <v-data-table
                :headers="headers"
                :items="usageCollectionList"
                :search="search"
                :items-per-page-options="[10, 20, 50]"
                :loading="loading"
                class="rounded-0"
                light
              >
                <template v-slot:item.category="{ item }">
                  <v-chip :color="getColor(item.name)" dark>{{
                    item.name
                  }}</v-chip>
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
  name: "Dashboard-User-Usage-List",
  data: () => ({
    username: '',
    usernameitems: [],
    access_group: [],
    access_group_name: "",
    active_request: null,
    automation_name: [],
    automation_status: [],
    global_search: "",
    loading: true,
    loadingModal: false,
    logs: [],
    logDetails: [],
    log_sequence_finished: "",
    month: "",
    log_sequence_start: "",
    log_sequence_reference_id: "",
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
    usageCollectionList: [],
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
  }),
  created() {
    this.$root.$refs.SysList = this;
  },
  computed: {
    headers() {
        return [
          {
            text: "User Name",
            value: "username",
            filter: (value) => {
              if (!this.username) return true;
              if (value.includes(this.username))
                return this.username;
            },
            align: "center",
            class: "font-weight-black",
          },
          {
            text: "Log Search",
            value: "log_search",
            align: "center",
            class: "font-weight-black",
          },
          {
            text: "Manual Trigger",
            value: "manual_trigger",
            align: "center",
            class: "font-weight-black",
          },
          {
            text: "Request",
            value: "request",
            align: "center",
            class: "font-weight-black",
          }
        ];
      },
    
  },
  mounted() {
    this.getUsageCollectionData();

    
  },
  methods: {
    ...mapActions(['filterUserListData','fetchUserListData']),
    getColor(status) {
      if      (status == "done")    return "#6fbd35";
      else if (status == "failed")  return "#F24C4F";
      else if (status == "delayed") return "#F57D3C";
      else return "#03a9f4";
    },
    getUsageCollectionData() {
      this.username = []
      this.loading  = true
      
      this.fetchUserListData().then((response) => {
        const arr = response.data.user_usage_count
          let b = arr.map( i => [i.category, i.username] )
          let newArr = new Array

          b.forEach( j => {
              let trigger_name = j[0][0].name
              let trigger_count = j[0][0].total
              
              if ( trigger_name == 'manual trigger' ) {
                  newArr.push( 
                      {
                          'username': j[1],
                          'manual_trigger': trigger_count,
                          'log_search': 0,
                          'request': 0,
                          'color':'#6fbd35',
                      } 
                  )

              }

              if ( trigger_name == 'log search' ) {
                newArr.push( 
                      {
                          'username': j[1],
                          'manual_trigger': 0,
                          'log_search': trigger_count,
                          'request': 0,
                          'color':'#F24C4F',
                      } 
                  )
              }

              if ( trigger_name == 'log view' ) {
                newArr.push( 
                      {
                          'username': j[1],
                          'manual_trigger': 0,
                          'log_search': 0,
                          'request': trigger_count,
                          'color':'',
                      } 
                  )
              }

              this.usernameitems.push(j[1])

          } )

          this.usageCollectionList = newArr
          this.loading = false
      }).catch(function(error) {
          console.log(error);
      })
    },
    filterMonth() {
      let selected_month = this.month
      this.loading = true

      if( selected_month == null ){
        this.getUsageCollectionData()
      }
      else
      {
        this.filterUserListData({month: selected_month}).then((response)=>{
            const arr  = response.data.user_usage_count
            let b      = arr.map( i => [i.category, i.username] )
            let newArr = new Array

            this.usernameitems = []
            b.forEach( j => {
                let trigger_name  = j[0][0].name
                let trigger_count = j[0][0].total
                this.usernameitems.push(j[1])
                
                if(trigger_name == 'manual trigger') {
                    newArr.push({
                            'username': j[1],
                            'manual_trigger': trigger_count,
                            'log_search': 0,
                            'request': 0,
                            'color':'#6fbd35',
                        } 
                    )
                }

                if(trigger_name == 'log search'){
                  newArr.push({
                            'username': j[1],
                            'manual_trigger': 0,
                            'log_search': trigger_count,
                            'request': 0,
                            'color':'#F24C4F',
                        } 
                    )
                }

                if(trigger_name == 'log view'){
                  newArr.push({
                            'username': j[1],
                            'manual_trigger': 0,
                            'log_search': 0,
                            'request': trigger_count,
                            'color':'',
                        } 
                    )
                }
            })

            this.usageCollectionList = newArr
            this.loading = false
        })
      }
      
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

tbody{
    border: 0px !important;
}


div >>> table > tbody > tr:hover {
  background: #B3E5FC !important;
}

.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr > th{
  color:rgba(0, 0, 0, 0.6);
}
</style>
