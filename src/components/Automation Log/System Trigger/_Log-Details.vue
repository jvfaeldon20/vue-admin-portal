<template>
  <div id="log-details">
    <div id="toolbar" class="d-flex justify-space-between">
      <v-btn
        class="blue darken-4 pa-6 ml-2"
        color="white--text rounded-0 elevation-0"
        left
        to="/automation-system-log"
      >
        Back
      </v-btn>
      <div width="600">
        <v-text-field
          prepend-inner-icon="mdi-magnify"
          v-model="search"
          label="Search"
          right
          clearable
          class="mr-2"
        ></v-text-field>
      </div>
    </div>
    <div id="form-container" class="mt-9">
       <v-card class="card-item rounded-0 pa-3 ma-2 pb-0">
         <div class="rounded-0 ml-2 mr-2 pa-6">
           <div id="toolbar" class="d-flex justify-space-between ml-0 mt-0"></div>
          <h1 class="font-weight-light form-step-title">
            Log Details
                <v-alert
                    dense
                    text
                    type="info"
                    class="rounded-0"
                >Listed below are the logs under <span class="primary pa-1 white--text">{{$route.params.project_name}}</span>
                </v-alert>
            </h1>
          <v-data-table
            :headers="headers"
            :items="log_details"
            :loading="loading"
            :search="search"
            class="rounded-0"
            v-bind:options.sync="pagination"
            :items-per-page-options="[10, 20, 50]"
            light
          ></v-data-table>
         </div>
       </v-card>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Automation-System-Log-Detail',
  data() {
    return {
      headers: [
        {
          text: "LOG MESSAGE",
          value: "log_message",
          align: "left",
          class: "font-weight-black",
        },
        {
          text: "LOG STATUS",
          value: "log_status",
          align: "center",
          class: "font-weight-black",
        },
        {
          text: "LOG DATE",
          value: "log_datetime",
          align: "left",
          class: "font-weight-black",
        },
      ],
      log_details:[],
      loading:false,
      pagination: {
        sortby: "LOG DATE",
        descending: true,
      },
      search:'',
    }
  },
  methods: {
   ...mapActions(['fetchSystemLogDetails','addLogToDashboard']),
  },
  beforeMount(){
    this.loading = true
  },
  mounted(){
    let log_sequence_id = this.$route.params.log_sequence_id
    this.fetchSystemLogDetails(log_sequence_id).then((response)=>{
      this.log_details = response.data["result"]
      this.loading = false
    })
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

.menu-icon-button {
  background-color: #6fbd35 !important;
}


div >>> table > tbody > tr:hover {
  background: #B3E5FC !important;
}
</style>